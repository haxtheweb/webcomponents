define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnGradebook = void 0;
  function _templateObject_20e51b10d6f411e8a3393712a8a78def() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_20e51b10d6f411e8a3393712a8a78def = function() {
      return data;
    };
    return data;
  }
  var LrnGradebook = (function(_PolymerElement) {
    babelHelpers.inherits(LrnGradebook, _PolymerElement);
    function LrnGradebook() {
      babelHelpers.classCallCheck(this, LrnGradebook);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnGradebook.__proto__ || Object.getPrototypeOf(LrnGradebook)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnGradebook,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnGradebook.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnGradebook.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnGradebook.haxProperties,
              LrnGradebook.tag,
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
              _templateObject_20e51b10d6f411e8a3393712a8a78def()
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
                title: "Lrn gradebook",
                description: "Automated conversion of lrn-gradebook/",
                icon: "icons:android",
                color: "green",
                groups: ["Gradebook"],
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
            return "lrn-gradebook";
          }
        }
      ]
    );
    return LrnGradebook;
  })(_polymerElement.PolymerElement);
  _exports.LrnGradebook = LrnGradebook;
  window.customElements.define(LrnGradebook.tag, LrnGradebook);
});
