define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnAssignment = void 0;
  function _templateObject_5d2912d0d6f311e8a96f9385c731330c() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_5d2912d0d6f311e8a96f9385c731330c = function() {
      return data;
    };
    return data;
  }
  var LrnAssignment = (function(_PolymerElement) {
    babelHelpers.inherits(LrnAssignment, _PolymerElement);
    function LrnAssignment() {
      babelHelpers.classCallCheck(this, LrnAssignment);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnAssignment.__proto__ || Object.getPrototypeOf(LrnAssignment)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnAssignment,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnAssignment.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnAssignment.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnAssignment.haxProperties,
              LrnAssignment.tag,
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
              _templateObject_5d2912d0d6f311e8a96f9385c731330c()
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
                title: "Lrn assignment",
                description: "Automated conversion of lrn-assignment/",
                icon: "icons:android",
                color: "green",
                groups: ["Assignment"],
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
            return "lrn-assignment";
          }
        }
      ]
    );
    return LrnAssignment;
  })(_polymerElement.PolymerElement);
  _exports.LrnAssignment = LrnAssignment;
  window.customElements.define(LrnAssignment.tag, LrnAssignment);
});
