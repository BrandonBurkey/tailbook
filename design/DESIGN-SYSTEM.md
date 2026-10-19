# TailBook Design System v1.0

TailBook answers one question, **"All items current?"**, in under two seconds. Everything below serves that answer.

**Character:** a well-made instrument panel. It is calm, exact and quiet until something needs attention. There is no cartoon, no confetti and no gradients on data. Color is spent only on status. Everything else is ink on a neutral surface.

**Audience:** US Part 91 owners, aged 40–70, often reading at arm's length, in sunlight on a ramp, or with progressive lenses. Readability always wins over density.

| File | What it is |
|---|---|
| `design/tokens.json` | The single source of color values (light and dark) |
| `design/scripts/check-contrast.mjs` | Verifies WCAG contrast and color-blind separation. Run `node design/scripts/check-contrast.mjs`. It exits 1 on any failure. |
| `design/TailBookTheme.swift` | Drop-in SwiftUI tokens and components (Foundation + SwiftUI only, iOS 17) |
| `design/IOS-UX-REVIEW-CHECKLIST.md` | Screen-by-screen review checklist, onboarding wireframes and paywall layout |
| `design/appstore-screenshots/` | App Store screenshot mockups (1290×2796) and their HTML source |

---

## 1. Principles

1. **Answer first.** The hero card shows the answer ("Yes", "Not all", "No" or "Can't tell yet") before any list.
2. **Never a verdict on airworthiness.** We never use "Airworthy", "Legal to fly" or "Safe" as a status, headline, badge, widget or notification. The question is always "All items current?", and the disclaimer sits next to the answer (`validation/07-legal-and-appstore.md` §1, App Store 1.4 and 2.3).
3. **Show your work.** Every item shows its 14 CFR citation, and the rule text is one tap away. Numbers are exact, monospaced and come with units.
4. **Status is said three ways:** shape (icon), word (tag) and color. Color alone never carries meaning.
5. **Calm by default.** Green items are visually quiet. Red and yellow get color. Neutral items recede.
6. **Big type is a first-class layout,** not a degraded one. Every screen is designed at AX5 too.

---

## 2. Color

All values are sRGB hex. Light and dark mode are both first-class. Status text colors are tuned per mode, not just inverted.

### 2.1 Neutrals and brand

| Token | Light | Dark | Use |
|---|---|---|---|
| `canvas` | `#F2F4F7` | `#090D12` | Screen background (grouped) |
| `surface` | `#FFFFFF` | `#121922` | Cards and rows |
| `surface2` | `#F7F8FA` | `#18212C` | Card header and footer strips, input fills |
| `line` | `#DCE1E8` | `#243040` | Hairline dividers and card borders |
| `line2` | `#C5CDD8` | `#334155` | Input borders and secondary-button borders |
| `ink` | `#0E1621` | `#E8EDF3` | Primary text and all numbers |
| `ink2` | `#384455` | `#B7C1CD` | Secondary text (row detail, headline) |
| `ink3` | `#5B6676` | `#8E99A8` | Tertiary text (citations, overlines, units, disclaimer) |
| `accent` | `#1F5FD1` | `#5AA9FF` | Primary buttons, links, selection, focus |
| `accentPressed` | `#174AA6` | `#86C0FF` | Pressed primary button |
| `onAccent` | `#FFFFFF` | `#06121F` | Label on an accent fill |
| `accentSoft` | `#E8EFFB` | `#132A45` | Selected-row tint, pressed secondary button |

`accent` is "instrument blue". It is never used for status, so a blue element is always something you can tap.

### 2.2 Status

Each status has three roles:

- `text` is for words and numbers and needs at least 4.5:1 contrast.
- `fill` is for the icon or lamp and needs at least 3:1 against any surface (WCAG 1.4.11).
- `bg` is the tag tint behind `text`.

