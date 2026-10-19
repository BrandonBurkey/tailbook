#!/usr/bin/env node
/**
 * Headless-Chromium checks + screenshots for landing/index.html.
 *   npm run e2e
 * Uses the globally installed Playwright (no `playwright install`). Override with
 * PLAYWRIGHT_MODULE=/path/to/playwright and CHROMIUM_PATH=/path/to/chrome if needed.
 */
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import assert from 'node:assert/strict';

const here = dirname(fileURLToPath(import.meta.url));
const landing = join(here, '..');
const shots = join(landing, 'screenshots');
mkdirSync(shots, { recursive: true });

const require = createRequire(import.meta.url);
function loadPlaywright() {
  const candidates = [process.env.PLAYWRIGHT_MODULE, 'playwright', '/opt/node22/lib/node_modules/playwright'].filter(Boolean);
  for (const c of candidates) { try { return require(c); } catch { /* next */ } }
  throw new Error('Playwright not found. Set PLAYWRIGHT_MODULE.');
}
const { chromium } = loadPlaywright();
const exe = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => p && existsSync(p));

const TODAY = '2026-10-19';
const url = `${pathToFileURL(join(landing, 'index.html')).href}?today=${TODAY}&utm_source=e2e&utm_medium=test&utm_campaign=e1`;

const browser = await chromium.launch(exe ? { executablePath: exe } : {});
let failures = 0;
async function step(name, fn) {
  try { await fn(); console.log(`ok   ${name}`); } catch (e) { failures++; console.log(`FAIL ${name}\n     ${e.message}`); }
}
const events = (page) => page.evaluate(() => (window.__tailbookEvents || []).map((e) => e.event));

// ---------------------------------------------------------------- functional
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);

  await step('initial board asks for dates', async () => {
    assert.equal(await page.textContent('#verdictA'), 'Add your dates');
    assert.match(await page.textContent('#verdict .q'), /All items current\?/);
    assert.match(await page.textContent('#verdict .verdict-disc'), /A&P\/IA and the pilot in command determine airworthiness/);
  });

  await step('IFR toggle reveals pitot-static; hire reveals tach fields', async () => {
    assert.equal(await page.isVisible('#pitot'), false);
    await page.click('label[for="ifrY"]');
    assert.equal(await page.isVisible('#pitot'), true);
    await page.click('label[for="hireY"]');
    assert.equal(await page.isVisible('#tach100'), true);
    await page.click('label[for="hireN"]');
  });

  await step('entering dates renders red/yellow board with citations and next due', async () => {
    await page.fill('#annual', '2025-11-05');       // due 2026-11-30, ok
    await page.fill('#transponder', '2024-10-18');  // due 2026-10-31, yellow
    await page.fill('#pitot', '2024-11-02');        // due 2026-11-30, ok
    await page.fill('#eltInsp', '2025-11-05');      // ok
    await page.fill('#eltBatt', '2026-09');         // expired 2026-09-30, red
    assert.equal(await page.textContent('#verdictA'), 'No');
    const rows = await page.$$eval('#rows .row', (els) => els.map((e) => [e.className, e.querySelector('.t').textContent, e.querySelector('.c').textContent]));
    assert.equal(rows[0][1], 'ELT battery');
    assert.match(rows[0][0], /s-overdue/);
    assert.equal(rows[1][1], 'Transponder');
    assert.match(rows[1][0], /s-due_soon/);
    assert.ok(rows.some((r) => r[2] === '14 CFR §91.411'));
    assert.match(await page.textContent('#nextDue'), /Transponder in 12 days/);
    assert.ok((await events(page)).includes('checker_completed'));
  });

  await step('100-hr overfly shown for hire', async () => {
    await page.click('label[for="hireY"]');
    await page.fill('#tach', '1305.5');
    await page.fill('#tach100', '1200');
    const t = await page.textContent('#rows');
    assert.match(t, /100-hour inspection/);
    assert.match(t, /10-hour allowance \(4\.5 hrs left\)/);
    await page.click('label[for="hireN"]');
  });

  await step('ICS is gated by a valid email, then downloads a calendar', async () => {
    await page.fill('#icsEmail', 'not-an-email');
    await page.click('#icsBtn');
    assert.match(await page.textContent('#icsMsg'), /valid email/);
    await page.fill('#icsEmail', 'owner@example.com');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#icsBtn')]);
    assert.equal(dl.suggestedFilename(), 'tailbook-due-dates.ics');
    const ics = readFileSync(await dl.path(), 'utf8');
    assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
    assert.match(ics, /SUMMARY:Transponder due/);
    assert.match(ics, /DTSTART;VALUE=DATE:20261031/);
    assert.ok(!/ELT battery due/.test(ics), 'overdue items are not scheduled');
    assert.ok((await events(page)).includes('email_submitted'));
    const leads = await page.evaluate(() => JSON.parse(localStorage.getItem('tb_pending_leads')));
    assert.equal(leads.at(-1).email, 'owner@example.com');
    assert.equal(leads.at(-1).utm_source, 'e2e');
    assert.match(leads.at(-1).results, /status=overdue/);
  });

  await step('deposit button degrades gracefully without STRIPE_PAYMENT_LINK', async () => {
    await page.click('#depositBtn');
    assert.match(await page.textContent('#depositMsg'), /Deposits open/);
    assert.ok((await events(page)).includes('deposit_clicked'));
  });

  await step('waitlist submit without FORM_ENDPOINT', async () => {
    await page.fill('#wlEmail', 'owner@example.com');
    await page.fill('#wlModel', 'Mooney M20J');
    await page.click('#waitlistForm button[type="submit"]');
    assert.match(await page.textContent('#wlMsg'), /on the list/);
  });

  await step('no horizontal scroll at 390px', async () => {
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    assert.ok(w <= 390, `scrollWidth ${w}`);
  });

  await step('no page errors', async () => assert.deepEqual(errors, []));
  await ctx.close();
}

