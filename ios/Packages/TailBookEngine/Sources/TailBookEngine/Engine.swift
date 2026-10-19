import Foundation

/**
 TailBook due-date rules engine: Swift port of engine/tailbook-engine.js (1.0.0).

 Pure and timezone-free: "today" is always an input (`asOf`), dates are
 `CivilDate`s, and the same inputs always give the same output. The port must
 pass engine/test-vectors.json exactly (see Tests/TailBookEngineTests).

 "Calendar months" (§91.409(a), §91.411, §91.413, §91.207(d)) end on the LAST
 day of the Nth month after the month done (FAA Order 8300.10 as restated by
 CASA, the FAA Chief Counsel flight-review letter, FAA CertAlert 10-01; see the
 JS file header for links). Plain "days" (§91.171) and plain "months" (many
 ADs) are not rounded to month end.

 A due date is the LAST day the item is current, inclusive: on the due date
 daysRemaining = 0 and the item is due_soon; the next day it is overdue. A due
 tach is likewise inclusive. Projected dates are informational only: status
 is computed from the facts entered, never from a forecast.

 The summary reports whether entered items are current. It is never an
 airworthiness determination and must be shown next to `Engine.disclaimer`.
 */
public enum Engine {
    public static let version = "1.0.0"

    /// Legal framing shown everywhere results are shown. Do not remove.
    public static let disclaimer =
        "TailBook organizes the dates and times you enter; it does not inspect your aircraft " +
        "or certify airworthiness. Your A&P/IA and the pilot in command determine airworthiness " +
        "(14 CFR §91.3, §91.7, §91.403). Always verify against your logbooks."

    // MARK: - Public entry points

    /// Evaluate a profile whose `asOf` is a "YYYY-MM-DD" string (the JS signature).
    /// Throws `EngineError.invalidDate` if `asOf` is missing or invalid.
    public static func evaluate(_ profile: Profile) throws -> EvaluationResult {
        guard let asOf = CivilDate(profile.asOf) else {
            throw EngineError.invalidDate(profile.asOf)
        }
        return evaluate(profile, asOf: asOf)
    }

    /// Evaluate a profile as of `asOf` (ignores `profile.asOf`). Never throws:
    /// bad or missing data becomes an `unknown` item.
    public static func evaluate(_ profile: Profile, asOf: CivilDate) -> EvaluationResult {
        let aircraft = profile.aircraft
        let ctx = EvalContext(
            asOf: asOf,
            currentTach: num(aircraft?.currentTach),
            avgHoursPerMonth: num(aircraft?.avgHoursPerMonth)
        )

        var items: [EvaluatedItem] = [
            evalAnnual(profile, ctx),
            evalHundredHour(profile, ctx),
            evalPitotStatic(profile, ctx),
            evalTransponder(profile, ctx),
            evalEltInspection(profile, ctx),
            evalEltBattery(profile, ctx),
            evalVorCheck(profile, ctx),
            evalRegistration(profile, ctx),
        ]
        if let oil = evalOilChange(profile, ctx) {
            items.append(oil)
        }
        for (index, entry) in (profile.ads ?? []).enumerated() {
            items.append(evalAd(entry, index, ctx))
        }
        for (index, entry) in (profile.customItems ?? []).enumerated() {
            items.append(evalCustom(entry, index, ctx))
        }

        return EvaluationResult(
            engineVersion: version,
            asOf: asOf,
            items: items,
            summary: summarize(items, asOf: asOf),
            disclaimer: disclaimer
        )
    }

    /// Items sorted for display: red, yellow, unknown, green, n/a; then by
    /// date (effective date, else due date, else last). Stable.
    public static func sortForBoard(_ items: [EvaluatedItem]) -> [EvaluatedItem] {
        let far = 1_000_000_000
        func dateKey(_ item: EvaluatedItem) -> Int {
            if let effective = item.effectiveDate { return effective.dayNumber }
            if let due = item.dueDate { return due.dayNumber }
            return far
        }
        let indexed = Array(items.enumerated())
        let sorted = indexed.sorted { lhs, rhs in
            let orderL = lhs.element.status.boardOrder
            let orderR = rhs.element.status.boardOrder
            if orderL != orderR { return orderL < orderR }
            let keyL = dateKey(lhs.element)
            let keyR = dateKey(rhs.element)
            if keyL != keyR { return keyL < keyR }
            return lhs.offset < rhs.offset
        }
        return sorted.map { $0.element }
    }

