import AppIntents
import Foundation
import SwiftData

/// "Log tach time" for Siri and Shortcuts. Runs in the app process, writes to
/// the same SwiftData store as the UI, and does not open the app.
struct LogTachIntent: AppIntent {
    static let title: LocalizedStringResource = "Log tach time"
    static let description = IntentDescription("Record the tach reading after a flight in TailBook.")
    static let openAppWhenRun: Bool = false

    @Parameter(title: "Tach reading", description: "The tach meter reading after your flight, for example 1252.4.")
    var tach: Double

    @Parameter(title: "Tail number", description: "Leave empty to use your first aircraft.")
    var tailNumber: String?

    @MainActor
    func perform() async throws -> some IntentResult & ProvidesDialog {
        let isPro = await StoreService.hasActiveProEntitlement()
        if !isPro {
            return .result(dialog: "Quick tach logging is part of TailBook Pro. Open TailBook to start your free trial.")
        }

        let context = Persistence.shared.mainContext
        let descriptor = FetchDescriptor<Aircraft>(sortBy: [SortDescriptor(\Aircraft.createdAt)])
        let fleet = try context.fetch(descriptor)
        let wanted = (tailNumber ?? "").trimmingCharacters(in: .whitespacesAndNewlines).uppercased()

        var target: Aircraft? = nil
        if wanted.isEmpty {
            target = fleet.first
        } else {
            target = fleet.first { $0.tailNumber.uppercased() == wanted }
        }
        guard let aircraft = target else {
            let message = wanted.isEmpty
                ? "There's no aircraft in TailBook yet. Open TailBook to set one up."
                : "I couldn't find \(wanted) in TailBook."
            return .result(dialog: "\(message)")
        }

        let outcome = TachLogger.log(tach: tach, aircraft: aircraft, context: context)
        let message: String
        switch outcome {
        case .logged(let hoursFlown):
            message = "Logged \(Fmt.hours(tach)) tach for \(aircraft.displayTail) (\(Fmt.hours(hoursFlown)) hrs flown)."
            AppEvents.rescheduleReminders(context, notificationsEnabled: true)
        case .rejected(let reason):
            message = reason
        }
        return .result(dialog: "\(message)")
    }
}

struct TailBookShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: LogTachIntent(),
            phrases: [
                "Log tach time in \(.applicationName)",
                "Log a flight in \(.applicationName)",
            ],
            shortTitle: "Log tach time",
            systemImageName: "speedometer"
        )
    }
}
