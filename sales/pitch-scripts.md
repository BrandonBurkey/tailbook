# Pitch Scripts: Partner Channels

**Rules for every script**
- Send plain-text style from `founder@[domain]`, signed by a real person (as in `validation/04-emails.md`).
- Each sequence has 3 touches: **Day 0, Day 5–7 and Day 14**, then stop. Log every touch in `crm-pipeline.csv`.
- Address people by role or by the name on the organization's public contact page. **Never guess an email address**; use the published contact form or address.
- Any message that mentions due dates carries the short disclaimer: *TailBook organizes the dates you enter. Your A&P/IA and the pilot in command determine airworthiness.*
- Never write "airworthy", "legal to fly", "compliant", "FAA-approved" or "certified".
- Merge fields: `{contact}` (a name only if it's published, otherwise the role, such as "Hi COPA team"), `{org}`, `{type}`, `{city}`, `{tail}`, `{n_aircraft}`.
- **Before launch** the offer is the founding deposit link with `?src={org_slug}`. **After launch** it's the partner's own Apple offer code. Never mention the web deposit inside the app.

---

## 1. Type clubs (COPA, ABS, CPA, POS, MAPA and smaller clubs)

**Touch 1 (Day 0).** Use `validation/04-emails.md` §7 word for word, with its per-club customization row. That email is the source of truth: a guest article plus Founding Owner pricing for members.

**Touch 2 (Day 7).** A shorter version of 04-emails §7's follow-up, with one proof point added.
> **Subject:** Re: A free resource for {org} members
>
> Hi {contact}, a quick follow-up. Since I wrote, [N] owners have sent me their records for a free Snapshot, and [X of N] had at least one item due within 90 days that they hadn't spotted, most often the ELT battery or the 24-month transponder check. *(Use real numbers from the tracker only. If you don't have them yet, delete this sentence.)*
>
> Happy to send the article tailored to {type} owners, or a 400-word sidebar if that fits better. Thanks either way.
>
> [Founder name]

**Touch 3 (Day 14).** Breakup email with a smaller ask.
> **Subject:** Last note: one question for {org}
>
> Hi {contact}, I won't keep writing. One question, and a one-line reply is plenty: **which recurring item do {type} owners most often get caught by?** I'm building the {type} template now and would rather get it from {org} than guess.
>
> If a member offer or article ever makes sense, my door's open: founder@[domain].
>
> [Founder name]

---

## 2. Independent A&P/IA shops (and avionics shops)

Shops answer the phone, not cold email. **Call first** (see §7), then send Touch 1 as a "per our call" email, or send it cold if you can't get through.

**Touch 1 (Day 0)**
> **Subject:** Your customers' annuals, with the paperwork done before they arrive
>
> Hi {contact},
>
> I'm [Founder name]. I'm building TailBook, an owner-side iPhone app that keeps a list of what's coming due on an aircraft (annual, 91.411, 91.413, ELT and battery, registration, and recurring ADs the owner enters), plus a squawk list.
>
> The part for you: before an annual, the owner exports a one-page **Annual Work Order**, meaning their squawks plus what's due, with the regulation reference next to each date. It's meant to make your quote faster, not to second-guess you. Your IA still determines airworthiness, and the app says so on every page.
>
> Would you be willing to look at a sample and tell me what's wrong with it? Ten minutes, at your shop or by phone. If it's useful, I'd like to leave counter cards for your customers, and I pay a $25 referral credit per paid aircraft.
>
> [Founder name] · [phone]
> *TailBook organizes the dates you enter. Your A&P/IA and the pilot in command determine airworthiness.*

**Warm variant, when an owner's Snapshot names the shop.** Change line 2 to: "I recently put together a due-date summary for one of your customers (with their permission), and it made me think the format could save you time on every annual." **Get the owner's permission before mentioning them.** Never share their records.

**Touch 2 (Day 5)**
> **Subject:** Re: sample Annual Work Order
>
> Hi {contact}, here's the sample as a PDF: [LINK]. One question for you: **what's the single thing you wish every owner brought to an annual?** I'll build the export around your answer.
>
> [Founder name]