    // MARK: - Summary

    /// What an overdue item with a limited scope affects (neutral wording, not a verdict).
    static func affectsText(_ scope: Scope) -> String? {
        switch scope {
        case .ifr: return "IFR operations"
        case .hire: return "For-hire operations"
        case .transponder: return "Transponder use"
        case .all, .advisory: return nil
        }
    }

    /**
     Overall "All items current?" summary of the regulatory items.

       overdue     an item that applies to every flight (scope all) is overdue
       incomplete  an item with scope all is unknown, so we can't say
       limited     only IFR / for-hire / transponder items are overdue
       current     no regulatory item is overdue or unknown
     */
    public static func summarize(_ items: [EvaluatedItem], asOf: CivilDate) -> Summary {
        var counts = StatusCounts()
        for item in items {
            counts[item.status] += 1
        }

        let reg = items.filter { $0.regulatory }
        let everyFlight = reg.filter { $0.scope == .all && $0.status == .overdue }
        let missing = reg.filter { $0.scope == .all && $0.status == .unknown }
        let limiting = reg.filter { $0.scope != .all && $0.status == .overdue }
        var affects: [String] = []
        for item in limiting {
            if let text = affectsText(item.scope), !affects.contains(text) {
                affects.append(text)
            }
        }
        let attention = items.filter { !$0.regulatory && $0.status == .overdue }.map { $0.id }

        func names(_ list: [EvaluatedItem]) -> String {
            return list.map { $0.name }.joined(separator: ", ")
        }

        let status: SummaryStatus
        let allCurrent: Bool?
        var headline: String
        if !everyFlight.isEmpty {
            status = .overdue
            allCurrent = false
            headline = "Not all items current: \(names(everyFlight + limiting)) overdue."
        } else if !missing.isEmpty {
            status = .incomplete
            allCurrent = nil
            headline = "Can't tell yet: enter \(names(missing))."
        } else if !limiting.isEmpty {
            status = .limited
            allCurrent = false
            let affected = affects.joined(separator: ", ").lowercased()
            headline = "Not all items current: \(names(limiting)) overdue (affects \(affected))."
        } else {
            status = .current
            allCurrent = true
            headline = "All items current, based on the dates you entered."
        }
        if counts.dueSoon > 0 {
            headline += " \(plural(counts.dueSoon, "item")) due soon."
        }

        // Next due: the earliest upcoming effective date (projected for hours items).
        var nextDue: NextDue? = nil
        for item in items {
            guard item.status == .ok || item.status == .dueSoon else { continue }
            guard let effective = item.effectiveDate else { continue }
            let days = asOf.days(to: effective)
            if let current = nextDue, days >= current.daysRemaining { continue }
            nextDue = NextDue(
                id: item.id,
                name: item.name,
                date: effective,
                daysRemaining: days,
                projected: item.governedBy == .hours,
                sourceRef: item.sourceRef
            )
        }

        return Summary(
            status: status,
            allCurrent: allCurrent,
            headline: headline,
            affects: affects,
            attention: attention,
            counts: counts,
            nextDue: nextDue
        )
    }

    // MARK: - Context and small helpers

    struct EvalContext {
        let asOf: CivilDate
        let currentTach: Double?
        let avgHoursPerMonth: Double?
    }

    struct Limits {
        var dueDate: CivilDate? = nil
        var dueTach: Double? = nil
    }

    enum DateRead {
        case missing
        case invalid(String)
        case date(CivilDate)
    }

    /// JS `num()`: null for missing or non-finite numbers.
    static func num(_ value: Double?) -> Double? {
        guard let value = value, value.isFinite else { return nil }
        return value
    }

    static func roundHours(_ h: Double) -> Double {
        return DateMath.roundHours(h)
    }

    static func fmtHours(_ h: Double) -> String {
        return String(format: "%.1f", h)
    }

    static func plural(_ n: Int, _ word: String) -> String {
        return "\(n) \(word)\(n == 1 ? "" : "s")"
    }

