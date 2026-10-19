# Paid Ads Test Plan (Meta + Google Search): $300 minimum, $1,000 ceiling

**Goal:** find out whether paid traffic can buy Snapshot requests and Founding Owner deposits at a cost the business can carry, *before* the App Store launch, so launch-week spend isn't a guess.
**Voice/claims:** `brand-voice.md` §0. **Analytics names:** `checker_completed`, `email_submitted`, `snapshot_clicked`, `deposit_clicked`.

---

## 1. When this runs (gated, consistent with the playbook)

The validation playbook says **"Do not spend on paid ads (not yet)"** before the Dec 15 decision, and it's right: paid traffic would muddy E1's organic read. So:

| Phase | Dates | Condition | Budget |
|---|---|---|---|
| **0: Prep** (no spend) | Now → Dec 15 | Always | $0. Create the accounts, advertiser verification, keyword research in Keyword Planner, build ads in **paused** state. Fix the landing-page wording first (`brand-voice.md` §0: "legal in 5 seconds" will be flagged by ad reviewers). |
| **1: Learn** | **Wed Dec 16 → Tue Dec 29** (14 days) | Decision = **PERSEVERE** (or **ITERATE**, where paid becomes the extra channel for the 3-week cycle) | **$300**: Google $180 ($12/day), Meta $120 ($8/day) |
| **2: Scale winners** | Dec 30 → Jan 26 | Phase 1 passes the gate in §6 | Up to **+$700** (total ≤ $1,000), 80% to the winning platform |
| — | — | Decision = PIVOT/KILL | **$0.** Don't start. |

Why late December works: it's the middle of annual season (the seasonal hook), owners have holiday downtime, and the founder is in build cycle 1, so Snapshot capacity needs a cap (§6, ops rule).

**Where ads send people (pre-launch):** the landing page's free checker (`[CHECKER_URL]`), never straight to Stripe. The deposit offer is made after value (checker result or delivered Snapshot), exactly as in the organic funnel. Post-launch, the same structure points at the App Store (see `launch-plan.md`, Apple Search Ads note).

---

## 2. Unit economics behind the rules (estimates; revisit with real E2 data)

| Input | Value | Source |
|---|---|---|
| Founding Owner price | $149/yr | Offer |
| Apple commission (Small Business Program) | 15% → ~$127 net/yr | `07-…` §4 |
| Assumed paid life | 2 years (**estimate**) → **~$253 net per founding aircraft** | Assumption |
| Snapshot → deposit (E2) | Target 15%; kill line 5% | Playbook |
| Founder time per Snapshot | 25–45 min | SOP |

**So:**
- **Target cost per deposit (CPD): ≤ $100** (≈40% of 2-year net). **Hard ceiling: $150.**
- **Target cost per Snapshot request (CPSR): ≤ $15** (= $100 × 15%). **Ceiling: $22.** If the real E2 rate on Dec 13 differs from 15%, recompute: CPSR target = $100 × (actual E2).
- **Leading indicator: cost per `checker_completed` ≤ $4** (estimate; we expect roughly 1 Snapshot request per 4–6 checker completions).

CPC note: aviation search terms are low-volume and CPCs are unknown until Keyword Planner shows them. Assume **$1.50–$5 per click (estimate)**. At $3/click, $180 buys ~60 clicks, enough to read CTR and checker completion but thin for deposits. That's why the deposit decision uses a 14-day lag and the organic E2 rate as a projection (§6).

---

## 3. Measurement without tracking pixels

The landing page is deliberately self-contained (`landing/test/landing.test.js` checks for **no external dependencies**) and the brand is "no account, private". **Phase 1 uses no Meta Pixel and no Google tag.** Instead:

