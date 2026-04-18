import type { PluginEntry } from "@anthropic/openclaw-plugin-sdk";

const API_BASE = "https://pdfapihub.com/api";

async function callApi(
  endpoint: string,
  body: Record<string, unknown>,
  apiKey: string
): Promise<unknown> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CLIENT-API-KEY": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`PDFAPIHub API error (${res.status}): ${text}`);
    }
    throw new Error(
      `PDFAPIHub API error (${res.status}): ${(parsed as any).error || text}`
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return {
    success: true,
    content_type: contentType,
    message: "Binary file returned. Use output='url' or output='base64' for usable results.",
  };
}

function getApiKey(config: Record<string, unknown>): string {
  const key = (config.apiKey as string) || "";
  if (!key) {
    throw new Error(
      "PDFAPIHub API key not configured. Get a free key at https://pdfapihub.com"
    );
  }
  return key;
}

function buildBody(params: Record<string, unknown>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      body[key] = value;
    }
  }
  return body;
}

const plugin: PluginEntry = {
  id: "pdfapihub-invoice-parser",
  name: "Invoice Parser",
  register(api) {
    // ─── Parse Invoice ───────────────────────────────────────
    api.registerTool({
      name: "parse_invoice",
      description:
        "Parse an invoice PDF to extract text, layout, tables, or all content. Uses 'full' mode by default to extract everything: raw text, structured layout, and table data including line items, quantities, and amounts.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL of the invoice PDF to parse.",
          },
          mode: {
            type: "string",
            enum: ["text", "layout", "tables", "full"],
            description:
              "'text' = raw text, 'layout' = structured layout, 'tables' = table data only, 'full' = all modes combined. Default: 'full'.",
          },
          pages: {
            type: "string",
            description: "Page range to parse. E.g. '1', '1-3', 'all'.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        const body = buildBody(params);
        if (!body.mode) body.mode = "full";
        return callApi("/v1/pdf/parse", body, apiKey);
      },
    });

    // ─── Extract Invoice Tables to Excel ─────────────────────
    api.registerTool({
      name: "extract_invoice_tables",
      description:
        "Extract tables from an invoice PDF and export to Excel (XLSX). Ideal for extracting line items, pricing tables, and itemized charges into a spreadsheet format for accounting and analysis.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL of the invoice PDF.",
          },
          file: {
            type: "string",
            description: "Base64-encoded invoice PDF.",
          },
          pages: {
            type: "string",
            description: "Page range to extract tables from.",
          },
          output: {
            type: "string",
            enum: ["url", "base64", "file"],
            description: "Output format. Default: 'url'.",
          },
          output_filename: {
            type: "string",
            description: "Custom filename for the Excel file.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        return callApi("/v1/convert/pdf/xlsx", buildBody(params), apiKey);
      },
    });

    // ─── OCR Scanned Invoice ─────────────────────────────────
    api.registerTool({
      name: "ocr_scanned_invoice",
      description:
        "OCR a scanned invoice PDF to extract text. Uses high-quality OCR at 300 DPI to read text from scanned or image-based invoice PDFs. Supports multiple languages and character whitelisting.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL of the scanned invoice PDF.",
          },
          base64_pdf: {
            type: "string",
            description: "Base64-encoded scanned invoice PDF.",
          },
          pages: {
            type: "string",
            description: "Page range to OCR.",
          },
          lang: {
            type: "string",
            description:
              "OCR language code (e.g. 'eng', 'deu', 'fra'). Default: 'eng'.",
          },
          dpi: {
            type: "number",
            description: "OCR resolution in DPI. Default: 300.",
          },
          detail: {
            type: "string",
            enum: ["text", "words"],
            description:
              "'text' = full text blocks, 'words' = individual words with positions.",
          },
          char_whitelist: {
            type: "string",
            description: "Restrict OCR to these characters only.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        const body = buildBody(params);
        if (!body.dpi) body.dpi = 300;
        return callApi("/v1/pdf/ocr/parse", body, apiKey);
      },
    });

    // ─── Invoice to CSV ──────────────────────────────────────
    api.registerTool({
      name: "invoice_to_csv",
      description:
        "Extract tables from an invoice PDF and export to CSV format. Produces comma-separated values suitable for import into spreadsheets, databases, and accounting software.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL of the invoice PDF.",
          },
          file: {
            type: "string",
            description: "Base64-encoded invoice PDF.",
          },
          pages: {
            type: "string",
            description: "Page range to extract.",
          },
          output: {
            type: "string",
            enum: ["url", "base64", "file"],
            description: "Output format. Default: 'url'.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        return callApi("/v1/convert/pdf/csv", buildBody(params), apiKey);
      },
    });

    // ─── Invoice Info ────────────────────────────────────────
    api.registerTool({
      name: "invoice_info",
      description:
        "Get metadata from an invoice PDF: page count, file size, encryption status, author, creation date, and other document properties. Useful for verifying invoice PDFs before processing.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL of the invoice PDF.",
          },
          base64_pdf: {
            type: "string",
            description: "Base64-encoded invoice PDF.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        return callApi("/v1/pdf/info", buildBody(params), apiKey);
      },
    });
  },
};

export default plugin;
