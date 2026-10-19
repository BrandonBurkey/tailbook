# TailBook Competitor Watch: Competitors, Threats, Market and Regulatory Update

**Prepared for:** Venture studio founder / TailBook team
**Date:** 2026-10-19
**Builds on:** `research/market-research.md` (2026-10-18), §4.1
**Question:** Does a fresh look at competitors, market and rules change the recommendation to build TailBook ($199/yr, iOS, no backend)?

---

## 0. Verdict

**Proceed to the cheap validation MVP (concierge snapshot plus deposits). Do not go straight to a full build. The original report overstated how open this market is.**

1. **The market is not blue ocean. It is fragmented.**
   - I found **25+ owner-side maintenance products**. The original table listed 9.
   - At least **three of them cover 4–6 of TailBook's 6 MVP features**: Coflyt, Aircraft Compliance and BetterPlane.
   - Most of them charge **$0–$140/yr**, so **$199/yr is the most expensive software-only offer in the segment**. Only human services and turbine-grade platforms cost more.
2. **No giant has entered.**
   - ForeFlight's 2025–2026 releases contain no owner maintenance tracking.
   - Garmin is building a **partner ecosystem** through flyGarmin and PlaneSync (Coflyt, Savvy, PLANELOGIX, TBX), not its own tracker.
   - The near-term risk is **being commoditized by free or cheap small players**, not being crushed by a big one.
3. **Aircraft Compliance is TailBook's twin**, launched first and free. It has a red/amber/green board, ADs, a logbook linked to scans, PDF export, notifications, setup by N-number, plus cost tracking. It is a small Montana studio running the same playbook as us.
4. **The defensible wedge is thin.** It rests on native-iOS quality, FAR-correctness and trust, privacy with no account, and **type-club distribution**. It does not rest on features.
5. **What changes in the plan:**
   - Price-test $129/$149/$199 in the concierge stage.
   - Move "suggested ADs" from v2 to v1/v1.1, because it is table stakes now.
   - Launch through one type club (COPA or ABS) rather than all of GA.
   - Add a "what do you use now / would you switch" question to E1–E2.
   - Keep the 2026-12-15 kill date.

Details and evidence follow. See §9 for the full verdict.

> **Method and limitations (please read).**
> - Every direct fetch was blocked by the sandbox egress proxy (HTTP 403 on CONNECT):
>   - Apple's App Store and the iTunes lookup API, AppFollow and Reddit
>   - aircraftcompliance.com and coflyt.com
>   - faa.gov, **registry.faa.gov (the Releasable Aircraft Database download)**, ecfr.gov and federalregister.gov
> - So **every fact below comes from web search result snippets**. Ratings and prices are therefore **search-indexed snapshots** and may be stale.
> - I could not count the FAA registry myself, so §6 uses published survey figures and third-party registry snapshots.
> - Anything I inferred is marked **(estimate)**.
> - Before money is committed, someone should spend about 2 hours on a normal network checking the App Store pages in §2 and doing one registry download.

---

## 1. TailBook's 6 MVP features (the yardstick)

The spec in market-research.md lists 8 must-haves. For comparison I collapse them into the 6 that customers see:

| # | Feature | Notes |
|---|---|---|
| **F1** | **FAR-cited due-date board** | Interval engine with calendar-month logic; annual, 100-hr, §91.411/§91.413, ELT and battery, VOR, registration; widgets and 60/30/7-day alerts |
| **F2** | **AD/SB tracker** | Recurring, whichever-first, method of compliance |
| **F3** | **Tach/Hobbs quick log and forecast** | Hour-based items projected to dates |
| **F4** | **Logbook scan vault** | On-device OCR, pages linked as proof |
| **F5** | **Squawks → PDF exports** | Annual work order, status report |
| **F6** | **Private, no-account, co-owner sharing** | CloudKit/CKShare, no backend |

---

## 2. Competitor profiles

Legend for platforms: **iOS** (iPhone), **iPad** (designed for iPad), **And** (Android), **Web**. Ratings come from search snippets of App Store or aggregator pages.

### 2.1 Direct owner-app competitors

