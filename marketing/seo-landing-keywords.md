# SEO: Landing Page Keywords + 5 Blog Briefs

**Domain:** the landing domain (`[domain]`, e.g. `tailbook.app` or `gettailbook.com` per the playbook setup). Pages assumed: `/` (landing + free checker), `/blog/…`, `/cheat-sheet`, `/snapshot`.
**Search volumes are not listed on purpose.** No keyword tool was available, and these are low-volume niche terms where guesses mislead. **Before writing, pull volumes and CPCs from Google Keyword Planner** (free with the Ads account in `paid-ads.md` Phase 0) and, after 4 weeks live, from Google Search Console. Priority below is a judgment of *fit × buying intent*, not volume.
**Rules:** every article cites the eCFR section it explains, links to the free checker, ends with the short disclaimer, and never says "airworthy" as a verdict (`brand-voice.md`). Facts must match `validation/05-guest-article.md`.

**Intent key:** **I** = informational (learning a rule) · **C** = commercial investigation (comparing tools) · **T** = transactional (ready to sign up or download) · **N** = navigational (looking for a specific thing or site).

---

## 1. 30 keywords

| # | Keyword | Intent | Funnel | Target page | Priority | Notes |
|---|---|---|---|---|---|---|
| 1 | aircraft maintenance tracking app | C | Bottom | `/` | ★★★ | Also Google Ads AG1 |
| 2 | aircraft maintenance tracking software | C | Bottom | `/` + Brief 5 | ★★☆ | Skews to shops/fleets (CAMP, Bluetail); qualify with "for owners" |
| 3 | airplane maintenance tracker for owners | C | Bottom | `/` | ★★★ | Long-tail, exact fit |
| 4 | aircraft logbook app | C | Middle | Brief 5 | ★★☆ | Mixed intent: many want pilot logbooks (ForeFlight/MyFlightbook) |
| 5 | aircraft maintenance spreadsheet template | C | Middle | `/cheat-sheet` + Brief 5 | ★★★ | Owners searching for a spreadsheet are our exact switchers |
| 6 | annual inspection due date | I | Top | Brief 1 + checker | ★★★ | Also Google Ads AG2 |
| 7 | when is my annual inspection due | I | Top | Brief 1 | ★★★ | Question form; target a featured snippet |
| 8 | 12 calendar months aviation | I | Top | Brief 1 | ★★★ | The calendar-month argument |
| 9 | calendar month inspection end of month | I | Top | Brief 1 | ★★☆ | — |
| 10 | 91.409 annual inspection | I | Top | Brief 1 | ★★☆ | Regulation-number searchers are serious |
| 11 | transponder check every 24 months | I | Top | `/blog/transponder-check-91-413` (adapt from the guest article; see note) | ★★★ | — |
| 12 | 91.413 transponder check VFR | I | Top | same | ★★★ | "Applies VFR too" is the hook |
| 13 | pitot static check every 24 months | I | Top | same page or a sibling | ★★★ | — |
| 14 | 91.411 altimeter check requirements | I | Top | same | ★★☆ | — |
| 15 | ELT battery expiration | I | Top | Brief 3 | ★★★ | — |
| 16 | ELT inspection requirements 91.207 | I | Top | Brief 3 | ★★★ | — |
| 17 | ELT battery replacement 1 hour 50 percent | I | Top | Brief 3 | ★★☆ | Exact-rule searchers |
| 18 | aircraft registration expiration | I | Top | Brief 4 | ★★★ | — |
| 19 | aircraft registration 7 years | I | Top | Brief 4 | ★★★ | Changed in 2023, so older articles still rank and are wrong |
| 20 | how to renew aircraft registration | I/T | Top | Brief 4 | ★★☆ | Links out to the FAA registry (good for trust) |
| 21 | VOR check 30 days requirements | I | Top | Short `/blog` explainer | ★★☆ | Pilot item; IFR owners |
| 22 | recurring AD tracking | C | Middle | Brief 2 | ★★★ | — |
| 23 | airworthiness directive compliance tracking | C | Middle | Brief 2 | ★★☆ | — |
| 24 | AD whichever comes first | I | Middle | Brief 2 | ★★★ | Classic owner confusion |
| 25 | how to track airworthiness directives aircraft owner | I | Middle | Brief 2 | ★★☆ | — |
| 26 | aircraft inspection checklist owners | I | Top | `/cheat-sheet` | ★★☆ | The one-page sheet ranks here |
| 27 | annual inspection squawk list | I | Middle | `/blog/annual-squawk-list` (later) | ★★☆ | Seasonal (Nov–Jan) |
| 28 | pre-buy aircraft logbook review checklist | I | Middle | `/blog/pre-buy-records` (later; the bonus PDF) | ★★☆ | Seller/buyer pivot signal (decision rules pivot B) |
| 29 | aircraft partnership tach logging | I | Middle | `/blog/partnership-tach` (later) | ★☆☆ | Partnerships segment (pivot A signal) |
| 30 | TailBook app | N | Bottom | `/` | ★★★ | Brand. Check for name collisions in SERPs (playbook trademark check) |

