//
//  TailBookTheme.swift
//  TailBook design system, v1.0 (see design/DESIGN-SYSTEM.md)
//
//  Drop-in for the iOS app. Imports Foundation + SwiftUI only. Deployment target iOS 17
//  (it uses ShapeStyle.resolve(in:) for light/dark tokens and .sensoryFeedback for haptics).
//
//  Hex values mirror design/tokens.json, which is checked by
//  `node design/scripts/check-contrast.mjs` (WCAG AA + color-vision simulation).
//  If you change a value, change tokens.json first and rerun the check.
//
//  This file deliberately does NOT import TailBookEngine. Map engine values with
//  `TBStatus(engineRawValue: item.status.rawValue)` and
//  `TBSummaryStatus(engineRawValue: summary.status.rawValue)`.
//
//  Wording rule (validation/07-legal-and-appstore.md): never show "airworthy" or
//  "legal to fly" as a verdict. The summary question is "All items current?".
//

import Foundation
import SwiftUI

// MARK: - Color tokens

/// A light/dark color token. Use it anywhere SwiftUI takes a ShapeStyle:
/// `.foregroundStyle(TB.ink)`, `.background(TB.surface)`, `.fill(TB.Status.overdueFill)`.
/// When an API needs a concrete `Color` (shadow, Charts), call `color(for:)` with the
/// environment's `colorScheme`.
public struct TBColor: ShapeStyle, Sendable {
    public let light: UInt32
    public let dark: UInt32
    /// Optional overrides used when the user turns on Settings → Accessibility → Increase Contrast.
    public let lightHighContrast: UInt32?
    public let darkHighContrast: UInt32?

    public init(_ light: UInt32, _ dark: UInt32, highContrast: (light: UInt32, dark: UInt32)? = nil) {
        self.light = light
        self.dark = dark
        self.lightHighContrast = highContrast?.light
        self.darkHighContrast = highContrast?.dark
    }

    public func resolve(in environment: EnvironmentValues) -> Color {
        color(for: environment.colorScheme, contrast: environment.colorSchemeContrast)
    }

    public func color(for scheme: ColorScheme, contrast: ColorSchemeContrast = .standard) -> Color {
        let increased = (contrast == .increased)
        let value: UInt32
        if scheme == .dark {
            value = (increased ? darkHighContrast : nil) ?? dark
        } else {
            value = (increased ? lightHighContrast : nil) ?? light
        }
        return Color(tbHex: value)
    }
}

public extension Color {
    /// sRGB color from 0xRRGGBB.
    init(tbHex hex: UInt32, opacity: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: opacity
        )
    }
}

/// Namespace for every TailBook token.
public enum TB {
    // Surfaces
    public static let canvas = TBColor(0xF2F4F7, 0x090D12)        // screen background (grouped)
    public static let surface = TBColor(0xFFFFFF, 0x121922)       // cards, rows
    public static let surface2 = TBColor(0xF7F8FA, 0x18212C)      // card header/footer strips, inputs
    public static let line = TBColor(0xDCE1E8, 0x243040, highContrast: (0xB9C2CE, 0x3A4759))
    public static let line2 = TBColor(0xC5CDD8, 0x334155, highContrast: (0x9AA5B3, 0x4B5A70))

    // Text
    public static let ink = TBColor(0x0E1621, 0xE8EDF3)           // primary text, numbers
    public static let ink2 = TBColor(0x384455, 0xB7C1CD, highContrast: (0x1F2937, 0xD5DCE5))
    public static let ink3 = TBColor(0x5B6676, 0x8E99A8, highContrast: (0x384455, 0xB7C1CD))

    // Brand / interactive
    public static let accent = TBColor(0x1F5FD1, 0x5AA9FF, highContrast: (0x174AA6, 0x86C0FF))
    public static let accentPressed = TBColor(0x174AA6, 0x86C0FF)
    public static let onAccent = TBColor(0xFFFFFF, 0x06121F)
    public static let accentSoft = TBColor(0xE8EFFB, 0x132A45)

