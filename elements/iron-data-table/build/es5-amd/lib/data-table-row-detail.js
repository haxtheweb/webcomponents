define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./data-table-templatizer-behavior.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_b71743a0dea711e88b02e5df4cc43173() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        padding: 0 24px 0 24px;\n        display: flex;\n        align-items: center;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_b71743a0dea711e88b02e5df4cc43173 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b71743a0dea711e88b02e5df4cc43173()
    ),
    is: "data-table-row-detail",
    behaviors: [saulis.DataTableTemplatizerBehavior],
    properties: { beforeBind: Object },
    observers: ["_beforeBind(beforeBind, item.*, index, selected, expanded)"],
    attached: function attached() {
      if (!(void 0).useNativeShadow) {
        window.StyleTransformer.dom(
          this,
          "iron-data-table",
          this._scopeCssViaAttr,
          !0
        );
        if (this.domHost) {
          window.StyleTransformer.dom(
            this,
            this.domHost.tagName.toLowerCase(),
            this._scopeCssViaAttr,
            !1
          );
        }
      }
    },
    _beforeBind: function _beforeBind(
      beforeBind,
      item,
      index,
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
