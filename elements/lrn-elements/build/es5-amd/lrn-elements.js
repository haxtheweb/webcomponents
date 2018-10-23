define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnElements = void 0;
  function _templateObject_d447ea80d6f311e8ac3b1f8840e53751() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_d447ea80d6f311e8ac3b1f8840e53751 = function() {
      return data;
    };
    return data;
  }
  var LrnElements = (function(_PolymerElement) {
    babelHelpers.inherits(LrnElements, _PolymerElement);
    function LrnElements() {
      babelHelpers.classCallCheck(this, LrnElements);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnElements.__proto__ || Object.getPrototypeOf(LrnElements)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnElements,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnElements.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnElements.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnElements.haxProperties,
              LrnElements.tag,
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
              _templateObject_d447ea80d6f311e8ac3b1f8840e53751()
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
                title: "Lrn elements",
                description: "Automated conversion of lrn-elements/",
                icon: "icons:android",
                color: "green",
                groups: ["Elements"],
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
            return "lrn-elements";
          }
        }
      ]
    );
    return LrnElements;
  })(_polymerElement.PolymerElement);
  _exports.LrnElements = LrnElements;
  window.customElements.define(LrnElements.tag, LrnElements);
});
