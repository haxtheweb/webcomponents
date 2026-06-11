/**
 * Export Page Program for Merlin
 * Allows users to export the current page in multiple formats:
 * - HTML
 * - Markdown
 * - JSON
 * - YAML
 * - XML
 * - DOCX
 * - PDF
 * - HAX schema JSON
 */
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { b64toBlob } from "@haxtheweb/utils/utils.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { PAGE_EXPORT_FORMATS } from "./import-export-options.js";

export function createExportPageProgram(context) {
  return async (input, values) => {
    let results = [];

    // Filter results based on input
    PAGE_EXPORT_FORMATS.forEach((format) => {
      if (
        input === "" ||
        format.title.toLowerCase().includes(input.toLowerCase()) ||
        format.format.includes(input.toLowerCase())
      ) {
        results.push({
          title: format.title,
          icon: format.icon,
          tags: ["export", "page", format.format],
          more: format.description,
          value: {
            target: context,
            method: "exportPageAs",
            args: [format.format],
          },
          eventName: "super-daemon-element-method",
          path: `CMS/export/page/${format.format}`,
          context: ["CMS", "HAX"],
        });
      }
    });

    return results;
  };
}

// Export page method to be added to haxcms-site-editor-ui class
export async function exportPageAs(format) {
  try {
    const pageTitle = globalThis.document.title || "page";

    switch (format) {
      case "html":
        await _exportPageRouteVariant.call(this, "html", pageTitle);
        break;

      case "markdown":
        await _exportPageRouteVariant.call(this, "markdown", pageTitle);
        break;

      case "json":
      case "yaml":
      case "xml":
        await _exportPageRouteVariant.call(this, format, pageTitle);
        break;
      case "docx": {
        const haxBody = HAXStore.activeHaxBody;
        if (!haxBody) {
          HAXStore.toast(
            "No editable content found for export",
            3000,
            "fit-bottom",
          );
          return;
        }
        const pageContent = await haxBody.haxToContent();
        await _exportPageAsDOCX.call(this, pageContent, pageTitle);
        break;
      }

      case "pdf": {
        const haxBody = HAXStore.activeHaxBody;
        if (!haxBody) {
          HAXStore.toast(
            "No editable content found for export",
            3000,
            "fit-bottom",
          );
          return;
        }
        const pageContent = await haxBody.haxToContent();
        await _exportPageAsPDF.call(this, pageContent, pageTitle);
        break;
      }

      case "haxschema":
        await _exportPageAsHAXSchema.call(this);
        break;

      default:
        HAXStore.toast(
          `Export format "${format}" not supported`,
          3000,
          "fit-bottom",
        );
    }
  } catch (error) {
    console.error("Export error:", error);
    HAXStore.toast(`Export failed: ${error.message}`, 3000, "fit-bottom");
  }
}

// Helper methods for different export formats
export async function _exportPageAsHTML(content, title) {
  return _exportPageRouteVariant.call(this, "html", title);
}

export async function _exportPageAsMarkdown(content, title) {
  return _exportPageRouteVariant.call(this, "markdown", title);
}

export function _pageRouteVariantExtension(format) {
  switch (format) {
    case "markdown":
      return "md";
    default:
      return format;
  }
}

export function _pageRouteVariantMimeType(format) {
  switch (format) {
    case "html":
      return "text/html";
    case "markdown":
      return "text/markdown";
    case "json":
      return "application/json";
    case "yaml":
      return "application/yaml";
    case "xml":
      return "application/xml";
    default:
      return "text/plain";
  }
}

export function _pageRouteVariantUrl(format) {
  const activeItem = store.activeItem;
  let itemId = "";
  if (activeItem && activeItem.id) {
    itemId = `${activeItem.id}`.trim();
  }
  if (!itemId) {
    return null;
  }
  let apiFormat = String(format || "html").toLowerCase();
  if (apiFormat === "markdown") {
    apiFormat = "md";
  }
  const baseElement = globalThis.document.querySelector("base");
  const baseUrl =
    (baseElement && baseElement.href) || `${globalThis.location.origin}/`;
  try {
    return new URL(
      `x/api/v1/items/${encodeURIComponent(itemId)}?format=${encodeURIComponent(apiFormat)}`,
      baseUrl,
    ).toString();
  } catch (e) {
    return null;
  }
}

export async function _exportPageRouteVariant(format, title) {
  try {
    const ext = _pageRouteVariantExtension(format);
    const mime = _pageRouteVariantMimeType(format);
    const url = _pageRouteVariantUrl(format);
    if (!url) {
      throw new Error("Current page URL unavailable");
    }
    const response = await fetch(url, {
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const content = await response.text();
    this._downloadFile(content, `${title}.${ext}`, mime);
    HAXStore.toast(`${ext.toUpperCase()} file downloaded successfully`, 3000, "fit-bottom");
  } catch (error) {
    console.error(`Page ${format} export error:`, error);
    HAXStore.toast(
      `Page ${format} export not available`,
      3000,
      "fit-bottom",
    );
  }
}

export async function _exportPageAsDOCX(content, title) {
  try {
    const response = await MicroFrontendRegistry.call("@core/htmlToDocx", {
      html: content,
    });

    if (response.status === 200 && response.data) {
      const blob = b64toBlob(
        response.data,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
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
    const baseElement = globalThis.document.querySelector("base");
    const baseUrl =
      (baseElement && baseElement.href) || globalThis.location.origin;

    const response = await MicroFrontendRegistry.call("@core/htmlToPdf", {
      base: baseUrl,
      html: content,
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
    // Use existing HAXStore method to get HAX schema JSON
    const body = await HAXStore.activeHaxBody.haxToContent();
    const elements = await HAXStore.htmlToHaxElements(body);
    elements.shift(); // Remove the first element as done in hax-view-source

    const haxSchema = JSON.stringify(elements, null, 2);

    // Copy to clipboard
    await navigator.clipboard.writeText(haxSchema);
    HAXStore.toast("HAX schema JSON copied to clipboard", 3000, "fit-bottom");
  } catch (error) {
    console.error("HAX schema export error:", error);
    HAXStore.toast("Failed to export HAX schema JSON", 3000, "fit-bottom");
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
