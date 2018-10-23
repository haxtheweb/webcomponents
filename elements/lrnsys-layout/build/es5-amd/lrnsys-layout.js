define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnsysLayout = void 0;
  function _templateObject_44883540d6fc11e8a1f8d5a6207b56d7() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_44883540d6fc11e8a1f8d5a6207b56d7 = function() {
      return data;
    };
    return data;
  }
  var LrnsysLayout = (function(_PolymerElement) {
    babelHelpers.inherits(LrnsysLayout, _PolymerElement);
    function LrnsysLayout() {
      babelHelpers.classCallCheck(this, LrnsysLayout);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnsysLayout.__proto__ || Object.getPrototypeOf(LrnsysLayout)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnsysLayout,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnsysLayout.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnsysLayout.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnsysLayout.haxProperties,
              LrnsysLayout.tag,
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
              _templateObject_44883540d6fc11e8a1f8d5a6207b56d7()
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
                title: "Lrnsys layout",
                description: "Automated conversion of lrnsys-layout/",
                icon: "icons:android",
                color: "green",
                groups: ["Layout"],
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
            return "lrnsys-layout";
          }
        }
      ]
    );
    return LrnsysLayout;
  })(_polymerElement.PolymerElement);
  _exports.LrnsysLayout = LrnsysLayout;
  window.customElements.define(LrnsysLayout.tag, LrnsysLayout);
});