1. **UTMs on every ad** (§5). Plausible attributes `checker_completed`, `email_submitted`, `snapshot_clicked` and `deposit_clicked` to `utm_source`/`utm_content`.
2. **Tally hidden fields** `utm_source`, `utm_campaign`, `utm_content`: the landing page appends the visitor's UTMs to the Snapshot link (**ask the landing engineer**; Tally reads hidden fields from URL parameters). That makes *Snapshot requests* attributable, not just clicks.
3. **Stripe Payment Link `client_reference_id`**: pass `{utm_source}-{utm_content}` from the landing page so each deposit carries its source (**verify that the current Payment Links support this parameter** before relying on it; fallback: a "How did you hear about TailBook?" custom field).
4. **Daily 5-minute log** in the tracker: spend, impressions, clicks per platform/ad, plus the Plausible and Tally counts.

Trade-off, accepted: without a pixel, Meta can only optimize for **link clicks** (not landing-page views or conversions), and Google can't use conversion-based Smart Bidding. That's fine at $300; it's a read, not an optimization engine. Revisit for Phase 2 only if spend goes past ~$500 *and* the privacy policy is updated to disclose it.

---

## 4. Platform setup

### 4a. Google Search ($180 in Phase 1)
- **Campaign:** Search only. **Untick** Display Network and Search Partners. Location: United States, "Presence: people in or regularly in". Language: English. Schedule: 6:00–22:00.
- **Bidding:** Manual CPC (no conversion data yet), start max CPC **$2.50**, raise to **$4.00** if top-of-page impression share stays under 30% after 3 days. (CPC figures are estimates; set them from Keyword Planner.)
- **Ad assets:** sitelinks (Free checker · Free Snapshot · Cheat sheet · Founding Owner), callouts ("FAR cited", "No account", "Refundable deposit", "Built for Part 91"), structured snippet "Types: Annual, Transponder, Pitot-static, ELT, Registration, ADs".
- **Ad groups and keywords** (phrase "…" and exact […] match only; no broad match at this budget):

| Ad group | Keywords | Landing anchor |
|---|---|---|
| **AG1 Tracking app** | [aircraft maintenance tracking app], "aircraft maintenance tracking app", "aircraft maintenance tracking software", "airplane maintenance tracker", "aircraft maintenance tracker", "aircraft inspection tracking", "aircraft maintenance logbook app", "aircraft maintenance app" | `#checker` |
| **AG2 Due dates** | "annual inspection due date", "when is my annual inspection due", "aircraft annual inspection due", "transponder check due", "transponder check every 24 months", "pitot static check due", "pitot static check every 24 months", "91.413", "91.411", "elt battery expiration", "elt inspection requirements", "aircraft registration expiration", "calendar month inspection" | `#checker` |
| **AG3 ADs** | "airworthiness directive tracking", "recurring ad tracking", "ad compliance tracking aircraft", "track airworthiness directives" | `#checker` |

- **Negative keywords** (campaign level): jobs, job, salary, hiring, career, school, course, training, class, test, exam, "a&p test", certification, license, "how to become", student, "pilot logbook", "logbook for pilots", foreflight, "flight school", "part 135", "part 121", airline, fleet, camp, helicopter, drone, uav, "car", "vehicle", "fleet maintenance", "maintenance manual", pdf, "free download", android, windows, "remote pilot", simulator, "fsx", "msfs".
- **Competitor names** (Bluetail, SavvyMx, FlightBoss, BetterPlane): **not in Phase 1**. Bidding on them is allowed, but their names must never appear in ad text, and it reads as aggressive in a small community.
- **Search terms report:** review it daily for the first 5 days and add negatives. Most early waste will be job seekers and student pilots.

