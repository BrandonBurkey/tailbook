import Foundation
import TailBookEngine

/// What a date edit on an item means, for the detail screen's sheet.
struct DateEditTarget: Identifiable {
    let id = UUID()
    let kind: RuleKind
    let sourceRef: String?
    let title: String
    let initial: Date?
    let allowsFuture: Bool
}

/// Maps an engine item back to the model fields it was computed from, so the
/// detail screen can "Mark done today" or edit the date.
@MainActor
enum ItemActions {
    static func trackedItem(_ ref: String?, in aircraft: Aircraft) -> TrackedItem? {
        guard let ref = ref else { return nil }
        return (aircraft.trackedItems ?? []).first { $0.engineRef == ref }
    }

    static func canMarkDone(_ item: EvaluatedItem, aircraft: Aircraft) -> Bool {
        if item.status == .notApplicable { return false }
        switch item.kind {
        case .annual, .pitotStatic, .transponder, .eltInspection, .vorCheck, .oilChange:
            return true
        case .hundredHour:
            return aircraft.currentTach != nil
        case .ad, .custom:
            return trackedItem(item.sourceRef, in: aircraft) != nil
        case .eltBattery, .registration:
            return false
        }
    }

    static func markDoneLabel(for kind: RuleKind) -> String {
        switch kind {
        case .hundredHour: return "Mark done at current tach"
        case .oilChange: return "Mark changed today"
        default: return "Mark done today"
        }
    }

    /// "Mark done today": sets the last-done date (and tach where it matters).
    static func markDoneToday(_ item: EvaluatedItem, aircraft: Aircraft, now: Date = Date()) {
        switch item.kind {
        case .annual:
            aircraft.lastAnnual = now
            if let tach = aircraft.currentTach {
                aircraft.annualTach = tach
            }
        case .pitotStatic:
            aircraft.lastPitotStatic = now
        case .transponder:
            aircraft.lastTransponder = now
        case .eltInspection:
            aircraft.lastELTInspection = now
        case .vorCheck:
            aircraft.lastVORCheck = now
        case .hundredHour:
            guard let tach = aircraft.currentTach else { return }
            // Done late (past the limit): the excess carries into the next
            // interval (§91.409(b)), so remember the limit that was in force.
            if let due = item.dueTach, tach > due {
                aircraft.previous100HourDueTach = due
            } else {
                aircraft.previous100HourDueTach = nil
            }
            aircraft.last100HourTach = tach
        case .oilChange:
            aircraft.lastOilChangeDate = now
            aircraft.lastOilChangeTach = aircraft.currentTach
        case .ad, .custom:
            guard let tracked = trackedItem(item.sourceRef, in: aircraft) else { return }
            tracked.lastDoneDate = now
            if let tach = aircraft.currentTach {
                tracked.lastDoneTach = tach
            }
            if tracked.kind == .ad && !tracked.isRecurring {
                tracked.isComplied = true
            }
        case .eltBattery, .registration:
            break
        }
    }

    /// The date edit offered for an item, if any.
    static func dateEditTarget(for item: EvaluatedItem, aircraft: Aircraft) -> DateEditTarget? {
        if item.status == .notApplicable { return nil }
        let initial: Date?
        let title: String
        var allowsFuture = false
        switch item.kind {
        case .annual:
            initial = aircraft.lastAnnual
            title = "Date of last annual"
        case .pitotStatic:
            initial = aircraft.lastPitotStatic
            title = "Date of last pitot-static check"
        case .transponder:
            initial = aircraft.lastTransponder
            title = "Date of last transponder check"
        case .eltInspection:
            initial = aircraft.lastELTInspection
            title = "Date of last ELT inspection"
        case .vorCheck:
            initial = aircraft.lastVORCheck
            title = "Date of last VOR check"
        case .eltBattery:
            initial = aircraft.eltBatteryExpires
            title = "Battery replacement date marked on the ELT"
            allowsFuture = true
        case .registration:
            initial = aircraft.registrationExpires
            title = "Registration expiration date"
            allowsFuture = true
        case .oilChange:
            initial = aircraft.lastOilChangeDate
            title = "Date of last oil change"
        case .ad, .custom:
            guard let tracked = trackedItem(item.sourceRef, in: aircraft) else { return nil }
            initial = tracked.lastDoneDate
            title = "Date last done"
        case .hundredHour:
            return nil
        }
        return DateEditTarget(kind: item.kind, sourceRef: item.sourceRef, title: title,
                              initial: initial, allowsFuture: allowsFuture)
    }

    static func apply(date: Date?, to target: DateEditTarget, aircraft: Aircraft) {
        switch target.kind {
        case .annual: aircraft.lastAnnual = date
        case .pitotStatic: aircraft.lastPitotStatic = date
        case .transponder: aircraft.lastTransponder = date
        case .eltInspection: aircraft.lastELTInspection = date
        case .vorCheck: aircraft.lastVORCheck = date
        case .eltBattery: aircraft.eltBatteryExpires = date
        case .registration: aircraft.registrationExpires = date
        case .oilChange: aircraft.lastOilChangeDate = date
        case .ad, .custom:
            trackedItem(target.sourceRef, in: aircraft)?.lastDoneDate = date
        case .hundredHour:
            break
        }
    }
}
