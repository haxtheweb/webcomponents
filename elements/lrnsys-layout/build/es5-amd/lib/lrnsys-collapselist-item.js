define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/iron-collapse/iron-collapse.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_09899be0deaa11e893615911f276e990() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        color: var(--lrnsys-collapselist-text-color, #000);\n      }\n      paper-button {\n        height: 3em;\n        padding: 0;\n        margin: 0;\n        min-width: .1em;\n        -webkit-justify-content: flex-start;\n        justify-content: flex-start;\n        align-items: center;\n        width: 100%;\n        text-transform: unset;\n        border-radius: 0;\n        background-color: var(--lrnsys-collapselist-item-color, #fff);\n      }\n      paper-button span {\n        pointer-events: none;\n      }\n      .collapse-label {\n        padding: .75em .5em .25em .5em;\n        width: 100%;\n        height: 2em;\n      }\n      :host([opened]) #collapse {\n        border-top: 1px solid var(--lrnsys-collapselist-item-border, #bbb);\n        background-color: var(--lrnsys-collapselist-item-active-color, #eee);\n      }\n      :host([opened]) .collapse-label {\n        font-weight: bold;\n        background-color: var(--lrnsys-collapselist-item-active-color, #eee);\n      }\n      .collapse-content {\n        padding: 1em;\n      }\n    </style>\n    <paper-button on-tap="collapseToggle" id="collapse-trigger" aria-controls="collapse">\n      <span class="collapse-label">\n        <slot name="label"></slot>\n      </span>\n    </paper-button>\n    <iron-collapse id="collapse" opened="{{opened}}">\n      <div class="collapse-content">\n        <slot name="content"></slot>\n      </div>\n    </iron-collapse>\n'
    ]);
    _templateObject_09899be0deaa11e893615911f276e990 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_09899be0deaa11e893615911f276e990()
    ),
    is: "lrnsys-collapselist-item",
    properties: {
      opened: { type: Boolean, value: !1, reflectToAttribute: !0, notify: !0 }
    },
    collapseToggle: function collapseToggle() {
      this.$.collapse.toggle();
    }
  });
});