    /// Status colors. `text` is for words and numbers (>= 4.5:1), `fill` for icons/lamps
    /// (>= 3:1), `bg` for the tag tint behind `text`.
    public enum Status {
        public static let overdue = TBColor(0xA3142A, 0xFF8A80)
        public static let overdueFill = TBColor(0xB4152B, 0xFF5A4F)
        public static let overdueBg = TBColor(0xFDECEA, 0x3A1A1C)

        public static let dueSoon = TBColor(0x8A5300, 0xFFC266)
        public static let dueSoonFill = TBColor(0xB97700, 0xFFB224)
        public static let dueSoonBg = TBColor(0xFFF3D6, 0x36290F)

        public static let current = TBColor(0x0B6A52, 0x6BE3BC)
        public static let currentFill = TBColor(0x129070, 0x4BE0B0)
        public static let currentBg = TBColor(0xE1F4EE, 0x0D2E26)

        public static let neutral = TBColor(0x5B6676, 0x9AA5B3)
        public static let neutralFill = TBColor(0x7D8898, 0x6B7686)
        public static let neutralBg = TBColor(0xEEF1F4, 0x1C242F)
    }

    // MARK: Spacing (4-pt grid)
    public enum Space {
        public static let xxs: CGFloat = 2
        public static let xs: CGFloat = 4
        public static let s: CGFloat = 8
        public static let m: CGFloat = 12
        public static let l: CGFloat = 16      // screen side margin, row horizontal padding
        public static let xl: CGFloat = 20     // card padding
        public static let xxl: CGFloat = 24    // between sections
        public static let xxxl: CGFloat = 32
    }

    // MARK: Corner radius (always .continuous)
    public enum Radius {
        public static let tag: CGFloat = 6
        public static let control: CGFloat = 12   // buttons, text fields
        public static let card: CGFloat = 16      // board card, hero card
        public static let sheet: CGFloat = 24
    }

    // MARK: Sizes
    public enum Size {
        public static let minTapTarget: CGFloat = 44
        public static let primaryButtonHeight: CGFloat = 52
        public static let statusIcon: CGFloat = 22    // scale with @ScaledMetric(relativeTo: .body)
        public static let heroIcon: CGFloat = 44      // scale with @ScaledMetric(relativeTo: .title)
        public static let hairline: CGFloat = 1
    }

    // MARK: Motion
    public enum Motion {
        /// Standard UI transition (row insert, sheet content swap).
        public static let standard = Animation.easeInOut(duration: 0.25)
        /// Status change on the board (lamp/tag cross-fade). Calm, never bouncy.
        public static let status = Animation.easeOut(duration: 0.35)
        /// The one-time board reveal at the end of onboarding.
        public static let reveal = Animation.spring(response: 0.5, dampingFraction: 0.9)
        /// Use instead of any of the above when Reduce Motion is on.
        public static let reduced = Animation.linear(duration: 0.01)

        public static func pick(_ animation: Animation, reduceMotion: Bool) -> Animation {
            reduceMotion ? reduced : animation
        }
    }
}

// MARK: - Typography

/// Type ramp. Every entry is a Dynamic Type text style so it scales to AX5.
/// Numbers (days, hours, tach, dates) always use monospaced digits so columns don't jitter.
public enum TBFont {
    /// "All items current?" answer on the hero card ("Yes", "No", "Not all").
    public static let heroAnswer = Font.largeTitle.weight(.bold)
    /// Screen titles use the system navigation title; this is for in-content titles.
    public static let title = Font.title2.weight(.semibold)
    public static let sectionHeader = Font.headline
    /// Row item name ("Transponder").
    public static let rowTitle = Font.body.weight(.semibold)
    /// Row supporting line ("Current through Oct 31, 2026").
    public static let rowDetail = Font.subheadline
    /// FAR citation ("14 CFR §91.413"). Monospaced reads as a reference, not prose.
    public static let citation = Font.system(.caption, design: .monospaced)
    /// Overline labels ("ALL ITEMS CURRENT?", "NEXT DUE"). Uppercase + tracking applied by modifier.
    public static let overline = Font.system(.caption, design: .monospaced).weight(.medium)
    /// Big number at the right of a row ("12").
    public static let rowValue = Font.title3.weight(.semibold).monospacedDigit()
    /// Unit under the number ("DAYS LEFT").
    public static let rowUnit = Font.system(.caption2, design: .monospaced)
    /// Status tag ("DUE SOON").
    public static let tag = Font.system(.caption2, design: .monospaced).weight(.semibold)
    /// Tail number ("N731TB").
    public static let tail = Font.system(.headline, design: .monospaced)
    public static let body = Font.body
    public static let bodyNumeric = Font.body.monospacedDigit()
    public static let footnote = Font.footnote
}

