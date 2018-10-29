define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/utils/async.js",
  "./data-table-templatizer-behavior.js"
], function(_polymerLegacy, async) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  function _templateObject_d3b13360db1211e8bf630bf889a443ae() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        flex: 1 0 100px;\n        padding: 0 24px 0 24px;\n        min-height: 10px; /* Prevent iron-list from looping when item height is really small */\n        height: 48px;\n        display: flex;\n        align-items: center;\n        overflow: hidden;\n        transition: flex-basis 200ms, flex-grow 200ms;\n      }\n\n      :host([header]) {\n        height: 56px;\n      }\n\n      :host([hidden]) {\n        display: none;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_d3b13360db1211e8bf630bf889a443ae = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d3b13360db1211e8bf630bf889a443ae()
    ),
    is: "data-table-cell",
    behaviors: [saulis.DataTableTemplatizerBehavior],
    properties: {
      alignRight: Boolean,
      column: Object,
      flex: Number,
      header: Boolean,
      hidden: Boolean,
      order: Number,
      template: Object,
      width: String,
      beforeBind: {
        type: Object,
        value: function value() {
          return function() {};
        }
      }
    },
    observers: [
      "_beforeBind(beforeBind, column.*, index, item.*, expanded, selected)",
      "_beforeBindHeader(beforeBind, column.*)",
      "_alignRightChanged(alignRight)",
      "_columnChanged(_instance, column)",
      "_columnPathChanged(_instance, column.*)",
      "_flexChanged(flex)",
      "_hiddenChanged(hidden)",
      "_orderChanged(order)",
      "_widthChanged(width)"
    ],
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
    _alignRightChanged: function _alignRightChanged(alignRight) {
      this.style.flexDirection = alignRight ? "row-reverse" : "row";
    },
    _beforeBind: function _beforeBind(
      beforeBind,
      column,
      index,
      item,
      expanded,
      selected
    ) {
      var data = {
        column: column.base,
        index: index,
        item: item.base,
        expanded: expanded,
        selected: selected
      };
      beforeBind(data, this);
    },
    _beforeBindHeader: function _beforeBindHeader(beforeBind, column) {
      if (this.header) {
        var data = { column: column.base };
        beforeBind(data, this);
      }
    },
    _hiddenChanged: function _hiddenChanged(hidden) {
      this.toggleAttribute("hidden", hidden);
    },
    _orderChanged: function _orderChanged(order) {
      this.style.order = order;
    },
    _flexChanged: function _flexChanged(flex) {
      this.style.flexGrow = flex;
    },
    _widthChanged: function _widthChanged(width) {
      this.style.flexBasis = width;
    },
    _columnChanged: function _columnChanged(instance, column) {
      instance.column = column;
    },
    _columnPathChanged: function _columnPathChanged(instance, column) {
      var _this = this;
      async.microTask.run(function() {
        _this._parentProps = _this._parentProps || {};
        instance.notifyPath(column.path, column.value);
      });
    }
  });
});
