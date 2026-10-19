import Foundation

/// The single place that decides what the free tier can do.
///
/// Free: one aircraft, set up once, with the status board (view only).
/// Pro:  everything below. To move a feature into the free tier, add it to
///       `freeFeatures`; to change the aircraft cap, change `freeAircraftLimit`.
struct Entitlements: Equatable {
    enum Feature: String, CaseIterable, Hashable {
        /// More than `freeAircraftLimit` aircraft.
        case multipleAircraft
        /// Editing the aircraft, marking items done, editing dates after onboarding.
        case editAfterSetup
        /// Quick tach log (sheet and Siri / Shortcuts).
        case logTach
        /// Squawk list.
        case squawks
        /// AD and custom recurring item tracker.
        case adsAndCustomItems
        /// Annual Work Order and Aircraft Status Report PDFs.
        case pdfExports
        /// 60/30/7-day reminders.
        case notifications

        var title: String {
            switch self {
            case .multipleAircraft: return "Multiple aircraft"
            case .editAfterSetup: return "Edit dates & mark items done"
            case .logTach: return "Quick tach log + Siri"
            case .squawks: return "Squawk list"
            case .adsAndCustomItems: return "Recurring ADs & custom items"
            case .pdfExports: return "Annual Work Order & Status Report PDFs"
            case .notifications: return "Reminders 60/30/7 days before anything lapses"
            }
        }

        var systemImage: String {
            switch self {
            case .multipleAircraft: return "airplane"
            case .editAfterSetup: return "pencil"
            case .logTach: return "speedometer"
            case .squawks: return "wrench.and.screwdriver"
            case .adsAndCustomItems: return "checklist"
            case .pdfExports: return "doc.richtext"
            case .notifications: return "bell.badge"
            }
        }
    }

    static let freeAircraftLimit = 1
    static let freeFeatures: Set<Feature> = []

    let isPro: Bool

    static let free = Entitlements(isPro: false)
    static let pro = Entitlements(isPro: true)

    func allows(_ feature: Feature) -> Bool {
        return isPro || Entitlements.freeFeatures.contains(feature)
    }

    /// The first aircraft is always allowed (onboarding).
    func canAddAircraft(existingCount: Int) -> Bool {
        return allows(.multipleAircraft) || existingCount < Entitlements.freeAircraftLimit
    }
}
