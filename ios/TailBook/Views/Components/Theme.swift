import SwiftUI
import TailBookEngine

/// Calm, instrument-panel look: system font, monospaced digits, one accent,
/// status colors from the asset catalog (tuned for light and dark).
enum Theme {
    static let statusGreen = Color("StatusGreen")
    static let statusYellow = Color("StatusYellow")
    static let statusRed = Color("StatusRed")
    static let panel = Color("PanelBackground")
    /// Label color on accent-filled buttons (white in light, near-black in dark for AA contrast).
    static let onAccent = Color("OnAccent")

    static func color(for status: ItemStatus) -> Color {
        switch status {
        case .overdue: return statusRed
        case .dueSoon: return statusYellow
        case .ok: return statusGreen
        case .notApplicable: return Color.secondary
        case .unknown: return Color.secondary
        }
    }

    static func symbol(for status: ItemStatus) -> String {
        switch status {
        case .overdue: return "xmark.octagon.fill"
        case .dueSoon: return "exclamationmark.triangle.fill"
        case .ok: return "checkmark.circle.fill"
        case .notApplicable: return "minus.circle"
        case .unknown: return "questionmark.circle"
        }
    }

    static func color(for summary: SummaryStatus) -> Color {
        switch summary {
        case .current: return statusGreen
        case .limited: return statusYellow
        case .overdue: return statusRed
        case .incomplete: return Color.secondary
        }
    }

    static func symbol(for summary: SummaryStatus) -> String {
        switch summary {
        case .current: return "checkmark.circle.fill"
        case .limited: return "exclamationmark.triangle.fill"
        case .overdue: return "xmark.octagon.fill"
        case .incomplete: return "questionmark.circle.fill"
        }
    }
}

/// A rounded "instrument" card background.
struct PanelCard<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
            .padding(16)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.panel, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}

/// Shown in place of a Pro-only screen for free users.
struct LockedFeatureView: View {
    let feature: Entitlements.Feature
    let message: String
    @Environment(StoreService.self) private var store
    @State private var showPaywall = false

    var body: some View {
        ContentUnavailableView {
            Label(feature.title, systemImage: feature.systemImage)
        } description: {
            Text(message)
        } actions: {
            Button {
                showPaywall = true
            } label: {
                Label("Unlock with TailBook Pro", systemImage: "lock.open")
            }
            .buttonStyle(.borderedProminent)
        }
        .sheet(isPresented: $showPaywall) {
            PaywallView()
                .environment(store)
        }
    }
}
