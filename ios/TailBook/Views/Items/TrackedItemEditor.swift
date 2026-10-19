import SwiftUI
import SwiftData

/// Add or edit an AD or custom item: interval in hours, calendar months,
/// months, days, or whichever first, plus a compliance note.
struct TrackedItemEditor: View {
    let aircraft: Aircraft
    let existing: TrackedItem?

    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss
    @Environment(StoreService.self) private var store
    @State private var draft: TrackedItemDraft
    @State private var confirmDelete = false

    init(aircraft: Aircraft, existing: TrackedItem?, kind: TrackedItemKind) {
        self.aircraft = aircraft
        self.existing = existing
        if let existing = existing {
            _draft = State(initialValue: TrackedItemDraft(item: existing))
        } else {
            _draft = State(initialValue: TrackedItemDraft(kind: kind))
        }
    }

    private var isOneTimeAD: Bool {
        return draft.kind == .ad && !draft.isRecurring
    }

    private var navigationTitleText: String {
        let verb = existing == nil ? "Add" : "Edit"
        return draft.kind == .ad ? "\(verb) AD" : "\(verb) item"
    }

    var body: some View {
        NavigationStack {
            Form {
                identitySection
                if draft.kind == .ad {
                    Section {
                        Picker("Type", selection: $draft.isRecurring) {
                            Text("Recurring").tag(true)
                            Text("One-time").tag(false)
                        }
                        .pickerStyle(.segmented)
                        Toggle("Applies to this aircraft", isOn: $draft.isApplicable)
                    } footer: {
                        Text("Applicability is your A&P/IA's determination. Turn it off to keep the AD on file as not applicable.")
                    }
                }
                if isOneTimeAD {
                    oneTimeSection
                } else {
                    intervalSection
                }
                lastDoneSection
                Section {
                    TextField("Method of compliance, logbook page, notes", text: $draft.complianceNote, axis: .vertical)
                        .lineLimit(3...8)
                } header: {
                    Text("Compliance note")
                }
                if existing != nil {
                    Section {
                        Button("Delete", role: .destructive) {
                            confirmDelete = true
                        }
                    }
                }
            }
            .scrollDismissesKeyboard(.interactively)
            .navigationTitle(navigationTitleText)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save() }
                        .disabled(!draft.hasName)
                }
            }
            .confirmationDialog("Delete this item?", isPresented: $confirmDelete, titleVisibility: .visible) {
                Button("Delete", role: .destructive) { deleteItem() }
                Button("Cancel", role: .cancel) {}
            }
        }
    }

    @ViewBuilder
    private var identitySection: some View {
        if draft.kind == .ad {
            Section {
                TextField("AD number (e.g. 2020-18-04)", text: $draft.adNumber)
                    .textInputAutocapitalization(.characters)
                    .autocorrectionDisabled()
                    .font(.body.monospaced())
                TextField("Subject (optional)", text: $draft.title)
            } header: {
                Text("Airworthiness Directive")
            }
        } else {
            Section {
                TextField("Name (e.g. Fire extinguisher)", text: $draft.title)
                Toggle("Counts toward \"All items current?\"", isOn: $draft.isRegulatory)
            } header: {
                Text("Custom item")
            } footer: {
                Text("Turn this on for required items (it then works like an AD on the summary). Leave it off for reminders such as a parachute repack or a database update.")
            }
        }
    }

    @ViewBuilder
    private var intervalSection: some View {
        Section {
            Picker("Repeats by", selection: $draft.mode) {
                ForEach(IntervalMode.allCases) { mode in
                    Text(mode.title).tag(mode)
                }
            }
            if draft.usesHours {
                DecimalField(title: "Every", text: $draft.hoursText, prompt: "100", unit: "hrs")
            }
            if draft.mode == .whicheverFirst {
                Picker("Time unit", selection: $draft.timeUnit) {
                    ForEach(TimeUnit.allCases) { unit in
                        Text(unit.title).tag(unit)
                    }
                }
            }
            if draft.usesTime {
                HStack {
                    Text(timeLabel)
                    Spacer(minLength: 8)
                    TextField("12", text: $draft.timeValueText)
                        .keyboardType(.numberPad)
                        .multilineTextAlignment(.trailing)
                        .font(.body.monospacedDigit())
                        .frame(maxWidth: 100)
                    Text(draft.effectiveTimeUnit.title.lowercased())
                        .foregroundStyle(.secondary)
                }
            }
        } header: {
            Text("Interval")
        } footer: {
            Text(intervalFooter)
        }
    }

    private var timeLabel: String {
        return draft.mode == .whicheverFirst ? "or every" : "Every"
    }

    private var intervalFooter: String {
        var text = "Hours are tach hours."
        if draft.usesTime {
            text += " " + draft.effectiveTimeUnit.help
        }
        if draft.mode == .whicheverFirst {
            text += " Due at whichever limit comes first."
        }
        return text
    }

    @ViewBuilder
    private var oneTimeSection: some View {
        Section {
            Toggle("Complied with", isOn: $draft.isComplied)
            if !draft.isComplied {
                OptionalDateField(title: "Comply by date", date: $draft.oneTimeDueDate, allowsFuture: true)
                DecimalField(title: "Comply by tach", text: $draft.oneTimeDueTachText, prompt: "Optional")
            }
        } header: {
            Text("One-time AD")
        }
    }

    @ViewBuilder
    private var lastDoneSection: some View {
        Section {
            OptionalDateField(title: "Last done", date: $draft.lastDoneDate)
            DecimalField(title: "Tach when done", text: $draft.lastDoneTachText, prompt: "Optional")
        } header: {
            Text("Last complied with")
        } footer: {
            Text("A whichever-first item needs both the date and the tach to show as current.")
        }
    }

    private func save() {
        let item: TrackedItem
        if let existing = existing {
            item = existing
        } else {
            item = TrackedItem(kind: draft.kind)
            context.insert(item)
            item.aircraft = aircraft
        }
        draft.apply(to: item)
        AppEvents.dataDidChange(context, store: store)
        dismiss()
    }

    private func deleteItem() {
        if let existing = existing {
            context.delete(existing)
            AppEvents.dataDidChange(context, store: store)
        }
        dismiss()
    }
}
