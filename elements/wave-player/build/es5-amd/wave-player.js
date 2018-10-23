define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.WavePlayer = void 0;
  function _templateObject_ccddd6b0d70c11e8baff877b711c5b12() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_ccddd6b0d70c11e8baff877b711c5b12 = function() {
      return data;
    };
    return data;
  }
  var WavePlayer = (function(_PolymerElement) {
    babelHelpers.inherits(WavePlayer, _PolymerElement);
    function WavePlayer() {
      babelHelpers.classCallCheck(this, WavePlayer);
      return babelHelpers.possibleConstructorReturn(
        this,
        (WavePlayer.__proto__ || Object.getPrototypeOf(WavePlayer)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      WavePlayer,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                WavePlayer.prototype.__proto__ ||
                  Object.getPrototypeOf(WavePlayer.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              WavePlayer.haxProperties,
              WavePlayer.tag,
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
              _templateObject_ccddd6b0d70c11e8baff877b711c5b12()
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
                title: "Wave player",
                description: "Automated conversion of wave-player/",
                icon: "icons:android",
                color: "green",
                groups: ["Player"],
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
            return "wave-player";
          }
        }
      ]
    );
    return WavePlayer;
  })(_polymerElement.PolymerElement);
  _exports.WavePlayer = WavePlayer;
  window.customElements.define(WavePlayer.tag, WavePlayer);
});
