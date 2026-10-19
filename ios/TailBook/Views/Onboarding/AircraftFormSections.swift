import SwiftUI

/// Make/model, tail, IFR, for hire.
struct AircraftBasicsSection: View {
    @Binding var draft: AircraftDraft

    var body: some View {
        Section {
            TextField("Tail number (e.g. N12345)", text: $draft.tailNumber)
                .textInputAutocapitalization(.characters)
                .autocorrectionDisabled()
                .font(.body.monospaced())
            TextField("Make and model", text: $draft.makeModel)
                .textInputAutocapitalization(.words)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(AircraftPresets.makeModels, id: \.self) { preset in
                        Button(preset) {
                            draft.makeModel = preset
                        }
                        .buttonStyle(.bordered)
                        .tint(draft.makeModel == preset ? Color.accentColor : Color.secondary)
                    }
                }
                .padding(.vertical, 2)
            }
        } header: {
            Text("What do you fly?")
        }

        Section {
            Toggle("Flown IFR", isOn: $draft.isIFR)
            Toggle("Used for hire or flight instruction for hire", isOn: $draft.isForHire)
        } footer: {
            Text("IFR adds the pitot-static/altimeter (§91.411) and VOR (§91.171) checks. For hire adds the 100-hour inspection (§91.409(b)).")
        }
    }
}

/// Current tach / Hobbs and utilization.
struct AircraftMetersSection: View {
    @Binding var draft: AircraftDraft

    var body: some View {
        Section {
            DecimalField(title: "Current tach", text: $draft.currentTachText, prompt: "e.g. 1250.4")
            DecimalField(title: "Current Hobbs", text: $draft.currentHobbsText, prompt: "Optional")
            DecimalField(title: "Average flying", text: $draft.avgHoursText, prompt: "8", unit: "hrs/mo")
        } header: {
            Text("Meters")
        } footer: {
            Text("Hours-based items (100-hour, oil, ADs) use tach time. Your average turns hours left into a projected date; once you've logged 30 days of flights TailBook uses your real average.")
        }
    }
}

/// The calendar-based inspections and expirations.
struct AircraftInspectionsSection: View {
    @Binding var draft: AircraftDraft

    var body: some View {
        Section {
            OptionalDateField(title: "Last annual", footnote: "Good through the last day of that month next year (§91.409(a)).",
                              date: $draft.lastAnnual)
        } header: {
            Text("Annual")
        }

        Section {
            OptionalDateField(title: "Transponder check", footnote: "24 calendar months (§91.413).",
                              date: $draft.lastTransponder)
            if draft.isIFR {
                OptionalDateField(title: "Pitot-static / altimeter", footnote: "24 calendar months, IFR (§91.411).",
                                  date: $draft.lastPitotStatic)
                OptionalDateField(title: "VOR check", footnote: "Within the preceding 30 days, IFR (§91.171).",
                                  date: $draft.lastVORCheck)
            }
        } header: {
            Text("Avionics checks")
        }

        Section {
            OptionalDateField(title: "ELT inspection", footnote: "12 calendar months (§91.207(d)).",
                              date: $draft.lastELTInspection)
            OptionalDateField(title: "ELT battery replacement date", footnote: "The date marked on the ELT or battery (§91.207(c)).",
                              date: $draft.eltBatteryExpires, allowsFuture: true)
            if draft.eltBatteryExpires != nil {
                Toggle("Sticker shows month only", isOn: $draft.eltBatteryMonthOnly)
            }
        } header: {
            Text("ELT")
        }

        Section {
            OptionalDateField(title: "Registration expires", footnote: "On the certificate or the FAA registry (§47.40).",
                              date: $draft.registrationExpires, allowsFuture: true)
        } header: {
            Text("Registration")
        }
    }
}

/// 100-hour (for hire) and oil change.
struct AircraftHoursItemsSection: View {
    @Binding var draft: AircraftDraft

    private var oilMonthsText: String {
        if draft.oilIntervalMonths == 0 { return "no time limit" }
        return "\(draft.oilIntervalMonths) months"
    }

    var body: some View {
        if draft.isForHire {
            Section {
                DecimalField(title: "Tach at last 100-hour", text: $draft.last100HourTachText, prompt: "Don't know yet")
            } header: {
                Text("100-hour inspection")
            } footer: {
                Text("Leave empty if you don't know yet. Due 100 hours later (§91.409(b)).")
            }
        }

        Section {
            Toggle("Track oil changes", isOn: $draft.tracksOilChange)
            if draft.tracksOilChange {
                OptionalDateField(title: "Last oil change", date: $draft.lastOilChangeDate)
                DecimalField(title: "Tach at last oil change", text: $draft.lastOilChangeTachText, prompt: "Don't know yet")
                DecimalField(title: "Every", text: $draft.oilIntervalHoursText, prompt: "50", unit: "hrs")
                Stepper(value: $draft.oilIntervalMonths, in: 0...24) {
                    HStack {
                        Text("or every")
                        Spacer()
                        Text(oilMonthsText)
                            .monospacedDigit()
                            .foregroundStyle(.secondary)
                    }
                }
            }
        } header: {
            Text("Oil change")
        } footer: {
            Text("Advisory, per your engine maker or A&P: whichever comes first.")
        }
    }
}

/// Edit-only details (equipment, carry-forward, ELT use).
struct AircraftAdvancedSection: View {
    @Binding var draft: AircraftDraft

    var body: some View {
        Section {
            Toggle("Transponder installed", isOn: $draft.hasTransponder)
            Toggle("ELT required", isOn: $draft.hasELT)
            if draft.isIFR {
                Toggle("VOR used for IFR navigation", isOn: $draft.usesVOR)
            }
            DecimalField(title: "Tach at last annual", text: $draft.annualTachText, prompt: "Optional")
            if draft.isForHire {
                DecimalField(title: "100-hour limit when last done", text: $draft.previous100HourDueTachText, prompt: "Optional")
            }
            DecimalField(title: "ELT transmitter use", text: $draft.eltCumulativeUseText, prompt: "0.0", unit: "hrs")
        } header: {
            Text("Equipment & details")
        } footer: {
            Text("An annual with its tach entered also resets the 100-hour interval. If a 100-hour was done late, enter the limit that was in force so the excess carries forward (§91.409(b)). More than 1 cumulative hour of ELT transmitter use means the battery must be replaced (§91.207(c)).")
        }
    }
}
