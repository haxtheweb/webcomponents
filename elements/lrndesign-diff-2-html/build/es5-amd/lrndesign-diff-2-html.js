define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignDiff2Html = void 0;
  function _templateObject_8d2fe580d6f811e88e777d20f6ebfe62() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_8d2fe580d6f811e88e777d20f6ebfe62 = function() {
      return data;
    };
    return data;
  }
  var LrndesignDiff2Html = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignDiff2Html, _PolymerElement);
    function LrndesignDiff2Html() {
      babelHelpers.classCallCheck(this, LrndesignDiff2Html);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignDiff2Html.__proto__ ||
          Object.getPrototypeOf(LrndesignDiff2Html)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignDiff2Html,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignDiff2Html.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignDiff2Html.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignDiff2Html.haxProperties,
              LrndesignDiff2Html.tag,
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
              _templateObject_8d2fe580d6f811e88e777d20f6ebfe62()
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
                title: "Lrndesign diff-2-html",
                description: "Automated conversion of lrndesign-diff2html/",
                icon: "icons:android",
                color: "green",
                groups: ["Diff"],
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
            return "lrndesign-diff-2-html";
          }
        }
      ]
    );
    return LrndesignDiff2Html;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignDiff2Html = LrndesignDiff2Html;
  window.customElements.define(LrndesignDiff2Html.tag, LrndesignDiff2Html);
});
