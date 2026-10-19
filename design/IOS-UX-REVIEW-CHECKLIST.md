# TailBook iOS UX Review Checklist

Use this file to review each SwiftUI screen once it's built. The reference is `design/DESIGN-SYSTEM.md` (DS) and the components in `design/TailBookTheme.swift`. Mark each box ✅ pass, ❌ fail (file an issue) or n/a. A screen ships when every box in "Every screen" and in its own section passes.

**How to review.** Run on an iPhone 15/16 (6.1") and an iPhone SE (4.7"), in light and dark mode, at Dynamic Type **Large**, **xxxLarge** and **AX5**. Do one pass with VoiceOver on and one with Settings → Accessibility → Display → **Increase Contrast**, **Reduce Motion** and **Bold Text** on. Use the sample aircraft (N731TB) for data.

---

## 0. Every screen

**Wording and legal**
- [ ] The word "airworthy", "legal to fly", "safe", "compliant", "approved" or "certified" never appears as a status, title, badge, button or notification. (Searching the strings file for `irworth` should only hit the disclaimer and the Snapshot/Settings legal text.)
- [ ] Any screen that shows a summary or status shows the disclaimer, or one tap away on detail screens.
- [ ] Citations are formatted "14 CFR §91.413" in the `citation` font.

**Layout and tokens**
- [ ] Only `TB.*` colors are used. There are no raw `Color.red`, `.green` or `.yellow` and no hard-coded hex.
- [ ] The side margin is 16 pt. Spacing is on the 4-pt grid. Card radius is 16 (continuous), and controls are 12.
- [ ] One primary button per screen at most, 52 pt tall.
- [ ] The safe area is respected. Nothing sits under the home indicator. The keyboard never covers the focused field or the primary button.

**Type and Dynamic Type**
- [ ] All text uses text styles (`TBFont` or system). There are no fixed `.system(size:)` fonts for text.
- [ ] At **AX5**, nothing is truncated or clipped, and nothing overlaps. Rows and the hero card stack vertically. Buttons grow taller.
- [ ] Numbers use monospaced digits. Days and hours don't jitter when values change.

**Accessibility**
- [ ] Every tappable element is at least 44×44 pt, including info buttons, citation links, "Skip" and "Don't know".
- [ ] VoiceOver reading order matches the visual order. Decorative images are hidden. Every icon-only button has a label.
- [ ] Status is never conveyed by color alone (glyph shape + word + color).
- [ ] With Increase Contrast on, secondary text and borders visibly darken (light) or lighten (dark).
- [ ] With Reduce Motion on, there is no movement, only cross-fades or instant changes.
- [ ] Focus lands on the screen title or the first meaningful element after navigation.

**States**
- [ ] Empty, loading (> 300 ms only), error and offline states exist and match DS §9 copy.
- [ ] Destructive actions ask for confirmation, and undo is offered where cheap.

---

## 1. Onboarding

Goal: the first board in under 5 minutes, with the paywall **after** the value. There are 9 steps, and steps 1–5 each show a progress indicator ("Step 2 of 5").

### 1.1 Wireframes

