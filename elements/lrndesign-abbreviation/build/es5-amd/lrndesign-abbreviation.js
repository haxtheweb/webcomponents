define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignAbbreviation = void 0;
  function _templateObject_7f7da640d6f611e88a0c4b33f113d35e() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_7f7da640d6f611e88a0c4b33f113d35e = function() {
      return data;
    };
    return data;
  }
  var LrndesignAbbreviation = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignAbbreviation, _PolymerElement);
    function LrndesignAbbreviation() {
      babelHelpers.classCallCheck(this, LrndesignAbbreviation);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignAbbreviation.__proto__ ||
          Object.getPrototypeOf(LrndesignAbbreviation)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignAbbreviation,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignAbbreviation.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignAbbreviation.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignAbbreviation.haxProperties,
              LrndesignAbbreviation.tag,
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
              _templateObject_7f7da640d6f611e88a0c4b33f113d35e()
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
                title: "Lrndesign abbreviation",
                description: "Automated conversion of lrndesign-abbreviation/",
                icon: "icons:android",
                color: "green",
                groups: ["Abbreviation"],
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
            return "lrndesign-abbreviation";
          }
        }
      ]
    );
    return LrndesignAbbreviation;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignAbbreviation = LrndesignAbbreviation;
  window.customElements.define(
    LrndesignAbbreviation.tag,
    LrndesignAbbreviation
  );
});
