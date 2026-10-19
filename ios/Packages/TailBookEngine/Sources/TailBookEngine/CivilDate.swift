import Foundation

// ===========================================================================
// Civil-date arithmetic (pure, timezone-free)
//
// Port of the "Civil-date arithmetic" section of engine/tailbook-engine.js.
// Dates are civil dates (proleptic Gregorian year/month/day) and all math is
// done on integer day numbers, never on local-time `Date` values. Converting
// to and from `Date` is the app's job (it knows the user's calendar).
// ===========================================================================

/// Errors thrown by the string-based date API and by `Engine.evaluate(_:)`.
public enum EngineError: Error, Equatable, Sendable {
    case invalidDate(String)
}

/// A timezone-free calendar date. `description` is "YYYY-MM-DD".
public struct CivilDate: Hashable, Comparable, CustomStringConvertible, Sendable {
    public let year: Int
    public let month: Int
    public let day: Int

    /// Validating initializer: nil for impossible dates (2026-02-29, month 13, day 0, ...).
    public init?(year: Int, month: Int, day: Int) {
        guard month >= 1, month <= 12 else { return nil }
        guard day >= 1, day <= DateMath.daysInMonth(year, month) else { return nil }
        self.year = year
        self.month = month
        self.day = day
    }

    /// Parses "YYYY-MM-DD", or "YYYY-MM" (resolved to the LAST day of that
    /// month, which is how month-only sticker dates such as an ELT battery
    /// "EXP 03/2027" are read). Surrounding whitespace is ignored, like the JS
    /// `trim()`. Returns nil for anything else.
    public init?(_ string: String) {
        let bytes = Array(string.trimmingCharacters(in: .whitespacesAndNewlines).utf8)
        guard bytes.count == 7 || bytes.count == 10 else { return nil }
        let dash = UInt8(ascii: "-")
        guard bytes[4] == dash else { return nil }
        if bytes.count == 10 {
            guard bytes[7] == dash else { return nil }
        }
        guard let y = CivilDate.digits(bytes, from: 0, to: 4),
              let m = CivilDate.digits(bytes, from: 5, to: 7) else { return nil }
        guard m >= 1, m <= 12 else { return nil }
        let d: Int
        if bytes.count == 10 {
            guard let parsedDay = CivilDate.digits(bytes, from: 8, to: 10) else { return nil }
            d = parsedDay
        } else {
            d = DateMath.daysInMonth(y, m)
        }
        self.init(year: y, month: m, day: d)
    }

    /// The date `dayNumber` days after 1970-01-01 (negative is before).
    /// Howard Hinnant's civil_from_days, valid for the whole proleptic calendar.
    public init(dayNumber: Int) {
        let z = dayNumber + 719_468
        let era = (z >= 0 ? z : z - 146_096) / 146_097
        let doe = z - era * 146_097
        let yoe = (doe - doe / 1_460 + doe / 36_524 - doe / 146_096) / 365
        let doy = doe - (365 * yoe + yoe / 4 - yoe / 100)
        let mp = (5 * doy + 2) / 153
        let d = doy - (153 * mp + 2) / 5 + 1
        let m = mp < 10 ? mp + 3 : mp - 9
        let y = yoe + era * 400 + (m <= 2 ? 1 : 0)
        self.year = y
        self.month = m
        self.day = d
    }

    /// Internal non-validating initializer; callers guarantee a real date.
    init(checkedYear year: Int, month: Int, day: Int) {
        self.year = year
        self.month = month
        self.day = day
    }

    private static func digits(_ bytes: [UInt8], from start: Int, to end: Int) -> Int? {
        var value = 0
        for index in start..<end {
            let byte = bytes[index]
            guard byte >= 48, byte <= 57 else { return nil }
            value = value * 10 + Int(byte - 48)
        }
        return value
    }

    /// Days since 1970-01-01 (Hinnant's days_from_civil).
    public var dayNumber: Int {
        let y = month <= 2 ? year - 1 : year
        let era = (y >= 0 ? y : y - 399) / 400
        let yoe = y - era * 400
        let mp = (month + 9) % 12
        let doy = (153 * mp + 2) / 5 + day - 1
        let doe = yoe * 365 + yoe / 4 - yoe / 100 + doy
        return era * 146_097 + doe - 719_468
    }

    /// "YYYY-MM-DD".
    public var description: String {
        return CivilDate.format(year, month, day)
    }

    /// "YYYY-MM": the month-only form the engine reads as end of month.
    public var yearMonthString: String {
        return CivilDate.pad(year, 4) + "-" + CivilDate.pad(month, 2)
    }

    static func format(_ y: Int, _ m: Int, _ d: Int) -> String {
        return pad(y, 4) + "-" + pad(m, 2) + "-" + pad(d, 2)
    }

    static func pad(_ n: Int, _ width: Int) -> String {
        let s = String(n)
        if s.count >= width { return s }
        return String(repeating: "0", count: width - s.count) + s
    }

    // MARK: Arithmetic

