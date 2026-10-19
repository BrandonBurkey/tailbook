# TailBook Validation Playbook (2026-10-19 → 2026-12-15)

**One question to answer by Tuesday 2026-12-15:** will Part 91 owners pay for this before it exists?
**Kill/pivot rule** (research §5, Q9): deposit conversion under 5% on 60+ delivered Snapshots → pivot or switch to option #2. Full rules are in `06-decision-rules.md`.

**The funnel you are running**
Forum/club post → landing page + free due-date checker (another engineer is building it) → "Free Airworthiness Snapshot" request → you deliver a FAR-cited PDF + .ics within 48h → Founding Owner offer: $49 refundable deposit, $149/yr for life.

**Numbers that matter** (from research §4.1)
| Exp | Pass | Fail | When measured |
|---|---|---|---|
| E1 posts → Snapshot requests | ≥150 clicks AND ≥60 requests in 21 days | <20 requests | Oct 26 → Nov 15 |
| E2 Snapshot → deposit | ≥15% | <5% | Rolling; final Dec 13 |
| E3–E6 | Need an app. Measured via concierge **proxies** until then (see tracker) | | |

---

## Setup checklist (Week 0; do it in this order)

| # | Item | Tool / choice | Cost | Time |
|---|---|---|---|---|
| 1 | **Form an LLC** before you take anyone's money (deposits, contracts with the IA) | State filing, or a service such as Northwest/Stripe Atlas | **$50–$500** one-time, varies by state; some states charge an annual fee | 1h + waiting |
| 2 | Business bank account (Stripe pays out to it) | Mercury / Relay / local bank | Free | 30m |
| 3 | **Domain** | e.g. `tailbook.app` or `gettailbook.com`; check first that "TailBook" isn't a registered trademark (USPTO TESS search, 15 min) | **~$12–$20/yr** (.app ~$15) | 20m |
| 4 | **Professional email** `founder@yourdomain` | Google Workspace (calendar and Meet included), or Zoho Mail Lite | **~$7–$8/mo** (Workspace) or ~$1/mo (Zoho) | 30m |
| 5 | Email deliverability | Add SPF, DKIM and DMARC DNS records (your host walks you through it) | Free | 20m |
| 6 | **Landing page host** | Agree with the landing-page engineer. Carrd Pro or Framer if no-code; Netlify/Vercel/Cloudflare Pages if coded | Carrd Pro **$19/yr**; Framer **~$10–$15/mo**; Netlify/Vercel/Cloudflare **free** | 15m to align |
| 7 | **Snapshot request form** | **Tally** (free plan supports file uploads, which you need for logbook photos) or Formspree (free tier ~50 submissions/mo, so too small). Use Tally. | **Free**; Tally Pro $29/mo only if you need bigger uploads | 1h |
| 8 | **Stripe Payment Link: $49 "Founding Owner refundable deposit"** | Stripe → Payment Links. One-time price, collect name + email + tail number (custom field). Turn on "Require customer to agree to terms" and link the deposit terms from `07-legal-and-appstore.md`. | **No monthly fee**. 2.9% + 30¢ per charge (~$1.72 per deposit). **Stripe keeps its fee when you refund**, so budget ~$1.72 lost per refund | 45m |
| 9 | **Plausible analytics** on the landing page and checker; set goals: `checker_completed`, `email_submitted`, `snapshot_clicked`, `deposit_clicked` (must match the `track()` calls in `landing/src/index.html`). Use UTM tags on every post link (see `01-forum-posts.md`) | Plausible | **~$9/mo** (30-day free trial) | 30m |
| 10 | Email sending for sequences (`04-emails.md`) | MailerLite or Kit free tier (automations; ~500–1,000 subs free, verify the current limit) | **Free** at this scale | 1h |
| 11 | Scheduling link for interviews | Google Calendar appointment schedule (in Workspace) or Cal.com | **Free** | 15m |
| 12 | Snapshot workbench | Google Sheet "Snapshot Calculator" (formulas in `03-concierge-snapshot-sop.md`) + Google Docs PDF template | **Free** | 2h |
| 13 | Tracker | Import `06-experiment-tracker.csv` into Google Sheets | Free | 10m |
| 14 | **Join COPA** (Cirrus Owners & Pilots Assn) — the forum is members-only | cirruspilots.org | **$95/yr** | 15m |
| 15 | **Join MAPA** (Mooney) — newsletter and partnership access | mooneypilots.com | **~$50–$75/yr (verify)** | 15m |
| 16 | Optional: AOPA membership (credibility, AOPA forums, *Pilot* magazine) | aopa.org | **~$89/yr (verify)** | 10m |
| 17 | Free forum accounts: MooneySpace, Pilots of America, BeechTalk (**requires your real name**), Backcountry Pilot, Reddit (r/flying, r/aviation), Facebook | — | **Free** | 1h |
| 18 | **IA advisor** to review the rules and the Snapshot template (see `03-…sop.md` §9) | Paid contract | **$1,000–$2,000** | 2h outreach |
| 19 | Optional: E&O insurance quote (bind before App Store launch, not needed this week; see `07-…`) | TechInsurance / Insureon / a broker | **~$800–$1,500/yr** | 30m to get quotes |
| 20 | Lawyer review of ToS + deposit terms (`07-…`) | Flat-fee startup lawyer or LegalZoom-type attorney plan | **~$300–$1,000** | 1h of your time |

