# Email Sequences

Send from `founder@[domain]` as **plain-text-style** emails: no heavy templates, signed by a real person. Owners reply to people, not brands.
Merge fields: `{first_name}`, `{tail}`, `{model}`, `{next_item}`, `{next_due}`.
Every email that mentions due dates carries the short disclaimer: *TailBook organizes dates you provide; your A&P/IA and the pilot in command determine airworthiness.*

| # | Sequence | Trigger | Tool |
|---|---|---|---|
| 1a | Waitlist welcome | Waitlist signup (no Snapshot) | MailerLite/Kit automation |
| 1b | Snapshot request received | Tally submission | Tally → email notification / automation |
| 2 | Checker follow-up ×3 | Used the checker + left an email | Automation, days 0 / 3 / 8 |
| 3 | Deposit offer + 2 follow-ups | Snapshot delivered | Manual (from the SOP §8), days +1 / +4 / +10 |
| 4 | Deposit thank-you | Stripe payment | Stripe receipt + a manual personal email within 12h |
| 5 | Last call before decision | Dec 7, to every non-depositing Snapshot recipient | Manual batch |
| 6 | "We're not building it" refund | KILL decision | Manual, same day as the decision |
| 7 | Type-club partnership outreach | Week 2 | Manual, one per club |

---

## 1a. Waitlist welcome
> **Subject:** You're on the TailBook list (+ the cheat sheet)
>
> Hi {first_name},
>
> Thanks for joining. Here's the one-page **"24-month items owners forget"** cheat sheet: [PDF_LINK]
>
> Who I am: [Founder name]. I'm building TailBook, an iPhone/iPad app that shows in two seconds what's due on your airplane and when, with the regulation behind each date. I'm not an A&P; an IA reviews the rules. I'm talking to owners before writing code, so I'll email rarely and only when I have something useful.
>
> Want a head start? I'll build you a **free Airworthiness Snapshot** by hand from photos of your logbook entries, delivered within 48 hours: [SNAPSHOT_LINK]
>
> One question: **what do you use today to track what's due?** Just hit reply. I read every one.
>
> [Founder name], TailBook

## 1b. Snapshot request received (auto)
> **Subject:** Got it: your {tail} Snapshot is in the queue
>
> Hi {first_name}, thanks for sending your records. I'll have your Snapshot back within 48 hours. If anything's illegible, I'll send one short note asking for a re-shoot.
>
> Your photos are used only to prepare your Snapshot and are deleted within 90 days.
>
> While you wait: could I ask you 15 minutes of questions about how you track things today? [CALENDAR_LINK]. Totally optional.
>
> [Founder name]

---

## 2. Checker follow-up (3 emails)

**2.1 (Day 0, immediately): your results**
> **Subject:** {tail}: your due dates (saved)
>
> Hi {first_name},
>
> Here's what you entered in the checker, so you don't lose it:
> **Next due: {next_item} on {next_due}.**
> [Summary table from the checker, or a link to it]
>
> Two things owners often miss:
> 1. "Calendar months" end on the **last day** of the month. That's why your dates land on the 30th or 31st.
> 2. The transponder check (91.413) applies even if you only fly VFR.
>
> The checker only knows what you typed. If you'd like me to build a full Snapshot from your actual logbook entries, free, I'll do it by hand: [SNAPSHOT_LINK]
>
> [Founder name] · *TailBook organizes dates you provide; your A&P/IA and PIC determine airworthiness.*

**2.2 (Day 3): the story**
> **Subject:** The item that grounds airplanes isn't the annual
>
> Hi {first_name},
>
> Everyone remembers the annual. The items that slip come due so rarely you never build the habit: the 24-month transponder and pitot-static checks, the ELT battery date printed on a label in the tailcone, and the registration that now runs 7 years.
>
> Aviation insurance writers say flying out of inspection is among the most common reasons a claim gets denied, and that includes those "small" checks, not just the annual.
>
> If you haven't yet: [SNAPSHOT_LINK]. Send photos of the entries and I'll send back every date with its regulation, plus a calendar file with reminders.
>
> [Founder name]

**2.3 (Day 8): the ask**
> **Subject:** Quick question about {tail}
>
> Hi {first_name}, one question, and a one-line reply is perfect:
>
> **What's the last maintenance item that snuck up on you, and what did it cost?**
>
> I'm deciding what TailBook should do first, and real stories beat my guesses. (If the answer is "nothing ever has", that's useful too.)
>
> [Founder name]

---

## 3. Deposit offer (Day +1 after Snapshot delivery)
Use the email in `03-concierge-snapshot-sop.md` §8. Follow-ups:

**3.2 (Day +4)**
> **Subject:** Re: Keep {tail}'s board up to date automatically?
>
> Hi {first_name}, following up once. Founding Owner pricing is $149/yr for as long as your subscription stays active (vs $199) for the first 250 aircraft, held with a **fully refundable $49 deposit**: [STRIPE_LINK]
>
> If it's not for you, I'd be grateful for one line on why: price, "my shop handles it", "I'm fine with my spreadsheet", privacy, or something else? I'm deciding in mid-December whether to build this, and your answer counts.
>
> [Founder name]

**3.3 (Day +10)**
> **Subject:** Last note from me on this
>
> Hi {first_name}, I won't keep emailing. If you'd like the founding price, the link is here: [STRIPE_LINK]. Otherwise I hope the Snapshot helps at your next annual. Fly safe.
>
> [Founder name]

---

