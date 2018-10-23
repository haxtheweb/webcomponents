define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.A11YMediaPlayer = void 0;
  function _templateObject_2ad813f0d6ec11e89d68e19785cffc14() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_2ad813f0d6ec11e89d68e19785cffc14 = function() {
      return data;
    };
    return data;
  }
  var A11YMediaPlayer = (function(_PolymerElement) {
    babelHelpers.inherits(A11YMediaPlayer, _PolymerElement);
    function A11YMediaPlayer() {
      babelHelpers.classCallCheck(this, A11YMediaPlayer);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          A11YMediaPlayer.__proto__ || Object.getPrototypeOf(A11YMediaPlayer)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      A11YMediaPlayer,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                A11YMediaPlayer.prototype.__proto__ ||
                  Object.getPrototypeOf(A11YMediaPlayer.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              A11YMediaPlayer.haxProperties,
              A11YMediaPlayer.tag,
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
              _templateObject_2ad813f0d6ec11e89d68e19785cffc14()
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
                title: "A 11-y-media-player",
                description: "Automated conversion of a11y-media-player/",
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
            return "a-11-y-media-player";
          }
        }
      ]
    );
    return A11YMediaPlayer;
  })(_polymerElement.PolymerElement);
  _exports.A11YMediaPlayer = A11YMediaPlayer;
  window.customElements.define(A11YMediaPlayer.tag, A11YMediaPlayer);
});
