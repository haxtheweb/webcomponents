define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./lib/lrndesign-animationctrl-button.js"
], function(_polymerLegacy, _lrndesignAnimationctrlButton) {
  "use strict";
  function _templateObject_5239e1d0f1e511e89df7ed7387e1184d() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        background: var(--animationctrl-bg-color);\n        --animationctrl-bg-color: #f5f5f5;\n      }\n      .buttons {\n        padding: 16px;\n        text-align: center;\n        display: flex;\n        justify-content: center;\n        align-items: stretch;\n        @apply --animationctrl-buttons;\n      }\n      :host .buttons ::slotted(*) {\n        display: flex;\n      }\n    </style>\n    <div class="buttons">\n      <slot></slot>\n    </div>\n'
    ]);
    _templateObject_5239e1d0f1e511e89df7ed7387e1184d = function _templateObject_5239e1d0f1e511e89df7ed7387e1184d() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_5239e1d0f1e511e89df7ed7387e1184d()
    ),
    is: "lrndesign-animationctrl",
    properties: {},
    listeners: { "lrndesign-animationctrl-button-click": "_buttonClicked" },
    _buttonClicked: function _buttonClicked(e) {},
    ready: function ready() {}
  });
});
