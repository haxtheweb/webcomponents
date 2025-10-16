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
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import { b64toBlob } from "@haxtheweb/utils/utils.js";

export function createExportSiteProgram(context) {
  return async (input, values) => {
    let results = [];

    // Define available export formats
    const exportFormats = [
      {
        title: "Export site as HTML",
        icon: "hax:file-html",
        format: "html",
        description: "Download entire site as consolidated HTML",
      },
      {
        title: "Export site as Markdown",
        icon: "hax:format-textblock",
        format: "markdown",
        description: "Download entire site as Markdown files",
      },
      {
        title: "Export site as DOCX",
        icon: "hax:file-docx",
        format: "docx",
        description: "Download entire site as Word document",
      },
      {
        title: "Export site as PDF",
        icon: "lrn:pdf",
        format: "pdf",
        description: "Download entire site as PDF",
      },
      {
        title: "Export site as EPUB",
        icon: "hax:file-ebook",
        format: "epub",
        description: "Download site as EPUB book",
      },
      {
        title: "Download site archive",
        icon: "icons:archive",
        format: "zip",
        description: "Download complete site as ZIP file",
      },
    ];

    // Filter results based on input
    exportFormats.forEach((format) => {
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
export async function exportSiteAs(format) {
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
    const response = await MicroFrontendRegistry.call("@haxcms/siteToHtml", {
      type: "site",
      site: {
        file: baseUrl + "/site.json",
        id: manifest.id,
        title: manifest.title,
        author: manifest.author,
        description: manifest.description,
        license: manifest.license,
        metadata: manifest.metadata,
        items: manifest.items,
      },
      ancestor: null, // null means whole site
      link: baseUrl,
      magic: globalThis.__appCDN || "https://cdn.hax.cloud/cdn/",
      base: baseUrl,
      format: "json",
    });

    if (response.status === 200 && response.data) {
      this._downloadFile(response.data, `${title}.html`, "text/html");
      HAXStore.toast("Site HTML downloaded successfully", 3000, "fit-bottom");
    } else {
      throw new Error("Failed to export site as HTML");
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
    // First get site as HTML, then convert to Markdown
    const htmlResponse = await MicroFrontendRegistry.call(
      "@haxcms/siteToHtml",
      {
        type: "site",
        site: {
          file: baseUrl + "/site.json",
          id: manifest.id,
          title: manifest.title,
          author: manifest.author,
          description: manifest.description,
          license: manifest.license,
          metadata: manifest.metadata,
          items: manifest.items,
        },
        ancestor: null, // null means whole site
        link: baseUrl,
        magic: globalThis.__appCDN || "https://cdn.hax.cloud/cdn/",
        base: baseUrl,
        format: "json",
      },
    );

    if (htmlResponse.status === 200 && htmlResponse.data) {
      const markdownResponse = await MicroFrontendRegistry.call(
        "@core/htmlToMd",
        {
          html: htmlResponse.data,
        },
      );

      if (markdownResponse.status === 200 && markdownResponse.data) {
        this._downloadFile(
          markdownResponse.data,
          `${title}.md`,
          "text/markdown",
        );
        HAXStore.toast(
          "Site Markdown downloaded successfully",
          3000,
          "fit-bottom",
        );
      } else {
        throw new Error("Failed to convert site HTML to Markdown");
      }
    } else {
      throw new Error("Failed to get site HTML for Markdown conversion");
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
    // First get site as HTML, then convert to DOCX
    const htmlResponse = await MicroFrontendRegistry.call(
      "@haxcms/siteToHtml",
      {
        type: "site",
        site: {
          file: baseUrl + "/site.json",
          id: manifest.id,
          title: manifest.title,
          author: manifest.author,
          description: manifest.description,
          license: manifest.license,
          metadata: manifest.metadata,
          items: manifest.items,
        },
        ancestor: null, // null means whole site
        link: baseUrl,
        magic: globalThis.__appCDN || "https://cdn.hax.cloud/cdn/",
        base: baseUrl,
        format: "json",
      },
    );

    if (htmlResponse.status === 200 && htmlResponse.data) {
      const docxResponse = await MicroFrontendRegistry.call(
        "@core/htmlToDocx",
        {
          html: htmlResponse.data,
        },
      );

      if (docxResponse.status === 200 && docxResponse.data) {
        const blob = b64toBlob(
          docxResponse.data,
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        );
        this._downloadBlob(blob, `${title}.docx`);
        HAXStore.toast("Site DOCX downloaded successfully", 3000, "fit-bottom");
      } else {
        throw new Error("Failed to convert site HTML to DOCX");
      }
    } else {
      throw new Error("Failed to get site HTML for DOCX conversion");
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
    // Get site HTML first, then convert to PDF
    const htmlResponse = await MicroFrontendRegistry.call(
      "@haxcms/siteToHtml",
      {
        type: "site",
        site: {
          file: baseUrl + "/site.json",
          id: manifest.id,
          title: manifest.title,
          author: manifest.author,
          description: manifest.description,
          license: manifest.license,
          metadata: manifest.metadata,
          items: manifest.items,
        },
        ancestor: null, // null means whole site
        link: baseUrl,
        magic: globalThis.__appCDN || "https://cdn.hax.cloud/cdn/",
        base: baseUrl,
        format: "json",
      },
    );

    if (htmlResponse.status === 200 && htmlResponse.data) {
      const pdfResponse = await MicroFrontendRegistry.call("@core/htmlToPdf", {
        base: baseUrl,
        html: htmlResponse.data,
      });

      if (pdfResponse.status === 200 && pdfResponse.data) {
        const blob = b64toBlob(pdfResponse.data, "application/pdf");
        this._downloadBlob(blob, `${title}.pdf`);
        HAXStore.toast("Site PDF downloaded successfully", 3000, "fit-bottom");
      } else {
        throw new Error("Failed to convert site HTML to PDF");
      }
    } else {
      throw new Error("Failed to get site HTML for PDF conversion");
    }
  } catch (error) {
    console.error("Site PDF export error:", error);
    HAXStore.toast("Site PDF export service not available", 3000, "fit-bottom");
  }
}

export async function _exportSiteAsEPUB(manifest, title, baseUrl) {
  try {
    const response = await MicroFrontendRegistry.call("@haxcms/siteToEpub", {
      type: "link",
      site: `${baseUrl}/site.json`,
      ancestor: null, // null means whole site
    });

    if (response.status === 200 && response.data) {
      // Response data should be the EPUB binary data
      const blob = new Blob([response.data], { type: "application/epub+zip" });
      this._downloadBlob(blob, `${title}.epub`);
      HAXStore.toast("Site EPUB downloaded successfully", 3000, "fit-bottom");
    } else {
      throw new Error("Failed to export site as EPUB");
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
