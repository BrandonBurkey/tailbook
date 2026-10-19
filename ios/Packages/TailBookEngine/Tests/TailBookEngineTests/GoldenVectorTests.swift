import Foundation
import XCTest
import TailBookEngine

/// Runs every case in engine/test-vectors.json, comparing only the fields each
/// vector constrains (the same rule as engine/test/engine.test.js).
final class GoldenVectorTests: XCTestCase {

    // MARK: dateCases

    func testDateCases() throws {
        let cases = try GoldenVectors.dateCases()
        XCTAssertGreaterThanOrEqual(cases.count, 20, "expected the full set of date vectors")
        for c in cases {
            let fn = c["fn"] as? String ?? "?"
            let args = c["args"] as? [Any] ?? []
            let argText = args.map { String(describing: $0) }.joined(separator: ", ")
            let label = fn + "(" + argText + ")"
            let expected = c["expect"]
            switch fn {
            case "endOfCalendarMonths", "addMonthsClamped", "addDays":
                guard args.count == 2, let date = args[0] as? String, let n = (args[1] as? NSNumber)?.intValue,
                      let want = expected as? String else {
                    XCTFail("\(label): malformed vector")
                    continue
                }
                let got: String
                if fn == "endOfCalendarMonths" {
                    got = try DateMath.endOfCalendarMonths(date, n)
                } else if fn == "addMonthsClamped" {
                    got = try DateMath.addMonthsClamped(date, n)
                } else {
                    got = try DateMath.addDays(date, n)
                }
                XCTAssertEqual(got, want, label)
            case "daysBetween":
                guard args.count == 2, let a = args[0] as? String, let b = args[1] as? String,
                      let want = (expected as? NSNumber)?.intValue else {
                    XCTFail("\(label): malformed vector")
                    continue
                }
                XCTAssertEqual(try DateMath.daysBetween(a, b), want, label)
            case "normalizeDate":
                guard args.count == 1, let s = args[0] as? String, let want = expected as? String else {
                    XCTFail("\(label): malformed vector")
                    continue
                }
                XCTAssertEqual(try DateMath.normalizeDate(s), want, label)
            default:
                XCTFail("\(label): the Swift runner does not know date function \(fn); add it")
            }
        }
    }

    // MARK: profile cases

    func testProfileCases() throws {
        let cases = try GoldenVectors.profileCases()
        XCTAssertGreaterThanOrEqual(cases.count, 40, "at least 40 cases")
        for c in cases {
            let caseID = c["id"] as? String ?? "?"
            guard let profileObject = c["profile"] else {
                XCTFail("\(caseID): no profile")
                continue
            }
            let profile = try GoldenVectors.decodeProfile(profileObject)
            let result = try Engine.evaluate(profile)
            let expect = c["expect"] as? [String: Any] ?? [:]

            if let items = expect["items"] as? [String: Any] {
                for (itemID, expectedAny) in items {
                    guard let item = result.items.first(where: { $0.id == itemID }) else {
                        XCTFail("\(caseID): missing item \(itemID)")
                        continue
                    }
                    let fields = expectedAny as? [String: Any] ?? [:]
                    for (key, value) in fields {
                        checkItemField(item, key: key, expected: value, label: "\(caseID).\(itemID).\(key)")
                    }
                }
            }
            if let summary = expect["summary"] as? [String: Any] {
                for (key, value) in summary {
                    checkSummaryField(result.summary, key: key, expected: value, label: "\(caseID).summary.\(key)")
                }
            }
        }
    }

    // MARK: field comparison

