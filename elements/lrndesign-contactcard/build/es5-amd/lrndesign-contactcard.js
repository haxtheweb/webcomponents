define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignContactcard = void 0;
  function _templateObject_cd600b90d6f711e8acc0755759aec619() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_cd600b90d6f711e8acc0755759aec619 = function() {
      return data;
    };
    return data;
  }
  var LrndesignContactcard = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignContactcard, _PolymerElement);
    function LrndesignContactcard() {
      babelHelpers.classCallCheck(this, LrndesignContactcard);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignContactcard.__proto__ ||
          Object.getPrototypeOf(LrndesignContactcard)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignContactcard,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignContactcard.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignContactcard.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignContactcard.haxProperties,
              LrndesignContactcard.tag,
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
              _templateObject_cd600b90d6f711e8acc0755759aec619()
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
                title: "Lrndesign contactcard",
                description: "Automated conversion of lrndesign-contactcard/",
                icon: "icons:android",
                color: "green",
                groups: ["Contactcard"],
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
            return "lrndesign-contactcard";
          }
        }
      ]
    );
    return LrndesignContactcard;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignContactcard = LrndesignContactcard;
  window.customElements.define(LrndesignContactcard.tag, LrndesignContactcard);
});
