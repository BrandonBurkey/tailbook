#!/usr/bin/env node
/**
 * App Store screenshot mockups for TailBook (6.9" display, 1290×2796 portrait).
 *   node design/appstore-screenshots/render.mjs
 * Writes the HTML source to design/appstore-screenshots/src/ and PNGs next to this file.
 * The UI is a hand-built HTML/CSS reconstruction of the SwiftUI screens, using the colors in
 * design/tokens.json and the anatomy in design/DESIGN-SYSTEM.md. Board numbers come from the
 * real rules engine (engine/tailbook-engine.js) evaluated on 2026-10-19 for the sample aircraft.
 * Uses the globally installed Playwright + preinstalled Chromium (no `playwright install`).
 */
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { evaluate, sortForBoard, DISCLAIMER } from '../../engine/tailbook-engine.js';

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = join(here, 'src');
mkdirSync(srcDir, { recursive: true });
const tokens = JSON.parse(readFileSync(join(here, '..', 'tokens.json'), 'utf8'));

// ------------------------------------------------------------------ sample aircraft (engine)
const AS_OF = '2026-10-19';
const profile = {
  asOf: AS_OF,
  aircraft: { ifr: true, forHire: false, currentTach: 1250.4, avgHoursPerMonth: 8 },
  annual: { lastDone: '2026-03-15' },
  transponder: { lastDone: '2024-10-18' },
  pitotStatic: { lastDone: '2024-11-02' },
  eltInspection: { lastDone: '2026-03-15' },
  eltBattery: { expires: '2026-09' },
  vorCheck: { lastDone: '2026-10-01' },
  registration: { expires: '2029-06-30' },
  oilChange: { lastDoneTach: 1210, lastDoneDate: '2026-08-01', intervalHours: 50, intervalMonths: 4 },
  ads: [{ adNumber: '2020-18-04', intervalHours: 100, intervalCalendarMonths: 12, lastDoneTach: 1190, lastDoneDate: '2026-01-10' }],
};
const result = evaluate(profile);
const items = sortForBoard(result.items);
const S = result.summary;

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${MON[m - 1]} ${d}, ${y}`; };
const fmtShort = (iso) => { const [, m, d] = iso.split('-').map(Number); return `${MON[m - 1]} ${d}`; };
const shortCite = (c) => c.replace(' recommendation', '').replace(/^AD [\d-]+ \(14 CFR (§[\d.]+)\)$/, '14 CFR $1');

function rowModel(i) {
  let value = null, unit = null, detail = '', projected = false;
  if (i.status === 'not_applicable') detail = 'Not used for hire';
  else if (i.governedBy === 'hours' && i.hoursRemaining != null) {
    value = Math.abs(i.hoursRemaining).toFixed(1); unit = i.hoursRemaining < 0 ? 'hrs over' : 'hrs left';
    projected = !!i.projectedDate; detail = projected ? `About ${fmtShort(i.projectedDate)} at your pace` : '';
  } else if (i.daysRemaining != null) {
    value = String(Math.abs(i.daysRemaining));
    unit = i.daysRemaining < 0 ? 'days over' : i.daysRemaining === 1 ? 'day left' : 'days left';
    detail = i.daysRemaining < 0 ? `Expired after ${fmt(i.dueDate)}` : `Current through ${fmt(i.dueDate)}`;
  }
  return { name: i.name.replace('Altimeter & pitot-static', 'Pitot-static & altimeter').replace('Aircraft registration', 'Registration'), cite: shortCite(i.citation), status: i.status, value, unit, detail, projected };
}
const rows = items.map(rowModel);

// ------------------------------------------------------------------ glyphs (SF Symbol stand-ins)
const GLYPH = {
  overdue: (k) => `<svg viewBox="0 0 24 24"><path d="M7.6 1.8h8.8l5.8 5.8v8.8l-5.8 5.8H7.6l-5.8-5.8V7.6z" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/><path d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8" stroke="${k}" stroke-width="2.3" stroke-linecap="round"/></svg>`,
  due_soon: (k) => `<svg viewBox="0 0 24 24"><path d="M10.3 3.2a2 2 0 0 1 3.4 0l8.6 15.1a2 2 0 0 1-1.7 3H3.4a2 2 0 0 1-1.7-3z" fill="currentColor"/><path d="M12 8.6v5.6" stroke="${k}" stroke-width="2.3" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.35" fill="${k}"/></svg>`,
  ok: (k) => `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="currentColor"/><path d="M7.2 12.4l3.2 3.2 6.4-6.8" fill="none" stroke="${k}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  unknown: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9.6"/><path d="M9.4 9.4a2.7 2.7 0 1 1 3.8 2.5c-.8.4-1.2 1-1.2 1.8v.6"/><circle cx="12" cy="17" r=".6" fill="currentColor"/></svg>`,
  not_applicable: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9.6"/><path d="M7.8 12h8.4"/></svg>`,
};
const glyph = (status, cls = 'g') => `<span class="${cls} st-${status}">${GLYPH[status]('var(--knock)')}</span>`;
const TAG = { overdue: 'Overdue', due_soon: 'Due soon', ok: 'Current', not_applicable: 'N/A', unknown: 'Needs date' };

