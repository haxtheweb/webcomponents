define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.HaxBodyBehaviors = void 0;
  function _templateObject_89582330d6f011e88f0dc38372205467() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_89582330d6f011e88f0dc38372205467 = function() {
      return data;
    };
    return data;
  }
  var HaxBodyBehaviors = (function(_PolymerElement) {
    babelHelpers.inherits(HaxBodyBehaviors, _PolymerElement);
    function HaxBodyBehaviors() {
      babelHelpers.classCallCheck(this, HaxBodyBehaviors);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          HaxBodyBehaviors.__proto__ || Object.getPrototypeOf(HaxBodyBehaviors)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      HaxBodyBehaviors,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                HaxBodyBehaviors.prototype.__proto__ ||
                  Object.getPrototypeOf(HaxBodyBehaviors.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              HaxBodyBehaviors.haxProperties,
              HaxBodyBehaviors.tag,
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
              _templateObject_89582330d6f011e88f0dc38372205467()
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
                title: "Hax body-behaviors",
                description: "Automated conversion of hax-body-behaviors/",
                icon: "icons:android",
                color: "green",
                groups: ["Body"],
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
            return "hax-body-behaviors";
          }
        }
      ]
    );
    return HaxBodyBehaviors;
  })(_polymerElement.PolymerElement);
  _exports.HaxBodyBehaviors = HaxBodyBehaviors;
  window.customElements.define(HaxBodyBehaviors.tag, HaxBodyBehaviors);
});
