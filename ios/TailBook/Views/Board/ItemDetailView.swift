import SwiftUI
import SwiftData
import TailBookEngine

/// One item: the plain-English rule, the numbers, and "Mark done today" / edit date.
struct ItemDetailView: View {
    let aircraft: Aircraft
    let itemKey: String

    @Environment(\.modelContext) private var context
    @Environment(StoreService.self) private var store
    @State private var dateEditTarget: DateEditTarget? = nil
    @State private var showPaywall = false
    @State private var showEditAircraft = false
    @State private var editingTrackedItem: TrackedItem? = nil
    @State private var confirmMarkDone = false

    var body: some View {
        let result = aircraft.evaluate(asOf: CivilDate.today)
        if let item = result.items.first(where: { $0.listKey == itemKey }) {
            content(item)
        } else {
            ContentUnavailableView("Item not found", systemImage: "questionmark.circle",
                                   description: Text("It may have been removed."))
        }
    }

    @ViewBuilder
    private func content(_ item: EvaluatedItem) -> some View {
        List {
            Section {
                HStack(spacing: 12) {
                    Image(systemName: Theme.symbol(for: item.status))
                        .font(.largeTitle)
                        .foregroundStyle(Theme.color(for: item.status))
                        .accessibilityHidden(true)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(item.statusLabel)
                            .font(.title2.weight(.semibold))
                        Text(item.throughText)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                }
                .padding(.vertical, 4)
                Text(item.message)
                    .font(.callout)
            }

            Section("Numbers") {
                if let lastDone = item.lastDone {
                    LabeledContent("Last done", value: Fmt.date(lastDone))
                }
                if let lastTach = item.lastDoneTach {
                    LabeledContent("Last done at", value: "\(Fmt.hours(lastTach)) tach")
                }
                if let due = item.dueDate {
                    LabeledContent(dueLabel(for: item), value: Fmt.date(due))
                }
                if let days = item.daysRemaining {
                    LabeledContent("Days left", value: days < 0 ? "\(Fmt.days(-days)) overdue" : Fmt.days(days))
                        .monospacedDigit()
                }
                if let dueTach = item.dueTach {
                    LabeledContent("Due at", value: "\(Fmt.hours(dueTach)) tach")
                        .monospacedDigit()
                }
                if let hours = item.hoursRemaining {
                    LabeledContent("Hours left", value: hours < 0 ? "\(Fmt.hours(-hours)) over" : Fmt.hours(hours))
                        .monospacedDigit()
                }
                if let overfly = item.overflyHoursRemaining {
                    LabeledContent("Ferry allowance left", value: "\(Fmt.hours(overfly)) hrs")
                        .monospacedDigit()
                }
                if let projected = item.projectedDate {
                    LabeledContent("Projected", value: "≈ \(Fmt.date(projected))")
                }
                if item.isHoursBased, let avg = aircraft.effectiveAvgHoursPerMonth {
                    LabeledContent("At your pace", value: "\(Fmt.hours(avg)) hrs/month")
                        .monospacedDigit()
                }
            }

            if !item.notes.isEmpty {
                Section("Notes") {
                    ForEach(item.notes, id: \.self) { note in
                        Text(note)
                            .font(.callout)
                    }
                }
            }

            Section {
                Text(item.rule)
                    .font(.callout)
                if let urlString = item.url, let url = URL(string: urlString) {
                    Link(destination: url) {
                        Label("Read \(item.citation)", systemImage: "book")
                    }
                } else {
                    Text(item.citation)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            } header: {
                Text("The rule")
            } footer: {
                Text(Legal.shortDisclaimer)
            }

            actions(item)
        }
        .navigationTitle(item.name)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(item: $dateEditTarget) { target in
            DateEditSheet(target: target) { newDate in
                ItemActions.apply(date: newDate, to: target, aircraft: aircraft)
                AppEvents.dataDidChange(context, store: store)
            }
        }
        .sheet(isPresented: $showPaywall) {
            PaywallView()
                .environment(store)
        }
        .sheet(isPresented: $showEditAircraft) {
            AircraftEditView(aircraft: aircraft)
                .environment(store)
        }
        .sheet(item: $editingTrackedItem) { tracked in
            TrackedItemEditor(aircraft: aircraft, existing: tracked, kind: tracked.kind)
                .environment(store)
        }
        .confirmationDialog("Mark \(item.name) done today?", isPresented: $confirmMarkDone, titleVisibility: .visible) {
            Button(ItemActions.markDoneLabel(for: item.kind)) {
                ItemActions.markDoneToday(item, aircraft: aircraft)
                AppEvents.dataDidChange(context, store: store)
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Only do this once the work is signed off in your logbook.")
        }
    }

    private func dueLabel(for item: EvaluatedItem) -> String {
        return item.status == .overdue ? "Was current through" : "Current through"
    }

    @ViewBuilder
    private func actions(_ item: EvaluatedItem) -> some View {
        let canEdit = store.entitlements.allows(.editAfterSetup)
        Section {
            if ItemActions.canMarkDone(item, aircraft: aircraft) {
                Button {
                    if canEdit { confirmMarkDone = true } else { showPaywall = true }
                } label: {
                    Label(ItemActions.markDoneLabel(for: item.kind), systemImage: canEdit ? "checkmark.circle" : "lock")
                }
            }
            if let target = ItemActions.dateEditTarget(for: item, aircraft: aircraft) {
                Button {
                    if canEdit { dateEditTarget = target } else { showPaywall = true }
                } label: {
                    Label("Edit date…", systemImage: canEdit ? "calendar" : "lock")
                }
            }
            if item.kind == .ad || item.kind == .custom {
                if let tracked = ItemActions.trackedItem(item.sourceRef, in: aircraft) {
                    Button {
                        if store.entitlements.allows(.adsAndCustomItems) { editingTrackedItem = tracked } else { showPaywall = true }
                    } label: {
                        Label("Edit item…", systemImage: "slider.horizontal.3")
                    }
                }
            } else {
                Button {
                    if canEdit { showEditAircraft = true } else { showPaywall = true }
                } label: {
                    Label("Edit aircraft details…", systemImage: canEdit ? "airplane" : "lock")
                }
            }
        } footer: {
            if !canEdit {
                Text("Editing after setup is part of TailBook Pro.")
            }
        }
    }
}

/// Edit (or clear) one date.
struct DateEditSheet: View {
    let target: DateEditTarget
    let onSave: (Date?) -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var date: Date?

    init(target: DateEditTarget, onSave: @escaping (Date?) -> Void) {
        self.target = target
        self.onSave = onSave
        let initial: Date? = target.initial ?? Date()
        _date = State(initialValue: initial)
    }

    var body: some View {
        NavigationStack {
            Form {
                OptionalDateField(title: target.title, date: $date, allowsFuture: target.allowsFuture)
            }
            .navigationTitle("Edit date")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        onSave(date)
                        dismiss()
                    }
                }
            }
        }
        .presentationDetents([.medium, .large])
    }
}