| Status (engine) | Shape (SF Symbol) | Tag | text L / D | fill L / D | bg L / D |
|---|---|---|---|---|---|
| `overdue` (red) | `xmark.octagon.fill` (octagon) | OVERDUE | `#A3142A` / `#FF8A80` | `#B4152B` / `#FF5A4F` | `#FDECEA` / `#3A1A1C` |
| `due_soon` (yellow) | `exclamationmark.triangle.fill` (triangle) | DUE SOON | `#8A5300` / `#FFC266` | `#B97700` / `#FFB224` | `#FFF3D6` / `#36290F` |
| `ok` (green) | `checkmark.circle.fill` (circle) | CURRENT | `#0B6A52` / `#6BE3BC` | `#129070` / `#4BE0B0` | `#E1F4EE` / `#0D2E26` |
| `unknown` | `questionmark.circle` (outline) | NEEDS DATE | `#5B6676` / `#9AA5B3` | `#7D8898` / `#6B7686` | `#EEF1F4` / `#1C242F` |
| `not_applicable` | `minus.circle` (outline) | N/A | same as unknown | same | same |

Notes:

- **Green leans teal and red leans crimson on purpose.** This pulls them apart for protanopes and deuteranopes. Light-mode red is also darker than green, so the two differ in lightness as well as hue.
- **"Yellow" is amber.** True yellow can't reach 3:1 on white. In light mode the fill is a deep amber (`#B97700`), and the text is darker still.
- **Outline vs. filled glyphs:** filled glyphs mean "this has a status", and outline glyphs mean "no status yet" or "doesn't apply".

### 2.3 Verification

Run `node design/scripts/check-contrast.mjs`. All 84 contrast checks and 18 color-vision checks pass. Lowest results:

| Check | Lowest result | Requirement |
|---|---|---|
| `ink3` text on `canvas` (light) | 5.28:1 | AA 4.5:1 |
| Status text on its own tag tint | 5.14:1 (neutral, light) | AA 4.5:1 |
| Status fill on `surface2` | 3.53:1 (neutral, dark); amber light 3.75:1 | 3:1 (non-text) |
| `onAccent` on `accent` | 5.81:1 (light), 7.68:1 (dark) | AA 4.5:1 |
| Red/amber/green separation, simulated protanopia, deuteranopia and tritanopia (Machado 2009, full severity), CIE76 ΔE | 26.5 (light protanopia, overdue vs. current) | ≥ 20 |

Increase Contrast (Settings → Accessibility): `TBColor` takes optional high-contrast values. `ink2`, `ink3`, `line`, `line2` and `accent` step one notch darker in light mode and lighter in dark mode. Status colors already exceed AA, so they don't change.

### 2.4 Color rules

- Never put status text on a status `fill`, such as white on red. Use `text` on `bg`.
- Never tint a whole row red. The icon, number and tag carry the status, and the row stays `surface`.
- Charts, if any arrive in v2: use `ink2` for series and status colors only to mark thresholds.
- No pure black (`#000`) backgrounds. The dark `canvas` is a blue-black so OLED smear doesn't flash when scrolling.

---

## 3. Typography

SF Pro (system) for text, and SF Mono (`design: .monospaced`) for citations, tail numbers, overlines and units. Every style is a Dynamic Type text style, so it scales to AX5. Numbers always use **monospaced digits** (`.monospacedDigit()`), so countdowns don't jitter and columns align.

