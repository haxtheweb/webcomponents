define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "./editable-table-iconset.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_95032720ecf311e89cb22b61cebc916e() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style is="custom-style">\n      :host paper-button {\n        padding: 0;\n        margin: 0;\n        width: 100%;\n        min-width: unset;\n        display: inline-flex;\n        justify-content: space-between;\n        align-items:center;\n        align-content: stretch;\n        text-transform: unset;\n      }\n      :host paper-button > div {\n        flex-grow: 1;\n      }\n      :host .sr-only {\n        position: absolute;\n        left: -9999px;\n        font-size: 0;\n        height: 0;\n        width: 0;\n        overflow: hidden;\n      }\n      :host(:not([sort-mode="asc"])) .asc,\n      :host(:not([sort-mode="desc"])) .desc,\n      :host(:not([sort-mode="none"])) .none,\n      :host #asc,\n      :host #desc,\n      :host([sorting]:not([sort-mode="none"])) #none {\n        display: none;\n      }\n      :host([sorting][sort-mode="asc"]) #asc,\n      :host([sorting][sort-mode="desc"]) #desc {\n        display: flex;\n      }\n    </style>\n    <paper-button id="button" class="container">\n      [[text]]\n      <span class="sr-only asc">(ascending)</span>\n      <span class="sr-only desc">(descending)</span>\n      <span class="sr-only"> Toggle sort mode.</span>\n      <iron-icon id="asc" icon="arrow-drop-up"></iron-icon>\n      <iron-icon id="desc" icon="arrow-drop-down"></iron-icon>\n      <iron-icon id="none" icon="editable-table:sortable"></iron-icon>\n    </paper-button>\n'
    ]);
    _templateObject_95032720ecf311e89cb22b61cebc916e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_95032720ecf311e89cb22b61cebc916e()
    ),
    is: "editable-table-sort",
    listeners: { tap: "_onSortTapped" },
    properties: {
      columnNumber: { type: Number, value: null, reflectToAttribute: !0 },
      sortMode: { type: String, value: "none", reflectToAttribute: !0 },
      sortColumn: { type: Number, value: -1, reflectToAttribute: !0 },
      sorting: {
        type: Boolean,
        computed: "_isSorting(columnNumber,sortColumn)",
        reflectToAttribute: !0
      },
      text: { type: String, value: "" }
    },
    _onSortTapped: function _onSortTapped() {
      var root = this;
      root.fire("change-sort-mode", root);
    },
    setSortMode: function setSortMode(mode) {
      this.sortMode = mode;
      this.__checked = "asc" === mode ? !0 : "desc" === mode ? mode : !1;
    },
    _isSorting: function _isSorting(columnNumber, sortColumn) {
      return columnNumber === sortColumn;
    }
  });
});
