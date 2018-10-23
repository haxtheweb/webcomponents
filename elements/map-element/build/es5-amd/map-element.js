define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.MapElement = void 0;
  function _templateObject_a580c5f0d6fd11e8a4443bb98b8cc8d5() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_a580c5f0d6fd11e8a4443bb98b8cc8d5 = function() {
      return data;
    };
    return data;
  }
  var MapElement = (function(_PolymerElement) {
    babelHelpers.inherits(MapElement, _PolymerElement);
    function MapElement() {
      babelHelpers.classCallCheck(this, MapElement);
      return babelHelpers.possibleConstructorReturn(
        this,
        (MapElement.__proto__ || Object.getPrototypeOf(MapElement)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      MapElement,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                MapElement.prototype.__proto__ ||
                  Object.getPrototypeOf(MapElement.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              MapElement.haxProperties,
              MapElement.tag,
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
              _templateObject_a580c5f0d6fd11e8a4443bb98b8cc8d5()
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
                title: "Map element",
                description: "Automated conversion of map-element/",
                icon: "icons:android",
                color: "green",
                groups: ["Element"],
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
            return "map-element";
          }
        }
      ]
    );
    return MapElement;
  })(_polymerElement.PolymerElement);
  _exports.MapElement = MapElement;
  window.customElements.define(MapElement.tag, MapElement);
});
