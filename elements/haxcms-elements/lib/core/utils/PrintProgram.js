/**
 * Print Program for Merlin - Provides multiple print options for HAXcms sites
 * This program works on any HAXcms site when logged in, using the PrintBranchMixin functionality
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";

/**
 * Print helper functions that can be called from Merlin options
 */
export class PrintHelper {
  static _revokeObjectUrlOnClose(objectUrl, printWindow) {
    let revoked = false;
    let closePoll = null;
    const revokeObjectUrl = () => {
      if (!revoked) {
        revoked = true;
        globalThis.URL.revokeObjectURL(objectUrl);
      }
      if (closePoll) {
        clearInterval(closePoll);
        closePoll = null;
      }
    };
    if (printWindow && printWindow.addEventListener) {
      printWindow.addEventListener("beforeunload", revokeObjectUrl, {
        once: true,
      });
      printWindow.addEventListener("pagehide", revokeObjectUrl, {
        once: true,
      });
      closePoll = setInterval(() => {
        if (printWindow.closed) {
          revokeObjectUrl();
        }
      }, 1000);
    } else {
      setTimeout(() => {
        revokeObjectUrl();
      }, 60000);
    }
  }
  static _legacyPrintViewUrl() {
    try {
      const printUrl = new URL(globalThis.location.href);
      printUrl.searchParams.set("format", "print-page");
      return printUrl.toString();
    } catch {
      const separator = globalThis.location.href.includes("?") ? "&" : "?";
      return `${globalThis.location.href}${separator}format=print-page`;
    }
  }
  static _activePageItemId() {
    const activeItem = toJS(store.activeItem);
    if (activeItem && activeItem.id) {
      return `${activeItem.id}`.trim();
    }
    const activeId = toJS(store.activeId);
    if (activeId) {
      return `${activeId}`.trim();
    }
    return "";
  }
  static _activePageFormatUrl(format = "html") {
    const itemId = this._activePageItemId();
    if (!itemId) {
      return "";
    }
    const normalizedFormat = String(format || "html").toLowerCase();
    const baseElement = globalThis.document.querySelector("base");
    const baseUrl =
      (baseElement && baseElement.href) || `${globalThis.location.origin}/`;
    try {
      return new URL(
        `x/api/v1/items/${encodeURIComponent(itemId)}?format=${encodeURIComponent(normalizedFormat)}`,
        baseUrl,
      ).toString();
    } catch {
      return "";
    }
  }
  static async printBranch() {
    try {
      const baseElement = globalThis.document.querySelector("base");
      const base =
        (baseElement && baseElement.href) || `${globalThis.location.origin}/`;
      const magic =
        globalThis.__appCDN &&
        (globalThis.__appCDN.startsWith("http://") ||
          globalThis.__appCDN.startsWith("https://"))
          ? globalThis.__appCDN
          : "";
      const ancestor = toJS(store.activeId);
      const url = new URL("./x/api/v1/site/export/html", base);
      if (magic) {
        url.searchParams.set("magic", magic);
      }
      if (ancestor) {
        url.searchParams.set("filter.ancestor", ancestor);
      }
      const response = await fetch(url.toString(), {
        credentials: "include",
      });
      if (response.ok) {
        const html = await response.text();
        const objectUrl = globalThis.URL.createObjectURL(
          new Blob([html], { type: "text/html" }),
        );
        const printWindow = globalThis.open(
          objectUrl,
          "",
          "left=0,top=0,width=800,height=800,toolbar=0,scrollbars=0,status=0,noopener=1,noreferrer=1",
        );
        this._revokeObjectUrlOnClose(objectUrl, printWindow);
      } else {
        this.printFallback();
      }
    } catch (error) {
      console.error("Print error:", error);
      this.printFallback();
    }
  }

  static async printWholeSite() {
    try {
      const baseElement = globalThis.document.querySelector("base");
      const base =
        (baseElement && baseElement.href) || `${globalThis.location.origin}/`;
      const magic =
        globalThis.__appCDN &&
        (globalThis.__appCDN.startsWith("http://") ||
          globalThis.__appCDN.startsWith("https://"))
          ? globalThis.__appCDN
          : "";
      const url = new URL("./x/api/v1/site/export/html", base);
      if (magic) {
        url.searchParams.set("magic", magic);
      }
      const response = await fetch(url.toString(), {
        credentials: "include",
      });
      if (response.ok) {
        const html = await response.text();
        const objectUrl = globalThis.URL.createObjectURL(
          new Blob([html], { type: "text/html" }),
        );
        const printWindow = globalThis.open(
          objectUrl,
          "",
          "left=0,top=0,width=800,height=800,toolbar=0,scrollbars=0,status=0,noopener=1,noreferrer=1",
        );
        this._revokeObjectUrlOnClose(objectUrl, printWindow);
      } else {
        this.printFallback();
      }
    } catch (error) {
      console.error("Print error:", error);
      this.printFallback();
    }
  }

