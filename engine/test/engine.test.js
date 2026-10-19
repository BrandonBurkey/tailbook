// Run: npm test   (or: node --test "engine/test/*.test.js")
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as E from '../tailbook-engine.js';
import { toICS, foldLine, escapeText } from '../ics.js';

const vectors = JSON.parse(readFileSync(new URL('../test-vectors.json', import.meta.url), 'utf8'));

describe('golden vectors: date functions', () => {
  for (const c of vectors.dateCases) {
    test(`${c.fn}(${c.args.join(', ')}) = ${c.expect}`, () => {
      assert.equal(E[c.fn](...c.args), c.expect);
    });
  }
});

/** Compare only the fields the vector constrains. */
function assertSubset(actual, expected, path) {
  for (const [k, v] of Object.entries(expected)) {
    const here = `${path}.${k}`;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      assert.ok(actual[k] && typeof actual[k] === 'object', `${here}: expected object, got ${JSON.stringify(actual[k])}`);
      assertSubset(actual[k], v, here);
    } else {
      assert.deepEqual(actual[k], v, `${here}: expected ${JSON.stringify(v)}, got ${JSON.stringify(actual[k])}`);
    }
  }
}

describe('golden vectors: evaluate()', () => {
  test('at least 40 cases', () => assert.ok(vectors.cases.length >= 40));
  for (const c of vectors.cases) {
    test(`${c.id}: ${c.description}`, () => {
      const r = E.evaluate(c.profile);
      const byId = Object.fromEntries(r.items.map((i) => [i.id, i]));
      for (const [id, exp] of Object.entries(c.expect.items ?? {})) {
        assert.ok(byId[id], `missing item ${id}`);
        assertSubset(byId[id], exp, id);
      }
      if (c.expect.summary) assertSubset(r.summary, c.expect.summary, 'summary');
    });
  }
});

describe('engine invariants', () => {
  const healthy = vectors.cases.find((c) => c.id === 'base-healthy-vfr').profile;

  test('every item carries a citation, rule text and a color matching its status', () => {
    for (const c of vectors.cases) {
      for (const it of E.evaluate(c.profile).items) {
        assert.ok(it.citation, `${c.id}/${it.id} citation`);
        assert.ok(it.rule, `${c.id}/${it.id} rule`);
        assert.equal(it.color, E.STATUS_COLOR[it.status]);
        assert.ok(it.message.length > 0, `${c.id}/${it.id} message`);
        if (it.status === 'not_applicable') assert.ok(it.reason, `${c.id}/${it.id} N/A reason`);
      }
    }
  });

  test('evaluate is pure: same input, same output, input not mutated', () => {
    const copy = structuredClone(healthy);
    assert.deepEqual(E.evaluate(healthy), E.evaluate(healthy));
    assert.deepEqual(healthy, copy);
  });

  test('asOf is required (engine has no clock)', () => {
    assert.throws(() => E.evaluate({ aircraft: {} }), TypeError);
  });

  test('result carries the disclaimer, which names the A&P/IA and PIC', () => {
    const r = E.evaluate(healthy);
    assert.equal(r.disclaimer, E.DISCLAIMER);
    assert.match(E.DISCLAIMER, /A&P\/IA and the pilot in command determine airworthiness/);
  });

  test('calendar-month due date never depends on the day of month done (all of 2026)', () => {
    for (let m = 1; m <= 12; m++) {
      const first = E.endOfCalendarMonths(E.formatDate(2026, m, 1), 12);
      const last = E.endOfCalendarMonths(E.formatDate(2026, m, E.daysInMonth(2026, m)), 12);
      assert.equal(first, last);
      assert.equal(E.addDays(first, 1).slice(8), '01', 'due date is always a month end');
    }
  });

  test('day numbers round-trip across 400 years', () => {
    for (let n = E.toDayNumber('1900-01-01'); n < E.toDayNumber('2300-01-01'); n += 37) {
      assert.equal(E.toDayNumber(E.fromDayNumber(n)), n);
    }
  });

  test('invalid dates are rejected', () => {
    for (const bad of ['2026-02-29', '2026-13-01', '2026-00-10', '26-01-01', '2026/01/01', '']) {
      assert.throws(() => E.parseDate(bad), `${bad}`);
    }
  });

  test('a garbage date makes the item unknown instead of throwing', () => {
    const r = E.evaluate({ ...healthy, annual: { lastDone: 'last spring' } });
    assert.equal(r.items.find((i) => i.id === 'annual').status, 'unknown');
  });

  test('sortForBoard puts red first and N/A last', () => {
    const r = E.evaluate({ ...healthy, annual: { lastDone: '2025-01-01' } });
    const sorted = E.sortForBoard(r.items);
    assert.equal(sorted[0].status, 'overdue');
    assert.equal(sorted.at(-1).status, 'not_applicable');
  });
});

describe('ics export', () => {
  const profile = vectors.cases.find((c) => c.id === 'oil-hours-projected').profile;
  const r = E.evaluate(profile);
  const ics = toICS(r, { now: '2026-10-19T15:04:05Z', tail: 'N12345' });

  test('is a well-formed VCALENDAR with CRLF line endings', () => {
    assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n'));
    assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
    assert.ok(!/[^\r]\n/.test(ics), 'bare LF found');
  });

  test('one all-day event per upcoming item, none for N/A', () => {
    const upcoming = r.items.filter((i) => (i.status === 'ok' || i.status === 'due_soon') && i.effectiveDate);
    assert.equal((ics.match(/BEGIN:VEVENT/g) ?? []).length, upcoming.length);
    assert.match(ics, /DTSTART;VALUE=DATE:20270331\r\nDTEND;VALUE=DATE:20270401/);
    assert.match(ics, /SUMMARY:N12345 Oil change due \(projected\)/);
    assert.match(ics, /DTSTAMP:20261019T150405Z/);
    assert.ok(!/Pitot/i.test(ics.split('BEGIN:VEVENT').slice(1).join('').match(/SUMMARY:[^\r]*/g).join()));
  });

  test('reminders already in the past are omitted', () => {
    // Oil is projected 30 days out: 60-day alarm skipped, 30 and 7 kept.
    const oil = ics.split('BEGIN:VEVENT').find((b) => b.includes('Oil change'));
    assert.ok(!oil.includes('TRIGGER:-P60D'));
    assert.ok(oil.includes('TRIGGER:-P30D') && oil.includes('TRIGGER:-P7D'));
  });

  test('lines are folded at 75 octets and text is escaped', () => {
    for (const line of ics.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75, line);
    assert.equal(escapeText('a,b;c\\d\ne'), 'a\\,b\\;c\\\\d\\ne');
    const folded = foldLine('X'.repeat(200));
    assert.deepEqual(folded.split('\r\n ').map((s) => s.length), [75, 74, 51]);
  });
});
