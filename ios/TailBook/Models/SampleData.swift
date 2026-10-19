import Foundation
import SwiftData
import TailBookEngine

/// A demo aircraft (for App Review, previews and curious owners). It is
/// labeled "sample" everywhere and uses no real AD numbers.
@MainActor
enum SampleData {
    @discardableResult
    static func insertSample(into context: ModelContext, now: Date = Date()) -> Aircraft {
        let calendar = Calendar.current

        func shifted(months: Int, days: Int = 0) -> Date {
            var parts = DateComponents()
            parts.month = months
            parts.day = days
            return calendar.date(byAdding: parts, to: now) ?? now
        }

        let aircraft = Aircraft(tailNumber: "N182TB", makeModel: "Cessna 182 (sample)")
        aircraft.isIFR = true
        aircraft.isForHire = false
        aircraft.currentTach = 1252.4
        aircraft.currentHobbs = 1530.8
        aircraft.avgHoursPerMonth = 8
        aircraft.lastAnnual = shifted(months: -10)
        aircraft.lastTransponder = shifted(months: -23)
        aircraft.lastPitotStatic = shifted(months: -25)
        aircraft.lastELTInspection = shifted(months: -10)
        aircraft.eltBatteryExpires = shifted(months: 14)
        aircraft.eltBatteryMonthOnly = true
        aircraft.lastVORCheck = shifted(months: 0, days: -12)
        aircraft.registrationExpires = shifted(months: 40)
        aircraft.lastOilChangeDate = shifted(months: -2)
        aircraft.lastOilChangeTach = 1212.0
        context.insert(aircraft)

        let readings: [(Int, Double)] = [(-90, 1228.1), (-60, 1236.0), (-30, 1244.6), (0, 1252.4)]
        var previous: Double? = nil
        for (dayOffset, tach) in readings {
            let entry = TachEntry(date: shifted(months: 0, days: dayOffset), tach: tach, hobbs: nil,
                                  hoursFlown: previous.map { DateMath.roundHours(tach - $0) } ?? 0,
                                  note: "Sample")
            context.insert(entry)
            entry.aircraft = aircraft
            previous = tach
        }

        let ad = TrackedItem(kind: .ad)
        ad.adNumber = "SAMPLE-01"
        ad.title = "Sample recurring inspection (not a real AD)"
        ad.intervalHours = 100
        ad.intervalCalendarMonths = 12
        ad.lastDoneDate = shifted(months: -8)
        ad.lastDoneTach = 1190.0
        ad.complianceNote = "Sample: inspected per AD paragraph (g). Logbook p. 42."
        context.insert(ad)
        ad.aircraft = aircraft

        let extinguisher = TrackedItem(kind: .custom)
        extinguisher.title = "Fire extinguisher inspection"
        extinguisher.intervalCalendarMonths = 12
        extinguisher.lastDoneDate = shifted(months: -11, days: -20)
        context.insert(extinguisher)
        extinguisher.aircraft = aircraft

        let brake = Squawk(title: "Left brake feels soft", detail: "Noticed on taxi after landing.")
        context.insert(brake)
        brake.aircraft = aircraft

        let navLight = Squawk(title: "Right nav light intermittent")
        context.insert(navLight)
        navLight.aircraft = aircraft

        try? context.save()
        return aircraft
    }
}
