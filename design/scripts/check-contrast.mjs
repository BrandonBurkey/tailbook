#!/usr/bin/env node
// Verifies TailBook color tokens (design/tokens.json):
//  1. WCAG 2.x contrast: body/status text >= 4.5:1, status lamps/icons (non-text UI) >= 3:1.
//  2. Color-vision deficiency: the three status fills stay distinguishable under simulated
//     protanopia, deuteranopia and tritanopia (Machado et al. 2009, severity 1.0), measured as
//     CIE76 delta-E in Lab. Status is ALSO carried by icon shape and a text label; this is a
//     second line of defense, not the only one.
//   node design/scripts/check-contrast.mjs        (exit 1 on any failure)
import { readFileSync } from 'node:fs';
const tokens = JSON.parse(readFileSync(new URL('../tokens.json', import.meta.url), 'utf8'));

const hex = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const unlin = (c) => { c = Math.min(1, Math.max(0, c)); return 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055); };
const lum = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const MACHADO = {
  protanopia:   [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritanopia:   [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};
const simulate = (h, m) => { const v = hex(h).map(lin); return m.map((row) => unlin(row[0] * v[0] + row[1] * v[1] + row[2] * v[2])); };
const toLab = ([r, g, b]) => {
  [r, g, b] = [r, g, b].map(lin);
  let x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, y = 0.2126 * r + 0.7152 * g + 0.0722 * b, z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  [x, y, z] = [x, y, z].map(f);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
};
const dE = (a, b) => Math.hypot(...toLab(a).map((v, i) => v - toLab(b)[i]));

let fails = 0;
const rows = [];
function check(mode, fg, bg, min, what) {
  const t = tokens[mode]; const r = ratio(t[fg], t[bg]); const ok = r >= min; if (!ok) fails++;
  rows.push(`${ok ? 'pass' : 'FAIL'}  ${mode.padEnd(5)}  ${(fg + ' on ' + bg).padEnd(30)} ${r.toFixed(2).padStart(5)}:1  (min ${min}, ${what})`);
}
for (const mode of ['light', 'dark']) {
  for (const bg of ['canvas', 'surface', 'surface2']) {
    check(mode, 'ink', bg, 7, 'AAA body');
    check(mode, 'ink2', bg, 4.5, 'AA text');
    check(mode, 'ink3', bg, 4.5, 'AA text');
    check(mode, 'accent', bg, 4.5, 'AA link text');
    for (const s of ['overdue', 'dueSoon', 'current', 'neutral']) {
      check(mode, s, bg, 4.5, 'AA status text');
      check(mode, s + 'Fill', bg, 3, 'UI icon/lamp 1.4.11');
    }
  }
  for (const s of ['overdue', 'dueSoon', 'current', 'neutral']) check(mode, s, s + 'Bg', 4.5, 'AA tag text on tint');
  check(mode, 'onAccent', 'accent', 4.5, 'AA button label');
  check(mode, 'line2', 'surface', 1.5, 'input border visible');
}
console.log(rows.join('\n'));

console.log('\nColor-vision simulation, CIE76 delta-E between status fills (min 20):');
for (const mode of ['light', 'dark']) {
  const t = tokens[mode];
  for (const [name, m] of Object.entries(MACHADO)) {
    const s = Object.fromEntries(['overdueFill', 'dueSoonFill', 'currentFill'].map((k) => [k, simulate(t[k], m)]));
    const pairs = [['overdueFill', 'currentFill'], ['overdueFill', 'dueSoonFill'], ['dueSoonFill', 'currentFill']];
    const out = pairs.map(([a, b]) => { const d = dE(s[a], s[b]); const ok = d >= 20; if (!ok) fails++; return `${ok ? '' : 'FAIL '}${a.replace('Fill', '')}/${b.replace('Fill', '')} ${d.toFixed(1)}`; });
    console.log(`  ${mode.padEnd(5)} ${name.padEnd(13)} ${out.join('   ')}`);
  }
}
console.log(fails ? `\n${fails} failure(s)` : '\nall color checks passed');
process.exit(fails ? 1 : 0);
