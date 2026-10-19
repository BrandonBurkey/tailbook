import Foundation
import SwiftData

/// One tach reading from the quick log. The history drives average utilization.
@Model
final class TachEntry {
    var uuid: UUID = UUID()
    var date: Date = Date()
    var tach: Double = 0
    var hobbs: Double? = nil
    var hoursFlown: Double = 0
    var note: String = ""

    var aircraft: Aircraft? = nil

    init(date: Date, tach: Double, hobbs: Double? = nil, hoursFlown: Double = 0, note: String = "") {
        self.date = date
        self.tach = tach
        self.hobbs = hobbs
        self.hoursFlown = hoursFlown
        self.note = note
    }
}
