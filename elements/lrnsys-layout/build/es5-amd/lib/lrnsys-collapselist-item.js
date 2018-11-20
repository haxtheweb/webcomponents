define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/iron-collapse/iron-collapse.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_fdcc41b0ecf311e896b1b122e9a8e20a() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        color: var(--lrnsys-collapselist-text-color, #000);\n      }\n      paper-button {\n        height: 48px;\n        padding: 0;\n        margin: 0;\n        min-width: .16px;\n        -webkit-justify-content: flex-start;\n        justify-content: flex-start;\n        align-items: center;\n        width: 100%;\n        text-transform: unset;\n        border-radius: 0;\n        background-color: var(--lrnsys-collapselist-item-color, #fff);\n      }\n      paper-button span {\n        pointer-events: none;\n      }\n      .collapse-label {\n        padding: 12px 8px 4px 8px;\n        width: 100%;\n        height: 32px;\n      }\n      :host([opened]) #collapse {\n        border-top: 1px solid var(--lrnsys-collapselist-item-border, #bbb);\n        background-color: var(--lrnsys-collapselist-item-active-color, #eee);\n      }\n      :host([opened]) .collapse-label {\n        font-weight: bold;\n        background-color: var(--lrnsys-collapselist-item-active-color, #eee);\n      }\n      .collapse-content {\n        padding: 16px;\n      }\n    </style>\n    <paper-button on-tap="collapseToggle" id="collapse-trigger" aria-controls="collapse">\n      <span class="collapse-label">\n        <slot name="label"></slot>\n      </span>\n    </paper-button>\n    <iron-collapse id="collapse" opened="{{opened}}">\n      <div class="collapse-content">\n        <slot name="content"></slot>\n      </div>\n    </iron-collapse>\n'
    ]);
    _templateObject_fdcc41b0ecf311e896b1b122e9a8e20a = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_fdcc41b0ecf311e896b1b122e9a8e20a()
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