**Budget through 12-15 (realistic):** LLC ~$150 + domain $15 + Workspace $16 + Plausible $18 + COPA $95 + MAPA ~$65 + IA advisor ~$1,500 + lawyer ~$500 ≈ **$2,350**. Without the IA and lawyer: **~$360**. Stripe fees come off deposits as they arrive.

**Do not spend on:** paid ads (not yet), Oshkosh/Sun 'n Fun booths, a logo designer, or app development before 12-15.

---

## Week-by-week plan

Time budget: roughly **3–4h/day on weekdays and 2h/day on weekends**. Snapshot delivery is the biggest variable at **~45 min each** (about 25 min once you are fast).

### Week 0 — Mon Oct 19 → Sun Oct 25: Set up, learn the language, earn forum standing
| Day | Do | Time |
|---|---|---|
| Mon | Setup items 1–5. Read the glossary below twice. Read the research §4.1. | 4h |
| Tue | Setup 7–11. Join COPA and MAPA. Create the forum accounts and **complete every profile with your real name and a short honest bio**: "Building an owner-side maintenance tracker. Not an A&P. Here to learn." | 4h |
| Wed | **Lurk and read**: 20 maintenance/ownership threads on POA, MooneySpace and BeechTalk. Write down the words owners use. Send the IA advisor outreach (10 messages). | 3h |
| Thu | Build the Snapshot Calculator sheet + PDF template. Do a practice run on 2 made-up aircraft and on 1 real aircraft (a pilot friend, or a public N-number from the FAA registry). Coordinate with the landing engineer: the Tally link, Stripe link, Plausible goals and UTM scheme. | 4h |
| Fri | Make the **"24-month items owners forget" cheat sheet** PDF (a one-page version of `05-guest-article.md`). Post **2–3 helpful, non-promotional replies** in each forum (answer questions you can actually answer, e.g. how calendar months work). Many forums limit links for new accounts, which is why you start now. | 3h |
| Sat–Sun | Recruit and run 2–3 warm interviews (`02-customer-interviews.md`): ask your local FBO, flying club, or EAA chapter. **Visit a local airport on Saturday morning**: hangar rows and the "$100 hamburger" crowd. | 2h/day |

**Exit criteria:** Stripe link live in test mode, the form works end to end, one practice Snapshot done, IA outreach sent, forum accounts carry real activity.

### Week 1 — Oct 26 → Nov 1: Launch E1 (Day 1 of 21 is Mon Oct 26)
| Day | Do | Time |
|---|---|---|
| Mon | Post **Variant A** on POA and MooneySpace. Answer every reply within 4h. | 3h |
| Tue | Post Variant A on BeechTalk and Backcountry Pilot. Deliver the first Snapshots. | 3–4h |
| Wed | r/flying (only where its rules allow; see etiquette notes). 1–2 interviews. | 3h |
| Thu | COPA forum post. Deliver Snapshots. Send the Founding offer email to each delivered owner 24h after delivery. | 3–4h |
| Fri | **Weekly review**: fill in the tracker. Which channel produced requests, not just clicks? | 1h + Snapshots |
| Weekend | 2 Facebook owner groups (after the admin approves). Deliver Snapshots. | 2h/day |

### Week 2 — Nov 2 → Nov 8: Variant B + type clubs
- Post **Variant B** in channels where A has gone quiet (a new thread a week later, or a reply in an active "how do you track…" thread; never repost the same text).
- Send the type-club partnership outreach (`04-emails.md` §7) to COPA, ABS, CPA, POS and MAPA. Submit the guest article to General Aviation News.
- Aim for 5 interviews this week. Deliver every Snapshot within 48h; that promise is part of the test.
- Daily: ~1h on forum replies, ~2h on Snapshots, 30m on interviews/notes.

