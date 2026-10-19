import Foundation
import UIKit
import TailBookEngine

/// On-device PDF reports (US Letter), shared with ShareLink.
@MainActor
enum PDFExporter {
    static let pageRect = CGRect(x: 0, y: 0, width: 612, height: 792)

    enum Kind {
        case annualWorkOrder
        case statusReport

        var title: String {
            switch self {
            case .annualWorkOrder: return "Annual Work Order"
            case .statusReport: return "Aircraft Status Report"
            }
        }

        var fileStem: String {
            switch self {
            case .annualWorkOrder: return "Annual-Work-Order"
            case .statusReport: return "Status-Report"
            }
        }
    }

    /// Items worth a shop's attention: overdue, due soon, needs info, or due
    /// within `horizonDays` / `horizonHours`.
    static let horizonDays = 120
    static let horizonHours: Double = 25

    static func make(_ kind: Kind, for aircraft: Aircraft, now: Date = Date()) throws -> URL {
        switch kind {
        case .annualWorkOrder: return try annualWorkOrder(for: aircraft, now: now)
        case .statusReport: return try statusReport(for: aircraft, now: now)
        }
    }

    // MARK: Aircraft Status Report

    static func statusReport(for aircraft: Aircraft, now: Date = Date()) throws -> URL {
        let today = CivilDate.from(now)
        let result = aircraft.evaluate(asOf: today)
        let items = Engine.sortForBoard(result.items)
        let url = fileURL(.statusReport, tail: aircraft.displayTail, today: today)
        let renderer = UIGraphicsPDFRenderer(bounds: pageRect, format: format(title: Kind.statusReport.title))

        try renderer.writePDF(to: url) { context in
            let w = PDFPageWriter(context: context, pageRect: pageRect, footer: footer(today: today))
            header(w, kind: .statusReport, aircraft: aircraft, today: today)

            w.text("All items current?  \(result.summary.answer)", font: .boldSystemFont(ofSize: 15))
            w.text(result.summary.headline, font: .systemFont(ofSize: 10.5))
            if let next = result.summary.nextDueText {
                w.text("Next due: \(next)", font: .systemFont(ofSize: 10.5), color: PDFPageWriter.gray)
            }
            w.space(6)
            w.text(Legal.longDisclaimer, font: .italicSystemFont(ofSize: 8.5), color: PDFPageWriter.gray)
            w.space(8)

            let widths: [CGFloat] = [0.27, 0.19, 0.12, 0.26, 0.16]
            w.row(["Item", "Citation", "Status", "Current through / due", "Remaining"], widths: widths,
                  font: .boldSystemFont(ofSize: 9))
            w.rule()
            for item in items {
                let remaining = [item.remainingPrimary, item.remainingSecondary ?? ""]
                    .filter { !$0.isEmpty }.joined(separator: "\n")
                w.row([item.name, item.citation, item.statusLabel, dueText(item), remaining], widths: widths,
                      font: .systemFont(ofSize: 9),
                      colors: [PDFPageWriter.ink, PDFPageWriter.gray, statusColor(item.status),
                               PDFPageWriter.ink, PDFPageWriter.ink])
                var details: [String] = []
                if let lastDone = item.lastDone { details.append("Last done \(Fmt.date(lastDone))") }
                if let lastTach = item.lastDoneTach { details.append("at \(Fmt.hours(lastTach)) tach") }
                details += item.notes
                if !details.isEmpty {
                    w.text(details.joined(separator: " · "), font: .systemFont(ofSize: 8), color: PDFPageWriter.gray,
                           indent: 8, after: 4)
                }
                w.rule(after: 5)
            }

            w.space(10)
            w.text("Interpretations used", font: .boldSystemFont(ofSize: 10))
            w.text("Calendar-month items (annual, pitot-static, transponder, ELT inspection) are current through the last day of the month. The VOR check uses plain days (checked on D, current through D+30). Projected dates for hours-based items use \(utilizationText(aircraft)) and are informational only.",
                   font: .systemFont(ofSize: 8.5), color: PDFPageWriter.gray)
            w.text("Rules engine \(result.engineVersion). Checked against: ______________________  A&P/IA cert # __________  Date ________",
                   font: .systemFont(ofSize: 8.5), color: PDFPageWriter.gray)
        }
        return url
    }