| Competitor | Current price | Platforms | Rating (count) | Target user | Key weakness |
|---|---|---|---|---|---|
| **Aircraft Compliance** (Grizzly Mining Company LLC, Montana) | **Free** during the "Customer Feedback Period", all features unlocked, no card. Paid pricing not published ([site](https://www.aircraftcompliance.com/)) | Web; sign-up emails "a link to the app". **No App Store listing found** | None; launched at Oshkosh 2026 ([GA News](https://generalaviationnews.com/2026/08/06/new-aircraft-compliance-app-simplifies-aviation-maintenance-tracking/)) | Owners, builders, flying clubs, small fleets | Unknown business model and price. A tiny studio with a "growing fleet of purpose-built tools", so focus is at risk. Cloud and account based. No native iOS confirmed |
| **Coflyt** | Free download. Historically **$14/mo or $140/yr** single user, **$36/mo or $360/yr** multi-user, 30-day trial ([Twin & Turbine](https://twinandturbine.com/co-owning-with-coflyte-app-streamlines-aircraft-ownership/); article undated). 2026 price not found | iOS, iPad, And | **4.0 (53)** ([AppFollow](https://apps.appfollow.io/ios/coflyt/1479355740?country=us), via search) | Co-owners and partnerships | Reviews say the new layout is slow, support is "minimal and unresponsive", it does not work offline, features went missing after an update, and updates are infrequent |
| **BetterPlane** | **$119/yr per aircraft** ([Capterra](https://www.capterra.com/p/10047876/BetterPlane/)) or **$11.99/mo** ([Piper Flyer](https://www.piperflyer.com/new-app-digitizes-handwritten-aircraft-logbooks-and-tracks-maintenance/)). 1-month trial, 30-day money-back | iOS, And | Few reviews, all positive ([App Store](https://apps.apple.com/app/id6701693347), [mwm.ai](https://mwm.ai/apps/betterplane-aircraft-logbook/6701693347)) | Owners with paper logbooks; launched April 2026 by a private pilot and engineer | Cloud AI processing of records. Traction unproven. The due-date board is secondary to digitization |
| **FlightBoss** | Free with IAP; **$14.99/mo** ([AppsHunter](https://appshunter.io/ios/app/flightboss/id1556221444)) | iOS | **~10 ratings**; "avg 4.1" unverified | Owners and small fleets | **Last update v1.7.2, April 12, 2023**, so likely stagnant. Logs can't be edited or deleted. The renewal screen hung with no support response |
| **Crewchief GA** | **$49.99/mo + $299.99 intake** ([App Store](https://apps.apple.com/us/app/crewchief-ga/id1470882836)) | iOS | **4.8 (16)** ([AppsHunter](https://appshunter.io/ios/app/crewchief-ga/id1470882836), [marlvel](https://marlvel.ai/apps/crewchief-ga)) | Customers of Crewchief-affiliated shops | Requires the affiliation. Reviews say it is "slow to refresh, finicky with lots of bugs". Updated July 22, 2026 (v1.75.83) |
| **PlaneBud** | Free. **Pro $6.99/mo** (up to 10 aircraft; squawks, docs, logbooks). **Flight School $9.99/mo** ([App Store](https://apps.apple.com/app/id6747727419)) | iOS | Not found | Owners and flight schools | Price anchor at the very bottom. An AI chat assistant rather than a FAR engine. Depth unknown |
| **FlightGuard** | Subscription after a 7-day trial, unlimited aircraft. Price not found ([App Store](https://apps.apple.com/us/app/flightguard/id6736479190)) | iPad | Not found | GA owners and co-owners | Built for iPad first. Supports calendar-month due dates, but the listing doesn't mention transponder, ELT or pitot-static items. Has offline mode, an audit trail and co-owner sharing |
| **HobbsMate** | Free with IAP; price not found ([App Store](https://apps.apple.com/app/id6754582980)) | iPad | Not found | Co-owners | New. Has **photo-based Hobbs/tach reading**, an AD wizard, and cost splitting with balances. Depth unknown |
| **aeroLogbook** | Price not found ([App Store](https://apps.apple.com/app/id1304166683)) | iOS | Not found | Shared ownership | **Closest architecture to TailBook** (iCloud sharing). Has squawks and hour or calendar reminders. No FAR citations seen |
| **Planewise** | Free | iPad | Little data | Flight schools and clubs | Not owner-focused |
| **PLANELOGIX** | Free basic tier; **$129.95/yr per plane** for full tracking (2019 figure, [GA News](https://generalaviationnews.com/2019/12/26/customer-feedback-leads-to-planelogix-relaunch)). Another figure was "$129/month" (old POA thread) | Web, mobile | Not found | Owners wanting a full logbook replacement | Suggests ADs and SBs by make and model, and integrates with flyGarmin. Users say it is "not as user friendly" ([POA](https://www.pilotsofamerica.com/community/threads/aircraft-maintenance-records-program.134976/)) |
| **AirLogbooks** | Not published. Can be bundled into a shop's service pricing ([site](https://airlogbooks.odoo.com)) | Web | Not found | Owners, plus mechanics as a channel | AI AD summaries. Odoo-hosted with a small footprint. **Shop-channel model**, which is worth copying |
| **MyFlightbook** | Free | iOS, And, Web | Long-standing | Pilots | Maintenance intervals are basic. Pilot-centric |
| **ADLOG** | About $200 setup + **under $50/yr** adNote updates ([POA 2024](https://pilotsofamerica.com/community/posts/3578143)) | Paper/binder plus web | Loyal niche | Traditional owners and IAs | Not an app. **But it shows owners pay yearly for "new AD alerts for my aircraft"** |
| **Smaller or newer (thin data)** | Mostly unknown | Mixed | n/a | Owners | AirworthyHQ (end-of-month grace, ELT, pitot-static); Aero Ledge (14 CFR items including VOR); LogWell; Aerologs (AI scan, "coming soon"); SquawkLink; Project 1903 Logbook (OCR, e-signatures); MyTailLog (AI logbook); FlightApp ($99.99/yr pilot logbook plus maintenance); CloudGA and PlanePartner (partnership booking and billing); Squawkd (EU clubs). Sources: [AirworthyHQ](https://airworthyhq.com/), [Aero Ledge](https://aeroledge.com/), [LogWell](https://www.logwell.net/), [Aerologs](https://www.aerologs.com/), [SquawkLink](https://squawklink.com/), [Project 1903](https://www.project1903.com/), [MyTailLog](https://alternativeto.net/software/mytaillog/about/), [FlightApp](https://apps.apple.com/us/app/-/id6478856024), [CloudGA](https://apps.apple.com/us/app/cloudga/id6503251596), [PlanePartner](https://apps.apple.com/us/app/planepartner/id6755367242), [Squawkd](https://squawkd.com/vs) |
| **SmartAVI** | n/a | n/a | n/a | n/a | No maintenance product of this name was found. Not a competitor as far as I can tell |

### 2.2 Services and enterprise platforms (price anchors, not direct rivals)

| Competitor | Price | Target | Weakness for our avatar |
|---|---|---|---|
| **SavvyMx** (Savvy Aviation) | **$500/yr** legacy fixed-gear single; **$750/yr** retractable or TAA single; **$1,000/yr** twin. These are older published figures; the 2026 price is not shown ([Aviation Consumer](https://www.aviationconsumer.com/maintenance/pay-for-play-managed-maintenance/)) | Owners who want a human to manage maintenance | A human service, expensive. Also a flyGarmin data partner |
| **Bluetail** | From **$3.33/day (~$1,215/yr)**, possibly the turbine tier, plus a mandatory onboarding package. In 2020 it was $99/mo for piston ([pricing FAQ](https://bluetail.aero/?p=2884), [AOPA 2020](https://aopa.org/news-and-media/all-news/2020/june/01/bluetail-launches-digital-recordkeeping-service)). Added AI logbooks in February 2026 ([GA News](https://generalaviationnews.com/2026/02/25/bluetail-unveils-addition-to-ai-powered-maintenance-logbooks/)) | Turbine, fleets, high-end piston | Overkill and expensive |
| **Airworthy TBX** (AD Toolbox + Tdata, merged November 2025) | 10-day trial; pricing not published. Historically Tdata cost $300–$700/yr and AD Toolbox about $50/mo ([TBX merger](https://airworthy.com/blog/tdata-ad-toolbox-merge-to-form-tbx), [MooneySpace](https://mooneyspace.com/topic/24206-ad-and-maintenance-tracking/)) | Shops and IAs (4,500+ customers) | Built for shops. **A potential data partner or channel**, not a rival |
| **Traxxall / Traxxall Aviator** | Traxxall from **$1,800 per aircraft per year**; Aviator from **$825 flat** ([Capterra](https://www.capterra.com/p/10005337/Traxxall-Aviator/)) | Part 91 light jets and turboprops | Turbine-focused |
| **CAMP** | About **$700/mo per aircraft** (comparison-site estimate, [ITQlick](https://www.itqlick.com/traxxall/competitors)) | Business aviation | Turbine and enterprise |
| **Veryon (Flightdocs)** | Sales-led, not published ([G2](https://www.g2.com/products/veryon-veryon-tracking/pricing)) | Business aviation, helicopters | Enterprise |
| **Air Ledger** | **$199.99/mo per aircraft** (undated, [BJT](https://bjtonline.com/node/2860)) | Owners with aviation managers | Expense-focused, turbine |

### 2.3 The platform giants

| Player | Status (October 2026) | Evidence |
|---|---|---|
| **ForeFlight** (now **Jeppesen ForeFlight**, owned by Thoma Bravo) | **No owner maintenance tracking.** The Logbook has aircraft profiles only. July 2026 releases added an AI Connector (ChatGPT/MCP reading logbook data), ClearNotams and a **flight-school Scheduler**. Boeing sold Jeppesen and ForeFlight for $10.55B (closed around October 31, 2025), and Thoma Bravo says it will grow "organically and through strategic M&A" | [ForeFlight releases](https://foreflight.com/releases), [AIN Jul 2026](https://www.ainonline.com/aviation-news/business-aviation/2026-07-01/ai-powers-new-jeppesen-foreflight-features), [AI Connector](https://foreflight.com/enhancements/foreflight-ai-connector), [GovConWire](https://www.govconwire.com/articles/thoma-bravo-boeing-digital-aviation-deal), [Airport Technology](https://www.airport-technology.com/news/jeppesen-foreflight-begins-operations) |
| **Garmin** (Garmin Pilot, PlaneSync, flyGarmin) | **No native maintenance tracker.** PlaneSync (GDL 60, $10–$45/mo plans) uploads flight and engine logs automatically. In 2026 Garmin added **Coflyt** and Class A as integrations, alongside Savvy, PLANELOGIX, AircraftMX, FlySto and TBX. Garmin's strategy is to **feed partners**, not to build a tracker | [Garmin 2026 integrations](https://www.garmin.com/en-US/newsroom/press-release/aviation/garmin-adds-more-service-integrations-to-simplify-and-automate-aircraft-flight-logging-with-planesync/), [Garmin PlaneSync](https://www.garmin.com/en-US/newsroom/press-release/aviation/garmin-introduces-planesync-connected-aircraft-management-system-to-simplify-individual-and-fleet-aircraft-ownership/), [AIN 2025](https://backend.ainonline.com/aviation-news/business-aviation/2025-07-16/garmin-planesync-adds-automatic-flight-log-sharing) |

---

## 3. Feature-comparison matrix

● = has it, ◐ = partial or weaker version, ○ = no, ? = unknown from available evidence. "FAR cites" means the app shows the regulation for each item. **No competitor I found advertises per-item FAR citations**, though several track the same items.

| Product | F1 Due-date board (FAR cites) | F2 AD/SB tracker | F3 Hours log + forecast | F4 Scan vault / OCR | F5 Squawks → PDF | F6 No-account / private + co-owner share | Extras TailBook lacks | Price/yr |
|---|---|---|---|---|---|---|---|---|
| **TailBook (planned)** | ● (●) | ● manual | ● + forecast | ● on-device | ● | ● (CloudKit) | n/a | $199 |
| Aircraft Compliance | ● (?) | ● | ◐ (cost/hr implies hours) | ● (entries linked to scans; reads pages to seed) | ◐ (logbook PDF; squawk costs) | ○ (cloud account) / ? | Budget vs actual, cost/hr, N-number setup | Free (for now) |
| Coflyt | ● (?) | ● **auto-import by make/model** | ● (**Garmin auto-logs**) | ◐ docs | ◐ squawks | ○ / ● partnership | Scheduling, Stripe billing, onboarding call | ~$140 (old) |
| BetterPlane | ● (?) | ● (AI extracts ADs) | ? | ● AI (cloud) | ? | ○ / ? | AI digitization of full history | $119 |
| FlightBoss | ● (?) | ? | ● | ◐ docs | ● squawks to mechanic | ○ / ● co-owners | n/a (stale) | ~$180 |
| Crewchief GA | ● | ● | ● | ● (shop-scanned) | ◐ | ○ / ○ | Human records review | ~$900 first year |
| PlaneBud | ◐ | ? | ● | ◐ docs | ◐ squawks; PDF only for school endorsements | ○ / ◐ | AI chat assistant, METAR | $84 |
| FlightGuard | ● calendar-month | ? | ● | ? (auto value extraction) | ? | ? / ● co-owners, audit trail, offline | Unlimited aircraft | ? |
| HobbsMate | ● | ● AD wizard | ● **photo meter reading** | ◐ docs | ● squawks | ? / ● | Cost splitting, balances | ? |
| aeroLogbook | ● (○) | ? | ● | ? | ● squawks | **● iCloud sharing** | Business vs personal use split | ? |
| PLANELOGIX | ● | ● suggested by make/model | ● (Garmin) | ● scanned logs | ◐ | ○ / ◐ | Full logbook replacement | ~$130 (2019) |
| MyFlightbook | ◐ | ○ | ● | ○ | ○ | ○ / ○ | Pilot currency | Free |
| SavvyMx | ● (human) | ● (human) | ● | ● | ● | ○ | Expert management, breakdown help | $500–$1,000 |
| Spreadsheet / Reminders | ◐ | ◐ | ◐ | ○ | ○ | ◐ | Free, flexible | Free |

**What the matrix says:**
1. TailBook's feature set is **not unique**. Aircraft Compliance and Coflyt cover nearly everything.
2. What is unique, or at least unclaimed:
   - per-item **FAR citations** with correct calendar-month math as a trust feature
   - **on-device** OCR and **no account**
   - a native-iOS widget, lock-screen and Siri layer
   - the **annual work-order PDF** workflow
3. TailBook is **behind** on:
   - AD suggestions (Coflyt, PLANELOGIX, HobbsMate's wizard)
   - automatic hours (Coflyt through Garmin; HobbsMate through photo reading)
   - cost tracking (Aircraft Compliance, HobbsMate)

---

## 4. Threat assessment

### 4.1 Could ForeFlight crush us?
- **Today: no.** Nothing in the 2025–2026 releases touches owner maintenance. Their product energy is in AI (the AI Connector), NOTAMs and flight-school scheduling ([AIN](https://www.ainonline.com/aviation-news/business-aviation/2026-07-01/ai-powers-new-jeppesen-foreflight-features)).
- **The risk is M&A, not a build.**
  - Thoma Bravo's stated playbook is to grow through acquisitions. The obvious tuck-in is buying an owner-maintenance app (Coflyt- or BetterPlane-sized) and bundling it into Premium. ForeFlight's 2026 flight-school Scheduler shows it is willing to move beyond pure EFB.
  - Probability of a ForeFlight owner-maintenance feature or acquisition by end of 2027: **15–25% (estimate)**.
  - If it happens, a $199 standalone app against "included in your ForeFlight Premium" is a **severe** threat.
- **What holds them back:** airworthiness liability (Boeing kept its maintenance and diagnostics assets when it sold), and the fact that owner maintenance is a small slice of their pilot base.
- **Mitigations:**
  - Be the best at the owner job, not the pilot job.
  - Export cleanly (CSV, PDF, .ics) so we never look like a lock-in risk.
  - Make TailBook an **acquirable** asset: a clean data model and type-club relationships.

### 4.2 Could Garmin crush us?
- **Unlikely as a competitor; more likely a gatekeeper.** Garmin has chosen to **partner** (Coflyt, Savvy, PLANELOGIX, TBX, AircraftMX) rather than build ([Garmin 2026](https://www.garmin.com/en-US/newsroom/press-release/aviation/garmin-adds-more-service-integrations-to-simplify-and-automate-aircraft-flight-logging-with-planesync/)).
- **The real risk is indirect.** Partners such as Coflyt get **automatic hours** for Garmin-equipped aircraft, while TailBook asks for manual tach entry.
- Our no-backend design makes a flyGarmin integration hard. Partner APIs usually expect a server-side OAuth client. Whether this is possible on-device is **unknown**.
- **Mitigation:** make manual entry nearly free, with photo meter reading through on-device Vision and a widget. Treat "Garmin partner" as a v2 question that may justify a minimal serverless token relay.

### 4.3 Could Aircraft Compliance crush us?
- **It is the most direct threat on positioning.** Its pitch is almost word-for-word ours: red/amber/green for every inspection, AD and life-limited part; an audit-ready logbook where each entry links to a signed scan; a logbook PDF export; calendar notifications. It adds cost tracking and N-number setup ([site](https://www.aircraftcompliance.com/), [GA News](https://generalaviationnews.com/2026/08/06/new-aircraft-compliance-app-simplifies-aviation-maintenance-tracking/)).
- **It is free right now** and got Oshkosh press.
- **Where it is vulnerable:**
  - No App Store app found, so it appears to be web-first.
  - Pricing is undeclared. The free period will end, and conversion will cause friction.
  - It is built by a small studio with several products ("a growing fleet of purpose-built tools forged in the same Montana workshop").
  - It is cloud-based with an account.
- **Assessment:** it will not crush us by being better. It **could take the "first mover" slot in owner forums and get free signups.** Threat level is **high on positioning, medium on execution (estimate)**.
- **Action:** sign up for it (it is free) and do a real teardown in week 1. Watch its paid-price announcement, because that sets the market anchor.

### 4.4 The under-rated threat: Coflyt
Coflyt has **AD auto-import**, **Garmin auto-logging** (2026), partnership billing and an older but real user base (53 ratings). Its reviews show it is **slow, has poor support, doesn't work offline and is rarely updated** ([AppFollow via search](https://appfollow.io/ios/coflyt/1479355740?country=us)). That makes it beatable on quality, but it sets a **~$140/yr** price expectation with more features than TailBook v1.

### 4.5 Our defensible wedge (honest version)
Features are not a moat here, because every listed feature already exists somewhere. The wedge has to be a **combination**:

1. **Trust and correctness as the product.** Every item cites its FAR, the calendar-month math is right, and an IA-validated rules engine stands behind it. The "error promise" guarantee is something no competitor offers. Owners argue about this math on forums, and competitors don't show their work.
2. **Native-iOS speed and offline use.** Widgets, lock screen, Siri and Live Activities, launching instantly. This directly targets the top complaint about Coflyt and Crewchief: slow, buggy, no offline mode.
3. **Privacy and no account.** Records live in the owner's iCloud. Every major competitor is cloud plus account, and owners are wary of who holds their logbooks. This is a niche message that resonates with a certain kind of owner **(estimate)**, not a mass driver.
4. **The annual-cycle workflow.** Squawks become an IA work-order pack, and a status report goes to the IA, insurer or buyer. This pairs naturally with an **A&P/IA shop channel**, which AirLogbooks also uses.
5. **Distribution moat: type clubs.** Type templates (Cirrus CAPS, Bonanza, Mooney) and a club partnership with a member discount. **This is the only part that compounds**, so pick one club first.

**Conclusion:** the wedge exists but is **narrow and based on execution**. It would not survive a well-executed ForeFlight bundle. It can beat today's field of small apps.

---

## 5. Pricing implications

| Band | Examples | Annual |
|---|---|---|
| Free / near-free | Aircraft Compliance (for now), MyFlightbook, Planewise, PlaneBud ($84), spreadsheets | $0–$84 |
| Owner software | BetterPlane $119, PLANELOGIX ~$130, Coflyt ~$140, FlightBoss ~$180 | $119–$180 |
| **TailBook as proposed** | n/a | **$199** |
| Services / human | SavvyMx $500–$1,000, Crewchief ~$900 first year, Bluetail ~$1,200+ | $500–$1,200+ |
| Turbine / enterprise | Traxxall Aviator $825+, Traxxall $1,800, CAMP ~$8,400 | $825–$8,400+ |

- The original pitch anchored $199 against SavvyMx and Bluetail. Owners will actually anchor against **BetterPlane and Coflyt at $119–$140**.
- **Recommendation:**
  - Test **$129 / $149 / $199** in the concierge deposit step (E2), using three landing-page variants.
  - Keep $199 only if conversion at $199 is at least 70% of conversion at $149 **(estimate threshold)**.
  - The Founding Owner price of $149 for life already sits in the right band.

---

## 6. Market-size check

| Metric | Figure | Source / note |
|---|---|---|
| Active piston aircraft (CY2024 FAA GA Survey) | **138,960**, down from 139,300 in CY2023. 16.16M hours, more than half of all GA hours | [GA News](https://generalaviationnews.com/2026/02/11/ga-doing-more-with-less/), [FAA CY2024](https://www.faa.gov/data_research/aviation_data_statistics/general_aviation/cy2024). Piston singles are **sampled**, not censused |
| Experimental / Special LSA active | **30,936** (2024), down from 33,121 | Same GA News article. **Newly relevant because of MOSAIC (§7)** |
| Fleet age | About 30,000 active aircraft are 45–49 years old | Same |
| Total FAA registry (all aircraft) | About **292,733** registered (third-party snapshot of the Releasable Aircraft Database). Another API shows 312,733 | [ai-analytics.org](https://ai-analytics.org/writing/faa-aircraft/), [api.ai-analytics.org](https://api.ai-analytics.org/agency/faa). **I could not download the registry myself (blocked)** |
| Registered fixed-wing single-engine piston | About **175k–190k** **(estimate)**: roughly 60–65% of the registry. The active subset is about 139k per the survey | **(estimate)**. Verify by counting `TYPE AIRCRAFT=4` and `TYPE ENGINE=1` in MASTER.txt |
| Registry hygiene | The 7-year registration term (effective January 23, 2023) means stale registrations linger longer, so registered-minus-active is a growing "ghost fleet" | [AOPA 2023](https://www.aopa.org/news-and-media/all-news/2023/february/06/faa-extends-expiration-date-of-aircraft-registration-certificates) |
| Trend | Older FAA forecasts: piston-single fleet and hours about **–0.8%/yr**; private pilots about –0.7%/yr. I could not confirm the FY2026–2046 tables | [AvWeb](https://avweb.com/recent-updates/business-military/faa-20-year-forecast-predicts-gradual-decline-in-light-ga/), [FAA forecasts](https://www.faa.gov/data_research/aviation/aerospace_forecasts) |
| AOPA membership | **"More than 300,000 aircraft owners and pilots"** (AOPA congressional testimony 2022/2023). A partner page cites **320,000 active members**. AOPA marked its 75th anniversary in 2026 | [Baker testimony 2023](https://democrats-transportation.house.gov/download/03/08/2023/mark-baker-testimony&download=1), [Lightspeed](https://www.lightspeedaviation.com/?p=7675), [AIN 2026](https://backend.ainonline.com/sites/default/files/article_export/rtf/AOPA_Marks_75th_Anniversary_Today-03-09-2026.rtf) |
| COPA membership | **7,000+** members, up from 6,600+ in August 2025; **$95/yr** | [COPA](https://www.cirruspilots.org/), [Become a member](https://www.cirruspilots.org/become-a-member) |
| Owner demographics | No current published owner census found. AOPA's 2021 insurance survey (30,000+ pilots and owners) found pilots over 70 fly **about 70 hrs/yr versus under 50 for younger pilots**. Forum anecdote: 3 of 72 owners earned ≤$60k. Avatar: **age 50–70, professional or business owner, household income $150k+** **(estimate)** | [AOPA 2021](https://aopa.org/news-and-media/all-news/2021/november/16/older-pilots-report-negative-treatment-from-insurance-companies), [POA](https://pilotsofamerica.com/community/threads/income-and-aircraft-survey.82327/page-3) |

**Revised serviceable market (estimate):**
- Active pistons: about 139k.
- Minus aircraft in flight schools, clubs, Part 135 or managed programs (SavvyMx, Crewchief, CAMP-style): about 15–25% **(estimate)**.
- Plus E-AB and LSA newly in scope: about 31k, at partial fit.
- Result: about **105k–125k owner-managed aircraft (estimate)**.

**Revised ARR (estimate):**
- Original: 1–5% penetration, giving $240k–$1.2M.
- With 20+ competitors, 1–5% in three years is optimistic. A more honest range is **0.5–2% → about 550–2,500 aircraft → $80k–$500k ARR at $149–$199 (estimate)**.
- Reaching $1M+ ARR needs either category leadership or a second segment (clubs, partnerships, shops).
- **This is the biggest change from the original report.** The original upside looks too high.

---

## 7. Regulatory watch (2025–2026)

| Area | Status found | Impact on TailBook |
|---|---|---|
| **ELT §91.207** | **No FAA change found.** The eCFR as of March 19, 2026 still requires inspection "within 12 calendar months" ([eCFR Part 91](https://www.ecfr.gov/on/2026-03-19/title-14/chapter-I/subchapter-F/part-91)). | Interval engine unchanged |
| **FCC 121.5 MHz ELTs** (WT Docket 01-289) | History: a ban in 2010 that was later stayed; 2013 proposals opposed by AOPA, EAA and FAA; a manufacture and sale prohibition effective January 11, 2019 that did not ban use ([AOPA 2013](https://www.aopa.org/news-and-media/all-news/2013/april/05/aopa-opposes-fcc-proposal-to-ban-121-5-mhz-emergency-locator), [Piper Owner](https://piperowner.org/?p=3518)). AIN export files with 2026 filenames mention a proposed total ban and a rescission ([AIN](https://backend.ainonline.com/sites/default/files/article_export/rtf/FCC_Seeks_To_Outlaw_121.5-MHz_ELTs-28-04-2026.rtf)). **These look like re-exports of the 2010–2011 stories, so they are unverified as 2026 events.** | **Watch item.** Keep ELT type (121.5 versus 406) in the profile. If a use ban ever lands, a "replace by date" alert is a strong engagement hook. Add **NOAA 406 beacon registration renewal (every 2 years)** as a tracked item. This comes from domain knowledge, not this search, so **verify** it |
| **Registration** | The 7-year term has applied since January 23, 2023. The federal fee is still **$5** (CFR text current January 1, 2026). No 2026 federal change found. States are moving, for example a Utah 2026 bill on aircraft registration fees ([Utah SB0172 fiscal note](https://pf.utleg.gov/public-web/sessions/2026GS/fiscal-notes/SB0172.fn.html), [14 CFR 47](https://www.federal-regs.com/title/14/part-48/48.30/)) | Keep the 7-year expiry with a renewal reminder starting about 6 months out. **v1.1: optional state registration and tax expiry** |
| **ADS-B Out §91.225/§91.227** | No 2026 change found. A 2023 direct final rule added TSO-C166c and TSO-C154d, and a 2024 correction fixed cross-references ([FR 2023](https://www.govinfo.gov/content/pkg/FR-2023-11-28/html/2023-26145.htm), [FR 2024](https://public-inspection.federalregister.gov/2024-08885.pdf)) | No recurring ADS-B inspection exists. It is usually checked during the §91.413 transponder check. Store ADS-B unit and TSO in the profile for AD hooks |
| **§91.411 / §91.413** | No change found. AC 43-6D remains current guidance ([AC 43-6D](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_43-6D.pdf)) | Unchanged |
| **MOSAIC final rule** (published July 24, 2025) | Maintenance and repairman provisions took effect **October 22, 2025**; airworthiness and operations provisions **July 24, 2026**. A light-sport repairman with an inspection rating can now perform the **condition inspection of an E-AB** in the same category ([FAA MOSAIC](https://www.faa.gov/aircraft/MOSAIC), [Kitplanes](https://www.kitplanes.com/mosaic-is-here-what-it-means-for-homebuilts/)) | **Opportunity:** add a "condition inspection (operating limitations)" item type for E-AB and LSA, without implying §91.409. That opens about 31k active E-AB and LSA aircraft. Type-certificated aircraft are unchanged |
| **IA → Inspection Rating NPRM** (July 1, 2026; comments closed August 31, 2026) | Would turn the IA into a permanent **Inspection Rating** on the mechanic certificate, replacing biennial renewal with a 12-month recent-experience requirement ([Federal Register](https://www.federalregister.gov/documents/2026/07/01/2026-13282/mechanic-certification-inspection-rating-and-recent-experience-requirements), [AvWeb](https://avweb.com/aviation-news/faa-proposes-new-inspection-rating/)) | Copy and labels: use "IA/IR" wording. Store the signer's certificate number on annual entries. Low effort |
| **Recurring AD trends: piston engines** | **Lycoming AD 2026-04-11**: connecting rods, supersedes 2024-21-02, **repetitive oil inspection for bronze particulates**, expanded applicability, effective April 8, 2026 ([Federal Register](https://www.federalregister.gov/documents/2026/03/04/2026-04281/airworthiness-directives-lycoming-engines), [Cessna Flyer](https://www.cessnaflyer.org/knowledge-base/aviation-alerts/airworthiness-directive-ad-2026-04-11-affecting-lycoming-engines.html)). **Lycoming AD 2026-17-10**: piston pins on O-235, O-540 and IO-540, replacement plus oil change and particulate inspection; effective date conflicts between Sept 14 and Oct 2, 2026 ([GovInfo](https://www.govinfo.gov/content/pkg/FR-2026-08-28/pdf/2026-17584.pdf)). **Lycoming fuel-line clamp AD**, recurring every 110 hrs ([Airworthy "Usual Suspects"](https://www.airworthy.com/blog/usual-suspects)) | **Recurring engine ADs are increasingly tied to oil changes or filter inspections.** TailBook should let an AD recurrence be **triggered by an oil-change event**, not only by hours or calendar |
| **Recurring AD trends: airframes** | **Piper PA-28/PA-32 wing spar AD 2020-26-16** (about 5,440 US aircraft above 5,000 factored service hours). A September 2024 NPRM would supersede it with expanded models and repetitive bolt-hole inspections, and a November 2024 notice would move some aircraft from factored to actual service hours ([AvWeb](https://avweb.com/?p=124769), [FR Sep 2024](https://www.govinfo.gov/content/pkg/FR-2024-09-23/html/2024-21652.htm), [FR Nov 2024](https://www.govinfo.gov/content/pkg/FR-2024-11-07/html/2024-25883.htm)); no 2025–2026 final rule found. **Cessna seat-rail** recurring inspections remain a perennial ([forum](https://www.aircraftpilots.com/forums/topic/22550-accident-at-caboolture/page/3)). The most-missed category is **appliance ADs** (magnetos, carburetors and servos, starters, ELTs, filters), which don't appear on airframe or engine lists ([TBX](https://www.airworthy.com/blog/usual-suspects)) | Support **custom hour bases** (factored service hours) per item. Add an **appliance inventory** (§8, #3). Type templates for PA-28 must include the spar item |

---

## 8. Ten feature ideas for v1.1, ranked

Ranked by (user demand evidence × competitive necessity) ÷ build effort under the no-backend constraint.

| Rank | Feature | Evidence users want it | Fit with no backend | Effort |
|---|---|---|---|---|
| **1** | **Suggested ADs by make, model, engine and prop, plus "new AD for your aircraft" alerts.** Owner confirms applicability; we never claim completeness | The most-requested capability in MooneySpace threads ("automatically finding applicable ADs would be a real improvement") ([MooneySpace](https://mooneyspace.com/topic/24206-ad-and-maintenance-tracking/)). Coflyt and PLANELOGIX already do it. ADLOG users pay yearly just for new-AD notices | A static, versioned AD index file on a CDN, refreshed weekly and matched on-device | M–L |
| **2** | **Photo meter reading for Hobbs/tach** (Vision OCR) plus import of Garmin/ForeFlight track CSV | HobbsMate markets photo reading. Coflyt gets Garmin auto-logs. "Partners never log tach" is in our own problem list | Fully on-device | S–M |
| **3** | **Appliance inventory** (mags, carb or servo, ELT, starter, vacuum pump, governor) with serials, linked to ADs | Appliance ADs are "the most missed" ([TBX](https://www.airworthy.com/blog/usual-suspects)). Owners note the manual pain of picking ADs "per serial number" | On-device | S |
| **4** | **Cost tracking: annual budget versus actual, cost per hour** | Aircraft Compliance leads with it. HobbsMate and Coflyt have expenses | On-device | M |
| **5** | **Co-owner cost split and balances** | HobbsMate cost splitting, Coflyt billing, CloudGA and PlanePartner. Partnerships are our growth loop | CKShare plus local math (no payments) | M |
| **6** | **Read-only "share with my IA/shop" link or pack** | FlightBoss sends squawks to the mechanic. AirLogbooks builds a shop channel. It is also our GTM shop channel | CKShare read-only, or a PDF/.ics bundle | S |
| **7** | **More expiry types:** insurance policy, NOAA 406 beacon registration, state registration, pilot medical, flight review, owner's IFR currency (optional) | A MooneySpace owner wants "BFR, medical, etc." tracked. State fee changes | Trivial | S |
| **8** | **AI-assisted logbook entry extraction** to seed history from scans (on-device model, owner reviews each entry) | BetterPlane, MyTailLog, Aerologs and Aircraft Compliance ("reads uploaded logbook pages to seed inspections") | On-device Vision and Apple foundation models where available | L |
| **9** | **Full edit history and undo (audit trail) on every entry** | FlightBoss complaint: "can't edit or delete logs". FlightGuard sells an audit trail | On-device | S |
| **10** | **Oil-change-triggered items and oil analysis log** (lab results, trend notes) | Lycoming 2026 ADs require oil and filter inspections. Savvy and Garmin partners do engine analysis | On-device | S |

Also from reviews, a quality bar rather than a feature: **offline-first, fast launch, responsive support.** These are the top complaints about Coflyt and Crewchief, and they cost nothing to promise and keep.

---

## 9. Verdict: does anything here change the recommendation?

**Yes, partly. The recommendation moves from "build TailBook" to "validate TailBook, with a changed price test and scope, before building".**

**What got worse:**
1. **The competition is much denser than reported.** There are 25+ products, and three cover most of our MVP: Coflyt, Aircraft Compliance and BetterPlane. The "tiny indie apps with 0–16 ratings" framing was right about *traction* but wrong about *crowding*. This looks more like the REPS red ocean the original report penalized #2 for.
2. **Price anchoring is weaker.** Software rivals cost $0–$180/yr, so $199 is the top of the band.
3. **The closest new entrant is free and positioned identically.**
4. **Upside is lower:** about $80k–$500k ARR at realistic share **(estimate)**, versus $240k–$1.2M originally.

**What held up or improved:**
1. **No giant is in the space.** ForeFlight has shipped nothing. Garmin partners rather than builds.
2. **Incumbents are weak on quality.** Coflyt is slow and offline-hostile with poor support. FlightBoss has been stagnant since 2023. Crewchief is buggy and gated to affiliated shops.
3. Nobody claims **per-item FAR citations, correct calendar-month math, on-device privacy or an annual work-order workflow**.
4. Regulation brings **small tailwinds**: MOSAIC opens E-AB and LSA condition inspections, Lycoming ADs are oil-change-linked, and there is a PA-28 spar template hook.
5. Type clubs remain reachable, and COPA is growing (7,000+).

**The honest bottom line:**
- TailBook is still a reasonable **small, cash-flow niche bet**, because the validation experiments cost about one week.
- It is **not** the clear blue-ocean winner the first report described.

**Changes before any SwiftUI build:**
1. **Concierge step (E1/E2):**
   - Ask every respondent what they use today and whether they've tried Coflyt or Aircraft Compliance.
   - Run three deposit price points ($129/$149/$199).
   - **Pass bar raised:** at least 15% deposit rate at $149 or higher, **and** at least 40% of depositors have tried or rejected at least one competing app (proof we beat alternatives, not just spreadsheets).
2. **Scope:** promote #1 (suggested ADs) and #2 (photo meter reading) from §8 into v1. Cut CloudKit co-owner sharing to v1.1 if needed to hold the timeline.
3. **Go-to-market:** launch inside **one type club** (COPA or ABS) with Cirrus or Bonanza templates validated by an IA. Do not launch to all of GA.
4. **Competitor teardown in week 1:** sign up for Aircraft Compliance (free), Coflyt (trial), BetterPlane (trial) and PlaneBud. Re-check on the App Store from a normal network.
5. **Kill or pivot (keep 2026-12-15).**
   - Kill or pivot if deposit conversion is under 5%, **or** if Aircraft Compliance announces a free-forever tier that respondents call "good enough".
   - The pivot candidates stay as before: clubs, partnerships, or a shop-channel B2B tool. Or switch to #2 (REPS), noting that it is also crowded.

---

## 10. Sources (all accessed through web search, 2026-10-19; direct fetches were blocked)

**Competitors**
- Aircraft Compliance: https://www.aircraftcompliance.com/ ; GA News (Aug 2026): https://generalaviationnews.com/2026/08/06/new-aircraft-compliance-app-simplifies-aviation-maintenance-tracking/
- Coflyt: https://apps.apple.com/app/id1479355740 ; https://apps.appfollow.io/ios/coflyt/1479355740?country=us ; https://twinandturbine.com/co-owning-with-coflyte-app-streamlines-aircraft-ownership/ ; https://ipadpilotnews.com/2020/06/coflyt-app-simplifies-aircraft-ownership-and-maintenance-tracking/
- BetterPlane: https://www.capterra.com/p/10047876/BetterPlane/ ; https://apps.apple.com/app/id6701693347 ; https://www.piperflyer.com/new-app-digitizes-handwritten-aircraft-logbooks-and-tracks-maintenance/ ; https://mwm.ai/apps/betterplane-aircraft-logbook/6701693347
- FlightBoss: https://appshunter.io/ios/app/flightboss/id1556221444 ; https://apps.apple.com/app/id1556221444
- Crewchief GA: https://apps.apple.com/us/app/crewchief-ga/id1470882836 ; https://appshunter.io/ios/app/crewchief-ga/id1470882836 ; https://marlvel.ai/apps/crewchief-ga
- PlaneBud: https://apps.apple.com/app/id6747727419
- FlightGuard: https://apps.apple.com/us/app/flightguard/id6736479190
- HobbsMate: https://apps.apple.com/app/id6754582980
- aeroLogbook: https://apps.apple.com/app/id1304166683 ; https://aerologbook.com/
- PLANELOGIX: https://generalaviationnews.com/2019/12/26/customer-feedback-leads-to-planelogix-relaunch ; POA: https://www.pilotsofamerica.com/community/threads/aircraft-maintenance-records-program.134976/
- AirLogbooks: https://airlogbooks.odoo.com
- ADLOG: https://pilotsofamerica.com/community/posts/3578143 ; https://adlog.com/
- Airworthy TBX: https://airworthy.com/blog/tdata-ad-toolbox-merge-to-form-tbx ; https://www.airworthy.com/blog/usual-suspects
- SavvyMx: https://www.aviationconsumer.com/maintenance/pay-for-play-managed-maintenance/
- Bluetail: https://bluetail.aero/?p=2884 ; https://aopa.org/news-and-media/all-news/2020/june/01/bluetail-launches-digital-recordkeeping-service ; https://generalaviationnews.com/2026/02/25/bluetail-unveils-addition-to-ai-powered-maintenance-logbooks/
- Traxxall: https://www.capterra.com/p/10005337/Traxxall-Aviator/ ; https://www.itqlick.com/traxxall/pricing
- CAMP / Flightdocs: https://www.itqlick.com/traxxall/competitors ; https://www.itqlick.com/flightdocs/pricing
- Veryon: https://www.g2.com/products/veryon-veryon-tracking/pricing
- Air Ledger: https://bjtonline.com/node/2860
- Others: https://airworthyhq.com/ ; https://aeroledge.com/ ; https://www.logwell.net/ ; https://www.aerologs.com/ ; https://squawklink.com/ ; https://www.project1903.com/ ; https://alternativeto.net/software/mytaillog/about/ ; https://apps.apple.com/us/app/-/id6478856024 ; https://apps.apple.com/us/app/cloudga/id6503251596 ; https://apps.apple.com/us/app/planepartner/id6755367242 ; https://squawkd.com/vs
- Owner forums: https://mooneyspace.com/topic/24206-ad-and-maintenance-tracking/ ; https://mooneyspace.com/topic/37201-maintenance-tracking-app/ ; https://vansairforce.net/threads/excel-aircraft-logbook.201151/

**Platforms**
- ForeFlight: https://foreflight.com/releases ; https://www.ainonline.com/aviation-news/business-aviation/2026-07-01/ai-powers-new-jeppesen-foreflight-features ; https://foreflight.com/enhancements/foreflight-ai-connector ; https://www.govconwire.com/articles/thoma-bravo-boeing-digital-aviation-deal ; https://www.airport-technology.com/news/jeppesen-foreflight-begins-operations
- Garmin: https://www.garmin.com/en-US/newsroom/press-release/aviation/garmin-adds-more-service-integrations-to-simplify-and-automate-aircraft-flight-logging-with-planesync/ ; https://www.garmin.com/en-US/newsroom/press-release/aviation/garmin-introduces-planesync-connected-aircraft-management-system-to-simplify-individual-and-fleet-aircraft-ownership/ ; https://backend.ainonline.com/aviation-news/business-aviation/2025-07-16/garmin-planesync-adds-automatic-flight-log-sharing

**Market**
- https://generalaviationnews.com/2026/02/11/ga-doing-more-with-less/ ; https://www.faa.gov/data_research/aviation_data_statistics/general_aviation/cy2024
- https://ai-analytics.org/writing/faa-aircraft/ ; https://api.ai-analytics.org/agency/faa
- https://www.aopa.org/news-and-media/all-news/2023/february/06/faa-extends-expiration-date-of-aircraft-registration-certificates
- https://avweb.com/recent-updates/business-military/faa-20-year-forecast-predicts-gradual-decline-in-light-ga/ ; https://www.faa.gov/data_research/aviation/aerospace_forecasts
- https://democrats-transportation.house.gov/download/03/08/2023/mark-baker-testimony&download=1 ; https://www.lightspeedaviation.com/?p=7675
- https://www.cirruspilots.org/ ; https://www.cirruspilots.org/become-a-member
- https://aopa.org/news-and-media/all-news/2021/november/16/older-pilots-report-negative-treatment-from-insurance-companies

**Regulatory**
- eCFR Part 91 (Mar 19, 2026): https://www.ecfr.gov/on/2026-03-19/title-14/chapter-I/subchapter-F/part-91
- IA → Inspection Rating NPRM: https://www.federalregister.gov/documents/2026/07/01/2026-13282/mechanic-certification-inspection-rating-and-recent-experience-requirements ; https://avweb.com/aviation-news/faa-proposes-new-inspection-rating/
- MOSAIC: https://www.faa.gov/aircraft/MOSAIC ; https://www.kitplanes.com/mosaic-is-here-what-it-means-for-homebuilts/
- ADS-B: https://www.govinfo.gov/content/pkg/FR-2023-11-28/html/2023-26145.htm ; https://public-inspection.federalregister.gov/2024-08885.pdf
- AC 43-6D: https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_43-6D.pdf
- ELT / FCC: https://www.aopa.org/news-and-media/all-news/2013/april/05/aopa-opposes-fcc-proposal-to-ban-121-5-mhz-emergency-locator ; https://piperowner.org/?p=3518 ; https://backend.ainonline.com/sites/default/files/article_export/rtf/FCC_Seeks_To_Outlaw_121.5-MHz_ELTs-28-04-2026.rtf
- Registration fee: https://www.federal-regs.com/title/14/part-48/48.30/ ; https://pf.utleg.gov/public-web/sessions/2026GS/fiscal-notes/SB0172.fn.html
- Lycoming ADs: https://www.federalregister.gov/documents/2026/03/04/2026-04281/airworthiness-directives-lycoming-engines ; https://www.cessnaflyer.org/knowledge-base/aviation-alerts/airworthiness-directive-ad-2026-04-11-affecting-lycoming-engines.html ; https://www.govinfo.gov/content/pkg/FR-2026-08-28/pdf/2026-17584.pdf
- Piper spar: https://avweb.com/?p=124769 ; https://www.govinfo.gov/content/pkg/FR-2024-09-23/html/2024-21652.htm ; https://www.govinfo.gov/content/pkg/FR-2024-11-07/html/2024-25883.htm