### 4b. Meta: Facebook + Instagram ($120 in Phase 1)
- **Objective:** Traffic → optimize for **link clicks** (no pixel; §3). No Special Ad Category needed.
- **Location/age:** United States; ages **40–75** (avatar 40–70).
- **Two ad sets** ($4/day each), so we learn which audience definition works:
  - **AS-A "Owner brands":** interests such as Cirrus Aircraft, Beechcraft, Piper Aircraft, Cessna, Mooney, Aircraft ownership / General aviation.
  - **AS-B "Pilot orgs & tools":** interests such as Aircraft Owners and Pilots Association, Experimental Aircraft Association, ForeFlight, Sporty's Pilot Shop, Garmin Aviation.
  - Meta has consolidated and removed many detailed-targeting interests since 2024–25, so **check in Ads Manager which of these still exist** and note the estimated audience size. If an ad set is under ~100k people, merge the two.
- **Placements:** Facebook Feed, Instagram Feed, Instagram Reels, Facebook Reels. Exclude Audience Network and Messenger.
- **Creative:** use the organic videos with the best 3-second hold and link clicks from weeks 1–7 (`content-calendar.md` §7). Where possible, **run an existing Instagram post as the ad** so its comments and saves carry over. Every video keeps the burned-in disclaimer end card.
- **Comments on ads:** answer every one within 4 hours, like the forum rule. Hide only spam, never criticism.
- **Expect** a lot of student pilots and renters. The tail-number field on the Snapshot form filters them; count only requests with a tail number.

---

## 5. UTM convention (one scheme for everything)

Extends the forum scheme in `01-forum-posts.md` (`utm_medium=forum`, `utm_campaign=e1`, `utm_content=a|b`), which stays as is.

**Format:** `[CHECKER_URL]?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={content}[&utm_term={term}]`
**Rules:** lowercase, hyphens only, no spaces, no personal data. Log every new value in a "UTM log" tab of the tracker the day you first use it.

| Parameter | Allowed values | Examples |
|---|---|---|
| `utm_source` | **Paid:** `google`, `meta` · **Organic social:** `youtube`, `instagram`, `x`, `linkedin`, `fb-{group}` · **Forums (existing):** `mooneyspace`, `poa`, `beechtalk`, `copa`, `bcp`, `rflying`, `raviation` · **Partners:** `pod-{show}`, `yt-{creator}`, `news-{outlet}`, `club-{club}`, `shop-{shopname}` · **Email:** `mailerlite` (or `kit`) | `google`, `fb-c182owners`, `pod-aviationnewstalk` |
| `utm_medium` | `cpc` (Google), `paid-social` (Meta), `social`, `forum`, `email`, `podcast`, `video`, `newsletter`, `press`, `partner`, `qr` (printed counter cards) | `cpc` |
| `utm_campaign` | `e1` (forum test), `organic-w{1-8}`, `paid-p{1|2}-{yyyymm}`, `club-{club}`, `launch-{yyyymm}` | `paid-p1-202612` |
| `utm_content` | Ad ID `g01`–`g10`, `m01`–`m10`; script `s01`–`s15`; forum `a`/`b`; `bio`; `li`; `thread` | `g03` |
| `utm_term` | Google only: `{keyword}` (ValueTrack, inserted automatically) | `transponder+check+due` |

**Google:** set the campaign's *Final URL suffix* to `utm_source=google&utm_medium=cpc&utm_campaign=paid-p1-202612&utm_term={keyword}` and add `utm_content=g0X` per ad (ad-level Final URL suffix).
**Meta:** ad-level URL parameters `utm_source=meta&utm_medium=paid-social&utm_campaign=paid-p1-202612&utm_content={{ad.name}}`, and name each ad exactly `m01`…`m10`.

---

## 6. Kill / scale rules (pre-committed, like `06-decision-rules.md`)

**Definitions.** **CPSR** = spend ÷ complete Snapshot requests *with a tail number* attributed to that ad/platform. **CPD** = spend ÷ deposits attributed to it, read **14 days after** the spend (Snapshot delivery takes up to 48h, and the deposit emails go out on days +1/+4/+10).