    /// Validate a done/issue date: present, parseable and not after asOf.
    static func readPastDate(_ value: String?, _ ctx: EvalContext, _ label: String) -> DateRead {
        guard let value = value, !value.isEmpty else { return .missing }
        guard let date = CivilDate(value) else {
            return .invalid("\(label) \"\(value)\" is not a valid date.")
        }
        if date.dayNumber > ctx.asOf.dayNumber {
            return .invalid("\(label) \(date) is in the future. Check the date.")
        }
        return .date(date)
    }

    static func readAnyDate(_ value: String?, _ label: String) -> DateRead {
        guard let value = value, !value.isEmpty else { return .missing }
        guard let date = CivilDate(value) else {
            return .invalid("\(label) \"\(value)\" is not a valid date.")
        }
        return .date(date)
    }

    static func slug(_ s: String) -> String {
        let lower = s.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        var out = ""
        var inRun = false
        for scalar in lower.unicodeScalars {
            let v = scalar.value
            let allowed = (v >= 97 && v <= 122) || (v >= 48 && v <= 57) || v == 46 || v == 45
            if allowed {
                out.unicodeScalars.append(scalar)
                inRun = false
            } else if !inRun {
                out.append("-")
                inRun = true
            }
        }
        if out.hasPrefix("-") { out.removeFirst() }
        if out.hasSuffix("-") { out.removeLast() }
        return out.isEmpty ? "item" : out
    }

    // MARK: - Status of one item given its limits

    static func worse(_ a: ItemStatus, _ b: ItemStatus) -> ItemStatus {
        return a.severity >= b.severity ? a : b
    }

    static func statusForDays(_ daysRemaining: Int) -> ItemStatus {
        if daysRemaining < 0 { return .overdue }
        if daysRemaining <= Thresholds.dueSoonDays { return .dueSoon }
        return .ok
    }

    static func statusForHours(_ hoursRemaining: Double) -> ItemStatus {
        if hoursRemaining < 0 { return .overdue }
        if hoursRemaining <= Thresholds.dueSoonHours { return .dueSoon }
        return .ok
    }

    static func minDate(_ a: CivilDate?, _ b: CivilDate?) -> CivilDate? {
        guard let a = a else { return b }
        guard let b = b else { return a }
        return a.dayNumber <= b.dayNumber ? a : b
    }

    /// Calendar limit, hours limit, or both (whichever first: the worse status
    /// wins and the earlier date is the effective date). Writes the limit
    /// fields onto `item` (JS `Object.assign(item, evaluateLimits(...))`).
    static func applyLimits(_ item: EvaluatedItem, _ ctx: EvalContext, _ limits: Limits) -> EvaluatedItem {
        var out = item
        out.status = .ok
        out.dueDate = limits.dueDate
        out.dueTach = limits.dueTach.map { roundHours($0) }
        out.daysRemaining = nil
        out.hoursRemaining = nil
        out.projectedDate = nil
        out.effectiveDate = nil
        out.governedBy = nil

        var dateStatus: ItemStatus? = nil
        var hoursStatus: ItemStatus? = nil

        if let dueDate = limits.dueDate {
            let days = ctx.asOf.days(to: dueDate)
            out.daysRemaining = days
            dateStatus = statusForDays(days)
        }
        if let dueTach = limits.dueTach {
            if let currentTach = ctx.currentTach {
                let hours = roundHours(dueTach - currentTach)
                out.hoursRemaining = hours
                hoursStatus = statusForHours(hours)
                out.projectedDate = DateMath.projectDate(asOf: ctx.asOf, hoursRemaining: hours,
                                                         avgHoursPerMonth: ctx.avgHoursPerMonth)
            } else {
                hoursStatus = .unknown
            }
        }

        if let ds = dateStatus, let hs = hoursStatus {
            out.status = worse(ds, hs)
            let projected = out.projectedDate
            out.effectiveDate = minDate(limits.dueDate, projected)
            if hs.severity > ds.severity {
                out.governedBy = .hours
            } else if ds.severity > hs.severity {
                out.governedBy = .date
            } else if let p = projected, let due = limits.dueDate, p.dayNumber < due.dayNumber {
                out.governedBy = .hours
            } else {
                out.governedBy = .date
            }
        } else if let ds = dateStatus {
            out.status = ds
            out.effectiveDate = limits.dueDate
            out.governedBy = .date
        } else if let hs = hoursStatus {
            out.status = hs
            out.effectiveDate = out.projectedDate
            out.governedBy = .hours
        } else {
            out.status = .unknown
        }
        return finish(out)
    }