| Token (`TBFont.`) | SwiftUI | Default size (Large) | Use |
|---|---|---|---|
| `heroAnswer` | `.largeTitle.weight(.bold)` | 34 | "Yes", "No", "Not all" |
| `title` | `.title2.weight(.semibold)` | 22 | In-content titles, empty-state titles |
| `sectionHeader` | `.headline` | 17 semibold | Board section headers ("Inspections", "ADs") |
| `rowTitle` | `.body.weight(.semibold)` | 17 | Item name |
| `rowDetail` | `.subheadline` | 15 | "Current through Oct 31, 2026", headline |
| `rowValue` | `.title3.weight(.semibold).monospacedDigit()` | 20 | Days/hours number on the right |
| `rowUnit` | `.caption2` monospaced, uppercase | 11 | "DAYS LEFT", "HRS LEFT", "DAYS OVER" |
| `citation` | `.caption` monospaced | 12 | "14 CFR §91.413" |
| `overline` | `.caption` monospaced medium, uppercase, tracking 1.2 | 12 | "ALL ITEMS CURRENT?", "NEXT DUE" |
| `tag` | `.caption2` monospaced semibold, uppercase | 11 | "DUE SOON" |
| `tail` | `.headline` monospaced | 17 | "N731TB" |
| `bodyNumeric` | `.body.monospacedDigit()` | 17 | Tach, Hobbs, dates in forms |
| `footnote` | `.footnote` | 13 | Subtitles, fine print |

Rules:

- **Minimum readable size is `caption` (12 pt).** `caption2` (11 pt) is allowed only for uppercase mono tags and units, which are always next to a larger number.
- **Dates:** "Oct 31, 2026" (`.dateTime.month(.abbreviated).day().year()`). Never use "10/31/26", since owners also read European dates. Show month-only dates (the ELT battery) as "Sep 2026".
- **Durations:** "12 days left", "4.5 hrs left", "19 days over". Show hours to one decimal place, and never show a negative sign.
- **Citations:** "14 CFR §91.413". Use a regular space after "CFR". Paragraph letters are lowercase in parentheses: "§91.409(a)".
- Don't use font weights above `.bold`, except `heroAnswer`.
- Line length in prose (rule text, onboarding copy) is about 60 characters at most. Use `.frame(maxWidth: 560)` on iPad.

---

## 4. Spacing, radius, elevation

**Spacing: a 4-pt grid** (`TB.Space`)

| Token | Value | Typical use |
|---|---|---|
| `xxs` | 2 | Title ↔ citation inside a row |
| `xs` | 4 | Overline ↔ answer |
| `s` | 8 | Icon ↔ tag; button stack gap |
| `m` | 12 | Row vertical padding; icon ↔ text |
| `l` | 16 | **Screen side margin**; row horizontal padding; card ↔ card |
| `xl` | 20 | Card inner padding (hero) |
| `xxl` | 24 | Section ↔ section |
| `xxxl` | 32 | Onboarding top/bottom breathing room |

**Radius** (`TB.Radius`, always `style: .continuous`): tag 6, control (buttons, fields) 12, card 16, sheet 24.

**Elevation:** flat. Cards get a 1-pt `line` border. Light mode may add `shadow(color: .black.opacity(0.04), radius: 12, y: 4)` on the hero card only. Dark mode has no shadows; separation comes from `surface` vs. `canvas`.

**Tap targets:** 44×44 pt minimum. Primary buttons are 52 pt tall and full width. Rows are at least 44 pt tall, and the whole row is tappable.

---

## 5. Component anatomy

### 5.1 Hero card ("All items current?")

```
┌──────────────────────────────────────────────┐
│ N731TB  Beechcraft A36 · IFR                 │  identity strip: tail (mono headline), subtitle (footnote, ink3)
├──────────────────────────────────────────────┤
│ ╔══╗  ALL ITEMS CURRENT?                     │  overline (mono caption, ink3)
│ ║⬣ ║  No                                     │  heroAnswer (largeTitle bold, status text color)
│ ╚══╝  Not all items current: ELT battery     │  headline from engine (subheadline, ink2)
│       overdue. 1 item due soon.              │
├──────────────────────────────────────────────┤
│ NEXT DUE                      ⬣ 1  ▲ 1  ● 6  │  surface2 strip: next due + counts (icon + number)
│ Transponder in 12 days                       │
├──────────────────────────────────────────────┤
│ TailBook organizes the dates you enter. Your │  disclaimer (caption, ink3): ALWAYS present
│ A&P/IA and the pilot in command determine…   │
└──────────────────────────────────────────────┘
```

