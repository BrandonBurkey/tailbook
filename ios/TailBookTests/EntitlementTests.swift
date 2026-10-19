import XCTest
@testable import TailBook

final class EntitlementTests: XCTestCase {

    func testFreeTierIsBoardOnly() {
        let free = Entitlements.free
        for feature in Entitlements.Feature.allCases {
            XCTAssertFalse(free.allows(feature), "\(feature) should be Pro-only")
        }
    }

    func testProUnlocksEverything() {
        let pro = Entitlements.pro
        for feature in Entitlements.Feature.allCases {
            XCTAssertTrue(pro.allows(feature), "\(feature) should be unlocked by Pro")
        }
    }

    func testFreeTierAllowsExactlyOneAircraft() {
        XCTAssertEqual(Entitlements.freeAircraftLimit, 1)
        XCTAssertTrue(Entitlements.free.canAddAircraft(existingCount: 0), "onboarding must always work")
        XCTAssertFalse(Entitlements.free.canAddAircraft(existingCount: 1))
        XCTAssertTrue(Entitlements.pro.canAddAircraft(existingCount: 5))
    }

    func testProductIDsMatchStoreKitConfiguration() {
        XCTAssertEqual(AppConfig.annualProductID, "com.tailbook.pro.annual")
        XCTAssertEqual(AppConfig.monthlyProductID, "com.tailbook.pro.monthly")
        XCTAssertEqual(Set(AppConfig.proProductIDs).count, 2)
        XCTAssertTrue(AppConfig.priceAnchorLine.contains("SavvyMx"))
        XCTAssertFalse(AppConfig.debugForcePro, "never ship with Pro forced on")
    }

    func testDisclaimersNeverClaimAirworthiness() {
        for text in [Legal.shortDisclaimer, Legal.longDisclaimer] {
            XCTAssertTrue(text.contains("pilot in command"))
            XCTAssertFalse(text.lowercased().contains("is airworthy"))
        }
    }
}
