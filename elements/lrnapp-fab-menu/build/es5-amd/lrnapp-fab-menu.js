define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnappFabMenu = void 0;
  function _templateObject_9423b5e0d6f511e89996dbf019332f78() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_9423b5e0d6f511e89996dbf019332f78 = function() {
      return data;
    };
    return data;
  }
  var LrnappFabMenu = (function(_PolymerElement) {
    babelHelpers.inherits(LrnappFabMenu, _PolymerElement);
    function LrnappFabMenu() {
      babelHelpers.classCallCheck(this, LrnappFabMenu);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnappFabMenu.__proto__ || Object.getPrototypeOf(LrnappFabMenu)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnappFabMenu,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnappFabMenu.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnappFabMenu.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnappFabMenu.haxProperties,
              LrnappFabMenu.tag,
              this
            );
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_9423b5e0d6f511e89996dbf019332f78()
            );
          }
        },
        {
          key: "haxProperties",
          get: function get() {
            return {
              canScale: !0,
              canPosition: !0,
              canEditSource: !1,
              gizmo: {
                title: "Lrnapp fab-menu",
                description: "Automated conversion of lrnapp-fab-menu/",
                icon: "icons:android",
                color: "green",
                groups: ["Fab"],
                handles: [{ type: "todo:read-the-docs-for-usage" }],
                meta: {
                  author: "btopro",
                  owner: "The Pennsylvania State University"
                }
              },
              settings: { quick: [], configure: [], advanced: [] }
            };
          }
        },
        {
          key: "properties",
          get: function get() {
            return {};
          }
        },
        {
          key: "tag",
          get: function get() {
            return "lrnapp-fab-menu";
          }
        }
      ]
    );
    return LrnappFabMenu;
  })(_polymerElement.PolymerElement);
  _exports.LrnappFabMenu = LrnappFabMenu;
  window.customElements.define(LrnappFabMenu.tag, LrnappFabMenu);
});