    // MARK: Annual Work Order

    static func annualWorkOrder(for aircraft: Aircraft, now: Date = Date()) throws -> URL {
        let today = CivilDate.from(now)
        let result = aircraft.evaluate(asOf: today)
        let coming = Engine.sortForBoard(result.items).filter { isComingDue($0) }
        let squawks = aircraft.openSquawks.sorted { $0.createdAt < $1.createdAt }
        let url = fileURL(.annualWorkOrder, tail: aircraft.displayTail, today: today)
        let renderer = UIGraphicsPDFRenderer(bounds: pageRect, format: format(title: Kind.annualWorkOrder.title))

        try renderer.writePDF(to: url) { context in
            let w = PDFPageWriter(context: context, pageRect: pageRect, footer: footer(today: today))
            header(w, kind: .annualWorkOrder, aircraft: aircraft, today: today)
            w.text("Owner: ______________________   Phone: ______________   Drop-off: ____________",
                   font: .systemFont(ofSize: 9.5), color: PDFPageWriter.gray)
            w.space(8)

            w.text("Open squawks (\(squawks.count))", font: .boldSystemFont(ofSize: 13))
            w.rule()
            if squawks.isEmpty {
                w.text("No open squawks recorded.", font: .systemFont(ofSize: 10), color: PDFPageWriter.gray)
            }
            for (index, squawk) in squawks.enumerated() {
                w.text("\(index + 1). \(squawk.title)", font: .boldSystemFont(ofSize: 10.5), after: 2)
                var line = "Noted \(Fmt.date(squawk.createdAt))"
                let detail = squawk.detail.trimmingCharacters(in: .whitespacesAndNewlines)
                if !detail.isEmpty { line += " · \(detail)" }
                w.text(line, font: .systemFont(ofSize: 9.5), color: PDFPageWriter.gray, indent: 14, after: 2)
                w.text("Shop action: ________________________________________________", font: .systemFont(ofSize: 9.5),
                       color: PDFPageWriter.gray, indent: 14, after: 8)
            }

            w.space(6)
            w.text("Items coming due (within \(horizonDays) days or \(Int(horizonHours)) hrs)",
                   font: .boldSystemFont(ofSize: 13))
            w.rule()
            if coming.isEmpty {
                w.text("Nothing overdue or coming due in that window, based on the dates entered.",
                       font: .systemFont(ofSize: 10), color: PDFPageWriter.gray)
            } else {
                let widths: [CGFloat] = [0.32, 0.22, 0.14, 0.32]
                w.row(["Item", "Citation", "Status", "Due"], widths: widths, font: .boldSystemFont(ofSize: 9))
                for item in coming {
                    w.row([item.name, item.citation, item.statusLabel, dueText(item)], widths: widths,
                          font: .systemFont(ofSize: 9),
                          colors: [PDFPageWriter.ink, PDFPageWriter.gray, statusColor(item.status), PDFPageWriter.ink])
                    w.rule(after: 4)
                }
            }

            w.space(10)
            w.text("Shop notes", font: .boldSystemFont(ofSize: 13))
            for _ in 0..<5 {
                w.space(14)
                w.rule(after: 0)
            }
        }
        return url
    }

    // MARK: Helpers

    static func isComingDue(_ item: EvaluatedItem) -> Bool {
        switch item.status {
        case .overdue, .dueSoon, .unknown:
            return true
        case .notApplicable:
            return false
        case .ok:
            if let days = item.daysRemaining, days <= horizonDays { return true }
            if let hours = item.hoursRemaining, hours <= horizonHours { return true }
            return false
        }
    }