- Answer words map from `summary.status`: current → **Yes**; limited → **Not all**; overdue → **No**; incomplete → **Can't tell yet**.
- The 44-pt icon uses the summary's status glyph: limited uses the triangle, overdue the octagon, current the circle check, incomplete the question mark.
- `limited` shows `affects` under the headline: "Affects IFR flight", in `ink2`.
- Counts are icon + number, never color dots alone. VoiceOver reads "1 overdue, 1 due soon, 6 current".
- At accessibility sizes, the next-due strip stacks vertically (`ViewThatFits`).
- Use the `TBHeroCard` component.

### 5.2 Status row

```
 ┌─icon─┐ ┌─────────── labels ───────────┐          ┌─ value block ─┐
   ▲       Transponder                                      12          rowValue (status text color; ink if green)
           14 CFR §91.413                                DAYS LEFT      rowUnit (ink3)
           Current through Oct 31, 2026                 [DUE SOON]      tag (status text on status bg)
 |16|22|12|                                       |≥8|              |16|
```

- Order on the board: overdue → due soon → current → needs date → N/A. Within a group, sort soonest first (the engine's `sortForBoard`).
- **Value:** days for date items, hours (one decimal) for hours items. If an item has both (whichever first), show whichever governs and put the other in the detail line: "or Mar 31, 2027".
- **Projected:** for hours items, append "· PROJ." to the unit, and the detail line reads "About Nov 30 at your pace".
- **Not applicable:** title in `ink3`, no value, detail = reason ("Not used for hire").
- **Green numbers use `ink`, not green.** That keeps the board calm and lets red and yellow stand out.
- Dividers are inset to the text column (leading 50 pt).
- **AX sizes (`isAccessibilitySize`):** the row stacks: icon + tag on line 1, labels, then the value + unit left-aligned. Nothing truncates; every line wraps.
- **Tap:** pushes Item Detail. **Swipe actions:** "Log done" (accent) on the trailing edge. There are no destructive swipes on the board.
- Use the `TBStatusRow` component with a `TBStatusRowModel`.

### 5.3 Buttons

| Style | Look | Use |
|---|---|---|
| `TBPrimaryButtonStyle` | Accent fill, 52 pt, radius 12, headline | One per screen: "Continue", "Start 14-day free trial", "Save" |
| `TBSecondaryButtonStyle` | Surface fill, `line2` border, accent label | "Snap the sticker", "Restore Purchases" |
| Plain text button | Accent label, 44-pt hit area | "Skip", "Don't know", "Terms" |
| Destructive | `.role(.destructive)` system red, only in confirmation dialogs and swipe-to-delete in editors | "Delete AD" |

### 5.4 Form fields (onboarding, AD editor, log flight)

- Use system `Form`/`List` styling on `canvas`. Labels are above fields, not placeholder-only. The citation sits on the label's trailing side in the `citation` font.
- Dates: `DatePicker(.compact)` in Forms, and `.graphical` in onboarding steps where the date is the whole screen. Month-only (the ELT battery): a custom month/year wheel.
- Tach and Hobbs: `TextField` with `.keyboardType(.decimalPad)` and `bodyNumeric`. Show the last value as a hint ("Last: 1,250.4"). Validate that the new value is ≥ the last one, with an inline error in `overdue` text and the `exclamationmark.circle` symbol.
- Every field offers a "Don't know" escape that leaves the item `unknown`. It never blocks.

---

## 6. Iconography (SF Symbols)

Use **SF Symbols only** (no custom glyph font), at weight `.regular` or `.medium`, scaled with the text style next to it. Status glyphs use `.foregroundStyle(status.fill)` (monochrome rendering).

| Meaning | Symbol |
|---|---|
| Overdue | `xmark.octagon.fill` |
| Due soon | `exclamationmark.triangle.fill` |
| Current | `checkmark.circle.fill` |
| Needs date | `questionmark.circle` |
| Not applicable | `minus.circle` |
| Projected (hours forecast) | `chart.line.uptrend.xyaxis` (small, inline) |
| Annual / 100-hr inspection | `wrench.and.screwdriver` |
| Transponder | `dot.radiowaves.left.and.right` |
| Altimeter / pitot-static | `gauge.with.dots.needle.33percent` |
| ELT | `antenna.radiowaves.left.and.right` |
| ELT battery | `battery.75percent` |
| VOR check | `location.north.line` |
| Registration | `doc.text` |
| Oil change | `drop` |
| AD / SB | `exclamationmark.shield` |
| Custom item | `square.and.pencil` |
| Log flight (tach/Hobbs) | `gauge.with.needle` (primary action: `plus.circle.fill`) |
| Squawks | `list.bullet.clipboard` |
| Logbook scan | `doc.viewfinder` |
| PDF / share | `square.and.arrow.up` |
| Rule / citation link | `book.closed` |
| Co-owners | `person.2` |
| Notifications | `bell.badge` |
| Settings | `gearshape` |
| iCloud sync ok / issue | `checkmark.icloud` / `exclamationmark.icloud` |
| Restore purchases | `arrow.clockwise` |

Never use `airplane` as a status indicator. It is fine as the app-icon motif and on the empty board.

---

## 7. Motion

Motion explains change. It never decorates.

| Moment | Animation | Reduce Motion |
|---|---|---|
| Item status changes (after logging a flight or editing a date) | `TB.Motion.status`: 0.35 s ease-out cross-fade of icon, tag and number. `contentTransition(.numericText())` on the value. | Instant |
| Row reorders after a status change | `TB.Motion.standard` (0.25 s) list move | Instant |
| Board reveal at the end of onboarding | `TB.Motion.reveal`: hero card fades and rises 12 pt, then rows stagger by 40 ms, worst first (≤ 600 ms in total) | Cross-fade only |
| Sheet presentation | System | System |
| Loading skeleton | 0.9 s opacity pulse | Static |

There are no bounces, no confetti on "Yes", no looping animation on red items, and nothing that blinks.

---

## 8. Haptics

Haptics are used sparingly and always tied to a user action or a state change they caused (SwiftUI `.sensoryFeedback`, iOS 17).

| Event | Feedback |
|---|---|
| Board summary changes to current after the user's action | `.success` |
| Summary changes to limited | `.warning` |
| Summary changes to overdue | `.error` |
| Onboarding step completed / date picked | `.selection` |
| Flight logged (tach saved) | `.impact(weight: .light)` |
| Validation error (tach lower than last) | `.error` |
| Purchase completed | `.success` |

There are no haptics on app launch, scroll or notification arrival. `tbStatusHaptic(_:)` triggers only when the value changes, not on first appearance.

---

## 9. Empty, loading and error states

Use `TBStateView(symbol:title:message:actions:)`. The copy is plain, specific and never blames the user.

| State | Symbol | Title | Message | Actions |
|---|---|---|---|---|
| No aircraft yet | `airplane` | Add your aircraft | Answer about 8 questions and see what's coming due. It takes under 5 minutes. | **Add aircraft** (primary) · Try a sample aircraft |
| Board with all items unknown | `questionmark.circle` | Add your first dates | Start with your last annual. Skip anything you don't know. | **Add dates** |
| No ADs | `exclamationmark.shield` | No recurring ADs tracked | Add the recurring ADs that apply to your aircraft. TailBook doesn't determine AD applicability; ask your IA. | **Add an AD** |
| No squawks | `list.bullet.clipboard` | No open squawks | Note anything you want your shop to look at. It goes on the annual work order. | **Add squawk** |
| Search, no results | `magnifyingglass` | No matches | Try a different word, or check the spelling of the AD number. | — |
| Loading (> 300 ms only) | — | — | 4 `TBSkeletonRow`s under a skeleton hero card | — |
| iCloud unavailable | `exclamationmark.icloud` | iCloud is off | Your data is saved on this iPhone. Turn on iCloud to sync with iPad and co-owners. | **Open Settings** · Not now |
| Sync conflict | `arrow.triangle.2.circlepath` | A co-owner changed this item | Pick which version to keep. | Keep mine · Keep theirs |
| PDF failed | `exclamationmark.triangle` | Couldn't create the PDF | Nothing was lost. Try again. If it keeps failing, email support from Settings. | **Try again** |
| Purchase failed | `exclamationmark.triangle` | Purchase didn't go through | You weren't charged. | **Try again** · Restore Purchases |
| Offline | — | Inline banner, not a full screen: "Offline: changes will sync later" (`ink2` on `surface2`) | — | — |

Errors are shown inline next to the cause wherever possible. Alerts are reserved for destructive confirmations.

---

## 10. Accessibility

**Dynamic Type, up to AX5**

- Use only text styles. Never use fixed font sizes for text (the fixed sizes in `TBStateView` apply to the symbol only).
- `TBStatusRow` and `TBHeroCard` switch layout at `dynamicTypeSize.isAccessibilitySize`. Every screen is reviewed at xSmall, Large (default), xxxLarge, AX3 and AX5.
- No `lineLimit(1)` on user content (item names, AD numbers, headline). Tags and units use `fixedSize()` and sit on their own line at AX sizes.
- Size icons with `@ScaledMetric`. Buttons grow with text: use `minHeight`, not fixed heights.
- Horizontal scroll is never required to read a row.

**VoiceOver**

- **Status rows are a single element.** The label reads, status first:
  "**Transponder. Due soon. 12 days left. Current through Oct 31, 2026. 14 C F R section 91.413.**"
  Hint: "Opens details and the rule." Trait: button.
  Overdue: "ELT battery. Overdue. 19 days over. Expired after Sep 30, 2026. 14 C F R section 91.207 c."
  Hours: "Oil change. Current. 32.0 hours left, projected. About Nov 30 at your pace. Engine manufacturer."
- The hero card has a header trait: "All items current? No. Not all items current: ELT battery overdue. 1 item due soon."
- Counts read "1 overdue, 1 due soon, 6 current". Decorative icons are `accessibilityHidden`.
- Custom actions on rows: "Log done", "Open rule", "Show logbook page".
- Board rotor: section headings ("Overdue", "Due soon", "Current") are headers.
- When logging a flight changes a status, post an announcement: "Oil change is now due soon."

**Other**

- Contrast: see §2.3, including Increase Contrast.
- Respect Reduce Motion (§7), Reduce Transparency (no blurs behind text; use solid `surface`) and Bold Text (system styles handle it).
- Color is never the only signal (shape + word + color), as verified in §2.3.
- Hit areas are at least 44×44 pt, including the "i" info buttons and the citation links.
- Localization-ready: no text baked into images. Dates and numbers use `FormatStyle`.
- Widgets: the lock-screen widget shows the glyph + "All current" / "1 overdue", never color alone, and never "Airworthy".

---

## 11. Voice and microcopy

| Say | Don't say |
|---|---|
| All items current? **Yes** | Airworthy ✓ / Legal to fly / Safe |
| Not all items current: ELT battery overdue | You're grounded / Illegal |
| Due soon · 12 days left | Hurry! / Urgent! |
| Current through Oct 31, 2026 | Valid / Approved / Compliant |
| Based on the dates you entered | Guaranteed / Certified |
| Ask your IA whether this AD applies | This AD applies to your aircraft |

Use sentence case everywhere except overlines and tags (uppercase mono). Numbers are always digits.
