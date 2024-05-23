import { html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { b64toBlob } from "@haxtheweb/utils/utils.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
import { toJS } from "mobx";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

export const PDFPageMixin = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    constructor() {
      super();
      enableServices(["core"]);
      this.t.downloadPdf = "Download PDF";
      this.t.downloadingPdfPleaseWait = "Downloading PDF, please wait";
      this.__pdfLoading = false;
      this.dispatchEvent(
        new CustomEvent("super-daemon-define-option", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            title: this.t.downloadPdf,
            icon: "lrn:pdf",
            tags: ["CMS", "pdf", "print", "page"],
            value: {
              target: this,
              method: "downloadPDFviaMicro",
            },
            context: "CMS",
            eventName: "super-daemon-element-method",
            path: "CMS/page/pdf",
          },
        }),
      );
    }

    PDFPageButton(position = "auto") {
      return html`
        ${MicroFrontendRegistry.has("@core/htmlToPdf")
          ? html` <div
              class="pdf-page-btn"
              part="${this.editMode ? `edit-mode-active` : ``}"
            >
              <simple-icon-button-lite
                part="pdf-page-btn"
                class="btn"
                icon="${this.__pdfLoading ? `hax:loading` : `lrn:pdf`}"
                id="pdf-page-btn"
                label="${this.__pdfLoading
                  ? this.t.downloadingPdfPleaseWait
                  : this.t.downloadPdf}"
                @click="${this.downloadPDFviaMicro}"
                icon-position="top"
              >
              </simple-icon-button-lite>
              <simple-tooltip for="pdf-page-btn" position="${position}">
                ${this.__pdfLoading
                  ? this.t.downloadingPdfPleaseWait
                  : this.t.downloadPdf}
              </simple-tooltip>
            </div>`
          : ``}
      `;
    }
    static get properties() {
      return {
        ...super.properties,
        __pdfLoading: { type: Boolean },
      };
    }
    /**
     * Download PDF, via microservice
     */
    async downloadPDFviaMicro(e) {
      this.__pdfLoading = true;
      let htmlContent = toJS(store.activeItemContent);
      // base helps w/ calculating URLs in content
      var base = "";
      if (globalThis.document.querySelector("base")) {
        base = globalThis.document.querySelector("base").href;
      }
      const response = await MicroFrontendRegistry.call("@core/htmlToPdf", {
        base: base,
        html: htmlContent,
      });
      if (response.status == 200 && response.data) {
        const link = globalThis.document.createElement("a");
        // click link to download file
        // @todo this downloads but claims to be corrupt.
        link.href = globalThis.URL.createObjectURL(
          b64toBlob(response.data, "application/pdf"),
        );
        link.download = `${toJS(store.activeTitle)}.pdf`;
        link.target = "_blank";
        this.appendChild(link);
        link.click();
        this.removeChild(link);
      }
      this.__pdfLoading = false;
    }
  };
};
