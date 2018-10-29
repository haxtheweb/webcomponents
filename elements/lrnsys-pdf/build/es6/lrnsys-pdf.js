import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/pdf-browser-viewer/pdf-browser-viewer.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
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
    file: { type: String },
    download: { type: Boolean, value: !0 }
  },
  attached: function() {
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "PDF viewer",
        descrption: "Nicely present PDFs in a cross browser compatible manner.",
        icon: "editor:border-all",
        color: "green",
        groups: ["Presentation", "Table", "Data"],
        handles: [{ type: "pdf", url: "file" }],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [
          {
            property: "file",
            title: "File",
            description: "The URL for the pdf.",
            inputMethod: "textfield",
            icon: "link",
            required: !0
          }
        ],
        configure: [
          {
            property: "file",
            title: "File",
            description: "The URL for this pdf.",
            inputMethod: "textfield",
            icon: "link",
            required: !0
          },
          {
            property: "title",
            title: "Title",
            description: "Title to present",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "download",
            title: "Download",
            description: "Can the user see a download link?",
            inputMethod: "boolean",
            icon: "file"
          }
        ],
        advanced: []
      }
    });
  },
  _computeDownloadLabel: function(download) {
    if (download) {
      return "Download";
    } else {
      return null;
    }
  }
});
