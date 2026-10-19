import Foundation
import Observation
import StoreKit

/// StoreKit 2: loads products, tracks the active subscription, restores.
/// The paywall itself is Apple's `SubscriptionStoreView` (PaywallView).
@MainActor
@Observable
final class StoreService {
    private(set) var products: [Product] = []
    private(set) var purchasedProductIDs: Set<String> = []
    private(set) var hasLoadedEntitlements = false
    var lastErrorMessage: String? = nil

    @ObservationIgnored private var updatesTask: Task<Void, Never>? = nil

    init() {
        updatesTask = Task { [weak self] in
            for await update in Transaction.updates {
                if case .verified(let transaction) = update {
                    await transaction.finish()
                }
                await self?.refreshEntitlements()
            }
        }
        Task { [weak self] in
            await self?.loadProducts()
            await self?.refreshEntitlements()
        }
    }

    var isPro: Bool {
        #if DEBUG
        if AppConfig.debugForcePro { return true }
        #endif
        return !purchasedProductIDs.isDisjoint(with: AppConfig.proProductIDs)
    }

    var entitlements: Entitlements {
        return Entitlements(isPro: isPro)
    }

    var annualProduct: Product? {
        return products.first { $0.id == AppConfig.annualProductID }
    }

    /// "SavvyMx ~$750/yr · TailBook $199.99/yr" with the live, localized price.
    var anchorLine: String {
        guard let annual = annualProduct else { return AppConfig.priceAnchorLine }
        return "\(AppConfig.anchorCompetitor) · TailBook \(annual.displayPrice)/yr"
    }

    func loadProducts() async {
        do {
            let loaded = try await Product.products(for: AppConfig.proProductIDs)
            products = loaded.sorted { $0.price > $1.price }
        } catch {
            lastErrorMessage = error.localizedDescription
        }
    }

    func refreshEntitlements() async {
        var active = Set<String>()
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result, transaction.revocationDate == nil {
                active.insert(transaction.productID)
            }
        }
        purchasedProductIDs = active
        hasLoadedEntitlements = true
    }

    /// Restore Purchases: syncs with the App Store (may ask the user to sign in).
    func restore() async {
        do {
            try await AppStore.sync()
        } catch {
            lastErrorMessage = error.localizedDescription
        }
        await refreshEntitlements()
    }

    /// Called by the paywall when a purchase completes.
    func handle(purchaseResult: Product.PurchaseResult) async {
        if case .success(let verification) = purchaseResult, case .verified(let transaction) = verification {
            await transaction.finish()
        }
        await refreshEntitlements()
    }

    /// SubscriptionStoreView's completion callback. Returns true once Pro is active.
    func handleCompletion(_ result: Result<Product.PurchaseResult, Error>) async -> Bool {
        if case .success(let purchaseResult) = result {
            await handle(purchaseResult: purchaseResult)
        }
        return isPro
    }

    /// For the App Intent, which runs without the UI's StoreService instance.
    nonisolated static func hasActiveProEntitlement() async -> Bool {
        #if DEBUG
        if AppConfig.debugForcePro { return true }
        #endif
        for await result in Transaction.currentEntitlements {
            if case .verified(let transaction) = result,
               transaction.revocationDate == nil,
               AppConfig.proProductIDs.contains(transaction.productID) {
                return true
            }
        }
        return false
    }
}