public extension View {
    /// Overline style: monospaced caption, uppercase, tracked, tertiary ink.
    func tbOverline() -> some View {
        self.font(TBFont.overline)
            .textCase(.uppercase)
            .tracking(1.2)
            .foregroundStyle(TB.ink3)
    }
}

// MARK: - Status

/// Item status. Raw values match the engine (`ItemStatus.rawValue`).
public enum TBStatus: String, CaseIterable, Sendable {
    case overdue
    case dueSoon = "due_soon"
    case ok
    case notApplicable = "not_applicable"
    case unknown

    public init(engineRawValue: String) {
        self = TBStatus(rawValue: engineRawValue) ?? .unknown
    }

    /// Shape carries the meaning, color reinforces it: octagon / triangle / circle / outline.
    public var symbolName: String {
        switch self {
        case .overdue: return "xmark.octagon.fill"
        case .dueSoon: return "exclamationmark.triangle.fill"
        case .ok: return "checkmark.circle.fill"
        case .notApplicable: return "minus.circle"
        case .unknown: return "questionmark.circle"
        }
    }

    /// Visible tag text (rendered uppercase).
    public var tagText: String {
        switch self {
        case .overdue: return "Overdue"
        case .dueSoon: return "Due soon"
        case .ok: return "Current"
        case .notApplicable: return "N/A"
        case .unknown: return "Needs date"
        }
    }

    /// Spoken status for VoiceOver.
    public var spokenText: String {
        switch self {
        case .overdue: return "Overdue"
        case .dueSoon: return "Due soon"
        case .ok: return "Current"
        case .notApplicable: return "Not applicable"
        case .unknown: return "Needs a date"
        }
    }

    public var text: TBColor {
        switch self {
        case .overdue: return TB.Status.overdue
        case .dueSoon: return TB.Status.dueSoon
        case .ok: return TB.Status.current
        case .notApplicable, .unknown: return TB.Status.neutral
        }
    }

    public var fill: TBColor {
        switch self {
        case .overdue: return TB.Status.overdueFill
        case .dueSoon: return TB.Status.dueSoonFill
        case .ok: return TB.Status.currentFill
        case .notApplicable, .unknown: return TB.Status.neutralFill
        }
    }

    public var background: TBColor {
        switch self {
        case .overdue: return TB.Status.overdueBg
        case .dueSoon: return TB.Status.dueSoonBg
        case .ok: return TB.Status.currentBg
        case .notApplicable, .unknown: return TB.Status.neutralBg
        }
    }
}

/// Board summary. Raw values match the engine (`SummaryStatus.rawValue`).
public enum TBSummaryStatus: String, CaseIterable, Sendable {
    case current
    case limited
    case overdue
    case incomplete

    public init(engineRawValue: String) {
        self = TBSummaryStatus(rawValue: engineRawValue) ?? .incomplete
    }

    /// The answer to "All items current?". Never "Airworthy".
    public var answer: String {
        switch self {
        case .current: return "Yes"
        case .limited: return "Not all"
        case .overdue: return "No"
        case .incomplete: return "Can't tell yet"
        }
    }

    public var itemStatus: TBStatus {
        switch self {
        case .current: return .ok
        case .limited: return .dueSoon
        case .overdue: return .overdue
        case .incomplete: return .unknown
        }
    }

