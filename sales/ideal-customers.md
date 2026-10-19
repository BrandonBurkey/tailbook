# Ideal Customers: Leveraged Partner Channels

**Owner of this file:** sales lead. **Inputs:** research §4.1 and §5, `validation/04-emails.md` §7, `06-decision-rules.md`, `07-legal-and-appstore.md`.
**Target list:** `targets.csv` (60 real organizations, role titles and public contact paths only, with notes on what still needs checking).

Owners are the direct buyer. This file covers the **one-to-many** channels, where one "yes" puts TailBook in front of dozens or thousands of aircraft. The Hormozi logic is simple: don't sell one aircraft at a time when you can sell to the person who already has the owners' trust and attention.

## Ground rules for every partner deal

These hold in every segment. They come from `07-legal-and-appstore.md` and the decision rules.

1. **TailBook organizes dates owners enter. The owner's A&P/IA and the pilot in command determine airworthiness.** We never say a partner's members will be "airworthy", "legal" or "compliant". Every piece of partner material carries the short-form disclaimer.
2. **The prices are fixed.** Regular is **$199/yr per aircraft** (or $24.99/mo), with unlimited co-owners and a 14-day free trial. **Founding Owner is $149/yr** for as long as the subscription stays active. It is reserved with a **$49 refundable deposit**, credited to year one through an App Store offer code. It is capped at the **first 250 aircraft**. Anyone not served by launch on **2027-06-30** is refunded automatically. Partners don't get prices outside the structures in `pricing-and-offers.md`.
3. **Before launch, partners can only get a web deposit link** (Stripe, outside the app) plus content. **After launch, everything goes through Apple:** offer codes, In-App Purchase and Apple refunds. The app never mentions the web deposit (guideline 3.1.1).
4. **We don't put a club name or logo in the app or our metadata without a written partnership** (guideline 5.2). Type templates use text-only nominative wording, for example "for Bonanza owners".
5. **We never sell App Store offer codes.** Codes are promotions that we issue. Partners earn a revenue share or a referral credit, paid by us from App Store proceeds. We do not resell Apple codes.
6. **Partner deposits count as money, not compliments** (decision rules §5). The tracker logs each one with `source=partner:<org>`. The E2 deposit rate still uses only Snapshot-sourced deposits. A partner agreement is a **strong tiebreaker** under §2 of the decision rules.

## Leverage ranking

Scores run 1–5, and higher is better. **Leverage = aircraft reached per "yes" × trust transferred ÷ time and effort to close.**

| Rank | Segment | Aircraft per "yes" | Trust transfer | Speed to close | Fit with v1 | Leverage notes |
|---|---|---|---|---|---|---|
| **1** | **Type clubs** (COPA, ABS, CPA, POS, MAPA + smaller clubs) | 1,000–7,000 members each | 5 | 3 (boards and editors, 2–8 weeks) | 5 | One article plus a member code reaches the exact avatar |
| **2** | **Independent A&P/IA and avionics shops** | 50–300 customer aircraft per shop per year **(estimate)** | 5 (the shop is the person the owner trusts on this exact topic) | 4 (the owner/IA decides alone) | 4 | Repeats every annual season. Turns the "my A&P tracks it" objection into a referral |
| **3** | **Flying clubs and partnerships** | 3–80 aircraft per club; partnerships 1 aircraft, 2–5 people | 4 | 3 (board vote) | 5 (per-aircraft pricing, unlimited co-owners) | They are buyers, not just distributors. This is pivot A in the decision rules |
| **4** | **Aviation insurance brokers and insurers** | Hundreds to thousands of owner policies | 4 | 2 (compliance review, slow) | 3 | Renewal is a yearly records moment. Anti-rebating rules add friction |
| **5** | **Aircraft brokers and dealers** (pre-buy and sale records) | 10–300 transactions per year | 3 | 4 | 3 (the vault and Status Report matter more than the board) | Each sale creates a brand-new owner in their first-90-days habit window |
| **6** | **Flight schools** (the 100-hour angle) | 5–80 aircraft | 3 | 2 | 2 (schools often run Flight Schedule Pro or in-house maintenance) | Best route is **leaseback owners** at schools and club-schools, not the school's ops |

Put **60% of partner time** into ranks 1–3, **25%** into rank 4–5, and **15%** into rank 6 and the networks behind it (AOPA Flying Club Network, FSAI, AEA).

---

## 1. Type clubs: COPA, ABS, CPA, Piper Owner Society, MAPA (+ ICS, MMOPA, gOPA, Cardinal Flyers, and others)

