/**
 * TailBook due-date rules engine
 * ==============================
 *
 * Pure, dependency-free ES module that turns the dates and meter readings an
 * aircraft owner enters into a red / yellow / green "always-airworthy" board,
 * with a 14 CFR citation for every item, plus an "All items current?" summary.
 * It reports whether entered items are current; it never says an aircraft is
 * airworthy (see DISCLAIMER and summarize()).
 *
 * This file is the reference implementation. The SwiftUI app will be ported
 * from it, and the port must pass `engine/test-vectors.json` exactly. Keep it:
 *   - pure: no I/O, no clocks, no globals. "Today" is always an input (`asOf`).
 *   - timezone-free: dates are civil dates ("YYYY-MM-DD" strings) and all date
 *     math is done on integer day numbers, never on local-time Date objects.
 *   - explicit: every interpretive choice is documented next to the code.
 *
 * ---------------------------------------------------------------------------
 * "CALENDAR MONTH" SEMANTICS (the rule owners argue about)
 * ---------------------------------------------------------------------------
 * §91.409(a), §91.411, §91.413 and §91.207(d) say "within the preceding
 * 12 / 24 calendar months". The regulations do not define "calendar month" in
 * §1.1, but the FAA consistently applies it as the whole month, first day to
 * last day, so the interval ends on the LAST DAY of the Nth month after the
 * month the work was done, regardless of the day of the month it was done:
 *
 *   - FAA Order 8300.10 (Airworthiness Inspector's Handbook), as restated in
 *     CASA Airworthiness Bulletin "Calendar based airworthiness directives":
 *     "a calendar month is the period from the first day of the month to the
 *     last day of the month"; a task done June 5 on a 12-month interval is not
 *     due until 30 June the next year.
 *     https://www.casa.gov.au/index.php/aircraft/airworthiness/airworthiness-bulletins/certification-calendar-based-airworthiness-directives
 *   - FAA Office of the Chief Counsel letter on flight reviews (§61.56, also
 *     "calendar months"): valid through the end of the month.
 *     https://www.faa.gov/media/13151
 *   - FAA CertAlert 10-01 (Part 139) applies "consecutive calendar months" the
 *     same way: a Jan 15 event + 12 months ends Jan 31 of the following year.
 *     https://www.faa.gov/sites/faa.gov/files/airports/airport_safety/certalerts/cert1001.pdf
 *
 * Therefore: done any day in March 2026 + 12 calendar months => current through
 * 31 March 2027 and overdue on 1 April 2027. Leap years fall out naturally:
 * done Feb 2027 + 12 => through 29 Feb 2028.
 *
 * Intervals stated in plain "days" (§91.171's 30 days) or plain "months"
 * (common in ADs and manufacturer items) are NOT rounded to month end; see
 * `addDays` and `addMonthsClamped`.
 *
 * ---------------------------------------------------------------------------
 * STATUS
 * ---------------------------------------------------------------------------
 *   overdue        red     the due date has passed or the due tach is exceeded
 *   due_soon       yellow  <= 30 days left on a date, or <= 10 hours left
 *   ok             green
 *   not_applicable gray    with a `reason` (e.g. VFR-only aircraft => no §91.411)
 *   unknown        gray    the owner has not entered enough data yet
 *
 * A due date is the LAST day the item is current, inclusive: on the due date
 * itself daysRemaining = 0 and the item is due_soon, the next day it is overdue.
 * A due tach is likewise inclusive: at exactly the due tach hoursRemaining = 0.
 *
 * Projected dates for hours-based items use average hours per month and are
 * informational only: status is always computed from the facts the owner
 * entered (dates and tach), never from a forecast.
 */

export const ENGINE_VERSION = '1.0.0';

/** Legal framing shown everywhere results are shown. Do not remove. */
export const DISCLAIMER =
  'TailBook organizes the dates and times you enter; it does not inspect your aircraft ' +
  'or certify airworthiness. Your A&P/IA and the pilot in command determine airworthiness ' +
  '(14 CFR §91.3, §91.7, §91.403). Always verify against your logbooks.';

export const THRESHOLDS = Object.freeze({
  /** A date-based item with this many days left (or fewer) is yellow. */
  dueSoonDays: 30,
  /** An hours-based item with this many hours left (or fewer) is yellow. */
  dueSoonHours: 10,
  /** §91.409(b) overfly allowance, hours, en route to an inspection. */
  hundredHourOverfly: 10,
});

export const STATUS = Object.freeze({
  OVERDUE: 'overdue',
  DUE_SOON: 'due_soon',
  OK: 'ok',
  NOT_APPLICABLE: 'not_applicable',
  UNKNOWN: 'unknown',
});

export const STATUS_COLOR = Object.freeze({
  overdue: 'red',
  due_soon: 'yellow',
  ok: 'green',
  not_applicable: 'gray',
  unknown: 'gray',
});