    /// Haptic played once when the board settles into this state (see tbStatusHaptic).
    public var feedback: SensoryFeedback {
        switch self {
        case .current: return .success
        case .limited: return .warning
        case .overdue: return .error
        case .incomplete: return .selection
        }
    }
}

// MARK: - Components

/// The status glyph. Hidden from VoiceOver: the row's label already says the status.
public struct TBStatusIcon: View {
    let status: TBStatus
    @ScaledMetric(relativeTo: .body) private var size: CGFloat = TB.Size.statusIcon

    public init(_ status: TBStatus, size: CGFloat? = nil) {
        self.status = status
        if let size { _size = ScaledMetric(wrappedValue: size, relativeTo: .body) }
    }

    public var body: some View {
        Image(systemName: status.symbolName)
            .resizable()
            .scaledToFit()
            .frame(width: size, height: size)
            .foregroundStyle(status.fill)
            .accessibilityHidden(true)
    }
}

/// Uppercase tag ("DUE SOON") on a status tint.
public struct TBStatusTag: View {
    let status: TBStatus
    public init(_ status: TBStatus) { self.status = status }

    public var body: some View {
        Text(status.tagText)
            .font(TBFont.tag)
            .textCase(.uppercase)
            .tracking(0.6)
            .foregroundStyle(status.text)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(status.background, in: RoundedRectangle(cornerRadius: TB.Radius.tag, style: .continuous))
            .lineLimit(1)
            .fixedSize()
            .accessibilityHidden(true)
    }
}

/// Plain data for one board row. Build it from an engine `Item`.
public struct TBStatusRowModel: Identifiable, Sendable {
    public var id: String
    public var name: String               // "Transponder"
    public var citation: String           // "14 CFR §91.413"
    public var detail: String             // "Current through Oct 31, 2026"
    public var value: String?             // "12"
    public var unit: String?              // "days left" / "hrs left" / "days over"
    public var status: TBStatus
    public var isProjected: Bool          // hours item whose date is a forecast

    public init(id: String, name: String, citation: String, detail: String, value: String?, unit: String?,
                status: TBStatus, isProjected: Bool = false) {
        self.id = id; self.name = name; self.citation = citation; self.detail = detail
        self.value = value; self.unit = unit; self.status = status; self.isProjected = isProjected
    }

    /// One VoiceOver sentence, status first: "Transponder. Due soon. 12 days left.
    /// Current through Oct 31, 2026. 14 CFR section 91.413."
    public var accessibilityLabel: String {
        var parts = [name, status.spokenText]
        if let value, let unit { parts.append("\(value) \(unit)\(isProjected ? ", projected" : "")") }
        if !detail.isEmpty { parts.append(detail) }
        parts.append(Self.spokenCitation(citation))
        return parts.joined(separator: ". ") + "."
    }

    public static func spokenCitation(_ citation: String) -> String {
        citation
            .replacingOccurrences(of: "14 CFR ", with: "14 C F R ")
            .replacingOccurrences(of: "§", with: "section ")
    }
}

/// One row of the status board. Switches to a stacked layout at accessibility text sizes.
public struct TBStatusRow: View {
    let model: TBStatusRowModel
    @Environment(\.dynamicTypeSize) private var typeSize

    public init(_ model: TBStatusRowModel) { self.model = model }

    public var body: some View {
        Group {
            if typeSize.isAccessibilitySize {
                VStack(alignment: .leading, spacing: TB.Space.s) {
                    HStack(alignment: .firstTextBaseline, spacing: TB.Space.s) {
                        TBStatusIcon(model.status)
                        TBStatusTag(model.status)
                    }
                    labels
                    valueBlock(alignment: .leading)
                }
            } else {
                HStack(alignment: .top, spacing: TB.Space.m) {
                    TBStatusIcon(model.status)
                        .padding(.top, 1)
                    labels
                    Spacer(minLength: TB.Space.s)
                    valueBlock(alignment: .trailing)
                }
            }
        }
        .padding(.vertical, TB.Space.m)
        .padding(.horizontal, TB.Space.l)
        .frame(minHeight: TB.Size.minTapTarget)
        .contentShape(Rectangle())
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(model.accessibilityLabel)
        .accessibilityHint("Opens details and the rule.")
        .accessibilityAddTraits(.isButton)
    }

