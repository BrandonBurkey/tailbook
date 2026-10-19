import SwiftUI
import SwiftData

/// Discrepancies noted during the year; open ones go on the Annual Work Order.
struct SquawksView: View {
    let aircraft: Aircraft

    @Environment(\.modelContext) private var context
    @Environment(StoreService.self) private var store
    @State private var showNewSquawk = false
    @State private var editingSquawk: Squawk? = nil
    @State private var squawkToDelete: Squawk? = nil

    var body: some View {
        Group {
            if store.entitlements.allows(.squawks) {
                list
            } else {
                LockedFeatureView(feature: .squawks,
                                  message: "Note squawks as they happen, then hand your shop an Annual Work Order PDF.")
            }
        }
        .navigationTitle("Squawks")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    showNewSquawk = true
                } label: {
                    Image(systemName: "plus")
                        .accessibilityLabel("Add squawk")
                }
                .disabled(!store.entitlements.allows(.squawks))
            }
        }
        .sheet(isPresented: $showNewSquawk) {
            SquawkEditor(aircraft: aircraft, existing: nil)
                .environment(store)
        }
        .sheet(item: $editingSquawk) { squawk in
            SquawkEditor(aircraft: aircraft, existing: squawk)
                .environment(store)
        }
    }

    private var list: some View {
        let open = aircraft.openSquawks
        let closed = aircraft.closedSquawks
        return List {
            if open.isEmpty && closed.isEmpty {
                ContentUnavailableView {
                    Label("No squawks", systemImage: "wrench.and.screwdriver")
                } description: {
                    Text("Log anything odd you notice (a soft brake, a flickering light) so nothing is forgotten at the annual.")
                } actions: {
                    Button("Add squawk") { showNewSquawk = true }
                        .buttonStyle(.borderedProminent)
                }
            }
            if !open.isEmpty {
                Section("Open (\(open.count))") {
                    ForEach(open) { squawk in
                        row(squawk)
                            .swipeActions(edge: .trailing) {
                                Button {
                                    setOpen(squawk, false)
                                } label: {
                                    Label("Close", systemImage: "checkmark")
                                }
                                .tint(Color.accentColor)
                                Button {
                                    squawkToDelete = squawk
                                } label: {
                                    Label("Delete", systemImage: "trash")
                                }
                                .tint(Theme.statusRed)
                            }
                    }
                }
            }
            if !closed.isEmpty {
                Section("Closed") {
                    ForEach(closed) { squawk in
                        row(squawk)
                            .swipeActions(edge: .trailing) {
                                Button {
                                    setOpen(squawk, true)
                                } label: {
                                    Label("Reopen", systemImage: "arrow.uturn.backward")
                                }
                                Button {
                                    squawkToDelete = squawk
                                } label: {
                                    Label("Delete", systemImage: "trash")
                                }
                                .tint(Theme.statusRed)
                            }
                    }
                }
            }
        }
        .confirmationDialog("Delete this squawk?", isPresented: deleteDialogBinding, titleVisibility: .visible) {
            Button("Delete", role: .destructive) {
                if let squawk = squawkToDelete {
                    context.delete(squawk)
                    try? context.save()
                }
                squawkToDelete = nil
            }
            Button("Cancel", role: .cancel) { squawkToDelete = nil }
        }
    }

    private var deleteDialogBinding: Binding<Bool> {
        Binding(
            get: { squawkToDelete != nil },
            set: { newValue in
                if !newValue { squawkToDelete = nil }
            }
        )
    }

    private func row(_ squawk: Squawk) -> some View {
        Button {
            editingSquawk = squawk
        } label: {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: squawk.isOpen ? "exclamationmark.bubble" : "checkmark.bubble")
                    .foregroundStyle(squawk.isOpen ? Color.accentColor : Color.secondary)
                    .font(.title3)
                    .frame(width: 26)
                    .accessibilityLabel(squawk.isOpen ? "Open" : "Closed")
                VStack(alignment: .leading, spacing: 2) {
                    Text(squawk.title)
                        .font(.headline)
                        .foregroundStyle(Color.primary)
                    if !squawk.detail.isEmpty {
                        Text(squawk.detail)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                            .lineLimit(3)
                    }
                    Text("Noted \(Fmt.date(squawk.createdAt))")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .padding(.vertical, 2)
        }
    }

    private func setOpen(_ squawk: Squawk, _ isOpen: Bool) {
        squawk.isOpen = isOpen
        squawk.closedAt = isOpen ? nil : Date()
        try? context.save()
    }

    private func delete(_ offsets: IndexSet, from source: [Squawk]) {
        for index in offsets where index < source.count {
            context.delete(source[index])
        }
        try? context.save()
    }
}

struct SquawkEditor: View {
    let aircraft: Aircraft
    let existing: Squawk?

    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss
    @State private var title: String
    @State private var detail: String
    @State private var isOpen: Bool
    @State private var resolution: String

    init(aircraft: Aircraft, existing: Squawk?) {
        self.aircraft = aircraft
        self.existing = existing
        _title = State(initialValue: existing?.title ?? "")
        _detail = State(initialValue: existing?.detail ?? "")
        _isOpen = State(initialValue: existing?.isOpen ?? true)
        _resolution = State(initialValue: existing?.resolution ?? "")
    }

    private var navigationTitleText: String {
        return existing == nil ? "New squawk" : "Squawk"
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("What did you notice?", text: $title)
                    TextField("Details (optional)", text: $detail, axis: .vertical)
                        .lineLimit(3...8)
                }
                if existing != nil {
                    Section {
                        Toggle("Open", isOn: $isOpen)
                        if !isOpen {
                            TextField("Resolution (optional)", text: $resolution, axis: .vertical)
                                .lineLimit(2...6)
                        }
                    }
                }
            }
            .navigationTitle(navigationTitleText)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save() }
                        .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }

    private func save() {
        let squawk: Squawk
        if let existing = existing {
            squawk = existing
        } else {
            squawk = Squawk(title: "")
            context.insert(squawk)
            squawk.aircraft = aircraft
        }
        squawk.title = title.trimmingCharacters(in: .whitespacesAndNewlines)
        squawk.detail = detail.trimmingCharacters(in: .whitespacesAndNewlines)
        if squawk.isOpen != isOpen {
            squawk.closedAt = isOpen ? nil : Date()
        }
        squawk.isOpen = isOpen
        squawk.resolution = resolution
        try? context.save()
        dismiss()
    }
}
