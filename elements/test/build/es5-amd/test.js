define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.Test = void 0;
  function _templateObject_46429c30d70c11e8b08f031641447a01() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_46429c30d70c11e8b08f031641447a01 = function() {
      return data;
    };
    return data;
  }
  var Test = (function(_PolymerElement) {
    babelHelpers.inherits(Test, _PolymerElement);
    function Test() {
      babelHelpers.classCallCheck(this, Test);
      return babelHelpers.possibleConstructorReturn(
        this,
        (Test.__proto__ || Object.getPrototypeOf(Test)).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      Test,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                Test.prototype.__proto__ ||
                  Object.getPrototypeOf(Test.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(Test.haxProperties, Test.tag, this);
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_46429c30d70c11e8b08f031641447a01()
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
                title: "Test",
                description: "Automated conversion of test/",
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
            return "test";
          }
        }
      ]
    );
    return Test;
  })(_polymerElement.PolymerElement);
  _exports.Test = Test;
  window.customElements.define(Test.tag, Test);
});
