import Foundation
import TailBookEngine

// The one place where SwiftData models become an engine `Profile`.
// Dates picked in the UI are local-calendar days; they cross into the engine
// as timezone-free civil dates and come back via `CivilDate.toDate()`.

extension CivilDate {
    /// The civil (local calendar) day of `date`.
    static func from(_ date: Date, calendar: Calendar = .current) -> CivilDate {
        let parts = calendar.dateComponents([.year, .month, .day], from: date)
        let fallback = CivilDate(dayNumber: 0)
        return CivilDate(year: parts.year ?? 1970, month: parts.month ?? 1, day: parts.day ?? 1) ?? fallback
    }

    /// Today in the user's calendar. The engine itself never reads a clock.
    static var today: CivilDate {
        return CivilDate.from(Date())
    }

    /// Noon on this day in `calendar` (noon avoids DST edge cases).
    func toDate(calendar: Calendar = .current) -> Date {
        var parts = DateComponents()
        parts.year = year
        parts.month = month
        parts.day = day
        parts.hour = 12
        return calendar.date(from: parts) ?? Date()
    }
}

extension Aircraft {
    /// Builds the engine input from what the owner entered.
    func engineProfile(asOf: CivilDate, calendar: Calendar = .current) -> Profile {
        func civil(_ date: Date?) -> String? {
            guard let date = date else { return nil }
            return CivilDate.from(date, calendar: calendar).description
        }

        var profile = Profile(asOf: asOf.description)
        profile.aircraft = AircraftInfo(
            ifr: isIFR,
            forHire: isForHire,
            hasTransponder: hasTransponder,
            hasElt: hasELT,
            usesVor: usesVOR,
            currentTach: currentTach,
            avgHoursPerMonth: effectiveAvgHoursPerMonth
        )
        profile.annual = AnnualEntry(lastDone: civil(lastAnnual), tach: annualTach)
        profile.hundredHour = HundredHourEntry(lastDoneTach: last100HourTach, previousDueTach: previous100HourDueTach)
        profile.pitotStatic = DoneEntry(lastDone: civil(lastPitotStatic))
        profile.transponder = DoneEntry(lastDone: civil(lastTransponder))
        profile.eltInspection = DoneEntry(lastDone: civil(lastELTInspection))

        var batteryString: String? = nil
        if let expires = eltBatteryExpires {
            let day = CivilDate.from(expires, calendar: calendar)
            batteryString = eltBatteryMonthOnly ? day.yearMonthString : day.description
        }
        profile.eltBattery = EltBatteryEntry(expires: batteryString, cumulativeUseHours: eltCumulativeUseHours)
        profile.vorCheck = DoneEntry(lastDone: civil(lastVORCheck))
        profile.registration = RegistrationEntry(expires: civil(registrationExpires), issued: nil)

        if tracksOilChange {
            profile.oilChange = IntervalEntry(
                lastDoneDate: civil(lastOilChangeDate),
                lastDoneTach: lastOilChangeTach,
                intervalHours: oilIntervalHours > 0 ? oilIntervalHours : nil,
                intervalMonths: oilIntervalMonths > 0 ? oilIntervalMonths : nil
            )
        }

        let tracked = sortedTrackedItems
        profile.ads = tracked.filter { $0.kind == .ad }.map { $0.adEntry(calendar: calendar) }
        profile.customItems = tracked.filter { $0.kind == .custom }.map { $0.customEntry(calendar: calendar) }
        return profile
    }

    /// The board for this aircraft as of `asOf` (today by default).
    func evaluate(asOf: CivilDate = CivilDate.today, calendar: Calendar = .current) -> EvaluationResult {
        return Engine.evaluate(engineProfile(asOf: asOf, calendar: calendar), asOf: asOf)
    }
}

extension TrackedItem {
    private func civil(_ date: Date?, _ calendar: Calendar) -> String? {
        guard let date = date else { return nil }
        return CivilDate.from(date, calendar: calendar).description
    }

    private func positive(_ value: Int?) -> Int? {
        guard let value = value, value > 0 else { return nil }
        return value
    }

    private func positive(_ value: Double?) -> Double? {
        guard let value = value, value > 0 else { return nil }
        return value
    }

    func intervalEntry(calendar: Calendar) -> IntervalEntry {
        let isOneTime = kind == .ad && !isRecurring
        return IntervalEntry(
            lastDoneDate: civil(lastDoneDate, calendar),
            lastDoneTach: lastDoneTach,
            intervalHours: isOneTime ? nil : positive(intervalHours),
            intervalCalendarMonths: isOneTime ? nil : positive(intervalCalendarMonths),
            intervalMonths: isOneTime ? nil : positive(intervalMonths),
            intervalDays: isOneTime ? nil : positive(intervalDays),
            dueDate: isOneTime ? civil(oneTimeDueDate, calendar) : nil,
            dueTach: isOneTime ? oneTimeDueTach : nil
        )
    }

    func adEntry(calendar: Calendar) -> ADEntry {
        let number = adNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        let name = title.trimmingCharacters(in: .whitespacesAndNewlines)
        return ADEntry(
            adNumber: number.isEmpty ? nil : number,
            id: nil,
            title: name.isEmpty ? nil : name,
            url: nil,
            recurring: isRecurring,
            complied: isComplied,
            applicable: isApplicable,
            reason: nil,
            ref: engineRef,
            interval: intervalEntry(calendar: calendar)
        )
    }

    func customEntry(calendar: Calendar) -> CustomEntry {
        let name = title.trimmingCharacters(in: .whitespacesAndNewlines)
        return CustomEntry(
            id: engineRef,
            name: name.isEmpty ? nil : name,
            citation: nil,
            rule: nil,
            regulatory: isRegulatory,
            ref: engineRef,
            interval: intervalEntry(calendar: calendar)
        )
    }
}
