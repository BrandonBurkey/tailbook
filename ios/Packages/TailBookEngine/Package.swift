// swift-tools-version:5.9
//
// TailBookEngine: the pure, Foundation-only port of engine/tailbook-engine.js.
// `swift test` here runs the golden vectors (engine/test-vectors.json) on any Mac.

import PackageDescription

let package = Package(
    name: "TailBookEngine",
    platforms: [
        .iOS(.v17),
        .macOS(.v14),
    ],
    products: [
        .library(name: "TailBookEngine", targets: ["TailBookEngine"]),
    ],
    targets: [
        .target(name: "TailBookEngine"),
        .testTarget(
            name: "TailBookEngineTests",
            dependencies: ["TailBookEngine"],
            resources: [
                .copy("Resources/test-vectors.json"),
            ]
        ),
    ]
)
