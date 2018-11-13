define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "./editable-table-iconset.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_b4a88350e70711e881fc13e66a8b53cb() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host paper-button {\n        padding: 0;\n        margin: 0;\n        width: 100%;\n        min-width: unset;\n        display: inline-flex;\n        justify-content: space-between;\n        align-items:center;\n        align-content: stretch;\n        text-transform: unset;\n      }\n      :host paper-button > div {\n        flex-grow: 1;\n      }\n      :host .sr-only {\n        position: absolute;\n        left: -9999px;\n        font-size: 0;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n      :host #filter-off {\n        opacity: 0.25;\n      }\n      :host(:not([filtered])) .filtered,\n      :host(:not([filtered]):not(:focus):not(:hover)) #filter,\n      :host(:not([filtered]):focus) #filter-off, \n      :host(:not([filtered]):hover) #filter-off,\n      :host([filtered]:not(:focus):not(:hover)) #filter-off,\n      :host([filtered]:focus) #filter, \n      :host([filtered]:hover) #filter {\n        display: none;\n      }\n    </style>\n    <paper-button id="button" class="container">\n      <span>[[text]]</span>\n      <span class="sr-only" hidden$="[[!filtered]]"> (filtered)</span>\n      <span class="sr-only"> Toggle filter.</span>\n      <iron-icon id="filter" icon="editable-table:filter"></iron-icon>\n      <iron-icon id="filter-off" icon="editable-table:filter-off"></iron-icon>\n    </paper-button>\n    <paper-tooltip for="button">Toggle filter for "[[text]]"</paper-tooltip>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host paper-button {\n        padding: 0;\n        margin: 0;\n        width: 100%;\n        min-width: unset;\n        display: inline-flex;\n        justify-content: space-between;\n        align-items:center;\n        align-content: stretch;\n        text-transform: unset;\n      }\n      :host paper-button > div {\n        flex-grow: 1;\n      }\n      :host .sr-only {\n        position: absolute;\n        left: -9999px;\n        font-size: 0;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n      :host #filter-off {\n        opacity: 0.25;\n      }\n      :host(:not([filtered])) .filtered,\n      :host(:not([filtered]):not(:focus):not(:hover)) #filter,\n      :host(:not([filtered]):focus) #filter-off, \n      :host(:not([filtered]):hover) #filter-off,\n      :host([filtered]:not(:focus):not(:hover)) #filter-off,\n      :host([filtered]:focus) #filter, \n      :host([filtered]:hover) #filter {\n        display: none;\n      }\n    </style>\n    <paper-button id="button" class="container">\n      <span>[[text]]</span>\n      <span class="sr-only" hidden\\$="[[!filtered]]"> (filtered)</span>\n      <span class="sr-only"> Toggle filter.</span>\n      <iron-icon id="filter" icon="editable-table:filter"></iron-icon>\n      <iron-icon id="filter-off" icon="editable-table:filter-off"></iron-icon>\n    </paper-button>\n    <paper-tooltip for="button">Toggle filter for "[[text]]"</paper-tooltip>\n'
      ]
    );
    _templateObject_b4a88350e70711e881fc13e66a8b53cb = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b4a88350e70711e881fc13e66a8b53cb()
    ),
    is: "editable-table-filter",
    listeners: { tap: "_onFilterTapped" },
    properties: {
      columnNumber: { type: Number, value: null },
      filtered: { type: Boolean, value: !1, reflectToAttribute: !0 },
      text: { type: String, value: "" }
    },
    _getPressed: function _getPressed(filtered) {
      return filtered ? "true" : "false";
    },
    _onFilterTapped: function _onFilterTapped() {
      var root = this;
      root.fire("toggle-filter", root);
    }
  });
});