```
 (1) WELCOME + AIRCRAFT              (2) TACH & HOBBS                  (3) LAST ANNUAL
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│ ●○○○○  Step 1 of 5   Skip │      │ ●●○○○  Step 2 of 5   Back │      │ ●●●○○  Step 3 of 5   Back │
│                           │      │                           │      │                           │
│ What do you fly?          │      │ Current tach and Hobbs    │      │ When was your last        │
│                           │      │                           │      │ annual inspection?        │
│ Tail number               │      │ Tach                      │      │ 14 CFR §91.409(a)         │
│ ┌───────────────────────┐ │      │ ┌───────────────────────┐ │      │ ┌───────────────────────┐ │
│ │ N731TB                │ │      │ │ 1,250.4           hrs │ │      │ │   « November 2025 »   │ │
│ └───────────────────────┘ │      │ └───────────────────────┘ │      │ │  S  M  T  W  T  F  S  │ │
│ Make / model              │      │ Hobbs (optional)          │      │ │  graphical picker     │ │
│ ┌───────────────────────┐ │      │ ┌───────────────────────┐ │      │ │        [ 5 ]          │ │
│ │ Beechcraft A36      › │ │      │ │ 1,612.0           hrs │ │      │ └───────────────────────┘ │
│ └───────────────────────┘ │      │ └───────────────────────┘ │      │ ⓘ Good through the END of │
│ Fly IFR?      [ No |Yes ] │      │ Avg hours / month         │      │   the 12th month: through │
│ Used for hire?[ No |Yes ] │      │ ┌───────────────────────┐ │      │   Nov 30, 2026.           │
│                           │      │ │ 8                     │ │      │                           │
│ ⓘ IFR adds pitot-static   │      │ └───────────────────────┘ │      │ Don't know? Snap the      │
│   and VOR checks.         │      │ Used to project hours     │      │ logbook entry  [📷]       │
│                           │      │ items into dates.         │      │                           │
│ ┌───────────────────────┐ │      │ ┌───────────────────────┐ │      │ ┌───────────────────────┐ │
│ │       Continue        │ │      │ │       Continue        │ │      │ │       Continue        │ │
│ └───────────────────────┘ │      │ └───────────────────────┘ │      │ └───────────────────────┘ │
│  Try a sample aircraft    │      │  I don't know yet         │      │  I don't know yet         │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘

 (4) THE 24-MONTH ITEMS              (5) RECURRING ADs (optional)       (6) BOARD REVEAL  ← aha
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│ ●●●●○  Step 4 of 5   Back │      │ ●●●●●  Step 5 of 5   Back │      │ N731TB  Beechcraft A36    │
│                           │      │                           │      │ ┌───────────────────────┐ │
│ The easy-to-forget items  │      │ Any recurring ADs?        │      │ │ ⬣  ALL ITEMS CURRENT? │ │
│                           │      │ Add up to 3 now; more     │      │ │    No                 │ │
│ Transponder     §91.413   │      │ later.                    │      │ │    ELT battery overdue│ │
│ ┌───────────────────────┐ │      │                           │      │ │    1 item due soon.   │ │
│ │ Oct 18, 2024        › │ │      │ ┌───────────────────────┐ │      │ ├───────────────────────┤ │
│ └───────────────────────┘ │      │ │ AD 2020-18-04       › │ │      │ │ NEXT DUE  Transponder │ │
│ Pitot-static    §91.411   │      │ │ 100 hr or 12 cal mo   │ │      │ │ in 12 days  ⬣1 ▲1 ●6  │ │
│ ┌───────────────────────┐ │      │ └───────────────────────┘ │      │ ├───────────────────────┤ │
│ │ Nov 2, 2024         › │ │      │ ┌───────────────────────┐ │      │ │ disclaimer (caption)  │ │
│ └───────────────────────┘ │      │ │ ＋ Add an AD           │ │      │ └───────────────────────┘ │
│ ELT inspection  §91.207(d)│      │ └───────────────────────┘ │      │ ⬣ ELT battery    19       │
│ ┌───────────────────────┐ │      │                           │      │   §91.207(c) DAYS OVER    │
│ │ Nov 5, 2025         › │ │      │ ⓘ TailBook doesn't decide │      │ ▲ Transponder    12       │
│ └───────────────────────┘ │      │   which ADs apply. Ask    │      │   §91.413    DAYS LEFT    │
│ ELT battery     §91.207(c)│      │   your IA.                │      │ ● Annual         42       │
│ ┌───────────────────────┐ │      │                           │      │   …                       │
│ │ Sep 2026 (month)    › │ │      │ ┌───────────────────────┐ │      │ ┌───────────────────────┐ │
│ └───────────────────────┘ │      │ │     Show my board     │ │      │ │       Continue        │ │
│ Each: Don't know? [📷]    │      │ └───────────────────────┘ │      │ └───────────────────────┘ │
│ [ Continue ]              │      │  Skip for now             │      │                           │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘

 (7) PAYWALL (see §8)                (8) NOTIFICATIONS PRE-PROMPT       (9) CO-OWNERS (optional)
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│ see §8.1                  │      │        🔔 (bell.badge)    │      │       (person.2)          │
│                           │      │                           │      │ Share N731TB with your    │
│                           │      │ Get warned before         │      │ partners?                 │
│                           │      │ anything lapses           │      │ They see the same board   │
│                           │      │                           │      │ and log their own tach.   │
│                           │      │ We'll remind you 60, 30   │      │ No extra cost per person. │
│                           │      │ and 7 days before each    │      │                           │
│                           │      │ due date, and at 10 and 5 │      │ ┌───────────────────────┐ │
│                           │      │ hours left.               │      │ │   Invite co-owners    │ │
│                           │      │ ┌───────────────────────┐ │      │ └───────────────────────┘ │
│                           │      │ │   Turn on reminders   │ │ ──►  │  Not now                  │
│                           │      │ └───────────────────────┘ │ iOS  │                           │
│                           │      │  Not now                  │ alert│                           │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
```

