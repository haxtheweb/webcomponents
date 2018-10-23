define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.MapMenu = void 0;
  function _templateObject_cc322b30d6fd11e89b4bbdae3fd4f416() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_cc322b30d6fd11e89b4bbdae3fd4f416 = function() {
      return data;
    };
    return data;
  }
  var MapMenu = (function(_PolymerElement) {
    babelHelpers.inherits(MapMenu, _PolymerElement);
    function MapMenu() {
      babelHelpers.classCallCheck(this, MapMenu);
      return babelHelpers.possibleConstructorReturn(
        this,
        (MapMenu.__proto__ || Object.getPrototypeOf(MapMenu)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      MapMenu,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                MapMenu.prototype.__proto__ ||
                  Object.getPrototypeOf(MapMenu.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              MapMenu.haxProperties,
              MapMenu.tag,
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
              _templateObject_cc322b30d6fd11e89b4bbdae3fd4f416()
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
                title: "Map menu",
                description: "Automated conversion of map-menu/",
                icon: "icons:android",
                color: "green",
                groups: ["Menu"],
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
            return "map-menu";
          }
        }
      ]
    );
    return MapMenu;
  })(_polymerElement.PolymerElement);
  _exports.MapMenu = MapMenu;
  window.customElements.define(MapMenu.tag, MapMenu);
});
