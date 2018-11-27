define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_8c67cad0f1e411e8bfa4f9e331d1ff6f() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style is="custom-style">\n      :host {\n        display: flex;\n        flex-direction: column;\n        opacity: 1;\n        cursor: pointer;\n\n        @apply --iron-data-table-row;\n      }\n\n      :host([selected]) .cells {\n        @apply --iron-data-table-row-selected;\n      }\n\n      :host(:not([header])[even]) {\n        @apply --iron-data-table-row-even;\n      }\n\n      :host(:not([header]):not([even])) {\n        @apply --iron-data-table-row-odd;\n      }\n\n      :host(:focus) {\n        outline: none;\n        @apply --iron-data-table-row-focused;\n      }\n\n      :host(:not([header]):hover) {\n        @apply --iron-data-table-row-hover;\n      }\n\n      :host(:focus):after {\n        @apply --iron-data-table-row-focused-after;\n      }\n\n      :host:after {\n        @apply --iron-data-table-row-after;\n      }\n\n      .cells {\n        display: flex;\n        flex-direction: row;\n        width: 100%;\n      }\n    </style>\n    <div class="cells">\n      <slot name="data-table-checkbox"></slot>\n      <slot name="data-table-cell"></slot>\n    </div>\n    <div class="details">\n      <slot name="data-table-row-detail"></slot>\n    </div>\n'
    ]);
    _templateObject_8c67cad0f1e411e8bfa4f9e331d1ff6f = function _templateObject_8c67cad0f1e411e8bfa4f9e331d1ff6f() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_8c67cad0f1e411e8bfa4f9e331d1ff6f()
    ),
    is: "data-table-row",
    properties: {
      beforeBind: Object,
      expanded: { type: Boolean, reflectToAttribute: !0 },
      index: Number,
      item: Object,
      selected: { type: Boolean, reflectToAttribute: !0 },
      _static: { type: Object, value: { id: 0 } }
    },
    observers: ["_beforeBind(beforeBind, index, item.*, selected, expanded)"],
    attached: function attached() {
      if (
        this.domHost &&
        "IRON-DATA-TABLE" === this.domHost.tagName.toUpperCase()
      ) {
        var id = this._static.id++,
          item = this.parentElement;
        if (!item._rowId) {
          this._contentElement = document.createElement("content");
          this._contentElement.setAttribute("select", "#item" + id);
          (0, _polymerDom.dom)(item).appendChild(this._contentElement);
          this.id = "item" + id;
          item._rowId = id;
          (0, _polymerDom.dom)(this.domHost).appendChild(this);
          this._ownerShadyRoot = void 0;
        }
      }
    },
    _beforeBind: function _beforeBind(
      beforeBind,
      index,
      item,
      selected,
      expanded
    ) {
      var data = {
        index: index,
        item: item.base,
        expanded: expanded,
        selected: selected
      };
      beforeBind(data, this);
    }
  });
});
