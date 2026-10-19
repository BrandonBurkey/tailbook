import SwiftUI
import SwiftData

/// Big, one-handed tach log: the new reading is prefilled, quick-add chips
/// cover typical flights, Save updates the tach and the utilization history.
struct LogFlightSheet: View {
    let aircraft: Aircraft

    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss
    @Environment(StoreService.self) private var store

    @State private var tachText: String
    @State private var hobbsText: String = ""
    @State private var date: Date = Date()
    @State private var note: String = ""
    @State private var errorMessage: String? = nil
    @FocusState private var tachFocused: Bool

    private let quickAdds: [Double] = [0.5, 1.0, 1.5, 2.0, 3.0]

    init(aircraft: Aircraft) {
        self.aircraft = aircraft
        _tachText = State(initialValue: Fmt.numberText(aircraft.currentTach))
    }

    private var startTach: Double? {
        return aircraft.currentTach
    }

    private var newTach: Double? {
        return Fmt.parseNumber(tachText)
    }

    private var hoursThisFlight: Double? {
        guard let start = startTach, let end = newTach else { return nil }
        return end - start
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Tach", text: $tachText)
                        .keyboardType(.decimalPad)
                        .font(.system(size: 44, weight: .semibold, design: .rounded).monospacedDigit())
                        .multilineTextAlignment(.center)
                        .focused($tachFocused)
                        .accessibilityLabel("New tach reading")
                    if let start = startTach {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(quickAdds, id: \.self) { add in
                                    Button("+\(Fmt.hours(add))") {
                                        tachText = Fmt.hours(start + add)
                                    }
                                    .buttonStyle(.bordered)
                                    .font(.body.monospacedDigit())
                                }
                            }
                            .padding(.vertical, 2)
                        }
                        HStack {
                            Text("Was \(Fmt.hours(start))")
                            Spacer()
                            if let flown = hoursThisFlight {
                                Text(flownText(flown))
                                    .foregroundStyle(flown >= 0 ? Color.secondary : Theme.statusRed)
                            }
                        }
                        .font(.subheadline.monospacedDigit())
                    }
                } header: {
                    Text("New tach reading · \(aircraft.displayTail)")
                }

                Section {
                    DecimalField(title: "Hobbs", text: $hobbsText, prompt: "Optional")
                    DatePicker("Date", selection: $date, in: ...Date(), displayedComponents: [.date, .hourAndMinute])
                    TextField("Note (optional)", text: $note)
                }

                if let errorMessage = errorMessage {
                    Section {
                        Label(errorMessage, systemImage: "exclamationmark.triangle")
                            .foregroundStyle(Theme.statusRed)
                    }
                }
            }
            .navigationTitle("Log flight")
            .navigationBarTitleDisplayMode(.inline)
            .scrollDismissesKeyboard(.interactively)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save() }
                        .disabled(newTach == nil)
                }
            }
            .onAppear {
                tachFocused = true
            }
        }
    }

    private func flownText(_ flown: Double) -> String {
        if flown < 0 { return "Lower than current" }
        return "+\(Fmt.hours(flown)) hrs"
    }

    private func save() {
        guard let tach = newTach else { return }
        let outcome = TachLogger.log(tach: tach, hobbs: Fmt.parseNumber(hobbsText), date: date, note: note,
                                     aircraft: aircraft, context: context)
        switch outcome {
        case .logged:
            AppEvents.dataDidChange(context, store: store)
            dismiss()
        case .rejected(let reason):
            errorMessage = reason
        }
    }
}
