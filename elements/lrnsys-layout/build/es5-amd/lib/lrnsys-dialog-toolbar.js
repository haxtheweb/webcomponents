define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "./lrnsys-dialog-toolbar-button.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_0a5cca60deaa11e893615911f276e990() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n     :host {\n        display: block;\n        --app-toolbar-primary-height: 40px;\n        --app-toolbar-secondary-height: 50px;\n        --app-toolbar-secondary-color: var(--lrnsys-dialog-secondary-background-color);\n        --app-toolbar-primary-color: var(--lrnsys-dialog-toolbar-background-color);\n        position: relative;\n        margin: 0;\n        padding: 0;\n      }\n      app-toolbar#primary {\n        color: var(--lrnsys-dialog-color,#000);\n        background-color: var(--app-toolbar-primary-color);\n        z-index: 10;\n        position: relative;\n        height: var(--app-toolbar-primary-height);\n      }\n      app-toolbar#secondary {\n        color: var(--lrnsys-dialog-color,#000);\n        background-color: var(--app-toolbar-secondary-color);\n        z-index: 5;\n        position: absolute;\n        width: 100%;\n        transform: translateY(-100%);\n        transition: all 0.3s ease-in;\n        height: var(--app-toolbar-primary-height);\n        display: flex;\n        justify-content: center;\n        padding: 0;\n      }\n      :host([secondary-visible]) #secondary {\n        transform: translateY(0);\n        height: var(--app-toolbar-secondary-height);\n      }\n      .secondary-buttons {\n        display: flex;\n      }\n      .secondary-buttons ::shadow * {\n        display: inline-flex;\n      }\n    </style>\n    <app-toolbar id="primary">\n      <slot name="primary"></slot>\n      <div main-title=""></div>\n      <lrnsys-dialog-toolbar-button icon="close" id="close" title="close dialog"></lrnsys-dialog-toolbar-button>\n    </app-toolbar>\n    <app-toolbar id="secondary" hidden$="[[!_secondaryHasChildren]]">\n      <div class="secondary-buttons">\n        <slot name="secondary" id="secondary-slot"></slot>\n      </div>\n    </app-toolbar>\n'
      ],
      [
        '\n    <style is="custom-style">\n     :host {\n        display: block;\n        --app-toolbar-primary-height: 40px;\n        --app-toolbar-secondary-height: 50px;\n        --app-toolbar-secondary-color: var(--lrnsys-dialog-secondary-background-color);\n        --app-toolbar-primary-color: var(--lrnsys-dialog-toolbar-background-color);\n        position: relative;\n        margin: 0;\n        padding: 0;\n      }\n      app-toolbar#primary {\n        color: var(--lrnsys-dialog-color,#000);\n        background-color: var(--app-toolbar-primary-color);\n        z-index: 10;\n        position: relative;\n        height: var(--app-toolbar-primary-height);\n      }\n      app-toolbar#secondary {\n        color: var(--lrnsys-dialog-color,#000);\n        background-color: var(--app-toolbar-secondary-color);\n        z-index: 5;\n        position: absolute;\n        width: 100%;\n        transform: translateY(-100%);\n        transition: all 0.3s ease-in;\n        height: var(--app-toolbar-primary-height);\n        display: flex;\n        justify-content: center;\n        padding: 0;\n      }\n      :host([secondary-visible]) #secondary {\n        transform: translateY(0);\n        height: var(--app-toolbar-secondary-height);\n      }\n      .secondary-buttons {\n        display: flex;\n      }\n      .secondary-buttons ::shadow * {\n        display: inline-flex;\n      }\n    </style>\n    <app-toolbar id="primary">\n      <slot name="primary"></slot>\n      <div main-title=""></div>\n      <lrnsys-dialog-toolbar-button icon="close" id="close" title="close dialog"></lrnsys-dialog-toolbar-button>\n    </app-toolbar>\n    <app-toolbar id="secondary" hidden\\$="[[!_secondaryHasChildren]]">\n      <div class="secondary-buttons">\n        <slot name="secondary" id="secondary-slot"></slot>\n      </div>\n    </app-toolbar>\n'
      ]
    );
    _templateObject_0a5cca60deaa11e893615911f276e990 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_0a5cca60deaa11e893615911f276e990()
    ),
    is: "lrnsys-dialog-toolbar",
    listeners: { "dialog-toolbar-button-tapped": "_tapHandler" },
    properties: { _secondaryHasChildren: { type: Boolean, value: !1 } },
    _tapHandler: function _tapHandler(e) {
      this.fire("button-clicked", e.detail);
    },
    ready: function ready() {
      var _this = this;
      this.$.secondary.addEventListener("button-initialized", function() {
        _this._secondaryHasChildren = !0;
      });
    }
  });
});
