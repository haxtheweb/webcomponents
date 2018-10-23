define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnTable = void 0;
  function _templateObject_118105c0d6f511e8bb9c9b9a04f669f9() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_118105c0d6f511e8bb9c9b9a04f669f9 = function() {
      return data;
    };
    return data;
  }
  var LrnTable = (function(_PolymerElement) {
    babelHelpers.inherits(LrnTable, _PolymerElement);
    function LrnTable() {
      babelHelpers.classCallCheck(this, LrnTable);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnTable.__proto__ || Object.getPrototypeOf(LrnTable)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnTable,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnTable.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnTable.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnTable.haxProperties,
              LrnTable.tag,
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
              _templateObject_118105c0d6f511e8bb9c9b9a04f669f9()
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
                title: "Lrn table",
                description: "Automated conversion of lrn-table/",
                icon: "icons:android",
                color: "green",
                groups: ["Table"],
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
            return "lrn-table";
          }
        }
      ]
    );
    return LrnTable;
  })(_polymerElement.PolymerElement);
  _exports.LrnTable = LrnTable;
  window.customElements.define(LrnTable.tag, LrnTable);
});