## 4. Deposit thank-you (personal, within 12h)
> **Subject:** Thank you, {first_name}. You're Founding Owner #{n}
>
> Hi {first_name},
>
> Thank you for putting money down on {tail}. That means more to me than you know at this stage.
>
> What you've got:
> - **$149/yr for life** (for as long as the subscription stays active) for {tail} (regular $199)
> - Your **$49 is credited toward year one** when TailBook ships (delivered through an App Store offer code), or **refunded any time before launch**: just reply "refund".
> - If we don't ship by **[2027-06-30]**, everyone is refunded automatically.
> - You'll get the TestFlight beta before anyone else.
>
> Could I have 20 minutes on a call to show you early screens and hear what would make this a must-have for you? [CALENDAR_LINK]
>
> [Founder name] · Deposit terms: [link]

## 5. Last call before the decision (Dec 7)
> **Subject:** I'm deciding on Dec 15 whether to build TailBook
>
> Hi {first_name}, an honest update: I'll decide on December 15 whether to build TailBook, based on whether owners like you put down a refundable deposit. If you want it to exist, this is the moment: [STRIPE_LINK] ($49, fully refundable, credited to year one at $149/yr for as long as your subscription stays active).
>
> If not, no hard feelings. Your Snapshot is yours to keep.
>
> [Founder name]

---

## 6. "We're not building it": refund email (send the same day as a KILL decision)
Refund in Stripe **before** sending: Payments → each deposit → Refund → full amount. Then send:

> **Subject:** Your $49 is on its way back: we're not building TailBook
>
> Hi {first_name},
>
> I promised I'd be straight with you. After two months of testing, not enough owners committed for me to build TailBook responsibly, so I'm not going to build it.
>
> **I've refunded your full $49 deposit today** (Stripe reference {refund_id}). It usually shows up within 5–10 business days, depending on your bank. You don't need to do anything.
>
> Thank you for believing in it early. Your Snapshot and calendar file are yours to keep. Please keep checking them against your logbooks with your IA.
>
> If I end up building something related [e.g. a logbook-vault tool], may I let you know? Reply "yes" and that's the only email you'll get.
>
> [Founder name]

*(Pivot variant: if the decision is PIVOT rather than KILL, use the same email but offer a choice: "refund, or move your deposit to [new offer]", and default to refund if there's no reply in 14 days.)*

---

## 7. Type-club partnership outreach

Find the right contact: executive director, membership director, or the magazine/newsletter editor (check each club's "About / Staff" page). Send in Week 2, after the article has had the IA review.

**Shared template**
> **Subject:** A free resource for {club} members: "The 24-month items owners forget"
>
> Hi {contact_name},
>
> I'm [Founder name], founder of TailBook, an owner-side app (in development) that keeps a live board of what's due on an aircraft (annual, 91.411, 91.413, ELT, registration, and recurring ADs the owner enters), each with the regulation behind it.
>
> Two offers for {club} members, no strings:
> 1. **A guest article for {newsletter/magazine}:** "The 24-month items owners forget" (~900 words, regulation-cited, reviewed by an A&P/IA). Draft attached; happy to tailor it for {type} owners and to your style guide.
> 2. **A member discount:** {club} members get Founding Owner pricing (**$149/yr for life** (for as long as the subscription stays active), vs $199), and [optionally: we'd be glad to discuss a revenue share or a sponsorship back to {club}].
>
> I'm not an A&P and I'm careful about it: TailBook organizes dates owners enter; their A&P/IA and PIC determine airworthiness.
>
> Would a 15-minute call be useful? I'd especially value your view on what {type} owners struggle with most.
>
> Thanks, [Founder name] · founder@[domain] · [phone]

**Per-club customizations**

| Club | Angle to add (one or two sentences) |
|---|---|
| **COPA** (Cirrus Owners & Pilots Assn, 7,000+ members) | "Your members are largely IFR, so the 91.411/91.413 pair matters more, and I'd like your guidance on presenting CAPS repack and rocket intervals correctly." Mention that you're a member and active on the forum. |
| **ABS** (American Bonanza Society) | "Bonanza and Baron owners juggle recurring ADs with whichever-first intervals. I'd value ABS's input on what the AD tracker must handle." Respectful and formal; ABS has a strong technical and safety culture. |
| **CPA** (Cessna Pilots Association) | "With the variety of 172/182/210 models and years, I'd welcome CPA's view on which recurring items owners most often miss." |
| **POS** (Piper Owner Society) | "Many Cherokee/Arrow/Archer owners are in partnerships and clubs, and TailBook shares one board across co-owners." Lead with the partnership angle. |
| **MAPA** (Mooney Aircraft Pilots Association) | "MooneySpace members already share spreadsheets for exactly this. I'd love to give MAPA members something better, free to try." Mention that you're a member. |

**Follow-up (7 days later, one only)**
> Hi {contact_name}, a quick follow-up on the article offer. Happy to send a version tailored to {type} owners, or a shorter 400-word sidebar if that fits better. Thanks either way.

---

## 8. General Aviation News / media pitch (bonus)
> **Subject:** Article submission: "The 24-month items owners forget"
>
> Hi [Editor], attached is a ~900-word, regulation-cited article for owners on the long-interval inspection items (91.411, 91.413, 91.207, 47.40) and the calendar-month math behind them. It's reviewed by an A&P/IA. Disclosure: I'm building an owner app in this space, and I've kept the piece non-promotional, with a one-line bio. Happy to adjust it to your guidelines.
>
> [Founder name]
