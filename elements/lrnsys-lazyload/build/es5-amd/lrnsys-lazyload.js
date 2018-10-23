define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnsysLazyload = void 0;
  function _templateObject_6a206250d6fc11e88ed81f67dc765164() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_6a206250d6fc11e88ed81f67dc765164 = function() {
      return data;
    };
    return data;
  }
  var LrnsysLazyload = (function(_PolymerElement) {
    babelHelpers.inherits(LrnsysLazyload, _PolymerElement);
    function LrnsysLazyload() {
      babelHelpers.classCallCheck(this, LrnsysLazyload);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrnsysLazyload.__proto__ || Object.getPrototypeOf(LrnsysLazyload)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrnsysLazyload,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnsysLazyload.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnsysLazyload.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnsysLazyload.haxProperties,
              LrnsysLazyload.tag,
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
              _templateObject_6a206250d6fc11e88ed81f67dc765164()
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
                title: "Lrnsys lazyload",
                description: "Automated conversion of lrnsys-lazyload/",
                icon: "icons:android",
                color: "green",
                groups: ["Lazyload"],
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
            return "lrnsys-lazyload";
          }
        }
      ]
    );
    return LrnsysLazyload;
  })(_polymerElement.PolymerElement);
  _exports.LrnsysLazyload = LrnsysLazyload;
  window.customElements.define(LrnsysLazyload.tag, LrnsysLazyload);
});
