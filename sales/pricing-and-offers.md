# Pricing & Partner Offers

**Fixed inputs. Don't change them without a decision-rules update.**
- **Regular:** $199/yr per aircraft, or $24.99/mo. 14-day free trial. Unlimited co-owners through iCloud sharing.
- **Founding Owner:** $149/yr per aircraft, for as long as the subscription stays active. `07-legal` §3 recommends this wording in place of "for life". Note that `04-emails.md` still says "for life", so the lead should align it once the lawyer weighs in. It's limited to the **first 250 aircraft** and reserved with a **$49 refundable deposit** (Stripe, on the web, before launch). The $49 is credited toward year one through an App Store offer code, or refunded on request. Everyone is refunded automatically if TailBook isn't on the App Store by **2027-06-30**, or if we decide not to build it.
- **After launch,** everything inside the app is sold through Apple In-App Purchase (guideline 3.1.1). Partner pricing is delivered **only through Apple offer codes**. The app never mentions or links to the web deposit.
- **Every partner asset** carries the short disclaimer: *TailBook organizes the dates you enter. Your A&P/IA and the pilot in command determine airworthiness.*

---

## 1. Unit economics (what we keep)

Assumes the App Store Small Business Program (15%). Stripe is 2.9% + 30¢.

| Price point | Gross | Net to us | 15% partner share | Net after share |
|---|---|---|---|---|
| Regular annual | $199.00 | $169.15 | $25.37 | $143.78 |
| Founding / partner year one | $149.00 | $126.65 | $19.00 | $107.65 |
| Monthly (12 months) | $299.88 | $254.90 | — | — |
| $49 deposit (Stripe) | $49.00 | $47.28 | — | Stripe keeps ~$1.72 on refund |

**Guardrails**
- Partner payouts never exceed **20% of net** on any aircraft.
- No single partner may take more than **40 of the 250 founding seats**, so one big club can't use up all the scarcity.
- E&O insurance (about $1k/yr, `07-legal` §7) works out to about 6 founding aircraft. Price it into every partner deal: never give away more than year one.

**Apple offer-code facts** (App Store Connect Help, checked 2026-10; re-verify before launch)
- Custom codes are reusable names such as `COPA27`, with an optional redemption cap and expiry.
- One-time codes are unique. They're generated in batches with a minimum and maximum batch size, and they expire within about 6 months.
- Each customer can redeem one code per offer.
- The limit is **10 active offers per subscription** and 1M redemptions per app per quarter.
- Codes can be free, pay-as-you-go, or pay-up-front.
- **10 active offers is the real constraint.** Rotate partner codes into shared offers. For example, all type clubs use one "Club year-one $149" offer, with a separate custom code per club so redemptions can still be attributed to each club.
- **We never sell offer codes.** Partners are paid by us from proceeds, and never pay us per code.

---

## 2. Type-club offer (COPA, ABS, CPA, POS, MAPA and others)

**Name:** "{Club} Member Founding Offer"

| Element | Pre-launch (now → launch) | Post-launch |
|---|---|---|
| Member price | Founding Owner: $49 refundable deposit, then **$149/yr for as long as the subscription is active** | Custom code `{CLUB}27`: **year one $149** (pay up front), renewing at $199. Members who were founding depositors keep $149 |
| Trial | — | 14-day free trial (standard) |
| Club benefit (they choose one, in writing) | (a) **$10 per member deposit that converts** to a paid year, paid after conversion; or (b) the article plus template review only, no money | (a) **15% of net** on year-one proceeds from the club's code, plus **10% of net** on that member's renewals for 2 years, paid quarterly; or (b) a flat sponsorship of $500–$2,000/yr (magazine or event), sized to membership |
| Content | Free IA-reviewed guest article, plus a type checklist sidebar | Article series (2/yr), and a webinar or fly-in seminar on the 24-month items |
| Template | The club's technical committee reviews the type template (credited in the template notes, text only, with written permission) | The same; template updates go to members first |
| Exclusivity | None either way | None |
| Paperwork | One-page partner letter: no use of the club's name or logo without approval, disclaimer language, payout terms, 30-day termination | The same |

**Proof the deal worked:** member deposits by `?src=` UTM before launch, then code redemptions after. The pass bar for a club deal is **10 or more member deposits within 30 days of publication**. Either way, a signed club agreement is a strong tiebreaker under decision rules §2.

**Bulk-code option for a club that wants to give members a perk.** We issue a batch of one-time **free 30-day extended-trial codes** (free to the club), which the club hands out at events. We don't sell bulk codes.