**Touch 3 (Day 14)**
> **Subject:** Counter cards for {org}?
>
> Hi {contact}, last note. If you'd like, I'll drop off 50 counter cards ("Bring your TailBook Status Report to your annual") with {org}'s own code on them. No commitment, and the code tracks referrals so I can pay your $25 credits. Reply "yes" with a mailing address, or "no" and I'll stop.
>
> [Founder name]

---

## 3. Flying clubs and partnerships

The real buyer is the **maintenance officer** (the board signs). Write to the officer or the club's public address.

**Touch 1 (Day 0)**
> **Subject:** {org}: one shared due-date board per aircraft, every member can see it
>
> Hi {contact},
>
> I'm [Founder name], building TailBook, an iPhone/iPad app that keeps a live board of what's due on each aircraft (annual, 100-hour if you do instruction, 91.411/91.413, ELT, oil and recurring ADs), with the regulation behind each date.
>
> Clubs tell me two things: one volunteer carries the whole fleet's due dates in a spreadsheet, and members forget to log tach. TailBook shares each aircraft's board with members over iCloud. Members log tach from a phone widget in one tap, and every member sees what's due.
>
> **Pricing is per aircraft, not per pilot:** $199/aircraft/yr, and members are free. Before launch, clubs can lock in **Founding pricing at $149/aircraft/yr** with a fully refundable $49 deposit per aircraft. For a {n_aircraft}-aircraft club, that works out to less than a single annual's labor.
>
> Could I have 15 minutes with whoever handles maintenance? I'd especially like to hear how you track things today.
>
> [Founder name] · [phone]
> *TailBook organizes the dates you enter. Your A&P/IA and the pilot in command determine airworthiness.*

**Touch 2 (Day 6)**
> **Subject:** Re: {org} due-date board, plus a 100-hour question
>
> Hi {contact}, one quick note that clubs often ask about. FAA interpretations say that when a club provides **both the aircraft and the instructor**, 91.409(b) 100-hour inspections apply. When members bring their own instructor, they generally don't. TailBook tracks the 100-hour by tach with a projected date ("due in about 9 days at your pace"), so whichever way your club operates, the board shows it. (Your A&P/IA or counsel should confirm which rule applies to you.)
>
> A one-page memo for your board is here: [ONE_PAGER_LINK]. Happy to do a 15-minute call.
>
> [Founder name]

**Touch 3 (Day 14)**
> **Subject:** Closing the loop
>
> Hi {contact}, I'll stop here. If you'd like to put one aircraft on the Founding Club Plan to try it, the deposit is refundable any time before launch: [STRIPE_LINK?src={org_slug}]. Either way, I'd be grateful for one line on how {org} tracks due items today.
>
> [Founder name]

**Partnership variant** (2–5 co-owners of one aircraft). Swap paragraph 2 for: "Partners tell me nobody logs tach and nobody's sure who's watching the ELT battery. TailBook gives all of you one board, and it's $199 per aircraft, not per partner, so with three partners that's under $70 each."

---

## 4. Aviation insurance brokers and insurers

**Touch 1 (Day 0)**
> **Subject:** Content for {org} clients: the inspection items that slip before renewal
>
> Hi {contact},
>
> Aviation insurance writers say flying out of inspection, including the "small" 24-month checks, is among the most common reasons a hull claim gets denied. I've written an owner-education piece on exactly those items (91.411, 91.413, 91.207 ELT, registration, calendar-month math), reviewed by an A&P/IA. **You're welcome to run it free, under your name or co-bylined.**
>
> Disclosure: I'm building TailBook, an owner app that keeps those dates and produces a one-page **Insurance Renewal Snapshot** an owner can send you at renewal. I'm not asking you to endorse it, and I make no claim about premiums or underwriting.
>
> Could I send the draft?
>
> [Founder name]
> *TailBook organizes the dates you enter. Your A&P/IA and the pilot in command determine airworthiness.*

