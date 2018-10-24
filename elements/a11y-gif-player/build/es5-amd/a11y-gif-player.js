define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.A11YGifPlayer = void 0;
  function _templateObject_5dcf27f0d72111e89cde25f47e796bdc() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_5dcf27f0d72111e89cde25f47e796bdc = function() {
      return data;
    };
    return data;
  }
  var A11YGifPlayer = (function(_PolymerElement) {
    babelHelpers.inherits(A11YGifPlayer, _PolymerElement);
    function A11YGifPlayer() {
      babelHelpers.classCallCheck(this, A11YGifPlayer);
      return babelHelpers.possibleConstructorReturn(
        this,
        (A11YGifPlayer.__proto__ || Object.getPrototypeOf(A11YGifPlayer)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      A11YGifPlayer,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                A11YGifPlayer.prototype.__proto__ ||
                  Object.getPrototypeOf(A11YGifPlayer.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              A11YGifPlayer.haxProperties,
              A11YGifPlayer.tag,
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
              _templateObject_5dcf27f0d72111e89cde25f47e796bdc()
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
                title: "A 11-y-gif-player",
                description: "Automated conversion of a11y-gif-player/",
                icon: "icons:android",
                color: "green",
                groups: ["11"],
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
            return "a-11-y-gif-player";
          }
        }
      ]
    );
    return A11YGifPlayer;
  })(_polymerElement.PolymerElement);
  _exports.A11YGifPlayer = A11YGifPlayer;
  window.customElements.define(A11YGifPlayer.tag, A11YGifPlayer);
});