    static func dueText(_ item: EvaluatedItem) -> String {
        if item.status == .notApplicable || item.status == .unknown {
            return item.reason ?? item.message
        }
        var parts: [String] = []
        if let due = item.dueDate { parts.append(Fmt.date(due)) }
        if let tach = item.dueTach {
            var s = "\(Fmt.hours(tach)) tach"
            if let projected = item.projectedDate { s += " (≈ \(Fmt.date(projected)))" }
            parts.append(s)
        }
        if parts.isEmpty { return item.message }
        if parts.count == 1 { return parts[0] }
        let joined = parts.joined(separator: " or ")
        return "\(joined), whichever first"
    }

    static func utilizationText(_ aircraft: Aircraft) -> String {
        guard let avg = aircraft.effectiveAvgHoursPerMonth else { return "no utilization average yet" }
        return "\(Fmt.hours(avg)) hrs/month (\(aircraft.utilizationSourceDescription))"
    }

    static func header(_ w: PDFPageWriter, kind: Kind, aircraft: Aircraft, today: CivilDate) {
        w.text(kind.title, font: .boldSystemFont(ofSize: 22), after: 2)
        var line = aircraft.displayTail
        let model = aircraft.makeModel.trimmingCharacters(in: .whitespacesAndNewlines)
        if !model.isEmpty { line += " · \(model)" }
        w.text(line, font: .systemFont(ofSize: 13), after: 2)
        var meters = "As of \(Fmt.date(today))"
        if let tach = aircraft.currentTach { meters += " · Tach \(Fmt.hours(tach))" }
        if let hobbs = aircraft.currentHobbs { meters += " · Hobbs \(Fmt.hours(hobbs))" }
        meters += " · \(aircraft.isIFR ? "IFR" : "VFR only")"
        if aircraft.isForHire { meters += " · For hire" }
        w.text(meters, font: .systemFont(ofSize: 10), color: PDFPageWriter.gray, after: 6)
        w.rule(after: 10)
    }

    static func footer(today: CivilDate) -> String {
        return "\(Legal.shortDisclaimer) Always verify against your logbooks. Generated by TailBook on \(Fmt.date(today))."
    }

    static func statusColor(_ status: ItemStatus) -> UIColor {
        switch status {
        // Light-mode text tokens (design/tokens.json), AA on white at 9 pt.
        case .overdue: return UIColor(red: 0.639, green: 0.078, blue: 0.165, alpha: 1)
        case .dueSoon: return UIColor(red: 0.541, green: 0.325, blue: 0.000, alpha: 1)
        case .ok: return UIColor(red: 0.043, green: 0.416, blue: 0.322, alpha: 1)
        case .notApplicable, .unknown: return PDFPageWriter.gray
        }
    }

    static func format(title: String) -> UIGraphicsPDFRendererFormat {
        let format = UIGraphicsPDFRendererFormat()
        format.documentInfo = [
            kCGPDFContextTitle as String: title,
            kCGPDFContextCreator as String: "TailBook",
        ]
        return format
    }

    static func fileURL(_ kind: Kind, tail: String, today: CivilDate) -> URL {
        let safeTail = tail.filter { $0.isLetter || $0.isNumber }
        let name = "TailBook-\(safeTail.isEmpty ? "Aircraft" : safeTail)-\(kind.fileStem)-\(today.description).pdf"
        return FileManager.default.temporaryDirectory.appendingPathComponent(name)
    }
}

/// Minimal flowing layout on top of UIGraphicsPDFRendererContext: text
/// blocks, table rows and rules, with automatic page breaks and a footer on
/// every page. Colors are fixed (not dynamic) so dark mode never leaks in.
final class PDFPageWriter {
    static let ink = UIColor(white: 0.08, alpha: 1)
    static let gray = UIColor(white: 0.38, alpha: 1)
    static let ruleColor = UIColor(white: 0.78, alpha: 1)