const I = { // line icons, 24 viewBox, stroke = currentColor
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  share: '<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M8 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2"/>',
  chevD: '<path d="m6 9 6 6 6-6"/>',
  chevL: '<path d="m15 5-7 7 7 7"/>',
  chevR: '<path d="m9 5 7 7-7 7"/>',
  board: '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="M7.5 8.5h1.5M7.5 12h1.5M7.5 15.5h1.5M11.5 8.5h5M11.5 12h5M11.5 15.5h5"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6z"/><path d="M12 8.5v4.5"/><circle cx="12" cy="16" r=".4"/>',
  clip: '<rect x="5" y="4.5" width="14" height="17" rx="2.5"/><path d="M9 4.5V3.8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.7M8.5 10h1M8.5 13.5h1M8.5 17h1M12 10h3.5M12 13.5h3.5M12 17h3.5"/>',
  vault: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><path d="M8 9h8M8 12h8M8 15h5"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19M9 7h6"/>',
  camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.3"/>',
  info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".5"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  gauge: '<path d="M4.6 17.5a8.5 8.5 0 1 1 14.8 0"/><path d="m12 13 3.5-4.5"/><circle cx="12" cy="13.2" r="1.3"/>',
  clock: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3 2"/>',
  trend: '<path d="M4 17l5-5 3.5 3.5L20 8"/><path d="M15 8h5v5"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L20 11.6l-8.9 8.9a2.1 2.1 0 0 1-3-3L17 8.6l-.3-.3a4 4 0 0 0-5-5z"/>',
  person2: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.2c3 .2 5 2.3 5 5.8"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  printer: '<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14h10v6.5H7z"/>',
};
const icon = (n, cls = 'ic', sw = 1.8) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

