import Foundation
import TailBookEngine

/// Owner-facing formatting for numbers and dates.
enum Fmt {
    static func hours(_ h: Double) -> String {
        return String(format: "%.1f", h)
    }

    static func days(_ n: Int) -> String {
        return n == 1 ? "1 day" : "\(n) days"
    }

    static func date(_ civil: CivilDate) -> String {
        return civil.toDate().formatted(date: .abbreviated, time: .omitted)
    }

    static func date(_ date: Date) -> String {
        return date.formatted(date: .abbreviated, time: .omitted)
    }

    /// Parses user-typed numbers, accepting "1,234.5" and "1234,5".
    static func parseNumber(_ text: String) -> Double? {
        var cleaned = text.trimmingCharacters(in: .whitespacesAndNewlines)
        if cleaned.isEmpty { return nil }
        cleaned = cleaned.replacingOccurrences(of: " ", with: "")
        if cleaned.contains(",") && cleaned.contains(".") {
            cleaned = cleaned.replacingOccurrences(of: ",", with: "")
        } else {
            cleaned = cleaned.replacingOccurrences(of: ",", with: ".")
        }
        guard let value = Double(cleaned), value.isFinite else { return nil }
        return value
    }

    static func numberText(_ value: Double?) -> String {
        guard let value = value else { return "" }
        return hours(value)
    }
}

/// Display helpers for engine items, used by the board, detail, PDFs and reminders.
extension EvaluatedItem {
    /// Stable unique key for lists (AD ids can repeat; refs cannot).
    var listKey: String {
        return sourceRef ?? id
    }

    var statusLabel: String {
        switch status {
        case .overdue: return "Overdue"
        case .dueSoon: return "Due soon"
        case .ok: return "Current"
        case .notApplicable: return "N/A"
        case .unknown: return "Needs info"
        }
    }

    /// "Current through Mar 31, 2027" / "Due at 1350.0 tach" / the reason.
    var throughText: String {
        switch status {
        case .notApplicable:
            return reason ?? message
        case .unknown:
            if let reason = reason { return reason }
            return message
        default:
            break
        }
        if governedBy == .hours, let tach = dueTach {
            return "Due at \(Fmt.hours(tach)) tach"
        }
        if let due = dueDate {
            if status == .overdue && (daysRemaining ?? 0) < 0 {
                return "Lapsed after \(Fmt.date(due))"
            }
            return "Current through \(Fmt.date(due))"
        }
        if let tach = dueTach {
            return "Due at \(Fmt.hours(tach)) tach"
        }
        return message
    }

    /// Big number on the right of a row: days or hours left.
    var remainingPrimary: String {
        switch status {
        case .notApplicable: return "N/A"
        case .unknown: return "—"
        default: break
        }
        if governedBy == .hours, let h = hoursRemaining {
            return h < 0 ? "\(Fmt.hours(-h)) hrs over" : "\(Fmt.hours(h)) hrs"
        }
        if let d = daysRemaining {
            if d < 0 { return "\(Fmt.days(-d)) over" }
            if d == 0 { return "Today" }
            return Fmt.days(d)
        }
        if let h = hoursRemaining {
            return h < 0 ? "\(Fmt.hours(-h)) hrs over" : "\(Fmt.hours(h)) hrs"
        }
        return "—"
    }

    /// Small line under the big number: the projected date or the other limit.
    var remainingSecondary: String? {
        guard status != .notApplicable && status != .unknown else { return nil }
        if governedBy == .hours {
            if let projected = projectedDate { return "≈ \(Fmt.date(projected))" }
            if let d = daysRemaining { return Fmt.days(d) }
            return nil
        }
        if let h = hoursRemaining {
            return h < 0 ? "\(Fmt.hours(-h)) hrs over" : "\(Fmt.hours(h)) hrs"
        }
        return nil
    }

    /// True for items with an hours limit (they show a projected date).
    var isHoursBased: Bool {
        return dueTach != nil
    }
}

extension Summary {
    /// The short answer to "All items current?". Never "airworthy".
    var answer: String {
        switch status {
        case .current: return "Yes"
        case .overdue: return "No"
        case .limited: return "Not all"
        case .incomplete: return "Can't tell yet"
        }
    }

    var nextDueText: String? {
        guard let next = nextDue else { return nil }
        let when: String
        if next.daysRemaining == 0 {
            when = "today"
        } else {
            when = "in \(Fmt.days(next.daysRemaining))"
        }
        let approx = next.projected ? "about " : ""
        return "\(next.name) \(approx)\(when) · \(Fmt.date(next.date))"
    }
}