    // MARK: - Item builders

    static func baseItem(id: String, kind: RuleKind, name: String? = nil, citation: String? = nil,
                         url: String? = nil, useDefaultURL: Bool = true, rule: String? = nil,
                         scope: Scope? = nil, regulatory: Bool? = nil) -> EvaluatedItem {
        let r = Rules.rule(for: kind)
        return EvaluatedItem(
            id: id,
            kind: kind,
            name: name ?? r.name,
            citation: citation ?? r.citation,
            url: useDefaultURL ? r.url : url,
            rule: rule ?? r.rule,
            scope: scope ?? r.scope,
            regulatory: regulatory ?? r.regulatory
        )
    }

    static func finish(_ item: EvaluatedItem) -> EvaluatedItem {
        var out = item
        out.color = out.status.color
        if out.message.isEmpty {
            out.message = describe(out)
        }
        return out
    }

    static func notApplicable(_ item: EvaluatedItem, _ reason: String) -> EvaluatedItem {
        var out = item
        out.status = .notApplicable
        out.reason = reason
        out.message = "Not applicable: \(reason)"
        return finish(out)
    }

    static func unknown(_ item: EvaluatedItem, _ reason: String) -> EvaluatedItem {
        var out = item
        out.status = .unknown
        out.reason = reason
        out.message = reason
        return finish(out)
    }

    /// Owner-facing one-line summary of an evaluated item.
    static func describe(_ item: EvaluatedItem) -> String {
        var parts: [String] = []
        if let dueDate = item.dueDate {
            let d = item.daysRemaining ?? 0
            if d < 0 {
                parts.append("Overdue since \(dueDate.adding(days: 1)) (\(plural(-d, "day")) ago)")
            } else if d == 0 {
                parts.append("Due today (\(dueDate)), last day current")
            } else {
                parts.append("Due by \(dueDate) (\(plural(d, "day")))")
            }
        }
        if let dueTach = item.dueTach {
            if let h = item.hoursRemaining {
                if h < 0 {
                    parts.append("Overdue: \(fmtHours(-h)) hrs past \(fmtHours(dueTach)) tach")
                } else {
                    var s = "Due at \(fmtHours(dueTach)) tach (\(fmtHours(h)) hrs left"
                    if let projected = item.projectedDate {
                        s += ", about \(projected) at your pace"
                    }
                    parts.append(s + ")")
                }
            } else {
                parts.append("Due at \(fmtHours(dueTach)) tach (enter current tach)")
            }
        }
        if parts.count == 2 {
            var second = parts[1]
            let prefix = "Due at"
            if second.hasPrefix(prefix) {
                second = "or at" + String(second.dropFirst(prefix.count))
            }
            return "\(parts[0]); \(second), whichever comes first"
        }
        return parts.joined()
    }

    /// Calendar-month item: annual, pitot-static, transponder, ELT inspection.
    static func calendarItem(id: String, kind: RuleKind, months: Int, lastDone: String?,
                             _ ctx: EvalContext, label: String) -> EvaluatedItem {
        var item = baseItem(id: id, kind: kind)
        switch readPastDate(lastDone, ctx, label) {
        case .missing:
            return unknown(item, "Enter the date of the last \(label.lowercased()).")
        case .invalid(let message):
            return unknown(item, message)
        case .date(let date):
            item.lastDone = date
            return applyLimits(item, ctx, Limits(dueDate: date.endOfCalendarMonths(months), dueTach: nil))
        }
    }

    static func evalAnnual(_ p: Profile, _ ctx: EvalContext) -> EvaluatedItem {
        return calendarItem(id: "annual", kind: .annual, months: 12, lastDone: p.annual?.lastDone, ctx,
                            label: "Annual inspection")
    }

