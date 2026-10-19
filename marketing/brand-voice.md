# TailBook Brand Voice

**Who this is for:** anyone who writes a word for TailBook, including posts, scripts, ads, App Store copy, press and replies.
**Sources:** research §4.1 (avatar, Value Equation, offer), `validation/00-playbook.md` (ground rules, glossary), `validation/07-legal-and-appstore.md` §1 (disclaimer, the single source of truth). If this file and `07-…` ever disagree on legal wording, **`07-…` wins**.

---

## 0. Non-negotiables (read these before anything else)

1. **TailBook never says an aircraft is airworthy, legal, safe, compliant or certified.** It organizes dates the owner enters and shows what's coming due. The A&P/IA and the pilot in command determine airworthiness (14 CFR 91.7, 91.403).
2. **The status question is "All items current?", never "Airworthy today?"** In copy, say "All tracked items current" and not "Airworthy".
3. **Disclose who we are.** Every post, video and ad that a person could take for independent advice carries the disclosure that the founder is building TailBook. The founder is not an A&P and, per the playbook, not (yet) a pilot. Say so plainly. It's a strength, not a weakness: "I'm the software guy. An IA checks my homework."
4. **Prices and terms, exactly** (don't paraphrase them into something new):
   - Regular: **$199/yr per aircraft** (14-day free trial at launch; $24.99/mo option per research §4.1).
   - **Founding Owners: $149/yr for life, first 250 aircraft.** "For life" means for as long as the subscription stays active. Say that wherever there's room (landing page line 603 already does).
   - Held with a **$49 refundable deposit**: "**credited via an App Store offer code at launch, or fully refunded**." Refundable on request any time before launch. If we don't ship by **[2027-06-30]**, everyone is refunded automatically.
5. **Disclaimer, short form** (emails, captions, ads where space allows, video end cards):
   > TailBook organizes the dates you enter. Your A&P/IA and the pilot in command determine airworthiness.
6. **No made-up proof.** No invented testimonials, user counts, "as seen in" logos or star ratings. Use real numbers from the tracker or none at all. Placeholders look like `[N]` until a real number exists.
7. **No manufacturer or type-club logos**, and no implied endorsement. Nominative text only ("for Bonanza owners"). Don't name a type club as a partner without a signed agreement (`07-…` §6, guideline 5.2).
8. **FAR facts get checked against eCFR before anything publishes.** The cheat-sheet facts in `05-guest-article.md` are the approved set. Don't add a new interval (for example a Cirrus CAPS repack interval) unless the IA advisor has confirmed it.

### ⚠️ Fix needed on the landing page (owner: landing engineer; flagged here, not edited)
`landing/src/index.html` still uses the research's original offer wording, which breaks rule 1:
| Line | Current | Replace with |
|---|---|---|
| 6 | `<title>TailBook: Always-Airworthy</title>` | `TailBook: Know What's Due` |
| 11 | og:title "know your plane is legal in 5 seconds" | "TailBook: know what's due on your airplane in 5 seconds" |
| 408 | "The Always-Airworthy Owner System / Know your plane is legal in 5 seconds." | "**The Always-Ahead Owner System** / Know what's due on your airplane in 5 seconds." |

"Always-Ahead" keeps the M-A-G-I-C magnet ("Always") without a verdict. Use it everywhere a named offer appears. Ads that send traffic to a page saying "legal in 5 seconds" would also get flagged by Google/Meta reviewers and App Review (2.3), so **fix this before any paid test**.

The free deliverable keeps its validation name, **"Free Airworthiness Snapshot"**, for continuity with the forum posts, emails and Tally form. It's always described as "an informational summary of the dates you provide", never as an inspection. At App Store launch, consider renaming it to "Due-Date Snapshot" in App Store metadata (guideline 2.3).

---

## 1. Positioning statement

> **For** US Part 91 owners and co-owners of piston singles and light twins **who** keep their due dates in a binder, a spreadsheet or their head, **TailBook is** an iPhone and iPad status board **that** shows in five seconds what's due on the airplane and when, with the regulation behind every date. **Unlike** spreadsheets and reminders, it does the calendar-month math correctly and warns you at 60, 30 and 7 days. **Unlike** managed maintenance services ($750–$1,100+/yr), it costs $199 a year and your data stays on your phone and in your iCloud. Your IA still makes the call. TailBook just makes sure nothing comes due without warning.

**Category we claim:** *owner-side due-date board*. Not "maintenance tracking software" (fleet/shop connotation, the CAMP/Bluetail world), not "logbook app" (pilot logbooks belong to ForeFlight and MyFlightbook). Use "maintenance tracking" only as a search keyword, never as our identity.

**The enemy:** not the shop and not the IA. The enemy is **"I think it was about two years ago"**: memory, the whiteboard, the spreadsheet with the wrong month-end math.

---

## 2. One-liners (pick by context)

| Use | One-liner |
|---|---|
| Default (bios, intros) | **TailBook shows what's due on your airplane, and why, in five seconds.** |
| Forum signature | Building TailBook, an owner-side due-date board. Not an A&P. Free checker: [link] |
| Spoken intro (podcast, hangar) | "It's the status board for your airplane: annual, transponder, pitot-static, ELT, registration and your recurring ADs, each with the reg behind it, green, yellow or red." |
| For the IFR owner | "Two 24-month checks, one ELT battery label and an annual, all on one screen with the regs cited." |
| For partnerships | "One board for every co-owner. Whoever flies logs the tach." |
| For the seller | "The records trail a buyer wants to see, kept as you go." |
| Price objection | "Less than one hour of shop labor a year." ($199 vs $95–$140/hr, research §4.1) |
| Excel objection | "Excel works if you get the month-end math right every time. TailBook does it for you and warns you." |
| Trust objection | "Every date shows the regulation it comes from, so your IA can check it in a minute." |

## 3. Taglines (shortlist; test, don't argue)

1. **Know what's due.** *(primary; short enough for an icon caption)*
2. **Nothing comes due without warning.**
3. **The reg behind every date.**
4. **"About two years ago" isn't a due date.** *(taken from the guest article's line "'About two years ago' is not a due date.")*
5. **Your airplane's dates, done right to the end of the month.**
6. **Five seconds to know. Five minutes to set up.**
7. **Always ahead of the annual.**

