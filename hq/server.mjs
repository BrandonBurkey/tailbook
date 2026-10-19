// TailBook HQ: a zero-dependency founder dashboard server (Node 22).
// Run: npm run hq  ->  http://localhost:4747
import http from 'node:http';
import { promises as fs, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { renderMarkdown, escapeHtml } from './lib/markdown.mjs';
import { parseCsv, buildMetrics, applyUpdates, HttpError } from './lib/csv.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const DEPARTMENTS = [
  { id: 'research', name: 'Research', folders: ['research'] },
  { id: 'validation', name: 'Growth & Validation', folders: ['validation'] },
  { id: 'design', name: 'UI/UX', folders: ['design'] },
  { id: 'marketing', name: 'Marketing', folders: ['marketing'] },
  { id: 'sales', name: 'Sales', folders: ['sales'] },
  { id: 'engine', name: 'Rules engine', folders: ['engine'] },
  { id: 'landing', name: 'Landing page', folders: ['landing'] },
  { id: 'ios', name: 'iOS app', folders: ['ios'] },
];
const DEPT_FOLDERS = new Set(DEPARTMENTS.flatMap((d) => d.folders));
const SKIP_DIRS = new Set(['node_modules', '.build', '.swiftpm', 'DerivedData', '__pycache__', 'xcuserdata', 'Pods']);
const TEXT_EXT = new Set(['.md', '.csv', '.txt', '.json', '.js', '.mjs', '.cjs', '.ts', '.swift', '.html', '.css', '.py', '.yml', '.yaml', '.sh', '.ics', '.svg', '.plist', '.strings', '.xml']);
const IMAGE_EXT = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' };
const MAX_DOC_BYTES = 2 * 1024 * 1024;
const MAX_BODY = 64 * 1024;

const STATIC = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/app.css': ['app.css', 'text/css; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/favicon.svg': ['favicon.svg', 'image/svg+xml'],
  '/theme.js': ['theme.js', 'text/javascript; charset=utf-8'],
};

// Resolve a user-supplied repo-relative path. Throws on anything that could
// escape the repo (.., absolute paths, NUL, dotfiles such as .git, symlinks out).
export function resolveRepoPath(root, rel) {
  if (typeof rel !== 'string' || !rel || rel.length > 512) throw new HttpError(400, 'Missing or invalid path.');
  if (rel.includes('\0') || rel.includes('\\')) throw new HttpError(400, 'Invalid path.');
  if (path.isAbsolute(rel) || /^[a-zA-Z]:/.test(rel)) throw new HttpError(403, 'Path must be inside the repo.');
  const parts = rel.split('/');
  if (parts.some((p) => p === '..' || p === '.' || p.startsWith('.'))) throw new HttpError(403, 'Path must be inside the repo.');
  const rootReal = realpathSync(root);
  const abs = path.resolve(rootReal, rel);
  if (!abs.startsWith(rootReal + path.sep)) throw new HttpError(403, 'Path must be inside the repo.');
  let real;
  try { real = realpathSync(abs); } catch { throw new HttpError(404, 'File not found.'); }
  if (!real.startsWith(rootReal + path.sep)) throw new HttpError(403, 'Path must be inside the repo.');
  const top = path.relative(rootReal, real).split(path.sep)[0];
  const isTopLevelDoc = !path.relative(rootReal, real).includes(path.sep);
  if (!DEPT_FOLDERS.has(top) && top !== 'hq' && !isTopLevelDoc) throw new HttpError(403, 'That folder isn’t part of the library.');
  return real;
}

async function walk(dir, rootReal, out, depth = 0) {
  if (depth > 8 || out.length > 2000) return;
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      await walk(abs, rootReal, out, depth + 1);
    } else if (e.isFile()) {
      const st = await fs.stat(abs);
      const ext = path.extname(e.name).toLowerCase();
      out.push({
        path: path.relative(rootReal, abs).split(path.sep).join('/'),
        name: e.name, ext, size: st.size, mtime: st.mtime.toISOString(),
        kind: ext === '.md' ? 'doc' : ext === '.csv' ? 'sheet' : IMAGE_EXT[ext] ? 'image' : TEXT_EXT.has(ext) ? 'code' : 'other',
      });
    }
  }
}

