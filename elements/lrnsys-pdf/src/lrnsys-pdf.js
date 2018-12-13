/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/pdf-browser-viewer/pdf-browser-viewer.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
`lrnsys-pdf`
A LRN element

* @demo demo/index.html
*/
let LrnsysPdf = Polymer({
  _template: html`
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
  `,

  is: "lrnsys-pdf",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
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
  },

  /**
   * See if we should supply a label.
   */
  _computeDownloadLabel: function(download) {
    if (download) {
      return "Download";
    } else {
      return null;
    }
  }
});
export { LrnsysPdf };
