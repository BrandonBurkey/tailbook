// Static checks on the built landing page. Browser tests: npm run e2e
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildLanding } from '../../scripts/build-landing.mjs';
import { DISCLAIMER, ENGINE_VERSION } from '../../engine/tailbook-engine.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('landing/index.html is up to date with engine + template (run npm run build:landing)', () => {
  assert.equal(html, buildLanding());
});

test('is self-contained: no external scripts or stylesheets', () => {
  assert.ok(!/^\s*<script[^>]*\ssrc=/im.test(html), 'external <script src>');
  assert.ok(!/<link[^>]+rel="stylesheet"/i.test(html), 'external stylesheet');
  assert.ok(!/@import/i.test(html), 'css @import');
});

test('placeholders exist and ship empty', () => {
  assert.match(html, /const STRIPE_PAYMENT_LINK = '';/);
  assert.match(html, /const FORM_ENDPOINT = '';/);
  assert.match(html, /const SNAPSHOT_FORM_URL = '';/);
});

test('analytics hooks fire the experiment events', () => {
  for (const ev of ['checker_completed', 'email_submitted', 'deposit_clicked']) {
    assert.match(html, new RegExp(`track\\('${ev}'`), ev);
  }
  assert.match(html, /function track\(event, props = \{\}\)/);
});

test('no airworthiness verdict wording; summary is "All items current?"', () => {
  assert.ok(!/airworthy today/i.test(html), '"Airworthy today" must not appear');
  // Page copy only: the inlined engine's source comments are not user-facing.
  const page = html.replace(/\/\* ---- Inlined from engine[\s\S]*?end of inlined engine ---- \*\//, '');
  assert.ok(page.length < html.length, 'engine bundle markers found');
  assert.ok(!/always-airworthy/i.test(page), '"Always-Airworthy" must not appear');
  assert.ok(!/(is|plane is) legal\b|legal to fly/i.test(page), 'no "is legal" / "legal to fly" claims');
  assert.match(html, /\$149\/yr for life[^<]*(<\/span>)?<small>\(as long as your subscription stays active\)/);
  assert.match(html, /All items current\?/);
});

test('engine and disclaimer are inlined', () => {
  assert.ok(html.includes(`const ENGINE_VERSION = '${ENGINE_VERSION}'`));
  assert.ok(html.includes('data-disclaimer'));
  assert.ok(html.includes(DISCLAIMER.slice(0, 60)));
});

test('deposit copy: offer code at launch or full refund', () => {
  assert.match(html, /credited via an App Store offer code at launch, or fully refunded/);
});

test('price anchors are labeled as approximate published prices', () => {
  assert.match(html, /Approximate published prices as of Oct 2026/);
  for (const p of ['~$750/yr', '~$1,095/yr', '$49.99/mo', '$299.99', '$199/yr', '$149']) assert.ok(html.includes(p), p);
});
