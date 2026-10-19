import Foundation
import SwiftData
import TailBookEngine

enum TachLogOutcome: Equatable {
    case logged(hoursFlown: Double)
    case rejected(String)
}

/// Shared by the Log Flight sheet and the "Log tach time" App Intent.
@MainActor
enum TachLogger {
    static func log(tach rawTach: Double, hobbs: Double? = nil, date: Date = Date(), note: String = "",
                    aircraft: Aircraft, context: ModelContext) -> TachLogOutcome {
        guard rawTach.isFinite, rawTach >= 0, rawTach < 100_000 else {
            return .rejected("That tach reading doesn't look right.")
        }
        let tach = DateMath.roundHours(rawTach)
        let previous = aircraft.currentTach ?? tach
        if tach < previous {
            return .rejected("\(Fmt.hours(tach)) is lower than the current tach (\(Fmt.hours(previous))). Edit the aircraft if the meter was replaced.")
        }
        let flown = DateMath.roundHours(tach - previous)
        let entry = TachEntry(date: date, tach: tach, hobbs: hobbs, hoursFlown: flown, note: note)
        context.insert(entry)
        entry.aircraft = aircraft
        aircraft.currentTach = tach
        if let hobbs = hobbs {
            aircraft.currentHobbs = hobbs
        }
        do {
            try context.save()
        } catch {
            return .rejected("Couldn't save: \(error.localizedDescription)")
        }
        return .logged(hoursFlown: flown)
    }
}
