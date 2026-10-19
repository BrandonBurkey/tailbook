import SwiftUI
import SwiftData
import StoreKit
import UIKit
import UserNotifications
import TailBookEngine

struct SettingsView: View {
    let aircraft: Aircraft
    let allAircraft: [Aircraft]
    @Binding var selectedAircraftID: String

    @Environment(\.modelContext) private var context
    @Environment(\.openURL) private var openURL
    @Environment(StoreService.self) private var store
    @State private var showPaywall = false
    @State private var showEditAircraft = false
    @State private var showAddAircraft = false
    @State private var showManageSubscriptions = false
    @State private var showRedeemCode = false
    @State private var isRestoring = false
    @State private var restoreMessage: String? = nil
    @State private var aircraftToDelete: Aircraft? = nil
    @State private var notificationStatus: UNAuthorizationStatus = .notDetermined

    var body: some View {
        List {
            aircraftSection
            subscriptionSection
            remindersSection
            aboutSection
        }
        .navigationTitle("Settings")
        .sheet(isPresented: $showPaywall) {
            PaywallView()
                .environment(store)
        }
        .sheet(isPresented: $showEditAircraft) {
            AircraftEditView(aircraft: aircraft)
                .environment(store)
        }
        .sheet(isPresented: $showAddAircraft) {
            OnboardingView(isFirstAircraft: false) { newAircraft in
                selectedAircraftID = newAircraft.uuid.uuidString
                showAddAircraft = false
                AppEvents.dataDidChange(context, store: store)
            }
            .environment(store)
        }
        .manageSubscriptionsSheet(isPresented: $showManageSubscriptions)
        .offerCodeRedemption(isPresented: $showRedeemCode) { _ in
            Task { await store.refreshEntitlements() }
        }
        .confirmationDialog("Delete \(aircraftToDelete?.displayTail ?? "this aircraft") and all its items, tach log and squawks?",
                            isPresented: deleteDialogBinding, titleVisibility: .visible) {
            Button("Delete", role: .destructive) {
                if let plane = aircraftToDelete {
                    deleteAircraft(plane)
                }
                aircraftToDelete = nil
            }
            Button("Cancel", role: .cancel) { aircraftToDelete = nil }
        }
        .task {
            notificationStatus = await NotificationService.shared.authorizationStatus()
        }
    }

    // MARK: Sections

    private var aircraftSection: some View {
        Section {
            ForEach(allAircraft) { plane in
                Button {
                    selectedAircraftID = plane.uuid.uuidString
                } label: {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(plane.displayTail)
                                .font(.headline.monospaced())
                                .foregroundStyle(Color.primary)
                            if !plane.makeModel.isEmpty {
                                Text(plane.makeModel)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        Spacer()
                        if plane.uuid == aircraft.uuid {
                            Image(systemName: "checkmark")
                                .foregroundStyle(.tint)
                        }
                    }
                }
                .accessibilityAddTraits(plane.uuid == aircraft.uuid ? .isSelected : [])
                .swipeActions(edge: .trailing) {
                    Button(role: .destructive) {
                        aircraftToDelete = plane
                    } label: {
                        Label("Delete", systemImage: "trash")
                    }
                }
            }
            Button {
                if store.entitlements.allows(.editAfterSetup) { showEditAircraft = true } else { showPaywall = true }
            } label: {
                Label("Edit \(aircraft.displayTail)", systemImage: "pencil")
            }
            Button {
                if store.entitlements.canAddAircraft(existingCount: allAircraft.count) {
                    showAddAircraft = true
                } else {
                    showPaywall = true
                }
            } label: {
                Label("Add aircraft", systemImage: "plus")
            }
        } header: {
            Text("Aircraft")
        } footer: {
            Text("Swipe left on an aircraft to delete it.")
        }
    }

