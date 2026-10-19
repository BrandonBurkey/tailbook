import Foundation
import XCTest
import TailBookEngine

/// Port of the "engine invariants" suite in engine/test/engine.test.js, plus
/// a few Swift-specific checks.
final class EngineInvariantTests: XCTestCase {

    func testEveryItemHasCitationRuleColorAndMessage() throws {
        for c in try GoldenVectors.profileCases() {
            let caseID = c["id"] as? String ?? "?"
            guard let object = c["profile"] else { continue }
            let result = try Engine.evaluate(try GoldenVectors.decodeProfile(object))
            for item in result.items {
                XCTAssertFalse(item.citation.isEmpty, "\(caseID)/\(item.id) citation")
                XCTAssertFalse(item.rule.isEmpty, "\(caseID)/\(item.id) rule")
                XCTAssertEqual(item.color, item.status.color, "\(caseID)/\(item.id) color")
                XCTAssertFalse(item.message.isEmpty, "\(caseID)/\(item.id) message")
                if item.status == .notApplicable {
                    XCTAssertNotNil(item.reason, "\(caseID)/\(item.id) N/A reason")
                }
            }
        }
    }

    func testEvaluateIsPure() throws {
        let healthy = try GoldenVectors.profile(id: "base-healthy-vfr")
        let copy = healthy
        let first = try Engine.evaluate(healthy)
        let second = try Engine.evaluate(healthy)
        XCTAssertEqual(first, second)
        XCTAssertEqual(healthy, copy)
    }

    func testAsOfIsRequired() {
        XCTAssertThrowsError(try Engine.evaluate(Profile(asOf: "")))
        XCTAssertThrowsError(try Engine.evaluate(Profile(asOf: "2026-02-30")))
    }

    func testDisclaimerNamesTheMechanicAndPIC() throws {
        let result = try Engine.evaluate(try GoldenVectors.profile(id: "base-healthy-vfr"))
        XCTAssertEqual(result.disclaimer, Engine.disclaimer)
        XCTAssertTrue(Engine.disclaimer.contains("A&P/IA and the pilot in command determine airworthiness"))
        XCTAssertEqual(result.engineVersion, "1.0.0")
    }

    func testCalendarMonthDueDateNeverDependsOnDayDone() throws {
        for m in 1...12 {
            let first = try DateMath.endOfCalendarMonths(DateMath.formatDate(2026, m, 1), 12)
            let last = try DateMath.endOfCalendarMonths(DateMath.formatDate(2026, m, DateMath.daysInMonth(2026, m)), 12)
            XCTAssertEqual(first, last)
            XCTAssertTrue(try DateMath.addDays(first, 1).hasSuffix("-01"), "due date is always a month end")
        }
    }

    func testDayNumbersRoundTripAcross400Years() throws {
        var n = try DateMath.toDayNumber("1900-01-01")
        let end = try DateMath.toDayNumber("2300-01-01")
        while n < end {
            XCTAssertEqual(try DateMath.toDayNumber(DateMath.fromDayNumber(n)), n)
            n += 37
        }
        XCTAssertEqual(try DateMath.toDayNumber("1970-01-01"), 0)
        XCTAssertEqual(DateMath.fromDayNumber(-1), "1969-12-31")
    }

    func testInvalidDatesAreRejected() {
        for bad in ["2026-02-29", "2026-13-01", "2026-00-10", "26-01-01", "2026/01/01", ""] {
            XCTAssertThrowsError(try DateMath.parseDate(bad), bad)
        }
        XCTAssertEqual(try DateMath.normalizeDate(" 2027-03 "), "2027-03-31")
    }

    func testGarbageDateMakesItemUnknownInsteadOfThrowing() throws {
        var profile = try GoldenVectors.profile(id: "base-healthy-vfr")
        profile.annual = AnnualEntry(lastDone: "last spring")
        let result = try Engine.evaluate(profile)
        XCTAssertEqual(result.items.first(where: { $0.id == "annual" })?.status, .unknown)
    }

    func testSortForBoardPutsRedFirstAndNotApplicableLast() throws {
        var profile = try GoldenVectors.profile(id: "base-healthy-vfr")
        profile.annual = AnnualEntry(lastDone: "2025-01-01")
        let sorted = Engine.sortForBoard(try Engine.evaluate(profile).items)
        XCTAssertEqual(sorted.first?.status, .overdue)
        XCTAssertEqual(sorted.last?.status, .notApplicable)
    }

    // MARK: Swift-specific

    func testSourceRefPassesThroughForADsAndCustomItems() throws {
        let profile = Profile(
            asOf: "2026-10-19",
            aircraft: AircraftInfo(ifr: false, forHire: false, currentTach: 1000, avgHoursPerMonth: 10),
            ads: [ADEntry(adNumber: "2020-18-04", ref: "ref-ad",
                          interval: IntervalEntry(lastDoneDate: "2026-01-10", intervalCalendarMonths: 12))],
            customItems: [CustomEntry(name: "Fire extinguisher", ref: "ref-custom",
                                      interval: IntervalEntry(lastDoneDate: "2026-05-01", intervalCalendarMonths: 6))]
        )
        let result = try Engine.evaluate(profile)
        let ad = result.items.first(where: { $0.id == "ad:2020-18-04" })
        XCTAssertEqual(ad?.sourceRef, "ref-ad")
        XCTAssertEqual(ad?.dueDate?.description, "2027-01-31")
        let custom = result.items.first(where: { $0.id == "custom:fire-extinguisher" })
        XCTAssertEqual(custom?.sourceRef, "ref-custom")
        XCTAssertEqual(custom?.dueDate?.description, "2026-11-30")
        XCTAssertEqual(custom?.status, .ok)
    }

    func testCivilDateHelpers() throws {
        let date = try XCTUnwrap(CivilDate("2028-02"))
        XCTAssertEqual(date.description, "2028-02-29")
        XCTAssertEqual(date.yearMonthString, "2028-02")
        XCTAssertNil(CivilDate(year: 2026, month: 2, day: 29))
        XCTAssertEqual(CivilDate(year: 2026, month: 10, day: 19)?.adding(days: 163).description, "2027-03-31")
        XCTAssertTrue(try XCTUnwrap(CivilDate("2026-01-01")) < date)
    }

    func testRoundHoursMatchesJavaScript() {
        XCTAssertEqual(DateMath.roundHours(1250.04), 1250.0, accuracy: 1e-9)
        XCTAssertEqual(DateMath.roundHours(10.05), 10.1, accuracy: 1e-9)
        // JS Math.round rounds halves toward +infinity: -0.25 * 10 = -2.5 -> -2.
        XCTAssertEqual(DateMath.roundHours(-0.25), -0.2, accuracy: 1e-9)
    }
}
