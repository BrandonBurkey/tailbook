import Foundation
import SwiftData

/// Call after any change to aircraft data: saves and reschedules reminders.
@MainActor
enum AppEvents {
    static func dataDidChange(_ context: ModelContext, store: StoreService) {
        do {
            try context.save()
        } catch {
            // SwiftData autosaves as well; keep going so reminders still update.
        }
        rescheduleReminders(context, store: store)
    }

    static func rescheduleReminders(_ context: ModelContext, store: StoreService) {
        rescheduleReminders(context, notificationsEnabled: store.entitlements.allows(.notifications))
    }

    /// `notificationsEnabled` false removes every pending TailBook reminder.
    static func rescheduleReminders(_ context: ModelContext, notificationsEnabled enabled: Bool) {
        let descriptor = FetchDescriptor<Aircraft>(sortBy: [SortDescriptor(\Aircraft.createdAt)])
        let all = (try? context.fetch(descriptor)) ?? []
        Task {
            await NotificationService.shared.reschedule(aircraft: all, enabled: enabled)
        }
    }
}