| # | When | Rule | Action |
|---|---|---|---|
| R1 | After 1,000 impressions per ad | Google CTR < 2% or Meta link CTR < 0.6% | **Swap the creative/headline** (not a kill). Max 2 swaps per slot |
| R2 | Any ad or ad group | Spend ≥ **$45** with **0** Snapshot requests and < 5 `checker_completed` | **Pause it** |
| R3 | Any ad or ad group | CPSR > **$30** after $60 spend | **Pause it** |
| R4 | Ad group / ad set | CPSR ≤ **$15** with ≥ 4 requests | **Scale +25%** every 3 days, max 2 steps, then hold |
| R5 | Platform, end of Phase 1 (Dec 29) | Platform CPSR > **$25** | **Stop that platform** |
| R6 | **Phase 2 gate** (Dec 30) | Blended CPSR ≤ **$20** AND (≥ 1 paid deposit OR projected CPD ≤ $150 using the organic E2 rate) | **Release up to $700**, 80% to the platform with the lower CPSR |
| R7 | All paid, end of Phase 1 + 14-day lag (Jan 12) | 0 paid deposits AND blended CPSR > $20 | **Stop all paid.** Paid isn't ready for pre-launch. Put the budget toward launch week (`launch-plan.md`) or podcast sponsorship (`partnerships.md`) |
| R8 | Phase 2, any time after $300 of Phase 2 spend | CPD > **$150** (14-day lag) | **Stop Phase 2** |
| R9 | **Ops cap**, daily | Paid-attributed Snapshot requests > **3/day** for 2 days | **Cut budgets 30%.** The 48h delivery promise beats volume |
| R10 | Quality, weekly | > 40% of paid requests have no aircraft (renter/student) or no tail number | Tighten targeting (drop AS-B interests, add negatives) before spending more |

**No goalpost moving:** write the Phase 1 results into the tracker on Dec 29 and Jan 12 and apply the table as written.

---

## 7. Ad copy: Google Search (10 responsive search ad variants)

Each variant is the **pinned core** of one RSA: 3 headlines + 2 descriptions, character counts verified. In the account, load each RSA with 8–10 headlines total by mixing in other variants' headlines from the same ad group, and pin H1 only where the message depends on it (G02, G07). Run **2 RSAs per ad group** at a time; rotate in the rest as R1/R3 retire losers.

