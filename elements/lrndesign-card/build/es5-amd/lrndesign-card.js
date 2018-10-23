define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignCard = void 0;
  function _templateObject_5bf550f0d6f711e8a8cdf57fcfee18e1() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_5bf550f0d6f711e8a8cdf57fcfee18e1 = function() {
      return data;
    };
    return data;
  }
  var LrndesignCard = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignCard, _PolymerElement);
    function LrndesignCard() {
      babelHelpers.classCallCheck(this, LrndesignCard);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrndesignCard.__proto__ || Object.getPrototypeOf(LrndesignCard)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrndesignCard,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignCard.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignCard.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignCard.haxProperties,
              LrndesignCard.tag,
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
              _templateObject_5bf550f0d6f711e8a8cdf57fcfee18e1()
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
                title: "Lrndesign card",
                description: "Automated conversion of lrndesign-card/",
                icon: "icons:android",
                color: "green",
                groups: ["Card"],
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
            return "lrndesign-card";
          }
        }
      ]
    );
    return LrndesignCard;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignCard = LrndesignCard;
  window.customElements.define(LrndesignCard.tag, LrndesignCard);
});