export async function listFiles(root) {
  const rootReal = realpathSync(root);
  const departments = [];
  for (const d of DEPARTMENTS) {
    const files = [];
    let exists = false;
    for (const f of d.folders) {
      const abs = path.join(rootReal, f);
      try { if ((await fs.stat(abs)).isDirectory()) exists = true; } catch { continue; }
      await walk(abs, rootReal, files);
    }
    files.sort((a, b) => a.path.localeCompare(b.path));
    const docs = files.filter((f) => f.kind === 'doc' || f.kind === 'sheet');
    departments.push({
      id: d.id, name: d.name, folders: d.folders, exists,
      count: files.length, docCount: docs.length,
      lastModified: files.reduce((m, f) => (f.mtime > m ? f.mtime : m), null),
      totalSize: files.reduce((s, f) => s + f.size, 0),
      files,
    });
  }
  return { generatedAt: new Date().toISOString(), departments };
}

function csvToHtml(text) {
  const rows = parseCsv(text).filter((r) => r.some((c) => c !== ''));
  if (!rows.length) return '<p class="muted">This sheet is empty.</p>';
  const [head, ...body] = rows;
  return '<div class="table-wrap sheet"><table><thead><tr>' +
    head.map((h) => `<th>${escapeHtml(h.replace(/_/g, ' '))}</th>`).join('') + '</tr></thead><tbody>' +
    body.map((r) => '<tr>' + head.map((_, i) => `<td>${escapeHtml(r[i] ?? '')}</td>`).join('') + '</tr>').join('') +
    '</tbody></table></div>';
}

