import SwiftUI
import SwiftData

@main
struct TailBookApp: App {
    @State private var store = StoreService()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(store)
        }
        .modelContainer(Persistence.shared)
    }
}
