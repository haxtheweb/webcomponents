define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../node_modules/@polymer/paper-item/paper-item.js",
  "../node_modules/@polymer/neon-animation/neon-animation.js",
  "./hax-toolbar-menu.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _paperTooltip,
  _paperItem,
  _neonAnimation,
  _haxToolbarMenu
) {
  "use strict";
  function _templateObject_f7555510f32e11e8a4700dcc21fbc61a() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: inline-flex;\n        height: 32px;\n        box-sizing: border-box;\n      }\n      :host hax-toolbar-menu ::slotted(*):hover {\n        background-color: #cccccc;\n      };\n      :host hax-toolbar-menu ::slotted(*) {\n        height: 32px;\n      };\n    </style>\n    <hax-toolbar-menu corner="[[corner]]" id="menu" icon="[[icon]]" tooltip="[[label]]" tooltip-direction="[[direction]]" selected="{{selectedValue}}" reset-on-select="[[resetOnSelect]]">\n      <slot></slot>\n    </hax-toolbar-menu>\n'
    ]);
    _templateObject_f7555510f32e11e8a4700dcc21fbc61a = function _templateObject_f7555510f32e11e8a4700dcc21fbc61a() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_f7555510f32e11e8a4700dcc21fbc61a()
    ),
    is: "hax-context-item-menu",
    properties: {
      corner: { type: String, value: "" },
      _blockEvent: { type: Boolean, value: !1 },
      resetOnSelect: { type: Boolean, value: !1 },
      selectedValue: {
        type: Number,
        reflectToAttribute: !0,
        notify: !0,
        value: 0,
        observer: "_selectedUpdated"
      },
      direction: { type: String, value: "top" },
      icon: {
        type: String,
        value: "editor:text-fields",
        reflectToAttribute: !0
      },
      iconClass: { type: String, value: "black-text", reflectToAttribute: !0 },
      label: {
        type: String,
        value: "editor:text-fields",
        reflectToAttribute: !0
      },
      eventName: { type: String, value: "button", reflectToAttribute: !0 }
    },
    _selectedUpdated: function _selectedUpdated(newValue, oldValue) {
      if (
        babelHelpers.typeof(newValue) !== babelHelpers.typeof(null) &&
        babelHelpers.typeof(oldValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(oldValue) !== babelHelpers.typeof(null)
      ) {
        for (
          var children = (0, _polymerDom.dom)(this).getDistributedNodes(),
            item = {},
            j = 0,
            i = 0,
            len = children.length;
          i < len;
          i++
        ) {
          if ("PAPER-ITEM" === children[i].tagName) {
            if (j === newValue) {
              item = children[i];
              len = i;
              continue;
            }
            j++;
          }
        }
        if (
          !this._blockEvent &&
          babelHelpers.typeof(item.attributes) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(item.attributes.value) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(item.attributes.value.value) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          this.$.menu.hideMenu();
          this.fire("hax-context-item-selected", {
            target: item,
            eventName: item.attributes.value.value
          });
        }
        if (this._blockEvent) {
          this._blockEvent = !1;
        }
      }
    }
  });
});
