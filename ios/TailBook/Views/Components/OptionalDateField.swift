import SwiftUI

/// A date that may be unknown. nil = "Don't know yet" (the item shows as
/// "Needs info" instead of guessing).
struct OptionalDateField: View {
    let title: String
    var footnote: String? = nil
    @Binding var date: Date?
    var allowsFuture: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(alignment: .firstTextBaseline) {
                Text(title)
                Spacer(minLength: 8)
                if date != nil {
                    picker
                } else {
                    Button("Set date") {
                        date = Date()
                    }
                    .buttonStyle(.bordered)
                }
            }
            if date != nil {
                Button("Don't know yet") {
                    date = nil
                }
                .font(.caption)
                .buttonStyle(.borderless)
                .frame(minHeight: 44)
            } else {
                Text("Don't know yet — shows as Needs info until you add it.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            if let footnote = footnote {
                Text(footnote)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 2)
    }

    @ViewBuilder
    private var picker: some View {
        if allowsFuture {
            DatePicker(title, selection: nonOptional, displayedComponents: .date)
                .labelsHidden()
        } else {
            DatePicker(title, selection: nonOptional, in: ...Date(), displayedComponents: .date)
                .labelsHidden()
        }
    }

    private var nonOptional: Binding<Date> {
        Binding(
            get: { date ?? Date() },
            set: { date = $0 }
        )
    }
}

/// A numeric text field for tach/Hobbs style values (text-backed so it can be empty).
struct DecimalField: View {
    let title: String
    @Binding var text: String
    var prompt: String = ""
    var unit: String? = nil

    var body: some View {
        HStack {
            Text(title)
            Spacer(minLength: 8)
            TextField(title, text: $text, prompt: Text(prompt))
                .keyboardType(.decimalPad)
                .multilineTextAlignment(.trailing)
                .font(.body.monospacedDigit())
                .frame(maxWidth: 160)
            if let unit = unit {
                Text(unit)
                    .foregroundStyle(.secondary)
            }
        }
    }
}
