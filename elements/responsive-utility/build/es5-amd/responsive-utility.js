define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.ResponsiveUtility = void 0;
  function _templateObject_35eb8a70d70411e8903ea9d50c019e1f() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_35eb8a70d70411e8903ea9d50c019e1f = function() {
      return data;
    };
    return data;
  }
  var ResponsiveUtility = (function(_PolymerElement) {
    babelHelpers.inherits(ResponsiveUtility, _PolymerElement);
    function ResponsiveUtility() {
      babelHelpers.classCallCheck(this, ResponsiveUtility);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          ResponsiveUtility.__proto__ ||
          Object.getPrototypeOf(ResponsiveUtility)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      ResponsiveUtility,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                ResponsiveUtility.prototype.__proto__ ||
                  Object.getPrototypeOf(ResponsiveUtility.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              ResponsiveUtility.haxProperties,
              ResponsiveUtility.tag,
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
              _templateObject_35eb8a70d70411e8903ea9d50c019e1f()
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
                title: "Responsive utility",
                description: "Automated conversion of responsive-utility/",
                icon: "icons:android",
                color: "green",
                groups: ["Utility"],
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
            return "responsive-utility";
          }
        }
      ]
    );
    return ResponsiveUtility;
  })(_polymerElement.PolymerElement);
  _exports.ResponsiveUtility = ResponsiveUtility;
  window.customElements.define(ResponsiveUtility.tag, ResponsiveUtility);
});
