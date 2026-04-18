---
name: invoice-parser
description: "Parse, extract, and convert invoice PDFs. Extract text, tables, and line items from invoices. OCR scanned invoices. Export invoice data to Excel and CSV for accounting and analysis. Powered by PDFAPIHub."
---

# Invoice Parser

Parse and extract data from invoice PDFs. Extract text, tables, and line items. OCR scanned invoices. Export to Excel and CSV.

## Tools

| Tool | Description |
|------|-------------|
| `parse_invoice` | Parse invoice PDF to extract text, layout, tables, or all content |
| `extract_invoice_tables` | Extract tables from an invoice and export to Excel (XLSX) |
| `ocr_scanned_invoice` | OCR a scanned or image-based invoice PDF to extract text |
| `invoice_to_csv` | Extract invoice tables and export to CSV format |
| `invoice_info` | Get invoice PDF metadata: page count, file size, author, dates |

## Setup

Get your **free API key** at [https://pdfapihub.com](https://pdfapihub.com).

Configure in `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "invoice-parser": {
        "enabled": true,
        "env": {
          "PDFAPIHUB_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}
```

**Privacy note:** Files you process are uploaded to PDFAPIHub's cloud service. Files are auto-deleted after 30 days.

## Usage Examples

**Parse an invoice:**
> Parse this invoice and extract all data: https://example.com/invoice.pdf

**Extract tables to Excel:**
> Extract the line items from this invoice to Excel: https://example.com/invoice.pdf

**OCR a scanned invoice:**
> This invoice is a scan — OCR it and extract the text: https://example.com/scanned-invoice.pdf

**Export to CSV:**
> Extract the invoice table data as CSV: https://example.com/invoice.pdf

**Check invoice metadata:**
> How many pages is this invoice? https://example.com/invoice.pdf

## Documentation

Full API docs: [https://pdfapihub.com/docs](https://pdfapihub.com/docs)
