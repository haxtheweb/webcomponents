define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_0d681640e70811e8b65bc19d0dd5f1da() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: inline-block;\n      }\n    </style>\n    <paper-icon-button raised="" icon="[[icon]]" on-tap="_onTap" id$="[[id]]" aria-label$="[[title]]">[[title]]</paper-icon-button>\n    <paper-tooltip for$="[[id]]" animation-delay="200">[[title]]</paper-tooltip>\n'
    ]);
    _templateObject_0d681640e70811e8b65bc19d0dd5f1da = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_0d681640e70811e8b65bc19d0dd5f1da()
    ),
    is: "lrnsys-dialog-toolbar-button",
    properties: {
      title: { type: String },
      icon: { type: String },
      id: { type: String }
    },
    ready: function ready() {
      this.fire("button-initialized", { id: this.id });
    },
    _onTap: function _onTap(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        localTarget = normalizedEvent.localTarget,
        id = localTarget.getAttribute("id");
      this.fire("dialog-toolbar-button-tapped", { id: id });
    }
  });
});
