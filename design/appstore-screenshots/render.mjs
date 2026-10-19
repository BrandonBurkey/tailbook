#!/usr/bin/env node
/**
 * App Store screenshot mockups for TailBook (6.9" display, 1290×2796 portrait).
 *   node design/appstore-screenshots/render.mjs
 * Writes the HTML source to design/appstore-screenshots/src/ and PNGs next to this file.
 * The UI is a hand-built HTML/CSS reconstruction of the SwiftUI MVP as it is actually built
 * (ios/TailBook/Views: system grouped lists, the five tabs in RootView, the real strings), with the
 * status/accent colors from design/tokens.json (= Assets.xcassets). Show only features the app has.
 * Replace with real simulator captures of the sample aircraft before submission. Board numbers come from the
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

const SHORT_DISC = 'TailBook organizes the dates you enter. Your A&amp;P/IA and the pilot in command determine airworthiness.';

// ------------------------------------------------------------------ real-app UI (mirrors ios/TailBook/Views)
// These screens copy what the SwiftUI MVP actually renders: system insetGrouped lists, the five tabs in
// RootView.MainTabView (Status · ADs & Items · Squawks · Reports · Settings), the strings in
// Models/Formatting.swift, and the colors in Assets.xcassets (= tokens.json text colors). Nothing here may
// show a feature the app doesn't have (no logbook scans, no co-owners, no widgets).
const IOS = {
  light: { bg: '#F2F2F7', cell: '#FFFFFF', sep: '#C6C6C8', lab: '#000000', lab2: '#8A8A8E', lab3: '#C4C4C7', fill: 'rgba(120,120,128,.12)', bar: '#F7F7F8', barLine: 'rgba(0,0,0,.18)',
    tint: tokens.light.accent, onTint: tokens.light.onAccent, red: tokens.light.overdue, yel: tokens.light.dueSoon, grn: tokens.light.current },
  dark: { bg: '#000000', cell: '#1C1C1E', sep: '#38383A', lab: '#FFFFFF', lab2: '#98989F', lab3: '#5A5A5E', fill: 'rgba(118,118,128,.24)', bar: '#161618', barLine: 'rgba(255,255,255,.15)',
    tint: tokens.dark.accent, onTint: tokens.dark.onAccent, red: tokens.dark.overdue, yel: tokens.dark.dueSoon, grn: tokens.dark.current },
};
const iosVars = (m) => Object.entries(IOS[m]).map(([k, v]) => `--i-${k}:${v};`).join('');
const ICSS = `<style>
.ios.light{${iosVars('light')}} .ios.dark{${iosVars('dark')}}
.ios{background:var(--i-bg);color:var(--i-lab)}
.ios .app{font-family:"Inter",system-ui,sans-serif;letter-spacing:-.012em}
.ios .sbar{color:var(--i-lab)} .ios .homebar{background:var(--i-lab)}
.ios .st-overdue{color:var(--i-red)} .ios .st-due_soon{color:var(--i-yel)} .ios .st-ok{color:var(--i-grn)}
.ios .st-unknown,.ios .st-not_applicable{color:var(--i-lab2)}
.inav{display:flex;align-items:center;justify-content:space-between;height:46px;padding:0 16px;position:relative}
.inav .l,.inav .r{display:flex;align-items:center;gap:2px;color:var(--i-tint);font-size:17px;min-width:70px}
.inav .r{justify-content:flex-end;font-weight:600}
.inav .c{position:absolute;left:90px;right:90px;text-align:center;font-weight:600;font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.inav .c small{display:block;font-size:11px;font-weight:400;color:var(--i-lab2);letter-spacing:0}
.inav .ic{width:24px;height:24px}
.scroll{position:absolute;left:0;right:0;top:100px;bottom:0;overflow:hidden}
.sec{margin:0 16px}
.sh{font-size:13px;color:var(--i-lab2);text-transform:uppercase;padding:18px 16px 7px;letter-spacing:0}
.sf{font-size:13px;line-height:1.35;color:var(--i-lab2);padding:7px 16px 4px;letter-spacing:-.005em}
.grp{background:var(--i-cell);border-radius:10px;overflow:hidden}
.cell{display:flex;align-items:center;gap:12px;min-height:44px;padding:11px 16px;position:relative;font-size:17px}
.cell+.cell::before{content:"";position:absolute;top:0;left:16px;right:0;height:.6px;background:var(--i-sep)}
.cell.ind+.cell::before,.cell+.cell.ind::before{left:54px}
.cell .grow{flex:1;min-width:0}
.cell .k{flex:1} .cell .v{color:var(--i-lab2);font-feature-settings:"tnum"}
.chev{width:14px;height:14px;color:var(--i-lab3);flex:none}
.tl{color:var(--i-tint)}
.tl .ic{width:22px;height:22px}
.lab2{color:var(--i-lab2)}
.pill{background:var(--i-fill);border-radius:7px;padding:6px 11px;font-size:17px;font-feature-settings:"tnum";white-space:nowrap}
.bbtn{background:var(--i-fill);color:var(--i-tint);border-radius:8px;padding:6px 12px;font-size:15px;font-weight:500;white-space:nowrap}
.pbtn{height:50px;border-radius:12px;background:var(--i-tint);color:var(--i-onTint);display:flex;align-items:center;justify-content:center;gap:8px;font-weight:600;font-size:17px}
.pbtn .ic{width:21px;height:21px}
.botbar{position:absolute;left:0;right:0;padding:8px 16px;background:var(--i-bar);border-top:.6px solid var(--i-barLine);z-index:14;backdrop-filter:blur(20px)}
.itabs{position:absolute;left:0;right:0;bottom:0;height:83px;display:flex;justify-content:space-around;padding:7px 4px 0;background:var(--i-bar);border-top:.6px solid var(--i-barLine);z-index:15}
.itab{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10px;font-weight:500;color:var(--i-lab2);width:80px;letter-spacing:0}
.itab .ic{width:26px;height:26px}
.itab.on{color:var(--i-tint)}
.toggle{width:51px;height:31px;border-radius:16px;background:#34C759;position:relative;flex:none}
.toggle::after{content:"";position:absolute;right:2px;top:2px;width:27px;height:27px;border-radius:50%;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.2)}
.seg{display:flex;background:var(--i-fill);border-radius:9px;padding:2px;font-size:14px;font-weight:500;width:100%}
.seg span{flex:1;text-align:center;padding:6px 0;border-radius:7px}
.seg span.on{background:var(--i-cell);box-shadow:0 2px 6px rgba(0,0,0,.14);font-weight:600}
.dark .seg span.on{background:#636366}
.updown{display:inline-flex;align-items:center;gap:4px;color:var(--i-lab2)}
.updown svg{width:11px;height:15px}
</style>`;

const SYM = { // SF Symbol stand-ins used by the tab bar and rows
  gauge: '<path d="M4.6 17.5a8.5 8.5 0 1 1 14.8 0"/><path d="m12 13 3.5-4.5"/><circle cx="12" cy="13.2" r="1.3"/>',
  checklist: '<path d="M3.5 6.5 5 8l2.8-3M3.5 12.5 5 14l2.8-3M3.5 18.5 5 20l2.8-3"/><path d="M11 6.5h9.5M11 12.5h9.5M11 18.5h9.5"/>',
  wrench: I.wrench, doc: I.doc, gear: I.gear,
  airplaneCircle: '<circle cx="12" cy="12" r="9.6"/><path d="M12 6.4v4l4.2 2.6v1.2L12 13v2.8l1.4 1v.9L12 17.3l-1.4.4v-.9l1.4-1V13l-4.2 1.2V13l4.2-2.6"/>',
  speedometer: '<path d="M4.6 17.5a8.5 8.5 0 1 1 14.8 0"/><path d="m12 13 3.5-4.5"/><circle cx="12" cy="13.2" r="1.3"/><path d="M6.5 13H5M19 13h-1.5M12 6.5V5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9.5"/><path d="m8 12.3 2.8 2.8L16.2 9.6"/>',
  calendar: I.cal, airplane: '<path d="M12 3c.9 0 1.4 1 1.4 2.2v4.3l7 4.1v1.8l-7-2.1v4.1l2 1.5v1.4L12 19.4l-3.4.9v-1.4l2-1.5v-4.1l-7 2.1v-1.8l7-4.1V5.2C10.6 4 11.1 3 12 3z"/>',
  book: I.book, share: I.share, chevL: I.chevL, chevR: I.chevR,
};
const sym = (n, cls = 'ic', sw = 1.8) => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SYM[n]}</svg>`;
const chev = `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${I.chevR}</svg>`;
const updown = '<span class="updown"><svg viewBox="0 0 11 15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5.5 5.5 2 9 5.5M2 9.5 5.5 13 9 9.5"/></svg></span>';
const iglyph = (status, size = 22) => `<span class="g st-${status}" style="width:${size}px;height:${size}px">${GLYPH[status]('var(--i-cell)')}</span>`;

// RootView.MainTabView, in order.
const TABS = [['gauge', 'Status'], ['checklist', 'ADs & Items'], ['wrench', 'Squawks'], ['doc', 'Reports'], ['gear', 'Settings']];
const itabs = (on) => `<div class="itabs">${TABS.map(([ic, l]) => `<div class="itab ${l === on ? 'on' : ''}">${sym(ic, 'ic', 1.7)}<span>${l}</span></div>`).join('')}</div>`;

// Swift string helpers (Models/Formatting.swift)
const hrs = (h) => h.toFixed(1);
const days = (n) => (n === 1 ? '1 day' : `${n} days`);
const STATUS_LABEL = { overdue: 'Overdue', due_soon: 'Due soon', ok: 'Current', not_applicable: 'N/A', unknown: 'Needs info' };
function throughText(i) {
  if (i.status === 'not_applicable' || i.status === 'unknown') return i.reason || i.message;
  if (i.governedBy === 'hours' && i.dueTach != null) return `Due at ${hrs(i.dueTach)} tach`;
  if (i.dueDate) return i.status === 'overdue' && i.daysRemaining < 0 ? `Lapsed after ${fmt(i.dueDate)}` : `Current through ${fmt(i.dueDate)}`;
  if (i.dueTach != null) return `Due at ${hrs(i.dueTach)} tach`;
  return i.message;
}
function remainingPrimary(i) {
  if (i.status === 'not_applicable') return 'N/A';
  if (i.status === 'unknown') return '—';
  const h = i.hoursRemaining, d = i.daysRemaining;
  if (i.governedBy === 'hours' && h != null) return h < 0 ? `${hrs(-h)} hrs over` : `${hrs(h)} hrs`;
  if (d != null) return d < 0 ? `${days(-d)} over` : d === 0 ? 'Today' : days(d);
  if (h != null) return h < 0 ? `${hrs(-h)} hrs over` : `${hrs(h)} hrs`;
  return '—';
}
function remainingSecondary(i) {
  if (i.status === 'not_applicable' || i.status === 'unknown') return null;
  if (i.governedBy === 'hours') return i.projectedDate ? `≈ ${fmt(i.projectedDate)}` : i.daysRemaining != null ? days(i.daysRemaining) : null;
  if (i.hoursRemaining != null) return i.hoursRemaining < 0 ? `${hrs(-i.hoursRemaining)} hrs over` : `${hrs(i.hoursRemaining)} hrs`;
  return null;
}
const nextDueText = (s) => `${s.nextDue.name} in ${days(s.nextDue.daysRemaining)} · ${fmt(s.nextDue.date)}`;

// StatusBoardView.ItemRow
const boardRow = (i) => `<div class="cell ind" style="align-items:flex-start">${iglyph(i.status, 24)}
  <div class="grow"><div style="font-weight:600">${i.name}</div><div style="font-size:12px;color:var(--i-lab2);margin-top:1px">${i.citation}</div>
    <div style="font-size:15px;margin-top:2px;${i.status === 'not_applicable' ? 'color:var(--i-lab2)' : ''}">${throughText(i)}</div></div>
  <div style="text-align:right;flex:none;max-width:120px"><div class="st-${i.status}" style="font-weight:600;font-feature-settings:'tnum'">${remainingPrimary(i)}</div>
    ${remainingSecondary(i) ? `<div style="font-size:12px;color:var(--i-lab2);margin-top:2px;font-feature-settings:'tnum'">${remainingSecondary(i)}</div>` : ''}</div>
  <span style="align-self:center">${chev}</span></div>`;

// StatusBoardView.HeroCard
const ANSWER = { current: 'Yes', limited: 'Not all', overdue: 'No', incomplete: "Can't tell yet" };
const SUM_GLYPH = { current: 'ok', limited: 'due_soon', overdue: 'overdue', incomplete: 'unknown' };
const badge = (st, n, label) => `<span style="display:inline-flex;align-items:center;gap:4px">${iglyph(st, 13)}<b style="font-size:15px;font-feature-settings:'tnum'">${n}</b><span style="font-size:12px;color:var(--i-lab2)">${label}</span></span>`;
const heroCell = (s = S) => `<div class="cell" style="display:block;padding:14px 16px">
  <div style="font-size:12px;font-weight:600;letter-spacing:.1em;color:var(--i-lab2)">ALL ITEMS CURRENT?</div>
  <div style="display:flex;align-items:center;gap:12px;margin-top:9px">${iglyph(SUM_GLYPH[s.status], 36)}<span style="font-family:'Inter Display';font-size:34px;font-weight:700;letter-spacing:-.02em">${ANSWER[s.status]}</span></div>
  <div style="font-size:15px;line-height:1.35;margin-top:9px">${s.headline}</div>
  <div style="display:flex;gap:14px;margin-top:11px">${badge('overdue', s.counts.overdue, 'overdue')}${badge('due_soon', s.counts.due_soon, 'due soon')}${badge('ok', s.counts.ok, 'current')}${s.counts.unknown ? badge('unknown', s.counts.unknown, 'need info') : ''}</div></div>`;

// ------------------------------------------------------------------ the six screens
const shots = [];

// 1. Status tab: hero + disclaimer + rows, Log flight above the tab bar
{
  const inner = `${ICSS}<div class="app">
    <div class="inav"><span class="l">${sym('airplaneCircle', 'ic', 1.6)}</span><span class="c">N731TB<small>Next due: ${nextDueText(S)}</small></span><span class="r"></span></div>
    <div class="scroll" style="top:100px">
      <div class="sec" style="margin-top:10px"><div class="grp">${heroCell()}</div></div>
      <div class="sf">${DISCLAIMER}</div>
      <div class="sh">${items.length} items · sorted by urgency</div>
      <div class="sec"><div class="grp">${items.map(boardRow).join('')}</div></div>
    </div>
    <div class="botbar" style="bottom:83px"><div class="pbtn">${sym('speedometer', 'ic', 1.9)}Log flight</div></div>
    ${itabs('Status')}</div>`;
  shots.push({ file: '01-status-board', title: 'Status board', copy: { eyebrow: 'Status board', h1: 'All items current?<br><em>Know in two seconds.</em>', sub: 'Inspections, checks and recurring ADs on one board, worst first, each with its FAR citation.' }, mode: 'light', inner });
}

// 2. Item detail: Transponder (ItemDetailView)
{
  const t = items.find((i) => i.id === 'transponder');
  const inner = `${ICSS}<div class="app">
    <div class="inav"><span class="l">${sym('chevL', 'ic', 2.4)}N731TB</span><span class="c">Transponder</span><span class="r"></span></div>
    <div class="scroll" style="top:100px">
      <div class="sec" style="margin-top:10px"><div class="grp">
        <div class="cell" style="padding:14px 16px">${iglyph(t.status, 38)}<div><div style="font-size:22px;font-weight:600;letter-spacing:-.015em">${STATUS_LABEL[t.status]}</div><div style="font-size:15px;color:var(--i-lab2);margin-top:1px">${throughText(t)}</div></div></div>
        <div class="cell" style="font-size:16px">${t.message}</div></div></div>
      <div class="sh">Numbers</div>
      <div class="sec"><div class="grp">
        <div class="cell"><span class="k">Last done</span><span class="v">${fmt(t.lastDone)}</span></div>
        <div class="cell"><span class="k">Current through</span><span class="v">${fmt(t.dueDate)}</span></div>
        <div class="cell"><span class="k">Days left</span><span class="v">${days(t.daysRemaining)}</span></div></div></div>
      <div class="sh">The rule</div>
      <div class="sec"><div class="grp">
        <div class="cell" style="font-size:16px;line-height:1.38">${t.rule}</div>
        <div class="cell tl" style="gap:10px">${sym('book', 'ic')}Read ${t.citation}</div></div></div>
      <div class="sf">${SHORT_DISC}</div>
      <div class="sec" style="margin-top:22px"><div class="grp">
        <div class="cell tl" style="gap:12px">${sym('checkCircle', 'ic')}Mark done today</div>
        <div class="cell tl" style="gap:12px">${sym('calendar', 'ic')}Edit date…</div>
        <div class="cell tl" style="gap:12px">${sym('airplane', 'ic', 1.5)}Edit aircraft details…</div></div></div>
    </div>
    ${itabs('Status')}</div>`;
  shots.push({ file: '02-far-citations', title: 'FAR citations', copy: { eyebrow: 'Show your work', h1: 'Every item cites<br><em>its FAR.</em>', sub: 'Tap any item for the rule in plain English, the dates behind it and a link to the regulation.' }, mode: 'light', inner });
}

// 3. Setup: Inspections & dates step (OnboardingView + AircraftInspectionsSection), dark
{
  const dateRow = (title, value, foot) => `<div class="cell" style="display:block;padding:10px 16px">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><span>${title}</span>${value ? `<span class="pill">${value}</span>` : '<span class="bbtn">Set date</span>'}</div>
    ${value ? '<div style="font-size:12px;color:var(--i-tint);margin-top:8px">Don’t know yet</div>' : '<div style="font-size:12px;color:var(--i-lab2);margin-top:8px">Don’t know yet — shows as Needs info until you add it.</div>'}
    ${foot ? `<div style="font-size:12px;color:var(--i-lab2);margin-top:4px">${foot}</div>` : ''}</div>`;
  const inner = `${ICSS}<div class="app">
    <div class="inav"><span class="l">Back</span><span class="c">Inspections &amp; dates</span><span class="r"></span></div>
    <div style="padding:2px 16px 0"><div style="font-size:12px;color:var(--i-lab2)">Step 3 of 4</div>
      <div style="height:4px;border-radius:2px;background:var(--i-fill);margin-top:5px"><div style="width:75%;height:100%;border-radius:2px;background:var(--i-tint)"></div></div></div>
    <div class="scroll" style="top:132px">
      <div class="sec" style="margin-top:12px"><div class="grp"><div class="cell" style="font-size:15px;color:var(--i-lab2);line-height:1.35">Enter what you know from your logbook or the stickers. Anything you skip shows as “Needs info”; nothing is guessed.</div></div></div>
      <div class="sh">Annual</div>
      <div class="sec"><div class="grp">${dateRow('Last annual', 'Mar 15, 2026', 'Good through the last day of that month next year (§91.409(a)).')}</div></div>
      <div class="sh">Avionics checks</div>
      <div class="sec"><div class="grp">${dateRow('Transponder check', 'Oct 18, 2024', '24 calendar months (§91.413).')}${dateRow('Pitot-static / altimeter', 'Nov 2, 2024', '24 calendar months, IFR (§91.411).')}${dateRow('VOR check', null, 'Within the preceding 30 days, IFR (§91.171).')}</div></div>
      <div class="sh">ELT</div>
      <div class="sec"><div class="grp">${dateRow('ELT inspection', 'Mar 15, 2026', '12 calendar months (§91.207(d)).')}</div></div>
    </div>
    <div class="botbar" style="bottom:0;padding-bottom:34px"><div class="pbtn">Next</div></div>
  </div>`;
  shots.push({ file: '03-calendar-months', title: 'Five-minute setup', copy: { eyebrow: 'Five-minute setup', h1: 'Enter what you know.<br><em>Skip what you don’t.</em>', sub: 'Calendar-month items run to the last day of the month. Anything you skip shows as Needs info, never a guess.' }, mode: 'dark', inner });
}

// 4. AD editor sheet: whichever first (TrackedItemEditor)
{
  const inner = `${ICSS}<style>.dimtop{position:absolute;left:0;right:0;top:0;height:120px;background:#000}
    .behind{position:absolute;left:14px;right:14px;top:48px;height:60px;border-radius:12px 12px 0 0;background:#8E8E93;opacity:.55}
    .esheet{position:absolute;left:0;right:0;top:60px;bottom:0;border-radius:12px 12px 0 0;background:var(--i-bg);overflow:hidden}
    .ios .sbar{color:#fff}</style>
  <div class="dimtop"></div><div class="behind"></div>
  <div class="app" style="padding-top:0"><div class="esheet">
    <div class="inav" style="margin-top:6px"><span class="l">Cancel</span><span class="c">Edit AD</span><span class="r">Save</span></div>
    <div style="position:absolute;left:0;right:0;top:56px;bottom:0;overflow:hidden">
      <div class="sh" style="padding-top:8px">Airworthiness Directive</div>
      <div class="sec"><div class="grp"><div class="cell"><span style="font-family:'DejaVu Sans Mono';font-size:16px">2020-18-04</span></div><div class="cell">Recurring inspection</div></div></div>
      <div class="sec" style="margin-top:22px"><div class="grp"><div class="cell"><div class="seg"><span class="on">Recurring</span><span>One-time</span></div></div>
        <div class="cell"><span class="k">Applies to this aircraft</span><span class="toggle"></span></div></div></div>
      <div class="sf">Applicability is your A&amp;P/IA’s determination. Turn it off to keep the AD on file as not applicable.</div>
      <div class="sh">Interval</div>
      <div class="sec"><div class="grp">
        <div class="cell"><span class="k">Repeats by</span><span class="v" style="font-size:15px">Hours or time, whichever first</span>${updown}</div>
        <div class="cell"><span class="k">Every</span><span style="font-feature-settings:'tnum'">100.0</span><span class="lab2">hrs</span></div>
        <div class="cell"><span class="k">Time unit</span><span class="v">Calendar months</span>${updown}</div>
        <div class="cell"><span class="k">or every</span><span style="font-feature-settings:'tnum'">12</span><span class="lab2">calendar months</span></div></div></div>
      <div class="sf">Hours are tach hours. Good through the last day of the month (e.g. done Mar 5 + 12 → Mar 31 next year). Due at whichever limit comes first.</div>
      <div class="sh">Last complied with</div>
      <div class="sec"><div class="grp">
        <div class="cell" style="display:block;padding:10px 16px"><div style="display:flex;align-items:center;justify-content:space-between"><span>Last done</span><span class="pill">Jan 10, 2026</span></div><div style="font-size:12px;color:var(--i-tint);margin-top:8px">Don’t know yet</div></div>
        <div class="cell"><span class="k">Tach when done</span><span style="font-feature-settings:'tnum'">1190.0</span></div></div></div>
      <div class="sf">A whichever-first item needs both the date and the tach to show as current.</div>
    </div></div></div>`;
  shots.push({ file: '04-recurring-ads', title: 'Recurring ADs', copy: { eyebrow: 'Recurring ADs', h1: 'Hours or months,<br><em>whichever comes first.</em>', sub: 'Enter both limits once. TailBook tracks each and shows you the one that comes due first.' }, mode: 'light', inner });
}

// 5. Log flight sheet (LogFlightSheet), dark, decimal pad up
{
  const inner = `${ICSS}<style>.dimtop{position:absolute;left:0;right:0;top:0;height:120px;background:#000}
    .behind{position:absolute;left:14px;right:14px;top:48px;height:60px;border-radius:12px 12px 0 0;background:#2C2C2E}
    .esheet{position:absolute;left:0;right:0;top:60px;bottom:0;border-radius:12px 12px 0 0;background:var(--i-bg);overflow:hidden}
    .keys{position:absolute;left:0;right:0;bottom:0;height:300px;background:#2B2B2D;padding:8px 6px 0;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:47px;gap:7px}
    .keys span{border-radius:6px;background:#6B6B6F;display:grid;place-items:center;font-size:25px;color:#fff;box-shadow:0 1px 0 rgba(0,0,0,.4)}
    .keys span.f{background:transparent;box-shadow:none}
    .caret{display:inline-block;width:3px;height:36px;background:var(--i-tint);margin-left:2px;vertical-align:-5px;border-radius:2px}</style>
  <div class="dimtop"></div><div class="behind"></div>
  <div class="app" style="padding-top:0"><div class="esheet">
    <div class="inav" style="margin-top:6px"><span class="l">Cancel</span><span class="c">Log flight</span><span class="r">Save</span></div>
    <div class="sh" style="padding-top:8px">New tach reading · N731TB</div>
    <div class="sec"><div class="grp">
      <div class="cell" style="justify-content:center;padding:14px 16px"><span style="font-size:34px;font-weight:600;font-feature-settings:'tnum';letter-spacing:-.01em">1251.6</span><span class="caret"></span></div>
      <div class="cell" style="gap:8px">${[0.5, 1.0, 1.5, 2.0, 3.0].map((a) => `<span class="bbtn" style="font-feature-settings:'tnum'">+${a.toFixed(1)}</span>`).join('')}</div>
      <div class="cell" style="font-size:15px;font-feature-settings:'tnum'"><span class="k">Was 1250.4</span><span class="lab2">+1.2 hrs</span></div></div></div>
    <div class="sec" style="margin-top:22px"><div class="grp">
      <div class="cell"><span class="k">Hobbs</span><span style="color:var(--i-lab3)">Optional</span></div>
      <div class="cell"><span class="k">Date</span><span class="pill">Oct 19, 2026</span><span class="pill">9:41 AM</span></div>
      <div class="cell"><span style="color:var(--i-lab3)">Note (optional)</span></div></div></div>
    <div class="keys">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'].map((k) => `<span class="${k === '.' || k === '⌫' ? 'f' : ''}">${k}</span>`).join('')}</div>
  </div></div>`;
  shots.push({ file: '05-log-flight', title: 'Log flight', copy: { eyebrow: 'Tach log', h1: 'Log a flight.<br><em>The board updates.</em>', sub: 'Type the new tach or tap +1.0. Oil changes and hours-based ADs re-project to dates at your pace.' }, mode: 'dark', inner });
}

// 6. Aircraft Status Report PDF preview (ReportsView → PDFPreviewScreen; layout from Services/PDFExporter.swift)
{
  const LONG_DISC = 'TailBook is an organizational tool. It records and calculates dates and times from information you provide and displays reminders. TailBook does not inspect aircraft, does not determine airworthiness, and does not determine whether any Airworthiness Directive or other requirement applies to your aircraft. Your A&amp;P mechanic or Inspection Authorization holder and the pilot in command are solely responsible for determining airworthiness (see 14 CFR 91.7, 91.403). Always verify against your aircraft’s maintenance records and current regulations before flight. TailBook may contain errors.';
  const PDF_COLOR = { overdue: tokens.light.overdue, due_soon: tokens.light.dueSoon, ok: tokens.light.current, not_applicable: '#616161', unknown: '#616161' };
  const dueText = (i) => {
    if (i.status === 'not_applicable' || i.status === 'unknown') return i.reason || i.message;
    const parts = [];
    if (i.dueDate) parts.push(fmt(i.dueDate));
    if (i.dueTach != null) parts.push(`${hrs(i.dueTach)} tach${i.projectedDate ? ` (≈ ${fmt(i.projectedDate)})` : ''}`);
    return parts.length > 1 ? `${parts.join(' or ')}, whichever first` : parts[0] || i.message;
  };
  const details = (i) => [i.lastDone ? `Last done ${fmt(i.lastDone)}` : null, i.lastDoneTach != null ? `at ${hrs(i.lastDoneTach)} tach` : null].filter(Boolean).join(' · ');
  const rowsHtml = items.map((i) => `<tr class="${details(i) ? '' : 'nd'}"><td>${i.name}</td><td class="gy">${i.citation}</td><td style="color:${PDF_COLOR[i.status]}">${STATUS_LABEL[i.status]}</td><td>${dueText(i)}</td><td>${[remainingPrimary(i), remainingSecondary(i)].filter(Boolean).join('<br>')}</td></tr>
    ${details(i) ? `<tr class="dl"><td colspan="5">${details(i)}</td></tr>` : ''}`).join('');
  const inner = `${ICSS}<style>
    .viewer{position:absolute;left:0;right:0;top:100px;bottom:0;background:#E5E5EA;overflow:hidden}
    .paper{position:absolute;left:14px;top:14px;width:612px;height:792px;transform:scale(.66);transform-origin:0 0;background:#fff;color:#141414;box-shadow:0 2px 12px rgba(0,0,0,.18);
      padding:48px;font-family:"Inter",sans-serif;letter-spacing:0}
    .paper h3{font-size:22px;font-weight:700}
    .paper .gy{color:#616161}
    .ptab{width:100%;border-collapse:collapse;font-size:9px;line-height:1.3;margin-top:4px}
    .ptab th{text-align:left;font-weight:700;padding:3px 3px 4px;border-bottom:.8px solid #C7C7C7}
    .ptab td{padding:4px 3px 2px;vertical-align:top}
    .ptab tr.nd td{border-bottom:.8px solid #C7C7C7;padding-bottom:4px}
    .ptab tr.dl td{font-size:8px;color:#616161;padding:0 3px 4px 11px;border-bottom:.8px solid #C7C7C7}
    .ptab col.a{width:27%} .ptab col.b{width:19%} .ptab col.c{width:12%} .ptab col.d{width:26%} .ptab col.e{width:16%}
    .pfoot{position:absolute;left:48px;right:48px;bottom:30px;font-size:7.5px;color:#616161}
  </style><div class="app">
    <div class="inav"><span class="l">${sym('chevL', 'ic', 2.4)}Reports</span><span class="c">Aircraft Status Report</span><span class="r">${sym('share', 'ic', 1.8)}</span></div>
    <div class="viewer"><div class="paper">
      <h3>Aircraft Status Report</h3>
      <div style="font-size:13px;margin-top:2px">N731TB · Beechcraft A36</div>
      <div class="gy" style="font-size:10px;margin-top:2px">As of ${fmt(AS_OF)} · Tach 1250.4 · Hobbs 1612.0 · IFR</div>
      <div style="border-top:.8px solid #C7C7C7;margin:6px 0 10px"></div>
      <div style="font-size:15px;font-weight:700">All items current?  ${ANSWER[S.status]}</div>
      <div style="font-size:10.5px;margin-top:6px">${S.headline}</div>
      <div class="gy" style="font-size:10.5px;margin-top:6px">Next due: ${nextDueText(S)}</div>
      <div class="gy" style="font-size:8.5px;font-style:italic;margin-top:12px;line-height:1.3">${LONG_DISC}</div>
      <table class="ptab" style="margin-top:10px"><colgroup><col class="a"><col class="b"><col class="c"><col class="d"><col class="e"></colgroup>
        <thead><tr><th>Item</th><th>Citation</th><th>Status</th><th>Current through / due</th><th>Remaining</th></tr></thead><tbody>${rowsHtml}</tbody></table>
      <div class="pfoot">${SHORT_DISC} Always verify against your logbooks. Generated by TailBook on ${fmt(AS_OF)}.&nbsp;&nbsp; Page 1</div>
    </div></div>
    ${itabs('Reports')}</div>`;
  shots.push({ file: '06-status-report', title: 'Status report', copy: { eyebrow: 'Status report', h1: 'A report your IA<br><em>can check.</em>', sub: 'A PDF with every item, its citation and its dates, for your shop, insurer or buyer.' }, mode: 'light', inner });
}


// ------------------------------------------------------------------ write + render
for (const s of shots) writeFileSync(join(srcDir, `${s.file}.html`), page(s.title, s.copy, phone(`ios ${s.mode}`, s.inner)));

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
