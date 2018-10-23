define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.Build = void 0;
  function _templateObject_01d06d30d6ed11e88c3d11c4757f4696() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_01d06d30d6ed11e88c3d11c4757f4696 = function() {
      return data;
    };
    return data;
  }
  var Build = (function(_PolymerElement) {
    babelHelpers.inherits(Build, _PolymerElement);
    function Build() {
      babelHelpers.classCallCheck(this, Build);
      return babelHelpers.possibleConstructorReturn(
        this,
        (Build.__proto__ || Object.getPrototypeOf(Build)).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      Build,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                Build.prototype.__proto__ ||
                  Object.getPrototypeOf(Build.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              Build.haxProperties,
              Build.tag,
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
              _templateObject_01d06d30d6ed11e88c3d11c4757f4696()
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
                title: "Build",
                description: "Automated conversion of build/",
                icon: "icons:android",
                color: "green",
                groups: [""],
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
            return "build";
          }
        }
      ]
    );
    return Build;
  })(_polymerElement.PolymerElement);
  _exports.Build = Build;
  window.customElements.define(Build.tag, Build);
});
