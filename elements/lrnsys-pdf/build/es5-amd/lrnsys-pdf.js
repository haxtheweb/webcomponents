define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/pdf-browser-viewer/pdf-browser-viewer.js",
  "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"
], function(_exports, _polymerLegacy, _pdfBrowserViewer, _schemaBehaviors) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnsysPdf = void 0;
  function _templateObject_82930070f32d11e89e36296fb0dcb563() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <h2>[[title]]</h2>\n    <pdf-browser-viewer id="pdfViewer" file="[[file]]#page=[[page]]" width="100%" card="[[card]]" elevation="2" download-label="[[downloadLabel]]"></pdf-browser-viewer>\n'
    ]);
    _templateObject_82930070f32d11e89e36296fb0dcb563 = function _templateObject_82930070f32d11e89e36296fb0dcb563() {
      return data;
    };
    return data;
  }
  var LrnsysPdf = (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_82930070f32d11e89e36296fb0dcb563()
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
      file: { type: String }
    },
    _computeDownloadLabel: function _computeDownloadLabel(download) {
      if (download) {
        return "Download";
      } else {
        return null;
      }
    }
  });
  _exports.LrnsysPdf = LrnsysPdf;
});
