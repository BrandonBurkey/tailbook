import Foundation
import SwiftData

/// A discrepancy noted during the year, for the Annual Work Order.
@Model
final class Squawk {
    var uuid: UUID = UUID()
    var createdAt: Date = Date()
    var title: String = ""
    var detail: String = ""
    var isOpen: Bool = true
    var closedAt: Date? = nil
    var resolution: String = ""

    var aircraft: Aircraft? = nil

    init(title: String, detail: String = "") {
        self.title = title
        self.detail = detail
    }
}
