define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignElements = void 0;
  function _templateObject_e9ddc9a0d6f811e893b72f635a4ec8e0() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_e9ddc9a0d6f811e893b72f635a4ec8e0 = function() {
      return data;
    };
    return data;
  }
  var LrndesignElements = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignElements, _PolymerElement);
    function LrndesignElements() {
      babelHelpers.classCallCheck(this, LrndesignElements);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignElements.__proto__ ||
          Object.getPrototypeOf(LrndesignElements)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignElements,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignElements.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignElements.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignElements.haxProperties,
              LrndesignElements.tag,
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
              _templateObject_e9ddc9a0d6f811e893b72f635a4ec8e0()
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
                title: "Lrndesign elements",
                description: "Automated conversion of lrndesign-elements/",
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
            return "lrndesign-elements";
          }
        }
      ]
    );
    return LrndesignElements;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignElements = LrndesignElements;
  window.customElements.define(LrndesignElements.tag, LrndesignElements);
});
