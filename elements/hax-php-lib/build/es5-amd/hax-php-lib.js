define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.HaxPhpLib = void 0;
  function _templateObject_fcf5f500d6f111e886162f97272caa70() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_fcf5f500d6f111e886162f97272caa70 = function() {
      return data;
    };
    return data;
  }
  var HaxPhpLib = (function(_PolymerElement) {
    babelHelpers.inherits(HaxPhpLib, _PolymerElement);
    function HaxPhpLib() {
      babelHelpers.classCallCheck(this, HaxPhpLib);
      return babelHelpers.possibleConstructorReturn(
        this,
        (HaxPhpLib.__proto__ || Object.getPrototypeOf(HaxPhpLib)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      HaxPhpLib,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                HaxPhpLib.prototype.__proto__ ||
                  Object.getPrototypeOf(HaxPhpLib.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              HaxPhpLib.haxProperties,
              HaxPhpLib.tag,
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
              _templateObject_fcf5f500d6f111e886162f97272caa70()
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
                title: "Hax php-lib",
                description: "Automated conversion of hax_php_lib/",
                icon: "icons:android",
                color: "green",
                groups: ["Php"],
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
            return "hax-php-lib";
          }
        }
      ]
    );
    return HaxPhpLib;
  })(_polymerElement.PolymerElement);
  _exports.HaxPhpLib = HaxPhpLib;
  window.customElements.define(HaxPhpLib.tag, HaxPhpLib);
});