export async function renderDoc(root, rel) {
  const abs = resolveRepoPath(root, rel);
  const st = await fs.stat(abs);
  if (!st.isFile()) throw new HttpError(404, 'File not found.');
  const ext = path.extname(abs).toLowerCase();
  const relOut = path.relative(realpathSync(root), abs).split(path.sep).join('/');
  const meta = { path: relOut, name: path.basename(abs), size: st.size, mtime: st.mtime.toISOString() };
  if (IMAGE_EXT[ext]) return { ...meta, kind: 'image', html: '', toc: [] };
  if (!TEXT_EXT.has(ext)) throw new HttpError(415, 'This file type can’t be previewed.');
  if (st.size > MAX_DOC_BYTES) throw new HttpError(413, 'This file is too large to preview.');
  const text = await fs.readFile(abs, 'utf8');
  if (ext === '.md') {
    const { html, toc } = renderMarkdown(text);
    const title = (text.match(/^#\s+(.+)$/m) || [])[1] || meta.name;
    return { ...meta, kind: 'doc', title: title.replace(/[*_`]/g, ''), html, toc, words: text.split(/\s+/).filter(Boolean).length };
  }
  if (ext === '.csv') return { ...meta, kind: 'sheet', title: meta.name, html: csvToHtml(text), toc: [] };
  return { ...meta, kind: 'code', title: meta.name, html: `<pre class="code"><code>${escapeHtml(text)}</code></pre>`, toc: [] };
}

export function gitLog(root, n = 20) {
  return new Promise((resolve) => {
    execFile('git', ['log', `-n${n}`, '--no-color', '--name-only', '--pretty=format:%x1e%H%x1f%an%x1f%aI%x1f%s%x1f%b%x1d'],
      { cwd: root, maxBuffer: 4 * 1024 * 1024, timeout: 5000 }, (err, stdout) => {
        if (err) return resolve({ available: false, commits: [], error: 'Git history isn’t available.' });
        const commits = stdout.split('\x1e').filter((c) => c.trim()).map((chunk) => {
          const [head, filesPart = ''] = chunk.split('\x1d');
          const [hash, author, date, subject, body] = head.split('\x1f');
          const files = filesPart.split('\n').map((s) => s.trim()).filter(Boolean);
          const areas = [...new Set(files.map((f) => f.split('/')[0]).filter((t) => DEPT_FOLDERS.has(t) || t === 'hq'))];
          return { hash, short: hash.slice(0, 7), author, date, subject, body: (body || '').trim().split('\n').filter((l) => !/^(Co-Authored-By|Claude-Session):/i.test(l)).join('\n').trim(), files: files.length, areas };
        });
        resolve({ available: true, commits });
      });
  });
}

// ---- status.json helpers ----------------------------------------------------

async function readJson(file) { return JSON.parse(await fs.readFile(file, 'utf8')); }

async function writeAtomic(file, text) {
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, text);
  await fs.rename(tmp, file);
}

let writeChain = Promise.resolve();
const serialize = (fn) => (writeChain = writeChain.then(fn, fn));

// ---- HTTP -------------------------------------------------------------------

function send(res, status, body, type = 'application/json; charset=utf-8', extra = {}) {
  const data = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    ...extra,
  });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new HttpError(413, 'Request too large.')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || 'null')); } catch { reject(new HttpError(400, 'Invalid JSON.')); }
    });
    req.on('error', reject);
  });
}

// Writes only from this page: JSON content type (forces a CORS preflight,
// which we never answer) and, when the browser sends one, a same-host Origin.
function checkWriteRequest(req) {
  if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) throw new HttpError(415, 'Send JSON.');
  const origin = req.headers.origin;
  if (origin) {
    let host;
    try { host = new URL(origin).host; } catch { throw new HttpError(403, 'Bad origin.'); }
    if (host !== req.headers.host) throw new HttpError(403, 'Cross-site requests are not allowed.');
  }
}

export function createHQServer({ root = path.resolve(HERE, '..') } = {}) {
  const statusFile = path.join(root, 'hq', 'status.json');
  const trackerFile = path.join(root, 'validation', '06-experiment-tracker.csv');
  const publicDir = path.join(HERE, 'public');

  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const p = url.pathname;

      if (req.method === 'GET' && STATIC[p]) {
        const [file, type] = STATIC[p];
        return send(res, 200, await fs.readFile(path.join(publicDir, file)), type);
      }
      if (req.method === 'GET' && p === '/api/status') return send(res, 200, await readJson(statusFile));
      if (req.method === 'GET' && p === '/api/metrics') {
        const text = await fs.readFile(trackerFile, 'utf8');
        const st = await fs.stat(trackerFile);
        return send(res, 200, { ...buildMetrics(text, url.searchParams.get('today') || localToday()), file: 'validation/06-experiment-tracker.csv', mtime: st.mtime.toISOString() });
      }
      if (req.method === 'GET' && p === '/api/files') return send(res, 200, await listFiles(root));
      if (req.method === 'GET' && p === '/api/doc') return send(res, 200, await renderDoc(root, url.searchParams.get('path')));
      if (req.method === 'GET' && p === '/api/raw') {
        // images only (screenshots in the library)
        const abs = resolveRepoPath(root, url.searchParams.get('path'));
        const type = IMAGE_EXT[path.extname(abs).toLowerCase()];
        if (!type) throw new HttpError(415, 'Only images can be opened raw.');
        return send(res, 200, await fs.readFile(abs), type);
      }
      if (req.method === 'GET' && p === '/api/git') return send(res, 200, await gitLog(root));
      if (req.method === 'GET' && p === '/api/health') return send(res, 200, { ok: true });

      if (req.method === 'POST' && p === '/api/todo') {
        checkWriteRequest(req);
        const body = await readBody(req);
        if (!body || typeof body.id !== 'string' || typeof body.done !== 'boolean') throw new HttpError(400, 'Send { id, done }.');
        const result = await serialize(async () => {
          const status = await readJson(statusFile);
          const todo = (status.todos || []).find((t) => t.id === body.id);
          if (!todo) throw new HttpError(404, 'That to-do no longer exists.');
          todo.done = body.done;
          if (body.done) todo.doneAt = new Date().toISOString(); else delete todo.doneAt;
          status.updatedAt = new Date().toISOString();
          await writeAtomic(statusFile, JSON.stringify(status, null, 2) + '\n');
          return todo;
        });
        return send(res, 200, { ok: true, todo: result });
      }
      if (req.method === 'POST' && p === '/api/metrics') {
        checkWriteRequest(req);
        const body = await readBody(req);
        const result = await serialize(async () => {
          const text = await fs.readFile(trackerFile, 'utf8');
          const { text: next, changed } = applyUpdates(text, body && body.updates);
          if (changed) await writeAtomic(trackerFile, next);
          return { changed };
        });
        return send(res, 200, { ok: true, ...result });
      }
      if (p.startsWith('/api/')) throw new HttpError(req.method === 'GET' || req.method === 'POST' ? 404 : 405, 'Not found.');
      if (req.method === 'GET') return send(res, 200, await fs.readFile(path.join(publicDir, 'index.html')), 'text/html; charset=utf-8');
      throw new HttpError(405, 'Method not allowed.');
    } catch (err) {
      const status = err instanceof HttpError ? err.status : err.code === 'ENOENT' ? 404 : 500;
      if (status === 500) console.error(err);
      send(res, status, { error: status === 404 && !(err instanceof HttpError) ? 'File not found.' : status === 500 ? 'Something went wrong on the HQ server.' : err.message });
    }
  });
}

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4747);
  const host = process.env.HQ_HOST || '127.0.0.1';
  createHQServer().listen(port, host, () => {
    console.log(`\n  TailBook HQ is running → http://localhost:${port}\n  (Press Ctrl+C to stop.)\n`);
  });
}