    private var subscriptionSection: some View {
        Section {
            HStack {
                Text("TailBook Pro")
                Spacer()
                Text(proStatusText)
                    .foregroundStyle(.secondary)
            }
            if !store.isPro {
                Button {
                    showPaywall = true
                } label: {
                    Label("See plans", systemImage: "star")
                }
            } else {
                Button {
                    showManageSubscriptions = true
                } label: {
                    Label("Manage subscription", systemImage: "creditcard")
                }
            }
            Button {
                Task {
                    isRestoring = true
                    restoreMessage = nil
                    await store.restore()
                    isRestoring = false
                    restoreMessage = store.isPro ? "Restored. TailBook Pro is active." : "Nothing to restore for this Apple Account."
                }
            } label: {
                HStack {
                    Label("Restore purchases", systemImage: "arrow.clockwise")
                    if isRestoring {
                        Spacer()
                        ProgressView()
                    }
                }
            }
            .disabled(isRestoring)
            if let restoreMessage = restoreMessage {
                Text(restoreMessage)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Button {
                showRedeemCode = true
            } label: {
                Label("Redeem offer code", systemImage: "giftcard")
            }
            if let message = store.lastErrorMessage {
                Text(message)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        } header: {
            Text("Subscription")
        } footer: {
            Text("Payment, renewal and cancellation are handled by Apple. Founding Owners: redeem the code from your email.")
        }
    }

    private var remindersSection: some View {
        Section {
            HStack {
                Text("Reminders")
                Spacer()
                Text(reminderStatusText)
                    .foregroundStyle(.secondary)
            }
            if !store.entitlements.allows(.notifications) {
                Button {
                    showPaywall = true
                } label: {
                    Label("Get warned before anything lapses (Pro)", systemImage: "lock")
                }
            } else if notificationStatus == .notDetermined {
                Button {
                    Task {
                        _ = await NotificationService.shared.requestPermission()
                        notificationStatus = await NotificationService.shared.authorizationStatus()
                        AppEvents.rescheduleReminders(context, store: store)
                    }
                } label: {
                    Label("Get warned before anything lapses", systemImage: "bell.badge")
                }
            } else if notificationStatus == .denied {
                Button {
                    if let url = URL(string: UIApplication.openSettingsURLString) {
                        openURL(url)
                    }
                } label: {
                    Label("Turn on in iOS Settings", systemImage: "gear")
                }
            }
        } header: {
            Text("Reminders")
        } footer: {
            Text("Local notifications 60, 30 and 7 days before each date-based item. Nothing leaves your device.")
        }
    }

    private var aboutSection: some View {
        Section {
            Text(Legal.longDisclaimer)
                .font(.footnote)
            Link(destination: AppConfig.termsURL) {
                Label("Terms of Use", systemImage: "doc.text")
            }
            Link(destination: AppConfig.privacyURL) {
                Label("Privacy Policy", systemImage: "hand.raised")
            }
            Link(destination: AppConfig.supportURL) {
                Label("Support", systemImage: "questionmark.circle")
            }
            LabeledContent("Version", value: appVersion)
            LabeledContent("Rules engine", value: Engine.version)
        } header: {
            Text("About")
        }
    }

    // MARK: Helpers

    private var deleteDialogBinding: Binding<Bool> {
        Binding(
            get: { aircraftToDelete != nil },
            set: { newValue in
                if !newValue { aircraftToDelete = nil }
            }
        )
    }

    private var proStatusText: String {
        if store.isPro { return "Active" }
        return store.hasLoadedEntitlements ? "Not active" : "Checking…"
    }

    private var reminderStatusText: String {
        if !store.entitlements.allows(.notifications) { return "Pro" }
        switch notificationStatus {
        case .authorized, .provisional, .ephemeral: return "On"
        case .denied: return "Off in iOS Settings"
        case .notDetermined: return "Not set up"
        @unknown default: return "Unknown"
        }
    }

    private var appVersion: String {
        let short = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "1.0"
        let build = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as? String ?? "1"
        return "\(short) (\(build))"
    }

    private func deleteAircraft(_ plane: Aircraft) {
        let deletingSelected = plane.uuid == aircraft.uuid
        context.delete(plane)
        if deletingSelected {
            let remaining = allAircraft.filter { $0.uuid != plane.uuid }
            selectedAircraftID = remaining.first?.uuid.uuidString ?? ""
        }
        AppEvents.dataDidChange(context, store: store)
    }
}
