// Minimal, safe Markdown -> HTML renderer. Zero dependencies.
// Every piece of source text is HTML-escaped before any markup is added,
// so raw HTML in a document is shown as text, never executed.

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Only allow safe link targets. Relative links stay relative (the UI turns
// links to repo docs into in-app navigation).
function safeHref(raw) {
  const href = raw.trim();
  if (/^(https?:|mailto:)/i.test(href)) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return null; // javascript:, data:, etc.
  return href;
}

// Inline formatting on ALREADY-ESCAPED text.
function inline(escaped) {
  const codes = [];
  let s = escaped.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(`<code>${c}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  // links [text](href)
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (m, text, href) => {
    // href is escaped text; unescape &amp; for checking only
    const plain = href.replace(/&amp;/g, '&');
    const ok = safeHref(plain);
    if (ok == null) return text;
    const ext = /^(https?:|mailto:)/i.test(ok);
    return `<a href="${escapeHtml(ok)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ' data-rel="1"'}>${text}</a>`;
  });
  // bare URLs
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:!?])/g, (m, pre, url) =>
    `${pre}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w])_([^_\s][^_]*?)_(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[+i]);
  return s;
}

const fmt = (text) => inline(escapeHtml(text));

function slug(text) {
  return text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

function splitRow(line) {
  let l = line.trim();
  if (l.startsWith('|')) l = l.slice(1);
  if (l.endsWith('|') && !l.endsWith('\\|')) l = l.slice(0, -1);
  const cells = [];
  let cur = '';
  let inCode = false;
  for (let i = 0; i < l.length; i++) {
    const ch = l[i];
    if (ch === '\\' && l[i + 1] === '|') { cur += '|'; i++; continue; }
    if (ch === '`') inCode = !inCode;
    if (ch === '|' && !inCode) { cells.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

const isTableSep = (line) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);

export function renderMarkdown(src) {
  const lines = String(src).replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  const toc = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // fenced code
    const fence = line.match(/^\s*(```|~~~)\s*([\w+-]*)/);
    if (fence) {
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${escapeHtml(buf.join('\n'))}</code></pre>`);
      continue;
    }

    if (!line.trim()) { i++; continue; }

    // heading
    const h = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (h) {
      const level = h[1].length;
      const html = fmt(h[2]);
      const id = slug(h[2]);
      if (level <= 3) toc.push({ level, text: h[2].replace(/[*_`]/g, ''), id });
      out.push(`<h${level} id="${id}">${html}</h${level}>`);
      i++;
      continue;
    }

    // hr
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

    // table
    if (line.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const head = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) rows.push(splitRow(lines[i++]));
      out.push('<div class="table-wrap"><table><thead><tr>' +
        head.map((c) => `<th>${fmt(c)}</th>`).join('') + '</tr></thead><tbody>' +
        rows.map((r) => '<tr>' + head.map((_, k) => `<td>${fmt(r[k] ?? '')}</td>`).join('') + '</tr>').join('') +
        '</tbody></table></div>');
      continue;
    }

    // blockquote
    if (/^\s*>/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ''));
      out.push(`<blockquote>${renderMarkdown(buf.join('\n')).html}</blockquote>`);
      continue;
    }

    // lists
    if (/^\s*([-*+]|\d+[.)])\s+/.test(line)) {
      const { html, next } = renderList(lines, i);
      out.push(html);
      i = next;
      continue;
    }

    // paragraph
    const buf = [];
    while (
      i < lines.length && lines[i].trim() &&
      !/^(#{1,6})\s/.test(lines[i]) && !/^\s*(```|~~~)/.test(lines[i]) &&
      !/^\s*>/.test(lines[i]) && !/^\s*([-*+]|\d+[.)])\s+/.test(lines[i]) &&
      !(lines[i].includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1]))
    ) buf.push(lines[i++]);
    if (!buf.length) { // safety: never loop forever
      out.push(`<p>${fmt(lines[i])}</p>`);
      i++;
      continue;
    }
    out.push(`<p>${buf.map((b) => fmt(b.trim())).join(/  $/.test(buf[0]) ? '<br>' : ' ')}</p>`);
  }
  return { html: out.join('\n'), toc };
}

function indentOf(l) { return l.match(/^\s*/)[0].replace(/\t/g, '    ').length; }

function renderList(lines, start) {
  const base = indentOf(lines[start]);
  const ordered = /^\s*\d+[.)]\s/.test(lines[start]);
  const items = [];
  let i = start;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) {
      // blank line: continue the list only if the next line is still part of it
      const nxt = lines[i + 1];
      if (nxt && indentOf(nxt) >= base && /^\s*([-*+]|\d+[.)])\s+/.test(nxt)) { i++; continue; }
      if (nxt && indentOf(nxt) > base) { i++; continue; }
      break;
    }
    const ind = indentOf(l);
    const m = l.match(/^\s*([-*+]|\d+[.)])\s+(.*)$/);
    if (m && ind === base) {
      items.push({ text: m[2], children: [] });
      i++;
    } else if (ind > base && items.length) {
      if (m) {
        const sub = renderList(lines, i);
        items[items.length - 1].children.push(sub.html);
        i = sub.next;
      } else {
        items[items.length - 1].text += ' ' + l.trim();
        i++;
      }
    } else break;
  }
  const tag = ordered ? 'ol' : 'ul';
  const html = `<${tag}>` + items.map((it) => {
    const task = it.text.match(/^\[([ xX])\]\s+(.*)$/);
    const body = task
      ? `<span class="task ${task[1] === ' ' ? '' : 'is-done'}" aria-hidden="true"></span>${fmt(task[2])}`
      : fmt(it.text);
    return `<li${task ? ' class="task-item"' : ''}>${body}${it.children.join('')}</li>`;
  }).join('') + `</${tag}>`;
  return { html, next: i };
}
