/**
 * TailBook .ics (iCalendar, RFC 5545) export.
 *
 * Pure: takes an `evaluate()` result and returns calendar text. One all-day
 * event per upcoming item, placed on the item's last current day, with
 * reminders (VALARM) before it. Hours-based items use their projected date
 * and say so. Overdue, unknown and not-applicable items are skipped.
 */

import { DISCLAIMER, addDays, daysBetween } from './tailbook-engine.js';

/** RFC 5545 §3.3.11 TEXT escaping. */
export function escapeText(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

/** RFC 5545 §3.1 line folding at 75 octets (UTF-8 aware). */
export function foldLine(line) {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out = [];
  let cur = '';
  let curLen = 0;
  for (const ch of line) {
    const len = enc.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (curLen + len > limit) {
      out.push(cur);
      cur = '';
      curLen = 0;
    }
    cur += ch;
    curLen += len;
  }
  out.push(cur);
  return out.join('\r\n ');
}

const compact = (d) => d.replace(/-/g, '');

/**
 * @param {object} result  return value of evaluate()
 * @param {object} [opts]
 * @param {string} [opts.now]          DTSTAMP as an ISO instant, e.g. "2026-10-19T12:00:00Z" (default: asOf at 00:00Z)
 * @param {number[]} [opts.alarmDays]  reminders, days before (default [60, 30, 7])
 * @param {string} [opts.tail]         tail number for event titles, e.g. "N12345"
 * @param {string} [opts.uidDomain]    default "tailbook.app"
 */
export function toICS(result, opts = {}) {
  const alarmDays = opts.alarmDays ?? [60, 30, 7];
  const uidDomain = opts.uidDomain ?? 'tailbook.app';
  const tail = opts.tail ? `${opts.tail} ` : '';
  const stamp = (opts.now ?? `${result.asOf}T00:00:00Z`).replace(/[-:]/g, '').replace(/\.\d+/, '');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TailBook//Airworthiness Due Dates//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(`${tail}TailBook due dates`)}`,
  ];

  for (const it of result.items) {
    if (it.status !== 'ok' && it.status !== 'due_soon') continue;
    const date = it.effectiveDate;
    if (!date) continue;
    const projected = it.governedBy === 'hours';
    const summary = `${tail}${it.name} due${projected ? ' (projected)' : ''}`;
    const desc = [
      `${it.citation}`,
      it.rule,
      it.message,
      projected ? 'Date projected from your average hours per month; the tach limit governs.' : 'Last day current.',
      DISCLAIMER,
    ].join('\n');
    lines.push(
      'BEGIN:VEVENT',
      `UID:${it.id.replace(/[^A-Za-z0-9.-]/g, '-')}-${compact(date)}@${uidDomain}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(date)}`,
      `DTEND;VALUE=DATE:${compact(addDays(date, 1))}`,
      `SUMMARY:${escapeText(summary)}`,
      `DESCRIPTION:${escapeText(desc)}`,
      'TRANSP:TRANSPARENT',
    );
    if (it.url) lines.push(`URL:${it.url}`);
    const daysLeft = daysBetween(result.asOf, date);
    for (const d of alarmDays) {
      if (d > daysLeft) continue; // skip reminders already in the past
      lines.push(
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeText(`${summary} in ${d} days`)}`,
        `TRIGGER:-P${d}D`,
        'END:VALARM',
      );
    }
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
