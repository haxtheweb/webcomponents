define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.HaxAjax = void 0;
  function _templateObject_17183e40d6f011e89b0fe733146bf8b9() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_17183e40d6f011e89b0fe733146bf8b9 = function() {
      return data;
    };
    return data;
  }
  var HaxAjax = (function(_PolymerElement) {
    babelHelpers.inherits(HaxAjax, _PolymerElement);
    function HaxAjax() {
      babelHelpers.classCallCheck(this, HaxAjax);
      return babelHelpers.possibleConstructorReturn(
        this,
        (HaxAjax.__proto__ || Object.getPrototypeOf(HaxAjax)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      HaxAjax,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                HaxAjax.prototype.__proto__ ||
                  Object.getPrototypeOf(HaxAjax.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              HaxAjax.haxProperties,
              HaxAjax.tag,
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
              _templateObject_17183e40d6f011e89b0fe733146bf8b9()
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
                title: "Hax ajax",
                description: "Automated conversion of hax-ajax/",
                icon: "icons:android",
                color: "green",
                groups: ["Ajax"],
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
            return "hax-ajax";
          }
        }
      ]
    );
    return HaxAjax;
  })(_polymerElement.PolymerElement);
  _exports.HaxAjax = HaxAjax;
  window.customElements.define(HaxAjax.tag, HaxAjax);
});
