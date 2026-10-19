# Niche Paid iOS App: Market Research & Opportunity Selection

**Prepared for:** Venture studio founder
**Date:** 2026-10-18
**Author:** Head of Market Research
**Scope:** Find ONE niche paid iOS app (SwiftUI, no backend, StoreKit 2) that solves an expensive problem for an affluent, reachable audience. Apply Hormozi's *$100M Offers* and Ries' *The Lean Startup*.

---

## 0. Executive summary

**Recommendation: build #1, an owner-side airworthiness and records app for US Part 91 aircraft owners** (working name **"TailBook"**).

| Rank | Opportunity | Why it wins / loses | Proposed price |
|---|---|---|---|
| **#1** | **TailBook: airworthiness status board + logbook vault for private aircraft owners** | Wealthy owners (planes are worth six figures, annuals cost $2.5k–$4.5k+). Insurers deny claims when an inspection has lapsed. The paid incumbents are either expensive human services ($750/yr SavvyMx, about $1,100/yr Bluetail, $50/mo plus a $300 intake fee for Crewchief) or tiny new indie apps with 0–16 ratings. Owners still run Google Sheets, Excel and whiteboards. Type clubs and forums make the audience easy to reach. The rules are deterministic FAR intervals, so they are easy to build. | $199/yr or $24.99/mo per aircraft |
| #2 | **Audit-proof REPS / STR material-participation log** | Each qualifying taxpayer saves five to six figures of tax, and paid apps at $149–$305/yr prove people will pay. But the category became a **red ocean of 10+ indie apps in about 18 months**, so differentiation is hard. | $199/yr or $24.99/mo |
| #3 | **Domicile Defense: statutory-residency day count + domicile evidence binder** | This has the largest dollar stakes (reported NY average residency-audit assessment of about $144k) and the richest audience. But GPS day-counters are commoditized at $20–$40/yr, the only premium player (Monaeo, $999/yr) has drifted to enterprise, the audience is harder to reach, and background location is a reliability risk. | $299/yr or $39.99/mo |

**Key numbers for #1 (TailBook):**
- About **138,960 active piston GA aircraft** in the US, and **213,756 active GA aircraft** in total (FAA CY2024 survey, via General Aviation News).
- AOPA represents **more than 300,000 owners and pilots**.
- **COPA (Cirrus owners) alone has more than 7,000 members** and charges $95/yr in dues.
- Price anchors: SavvyMx **$750/yr**, Bluetail roughly **$3/day (about $1,095/yr)** for pistons, Crewchief GA **$49.99/mo plus a $299.99 intake fee**.
- Low-end apps: FlightBoss **$14.99/mo** with about 10 ratings, BetterPlane **from $119/yr** with 0 Capterra reviews.
- Revenue model (estimate): 1% of about 120k owner units at $199 is about $240k ARR. 5% is about $1.2M ARR. The market is small but healthy for a small studio, because nobody dominant owns the iOS owner experience.

> **Research limitation, stated up front:** the research environment's network proxy blocked direct access to reddit.com and apps.apple.com/itunes.apple.com, and page fetching (WebFetch) failed on DNS for most hosts. All evidence below therefore comes from web search results, including indexed snippets of forums (MooneySpace, Pilots of America, BiggerPockets, Trawler Forum), App Store listing snippets and app-analytics aggregators (AppFollow, AppsHunter, Capterra). Ratings and prices are **snapshots that may be stale**. I could not retrieve verbatim Reddit quotes, so I use other forums and say so. Every estimate is labeled **(estimate)**. Before committing money, the founder should spend about 2 hours manually checking the App Store pages of the competitors named in §4.1.

---

## 1. Candidate niches (18 brainstormed)

| # | Niche | The expensive problem | Existing options (evidence) |
|---|---|---|---|
| 1 | **Private aircraft owners (Part 91)**: inspections, ADs, records | A lapsed annual, transponder or pitot-static check makes the aircraft unairworthy, which can void hull and liability insurance. Missing logbooks cut resale value. | Spreadsheets and whiteboards; FlightBoss, BetterPlane, PlaneBud, Crewchief GA, Aircraft Compliance (new Aug 2026); SavvyMx and Bluetail (expensive services) |
| 2 | **REPS / STR-loophole material-participation log** | Without a credible contemporaneous hours log, losses are disallowed: back taxes, a 20% accuracy penalty and interest | 10+ indie apps (REPS Time, REPStracker, REPSLog, REPS Hours, STR Loophole Hour Tracker, STR Tax Loophole Tracker, Track Nest, my750hrsTracker, RepsRecord, REP Helper), BNBCalc free tracker, spreadsheets, Toggl |
| 3 | **Statutory residency / domicile change** (NY/CA/NJ/MA → FL/TX/NV) | A failed residency audit (reported NY average about $144k) | TaxDay, TaxBird, iReside, TrackingStates, Tax Days, TrackingDays, Monaeo (enterprise) |
| 4 | **US expats: FEIE 330-day physical presence test** | Missing 330 days by one day loses an exclusion of up to **$132,900** (2026) | Expat CPAs, spreadsheets, generic residency trackers, FEIE Calc web |
| 5 | **Schengen 90/180** (EES fully live since 10 Apr 2026) | Overstay leads to fines or entry bans, now detected automatically | Many free or cheap calculators (Entorii, Schengen Calculator 90/180, etc.) |
| 6 | **Canadian snowbirds** (US SPT + provincial health minimums) | Becoming US tax-resident; losing provincial health coverage | Free apps (Snowbirds US Day Tracker, Cross-Border Day Tracker by 49th Parallel), SnoBird $3.99 |
| 7 | **FBAR / Form 8938 ledger for immigrants (NRIs etc.) and expats** | Non-willful FBAR penalty up to **$16,536** per report (2026); PFIC Form 8621 costs | NamasteWealth, Belong, PocketSmith, spreadsheets, CPAs |
| 8 | **Locum physicians: multi-state licenses, DEA, board certifications, CME** | A lapsed license blocks locum work, which pays about $720–$1,800+ per day | CredBook, Docs4MDs, eMedEvents, CertAlert+, agency credentialing teams (free to physician) |
| 9 | **Travel and multi-state nurses: CE and licenses** | A lapsed license means lost shifts | **CE Broker**: about 4.8★ from about 36k ratings and official for several boards |
| 10 | **Small GCs: subcontractor COI tracking** | Workers' comp audit reclassifies uninsured subs at the full manual rate | Spreadsheets; **bcs free for up to 25 vendors**; myCOI/illumend, Billy, Procore |
| 11 | **Horse owners / show competitors** | Turned away from a show without GR845 flu/EHV vaccination proof within 6 months, or without Coggins and health certificate | BarnManager ($10/mo, 4.3★ from 20 Capterra reviews), HorseBook, WellHerd, My Cheval |
| 12 | **Boat / yacht maintenance** | Engine or systems failure, survey and insurance | Vessel Vanguard (LTE $140/mo reported), SeaHub, Boating Suite, Boatrax, spreadsheets |
| 13 | **Wine collectors: cellar inventory** | Bottles past their drinking window, insurance | CellarTracker (8.8M users, per InVintory), InVintory (free tier), Vivino, VinoCell |
| 14 | **Watch collectors: inventory and insurance value** | Underinsurance, provenance | Chrono24 Collection (free, daily market values), WatchecePro $7.99 |
| 15 | **HSA "shoebox" receipts** | Losing tax-free reimbursement decades later | HSA Monster, HSA Vault, Reimbursable, HSA Tracker, HSA ExpenseTracker (free), SnapHSA |
| 16 | **Small landlords (1–10 doors)** | Bookkeeping, Schedule E | Stessa, Baselane, QuickBooks (named by BiggerPockets members) — crowded, often free |
| 17 | **STR hosts: operations** | Guest messaging, cleaning turnover | Hospitable, Hostaway and others — crowded and backend-heavy |
| 18 | **Classic / collector cars** | Agreed-value insurance mileage caps, service records | Generic garage apps, spreadsheets — pain is low and rarely $10k+ |

---

## 2. Evidence by niche

