# App Store Launch Plan (aviation channels only)

**When this applies:** only after a PERSEVERE decision (Dec 15), the build cycles in `06-decision-rules.md` §4, and **App Review approval**. Expected window: **Q1 2027 (estimate)**, and in any case before the deposit-terms deadline of **[2027-06-30]**.
**Day 0 ("L")** = the day you press *Release*. Everything below is relative to L.
**Product Hunt, Hacker News and the general tech press are out of scope.** Our buyers read POA, MooneySpace, BeechTalk, COPA, type-club magazines, GA News, AVweb and iPad Pilot News.

---

## 1. Release mechanics (decide before you submit)

| Decision | Recommendation | Why |
|---|---|---|
| Release type | **"Manually release this version"** in App Store Connect | Approval can come any day; you pick a **Tuesday or Wednesday** for L, so forum replies and press land midweek |
| Pre-order | Not needed | Depositors already committed; a pre-order adds one more "come back later" step |
| Founding Owner pricing | Implement per `validation/07-legal-and-appstore.md` §4 (offer codes; Founding product in the same subscription group). **Test the whole depositor path end to end in sandbox/TestFlight** before you submit | The deposit promise ("credited via an App Store offer code at launch, or fully refunded") is the most important promise we've made |
| Founding seat cap | 250 aircraft total = depositors + launch-period redemptions. Track seats in a sheet, because offer codes can't count aircraft for you | Real scarcity only if you actually stop at 250 |
| Attribution | **App Store Connect campaign links**: `https://apps.apple.com/app/id[APP_ID]?pt=[PROVIDER_TOKEN]&ct={campaign}` with `ct` values mirroring our UTM sources (`poa`, `mooneyspace`, `club-copa`, `pod-aviationnewstalk`, `news-ganews`, `email-depositors`…) | App Analytics reports downloads and proceeds by `ct`; there's no backend, so this is our attribution |
| Landing page | Switch the hero CTA to the App Store badge on L; keep the free checker (it's the best demo). Remove the deposit button on L and replace it with "Founding Owner seats left: [N]" | Deposits stop at launch |
| Demo mode | "Sample aircraft" for App Review (guideline 2.1) and for press/creators | Reviewers have no logbooks |

---

## 2. Timeline

### T-14 to T-1 (prepare)
| Day | Do |
|---|---|
| T-14 | Final metadata (§4) + screenshots. Screenshots show real UI with the "All items current?" summary, never the word "Airworthy". Captions in §4c. |
| T-14 | **iPad Pilot News** preview: TestFlight link + demo mode (`partnerships.md` §4). |
| T-10 | Press kit page on the landing domain: the release (§3), 6 screenshots, app icon, founder photo, a 60-s screen recording, the long-form disclaimer, contact. |
| T-10 | Ask type clubs that agreed to a member offer (`04-emails.md` §7) to schedule their newsletter mention for L+1 to L+7. Provide the custom code and a 100-word blurb. |
| T-7 | Email depositors: "Launch is next week. Here's exactly what happens to your $49." Restate the choice: **offer code or full refund**, 60 days to choose, refund by default. |
| T-7 | Record the launch video (script L1 below). Draft every forum post (§2b) and get mod OKs where needed ("Is it OK if I post a launch update in my existing thread?"). |
| T-3 | Submit for review if you haven't already. Expect 24–48h (it can be longer). |
| T-1 | Approved → set L. Generate depositor codes, one per depositor aircraft. Load the email merge. Check the campaign links. |

### Launch week
| Day | Time (ET) | Channel | Action |
|---|---|---|---|
| **L (Tue)** | 7:00 | **Depositors** | Personal email with their offer code and the refund option (template 5a). They get it hours before anyone else, which is their head start. |
| L | 9:00 | **Press** | Release to GA News, AVweb, iPad Pilot News, AOPA news, FLYING (`partnerships.md` §7d). Ask for nothing but consideration. |
| L | 10:00 | **Forums** | *Update your own existing threads* on POA, MooneySpace, BeechTalk, COPA and Backcountry Pilot: "Update: TailBook is live. Thank you to everyone who corrected the cheat sheet." One reply per thread, disclosure, campaign link. **New threads only where the rules and the mod allow.** |
| L | 11:00 | **Snapshot recipients + waitlist** | Email (template 5b). Segment: Snapshot recipients first (they've seen the value), then checker/waitlist emails. |
| L | 12:00 | **Social** | Launch video L1 on Shorts/Reels; X and LinkedIn posts; pin them. |
| L | all day | **Support** | Reply to every email, forum reply and App Store question within 4 hours. Day 1 bugs get fixed before any further promotion. |
| L+1 (Wed) | — | **Facebook groups** | Admin-approved groups only: a short native video + "Founding Owner seats left: [N]" (if the admin OKs promo). |
| L+1–L+7 | — | **Type clubs** | Newsletter mentions run (club-arranged). |
| L+2 (Thu) | — | **Podcasts/creators** | Send 7b to creators who gave TestFlight feedback; ping podcast hosts whose guest episodes already aired with a one-line "it's live" (no new ask). |
| L+3 (Fri) | — | **Review** | Day-3 metrics (§6). Decide whether to run paid (only if Phase 1 in `paid-ads.md` passed). |
| L+5 (Sun) | — | **Social** | "Week one, honest numbers" post: downloads, trials, Founding seats left. Real numbers only. |
| L+6 | — | **Depositors** | Reminder to anyone who hasn't redeemed or asked for a refund (they have 60 days; be gentle). |

### L+7 to L+30
- **Apple Search Ads** (optional, $5–$10/day, estimate): exact-match keywords from `seo-landing-keywords.md` (e.g. "aircraft maintenance", "transponder check", "annual inspection"). Kill if cost per trial start > $15 after $75.
- If `paid-ads.md` Phase 1 passed: point the winning Meta/Google ads at the App Store campaign link (`ct=meta-p3`, `ct=google-p3`), same kill/scale logic, with **cost per trial start** replacing CPSR.
- **Aviation Consumer** review pitch (L+30, once there are real users).
- **Shop counter cards** to the first 20 shops (`partnerships.md` §6).
- **Second wave:** if L lands in Feb–Mar 2027, plan a **Sun 'n Fun (April 2027)** walk-around (not a booth): counter cards, the cheat sheet printed, and the demo mode on an iPad.

### Script L1: launch video (~35 s)
| Time | Visual | VO / text |
|---|---|---|
| 0–2 s | Founder at the hangar holding a phone showing the board. Text: **"In October I said I wouldn't build this unless owners asked. [N] of you did."** | "In October I said I wouldn't build this unless owners asked for it. [N] of you put money down. So here it is." |
| 2–15 s | Screen recording: onboarding → board reveal → "Next due: ELT battery in 41 days" | "TailBook. Eight dates and your tach, and you see what's due on your airplane, with the regulation behind every date." |
| 15–25 s | Widget, tach quick log, PDF export | "Log tach in one tap. Get warned 60, 30 and 7 days out. Send your IA a one-page list before the annual." |
| 25–32 s | Text: "$199/yr per aircraft · Founding Owners $149/yr for life · first 250 aircraft" | "Founding pricing is open until seat 250. There's a 14-day free trial." |
| 32–35 s | End card | "App Store: link in bio. Your A&P/IA and PIC determine airworthiness." |

---

## 3. Press release draft

> **FOR IMMEDIATE RELEASE**
>
> **TailBook launches on the App Store: a due-date board for private aircraft owners, with the regulation behind every date**
>
> *Built with input from owners on the forums and reviewed by an A&P/IA, the iPhone and iPad app tracks the long-interval items owners most often lose track of*
>
> **[CITY, STATE], [DATE]:** [LLC name] today released **TailBook**, an iPhone and iPad app for US Part 91 aircraft owners that shows what's coming due on their aircraft (the annual inspection, the 24-month transponder and altimeter/static-system checks, the ELT inspection and battery date, registration, the VOR check, oil changes, and the recurring Airworthiness Directives the owner enters), each labeled with the regulation it comes from.
>
> Most owners never forget the annual. The items that slip come due every 24 months, or every seven years in the case of aircraft registration since 2023, and use "calendar month" intervals that end on the last day of the month. TailBook does that date math, shows a green, yellow or red status for every item, and sends reminders 60, 30 and 7 days before anything comes due. Hours-based items are forecast into dates from the owner's own utilization.
>
> "I'm not a mechanic, and TailBook doesn't pretend to be one," said [Founder name], founder of TailBook. "Before writing any code, I built [N] free due-date reports by hand from owners' logbook photos and asked them to tell me where I was wrong. [N] owners put down a refundable deposit before the app existed. The app does one job: it makes sure nothing comes due without warning, so the conversation with your IA starts with a complete list."
>
> **Key features**
> - Status board with the regulation cited for every item, plus home-screen and lock-screen widgets
> - Recurring AD and service-bulletin tracking with "whichever comes first" hour and calendar intervals (the owner and their IA determine applicability)
> - One-tap tach and Hobbs logging, with utilization-based forecasts
> - Logbook page scanning with on-device text recognition, linked to each item
> - Squawk list and one-page PDF exports for the owner's mechanic, insurer or buyer
> - One shared board for co-owners through iCloud; no TailBook account, and no TailBook servers storing aircraft data
>
> **Pricing and availability.** TailBook is available now on the App Store for iPhone and iPad in the United States. It costs **$199 per aircraft per year** (or $24.99 per month) with a 14-day free trial. The first 250 aircraft qualify for **Founding Owner pricing of $149 per year for as long as the subscription stays active**; [N] seats remain.
>
> **Important.** TailBook is an organizational tool. It records and calculates dates from information the owner provides. It does not inspect aircraft, determine airworthiness, or determine whether an Airworthiness Directive applies. The owner's A&P mechanic or Inspection Authorization holder and the pilot in command are responsible for determining airworthiness.
>
> **About [LLC name].** [LLC name] is an independent software company based in [city]. TailBook's interval rules were reviewed by [IA name], A&P/IA. *(Include only with the IA's written permission.)*
>
> **Media contact:** [Founder name], founder@[domain], [phone]. Press kit, screenshots and review access: [press kit URL].
>
> ###

**Before sending:** replace every bracket with a real number or delete the sentence. No customer quotes unless that owner gave written permission for that exact wording. Have the lawyer glance at the "Important" paragraph (it's the long-form disclaimer from `07-…` §1, condensed).

---

## 4. App Store metadata

### 4a. Name and subtitle (≤30 characters each; counts verified)
- **Name:** `TailBook: Aircraft Due Dates` (28)
- **Subtitle options** (A/B via product page optimization after launch):
  1. `Annual, transponder, ELT & ADs` (30)
  2. `Know what's due on your plane` (29)
  3. `Due dates with the FAR cited` (28)
  4. `Aircraft inspection reminders` (29)

**Keyword field** (≤100 characters, no spaces; don't repeat words already in the name/subtitle; no trademarks like Cessna, Cirrus, ForeFlight; guideline 2.3.7):
`inspection,pitot,static,airworthiness,directive,logbook,tach,hobbs,squawk,FAR,owner,reminder,IA` (95)

### 4b. Promotional text variants (≤170 characters; can be changed any time without a review; counts verified)
| # | Use when | Text | Chars |
|---|---|---|---|
| P1 | Default / launch | Know what's due on your airplane in 5 seconds: annual, transponder, pitot-static, ELT, registration and your recurring ADs, each with the FAR behind it. | 152 |
| P2 | Nov–Jan (annual season) | Annual season tip: get your punch list ready before you drop the plane off. Log squawks all year, then export one PDF for your IA. | 130 |
| P3 | While Founding seats remain | Founding Owners: the first 250 aircraft lock in $149/yr for life (regular $199). Have an offer code? Redeem it in Settings. | 123 |
| P4 | Trust angle | Calendar-month math, done right. An inspection on March 3 is good through March 31 next year, and TailBook warns you 60, 30 and 7 days out. | 139 |
| P5 | Partnerships | Co-owners share one board. Whoever flies logs the tach in one tap, and everyone sees what's coming due. One price per aircraft. | 127 |
| P6 | Effort angle | Eight dates and your tach. Five minutes to your first board. No account, no logbook digitizing: your data stays on your device and iCloud. | 138 |
| P7 | After each update | New: [feature]. Every due item still shows its FAR citation, and your A&P/IA and the pilot in command still make the airworthiness call. | 136 + feature |

P3 deliberately says "offer code", not "deposit": no in-app or metadata reference to the web deposit (guideline 3.1.1, `07-…` §6).

### 4c. Description (first 3 lines show before "more")
> Know what's due on your airplane in five seconds. TailBook is the due-date board for US Part 91 owners: every item shows its regulation, its due date and its days remaining.
>
> • Annual (91.409), transponder (91.413), altimeter/static (91.411), ELT inspection and battery (91.207), VOR check (91.171), registration (47.40), oil and custom items
> • Recurring ADs you enter, with "whichever comes first" hour and calendar logic
> …
> *[End with the long-form disclaimer from `07-…` §1 and links to Terms and Privacy (required for subscriptions, 3.1.2).]*

**Screenshot captions (6):** 1 "Know what's due in 5 seconds" · 2 "The FAR behind every date" · 3 "Warned 60, 30 and 7 days out" · 4 "Recurring ADs, whichever comes first" · 5 "Squawks → one PDF for your IA" · 6 "One board for every co-owner".

---

## 5. Launch emails

**5a. Depositors (L, 7:00 ET)**
> **Subject:** {first_name}, TailBook is live. Here's your Founding Owner code for {tail}
>
> Hi {first_name},
>
> You put $49 down on an app that didn't exist yet. It exists now. Thank you.
>
> **Your choice, as promised:**
> 1. **Use your code:** [CODE] → [redeem link]. It applies your $49 credit to {tail}'s first year at the Founding Owner price of $149/yr, which stays yours as long as your subscription stays active.
> 2. **Or get your $49 back:** reply "refund" and I'll refund it in full through Stripe today.
>
> If I don't hear from you within 60 days, I'll refund you automatically.
>
> Setup takes about five minutes: eight dates and your tach. If anything looks wrong on your board, reply to this email. You'll get me, not a ticket system.
>
> [Founder name] · *TailBook organizes the dates you enter. Your A&P/IA and the pilot in command determine airworthiness.*

*(Make sure the code's discount structure matches this wording exactly; `07-…` §4 says to verify it in App Store Connect first. Adjust the email, never the promise.)*

**5b. Snapshot recipients and waitlist (L, 11:00 ET)**
> **Subject:** The live version of your {tail} Snapshot
>
> Hi {first_name}, the Snapshot I built for {tail} was correct the day I sent it. TailBook keeps it current: log tach in one tap, get warned 60/30/7 days before anything comes due, and send your IA one PDF before the annual.
>
> It's on the App Store now: [campaign link]. There's a 14-day free trial, and the first 250 aircraft get Founding Owner pricing, $149/yr for life (vs $199). [N] seats left.
>
> [Founder name] · *TailBook organizes the dates you enter. Your A&P/IA and PIC determine airworthiness.*

---

## 6. In-app review prompt: timing rules

Use the system prompt only (`requestReview` / `SKStoreReviewController`). Apple shows it **at most 3 times in 365 days** and decides itself whether to display it, so every call has to count.

**Ask only when all of these are true:**
1. The app has been installed **≥ 7 days** and opened on **≥ 3 separate days**.
2. The aircraft has **≥ 6 items** entered (same bar as the Find-It Guarantee).
3. The user **just completed a success moment**:
   - logged tach and the board shows **"All items current"**; or
   - **resolved** an item (it went from yellow/red to green after entering a new completion date); or
   - **exported a PDF** successfully (Status Report or Annual Work Order); or
   - accepted a co-owner invite and the co-owner logged their first flight.
4. **Never** right after: onboarding, the paywall, a purchase/restore, an error, a red/overdue item appearing, a notification tap about something coming due, or a support email.
5. At most once per app version, and **≥ 120 days** between prompts.

**Never:** custom "Do you like TailBook?" pre-prompts that filter unhappy users toward email (it's against App Store guidance); rewards, extended trials or codes for reviews (5.6); asking depositors for reviews in the launch email. A neutral line in a later newsletter ("If TailBook's been useful, a rating helps other owners find it") with the `?action=write-review` link is fine.

**Feedback path for unhappy users:** Settings → "Something wrong? Email the founder" (always visible, not gated behind a rating question).

---

## 7. Launch scoreboard (check L+3, L+7, L+30)

| Metric | L+7 target (estimate) | Source | If missed |
|---|---|---|---|
| Depositors who redeemed or chose | ≥ 80% responded | Seat sheet | Personal follow-up, one per depositor |
| Trial starts | ≥ 100 | App Store Connect | More forum/club reach; check product page conversion |
| Activation (board created within 10 min of first open) | ≥ 70% | On-device analytics if any; otherwise TestFlight-style surveys | Simplify onboarding |
| Trial → paid (**E4**) | ≥ 30% (read at L+14 to L+21) | App Store Connect | Paywall/anchors; Find-It Guarantee visibility |
| Ratings | ≥ 10, avg ≥ 4.5 | App Store | Fix the top support issue first |
| Founding seats used | Report honestly | Seat sheet | — |
| Downloads by campaign link `ct` | Top 3 channels identified | App Analytics | Double down on the top 2 (same rule as the playbook) |
