import SwiftUI
import SwiftData

/// First run → onboarding. Afterwards → the tabbed app for the selected aircraft.
struct RootView: View {
    @Query(sort: \Aircraft.createdAt) private var aircraft: [Aircraft]
    @AppStorage("selectedAircraftID") private var selectedAircraftID: String = ""
    @AppStorage("revealAircraftID") private var revealAircraftID: String = ""

    @Environment(\.modelContext) private var context
    @Environment(\.scenePhase) private var scenePhase
    @Environment(StoreService.self) private var store

    private var currentAircraft: Aircraft? {
        if let match = aircraft.first(where: { $0.uuid.uuidString == selectedAircraftID }) {
            return match
        }
        return aircraft.first
    }

    var body: some View {
        Group {
            if let current = currentAircraft {
                MainTabView(aircraft: current, allAircraft: aircraft, selectedAircraftID: $selectedAircraftID)
            } else {
                OnboardingView(isFirstAircraft: true) { newAircraft in
                    selectedAircraftID = newAircraft.uuid.uuidString
                    revealAircraftID = newAircraft.uuid.uuidString
                    AppEvents.dataDidChange(context, store: store)
                }
            }
        }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active {
                Task {
                    await store.refreshEntitlements()
                    AppEvents.rescheduleReminders(context, store: store)
                }
            }
        }
        .onChange(of: store.isPro) { _, _ in
            AppEvents.rescheduleReminders(context, store: store)
        }
    }
}

struct MainTabView: View {
    let aircraft: Aircraft
    let allAircraft: [Aircraft]
    @Binding var selectedAircraftID: String

    var body: some View {
        TabView {
            NavigationStack {
                StatusBoardView(aircraft: aircraft, allAircraft: allAircraft, selectedAircraftID: $selectedAircraftID)
            }
            .tabItem { Label("Status", systemImage: "gauge.medium") }

            NavigationStack {
                TrackedItemsView(aircraft: aircraft)
            }
            .tabItem { Label("ADs & Items", systemImage: "checklist") }

            NavigationStack {
                SquawksView(aircraft: aircraft)
            }
            .tabItem { Label("Squawks", systemImage: "wrench.and.screwdriver") }

            NavigationStack {
                ReportsView(aircraft: aircraft)
            }
            .tabItem { Label("Reports", systemImage: "doc.richtext") }

            NavigationStack {
                SettingsView(aircraft: aircraft, allAircraft: allAircraft, selectedAircraftID: $selectedAircraftID)
            }
            .tabItem { Label("Settings", systemImage: "gearshape") }
        }
        .id(aircraft.uuid)
    }
}

#Preview("Board (sample)") {
    RootView()
        .environment(StoreService())
        .modelContainer(Persistence.preview)
}
