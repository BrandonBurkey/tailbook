import Foundation
import SwiftData

enum TrackedItemKind: String, CaseIterable, Identifiable {
    case ad
    case custom

    var id: String { rawValue }

    var title: String {
        switch self {
        case .ad: return "Airworthiness Directive"
        case .custom: return "Custom item"
        }
    }
}

/// How a recurring item repeats. Whichever-first combines hours with one time unit.
enum IntervalMode: String, CaseIterable, Identifiable {
    case hours
    case calendarMonths
    case months
    case days
    case whicheverFirst

    var id: String { rawValue }

    var title: String {
        switch self {
        case .hours: return "Hours"
        case .calendarMonths: return "Calendar months"
        case .months: return "Months"
        case .days: return "Days"
        case .whicheverFirst: return "Hours or time, whichever first"
        }
    }
}

enum TimeUnit: String, CaseIterable, Identifiable {
    case calendarMonths
    case months
    case days

    var id: String { rawValue }

    var title: String {
        switch self {
        case .calendarMonths: return "Calendar months"
        case .months: return "Months"
        case .days: return "Days"
        }
    }

    var help: String {
        switch self {
        case .calendarMonths: return "Good through the last day of the month (e.g. done Mar 5 + 12 → Mar 31 next year)."
        case .months: return "Same day of the month (e.g. done Mar 5 + 12 → Mar 5 next year). The conservative reading."
        case .days: return "Plain days after the date done."
        }
    }
}

/// A recurring or one-time AD, or an owner-defined item (fire extinguisher, CAPS repack, ...).
@Model
final class TrackedItem {
    var uuid: UUID = UUID()
    var createdAt: Date = Date()
    var kindRaw: String = "ad"

    var adNumber: String = ""
    var title: String = ""

    var intervalHours: Double? = nil
    var intervalCalendarMonths: Int? = nil
    var intervalMonths: Int? = nil
    var intervalDays: Int? = nil

    var lastDoneDate: Date? = nil
    var lastDoneTach: Double? = nil

    /// ADs only: false for a one-time AD.
    var isRecurring: Bool = true
    /// One-time ADs: complied with.
    var isComplied: Bool = false
    /// One-time ADs: comply by this date and/or tach.
    var oneTimeDueDate: Date? = nil
    var oneTimeDueTach: Double? = nil
    /// ADs: owner/IA determined it does not apply.
    var isApplicable: Bool = true
    /// Custom items: counts toward "All items current?" (scope all).
    var isRegulatory: Bool = false

    /// Method of compliance / notes / logbook reference.
    var complianceNote: String = ""

    var aircraft: Aircraft? = nil

    init(kind: TrackedItemKind) {
        self.kindRaw = kind.rawValue
    }
}

extension TrackedItem {
    var kind: TrackedItemKind {
        get { return TrackedItemKind(rawValue: kindRaw) ?? .custom }
        set { kindRaw = newValue.rawValue }
    }

    /// The opaque reference the engine passes back as `EvaluatedItem.sourceRef`.
    var engineRef: String {
        return uuid.uuidString
    }

    var displayName: String {
        switch kind {
        case .ad:
            let number = adNumber.trimmingCharacters(in: .whitespacesAndNewlines)
            let name = title.trimmingCharacters(in: .whitespacesAndNewlines)
            if number.isEmpty { return name.isEmpty ? "AD" : "AD: \(name)" }
            return name.isEmpty ? "AD \(number)" : "AD \(number): \(name)"
        case .custom:
            let name = title.trimmingCharacters(in: .whitespacesAndNewlines)
            return name.isEmpty ? "Custom item" : name
        }
    }

    var intervalSummary: String {
        if kind == .ad && !isRecurring {
            return isComplied ? "One-time · complied" : "One-time"
        }
        var parts: [String] = []
        if let h = intervalHours, h > 0 { parts.append("\(Fmt.hours(h)) hrs") }
        if let n = intervalCalendarMonths, n > 0 { parts.append("\(n) calendar mo") }
        if let n = intervalMonths, n > 0 { parts.append("\(n) mo") }
        if let n = intervalDays, n > 0 { parts.append("\(n) days") }
        if parts.isEmpty { return "No interval set" }
        return "Every " + parts.joined(separator: " or ") + (parts.count > 1 ? ", whichever first" : "")
    }
}
