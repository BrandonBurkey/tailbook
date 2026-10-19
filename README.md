# TailBook

The "always-airworthy" status board and logbook vault for US Part 91 aircraft owners. The spec is `research/market-research.md` (§0, §4.1, §5).

Following "validate, then build", this repo holds the **due-date rules engine** (the core IP the SwiftUI app will be ported from) and the **validation landing page**. The landing page's free Airworthiness Due-Date Checker gives visitors the app's aha moment in the browser and captures Founding Owner sign-ups.

```
engine/
  tailbook-engine.js     Rules engine: pure, zero-dependency ES module, no clock, no timezone
  ics.js                 .ics (RFC 5545) calendar export from an evaluate() result
  test-vectors.json      Golden vectors (71 profile cases + 26 date cases). The Swift port must pass these.
  test/engine.test.js    node --test runner: vectors, invariants, ICS
  test/make_vectors.py   Generates test-vectors.json from hand-written expectations (Python datetime as an independent oracle)
landing/
  index.html             BUILT, self-contained page (deploy this one file)
  src/index.html         Page template: edit this one
  test/landing.test.js   Static checks (build is current, no external deps, placeholders, wording)
  e2e/run.mjs            Headless Chromium checks + screenshots (Playwright)
  screenshots/           390px and 1280px, light and dark: hero, checker, full page
scripts/build-landing.mjs  Inlines the engine into landing/index.html
validation/              Validation playbook (maintained separately)
```

## Run the tests

Requires Node 20+. There are no npm dependencies.

```sh
npm test                  # engine golden vectors + invariants + ICS + landing static checks
npm run build:landing     # rebuild landing/index.html after editing the engine or landing/src/
npm run e2e               # headless Chromium: functional checks + screenshots (needs Playwright)
npm run vectors           # regenerate engine/test-vectors.json after adding a case
```

`npm test` fails if `landing/index.html` is stale, so the deployed page always runs the tested engine.

`npm run e2e` uses a globally installed Playwright. You can point it elsewhere with `PLAYWRIGHT_MODULE=/path/to/playwright` and `CHROMIUM_PATH=/path/to/chrome`.

## The engine in one minute

```js
import { evaluate, DISCLAIMER } from './engine/tailbook-engine.js';
const r = evaluate({
  asOf: '2026-10-19',                                   // required: the engine has no clock
  aircraft: { ifr: true, forHire: false, currentTach: 1250, avgHoursPerMonth: 8 },
  annual: { lastDone: '2026-03-15' },
  transponder: { lastDone: '2024-10-18' },
  pitotStatic: { lastDone: '2024-11-02' },
  eltInspection: { lastDone: '2026-03-15' },
  eltBattery: { expires: '2027-03' },                   // month-only means end of month
  vorCheck: { lastDone: '2026-10-01' },
  registration: { expires: '2029-06-30' },              // or { issued }
  oilChange: { lastDoneTach: 1210, lastDoneDate: '2026-08-01', intervalHours: 50, intervalMonths: 4 },
  ads: [{ adNumber: '2020-18-04', intervalHours: 100, intervalCalendarMonths: 12, lastDoneTach: 1150, lastDoneDate: '2026-01-10' }],
  customItems: [{ id: 'fire-ext', name: 'Fire extinguisher', intervalCalendarMonths: 6, lastDoneDate: '2026-05-01' }],
});
r.items    // one item per rule: status, color, citation, rule, dueDate/dueTach, daysRemaining/hoursRemaining, projectedDate, message
r.summary  // { status: current|limited|overdue|incomplete, allCurrent, headline, affects, nextDue, counts }
```

Item statuses:
- `overdue` (red)
- `due_soon` (yellow): 30 days or fewer left, or 10.0 hours or fewer left
- `ok` (green)
- `not_applicable`, with a `reason`
- `unknown`, when data is missing

The overall summary is worded as **"All items current?"**. TailBook never states that an aircraft is airworthy, and `DISCLAIMER` must be shown next to the summary.

### Rule interpretations (documented in code; please review with the IA advisor)

