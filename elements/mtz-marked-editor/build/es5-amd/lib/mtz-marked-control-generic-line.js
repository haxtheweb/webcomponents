define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "./mtz-marked-control-line-behavior.js"
], function(
  _polymerLegacy,
  _ironA11yKeys,
  _paperIconButton,
  _mtzMarkedControlLineBehavior
) {
  "use strict";
  function _templateObject_b2857b90f1e411e8b0c5216ab96a7cdc() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: inline-block;\n      }\n    </style>\n\n    <paper-icon-button icon="[[icon]]" noink="[[noink]]" on-click="_handleCommand" alt="[[title]]"></paper-icon-button>\n\n    <iron-a11y-keys keys="[[keys]]" on-keys-pressed="_handleCommand" target="[[__editor]]"></iron-a11y-keys>\n'
    ]);
    _templateObject_b2857b90f1e411e8b0c5216ab96a7cdc = function _templateObject_b2857b90f1e411e8b0c5216ab96a7cdc() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b2857b90f1e411e8b0c5216ab96a7cdc()
    ),
    is: "mtz-marked-control-generic-line",
    behaviors: [mtz.MarkedControlLineBehavior],
    properties: { title: String, icon: String, keys: String, noink: Boolean }
  });
});
