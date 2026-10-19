# TailBook iOS UX Review (MVP build)

**Reviewed:** 2026-10-19, against `design/IOS-UX-REVIEW-CHECKLIST.md`, `design/DESIGN-SYSTEM.md` and `design/tokens.json`.
**Scope:** every screen in `ios/TailBook/Views`. This was a code review; nothing ran on a device because there's no Swift toolchain here. All fixes are small edits that use only stable iOS 17 APIs. CI on macOS has the final say.

## Summary

The MVP is in good shape on the things that matter most. "Airworthy" never appears as a verdict. The disclaimer sits under the hero, is acknowledged on the welcome screen, and appears in About, the paywall, item detail, Reports and every PDF. Rows pair a glyph shape with a word and a color. The paywall uses Apple's `SubscriptionStoreView`, which shows localized price, period and trial terms, plus Restore, Redeem Code and Terms/Privacy.

The real problems were:
- **Status colors failed AA contrast.** The old yellow was 3.6:1 and the old green 4.4:1 on white.
- **The hero used a seal glyph.** A seal reads like a certification stamp.
- **One summary answer didn't match the DS.** It said "Limited" where the DS says "Not all".
- **Squawks couldn't be deleted at all.** Adding `.swipeActions` silently turns off `.onDelete`.
- **Swipe-delete on ADs had no confirmation.**
- **Primary buttons in dark mode put white text on light blue,** at 2.5:1.
- **The Log flight tach field used a fixed font size.**
- **Save accepted a tach lower than the current one.**
- **The paywall had no auto-renew sentence.**

All of these are fixed. Deferred items are listed at the end.

## Colors: tokens vs. the build

| Asset | Before (light / dark) | Token now (light / dark) | Notes |
|---|---|---|---|
| StatusRed | #C62828 / #FF6B6B | `overdue` #A3142A / #FF8A80 | 7.8:1 on white |
| StatusYellow | #B77920 / #F6C343 | `dueSoon` #8A5300 / #FFC266 | **was 3.6:1 (failed AA for row values)**, now 6.3:1 |
| StatusGreen | #1E8A44 / #3DDC84 | `current` #0B6A52 / #6BE3BC | **was 4.4:1**, now 6.6:1 |
| AccentColor | #0A6E91 / #4FC3E8 | `accent` #1F5FD1 / #5AA9FF | Matches the landing page and the DS |
| OnAccent (new) | — | `onAccent` #FFFFFF / #06121F | Label on prominent buttons; dark-mode CTA goes from 2.5:1 to over 7:1 |
| PanelBackground | #EEF2F5 / #1B2128 | (close to `surface2`) | Left as is; only used for the welcome card |

The status assets hold the **text** tokens, not the `*Fill` tokens, because the app uses them for both glyphs and the colored values. `Theme.swift` uses `Color.secondary` for N/A and unknown, which works as the neutral token. The PDF status colors in `PDFExporter.statusColor` now use the same light text tokens. The old yellow there was 3.4:1 at 9 pt.

## Findings

Severity: **H** = App Review or legal risk, broken function, or an accessibility failure. **M** = clear UX or a11y gap. **L** = polish.

