define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.FlashCard = void 0;
  function _templateObject_41212860d6ef11e8991ca59fecac0389() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_41212860d6ef11e8991ca59fecac0389 = function() {
      return data;
    };
    return data;
  }
  var FlashCard = (function(_PolymerElement) {
    babelHelpers.inherits(FlashCard, _PolymerElement);
    function FlashCard() {
      babelHelpers.classCallCheck(this, FlashCard);
      return babelHelpers.possibleConstructorReturn(
        this,
        (FlashCard.__proto__ || Object.getPrototypeOf(FlashCard)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      FlashCard,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                FlashCard.prototype.__proto__ ||
                  Object.getPrototypeOf(FlashCard.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              FlashCard.haxProperties,
              FlashCard.tag,
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
              _templateObject_41212860d6ef11e8991ca59fecac0389()
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
                title: "Flash card",
                description: "Automated conversion of flash-card/",
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
            return "flash-card";
          }
        }
      ]
    );
    return FlashCard;
  })(_polymerElement.PolymerElement);
  _exports.FlashCard = FlashCard;
  window.customElements.define(FlashCard.tag, FlashCard);
});
