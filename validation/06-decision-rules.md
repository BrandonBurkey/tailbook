# Decision Rules (pre-committed)

**Sign and date this now, before any data comes in.** The point is to stop yourself moving the goalposts in December.
Signed: __________________  Date: 2026-10-__

**Data sources:** `06-experiment-tracker.csv` (numbers), Stripe (deposits), Tally (requests), Plausible (clicks), interview notes (tags).
**Deposit rate definition:** deposits ÷ Snapshots delivered at least 7 days before the freeze. Refunded-on-request deposits don't count as deposits, but log them.

---

## 1. Checkpoint: Sun 2026-11-15 (E1 readout, end of the 21-day window)

| Result | What you do Monday morning |
|---|---|
| **PASS:** ≥60 requests AND ≥150 clicks | Continue. Stop new channel experiments and put 80% of posting time into the top 2 channels. Focus on delivery quality and E2. |
| **MIDDLE:** 20–59 requests | Continue to Dec 13. Add the type-club newsletters, the guest article, 2 more FB groups, and 3 local shops. You still need **60 delivered by Dec 13**. Diagnose: high clicks but few requests → the form is too heavy, so add a "just type your dates" lite Snapshot option. Few clicks → messaging, so switch every channel to its better variant. |
| **FAIL:** <20 requests | First rule out bad execution: were all 8 channels actually posted? Were posts removed by mods? Did the links work? **If execution was fine, top-of-funnel demand or reach has failed.** Go straight to §3 now; don't wait for December. Most likely path: **switch to REPS (#2)**, or the **clubs/partnerships** pivot if partnership owners were over-represented among the few who did respond. |

## 2. Final decision: Tue 2026-12-15 (numbers frozen Sun Dec 13)

### 2a. If ≥60 Snapshots were delivered

| E2 deposit rate | Decision | Exactly what happens next |
|---|---|---|
| **≥15%** (≥9 deposits on 60) | **PERSEVERE → build SwiftUI v1** | See §4. Start Wed Dec 16. |
| **10–14.9%** | **PERSEVERE (thin v1)**, but only if the E3-proxy surprise rate is ≥40%. If it isn't, treat this as the 5–9.9% row. | Build only features 1, 2, 4 and 5 of the spec (profile, interval engine, status board/widgets/alerts, tach quick log) in ≤4 weeks. Ship to depositors on TestFlight. Re-decide on E3 (≥60% aha) before building the vault, exports and sharing. |
| **5–9.9%** | **ITERATE ONCE.** One 3-week cycle, hard stop **2027-01-05**. | Change exactly **one** variable, chosen from the "no" reasons in the interviews: price (Founding $99/yr), segment (partnerships/clubs only), or offer (the vault leads, not the board). Same thresholds. If it's still <10% on 2027-01-05 → §3. **No second extension.** |
| **<5%** | **KILL this offer → PIVOT** (research kill criterion) | Refund all deposits the same day (`04-emails.md` §6, or its pivot variant). Choose the pivot in §3. |

### 2b. If fewer than 60 Snapshots were delivered
That's a reach failure in its own right; the market didn't show up.
- **≥30 delivered AND deposit rate ≥15%:** extend once, to **2027-01-05**, purely to reach 60. Same thresholds.
- **Anything else:** treat as **<5% → PIVOT** (§3).

### Tiebreakers (use only inside the ambiguous rows, never to overturn a clear row)
- Strong: ≥3 owners who *already pay* for a tracking service or shop fee said they'd switch.
- Strong: a type club agreed to a member offer or an article.
- Negative: more than 30% of "no" reasons were "my shop handles it".
- Negative: more than 30% of "no" reasons were privacy ("I wouldn't put my logbooks in an app").

---

## 3. Choosing the pivot

Pick the **first** row whose evidence condition is met. Each pivot gets **one 3-week test** with its own pass/fail.