// ---------------------------------------------------------------- Tally mode (FORM_ENDPOINT on tally.so)
await step('Tally FORM_ENDPOINT opens the form with hidden fields prefilled', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  const page = await ctx.newPage();
  let requestedUrl = null;
  await ctx.route('https://tally.so/**', (r) => { requestedUrl = r.request().url(); r.fulfill({ body: 'stub', contentType: 'text/plain' }); });
  const html = readFileSync(join(landing, 'index.html'), 'utf8').replace("const FORM_ENDPOINT = '';", "const FORM_ENDPOINT = 'https://tally.so/r/TEST01';");
  await page.setContent(html);
  await page.fill('#annual', '2026-03-15');
  await page.fill('#wlEmail', 'co-owner@example.com');
  await page.fill('#wlTail', 'n12345');
  const [popup] = await Promise.all([ctx.waitForEvent('page'), page.click('#waitlistForm button[type="submit"]')]);
  await popup.waitForLoadState();
  assert.ok(requestedUrl, 'no request to tally.so');
  const requested = new URL(requestedUrl);
  assert.equal(requested.pathname, '/r/TEST01');
  assert.equal(requested.searchParams.get('email'), 'co-owner@example.com');
  assert.equal(requested.searchParams.get('kind'), 'waitlist');
  assert.equal(requested.searchParams.get('tail'), 'N12345');
  assert.ok(requested.searchParams.get('results').startsWith('status='));
  await ctx.close();
});

// ---------------------------------------------------------------- screenshots
for (const scheme of ['light', 'dark']) {
  for (const width of [390, 1280]) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, deviceScaleFactor: width < 600 ? 2 : 1, colorScheme: scheme });
    const page = await ctx.newPage();
    await page.goto(url);
    await page.screenshot({ path: join(shots, `hero-${width}-${scheme}.png`) });
    await page.click('#sampleBtn');
    await page.evaluate(() => { document.querySelector('.top').style.position = 'relative'; });
    await page.locator('.checker').screenshot({ path: join(shots, `checker-${width}-${scheme}.png`) });
    // Full page from the top, with the sticky header pinned to the top so it doesn't land mid-page.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: join(shots, `full-${width}-${scheme}.png`), fullPage: true });
    await ctx.close();
  }
}
console.log(`screenshots in ${shots}`);
await browser.close();
if (failures) { console.log(`${failures} failure(s)`); process.exit(1); }
console.log('all e2e checks passed');
