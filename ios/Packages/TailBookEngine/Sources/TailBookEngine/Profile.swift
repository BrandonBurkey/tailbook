import Foundation

// The engine's input: the Swift twin of the JS `profile` object. Property
// names match the JSON keys in engine/test-vectors.json, so a vector profile
// decodes straight into `Profile` with JSONDecoder. Every field is optional,
// exactly like the JS engine, and missing data yields `unknown`, never a crash.
//
// Swift-only deviations (documented in ios/README.md):
//   - Month/day interval counts are `Int` (the JS accepts any number).
//   - `ref` on ADs and custom items is an opaque pass-through that comes back
//     as `EvaluatedItem.sourceRef`, so the app can map rows to its records.

public struct AircraftInfo: Codable, Equatable, Sendable {
    public var ifr: Bool?
    public var forHire: Bool?
    /// Default true (nil counts as installed).
    public var hasTransponder: Bool?
    /// Default true (nil counts as required).
    public var hasElt: Bool?
    /// Default true (nil counts as VOR used for IFR).
    public var usesVor: Bool?
    public var currentTach: Double?
    public var avgHoursPerMonth: Double?

    public init(ifr: Bool? = nil, forHire: Bool? = nil, hasTransponder: Bool? = nil, hasElt: Bool? = nil,
                usesVor: Bool? = nil, currentTach: Double? = nil, avgHoursPerMonth: Double? = nil) {
        self.ifr = ifr
        self.forHire = forHire
        self.hasTransponder = hasTransponder
        self.hasElt = hasElt
        self.usesVor = usesVor
        self.currentTach = currentTach
        self.avgHoursPerMonth = avgHoursPerMonth
    }
}

/// Annual: `{ lastDone, tach? }`. `tach` lets an annual reset the 100-hour interval.
public struct AnnualEntry: Codable, Equatable, Sendable {
    public var lastDone: String?
    public var tach: Double?

    public init(lastDone: String? = nil, tach: Double? = nil) {
        self.lastDone = lastDone
        self.tach = tach
    }
}

/// 100-hour: `{ lastDoneTach, previousDueTach? }`.
public struct HundredHourEntry: Codable, Equatable, Sendable {
    public var lastDoneTach: Double?
    /// The limit in force when it was done (for the late-inspection carry-forward).
    public var previousDueTach: Double?

    public init(lastDoneTach: Double? = nil, previousDueTach: Double? = nil) {
        self.lastDoneTach = lastDoneTach
        self.previousDueTach = previousDueTach
    }
}

/// Pitot-static, transponder, ELT inspection, VOR check: `{ lastDone }`.
public struct DoneEntry: Codable, Equatable, Sendable {
    public var lastDone: String?

    public init(lastDone: String? = nil) {
        self.lastDone = lastDone
    }
}

/// ELT battery: `{ expires: "YYYY-MM[-DD]", cumulativeUseHours? }`.
public struct EltBatteryEntry: Codable, Equatable, Sendable {
    public var expires: String?
    public var cumulativeUseHours: Double?

    public init(expires: String? = nil, cumulativeUseHours: Double? = nil) {
        self.expires = expires
        self.cumulativeUseHours = cumulativeUseHours
    }
}

/// Registration: `{ expires }` (preferred) or `{ issued }`.
public struct RegistrationEntry: Codable, Equatable, Sendable {
    public var expires: String?
    public var issued: String?

    public init(expires: String? = nil, issued: String? = nil) {
        self.expires = expires
        self.issued = issued
    }
}

/// Generic interval entry (oil change; the interval part of ADs and custom items).
/// Any combination of intervals may be given: due at whichever comes first.
public struct IntervalEntry: Codable, Equatable, Sendable {
    public var lastDoneDate: String?
    public var lastDoneTach: Double?
    public var intervalHours: Double?
    /// Calendar months: ends on the last day of the month.
    public var intervalCalendarMonths: Int?
    /// Plain months: anniversary, clamped to month end.
    public var intervalMonths: Int?
    public var intervalDays: Int?
    /// Explicit limits (e.g. a one-time AD).
    public var dueDate: String?
    public var dueTach: Double?

    public init(lastDoneDate: String? = nil, lastDoneTach: Double? = nil, intervalHours: Double? = nil,
                intervalCalendarMonths: Int? = nil, intervalMonths: Int? = nil, intervalDays: Int? = nil,
                dueDate: String? = nil, dueTach: Double? = nil) {
        self.lastDoneDate = lastDoneDate
        self.lastDoneTach = lastDoneTach
        self.intervalHours = intervalHours
        self.intervalCalendarMonths = intervalCalendarMonths
        self.intervalMonths = intervalMonths
        self.intervalDays = intervalDays
        self.dueDate = dueDate
        self.dueTach = dueTach
    }
}

/// An Airworthiness Directive: interval fields + `{ adNumber, title, recurring?, complied?, applicable? }`.
public struct ADEntry: Codable, Equatable, Sendable {
    public var adNumber: String?
    public var id: String?
    public var title: String?
    public var url: String?
    public var recurring: Bool?
    public var complied: Bool?
    public var applicable: Bool?
    public var reason: String?
    public var ref: String?