**Touch 2 (Day 7)**
> **Subject:** Re: owner article, draft attached
>
> Hi {contact}, the draft is attached, about 900 words. If it's useful, a second option: a **{org} client code** that gives your clients an extended free trial of TailBook. I'd only do that after your compliance team is comfortable with it, since inducement and rebating rules vary by state.
>
> [Founder name]

**Touch 3 (Day 14)**
> **Subject:** Last note on the owner article
>
> Hi {contact}, I won't follow up again. The article is yours to use either way. If your renewal team ever wants a standard one-page summary format to ask clients for, I'm happy to share the template, unbranded.
>
> [Founder name]

---

## 5. Aircraft brokers and dealers

**Touch 1 (Day 0)**
> **Subject:** Listings that answer the records questions before the buyer asks
>
> Hi {contact},
>
> Missing or messy records come up at almost every pre-buy, and vendors put the value hit anywhere from 10% to 60%. I'm building TailBook, an owner app that keeps each aircraft's due items, recurring ADs (as entered by the owner) and scanned logbook pages in one place. It exports a one-page **Aircraft Status Report** a seller can attach to a listing.
>
> It's a summary of the owner's records. It doesn't replace the logbooks or the pre-buy inspection, and it says so.
>
> Two ideas for {org}:
> 1. **Sellers:** a {org} code for a 60-day free trial, so a seller's records are organized before the listing goes live.
> 2. **Buyers:** a "first 3 months on us" closing gift, so new owners start with a clean board.
>
> You'd earn a revenue share on anyone who converts. Worth 15 minutes?
>
> [Founder name]

**Touch 2 (Day 5)**
> **Subject:** Re: sample Status Report
>
> Hi {contact}, here's a sample Status Report built from a [type] Snapshot, anonymized: [LINK]. **What do your buyers ask for first?** I'll put it at the top.
>
> [Founder name]

**Touch 3 (Day 14)**
> **Subject:** Pre-Buy & Sale Records Checklist, free for {org}
>
> Hi {contact}, last note. Our **Pre-Buy & Sale Records Checklist** (one page) is free for you to send sellers, with your logo on it if you like: [LINK]. No strings.
>
> [Founder name]

---

## 6. Flight schools (100-hour angle and leasebacks)

**Touch 1 (Day 0)**
> **Subject:** Leaseback owners at {org}: a shared view of their aircraft's due items
>
> Hi {contact},
>
> I'm building TailBook, an owner-side app that tracks hour- and calendar-based items (100-hour, annual, 91.411/91.413, ELT, oil, recurring ADs) and projects the next due date from utilization: "100-hour due in about 9 days at this pace".
>
> It isn't fleet or dispatch software, and you likely already have that. It's for **your leaseback owners**, who often have no visibility into what's coming due on their own aircraft. The owner shares the board with your maintenance lead, and both see the same dates.
>
> Would a {org} code for leaseback owners (an extended free trial, with a $25 referral credit to {org} per paid aircraft) be worth a 15-minute call?
>
> [Founder name]
> *TailBook organizes the dates you enter. Your A&P/IA and the pilot in command determine airworthiness.*

**Touch 2 (Day 6)**
> **Subject:** Re: leaseback owners
>
> Hi {contact}, one detail schools appreciate: TailBook handles the "whichever first" logic and **doesn't treat the 10-hour overrun as slack**. The FAA allows it only for the flight to the place where the inspection will be done. A one-pager for owners is here: [LINK].
>
> [Founder name]

**Touch 3 (Day 14)**
> **Subject:** Last note
>
> Hi {contact}, I'll stop here. If you ever want a free owner handout on the 24-month items, here it is: [LINK]. Thanks for your time.
>
> [Founder name]

---

## 7. The 15-minute call script (every segment)

**Goal:** a concrete next step, such as an article date, a counter-card drop, a club deposit or a code issued. A "sounds interesting" doesn't count (decision rules §5).