**Their pain**
- Clubs live on member value. Each one needs a fresh, concrete benefit every year to justify dues of roughly $50–$95.
- Magazines need technical content that isn't just another engine article.
- Safety and technical committees answer the same "when is X due?" questions over and over. Owners argue about calendar-month math on forums, the very rule TailBook owns.
- They can't endorse a product that might embarrass them, so the risk to their reputation is high.

**What they get**
- A free, IA-reviewed guest article, "The 24-month items owners forget" (`validation/05-guest-article.md`), tailored to the type. It comes with a type-specific checklist sidebar: COPA gets CAPS repack and rocket intervals, ABS gets whichever-first recurring ADs.
- A member benefit they can announce: **Founding Owner pricing ($149/yr vs $199) for members**, while the 250 founding seats last. After that, members get a first-year discount through an Apple custom offer code.
- An optional **revenue share** paid to the club or its safety foundation.
- A seat at the table on the type template. Their technical people review it, which makes it more credible and protects their name.
- An honest, documented disclaimer posture, so the club never appears to vouch for airworthiness.

**Deal structure** (details in `pricing-and-offers.md` §2)

| Phase | What the member gets | What the club gets |
|---|---|---|
| Pre-launch (now → launch) | Founding Owner deposit link with `?src=<club>` UTM. $49 refundable, then $149/yr | Article, plus **$10 per member deposit that converts to a paid year**, paid after conversion (nothing on refunded deposits) |
| Post-launch | Apple **custom offer code** (for example `COPA27`), year one at $149, renewing at $199. Founding depositors keep $149 | **15% of net App Store proceeds** from code redemptions in year one, 10% on renewals, paid quarterly from App Store Connect redemption data |
| Option for big clubs (COPA, ABS) | The same, plus a member-exclusive "type template pack" | A sponsorship instead of a share: $1–2k a year in magazine or event sponsorship, for clubs that prefer a flat fee |

**Finding the decision maker**
- The roles are the executive director (or president or board chair for volunteer clubs), the membership or member-benefits lead, and the magazine or newsletter editor. Go through the club's "About/Staff" page or its public contact form. No guessing email formats.
- Join first where it's cheap and expected (COPA $95, plus the MAPA or MooneySpace community), then write as a member.
- **The editor is the side door.** Editors say yes to good content faster than boards say yes to discounts, and an article that runs is proof for the board.
- **MAPA warning:** its status is unclear. Forum posts from 2023–2025 say it changed hands or now operates as the MAPA Safety Foundation (see `targets.csv` T05). Confirm it's active before paying dues, and use MooneySpace (T06) as the Mooney fallback.

---

## 2. Independent A&P/IA shops (and avionics shops)

**Their pain**
- Owners arrive at the annual with no squawk list, no AD history in one place, and logbooks in a grocery bag. That means unbillable digging time and awkward surprise quotes.
- The shop gets blamed when a 24-month item lapses, even though tracking it is the **owner's** responsibility under 91.403.
- Avionics shops lose 91.411/91.413 work to whichever shop the owner happens to remember.
- The shop wants customers who come back.

**What they get**
- Customers who arrive with an **"Annual Work Order" PDF** (squawks plus due items) and an **"Aircraft Status Report"** that the IA can check against the logbooks. That means faster quotes and fewer surprises.
- **Reminders that bring work back:** 60/30/7-day alerts on transponder, pitot-static and ELT items. The shop's name can sit in the owner's notes as "my shop".
- Read-only access to a customer's shared board through CloudKit sharing, when the customer invites them. This needs no account and no TailBook server.
- **A referral credit** for each paid aircraft (see `pricing-and-offers.md` §4), plus counter cards.
- **Framing to use:** TailBook makes the owner a better customer. It never replaces the IA's judgment, and the disclaimer says so.

**Deal structure**
- **Counter-card program** (research §4.1 GTM): "Bring your TailBook Status Report to your annual and we'll quote faster."
- Each shop gets its own **custom offer code** (for example `RPMSHOP`), worth a 30-day extended trial, or $149 for year one after the founding seats are gone.
- **Referral credit:** **$25 per paid aircraft** in year one, paid quarterly, or donated to a cause the shop names. **Pilot ask:** 20 shops, pass = 3 or more agree to pilot (decision rules §3, pivot A variant).
- Avionics shops get the same deal, framed as "owners book their 24-month check with you".

**Finding the decision maker**
- For a small shop, the **owner, who is usually also the IA**. For a larger one, the **director of maintenance** or the service manager or writer.
- Start with the shops behind owners' Snapshots. Every Snapshot names the shop in the last annual entry, which makes for the warmest possible intro: "your customer N123 asked me to send this."
- Then work from the OEM service-center locators and the AEA member directory (T41), and call the front desk. Shops answer phones; they don't answer cold email.

