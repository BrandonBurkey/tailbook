#!/usr/bin/env node
/**
 * Builds landing/index.html (single self-contained file) from
 * landing/src/index.html by inlining the rules engine in place of the
 * `/*@@TAILBOOK_ENGINE@@*\/` marker.
 *
 * The engine's ES-module syntax is stripped (import lines, `export` keywords)
 * and wrapped in an IIFE that exposes `window.TailBook`. The engine itself is
 * not otherwise modified, so the page runs exactly the tested code.
 *
 *   node scripts/build-landing.mjs           # write landing/index.html
 *   node scripts/build-landing.mjs --check   # exit 1 if index.html is stale
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MARKER = '/*@@TAILBOOK_ENGINE@@*/';

function stripModule(src) {
  return src
    .replace(/^import\s[^;]+;\s*$/gm, '')
    .replace(/^export\s+(?=(const|function|let|class)\b)/gm, '');
}

export function buildLanding() {
  const engine = readFileSync(join(root, 'engine/tailbook-engine.js'), 'utf8');
  const ics = readFileSync(join(root, 'engine/ics.js'), 'utf8');
  const template = readFileSync(join(root, 'landing/src/index.html'), 'utf8');
  if (!template.includes(MARKER)) throw new Error(`Marker ${MARKER} not found in landing/src/index.html`);
  const bundle = [
    '/* ---- Inlined from engine/tailbook-engine.js and engine/ics.js by scripts/build-landing.mjs. Do not edit here. ---- */',
    'window.TailBook = (() => {',
    stripModule(engine),
    stripModule(ics),
    '  return { ENGINE_VERSION, DISCLAIMER, THRESHOLDS, STATUS, STATUS_COLOR, SCOPE, RULES, evaluate, summarize, sortForBoard,',
    '    toICS, addDays, addMonthsClamped, endOfCalendarMonths, daysBetween, normalizeDate, parseDate, formatDate };',
    '})();',
    '/* ---- end of inlined engine ---- */',
  ].join('\n');
  if (/<\/script/i.test(bundle)) throw new Error('Engine source contains "</script", which would break the inline <script>.');
  return template.replace(MARKER, () => bundle);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = join(root, 'landing/index.html');
  const html = buildLanding();
  if (process.argv.includes('--check')) {
    const current = readFileSync(out, 'utf8');
    if (current !== html) {
      console.error('landing/index.html is stale: run `npm run build:landing`.');
      process.exit(1);
    }
    console.log('landing/index.html is up to date.');
  } else {
    writeFileSync(out, html);
    console.log(`wrote ${out} (${(html.length / 1024).toFixed(1)} KB)`);
  }
}
