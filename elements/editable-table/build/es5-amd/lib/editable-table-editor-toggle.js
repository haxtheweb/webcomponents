define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js",
  "../node_modules/@polymer/paper-item/paper-item.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_94cfbb10ecf311e89cb22b61cebc916e() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      :host .setting {\n        font-size: 95%;\n        padding: var(--editable-table-toggle-padding, 8px 0px);\n        justify-content: space-between;\n        width: 100%;\n      }\n      :host([disabled]) .setting-text {\n        opacity: 0.5;\n      }\n    </style>\n    <div class="setting">\n      <div class="setting-control">\n        <paper-toggle-button id="button" checked$="[[value]]" disabled$="[[disabled]]">[[label]]</paper-toggle-button>\n        <paper-tooltip id="tooltip" for="button">[[tooltip]]</paper-tooltip>\n      </div>\n    </div>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n      }\n      :host .setting {\n        font-size: 95%;\n        padding: var(--editable-table-toggle-padding, 8px 0px);\n        justify-content: space-between;\n        width: 100%;\n      }\n      :host([disabled]) .setting-text {\n        opacity: 0.5;\n      }\n    </style>\n    <div class="setting">\n      <div class="setting-control">\n        <paper-toggle-button id="button" checked\\$="[[value]]" disabled\\$="[[disabled]]">[[label]]</paper-toggle-button>\n        <paper-tooltip id="tooltip" for="button">[[tooltip]]</paper-tooltip>\n      </div>\n    </div>\n'
      ]
    );
    _templateObject_94cfbb10ecf311e89cb22b61cebc916e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_94cfbb10ecf311e89cb22b61cebc916e()
    ),
    is: "editable-table-editor-toggle",
    listeners: { change: "_onChange" },
    properties: {
      disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
      label: { type: String, value: null },
      prop: { type: String, value: null },
      tooltip: { type: String, value: null },
      value: { type: Boolean, value: !1 }
    },
    _onChange: function _onChange(e) {
      var root = this;
      if (e.srcElement === this.$.button)
        root.fire("editable-table-setting-changed", {
          prop: this.prop,
          value: e.srcElement.checked
        });
    }
  });
});