// ------------------------------------------------------------------ CSS
const vars = (t) => Object.entries(t).map(([k, v]) => `--${k}:${v};`).join('');
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1290px;height:2796px;overflow:hidden}
body{font-family:"Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased;font-feature-settings:"cv11","ss01";background:#0A111C;color:#E8EDF3}
.mono{font-family:"DejaVu Sans Mono",ui-monospace,monospace}
.num{font-feature-settings:"tnum","cv11"}
/* ---------- marketing canvas ---------- */
.stage{position:relative;width:1290px;height:2796px;overflow:hidden;
  background:radial-gradient(120% 60% at 50% 0%,#14243B 0%,#0C1626 45%,#080E17 100%)}
.stage::before{content:"";position:absolute;inset:0;
  background-image:linear-gradient(rgba(140,170,210,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(140,170,210,.06) 1px,transparent 1px);
  background-size:64px 64px;-webkit-mask-image:radial-gradient(ellipse 85% 40% at 50% 8%,#000 25%,transparent 80%)}
.stage::after{content:"";position:absolute;left:50%;top:1250px;width:1500px;height:1500px;transform:translateX(-50%);
  background:radial-gradient(circle,rgba(90,169,255,.16),transparent 60%);pointer-events:none}
.copy{position:absolute;left:96px;right:96px;top:128px;z-index:2}
.eyebrow{display:inline-flex;align-items:center;gap:18px;font-family:"DejaVu Sans Mono",monospace;font-size:30px;letter-spacing:.16em;text-transform:uppercase;color:#8EC3FF}
.eyebrow i{width:18px;height:18px;border-radius:5px;background:#5AA9FF;box-shadow:0 0 18px rgba(90,169,255,.8)}
h1{font-family:"Inter Display","Inter",sans-serif;font-weight:700;font-size:104px;line-height:1.04;letter-spacing:-.025em;margin-top:30px;color:#F3F6FA}
h1 em{font-style:normal;color:#7DBBFF}
.sub{font-size:42px;line-height:1.32;color:#AEB9C7;margin-top:28px;max-width:1060px;letter-spacing:-.005em}
.phone-wrap{position:absolute;left:141px;top:668px;width:1008px;height:2112px;z-index:2}
.phone{width:458px;height:960px;transform:scale(2.2);transform-origin:0 0;border-radius:72px;padding:13px;position:relative;
  background:linear-gradient(145deg,#4A525C 0%,#262B32 18%,#1A1E23 50%,#2D333B 85%,#5A626D 100%);
  box-shadow:0 0 0 1.2px #0B0D10 inset,0 0 0 2.4px #6B737D inset,0 40px 80px rgba(0,0,0,.55),0 8px 24px rgba(0,0,0,.4)}
.phone::before{content:"";position:absolute;left:-2.5px;top:180px;width:3px;height:62px;border-radius:2px;background:#3A4048}
.phone::after{content:"";position:absolute;right:-2.5px;top:220px;width:3px;height:96px;border-radius:2px;background:#3A4048}
.screen{position:relative;width:432px;height:934px;border-radius:60px;overflow:hidden;background:var(--canvas);color:var(--ink);
  box-shadow:0 0 0 3px #000}
.island{position:absolute;left:50%;top:11px;width:124px;height:36px;margin-left:-62px;background:#000;border-radius:20px;z-index:30}
.sbar{position:absolute;top:0;left:0;right:0;height:54px;display:flex;align-items:center;justify-content:space-between;padding:6px 34px 0 46px;z-index:20;font-weight:600;font-size:16.5px;color:var(--ink)}
.sbar .r{display:flex;gap:6px;align-items:center}
.sbar svg{height:12px;width:auto}
.homebar{position:absolute;bottom:8px;left:50%;width:140px;height:5px;margin-left:-70px;border-radius:3px;background:var(--ink);opacity:.9;z-index:40}
.light{${vars(tokens.light)}--knock:#FFFFFF}
.dark{${vars(tokens.dark)}--knock:#121922}
/* ---------- app UI (points) ---------- */
.app{position:absolute;inset:0;padding-top:54px;font-size:17px;line-height:1.3}
.ic{width:22px;height:22px;display:block}
.g{display:inline-flex;width:22px;height:22px;flex:none}
.g svg{width:100%;height:100%}
.st-overdue{color:var(--overdueFill)} .st-due_soon{color:var(--dueSoonFill)} .st-ok{color:var(--currentFill)}
.st-unknown,.st-not_applicable{color:var(--neutralFill)}
.nav{display:flex;align-items:flex-end;justify-content:space-between;padding:6px 16px 10px}
.nav .t{font-family:"DejaVu Sans Mono",monospace;font-weight:700;font-size:28px;letter-spacing:-.01em;display:flex;align-items:center;gap:6px}
.nav .t .ic{width:18px;height:18px;color:var(--ink3);margin-top:4px}
.nav .s{font-size:13px;color:var(--ink3);margin-top:2px}
.nav .btns{display:flex;gap:10px}
.cbtn{width:36px;height:36px;border-radius:18px;background:var(--surface);border:1px solid var(--line);display:grid;place-items:center;color:var(--accent)}
.cbtn .ic{width:19px;height:19px}
.pad{padding:0 16px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden}
.light .card.hero{box-shadow:0 4px 14px rgba(16,24,40,.05)}
.ov{font-family:"DejaVu Sans Mono",monospace;font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3)}
.hero-main{display:flex;gap:14px;padding:16px 16px 14px}
.hero-main .g{width:44px;height:44px}
.answer{font-family:"Inter Display","Inter";font-size:34px;font-weight:700;letter-spacing:-.02em;line-height:1.05;margin-top:3px}
.headline{font-size:14.5px;color:var(--ink2);margin-top:5px;line-height:1.35;text-wrap:pretty}
.logbtn{height:36px;padding:0 14px 0 10px;border-radius:18px;background:var(--accent);color:var(--onAccent);display:flex;align-items:center;gap:5px;font-weight:600;font-size:15px}
.logbtn .ic{width:17px;height:17px}
.strip{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 16px;background:var(--surface2);border-top:1px solid var(--line)}
.strip .v{font-size:15px;font-weight:600;margin-top:2px}
.counts{display:flex;gap:10px;font-size:15px;color:var(--ink2);font-weight:500}
.counts span{display:inline-flex;align-items:center;gap:4px}
.counts .g{width:15px;height:15px}
.disc{font-size:11.5px;line-height:1.4;color:var(--ink3);padding:9px 16px 11px;border-top:1px solid var(--line)}
.sech{font-family:"DejaVu Sans Mono",monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);padding:16px 20px 7px}
.row{display:flex;gap:12px;padding:11px 16px;align-items:flex-start;position:relative}
.row+.row::before{content:"";position:absolute;top:0;left:50px;right:0;height:1px;background:var(--line)}
.row .g{margin-top:1px}
.row .lb{flex:1;min-width:0}
.row .nm{font-weight:600;font-size:16.5px;letter-spacing:-.01em}
.row .ct{font-family:"DejaVu Sans Mono",monospace;font-size:11px;color:var(--ink3);margin-top:2px}
.row .dt{font-size:13.5px;color:var(--ink2);margin-top:3px}
.row .vb{text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:2px}
.row .vl{font-size:20px;font-weight:650;font-feature-settings:"tnum";line-height:1.1;letter-spacing:-.01em}
.row .un{font-family:"DejaVu Sans Mono",monospace;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink3)}
.tag{font-family:"DejaVu Sans Mono",monospace;font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:2px 5px;border-radius:5px;margin-top:3px;white-space:nowrap}
.tag.st-overdue{color:var(--overdue);background:var(--overdueBg)} .tag.st-due_soon{color:var(--dueSoon);background:var(--dueSoonBg)}
.tag.st-ok{color:var(--current);background:var(--currentBg)} .tag.st-not_applicable,.tag.st-unknown{color:var(--neutral);background:var(--neutralBg)}
.vl.st-overdue{color:var(--overdue)} .vl.st-due_soon{color:var(--dueSoon)} .vl.st-ok{color:var(--ink)}
.na .nm{color:var(--ink3)}
.tabbar{position:absolute;left:0;right:0;bottom:0;height:86px;display:flex;justify-content:space-around;padding:8px 6px 0;
  background:var(--surface);border-top:1px solid var(--line);z-index:15}
.tab{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10.5px;font-weight:500;color:var(--ink3);width:72px}
.tab .ic{width:25px;height:25px}
.tab.on{color:var(--accent)}
.fab{position:absolute;right:16px;bottom:100px;height:52px;padding:0 20px 0 16px;border-radius:26px;background:var(--accent);color:var(--onAccent);
  display:flex;align-items:center;gap:8px;font-weight:600;font-size:16.5px;box-shadow:0 8px 24px rgba(31,95,209,.35);z-index:16}
.fab .ic{width:20px;height:20px}
.btn{height:52px;border-radius:12px;background:var(--accent);color:var(--onAccent);display:flex;align-items:center;justify-content:center;gap:8px;font-weight:600;font-size:17px}
.btn2{height:50px;border-radius:12px;background:var(--surface);border:1px solid var(--line2);color:var(--accent);display:flex;align-items:center;justify-content:center;gap:8px;font-weight:600;font-size:16px}
.navbar{display:flex;align-items:center;justify-content:space-between;height:44px;padding:0 10px;font-size:17px}
.navbar .back{display:flex;align-items:center;gap:2px;color:var(--accent)}
.navbar .back .ic{width:24px;height:24px}
.navbar .mid{font-weight:600}
.navbar .act{color:var(--accent);display:flex;gap:16px;padding-right:6px}
.kv{display:flex;justify-content:space-between;align-items:baseline;padding:11px 16px;font-size:15.5px;position:relative}
.kv+.kv::before{content:"";position:absolute;top:0;left:16px;right:0;height:1px;background:var(--line)}
.kv .k{color:var(--ink2)} .kv .v{font-weight:600;font-feature-settings:"tnum"}
.note{display:flex;gap:10px;font-size:13.5px;line-height:1.4;color:var(--ink2);padding:12px 14px;background:var(--accentSoft);border-radius:12px}
.note .ic{width:18px;height:18px;color:var(--accent);flex:none;margin-top:1px}
`;

const sbar = `<div class="sbar"><span>9:41</span><span class="r">
  <svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg>
  <svg viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.4 6.8a6.5 6.5 0 0 1 9.2 0l-1.4 1.4a4.5 4.5 0 0 0-6.4 0zM1 4.4a9.9 9.9 0 0 1 14 0l-1.4 1.4a7.9 7.9 0 0 0-11.2 0z" fill="currentColor"/></svg>
  <svg viewBox="0 0 27 12"><rect x=".5" y=".5" width="23" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor"/><path d="M25 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity=".5"/></svg>
</span></div>`;

const phone = (mode, inner) => `<div class="phone-wrap"><div class="phone"><div class="screen ${mode}"><div class="island"></div>${sbar}${inner}<div class="homebar"></div></div></div></div>`;
const page = (title, { eyebrow, h1, sub }, phoneHtml) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}</style></head>
<body><div class="stage"><div class="copy"><div class="eyebrow"><i></i>${eyebrow}</div><h1>${h1}</h1><p class="sub">${sub}</p></div>${phoneHtml}</div></body></html>`;

const rowHtml = (r) => `<div class="row ${r.status === 'not_applicable' ? 'na' : ''}">${glyph(r.status)}
  <div class="lb"><div class="nm">${r.name}</div><div class="ct">${r.cite}</div>${r.detail ? `<div class="dt">${r.detail}</div>` : ''}</div>
  <div class="vb">${r.value ? `<div class="vl st-${r.status}">${r.value}</div><div class="un">${r.unit}${r.projected ? ' · proj.' : ''}</div>` : ''}<span class="tag st-${r.status}">${TAG[r.status]}</span></div></div>`;

const tabbar = (on) => `<div class="tabbar">${[['board', 'Board'], ['shield', 'ADs'], ['clip', 'Squawks'], ['vault', 'Logbooks'], ['doc', 'Reports']]
  .map(([ic, l]) => `<div class="tab ${l === on ? 'on' : ''}">${icon(ic)}<span>${l}</span></div>`).join('')}</div>`;

const ANSWER = { current: 'Yes', limited: 'Not all', overdue: 'No', incomplete: "Can't tell yet" };
const SUM_GLYPH = { current: 'ok', limited: 'due_soon', overdue: 'overdue', incomplete: 'unknown' };
const SUM_TEXT = { current: 'var(--current)', limited: 'var(--dueSoon)', overdue: 'var(--overdue)', incomplete: 'var(--ink2)' };
const SHORT_DISC = 'TailBook organizes the dates you enter. Your A&amp;P/IA and the pilot in command determine airworthiness.';

function heroCard(s = S) {
  return `<div class="card hero">
    <div class="hero-main">${glyph(SUM_GLYPH[s.status])}
      <div><div class="ov">All items current?</div><div class="answer" style="color:${SUM_TEXT[s.status]}">${ANSWER[s.status]}</div>
      <div class="headline">${s.headline.replace(/(\d) /g, '$1&nbsp;')}</div></div></div>
    <div class="strip"><div><div class="ov">Next due</div><div class="v">${s.nextDue.name} in ${s.nextDue.daysRemaining} days</div></div>
      <div class="counts"><span>${glyph('overdue')}${s.counts.overdue}</span><span>${glyph('due_soon')}${s.counts.due_soon}</span><span>${glyph('ok')}${s.counts.ok}</span></div></div>
    <div class="disc">${SHORT_DISC}</div></div>`;
}

// ------------------------------------------------------------------ the six screens
const shots = [];

// 1. Board
{
  const attention = rows.filter((r) => r.status === 'overdue' || r.status === 'due_soon');
  const current = rows.filter((r) => r.status === 'ok').slice(0, 3);
  const inner = `<div class="app">
    <div class="nav"><div><div class="t">N731TB ${icon('chevD', 'ic', 2.4)}</div><div class="s">Beechcraft A36 · IFR · Oct 19, 2026</div></div>
      <div class="btns"><div class="cbtn">${icon('gear')}</div><div class="logbtn">${icon('plus', 'ic', 2.6)}Log flight</div></div></div>
    <div class="pad">${heroCard()}</div>
    <div class="sech">Needs attention</div>
    <div class="pad"><div class="card">${attention.map(rowHtml).join('')}</div></div>
    <div class="sech">Current</div>
    <div class="pad"><div class="card">${current.map(rowHtml).join('')}</div></div>
    ${tabbar('Board')}</div>`;
  shots.push({ file: '01-status-board', title: 'Status board', copy: { eyebrow: 'Status board', h1: 'All items current?<br><em>Know in two seconds.</em>', sub: 'Inspections, checks and recurring ADs on one red, yellow and green board, worst first.' }, mode: 'light', inner });
}

// 2. Item detail: transponder, every item cites its FAR
{
  const t = items.find((i) => i.id === 'transponder');
  const inner = `<div class="app">
    <div class="navbar"><span class="back">${icon('chevL', 'ic', 2.4)}Board</span><span class="mid">Transponder</span><span class="act">${icon('share')}</span></div>
    <div class="pad" style="margin-top:6px">
      <div class="card" style="padding:18px 16px 16px">
        <div style="display:flex;align-items:center;gap:10px">${glyph('due_soon')}<span class="tag st-due_soon" style="font-size:11px;margin:0">Due soon</span></div>
        <div style="display:flex;align-items:baseline;gap:8px;margin-top:12px"><span class="answer num" style="font-size:48px;color:var(--dueSoon)">${t.daysRemaining}</span><span class="ov" style="font-size:13px">days left</span></div>
        <div style="font-size:16px;color:var(--ink2);margin-top:4px">Current through <b style="color:var(--ink)">${fmt(t.dueDate)}</b></div>
      </div>
    </div>
    <div class="sech">The rule</div>
    <div class="pad"><div class="card" style="padding:14px 16px">
      <div style="display:flex;align-items:center;gap:8px;color:var(--accent)">${icon('book', 'ic')}<span class="mono" style="font-size:13.5px;font-weight:600">14 CFR §91.413</span></div>
      <p style="font-size:14.5px;line-height:1.45;color:var(--ink2);margin-top:8px;border-left:2px solid var(--line2);padding-left:10px">No person may use an ATC transponder unless, within the preceding <b style="color:var(--ink)">24 calendar months</b>, it has been tested and inspected and found to comply with appendix F of part 43.</p>
      <div style="font-size:14px;color:var(--accent);font-weight:600;margin-top:10px">Read on eCFR ›</div>
    </div></div>
    <div class="sech">How we calculated this</div>
    <div class="pad"><div class="card">
      <div class="kv"><span class="k">Last test</span><span class="v">Oct 18, 2024</span></div>
      <div class="kv"><span class="k">Interval</span><span class="v">24 calendar months</span></div>
      <div class="kv"><span class="k">Runs to end of month</span><span class="v">Oct 31, 2026</span></div>
    </div></div>
    <div class="sech">Proof</div>
    <div class="pad"><div class="card" style="display:flex;gap:12px;align-items:center;padding:12px 16px">
      <div style="width:54px;height:70px;border-radius:6px;background:linear-gradient(180deg,#F4EBD7,#E9DDC2);border:1px solid #D9CCAF;position:relative;overflow:hidden;flex:none">
        ${[14, 22, 30, 38, 46, 54].map((y) => `<i style="position:absolute;left:7px;right:${y % 16 ? 9 : 16}px;top:${y}px;height:1.5px;background:#7A6E5A;opacity:.55"></i>`).join('')}</div>
      <div style="flex:1"><div style="font-weight:600;font-size:15.5px">Avionics logbook, p. 14</div><div style="font-size:13px;color:var(--ink3);margin-top:2px">Scanned Oct 2, 2026 · text searchable</div></div>
      <span style="color:var(--ink3)">${icon('chevR', 'ic')}</span></div></div>
    <div class="sech">History</div>
    <div class="pad"><div class="card">
      <div class="kv"><span class="k">Oct 18, 2024</span><span class="v" style="font-weight:500">Tested, appendix F</span></div>
      <div class="kv"><span class="k">Oct 3, 2022</span><span class="v" style="font-weight:500">Tested, appendix F</span></div>
    </div></div>
    <div class="pad" style="position:absolute;left:0;right:0;bottom:0;padding-top:28px;padding-bottom:34px;background:linear-gradient(to bottom,transparent,var(--canvas) 34%)"><div class="btn">${icon('check', 'ic', 2.4)}Log done</div></div>
  </div>`;
  shots.push({ file: '02-far-citations', title: 'FAR citations', copy: { eyebrow: 'Show your work', h1: 'Every item cites<br><em>its FAR.</em>', sub: 'Tap any item for the rule, the math and the logbook page behind it.' }, mode: 'light', inner });
}

// 3. Calendar-month math (onboarding step 3, dark)
{
  // March 2026 starts on a Sunday.
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const cells = days.map((d) => `<span class="${d === 15 ? 'sel' : d === 31 ? 'eom' : ''}">${d}</span>`).join('');
  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const inner = `<style>
    .cal{display:grid;grid-template-columns:repeat(7,1fr);row-gap:4px;text-align:center;font-size:19px;font-feature-settings:"tnum";margin-top:8px}
    .cal b{font-size:12px;font-weight:600;color:var(--ink3);padding:6px 0}
    .cal span{height:42px;display:grid;place-items:center;border-radius:21px;margin:0 3px}
    .cal .sel{background:var(--accent);color:var(--onAccent);font-weight:700}
    .cal .eom{box-shadow:0 0 0 1.5px var(--line2) inset}
    .tl{display:grid;grid-template-columns:repeat(13,1fr);gap:3px;margin-top:14px}
    .tl i{height:26px;border-radius:5px;background:var(--currentFill);opacity:.85}
    .tl i:first-child{background:var(--accent);opacity:1}
    .tl i:last-child{background:var(--currentFill);opacity:1;box-shadow:0 0 0 2px var(--surface),0 0 0 3.5px var(--currentFill)}
    .tlm{display:grid;grid-template-columns:repeat(13,1fr);gap:3px;margin-top:6px;font-family:"DejaVu Sans Mono";font-size:8.5px;color:var(--ink3);text-align:center}
    .prog{display:flex;gap:6px}.prog i{flex:1;height:4px;border-radius:2px;background:var(--line2)}.prog i.on{background:var(--accent)}
  </style><div class="app">
    <div class="navbar"><span class="back">${icon('chevL', 'ic', 2.4)}Back</span><span class="mid" style="font-size:15px;color:var(--ink3);font-weight:500">Step 3 of 5</span><span class="act" style="font-weight:400">Skip</span></div>
    <div class="pad" style="margin-top:4px"><div class="prog"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></div></div>
    <div class="pad" style="margin-top:22px">
      <div style="font-family:'Inter Display';font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.12">When was your last<br>annual inspection?</div>
      <div class="mono" style="font-size:12.5px;color:var(--ink3);margin-top:8px">14 CFR §91.409(a) · 12 calendar months</div>
    </div>
    <div class="pad" style="margin-top:18px"><div class="card" style="padding:14px 12px 10px">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0 6px"><span style="font-weight:650;font-size:17px">March 2026 <span style="color:var(--accent)">›</span></span>
        <span style="display:flex;gap:22px;color:var(--accent)">${icon('chevL', 'ic', 2.4)}${icon('chevR', 'ic', 2.4)}</span></div>
      <div class="cal">${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => `<b>${d}</b>`).join('')}${cells}</div>
    </div></div>
    <div class="pad" style="margin-top:14px"><div class="card" style="padding:16px">
      <div style="display:flex;gap:10px;align-items:flex-start">${glyph('ok')}<div><div style="font-weight:650;font-size:17px">Good through <span style="color:var(--current)">Mar 31, 2027</span></div>
      <div style="font-size:14px;color:var(--ink2);margin-top:3px;line-height:1.4">Calendar months run to the <b style="color:var(--ink)">end</b> of the 12th month, not the anniversary date.</div></div></div>
      <div class="tl">${months.map(() => '<i></i>').join('')}</div>
      <div class="tlm">${months.map((m) => `<span>${m}</span>`).join('')}</div>
    </div></div>
    <div class="pad" style="position:absolute;left:0;right:0;bottom:34px">
      <div class="btn2" style="margin-bottom:10px">${icon('camera')}Don't know? Snap the logbook entry</div>
      <div class="btn">Continue</div></div>
  </div>`;
  shots.push({ file: '03-calendar-months', title: 'Calendar months', copy: { eyebrow: 'Calendar months', h1: 'Month-end math,<br><em>done right.</em>', sub: 'Done March 3 or March 31, it’s good through the end of the month. TailBook knows.' }, mode: 'dark', inner });
}

// 4. Recurring AD: whichever first
{
  const ad = items.find((i) => i.kind === 'ad' || /^AD /.test(i.name));
  const hrsLeft = ad.hoursRemaining.toFixed(1);
  const inner = `<style>
    .clock{padding:16px;position:relative}
    .clock+.clock{border-top:1px solid var(--line)}
    .clock .hd{display:flex;align-items:center;gap:8px;color:var(--ink2);font-size:14px;font-weight:600}
    .clock .hd .ic{width:18px;height:18px;color:var(--ink3)}
    .clock .big{display:flex;align-items:baseline;gap:8px;margin-top:6px}
    .clock .big b{font-family:'Inter Display';font-size:36px;font-weight:700;letter-spacing:-.02em;font-feature-settings:"tnum"}
    .bar{height:8px;border-radius:4px;background:var(--neutralBg);margin-top:10px;overflow:hidden}
    .bar i{display:block;height:100%;border-radius:4px;background:var(--currentFill)}
    .gov{position:absolute;right:16px;top:16px;font-family:'DejaVu Sans Mono';font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);background:var(--accentSoft);padding:3px 6px;border-radius:5px}
  </style><div class="app">
    <div class="navbar"><span class="back">${icon('chevL', 'ic', 2.4)}ADs</span><span class="mid"></span><span class="act">Edit</span></div>
    <div class="pad" style="margin-top:8px"><div style="display:flex;align-items:center;gap:10px">${glyph('ok')}<span class="tag st-ok" style="font-size:11px;margin:0">Current</span></div>
      <div class="mono" style="font-size:27px;font-weight:700;margin-top:10px;letter-spacing:-.01em">AD 2020-18-04</div>
      <div style="font-size:15px;color:var(--ink2);margin-top:4px">Recurring inspection · every 100 hrs or 12 calendar months, whichever comes first</div></div>
    <div class="sech">Two clocks</div>
    <div class="pad"><div class="card">
      <div class="clock"><span class="gov">Comes first</span><div class="hd">${icon('cal')}Calendar</div>
        <div class="big"><b>${ad.daysRemaining}</b><span class="ov" style="font-size:12px">days left</span></div>
        <div style="font-size:14px;color:var(--ink2)">Due by <b style="color:var(--ink)">${fmt(ad.dueDate)}</b></div>
        <div class="bar"><i style="width:${Math.round((1 - ad.daysRemaining / 386) * 100)}%"></i></div></div>
      <div class="clock"><div class="hd">${icon('gauge')}Tach hours</div>
        <div class="big"><b>${hrsLeft}</b><span class="ov" style="font-size:12px">hrs left</span></div>
        <div style="font-size:14px;color:var(--ink2)">Due at <b style="color:var(--ink)">1,290.0</b> tach · about ${fmt(ad.projectedDate)} at your pace</div>
        <div class="bar"><i style="width:${Math.round((1 - ad.hoursRemaining / 100) * 100)}%"></i></div></div>
    </div></div>
    <div class="sech">Compliance</div>
    <div class="pad"><div class="card">
      <div class="kv"><span class="k">Last done</span><span class="v">Jan 10, 2026 · 1,190.0</span></div>
      <div class="kv"><span class="k">Method</span><span class="v">Inspection per AD ¶(g)</span></div>
      <div class="kv"><span class="k">Logbook</span><span class="v" style="color:var(--accent)">Airframe p. 31 ›</span></div>
    </div></div>
    <div class="pad" style="margin-top:14px"><div class="note">${icon('info')}<span>TailBook tracks the ADs you add. Your IA determines which ADs apply to your aircraft.</span></div></div>
    ${tabbar('ADs')}
  </div>`;
  shots.push({ file: '04-recurring-ads', title: 'Recurring ADs', copy: { eyebrow: 'Recurring ADs', h1: 'Hours or months,<br><em>whichever comes first.</em>', sub: 'TailBook watches both clocks and projects the hours side from how much you fly.' }, mode: 'light', inner });
}

// 5. Log flight sheet (dark)
{
  const perDay = profile.aircraft.avgHoursPerMonth / 30.4375;
  const oil = items.find((i) => i.id === 'oilChange' || i.name === 'Oil change');
  const newLeft = +(oil.hoursRemaining - 1.6).toFixed(1);
  const d = new Date(Date.UTC(2026, 9, 19 + Math.floor(newLeft / perDay)));
  const proj = `${MON[d.getUTCMonth()]} ${d.getUTCDate()}`;
  const behind = rows.filter((r) => r.status !== 'not_applicable').slice(0, 4);
  const inner = `<style>
    .dim{position:absolute;inset:0;background:rgba(0,0,0,.55);z-index:17}
    .sheet{position:absolute;left:0;right:0;bottom:0;top:262px;background:var(--surface);border-radius:24px 24px 0 0;z-index:18;padding:8px 16px 0;box-shadow:0 -10px 40px rgba(0,0,0,.4)}
    .grab{width:38px;height:5px;border-radius:3px;background:var(--line2);margin:0 auto 10px}
    .tach{display:flex;align-items:baseline;justify-content:center;gap:10px;margin-top:6px}
    .tach b{font-family:'Inter Display';font-size:64px;font-weight:700;letter-spacing:-.02em;font-feature-settings:"tnum"}
    .caret{display:inline-block;width:3px;height:56px;background:var(--accent);margin-left:2px;transform:translateY(6px);border-radius:2px}
    .field{background:var(--surface2);border:1.5px solid var(--accent);border-radius:14px;padding:12px 16px 14px;margin-top:12px}
    .pv{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--surface2);border-radius:12px;margin-top:10px;border:1px solid var(--line)}
    .keys{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin:0 -10px;padding:8px 6px 40px;background:var(--canvas);position:absolute;left:10px;right:10px;bottom:0}
    .keys span{height:47px;border-radius:8px;background:var(--surface2);display:grid;place-items:center;font-size:25px;font-weight:400;box-shadow:0 1px 0 rgba(0,0,0,.35)}
    .keys span.f{background:transparent;box-shadow:none}
  </style><div class="app">
    <div class="nav"><div><div class="t">N731TB ${icon('chevD', 'ic', 2.4)}</div><div class="s">Beechcraft A36 · IFR</div></div><div class="btns"><div class="cbtn">${icon('gear')}</div></div></div>
    <div class="pad"><div class="card">${behind.map(rowHtml).join('')}</div></div>
    <div class="dim"></div>
    <div class="sheet"><div class="grab"></div>
      <div style="display:flex;justify-content:space-between;align-items:center"><span style="color:var(--accent);font-size:17px">Cancel</span><span style="font-weight:650;font-size:17px">Log flight</span><span style="width:52px"></span></div>
      <div class="field"><div style="display:flex;justify-content:space-between"><span class="ov">Tach now</span><span class="ov">Last: 1,250.4</span></div>
        <div class="tach"><b>1,252.0</b><span class="caret"></span></div>
        <div style="display:flex;justify-content:center;gap:8px;font-size:13.5px;color:var(--ink2);margin-top:2px"><span>Today, Oct 19</span><span style="color:var(--ink3)">·</span><span>Pilot: Me</span><span style="color:var(--ink3)">·</span><span style="color:var(--accent)">Add Hobbs</span></div></div>
      <div class="pv">${glyph('due_soon')}<div style="flex:1"><div style="font-weight:600;font-size:15.5px">Oil change</div><div style="font-size:13px;color:var(--ink2);margin-top:1px">${oil.hoursRemaining.toFixed(1)} → <b style="color:var(--dueSoon)">${newLeft.toFixed(1)} hrs left</b> · about ${proj}</div></div></div>
      <div class="btn" style="margin-top:14px">Log 1.6 hrs</div>
      <div class="keys">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((k) => `<span class="${k === '.' || k === '⌫' ? 'f' : ''}">${k}</span>`).join('')}</div>
    </div>
  </div>`;
  shots.push({ file: '05-log-flight', title: 'Log flight', copy: { eyebrow: 'Tach log', h1: 'Log a flight.<br><em>The board updates.</em>', sub: 'Hours-based items turn into dates at your pace, so oil changes and ADs never sneak up.' }, mode: 'dark', inner });
}

// 6. Status Report PDF
{
  const rep = rows.filter((r) => r.status !== 'not_applicable');
  const lastDone = { 'ELT battery': 'Exp. Sep 2026', Transponder: 'Oct 18, 2024', 'VOR check': 'Oct 1, 2026', 'Oil change': '1,210.0 tach', 'Pitot-static & altimeter': 'Nov 2, 2024', 'AD 2020-18-04': 'Jan 10, 2026', 'Annual inspection': 'Mar 15, 2026', 'ELT inspection': 'Mar 15, 2026', Registration: 'Exp. Jun 2029' };
  const dueCol = (r) => { const it = items.find((i) => rowModel(i).name === r.name); return r.unit && r.unit.startsWith('hrs') ? `${it.dueTach.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} tach` : fmt(it.dueDate); };
  const inner = `<style>
    .viewer{position:absolute;left:0;right:0;top:98px;bottom:96px;background:var(--canvas);padding:14px 14px 0}
    .paper{background:#fff;color:#0E1621;border-radius:4px;box-shadow:0 2px 10px rgba(16,24,40,.12),0 0 0 1px rgba(16,24,40,.06);padding:20px 18px 14px;height:100%;position:relative;overflow:hidden;
      --knock:#fff;--overdueFill:${tokens.light.overdueFill};--dueSoonFill:${tokens.light.dueSoonFill};--currentFill:${tokens.light.currentFill};--neutralFill:${tokens.light.neutralFill}}
    .paper h3{font-family:'Inter Display';font-size:17px;font-weight:700;letter-spacing:-.01em}
    .paper .meta{font-size:8.5px;color:#5B6676;margin-top:3px}
    .ptab{width:100%;border-collapse:collapse;margin-top:10px;font-size:8.6px}
    .ptab th{font-family:'DejaVu Sans Mono';font-size:6.6px;letter-spacing:.08em;text-transform:uppercase;color:#5B6676;font-weight:600;text-align:left;padding:5px 3px;border-bottom:1.2px solid #0E1621}
    .ptab td{padding:6px 3px;border-bottom:.8px solid #DCE1E8;vertical-align:middle;font-feature-settings:"tnum"}
    .ptab td.c{font-family:'DejaVu Sans Mono';font-size:6.6px;color:#5B6676}
    .ptab .g{width:10px;height:10px;vertical-align:-2px;margin-right:3px}
    .ptab .w{font-family:'DejaVu Sans Mono';font-size:6.4px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
    .sumbox{display:flex;align-items:center;gap:8px;border:1.2px solid #0E1621;border-radius:6px;padding:7px 9px;margin-top:10px;font-size:10px}
    .sumbox .g{width:16px;height:16px}
    .pfoot{position:absolute;left:18px;right:18px;bottom:12px;font-size:6.6px;line-height:1.45;color:#5B6676;border-top:.8px solid #DCE1E8;padding-top:6px}
  </style><div class="app">
    <div class="navbar"><span class="back">${icon('chevL', 'ic', 2.4)}Reports</span><span class="mid">Status Report</span><span class="act">${icon('printer')}${icon('share')}</span></div>
    <div class="viewer"><div class="paper">
      <div style="display:flex;justify-content:space-between;align-items:flex-start"><div><h3>Aircraft Status Report</h3><div class="meta">N731TB · Beechcraft A36 · IFR · Tach 1,250.4</div></div>
        <div style="text-align:right" class="meta">Prepared Oct 19, 2026<br>from owner-entered data</div></div>
      <div class="sumbox">${glyph(SUM_GLYPH[S.status])}<div><b>All tracked items current: No.</b> ELT battery overdue · 3 due soon</div></div>
      <table class="ptab"><thead><tr><th>Status</th><th>Item</th><th>Last done</th><th>Due</th><th style="text-align:right">Left</th></tr></thead><tbody>
      ${rep.map((r) => `<tr><td>${glyph(r.status)}<span class="w" style="color:${{ overdue: tokens.light.overdue, due_soon: tokens.light.dueSoon, ok: tokens.light.current }[r.status]}">${TAG[r.status]}</span></td>
        <td><b style="font-weight:600">${r.name}</b><div class="c">${r.cite}</div></td><td>${lastDone[r.name] || ''}</td><td>${dueCol(r)}</td>
        <td style="text-align:right;font-weight:600">${r.value}${r.unit && r.unit.startsWith('hrs') ? ' h' : ' d'}${r.unit && r.unit.includes('over') ? ' over' : ''}</td></tr>`).join('')}
      </tbody></table>
      <div style="font-family:'DejaVu Sans Mono';font-size:6.6px;letter-spacing:.08em;text-transform:uppercase;color:#5B6676;font-weight:600;margin-top:14px;padding-bottom:5px;border-bottom:1.2px solid #0E1621">Open squawks (2)</div>
      <div style="font-size:8.6px;padding:6px 3px;border-bottom:.8px solid #DCE1E8">Left brake feels soft on taxi <span style="color:#5B6676">· noted Oct 4</span></div>
      <div style="font-size:8.6px;padding:6px 3px;border-bottom:.8px solid #DCE1E8">Right nav light intermittent <span style="color:#5B6676">· noted Sep 21</span></div>
      <div style="display:flex;gap:18px;margin-top:22px;font-size:7.5px;color:#5B6676"><div style="flex:2;border-top:.8px solid #0E1621;padding-top:4px">Reviewed by (A&amp;P/IA), certificate no.</div><div style="flex:1;border-top:.8px solid #0E1621;padding-top:4px">Date</div></div>
      <div class="pfoot">${DISCLAIMER} &nbsp;·&nbsp; Page 1 of 1</div>
    </div></div>
    <div class="pad" style="position:absolute;left:0;right:0;bottom:34px;display:flex;gap:10px"><div class="btn2" style="flex:1">${icon('person2')}Send to my IA</div><div class="btn" style="flex:1">${icon('share')}Share PDF</div></div>
  </div>`;
  shots.push({ file: '06-status-report', title: 'Status report', copy: { eyebrow: 'Status report', h1: 'A report your IA<br><em>can check.</em>', sub: 'One-page PDF with citations and dates for your shop, insurer or buyer.' }, mode: 'light', inner });
}

// ------------------------------------------------------------------ write + render
for (const s of shots) writeFileSync(join(srcDir, `${s.file}.html`), page(s.title, s.copy, phone(s.mode, s.inner)));

const require = createRequire(import.meta.url);
const pw = [process.env.PLAYWRIGHT_MODULE, 'playwright', '/opt/node22/lib/node_modules/playwright'].filter(Boolean)
  .map((c) => { try { return require(c); } catch { return null; } }).find(Boolean);
if (!pw) throw new Error('Playwright not found. Set PLAYWRIGHT_MODULE.');
const exe = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => p && existsSync(p));
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
const ctx = await browser.newContext({ viewport: { width: 1290, height: 2796 }, deviceScaleFactor: 1 });
const pageObj = await ctx.newPage();
for (const s of shots) {
  await pageObj.goto(pathToFileURL(join(srcDir, `${s.file}.html`)).href);
  await pageObj.evaluate(() => document.fonts.ready);
  await pageObj.screenshot({ path: join(here, `${s.file}.png`), clip: { x: 0, y: 0, width: 1290, height: 2796 } });
  console.log(`wrote ${s.file}.png`);
}
await browser.close();