    private func checkItemField(_ item: EvaluatedItem, key: String, expected: Any, label: String) {
        switch key {
        case "status": checkString(item.status.rawValue, expected, label)
        case "color": checkString(item.color.rawValue, expected, label)
        case "kind": checkString(item.kind.rawValue, expected, label)
        case "scope": checkString(item.scope.rawValue, expected, label)
        case "name": checkString(item.name, expected, label)
        case "citation": checkString(item.citation, expected, label)
        case "url": checkString(item.url, expected, label)
        case "rule": checkString(item.rule, expected, label)
        case "message": checkString(item.message, expected, label)
        case "reason": checkString(item.reason, expected, label)
        case "governedBy": checkString(item.governedBy?.rawValue, expected, label)
        case "dueDate": checkString(item.dueDate?.description, expected, label)
        case "effectiveDate": checkString(item.effectiveDate?.description, expected, label)
        case "projectedDate": checkString(item.projectedDate?.description, expected, label)
        case "lastDone": checkString(item.lastDone?.description, expected, label)
        case "daysRemaining": checkNumber(item.daysRemaining.map { Double($0) }, expected, label)
        case "dueTach": checkNumber(item.dueTach, expected, label)
        case "hoursRemaining": checkNumber(item.hoursRemaining, expected, label)
        case "overflyHoursRemaining": checkNumber(item.overflyHoursRemaining, expected, label)
        case "lastDoneTach": checkNumber(item.lastDoneTach, expected, label)
        case "regulatory": checkBool(item.regulatory, expected, label)
        case "notes":
            if let want = expected as? [String] {
                XCTAssertEqual(item.notes, want, label)
            } else {
                XCTFail("\(label): expected a string array")
            }
        default:
            XCTFail("\(label): the Swift runner does not compare item field \(key); add it")
        }
    }

    private func checkSummaryField(_ summary: Summary, key: String, expected: Any, label: String) {
        switch key {
        case "status": checkString(summary.status.rawValue, expected, label)
        case "allCurrent": checkBool(summary.allCurrent, expected, label)
        case "headline": checkString(summary.headline, expected, label)
        case "affects":
            if let want = expected as? [String] {
                XCTAssertEqual(summary.affects, want, label)
            } else {
                XCTFail("\(label): expected a string array")
            }
        case "attention":
            if let want = expected as? [String] {
                XCTAssertEqual(summary.attention, want, label)
            } else {
                XCTFail("\(label): expected a string array")
            }
        case "counts":
            guard let want = expected as? [String: Any] else {
                XCTFail("\(label): expected an object")
                return
            }
            for (statusKey, value) in want {
                guard let status = ItemStatus(rawValue: statusKey) else {
                    XCTFail("\(label).\(statusKey): unknown status")
                    continue
                }
                checkNumber(Double(summary.counts[status]), value, "\(label).\(statusKey)")
            }
        case "nextDue":
            if expected is NSNull {
                XCTAssertNil(summary.nextDue, label)
                return
            }
            guard let want = expected as? [String: Any] else {
                XCTFail("\(label): expected an object or null")
                return
            }
            guard let next = summary.nextDue else {
                XCTFail("\(label): expected a next-due item, got nil")
                return
            }
            for (field, value) in want {
                let fieldLabel = "\(label).\(field)"
                switch field {
                case "id": checkString(next.id, value, fieldLabel)
                case "name": checkString(next.name, value, fieldLabel)
                case "date": checkString(next.date.description, value, fieldLabel)
                case "daysRemaining": checkNumber(Double(next.daysRemaining), value, fieldLabel)
                case "projected": checkBool(next.projected, value, fieldLabel)
                default: XCTFail("\(fieldLabel): the Swift runner does not compare this field; add it")
                }
            }
        default:
            XCTFail("\(label): the Swift runner does not compare summary field \(key); add it")
        }
    }

    private func checkString(_ actual: String?, _ expected: Any, _ label: String) {
        if expected is NSNull {
            XCTAssertNil(actual, label)
            return
        }
        guard let want = expected as? String else {
            XCTFail("\(label): expected value is not a string")
            return
        }
        XCTAssertEqual(actual, want, label)
    }

    private func checkNumber(_ actual: Double?, _ expected: Any, _ label: String) {
        if expected is NSNull {
            XCTAssertNil(actual, label)
            return
        }
        guard let want = (expected as? NSNumber)?.doubleValue else {
            XCTFail("\(label): expected value is not a number")
            return
        }
        guard let got = actual else {
            XCTFail("\(label): expected \(want), got nil")
            return
        }
        XCTAssertEqual(got, want, accuracy: 1e-9, label)
    }

    private func checkBool(_ actual: Bool?, _ expected: Any, _ label: String) {
        if expected is NSNull {
            XCTAssertNil(actual, label)
            return
        }
        guard let want = (expected as? NSNumber)?.boolValue else {
            XCTFail("\(label): expected value is not a boolean")
            return
        }
        XCTAssertEqual(actual, want, label)
    }
}