    private var labels: some View {
        VStack(alignment: .leading, spacing: TB.Space.xxs) {
            Text(model.name)
                .font(TBFont.rowTitle)
                .foregroundStyle(model.status == .notApplicable ? TB.ink3 : TB.ink)
            Text(model.citation)
                .font(TBFont.citation)
                .foregroundStyle(TB.ink3)
            if !model.detail.isEmpty {
                Text(model.detail)
                    .font(TBFont.rowDetail)
                    .foregroundStyle(TB.ink2)
                    .padding(.top, TB.Space.xxs)
            }
        }
        .fixedSize(horizontal: false, vertical: true)
    }

    private func valueBlock(alignment: HorizontalAlignment) -> some View {
        VStack(alignment: alignment, spacing: TB.Space.xxs) {
            if let value = model.value {
                Text(value)
                    .font(TBFont.rowValue)
                    .foregroundStyle(model.status == .ok ? TB.ink : model.status.text)
            }
            if let unit = model.unit {
                Text(model.isProjected ? "\(unit) · proj." : unit)
                    .font(TBFont.rowUnit)
                    .textCase(.uppercase)
                    .foregroundStyle(TB.ink3)
            }
            if typeSize.isAccessibilitySize == false {
                TBStatusTag(model.status)
            }
        }
    }
}

/// The hero card at the top of the board: "All items current?" + answer + next due + counts.
public struct TBHeroCard: View {
    public var tailNumber: String         // "N731TB"
    public var subtitle: String           // "Beechcraft A36 · IFR"
    public var summary: TBSummaryStatus
    public var headline: String           // engine summary.headline
    public var nextDue: String?           // "Transponder in 12 days · Oct 31"
    public var counts: (overdue: Int, dueSoon: Int, current: Int)
    public var disclaimer: String         // engine DISCLAIMER (short form allowed on the board)

    @ScaledMetric(relativeTo: .title) private var iconSize: CGFloat = TB.Size.heroIcon