### Week 3 — Nov 9 → Nov 15: Push to close E1 (Day 21 = Sun Nov 15)
- Two more Facebook groups and r/aviation (only where allowed).
- Ask every Snapshot recipient: "Know another owner who'd want one?" (a referral proxy for E6).
- **Sun Nov 15: E1 readout.** Use the rules in `06-decision-rules.md` §1. Under 20 requests → stop E1 and go to the decision rules now. Don't wait for 12-15.

### Week 4 — Nov 16 → Nov 22: Double down on the winning channel
- Put 80% of posting time into the top 2 channels by requests. Kill the rest.
- Follow up with every Snapshot recipient who hasn't put down a deposit (sequence in `04-emails.md`).
- Run 5 interviews focused on **people who did NOT deposit**. Their reason is the most valuable data you'll get.
- Mid-point E2 check: deposit rate across all Snapshots delivered so far.

### Week 5 — Nov 23 → Nov 29: Thanksgiving (Thu Nov 26), so a lighter week
- Snapshots and replies only, ~2h/day. Pilots fly over the holiday, so it's a good week for forum engagement.
- Draft the decision memo skeleton.

### Week 6 — Nov 30 → Dec 6: Hit 60 Snapshots
- If you are under 45 delivered, run one more burst: an owner FB group plus a reply in any active "annual season" thread. Seasonal hook: "Get your annual punch list ready before you drop the plane off."
- Optional Wizard-of-Oz check: show 5 depositors a Figma or screenshot board and ask them to find what's due next. No code needed.

### Week 7 — Dec 7 → Dec 13: Close and analyze
- Last deposit reminder (`04-emails.md`, "last call before we decide").
- **Sun Dec 13:** freeze the numbers. Calculate E1, E2 and the proxies for E3/E5/E6. Tag every interview against the signals list in `02-…`.

### Decision — Mon Dec 14 / Tue Dec 15
- Apply `06-decision-rules.md` exactly. Write a one-page memo: the numbers, the 3 strongest quotes, the decision, and the next 2 weeks.
- If KILL: send the refund email (`04-emails.md` §6) **the same day** and refund through Stripe.

---

## How to talk to pilots without sounding like an outsider

**Ground rules**
1. **Say who you are in the first sentence.** "I'm not a pilot (yet), I'm building software for owners and trying to understand how you track this." Pilots respect honesty and can smell a marketer a mile off.
2. **Never give airworthiness opinions.** The phrase that keeps you safe: *"That's a question for your IA."* You organize dates; mechanics and the pilot in command decide airworthiness.
3. **Ask about the airplane.** Owners love talking about their plane. "What do you fly? How long have you had her?" is the universal opener.
4. **Use the tail number the way they do.** "N123AB" is said "November one two three Alpha Bravo", but owners say "three-alpha-bravo" or just "my Bonanza".
5. **Don't** say "plane app", "flying car", "hours on the engine" (say "time since major overhaul / SMOH"), or "FAA approved" about anything you make.

