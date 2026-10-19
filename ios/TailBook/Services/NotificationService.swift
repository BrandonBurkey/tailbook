import Foundation
import UserNotifications
import TailBookEngine

/// One planned local notification.
struct ReminderPlan: Equatable {
    let identifier: String
    let fireDate: Date
    let title: String
    let body: String
}

/// Pure planning logic (unit-tested): 60/30/7 days before each calendar item.
enum ReminderPlanner {
    static let identifierPrefix = "tailbook.reminder."

    /// Calendar items only: items whose status comes from a date (not a tach forecast)
    /// and that are still current. Reminders already in the past are skipped.
    static func plans(tail: String, aircraftKey: String, items: [EvaluatedItem], now: Date,
                      calendar: Calendar = .current,
                      leadDays: [Int] = AppConfig.reminderLeadDays,
                      hour: Int = AppConfig.reminderHour) -> [ReminderPlan] {
        var out: [ReminderPlan] = []
        for item in items {
            guard item.status == .ok || item.status == .dueSoon else { continue }
            guard item.governedBy == .date, let due = item.dueDate else { continue }
            for lead in leadDays {
                let fireDay = due.adding(days: -lead)
                var parts = DateComponents()
                parts.year = fireDay.year
                parts.month = fireDay.month
                parts.day = fireDay.day
                parts.hour = hour
                guard let fireDate = calendar.date(from: parts), fireDate > now else { continue }
                let identifier = "\(identifierPrefix)\(aircraftKey).\(item.listKey).\(lead)"
                let title = "\(tail): \(item.name) due in \(Fmt.days(lead))"
                let body = "Current through \(Fmt.date(due)) (\(item.citation)). Plan it with your A&P/IA and verify against your logbooks."
                out.append(ReminderPlan(identifier: identifier, fireDate: fireDate, title: title, body: body))
            }
        }
        return out
    }
}

/// Schedules local notifications. No server, no push.
@MainActor
final class NotificationService {
    static let shared = NotificationService()

    private let center = UNUserNotificationCenter.current()

    private init() {}

    func authorizationStatus() async -> UNAuthorizationStatus {
        let settings = await center.notificationSettings()
        return settings.authorizationStatus
    }

    /// Ask for permission (call only after the "Get warned before anything lapses" prompt).
    func requestPermission() async -> Bool {
        do {
            return try await center.requestAuthorization(options: [.alert, .sound, .badge])
        } catch {
            return false
        }
    }

    /// Replace every TailBook reminder with a fresh plan for `aircraft`.
    func reschedule(aircraft: [Aircraft], enabled: Bool, now: Date = Date()) async {
        let pending = await center.pendingNotificationRequests()
        let ours = pending.map { $0.identifier }.filter { $0.hasPrefix(ReminderPlanner.identifierPrefix) }
        if !ours.isEmpty {
            center.removePendingNotificationRequests(withIdentifiers: ours)
        }
        guard enabled else { return }
        let status = await authorizationStatus()
        guard status == .authorized || status == .provisional || status == .ephemeral else { return }

        let today = CivilDate.from(now)
        var plans: [ReminderPlan] = []
        for plane in aircraft {
            let result = plane.evaluate(asOf: today)
            plans += ReminderPlanner.plans(tail: plane.displayTail, aircraftKey: plane.uuid.uuidString,
                                           items: result.items, now: now)
        }
        plans.sort { $0.fireDate < $1.fireDate }

        let calendar = Calendar.current
        for plan in plans.prefix(AppConfig.maxPendingReminders) {
            let content = UNMutableNotificationContent()
            content.title = plan.title
            content.body = plan.body
            content.sound = .default
            let parts = calendar.dateComponents([.year, .month, .day, .hour, .minute], from: plan.fireDate)
            let trigger = UNCalendarNotificationTrigger(dateMatching: parts, repeats: false)
            let request = UNNotificationRequest(identifier: plan.identifier, content: content, trigger: trigger)
            do {
                try await center.add(request)
            } catch {
                // A failed reminder is not fatal; the board is the source of truth.
            }
        }
    }
}
