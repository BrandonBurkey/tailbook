import XCTest
import Foundation
import SwiftData
import TailBookEngine
@testable import TailBook

/// Models → engine profile, tach log, "Mark done", reminders and PDFs.
@MainActor
final class ModelTests: XCTestCase {
    private let calendar = Calendar(identifier: .gregorian)
    private var container: ModelContainer? = nil

    /// A fresh in-memory store per test (created on first use).
    private var context: ModelContext {
        if let existing = container {
            return existing.mainContext
        }
        let made = Persistence.makeContainer(inMemory: true)
        container = made
        return made.mainContext
    }

    private func day(_ year: Int, _ month: Int, _ day: Int) -> Date {
        var parts = DateComponents()
        parts.year = year
        parts.month = month
        parts.day = day
        parts.hour = 12
        return calendar.date(from: parts)!
    }

    private func civil(_ s: String) -> CivilDate {
        return CivilDate(s)!
    }

    private func makeHealthyAircraft() -> Aircraft {
        let aircraft = Aircraft(tailNumber: "N12345", makeModel: "Cessna 182")
        aircraft.currentTach = 1250
        aircraft.avgHoursPerMonth = 10
        aircraft.lastAnnual = day(2026, 3, 15)
        aircraft.lastTransponder = day(2025, 5, 10)
        aircraft.lastELTInspection = day(2026, 3, 15)
        aircraft.eltBatteryExpires = day(2028, 1, 1)
        aircraft.eltBatteryMonthOnly = true
        aircraft.registrationExpires = day(2029, 6, 30)
        aircraft.tracksOilChange = false
        context.insert(aircraft)
        try? context.save()
        return aircraft
    }

    // MARK: Profile building

    func testHealthyAircraftMatchesTheGoldenBaseCase() {
        let aircraft = makeHealthyAircraft()
        let result = aircraft.evaluate(asOf: civil("2026-10-19"), calendar: calendar)
        XCTAssertEqual(result.summary.status, .current)
        XCTAssertEqual(result.summary.allCurrent, true)
        let annual = result.items.first { $0.id == "annual" }
        XCTAssertEqual(annual?.dueDate?.description, "2027-03-31")
        XCTAssertEqual(annual?.daysRemaining, 163)
        let battery = result.items.first { $0.id == "eltBattery" }
        XCTAssertEqual(battery?.dueDate?.description, "2028-01-31", "month-only sticker reads as end of month")
        XCTAssertEqual(result.items.first { $0.id == "pitotStatic" }?.status, .notApplicable)
        XCTAssertNil(result.items.first { $0.id == "oilChange" }, "oil change is off")
    }

    func testDontKnowYetGivesIncompleteNotACrash() {
        let aircraft = Aircraft(tailNumber: "N1", makeModel: "")
        context.insert(aircraft)
        let result = aircraft.evaluate(asOf: civil("2026-10-19"), calendar: calendar)
        XCTAssertEqual(result.summary.status, .incomplete)
        XCTAssertNil(result.summary.allCurrent)
        XCTAssertEqual(result.items.first { $0.id == "annual" }?.status, .unknown)
    }

    func testTrackedItemsBecomeADsAndCustomItemsWithRefs() {
        let aircraft = makeHealthyAircraft()
        let ad = TrackedItem(kind: .ad)
        ad.adNumber = "2020-18-04"
        ad.intervalHours = 100
        ad.intervalCalendarMonths = 12
        ad.lastDoneDate = day(2026, 1, 10)
        ad.lastDoneTach = 1150
        context.insert(ad)
        ad.aircraft = aircraft

        let custom = TrackedItem(kind: .custom)
        custom.title = "Fire extinguisher"
        custom.intervalMonths = 6
        custom.lastDoneDate = day(2026, 5, 1)
        context.insert(custom)
        custom.aircraft = aircraft
        try? context.save()

        let result = aircraft.evaluate(asOf: civil("2026-10-19"), calendar: calendar)
        let adItem = result.items.first { $0.sourceRef == ad.engineRef }
        XCTAssertEqual(adItem?.id, "ad:2020-18-04")
        XCTAssertEqual(adItem?.dueTach, 1250)
        XCTAssertEqual(adItem?.status, .dueSoon, "0 hrs left is yellow, still current")
        let customItem = result.items.first { $0.sourceRef == custom.engineRef }
        XCTAssertEqual(customItem?.dueDate?.description, "2026-11-01", "plain months are anniversaries")
    }

    // MARK: Tach log

    func testTachLogUpdatesTachAndRejectsLowerReadings() {
        let aircraft = makeHealthyAircraft()
        let outcome = TachLogger.log(tach: 1251.6, aircraft: aircraft, context: context)
        XCTAssertEqual(outcome, .logged(hoursFlown: 1.6))
        XCTAssertEqual(aircraft.currentTach, 1251.6)
        XCTAssertEqual(aircraft.tachEntries?.count, 1)

        let lower = TachLogger.log(tach: 1200, aircraft: aircraft, context: context)
        if case .rejected = lower {} else { XCTFail("a lower tach must be rejected") }
        XCTAssertEqual(aircraft.currentTach, 1251.6)
    }