---

## 3. Flying-club and partnership pricing (per aircraft, many pilots)

**Principle:** **we charge per aircraft and never per pilot.** The subscription sits on the club's Apple ID (held by the treasurer or maintenance officer) and is shared with members through iCloud. Members pay nothing.

| Fleet size | Pre-launch (Founding Club Plan) | Post-launch |
|---|---|---|
| 1 aircraft (partnership, 2–5 owners) | $49 deposit, then $149/yr. "Under $50 per partner" for 3 partners | $199/yr. **Partnership Pack** bonus included |
| 2 aircraft | $49 deposit per aircraft, then $149/aircraft/yr | $199/aircraft/yr |
| **3–9 aircraft** | Same as above, plus a **free 30-minute fleet setup call** | One-time codes per aircraft: **year one $149**, renewing at $199 |
| **10+ aircraft** | Same as above, plus a free **fleet template build** (we key in the first board per aircraft from their records, Snapshot-style) | Year one $149 per aircraft, plus the fleet template build. Price at $179 renewal **only if** we have tested it (see §7) |

**Worked example** (show it to the board): a 6-aircraft, 150-member club.
- Regular price: 6 × $199 = **$1,194/yr**, or **$7.96 per member**.
- Founding price: 6 × $149 = **$894/yr**, or **$5.96 per member**.
- Compare one 100-hour or annual surprise caught early, or Flight Circle's ~$10/aircraft/month ($720/yr for 6 aircraft) for scheduling, which we complement rather than replace.

**Honest limits to say up front**
- CloudKit shares have a participant cap (assume about 100 per share and verify). Large clubs share the editable board with officers and give members the exported PDF.
- There is no dispatch or scheduling. TailBook complements Flight Circle and Flight Schedule Pro.

**Pivot-A test** (decision rules §3): contact 30 clubs and partnerships. Pass: **5 or more deposit**. Fail: fewer than 2.

---

## 4. Shop referral program (A&P/IA and avionics shops)

**Name:** "TailBook Shop Partner"

| Element | Terms |
|---|---|
| Cost to the shop | $0. No account, no software for the shop to buy |
| What the shop gets | 50 counter cards with the shop's custom code, plus a sample Annual Work Order and Status Report. Read-only iCloud share access when a customer invites the shop |
| Customer offer (code `{SHOP}`) | Pre-launch: Founding deposit link with `?src=shop-{slug}`. Post-launch: a **30-day free trial** (vs 14) through the shop's custom code. Once the founding seats are gone, use year one at $149 instead |
| **Referral credit** | **$25 per paid aircraft** in year one, paid quarterly from code redemption data. Or, at the shop's choice, donated to a local EAA chapter or scholarship |
| Kicker | A shop that reaches 10 paid aircraft in a year gets listed on our "Shops that like a good squawk list" page (with permission), plus a $100 bonus |
| Rules | No pressure on customers, and the shop never has to vouch for TailBook. The disclaimer is on every card. Either side can end it at any time |

**Pilot target:** 20 shops contacted, **3 or more agree** (decision rules §3, variant). Avionics shops pitch "we'll remind owners when their 91.411/91.413 is due".

---

## 5. Aircraft broker and dealer program

| Element | Terms |
|---|---|
| Seller code `{BROKER}SELL` | A 60-day free trial, so the seller organizes records and exports a Status Report for the listing |
| Buyer closing gift `{BROKER}BUY` | A one-time code with **the first 3 months free**, funded by us and handed out at closing |
| Broker benefit | **50% of net year-one proceeds** from either code, **capped at $50 per aircraft**, paid quarterly |
| Free asset | Pre-Buy & Sale Records Checklist (co-brandable PDF) |
| Must-say | "A summary of the owner's records. It doesn't replace the logbooks or the pre-buy inspection." |

If owners turn out to value the vault more than the board (pivot B), this program becomes the main channel for the **one-time $99 Logbook Vault & Sale Pack**. Brokers then get a 20% share of it.

---

## 6. Insurance broker and insurer program

- **Default: content only, $0 either way.** A co-bylined owner article, plus the **Insurance Renewal Snapshot** template the broker can ask clients for.
- **Optional client code** (extended 30-day trial) **only after the broker's compliance team clears it.** State anti-rebating and inducement rules vary.
- **Optional referral fee:** 10% of net year one, paid to the agency (never to individual producers), again only with compliance sign-off.
- **Never claim** premium credits or underwriting acceptance. For direct insurers like Avemco, the ask is placement in their owner content, not a discount.