    public init(tailNumber: String, subtitle: String, summary: TBSummaryStatus, headline: String,
                nextDue: String?, counts: (overdue: Int, dueSoon: Int, current: Int), disclaimer: String) {
        self.tailNumber = tailNumber; self.subtitle = subtitle; self.summary = summary; self.headline = headline
        self.nextDue = nextDue; self.counts = counts; self.disclaimer = disclaimer
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Identity strip
            HStack(alignment: .firstTextBaseline) {
                Text(tailNumber).font(TBFont.tail).foregroundStyle(TB.ink)
                Text(subtitle).font(TBFont.footnote).foregroundStyle(TB.ink3).lineLimit(2)
                Spacer(minLength: 0)
            }
            .padding(.horizontal, TB.Space.xl)
            .padding(.vertical, TB.Space.m)
            .accessibilityElement(children: .combine)

            Rectangle().fill(TB.line).frame(height: TB.Size.hairline)

            // Question + answer
            HStack(alignment: .top, spacing: TB.Space.l) {
                TBStatusIcon(summary.itemStatus, size: TB.Size.heroIcon)
                    .frame(width: iconSize, height: iconSize)
                VStack(alignment: .leading, spacing: TB.Space.xs) {
                    Text("All items current?").tbOverline()
                    Text(summary.answer)
                        .font(TBFont.heroAnswer)
                        .foregroundStyle(summary.itemStatus.text)
                    Text(headline)
                        .font(TBFont.rowDetail)
                        .foregroundStyle(TB.ink2)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            .padding(TB.Space.xl)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel("All items current? \(summary.answer). \(headline)")
            .accessibilityAddTraits(.isHeader)

            if let nextDue {
                Rectangle().fill(TB.line).frame(height: TB.Size.hairline)
                ViewThatFits(in: .horizontal) {
                    HStack(spacing: TB.Space.m) { nextDueLabel(nextDue); Spacer(minLength: TB.Space.s); countsView }
                    VStack(alignment: .leading, spacing: TB.Space.s) { nextDueLabel(nextDue); countsView }
                }
                .padding(.horizontal, TB.Space.xl)
                .padding(.vertical, TB.Space.m)
                .background(TB.surface2)
            }

            Rectangle().fill(TB.line).frame(height: TB.Size.hairline)
            Text(disclaimer)
                .font(.caption)
                .foregroundStyle(TB.ink3)
                .fixedSize(horizontal: false, vertical: true)
                .padding(.horizontal, TB.Space.xl)
                .padding(.vertical, TB.Space.m)
        }
        .background(TB.surface, in: RoundedRectangle(cornerRadius: TB.Radius.card, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: TB.Radius.card, style: .continuous).strokeBorder(TB.line, lineWidth: TB.Size.hairline))
        .clipShape(RoundedRectangle(cornerRadius: TB.Radius.card, style: .continuous))
    }

    private func nextDueLabel(_ text: String) -> some View {
        VStack(alignment: .leading, spacing: TB.Space.xxs) {
            Text("Next due").tbOverline()
            Text(text).font(TBFont.bodyNumeric.weight(.semibold)).foregroundStyle(TB.ink)
        }
        .accessibilityElement(children: .combine)
    }

    private var countsView: some View {
        HStack(spacing: TB.Space.m) {
            countChip(.overdue, counts.overdue)
            countChip(.dueSoon, counts.dueSoon)
            countChip(.ok, counts.current)
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(counts.overdue) overdue, \(counts.dueSoon) due soon, \(counts.current) current")
    }

    private func countChip(_ status: TBStatus, _ n: Int) -> some View {
        HStack(spacing: TB.Space.xs) {
            TBStatusIcon(status, size: 14)
            Text("\(n)").font(TBFont.bodyNumeric).foregroundStyle(TB.ink2)
        }
    }
}

// MARK: - Buttons

public struct TBPrimaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled
    public init() {}
    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .foregroundStyle(TB.onAccent)
            .frame(maxWidth: .infinity, minHeight: TB.Size.primaryButtonHeight)
            .padding(.horizontal, TB.Space.l)
            .background(configuration.isPressed ? TB.accentPressed : TB.accent,
                        in: RoundedRectangle(cornerRadius: TB.Radius.control, style: .continuous))
            .opacity(isEnabled ? 1 : 0.45)
            .contentShape(Rectangle())
    }
}

public struct TBSecondaryButtonStyle: ButtonStyle {
    public init() {}
    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .foregroundStyle(TB.accent)
            .frame(maxWidth: .infinity, minHeight: TB.Size.primaryButtonHeight)
            .padding(.horizontal, TB.Space.l)
            .background(configuration.isPressed ? TB.accentSoft : TB.surface,
                        in: RoundedRectangle(cornerRadius: TB.Radius.control, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: TB.Radius.control, style: .continuous).strokeBorder(TB.line2, lineWidth: 1))
            .contentShape(Rectangle())
    }
}

// MARK: - Card container

public extension View {
    /// Standard card: surface fill, hairline border, 16-pt continuous corners. No drop shadow in
    /// dark mode; a very soft one in light mode is applied by the screen, not here.
    func tbCard() -> some View {
        self
            .background(TB.surface, in: RoundedRectangle(cornerRadius: TB.Radius.card, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: TB.Radius.card, style: .continuous).strokeBorder(TB.line, lineWidth: TB.Size.hairline))
    }

    /// Plays one haptic when the board's summary changes (not on first appearance, not on scroll).
    func tbStatusHaptic(_ summary: TBSummaryStatus) -> some View {
        self.sensoryFeedback(trigger: summary) { _, new in new.feedback }
    }
}

// MARK: - Empty / loading / error

/// Reusable centered state for empty boards, failed loads and similar.
public struct TBStateView<Actions: View>: View {
    let symbol: String
    let title: String
    let message: String
    let actions: Actions

    public init(symbol: String, title: String, message: String, @ViewBuilder actions: () -> Actions) {
        self.symbol = symbol; self.title = title; self.message = message; self.actions = actions()
    }

