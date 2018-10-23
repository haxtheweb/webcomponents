define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignSidenote = void 0;
  function _templateObject_6a4f2560d6fa11e8a44ebf9dcf1df3b2() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_6a4f2560d6fa11e8a44ebf9dcf1df3b2 = function() {
      return data;
    };
    return data;
  }
  var LrndesignSidenote = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignSidenote, _PolymerElement);
    function LrndesignSidenote() {
      babelHelpers.classCallCheck(this, LrndesignSidenote);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignSidenote.__proto__ ||
          Object.getPrototypeOf(LrndesignSidenote)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignSidenote,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignSidenote.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignSidenote.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignSidenote.haxProperties,
              LrndesignSidenote.tag,
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
              _templateObject_6a4f2560d6fa11e8a44ebf9dcf1df3b2()
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
                title: "Lrndesign sidenote",
                description: "Automated conversion of lrndesign-sidenote/",
                icon: "icons:android",
                color: "green",
                groups: ["Sidenote"],
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
            return "lrndesign-sidenote";
          }
        }
      ]
    );
    return LrndesignSidenote;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignSidenote = LrndesignSidenote;
  window.customElements.define(LrndesignSidenote.tag, LrndesignSidenote);
});