/**
 * Which operations an item governs (what an overdue item affects).
 *   all          the item applies to every flight
 *   ifr          only IFR operations (in controlled airspace / by VOR reference)
 *   hire         only carrying persons for hire or flight instruction for hire
 *   transponder  only use of the transponder
 *   advisory     not a regulatory limit (oil change, owner-defined items)
 */
export const SCOPE = Object.freeze({
  ALL: 'all',
  IFR: 'ifr',
  HIRE: 'hire',
  TRANSPONDER: 'transponder',
  ADVISORY: 'advisory',
});

const ECFR = (part, section) =>
  `https://www.ecfr.gov/current/title-14/part-${part}/section-${part}.${section}`;

/** The rule catalog. `rule` is the plain-English text shown to owners. */
export const RULES = Object.freeze({
  annual: {
    name: 'Annual inspection',
    citation: '14 CFR §91.409(a)',
    url: ECFR(91, 409),
    rule: 'Required within the preceding 12 calendar months. Done any day in a month, it is good through the last day of that month next year.',
    scope: SCOPE.ALL,
    regulatory: true,
  },
  hundredHour: {
    name: '100-hour inspection',
    citation: '14 CFR §91.409(b)',
    url: ECFR(91, 409),
    rule: 'Only if the aircraft carries people for hire or is provided for flight instruction for hire: inspected within the preceding 100 hours. You may exceed 100 by up to 10 hours only to fly to where the inspection will be done, and that excess counts against the next 100 hours. An annual also satisfies it.',
    scope: SCOPE.HIRE,
    regulatory: true,
  },
  pitotStatic: {
    name: 'Altimeter & pitot-static',
    citation: '14 CFR §91.411',
    url: ECFR(91, 411),
    rule: 'Required for IFR in controlled airspace: static system, altimeter and automatic altitude reporting tested within the preceding 24 calendar months.',
    scope: SCOPE.IFR,
    regulatory: true,
  },
  transponder: {
    name: 'Transponder',
    citation: '14 CFR §91.413',
    url: ECFR(91, 413),
    rule: 'An ATC transponder may be used only if tested and inspected within the preceding 24 calendar months.',
    scope: SCOPE.TRANSPONDER,
    regulatory: true,
  },
  eltInspection: {
    name: 'ELT inspection',
    citation: '14 CFR §91.207(d)',
    url: ECFR(91, 207),
    rule: 'The ELT must be inspected within 12 calendar months after the last inspection.',
    scope: SCOPE.ALL,
    regulatory: true,
  },
  eltBattery: {
    name: 'ELT battery',
    citation: '14 CFR §91.207(c)',
    url: ECFR(91, 207),
    rule: 'Replace (or recharge) when the transmitter has been used more than 1 cumulative hour, or when 50% of the battery’s useful life has expired: the expiration date marked on the ELT.',
    scope: SCOPE.ALL,
    regulatory: true,
  },
  vorCheck: {
    name: 'VOR check',
    citation: '14 CFR §91.171',
    url: ECFR(91, 171),
    rule: 'For IFR using VOR navigation, the VOR equipment must have been checked within the preceding 30 days.',
    scope: SCOPE.IFR,
    regulatory: true,
  },
  registration: {
    name: 'Aircraft registration',
    citation: '14 CFR §47.40',
    url: ECFR(47, 40),
    rule: 'A registration certificate expires 7 years after the last day of the month in which it was issued. Renewal may be filed in the 6 months before expiration.',
    scope: SCOPE.ALL,
    regulatory: true,
  },
  oilChange: {
    name: 'Oil change',
    citation: 'Engine manufacturer recommendation',
    url: null,
    rule: 'By hours, by calendar time, or whichever comes first, per your engine maker or your A&P.',
    scope: SCOPE.ADVISORY,
    regulatory: false,
  },
  ad: {
    name: 'Airworthiness Directive',
    citation: '14 CFR §39.7',
    url: ECFR(39, 7),
    rule: 'No person may operate an aircraft that does not meet the requirements of an applicable AD. Recurring ADs are tracked by hours, calendar time, or whichever comes first.',
    scope: SCOPE.ALL,
    regulatory: true,
  },
  custom: {
    name: 'Custom item',
    citation: 'Owner-defined',
    url: null,
    rule: 'Tracked by hours, calendar time, or whichever comes first.',
    scope: SCOPE.ADVISORY,
    regulatory: false,
  },
});

// ===========================================================================
// Civil-date arithmetic (pure, timezone-free)
// ===========================================================================

/** Gregorian leap year. */
export function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

