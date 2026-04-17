# Invoice Parser — OpenClaw Plugin

Parse, extract, and convert invoice PDFs using the [PDFAPIHub](https://pdfapihub.com) API. This OpenClaw plugin gives your AI agent the ability to read invoices, extract line items and tables, OCR scanned invoices, and export data to Excel and CSV.

## What It Does

Extract structured data from invoice PDFs — text, tables, line items, totals, and metadata. Handle both digital and scanned invoices with OCR. Export extracted data to Excel and CSV for accounting, analysis, and bookkeeping.

### Features

- **Full Invoice Parsing** — Extract text, layout, and table data in a single call
- **Table Extraction** — Pull out line items, pricing tables, and itemized charges
- **Excel Export** — Export invoice tables directly to XLSX spreadsheets
- **CSV Export** — Export to CSV for database import and accounting software
- **Scanned Invoice OCR** — Read text from scanned or image-based invoice PDFs at 300 DPI
- **Multi-Language OCR** — English, German, French, Spanish, and many more
- **Page Selection** — Parse specific pages or the entire document
- **PDF Metadata** — Check page count, file size, encryption, author, and creation date

## Tools

| Tool | Description |
|------|-------------|
| `parse_invoice` | Parse invoice PDF — extract text, layout, tables, or all |
| `extract_invoice_tables` | Extract tables to Excel (XLSX) |
| `ocr_scanned_invoice` | OCR scanned invoice PDFs |
| `invoice_to_csv` | Extract tables to CSV |
| `invoice_info` | Get invoice PDF metadata |

## Installation

```bash
openclaw plugins install clawhub:pdfapihub-invoice-parser
```

## Configuration

Add your API key in `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "pdfapihub-invoice-parser": {
        "enabled": true,
        "env": {
          "PDFAPIHUB_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}
```

Get your **free API key** at [https://pdfapihub.com](https://pdfapihub.com).

## Usage Examples

Just ask your OpenClaw agent:

- *"Parse this invoice and show me the line items"*
- *"Extract the invoice table to an Excel file"*
- *"OCR this scanned invoice and extract the text"*
- *"Export the invoice data as CSV"*
- *"How many pages is this invoice?"*

## Use Cases

- **Accounts Payable** — Extract invoice data for automated payment processing
- **Bookkeeping** — Parse invoices and export to Excel/CSV for accounting records
- **Expense Management** — Extract line items and amounts from vendor invoices
- **Audit Trails** — Parse and archive invoice data for compliance and auditing
- **Data Entry Automation** — Replace manual invoice data entry with automated extraction
- **ERP Integration** — Export invoice data in CSV format for ERP system import

## API Documentation

Full API docs: [https://pdfapihub.com/docs](https://pdfapihub.com/docs)

## License

MIT
