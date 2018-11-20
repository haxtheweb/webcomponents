import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/pdf-browser-viewer/pdf-browser-viewer.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <h2>[[title]]</h2>
    <pdf-browser-viewer id="pdfViewer" file="[[file]]#page=[[page]]" width="100%" card="[[card]]" elevation="2" download-label="[[downloadLabel]]"></pdf-browser-viewer>
`,
  is: "lrnsys-pdf",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  properties: {
    title: { type: String, value: "lrnsys-pdf" },
    card: { type: Boolean, value: !1 },
    downloadLabel: {
      type: String,
      computed: "_computeDownloadLabel(download)"
    },
    page: { type: String },
    file: { type: String }
  },
  _computeDownloadLabel: function(download) {
    if (download) {
      return "Download";
    } else {
      return null;
    }
  }
});
