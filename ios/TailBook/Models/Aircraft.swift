import Foundation
import SwiftData

/// One aircraft and the dates/meter readings the owner entered.
/// Every stored property has a default (SwiftData + future CloudKit friendly);
/// a nil date means "Don't know yet" and evaluates to `unknown`, never a crash.
@Model
final class Aircraft {
    var uuid: UUID = UUID()
    var createdAt: Date = Date()

    // Profile
    var tailNumber: String = ""
    var makeModel: String = ""
    var isIFR: Bool = false
    var isForHire: Bool = false
    var hasTransponder: Bool = true
    var hasELT: Bool = true
    var usesVOR: Bool = true

    // Meters
    var currentTach: Double? = nil
    var currentHobbs: Double? = nil
    /// Owner's estimate; replaced by the tach-log average once there is 30+ days of history.
    var avgHoursPerMonth: Double? = nil

    // Inspections and expirations
    var lastAnnual: Date? = nil
    /// Tach at the last annual (an annual also resets the 100-hour interval).
    var annualTach: Double? = nil
    var lastTransponder: Date? = nil
    var lastPitotStatic: Date? = nil
    var lastELTInspection: Date? = nil
    var eltBatteryExpires: Date? = nil
    /// Battery stickers usually show "EXP 03/2027": month-only reads as end of month.
    var eltBatteryMonthOnly: Bool = true
    var eltCumulativeUseHours: Double? = nil
    var lastVORCheck: Date? = nil
    var registrationExpires: Date? = nil
    var last100HourTach: Double? = nil
    /// The 100-hour limit in force when the last one was done (late-inspection carry-forward).
    var previous100HourDueTach: Double? = nil

    // Oil change (advisory)
    var tracksOilChange: Bool = true
    var lastOilChangeDate: Date? = nil
    var lastOilChangeTach: Double? = nil
    var oilIntervalHours: Double = 50
    var oilIntervalMonths: Int = 4

    @Relationship(deleteRule: .cascade, inverse: \TrackedItem.aircraft)
    var trackedItems: [TrackedItem]? = []

    @Relationship(deleteRule: .cascade, inverse: \TachEntry.aircraft)
    var tachEntries: [TachEntry]? = []

    @Relationship(deleteRule: .cascade, inverse: \Squawk.aircraft)
    var squawks: [Squawk]? = []

    init(tailNumber: String = "", makeModel: String = "") {
        self.tailNumber = tailNumber
        self.makeModel = makeModel
    }
}

extension Aircraft {
    var displayTail: String {
        let trimmed = tailNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.isEmpty ? "Aircraft" : trimmed
    }

    var sortedTrackedItems: [TrackedItem] {
        return (trackedItems ?? []).sorted { $0.createdAt < $1.createdAt }
    }

    var sortedTachEntries: [TachEntry] {
        return (tachEntries ?? []).sorted { $0.date > $1.date }
    }

    var openSquawks: [Squawk] {
        return (squawks ?? []).filter { $0.isOpen }.sorted { $0.createdAt > $1.createdAt }
    }

    var closedSquawks: [Squawk] {
        return (squawks ?? []).filter { !$0.isOpen }.sorted { ($0.closedAt ?? $0.createdAt) > ($1.closedAt ?? $1.createdAt) }
    }

    /// Average hours per month from the tach log, once it spans at least 30 days.
    var utilizationFromHistory: Double? {
        let entries = (tachEntries ?? []).sorted { $0.date < $1.date }
        guard entries.count >= 2, let first = entries.first, let last = entries.last else { return nil }
        let days = last.date.timeIntervalSince(first.date) / 86_400
        guard days >= 30 else { return nil }
        let hours = last.tach - first.tach
        guard hours >= 0 else { return nil }
        let perMonth = hours / days * (365.25 / 12)
        return (perMonth * 10).rounded() / 10
    }

    /// What the engine uses for projections: history when available, else the owner's estimate.
    var effectiveAvgHoursPerMonth: Double? {
        return utilizationFromHistory ?? avgHoursPerMonth
    }

    var utilizationSourceDescription: String {
        if utilizationFromHistory != nil { return "from your tach log" }
        if avgHoursPerMonth != nil { return "your estimate" }
        return "not set"
    }
}