  static printFallback() {
    const fallbackUrl = this._legacyPrintViewUrl();
    if (fallbackUrl) {
      globalThis.open(
        fallbackUrl,
        "",
        "left=0,top=0,width=800,height=800,toolbar=0,scrollbars=0,status=0,noopener=1,noreferrer=1",
      );
    } else {
      globalThis.print();
    }
  }

  static printCurrentPage() {
    globalThis.print();
  }

  static openPrintView() {
    const printUrl = this._legacyPrintViewUrl();
    if (printUrl) {
      globalThis.open(printUrl, "_blank");
    }
  }

  static openJSONView() {
    const jsonUrl = this._activePageFormatUrl("json");
    if (jsonUrl) {
      globalThis.open(jsonUrl, "_blank");
    }
  }
}

export const createPrintProgram = (i18nMixin) => {
  return async (_input, _values) => {
    const results = [];

    // Get localized strings (fallback to English if not available)
    const t = {
      printPage: "Print page",
      printSite: "Print site",
      printPageAndChildren: "Print this page and its children",
      printCurrentPageOnly: "Print current page only",
      downloadPdf: "Download PDF",
      openPrintFriendlyView: "Open print-friendly view",
      viewPageDataJson: "View page data (JSON)",
      printingPleaseWait: "Printing, please wait...",
      printBranchDescription:
        "Print the current page and all child pages as HTML",
      printSiteDescription: "Print every page in the site as HTML",
      printCurrentPageDescription:
        "Use the browser's print dialog for the current page only",
      downloadPdfDescription:
        "Export the current page and child pages as PDF (when available)",
      printViewDescription:
        "Open a clean, print-optimized view in a new window",
      jsonViewDescription: "View the current page data as JSON in a code view",
    };
    if (i18nMixin && i18nMixin.t) {
      Object.keys(t).forEach((key) => {
        if (i18nMixin.t[key]) {
          t[key] = i18nMixin.t[key];
        }
      });
    }

    // Option 1: Print current page and children (branch)
    results.push({
      title: t.printPageAndChildren,
      icon: "icons:print",
      tags: ["print", "page", "branch", "children"],
      value: {
        target: PrintHelper,
        method: "printBranch",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/action/print/branch",
      more: t.printBranchDescription,
    });

    // Option 2: Print entire site
    results.push({
      title: t.printSite,
      icon: "icons:print",
      tags: ["print", "site", "all", "complete"],
      value: {
        target: PrintHelper,
        method: "printWholeSite",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/action/print/site",
      more: t.printSiteDescription,
    });

    // Option 3: Print current page only (browser print)
    results.push({
      title: t.printCurrentPageOnly,
      icon: "icons:print",
      tags: ["print", "page", "current", "browser"],
      value: {
        target: PrintHelper,
        method: "printCurrentPage",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/action/print/current",
      more: t.printCurrentPageDescription,
    });

    // Option 4: Download as PDF (uses same service as branch print)
    if (MicroFrontendRegistry.has("@system/siteToHtml")) {
      results.push({
        title: t.downloadPdf,
        icon: "hax:file-pdf",
        tags: ["print", "pdf", "download", "export"],
        value: {
          target: PrintHelper,
          method: "printBranch",
          args: [],
        },
        eventName: "super-daemon-element-method",
        path: "CMS/action/print/pdf",
        more: t.downloadPdfDescription,
      });
    }

    // Option 5: Print-friendly view
    results.push({
      title: t.openPrintFriendlyView,
      icon: "icons:launch",
      tags: ["print", "view", "friendly", "clean"],
      value: {
        target: PrintHelper,
        method: "openPrintView",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/action/print/view",
      more: t.printViewDescription,
    });

    // Option 6: JSON data view
    results.push({
      title: t.viewPageDataJson,
      icon: "code",
      tags: ["json", "data", "view", "code", "debug"],
      value: {
        target: PrintHelper,
        method: "openJSONView",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/action/view/json",
      more: t.jsonViewDescription,
    });

    return results;
  };
};
