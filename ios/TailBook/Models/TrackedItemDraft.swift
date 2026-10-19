import Foundation

/// Editable copy of an AD or custom item.
struct TrackedItemDraft: Equatable {
    var kind: TrackedItemKind
    var adNumber: String = ""
    var title: String = ""
    var isRecurring: Bool = true
    var mode: IntervalMode = .whicheverFirst
    var hoursText: String = ""
    var timeValueText: String = ""
    var timeUnit: TimeUnit = .calendarMonths
    var lastDoneDate: Date? = nil
    var lastDoneTachText: String = ""
    var isComplied: Bool = false
    var oneTimeDueDate: Date? = nil
    var oneTimeDueTachText: String = ""
    var isApplicable: Bool = true
    var isRegulatory: Bool = false
    var complianceNote: String = ""

    init(kind: TrackedItemKind) {
        self.kind = kind
        if kind == .custom {
            mode = .calendarMonths
        }
    }

    init(item: TrackedItem) {
        kind = item.kind
        adNumber = item.adNumber
        title = item.title
        isRecurring = item.isRecurring
        lastDoneDate = item.lastDoneDate
        lastDoneTachText = Fmt.numberText(item.lastDoneTach)
        isComplied = item.isComplied
        oneTimeDueDate = item.oneTimeDueDate
        oneTimeDueTachText = Fmt.numberText(item.oneTimeDueTach)
        isApplicable = item.isApplicable
        isRegulatory = item.isRegulatory
        complianceNote = item.complianceNote

        let hours = item.intervalHours ?? 0
        var unit: TimeUnit? = nil
        var timeValue = 0
        if let n = item.intervalCalendarMonths, n > 0 {
            unit = .calendarMonths
            timeValue = n
        } else if let n = item.intervalMonths, n > 0 {
            unit = .months
            timeValue = n
        } else if let n = item.intervalDays, n > 0 {
            unit = .days
            timeValue = n
        }
        hoursText = hours > 0 ? Fmt.hours(hours) : ""
        timeValueText = timeValue > 0 ? String(timeValue) : ""
        if let unit = unit {
            timeUnit = unit
            if hours > 0 {
                mode = .whicheverFirst
            } else {
                switch unit {
                case .calendarMonths: mode = .calendarMonths
                case .months: mode = .months
                case .days: mode = .days
                }
            }
        } else {
            mode = .hours
        }
    }

    var usesHours: Bool {
        return mode == .hours || mode == .whicheverFirst
    }

    var usesTime: Bool {
        return mode != .hours
    }

    /// The time unit actually in effect for the selected mode.
    var effectiveTimeUnit: TimeUnit {
        switch mode {
        case .calendarMonths: return .calendarMonths
        case .months: return .months
        case .days: return .days
        case .hours, .whicheverFirst: return timeUnit
        }
    }

    var hasName: Bool {
        switch kind {
        case .ad:
            return !adNumber.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                || !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        case .custom:
            return !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        }
    }

    func apply(to item: TrackedItem) {
        item.kind = kind
        item.adNumber = adNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        item.title = title.trimmingCharacters(in: .whitespacesAndNewlines)
        item.isRecurring = kind == .custom ? true : isRecurring
        item.lastDoneDate = lastDoneDate
        item.lastDoneTach = Fmt.parseNumber(lastDoneTachText)
        item.isComplied = isComplied
        item.oneTimeDueDate = oneTimeDueDate
        item.oneTimeDueTach = Fmt.parseNumber(oneTimeDueTachText)
        item.isApplicable = isApplicable
        item.isRegulatory = isRegulatory
        item.complianceNote = complianceNote

        let hours = Fmt.parseNumber(hoursText)
        let timeValue = Int(timeValueText.trimmingCharacters(in: .whitespacesAndNewlines))
        item.intervalHours = usesHours ? hours : nil
        item.intervalCalendarMonths = nil
        item.intervalMonths = nil
        item.intervalDays = nil
        if usesTime {
            switch effectiveTimeUnit {
            case .calendarMonths: item.intervalCalendarMonths = timeValue
            case .months: item.intervalMonths = timeValue
            case .days: item.intervalDays = timeValue
            }
        }
    }
}
