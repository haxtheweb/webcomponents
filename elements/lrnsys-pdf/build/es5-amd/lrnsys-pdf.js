define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/pdf-browser-viewer/pdf-browser-viewer.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_a4c8fad0db3311e8a2ea5de24ec63979() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <h2>[[title]]</h2>\n    <pdf-browser-viewer id="pdfViewer" file="[[file]]#page=[[page]]" width="100%" card="[[card]]" elevation="2" download-label="[[downloadLabel]]"></pdf-browser-viewer>\n'
    ]);
    _templateObject_a4c8fad0db3311e8a2ea5de24ec63979 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_a4c8fad0db3311e8a2ea5de24ec63979()
    ),
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
    attached: function attached() {
      this.setHaxProperties({
        canScale: !0,
        canPosition: !0,
        canEditSource: !1,
        gizmo: {
          title: "PDF viewer",
          descrption:
            "Nicely present PDFs in a cross browser compatible manner.",
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
    _computeDownloadLabel: function _computeDownloadLabel(download) {
      if (download) {
        return "Download";
      } else {
        return null;
      }
    }
  });
});
