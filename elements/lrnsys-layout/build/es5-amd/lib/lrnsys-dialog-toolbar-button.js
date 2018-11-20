define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/iron-icon/iron-icon.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_fea38ee0ecf311e896b1b122e9a8e20a() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: inline-block;\n      }\n      iron-icon {\n        display: inline-block;\n        height: 16px;\n        width: 16px;\n      }\n    </style>\n    <paper-button raisedon-tap="_onTap" id$="[[id]]" aria-label$="[[title]]">\n      <iron-icon icon="[[icon]]"></iron-icon> [[title]]\n    </paper-button>\n    <paper-tooltip for$="[[id]]" animation-delay="200">[[title]]</paper-tooltip>\n'
    ]);
    _templateObject_fea38ee0ecf311e896b1b122e9a8e20a = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_fea38ee0ecf311e896b1b122e9a8e20a()
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
