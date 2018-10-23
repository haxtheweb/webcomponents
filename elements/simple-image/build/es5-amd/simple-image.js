define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.SimpleImage = void 0;
  function _templateObject_2a825400d70611e8b51ca1fefac709d8() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_2a825400d70611e8b51ca1fefac709d8 = function() {
      return data;
    };
    return data;
  }
  var SimpleImage = (function(_PolymerElement) {
    babelHelpers.inherits(SimpleImage, _PolymerElement);
    function SimpleImage() {
      babelHelpers.classCallCheck(this, SimpleImage);
      return babelHelpers.possibleConstructorReturn(
        this,
        (SimpleImage.__proto__ || Object.getPrototypeOf(SimpleImage)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      SimpleImage,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                SimpleImage.prototype.__proto__ ||
                  Object.getPrototypeOf(SimpleImage.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              SimpleImage.haxProperties,
              SimpleImage.tag,
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
              _templateObject_2a825400d70611e8b51ca1fefac709d8()
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
                title: "Simple image",
                description: "Automated conversion of simple-image/",
                icon: "icons:android",
                color: "green",
                groups: ["Image"],
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
            return "simple-image";
          }
        }
      ]
    );
    return SimpleImage;
  })(_polymerElement.PolymerElement);
  _exports.SimpleImage = SimpleImage;
  window.customElements.define(SimpleImage.tag, SimpleImage);
});
