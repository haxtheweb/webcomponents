import { html } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import { b64toBlob } from "@lrnwebcomponents/utils/utils.js";
import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import { toJS } from "mobx";
import { enableServices } from "@lrnwebcomponents/micro-frontend-registry/lib/microServices.js";

export const PrintBranchMixin = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    constructor() {
      super();
      enableServices(["haxcms"]);
      this.t = this.t || {};
      this.t = {
        ...this.t,
        print: "Print",
        printPage: "Print page",
        printingPleaseWait: "Printing, please wait..",
      };
      this.__printBranchLoading = false;
      this.dispatchEvent(
        new CustomEvent("super-daemon-define-option", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            title: this.t.printPage,
            icon: "icons:print",
            tags: ["CMS", "print", "page"],
            value: {
              target: this,
              method: "printBranchOfSite",
            },
            context: "CMS",
            eventName: "super-daemon-element-method",
            path: "CMS/page/print",
          },
        })
      );
    }

    static get properties() {
      return {
        ...super.properties,
        __printBranchLoading: { type: Boolean },
      };
    }

    PrintBranchButton(position = "auto") {
      return html`
        ${MicroFrontendRegistry.has("@haxcms/siteToHtml")
          ? html` <div
              class="print-branch-btn"
              part="${this.editMode ? `edit-mode-active` : ``}"
            >
              <simple-icon-button-lite
                part="print-branch-btn"
                class="btn"
                icon="${this.__printBranchLoading
                  ? `hax:loading`
                  : `icons:print`}"
                @click="${this.printBranchOfSite}"
                icon-position="top"
                id="print-branch-btn"
              >
              </simple-icon-button-lite>
              <simple-tooltip for="print-branch-btn" position="${position}">
                ${this.__printBranchLoading
                  ? this.t.printingPleaseWait
                  : this.t.print}
              </simple-tooltip>
            </div>`
          : ``}
      `;
    }
    /**
     * Download PDF, via microservice
     */
    async printBranchOfSite(e) {
      this.__printBranchLoading = true;
      // base helps w/ calculating URLs in content
      var base = "";
      if (document.querySelector("base")) {
        base = document.querySelector("base").href;
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
        magic: window.__appCDN,
        base: base,
      };
      const response = await MicroFrontendRegistry.call(
        "@haxcms/siteToHtml",
        params
      );
      if (response.status == 200 && response.data) {
        const link = document.createElement("a");
        // click link to download file
        // @todo this downloads but claims to be corrupt.
        link.href = window.URL.createObjectURL(
          b64toBlob(
            btoa(unescape(encodeURIComponent(response.data))),
            "text/html"
          )
        );
        /*link.download = `${toJS(store.activeTitle)}.html`;
        link.target = "_blank";
        this.appendChild(link);
        link.click();
        this.removeChild(link);*/
        // fallback in case the service fails
        window.open(
          window.URL.createObjectURL(
            b64toBlob(
              btoa(unescape(encodeURIComponent(response.data))),
              "text/html"
            )
          ),
          "",
          "left=0,top=0,width=800,height=800,toolbar=0,scrollbars=0,status=0,noopener=1,noreferrer=1"
        );
      } else {
        // fallback in case the service fails
        window.open(
          window.location.href + "?format=print-page",
          "",
          "left=0,top=0,width=800,height=800,toolbar=0,scrollbars=0,status=0,noopener=1,noreferrer=1"
        );
      }
      this.__printBranchLoading = false;
    }
  };
};
