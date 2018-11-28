define([
  "../node_modules/@polymer/polymer/lib/legacy/templatizer-behavior.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js"
], function(_templatizerBehavior, _polymerDom) {
  "use strict";
  var saulis = window.saulis || {};
  saulis.DataTableTemplatizerBehaviorImpl = {
    properties: {
      expanded: Boolean,
      index: Number,
      item: Object,
      selected: Boolean,
      table: Object,
      template: Object,
      _instances: { type: Array, value: [] },
      _forwardedParentProps: { type: Object, value: {} },
      _instance: { type: Object, computed: "_templatize(template)" }
    },
    observers: [
      "_expandedChanged(_instance, expanded)",
      "_indexChanged(_instance, index)",
      "_itemChanged(_instance, item)",
      "_itemPathChanged(_instance, item.*)",
      "_selectedChanged(_instance, selected)"
    ],
    created: function created() {
      this._instanceProps = {
        column: !0,
        expanded: !0,
        index: !0,
        item: !0,
        selected: !0
      };
    },
    _templatize: function _templatize(template) {
      this.templatize(template);
      if (template._rootDataHost) {
        this._getRootDataHost = function() {
          return template._rootDataHost;
        };
      }
      var instance = this.stamp({});
      for (var key in this._forwardedParentProps) {
        instance[key] = this._forwardedParentProps[key];
      }
      this._instances.push(instance);
      (0, _polymerDom.dom)(this).insertBefore(
        instance.root,
        (0, _polymerDom.dom)(this).firstElementChild
      );
      return instance;
    },
    _expandedChanged: function _expandedChanged(instance, expanded) {
      this._expanded = expanded;
      instance.expanded = expanded;
    },
    _indexChanged: function _indexChanged(instance, index) {
      instance.index = index;
    },
    _itemChanged: function _itemChanged(instance, item) {
      instance.item = item;
    },
    _itemPathChanged: function _itemPathChanged(instance, item) {
      this._parentProps = this._parentProps || {};
      instance.notifyPath(item.path, item.value);
    },
    _selectedChanged: function _selectedChanged(instance, selected) {
      this._selected = selected;
      instance.selected = selected;
    },
    _forwardParentProp: function _forwardParentProp(prop, value) {
      this._forwardedParentProps[prop] = value;
      this._instances.forEach(function(inst) {
        inst[prop] = value;
      });
    },
    _forwardInstanceProp: function _forwardInstanceProp(inst, prop, value) {
      if ("expanded" === prop && inst.item && this._expanded !== value) {
        if (value) {
          this.table.expandItem(inst.item);
        } else {
          this.table.collapseItem(inst.item);
        }
      }
      if ("selected" === prop && inst.item && this._selected !== value) {
        if (value) {
          this.table.selectItem(inst.item);
        } else {
          this.table.deselectItem(inst.item);
        }
      }
    },
    _forwardInstancePath: function _forwardInstancePath(inst, path, value) {
      if (0 === path.indexOf("item")) {
        this.table.debounce(
          "item-changed",
          function() {
            this.table.fire("item-changed", {
              item: inst.item,
              path: path.substring(5),
              value: value
            });
          }.bind(this)
        );
      }
    }
  };
  saulis.DataTableTemplatizerBehavior = [
    _templatizerBehavior.Templatizer,
    saulis.DataTableTemplatizerBehaviorImpl
  ];
});
