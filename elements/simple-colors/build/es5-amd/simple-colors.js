define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.SimpleColors = void 0;
  function _templateObject_973ac6a0d70511e8a1d7f1fe34cfa022() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_973ac6a0d70511e8a1d7f1fe34cfa022 = function() {
      return data;
    };
    return data;
  }
  var SimpleColors = (function(_PolymerElement) {
    babelHelpers.inherits(SimpleColors, _PolymerElement);
    function SimpleColors() {
      babelHelpers.classCallCheck(this, SimpleColors);
      return babelHelpers.possibleConstructorReturn(
        this,
        (SimpleColors.__proto__ || Object.getPrototypeOf(SimpleColors)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      SimpleColors,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                SimpleColors.prototype.__proto__ ||
                  Object.getPrototypeOf(SimpleColors.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              SimpleColors.haxProperties,
              SimpleColors.tag,
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
              _templateObject_973ac6a0d70511e8a1d7f1fe34cfa022()
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
                title: "Simple colors",
                description: "Automated conversion of simple-colors/",
                icon: "icons:android",
                color: "green",
                groups: ["Colors"],
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
            return "simple-colors";
          }
        }
      ]
    );
    return SimpleColors;
  })(_polymerElement.PolymerElement);
  _exports.SimpleColors = SimpleColors;
  window.customElements.define(SimpleColors.tag, SimpleColors);
});
