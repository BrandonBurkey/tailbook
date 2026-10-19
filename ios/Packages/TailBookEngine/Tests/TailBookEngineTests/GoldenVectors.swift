import Foundation
import XCTest
import TailBookEngine

// Shared by `swift test` (SwiftPM, Bundle.module) and by the Xcode
// TailBookTests target (which compiles these same files and bundles the same
// test-vectors.json), so ⌘U in Xcode proves parity too.

#if SWIFT_PACKAGE
private func goldenVectorsURL() -> URL? {
    return Bundle.module.url(forResource: "test-vectors", withExtension: "json")
}
#else
private final class GoldenVectorsBundleToken {}

private func goldenVectorsURL() -> URL? {
    return Bundle(for: GoldenVectorsBundleToken.self).url(forResource: "test-vectors", withExtension: "json")
}
#endif

enum GoldenVectors {
    enum LoadError: Error {
        case missingFile
        case badShape(String)
    }

    /// The whole vectors file as JSON objects (JSONSerialization keeps `null`
    /// as NSNull, which the runner needs to tell "expect nil" from "not constrained").
    static func load() throws -> [String: Any] {
        guard let url = goldenVectorsURL() else { throw LoadError.missingFile }
        let data = try Data(contentsOf: url)
        guard let root = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
            throw LoadError.badShape("root is not an object")
        }
        return root
    }

    static func profileCases() throws -> [[String: Any]] {
        guard let cases = try load()["cases"] as? [[String: Any]] else {
            throw LoadError.badShape("cases")
        }
        return cases
    }

    static func dateCases() throws -> [[String: Any]] {
        guard let cases = try load()["dateCases"] as? [[String: Any]] else {
            throw LoadError.badShape("dateCases")
        }
        return cases
    }

    /// Decode a vector's `profile` object into the engine's `Profile`.
    static func decodeProfile(_ object: Any) throws -> Profile {
        let data = try JSONSerialization.data(withJSONObject: object)
        return try JSONDecoder().decode(Profile.self, from: data)
    }

    /// The profile of the case with this id.
    static func profile(id: String) throws -> Profile {
        for c in try profileCases() {
            if (c["id"] as? String) == id, let object = c["profile"] {
                return try decodeProfile(object)
            }
        }
        throw LoadError.badShape("no case \(id)")
    }
}