---

## 3. Flying clubs and partnerships

**Their pain**
- **"My partners never log tach time"** (research §4.1).
- One maintenance officer, usually a volunteer, keeps the whole fleet's due dates in a spreadsheet only they understand. When they quit or burn out, the knowledge leaves with them.
- Disputes about who pays for what, and with many members a single lapsed item grounds the aircraft for everyone.
- Insurance exposure: a lapsed annual can void coverage even for a co-owner who didn't know (research §2.1, the NM Supreme Court case).
- **The 100-hour trap.** If the club provides **both the aircraft and the instructor**, 91.409(b) 100-hour inspections apply, per FAA interpretations. Many clubs don't know which side of the line they're on.

**What they get**
- **One shared board per aircraft that every member can see**, with per-member tach logging from a widget or Siri Shortcut, and a utilization-by-member export for cost splits.
- The maintenance officer's knowledge moves out of their head and into a shared system.
- **Pricing that matches how clubs think:** per aircraft, not per pilot. A 6-aircraft, 150-member club pays for 6, at about $1,194/yr regular or **$894/yr founding**. That's **under $8 per member per year**.
- The Partnership Pack bonus: tach-logging norms and a cost-split export.

**Deal structure** (see `pricing-and-offers.md` §3)
- The club's treasurer or maintenance officer buys one subscription per aircraft on the club's Apple ID and shares each board with members. Members pay nothing and don't need TailBook accounts.
- **Founding Club Plan (pre-launch):** $49 refundable deposit per aircraft, then $149/aircraft/yr. A club deposit for 4 or more aircraft adds a free 30-minute fleet setup call.
- **Post-launch:** clubs with 3 or more aircraft get year one at $149/aircraft through a one-time offer code per aircraft. Renewals are $199. No per-member fees, ever.
- **Honest caveat:** CloudKit shares have a participant limit. Assume roughly 100 people per share and verify in Apple's docs before promising. Large clubs (more than 100 members) should share the editable board with officers and give members the exported Status PDF. Say this up front.

**Finding the decision maker**
- The **maintenance officer** feels the pain, and the **board or treasurer** signs. Pitch the maintenance officer and hand them a one-page board memo.
- Where to find clubs: AOPA Flying Club Network and its Club Spotlight archive (T16), EAA flying clubs (T17), FBO bulletin boards, and club websites' "officers" pages (roles only).
- Partnerships show up in Snapshots and on forums ("my partner and I…"). The co-owner invite does the selling.

---

## 4. Aviation insurance brokers (and direct insurers)

**Their pain**
- Claim denials for lapsed inspections are among the most common coverage disputes (research §2.1). When the claim is denied, the broker loses a client and takes the blame.
- Renewal paperwork means chasing owners for hours, inspection dates and pilot details.
- Brokers compete on service, because they often quote similar underwriters (POA anecdote).
- They want content that makes them look like advisors.

