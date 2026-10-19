# Legal, Disclaimers & App Store

> ## ⚠️ NOT LEGAL ADVICE: HAVE A LAWYER REVIEW ALL OF THIS BEFORE USE
> These are working drafts written by a non-lawyer to save your lawyer's time (and your money). Aviation is a high-stakes context: a reliance claim involving a hull loss could be large. Budget **~$300–$1,000** for a flat-fee review of: (1) the Snapshot terms, (2) the deposit terms, (3) the app ToS/EULA and privacy policy, and (4) the IA advisor contract. **Get (1) and (2) reviewed before taking the first deposit.** Form the LLC first so contracts and liability sit with the company.

---

## 1. The core disclaimer (one source of truth; use the same words everywhere)

**Long form** (Snapshot PDF, ToS, App Store description footer, the app's About screen):
> TailBook is an organizational tool. It records and calculates dates and times from information you provide and displays reminders. TailBook does not inspect aircraft, does not determine airworthiness, and does not determine whether any Airworthiness Directive or other requirement applies to your aircraft. **Your A&P mechanic or Inspection Authorization holder and the pilot in command are solely responsible for determining airworthiness** (see 14 CFR 91.7, 91.403). Always verify against your aircraft's maintenance records and current regulations before flight. TailBook may contain errors.

**Short form** (emails, widgets, onboarding, paywall):
> TailBook organizes the dates you enter. Your A&P/IA and the pilot in command determine airworthiness.

**In-app placement:** shown once at onboarding with an explicit "I understand" tap; in Settings → About; and as a footer on every exported PDF. Never use the words "airworthy" or "legal to fly" as a **verdict** in the UI. Write "All tracked items current" rather than "Airworthy". (Research §4.1 floats an "Airworthy today?" label; **rename it to "All items current?"**.)

---

## 2. Concierge Snapshot terms (on the Tally form, as a required checkbox)
> **Free Airworthiness Snapshot: Terms.** By submitting, you agree that: (a) the Snapshot is a free, informational summary prepared by hand from the documents and information you provide; (b) it is not an inspection, airworthiness determination, or legal advice, and does not determine AD applicability; (c) it may contain transcription or calculation errors, and you will verify every item against your maintenance records with your A&P/IA before relying on it; (d) your A&P/IA and the pilot in command are solely responsible for airworthiness; (e) to the maximum extent permitted by law, TailBook [LLC name] is not liable for any loss arising from use of the Snapshot; (f) you have the right to share the documents you upload; we use them only to prepare your Snapshot and delete them within 90 days; we never sell them.

---

## 3. Founding Owner deposit terms (linked from the Stripe Payment Link)
> **TailBook Founding Owner Deposit: Terms**
> 1. **What it is.** A $49 refundable deposit that reserves Founding Owner pricing ($149/year per aircraft, for as long as you keep the subscription active) for the TailBook app, which is **in development and not yet available**. It is not an investment and grants no ownership interest.
> 2. **Refunds.** Fully refundable on request at any time before the app launches: email founder@[domain]. Refunds go back to your original payment method through Stripe, normally within 5–10 business days.
> 3. **If we don't ship.** If TailBook is not available on the App Store by **[2027-06-30]**, or if we decide not to build it, we will refund every deposit in full without your having to ask.
> 4. **At launch.** Subscriptions inside the app are sold through Apple's App Store. At launch you'll choose: (a) receive an App Store offer code that applies your $49 as a credit toward your first year at Founding Owner pricing; or (b) a full refund of your deposit. [Exact mechanism to be confirmed against Apple's offer-code options before launch; see §4.] If you don't choose within 60 days of our launch email, we refund you.
> 5. **One deposit per aircraft.** Founding pricing is limited to the first 250 aircraft.
> 6. **Disclaimer.** TailBook organizes dates you enter; your A&P/IA and the pilot in command determine airworthiness.
> 7. **Contact.** [LLC name], [address], founder@[domain].

**Lawyer questions for the deposit:** (a) do the FTC Mail/Internet Order Rule or state pre-sale/deposit laws apply to a software pre-order, and are the timing promises above enough? (b) sales tax: a refundable deposit is generally not taxable until applied, but confirm for your state; (c) is "for life" wording safe? (Consider "for as long as your subscription remains active".)

**Stripe notes:** Stripe may scrutinize or hold reserves on pre-orders with a long fulfillment window. Describe the product accurately in the Payment Link ("Refundable deposit, app in development"). Stripe keeps its processing fee on refunds (~$1.72 per $49 deposit).

---

## 4. Refunds: Apple IAP vs web Stripe deposits

| | **Web deposit (Stripe), now** | **In-app subscription (Apple IAP), after launch** |
|---|---|---|
| Who sells | You (merchant of record) | Apple (merchant of record) |
| Who refunds | **You**, any time, in the Stripe dashboard | **Only Apple.** The customer requests at reportaproblem.apple.com; Apple decides. You can't refund an IAP yourself. |
| Fees | 2.9% + 30¢; fee kept by Stripe on refund | 15% (Small Business Program) / 30%; refunds reverse your proceeds |
| Allowed? | Yes. Selling a deposit on your own website before the app exists is outside the App Store | In-app, digital features must be sold via IAP (Guideline **3.1.1**) |
| Promises you can make | "Full refund on request" | Never promise an Apple refund. Promise to *help* request one, and offer a make-good you control (e.g. a free year via offer code) |

**Honoring the deposit in a no-backend app:** web purchases can be unlocked in-app under **3.1.3(b) Multiplatform Services** only if the same item is also available through IAP, and that needs an account/receipt system, i.e. a backend. **Recommended instead:** use **App Store offer codes** (Apple-native, no backend): create a "Founding Owner" $149/yr subscription in the same subscription group, and give each depositor a one-time offer code that discounts year one by the $49 credit (or refund the $49 and give a code for the founding price). **Verify that the exact discount structure you promise is possible in App Store Connect before launch**; the deposit terms above leave room for that.

**Linking out to web payment (US storefront):** after the 2025 *Epic v. Apple* contempt ruling, US-storefront apps may link to external purchases; Apple currently charges no commission on them. The Ninth Circuit (Dec 2025) let Apple seek *some* commission, the Supreme Court agreed (June 2026) to review the contempt finding, and in Aug 2026 Apple proposed 15% (5% for small business). **The question is unsettled, so don't design v1 around external links.** Use IAP plus offer codes. Revisit at launch.

**The research's guarantees, made compliant:**
- *Find-It Guarantee:* "If TailBook doesn't surface at least one date, record or squawk you'd lost track of in your first 30 days (with at least six items entered), email us. We'll walk you through requesting a refund from Apple, and if Apple declines, we'll give you a free year." The free year goes via offer code.
- *Error Promise:* "If a calculation error in TailBook (not in the data you entered) showed an item as current when it was overdue, we'll make it right: we'll help with an Apple refund request and give you a free year." Have the lawyer confirm this doesn't expand liability. It's a make-good, **not** an assumption of consequential damages.

---

## 5. Terms of Service / EULA draft (app)

Apple's **Standard EULA** applies by default. If you use a custom EULA, it must meet Apple's "minimum terms" (Apple is not responsible for the app or its support, among others). Recommended: keep Apple's Standard EULA and **add these supplemental Terms**, linked in the App Store description and in the app (required for auto-renewing subscriptions under 3.1.2).

> **TailBook Terms of Use (draft)**
> **1. Acceptance.** By using TailBook you agree to these Terms and to Apple's Standard EULA. If they conflict, [lawyer to decide which governs].
> **2. What TailBook is.** An organizational tool for recording aircraft maintenance dates, times, documents and reminders from information you provide. [Insert the long-form disclaimer from §1.]
> **3. Your responsibilities.** You are responsible for the accuracy and completeness of the information you enter, for keeping your official maintenance records as required by 14 CFR 91.417, and for verifying all information with your A&P/IA before flight. TailBook is not a substitute for your maintenance records. Scans stored in TailBook are copies; keep your originals.
> **4. Rule content.** Interval rules and citations reflect our understanding of US regulations as of the date shown in the app. Regulations change, and TailBook may not reflect changes immediately. Type templates are editable starting points, not manufacturer or FAA data.
> **5. No warranty.** TailBook is provided "as is" and "as available", without warranties of any kind, including fitness for a particular purpose, accuracy, or uninterrupted operation, to the maximum extent permitted by law.
> **6. Limitation of liability.** To the maximum extent permitted by law, [LLC] is not liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of aircraft, hull or liability coverage, use, revenue or data, arising from your use of TailBook. Our total liability is limited to the amount you paid for TailBook in the 12 months before the claim.
> **7. Indemnity.** You agree to indemnify [LLC] against claims arising from your operation or maintenance of any aircraft or your misuse of TailBook. [Lawyer: enforceability vs. consumers.]
> **8. Subscriptions.** Purchased and managed through Apple. Payment, renewal, cancellation and refunds follow Apple's terms. [Describe the Find-It Guarantee and Error Promise here as goodwill make-goods.]
> **9. Data and privacy.** Your data is stored on your device and in your iCloud account; [LLC] does not operate servers that store your aircraft data. See the Privacy Policy.
> **10. Sharing.** If you share an aircraft with co-owners, they can see and edit the shared data. You're responsible for whom you invite.
> **11. Changes, termination, governing law, disputes.** [Lawyer: governing law, venue/arbitration, class-action waiver choices.]
> **12. Contact.** [LLC name, address, email].

**Privacy policy (required, 5.1.1):** say plainly that there are no accounts and no TailBook servers; data lives on-device and in the user's iCloud (CloudKit); scans/OCR are processed on-device; analytics (if any) are named; there's no selling or sharing for ads; co-owner sharing works via iCloud; and give a contact address. Keep the App Store privacy "nutrition label" consistent with it. The Snapshot (web) needs its own short privacy notice covering uploads, 90-day deletion, and Tally/Google Drive as processors.

---

## 6. App Store guideline risk checklist

| Guideline | Risk for TailBook | Mitigation | Level |
|---|---|---|---|
| **1.4 Physical harm** (safety) | Reviewer may see "airworthiness" as a safety claim where errors could cause harm | Position it as organizational; disclaimer at onboarding; no "airworthy" verdicts; cite FARs as references, not determinations | Medium |
| **2.1 App completeness** | No login, so a reviewer needs data to see value | Ship a "Sample aircraft" demo mode; App Review notes explain the flows | Low |
| **2.3 Accurate metadata** | Overclaiming ("FAA-approved", "guarantees compliance", "never fly illegal") | Metadata says "track", "organize", "remind". Never "approved", "certified" or "compliant". Screenshots show real UI | Medium |
| **3.1.1 In-app purchase** | Unlocking features via web deposit or license keys | IAP subscriptions only; depositors get Apple offer codes; no in-app mention of the web deposit | Medium |
| **3.1.2 Subscriptions** | Must deliver ongoing value; clear terms on the paywall | Ongoing alerts, sync, rule updates; paywall shows price, period, trial terms, and Terms/Privacy links; restore purchases | Low |
| **3.1.2 Family Sharing** | **Once Family Sharing is turned on for a subscription, it can't be turned off** | Decide deliberately; per-aircraft pricing plus CKShare already covers co-owners | Low (decision) |
| **3.1.3(b) Multiplatform** | Only relevant if web subscriptions unlock in-app | Avoid in v1 (no backend) | Low |
| **4.2 Minimum functionality** | Low; v1 is a rich native app | — | Low |
| **5.1.1 Data collection & privacy** | Photos/camera (VisionKit), notifications, iCloud | Purpose strings; privacy policy link in the app and metadata; accurate nutrition label; privacy manifest for required-reason APIs | Medium |
| **5.1.2 Data use & sharing** | Co-owner sharing of logbook scans | User-initiated CKShare only; no third-party SDKs that collect data | Low |
| **5.2 Intellectual property** | Using "Cirrus", "Bonanza", "Mooney", "Cessna", "Piper", or the FAA logo | Text-only nominative use for type templates ("for Bonanza owners"); no logos; no implied endorsement; app name has no manufacturer marks. **Don't use type-club names or logos without a written partnership** | Medium |
| **5.6 Developer conduct / reviews** | Asking founding owners for reviews in exchange for perks | Never incentivize ratings; use the system review prompt only | Low |
| Trademark check (not a guideline) | "TailBook" may already be in use | USPTO search + App Store search **this week**, before buying the domain | Medium |

---

## 7. Is E&O insurance worth it?

**What it covers:** Technology Errors & Omissions covers claims that your product or service failed or contained errors that caused a customer financial loss. It's usually bundled with cyber liability.

**Cost** (vendor averages, 2026): ~**$800–$1,100/yr** for a $1M/$1M policy for small software companies (TechInsurance; Insureon says most IT businesses pay $50–$100/mo). The range is wider (~$700–$5,000) depending on revenue and risk.

**Exposure in this context:** low frequency, high severity. The nightmare scenario: an owner relies on TailBook or a Snapshot, flies with a lapsed item, has an accident, the insurer denies the hull claim, and the owner sues you. The disclaimers and "you verify with your IA" design are your first line of defense. Insurance is the second.

**Recommendation**
1. **Now (validation):** get **2–3 quotes this month**. Ask the broker explicitly: *"Does the policy exclude aviation-related products or services, or bodily injury or property damage arising from aircraft?"* Many policies carry aviation or BI/PD exclusions, and a policy that excludes aviation is worthless to you. Ask the lawyer whether the free concierge Snapshot creates enough exposure to bind before you deliver Snapshot #1. At minimum, bind before you exceed ~25 Snapshots or start charging for anything.
2. **Before App Store launch: buy it.** At ~$1k/yr against a $199 price, that's about 5 subscribers, and the downside it covers is existential. **Yes, it's worth it.**
3. Pair it with the LLC, clean disclaimers, the IA review paper trail (it shows diligence), and a test suite for the interval engine (it supports the "Error Promise").