| Pivot | Choose it if the evidence shows… | 3-week test | Pass / fail |
|---|---|---|---|
| **A. Clubs & partnerships** (customer-segment pivot) | ≥30% of requesters or depositors were partnerships or clubs; frequent quotes about partners not logging tach or splitting costs; or a club or club manager showed interest | Contact 30 flying clubs and partnerships (AOPA flying-club network, FB club groups, FBO club boards). Offer a **club plan** (one shared board for all members; $199/aircraft/yr, founding $149) with a $49 deposit per aircraft | Pass ≥5 clubs/partnerships deposit. Fail <2. *Variant: A&P/IA shops as a B2B channel if many owners said "my shop tracks it": 20 shops; pass ≥3 agree to pilot.* |
| **B. Logbook Vault & Sale Pack, one-time $99** (value pivot) | Interview and decline reasons center on **records, resale, pre-buy or losing logbooks**, more than on due dates; owners say "I know my dates but my logbooks are a mess" | New landing page: "Scan, search and back up your logbooks; one-tap Sale Pack for buyers and pre-buys". **$99 one-time per aircraft**, $25 refundable deposit. Target owners currently selling or buying (forum classifieds, type-club for-sale sections, brokers) plus the existing list | Pass ≥10% of 40+ engaged leads deposit. Fail <4%. |
| **C. Switch to research option #2: REPS / STR log** | E1 failed on reach, OR no aviation pivot signal is present, OR A/B also fail | Run the §4.2 MVP: landing page + free "STR Log Audit" + $149 founding deposit, on WCI, BiggerPockets, r/realestateinvesting; plus pitch 20 STR CPAs. Seasonal tailwind: Q4/Q1 tax season | Pass ≥10% landing→deposit and/or ≥5 of 20 CPAs agree to recommend. Fail <3% (and <2 CPAs). |
| Feature pivot (only alongside persevere) | Many owners demand automatic AD applicability | Scope v2: on-device FAA AD data shipped as a static versioned file. Not a reason to delay v1. | — |

If every pivot fails: stop. Write a post-mortem, keep the list, and go back to the research shortlist (#3 Domicile Defense, or #4 FBAR ledger).

---

## 4. PERSEVERE: what "build" means (start 2026-12-16)

Build the **8-feature SwiftUI v1** from research §4.1:
1. Aircraft profile + type templates
2. Interval engine (calendar-month, days, hours, whichever-first) with FAR citations
3. AD/SB tracker (manual entry; no automatic applicability)
4. Status board, widgets, notifications (60/30/7 days, 10/5 hours)
5. Tach/Hobbs quick log (widget, Siri Shortcut, App Intent) + utilization forecast
6. Logbook scan vault (VisionKit + on-device Vision OCR)
7. Squawk list → PDF exports (Annual Work Order, Status Report)
8. CloudKit private sync + CKShare co-owner sharing; StoreKit 2 subscription per aircraft

**Sequence (2-week build-measure-learn cycles):**
- **Cycle 1 (Dec 16–Dec 29):** interval engine plus unit tests built from every real Snapshot you delivered (your best test fixtures). IA advisor reviews the engine rules (new contract). Settle the founding-deposit mechanics with Apple (see `07-legal-and-appstore.md` §4).
- **Cycle 2 (Dec 30–Jan 12):** onboarding + board + widgets → **TestFlight to depositors** → run **E3** for real.
- **Cycles 3–4:** quick log, vault, exports, sharing, paywall → App Store submission. Then measure **E4** (trial→paid), **E5** (monthly logging) and **E6** (co-owner invites) against the thresholds in the tracker.
- Keep running the forum and club channel during the build. Annual season peaks now.

**Persevere guardrail:** if E3 (TestFlight aha) comes in under 25%, pause the build and revisit §3, value pivot B first.

---

## 5. Rules about the rules
- No threshold changes after today. If you think one was wrong, write down why, then apply it anyway and run a new test next cycle.
- Count only money and actions (deposits, photos sent, intros). Compliments count for nothing.
- Make the decision on the date. Not deciding is a decision to burn another month.
- If KILL or PIVOT: refund deposits **the same day** and tell people why. Your reputation in this small community is your next launch's distribution.