The disclaimer is acknowledged once, at step 6, with an inline "I understand" link under the hero card before Continue (legal §1). It must not be a blocking modal before the user has seen value.

### 1.2 Checklist
- [ ] Steps 1–5 have a visible step count and a Back button. The step count is announced by VoiceOver ("Step 2 of 5").
- [ ] Every date step has "I don't know yet" and "Snap the sticker / logbook entry". Neither blocks progress; the item becomes `unknown`.
- [ ] "Try a sample aircraft" on step 1 loads N731TB and jumps to the board (App Review 2.1).
- [ ] IFR = No hides pitot-static and the VOR check. For hire = No hides the 100-hour. The hint explains why.
- [ ] Step 3 explains the month-end rule in one line using the date the user picked ("through Nov 30, 2026").
- [ ] The ELT battery picker is month + year only, and its help text explains "the date marked on the battery".
- [ ] Tach and Hobbs use a decimal pad and accept one decimal place; a comma decimal separator works in other locales.
- [ ] The reveal animation follows DS §7: worst items first, ≤ 600 ms in total, cross-fade only under Reduce Motion.
- [ ] The reveal shows at least the hero card + 3 rows above the fold on a 6.1" phone at Large.
- [ ] The notification pre-prompt appears **before** the iOS system alert. "Not now" doesn't trigger the system alert (so it can be asked again later).
- [ ] Total time with real logbook dates is under 5 minutes, timed with 3 testers aged 50+.
- [ ] Keyboard: Return moves to the next field, and the last field submits.

---

## 2. Board (home)

- [ ] The hero card (`TBHeroCard`) comes first. Its answer is one of Yes / Not all / No / Can't tell yet, matching `summary.status`.
- [ ] The headline is the engine's `summary.headline`, verbatim. For `limited`, the `affects` text is shown.
- [ ] The disclaimer is visible on the board (in the hero card or directly under it).
- [ ] Row order: overdue → due soon → current → needs date → N/A, soonest first within each group.
- [ ] Each row follows DS §5.2: glyph, name, citation, detail, value + unit, tag. Green values are in `ink`.
- [ ] Hours items show "· PROJ." and "About <date> at your pace". The projection never changes the status color.
- [ ] Each row is one VoiceOver element with the DS §10 label format, a button trait and a hint. Custom actions are "Log done" and "Open rule".
- [ ] Pull to refresh recomputes "today". The board also recomputes at midnight and when the app returns to the foreground (no stale "12 days" the next morning).
- [ ] The primary action, "Log flight", is reachable with one thumb (bottom toolbar button or `plus.circle.fill`).
- [ ] With multiple aircraft, the tail-number switcher is in the navigation title menu, and the current tail is always visible.
- [ ] Haptic plays only when the summary changes after a user action (`tbStatusHaptic`).
- [ ] Empty and all-unknown states match DS §9.
- [ ] Widgets (if in this build) say "All current" / "1 overdue" with a glyph, never "Airworthy".

## 3. Item detail

- [ ] The header shows the glyph + status word + big value ("12 days left") + "Current through Oct 31, 2026".
- [ ] The full rule text is shown with its citation, plus a "Read 14 CFR §91.413" link (opens eCFR in Safari View Controller, 44-pt target).
- [ ] "How we calculated this" shows the inputs (last done, interval, month-end rule) so an IA can check the math.
- [ ] History: past completions, newest first, each with an optional linked logbook scan thumbnail.
- [ ] Primary action "Log done" opens a date (and tach, if hours-based) sheet. It defaults to today, and the board animates the status change.
- [ ] Linked proof: "Attach logbook page" (VisionKit) and a thumbnail that opens full screen with zoom.
- [ ] Edit interval is available for custom items and ADs only. Regulatory intervals are read-only, with an explanation.
- [ ] VoiceOver reads the header as one sentence. The rule text is readable and not truncated at AX5.

## 4. AD editor