**What they get**
- **"Insurance Renewal Snapshot"** (bonus #4): a one-page summary the owner can send at renewal. That means less chasing.
- An owner-education asset to co-brand: "Inspection lapses and your policy: the items that slip".
- A client retention gift (see the compliance note below).
- A reason to call every client 60 days before renewal: "Here's a free tool so your coverage isn't put at risk by a missed 24-month item."

**Deal structure**
- **Content partnership first:** a co-authored article or guide on the broker's blog. BWI (T53) publishes large volumes of owner guides.
- **A broker custom offer code:** an extended trial, or year one at $149, for the broker's clients. The **broker earns nothing per sale** by default, to keep the compliance picture simple.
- **Optional referral fee only after the broker's compliance team approves it.** It's 10% of net year-one proceeds and is paid to the agency, not to individual producers.
- **Compliance flag (lawyer question):** state **anti-rebating and inducement** rules limit what a licensed insurance producer can give clients. Many states now allow "value-added services" related to loss mitigation, but this varies by state. The broker's compliance team decides whether a free or discounted subscription can be offered to clients. **We never imply a premium discount**, and never imply that the insurer accepts TailBook as proof of inspections.
- **Direct insurers (Avemco, T52):** Avemco already rewards owners' safety behaviour (Safety Rewards, with premium credits of up to 25% per its site). The ask is placement in their owner content or PIREP blog. A premium credit is out of scope; don't ask for one.

**Finding the decision maker**
- For a broker, the **agency principal** or marketing lead. For an insurer, the **safety or loss-control program manager** and marketing.
- Find them through press releases (Sutton James and Optisure, Travers acquisitions), conference exhibitor lists (Sun 'n Fun, AOPA events) and website contact forms.

---

## 5. Aircraft brokers and dealers (pre-buy and sale records)

**Their pain**
- Deals die or get re-traded at pre-buy over missing or messy records. Value hits are put at 10–50% (Bluetail) and 40–60% (VREF), both vendor estimates. Present them as ranges, not facts.
- Sellers can't answer "when was the transponder check?" without digging through boxes.
- Buyers want the AD status at a glance.
- After closing, the broker has nothing to keep the relationship going.

**What they get**
- **For listings:** the seller's **"Aircraft Status Report"** PDF (due items, recurring ADs entered, squawks, with links to scanned logbook pages). It makes the listing answer the first ten buyer questions. Keep it honest: it summarizes the owner's records and is **not** a substitute for the logbooks or the pre-buy inspection.
- The **Pre-Buy & Sale Records Checklist** (bonus #1), co-brandable for the broker's sellers.
- **A closing gift for buyers:** "Your first 3 months of TailBook are on us." The broker hands the buyer a one-time Apple offer code (a free 3-month introductory period that we fund). The new owner's board starts on day 1 of ownership, which is the strongest habit window.

**Deal structure**
- **Seller-side:** a custom offer code with a 60-day extended trial (most sales close within that window), plus a 50% revenue share to the broker on any seller or buyer who converts in year one. Cap it so the broker's cut never exceeds $50 per aircraft.
- **Buyer-side closing gift:** the broker gets a batch of one-time free-3-month codes (Apple minimum batch sizes apply; generate per broker and track by offer name). The broker pays nothing and earns the same revenue share if the buyer converts. **We never charge a broker per code.** That would be reselling Apple codes, which we don't do (ground rule 5).
- **Marketplaces** (Trade-A-Plane, Controller, GlobalAir): these are paid-ad channels, not partners. Test one ad buy after launch only.

**Finding the decision maker**
- The **principal broker** at small firms. The **head of pre-owned sales** or the marketing lead at firms like Aerista, Lone Mountain, Carolina Aircraft and Premier.
- Find them through listings on Controller and GlobalAir (dealer names), COPA and ABS forum recommendations, and website contact pages.

---

## 6. Flight schools (the 100-hour angle)

**Their pain**
- Aircraft used to give flight instruction for hire need **100-hour inspections** (91.409(b)) on top of the annual. Part 141 aircraft are maintained "as operated for hire".
- The 10-hour overrun is only for flying to the place where the inspection will be done. It is not slack.
- High-utilization aircraft hit hour-based items fast.
- **Leaseback owners** (private owners who lease their aircraft to schools) have no visibility into what the school is doing with their plane and their hours.

**What they get**
- **The utilization forecast:** "100-hr due in about 9 days at this pace". The hour-based engine with whichever-first logic covers the 100-hour, oil and recurring ADs.
- **For leaseback owners**, a shared board with the school so the owner can see what's coming due. This is the genuinely new value. Schools usually already have fleet software, such as Flight Schedule Pro's maintenance hub.
- Honest limits: v1 is an **owner app**, not dispatch or fleet software (both are out of scope per research §4.1). Don't oversell to a 40-aircraft Part 141 operation.

**Deal structure**
- **Small Part 61 schools and club-schools** (Stanford Flying Club, West Valley, Wings of Carolina): use the flying-club pricing, per aircraft.
- **Schools with leasebacks:** the school recommends TailBook to its leaseback owners through a custom offer code (an extended 30-day trial). The school earns the shop-style **$25 referral credit per paid aircraft**.
- **Networks:** FSAI (T32) owner-education content, and an exhibitor slot at the **2027 operators conference (Feb 9–11, New Orleans)** if the build is go. AOPA's flight-school business resources.

**Finding the decision maker**
- For a small school, the **owner or chief flight instructor**. For a larger one, the **director of maintenance**. For leaseback owners, the school's **leaseback or aircraft-owner liaison**.
- Find them through FSAI, AOPA flight-school directories and Flight Schedule Pro customer stories.

---

## Where to start this week

1. **Week of Oct 19:** finish verifying `targets.csv` (the rows marked "verify"). Join COPA. Confirm whether MAPA is active.
2. **Week 2 (Oct 26):** type-club outreach goes out, per `04-emails.md` §7 and `pitch-scripts.md` §1.
3. **From the first Snapshot onward:** each Snapshot names a shop and sometimes a partnership. Feed those straight into the shop and flying-club sequences, since they are the warmest leads we will ever have.
4. **Nov 15 checkpoint:** if E1 lands in the MIDDLE band, the decision rules already call for "type-club newsletters, the guest article … and 3 local shops". This file is that plan.