Do not use: "Always airworthy", "Fly legal", "Never be grounded", "Peace of mind, guaranteed", "FAA-compliant".

---

## 4. Words to use and avoid

| Use ✅ | Avoid ❌ | Why |
|---|---|---|
| "what's due", "coming due", "current", "lapsed", "overdue" | "airworthy", "legal to fly", "grounded" (as our verdict) | We don't make airworthiness determinations (07 §1) |
| "All items current?" / "All tracked items current" | "Airworthy today?" / "Ready to fly" | Same; App Review 1.4/2.3 |
| "track", "organize", "remind", "show", "warn you" | "ensure", "guarantee compliance", "certify", "approved", "verified" | Overclaims; metadata rule 2.3 |
| "with the FAR citation", "the reg behind it", "per 91.413" | "FAA-approved", "FAA-certified", "official" | Nothing we make is FAA-approved |
| "your IA", "your A&P", "ask your IA" | "you don't need your mechanic for this" | The IA is an ally, and a referral channel |
| "the dates you enter" | "automatically knows your ADs" | No automatic AD applicability in v1 |
| "calendar month", "end of the month", "whichever comes first" | "about", "roughly every two years" | Precision is the brand |
| "tach", "Hobbs", "SMOH", "squawk", "IA", "annual" | "hours on the engine", "plane app", "flying car" | Insider language (playbook glossary) |
| "on your iPhone and iCloud, no account" | "cloud platform", "secure servers" | We have no servers; say so |
| "Founding Owner", "refundable deposit" | "pre-sale", "investment", "lifetime deal" | Deposit terms §3 |
| "I'm building", "I'm not an A&P", "an IA reviews the rules" | "our team of experts", "industry-leading" | Honesty is the moat in this community |
| "insurance writers caution that…", "read your policy's airworthiness language" | "your insurance WILL be void" | We can't predict a specific policy |
| "can cost you", "buyers read the logbooks" | "lose 50% of your plane's value" | The 10–50% range is a research estimate; don't put it in ads |

**Banned outright:** disrupt, game-changer, revolutionary, AI-powered, hack, 10x, "secret", "they don't want you to know", fake urgency timers, ALL-CAPS claims.

### Tone
- **Hangar-flying, not salesy.** Like a careful friend at the FBO who happens to have read the regs.
- **Specific over clever.** "91.413, 24 calendar months, applies VFR" beats "don't get caught out!"
- **Humble about aviation, confident about dates.** We defer on airworthiness and own the math.
- **Short sentences. Numbers. Citations.** The avatar is 40–70, a business owner or professional, and skeptical of marketing.
- **Respect the money.** These owners spend $15k–$35k a year. Talk about protecting a hull, an insurance renewal and resale, not about "saving a few bucks".

---

