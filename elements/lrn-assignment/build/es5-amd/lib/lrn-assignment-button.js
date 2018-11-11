define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_7b124d80e5f711e8a0ad77dd4f7e56cc() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      a {\n        color: inherit;\n        text-decoration: inherit;\n      }\n      paper-button {\n        background: #b0e6f9;\n      }\n      paper-button[complete] {\n        background: #e7ffe7;\n      }\n      iron-icon {\n        margin-left: 8px;\n        opacity: .8;\n      }\n    </style>\n    <a href$="[[url]]">\n      <template is="dom-if" if="[[open]]">\n        <paper-button raised open>[[title]] <iron-icon icon="lrn-icons:input"></iron-icon></paper-button>\n      </template>\n      <template is="dom-if" if="[[complete]]">\n        <paper-button raised complete>[[title]] <iron-icon icon="lrn-icons:done"></iron-icon></paper-button>\n      </template>\n    </a>'
    ]);
    _templateObject_7b124d80e5f711e8a0ad77dd4f7e56cc = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_7b124d80e5f711e8a0ad77dd4f7e56cc()
    ),
    is: "lrn-assignment-button",
    properties: {
      title: String,
      url: String,
      open: { type: Boolean, value: !1 },
      complete: { type: Boolean, value: !1 }
    }
  });
});