/** Days in month `m` (1-12) of year `y`. */
export function daysInMonth(y, m) {
  return [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * Parse "YYYY-MM-DD", or "YYYY-MM" (resolved to the LAST day of that month,
 * which is how month-only sticker dates such as an ELT battery "EXP 03/2027"
 * are read). Returns {y, m, d}. Throws on anything invalid.
 */
export function parseDate(s) {
  if (typeof s !== 'string') throw new TypeError(`Invalid date: ${s}`);
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(s.trim());
  if (!match) throw new RangeError(`Invalid date: ${s}`);
  const y = Number(match[1]);
  const m = Number(match[2]);
  if (m < 1 || m > 12) throw new RangeError(`Invalid month in date: ${s}`);
  const d = match[3] === undefined ? daysInMonth(y, m) : Number(match[3]);
  if (d < 1 || d > daysInMonth(y, m)) throw new RangeError(`Invalid day in date: ${s}`);
  return { y, m, d };
}

/** Normalize "YYYY-MM" or "YYYY-MM-DD" to "YYYY-MM-DD". */
export function normalizeDate(s) {
  const { y, m, d } = parseDate(s);
  return formatDate(y, m, d);
}

export function formatDate(y, m, d) {
  return `${String(y).padStart(4, '0')}-${pad2(m)}-${pad2(d)}`;
}

/** Days since 1970-01-01 for a civil date (proleptic Gregorian). */
export function toDayNumber(s) {
  const { y, m, d } = parseDate(s);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

/** Inverse of toDayNumber. */
export function fromDayNumber(n) {
  const dt = new Date(n * 86400000);
  return formatDate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

/** Calendar days from a to b (positive if b is later). */
export function daysBetween(a, b) {
  return toDayNumber(b) - toDayNumber(a);
}

export function addDays(s, n) {
  return fromDayNumber(toDayNumber(s) + n);
}

/** Last day of the month that is `n` months after the month of `s`. */
export function endOfCalendarMonths(s, n) {
  const { y, m } = parseDate(s);
  const idx = y * 12 + (m - 1) + n;
  const ny = Math.floor(idx / 12);
  const nm = (idx % 12) + 1;
  return formatDate(ny, nm, daysInMonth(ny, nm));
}

/**
 * Same day-of-month `n` months later, clamped to the month's last day
 * (Jan 31 + 1 month => Feb 28/29). Used for plain "months" intervals (many
 * ADs and manufacturer items), which are anniversaries, not calendar months.
 * This is the conservative reading: never later than the calendar-month one.
 */
export function addMonthsClamped(s, n) {
  const { y, m, d } = parseDate(s);
  const idx = y * 12 + (m - 1) + n;
  const ny = Math.floor(idx / 12);
  const nm = (idx % 12) + 1;
  return formatDate(ny, nm, Math.min(d, daysInMonth(ny, nm)));
}

/** Earlier of two optional dates. */
function minDate(a, b) {
  if (!a) return b ?? null;
  if (!b) return a;
  return toDayNumber(a) <= toDayNumber(b) ? a : b;
}

/** Hours are kept to 0.1 h, as tach and Hobbs meters read. */
export function roundHours(h) {
  return Math.round(h * 10) / 10;
}

const AVG_DAYS_PER_MONTH = 365.25 / 12;

/**
 * Date on which `hoursRemaining` will be used up at `avgHoursPerMonth`.
 * Floors to whole days so the projection never lands after the real event.
 */
export function projectDate(asOf, hoursRemaining, avgHoursPerMonth) {
  if (!(avgHoursPerMonth > 0) || hoursRemaining == null || hoursRemaining < 0) return null;
  const perDay = avgHoursPerMonth / AVG_DAYS_PER_MONTH;
  return addDays(asOf, Math.floor(hoursRemaining / perDay));
}

// ===========================================================================
// Status of one item given its limits
// ===========================================================================

const SEVERITY = { overdue: 4, unknown: 3, due_soon: 2, ok: 1, not_applicable: 0 };

function worse(a, b) {
  return SEVERITY[a] >= SEVERITY[b] ? a : b;
}

function statusForDays(daysRemaining) {
  if (daysRemaining < 0) return STATUS.OVERDUE;
  if (daysRemaining <= THRESHOLDS.dueSoonDays) return STATUS.DUE_SOON;
  return STATUS.OK;
}

function statusForHours(hoursRemaining) {
  if (hoursRemaining < 0) return STATUS.OVERDUE;
  if (hoursRemaining <= THRESHOLDS.dueSoonHours) return STATUS.DUE_SOON;
  return STATUS.OK;
}

/**
 * Evaluate an item that has a calendar limit, an hours limit, or both
 * (whichever comes first: the worse status wins and the earlier date is the
 * effective due date).
 */
function evaluateLimits(ctx, { dueDate = null, dueTach = null }) {
  const out = {
    status: STATUS.OK,
    dueDate,
    dueTach: dueTach == null ? null : roundHours(dueTach),
    daysRemaining: null,
    hoursRemaining: null,
    projectedDate: null,
    effectiveDate: null,
    governedBy: null,
  };
  let dateStatus = null;
  let hoursStatus = null;

  if (dueDate) {
    out.daysRemaining = daysBetween(ctx.asOf, dueDate);
    dateStatus = statusForDays(out.daysRemaining);
  }
  if (dueTach != null) {
    if (ctx.currentTach == null) {
      hoursStatus = STATUS.UNKNOWN;
    } else {
      out.hoursRemaining = roundHours(dueTach - ctx.currentTach);
      hoursStatus = statusForHours(out.hoursRemaining);
      out.projectedDate = projectDate(ctx.asOf, out.hoursRemaining, ctx.avgHoursPerMonth);
    }
  }

  if (dateStatus && hoursStatus) {
    out.status = worse(dateStatus, hoursStatus);
    const projected = out.projectedDate;
    out.effectiveDate = minDate(dueDate, projected);
    if (SEVERITY[hoursStatus] > SEVERITY[dateStatus]) out.governedBy = 'hours';
    else if (SEVERITY[dateStatus] > SEVERITY[hoursStatus]) out.governedBy = 'date';
    else out.governedBy = projected && toDayNumber(projected) < toDayNumber(dueDate) ? 'hours' : 'date';
  } else if (dateStatus) {
    out.status = dateStatus;
    out.effectiveDate = dueDate;
    out.governedBy = 'date';
  } else if (hoursStatus) {
    out.status = hoursStatus;
    out.effectiveDate = out.projectedDate;
    out.governedBy = 'hours';
  } else {
    out.status = STATUS.UNKNOWN;
  }
  return out;
}

// ===========================================================================
// Item builders
// ===========================================================================

function baseItem(id, ruleKey, overrides = {}) {
  const r = RULES[ruleKey];
  return {
    id,
    kind: ruleKey,
    name: overrides.name ?? r.name,
    citation: overrides.citation ?? r.citation,
    url: overrides.url !== undefined ? overrides.url : r.url,
    rule: overrides.rule ?? r.rule,
    scope: overrides.scope ?? r.scope,
    regulatory: overrides.regulatory ?? r.regulatory,
    status: STATUS.UNKNOWN,
    color: STATUS_COLOR.unknown,
    dueDate: null,
    dueTach: null,
    daysRemaining: null,
    hoursRemaining: null,
    projectedDate: null,
    effectiveDate: null,
    governedBy: null,
    reason: null,
    message: '',
    notes: [],
  };
}

function finish(item) {
  item.color = STATUS_COLOR[item.status];
  if (!item.message) item.message = describe(item);
  return item;
}

function notApplicable(item, reason) {
  item.status = STATUS.NOT_APPLICABLE;
  item.reason = reason;
  item.message = `Not applicable: ${reason}`;
  return finish(item);
}

function unknown(item, reason) {
  item.status = STATUS.UNKNOWN;
  item.reason = reason;
  item.message = reason;
  return finish(item);
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

function fmtHours(h) {
  return h.toFixed(1);
}

/** Owner-facing one-line summary of an evaluated item. */
function describe(item) {
  const parts = [];
  if (item.dueDate) {
    const d = item.daysRemaining;
    if (d < 0) parts.push(`Overdue since ${addDays(item.dueDate, 1)} (${plural(-d, 'day')} ago)`);
    else if (d === 0) parts.push(`Due today (${item.dueDate}), last day current`);
    else parts.push(`Due by ${item.dueDate} (${plural(d, 'day')})`);
  }
  if (item.dueTach != null) {
    const h = item.hoursRemaining;
    if (h == null) parts.push(`Due at ${fmtHours(item.dueTach)} tach (enter current tach)`);
    else if (h < 0) parts.push(`Overdue: ${fmtHours(-h)} hrs past ${fmtHours(item.dueTach)} tach`);
    else {
      let s = `Due at ${fmtHours(item.dueTach)} tach (${fmtHours(h)} hrs left`;
      if (item.projectedDate) s += `, about ${item.projectedDate} at your pace`;
      parts.push(`${s})`);
    }
  }
  if (parts.length === 2) return `${parts[0]}; ${parts[1].replace(/^Due at/, 'or at')}, whichever comes first`;
  return parts.join('');
}

function applyLimits(item, ctx, limits) {
  Object.assign(item, evaluateLimits(ctx, limits));
  return finish(item);
}

/** Validate a done/issue date: present, parseable and not after asOf. */
function readPastDate(value, ctx, label) {
  if (value == null || value === '') return { missing: true };
  let date;
  try {
    date = normalizeDate(value);
  } catch {
    return { error: `${label} "${value}" is not a valid date.` };
  }
  if (toDayNumber(date) > toDayNumber(ctx.asOf)) {
    return { error: `${label} ${date} is in the future. Check the date.` };
  }
  return { date };
}

function readFutureOrAnyDate(value, label) {
  if (value == null || value === '') return { missing: true };
  try {
    return { date: normalizeDate(value) };
  } catch {
    return { error: `${label} "${value}" is not a valid date.` };
  }
}

function num(v) {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Calendar-month item: annual, pitot-static, transponder, ELT inspection. */
function calendarItem(id, ruleKey, months, entry, ctx, label) {
  const item = baseItem(id, ruleKey);
  const r = readPastDate(entry?.lastDone, ctx, label);
  if (r.missing) return unknown(item, `Enter the date of the last ${label.toLowerCase()}.`);
  if (r.error) return unknown(item, r.error);
  item.lastDone = r.date;
  return applyLimits(item, ctx, { dueDate: endOfCalendarMonths(r.date, months) });
}

function evalAnnual(p, ctx) {
  return calendarItem('annual', 'annual', 12, p.annual, ctx, 'Annual inspection');
}

/**
 * §91.409(b) 100-hour inspection.
 *
 * Inputs (`p.hundredHour`):
 *   lastDoneTach      tach at the last 100-hour inspection
 *   previousDueTach   optional: the limit that was in force when it was done.
 *                     If the inspection was done late (inside the 10-hour
 *                     overfly allowance), the excess counts against the next
 *                     interval, so next due = previousDueTach + 100, not
 *                     lastDoneTach + 100. Done early => no credit carried.
 * An annual inspection also satisfies §91.409(b): if `p.annual.tach` is later
 * than the 100-hour tach, the annual resets the interval.
 *
 * Status: over the limit is OVERDUE (red) even inside the 10-hour allowance,
 * because the allowance only permits flying to the inspection, not for-hire
 * flying. The item reports `overflyHoursRemaining` for that ferry case.
 */
function evalHundredHour(p, ctx) {
  const item = baseItem('hundredHour', 'hundredHour');
  if (!p.aircraft?.forHire) {
    return notApplicable(item, 'Aircraft is not used to carry people for hire or for flight instruction for hire (§91.409(b)).');
  }
  const hh = p.hundredHour ?? {};
  let lastTach = num(hh.lastDoneTach);
  let prevDue = num(hh.previousDueTach);
  const annualTach = num(p.annual?.tach);
  if (annualTach != null && (lastTach == null || annualTach > lastTach)) {
    lastTach = annualTach;
    prevDue = null; // an annual starts a fresh interval
    item.notes.push('Interval measured from the last annual, which also satisfies §91.409(b).');
  }
  if (lastTach == null) return unknown(item, 'Enter the tach time at the last 100-hour inspection.');

  let dueTach = lastTach + 100;
  if (prevDue != null && lastTach > prevDue) {
    const excess = roundHours(lastTach - prevDue);
    dueTach = prevDue + 100;
    item.notes.push(
      `Last inspection was ${fmtHours(excess)} hrs past its limit; that excess counts against this interval (§91.409(b)).`,
    );
    if (excess > THRESHOLDS.hundredHourOverfly) {
      item.notes.push(`That exceeded the ${THRESHOLDS.hundredHourOverfly}-hour overfly allowance. Review with your IA.`);
    }
  }
  item.lastDoneTach = roundHours(lastTach);
  applyLimits(item, ctx, { dueTach });
  if (item.hoursRemaining != null && item.hoursRemaining < 0) {
    const over = -item.hoursRemaining;
    const left = roundHours(THRESHOLDS.hundredHourOverfly - over);
    item.overflyHoursRemaining = Math.max(0, left);
    item.notes.push(
      left >= 0
        ? `Within the 10-hour allowance (${fmtHours(left)} hrs left) ONLY to fly to a place where the inspection can be done. No for-hire flights.`
        : 'Beyond the 10-hour overfly allowance.',
    );
  }
  return item;
}

function evalPitotStatic(p, ctx) {
  if (!p.aircraft?.ifr) {
    return notApplicable(baseItem('pitotStatic', 'pitotStatic'), 'Not flown IFR in controlled airspace (§91.411 applies only to IFR).');
  }
  return calendarItem('pitotStatic', 'pitotStatic', 24, p.pitotStatic, ctx, 'Altimeter/pitot-static check');
}

function evalTransponder(p, ctx) {
  if (p.aircraft?.hasTransponder === false) {
    return notApplicable(baseItem('transponder', 'transponder'), 'No transponder installed.');
  }
  return calendarItem('transponder', 'transponder', 24, p.transponder, ctx, 'Transponder check');
}

function evalEltInspection(p, ctx) {
  if (p.aircraft?.hasElt === false) {
    return notApplicable(baseItem('eltInspection', 'eltInspection'), 'Owner indicates no ELT is required (see the §91.207(f) exceptions).');
  }
  return calendarItem('eltInspection', 'eltInspection', 12, p.eltInspection, ctx, 'ELT inspection');
}

/**
 * §91.207(c) ELT battery. The owner enters the replacement date marked on the
 * ELT (set by the installer at 50% of the battery's useful life). A month-only
 * date ("2027-03") is read as the end of that month, matching how the marked
 * date is usually printed. Also overdue if cumulative transmitter use > 1 hour.
 */
function evalEltBattery(p, ctx) {
  const item = baseItem('eltBattery', 'eltBattery');
  if (p.aircraft?.hasElt === false) {
    return notApplicable(item, 'Owner indicates no ELT is required (see the §91.207(f) exceptions).');
  }
  const e = p.eltBattery ?? {};
  const use = num(e.cumulativeUseHours);
  const r = readFutureOrAnyDate(e.expires, 'ELT battery date');
  if (use != null && use > 1) {
    item.status = STATUS.OVERDUE;
    if (r.date) {
      item.dueDate = r.date;
      item.daysRemaining = daysBetween(ctx.asOf, r.date);
    }
    item.message = `Transmitter used ${fmtHours(use)} cumulative hrs (more than 1): replace or recharge the battery now (§91.207(c)(1)).`;
    return finish(item);
  }
  if (r.missing) return unknown(item, 'Enter the battery replacement date marked on the ELT.');
  if (r.error) return unknown(item, r.error);
  return applyLimits(item, ctx, { dueDate: r.date });
}

/**
 * §91.171 VOR check, "within the preceding 30 days". Plain days, not calendar
 * months: checked on day D, the check is still within the preceding 30 days
 * on D+30 (last day current) and lapses on D+31.
 */
function evalVorCheck(p, ctx) {
  const item = baseItem('vorCheck', 'vorCheck');
  if (!p.aircraft?.ifr) return notApplicable(item, 'Not flown IFR (§91.171 applies only to IFR using VOR navigation).');
  if (p.aircraft?.usesVor === false) return notApplicable(item, 'No VOR receiver used for IFR navigation.');
  const r = readPastDate(p.vorCheck?.lastDone, ctx, 'VOR check');
  if (r.missing) return unknown(item, 'Enter the date of your last VOR check.');
  if (r.error) return unknown(item, r.error);
  item.lastDone = r.date;
  return applyLimits(item, ctx, { dueDate: addDays(r.date, 30) });
}

/**
 * §47.40 registration: expires 7 years after the last day of the month of
 * issue (rule effective 2023-01-23; FAA direct final rule, 87 FR 68854 and
 * 88 FR 2833). Enter `expires` from the certificate/FAA registry, or `issued`.
 * The certificate is treated as valid through the expiration date.
 */
function evalRegistration(p, ctx) {
  const item = baseItem('registration', 'registration');
  const reg = p.registration ?? {};
  let dueDate = null;
  const ex = readFutureOrAnyDate(reg.expires, 'Registration expiration');
  if (ex.error) return unknown(item, ex.error);
  if (ex.date) dueDate = ex.date;
  else {
    const is = readPastDate(reg.issued, ctx, 'Registration issue date');
    if (is.error) return unknown(item, is.error);
    if (is.missing) return unknown(item, 'Enter the registration expiration date (on the certificate or the FAA registry).');
    dueDate = endOfCalendarMonths(is.date, 84);
  }
  applyLimits(item, ctx, { dueDate });
  if (item.daysRemaining != null && item.daysRemaining >= 0 && toDayNumber(addMonthsClamped(dueDate, -6)) <= toDayNumber(ctx.asOf)) {
    item.notes.push('Renewal window is open: file AC Form 8050-1B now (§47.40(b)).');
  }
  return item;
}

/**
 * Generic interval item used by oil change, custom items and ADs.
 *   lastDoneDate, lastDoneTach      when it was last done
 *   intervalHours                   hours interval
 *   intervalCalendarMonths          calendar-month interval (ends at month end)
 *   intervalMonths                  plain-month interval (anniversary, clamped)
 *   intervalDays                    day interval
 *   dueDate, dueTach                explicit limits (e.g. a one-time AD)
 * Any combination may be given; the item is due at whichever comes first.
 */
function intervalLimits(entry, ctx) {
  const errors = [];
  const limits = {};
  const dateRead = readPastDate(entry.lastDoneDate, ctx, 'Last-done date');
  if (dateRead.error) errors.push(dateRead.error);
  const lastDate = dateRead.date ?? null;
  const lastTach = num(entry.lastDoneTach);
  const iH = num(entry.intervalHours);
  const iCM = num(entry.intervalCalendarMonths);
  const iM = num(entry.intervalMonths);
  const iD = num(entry.intervalDays);

  const dates = [];
  if (lastDate) {
    if (iCM) dates.push(endOfCalendarMonths(lastDate, iCM));
    if (iM) dates.push(addMonthsClamped(lastDate, iM));
    if (iD) dates.push(addDays(lastDate, iD));
  }
  if (entry.dueDate) {
    const r = readFutureOrAnyDate(entry.dueDate, 'Due date');
    if (r.error) errors.push(r.error);
    else dates.push(r.date);
  }
  const tachs = [];
  if (iH && lastTach != null) tachs.push(lastTach + iH);
  const explicitTach = num(entry.dueTach);
  if (explicitTach != null) tachs.push(explicitTach);

  const needsDate = (iCM || iM || iD) && !lastDate;
  const needsTach = iH && lastTach == null;
  if (dates.length) limits.dueDate = dates.reduce((a, b) => minDate(a, b));
  if (tachs.length) limits.dueTach = Math.min(...tachs);
  return { limits, errors, needsDate, needsTach, lastDate, lastTach };
}

function evalIntervalItem(item, entry, ctx) {
  const { limits, errors, needsDate, needsTach, lastDate, lastTach } = intervalLimits(entry, ctx);
  if (errors.length) return unknown(item, errors.join(' '));
  if (lastDate) item.lastDone = lastDate;
  if (lastTach != null) item.lastDoneTach = roundHours(lastTach);
  if (limits.dueDate == null && limits.dueTach == null) {
    return unknown(item, 'Enter when it was last done and its interval.');
  }
  applyLimits(item, ctx, limits);
  // A whichever-first item missing one side cannot be called OK.
  if ((needsDate || needsTach) && item.status !== STATUS.OVERDUE) {
    item.status = STATUS.UNKNOWN;
    item.reason = needsDate ? 'Enter the last-done date to check the calendar limit.' : 'Enter the last-done tach to check the hours limit.';
    item.message = `${item.message}. ${item.reason}`;
    finish(item);
  }
  return item;
}

function evalOilChange(p, ctx) {
  if (!p.oilChange) return null;
  const item = baseItem('oilChange', 'oilChange');
  return evalIntervalItem(item, p.oilChange, ctx);
}

function slug(s) {
  return String(s).trim().toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-|-$/g, '') || 'item';
}

function evalCustom(entry, index, ctx) {
  const id = `custom:${entry.id ?? slug(entry.name ?? index)}`;
  const item = baseItem(id, 'custom', {
    name: entry.name ?? `Custom item ${index + 1}`,
    citation: entry.citation,
    regulatory: entry.regulatory === true,
    scope: entry.regulatory === true ? SCOPE.ALL : SCOPE.ADVISORY,
    rule: entry.rule,
  });
  return evalIntervalItem(item, entry, ctx);
}

function evalAd(entry, index, ctx) {
  const num_ = entry.adNumber ?? entry.id ?? String(index + 1);
  const item = baseItem(`ad:${slug(num_)}`, 'ad', {
    name: `AD ${num_}${entry.title ? `: ${entry.title}` : ''}`,
    citation: `AD ${num_} (14 CFR §39.7)`,
    url: entry.url ?? RULES.ad.url,
  });
  if (entry.applicable === false) return notApplicable(item, entry.reason ?? 'Owner/IA determined this AD is not applicable.');
  if (entry.recurring === false && entry.complied === true) {
    item.status = STATUS.OK;
    item.message = `One-time AD complied with${entry.lastDoneDate ? ` on ${normalizeDate(entry.lastDoneDate)}` : ''}.`;
    return finish(item);
  }
  return evalIntervalItem(item, entry, ctx);
}

// ===========================================================================
// Summary
// ===========================================================================

/** What an overdue item with a limited scope affects (neutral wording, not a verdict). */
const AFFECTS_TEXT = {
  [SCOPE.IFR]: 'IFR operations',
  [SCOPE.HIRE]: 'For-hire operations',
  [SCOPE.TRANSPONDER]: 'Transponder use',
};

/**
 * Overall "All items current?" summary of the regulatory items.
 *
 * Wording rule: TailBook never issues an airworthiness verdict; that is the
 * A&P/IA's and the PIC's call. The summary only reports whether the items the
 * owner entered are current, and must always be shown next to DISCLAIMER.
 *
 *   overdue     an item that applies to every flight (scope "all") is overdue
 *   incomplete  an item with scope "all" is unknown, so we can't say
 *   limited     only IFR / for-hire / transponder items are overdue
 *   current     no regulatory item is overdue or unknown
 *
 * `allCurrent` is true only for "current", false for "overdue"/"limited",
 * null for "incomplete". `affects` lists what the limited items touch.
 */
export function summarize(items, asOf) {
  const counts = { overdue: 0, due_soon: 0, ok: 0, not_applicable: 0, unknown: 0 };
  for (const it of items) counts[it.status] += 1;

  const reg = items.filter((i) => i.regulatory);
  const everyFlight = reg.filter((i) => i.scope === SCOPE.ALL && i.status === STATUS.OVERDUE);
  const missing = reg.filter((i) => i.scope === SCOPE.ALL && i.status === STATUS.UNKNOWN);
  const limiting = reg.filter((i) => i.scope !== SCOPE.ALL && i.status === STATUS.OVERDUE);
  const affects = [...new Set(limiting.map((i) => AFFECTS_TEXT[i.scope]))];
  const attention = items.filter((i) => !i.regulatory && i.status === STATUS.OVERDUE).map((i) => i.id);

  let status;
  let allCurrent;
  let headline;
  const names = (arr) => arr.map((i) => i.name).join(', ');
  if (everyFlight.length) {
    status = 'overdue';
    allCurrent = false;
    headline = `Not all items current: ${names([...everyFlight, ...limiting])} overdue.`;
  } else if (missing.length) {
    status = 'incomplete';
    allCurrent = null;
    headline = `Can't tell yet: enter ${names(missing)}.`;
  } else if (limiting.length) {
    status = 'limited';
    allCurrent = false;
    headline = `Not all items current: ${names(limiting)} overdue (affects ${affects.join(', ').toLowerCase()}).`;
  } else {
    status = 'current';
    allCurrent = true;
    headline = 'All items current, based on the dates you entered.';
  }
  if (counts.due_soon) headline += ` ${plural(counts.due_soon, 'item')} due soon.`;

  // Next due: the earliest upcoming effective date (projected for hours items).
  let nextDue = null;
  for (const it of items) {
    if (it.status !== STATUS.OK && it.status !== STATUS.DUE_SOON) continue;
    if (!it.effectiveDate) continue;
    const days = daysBetween(asOf, it.effectiveDate);
    if (!nextDue || days < nextDue.daysRemaining) {
      nextDue = { id: it.id, name: it.name, date: it.effectiveDate, daysRemaining: days, projected: it.governedBy === 'hours' };
    }
  }

  return { status, allCurrent, headline, affects, attention, counts, nextDue };
}

// ===========================================================================
// Public entry point
// ===========================================================================

/**
 * Evaluate an aircraft profile.
 *
 * @param {object} profile
 * @param {string} profile.asOf  "Today" as YYYY-MM-DD (required; the engine has no clock).
 * @param {object} profile.aircraft  { ifr, forHire, hasTransponder=true, hasElt=true,
 *                                     usesVor=true, currentTach, avgHoursPerMonth }
 * @param {object} [profile.annual]        { lastDone, tach? }
 * @param {object} [profile.hundredHour]   { lastDoneTach, previousDueTach? }
 * @param {object} [profile.pitotStatic]   { lastDone }
 * @param {object} [profile.transponder]   { lastDone }
 * @param {object} [profile.eltInspection] { lastDone }
 * @param {object} [profile.eltBattery]    { expires: "YYYY-MM[-DD]", cumulativeUseHours? }
 * @param {object} [profile.vorCheck]      { lastDone }
 * @param {object} [profile.registration]  { expires } or { issued }
 * @param {object} [profile.oilChange]     interval entry (see intervalLimits)
 * @param {object[]} [profile.customItems] interval entries + { id, name, regulatory?, citation? }
 * @param {object[]} [profile.ads]         interval entries + { adNumber, title, recurring?, complied?, applicable? }
 * @returns {{engineVersion:string, asOf:string, items:object[], summary:object, disclaimer:string}}
 */
export function evaluate(profile) {
  if (!profile || !profile.asOf) throw new TypeError('evaluate(profile): profile.asOf (YYYY-MM-DD) is required.');
  const asOf = normalizeDate(profile.asOf);
  const a = profile.aircraft ?? {};
  const ctx = {
    asOf,
    currentTach: num(a.currentTach),
    avgHoursPerMonth: num(a.avgHoursPerMonth),
  };

  const items = [
    evalAnnual(profile, ctx),
    evalHundredHour(profile, ctx),
    evalPitotStatic(profile, ctx),
    evalTransponder(profile, ctx),
    evalEltInspection(profile, ctx),
    evalEltBattery(profile, ctx),
    evalVorCheck(profile, ctx),
    evalRegistration(profile, ctx),
    evalOilChange(profile, ctx),
    ...(profile.ads ?? []).map((e, i) => evalAd(e, i, ctx)),
    ...(profile.customItems ?? []).map((e, i) => evalCustom(e, i, ctx)),
  ].filter(Boolean);

  return {
    engineVersion: ENGINE_VERSION,
    asOf,
    items,
    summary: summarize(items, asOf),
    disclaimer: DISCLAIMER,
  };
}

/** Items sorted for display: red, yellow, unknown, green, n/a; then by date. */
export function sortForBoard(items) {
  const order = { overdue: 0, due_soon: 1, unknown: 2, ok: 3, not_applicable: 4 };
  const far = 1e9;
  return [...items].sort((x, y) => {
    const o = order[x.status] - order[y.status];
    if (o) return o;
    const dx = x.effectiveDate ? toDayNumber(x.effectiveDate) : x.dueDate ? toDayNumber(x.dueDate) : far;
    const dy = y.effectiveDate ? toDayNumber(y.effectiveDate) : y.dueDate ? toDayNumber(y.dueDate) : far;
    return dx - dy;
  });
}