- [ ] Fields: AD number (format hint `2020-18-04`, monospaced), title/subject, applicability note, recurring yes/no, interval hours, interval **calendar months** vs. **months** (with a one-line explanation of the difference), interval days, last done (date + tach), method of compliance (multiline), linked page.
- [ ] Whichever-first: if both hours and months are set, a live preview shows "Next due: 1,250.0 tach or Mar 31, 2027, whichever comes first".
- [ ] Validation is inline and in plain language. Save stays disabled until an AD number plus at least one interval (or one-time) and a last-done value are present.
- [ ] Info text: "TailBook doesn't determine whether an AD applies to your aircraft. Ask your IA." It shows in the editor and on the ADs empty state.
- [ ] Delete is in a confirmation dialog, uses the destructive role, and is at the bottom of the form, never in a swipe on the board.
- [ ] Unsaved changes prompt "Discard changes?" on swipe-down dismissal (`interactiveDismissDisabled` while dirty).
- [ ] At AX5, the interval fields stack vertically and each label stays visible (no placeholder-only fields).

## 5. Log flight sheet

- [ ] Presented as a `.medium` / `.large` detent sheet. The tach field is focused on appear, with a decimal pad.
- [ ] Shows "Last: 1,250.4". Entering a lower value shows an inline error and the error haptic, and disables Save.
- [ ] An optional Hobbs field and a date (default today) that can be backdated.
- [ ] Save button: "Log 1.6 hrs" (the computed delta, shown live in monospaced digits).
- [ ] After saving, the sheet dismisses, a toast-style banner says "Logged 1.6 hrs · Oil change now 30.4 hrs left", and any status change is announced to VoiceOver.
- [ ] With co-owners, a partner picker defaults to "Me".
- [ ] It works from the widget/App Intent with the same validation.
- [ ] Can be completed in ≤ 3 taps plus digits.

## 6. Squawks

