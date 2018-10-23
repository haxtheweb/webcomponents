define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.WatsonlogicParallax = void 0;
  function _templateObject_a568fa60d70c11e89399651facefbb47() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_a568fa60d70c11e89399651facefbb47 = function() {
      return data;
    };
    return data;
  }
  var WatsonlogicParallax = (function(_PolymerElement) {
    babelHelpers.inherits(WatsonlogicParallax, _PolymerElement);
    function WatsonlogicParallax() {
      babelHelpers.classCallCheck(this, WatsonlogicParallax);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          WatsonlogicParallax.__proto__ ||
          Object.getPrototypeOf(WatsonlogicParallax)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      WatsonlogicParallax,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                WatsonlogicParallax.prototype.__proto__ ||
                  Object.getPrototypeOf(WatsonlogicParallax.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              WatsonlogicParallax.haxProperties,
              WatsonlogicParallax.tag,
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
              _templateObject_a568fa60d70c11e89399651facefbb47()
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
                title: "Watsonlogic parallax",
                description: "Automated conversion of watsonlogic-parallax/",
                icon: "icons:android",
                color: "green",
                groups: ["Parallax"],
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
            return "watsonlogic-parallax";
          }
        }
      ]
    );
    return WatsonlogicParallax;
  })(_polymerElement.PolymerElement);
  _exports.WatsonlogicParallax = WatsonlogicParallax;
  window.customElements.define(WatsonlogicParallax.tag, WatsonlogicParallax);
});