| ID | Ad group | Msg | Headlines (≤30 chars each) | Descriptions (≤90 chars each) |
|---|---|---|---|---|
| **G01** | AG1 Tracking app | M1 | Aircraft Due-Date Tracker *(25)*<br>The FAR Behind Every Date *(25)*<br>Free Checker, No Signup *(23)* | Annual, transponder, pitot-static, ELT and registration on one board. Try it free. *(82)*<br>For Part 91 owners. Calendar-month math done right. Your IA still makes the call. *(81)* |
| **G02** | AG2 Annual due date | M2 | When Is My Annual Due? *(22)*<br>End-of-Month Math Done Right *(28)*<br>Free Due-Date Checker *(21)* | Annual signed Mar 3? It's good through Mar 31 next year. Check all your dates free. *(83)*<br>12 calendar months, per 14 CFR 91.409. See every due date with its regulation. *(78)* |
| **G03** | AG2 Transponder/pitot | M1 | Transponder Check Due? *(22)*<br>24-Month Items, Tracked *(23)*<br>Applies to VFR Owners Too *(25)* | 91.413 transponder and 91.411 pitot-static are 24-calendar-month items. Check yours. *(84)*<br>Type your last test dates and see exactly when they're due. Free, no signup. *(76)* |
| **G04** | AG2 ELT | M1 | ELT Battery Expiration? *(23)*<br>ELT: Two Clocks, Not One *(24)*<br>Free ELT Due-Date Check *(23)* | 91.207: inspection every 12 calendar months, plus the battery date on the label. *(80)*<br>Enter both dates and get warned 60, 30 and 7 days before either one lapses. *(75)* |
| **G05** | AG3 AD tracking | M2 | Recurring AD Tracker *(20)*<br>Hours or Calendar, First Due *(28)*<br>Built for Aircraft Owners *(25)* | Whichever-comes-first AD intervals, forecast from your tach pace. Try the checker. *(82)*<br>You and your IA decide which ADs apply. We do the math and remind you. *(70)* |
| **G06** | AG1 Tracking app | M3 | Aircraft Maintenance Tracker *(28)*<br>8 Dates, 5 Minutes *(18)*<br>No Logbook Digitizing *(21)* | Get a green/yellow/red due-date board in minutes. No account, no data-entry project. *(84)*<br>No account needed. Free checker today; iPhone app in development. *(65)* |
| **G07** | AG1 Tracking app | Offer | Owner-Side Due-Date Board *(25)*<br>$149/yr Founding Price *(22)*<br>First 250 Aircraft Only *(23)* | Founding Owners lock in $149/yr for life (vs $199). $49 deposit, fully refundable. *(82)*<br>Deposit credited via an App Store offer code at launch, or fully refunded. *(74)* |
| **G08** | AG1 + AG2 (Snapshot offer) | M2 | Free Due-Date Snapshot *(22)*<br>Built From Your Logbooks *(24)*<br>Delivered Within 48 Hours *(25)* | Send photos of your entries and stickers. Get every due date with its FAR cite. *(79)*<br>Includes a calendar file with reminders. Informational only; your IA decides. *(77)* |
| **G09** | AG2 Annual due date | M1 | Annual Season Is Here *(21)*<br>Your Squawk List, Ready *(23)*<br>Know What's Due First *(21)* | Get your annual punch list ready before you drop the plane off. Free date checker. *(82)*<br>Spot the 24-month items due soon so your IA can do them in the same visit. *(74)* |
| **G10** | AG1 Tracking app | Value | Less Than 1 Hr Shop Labor *(25)*<br>$199/yr Per Aircraft *(20)*<br>vs ~$750/yr Managed Plans *(25)* | Due-date board with FAR citations for Part 91 owners. Try the free checker first. *(81)*<br>Founding Owner $149/yr for the first 250 aircraft. Refundable $49 deposit. *(74)* |

