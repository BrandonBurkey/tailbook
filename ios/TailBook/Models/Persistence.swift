import Foundation
import SwiftData

/// The single SwiftData container, shared by the app UI and the App Intent.
enum Persistence {
    static let schema = Schema([
        Aircraft.self,
        TrackedItem.self,
        TachEntry.self,
        Squawk.self,
    ])

    /// On-device store (no iCloud in v1).
    static let shared: ModelContainer = makeContainer(inMemory: false)

    static func makeContainer(inMemory: Bool) -> ModelContainer {
        let configuration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: inMemory)
        do {
            return try ModelContainer(for: schema, configurations: [configuration])
        } catch {
            fatalError("TailBook could not open its data store: \(error)")
        }
    }

    /// In-memory container with the sample aircraft, for SwiftUI previews.
    @MainActor
    static let preview: ModelContainer = {
        let container = makeContainer(inMemory: true)
        _ = SampleData.insertSample(into: container.mainContext)
        return container
    }()
}