    private let context: UIGraphicsPDFRendererContext
    private let pageRect: CGRect
    private let footer: String
    private let margin: CGFloat = 48
    private let footerReserve: CGFloat = 40
    private var y: CGFloat = 0
    private var pageNumber = 0

    init(context: UIGraphicsPDFRendererContext, pageRect: CGRect, footer: String) {
        self.context = context
        self.pageRect = pageRect
        self.footer = footer
        newPage()
    }

    private var contentWidth: CGFloat {
        return pageRect.width - margin * 2
    }

    private var bottomLimit: CGFloat {
        return pageRect.height - margin - footerReserve
    }

    func newPage() {
        context.beginPage()
        pageNumber += 1
        y = margin
        drawFooter()
    }

    private func drawFooter() {
        let attributes = PDFPageWriter.attributes(font: .systemFont(ofSize: 7.5), color: PDFPageWriter.gray)
        let text = NSAttributedString(string: "\(footer)   Page \(pageNumber)", attributes: attributes)
        let top = pageRect.height - margin - footerReserve + 10
        let rect = CGRect(x: margin, y: top, width: contentWidth, height: footerReserve + margin - 20)
        text.draw(in: rect)
    }

    static func attributes(font: UIFont, color: UIColor) -> [NSAttributedString.Key: Any] {
        let paragraph = NSMutableParagraphStyle()
        paragraph.lineBreakMode = .byWordWrapping
        return [.font: font, .foregroundColor: color, .paragraphStyle: paragraph]
    }

    private func height(of text: NSAttributedString, width: CGFloat) -> CGFloat {
        let bounds = text.boundingRect(with: CGSize(width: width, height: CGFloat.greatestFiniteMagnitude),
                                       options: [.usesLineFragmentOrigin, .usesFontLeading], context: nil)
        return ceil(bounds.height)
    }

    private func ensureSpace(_ needed: CGFloat) {
        if y + needed > bottomLimit {
            newPage()
        }
    }

    func space(_ amount: CGFloat) {
        y += amount
        if y > bottomLimit {
            newPage()
        }
    }

    func text(_ string: String, font: UIFont, color: UIColor = PDFPageWriter.ink,
              indent: CGFloat = 0, after: CGFloat = 6) {
        let attributed = NSAttributedString(string: string, attributes: PDFPageWriter.attributes(font: font, color: color))
        let width = contentWidth - indent
        let h = height(of: attributed, width: width)
        ensureSpace(h)
        attributed.draw(in: CGRect(x: margin + indent, y: y, width: width, height: h))
        y += h + after
    }

    /// A table row. `widths` are fractions of the content width.
    func row(_ cells: [String], widths: [CGFloat], font: UIFont, colors: [UIColor] = [], after: CGFloat = 4) {
        let gap: CGFloat = 6
        let count = min(cells.count, widths.count)
        guard count > 0 else { return }
        var strings: [NSAttributedString] = []
        var columnWidths: [CGFloat] = []
        var rowHeight: CGFloat = 0
        for index in 0..<count {
            let color = index < colors.count ? colors[index] : PDFPageWriter.ink
            let attributed = NSAttributedString(string: cells[index],
                                                attributes: PDFPageWriter.attributes(font: font, color: color))
            let width = widths[index] * contentWidth
            strings.append(attributed)
            columnWidths.append(width)
            rowHeight = max(rowHeight, height(of: attributed, width: width - gap))
        }
        ensureSpace(rowHeight)
        var x = margin
        for index in 0..<count {
            strings[index].draw(in: CGRect(x: x, y: y, width: columnWidths[index] - gap, height: rowHeight))
            x += columnWidths[index]
        }
        y += rowHeight + after
    }

    func rule(after: CGFloat = 8) {
        ensureSpace(1)
        let path = UIBezierPath()
        path.move(to: CGPoint(x: margin, y: y))
        path.addLine(to: CGPoint(x: pageRect.width - margin, y: y))
        path.lineWidth = 0.5
        PDFPageWriter.ruleColor.setStroke()
        path.stroke()
        y += after
    }
}
