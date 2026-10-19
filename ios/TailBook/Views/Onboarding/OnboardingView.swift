import SwiftUI
import SwiftData

/// Setup in under five minutes: disclaimer → aircraft → meters → dates →
/// hours items → the board is revealed (the paywall comes after, on the board).
struct OnboardingView: View {
    enum Step: Int, CaseIterable {
        case welcome
        case aircraft
        case meters
        case inspections
        case hoursItems
    }

    let isFirstAircraft: Bool
    let onFinish: (Aircraft) -> Void

    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss
    @AppStorage("acceptedDisclaimerVersion") private var acceptedDisclaimerVersion: Int = 0
    @State private var step: Step
    @State private var draft = AircraftDraft()

    init(isFirstAircraft: Bool, onFinish: @escaping (Aircraft) -> Void) {
        self.isFirstAircraft = isFirstAircraft
        self.onFinish = onFinish
        _step = State(initialValue: isFirstAircraft ? .welcome : .aircraft)
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                if step != .welcome {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Step \(step.rawValue) of \(Step.allCases.count - 1)")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        ProgressView(value: Double(step.rawValue), total: Double(Step.allCases.count - 1))
                            .accessibilityHidden(true)
                    }
                    .padding(.horizontal)
                    .padding(.top, 4)
                }
                stepContent
            }
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    if step != .welcome && step != firstStep {
                        Button("Back") { goBack() }
                    } else if !isFirstAircraft {
                        Button("Cancel") { dismiss() }
                    }
                }
            }
            .safeAreaInset(edge: .bottom) {
                if step != .welcome {
                    Button {
                        goForward()
                    } label: {
                        Text(primaryButtonTitle)
                            .font(.headline)
                            .foregroundStyle(Theme.onAccent)
                            .frame(maxWidth: .infinity)
                    }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
                    .disabled(step == .aircraft && !draft.hasValidBasics)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(.bar)
                }
            }
        }
        .interactiveDismissDisabled(isFirstAircraft)
    }

    private var primaryButtonTitle: String {
        return step == .hoursItems ? "Show my board" : "Next"
    }

    private var firstStep: Step {
        return isFirstAircraft ? .welcome : .aircraft
    }

    private var title: String {
        switch step {
        case .welcome: return "Welcome"
        case .aircraft: return "Your aircraft"
        case .meters: return "Meters"
        case .inspections: return "Inspections & dates"
        case .hoursItems: return "Hours-based items"
        }
    }

    @ViewBuilder
    private var stepContent: some View {
        switch step {
        case .welcome:
            WelcomeStep(
                onAccept: {
                    acceptedDisclaimerVersion = Legal.disclaimerVersion
                    withAnimation { step = .aircraft }
                },
                onSample: {
                    acceptedDisclaimerVersion = Legal.disclaimerVersion
                    let sample = SampleData.insertSample(into: context)
                    onFinish(sample)
                }
            )
        case .aircraft:
            Form {
                AircraftBasicsSection(draft: $draft)
            }
        case .meters:
            Form {
                AircraftMetersSection(draft: $draft)
            }
            .scrollDismissesKeyboard(.interactively)
        case .inspections:
            Form {
                Section {
                    Text("Enter what you know from your logbook or the stickers. Anything you skip shows as \"Needs info\"; nothing is guessed.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                AircraftInspectionsSection(draft: $draft)
            }
        case .hoursItems:
            Form {
                AircraftHoursItemsSection(draft: $draft)
            }
            .scrollDismissesKeyboard(.interactively)
        }
    }

    private func goBack() {
        guard let previous = Step(rawValue: step.rawValue - 1), previous.rawValue >= firstStep.rawValue else { return }
        withAnimation { step = previous }
    }

    private func goForward() {
        if step == .hoursItems {
            finish()
            return
        }
        if let next = Step(rawValue: step.rawValue + 1) {
            withAnimation { step = next }
        }
    }

    private func finish() {
        let aircraft = Aircraft()
        draft.apply(to: aircraft)
        context.insert(aircraft)
        if let tach = aircraft.currentTach {
            let start = TachEntry(date: Date(), tach: tach, hobbs: aircraft.currentHobbs, hoursFlown: 0,
                                  note: "Starting tach (setup)")
            context.insert(start)
            start.aircraft = aircraft
        }
        try? context.save()
        onFinish(aircraft)
    }
}

/// First screen: what TailBook is (and isn't), with an explicit "I understand".
struct WelcomeStep: View {
    let onAccept: () -> Void
    let onSample: () -> Void

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Image(systemName: "airplane.circle.fill")
                    .font(.system(size: 64))
                    .foregroundStyle(.tint)
                    .accessibilityHidden(true)
                Text("Know what's coming due, at a glance.")
                    .font(.largeTitle.weight(.bold))
                Text("Annual, transponder, pitot-static, ELT, VOR, registration, 100-hour, oil and your recurring ADs, each with its FAR citation and the exact date it lapses.")
                    .font(.body)
                    .foregroundStyle(.secondary)

                PanelCard {
                    VStack(alignment: .leading, spacing: 8) {
                        Label("Before you start", systemImage: "info.circle")
                            .font(.headline)
                        Text(Legal.longDisclaimer)
                            .font(.footnote)
                    }
                }

                Button(action: onAccept) {
                    Text("I understand — set up my aircraft")
                        .font(.headline)
                        .foregroundStyle(Theme.onAccent)
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)

                Button(action: onSample) {
                    Text("Explore a sample aircraft")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .controlSize(.large)

                Text("No account. Your data stays on this device.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .center)
            }
            .padding(24)
        }
    }
}

/// Full edit screen for an existing aircraft (Pro: "editing beyond setup").
struct AircraftEditView: View {
    let aircraft: Aircraft

    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss
    @Environment(StoreService.self) private var store
    @State private var draft: AircraftDraft

    init(aircraft: Aircraft) {
        self.aircraft = aircraft
        _draft = State(initialValue: AircraftDraft(aircraft: aircraft))
    }

    var body: some View {
        NavigationStack {
            Group {
                if store.entitlements.allows(.editAfterSetup) {
                    Form {
                        AircraftBasicsSection(draft: $draft)
                        AircraftMetersSection(draft: $draft)
                        AircraftInspectionsSection(draft: $draft)
                        AircraftHoursItemsSection(draft: $draft)
                        AircraftAdvancedSection(draft: $draft)
                    }
                    .scrollDismissesKeyboard(.interactively)
                } else {
                    LockedFeatureView(feature: .editAfterSetup,
                                      message: "Your board stays free. Editing dates after setup, tach logging and reminders are part of TailBook Pro.")
                }
            }
            .navigationTitle("Edit \(aircraft.displayTail)")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    if store.entitlements.allows(.editAfterSetup) {
                        Button("Save") {
                            draft.apply(to: aircraft)
                            AppEvents.dataDidChange(context, store: store)
                            dismiss()
                        }
                        .disabled(!draft.hasValidBasics)
                    }
                }
            }
        }
    }
}
