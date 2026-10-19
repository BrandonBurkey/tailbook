import Foundation

// The engine's output types (the JS item, summary and evaluate() result).

/// One evaluated board item. Field names match the JS output.
public struct EvaluatedItem: Equatable, Sendable {
    public var id: String
    public var kind: RuleKind
    public var name: String
    public var citation: String
    public var url: String?
    public var rule: String
    public var scope: Scope
    public var regulatory: Bool

    public var status: ItemStatus = .unknown
    public var color: StatusColor = .gray
    /// Last day the item is current (inclusive).
    public var dueDate: CivilDate? = nil
    /// Tach at which the item is due (inclusive).
    public var dueTach: Double? = nil
    public var daysRemaining: Int? = nil
    public var hoursRemaining: Double? = nil
    /// Informational forecast for hours-based limits (never drives status).
    public var projectedDate: CivilDate? = nil
    /// The earlier of the due date and the projected date.
    public var effectiveDate: CivilDate? = nil
    public var governedBy: GovernedBy? = nil
    public var reason: String? = nil
    public var message: String = ""
    public var notes: [String] = []

    public var lastDone: CivilDate? = nil
    public var lastDoneTach: Double? = nil
    /// 100-hour only: ferry hours left inside the 10-hour allowance when over the limit.
    public var overflyHoursRemaining: Double? = nil
    /// Swift-only: the `ref` passed in on an AD or custom entry.
    public var sourceRef: String? = nil
}

/// `{ overdue, due_soon, ok, not_applicable, unknown }` counts.
public struct StatusCounts: Equatable, Sendable {
    public var overdue: Int = 0
    public var dueSoon: Int = 0
    public var ok: Int = 0
    public var notApplicable: Int = 0
    public var unknown: Int = 0

    public init() {}

    public subscript(status: ItemStatus) -> Int {
        get {
            switch status {
            case .overdue: return overdue
            case .dueSoon: return dueSoon
            case .ok: return ok
            case .notApplicable: return notApplicable
            case .unknown: return unknown
            }
        }
        set {
            switch status {
            case .overdue: overdue = newValue
            case .dueSoon: dueSoon = newValue
            case .ok: ok = newValue
            case .notApplicable: notApplicable = newValue
            case .unknown: unknown = newValue
            }
        }
    }
}

/// The earliest upcoming effective date.
public struct NextDue: Equatable, Sendable {
    public var id: String
    public var name: String
    public var date: CivilDate
    public var daysRemaining: Int
    /// True when the date is a forecast from hours (governedBy == hours).
    public var projected: Bool
    public var sourceRef: String?
}

/// The "All items current?" summary. Never an airworthiness determination.
public struct Summary: Equatable, Sendable {
    public var status: SummaryStatus
    /// true only for `current`; false for `overdue` / `limited`; nil for `incomplete`.
    public var allCurrent: Bool?
    public var headline: String
    public var affects: [String]
    /// Ids of overdue non-regulatory (advisory) items.
    public var attention: [String]
    public var counts: StatusCounts
    public var nextDue: NextDue?
}

public struct EvaluationResult: Equatable, Sendable {
    public var engineVersion: String
    public var asOf: CivilDate
    public var items: [EvaluatedItem]
    public var summary: Summary
    public var disclaimer: String
}
