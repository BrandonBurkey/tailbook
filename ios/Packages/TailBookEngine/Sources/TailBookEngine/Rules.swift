import Foundation

// Port of the constants and the rule catalog in engine/tailbook-engine.js.
// Raw values match the JS strings exactly, so vectors compare directly.

/// Item status.
///   overdue        red     the due date has passed or the due tach is exceeded
///   dueSoon        yellow  <= 30 days left on a date, or <= 10 hours left
///   ok             green
///   notApplicable  gray    with a `reason`
///   unknown        gray    the owner has not entered enough data yet
public enum ItemStatus: String, CaseIterable, Sendable {
    case overdue
    case dueSoon = "due_soon"
    case ok
    case notApplicable = "not_applicable"
    case unknown

    /// STATUS_COLOR in the JS engine.
    public var color: StatusColor {
        switch self {
        case .overdue: return .red
        case .dueSoon: return .yellow
        case .ok: return .green
        case .notApplicable: return .gray
        case .unknown: return .gray
        }
    }

    /// SEVERITY in the JS engine (used by whichever-first).
    var severity: Int {
        switch self {
        case .overdue: return 4
        case .unknown: return 3
        case .dueSoon: return 2
        case .ok: return 1
        case .notApplicable: return 0
        }
    }

    /// Display order used by `Engine.sortForBoard`.
    public var boardOrder: Int {
        switch self {
        case .overdue: return 0
        case .dueSoon: return 1
        case .unknown: return 2
        case .ok: return 3
        case .notApplicable: return 4
        }
    }
}

public enum StatusColor: String, Sendable {
    case red
    case yellow
    case green
    case gray
}

/// Which operations an item governs (what an overdue item affects).
///   all          the item applies to every flight
///   ifr          only IFR operations
///   hire         only carrying persons / flight instruction for hire
///   transponder  only use of the transponder
///   advisory     not a regulatory limit (oil change, owner-defined items)
public enum Scope: String, Sendable {
    case all
    case ifr
    case hire
    case transponder
    case advisory
}

/// Which limit drives the effective date of an item.
public enum GovernedBy: String, Sendable {
    case date
    case hours
}

/// The overall "All items current?" answer. Never an airworthiness verdict.
public enum SummaryStatus: String, Sendable {
    case current
    case limited
    case overdue
    case incomplete
}

/// The rule an item is evaluated under (`kind` in the JS output).
public enum RuleKind: String, CaseIterable, Sendable {
    case annual
    case hundredHour
    case pitotStatic
    case transponder
    case eltInspection
    case eltBattery
    case vorCheck
    case registration
    case oilChange
    case ad
    case custom
}

/// Thresholds (THRESHOLDS in the JS engine).
public enum Thresholds {
    /// A date-based item with this many days left (or fewer) is yellow.
    public static let dueSoonDays: Int = 30
    /// An hours-based item with this many hours left (or fewer) is yellow.
    public static let dueSoonHours: Double = 10
    /// §91.409(b) overfly allowance, hours, en route to an inspection.
    public static let hundredHourOverfly: Double = 10
}

/// One entry of the rule catalog. `rule` is the plain-English text shown to owners.
public struct Rule: Equatable, Sendable {
    public let name: String
    public let citation: String
    public let url: String?
    public let rule: String
    public let scope: Scope
    public let regulatory: Bool
}

/// The rule catalog (RULES in the JS engine).
public enum Rules {
    static func ecfr(_ part: Int, _ section: Int) -> String {
        return "https://www.ecfr.gov/current/title-14/part-\(part)/section-\(part).\(section)"
    }

    public static func rule(for kind: RuleKind) -> Rule {
        switch kind {
        case .annual:
            return Rule(
                name: "Annual inspection",
                citation: "14 CFR §91.409(a)",
                url: ecfr(91, 409),
                rule: "Required within the preceding 12 calendar months. Done any day in a month, it is good through the last day of that month next year.",
                scope: .all,
                regulatory: true
            )
        case .hundredHour:
            return Rule(
                name: "100-hour inspection",
                citation: "14 CFR §91.409(b)",
                url: ecfr(91, 409),
                rule: "Only if the aircraft carries people for hire or is provided for flight instruction for hire: inspected within the preceding 100 hours. You may exceed 100 by up to 10 hours only to fly to where the inspection will be done, and that excess counts against the next 100 hours. An annual also satisfies it.",
                scope: .hire,
                regulatory: true
            )
        case .pitotStatic:
            return Rule(
                name: "Altimeter & pitot-static",
                citation: "14 CFR §91.411",
                url: ecfr(91, 411),
                rule: "Required for IFR in controlled airspace: static system, altimeter and automatic altitude reporting tested within the preceding 24 calendar months.",
                scope: .ifr,
                regulatory: true
            )
        case .transponder:
            return Rule(
                name: "Transponder",
                citation: "14 CFR §91.413",
                url: ecfr(91, 413),
                rule: "An ATC transponder may be used only if tested and inspected within the preceding 24 calendar months.",
                scope: .transponder,
                regulatory: true
            )
        case .eltInspection:
            return Rule(
                name: "ELT inspection",
                citation: "14 CFR §91.207(d)",
                url: ecfr(91, 207),
                rule: "The ELT must be inspected within 12 calendar months after the last inspection.",
                scope: .all,
                regulatory: true
            )
        case .eltBattery:
            return Rule(
                name: "ELT battery",
                citation: "14 CFR §91.207(c)",
                url: ecfr(91, 207),
                rule: "Replace (or recharge) when the transmitter has been used more than 1 cumulative hour, or when 50% of the battery\u{2019}s useful life has expired: the expiration date marked on the ELT.",
                scope: .all,
                regulatory: true
            )
        case .vorCheck:
            return Rule(
                name: "VOR check",
                citation: "14 CFR §91.171",
                url: ecfr(91, 171),
                rule: "For IFR using VOR navigation, the VOR equipment must have been checked within the preceding 30 days.",
                scope: .ifr,
                regulatory: true
            )
        case .registration:
            return Rule(
                name: "Aircraft registration",
                citation: "14 CFR §47.40",
                url: ecfr(47, 40),
                rule: "A registration certificate expires 7 years after the last day of the month in which it was issued. Renewal may be filed in the 6 months before expiration.",
                scope: .all,
                regulatory: true
            )
        case .oilChange:
            return Rule(
                name: "Oil change",
                citation: "Engine manufacturer recommendation",
                url: nil,
                rule: "By hours, by calendar time, or whichever comes first, per your engine maker or your A&P.",
                scope: .advisory,
                regulatory: false
            )
        case .ad:
            return Rule(
                name: "Airworthiness Directive",
                citation: "14 CFR §39.7",
                url: ecfr(39, 7),
                rule: "No person may operate an aircraft that does not meet the requirements of an applicable AD. Recurring ADs are tracked by hours, calendar time, or whichever comes first.",
                scope: .all,
                regulatory: true
            )
        case .custom:
            return Rule(
                name: "Custom item",
                citation: "Owner-defined",
                url: nil,
                rule: "Tracked by hours, calendar time, or whichever comes first.",
                scope: .advisory,
                regulatory: false
            )
        }
    }
}