    public var body: some View {
        VStack(spacing: TB.Space.l) {
            Image(systemName: symbol)
                .font(.system(size: 44, weight: .regular))
                .foregroundStyle(TB.ink3)
                .accessibilityHidden(true)
            Text(title).font(TBFont.title).foregroundStyle(TB.ink).multilineTextAlignment(.center)
            Text(message).font(TBFont.body).foregroundStyle(TB.ink2).multilineTextAlignment(.center)
            actions.padding(.top, TB.Space.s)
        }
        .padding(TB.Space.xxl)
        .frame(maxWidth: 480)
        .accessibilityElement(children: .contain)
    }
}

/// Skeleton row used while the board is computing or iCloud is syncing (> 300 ms only).
public struct TBSkeletonRow: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var dim = false
    public init() {}
    public var body: some View {
        HStack(spacing: TB.Space.m) {
            Circle().fill(TB.line).frame(width: TB.Size.statusIcon, height: TB.Size.statusIcon)
            VStack(alignment: .leading, spacing: 6) {
                RoundedRectangle(cornerRadius: 4, style: .continuous).fill(TB.line).frame(width: 140, height: 12)
                RoundedRectangle(cornerRadius: 4, style: .continuous).fill(TB.line).frame(width: 90, height: 10)
            }
            Spacer()
            RoundedRectangle(cornerRadius: 4, style: .continuous).fill(TB.line).frame(width: 36, height: 18)
        }
        .padding(.vertical, TB.Space.m)
        .padding(.horizontal, TB.Space.l)
        .opacity(dim ? 0.45 : 1)
        .onAppear {
            guard !reduceMotion else { return }
            withAnimation(.easeInOut(duration: 0.9).repeatForever(autoreverses: true)) { dim = true }
        }
        .accessibilityHidden(true)
    }
}

// MARK: - Previews

#if DEBUG
struct TailBookTheme_Previews: PreviewProvider {
    static let rows: [TBStatusRowModel] = [
        .init(id: "eltBattery", name: "ELT battery", citation: "14 CFR §91.207(c)",
              detail: "Expired after Sep 30, 2026", value: "19", unit: "days over", status: .overdue),
        .init(id: "transponder", name: "Transponder", citation: "14 CFR §91.413",
              detail: "Current through Oct 31, 2026", value: "12", unit: "days left", status: .dueSoon),
        .init(id: "oil", name: "Oil change", citation: "Engine manufacturer", detail: "About Nov 30 at your pace",
              value: "32.0", unit: "hrs left", status: .ok, isProjected: true),
        .init(id: "hundred", name: "100-hour inspection", citation: "14 CFR §91.409(b)",
              detail: "Not used for hire", value: nil, unit: nil, status: .notApplicable),
    ]

    static var board: some View {
        ScrollView {
            VStack(spacing: TB.Space.l) {
                TBHeroCard(tailNumber: "N731TB", subtitle: "Beechcraft A36 · IFR", summary: .overdue,
                           headline: "Not all items current: ELT battery overdue. 1 item due soon.",
                           nextDue: "Transponder in 12 days", counts: (1, 1, 6),
                           disclaimer: "TailBook organizes the dates you enter. Your A&P/IA and the pilot in command determine airworthiness.")
                VStack(spacing: 0) {
                    ForEach(rows) { row in
                        TBStatusRow(row)
                        if row.id != rows.last?.id { Rectangle().fill(TB.line).frame(height: 1).padding(.leading, 50) }
                    }
                }
                .tbCard()
                Button("Log a flight") {}.buttonStyle(TBPrimaryButtonStyle())
            }
            .padding(TB.Space.l)
        }
        .background(TB.canvas)
    }

    static var previews: some View {
        Group {
            board.preferredColorScheme(.light).previewDisplayName("Light")
            board.preferredColorScheme(.dark).previewDisplayName("Dark")
            board.environment(\.dynamicTypeSize, .accessibility5).previewDisplayName("AX5")
        }
    }
}
#endif
