define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_e30eaff0e11a11e88d1e65f1bbe16712() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host {\n        display: inline-block;\n        --lrndesign-gallery-rgba: var(--lrndesign-gallery-rgba-none) 0%, var(--lrndesign-gallery-rgba-mid) 50%, var(--lrndesign-gallery-rgba-high) 70%, var(--lrndesign-gallery-rgba-high) 100%\n      }\n      :host([item="-1"]) {\n        display: none;\n      }\n      :host #lrnsysbutton {\n        height: 100%;\n      }\n      :host #lrnsysbutton ::slotted(a) {\n        width: 100%;\n        height: 100%;\n        top: 0;\n        position: absolute;\n      }\n      :host #lrnsysbutton ::slotted(a > paper-button) {\n        width: 100%;\n        height: 100%;  \n        opacity: 0;\n        transition: opacity 1s;   \n        color: var(--lrndesign-gallery-color);\n        background-color: var(--lrndesign-gallery-background-color);\n        background: linear-gradient(to left, var(--lrndesign-gallery-rgba)); \n      }\n      :host([type="next"]) #lrnsysbutton ::slotted(a > paper-button) {\n        background: linear-gradient(to right, var(--lrndesign-gallery-rgba));\n      }\n      :host #lrnsysbutton ::slotted(a > paper-button):focus, \n      :host #lrnsysbutton ::slotted(a > paper-button):hover {\n        opacity: 1;\n      }\n      :host #lrnsysbutton ::slotted(a > paper-button > div.inner) {\n        width: 100%;\n        height: 100%;\n        padding: 0;\n      }\n      :host #lrnsysbutton ::slotted(a > paper-button > div.inner > iron-icon) {\n        top: 45%;\n        position: absolute;\n      }\n      :host([type="previous"]) #lrnsysbutton ::slotted(a > paper-button > div.inner > iron-icon) {\n        left: 10%;\n      }\n      :host([type="next"]) #lrnsysbutton ::slotted(a > paper-button > div.inner > iron-icon) {\n        right: 10%;\n      }\n    </style>\n    <lrnsys-button icon$="[[chevron]]" id="lrnsysbutton" item$="[[item]]" aria-controls$="[[controls]]" target$="[[target]]" title$="[[type]]" tabindex="-1">\n    </lrnsys-button>\n    <iron-a11y-keys id="a11y" keys="enter" target$="[[__button]]" on-keys-pressed="_tapped">\n    </iron-a11y-keys>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host {\n        display: inline-block;\n        --lrndesign-gallery-rgba: var(--lrndesign-gallery-rgba-none) 0%, var(--lrndesign-gallery-rgba-mid) 50%, var(--lrndesign-gallery-rgba-high) 70%, var(--lrndesign-gallery-rgba-high) 100%\n      }\n      :host([item="-1"]) {\n        display: none;\n      }\n      :host #lrnsysbutton {\n        height: 100%;\n      }\n      :host #lrnsysbutton ::slotted(a) {\n        width: 100%;\n        height: 100%;\n        top: 0;\n        position: absolute;\n      }\n      :host #lrnsysbutton ::slotted(a > paper-button) {\n        width: 100%;\n        height: 100%;  \n        opacity: 0;\n        transition: opacity 1s;   \n        color: var(--lrndesign-gallery-color);\n        background-color: var(--lrndesign-gallery-background-color);\n        background: linear-gradient(to left, var(--lrndesign-gallery-rgba)); \n      }\n      :host([type="next"]) #lrnsysbutton ::slotted(a > paper-button) {\n        background: linear-gradient(to right, var(--lrndesign-gallery-rgba));\n      }\n      :host #lrnsysbutton ::slotted(a > paper-button):focus, \n      :host #lrnsysbutton ::slotted(a > paper-button):hover {\n        opacity: 1;\n      }\n      :host #lrnsysbutton ::slotted(a > paper-button > div.inner) {\n        width: 100%;\n        height: 100%;\n        padding: 0;\n      }\n      :host #lrnsysbutton ::slotted(a > paper-button > div.inner > iron-icon) {\n        top: 45%;\n        position: absolute;\n      }\n      :host([type="previous"]) #lrnsysbutton ::slotted(a > paper-button > div.inner > iron-icon) {\n        left: 10%;\n      }\n      :host([type="next"]) #lrnsysbutton ::slotted(a > paper-button > div.inner > iron-icon) {\n        right: 10%;\n      }\n    </style>\n    <lrnsys-button icon\\$="[[chevron]]" id="lrnsysbutton" item\\$="[[item]]" aria-controls\\$="[[controls]]" target\\$="[[target]]" title\\$="[[type]]" tabindex="-1">\n    </lrnsys-button>\n    <iron-a11y-keys id="a11y" keys="enter" target\\$="[[__button]]" on-keys-pressed="_tapped">\n    </iron-a11y-keys>\n'
      ]
    );
    _templateObject_e30eaff0e11a11e88d1e65f1bbe16712 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_e30eaff0e11a11e88d1e65f1bbe16712()
    ),
    is: "lrndesign-gallery-carousel-prevnext",
    hostAttributes: { tabindex: "-1" },
    listeners: { tap: "_tapped" },
    properties: {
      chevron: { type: String, computed: "_getIcon(type)" },
      theme: { type: String, value: null },
      controls: { type: String, value: null },
      item: { type: Number, value: null, reflectToAttribute: !0 },
      target: { type: Object, value: null },
      type: { type: String, value: null }
    },
    attached: function attached() {
      this;
    },
    ready: function ready() {
      this.__button = this.$.lrnsysbutton;
    },
    _getIcon: function _getIcon(type) {
      return "next" == type ? "chevron-right" : "chevron-left";
    },
    _tapped: function _tapped(e) {
      e.preventDefault();
      this.fire("navTap", { item: parseInt(this.item), type: "prevnext" });
    }
  });
});