| Rule | How it's implemented | Notes |
|---|---|---|
| "Calendar months" (§91.409(a), §91.411, §91.413, §91.207(d)) | Due through the **last day** of the Nth month after the month done. Done any day in Mar 2026 → through Mar 31 2027. | The FAA doesn't define the term in §1.1. We follow FAA Order 8300.10 as restated by CASA, the FAA Chief Counsel flight-review letter (end-of-month), and FAA CertAlert 10-01. Sources are cited in the engine header. |
| §91.171 VOR "preceding 30 days" | Plain days: checked on D, current through D+30, lapsed on D+31. | |
| §91.409(b) 100-hour | Next due = last + 100. If done late against a known prior limit, the excess counts against the next interval. Over the limit is red; the 10-hour allowance is shown only as "ferry to inspection" hours left. An annual (with tach entered) also resets it. | The 10 hours are allowed only en route to the inspection, so the engine never shows green inside them. |
| §91.207(c) ELT battery | The owner enters the marked replacement date (50% of useful life), and that date is treated as the last good day. More than 1.0 cumulative transmitter hours → overdue. | Inclusive is the reading owners expect for "EXP 03/2027". A stricter shop may treat the marked date as "replace by". |
| §47.40 registration | 7 years after the last day of the month issued (rule effective 2023-01-23; certificates valid on that date were extended). Prefer entering the expiration from the FAA registry. | |
| ADs / custom items | `intervalCalendarMonths` (month-end), `intervalMonths` (anniversary, clamped: Jan 31 + 1 → Feb 28/29), `intervalDays`, `intervalHours`; any combination counts as whichever comes first. | Many ADs say "12 months", not "calendar months". Pick the field that matches the AD text; `intervalMonths` is the conservative one. |
| Summary scopes | Items that apply to every flight (annual, ELT, registration, ADs) → `overdue`. IFR-only (pitot-static, VOR), for-hire-only (100-hr) and transponder items → `limited`, with `affects`. | |
| Projected dates | `floor(hoursLeft / (avgHoursPerMonth / 30.4375))` days. Informational only: status never depends on a forecast. | |

## Deploy the landing page

`landing/index.html` is one file with inline CSS and JS and no external requests. Any static host works.

- **Netlify Drop:** drag the `landing/` folder (or only `index.html`) onto https://app.netlify.com/drop. Then add your domain under Domain settings.
- **Cloudflare Pages:** Create project → Direct Upload → upload `landing/`. Alternatively, connect the repo with no build command and set the output directory to `landing`.
- **Carrd:** Carrd's Embed element is size-limited and sandboxes scripts. Host `index.html` on Netlify or Cloudflare (above), then link to it from Carrd or iframe it with an Embed → Code element: `<iframe src="https://check.yourdomain.com" style="width:100%;height:2400px;border:0"></iframe>`. Pointing the domain straight at the static host is simpler and faster.

The `screenshots/`, `src/`, `test/` and `e2e/` folders are harmless to upload but not needed.

## Fill in before launch

Edit the CONFIG block at the top of the second `<script>` in **`landing/src/index.html`**, then run `npm run build:landing`. Until these are filled in, the page still works: leads are kept in localStorage and logged to the console, and the deposit button shows a "join the list" message.

| Constant | What to put there |
|---|---|
| `STRIPE_PAYMENT_LINK` | Your Stripe Payment Link for the **$49 refundable deposit**, e.g. `https://buy.stripe.com/...`. The page appends `prefilled_email` and `client_reference_id` (from `utm_source`). |
| `FORM_ENDPOINT` | **Tally** form link (`https://tally.so/r/XXXX`) **or** a POST endpoint (Formspree `https://formspree.io/f/XXXX`, Getform, Make/Zapier webhook). See below. |
| `FORM_ENCODING` | For POST endpoints: `'json'` (default) or `'form'`. |
| `SNAPSHOT_FORM_URL` | The Tally form for the concierge **Free Airworthiness Snapshot** (photo uploads), per `validation/`. Opened prefilled. |
| Domain | Update `og:` meta tags if you add an image; replace `yourdomain.com` in the Plausible snippet. |

**Tally setup.** Tally has no public submit API. When `FORM_ENDPOINT` (or `SNAPSHOT_FORM_URL`) is a Tally link, the page opens the form in a new tab, prefilled through URL parameters. In Tally, add **hidden fields** with exactly these names: `kind`, `email`, `make_model`, `tail`, `results`, `engine_version`, `page`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `ref`. Tally fills hidden fields from matching URL parameters, so every submission carries the forum UTM tags.

With a POST endpoint, the same fields are sent as JSON or form data, plus `submitted_at`.

**UTM capture.** `utm_*` and `ref` are read from the landing URL and kept for the browser session. They are attached to every lead, Tally prefill and Stripe link.

**Analytics.** `track(event, props)` is a no-op. Events are kept in `window.__tailbookEvents`. To turn on Plausible, paste the two-line snippet from the comment above `track()` into `<head>` and uncomment the `window.plausible` line. Events:

| Event | Fires when | Experiment |
|---|---|---|
| `checker_completed` | First time the board has every required date (3 or more entered) | E1 |
| `email_submitted` | .ics reminder gate or waitlist submitted (`props.source`) | E1 |
| `snapshot_clicked` | "Request a free Airworthiness Snapshot" clicked | E1 |
| `deposit_clicked` | "Reserve with a $49 refundable deposit" clicked | E2 |

> Note: `validation/00-playbook.md` names its Plausible goals `checker_used`, `snapshot_requested` and `deposit_clicked`. Either create goals with the event names above, or rename them in one place. Completed Snapshot requests are counted in Tally.

**Copy commitments to keep consistent with `validation/07-legal-and-appstore.md`:**
- The deposit is "credited via an App Store offer code at launch, or fully refunded".
- "For life" means for as long as the subscription stays active.
- The Error Promise is a make-good (help with an Apple refund request plus a free year), not a direct refund.
- The overall summary reads "All items current?" and never "airworthy today".

Have the lawyer review this copy before taking deposits.
