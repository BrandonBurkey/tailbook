import SwiftUI
import SwiftData
import TailBookEngine

/// ADs and owner-defined recurring items, with their live status.
struct TrackedItemsView: View {
    let aircraft: Aircraft

    @Environment(\.modelContext) private var context
    @Environment(StoreService.self) private var store
    @State private var newItemKind: TrackedItemKind? = nil
    @State private var editingItem: TrackedItem? = nil

    var body: some View {
        Group {
            if store.entitlements.allows(.adsAndCustomItems) {
                list
            } else {
                LockedFeatureView(feature: .adsAndCustomItems,
                                  message: "Track recurring ADs and your own items by hours, calendar months, months, days, or whichever comes first.")
            }
        }
        .navigationTitle("ADs & Items")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Menu {
                    Button {
                        newItemKind = .ad
                    } label: {
                        Label("Add AD", systemImage: "doc.badge.plus")
                    }
                    Button {
                        newItemKind = .custom
                    } label: {
                        Label("Add custom item", systemImage: "plus.circle")
                    }
                } label: {
                    Image(systemName: "plus")
                        .accessibilityLabel("Add")
                }
                .disabled(!store.entitlements.allows(.adsAndCustomItems))
            }
        }
        .sheet(item: $newItemKind) { kind in
            TrackedItemEditor(aircraft: aircraft, existing: nil, kind: kind)
                .environment(store)
        }
        .sheet(item: $editingItem) { item in
            TrackedItemEditor(aircraft: aircraft, existing: item, kind: item.kind)
                .environment(store)
        }
    }

    private var list: some View {
        let result = aircraft.evaluate(asOf: CivilDate.today)
        let items = aircraft.sortedTrackedItems
        let ads = items.filter { $0.kind == .ad }
        let customs = items.filter { $0.kind == .custom }
        return List {
            if items.isEmpty {
                Section {
                    ContentUnavailableView {
                        Label("No ADs or items yet", systemImage: "checklist")
                    } description: {
                        Text("Add a recurring AD (with its method of compliance) or your own item, like a fire extinguisher inspection or a parachute repack. TailBook doesn't determine whether an AD applies to your aircraft; ask your A&P/IA.")
                    } actions: {
                        Button("Add AD") { newItemKind = .ad }
                            .buttonStyle(.borderedProminent)
                        Button("Add custom item") { newItemKind = .custom }
                            .buttonStyle(.bordered)
                    }
                }
            }
            if !ads.isEmpty {
                Section {
                    ForEach(ads) { item in
                        trackedRow(item, result: result)
                    }
                } header: {
                    Text("Airworthiness Directives")
                } footer: {
                    Text("TailBook does not determine AD applicability. Your A&P/IA does; record their determination here.")
                }
            }
            if !customs.isEmpty {
                Section("Custom items") {
                    ForEach(customs) { item in
                        trackedRow(item, result: result)
                    }
                }
            }
        }
    }

    private func trackedRow(_ item: TrackedItem, result: EvaluationResult) -> some View {
        let evaluated = result.items.first { $0.sourceRef == item.engineRef }
        return Button {
            editingItem = item
        } label: {
            HStack(alignment: .top, spacing: 12) {
                if let evaluated = evaluated {
                    Image(systemName: Theme.symbol(for: evaluated.status))
                        .foregroundStyle(Theme.color(for: evaluated.status))
                        .font(.title3)
                        .frame(width: 26)
                        .accessibilityLabel(evaluated.statusLabel)
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text(item.displayName)
                        .font(.headline)
                        .foregroundStyle(Color.primary)
                    Text(item.intervalSummary)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    if let evaluated = evaluated {
                        Text(evaluated.throughText)
                            .font(.subheadline)
                            .foregroundStyle(Color.primary)
                    }
                    if !item.complianceNote.isEmpty {
                        Text(item.complianceNote)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                            .lineLimit(2)
                    }
                }
                Spacer(minLength: 8)
                if let evaluated = evaluated {
                    Text(evaluated.remainingPrimary)
                        .font(.headline.monospacedDigit())
                        .foregroundStyle(Theme.color(for: evaluated.status))
                }
            }
            .padding(.vertical, 4)
        }
    }

    private func delete(_ offsets: IndexSet, from source: [TrackedItem]) {
        for index in offsets where index < source.count {
            context.delete(source[index])
        }
        AppEvents.dataDidChange(context, store: store)
    }
}
