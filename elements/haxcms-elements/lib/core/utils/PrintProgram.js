/**
 * Print Program for Merlin - Provides multiple print options for HAXcms sites
 * This program works on any HAXcms site when logged in, using the PrintBranchMixin functionality
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";
import { b64toBlob } from "@haxtheweb/utils/utils.js";
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
    } catch (e) {
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
    } catch (e) {
      return "";
    }
  }
  static async printBranch() {
    let base = "";
    if (globalThis.document.querySelector("base")) {
      base = globalThis.document.querySelector("base").href;
    }
    const site = toJS(store.manifest);
    const params = {
      type: "site",
      site: {
        file: base + "site.json",
        id: site.id,
        title: site.title,
        author: site.author,
        description: site.description,
        license: site.license,
        metadata: site.metadata,
        items: site.items,
      },
      ancestor: toJS(store.activeId),
      link: base,
      magic: globalThis.__appCDN,
      base: base,
      format: "json",
    };

    try {
      const response = await MicroFrontendRegistry.call(
        "@haxcms/siteToHtml",
        params,
      );
      if (response.status == 200 && response.data) {
        const objectUrl = globalThis.URL.createObjectURL(
          b64toBlob(
            btoa(unescape(encodeURIComponent(response.data))),
            "text/html",
          ),
        );
        const printWindow = globalThis.open(
          objectUrl,
          "",
          "left=0,top=0,width=800,height=800,toolbar=0,scrollbars=0,status=0,noopener=1,noreferrer=1",
        );
        this._revokeObjectUrlOnClose(objectUrl, printWindow);
      } else {
        // Fallback
        this.printFallback();
      }
    } catch (error) {
      console.error("Print error:", error);
      this.printFallback();
    }
  }

  static async printWholeSite() {
    let base = "";
    if (globalThis.document.querySelector("base")) {
      base = globalThis.document.querySelector("base").href;
    }
    const site = toJS(store.manifest);
    const params = {
      type: "site",
      site: {
        file: base + "site.json",
        id: site.id,
        title: site.title,
        author: site.author,
        description: site.description,
        license: site.license,
        metadata: site.metadata,
        items: site.items,
      },
      ancestor: null, // null means whole site
      link: base,
      magic: globalThis.__appCDN,
      base: base,
      format: "json",
    };

    try {
      const response = await MicroFrontendRegistry.call(
        "@haxcms/siteToHtml",
        params,
      );
      if (response.status == 200 && response.data) {
        const objectUrl = globalThis.URL.createObjectURL(
          b64toBlob(
            btoa(unescape(encodeURIComponent(response.data))),
            "text/html",
          ),
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
  return async (input, values) => {
    const results = [];

    // Get localized strings (fallback to English if not available)
    const t = {
      printPage:
        (i18nMixin && i18nMixin.t && i18nMixin.t.printPage) || "Print page",
      printSite:
        (i18nMixin && i18nMixin.t && i18nMixin.t.printSite) || "Print site",
      printBranch: "Print this page and its children",
      printCurrent: "Print current page only",
      downloadPdf: "Download PDF",
      printView: "Open print-friendly view",
      jsonView: "View page data (JSON)",
      printingPleaseWait: "Printing, please wait...",
    };

    // Option 1: Print current page and children (branch)
    results.push({
      title: t.printBranch,
      icon: "icons:print",
      tags: ["print", "page", "branch", "children"],
      value: {
        target: PrintHelper,
        method: "printBranch",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/action/print/branch",
      more: "Print the current page and all child pages as HTML",
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
      more: "Print every page in the site as HTML",
    });

    // Option 3: Print current page only (browser print)
    results.push({
      title: t.printCurrent,
      icon: "icons:print",
      tags: ["print", "page", "current", "browser"],
      value: {
        target: PrintHelper,
        method: "printCurrentPage",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/action/print/current",
      more: "Use the browser's print dialog for the current page only",
    });

    // Option 4: Download as PDF (uses same service as branch print)
    if (MicroFrontendRegistry.has("@haxcms/siteToHtml")) {
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
        more: "Export the current page and child pages as PDF (when available)",
      });
    }

    // Option 5: Print-friendly view
    results.push({
      title: t.printView,
      icon: "icons:launch",
      tags: ["print", "view", "friendly", "clean"],
      value: {
        target: PrintHelper,
        method: "openPrintView",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/action/print/view",
      more: "Open a clean, print-optimized view in a new window",
    });

    // Option 6: JSON data view
    results.push({
      title: t.jsonView,
      icon: "code",
      tags: ["json", "data", "view", "code", "debug"],
      value: {
        target: PrintHelper,
        method: "openJSONView",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/action/view/json",
      more: "View the current page data as JSON in a code view",
    });

    return results;
  };
};
