define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.SelfCheck = void 0;
  function _templateObject_f8a564f0d70411e88c43f71d8d4b5671() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_f8a564f0d70411e88c43f71d8d4b5671 = function() {
      return data;
    };
    return data;
  }
  var SelfCheck = (function(_PolymerElement) {
    babelHelpers.inherits(SelfCheck, _PolymerElement);
    function SelfCheck() {
      babelHelpers.classCallCheck(this, SelfCheck);
      return babelHelpers.possibleConstructorReturn(
        this,
        (SelfCheck.__proto__ || Object.getPrototypeOf(SelfCheck)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      SelfCheck,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                SelfCheck.prototype.__proto__ ||
                  Object.getPrototypeOf(SelfCheck.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              SelfCheck.haxProperties,
              SelfCheck.tag,
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
              _templateObject_f8a564f0d70411e88c43f71d8d4b5671()
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
                title: "Self check",
                description: "Automated conversion of self-check/",
                icon: "icons:android",
                color: "green",
                groups: ["Check"],
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
            return "self-check";
          }
        }
      ]
    );
    return SelfCheck;
  })(_polymerElement.PolymerElement);
  _exports.SelfCheck = SelfCheck;
  window.customElements.define(SelfCheck.tag, SelfCheck);
});
