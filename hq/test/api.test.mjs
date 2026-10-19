// HQ API tests. Run: npm run test:hq
// Each test run works on a throwaway copy of the repo files it needs.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHQServer } from '../server.mjs';
import { renderMarkdown } from '../lib/markdown.mjs';
import { parseCsv } from '../lib/csv.mjs';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
let root, server, base, outside;

before(async () => {
  root = mkdtempSync(path.join(tmpdir(), 'hq-test-'));
  outside = mkdtempSync(path.join(tmpdir(), 'hq-outside-'));
  writeFileSync(path.join(outside, 'secret.md'), '# secret');
  for (const d of ['validation', 'hq', 'research', '.git']) mkdirSync(path.join(root, d));
  copyFileSync(path.join(REPO, 'validation/06-experiment-tracker.csv'), path.join(root, 'validation/06-experiment-tracker.csv'));
  copyFileSync(path.join(REPO, 'hq/status.json'), path.join(root, 'hq/status.json'));
  writeFileSync(path.join(root, 'research/notes.md'), '# Notes\n\nHello <script>alert(1)</script> [x](javascript:alert(1))\n');
  writeFileSync(path.join(root, '.git/config'), '[core]');
  symlinkSync(path.join(outside, 'secret.md'), path.join(root, 'research/escape.md'));
  server = createHQServer({ root });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => {
  server.close();
  rmSync(root, { recursive: true, force: true });
  rmSync(outside, { recursive: true, force: true });
});

const get = (p) => fetch(base + p);
const postJson = (p, body, headers = {}) => fetch(base + p, {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
});
const trackerText = () => readFileSync(path.join(root, 'validation/06-experiment-tracker.csv'), 'utf8');

test('GET /api/doc renders a repo markdown file and escapes HTML', async () => {
  const res = await get('/api/doc?path=research/notes.md');
  assert.equal(res.status, 200);
  const doc = await res.json();
  assert.equal(doc.kind, 'doc');
  assert.match(doc.html, /&lt;script&gt;/);
  assert.doesNotMatch(doc.html, /<script/i);
  assert.doesNotMatch(doc.html, /javascript:/i);
});

test('GET /api/doc blocks path traversal and anything outside the library', async () => {
  const bad = [
    '../package.json', 'research/../../etc/passwd', '/etc/passwd', '%2e%2e/%2e%2e/etc/passwd',
    'research%2f..%2f..%2fetc%2fpasswd', '.git/config', 'research/escape.md', 'research\\..\\..\\x',
    'research/notes.md%00.png', '',
  ];
  for (const p of bad) {
    const res = await get(`/api/doc?path=${p}`);
    assert.ok([400, 403, 404].includes(res.status), `${p} -> ${res.status}`);
    const body = await res.json();
    assert.ok(body.error, p);
    assert.ok(!JSON.stringify(body).includes('secret'), p);
  }
});

test('GET /api/raw only serves images', async () => {
  assert.equal((await get('/api/raw?path=research/notes.md')).status, 415);
  assert.equal((await get('/api/raw?path=../x.png')).status, 403);
});

test('GET /api/metrics parses E1–E6 with targets', async () => {
  const m = await (await get('/api/metrics?today=2026-10-19')).json();
  assert.equal(m.currentWeek, 'W0');
  const ids = m.experiments.map((e) => e.id);
  for (const id of ['E1', 'E2', 'E3', 'E4', 'E5', 'E6']) assert.ok(ids.includes(id), id);
  const e1 = m.experiments.find((e) => e.id === 'E1');
  const main = e1.metrics.find((x) => x.key === e1.mainKey);
  assert.equal(main.metric, 'Snapshot requests');
  assert.deepEqual(main.pass, { op: '>=', value: 60, percent: false, text: '>=60 by 2026-11-15' });
  assert.equal(m.experiments.find((e) => e.id === 'E4').postBuildOnly, true);
});

test('POST /api/metrics updates only the actual-value columns', async () => {
  const before = parseCsv(trackerText());
  const res = await postJson('/api/metrics', { updates: [
    { row: 2, week: 'W0', experiment: 'E1', metric: 'Snapshot requests', actual_week: '7', actual_cumulative: '7' },
  ] });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).changed, 2);
  const after = parseCsv(trackerText());
  assert.equal(after.length, before.length);
  const h = before[0];
  for (let r = 0; r < before.length; r++) {
    for (let c = 0; c < h.length; c++) {
      if (r === 2 && (h[c] === 'actual_week' || h[c] === 'actual_cumulative')) continue;
      assert.equal(after[r][c], before[r][c], `row ${r} col ${h[c]} changed`);
    }
  }
  assert.equal(after[2][h.indexOf('actual_week')], '7');
  // CRLF line endings are preserved
  assert.ok(trackerText().includes('\r\n'));
  const m = await (await get('/api/metrics?today=2026-10-19')).json();
  const e1 = m.experiments.find((e) => e.id === 'E1');
  assert.equal(e1.metrics.find((x) => x.key === e1.mainKey).latest.value, 7);
});

