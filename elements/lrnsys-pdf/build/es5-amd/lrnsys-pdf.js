define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnsysPdf = void 0;
  function _templateObject_afde8a60d6fc11e8bfbeb3eebcab7c1e() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_afde8a60d6fc11e8bfbeb3eebcab7c1e = function() {
      return data;
    };
    return data;
  }
  var LrnsysPdf = (function(_PolymerElement) {
    babelHelpers.inherits(LrnsysPdf, _PolymerElement);
    function LrnsysPdf() {
      babelHelpers.classCallCheck(this, LrnsysPdf);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnsysPdf.__proto__ || Object.getPrototypeOf(LrnsysPdf)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnsysPdf,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnsysPdf.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnsysPdf.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnsysPdf.haxProperties,
              LrnsysPdf.tag,
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
              _templateObject_afde8a60d6fc11e8bfbeb3eebcab7c1e()
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
                title: "Lrnsys pdf",
                description: "Automated conversion of lrnsys-pdf/",
                icon: "icons:android",
                color: "green",
                groups: ["Pdf"],
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
            return "lrnsys-pdf";
          }
        }
      ]
    );
    return LrnsysPdf;
  })(_polymerElement.PolymerElement);
  _exports.LrnsysPdf = LrnsysPdf;
  window.customElements.define(LrnsysPdf.tag, LrnsysPdf);
});
