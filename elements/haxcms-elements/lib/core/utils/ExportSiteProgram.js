/**
 * Export Site Program for Merlin
 * Allows users to export the entire site in multiple formats:
 * - HTML (entire site)
 * - Markdown (entire site)
 * - DOCX (entire site)
 * - PDF
 * - EPUB
 * - Zip (download site)
 */
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import { SITE_EXPORT_FORMATS } from "./import-export-options.js";

function _buildV1ExportUrl(baseUrl, format, queryParams = {}) {
  const url = new URL(
    `./x/api/v1/site/export/${encodeURIComponent(format)}`,
    baseUrl,
  );
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

function _buildV1ContentUrl(baseUrl, queryParams = {}) {
  const url = new URL(`./x/api/v1/content`, baseUrl);
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

export function createExportSiteProgram(context) {
  return async (input, values) => {
    let results = [];

    // Filter results based on input
    SITE_EXPORT_FORMATS.forEach((format) => {
      if (
        input === "" ||
        format.title.toLowerCase().includes(input.toLowerCase()) ||
        format.format.includes(input.toLowerCase())
      ) {
        results.push({
          title: format.title,
          icon: format.icon,
          tags: ["export", "site", format.format],
          more: format.description,
          value: {
            target: context,
            method: "exportSiteAs",
            args: [format.format],
          },
          eventName: "super-daemon-element-method",
          path: `CMS/export/site/${format.format}`,
          context: ["CMS"],
        });
      }
    });

    return results;
  };
}

// Export site method to be added to haxcms-site-editor-ui class
export async function exportSiteAs(format, options = {}) {
  try {
    const manifest = toJS(store.manifest);
    if (!manifest || !manifest.metadata) {
      HAXStore.toast(
        "Site manifest not available for export",
        3000,
        "fit-bottom",
      );
      return;
    }

    const siteTitle = manifest.title || "site";
    const baseElement = globalThis.document.querySelector("base");
    const baseUrl =
      (baseElement && baseElement.href) || globalThis.location.origin;

    switch (format) {
      case "html":
        await this._exportSiteAsHTML(manifest, siteTitle, baseUrl);
        break;

      case "markdown":
        await this._exportSiteAsMarkdown(manifest, siteTitle, baseUrl);
        break;

      case "docx":
        await this._exportSiteAsDOCX(manifest, siteTitle, baseUrl);
        break;

      case "pdf":
        await this._exportSiteAsPDF(manifest, siteTitle, baseUrl);
        break;

      case "epub":
        await this._exportSiteAsEPUB(manifest, siteTitle, baseUrl);
        break;

      case "zip":
        await this._downloadSiteArchive();
        break;

      case "skeleton":
        await this._exportSiteAsSkeleton(manifest, siteTitle, baseUrl, options);
        break;

      default:
        HAXStore.toast(
          `Export format "${format}" not supported`,
          3000,
          "fit-bottom",
        );
    }
  } catch (error) {
    console.error("Site export error:", error);
    HAXStore.toast(`Site export failed: ${error.message}`, 3000, "fit-bottom");
  }
}

// Helper methods for different export formats
export async function _exportSiteAsHTML(manifest, title, baseUrl) {
  try {
    const magic =
      globalThis.__appCDN &&
      (globalThis.__appCDN.startsWith("http://") ||
        globalThis.__appCDN.startsWith("https://"))
        ? globalThis.__appCDN
        : "";
    const url = _buildV1ExportUrl(baseUrl, "html", { magic });
    const response = await fetch(url, { credentials: "include" });

    if (response.ok) {
      const html = await response.text();
      this._downloadFile(html, `${title}.html`, "text/html");
      HAXStore.toast("Site HTML downloaded successfully", 3000, "fit-bottom");
    } else {
      throw new Error(`Failed to export site as HTML: ${response.status}`);
    }
  } catch (error) {
    console.error("Site HTML export error:", error);
    HAXStore.toast(
      "Site HTML export service not available",
      3000,
      "fit-bottom",
    );
  }
}

export async function _exportSiteAsMarkdown(manifest, title, baseUrl) {
  try {
    const url = _buildV1ContentUrl(baseUrl, { mode: "concat", format: "md" });
    const response = await fetch(url, { credentials: "include" });

    if (response.ok) {
      const markdown = await response.text();
      this._downloadFile(markdown, `${title}.md`, "text/markdown");
      HAXStore.toast(
        "Site Markdown downloaded successfully",
        3000,
        "fit-bottom",
      );
    } else {
      throw new Error(
        `Failed to export site as Markdown: ${response.status}`,
      );
    }
  } catch (error) {
    console.error("Site Markdown export error:", error);
    HAXStore.toast(
      "Site Markdown export service not available",
      3000,
      "fit-bottom",
    );
  }
}

export async function _exportSiteAsDOCX(manifest, title, baseUrl) {
  try {
    const url = _buildV1ExportUrl(baseUrl, "docx");
    const response = await fetch(url, { credentials: "include" });

    if (response.ok) {
      const blob = await response.blob();
      this._downloadBlob(blob, `${title}.docx`);
      HAXStore.toast("Site DOCX downloaded successfully", 3000, "fit-bottom");
    } else {
      throw new Error(`Failed to export site as DOCX: ${response.status}`);
    }
  } catch (error) {
    console.error("Site DOCX export error:", error);
    HAXStore.toast(
      "Site DOCX export service not available",
      3000,
      "fit-bottom",
    );
  }
}

export async function _exportSiteAsPDF(manifest, title, baseUrl) {
  try {
    const url = _buildV1ExportUrl(baseUrl, "pdf");
    const response = await fetch(url, { credentials: "include" });

    if (response.ok) {
      const blob = await response.blob();
      this._downloadBlob(blob, `${title}.pdf`);
      HAXStore.toast("Site PDF downloaded successfully", 3000, "fit-bottom");
    } else {
      throw new Error(`Failed to export site as PDF: ${response.status}`);
    }
  } catch (error) {
    console.error("Site PDF export error:", error);
    HAXStore.toast("Site PDF export service not available", 3000, "fit-bottom");
  }
}

export async function _exportSiteAsEPUB(manifest, title, baseUrl) {
  try {
    const url = _buildV1ExportUrl(baseUrl, "epub");
    const response = await fetch(url, { credentials: "include" });

    if (response.ok) {
      const blob = await response.blob();
      this._downloadBlob(blob, `${title}.epub`);
      HAXStore.toast("Site EPUB downloaded successfully", 3000, "fit-bottom");
    } else {
      throw new Error(`Failed to export site as EPUB: ${response.status}`);
    }
  } catch (error) {
    console.error("Site EPUB export error:", error);
    HAXStore.toast(
      "Site EPUB export service not available",
      3000,
      "fit-bottom",
    );
  }
}

export async function _downloadSiteArchive() {
  try {
    // Use the built-in site download functionality
    if (globalThis.HAXCMS && globalThis.HAXCMS.siteName) {
      // Trigger site download - this functionality is built into HAXcms
      const downloadUrl = `${globalThis.location.origin}${globalThis.location.pathname}?download-site=true`;
      const link = globalThis.document.createElement("a");
      link.href = downloadUrl;
      link.download = `${globalThis.HAXCMS.siteName}.zip`;
      link.target = "_blank";
      globalThis.document.body.appendChild(link);
      link.click();
      globalThis.document.body.removeChild(link);

      HAXStore.toast("Site archive download initiated", 3000, "fit-bottom");
    } else {
      throw new Error("Site download not available");
    }
  } catch (error) {
    console.error("Site archive download error:", error);
    HAXStore.toast("Site archive download not available", 3000, "fit-bottom");
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

// Export site as skeleton template
export async function _exportSiteAsSkeleton(
  manifest,
  title,
  baseUrl,
  options = {},
) {
  try {
    // Load the modal UI on demand
    await import("../ui/haxcms-site-platform-ui.js");

    const el = globalThis.document.createElement("haxcms-site-platform-ui");

    // platform settings mode uses the same UI but saves to the backend
    if (options && options.platformSettings) {
      el.platformSettingsMode = true;
    }

    const modalTitle =
      options && options.modalTitle
        ? options.modalTitle
        : options && options.platformSettings
          ? "Platform settings"
          : "Site skeleton";
    const modalTitleIcon =
      options && options.modalTitleIcon
        ? options.modalTitleIcon
        : options && options.platformSettings
          ? "hax:add-item"
          : "icons:description";
    const modalBreadcrumbs =
      options && Array.isArray(options.modalBreadcrumbs)
        ? options.modalBreadcrumbs
        : [];
    const modalStyles =
      options && options.platformSettings
        ? {
            "--simple-modal-titlebar-background": "black",
            "--simple-modal-titlebar-color": "var(--ddd-theme-default-white)",
            "--simple-modal-background":
              "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
            "--simple-modal-width": "80vw",
            "--simple-modal-max-width": "80vw",
            "--simple-modal-min-width": "300px",
            "--simple-modal-z-index": "100000000",
            "--simple-modal-height": "80vh",
            "--simple-modal-max-height": "80vh",
            "--simple-modal-min-height": "400px",
            "--simple-modal-titlebar-height": "80px",
            "--simple-modal-border-radius": "var(--ddd-radius-md)",
          }
        : {
            "--simple-modal-titlebar-background": "transparent",
            "--simple-modal-titlebar-color": "light-dark(black, white)",
            "--simple-modal-width": "80vw",
            "--simple-modal-max-width": "80vw",
            "--simple-modal-min-width": "300px",
            "--simple-modal-z-index": "100000000",
            "--simple-modal-height": "80vh",
            "--simple-modal-max-height": "80vh",
            "--simple-modal-min-height": "400px",
            "--simple-modal-titlebar-height": "80px",
            "--simple-modal-border-radius": "var(--ddd-radius-md)",
          };

    // Present a modal similar to outline-designer workflows
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-show", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          title: modalTitle,
          titleIcon: modalTitleIcon,
          breadcrumbs: modalBreadcrumbs,
          elements: {
            content: el,
          },
          modal: true,
          showClose: true,
          styles: modalStyles,
        },
      }),
    );
  } catch (error) {
    console.error("Skeleton export modal failed:", error);
    HAXStore.toast(
      `Skeleton export failed: ${error.message}`,
      5000,
      "fit-bottom",
    );
  }
}