    public func adding(days n: Int) -> CivilDate {
        return CivilDate(dayNumber: dayNumber + n)
    }

    /// Calendar days from self to `other` (positive if `other` is later).
    public func days(to other: CivilDate) -> Int {
        return other.dayNumber - dayNumber
    }

    /// Last day of the month that is `n` months after this date's month
    /// ("calendar months": done any day in March + 12 => March 31 next year).
    public func endOfCalendarMonths(_ n: Int) -> CivilDate {
        let shifted = CivilDate.shiftMonth(year: year, month: month, by: n)
        return CivilDate(checkedYear: shifted.year, month: shifted.month,
                         day: DateMath.daysInMonth(shifted.year, shifted.month))
    }

    /// Same day-of-month `n` months later, clamped to the month's last day
    /// (Jan 31 + 1 month => Feb 28/29). Plain "months", i.e. anniversaries.
    public func addingMonthsClamped(_ n: Int) -> CivilDate {
        let shifted = CivilDate.shiftMonth(year: year, month: month, by: n)
        let last = DateMath.daysInMonth(shifted.year, shifted.month)
        return CivilDate(checkedYear: shifted.year, month: shifted.month, day: min(day, last))
    }

    private static func shiftMonth(year: Int, month: Int, by n: Int) -> (year: Int, month: Int) {
        let index = year * 12 + (month - 1) + n
        let newYear = floorDiv(index, 12)
        let newMonth = index - newYear * 12 + 1
        return (newYear, newMonth)
    }

    private static func floorDiv(_ a: Int, _ b: Int) -> Int {
        // b is always positive here.
        if a >= 0 { return a / b }
        return -((-a + b - 1) / b)
    }

    public static func < (lhs: CivilDate, rhs: CivilDate) -> Bool {
        return lhs.dayNumber < rhs.dayNumber
    }
}

/// The string-based date API, mirroring the JS exports one for one
/// (`endOfCalendarMonths("2026-03-01", 12) == "2027-03-31"`). The golden
/// `dateCases` vectors are run against these functions.
public enum DateMath {
    /// Average Gregorian month, used for hours-to-date projections.
    public static let avgDaysPerMonth: Double = 365.25 / 12

    public static func isLeapYear(_ y: Int) -> Bool {
        return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0
    }

    /// Days in month `m` (1-12) of year `y`; 0 for an invalid month.
    public static func daysInMonth(_ y: Int, _ m: Int) -> Int {
        switch m {
        case 1, 3, 5, 7, 8, 10, 12:
            return 31
        case 4, 6, 9, 11:
            return 30
        case 2:
            return isLeapYear(y) ? 29 : 28
        default:
            return 0
        }
    }

    public static func parseDate(_ s: String) throws -> CivilDate {
        guard let date = CivilDate(s) else { throw EngineError.invalidDate(s) }
        return date
    }

    /// Normalize "YYYY-MM" or "YYYY-MM-DD" to "YYYY-MM-DD".
    public static func normalizeDate(_ s: String) throws -> String {
        return try parseDate(s).description
    }

    public static func formatDate(_ y: Int, _ m: Int, _ d: Int) -> String {
        return CivilDate.format(y, m, d)
    }

    public static func toDayNumber(_ s: String) throws -> Int {
        return try parseDate(s).dayNumber
    }

    public static func fromDayNumber(_ n: Int) -> String {
        return CivilDate(dayNumber: n).description
    }

    public static func daysBetween(_ a: String, _ b: String) throws -> Int {
        let start = try parseDate(a)
        let end = try parseDate(b)
        return start.days(to: end)
    }

    public static func addDays(_ s: String, _ n: Int) throws -> String {
        return try parseDate(s).adding(days: n).description
    }

    public static func endOfCalendarMonths(_ s: String, _ n: Int) throws -> String {
        return try parseDate(s).endOfCalendarMonths(n).description
    }

    public static func addMonthsClamped(_ s: String, _ n: Int) throws -> String {
        return try parseDate(s).addingMonthsClamped(n).description
    }

    /// Hours are kept to 0.1 h, as tach and Hobbs meters read.
    /// Same as JS `Math.round(h * 10) / 10` (halves round toward +infinity).
    public static func roundHours(_ h: Double) -> Double {
        return (h * 10 + 0.5).rounded(.down) / 10
    }

    /// Date on which `hoursRemaining` will be used up at `avgHoursPerMonth`.
    /// Floors to whole days so the projection never lands after the real event.
    public static func projectDate(asOf: CivilDate, hoursRemaining: Double?, avgHoursPerMonth: Double?) -> CivilDate? {
        guard let avg = avgHoursPerMonth, avg > 0 else { return nil }
        guard let hours = hoursRemaining, hours >= 0 else { return nil }
        let perDay = avg / avgDaysPerMonth
        let days = (hours / perDay).rounded(.down)
        // Guard against absurd inputs (JS would produce an out-of-range string).
        guard days.isFinite, days < 10_000_000 else { return nil }
        return asOf.adding(days: Int(days))
    }
}
