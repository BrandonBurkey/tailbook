// RFC 4180 CSV parse/serialize plus the experiment-tracker model. Zero dependencies.

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let q = false;
  const s = String(text).replace(/^﻿/, '');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) {
      if (ch === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; } else q = false;
      } else field += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && s[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const quote = (v) => (/[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
export function serializeCsv(rows, eol = '\n') {
  return rows.map((r) => r.map((v) => quote(String(v ?? ''))).join(',')).join(eol) + eol;
}
export const detectEol = (text) => (/\r\n/.test(text) ? '\r\n' : '\n');

// ---- Experiment tracker model ------------------------------------------------

export const EDITABLE_COLUMNS = ['actual_week', 'actual_cumulative'];

export const EXPERIMENTS = [
  { id: 'E1', title: 'Do owners ask for it?', blurb: 'Forum posts drive clicks and free Snapshot requests.', families: ['E1', 'E1-ops', 'E1-ext'], main: 'Snapshot requests', when: 'Oct 26 – Nov 15' },
  { id: 'E2', title: 'Will they pay?', blurb: 'Share of Snapshot recipients who leave a $49 refundable deposit.', families: ['E2'], main: 'Snapshot -> $49 deposit', when: 'Nov 2 – Dec 13' },
  { id: 'E3', title: 'Is there an “aha”?', blurb: 'Recipients who learn at least one thing they didn’t expect.', families: ['E3-proxy', 'E3'], when: 'Oct 26 – Dec 13' },
  { id: 'E4', title: 'Trials turn into paid', blurb: 'Free trial to annual plan on the App Store.', families: ['E4'], when: 'After launch' },
  { id: 'E5', title: 'Do they keep using it?', blurb: 'Owners who already track monthly (proxy), then real retention.', families: ['E5-proxy', 'E5'], when: 'Oct 19 – Dec 13' },
  { id: 'E6', title: 'Do they tell others?', blurb: 'Referrals and intros per Snapshot, then co-owner invites.', families: ['E6-proxy', 'E6'], when: 'Oct 26 – Dec 13' },
  { id: 'Interviews', title: 'Owner interviews', blurb: 'Mom Test interviews completed.', families: ['Interviews'], when: 'Oct 19 – Dec 13', supporting: true },
  { id: 'Partners', title: 'Type clubs & media', blurb: 'Clubs replying with interest and articles accepted.', families: ['Partners'], when: 'Nov 2 – Dec 13', supporting: true },
];

// Parse a threshold like ">=150 by 2026-11-15", "<5% on 60+", ">=0.3".
export function parseThreshold(raw) {
  if (!raw) return null;
  const m = String(raw).match(/(>=|<=|>|<|≥|≤)\s*(\d+(?:\.\d+)?)\s*(%)?/);
  if (!m) return null;
  const op = { '≥': '>=', '≤': '<=' }[m[1]] || m[1];
  return { op, value: Number(m[2]), percent: !!m[3], text: String(raw) };
}

export function parseNumber(raw) {
  if (raw == null) return null;
  const s = String(raw).trim().replace(/,/g, '');
  if (!s) return null;
  const m = s.match(/^(-?\d+(?:\.\d+)?)\s*%?$/);
  return m ? Number(m[1]) : null;
}

const cmp = (op, a, b) => (op === '>=' ? a >= b : op === '>' ? a > b : op === '<=' ? a <= b : a < b);

export function verdict(value, pass, fail) {
  if (value == null) return 'nodata';
  if (pass && cmp(pass.op, value, pass.value)) return 'pass';
  if (fail && cmp(fail.op, value, fail.value)) return 'fail';
  return 'between';
}

// Before the deadline, a low number isn't a failure yet: judge it against
// the week's planned pace instead.
export function interimVerdict(final, latest, m, deadline, today) {
  if (final === 'nodata' || final === 'pass' || !deadline || today > deadline) return final;
  const wk = m.weeks.find((w) => w.week === latest.week);
  const target = parseNumber(String(wk?.target || '').replace(/\+$/, '').split(' ')[0]);
  if (target != null && !m.percent) return latest.value >= target ? 'onpace' : 'behind';
  return final === 'fail' ? 'behind' : 'progress';
}

export function buildMetrics(text, today = new Date().toISOString().slice(0, 10)) {
  const rows = parseCsv(text);
  const header = rows[0];
  const col = Object.fromEntries(header.map((h, i) => [h, i]));
  const data = rows.slice(1).map((r, idx) => {
    const o = { row: idx + 1 };
    for (const h of header) o[h] = r[col[h]] ?? '';
    return o;
  }).filter((r) => r.week);

  const weeks = [];
  for (const r of data) {
    if (/^W\d+$/.test(r.week) && !weeks.find((w) => w.week === r.week)) {
      weeks.push({ week: r.week, start: r.week_start, end: r.week_end });
    }
  }
  const current = weeks.find((w) => today >= w.start && today <= w.end) ||
    (today < (weeks[0]?.start || '') ? weeks[0] : weeks[weeks.length - 1]);

  const experiments = EXPERIMENTS.map((ex) => {
    const metricsByKey = new Map();
    for (const r of data) {
      if (!ex.families.includes(r.experiment)) continue;
      const key = `${r.experiment}|${r.metric}`;
      if (!metricsByKey.has(key)) {
        metricsByKey.set(key, {
          key, experiment: r.experiment, metric: r.metric, unit: r.unit,
          proxy: /proxy/i.test(r.experiment), postBuild: r.week === 'POST-BUILD',
          passText: r.pass_threshold, failText: r.fail_threshold,
          pass: parseThreshold(r.pass_threshold), fail: parseThreshold(r.fail_threshold),
          percent: /%/.test(r.unit) || /%/.test(r.pass_threshold),
          notes: r.notes, weeks: [],
        });
      }
      metricsByKey.get(key).weeks.push({
        row: r.row, week: r.week, start: r.week_start, end: r.week_end,
        target: r.weekly_target, actualWeek: r.actual_week, actualCumulative: r.actual_cumulative,
        status: r.status,
      });
    }
    const metrics = [...metricsByKey.values()].map((m) => {
      let latest = null;
      for (const w of m.weeks) {
        const v = parseNumber(w.actualCumulative) ?? parseNumber(w.actualWeek);
        if (v != null) latest = { value: v, week: w.week };
      }
      const final = verdict(latest?.value ?? null, m.pass, m.fail);
      const deadline = (String(m.passText).match(/by (\d{4}-\d{2}-\d{2})/) || [])[1] ||
        m.weeks.map((w) => w.end).filter(Boolean).sort().pop() || null;
      return { ...m, latest, deadline, finalVerdict: final, verdict: interimVerdict(final, latest, m, deadline, today) };
    });
    const main = (ex.main && metrics.find((m) => m.metric === ex.main)) || metrics.find((m) => !m.postBuild && m.pass) || metrics[0] || null;
    const anyData = metrics.some((m) => m.latest);
    const postBuildOnly = metrics.length > 0 && metrics.every((m) => m.postBuild);
    return { ...ex, metrics, mainKey: main?.key ?? null, anyData, postBuildOnly, verdict: main ? main.verdict : 'nodata' };
  });

  return { weeks, currentWeek: current?.week ?? null, experiments, editableColumns: EDITABLE_COLUMNS };
}

// Validate and apply weekly actuals. Only the actual-value columns may change.
// updates: [{ row, week, experiment, metric, actual_week?, actual_cumulative? }]
export function applyUpdates(text, updates) {
  if (!Array.isArray(updates) || updates.length === 0) throw new HttpError(400, 'Nothing to save.');
  if (updates.length > 200) throw new HttpError(400, 'Too many updates at once.');
  const rows = parseCsv(text);
  const header = rows[0];
  const col = Object.fromEntries(header.map((h, i) => [h, i]));
  for (const c of ['week', 'experiment', 'metric', ...EDITABLE_COLUMNS]) {
    if (!(c in col)) throw new HttpError(500, `Tracker is missing the "${c}" column.`);
  }
  const allowedKeys = new Set(['row', 'week', 'experiment', 'metric', ...EDITABLE_COLUMNS]);
  let changed = 0;
  for (const u of updates) {
    if (!u || typeof u !== 'object' || Array.isArray(u)) throw new HttpError(400, 'Each update must be an object.');
    for (const k of Object.keys(u)) {
      if (!allowedKeys.has(k)) throw new HttpError(400, `"${k}" can't be edited here. Only actual values can.`);
    }
    if (!Number.isInteger(u.row) || u.row < 1 || u.row >= rows.length) throw new HttpError(400, 'Unknown row.');
    const r = rows[u.row];
    // Guard against a stale form: the identifying fields must still match.
    if (r[col.week] !== u.week || r[col.experiment] !== u.experiment || r[col.metric] !== u.metric) {
      throw new HttpError(409, 'The tracker changed since this page loaded. Refresh and try again.');
    }
    if (!/^W\d+$/.test(r[col.week])) throw new HttpError(400, 'Only weekly rows (W0–W7) take actuals.');
    for (const c of EDITABLE_COLUMNS) {
      if (!(c in u)) continue;
      const v = u[c];
      if (v === null || v === '') { if (r[col[c]] !== '') { r[col[c]] = ''; changed++; } continue; }
      const str = typeof v === 'number' ? String(v) : typeof v === 'string' ? v.trim() : null;
      if (str == null || !/^\d{1,7}(\.\d{1,2})?%?$/.test(str)) {
        throw new HttpError(400, `"${String(v).slice(0, 20)}" isn't a valid number. Use digits like 12, 4.5 or 15%.`);
      }
      const n = parseFloat(str);
      if (str.endsWith('%') && n > 100) throw new HttpError(400, 'A percentage can’t be over 100%.');
      if (r[col[c]] !== str) { r[col[c]] = str; changed++; }
    }
  }
  return { text: serializeCsv(rows, detectEol(text)), changed };
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