### 2.1 Private aircraft owners (finalist)
- **The problem is real and costly.**
  - Insurers routinely deny claims when an inspection has lapsed. *"Coverage has been denied when the insured aircraft was not in an airworthy condition because it had not received an annual inspection within the preceding 12 months, or it had not received other required inspections, such as VOR, pitot-static and altimeter checks."* An industry writer called the pilot warranty or the aircraft being out of inspection the most frequent reason for claim denial over 20 years ([Midwest Flyer](https://midwestflyer.com/aircraft-insurance-coverage-will-you-have-it-when-you-need-it/), [AOPA Pilot Protection Services](https://pilot-protection-services.aopa.org/news/2021/march/01/insurance-policy-flight-operations)).
  - In one court case, a lapsed annual voided coverage even for a co-owner who knew nothing about the flight ([Shackelford Law](https://shackelford.law/news-aviation/aircraft-insurance-coverage-will-you-have-it-when-you-need-it-2/), [NM Supreme Court via nmonesource](https://nmonesource.com/nmos/nmsc/en/385162/1/document.do)).
- **Records drive value.** Estimates of the value lost to missing or incomplete logbooks run from 10% to 50% ([Bluetail](https://bluetail.aero/incomplete-logbooks-value)) and from 40% to 60% ([VREF](https://vref.com/?p=47696)). Both sources are vendors, and an AvWeb appraiser case shows the hit can be small when other records corroborate ([AvWeb](https://avweb.com/ownership/the-logbooks-tell-all-or-do-they)).
- **Owners spend money.**
  - Annual inspections cost $2,500–$4,500+ for a single piston, and total running costs are $15k–$35k per year for 100 hours of flying ([BlackJet guide](https://blackjet.com/post/cost-of-aircraft-ownership)).
  - By model: $1,500–$2,200 for a 172 and $2,000–$3,500 for a Bonanza or 210, with deferred maintenance pushing past $8,000 ([Fly Heritage](https://flyheritage.com/aircraft-annual-inspection-cost/)).
- **Spreadsheets are the status quo.**
  - MooneySpace owners describe a Google Sheet with pages for AD compliance, annual, registration, pitot-static and oil changes, where formulas flag what is coming due. Others say "Excel is adequate for the few things that legally need tracked" ([MooneySpace: how others track maintenance](https://mooneyspace.com/topic/43735-looking-for-ideas-on-how-others-track-maintenance-requirements), [MooneySpace: maintenance tracking app](https://mooneyspace.com/topic/37201-maintenance-tracking-app)).
  - On Pilots of America, a new owner asks how to monitor schedules and is told oil, ELT and transponder "can just be setup with like a 'due date' in Excel". Others use a whiteboard "status board" ([POA: new owner thread](https://pilotsofamerica.com/community/threads/new-owner-how-do-you-monitor-maint-schedules.86127/unread?new=1), [POA: Aircraft Status Board](https://pilotsofamerica.com/community/threads/aircraft-status-board.134734)).
  - Owners also argue about month-end interval rules, for example whether an ELT checked May 3, 2016 is due by June 1, 2017. That is exactly the logic an app should own ([POA thread](https://www.pilotsofamerica.com/community/threads/questions-on-maintenance-inspection-dates-and-transponder-inspection.98875/)).
  - iPad Pilot News once recommended Apple Reminders for this job ([iPad Pilot News](https://ipadpilotnews.com/2012/10/use-the-reminders-app-for-maintenance-tracking/)).
- **Audience size and wealth.**
  - 138,960 active piston aircraft and 213,756 active GA aircraft (CY2024) ([General Aviation News](https://generalaviationnews.com/2026/02/11/ga-doing-more-with-less/), [FAA survey page](https://www.faa.gov/data_research/aviation_data_statistics/general_aviation/cy2024)).
  - AOPA says it represents ">300,000 aircraft owners and pilots" and that its members operate >85% of GA aircraft (congressional testimony; [Wikipedia/AOPA](https://en.wikipedia.org/wiki/Aircraft_Owners_and_Pilots_Association)).
  - COPA has 7,000+ members at $95/yr ([COPA](https://www.cirruspilots.org/become-a-member)).
  - In an AVweb reader survey, 69% of respondents were aircraft owners ([AVweb](https://avweb.com/news/avweb-readers-rate-aopa-bouquets-some-and-brickbats/)).
- **Competition** is covered in §4.1. In short: paid tools are either human services or software costing $750–$1,100+/yr, and the iOS owner apps are new and thinly reviewed.

### 2.2 REPS / STR material participation (finalist)
- **The stakes.**
  - A BiggerPockets case write-up describes two dentists facing **$342,429 in taxes plus $68,485 in accuracy-related penalties** over a REPS claim, where the contemporaneous log mattered ([BiggerPockets "The $300,000 Log Book"](https://www.biggerpockets.com/member-blogs/10269/blog_posts/67767-the-300-000-log-book)).
  - In *Warren v. Commissioner* (T.C. Summ. Op. 2024-20), the taxpayer "failed to keep contemporaneous records" and created two logs for trial. He lost, and the penalty was upheld ([CourtListener PDF](https://storage.courtlistener.com/pdf/2024/10/03/james_michael_warren.pdf), [Wealth Strategies Journal](https://wealthstrategiesjournal.com/2024/10/04/warren-v-commissioner-of-internal-revenue-t-c-summary-opinion-2024-20-oct-03-2024-real-estate-professional-status-denied-for-passive-loss-deduction/)).
  - Commentators note that reconstructed logs "have generally fared poorly in Tax Court" ([Klasing Associates](https://klasing-associates.com/importance-keeping-contemporaneous-time-log-rental-real-estate-claiming-real-estate-professional-status/), [Current Federal Tax Developments](https://www.currentfederaltaxdevelopments.com/blog/2015/4/17/tax-court-accepts-taxpayers-reconstruction-of-travel-hours-to-push-over-750-hour-real-estate-professional-limit)).
- **Why now.** OBBBA permanently restored 100% bonus depreciation for property acquired after Jan 19, 2025 ([CBIZ](https://www.cbiz.com/insights/article/cost-segregation-bonus-depreciation-benefits-under-the-obbba), [Dean Dorton](https://deandorton.com/real-estate-cost-segregation-under-one-big-beautiful-bill-act/)). That inflates first-year losses and makes material participation more valuable.
- **Affluent audience.** Physicians and W-2 high earners use the STR loophole to offset salary ([White Coat Investor](https://www.whitecoatinvestor.com/understanding-short-term-rental-loopholes-reps/), [KevinMD](https://www.kevinmd.com/2023/02/the-short-term-rental-tax-loophole-a-game-changer-for-physicians.html), [Dentaltown](https://www.dentaltown.com/blog/post/18948/short-term-rental-tax-loophole-for-physicians-and-dentists)).
- **Competition is dense.**
  - REPS Time costs **$14.99/mo or $149/yr** and has 4.7★ from 26 ratings. One reviewer complained about "only 5 hours tracking and then you need to pay" ([App Store](https://apps.apple.com/us/app/-/id6741897087), [AppsHunter](https://appshunter.io/ios/app/reps-time-tax-hour-log/id6741897087)).
  - REPStracker costs **$32/mo or $304.99/yr** ([App Store](https://apps.apple.com/app/id1555788055)).
  - Also present: REPSLog, REPS Hours (AI with "audit strength" scoring), STR Loophole: Hour Tracker, STR Tax Loophole Tracker, Track Nest, my750hrsTracker ([search listings](https://apps.apple.com/us/app/repslog/id6739170120), [REPS Hours](https://apps.apple.com/app/id6764418950), [STR Loophole](https://apps.apple.com/us/app/-/id6759050584), [STR Tax Loophole Tracker](https://apps.apple.com/app/id6763977430), [Track Nest](https://apps.apple.com/lb/app/track-nest/id6740609263)), RepsRecord, "built by a former IRS agent" ([BiggerPockets forum](https://www.biggerpockets.com/forums/517/topics/1296779-repsrecord-reps-and-str-hour-tracking-built-by-a-former-irs-agent)), a **free** BNBCalc tracker ([BNBCalc](https://www.bnbcalc.com/tools/material-participation-tracker)) and even a ChatGPT plugin.
  - Verdict: demand and willingness to pay are validated, but this is **not a blue ocean**.

### 2.3 Statutory residency / domicile (finalist)
- **The stakes.**
  - NY reportedly audits about 3,000 non-residents a year, at an average of **$144,270** per audit, and 52% fail to prove they moved. These numbers originated with Monaeo, a vendor ([Accounting Today](https://www.accountingtoday.com/opinion/moving-from-a-high-tax-state-be-prepared-for-a-residency-audit), [PKF O'Connor Davies](https://www.pkfod.com/insights/moving-from-a-high-tax-state-be-prepared-for-a-residency-audit/), [Boston.com/AP](https://www.boston.com/real-estate/fall-house-hunt/2019/09/10/moving-out-of-a-high-tax-state-you-may-face-an-audit/)).
  - Any part of a day counts as a NY day. Auditors reconstruct days from credit cards, phone records and frequent-flier statements ([CBIZ](https://www.cbiz.com/insights/article/statutory-residency-its-more-than-just-time-and-place), [NY DTA decision](https://dta.ny.gov/pdf/archive/decisions/817727.dec.pdf), [NYSSCPA](https://nysscpa.org/news/1047957-high-earners-in-new-york-go-to-great-lengths-not-to-get-taxed-as-residents-2024-04-19)).
- **Wealth.** New Yorkers moving to Miami-Dade averaged **$671,075** of income in 2020, and all NY→FL movers averaged **$223,245** ([Empire Center](https://www.empirecenter.org/?p=54996)). 8,036 NYC filers moved to South Florida in 2022–23, carrying $1.54B of AGI ([HomeAbroad](https://homeabroadinc.com/research/nyc-migration-south-florida-rent-split/)).
- **Competition.**
  - TaxDay costs $9.99/mo and has 3.8★ from 63 reviews ([AppFollow](https://apps.appfollow.io/ios/taxday/1045026503?country=us)).
  - TaxBird is about $34.99/yr ([AppFollow](https://appfollow.io/ios/taxbird-residency-tracker/1238166926?country=us)); iReside $34.99/yr; Tax Days $19.99/yr ([App Store](https://apps.apple.com/us/app/id6761441335)); TrackingDays $3.99/mo; TrackingStates ([App Store](https://apps.apple.com/app/id1497481779)); Pebbles ([pebbles.day](https://pebbles.day/tax-residency/united-states/florida)).
  - Monaeo was reported at $99/mo or $999/yr and is now a Topia subsidiary with enterprise focus ([search snippet via CNBC/CB Insights](https://www.cbinsights.com/company/monaeo)).
  - A known platform risk: iOS can suspend background tracking (TrackingStates developer note, [AppFollow](https://apps.appfollow.io/ios/country-state-days-tracker/6757438508?country=us)).

### 2.4 Other niches (evidence for scoring and drops)
- **FEIE 330-day test.** One day short loses the whole exclusion for that 12-month window ([Greenback](https://www.greenbacktaxservices.com/knowledge-center/physical-presence-test/), [TaxesForExpats](https://www.taxesforexpats.com/articles/tax-saving-strategies/physical-presence-test.html)). The 2026 cap is $132,900 ([IRS Notice 2026-25](https://www.irs.gov/pub/irs-drop/n-26-25.pdf), [KPMG](https://kpmg.com/xx/en/our-insights/gms-flash-alert/2026/flash-alert-2026-090.html)). The pain is real, but generic residency trackers (TrackingDays, Monaeo) already cover it, and expat CPAs bundle it.
- **Schengen.** EES has been fully live since 10 Apr 2026 and auto-detected more than 4,000 overstays ([eucrim](https://eucrim.eu/news/entryexit-system-ees-fully-operational-since-10-april-2026/), [EY](https://taxnews.ey.com/news/2026-0949-eus-entry-exit-system-fully-operational-as-of-10-april-2026)). The space is full of free calculators ([AppFollow](https://apps.appfollow.io/ios/schengen-calculator-90-180/6754875316?country=us)), and the audience pays little. **Dropped.**
- **Canadian snowbirds.** Free tools exist from wealth firms (49th Parallel Cross-Border Day Tracker), plus SnoBird at $3.99 and Visa Day Tracker, which covers OHIP ([Webull/press](https://www.webull.com.au/news-detail/15436117537104896), [App Store](https://apps.apple.com/ca/app/id6749048224)). Willingness to pay is low. **Dropped.**
- **FBAR ledger.** About 1.5M FBARs were filed in 2022 ([OMB ICR](https://omb.report/icr/202403-1506-001)). The non-willful maximum is $16,536 per report ([BrightTax](https://brighttax.com/glossary/fbar-penalty/)). PFIC Form 8621 is due per fund, at CPA fees of about $100–$2,000 per form ([TaxesForExpats](https://www.taxesforexpats.com/articles/investments/us-tax-on-nri-mutual-funds-india.html), [BasuNivesh](https://www.basunivesh.com/pfic-rules-for-indian-nris-in-usa-tax-impact-solutions/)). Competitors include NamasteWealth (on-device) and the VC-backed Belong ([mwm.ai](https://mwm.ai/fr/apps/namastewealth/6760981346), [Belong](https://getbelong.com/blog/fbar/)). This is a good runner-up (#4), but PFIC math edges toward tax-advice territory.
- **Locum physicians.** About 56–57k physicians work locums ([SIA](https://www.staffingindustry.com/research/research-reports/americas/us-locum-tenens-market-growth-assessment-2025), [Locumstory](https://locumstory.com/spotlight/state-of-locum-tenens)). But agencies do the credentialing for free, and CredBook, Docs4MDs and eMedEvents exist ([CredBook](https://mwm.ai/apps/credbook/6760574525), [AAFP CertAlert+](https://aafp.org/pubs/fpm/blogs/inpractice/entry/license_certification_app.html)). The pain is diluted.
- **Nurses.** CE Broker has about 4.8★ from about 36k ratings and is official for some boards ([AppFollow](https://appfollow.io/ios/ce-broker/384461998?country=us), [SC LLR](https://www.llr.sc.gov/nurse/ce.aspx)). It is well entrenched. **Dropped.**
- **GC COI.** Uninsured-sub reclassification at audit is real ([NARI](https://www.nari.org/NARI-Blog/March-2013/Subcontractors-without-workers-compensation-will-cost-you), [bcs](https://www.getbcs.com/blog/subcontractor-coi-workers-comp-audit)). But bcs is **free for up to 25 vendors** ([bcs pricing](https://getbcs.com/pricing)), and the workflow (emailing subs) needs a backend. **Dropped.**
- **Horses.** GR845 requires flu/EHV vaccination within 6 months to enter USEF shows, or the horse can be sent home ([USEF](https://usef.org/media/press-releases/13335_usef-equine-vaccination-rule)). BarnManager ($10/mo), HorseBook and WellHerd already exist ([Capterra](https://www.capterra.co.uk/reviews/164823/barnmanager), [HorseBook](https://apps.apple.com/app/id6759075592), [WellHerd](https://apps.apple.com/us/app/-/id6753772434)). The dollar pain per mistake is moderate (a lost show weekend).
- **Boats.** Vessel Vanguard is reported at $140/mo (LTE), next to SeaHub and Boating Suite. Owners lean on Excel ([Trawler Forum](https://www.trawlerforum.com/threads/yacht-maintenance-app-or-software.66811/post-1264929), [Trade Only Today](https://tradeonlytoday.com/?p=9950)). There is no regulatory forcing function like the FARs, so the pain is lower than for aircraft.
- **Wine and watches.** CellarTracker (8.8M users) and InVintory's free tier dominate wine ([InVintory blog](https://invintory.com/blog/invintory-vs-cellartracker-wine-app-comparison/)). Chrono24's free collection tool with daily valuations dominates watches ([Fratello](https://www.fratellowatches.com/value-watch-collection/)). **Dropped.**
- **HSA receipts.** Six or more apps exist, including free ones ([search results](https://apps.apple.com/app/id6759198475), [AI Journal](https://aijourn.com/still-saving-paper-receipts-in-a-shoebox-simplify-your-tax-free-health-savings-account-hsa-funds-with-the-hsa-expensetracker-app-from-hsa-store/)), and the pain is deferred. **Dropped.**

---

## 3. Scoring (1 = poor, 5 = excellent)

Pain = dollar cost of the problem. Comp weak = how weak the competition is (5 = little or bad competition). Build = feasibility of a v1 with no backend.

| Niche | Pain $ | Wealth | Comp weak | Build | Reach | WTP subs | **Total /30** |
|---|---|---|---|---|---|---|---|
| **Aircraft owner airworthiness** | 4.5 | 5 | 4 | 4.5 | 5 | 4 | **27.0** |
| REPS / STR log | 5 | 4 | 2 | 5 | 5 | 4.5 | **25.5** |
| Domicile defense | 5 | 5 | 2.5 | 3 | 3 | 3 | **21.5** |
| FBAR / foreign-asset ledger | 4 | 3.5 | 3 | 4 | 4 | 2.5 | 21.0 |
| FEIE 330-day | 4.5 | 3.5 | 2.5 | 3.5 | 4 | 3 | 21.0 |
| Horse show compliance | 3 | 4.5 | 3 | 4.5 | 4 | 3 | 22.0* |
| Boat maintenance | 3 | 5 | 3 | 4.5 | 4 | 2.5 | 22.0* |
| Locum physician credentials | 3.5 | 5 | 3 | 4 | 3 | 2.5 | 21.0 |
| Nurse CE | 3 | 3 | 1 | 4 | 4 | 2 | 17.0 |
| GC COI | 4 | 3.5 | 2 | 2 | 3.5 | 3 | 18.0 |
| Schengen | 3 | 2.5 | 1 | 5 | 4.5 | 1.5 | 17.5 |
| Canadian snowbird | 3.5 | 3 | 2 | 4 | 4 | 1.5 | 18.0 |
| HSA shoebox | 2 | 3.5 | 1.5 | 5 | 3 | 2 | 17.0 |
| Wine cellar | 1.5 | 5 | 1 | 4.5 | 4 | 2 | 18.0 |
| Watch collection | 1.5 | 5 | 1 | 4.5 | 4 | 1.5 | 17.5 |
| Small landlord | 2.5 | 4 | 1 | 3 | 5 | 2 | 17.5 |
| STR host ops | 2.5 | 4 | 1 | 1.5 | 5 | 3 | 17.0 |
| Classic cars | 1.5 | 5 | 3 | 4.5 | 4 | 1.5 | 19.5 |

\*Horse and boat score on par with residency, but the cost per mistake is mostly well under $10k. Residency stays at #3 because of the size of the stakes. Its weaknesses are reach and price anchoring, not pain.

**Weighting note.** I weighted "Comp weak" and "Reach" heavily because the founder asked for blue ocean and cheap distribution. With pain weighted double, REPS and Aircraft would tie. Aircraft wins on competition.

---

## 4. Top 3 deep dives

---

### 4.1 #1 TailBook: "Always-airworthy" status board + logbook vault for aircraft owners

**Avatar.** A US owner or co-owner of a piston single or light twin (Cessna 182, Bonanza, Mooney, Cirrus SR22, Piper), aged 40–70 and often a business owner or professional. The aircraft is worth roughly $80k–$900k **(estimate)**, and the owner spends about $15k–$35k a year to operate it. They fly 50–150 hours a year. Records sit in a binder or a box of logbooks, plus a spreadsheet or whiteboard. They are terrified of two things: flying out of inspection (and with it, their insurance), and a pre-buy inspection that trashes their resale value.

#### Hormozi Value Equation
Value = (Dream Outcome × Perceived Likelihood) ÷ (Time Delay × Effort & Sacrifice)

| Lever | How TailBook moves it |
|---|---|
| **Dream outcome (maximize)** | "I always know, in two seconds, that my airplane is legal to fly and my insurance is valid. My annual has no surprises, and when I sell, my records prove full value." Framed in money: protect a $300k hull and liability coverage, avoid a $1k–$5k surprise in the annual, and preserve a resale value that missing records can cut by 10–50%. |
| **Perceived likelihood (maximize)** | Every due item **cites its FAR**: §91.409 annual/100-hr, §91.411 altimeter/pitot-static (24 calendar months, IFR), §91.413 transponder (24 calendar months), §91.207 ELT (12 calendar months, plus battery at 1 cumulative hour or 50% of useful life), §91.171 VOR check (30 days, IFR), and registration expiry. The app handles "calendar month" end-of-month logic correctly, the very rule owners argue about on Pilots of America. A one-page Status Report that the owner's A&P/IA can check against the logbooks builds trust. Social proof will come from type-club members. Every status links to the scanned logbook page that supports it. |
| **Time delay (minimize)** | First green/yellow/red board in **under 5 minutes**: eight date pickers plus current tach. No logbook digitization needed on day 1; scanning is gradual. Push alerts at 60, 30 and 7 days. Hours-based items get a forecast date from average utilization ("Oil change due in about 12 days at your pace"). |
| **Effort & sacrifice (minimize)** | No account, no backend, private on-device and iCloud data. VisionKit scanner plus on-device Vision OCR, so logbook pages become searchable text. A home-screen widget and Siri Shortcut log Hobbs/tach in one tap after a flight. CloudKit sharing lets co-owners see the same board with no logins. Exports go to the A&P, insurer or buyer as a PDF. |

#### Grand Slam Offer
**Problems → solutions**

| Problem (owner's words) | Solution |
|---|---|
| "I'm not sure what's coming due; it's in my head or a spreadsheet." | FAR-cited interval engine + status board + widget |
| "I could be flying illegal and void my insurance without knowing." | "Airworthy today?" check and pre-flight lock-screen widget; red items block a "Ready" state |
| "Recurring ADs by hours or calendar, whichever comes first, are a nightmare." | AD and SB tracker with whichever-first logic and method-of-compliance notes |
| "Annuals blow up with surprises." | Squawk list during the year → "Annual work order" PDF for the shop |
| "My logbooks are a fire or flood away from losing 10–50% of the value." | Scan vault with on-device OCR, linked to each item as proof, encrypted iCloud backup |
| "My partners never log tach time." | Shared aircraft via CloudKit, per-partner Hobbs logging, utilization by partner |
| "Selling or insuring means hours of digging." | One-tap Aircraft Status Report (for a buyer, insurer or mechanic) |

**Named offer (M-A-G-I-C):** **"The Always-Airworthy Owner System: Know your plane is legal in 5 seconds, or your first year is on us."**
(Magnet: "Always-Airworthy". Avatar: Owner. Goal: know you're legal. Interval: 5 seconds. Container: System.)

**Pricing and anchoring logic**
- **$199/year per aircraft**, or **$24.99/month**, with a 14-day free trial. The partnership plan is the same price per aircraft, with unlimited co-owners through CloudKit sharing, so the cost per partner is often under $70.
- Anchors to show on the paywall:
  - SavvyMx managed maintenance at about **$750/yr** ([AOPA 2023](https://youcanfly.aopa.org/flying-clubs/flying-club-newsletter/2023/may/21/club-spotlight)).
  - Bluetail at about **$3/day (~$1,095/yr)** ([Bluetail](https://bluetail.aero/product/subscription-plans)).
  - Crewchief GA at **$49.99/mo + $299.99 intake** ([App Store](https://apps.apple.com/us/app/crewchief-ga/id1470882836)).
  - A single annual at **$2,500–$4,500**.
  - A hull claim denied for lapsed inspection.
- Value framing: $199 is less than 1% of a typical yearly operating cost ($15k–$35k), and about one hour of shop labor ($95–$140/hr).
- Why not cheaper: FlightBoss's $14.99/mo ($180/yr) shows the market accepts this price point, and per-aircraft pricing matches how owners think about cost.

**Guarantee (honest under App Store rules).** Apple processes refunds for in-app purchases, so the guarantee must work with that system:
- *"Find-It Guarantee":* if TailBook doesn't surface at least one due date, record or squawk you'd lost track of within your first 30 days, email us and we'll walk you through Apple's refund request and extend you a free year if Apple declines. The guarantee is conditional on entering at least six items.
- *Error promise:* if a calculation bug in TailBook (not user-entered data) shows an item as current when it was overdue, we refund the year. This is an outcome-based guarantee we can afford because the rules engine is deterministic and test-covered.
- Legal and ToS framing: TailBook organizes the dates the owner enters. **The A&P/IA and the pilot in command determine airworthiness.** This keeps us clear of App Store §1.4/5.1 issues and of liability.

**Scarcity and urgency (honest)**
- *Founding Owners:* the first **250 aircraft** lock in **$149/yr for life**. This is real scarcity, since we are capping founding seats to keep support personal.
- *Seasonal urgency:* most annuals cluster in winter, so the campaign launches in November–January with the hook "Get your annual punch list ready before you drop the plane off."

**Bonuses** (each one named and addressing an objection)
1. **Pre-Buy & Sale Records Checklist** (PDF): the list of what buyers and appraisers look for.
2. **Type Templates:** Cirrus (CAPS repack and rocket intervals), Bonanza, Mooney, 182 and Cherokee common recurring items, preloaded as editable intervals.
3. **"Annual Drop-Off Pack":** squawks plus due items formatted for your IA.
4. **Insurance Renewal Snapshot:** a one-page summary for the broker.
5. **Partnership Pack:** a tach-logging norms sheet and a utilization-by-partner export for cost splits.

#### Lean Startup
- **Value hypothesis.** Part 91 owners will pay $199/yr (per aircraft) for a FAR-aware status board and records vault, even though free spreadsheets and MyFlightbook exist, because the app removes uncertainty about legality and insurance.
- **Growth hypothesis.** Adoption spreads through (a) type-club forums and newsletters, (b) co-owner invitations (each partnership brings 1–3 extra users at zero cost), and (c) A&P/IA shops that ask customers for a TailBook Status Report before an annual. Target: 25%+ of new paid aircraft come from referrals or co-owner invites by month 6.
- **Riskiest assumption.** *Owners will pay for something they "can do in Excel" and will finish the initial data entry.* Pain is proven by forums, but willingness to pay versus free tools (MyFlightbook, Reminders) is not proven for software at this price. SavvyMx's price may reflect the human expertise, not the tracking.
- **MVP (before writing SwiftUI)**
  1. **Concierge "Free Airworthiness Snapshot":** a landing page plus a form. The owner uploads photos of their last annual entry, AD list and inspection stickers. Within 48h we email back a FAR-cited status PDF and a due-date calendar file (.ics). This tests demand, the data-entry pain and the aha moment. Effort: 1 week, Carrd/Framer + Tally + a Google Sheet template.
  2. **Paid pre-commitment:** at delivery, offer "Founding Owner, $149/yr for life when the app ships." Collect a **$49 refundable deposit** via Stripe on the website (not inside the app, so no IAP issue), credited against year one.
  3. **Wizard-of-Oz TestFlight:** a SwiftUI prototype of the onboarding and status board only (3–4 days of build) for 20 depositors.
- **Validation experiments** (each with pass and fail thresholds)

| # | Experiment | Channel | Pass | Fail / pivot signal |
|---|---|---|---|---|
| E1 | Problem posts ("How do you track due items? Here's my free status template") | MooneySpace, POA, Beechtalk, COPA forum, r/flying, 3 owner FB groups | ≥150 clicks and ≥60 Snapshot requests in 21 days | <20 requests |
| E2 | Snapshot → deposit | Email after delivery | ≥15% place a $49 deposit | <5% |
| E3 | Aha test | TestFlight | ≥60% see at least one yellow or red item they didn't expect (self-reported) | <25% ("I already knew all this") |
| E4 | Trial → paid | App Store | ≥30% of trial starts convert to annual **(estimate benchmark for hard-paywall utility apps)** | <12% |
| E5 | Retention | App | ≥70% of paid aircraft log tach at least once a month; ≥85% annual renewal intent in survey | <40% monthly logging |
| E6 | Referral loop | In-app share | ≥0.3 co-owner invites per paid aircraft | <0.1 |

- **Build-measure-learn loop.** Two-week cycles.
  - *Build* the smallest change (for example, an AD whichever-first engine).
  - *Measure* activation (board created within 10 minutes), the aha rate, trial→paid, weekly tach logs, invites, and the top three support requests.
  - *Learn* through five owner calls per cycle, reviewing new type-specific intervals with an IA advisor.
  - Each cycle ends with a persevere or pivot decision against the thresholds above.
- **Pivot triggers**
  - Deposit rate under 5% after 60 snapshots → **customer-segment pivot** to flying clubs and partnerships (multi-user pain, shared cost) or to IA/A&P shops (B2B tool to hand customers).
  - Owners value only the vault, not the board → **value pivot** to "Logbook Vault & Sale Pack" for sellers and pre-buy (a one-time $99 per aircraft).
  - Owners demand automatic AD applicability → **feature pivot** in v2: bundle FAA DRS AD index data on-device, refreshed via a static file on a CDN (still no app backend).

#### v1 feature spec (8 must-haves)
1. **Aircraft profile:** tail number, make/model, IFR yes/no, for-hire yes/no, ELT type, plus type templates.
2. **Interval engine:** calendar-month, days, hours (tach or Hobbs) and whichever-first. Covers annual, 100-hr, transponder, pitot-static/altimeter, ELT inspection and battery, VOR check, registration, oil change, and custom items, each showing its FAR citation.
3. **AD and SB tracker:** manual entry, one-time or recurring (hours, calendar or both), method of compliance, a link to the logbook page.
4. **Status board, widgets and notifications:** an "Airworthy today?" summary, red/yellow/green items, lock-screen and home widgets, alerts at 60/30/7 days and at 10/5 hours remaining.
5. **Tach/Hobbs quick log:** widget, Siri Shortcut and App Intent. The utilization forecast turns hour-based items into projected dates.
6. **Logbook scan vault:** VisionKit document camera, on-device Vision OCR, full-text search, pages tagged to items as proof.
7. **Squawk list → PDF exports:** "Annual Work Order" and "Aircraft Status Report", rendered on-device with PDFKit.
8. **CloudKit private sync + CKShare co-owner sharing:** StoreKit 2 subscription per aircraft, with family sharing on.

- **Aha moment.** Right after the 8-question onboarding, the board shows **at least one yellow or red item** (most often ELT battery, pitot-static or transponder, which are the easy-to-forget 24-month items) or a hour-based item with a projected date.
- **Onboarding flow** (target under 5 minutes, paywall *after* value)
  1. "What do you fly?": make/model picker, then IFR? for hire?
  2. Current tach and Hobbs.
  3. Last annual date. The month-end rule is explained in one line.
  4. Transponder, pitot-static, ELT inspection and ELT battery expiry. Each step offers "Don't know? Snap the sticker or logbook entry."
  5. Optional: add up to three recurring ADs now.
  6. **The board is revealed**, with the item count and "Next due: X in N days".
  7. Paywall: 14-day trial, annual default, founding offer if the user has a code, anchors shown.
  8. Notification permission, framed as "Get warned 60/30/7 days before anything lapses."
  9. Invite co-owners (optional).
- **Explicitly out of scope for v1:** automatic AD applicability or FAA database matching; pilot logbook and currency (ForeFlight and MyFlightbook own that); weight and balance; flight-school or fleet dispatch; A&P digital sign-offs or e-signatures; AI handwriting parsing of the full logbook history; Android or web; expense or cost-per-hour accounting (v2 candidate); EASA/non-US rules.

#### Competitor table

| Competitor | Price | Rating / traction | Main weakness |
|---|---|---|---|
| Spreadsheet / Reminders / whiteboard | Free | The status quo per MooneySpace and POA | No month-end logic, no alerts, no proof attached, single-user |
| FlightBoss | Free with IAP; **$14.99/mo** | ~10 ratings (AppsHunter) | Reviews say you "can't edit or delete logs"; a renewal screen hung with no support response ([AppsHunter](https://appshunter.io/ios/app/flightboss/id1556221444)) |
| BetterPlane | **From $119/yr** per aircraft | 0 Capterra reviews ([Capterra](https://www.capterra.com/p/10047876/BetterPlane/)) | Built around AI logbook digitization; unproven traction |
| Crewchief GA | **$49.99/mo + $299.99 intake** | 16 ratings; "slow to refresh" | Requires being a customer of a managed program or affiliated shop |
| Aircraft Compliance | Free during feedback period (Aug 2026) | New at Oshkosh 2026 ([GA News](https://generalaviationnews.com/2026/08/06/new-aircraft-compliance-app-simplifies-aviation-maintenance-tracking/)) | Unknown business model; the closest emerging threat, so watch it |
| PlaneBud / Planewise | Unknown / iPad | Little data | Planewise targets flight schools and clubs; PlaneBud is AI-centric |
| MyFlightbook | Free | Long-standing pilot logbook | Pilot-centric; maintenance intervals are basic |
| SavvyMx (Savvy Aviation) | **~$750/yr** | Strong brand (Mike Busch) | A human service, so expensive; not an on-phone status board |
| Bluetail | **~$3/day piston (~$1,095/yr)** + onboarding | Turbine and fleet heritage | Overkill and expensive for a single-piston owner |

#### Go-to-market: first 100 paying aircraft
Target funnel **(estimate)**: about 400 snapshot or waitlist sign-ups → 200 trials → 100 paid.
1. **Owner forums.** Value-first posts sharing a free "FAR due-date cheat sheet", with the Snapshot link in the signature where rules allow:
   - [MooneySpace](https://mooneyspace.com/)
   - [Pilots of America](https://www.pilotsofamerica.com/community/) (Ownership/Maintenance sub-forums)
   - [BeechTalk](https://www.beechtalk.com/)
   - [COPA forum](https://forum.cirruspilots.org/) (members only; one of us should join for $95)
   - [Backcountry Pilot](https://backcountrypilot.org/forum/)
   - [r/flying](https://www.reddit.com/r/flying/) and [r/aviation](https://www.reddit.com/r/aviation/), in self-promo threads only
2. **Type clubs and newsletters.** Offer a free club-member discount code and a short article ("The 24-month items owners forget"):
   - [COPA](https://www.cirruspilots.org/) (7,000+ members)
   - [American Bonanza Society](https://www.bonanza.org/)
   - [Cessna Pilots Association](https://www.cessna.org/)
   - [Piper Owner Society](https://www.piperowner.org/)
   - [Mooney Aircraft Pilots Association (MAPA)](https://www.mooneypilots.com/)
3. **Aviation app media:** pitch [iPad Pilot News](https://ipadpilotnews.com/), [General Aviation News](https://generalaviationnews.com/) (they covered Aircraft Compliance) and [AVweb](https://avweb.com/).
4. **Facebook groups:** search "Cessna 182 owners", "Piper Cherokee owners", "Bonanza owners" and similar (5–20k-member groups are common **(estimate)**).
5. **A&P/IA shops:** 20 independent shops get counter cards reading "Bring your TailBook Status Report to your annual and we'll quote faster", plus a free shop account to view shared reports. The shops become a referral channel.
6. **Podcasts and YouTube:** sponsor or guest on owner-maintenance shows, for example the Savvy Aviation webinar audience (which is adjacent rather than a direct competitor), and owner YouTubers.
7. **Events:** [Sun 'n Fun](https://flysnf.org/) (April 2027) and regional fly-ins; Oshkosh 2027 is for scaling, not for the first 100.

---

### 4.2 #2 "Contemporaneous": audit-proof REPS & STR material-participation log

**Avatar.** A W-2 high earner (physician, tech, attorney) with one to three short-term rentals using the STR loophole, or a household where one spouse claims REPS. Income is $250k–$1M **(estimate)**. A cost-segregation study plus 100% bonus depreciation creates first-year losses of $100k+, so each claim is worth $30k–$150k of tax **(estimate)**.

#### Value Equation
- **Dream outcome:** "Keep every dollar of the deduction and walk into an audit with a log no examiner can call a 'reconstruction'."
- **Perceived likelihood:**
  - Each entry is **provably contemporaneous**: a created-at timestamp, an append-only edit history with SHA-256 hash chaining that is visible in the export, and attached corroboration (a photo, a calendar event, a geofenced on-site visit, a message screenshot).
  - Built-in qualifying-activity guardrails flag "investor-type" work (reviewing statements, research), which generally doesn't count under Treas. Reg. §1.469-5T(f)(2)(ii).
  - A "more than anyone else" ledger tracks the cleaner's, co-host's and property manager's hours.
- **Time delay:** a log entry takes 10 seconds by voice, widget or a geofence prompt ("You were at Lake House 2h 14m. Log it?"). The progress gauge for the 100, 500 and 750-hour tests updates on day 1.
- **Effort:** auto-suggestions from EventKit calendar events, geofence visits and photos taken at the property. A year-end CPA packet (PDF + CSV) is generated in one tap.

#### Grand Slam Offer
- **Problems → solutions:**
  - "I forget to log" → geofence and calendar prompts, widget, Siri.
  - "The IRS says my log was reconstructed" → tamper-evident timestamps and an evidence chain.
  - "Does this activity count?" → an activity taxonomy with counts / doesn't count / ask your CPA flags, citing the regulation.
  - "Did my cleaner work more hours than me?" → others' hours ledger, with an import from invoices (hours × visits).
  - "My CPA wants it in a format they can use" → a CPA packet export.
  - "My spouse and I both work on the rentals" → per-person logs, plus a material-participation view that combines spouses and a REPS 750-hour/50% view that does not.
- **Offer name (MAGIC):** **"The Audit-Proof Hours Vault: 100, 500 or 750 hours, logged in 10 seconds a day, CPA-ready by December 31."**
- **Pricing:** **$199/yr or $24.99/mo**, couple-friendly (one subscription per household via Family Sharing).
  - Anchors: REPS Time $149/yr; REPStracker $304.99/yr; the deduction at risk (tens of thousands of dollars); a 20% accuracy penalty; CPA audit representation at $300–$600/hr **(estimate)**.
  - Positioning: priced in the middle, sold on proof quality rather than features.
- **Guarantee:** "CPA-Ready or it's free". If your CPA says the year-end packet isn't usable as your participation log, we'll fix the format within 7 days or help you get an Apple refund plus a free year. *Never* promise an audit outcome.
- **Urgency (honest):**
  - Hours must be contemporaneous, and every day not logged is lost evidence. Q4 is peak, because people realize in October–December that they need 100 or 500 hours by December 31.
  - Founding price of $149/yr for the first 300 households.
- **Bonuses:**
  - "What counts" one-pager with regulation citations.
  - Cleaner and PM hours request template.
  - Cost-seg readiness checklist.
  - STR "7-day average stay" calculator (bookings entered → average period of customer use).
  - Year-end CPA email template.

#### Lean Startup
- **Value hypothesis:** STR-loophole and REPS households will pay $199/yr for *provable* contemporaneity over cheaper or free loggers.
- **Growth hypothesis:** CPAs and cost-seg firms recommend the app to clients (B2B2C). Each referring CPA brings 5+ households.
- **Riskiest assumption:** *buyers can tell "audit-proof" apart from ten look-alike apps*, so differentiation drives conversion. Second risk: App Store keyword competition makes customer acquisition cost too high.
- **MVP:** a landing page plus a comparison table ("What makes a log survive Tax Court"). Offer a free "STR Log Audit": users upload their current spreadsheet and we score it against case-law factors. Pre-sell a $149 founding lifetime-price deposit. Separately, pitch 20 STR-focused CPAs and cost-seg firms on a co-branded client offer.
- **Experiments:**
  - (E1) ≥10% landing → deposit from WCI and BiggerPockets traffic. Fail if under 3%.
  - (E2) ≥5 of 20 CPAs agree to recommend the app. Fail if under 2.
  - (E3) ≥40% of trial users enable geofence prompts. Fail if under 15%, which would mean the auto-capture differentiator is not valued.
- **Pivot triggers:**
  - Deposits under 3% → pivot to a **CPA-side** tool (the firm buys seats for clients).
  - Users ignore evidence features → collapse into a cheaper "simple log" ($79/yr) or abandon the niche.

#### v1 features (7)
1. Properties, people (self, spouse, cleaner, PM, co-host) and tax goal (REPS 750 / STR 100 / 500).
2. 10-second entry: widget, Siri/App Intents, voice dictation, timer.
3. Geofence and calendar auto-prompts (CoreLocation region monitoring, EventKit).
4. Evidence attachments with a tamper-evident audit trail (hash chain, edit history).
5. Activity taxonomy with qualifying flags and regulation citations, informational only.
6. Progress gauges per test and a year-end projection.
7. CPA packet export (PDF + CSV), CloudKit sync, StoreKit 2.

- **Aha moment:** the first geofence prompt that turns a property visit into a logged, evidence-backed entry the user didn't have to remember.
- **Onboarding:** choose the strategy (STR loophole / REPS) → add a property (map pin) → add the others who work on it → allow location "When in Use → Always" with a clear explanation → log the first entry → see the gauge → paywall.
- **Out of scope:** tax calculations or advice on qualifying, bookkeeping (Stessa/Baselane), Airbnb API integrations (they need a backend), AI categorization, multi-user CPA portal.

#### Competitor table

| Competitor | Price | Rating | Main weakness |
|---|---|---|---|
| REPS Time | $14.99/mo, $149/yr | 4.7★ (26) | Paywall after 5 hours irritated users; iPad-first |
| REPStracker | $32/mo, $304.99/yr | ~4.3 (25, AppBrain; uncertain) | Expensive; iPad-focused |
| REPSLog | IAP (unknown) | — | Generic timer |
| REPS Hours | IAP (unknown) | — | AI-scored entries; the closest to "audit strength" positioning |
| STR Loophole: Hour Tracker / STR Tax Loophole Tracker | IAP (unknown), 30-day trial | — | Thin; me-too |
| BNBCalc material participation tracker | Free (web) | — | Not native; no evidence capture |
| Spreadsheet / Toggl / Clockify | Free–$10/mo | — | Weak proof of contemporaneity |

#### GTM: first 100
- [White Coat Investor forum](https://www.whitecoatinvestor.com/forum/) and its STR courses community.
- [BiggerPockets forums](https://www.biggerpockets.com/forums) (Tax, STR).
- [r/realestateinvesting](https://www.reddit.com/r/realestateinvesting/), [r/AirBnBHosts](https://www.reddit.com/r/AirBnBHosts/), [r/tax](https://www.reddit.com/r/tax/).
- Facebook groups for physician STR investors (for example "Passive Income MD" and "Physicians Investing in Real Estate" communities **(verify names)**).
- STR CPA firms (Taxstra and similar) and cost-seg firms as referral partners.
- Q4 timing.

---

### 4.3 #3 "Domicile Defense": statutory day count + domicile evidence binder for high-tax-state leavers

**Avatar.** A household moving its domicile from NY/NJ/CT/MA/CA to FL/TX/NV/TN, usually keeping a home in the old state. Income is $500k+. The first 3–4 tax years after the move are the audit window.

#### Value Equation
- **Dream outcome:** "I keep my Florida domicile and pay no NY resident tax. If audited, I hand over a day-by-day binder and it's over."
- **Perceived likelihood:**
  - Two independent proofs per day: passive location (CoreLocation significant-change and visit monitoring) plus the user's corroborating evidence (photos, receipts, boarding passes).
  - State-specific counting rules, such as NY's "any part of a day" rule and its travel-through exception.
  - A **domicile factor checklist** modeled on the NY primary factors (home, active business, time, "near and dear" items, family), with evidence slots.
  - An export laid out the way auditors build schedules.
- **Time delay:** the day count is live from install, and the checklist completes in about 20 minutes.
- **Effort:** zero-touch tracking. A weekly 30-second "confirm your days" review fixes gaps from iOS background suspensions, which is a known platform limitation.

#### Grand Slam Offer
- **Problems → solutions:**
  - "Am I near 183?" → live count per state with a safe-days projection.
  - "The phone missed days" → gap detection and a confirm-day flow with an evidence prompt.
  - "Auditors want proof I moved" → domicile checklist (driver's license, voter registration, homestead, doctors, safe deposit box, pets, art).
  - "Spouse days" → a per-person and joint view.
  - "Need it for my CPA or attorney" → audit binder PDF.
- **Offer name:** **"The 183-Day Shield: Florida-proof your move with a day-by-day audit binder, built automatically."**
- **Pricing:** **$299/yr or $39.99/mo** per household.
  - Anchors: Monaeo $999/yr, the reported $144k average NY assessment, and attorney audit defense fees in the $10k+ range **(estimate)**.
  - The risk: cheap trackers at $20–$40/yr reset buyers' expectations, so the paywall must sell the *binder* and the *domicile* layer, not day counting.
- **Guarantee:** a 30-day "binder or bust" promise: if the exported binder doesn't satisfy your CPA's request list, we fix it or help you request an Apple refund.
- **Urgency:** the move year and the following three years carry the highest audit risk. The day count resets on January 1, so the pitch is "start before the next tax year."
- **Bonuses:** a "Change of Domicile" 30-item checklist, a snowbird calendar planner, and a CPA intake template.

#### Lean Startup
- **Value hypothesis:** movers will pay 8–10× the price of cheap trackers for the domicile and evidence layer.
- **Growth hypothesis:** CPAs, trusts-and-estates attorneys and wealth advisors recommend the app at the moment of the move.
- **Riskiest assumption:** *iOS background location is reliable enough to serve as primary evidence without killing the battery*, and buyers will trust it over TaxDay.
- **MVP:** a TestFlight build with only the location engine, run for 30 days on 30 users with a daily ground-truth diary. **Pass:** ≥98% of days correctly attributed after one weekly confirmation. In parallel, a landing page targeting r/fatFIRE, Bogleheads and Florida relocation groups, with a $49 deposit. **Pass:** ≥8% of visitors leave a deposit.
- **Pivot triggers:** attribution below 95% → pivot to a "manual + evidence" binder (no GPS) for the high end. Deposits below 3% → pivot to advisor-paid seats (B2B2C).

#### v1 features (6)
1. Passive day engine.
2. Per-state counting rules for about 10 states.
3. Gap detection with a weekly confirm flow.
4. Evidence attachments.
5. Domicile factor checklist.
6. Audit binder export.

CloudKit and StoreKit 2 underpin all of these.
- **Aha moment:** the first weekly review shows the full timeline with a "Safe days remaining in NY: 97".
- **Out of scope:** tax determinations, international (FEIE, Schengen) rules, credit-card or phone-record import, advisor portal.

#### Competitor table

| Competitor | Price | Rating | Main weakness |
|---|---|---|---|
| TaxDay | $9.99/mo | 3.8★ (63) | Day counts only; mixed ratings |
| TaxBird | ~$34.99/yr | — | Day counts only |
| iReside | $3.99/mo, $34.99/yr | — | Day counts only |
| Tax Days: Residency Tracker | $19.99/yr | New | Low-price anchor |
| TrackingDays / TrackingStates | $3.99/mo | — | Generic, multi-country |
| Monaeo (Topia) | ~$999/yr (reported) | — | Moved toward enterprise |

#### GTM: first 100
- [r/fatFIRE](https://www.reddit.com/r/fatFIRE/), [r/tax](https://www.reddit.com/r/tax/), [Bogleheads](https://www.bogleheads.org/forum/).
- Florida relocation Facebook groups ("Moving to Palm Beach", "NY to FL" **(verify)**).
- Partnerships with residency-specialist CPAs and law firms (Hodgson Russ, McLaughlin & Stern publish on this topic and would be good partners or reviewers; [Hodgson Russ](https://www.hodgsonruss.com/media/publication/843_A_New_Trump_Card_for_New_York_Residency_Audits.pdf), [McLaughlin & Stern](https://www.mclaughlinstern.com/wp-content/uploads/2020/07/2025-Update-Shift-of-Residence-Domicile-from-New-York-to-Florida.pdf)).
- Concierge real-estate agents in Palm Beach and Miami.

---

## 5. Final recommendation

**Build TailBook (aircraft owner airworthiness and records).** The reasons:

1. **Blue-ocean test: best of the three.** It is the only finalist where the paid competition is mostly **expensive human or enterprise services** ($750–$1,100+/yr) and the indie apps are **barely reviewed** (0–16 ratings). REPS is a fast-forming red ocean of more than 10 clones. Residency trackers sell at commodity prices ($20–$40/yr).
2. **The pain is enforced by regulation and insurance.** A lapsed inspection can mean a denied claim on a six-figure asset. Records can swing resale value by 10–50% (vendor estimates). Owners argue about the month-end interval math on forums, and the app can own that logic.
3. **Pricing lands as a no-brainer.** $199/yr is less than 1% of the yearly operating cost, under one-third of SavvyMx, and about one shop hour.
4. **Cheapest reachability.** Owners cluster in a handful of forums, type clubs (COPA alone has 7,000+ members), shops and fly-ins. Co-owner sharing creates a built-in referral loop.
5. **v1 is the most buildable of the three.** It is a deterministic FAR interval engine, VisionKit and Vision OCR, PDFKit, widgets, CloudKit and CKShare, and StoreKit 2. It needs no backend, no data deals and no location-reliability risk. The App Store risk is low with "you and your A&P determine airworthiness" framing.
6. **Honest downsides.**
   - The total market is small: about 139k active piston aircraft. At realistic penetration this is a $0.25M–$1.5M ARR business **(estimate)**, not a venture-scale one.
   - Aircraft Compliance (new, free for now) and a possible ForeFlight or Garmin move into owner maintenance are real threats.
   - Automatic AD applicability will be demanded quickly.

**If the founder wants a larger top-line ceiling** and accepts a crowded field, REPS/STR (#2) has the bigger market. Run the TailBook MVP and the REPS landing page **in parallel for three weeks** (both are cheap) and let the deposit rates decide.

### Questions the founder should answer
1. Does anyone on the team own an aircraft or hold an A&P/IA certificate? If not, will we pay an IA advisor (for example $1–2k) to validate the interval engine and templates?
2. Are we comfortable with a niche capped at about $1–2M ARR, or do we need a larger total market (which points to #2)?
3. Pricing: per aircraft ($199) versus per owner, and do partnerships pay once? (My recommendation is per aircraft, with unlimited co-owners.)
4. iPad-first or iPhone-first? Pilots live on iPads in the cockpit, but owners do admin on their phones. (My recommendation is a universal app with an iPhone-first status board.)
5. What liability posture and Terms of Service will we adopt, and will we buy E&O insurance before launch?
6. Will we commit to keeping type templates and rule changes current (for example ELT and registration rule updates) as an ongoing content cost?
7. Will we sell founding deposits on the web (Stripe) before the app exists, given that IAP is required in-app afterwards?
8. Should we plan the v2 AD-applicability feature (FAA DRS data shipped as a static, versioned file) now, so the data model supports it?
9. What is the kill criterion and date? I propose: under 5% deposit conversion on 60+ concierge snapshots by **2026-12-15** → pivot or switch to #2.
10. Do we approach type clubs as partners (member discount and revenue share) from day one?

---

## 6. Sources (selected, all accessed via web search on 2026-10-18)

**Aviation**
- FAA CY2024 GA Survey: https://www.faa.gov/data_research/aviation_data_statistics/general_aviation/cy2024
- GA News (active fleet): https://generalaviationnews.com/2026/02/11/ga-doing-more-with-less/
- GA News (Aircraft Compliance app): https://generalaviationnews.com/2026/08/06/new-aircraft-compliance-app-simplifies-aviation-maintenance-tracking/
- AOPA (Wikipedia): https://en.wikipedia.org/wiki/Aircraft_Owners_and_Pilots_Association
- COPA membership: https://www.cirruspilots.org/become-a-member
- SavvyMx price (AOPA 2023): https://youcanfly.aopa.org/flying-clubs/flying-club-newsletter/2023/may/21/club-spotlight
- Bluetail pricing: https://bluetail.aero/product/subscription-plans
- Bluetail on logbooks and value: https://bluetail.aero/incomplete-logbooks-value
- VREF on logbooks and value: https://vref.com/?p=47696
- AvWeb, "The Logbooks Tell All": https://avweb.com/ownership/the-logbooks-tell-all-or-do-they
- Crewchief GA: https://apps.apple.com/us/app/crewchief-ga/id1470882836
- FlightBoss: https://appshunter.io/ios/app/flightboss/id1556221444
- BetterPlane: https://www.capterra.com/p/10047876/BetterPlane/
- MooneySpace (owner tracking): https://mooneyspace.com/topic/43735-looking-for-ideas-on-how-others-track-maintenance-requirements
- MooneySpace (maintenance tracking app): https://mooneyspace.com/topic/37201-maintenance-tracking-app
- POA (new owner thread): https://pilotsofamerica.com/community/threads/new-owner-how-do-you-monitor-maint-schedules.86127/unread?new=1
- POA (Aircraft Status Board): https://pilotsofamerica.com/community/threads/aircraft-status-board.134734
- POA (inspection-date questions): https://www.pilotsofamerica.com/community/threads/questions-on-maintenance-inspection-dates-and-transponder-inspection.98875/
- Insurance denials (Midwest Flyer): https://midwestflyer.com/aircraft-insurance-coverage-will-you-have-it-when-you-need-it/
- Insurance denials (AOPA PPS): https://pilot-protection-services.aopa.org/news/2021/march/01/insurance-policy-flight-operations
- Insurance denials (Shackelford Law): https://shackelford.law/news-aviation/aircraft-insurance-coverage-will-you-have-it-when-you-need-it-2/
- Annual inspection costs (Fly Heritage): https://flyheritage.com/aircraft-annual-inspection-cost/
- Ownership costs (BlackJet): https://blackjet.com/post/cost-of-aircraft-ownership
- iPad Pilot News (Reminders for maintenance): https://ipadpilotnews.com/2012/10/use-the-reminders-app-for-maintenance-tracking/

**REPS / STR**
- BiggerPockets, "The $300,000 Log Book": https://www.biggerpockets.com/member-blogs/10269/blog_posts/67767-the-300-000-log-book
- Warren v. Commissioner (T.C. Summ. Op. 2024-20): https://storage.courtlistener.com/pdf/2024/10/03/james_michael_warren.pdf
- Klasing Associates (contemporaneous logs): https://klasing-associates.com/importance-keeping-contemporaneous-time-log-rental-real-estate-claiming-real-estate-professional-status/
- White Coat Investor (STR loopholes and REPS): https://www.whitecoatinvestor.com/understanding-short-term-rental-loopholes-reps/
- CBIZ (OBBBA bonus depreciation): https://www.cbiz.com/insights/article/cost-segregation-bonus-depreciation-benefits-under-the-obbba
- REPS Time: https://apps.apple.com/us/app/-/id6741897087
- REPStracker: https://apps.apple.com/app/id1555788055
- REPS Hours: https://apps.apple.com/app/id6764418950
- STR Loophole: Hour Tracker: https://apps.apple.com/us/app/-/id6759050584
- STR Tax Loophole Tracker: https://apps.apple.com/app/id6763977430
- BNBCalc tracker: https://www.bnbcalc.com/tools/material-participation-tracker
- BiggerPockets (RepsRecord thread): https://www.biggerpockets.com/forums/517/topics/1296779-repsrecord-reps-and-str-hour-tracking-built-by-a-former-irs-agent

**Residency**
- Accounting Today: https://www.accountingtoday.com/opinion/moving-from-a-high-tax-state-be-prepared-for-a-residency-audit
- PKF O'Connor Davies: https://www.pkfod.com/insights/moving-from-a-high-tax-state-be-prepared-for-a-residency-audit/
- CBIZ (statutory residency): https://www.cbiz.com/insights/article/statutory-residency-its-more-than-just-time-and-place
- Empire Center (mover incomes): https://www.empirecenter.org/?p=54996
- HomeAbroad (NYC → South Florida): https://homeabroadinc.com/research/nyc-migration-south-florida-rent-split/
- TaxDay (AppFollow): https://apps.appfollow.io/ios/taxday/1045026503?country=us
- TaxBird (AppFollow): https://appfollow.io/ios/taxbird-residency-tracker/1238166926?country=us
- Tax Days: https://apps.apple.com/us/app/id6761441335

**Other niches**
- IRS Notice 2026-25 (FEIE): https://www.irs.gov/pub/irs-drop/n-26-25.pdf
- Greenback (physical presence test): https://www.greenbacktaxservices.com/knowledge-center/physical-presence-test/
- eucrim (EES): https://eucrim.eu/news/entryexit-system-ees-fully-operational-since-10-april-2026/
- BrightTax (FBAR penalty): https://brighttax.com/glossary/fbar-penalty/
- OMB ICR (FBAR count): https://omb.report/icr/202403-1506-001
- CE Broker (AppFollow): https://appfollow.io/ios/ce-broker/384461998?country=us
- bcs pricing: https://getbcs.com/pricing
- USEF GR845: https://usef.org/media/press-releases/13335_usef-equine-vaccination-rule
- BarnManager (Capterra): https://www.capterra.co.uk/reviews/164823/barnmanager
- InVintory vs CellarTracker: https://invintory.com/blog/invintory-vs-cellartracker-wine-app-comparison/
- Fratello (watch collection value): https://www.fratellowatches.com/value-watch-collection/
- Trawler Forum (yacht maintenance software): https://www.trawlerforum.com/threads/yacht-maintenance-app-or-software.66811/post-1264929
- SIA (locum market): https://www.staffingindustry.com/research/research-reports/americas/us-locum-tenens-market-growth-assessment-2025
- CredBook: https://mwm.ai/apps/credbook/6760574525
