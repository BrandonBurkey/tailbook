import SwiftUI
import SwiftData
import UserNotifications
import TailBookEngine

/// The hero screen: "All items current?" + disclaimer, then every item
/// sorted by urgency with its FAR citation and days or hours left.
struct StatusBoardView: View {
    let aircraft: Aircraft
    let allAircraft: [Aircraft]
    @Binding var selectedAircraftID: String

    @Environment(\.modelContext) private var context
    @Environment(StoreService.self) private var store
    @AppStorage("revealAircraftID") private var revealAircraftID: String = ""
    @AppStorage("postRevealPaywallShown") private var postRevealPaywallShown: Bool = false

    @State private var showLogFlight = false
    @State private var showPaywall = false
    @State private var showAddAircraft = false
    @State private var notificationStatus: UNAuthorizationStatus = .authorized

    var body: some View {
        let result = aircraft.evaluate(asOf: CivilDate.today)
        let rows = Engine.sortForBoard(result.items)

        List {
            if revealAircraftID == aircraft.uuid.uuidString {
                Section {
                    RevealCard(result: result) {
                        withAnimation { revealAircraftID = "" }
                    }
                }
                .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
            }

            Section {
                HeroCard(summary: result.summary)
                    .listRowInsets(EdgeInsets(top: 12, leading: 16, bottom: 12, trailing: 16))
            } footer: {
                Text(result.disclaimer)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            if notificationStatus == .notDetermined {
                Section {
                    RemindersPromptCard(isPro: store.entitlements.allows(.notifications)) {
                        enableReminders()
                    }
                }
            }

            Section {
                ForEach(rows, id: \.listKey) { item in
                    NavigationLink {
                        ItemDetailView(aircraft: aircraft, itemKey: item.listKey)
                    } label: {
                        ItemRow(item: item)
                    }
                }
            } header: {
                Text("\(rows.count) items · sorted by urgency")
            } footer: {
                if let avg = aircraft.effectiveAvgHoursPerMonth {
                    Text("Hours-based dates are projected at \(Fmt.hours(avg)) hrs/month (\(aircraft.utilizationSourceDescription)). Status is always from the dates and tach you entered.")
                } else {
                    Text("Add your average hours per month to see projected dates for hours-based items.")
                }
            }
        }
        .listStyle(.insetGrouped)
        .navigationTitle(aircraft.displayTail)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .principal) {
                VStack(spacing: 0) {
                    Text(aircraft.displayTail)
                        .font(.headline)
                    if let next = result.summary.nextDueText {
                        Text("Next due: \(next)")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                            .lineLimit(1)
                    }
                }
                .accessibilityElement(children: .combine)
            }
            ToolbarItem(placement: .topBarLeading) {
                AircraftSwitcher(allAircraft: allAircraft, selectedAircraftID: $selectedAircraftID) {
                    if store.entitlements.canAddAircraft(existingCount: allAircraft.count) {
                        showAddAircraft = true
                    } else {
                        showPaywall = true
                    }
                }
            }
        }
        .safeAreaInset(edge: .bottom) {
            Button {
                if store.entitlements.allows(.logTach) {
                    showLogFlight = true
                } else {
                    showPaywall = true
                }
            } label: {
                Label("Log flight", systemImage: "speedometer")
                    .font(.headline)
                    .foregroundStyle(Theme.onAccent)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(.bar)
        }
        .sheet(isPresented: $showLogFlight) {
            LogFlightSheet(aircraft: aircraft)
                .environment(store)
        }
        .sheet(isPresented: $showPaywall) {
            PaywallView()
                .environment(store)
        }
        .sheet(isPresented: $showAddAircraft) {
            OnboardingView(isFirstAircraft: false) { newAircraft in
                selectedAircraftID = newAircraft.uuid.uuidString
                revealAircraftID = newAircraft.uuid.uuidString
                showAddAircraft = false
                AppEvents.dataDidChange(context, store: store)
            }
            .environment(store)
        }
        .task {
            notificationStatus = await NotificationService.shared.authorizationStatus()
        }
        .task(id: aircraft.uuid) {
            await presentPaywallAfterReveal()
        }
    }

    /// Value first: the paywall appears only after the board has been seen.
    private func presentPaywallAfterReveal() async {
        guard !postRevealPaywallShown else { return }
        await store.refreshEntitlements()
        if store.isPro {
            postRevealPaywallShown = true
            return
        }
        try? await Task.sleep(nanoseconds: 2_500_000_000)
        if Task.isCancelled { return }
        postRevealPaywallShown = true
        showPaywall = true
    }

    private func enableReminders() {
        guard store.entitlements.allows(.notifications) else {
            showPaywall = true
            return
        }
        Task {
            _ = await NotificationService.shared.requestPermission()
            notificationStatus = await NotificationService.shared.authorizationStatus()
            AppEvents.rescheduleReminders(context, store: store)
        }
    }
}