| Min | Section | What you say or do |
|---|---|---|
| 0–1 | **Frame** | "Thanks for 15 minutes. I'd like to spend 10 learning how you handle this today and 5 on whether there's a fit. If there isn't, I'll say so. Fair?" |
| 1–6 | **Discover** (they talk 80%) | 1. "Walk me through how {org} or your members track what's coming due today." 2. "When did something last sneak up on someone, and what did it cost?" 3. "Who feels that pain most: members, the maintenance officer, the shop?" 4. "What have you tried? Why did it stick or not?" 5. "If this were solved, what would be different for you in a year?" *Write down their exact words for the recap.* |
| 6–9 | **Show** (not tell) | Show the board on screen: the onboarding flow, a yellow ELT battery, a 100-hour item with a projected date, the PDF export. Say: "It organizes the dates owners enter, with the regulation behind each one. The A&P/IA and PIC determine airworthiness. We never say 'airworthy'." |
| 9–12 | **Offer** (value equation) | Restate their dream outcome in their own words, then: "Here's what I'd propose for {org}…" (pick from `pricing-and-offers.md`). Stack it: the article or checklist, the member price, the template review or credit, the guarantee. Anchor: "Managed tracking services run $750–$1,100 a year. A single annual is $2,500 or more. This is $199, or $149 founding." |
| 12–14 | **Objections** | "What would stop this from happening?" Then handle it with `objection-handling.md`. If it's a board decision, ask: "What does your board need to see? Can I write the one-page memo for you?" |
| 14–15 | **Close on a dated next step** | "Can we put [article in the {month} issue / counter cards on {date} / one aircraft on the Founding plan this week] on the calendar now?" Send the recap within 2 hours: their words, the offer, the next step and the date. |

**Things never to say:** "guarantees you're legal", "the FAA approves it", "insurers accept it", or any made-up member counts or results. Don't promise automatic AD applicability; v1 tracks the ADs the owner enters. Don't promise a launch date earlier than the deposit terms allow.

---

## 8. Partner one-pager (send as a PDF; one page)

> # TailBook for {org}
> **One shared due-date board per aircraft, with the regulation behind every date.**
>
> **The problem.** Owners track annual, 91.411, 91.413, ELT and battery, registration, 100-hour and recurring ADs in their heads, a spreadsheet or a whiteboard. The 24-month items slip. A lapsed inspection can put insurance coverage at risk, and messy records cost value at sale.
>
> **What TailBook does** (iPhone and iPad, in development)
> - A green/yellow/red board of every tracked item in under 5 minutes of setup, each with its FAR citation and correct calendar-month math
> - Alerts at 60/30/7 days and at 10/5 hours, with projected dates for hour-based items from actual utilization
> - Recurring-AD tracker with whichever-first logic (ADs entered by the owner)
> - One-tap tach logging from a widget; co-owners and club members share one board
> - Logbook scan vault with on-device OCR; PDF Annual Work Order, Status Report and Insurance Renewal Snapshot
> - Private by design: no TailBook servers. Data stays on the device and in the owner's iCloud
>
> **What {org} gets**
> | | |
> |---|---|
> | Members or customers | Founding Owner pricing **$149/yr per aircraft** (regular $199) while the 250 founding seats last, then a {org} first-year code |
> | {org} | [Revenue share / referral credit / free IA-reviewed article / template review credit], as agreed in writing |
> | Risk | None to {org}. No exclusivity, cancel any time, no use of {org}'s name or logo without written approval |
>
> **Pricing.** $199/yr per aircraft (or $24.99/mo), unlimited co-owners, 14-day free trial. Founding: $149/yr, reserved with a **fully refundable $49 deposit** credited to year one. Automatic refund if we haven't shipped by 2027-06-30.
>
> **Guarantee.** If TailBook doesn't surface at least one date, record or squawk you'd lost track of in your first 30 days (with at least six items entered), email us. We'll walk you through requesting a refund from Apple, and if Apple declines, we'll give you a free year.
>
> **Contact.** [Founder name] · founder@[domain] · [phone]
>
> *TailBook is an organizational tool. It records and calculates dates from information you provide. It does not inspect aircraft, determine airworthiness, or determine whether any AD applies. Your A&P/IA and the pilot in command are solely responsible for determining airworthiness (14 CFR 91.7, 91.403).*
