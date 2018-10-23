define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignAudioPlayer = void 0;
  function _templateObject_bace47e0d6f611e895373d6af5389176() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_bace47e0d6f611e895373d6af5389176 = function() {
      return data;
    };
    return data;
  }
  var LrndesignAudioPlayer = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignAudioPlayer, _PolymerElement);
    function LrndesignAudioPlayer() {
      babelHelpers.classCallCheck(this, LrndesignAudioPlayer);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignAudioPlayer.__proto__ ||
          Object.getPrototypeOf(LrndesignAudioPlayer)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignAudioPlayer,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignAudioPlayer.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignAudioPlayer.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignAudioPlayer.haxProperties,
              LrndesignAudioPlayer.tag,
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
              _templateObject_bace47e0d6f611e895373d6af5389176()
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
                title: "Lrndesign audio-player",
                description: "Automated conversion of lrndesign-audio-player/",
                icon: "icons:android",
                color: "green",
                groups: ["Audio"],
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
            return "lrndesign-audio-player";
          }
        }
      ]
    );
    return LrndesignAudioPlayer;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignAudioPlayer = LrndesignAudioPlayer;
  window.customElements.define(LrndesignAudioPlayer.tag, LrndesignAudioPlayer);
});