    /**
     §91.409(b) 100-hour inspection.
       lastDoneTach      tach at the last 100-hour inspection
       previousDueTach   the limit in force when it was done. Done late (inside
                         the 10-hour overfly), the excess counts against the
                         next interval: next due = previousDueTach + 100.
     An annual with a later tach also resets the interval. Over the limit is
     OVERDUE even inside the 10-hour allowance (ferry only, no for-hire flying).
     */
    static func evalHundredHour(_ p: Profile, _ ctx: EvalContext) -> EvaluatedItem {
        var item = baseItem(id: "hundredHour", kind: .hundredHour)
        if p.aircraft?.forHire != true {
            return notApplicable(item, "Aircraft is not used to carry people for hire or for flight instruction for hire (§91.409(b)).")
        }
        var lastTach = num(p.hundredHour?.lastDoneTach)
        var prevDue = num(p.hundredHour?.previousDueTach)
        if let annualTach = num(p.annual?.tach) {
            var annualIsLater = true
            if let last = lastTach {
                annualIsLater = annualTach > last
            }
            if annualIsLater {
                lastTach = annualTach
                prevDue = nil // an annual starts a fresh interval
                item.notes.append("Interval measured from the last annual, which also satisfies §91.409(b).")
            }
        }
        guard let last = lastTach else {
            return unknown(item, "Enter the tach time at the last 100-hour inspection.")
        }

        var dueTach = last + 100
        if let previous = prevDue, last > previous {
            let excess = roundHours(last - previous)
            dueTach = previous + 100
            item.notes.append("Last inspection was \(fmtHours(excess)) hrs past its limit; that excess counts against this interval (§91.409(b)).")
            if excess > Thresholds.hundredHourOverfly {
                item.notes.append("That exceeded the \(Int(Thresholds.hundredHourOverfly))-hour overfly allowance. Review with your IA.")
            }
        }
        item.lastDoneTach = roundHours(last)
        item = applyLimits(item, ctx, Limits(dueDate: nil, dueTach: dueTach))
        if let hours = item.hoursRemaining, hours < 0 {
            let over = -hours
            let left = roundHours(Thresholds.hundredHourOverfly - over)
            item.overflyHoursRemaining = max(0, left)
            if left >= 0 {
                item.notes.append("Within the 10-hour allowance (\(fmtHours(left)) hrs left) ONLY to fly to a place where the inspection can be done. No for-hire flights.")
            } else {
                item.notes.append("Beyond the 10-hour overfly allowance.")
            }
        }
        return item
    }

    static func evalPitotStatic(_ p: Profile, _ ctx: EvalContext) -> EvaluatedItem {
        if p.aircraft?.ifr != true {
            return notApplicable(baseItem(id: "pitotStatic", kind: .pitotStatic),
                                 "Not flown IFR in controlled airspace (§91.411 applies only to IFR).")
        }
        return calendarItem(id: "pitotStatic", kind: .pitotStatic, months: 24, lastDone: p.pitotStatic?.lastDone, ctx,
                            label: "Altimeter/pitot-static check")
    }

    static func evalTransponder(_ p: Profile, _ ctx: EvalContext) -> EvaluatedItem {
        if p.aircraft?.hasTransponder == false {
            return notApplicable(baseItem(id: "transponder", kind: .transponder), "No transponder installed.")
        }
        return calendarItem(id: "transponder", kind: .transponder, months: 24, lastDone: p.transponder?.lastDone, ctx,
                            label: "Transponder check")
    }

    static func evalEltInspection(_ p: Profile, _ ctx: EvalContext) -> EvaluatedItem {
        if p.aircraft?.hasElt == false {
            return notApplicable(baseItem(id: "eltInspection", kind: .eltInspection),
                                 "Owner indicates no ELT is required (see the §91.207(f) exceptions).")
        }
        return calendarItem(id: "eltInspection", kind: .eltInspection, months: 12, lastDone: p.eltInspection?.lastDone,
                            ctx, label: "ELT inspection")
    }

