define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.ParallaxEffect = void 0;
  function _templateObject_556fb210d70211e8aed9812893812208() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_556fb210d70211e8aed9812893812208 = function() {
      return data;
    };
    return data;
  }
  var ParallaxEffect = (function(_PolymerElement) {
    babelHelpers.inherits(ParallaxEffect, _PolymerElement);
    function ParallaxEffect() {
      babelHelpers.classCallCheck(this, ParallaxEffect);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          ParallaxEffect.__proto__ || Object.getPrototypeOf(ParallaxEffect)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      ParallaxEffect,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                ParallaxEffect.prototype.__proto__ ||
                  Object.getPrototypeOf(ParallaxEffect.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              ParallaxEffect.haxProperties,
              ParallaxEffect.tag,
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
              _templateObject_556fb210d70211e8aed9812893812208()
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
                title: "Parallax effect",
                description: "Automated conversion of parallax-effect/",
                icon: "icons:android",
                color: "green",
                groups: ["Effect"],
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
            return "parallax-effect";
          }
        }
      ]
    );
    return ParallaxEffect;
  })(_polymerElement.PolymerElement);
  _exports.ParallaxEffect = ParallaxEffect;
  window.customElements.define(ParallaxEffect.tag, ParallaxEffect);
});
