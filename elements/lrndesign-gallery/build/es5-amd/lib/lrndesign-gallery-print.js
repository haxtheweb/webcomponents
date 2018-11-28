define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_c674d1f0f32e11e8affa37f616c5566e() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: none;\n      }\n      @media print {\n        :host {\n          margin-top: 15px;\n          margin-bottom: 15px;\n          display: block;\n        }\n        :host iron-image {\n          display: block;\n          margin-top: 15px;\n          width: 100%;\n          height: 400px;\n        }\n        :host .print-image {\n          max-width: 400px;\n          max-height: 400px;\n          display:block;\n          border: 1px solid #ddd;\n          page-break-inside: avoid;\n        }\n      }\n    </style>\n    <section class="print">\n      <template is="dom-if" if="[[hasTitle]]">\n        <h2>[[title]]</h2>\n      </template>\n      <div><span id="details"></span></div>\n      <img class="print-image" alt$="[[alt]]" src$="[[src]]">\n    </section>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: none;\n      }\n      @media print {\n        :host {\n          margin-top: 15px;\n          margin-bottom: 15px;\n          display: block;\n        }\n        :host iron-image {\n          display: block;\n          margin-top: 15px;\n          width: 100%;\n          height: 400px;\n        }\n        :host .print-image {\n          max-width: 400px;\n          max-height: 400px;\n          display:block;\n          border: 1px solid #ddd;\n          page-break-inside: avoid;\n        }\n      }\n    </style>\n    <section class="print">\n      <template is="dom-if" if="[[hasTitle]]">\n        <h2>[[title]]</h2>\n      </template>\n      <div><span id="details"></span></div>\n      <img class="print-image" alt\\$="[[alt]]" src\\$="[[src]]">\n    </section>\n'
      ]
    );
    _templateObject_c674d1f0f32e11e8affa37f616c5566e = function _templateObject_c674d1f0f32e11e8affa37f616c5566e() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_c674d1f0f32e11e8affa37f616c5566e()
    ),
    is: "lrndesign-gallery-print",
    properties: {
      alt: { type: String, value: "default" },
      details: { type: String, value: null },
      hasTitle: { type: Boolean, computed: "_isAttrSet(title)" },
      src: { type: String, value: null },
      title: { type: String, value: null }
    },
    attached: function attached() {
      this.$.details.innerHTML = this.details;
    },
    _isAttrSet: function _isAttrSet(attr) {
      return null !== attr;
    }
  });
});
