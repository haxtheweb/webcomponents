define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "./lrndesign-mapmenu-item.js",
  "./lrndesign-mapmenu-header.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _flattenedNodesObserver,
  _paperButton,
  _lrndesignMapmenuItem,
  _lrndesignMapmenuHeader
) {
  "use strict";
  function _templateObject_cb6e2a80f32e11e8980987e1e9d0e51a() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      :host([collapsable]) > lrndesign-mapmenu-header {\n        cursor: pointer;\n        display: block;\n      }\n      #container {\n        padding: 16px;\n      }\n      #container ::slotted(lrndesign-mapmenu-item) {\n        margin-top: 6.4px;\n      }\n    </style>\n    <lrndesign-mapmenu-header on-tap="_headerClickHandler" avatar-label="[[avatarLabel]]" title="[[title]]" label="[[label]]" opened="[[opened]]"></lrndesign-mapmenu-header>\n    <iron-collapse id="container">\n      <slot id="slot"></slot>\n    </iron-collapse>\n'
    ]);
    _templateObject_cb6e2a80f32e11e8980987e1e9d0e51a = function _templateObject_cb6e2a80f32e11e8980987e1e9d0e51a() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_cb6e2a80f32e11e8980987e1e9d0e51a()
    ),
    is: "lrndesign-mapmenu-submenu",
    properties: {
      title: { type: String },
      avatarLabel: { type: String },
      label: { type: String },
      opened: { type: Boolean, value: !1 },
      collapsable: { type: Boolean, value: !0 },
      expandChildren: { type: Boolean, value: !1 }
    },
    observers: ["_openChanged(opened)"],
    _openChanged: function _openChanged(opened) {
      var target = this.$.container;
      if (opened) target.show();
      if (!opened) target.hide();
    },
    _headerClickHandler: function _headerClickHandler(e) {
      if (this.collapsable) {
        this.opened = !this.opened;
      }
    },
    ready: function ready() {
      var _this = this;
      this._observer = new _flattenedNodesObserver.FlattenedNodesObserver(
        this.$.slot,
        function(info) {
          var submenus = info.addedNodes.filter(function(item) {
            return "LRNDESIGN-MAPMENU-SUBMENU" === item.nodeName;
          });
          if (_this.expandChildren) {
            var _iteratorNormalCompletion = !0,
              _didIteratorError = !1,
              _iteratorError = void 0;
            try {
              for (
                var _iterator = submenus[Symbol.iterator](), _step, menu;
                !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
                _iteratorNormalCompletion = !0
              ) {
                menu = _step.value;
                menu.setAttribute("opened", !0);
              }
            } catch (err) {
              _didIteratorError = !0;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && null != _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }
        }
      );
    }
  });
});
