import Foundation

/// Editable copy of an aircraft for onboarding and the edit screen.
/// Numbers are kept as text so fields can be empty ("Don't know yet").
struct AircraftDraft: Equatable {
    var tailNumber: String = "N"
    var makeModel: String = ""
    var isIFR: Bool = false
    var isForHire: Bool = false
    var hasTransponder: Bool = true
    var hasELT: Bool = true
    var usesVOR: Bool = true

    var currentTachText: String = ""
    var currentHobbsText: String = ""
    var avgHoursText: String = AppConfig.defaultAverageHoursPerMonth

    var lastAnnual: Date? = nil
    var annualTachText: String = ""
    var lastTransponder: Date? = nil
    var lastPitotStatic: Date? = nil
    var lastELTInspection: Date? = nil
    var eltBatteryExpires: Date? = nil
    var eltBatteryMonthOnly: Bool = true
    var eltCumulativeUseText: String = ""
    var lastVORCheck: Date? = nil
    var registrationExpires: Date? = nil
    var last100HourTachText: String = ""
    var previous100HourDueTachText: String = ""

    var tracksOilChange: Bool = true
    var lastOilChangeDate: Date? = nil
    var lastOilChangeTachText: String = ""
    var oilIntervalHoursText: String = AppConfig.defaultOilIntervalHours
    var oilIntervalMonths: Int = AppConfig.defaultOilIntervalMonths

    init() {}

    init(aircraft: Aircraft) {
        tailNumber = aircraft.tailNumber
        makeModel = aircraft.makeModel
        isIFR = aircraft.isIFR
        isForHire = aircraft.isForHire
        hasTransponder = aircraft.hasTransponder
        hasELT = aircraft.hasELT
        usesVOR = aircraft.usesVOR
        currentTachText = Fmt.numberText(aircraft.currentTach)
        currentHobbsText = Fmt.numberText(aircraft.currentHobbs)
        avgHoursText = Fmt.numberText(aircraft.avgHoursPerMonth)
        lastAnnual = aircraft.lastAnnual
        annualTachText = Fmt.numberText(aircraft.annualTach)
        lastTransponder = aircraft.lastTransponder
        lastPitotStatic = aircraft.lastPitotStatic
        lastELTInspection = aircraft.lastELTInspection
        eltBatteryExpires = aircraft.eltBatteryExpires
        eltBatteryMonthOnly = aircraft.eltBatteryMonthOnly
        eltCumulativeUseText = Fmt.numberText(aircraft.eltCumulativeUseHours)
        lastVORCheck = aircraft.lastVORCheck
        registrationExpires = aircraft.registrationExpires
        last100HourTachText = Fmt.numberText(aircraft.last100HourTach)
        previous100HourDueTachText = Fmt.numberText(aircraft.previous100HourDueTach)
        tracksOilChange = aircraft.tracksOilChange
        lastOilChangeDate = aircraft.lastOilChangeDate
        lastOilChangeTachText = Fmt.numberText(aircraft.lastOilChangeTach)
        oilIntervalHoursText = Fmt.numberText(aircraft.oilIntervalHours)
        oilIntervalMonths = aircraft.oilIntervalMonths
    }

    var normalizedTail: String {
        return tailNumber.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    }

    /// Tail number is the only required field.
    var hasValidBasics: Bool {
        let tail = normalizedTail
        return !tail.isEmpty && tail != "N"
    }

    /// Writes the draft onto a model (new or existing).
    func apply(to aircraft: Aircraft) {
        aircraft.tailNumber = normalizedTail
        aircraft.makeModel = makeModel.trimmingCharacters(in: .whitespacesAndNewlines)
        aircraft.isIFR = isIFR
        aircraft.isForHire = isForHire
        aircraft.hasTransponder = hasTransponder
        aircraft.hasELT = hasELT
        aircraft.usesVOR = usesVOR
        aircraft.currentTach = Fmt.parseNumber(currentTachText)
        aircraft.currentHobbs = Fmt.parseNumber(currentHobbsText)
        aircraft.avgHoursPerMonth = Fmt.parseNumber(avgHoursText)
        aircraft.lastAnnual = lastAnnual
        aircraft.annualTach = Fmt.parseNumber(annualTachText)
        aircraft.lastTransponder = lastTransponder
        aircraft.lastPitotStatic = lastPitotStatic
        aircraft.lastELTInspection = lastELTInspection
        aircraft.eltBatteryExpires = eltBatteryExpires
        aircraft.eltBatteryMonthOnly = eltBatteryMonthOnly
        aircraft.eltCumulativeUseHours = Fmt.parseNumber(eltCumulativeUseText)
        aircraft.lastVORCheck = lastVORCheck
        aircraft.registrationExpires = registrationExpires
        aircraft.last100HourTach = Fmt.parseNumber(last100HourTachText)
        aircraft.previous100HourDueTach = Fmt.parseNumber(previous100HourDueTachText)
        aircraft.tracksOilChange = tracksOilChange
        aircraft.lastOilChangeDate = lastOilChangeDate
        aircraft.lastOilChangeTach = Fmt.parseNumber(lastOilChangeTachText)
        aircraft.oilIntervalHours = Fmt.parseNumber(oilIntervalHoursText) ?? 0
        aircraft.oilIntervalMonths = max(0, oilIntervalMonths)
    }
}

/// A few common types as starting points (text only: no manufacturer marks or logos).
enum AircraftPresets {
    static let makeModels: [String] = [
        "Cessna 172",
        "Cessna 182",
        "Piper PA-28",
        "Beechcraft Bonanza",
        "Mooney M20",
        "Cirrus SR22",
    ]
}
