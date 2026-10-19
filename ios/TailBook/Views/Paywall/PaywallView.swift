import SwiftUI
import StoreKit

/// StoreKit 2 paywall (Apple's SubscriptionStoreView: price, period and trial
/// terms are rendered and localized by the system). Shown only after the
/// owner has seen their board.
struct PaywallView: View {
    @Environment(StoreService.self) private var store
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        SubscriptionStoreView(productIDs: AppConfig.proProductIDs) {
            PaywallMarketingView(anchorLine: store.anchorLine)
        }
        .subscriptionStoreButtonLabel(.multiline)
        .storeButton(.visible, for: .restorePurchases, .redeemCode, .policies, .cancellation)
        .subscriptionStorePolicyDestination(url: AppConfig.termsURL, for: .termsOfService)
        .subscriptionStorePolicyDestination(url: AppConfig.privacyURL, for: .privacyPolicy)
        .onInAppPurchaseCompletion { _, result in
            let unlocked = await store.handleCompletion(result)
            if unlocked {
                await MainActor.run { dismiss() }
            }
        }
        .tint(Color.accentColor)
    }
}

/// The marketing header above the plans.
struct PaywallMarketingView: View {
    let anchorLine: String

    private let features: [Entitlements.Feature] = [
        .editAfterSetup,
        .adsAndCustomItems,
        .notifications,
        .logTach,
        .squawks,
        .pdfExports,
        .multipleAircraft,
    ]

    var body: some View {
        VStack(spacing: 14) {
            Image(systemName: "airplane.circle.fill")
                .font(.system(size: 52))
                .foregroundStyle(.tint)
                .accessibilityHidden(true)
            Text("TailBook Pro")
                .font(.largeTitle.weight(.bold))
            Text("Keep every due date in view, all year.")
                .font(.headline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            VStack(alignment: .leading, spacing: 8) {
                ForEach(features, id: \.self) { feature in
                    Label(feature.title, systemImage: feature.systemImage)
                        .font(.subheadline)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 8)

            Text(anchorLine)
                .font(.callout.weight(.semibold).monospacedDigit())
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(.thinMaterial, in: Capsule())

            Text("The annual plan includes a 14-day free trial for eligible new subscribers. Founding Owners: tap Redeem Code.")
                .font(.footnote)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            Text("Payment is charged to your Apple Account. Subscriptions renew automatically at the price shown until canceled. Cancel anytime in Settings › Apple Account › Subscriptions, at least 24 hours before the trial or current period ends.")
                .font(.footnote)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)

            HStack(spacing: 16) {
                Link("Terms of Use", destination: AppConfig.termsURL)
                    .frame(minHeight: 44)
                Link("Privacy Policy", destination: AppConfig.privacyURL)
                    .frame(minHeight: 44)
            }
            .font(.footnote)

            Text(Legal.shortDisclaimer)
                .font(.caption2)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding(.horizontal, 20)
        .padding(.top, 24)
    }
}