**Not targeted on purpose:** "airworthy app", "is my plane airworthy", "FAA approved maintenance tracking". The intent clashes with our claims policy, and the ranking pages would set the wrong expectation. "A&P jobs", "A&P school", "pilot logbook": wrong audience.

**Note on #11–14:** the guest article (`05-guest-article.md`) is going to GA News. **Don't republish it verbatim** (duplicate content, and the editor won't like it). Write a separate, shorter, regulation-by-regulation page, or republish only with the outlet's permission and a canonical link to their version.

**On-page basics for `/`:** title `TailBook: Know What's Due on Your Airplane | Free Due-Date Checker` (≤60 chars before the pipe); H1 per `brand-voice.md` §0; FAQ schema for the existing FAQ; the checker stays crawlable as text (the rule list with citations should be server-rendered HTML, not only JS).

---

## 2. Blog briefs (5)

Every brief: 900–1,400 words · one worked example with real dates · a citation table · a "check yours" checker embed or link (**no UTMs on internal links**, since they overwrite the real referrer; measure with Plausible's entry page → goal instead) · the short disclaimer · "Reviewed by [IA name], A&P/IA" **only after the IA has reviewed that article**.

### Brief 1: "When is my annual due? Calendar months, explained with examples"
- **Slug:** `/blog/annual-inspection-due-date-calendar-months`
- **Primary keyword:** when is my annual inspection due (#7). **Secondary:** annual inspection due date, 12 calendar months aviation, 91.409 annual inspection, calendar month inspection end of month.
- **Searcher:** an owner who just looked at a logbook entry and isn't sure if "due" means the same day or the end of the month; or someone in a POA argument.
- **Angle:** the definitive, example-heavy answer, plus why spreadsheets get it wrong (365 days ≠ 12 calendar months).
- **Outline:**
  1. The short answer (40-word featured-snippet paragraph): "An annual signed March 3, 2026 is generally good through March 31, 2027…"
  2. What "calendar month" means: the common reading in FAA guidance, not a FAR definition (keep the guest article's careful wording).
  3. A table of 6 examples, including month-end edge cases (signed Jan 31; signed Feb 28/29; signed Dec 1).
  4. The 100-hour inspection: when it applies (for hire / flight instruction for hire, 91.409(b)), and why it isn't calendar-based.
  5. Doing an annual early: what happens to the next due date (it resets from the new sign-off month).
  6. Spreadsheet formulas that get it right (`=EOMONTH(date,12)`) and wrong (`=date+365`).
  7. Check yours: the checker.
- **Sources:** 14 CFR 91.409 (eCFR), AviationPros tolerance article, FAA CertAlert 10-01 (as cited in the guest article).
- **CTA:** free checker → `checker_completed`.
- **Watch out:** Part 135/121 and experimental condition inspections are different; one sentence each, pointing to the operating limitations or the IA.

### Brief 2: "Recurring ADs: how 'whichever comes first' really works (with tach-forecast examples)"
- **Slug:** `/blog/recurring-ad-whichever-comes-first`
- **Primary keyword:** AD whichever comes first (#24). **Secondary:** recurring AD tracking, airworthiness directive compliance tracking, how to track airworthiness directives.
- **Searcher:** a Bonanza/Baron or Cessna owner with a recurring AD and a vague sense of when it's next due.
- **Angle:** the arithmetic, done once, clearly, plus where the owner's job ends and the IA's begins.
- **Outline:**
  1. What an AD is (Part 39), one-time vs recurring; why applicability is the IA's determination, not an app's.
  2. Reading the interval: hours, calendar, or both; "whichever occurs first"; "calendar months" vs "months" in the AD's own wording (read the AD text).
  3. Worked example: last done Jan 10 at 1,150 tach; 100 hr / 12 months; at 8 hr/month the calendar limit wins. Then the reverse case at 20 hr/month.
  4. Tach vs Hobbs: which one your records use, and why mixing them causes drift.
  5. What a good AD record holds: AD number, revision, method of compliance, next due (hours and date), logbook reference.
  6. Options compared honestly: the IA's AD list, a spreadsheet, a managed service, an app.
  7. Check yours.
- **Sources:** 14 CFR Part 39; 14 CFR 91.417(a)(2)(v) (AD status records); FAA DRS (drs.faa.gov) for AD text.
- **CTA:** checker (it supports recurring ADs), then the Snapshot ("send me your AD list").
- **Watch out:** **no real AD number in an example unless the IA confirms it's quoted correctly.** Use a fictional "AD 20XX-XX-XX" label.

### Brief 3: "ELT inspection and battery: the two clocks in your tailcone (91.207)"
- **Slug:** `/blog/elt-battery-expiration-inspection-91-207`
- **Primary keyword:** ELT battery expiration (#15). **Secondary:** ELT inspection requirements 91.207, ELT battery replacement 1 hour 50 percent.
- **Searcher:** an owner whose IA mentioned the battery, or who saw the label for the first time.
- **Angle:** two separate deadlines, one box; where to find the date; what to do if the ELT went off.
- **Outline:**
  1. The short answer: inspection every 12 calendar months (91.207(d)); battery at 1 cumulative hour of use or 50% of useful life (91.207(c)).
  2. Finding the date: the label on the unit, the logbook entry, and asking your shop to read it to you.
  3. 121.5 vs 406 MHz units: what changes (registration of 406 beacons with NOAA) and what doesn't.
  4. "It went off in the hangar": why the one-cumulative-hour rule may apply; tell your IA.
  5. Exemptions (91.207(f)), briefly, with a pointer to the rule text.
  6. Putting both dates on a calendar (60/30/7-day reminders).
  7. Check yours.
- **Sources:** 14 CFR 91.207; NOAA SARSAT beacon registration page (verify the URL when writing).
- **CTA:** checker; S03 video embedded.

### Brief 4: "Your aircraft registration now lasts 7 years. Here's how to check and renew it"
- **Slug:** `/blog/aircraft-registration-expiration-7-years`
- **Primary keyword:** aircraft registration expiration (#18). **Secondary:** aircraft registration 7 years, how to renew aircraft registration.
- **Searcher:** an owner who half-remembers "three years", or a new owner.
- **Angle:** the 2023 change (many top results still say 3 years), the 10-second check, and the renewal window.
- **Outline:**
  1. Short answer: 7 years since Jan 23, 2023 (14 CFR 47.40); expires on the last day of the month 7 years after issue.
  2. What happened to certificates issued before the change (cite the FAA/Federal Register confirmation; verify the transition details before publishing).
  3. Check it in 10 seconds: the FAA Registry N-number inquiry (link).
  4. Renewing: the 6-month window before expiration; online vs paper; what to keep on board (91.203).
  5. What happens if it lapses (state it carefully, cite the rule; no legal advice).
  6. Put it on the calendar.
- **Sources:** 14 CFR 47.40; Federal Register 2023-00794; AOPA Feb 2023 article (both cited in the guest article).
- **CTA:** checker (registration row).

### Brief 5: "Tracking aircraft maintenance as an owner: spreadsheet vs. your shop vs. an app (an honest comparison)"
- **Slug:** `/blog/aircraft-maintenance-tracking-owners-compared`
- **Primary keyword:** aircraft maintenance tracking app (#1). **Secondary:** aircraft maintenance spreadsheet template, airplane maintenance tracker for owners, aircraft logbook app, aircraft maintenance tracking software.
- **Searcher:** commercial intent; comparing options; probably has a spreadsheet today.
- **Angle:** a fair comparison written by a disclosed vendor, the only kind that earns trust here. Say when a spreadsheet is enough.
- **Outline:**
  1. Disclosure up front: "I build TailBook. Here's how I'd compare the options anyway."
  2. What any system must do: the 7 item types, calendar-month math, whichever-first ADs, hours forecasts, warnings, proof (logbook references), sharing with co-owners.
  3. **Whiteboard/notebook:** free, visible in the hangar; no warnings.
  4. **Spreadsheet:** free, flexible; formula pitfalls (`EOMONTH`), no alerts unless you build them; a free template to download (`/cheat-sheet`).
  5. **Your shop:** knows the airplane; usually tracks only at annual time and only its own work.
  6. **Managed services** (e.g. Savvy's ~$750/yr human service): expert oversight; a different product, priced accordingly.
  7. **Owner apps:** TailBook ($199/yr per aircraft) alongside others (FlightBoss, BetterPlane, Aircraft Compliance, MyFlightbook), described **factually from their own public pages, with dates**, with no disparagement.
  8. A decision table: "If you…, use…"
  9. Try the checker either way.
- **Sources:** each competitor's own pricing page, accessed on the publication date (research §4.1 competitor table as a starting point; re-verify every price).
- **CTA:** checker → Founding Owner (pre-launch) / App Store (post-launch).
- **Watch out:** comparative claims must be verifiable and dated. Re-check every quarter. Never use competitor logos.

---

## 3. Publishing order and cadence
| When | Publish | Why |
|---|---|---|
| Nov (W2–W3) | Brief 1 | The calendar-month topic drives the forum conversation now; the S02 video links to it |
| Nov (W4) | Brief 2 | Annual season; AD questions peak before annuals |
| Dec (W6) | Brief 3 | Pairs with S03 |
| Dec (W7) | Brief 4 | Pairs with S04 |
| Jan (build phase) | Brief 5 | Commercial-intent page, ready before launch traffic |

Measure: Search Console impressions/clicks by page; `checker_completed` for visits whose entry page is `/blog/…` (Plausible). Expect little organic traffic before ~3 months; these pages also serve as **link targets** for forum replies ("I wrote up the month-end math here"), which is their real value in the first 8 weeks.
