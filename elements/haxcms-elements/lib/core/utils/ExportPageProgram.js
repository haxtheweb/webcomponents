/**
 * Export Page Program for Merlin
 * Allows users to export the current page in multiple formats:
 * - HTML
 * - Markdown
 * - DOCX
 * - PDF
 * - HAXSchema
 */
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { b64toBlob } from "@haxtheweb/utils/utils.js";

export function createExportPageProgram(context) {
  return async (input, values) => {
    let results = [];
    
    // Define available export formats
    const exportFormats = [
      {
        title: "Export as HTML",
        icon: "hax:file-html",
        format: "html",
        description: "Download current page as HTML file"
      },
      {
        title: "Export as Markdown",
        icon: "hax:format-textblock", 
        format: "markdown",
        description: "Download current page as Markdown (.md) file"
      },
      {
        title: "Export as DOCX",
        icon: "hax:file-docx",
        format: "docx", 
        description: "Download current page as Word document"
      },
      {
        title: "Export as PDF",
        icon: "lrn:pdf",
        format: "pdf",
        description: "Download current page as PDF file"
      },
      {
        title: "Export as HAXSchema",
        icon: "hax:code-json",
        format: "haxschema",
        description: "Copy HAXSchema JSON to clipboard"
      }
    ];

    // Filter results based on input
    exportFormats.forEach(format => {
      if (input === "" || format.title.toLowerCase().includes(input.toLowerCase()) || 
          format.format.includes(input.toLowerCase())) {
        results.push({
          title: format.title,
          icon: format.icon,
          tags: ["export", "page", format.format],
          more: format.description,
          value: {
            target: context,
            method: "exportPageAs",
            args: [format.format]
          },
          eventName: "super-daemon-element-method",
          path: `CMS/export/page/${format.format}`,
          context: ["CMS", "HAX"]
        });
      }
    });

    return results;
  };
}

// Export page method to be added to haxcms-site-editor-ui class
export async function exportPageAs(format) {
  try {
    const haxBody = HAXStore.activeHaxBody;
    if (!haxBody) {
      HAXStore.toast("No HAX body found for export", 3000, "fit-bottom");
      return;
    }

    const pageContent = await haxBody.haxToContent();
    const pageTitle = globalThis.document.title || "page";

    switch (format) {
      case "html":
        await this._exportPageAsHTML(pageContent, pageTitle);
        break;
      
      case "markdown":
        await this._exportPageAsMarkdown(pageContent, pageTitle);
        break;
      
      case "docx":
        await this._exportPageAsDOCX(pageContent, pageTitle);
        break;
      
      case "pdf":
        await this._exportPageAsPDF(pageContent, pageTitle);
        break;
      
      case "haxschema":
        await this._exportPageAsHAXSchema();
        break;
      
      default:
        HAXStore.toast(`Export format "${format}" not supported`, 3000, "fit-bottom");
    }
  } catch (error) {
    console.error("Export error:", error);
    HAXStore.toast(`Export failed: ${error.message}`, 3000, "fit-bottom");
  }
}

// Helper methods for different export formats
export async function _exportPageAsHTML(content, title) {
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>globalThis.WCGlobalCDNPath="https://cdn.webcomponents.psu.edu/cdn/";</script>
    <script src="https://cdn.webcomponents.psu.edu/cdn/build.js"></script>
    <style>
      body { padding: 32px; font-family: system-ui, sans-serif; }
    </style>
  </head>
  <body>
    ${content}
  </body>
</html>`;

  this._downloadFile(fullHTML, `${title}.html`, "text/html");
  HAXStore.toast("HTML file downloaded successfully", 3000, "fit-bottom");
}

export async function _exportPageAsMarkdown(content, title) {
  try {
    const response = await MicroFrontendRegistry.call("@core/htmlToMd", {
      html: content
    });
    
    if (response.status === 200 && response.data) {
      this._downloadFile(response.data, `${title}.md`, "text/markdown");
      HAXStore.toast("Markdown file downloaded successfully", 3000, "fit-bottom");
    } else {
      throw new Error("Failed to convert to Markdown");
    }
  } catch (error) {
    console.error("Markdown export error:", error);
    HAXStore.toast("Markdown export service not available", 3000, "fit-bottom");
  }
}

export async function _exportPageAsDOCX(content, title) {
  try {
    const response = await MicroFrontendRegistry.call("@core/htmlToDocx", {
      html: content
    });
    
    if (response.status === 200 && response.data) {
      const blob = b64toBlob(response.data, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      this._downloadBlob(blob, `${title}.docx`);
      HAXStore.toast("DOCX file downloaded successfully", 3000, "fit-bottom");
    } else {
      throw new Error("Failed to convert to DOCX");
    }
  } catch (error) {
    console.error("DOCX export error:", error);
    HAXStore.toast("DOCX export service not available", 3000, "fit-bottom");
  }
}

export async function _exportPageAsPDF(content, title) {
  try {
    // Get base URL for PDF generation
    const baseUrl = globalThis.document.querySelector("base")?.href || globalThis.location.origin;
    
    const response = await MicroFrontendRegistry.call("@core/htmlToPdf", {
      base: baseUrl,
      html: content
    });
    
    if (response.status === 200 && response.data) {
      const blob = b64toBlob(response.data, "application/pdf");
      this._downloadBlob(blob, `${title}.pdf`);
      HAXStore.toast("PDF file downloaded successfully", 3000, "fit-bottom");
    } else {
      throw new Error("Failed to convert to PDF");
    }
  } catch (error) {
    console.error("PDF export error:", error);
    HAXStore.toast("PDF export service not available", 3000, "fit-bottom");
  }
}

export async function _exportPageAsHAXSchema() {
  try {
    // Use existing HAXStore method to get HAXSchema
    const body = await HAXStore.activeHaxBody.haxToContent();
    const elements = await HAXStore.htmlToHaxElements(body);
    elements.shift(); // Remove the first element as done in hax-view-source
    
    const haxSchema = JSON.stringify(elements, null, 2);
    
    // Copy to clipboard
    await navigator.clipboard.writeText(haxSchema);
    HAXStore.toast("HAXSchema copied to clipboard", 3000, "fit-bottom");
  } catch (error) {
    console.error("HAXSchema export error:", error);
    HAXStore.toast("Failed to export HAXSchema", 3000, "fit-bottom");
  }
}

export function _downloadFile(content, filename, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  this._downloadBlob(blob, filename);
}

export function _downloadBlob(blob, filename) {
  const link = globalThis.document.createElement("a");
  link.href = globalThis.URL.createObjectURL(blob);
  link.download = filename;
  link.target = "_blank";
  globalThis.document.body.appendChild(link);
  link.click();
  globalThis.document.body.removeChild(link);
  globalThis.URL.revokeObjectURL(link.href);
}