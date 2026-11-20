/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";
import { toJS } from "mobx";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { fetchPdfOrPrint } from "./pdf-print-fallback.js";

export const PDFPageMixin = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    constructor() {
      super();
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
        <div
          class="pdf-page-btn"
          part="${this.editMode ? `edit-mode-active` : ``}"
        >
          <simple-icon-button-lite
            part="pdf-page-btn"
            class="btn"
            icon="${this.__pdfLoading ? `hax:loading` : `lrn:pdf`}"
            id="pdf-page-btn"
            label="${
              this.__pdfLoading
                ? this.t.downloadingPdfPleaseWait
                : this.t.downloadPdf
            }"
            @click="${this.downloadPDFviaMicro}"
            icon-position="top"
          >
          </simple-icon-button-lite>
          <simple-tooltip for="pdf-page-btn" position="${position}">
            ${
              this.__pdfLoading
                ? this.t.downloadingPdfPleaseWait
                : this.t.downloadPdf
            }
          </simple-tooltip>
        </div>
      `;
    }
    static get properties() {
      return {
        ...super.properties,
        __pdfLoading: { type: Boolean },
      };
    }
    /**
     * Download PDF via v1 item export endpoint
     */
    async downloadPDFviaMicro(_e) {
      this.__pdfLoading = true;
      try {
        const activeItem = toJS(store.activeItem);
        const itemId =
          activeItem && activeItem.id ? `${activeItem.id}`.trim() : "";
        if (!itemId) {
          throw new Error("No active page for PDF export");
        }
        const baseElement = globalThis.document.querySelector("base");
        const baseUrl =
          (baseElement && baseElement.href) || `${globalThis.location.origin}/`;
        const url = new URL(
          `x/api/v1/items/${encodeURIComponent(itemId)}/export/pdf`,
          baseUrl,
        ).toString();
        // the server's PDF, or the browser's print dialog where it can't
        // make one
        const title = toJS(store.activeTitle);
        const result = await fetchPdfOrPrint(url, title);
        if (result.blob) {
          const link = globalThis.document.createElement("a");
          const objectUrl = globalThis.URL.createObjectURL(result.blob);
          link.href = objectUrl;
          link.download = `${title}.pdf`;
          link.target = "_blank";
          this.appendChild(link);
          link.click();
          this.removeChild(link);
          globalThis.URL.revokeObjectURL(objectUrl);
        }
      } catch (error) {
        console.error("PDF export error:", error);
      }
      this.__pdfLoading = false;
    }
  };
};
