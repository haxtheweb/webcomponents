define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_46630f90dbb911e8a81971e25d0fb2c8() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <paper-icon-button raised="" icon="[[icon]]" on-tap="_onTap" id$="[[id]]" aria-label$="[[title]]">[[title]]</paper-icon-button>\n    <paper-tooltip for$="[[id]]" animation-delay="200">[[title]]</paper-tooltip>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <paper-icon-button raised="" icon="[[icon]]" on-tap="_onTap" id\\$="[[id]]" aria-label\\$="[[title]]">[[title]]</paper-icon-button>\n    <paper-tooltip for\\$="[[id]]" animation-delay="200">[[title]]</paper-tooltip>\n'
      ]
    );
    _templateObject_46630f90dbb911e8a81971e25d0fb2c8 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_46630f90dbb911e8a81971e25d0fb2c8()
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