    /// §91.207(c) ELT battery: the marked replacement date is the last good
    /// day; month-only reads as end of month. Overdue if cumulative use > 1 hr.
    static func evalEltBattery(_ p: Profile, _ ctx: EvalContext) -> EvaluatedItem {
        var item = baseItem(id: "eltBattery", kind: .eltBattery)
        if p.aircraft?.hasElt == false {
            return notApplicable(item, "Owner indicates no ELT is required (see the §91.207(f) exceptions).")
        }
        let use = num(p.eltBattery?.cumulativeUseHours)
        let read = readAnyDate(p.eltBattery?.expires, "ELT battery date")
        if let use = use, use > 1 {
            item.status = .overdue
            if case .date(let date) = read {
                item.dueDate = date
                item.daysRemaining = ctx.asOf.days(to: date)
            }
            item.message = "Transmitter used \(fmtHours(use)) cumulative hrs (more than 1): replace or recharge the battery now (§91.207(c)(1))."
            return finish(item)
        }
        switch read {
        case .missing:
            return unknown(item, "Enter the battery replacement date marked on the ELT.")
        case .invalid(let message):
            return unknown(item, message)
        case .date(let date):
            return applyLimits(item, ctx, Limits(dueDate: date, dueTach: nil))
        }
    }

    /// §91.171 VOR check, "within the preceding 30 days": checked on D, current
    /// through D+30, lapsed on D+31.
    static func evalVorCheck(_ p: Profile, _ ctx: EvalContext) -> EvaluatedItem {
        var item = baseItem(id: "vorCheck", kind: .vorCheck)
        if p.aircraft?.ifr != true {
            return notApplicable(item, "Not flown IFR (§91.171 applies only to IFR using VOR navigation).")
        }
        if p.aircraft?.usesVor == false {
            return notApplicable(item, "No VOR receiver used for IFR navigation.")
        }
        switch readPastDate(p.vorCheck?.lastDone, ctx, "VOR check") {
        case .missing:
            return unknown(item, "Enter the date of your last VOR check.")
        case .invalid(let message):
            return unknown(item, message)
        case .date(let date):
            item.lastDone = date
            return applyLimits(item, ctx, Limits(dueDate: date.adding(days: 30), dueTach: nil))
        }
    }

    /// §47.40 registration: 7 years after the last day of the month of issue.
    /// Enter `expires` (preferred) or `issued`. Valid through the expiration date.
    static func evalRegistration(_ p: Profile, _ ctx: EvalContext) -> EvaluatedItem {
        var item = baseItem(id: "registration", kind: .registration)
        let dueDate: CivilDate
        switch readAnyDate(p.registration?.expires, "Registration expiration") {
        case .invalid(let message):
            return unknown(item, message)
        case .date(let date):
            dueDate = date
        case .missing:
            switch readPastDate(p.registration?.issued, ctx, "Registration issue date") {
            case .invalid(let message):
                return unknown(item, message)
            case .missing:
                return unknown(item, "Enter the registration expiration date (on the certificate or the FAA registry).")
            case .date(let issued):
                dueDate = issued.endOfCalendarMonths(84)
            }
        }
        item = applyLimits(item, ctx, Limits(dueDate: dueDate, dueTach: nil))
        if let days = item.daysRemaining, days >= 0,
           dueDate.addingMonthsClamped(-6).dayNumber <= ctx.asOf.dayNumber {
            item.notes.append("Renewal window is open: file AC Form 8050-1B now (§47.40(b)).")
        }
        return item
    }

    struct IntervalEvaluation {
        var limits: Limits
        var errors: [String]
        var needsDate: Bool
        var needsTach: Bool
        var lastDate: CivilDate?
        var lastTach: Double?
    }