---

## 7. Price tests (in order, never more than one variable at a time)

**Before launch (until 2026-12-15)**
- **No price tests.** The decision rules fix $149 founding, the $49 deposit and $199 regular.
- The only sanctioned change is in the **5–9.9% "iterate once"** branch: a Founding price of **$99/yr** for one 3-week cycle, if price was the top "no" reason.
- Partner channel deposits are tagged by source, so we learn which channel converts. That counts as **channel testing, not price testing**.

**After launch** (each test runs about 4 weeks or until 100 trial starts, whichever is later)

| # | Test | Variants | Metric | Decision rule |
|---|---|---|---|---|
| P1 | Paywall anchor | (A) anchors: SavvyMx ~$750, a $2,500+ annual; (B) no anchors | Trial → paid (E4, pass ≥30%) | Keep the winner if the gap is ≥5 points |
| P2 | Default plan | Annual pre-selected vs monthly visible side by side | Share of annual plans; refund requests | Keep annual default unless monthly lifts total paid by ≥20% |
| P3 | Partner year-one price | Clubs or shops split between a **$149** code and a **$169** code (split by partner, not by user) | Redemptions per 100 members; renewal at $199 | Use $169 if redemptions drop less than 15% |
| P4 | Fleet renewal | 10+ aircraft clubs: $199 vs $179/aircraft renewal | Club renewal rate | Use $179 only if renewal improves ≥10 points |
| P5 | Trial length via shop codes | 30-day vs 14-day | Trial → paid | Keep 30 only if conversion holds within 3 points |

**Mechanics:** Apple offers no native price A/B test. Run variants as different offer codes, different subscription products in the same group (shown by cohort or date), or sequential periods. Product Page Optimization tests screenshots and messaging only.

---

## 8. Annual vs monthly strategy

- **Annual is the default and the hero offer.** It's $199, about 34% below monthly ($24.99 × 12 = $299.88). Due items run on 12- and 24-month cycles, so annual matches the job, and annual buyers renew at higher rates **(estimate)**.
- **Monthly is a downsell only.** It's shown on the paywall as the secondary option, for skeptics and for owners who are selling soon.
- **Founding and all partner year-one prices are annual only.**
- **Win-back:** use App Store Connect win-back offers (no server needed) for lapsed annual subscribers, such as one month free. Check eligibility settings at launch.
- **Seasonality:** annuals cluster in winter, so run the partner pushes in November–January with "get your annual punch list ready".
- **Family Sharing:** decide deliberately, because once it's on for a subscription, it can't be turned off (`07-legal` §6). Per-aircraft pricing plus iCloud sharing already covers co-owners. Recommendation: **leave it off.**

---

## 9. Guarantee wording (word for word, matching `07-legal-and-appstore.md` §4)

> **Find-It Guarantee:** If TailBook doesn't surface at least one date, record or squawk you'd lost track of in your first 30 days (with at least six items entered), email us. We'll walk you through requesting a refund from Apple, and if Apple declines, we'll give you a free year.

> **Error Promise:** If a calculation error in TailBook (not in the data you entered) showed an item as current when it was overdue, we'll make it right: we'll help with an Apple refund request and give you a free year.

> **Deposit:** Your $49 deposit is fully refundable on request at any time before launch. If TailBook isn't on the App Store by 2027-06-30, or if we decide not to build it, we refund every deposit in full without your having to ask.

**Rules**
- Never promise an Apple refund. Only Apple refunds IAP purchases. We help the customer request one, and the free year (delivered as an offer code) is the make-good we control.
- The Error Promise is a make-good, **not** an assumption of consequential damages (the lawyer confirms).
- Partners may repeat these words exactly as written, and nothing stronger.
- The research's headline "Know your plane is legal in 5 seconds, or your first year is on us" is **not used** in partner materials, because it implies a legality verdict (`07-legal` §1). Use **"Know what's due in 5 seconds"** instead.

---

## 10. Partner agreement checklist (one page; the lawyer reviews the template once)

1. Parties, the offer, and the codes or links issued.
2. Payout: rate, cap, quarterly schedule, data source (App Store Connect redemptions or Stripe UTM), and no payout on refunds.
3. Name and logo: no use by either side without written approval, and nothing inside the app (guideline 5.2).
4. Disclaimer language the partner must keep.
5. No exclusivity. 30-day termination. Codes already issued are honored.
6. Privacy: we receive no member lists. Partners distribute codes themselves.
7. Insurance brokers only: compliance sign-off attached.
