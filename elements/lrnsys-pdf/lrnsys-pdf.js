/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
 * `lrnsys-pdf`
 * @element lrnsys-pdf
 * @demo demo/index.html
 */
class LrnsysPdf extends SchemaBehaviors(PolymerElement) {
  constructor() {
    super();
    import("@lrnwebcomponents/pdf-browser-viewer/pdf-browser-viewer.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>[[title]]</h2>
      <pdf-browser-viewer
        id="pdfViewer"
        file="[[file]]#page=[[page]]"
        width="100%"
        card="[[card]]"
        elevation="2"
        download-label="[[downloadLabel]]"
      ></pdf-browser-viewer>
    `;
  }
  static get tag() {
    return "lrnsys-pdf";
  }
  static get properties() {
    return {
      ...super.properties,

      /**
       * Title prior to the PDF
       */
      title: {
        type: String,
        value: "lrnsys-pdf"
      },
      /**
       * Whether or not to present this as a card.
       */
      card: {
        type: Boolean,
        value: false
      },
      /**
       * Download Label.
       */
      downloadLabel: {
        type: String,
        computed: "_computeDownloadLabel(download)"
      },
      /**
       * Active Page
       */
      page: {
        type: String
      },
      /**
       * File to present
       */
      file: {
        type: String
      }
    };
  }
  /**
   * See if we should supply a label.
   */
  _computeDownloadLabel(download) {
    if (download) {
      return "Download";
    } else {
      return null;
    }
  }
}
window.customElements.define(LrnsysPdf.tag, LrnsysPdf);
export { LrnsysPdf };