    /// Generic interval limits (oil change, custom items, ADs). JS truthiness
    /// is kept: a zero interval counts as "not set".
    static func intervalLimits(_ entry: IntervalEntry, _ ctx: EvalContext) -> IntervalEvaluation {
        var errors: [String] = []
        var lastDate: CivilDate? = nil
        switch readPastDate(entry.lastDoneDate, ctx, "Last-done date") {
        case .invalid(let message):
            errors.append(message)
        case .date(let date):
            lastDate = date
        case .missing:
            break
        }
        let lastTach = num(entry.lastDoneTach)
        let hoursInterval = num(entry.intervalHours) ?? 0
        let calendarMonths = entry.intervalCalendarMonths ?? 0
        let plainMonths = entry.intervalMonths ?? 0
        let days = entry.intervalDays ?? 0

        var dates: [CivilDate] = []
        if let last = lastDate {
            if calendarMonths != 0 { dates.append(last.endOfCalendarMonths(calendarMonths)) }
            if plainMonths != 0 { dates.append(last.addingMonthsClamped(plainMonths)) }
            if days != 0 { dates.append(last.adding(days: days)) }
        }
        switch readAnyDate(entry.dueDate, "Due date") {
        case .invalid(let message):
            errors.append(message)
        case .date(let date):
            dates.append(date)
        case .missing:
            break
        }
        var tachs: [Double] = []
        if hoursInterval != 0, let last = lastTach {
            tachs.append(last + hoursInterval)
        }
        if let explicitTach = num(entry.dueTach) {
            tachs.append(explicitTach)
        }

        let hasDateInterval = calendarMonths != 0 || plainMonths != 0 || days != 0
        var limits = Limits()
        var earliest: CivilDate? = nil
        for date in dates {
            earliest = minDate(earliest, date)
        }
        limits.dueDate = earliest
        limits.dueTach = tachs.min()
        return IntervalEvaluation(
            limits: limits,
            errors: errors,
            needsDate: hasDateInterval && lastDate == nil,
            needsTach: hoursInterval != 0 && lastTach == nil,
            lastDate: lastDate,
            lastTach: lastTach
        )
    }

    static func evalIntervalItem(_ base: EvaluatedItem, _ entry: IntervalEntry, _ ctx: EvalContext) -> EvaluatedItem {
        var item = base
        let r = intervalLimits(entry, ctx)
        if !r.errors.isEmpty {
            return unknown(item, r.errors.joined(separator: " "))
        }
        if let lastDate = r.lastDate { item.lastDone = lastDate }
        if let lastTach = r.lastTach { item.lastDoneTach = roundHours(lastTach) }
        if r.limits.dueDate == nil && r.limits.dueTach == nil {
            return unknown(item, "Enter when it was last done and its interval.")
        }
        item = applyLimits(item, ctx, r.limits)
        // A whichever-first item missing one side cannot be called OK.
        if (r.needsDate || r.needsTach) && item.status != .overdue {
            let reason = r.needsDate
                ? "Enter the last-done date to check the calendar limit."
                : "Enter the last-done tach to check the hours limit."
            item.status = .unknown
            item.reason = reason
            item.message = "\(item.message). \(reason)"
            item = finish(item)
        }
        return item
    }

    static func evalOilChange(_ p: Profile, _ ctx: EvalContext) -> EvaluatedItem? {
        guard let oil = p.oilChange else { return nil }
        return evalIntervalItem(baseItem(id: "oilChange", kind: .oilChange), oil, ctx)
    }

    static func evalCustom(_ entry: CustomEntry, _ index: Int, _ ctx: EvalContext) -> EvaluatedItem {
        let isRegulatory = entry.regulatory == true
        let idPart = entry.id ?? slug(entry.name ?? String(index))
        var item = baseItem(
            id: "custom:\(idPart)",
            kind: .custom,
            name: entry.name ?? "Custom item \(index + 1)",
            citation: entry.citation,
            rule: entry.rule,
            scope: isRegulatory ? .all : .advisory,
            regulatory: isRegulatory
        )
        item.sourceRef = entry.ref
        return evalIntervalItem(item, entry.interval, ctx)
    }

    static func evalAd(_ entry: ADEntry, _ index: Int, _ ctx: EvalContext) -> EvaluatedItem {
        let number = entry.adNumber ?? entry.id ?? String(index + 1)
        var name = "AD \(number)"
        if let title = entry.title, !title.isEmpty {
            name += ": \(title)"
        }
        var item = baseItem(
            id: "ad:\(slug(number))",
            kind: .ad,
            name: name,
            citation: "AD \(number) (14 CFR §39.7)",
            url: entry.url ?? Rules.rule(for: .ad).url,
            useDefaultURL: false
        )
        item.sourceRef = entry.ref
        if entry.applicable == false {
            return notApplicable(item, entry.reason ?? "Owner/IA determined this AD is not applicable.")
        }
        if entry.recurring == false && entry.complied == true {
            item.status = .ok
            var message = "One-time AD complied with"
            if let raw = entry.lastDoneDate, !raw.isEmpty, let date = CivilDate(raw) {
                message += " on \(date)"
            }
            item.message = message + "."
            return finish(item)
        }
        return evalIntervalItem(item, entry.interval, ctx)
    }
}