    public var lastDoneDate: String?
    public var lastDoneTach: Double?
    public var intervalHours: Double?
    public var intervalCalendarMonths: Int?
    public var intervalMonths: Int?
    public var intervalDays: Int?
    public var dueDate: String?
    public var dueTach: Double?

    public init(adNumber: String? = nil, id: String? = nil, title: String? = nil, url: String? = nil,
                recurring: Bool? = nil, complied: Bool? = nil, applicable: Bool? = nil, reason: String? = nil,
                ref: String? = nil, interval: IntervalEntry = IntervalEntry()) {
        self.adNumber = adNumber
        self.id = id
        self.title = title
        self.url = url
        self.recurring = recurring
        self.complied = complied
        self.applicable = applicable
        self.reason = reason
        self.ref = ref
        self.lastDoneDate = interval.lastDoneDate
        self.lastDoneTach = interval.lastDoneTach
        self.intervalHours = interval.intervalHours
        self.intervalCalendarMonths = interval.intervalCalendarMonths
        self.intervalMonths = interval.intervalMonths
        self.intervalDays = interval.intervalDays
        self.dueDate = interval.dueDate
        self.dueTach = interval.dueTach
    }

    public var interval: IntervalEntry {
        return IntervalEntry(lastDoneDate: lastDoneDate, lastDoneTach: lastDoneTach, intervalHours: intervalHours,
                             intervalCalendarMonths: intervalCalendarMonths, intervalMonths: intervalMonths,
                             intervalDays: intervalDays, dueDate: dueDate, dueTach: dueTach)
    }
}

/// An owner-defined item: interval fields + `{ id, name, regulatory?, citation?, rule? }`.
public struct CustomEntry: Codable, Equatable, Sendable {
    public var id: String?
    public var name: String?
    public var citation: String?
    public var rule: String?
    public var regulatory: Bool?
    public var ref: String?

    public var lastDoneDate: String?
    public var lastDoneTach: Double?
    public var intervalHours: Double?
    public var intervalCalendarMonths: Int?
    public var intervalMonths: Int?
    public var intervalDays: Int?
    public var dueDate: String?
    public var dueTach: Double?

    public init(id: String? = nil, name: String? = nil, citation: String? = nil, rule: String? = nil,
                regulatory: Bool? = nil, ref: String? = nil, interval: IntervalEntry = IntervalEntry()) {
        self.id = id
        self.name = name
        self.citation = citation
        self.rule = rule
        self.regulatory = regulatory
        self.ref = ref
        self.lastDoneDate = interval.lastDoneDate
        self.lastDoneTach = interval.lastDoneTach
        self.intervalHours = interval.intervalHours
        self.intervalCalendarMonths = interval.intervalCalendarMonths
        self.intervalMonths = interval.intervalMonths
        self.intervalDays = interval.intervalDays
        self.dueDate = interval.dueDate
        self.dueTach = interval.dueTach
    }

    public var interval: IntervalEntry {
        return IntervalEntry(lastDoneDate: lastDoneDate, lastDoneTach: lastDoneTach, intervalHours: intervalHours,
                             intervalCalendarMonths: intervalCalendarMonths, intervalMonths: intervalMonths,
                             intervalDays: intervalDays, dueDate: dueDate, dueTach: dueTach)
    }
}

/// An aircraft profile. `asOf` ("YYYY-MM-DD") is required: the engine has no clock.
public struct Profile: Codable, Equatable, Sendable {
    public var asOf: String
    public var aircraft: AircraftInfo?
    public var annual: AnnualEntry?
    public var hundredHour: HundredHourEntry?
    public var pitotStatic: DoneEntry?
    public var transponder: DoneEntry?
    public var eltInspection: DoneEntry?
    public var eltBattery: EltBatteryEntry?
    public var vorCheck: DoneEntry?
    public var registration: RegistrationEntry?
    public var oilChange: IntervalEntry?
    public var ads: [ADEntry]?
    public var customItems: [CustomEntry]?

    public init(asOf: String, aircraft: AircraftInfo? = nil, annual: AnnualEntry? = nil,
                hundredHour: HundredHourEntry? = nil, pitotStatic: DoneEntry? = nil, transponder: DoneEntry? = nil,
                eltInspection: DoneEntry? = nil, eltBattery: EltBatteryEntry? = nil, vorCheck: DoneEntry? = nil,
                registration: RegistrationEntry? = nil, oilChange: IntervalEntry? = nil, ads: [ADEntry]? = nil,
                customItems: [CustomEntry]? = nil) {
        self.asOf = asOf
        self.aircraft = aircraft
        self.annual = annual
        self.hundredHour = hundredHour
        self.pitotStatic = pitotStatic
        self.transponder = transponder
        self.eltInspection = eltInspection
        self.eltBattery = eltBattery
        self.vorCheck = vorCheck
        self.registration = registration
        self.oilChange = oilChange
        self.ads = ads
        self.customItems = customItems
    }
}