test('POST /api/metrics rejects bad input and leaves the CSV untouched', async () => {
  const snapshot = trackerText();
  const row = { row: 2, week: 'W0', experiment: 'E1', metric: 'Snapshot requests' };
  const cases = [
    [{ updates: [{ ...row, actual_week: 'abc' }] }, 400],
    [{ updates: [{ ...row, actual_week: '=HYPERLINK("x")' }] }, 400],
    [{ updates: [{ ...row, actual_week: '-5' }] }, 400],
    [{ updates: [{ ...row, actual_week: '150%' }] }, 400],
    [{ updates: [{ ...row, actual_week: '1,"x\n' }] }, 400],
    [{ updates: [{ ...row, notes: 'hacked' }] }, 400],
    [{ updates: [{ ...row, pass_threshold: '>=1' }] }, 400],
    [{ updates: [{ ...row, metric: 'Something else', actual_week: '3' }] }, 409],
    [{ updates: [{ ...row, row: 9999, actual_week: '3' }] }, 400],
    [{ updates: [{ row: 82, week: 'POST-BUILD', experiment: 'E3', metric: 'Aha test (TestFlight)', actual_week: '3' }] }, null],
    [{ updates: [] }, 400],
    [{}, 400],
    [null, 400],
  ];
  for (const [body, status] of cases) {
    const res = await postJson('/api/metrics', body);
    if (status) assert.equal(res.status, status, JSON.stringify(body));
    else assert.ok(res.status >= 400, JSON.stringify(body));
  }
  assert.equal(trackerText(), snapshot);
});

test('write endpoints reject non-JSON and cross-site requests', async () => {
  const form = await fetch(`${base}/api/todo`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: '{"id":"deploy","done":true}' });
  assert.equal(form.status, 415);
  const cross = await postJson('/api/todo', { id: 'deploy', done: true }, { Origin: 'https://evil.example' });
  assert.equal(cross.status, 403);
  const status = JSON.parse(readFileSync(path.join(root, 'hq/status.json'), 'utf8'));
  assert.equal(status.todos.find((t) => t.id === 'deploy').done, false);
});

test('POST /api/todo persists to status.json', async () => {
  const res = await postJson('/api/todo', { id: 'deploy', done: true });
  assert.equal(res.status, 200);
  let status = JSON.parse(readFileSync(path.join(root, 'hq/status.json'), 'utf8'));
  assert.equal(status.todos.find((t) => t.id === 'deploy').done, true);
  assert.ok(status.todos.find((t) => t.id === 'deploy').doneAt);
  await postJson('/api/todo', { id: 'deploy', done: false });
  status = JSON.parse(readFileSync(path.join(root, 'hq/status.json'), 'utf8'));
  assert.equal(status.todos.find((t) => t.id === 'deploy').done, false);
  assert.equal((await postJson('/api/todo', { id: 'nope', done: true })).status, 404);
  assert.equal((await postJson('/api/todo', { id: 'deploy', done: 'yes' })).status, 400);
});

test('GET /api/files lists departments; /api/git degrades gracefully', async () => {
  const f = await (await get('/api/files')).json();
  const research = f.departments.find((d) => d.id === 'research');
  assert.ok(research.files.some((x) => x.path === 'research/notes.md'));
  assert.equal(f.departments.find((d) => d.id === 'sales').exists, false);
  const g = await (await get('/api/git')).json();
  assert.ok(Array.isArray(g.commits));
});

test('markdown renderer: tables, lists, code and links are safe', () => {
  const { html } = renderMarkdown('| a | b |\n|---|---|\n| <b>x</b> | `<i>` |\n\n- [x] done\n- item\n\n```\n<img src=x onerror=alert(1)>\n```\n\n[ok](https://example.com) [rel](./doc.md) [bad](data:text/html,x)');
  assert.match(html, /<table>/);
  assert.match(html, /&lt;b&gt;x&lt;\/b&gt;/);
  assert.match(html, /<code>&lt;i&gt;<\/code>/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /href="https:\/\/example.com" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /href="\.\/doc\.md" data-rel="1"/);
  assert.doesNotMatch(html, /data:text/);
  assert.doesNotMatch(html, /<img|<b>|<i>/);
});
