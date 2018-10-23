define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.HackPsuLogo = void 0;
  function _templateObject_fc182a10d6ef11e896b7a1e353d09f64() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_fc182a10d6ef11e896b7a1e353d09f64 = function() {
      return data;
    };
    return data;
  }
  var HackPsuLogo = (function(_PolymerElement) {
    babelHelpers.inherits(HackPsuLogo, _PolymerElement);
    function HackPsuLogo() {
      babelHelpers.classCallCheck(this, HackPsuLogo);
      return babelHelpers.possibleConstructorReturn(
        this,
        (HackPsuLogo.__proto__ || Object.getPrototypeOf(HackPsuLogo)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      HackPsuLogo,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                HackPsuLogo.prototype.__proto__ ||
                  Object.getPrototypeOf(HackPsuLogo.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              HackPsuLogo.haxProperties,
              HackPsuLogo.tag,
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
              _templateObject_fc182a10d6ef11e896b7a1e353d09f64()
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
                title: "Hack psu-logo",
                description: "Automated conversion of hack-psu-logo/",
                icon: "icons:android",
                color: "green",
                groups: ["Psu"],
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
            return "hack-psu-logo";
          }
        }
      ]
    );
    return HackPsuLogo;
  })(_polymerElement.PolymerElement);
  _exports.HackPsuLogo = HackPsuLogo;
  window.customElements.define(HackPsuLogo.tag, HackPsuLogo);
});