## 5. Hooks: the house style (Hormozi structure, without hype or lies)

A hook earns the next 5 seconds. Ours are **true, specific, and about the owner's airplane**, and the claim in the hook is always paid off in the body.

| Hook type | Pattern | TailBook example |
|---|---|---|
| Call-out | "[Owner type], [specific thing]." | "IFR owners: your annual doesn't cover these two checks." |
| Contrarian truth | "[Common belief] isn't quite right." | "An ELT inspected March 3rd isn't due March 3rd." |
| Hidden stake | "[Overlooked item] can cost you [real stake]." | "Your airplane has a battery date almost nobody reads." |
| Question with a right answer | "Quick: [puzzle]?" | "Recurring AD, 100 hours or 12 months, whichever first. When's it due?" |
| "If X, then Y" | "If you [do this], [this applies]." | "Flying VFR only? This 24-month check still applies to you." |
| Proof/transparency | "Here's the real number." | "I'm deciding on December 15th whether to build this. Here's the scoreboard." |
| Time-bound task | "[N] dates, [N] minutes, tonight." | "Five dates. Ten minutes. Tonight." |

**Hook test before publishing:** (1) Is every word true for a typical Part 91 owner? If it's only *sometimes* true, add "might" or "can". (2) Does the body pay it off within 20 seconds? (3) Could a sharp A&P on POA call it out? If yes, rewrite.

---

## 6. The 3 core messages, mapped to the Value Equation

Value = (Dream Outcome × Perceived Likelihood) ÷ (Time Delay × Effort & Sacrifice), per research §4.1.

| # | Core message | Lever(s) it moves | Proof we show | Where it leads |
|---|---|---|---|---|
| **M1** | **"Know what's due on your airplane in five seconds, and get warned 60, 30 and 7 days before anything lapses."** | **Dream outcome ↑** (no surprises, insurance renewal and annual without drama, records that hold resale value) and **Time delay ↓** (the answer in 5 seconds, warnings in advance) | The board screenshot: green/yellow/red with "Next due: ELT battery in 41 days". The checker gives this in the browser today. | Free checker (`checker_completed`) |
| **M2** | **"Every date shows the regulation behind it, and your IA can check it in a minute."** | **Perceived likelihood ↑** (it'll be right; my mechanic can verify it; it handles the calendar-month rule owners argue about) | The FAR citation on every row; the IA reviewer credit (once signed); the open calendar-month explanation; a one-page Status Report that matches the logbook | Free Airworthiness Snapshot (`snapshot_clicked`) |
| **M3** | **"Eight dates and your tach. Five minutes. No logbook digitizing, no account."** | **Effort & sacrifice ↓** (no data-entry project, no login, private on-device/iCloud; co-owners share one board) and **Time delay ↓** (first board in under 5 minutes) | A 30-second screen recording of the checker or onboarding, start to finish, in real time | Checker first, then Founding Owner deposit (`deposit_clicked`) for warm audiences |

**The offer stack** (only once someone has seen value, i.e. after the checker or Snapshot):
- Founding Owner, $149/yr for life (vs $199), first 250 aircraft. Real scarcity: seats are capped to keep support personal.
- $49 refundable deposit: credited via an App Store offer code at launch, or fully refunded.
- Find-It Guarantee (as worded on the landing page and in `07-…` §4; never promise an Apple refund, promise to *help* request one plus a free year if Apple declines).
- Anchors: managed tracking ~$750–$1,100/yr; one annual $2,500+; one hour of shop labor $95–$140.

**Seasonal angle (Nov–Jan, "annual season"):** "Get your annual punch list ready before you drop the plane off." Use it from week 3 onward.

---

## 7. Analytics names (do not rename)

Plausible goals, matching `track()` in `landing/src/index.html`: **`checker_completed`**, **`email_submitted`**, **`snapshot_clicked`**, **`deposit_clicked`**. Every marketing link uses the UTM convention in `paid-ads.md` §5 (which extends the forum convention in `01-forum-posts.md`).

## 8. Visual and audio shorthand (until there's a designer)
- Real things over stock: logbooks, the ELT label, the transponder sticker, a hangar, the checker on a phone.
- Status colors are functional (green/yellow/red) and **always carry a text label** ("Current", "Due in 41 days", "Overdue"). Never color alone.
- On-screen citations in a monospace style: `14 CFR 91.413`.
- End card for every video: "Free due-date checker: link in bio · TailBook organizes the dates you enter. Your A&P/IA and PIC determine airworthiness."
- No airplane-crash imagery, no fear music, no "red siren" effects. Calm and precise.