| # | Screen | Issue | Sev | Fixed? |
|---|---|---|---|---|
| 1 | All (assets) | StatusYellow/StatusGreen failed WCAG AA as text; status colors didn't match the tokens | H | y |
| 2 | All (assets) | AccentColor (teal) differed from the token accent used on the landing page and in screenshots | M | y |
| 3 | Board, Onboarding | Dark mode: white label on light accent fill (2.5:1) on the Log flight, Next/Show my board and "I understand" buttons | H | y (new `OnAccent` color) |
| 4 | Board (hero) | `.current` summary glyph was `checkmark.seal.fill`, which reads as a certification seal; the DS says circle check | H | y |
| 5 | Board (hero) | The limited answer said "Limited"; DS §5 says "Not all" (also in the PDF) | M | y |
| 6 | Board (hero) | The hero glyph used a fixed `.system(size: 34)` and didn't scale with Dynamic Type | L | y (`.largeTitle`) |
| 7 | Board (hero) | Count badges were plain colored dots, so status relied on color plus a word with no shape | M | y (status glyphs) |
| 8 | Board (hero) | The hero wasn't marked as a header for VoiceOver rotor navigation | L | y |
| 9 | Board rows | The row wasn't explicitly one VoiceOver element | L | y (`.combine`) |
| 10 | Board | Disclaimer under the hero, and "never airworthy" wording | — | pass |
| 11 | Item detail | The header (glyph + status + "current through") read as separate VoiceOver stops | L | y |
| 12 | Item detail | The engine message under the header shows ISO dates ("Due by 2026-10-31 (12 days)") | L | n (deferred) |
| 13 | Onboarding | No visible or announced "Step N of 4", only an unlabeled progress bar | M | y |
| 14 | Onboarding / date fields | The "Don't know yet" link was a caption-size borderless button under 44 pt | M | y (`minHeight: 44`) |
| 15 | Onboarding | Return doesn't move to the next field | L | n |
| 16 | ADs & Items | Swipe-to-delete removed an AD with no confirmation (checklist §4: never in a swipe) | H | y (swipe removed; delete stays in the editor with a confirmation) |
| 17 | ADs & Items | The row status glyph had no VoiceOver label | M | y |
| 18 | ADs & Items | The empty state lacked "TailBook doesn't determine whether an AD applies" | M | y |
| 19 | AD editor | Save is enabled with only a name; no live "Next due … whichever first" preview | M | n (deferred) |
| 20 | AD editor | No "Discard changes?" guard on swipe-down while dirty | M | n (deferred) |
| 21 | Log flight | The tach field used a fixed 44-pt font, so no Dynamic Type | M | y (`.largeTitle` rounded) |
| 22 | Log flight | Save stayed enabled when the new tach was lower than the current one | M | y |
| 23 | Log flight | Save label isn't "Log 1.2 hrs"; no confirmation banner after saving | L | n |
| 24 | Squawks | Squawks couldn't be deleted: `.swipeActions` turns off `.onDelete` | H | y (Delete swipe with confirmation) |
| 25 | Squawks | Open squawks used StatusYellow, which suggests they affect board status | M | y (accent) |
| 26 | Squawks | The icon had no VoiceOver label (Open/Closed) | L | y |
| 27 | Squawks | No "Create work order" button on this tab (it lives in Reports) | L | n |
| 28 | Reports / PDF | PDF status word colors failed AA at 9 pt | M | y |
| 29 | Reports / PDF | Footer reads "Page 1", not "Page 1 of N"; the footer disclaimer is the short form (the long form is printed once at the top) | L | n |
| 30 | Paywall | No explicit auto-renew / cancel sentence. `SubscriptionStoreView` covers price and trial, but this guards against 3.1.2 rejections | H | y |
| 31 | Paywall | "New subscribers get a 14-day free trial" ignored eligibility | M | y ("eligible new subscribers") |
| 32 | Paywall | Terms/Privacy links were footnote-height tap targets | M | y (`minHeight: 44`) |
| 33 | Paywall | The anchor names a competitor with an undated price ("SavvyMx ~$750/yr", `AppConfig.anchorCompetitor`). The listing avoids competitor names (2.3.7), and checklist §8.2 asks for factual, dated anchors or the neutral "one annual inspection" anchor | H | n (founder decision) |
| 34 | Settings | The delete-aircraft confirmation didn't name the tail number | M | y |
| 35 | Settings | Restore Purchases showed no result | M | y ("Restored" / "Nothing to restore") |
| 36 | Settings | The selected aircraft checkmark had no `.isSelected` trait | L | y |
| 37 | Settings | Notification toggles (60/30/7), "Rule interpretations", and a prefilled support email are missing | L | n |

## Deferred, deliberately

- **#33 competitor anchor:** this is a pricing and legal call. The safest change is to set `AppConfig.anchorCompetitor` and `priceAnchorLine` to a neutral line ("For scale: one annual inspection typically runs $2,500–$4,500"), or to drop the line.
- **#19 / #20 AD editor validation and the dirty-dismiss guard:** these need new state and draft-equality logic. That's more than a surgical edit without a compiler. The engine already shows incomplete items as "Needs info", so this is not unsafe.
- **#12 ISO dates in the engine message:** this comes from the shared engine strings (golden vectors). Fix it in the view layer later, or hide the line, since "Current through…" already says the same thing.
- **#15, #23, #27, #29, #37:** polish for v1.1.
- **Primary buttons inside system views** (`ContentUnavailableView` actions, `LockedFeatureView`, RemindersPromptCard): these still use the default white label on the accent. In dark mode that's 2.5:1. Apply `.foregroundStyle(Theme.onAccent)` to their labels in a follow-up.
- **Device pass still needed:** AX5 layout, Increase Contrast, Reduce Motion and the VoiceOver reading order can only be checked on a simulator. Run the checklist's "How to review" pass once CI is green.

## App Store screenshots

The old mockups showed features the MVP doesn't have:
- a **Logbooks** tab and logbook scans ("Scanned … text searchable", "Proof", "History");
- "Snap the logbook entry";
- co-owner "Pilot: Me";
- a live "Oil change → hrs left" preview inside Log flight;
- "Send to my IA" and Print buttons;
- a 5-step onboarding with Skip;
- a design-system board layout the build doesn't use.

Apple rejects screenshots like these (2.3.3 / 2.3.1).

`design/appstore-screenshots/render.mjs` now rebuilds all six from the real views. The PNGs and `src/*.html` are regenerated (`node design/appstore-screenshots/render.mjs`).
- The tab bar is the real one: **Status · ADs & Items · Squawks · Reports · Settings**. It has the same SF Symbols as `RootView.MainTabView`.
- The screens use system grouped lists and the real strings from `Formatting.swift`, `ItemDetailView`, `TrackedItemEditor`, `LogFlightSheet` and `PDFExporter`. Values come from the JS engine.
  1. Status board: the hero, the disclaimer under it, sorted rows and Log flight.
  2. Item detail for Transponder: the rule, the eCFR link and the Mark done / Edit actions.
  3. Setup: the "Inspections & dates" step, "Step 3 of 4", and "Don't know yet / Set date". It replaces the invented calendar and camera screen; the file name is unchanged.
  4. AD editor: recurring, whichever first.
  5. Log flight sheet: quick-add chips and the decimal pad.
  6. Aircraft Status Report PDF preview, laid out like `PDFExporter`.

**Before submission, the founder should replace these mockups with real simulator captures.** Use an iPhone 16 Pro Max (6.9") and Welcome → "Explore a sample aircraft". The sample is **N182TB**; the mockups show a user aircraft, N731TB. Keep the marketing captions, and capture the same six screens. The app also supports iPad, so App Store Connect needs **13" iPad** screenshots too.