- [ ] List of open squawks, newest first, with a segmented control: Open | Resolved.
- [ ] Add squawk: a title (required), note, optional photo, and "Found on" date. The form has 2 fields visible by default.
- [ ] Swipe to resolve (trailing, accent) and swipe to delete (with confirmation).
- [ ] "Create annual work order" (PDF) is visible when there is at least one open squawk.
- [ ] The empty state matches DS §9.
- [ ] Squawks never change board status (they're notes, not regulatory items). The UI doesn't imply otherwise.

## 7. PDF export (Aircraft Status Report / Annual Work Order)

- [ ] Preview before sharing (`PDFKit` view), with a share sheet via `square.and.arrow.up`.
- [ ] The page is US Letter with a 0.75" margin and always printed in **light** tokens, regardless of the app's color mode.
- [ ] Header: tail, make/model, owner name (optional), "Prepared <date> from owner-entered data".
- [ ] Table: status glyph **and** word (the report must survive black-and-white printing), item, citation, last done, due, remaining.
- [ ] The full long-form disclaimer is in the footer of **every page**, with page "1 of 2" numbering.
- [ ] No "Airworthy" stamp, seal or checkmark-badge anywhere. The summary line reads "All tracked items current: Yes/No".
- [ ] Body text is at least 10 pt and the table at least 9 pt. Numbers are tabular.
- [ ] Generation over 1 s shows progress, and failure shows the DS §9 error.

## 8. Paywall

### 8.1 Layout (iPhone, Large text)

```
┌──────────────────────────────────────┐
│                                  ✕   │  close: 44pt, top-right, visible immediately (no delayed X)
│  Keep N731TB on watch                │  title (title2 semibold)
│  Your board found 1 overdue and      │  personalized from onboarding results (body, ink2)
│  1 due-soon item.                    │
│                                      │
│  ✓ Alerts 60/30/7 days before        │  4 benefit rows (SF Symbol + body)
│    anything lapses                   │
│  ✓ Recurring AD tracker, whichever-  │
│    first                             │
│  ✓ Logbook scan vault with search    │
│  ✓ Status Report PDF for your IA,    │
│    insurer or buyer                  │
│                                      │
│ ┌──────────────────────────────────┐ │  plan card, SELECTED (accent border 2pt + checkmark)
│ │ ◉ Annual            $199.00/year │ │  price + period in headline weight, same size as name
│ │   14-day free trial, then        │ │  trial terms in the card (subheadline, ink2)
│ │   $199.00/year. ≈ $16.58/mo      │ │  per-month equivalent smaller than billed price
│ │                     [BEST VALUE] │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ ○ Monthly           $24.99/month │ │
│ │   14-day free trial, then        │ │
│ │   $24.99/month.                  │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │      Start 14-day free trial     │ │  primary (52pt)
│ └──────────────────────────────────┘ │
│  Free for 14 days, then $199.00/year │  billed-amount line directly under CTA (subheadline, ink)
│  Auto-renews until canceled. Cancel  │  (footnote, ink2) – not hidden, not light gray
│  anytime in Settings › Apple ID ›    │
│  Subscriptions, at least 24 hours    │
│  before the trial ends.              │
│                                      │
│  For scale: one annual inspection    │  anchors (footnote, ink3, optional, factual)
│  typically runs $2,500–$4,500.       │
│                                      │
│  Restore Purchases · Redeem Code     │  44pt text buttons
│  Terms of Use · Privacy Policy       │  44pt text buttons, open in SFSafariViewController
└──────────────────────────────────────┘
```

### 8.2 Checklist (App Store 3.1.1 and 3.1.2, plus Apple's subscription disclosure guidance)
- [ ] **Price and period** are shown for every plan, using StoreKit's `product.displayPrice` (localized, never hard-coded) and "/year", "/month".
- [ ] The **billed amount is the most prominent price.** The per-month equivalent ("≈ $16.58/mo") is smaller and secondary.
- [ ] **Trial terms** are stated in each plan card and under the CTA: length, that it's free, and the price after the trial. Eligibility is checked with `isEligibleForIntroOffer`. If the user isn't eligible, the trial copy is removed and the CTA becomes "Subscribe for $199.00/year".
- [ ] **Auto-renewal and cancellation** text is visible without scrolling on a 6.1" phone at Large (it may scroll at AX sizes), in `ink2` at footnote size or larger. It is never lower contrast than AA.
- [ ] **Restore Purchases** is visible on the paywall and also in Settings, and shows a result ("Restored" / "Nothing to restore").
- [ ] **Terms of Use (EULA)** and **Privacy Policy** links are visible on the paywall, work, and are also in the App Store metadata.
- [ ] **Redeem Code** opens `offerCodeRedemption` (for Founding Owner offer codes). The app never mentions the web deposit or any external purchase (3.1.1).
- [ ] The close button is visible from the start and dismisses to a usable (free-tier or limited) board. There are no dark patterns: no pre-checked monthly plan, no countdown timers, no fake scarcity in-app.
- [ ] The CTA label matches what happens: "Start 14-day free trial" (eligible) or "Subscribe" (not eligible).
- [ ] Purchase in progress shows a spinner in the button and disables the button. Errors follow DS §9. Cancellation is silent (no error alert).
- [ ] Competitor anchors, if shown, are factual and dated, or replaced with the neutral "one annual inspection" anchor (2.3 accurate metadata).
- [ ] At AX5, plan cards stack price under the plan name. Nothing truncates. Legal text stays readable.
- [ ] VoiceOver: each plan card is one element: "Annual, 199 dollars per year, 14-day free trial, selected". The selected state uses the `.isSelected` trait.
- [ ] Family Sharing setting matches the product decision (legal §6) and is reflected in the copy if on.

## 9. Settings

- [ ] Sections: Aircraft (tail, make/model, IFR, for hire, avg hours/month) · Notifications (60/30/7-day and 10/5-hr toggles, quiet hours) · Co-owners (share, participants) · Subscription (plan, renewal date, **Manage Subscription** → `manageSubscriptionsSheet`, **Restore Purchases**, **Redeem Code**) · Data (iCloud status, export all data as JSON/PDF, delete aircraft) · About (version, engine version, rule interpretations, long-form disclaimer, Terms, Privacy, Contact support, Acknowledgements).
- [ ] The disclaimer is in About in full (legal §1).
- [ ] "Rule interpretations" lists each rule's reading (the README table), so an IA can review them.
- [ ] Delete aircraft: a two-step confirmation that names the tail number ("Delete N731TB and its 42 scans?").
- [ ] Notification toggles reflect the system permission. If denied, show "Notifications are off in iOS Settings" + an **Open Settings** button.
- [ ] Support email is prefilled with app version, engine version and iOS version (no aircraft data unless the user adds it).
- [ ] All rows are at least 44 pt and use system `Form` styling with `TB.canvas` background. Toggles have labels VoiceOver can read.
