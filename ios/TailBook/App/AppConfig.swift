import Foundation

/// Every value the founder may need to change before launch lives here.
enum AppConfig {
    // MARK: Links (PLACEHOLDERS: replace before App Store submission)

    /// Terms of Use (supplemental to Apple's Standard EULA). Required for subscriptions (3.1.2).
    static let termsURL = URL(string: "https://example.com/tailbook/terms")!
    /// Privacy Policy. Required (5.1.1).
    static let privacyURL = URL(string: "https://example.com/tailbook/privacy")!
    /// Support page shown in Settings and in App Store Connect.
    static let supportURL = URL(string: "https://example.com/tailbook/support")!
    static let supportEmail = "support@example.com"

    // MARK: StoreKit

    /// One subscription group, two products (see TailBook.storekit and App Store Connect).
    static let annualProductID = "com.tailbook.pro.annual"
    static let monthlyProductID = "com.tailbook.pro.monthly"
    static let proProductIDs: [String] = [annualProductID, monthlyProductID]

    /// Static anchor line on the paywall. The live annual price replaces "$199/yr"
    /// once StoreKit has loaded (see StoreService.anchorLine).
    static let priceAnchorLine = "SavvyMx ~$750/yr · TailBook $199/yr"
    static let anchorCompetitor = "SavvyMx ~$750/yr"

    // MARK: Reminders

    /// Local notifications fire this many days before each calendar item lapses.
    static let reminderLeadDays: [Int] = [60, 30, 7]
    /// Local hour of day reminders fire.
    static let reminderHour = 9
    /// iOS keeps at most 64 pending local notifications per app.
    static let maxPendingReminders = 60

    // MARK: Onboarding defaults

    static let defaultAverageHoursPerMonth = "8"
    static let defaultOilIntervalHours = "50"
    static let defaultOilIntervalMonths = 4

    // MARK: Debug

    /// Set to true to test Pro features in Debug builds without StoreKit. Never ships (DEBUG only).
    static let debugForcePro = false
}

/// The disclaimer wording from validation/07-legal-and-appstore.md §1.
/// One source of truth: the board uses `Engine.disclaimer`; these are the long
/// and short forms for About, onboarding, the paywall and PDFs.
enum Legal {
    static let shortDisclaimer =
        "TailBook organizes the dates you enter. Your A&P/IA and the pilot in command determine airworthiness."

    static let longDisclaimer =
        "TailBook is an organizational tool. It records and calculates dates and times from information you provide " +
        "and displays reminders. TailBook does not inspect aircraft, does not determine airworthiness, and does not " +
        "determine whether any Airworthiness Directive or other requirement applies to your aircraft. Your A&P " +
        "mechanic or Inspection Authorization holder and the pilot in command are solely responsible for determining " +
        "airworthiness (see 14 CFR 91.7, 91.403). Always verify against your aircraft's maintenance records and " +
        "current regulations before flight. TailBook may contain errors."

    /// Bump when the disclaimer wording changes, so owners accept it again.
    static let disclaimerVersion = 1
}
