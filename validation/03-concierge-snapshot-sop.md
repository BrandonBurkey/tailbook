# SOP: Free "Airworthiness Snapshot" (delivered within 48h)

**What it is:** a one-page, FAR-cited summary of when an owner's recurring items come due, built by hand from documents they send, plus an .ics calendar file. **What it is not:** an inspection, an airworthiness determination, or an AD applicability review.
**Why we do it:** it tests demand (E1), data-entry pain, the aha moment (E3 proxy) and willingness to pay (E2, the deposit offer).
**Time per Snapshot:** target 45 min at first, falling to 25 min. Capacity: **max 8 per day.** Past that, switch the form to "waitlist: next slot in N days".

---

## 0. The mandatory disclaimer (it goes on the form, the PDF and every delivery email, word for word)

> **This Snapshot is an informational summary of dates and times you provided. It is not an inspection, an airworthiness determination, or legal advice, and it does not determine whether any Airworthiness Directive applies to your aircraft. Your A&P/IA and the pilot in command are solely responsible for determining airworthiness (14 CFR 91.7, 91.403). Always verify against your aircraft's maintenance records before flight. TailBook may have made errors transcribing or calculating from your documents.**

---

## 1. Intake: what to request (Tally form fields)

**Required**
1. Name, email, phone (optional)
2. **Tail number** (N-number)
3. Make / model / year
4. Is it flown **IFR**? (Yes / No / Sometimes)
5. Used for **hire or flight instruction for hire** (rental, club leaseback, instructing)? (Yes / No / Not sure)
6. Current **tach** reading, current **Hobbs** reading, and which one the shop uses for maintenance
7. Roughly how many hours flown in the last 12 months
8. Uploads (photos are fine; ask for clear, flat, well-lit shots):
   - **Last annual inspection entry** (airframe logbook; the IA's signature page)
   - **Last transponder test entry** (§91.413), usually in the airframe or avionics log
   - **Last altimeter/static system test entry** (§91.411), if IFR
   - **ELT**: the last ELT inspection entry, **and a photo of the battery expiration label** on the ELT unit (often in the tailcone; skip it if they can't get to it easily)
   - **AD compliance list / AD status record** from their IA (if they have one)
   - Last 100-hour entry, if for hire
   - Last oil change entry (optional)
9. Checkbox: "I have read the disclaimer and understand this is not an airworthiness determination."
10. Checkbox: "TailBook may store my documents for up to 90 days to prepare this Snapshot, then delete them." (Privacy promise; keep it.)

**Optional:** "Anything you're unsure about?", "Do you have partners on this aircraft?", "How do you track this today?" (a free interview question)

**Do yourself (no owner input needed):** look up the registration at the **FAA Registry N-Number Inquiry** (registry.faa.gov → Aircraft Inquiry). It shows the registered owner, the **expiration date** and the airworthiness date. Screenshot it for the file.

---

## 2. Workflow and SLA

| Step | When | What |
|---|---|---|
| 1 | Within 2h of request (business hours) | Auto-reply goes out (`04-emails.md` §1b). Create a folder `Snapshots/N123AB_2026-10-27/`. Log the request in the tracker. |
| 2 | Within 12h | Review uploads. If something's missing or illegible, send **one** consolidated request: "Could you re-shoot the transponder entry? The date is cut off." Missing items become **UNKNOWN**; you can still deliver. |
| 3 | Within 36h | Enter the data in the Snapshot Calculator sheet (§3). Build the PDF (§5) and the .ics (§6). |
| 4 | Before sending | **Second-pass check** (§4). |
| 5 | Within 48h of a complete request | Send the delivery email (§7). Log it in the tracker (E1/E2 columns). |
| 6 | +24h after delivery | Send the Founding Owner offer email (§8). |
| 7 | +90 days | Delete uploads (keep only the PDF you sent and the sheet row). |

**First 10 Snapshots:** send each to the IA advisor for review **before** delivery (budget 24h extra; tell the owner "being double-checked by an IA"). That's both quality control and a selling point.

---

## 3. How to compute each item

**Calendar-month rule** (used by FAA guidance and the common reading of "calendar months"): the interval ends on the **last day of the month** in which it comes due. Done on Mar 3, 2026 with a 12-calendar-month interval → **due by Mar 31, 2027**.
In Google Sheets: `=EOMONTH(last_done_date, N)` where N = number of calendar months.

**Status rules**
- **RED / OVERDUE:** due date before today, or hours remaining ≤ 0
- **YELLOW / DUE SOON:** due within 60 days, or ≤ 10 hours remaining
- **GREEN / CURRENT:** otherwise
- **GREY / UNKNOWN:** no document provided or not legible. *Never guess a date.*
- **N/A:** the rule doesn't apply as the owner described the operation (e.g. 91.411 for VFR-only). Say why.

| Item | Rule | Applies when | Compute | Sheet formula | Notes for the PDF |
|---|---|---|---|---|---|
| **Annual inspection** | **14 CFR 91.409(a)**: an annual inspection within the preceding 12 calendar months | All standard-category aircraft, unless on a progressive or other approved inspection program (91.409(c)–(f)) | Last annual date + 12 calendar months, end of month | `=EOMONTH(A,12)` | If the entry lists discrepancies / "not approved for return to service", **flag it for the IA**; don't mark green. Experimental aircraft: a "condition inspection" per the operating limitations. Same 12-month math, but cite the op limits, not 91.409. Progressive programs: out of scope, mark "See your inspection program". |
| **100-hour inspection** | **91.409(b)**: within the preceding 100 hours of time in service, when carrying a person for hire (other than crew) or giving flight instruction for hire in an aircraft that person provides | Only if Q5 = Yes | Tach (or the shop's basis) at the last 100-hr **or** annual + 100 | `=last_tach+100` · remaining `=due-current` | The 10-hour allowance applies **only** for flying to a place where the inspection can be done, and the excess counts toward the next 100 hours. Don't add 10 hours to the due figure. |
| **Altimeter / static system / altitude reporting** | **91.411**: tested within the preceding 24 calendar months (Part 43 App. E, and App. F for altitude reporting) to fly **IFR in controlled airspace** | Q4 = IFR / Sometimes | Last test date + 24 calendar months | `=EOMONTH(A,24)` | VFR-only: mark **N/A: "Not required for VFR; required before any IFR in controlled airspace."** Also required after the static system is opened and closed (except drain and alternate static valves). Note it if a later logbook entry shows static-system work. |
| **Transponder** | **91.413**: tested and inspected within the preceding 24 calendar months (Part 43 App. F) to use the transponder | Any aircraft with a transponder, **VFR or IFR** | Last test + 24 calendar months | `=EOMONTH(A,24)` | Also required after installation or maintenance that could introduce data-correspondence error (App. E(c)). ADS-B Out has no separate FAR periodic test. Don't invent one; say "ask your avionics shop". |
| **ELT inspection** | **91.207(d)**: inspected within 12 calendar months after the last inspection | Most aircraft; see the exceptions in 91.207(f), such as aircraft equipped to carry only one person, and training within 50 nm of the departure airport | Last ELT inspection + 12 calendar months | `=EOMONTH(A,12)` | Often done at the annual, but it is a separate requirement, so check for a separate entry. |
| **ELT battery** | **91.207(c)**: replace (or recharge if rechargeable) after **1 cumulative hour** of use, or when **50% of useful life** (or useful life of charge) has expired. The new expiration date must be **marked on the outside of the transmitter** and entered in the maintenance record | As above | **Use the date marked on the unit/record as is.** Don't recompute 50% yourself | (enter date) | If there's no label photo: UNKNOWN, "Ask your shop to read the label at the next opportunity." If the ELT was activated for an extended time, note "1 cumulative hour rule: ask your IA." |
| **VOR check** | **91.171**: operationally checked within the preceding 30 days, within ±4° (ground checks/VOT) or ±6° (airborne), logged with date, place, bearing error and signature | Only if VOR is used under IFR | Last check date + 30 days | `=A+30` | It's a **pilot** item, usually not in the maintenance logs. Usually mark as "Pilot item: check within 30 days before IFR use of VOR". Never red unless the owner gave a date. |
| **Registration** | **14 CFR 47.40**: a Certificate of Aircraft Registration expires **7 years** after the last day of the month issued (since Jan 23, 2023). Renew during the **6 months before** expiry (Form 8050-1B) | All | Read the expiration date from the FAA Registry inquiry | (enter date) · window opens `=EDATE(exp,-6)` | Yellow if the renewal window is open (inside 6 months). Remind them the certificate must be on board (91.203). |
| **Recurring ADs** | **91.403(a)**: the owner/operator is primarily responsible for maintaining the aircraft in an airworthy condition, including compliance with ADs (Part 39). **91.417(a)(2)(v)**: the record of current AD status | Only ADs **listed on the owner's AD compliance record** | For each recurring AD: next due = last compliance + interval, by hours, by calendar, or whichever comes first (the earlier of the two) | date: `=EDATE(A,months)` (or `EOMONTH` if the AD says "calendar months") · hours: `=last_tach+hrs` | **Transcribe exactly as the record states.** Never decide whether an AD applies, never add ADs from your own search, and never interpret the method of compliance. Footnote: "AD list transcribed from the record you provided; applicability is determined by your IA." |
| **Oil change** (owner item) | Not a FAR item; manufacturer/shop recommendation | If provided | Last change + owner's interval (e.g. 50 hrs / 4 months, whichever first) | as above | Label it "Owner item (not regulatory)". |

**Hour-based forecast:** average hours per day = hours in the last 12 months ÷ 365. Projected date = today + (hours remaining ÷ average per day). Print it as "≈ 3 weeks at your pace", never as an exact date.

**What you never do:** fill in a missing date with a guess; compute an ELT battery date; mark a lapsed item "OK because there's a grace period"; or tell the owner the aircraft is or isn't airworthy.

---

## 4. Second-pass checklist (2 minutes, every Snapshot)
- [ ] The tail number on the PDF matches the FAA registry
- [ ] Every date matches the photo (re-read the photo, not your sheet)
- [ ] Every calendar-month item uses EOMONTH (end of month)
- [ ] IFR / for-hire answers drive the N/A items correctly
- [ ] Every UNKNOWN has a "what to send / ask" note
- [ ] AD section: transcribed only, with the footnote present
- [ ] The disclaimer is on the PDF
- [ ] The .ics opens and its dates match the PDF

---

## 5. PDF template content (Google Docs → File → Download PDF)

```
TAILBOOK AIRWORTHINESS SNAPSHOT          Prepared: [date]  ·  Snapshot #[nn]
N[123AB] · [Year Make Model] · [IFR / VFR-only] · [Private / For hire]
Tach [1234.5] · Hobbs [1456.7] · Avg [8.2] hrs/month (owner-reported)

SUMMARY:  [2] due soon · [0] overdue · [1] unknown · Next due: [Transponder] in [34] days

ITEM                     LAST DONE     DUE BY          STATUS      RULE
Annual inspection        2026-03-03    2027-03-31      CURRENT     14 CFR 91.409(a)
Transponder test         2024-11-12    2026-11-30      DUE SOON    14 CFR 91.413
Altimeter/static test    2024-11-12    2026-11-30      DUE SOON    14 CFR 91.411 (IFR)
ELT inspection           2026-03-03    2027-03-31      CURRENT     14 CFR 91.207(d)
ELT battery              —             2028-06 (label) CURRENT     14 CFR 91.207(c)
Registration             issued 2023   2030-07-31      CURRENT     14 CFR 47.40 (renew from 2030-01)
VOR check (pilot item)   —             —               PILOT ITEM  14 CFR 91.171 (30 days, IFR)
AD 20XX-XX-XX (recurring 100 hr / 12 mo, whichever first)
                         tach 1180.2   tach 1280.2 or 2027-03-31  CURRENT  per your AD record
Oil change (owner item)  tach 1210.0   tach 1260.0 (≈ 3 wks)      CURRENT  Mfr/shop interval

WHAT TO DO NEXT
1. Transponder + pitot-static both expire 2026-11-30. Most avionics shops do both in one visit.
2. ELT battery label not provided: ask your shop to read it at the next visit.
3. Bring this page to your IA at the annual.

NOTES / ASSUMPTIONS
• "Calendar months" end on the last day of the due month.
• AD list transcribed from the record you provided; applicability is determined by your IA.
• Hour forecasts use your reported utilization.

[MANDATORY DISCLAIMER, verbatim from §0]
Questions or corrections: founder@[domain]   ·   Built by hand by [Founder name], TailBook
```

Use colored status cells (red/yellow/green/grey). One page; use a second page only for many ADs.

---

## 6. The .ics calendar file
Create one event per item with a known date: an all-day event on the due date, plus reminders 60, 30 and 7 days before. The fastest no-code route: create the events in a dedicated Google Calendar called "N123AB due items", then export it (Settings → Import & export → Export) and attach the .ics. Or paste this template into a text file saved as `N123AB.ics`:

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TailBook//Snapshot//EN
BEGIN:VEVENT
UID:n123ab-transponder-20261130@tailbook
DTSTAMP:20261027T120000Z
DTSTART;VALUE=DATE:20261130
SUMMARY:N123AB Transponder test due (14 CFR 91.413)
DESCRIPTION:Informational only. Your A&P/IA and PIC determine airworthiness.
BEGIN:VALARM
TRIGGER:-P60D
ACTION:DISPLAY
DESCRIPTION:Transponder test due in 60 days
END:VALARM
BEGIN:VALARM
TRIGGER:-P30D
ACTION:DISPLAY
DESCRIPTION:Transponder test due in 30 days
END:VALARM
BEGIN:VALARM
TRIGGER:-P7D
ACTION:DISPLAY
DESCRIPTION:Transponder test due in 7 days
END:VALARM
END:VEVENT
END:VCALENDAR
```
(Repeat each `BEGIN:VEVENT … END:VEVENT` block per item, with a unique UID.)

---

## 7. Delivery email

> **Subject:** Your N123AB Airworthiness Snapshot (2 items due soon)
>
> Hi [Name],
>
> Your Snapshot is attached, along with a calendar file that adds each due date with reminders 60, 30 and 7 days before.
>
> **The headline:** [Your transponder and pitot-static checks both expire Nov 30, 2026. Most avionics shops do both in one visit.] [Your ELT battery date was the one item I couldn't read, so ask your shop to check the label next time.]
>
> Each date is calculated from the entries you sent, with the regulation it comes from. Please check it against your logbooks and **take it to your IA**. They and you, as PIC, make the airworthiness call, not me. (Full disclaimer at the bottom of the PDF.)
>
> Two quick questions that help me a lot:
> 1. Was anything on there a surprise? (Even "no, I knew all of it" is useful.)
> 2. How long would it have taken you to put this together yourself?
>
> Thanks for trusting me with your records. I'll delete the photos within 90 days.
>
> [Founder name] · TailBook · founder@[domain]

Log the answer to Q1 in the tracker under **E3-proxy** (surprise yes/no).

---

## 8. Founding Owner deposit offer email (24h after delivery)

> **Subject:** Keep N123AB's board up to date automatically?
>
> Hi [Name],
>
> Yesterday's Snapshot was a snapshot. It's correct today and starts going stale the next time you fly. I'm building **TailBook**, an iPhone/iPad app that keeps this board live: log tach in one tap after a flight, get warned at 60/30/7 days, keep your logbook scans searchable and backed up, and share the board with co-owners.
>
> **The Founding Owner offer** (first 250 aircraft):
> - **$149/yr for life** (regular price $199/yr per aircraft)
> - Reserve your spot with a **$49 refundable deposit**: [STRIPE_LINK]
> - The $49 is **credited toward your first year** when the app ships, or you can get it back any time before then, no questions asked. If we don't ship by **[2027-06-30]**, we refund everyone automatically.
>
> For comparison: managed tracking services run about $750–$1,100 a year, and an annual alone is $2,500+.
>
> Not for you? Just reply and tell me why. That honestly helps as much as a deposit.
>
> [Founder name] · TailBook
>
> *Deposit terms: [link]. TailBook organizes dates you enter; your A&P/IA and PIC determine airworthiness.*

Follow-ups: `04-emails.md` §3–4.

---

## 9. Recruiting a paid IA advisor ($1,000–$2,000)

**Why:** you have no aviation background. One credentialed reviewer lets you (a) avoid embarrassing errors in public posts, (b) say "reviewed by an IA" truthfully, and (c) validate the v1 interval engine and type templates later.

**Scope of work** (offer it as a flat fee: **$1,500 for ~10–12 hours over 6 weeks**, half up front, half on completion)
1. Review the rules table in §3 and the Snapshot Calculator logic (2h)
2. Review the cheat sheet and the guest article (`05-guest-article.md`) for accuracy (1.5h)
3. Review the first 10 Snapshots before delivery (3–4h)
4. Two 1-hour calls: "what owners get wrong" and "what IAs wish owners brought to the annual"
5. Optional: permission to credit them by name ("Reviewed by [Name], A&P/IA"). Get this in writing.
6. Later, a separate contract: the v1 interval engine plus 5 type templates (Cirrus, Bonanza, Mooney, 182, Cherokee)

**Contract basics** (lawyer to review): independent contractor; advisory on general rule logic and content, **not** an inspection of any aircraft and not a determination for any owner; confidentiality; no liability to owners assumed; IP in the reviewed materials belongs to TailBook LLC.

**Where to find one**
1. **Your local airport.** Walk into the independent maintenance shops and ask: "Is there an IA here who'd do some paid advisory work?" The best source; also future shop-channel partners.
2. **Forums.** POA, BeechTalk and MooneySpace have IAs who post on maintenance threads. DM the ones whose answers are clear and patient.
3. **Type clubs.** Clubs list technical advisors or maintenance-focused members. Ask the club when you send the partnership outreach.
4. **PAMA** (Professional Aviation Maintenance Association) local chapters, and **EAA chapters** (some members are A&P/IAs, plus EAA Technical Counselors).
5. **The FAA's annual IA renewal / FAASTeam seminars** (faasafety.gov events). IAs attend these. Polite outreach to a speaker works.
6. **Retired or semi-retired IAs** have time and like teaching. Ask shops and EAA chapters for names.
7. **Avoid:** anyone affiliated with a direct competitor (SavvyMx, Bluetail, etc.), and anyone who wants equity instead of cash at this stage.

**Outreach message**
> Subject: Paid advisory work for an IA, about 10 hours, $1,500
>
> Hi [Name],
>
> I'm [Name], founder of TailBook. I'm building an app that helps Part 91 owners keep track of when their inspections come due (annual, 91.411, 91.413, ELT, registration, recurring ADs they enter) so they show up to the annual organized. I'm not an A&P, which is exactly why I'm writing.
>
> I'm looking for an IA to review my rules logic and owner-facing materials for accuracy over the next six weeks: about 10–12 hours, **$1,500 flat**, half up front. It's advisory review only, not inspection of any aircraft or sign-offs. Details:
> - review a one-page rules table and a spreadsheet calculator
> - review a short article and a one-page cheat sheet
> - check my first 10 owner status summaries before I send them
> - two 1-hour calls about what owners commonly get wrong
>
> I saw your [post on X / shop at Y] and liked how clearly you explain things. Would you be open to a 15-minute call this week?
>
> Thanks, [Name] · [phone] · founder@[domain]