    func testUtilizationComesFromHistoryAfter30Days() {
        let aircraft = makeHealthyAircraft()
        XCTAssertEqual(aircraft.effectiveAvgHoursPerMonth, 10, "owner estimate until there is history")
        for (date, tach) in [(day(2026, 6, 1), 1200.0), (day(2026, 7, 31), 1240.0)] {
            let entry = TachEntry(date: date, tach: tach)
            context.insert(entry)
            entry.aircraft = aircraft
        }
        try? context.save()
        // 40 hrs over 60 days ≈ 20.3 hrs/month
        let average = aircraft.effectiveAvgHoursPerMonth ?? 0
        XCTAssertEqual(average, 20.3, accuracy: 0.05)
    }

    // MARK: Mark done

    func testMarkAnnualDoneTodayMovesTheDueDateToMonthEnd() throws {
        let aircraft = makeHealthyAircraft()
        aircraft.lastAnnual = day(2025, 1, 1)
        let asOf = civil("2026-10-19")
        let before = aircraft.evaluate(asOf: asOf, calendar: calendar)
        let annual = try XCTUnwrap(before.items.first { $0.id == "annual" })
        XCTAssertEqual(annual.status, .overdue)

        ItemActions.markDoneToday(annual, aircraft: aircraft, now: day(2026, 10, 19))
        let after = aircraft.evaluate(asOf: asOf, calendar: calendar)
        XCTAssertEqual(after.items.first { $0.id == "annual" }?.dueDate?.description, "2027-10-31")
        XCTAssertEqual(aircraft.annualTach, 1250, "annual records the tach (it also resets the 100-hour)")
    }

    func testLateHundredHourCarriesTheExcessForward() throws {
        let aircraft = makeHealthyAircraft()
        aircraft.isForHire = true
        aircraft.last100HourTach = 1145
        aircraft.currentTach = 1250
        let asOf = civil("2026-10-19")
        let item = try XCTUnwrap(aircraft.evaluate(asOf: asOf, calendar: calendar).items.first { $0.id == "hundredHour" })
        XCTAssertEqual(item.dueTach, 1245)
        XCTAssertEqual(item.status, .overdue)

        ItemActions.markDoneToday(item, aircraft: aircraft)
        XCTAssertEqual(aircraft.previous100HourDueTach, 1245)
        let after = try XCTUnwrap(aircraft.evaluate(asOf: asOf, calendar: calendar).items.first { $0.id == "hundredHour" })
        XCTAssertEqual(after.dueTach, 1345, "next due = previous limit + 100, not 1250 + 100")
    }

    // MARK: Reminders

    func testRemindersAt60_30_7DaysSkipPastOnes() {
        let aircraft = makeHealthyAircraft()
        let now = day(2026, 10, 19)
        let result = aircraft.evaluate(asOf: civil("2026-10-19"), calendar: calendar)
        let plans = ReminderPlanner.plans(tail: "N12345", aircraftKey: "A", items: result.items, now: now,
                                          calendar: calendar, leadDays: [60, 30, 7], hour: 9)
        let annualPlans = plans.filter { $0.identifier.contains(".annual.") }
        XCTAssertEqual(annualPlans.count, 3)
        // Annual is current through 2027-03-31: reminders on Jan 30, Mar 1 and Mar 24.
        let fireDays = annualPlans.map { CivilDate.from($0.fireDate, calendar: calendar).description }.sorted()
        XCTAssertEqual(fireDays, ["2027-01-30", "2027-03-01", "2027-03-24"])
        XCTAssertTrue(plans.allSatisfy { $0.fireDate > now })
        XCTAssertFalse(plans.contains { $0.identifier.contains("pitotStatic") }, "N/A items get no reminders")
    }

    // MARK: PDFs

    func testBothPDFsAreGenerated() throws {
        let aircraft = makeHealthyAircraft()
        let squawk = Squawk(title: "Left brake soft")
        context.insert(squawk)
        squawk.aircraft = aircraft
        try? context.save()
        for kind in [PDFExporter.Kind.annualWorkOrder, PDFExporter.Kind.statusReport] {
            let url = try PDFExporter.make(kind, for: aircraft)
            let data = try Data(contentsOf: url)
            XCTAssertGreaterThan(data.count, 1_000)
            XCTAssertEqual(String(decoding: data.prefix(5), as: UTF8.self), "%PDF-")
        }
    }

    // MARK: Sample data

    func testSampleAircraftShowsSomethingToAttendTo() {
        let sample = SampleData.insertSample(into: context)
        let result = sample.evaluate()
        XCTAssertGreaterThan(result.summary.counts.overdue + result.summary.counts.dueSoon, 0,
                            "the demo must show the aha moment")
        XCTAssertEqual(sample.openSquawks.count, 2)
    }
}