**Assignment:** AG1 → G01, G06 (start), then G07, G10. AG2 → G02, G03 (start), then G04, G09 (from Dec 16 it's peak annual season, so G09 can start immediately). AG3 → G05. G08 (Snapshot offer) rotates into AG1 and AG2 in week 2.

---

## 8. Ad copy: Meta (10 variants)

Primary text keeps the disclosure where it fits; every video carries the disclaimer end card. "¶" marks a paragraph break.

**M01 · M1 · Reel (S01)**
- **Primary text:** Your transponder check might expire before your next annual. ¶ Under 14 CFR 91.413 it's a 24-calendar-month item on its own clock, and it applies VFR too. Type your last test date into the free checker and see exactly when it's due. ¶ Disclosure: I'm building TailBook. Your A&P/IA and PIC determine airworthiness.
- **Headline:** Is your transponder check current? *(34)* · **Description:** Free checker, no signup · **CTA button:** Learn more

**M02 · M2 · Reel (S02)**
- **Primary text:** An inspection signed March 3rd isn't due March 3rd. It's good through March 31st next year. ¶ That's the calendar-month rule. The free TailBook checker does the end-of-month math for your annual, transponder, pitot-static and ELT, with the FAR for each.
- **Headline:** Calendar months, done right *(27)* · **Description:** Check your dates free · **CTA button:** Learn more

**M03 · M1 · Reel (S03)**
- **Primary text:** Your airplane has a battery date almost nobody reads: the ELT label in the tailcone. ¶ 91.207 gives the ELT two clocks: an inspection every 12 calendar months and a battery date. Put both in the free checker and get a calendar file with reminders.
- **Headline:** When's your ELT battery due? *(28)* · **Description:** Free ELT + 24-month checker · **CTA button:** Learn more

**M04 · M1 · Static image: the one-page cheat sheet**
- **Primary text:** Free for aircraft owners: one page of the inspection items that come around so rarely they're easy to miss. Transponder (91.413), pitot-static (91.411), ELT (91.207), VOR (91.171), registration (47.40), with calendar-month examples. ¶ No signup to read it.
- **Headline:** The 24-month items owners forget *(32)* · **Description:** Free one-page cheat sheet · **CTA button:** Download

**M05 · M2 · Carousel (6 cards, one per item)**
- **Primary text:** Swipe through the 6 long-interval items on a Part 91 airplane, each with its regulation. Then check your own dates in the free checker. ¶ From TailBook, an owner-side app in development. Your A&P/IA and PIC determine airworthiness.
- **Headline:** 6 dates, 6 regulations *(22)* · **Description:** Check yours in 2 minutes · **CTA button:** Learn more

**M06 · M3 · Screen recording (checker, real time, 25 s)**
- **Primary text:** Eight dates and your tach. That's it. ¶ In under five minutes you get a green/yellow/red board of what's due on your airplane, with the FAR behind each date. No account. No logbook digitizing.
- **Headline:** Your due-date board in 5 minutes *(32)* · **Description:** Free checker, no signup · **CTA button:** Learn more

**M07 · M2 · Founder to camera (S07 cut to 20 s)**
- **Primary text:** I'm not a pilot or an A&P. I'm building TailBook, an owner-side due-date board, and an IA reviews the rules. ¶ Before I write code, I'm hand-building free Airworthiness Snapshots from owners' logbook photos: every due date with its regulation, delivered within 48 hours.
- **Headline:** Free Snapshot of your due dates *(31)* · **Description:** From logbook photos, in 48h · **CTA button:** Sign up

**M08 · M1 · Reel (S10)**
- **Primary text:** Annual coming up? Get your punch list ready before you drop the plane off: every squawk from the year, plus the 24-month items coming due, so your IA can plan one visit. ¶ Get a free Snapshot of your due dates from photos of your entries.
- **Headline:** Annual season: bring a list *(27)* · **Description:** Free Snapshot in 48 hours · **CTA button:** Sign up

**M09 · Offer · Static: price card**
- **Primary text:** Founding Owners: the first 250 aircraft lock in $149/yr for life (regular $199/yr per aircraft). ¶ Hold your spot with a $49 deposit, credited via an App Store offer code at launch, or fully refunded. iPhone/iPad app in development.
- **Headline:** Founding Owner: $149/yr for life *(32)* · **Description:** First 250 · $49 refundable · **CTA button:** Learn more

**M10 · M3 · Reel (S12)**
- **Primary text:** Partnership owners: who logged the tach last flight? ¶ TailBook (in development) shares one due-date board with every co-owner through iCloud. Whoever flies logs the tach in one tap. One price per aircraft, not per partner.
- **Headline:** One board for every co-owner *(28)* · **Description:** Free checker today · **CTA button:** Learn more
**Launch set (Phase 1):** AS-A runs M01, M02, M06, M08. AS-B runs M03, M04, M07, M09. Hold M05 and M10 as replacements under R1. M09 (offer-first) is the control: if it beats the value-first ads on CPSR, the audience is warmer than we think.

---

## 9. Compliance checklist (every ad, before it goes live)
- [ ] No "airworthy", "legal to fly", "compliant", "certified", "FAA-approved" (`brand-voice.md` §4).
- [ ] Prices exactly: $199/yr per aircraft; Founding $149/yr for life, first 250 aircraft; $49 deposit "credited via an App Store offer code at launch, or fully refunded".
- [ ] "In development" is clear wherever the app is shown, until it ships. No App Store badge before launch.
- [ ] No manufacturer or type-club logos; no competitor names in ad text.
- [ ] Every FAR claim matches `05-guest-article.md`.
- [ ] The UTM is present and `utm_content` matches the ad ID.
- [ ] The landing page wording fix (`brand-voice.md` §0) is live.
