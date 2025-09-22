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
        globalThis.open(
          globalThis.URL.createObjectURL(
            b64toBlob(
              btoa(unescape(encodeURIComponent(response.data))),
              "text/html",
            ),
          ),
          "",
          "left=0,top=0,width=800,height=800,toolbar=0,scrollbars=0,status=0,noopener=1,noreferrer=1",
        );
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
        globalThis.open(
          globalThis.URL.createObjectURL(
            b64toBlob(
              btoa(unescape(encodeURIComponent(response.data))),
              "text/html",
            ),
          ),
          "",
          "left=0,top=0,width=800,height=800,toolbar=0,scrollbars=0,status=0,noopener=1,noreferrer=1",
        );
      } else {
        this.printFallback();
      }
    } catch (error) {
      console.error("Print error:", error);
      this.printFallback();
    }
  }

  static printFallback() {
    globalThis.open(
      globalThis.location.href + "?format=print-page",
      "",
      "left=0,top=0,width=800,height=800,toolbar=0,scrollbars=0,status=0,noopener=1,noreferrer=1",
    );
  }

  static printCurrentPage() {
    globalThis.print();
  }

  static openPrintView() {
    globalThis.open(globalThis.location.href + "?format=print-page", "_blank");
  }

  static openJSONView() {
    globalThis.open(globalThis.location.href + "?format=json", "_blank");
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
      printBranch: "Print this page and children",
      printCurrent: "Print current page only",
      downloadPdf: "Download PDF",
      printView: "Open print-friendly view",
      jsonView: "View page data (JSON)",
      printingPleaseWait: "Printing, please wait..",
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
      more: "Print the current page and all its child pages as HTML",
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
      more: "Print all pages in the site as HTML",
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
      more: "Use browser's print dialog for current page only",
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
        more: "Export current page and children as PDF (when service is available)",
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
      more: "Open a clean, print-optimized view in new window",
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
      more: "View the current page's activeItem data as JSON in a code sample",
    });

    return results;
  };
};