**Glossary (learn these 30)**
| Term | What it means | Why it matters to TailBook |
|---|---|---|
| **Part 91** | 14 CFR Part 91, the general operating rules for private (non-commercial) flying. "Part 91 owner" = flies for themselves, not an airline or charter. | Our whole market. Part 135 = charter, Part 121 = airlines. Not us. |
| **FAR / 14 CFR** | Federal Aviation Regulations, Title 14 of the Code of Federal Regulations. "91.409" means §91.409. | Every due item cites one. |
| **A&P** | Airframe & Powerplant mechanic certificate. Can do most maintenance and sign it off. | Your users' mechanic. |
| **IA** | Inspection Authorization, an extra rating on top of an A&P. **Only an IA (or a repair station) can sign off an annual.** | Your advisor, and your users' key relationship. |
| **Annual** | The annual inspection under §91.409(a), due by the end of the 12th calendar month. Typical cost: $1,500–$4,500+. | The big one. Lapsed annual = not airworthy = insurance risk. |
| **100-hour** | Inspection every 100 hours of time in service, required only if the aircraft carries people for hire or is used for flight instruction for hire (§91.409(b)). | Most private owners don't need it, but rental and club aircraft do. |
| **Calendar month** | The interval runs to the **last day** of the due month. Annual done Mar 3, 2026 → good through Mar 31, 2027. | The logic owners argue about. We own it. |
| **Tach (tach time)** | Engine time from the tachometer. Runs slower at low RPM. Many owners track maintenance by tach. | Use it for hour-based intervals (oil, 100-hr). Ask which they use. |
| **Hobbs** | A meter that counts clock time while the engine/master runs. Usually higher than tach. Rentals bill by Hobbs. | Partnerships often split costs by Hobbs. |
| **TT / TTAF** | Total time / total time airframe. | Standard header on status reports. |
| **SMOH / TSO** | Since major overhaul / time since overhaul (engine). "1,200 SMOH". | Resale value; shows you know engines. |
| **TBO** | Time between overhauls, the manufacturer's recommended engine life (e.g. 2,000 hrs). Advisory for Part 91. | Never call it "required" for Part 91. |
| **AD** | Airworthiness Directive. An FAA-mandated fix or inspection (14 CFR Part 39). Can be one-time or recurring (by hours, calendar, or **whichever comes first**). | Recurring ADs are a top pain point. We track; we never decide applicability. |
| **SB** | Service Bulletin, a manufacturer recommendation. Generally not mandatory for Part 91 unless an AD requires it. | Track optionally. |
| **AD compliance record / AD list** | The list (usually from the IA) of ADs applicable to the airframe, engine and prop, with status. | The key input for a Snapshot. |
| **Squawk** | A reported defect or discrepancy ("the left fuel gauge is squawked"). | Squawk list → "Annual Work Order". |
| **Logbooks** | Separate airframe, engine and propeller logs. Maintenance records required by §91.417. | The vault feature. Losing them hurts resale. |
| **Return to service / sign-off** | The mechanic's logbook entry approving the aircraft to fly after work. | A Snapshot reads dates from these entries. |
| **Pitot-static / altimeter check** | The 24-month test under §91.411 that's required to fly **IFR** in controlled airspace. | The classic "forgotten 24-month item". |
| **Transponder check** | The 24-month test under §91.413. Applies to **any use** of the transponder, VFR included. | The other forgotten 24-month item. |
| **ELT** | Emergency Locator Transmitter. 12-calendar-month inspection plus a battery replacement date (§91.207). 121.5 vs 406 MHz types. | Battery date is printed on the unit. Ask for a photo. |
| **VOR check** | 30-day accuracy check of the VOR receiver before using it IFR (§91.171). A pilot's entry, not a mechanic's. | Informational; many owners fly GPS-only. |
| **IFR / VFR** | Instrument vs Visual Flight Rules. IFR-capable owners have more items (pitot-static, VOR). | Onboarding question #1. |
| **ADS-B** | Satellite-based position broadcast ("ADS-B Out"), required in most controlled airspace since 2020. | Comes up in transponder chat. There's no separate FAR periodic check; defer to the avionics shop. |
| **ARROW** | Docs on board: Airworthiness certificate, Registration, Radio license (international only), Operating limitations (POH/AFM), Weight & balance. | Registration is one of ours (7-year expiry). |
| **Registration** | FAA Certificate of Aircraft Registration, now **7 years** (since Jan 23, 2023; 14 CFR 47.40). | A long interval that's easy to forget. |
| **PIC** | Pilot in command. Legally responsible for determining the aircraft is airworthy before flight (§91.7). | Our disclaimer: A&P/IA and PIC determine airworthiness. |
| **Pre-buy** | The inspection a buyer commissions before purchase. Records get scrutinized. | The vault and sale-pack value. |
| **Type club** | Owner associations by make: COPA (Cirrus), ABS (Beech), CPA (Cessna), POS (Piper), MAPA (Mooney). | The best distribution. |
| **FBO** | Fixed-base operator, the airport's fuel, parking and lounge business. | Where you find owners in person. |
| **Annual season** | Many owners schedule annuals in winter, when they fly less. | Our launch timing (Nov–Jan). |

**Phrases that signal "I've done my homework"**
- "Do you track by tach or Hobbs?"
- "Who does your annual: your own IA or a shop?"
- "Are you IFR? So you've got the 91.411 check on top of the transponder."
- "Any recurring ADs that bite you?"
- "How do you and your partners split the tach logging?"

**Phrases to avoid:** "Is your plane legal?" (accusatory), "I can tell you if you're airworthy" (never), "disrupt", "AI-powered", "game-changer".