/// "All items current?" with the engine's headline. Never says "airworthy".
struct HeroCard: View {
    let summary: TailBookEngine.Summary

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("ALL ITEMS CURRENT?")
                .font(.caption.weight(.semibold))
                .tracking(1.2)
                .foregroundStyle(.secondary)
            HStack(spacing: 12) {
                Image(systemName: Theme.symbol(for: summary.status))
                    .font(.largeTitle.weight(.semibold))
                    .foregroundStyle(Theme.color(for: summary.status))
                    .accessibilityHidden(true)
                Text(summary.answer)
                    .font(.largeTitle.weight(.bold))
            }
            Text(summary.headline)
                .font(.subheadline)
                .fixedSize(horizontal: false, vertical: true)
            HStack(spacing: 14) {
                CountBadge(count: summary.counts.overdue, label: "overdue", color: Theme.statusRed,
                           symbol: Theme.symbol(for: ItemStatus.overdue))
                CountBadge(count: summary.counts.dueSoon, label: "due soon", color: Theme.statusYellow,
                           symbol: Theme.symbol(for: ItemStatus.dueSoon))
                CountBadge(count: summary.counts.ok, label: "current", color: Theme.statusGreen,
                           symbol: Theme.symbol(for: ItemStatus.ok))
                if summary.counts.unknown > 0 {
                    CountBadge(count: summary.counts.unknown, label: "need info", color: Color.secondary,
                               symbol: Theme.symbol(for: ItemStatus.unknown))
                }
            }
            .padding(.top, 2)
        }
        .padding(.vertical, 4)
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(.isHeader)
    }
}

/// Count + word, with the status glyph (shape + color, never color alone).
struct CountBadge: View {
    let count: Int
    let label: String
    let color: Color
    let symbol: String

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: symbol)
                .font(.caption)
                .foregroundStyle(color)
                .accessibilityHidden(true)
            Text("\(count)")
                .font(.subheadline.weight(.semibold).monospacedDigit())
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }
}

/// One board row: status, name, citation, "current through", days/hours left.
struct ItemRow: View {
    let item: EvaluatedItem

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: Theme.symbol(for: item.status))
                .font(.title3)
                .foregroundStyle(Theme.color(for: item.status))
                .frame(width: 26)
                .accessibilityLabel(item.statusLabel)
            VStack(alignment: .leading, spacing: 2) {
                Text(item.name)
                    .font(.headline)
                Text(item.citation)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text(item.throughText)
                    .font(.subheadline)
                    .foregroundStyle(item.status == .notApplicable ? Color.secondary : Color.primary)
                    .fixedSize(horizontal: false, vertical: true)
            }
            Spacer(minLength: 8)
            VStack(alignment: .trailing, spacing: 2) {
                Text(item.remainingPrimary)
                    .font(.headline.monospacedDigit())
                    .foregroundStyle(Theme.color(for: item.status))
                if let secondary = item.remainingSecondary {
                    Text(secondary)
                        .font(.caption.monospacedDigit())
                        .foregroundStyle(.secondary)
                }
            }
            .multilineTextAlignment(.trailing)
        }
        .padding(.vertical, 4)
        .accessibilityElement(children: .combine)
    }
}

/// Shown once right after setup: the aha moment.
struct RevealCard: View {
    let result: EvaluationResult
    let onDismiss: () -> Void

    private var countLine: String {
        let attention = result.summary.counts.overdue + result.summary.counts.dueSoon
        let tracked = "\(result.items.count) items tracked."
        if attention == 0 {
            return tracked + " Nothing needs attention right now."
        }
        let verb = attention == 1 ? "needs" : "need"
        return tracked + " \(attention) \(verb) attention."
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("Your board is ready", systemImage: "sparkles")
                .font(.headline)
            Text(countLine)
                .font(.subheadline)
            if let next = result.summary.nextDueText {
                Text("Next due: \(next)")
                    .font(.subheadline.monospacedDigit())
                    .foregroundStyle(.secondary)
            }
            Button("Got it", action: onDismiss)
                .buttonStyle(.bordered)
        }
        .padding(.vertical, 4)
    }
}

/// Pre-permission prompt: "Get warned before anything lapses".
struct RemindersPromptCard: View {
    let isPro: Bool
    let onEnable: () -> Void

    private var buttonTitle: String {
        return isPro ? "Turn on reminders" : "Turn on reminders (Pro)"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("Get warned before anything lapses", systemImage: "bell.badge")
                .font(.headline)
            Text("TailBook can remind you 60, 30 and 7 days before each date-based item comes due.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Button(action: onEnable) {
                Label(buttonTitle, systemImage: isPro ? "bell" : "lock")
            }
            .buttonStyle(.borderedProminent)
        }
        .padding(.vertical, 4)
    }
}

/// Toolbar menu to switch aircraft and add one.
struct AircraftSwitcher: View {
    let allAircraft: [Aircraft]
    @Binding var selectedAircraftID: String
    let onAdd: () -> Void

    var body: some View {
        Menu {
            ForEach(allAircraft) { plane in
                Button {
                    selectedAircraftID = plane.uuid.uuidString
                } label: {
                    if plane.uuid.uuidString == selectedAircraftID {
                        Label(plane.displayTail, systemImage: "checkmark")
                    } else {
                        Text(plane.displayTail)
                    }
                }
            }
            Divider()
            Button(action: onAdd) {
                Label("Add aircraft", systemImage: "plus")
            }
        } label: {
            Image(systemName: "airplane.circle")
                .accessibilityLabel("Aircraft")
        }
    }
}
