# TailBook for iOS (MVP)

Native SwiftUI app for US Part 91 aircraft owners: an **"All items current?"** status board with a FAR citation on every item, an AD / recurring-item tracker, a quick tach log (plus Siri), squawks, two on-device PDFs, 60/30/7-day reminders and a StoreKit 2 subscription. No backend, no accounts, no analytics.

> **Built without a compiler.** This code was written on a Linux machine with no Swift toolchain. It was reviewed line by line against the iOS 17 / Xcode 16 APIs, and the engine's logic was cross-checked against all 97 golden vectors through a line-for-line mirror. The first real compile happens on your Mac or in GitHub Actions (`.github/workflows/ios.yml`). If something doesn't compile, it will most likely be one of the spots listed under [Known risks](#known-risks).

## Layout

```
ios/
  project.yml                 XcodeGen spec (the .xcodeproj is generated; don't commit it)
  TailBook.storekit           Local StoreKit config: annual $199.99 (14-day trial) + monthly $24.99
  Packages/TailBookEngine/    Swift package: the pure, Foundation-only rules engine
    Sources/TailBookEngine/   CivilDate (date math), Rules, Profile (input), Results, Engine
    Tests/TailBookEngineTests GoldenVectorTests (every vector), EngineInvariantTests, Resources/test-vectors.json
  TailBook/
    App/                      TailBookApp, RootView/MainTabView, AppConfig (URLs, product IDs, Legal text)
    Models/                   SwiftData @Models (Aircraft, TrackedItem, TachEntry, Squawk), drafts, Aircraft+Engine bridge
    Services/                 Entitlements, StoreService (StoreKit 2), NotificationService, PDFExporter, AppEvents
    Intents/                  LogTachIntent + App Shortcuts ("Log tach time in TailBook")
    Views/                    Onboarding, Board, Items (ADs), Squawks, Reports, Paywall, Settings, Components
    Resources/                Assets.xcassets (AccentColor, status colors, AppIcon), PrivacyInfo.xcprivacy
  TailBookTests/              EntitlementTests, ModelTests (also compiles the engine's golden-vector tests)
  scripts/sync-vectors.sh     Copies engine/test-vectors.json into the Swift test bundle
```

The engine (`TailBookEngine`) has no SwiftUI, SwiftData or clock. "Today" is passed in, so it is deterministic, and `swift test` runs on any Mac.

## Build and run on a Mac (about 10 minutes)

Requirements: macOS 14.5 or later, **Xcode 16** (from the App Store), and Homebrew.

```sh
brew install xcodegen
cd app-venture/ios
xcodegen generate            # creates TailBook.xcodeproj from project.yml
open TailBook.xcodeproj
```

1. In Xcode, select the **TailBook** target → **Signing & Capabilities** → choose your **Team**. Keep the bundle ID `com.tailbook.app`, or change it here and in App Store Connect. To make the team survive regeneration, put your Team ID in `DEVELOPMENT_TEAM` in `project.yml`.
2. Pick an iPhone simulator (or your phone) and press **⌘R**.
3. Press **⌘U** to run the tests. TailBookTests includes the engine's golden-vector runner, so ⌘U checks JS/Swift parity on every case in `engine/test-vectors.json`.
4. To test only the engine: `swift test --package-path Packages/TailBookEngine`.

Run `xcodegen generate` again whenever you add or remove files. Edit `project.yml`, never the generated project.

### StoreKit local testing

The **TailBook** scheme's Run action uses `TailBook.storekit` (set in `project.yml`), so the paywall shows real-looking products in the simulator without App Store Connect.

- **Debug → StoreKit → Manage Transactions** shows, refunds and expires purchases.
- Editor → **Subscription Renewal Rate** speeds renewals up.
- To retest the trial, delete the transactions, or erase the simulator.
- To check the free tier, remove all transactions. To force Pro without StoreKit, set `AppConfig.debugForcePro = true` (Debug builds only; a unit test fails if it's left on).

### Changing the rules

The JS engine (`engine/tailbook-engine.js`) is the reference. When a rule changes:

1. Change the JS engine and its vectors (`npm run vectors`, `npm test`).
2. Port the change into `Packages/TailBookEngine/Sources/TailBookEngine/Engine.swift`.
3. Run `ios/scripts/sync-vectors.sh`. CI fails if the two copies of the vectors differ.
4. Run `swift test`.

## What's in the MVP

| # | Feature | Status | Where |
|---|---|---|---|
| 1 | Onboarding in under 5 minutes: disclaimer with "I understand", make/model (free text + 6 presets), tail, IFR, for hire, tach/Hobbs, average hours/month, all dates with **"Don't know yet"** (gives *Needs info*, never a crash), multiple aircraft, plus a **sample aircraft** for App Review | Done | `Views/Onboarding` |
| 2 | Status board: hero **"All items current?"** (Yes / No / Limited / Can't tell yet, never "airworthy") with the disclaimer directly below; rows sorted by urgency with FAR citation, "Current through" date and days or hours left; projected dates for hours items; "Next due" in the header; detail with the plain-English rule, the eCFR link, **Mark done today** and **Edit date** | Done | `Views/Board` |
| 3 | AD / recurring tracker: ADs (recurring or one-time, applicability) and custom items; intervals in hours, calendar months, months, days or whichever-first; compliance note | Done | `Views/Items` |
| 4 | Quick tach log: big "Log flight" sheet with quick-add chips; history drives average utilization after 30 days; **App Intent "Log tach time"** for Siri and Shortcuts | Done | `LogFlightSheet`, `Intents/` |
| 5 | Squawks (open/closed) and two PDFs via ShareLink: **Annual Work Order** (open squawks + items coming due) and **Aircraft Status Report** (every item, date, citation, disclaimer on every page) | Done | `Views/Squawks`, `Views/Reports`, `PDFExporter` |
| 6 | Local reminders at 60/30/7 days before each calendar item, rescheduled on every change and on foreground; permission asked behind "Get warned before anything lapses". StoreKit 2 paywall shown **after** the board, with Restore, Redeem Code, Terms/Privacy and the price anchor. One `Entitlements` type decides free vs Pro | Done | `NotificationService`, `PaywallView`, `Entitlements` |

**Free vs Pro** (`Services/Entitlements.swift`): free is one aircraft, set up once, with the board view-only. Pro adds editing after setup, mark done, ADs and custom items, tach log and Siri, squawks, PDFs, reminders and multiple aircraft. To move a feature to the free tier, add it to `freeFeatures`.

**Out of scope (as specified):** logbook scanning, widgets, CloudKit sync/sharing, accounts, analytics, hour-based (10/5 hr) push alerts.

### Decisions I made

- **Engine as a local Swift package** that the app depends on. The golden-vector test files are compiled into both `swift test` and the Xcode test target (one source, `#if SWIFT_PACKAGE` picks the bundle).
- **Dates:** SwiftData stores `Date`s. They cross into the engine as civil days in the user's current calendar (`CivilDate.from`), so a date picked as Mar 15 is Mar 15 in any time zone.
- **ELT battery:** "Sticker shows month only" is on by default, so the date is sent as `YYYY-MM` and reads as the end of the month, like the JS engine.
- **Utilization:** the owner's estimate is used until the tach log spans 30 days. After that the log's average is used, and the board footer says which.
- **100-hour "Mark done" past the limit** stores the limit that was in force (`previousDueTach`), so the excess carries forward automatically (§91.409(b)). Marking the annual done records the tach, which also resets the 100-hour, as in the engine.
- **Reminders** go out only for date-governed items that are still current, at 09:00 local, capped at 60 pending (iOS allows 64). Hours-based items show projections on the board but don't schedule reminders (status never depends on a forecast).
- **Paywall:** Apple's `SubscriptionStoreView`, so price, period, trial eligibility and localization are handled by StoreKit. The anchor line shows the live annual price once products load (`SavvyMx ~$750/yr · TailBook $199.99/yr`) and falls back to the static `AppConfig.priceAnchorLine`.
- **App Intent** checks the Pro entitlement directly from `Transaction.currentEntitlements` and writes to the same SwiftData container as the UI.
- **Swift 5 language mode** with minimal concurrency checking (`SWIFT_VERSION 5.0`), the safest setting for code that hasn't been compiled yet. Turn on Swift 6 mode later, deliberately.

### Deviations from the JS engine (all intentional, none affect the vectors)

| JS | Swift | Why |
|---|---|---|
| Dates are strings | `CivilDate` struct, with string API `DateMath.*` mirroring the JS exports | Type safety; vectors are run against both |
| Interval month/day counts accept any number | `Int` | Fractional months aren't meaningful (JS would produce odd dates) |
| `normalizeDate` on a bad one-time-AD `lastDoneDate` throws out of `evaluate` | The date is left out of the message | `evaluate` never throws on owner data |
| `projectDate` with absurd hours produces an out-of-range string | Returns nil beyond 10 million days | No crash |
| `fmtHours` uses `toFixed(1)` | `String(format: "%.1f")` | Can differ only on exact binary ties (x.x5 exactly), which never occur after 0.1-hour rounding |
| — | `ref` on ADs/custom items → `EvaluatedItem.sourceRef`; `NextDue.sourceRef` | Lets the app map rows back to records |

The ICS export (`engine/ics.js`) isn't ported. Local notifications replace it in the app.

## App Store Connect checklist

**Before you start**
- [ ] Apple Developer Program membership (organization account under the LLC, so the seller name is the company).
- [ ] Replace the placeholder URLs in `TailBook/App/AppConfig.swift` (`termsURL`, `privacyURL`, `supportURL`, `supportEmail`) with live pages. Terms = Apple's Standard EULA + the supplemental terms in `validation/07-legal-and-appstore.md` §5, after the lawyer's review.
- [ ] Replace the placeholder app icon (`Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png`) with your final 1024×1024 PNG. It must be opaque (no alpha) and square-cornered (iOS rounds it). Keep the file name, or update `Contents.json`.
- [ ] Trademark check on "TailBook" (USPTO + App Store search).

**App record**
- [ ] New App → iOS, name, primary language English (U.S.), bundle ID `com.tailbook.app`, SKU.
- [ ] Category: **Utilities** (or Productivity). Age rating: 4+.
- [ ] Price: Free (the app is free to download; Pro is an in-app subscription).

**Subscriptions** (Features → Subscriptions)
- [ ] Create a subscription group **TailBook Pro** with a group display name.
- [ ] `com.tailbook.pro.annual`: 1 year, **$199.99**, introductory offer **Free trial, 2 weeks (14 days)**, new subscribers.
- [ ] `com.tailbook.pro.monthly`: 1 month, **$24.99**, no trial.
- [ ] Rank annual above monthly (level 1) in the group.
- [ ] A localized display name and description for each, plus a review screenshot of the paywall.
- [ ] **Family Sharing:** leave it OFF unless you decide otherwise. Once it's turned on, it can't be turned off.
- [ ] **Founding Owners offer codes:** in the annual subscription → Offer Codes, create an offer for Founding Owners (for example, pay-up-front first year at the founding price, or a free period worth the $49 deposit; check that the structure matches the deposit terms). Generate one-time codes (up to the yearly limit) and email them to depositors. The app redeems them via **Redeem Code** on the paywall and in Settings. No backend needed.
- [ ] Sign the Paid Applications agreement and add banking and tax information. Subscriptions don't work in TestFlight or review without it.

**App Privacy**
- [ ] Privacy Policy URL (the same as `AppConfig.privacyURL`).
- [ ] Data collection: **"Data Not Collected"**. TailBook has no servers, no analytics and no third-party SDKs, and all data stays on the device. Apple processes payments.
- [ ] `PrivacyInfo.xcprivacy` is included: no tracking, no collected data, UserDefaults required reason `CA92.1` (the app's own settings).

**Build and upload**
- [ ] Set the Team, bump `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` in `project.yml`, run `xcodegen generate`.
- [ ] Product → Archive (any iOS device) → Distribute App → App Store Connect → Upload.
- [ ] Export compliance: the app uses no non-exempt encryption (`ITSAppUsesNonExemptEncryption = NO` is already in the Info.plist).
- [ ] TestFlight: test purchases with a Sandbox account, test Restore, and test redeeming an offer code.

**Screenshots** (6.9" iPhone required; 13" iPad because the app supports iPad)
- [ ] Use the **sample aircraft** (Welcome → "Explore a sample aircraft"). Suggested set: the board (hero + rows), item detail (rule + citation), AD tracker, Log flight, Annual Work Order PDF preview, the paywall.
- [ ] Show real UI only; no claims such as "FAA approved" or "never fly illegal" in captions.

**Review notes** (paste into App Review Information; see `APP_STORE_LISTING.md`)
- [ ] Explain the disclaimer, the sample aircraft, that there's no login, and how to reach the paywall.

## Known risks

**Compile risks** (written without a compiler; CI is the first real build). These are the spots I'm least sure of, in rough order:
1. `PaywallView`: `.storeButton(.visible, for: .restorePurchases, .redeemCode, .policies, .cancellation)` and `.subscriptionStorePolicyDestination(url:for:)` are iOS 17 StoreKit-for-SwiftUI APIs. If `.policies` is rejected, delete it; the Terms/Privacy links in the marketing view remain.
2. `SettingsView`: `.offerCodeRedemption(isPresented:onCompletion:)`. If it's unavailable, replace it with `try await AppStore.presentOfferCodeRedeemSheet(in: windowScene)`.
3. `LogTachIntent`: `static let` for `title`, `description` and `openAppWhenRun` (Apple's samples often use `static var`; both satisfy a `{ get }` requirement).
4. Linking the engine package into both the app and the hosted test bundle. If you see duplicate-symbol or "implemented in both" issues, remove `- package: TailBookEngine` from the TailBookTests dependencies.
5. The code assumes Xcode 16, where `View` is `@MainActor`. Some view helpers call `@MainActor` services. On Xcode 15, add `@MainActor` to those views.
6. `TailBook.storekit` was hand-written in the version-3 format. If Xcode doesn't load it, recreate it in Xcode (File → New → StoreKit Configuration File) with the same two products.

**Product and review risks**
- **Guideline 1.4 / 2.3 (safety, accuracy):** the UI never states that an aircraft is airworthy. The hero reads "All items current?", the disclaimer sits under it and appears on every PDF page, and onboarding requires "I understand". Keep the metadata to "track / organize / remind".
- **Placeholder links** (`example.com`) will be rejected. Replace them first.
- **Rule interpretations** (calendar-month end of month, ELT battery date inclusive, VOR D+30, registration 7 years) mirror the JS engine and still need the IA advisor's sign-off.
- **The static anchor price** "$199/yr" is US-only wording. The live price replaces it once StoreKit loads.
- **No iCloud sync in v1:** deleting the app deletes the data. Say so on the support page. CloudKit is the next feature.
- **Hard paywall for editing:** free users can set up and see the board but can't mark items done. That's intended, but watch the trial-start rate (experiment E4).
