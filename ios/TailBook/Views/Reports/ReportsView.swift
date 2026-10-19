import SwiftUI
import PDFKit
import UIKit

/// The two on-device PDFs, previewed and shared with ShareLink.
struct ReportsView: View {
    let aircraft: Aircraft

    @Environment(StoreService.self) private var store
    @State private var workOrderURL: URL? = nil
    @State private var statusReportURL: URL? = nil
    @State private var errorMessage: String? = nil

    var body: some View {
        Group {
            if store.entitlements.allows(.pdfExports) {
                list
            } else {
                LockedFeatureView(feature: .pdfExports,
                                  message: "Hand your shop an Annual Work Order, or give a buyer, insurer or mechanic a one-page Aircraft Status Report.")
            }
        }
        .navigationTitle("Reports")
    }

    private var list: some View {
        List {
            Section {
                reportRow(kind: .annualWorkOrder, url: workOrderURL,
                          detail: "Open squawks plus everything overdue or coming due, formatted for your IA. Drop it off with the plane.")
            }
            Section {
                reportRow(kind: .statusReport, url: statusReportURL,
                          detail: "Every item with its date, FAR citation and status, plus the disclaimer, for your A&P/IA, insurer or a buyer.")
            }
            if let errorMessage = errorMessage {
                Section {
                    Label(errorMessage, systemImage: "exclamationmark.triangle")
                        .foregroundStyle(Theme.statusRed)
                }
            }
            Section {
                Text(Legal.shortDisclaimer)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
        }
        .onAppear { generate() }
        .refreshable { generate() }
    }

    @ViewBuilder
    private func reportRow(kind: PDFExporter.Kind, url: URL?, detail: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Label(kind.title, systemImage: "doc.richtext")
                .font(.headline)
            Text(detail)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding(.vertical, 2)
        if let url = url {
            NavigationLink {
                PDFPreviewScreen(title: kind.title, url: url)
            } label: {
                Label("Preview", systemImage: "eye")
            }
            ShareLink(item: url) {
                Label("Share PDF", systemImage: "square.and.arrow.up")
            }
        } else {
            HStack {
                ProgressView()
                Text("Preparing…")
                    .foregroundStyle(.secondary)
            }
        }
    }

    private func generate() {
        do {
            workOrderURL = try PDFExporter.make(.annualWorkOrder, for: aircraft)
            statusReportURL = try PDFExporter.make(.statusReport, for: aircraft)
            errorMessage = nil
        } catch {
            errorMessage = "Couldn't create the PDF: \(error.localizedDescription)"
        }
    }
}

struct PDFPreviewScreen: View {
    let title: String
    let url: URL

    var body: some View {
        PDFKitView(url: url)
            .ignoresSafeArea(edges: .bottom)
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    ShareLink(item: url)
                }
            }
    }
}

/// PDFKit's PDFView in SwiftUI.
struct PDFKitView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> PDFView {
        let view = PDFView()
        view.autoScales = true
        view.displayMode = .singlePageContinuous
        view.document = PDFDocument(url: url)
        return view
    }

    func updateUIView(_ uiView: PDFView, context: Context) {
        if uiView.document?.documentURL != url {
            uiView.document = PDFDocument(url: url)
        }
    }
}
