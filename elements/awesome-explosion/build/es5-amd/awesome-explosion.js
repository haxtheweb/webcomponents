define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.AwesomeExplosion = void 0;
  function _templateObject_a684d830d6ec11e889fc7d07d02f0748() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_a684d830d6ec11e889fc7d07d02f0748 = function() {
      return data;
    };
    return data;
  }
  var AwesomeExplosion = (function(_PolymerElement) {
    babelHelpers.inherits(AwesomeExplosion, _PolymerElement);
    function AwesomeExplosion() {
      babelHelpers.classCallCheck(this, AwesomeExplosion);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          AwesomeExplosion.__proto__ || Object.getPrototypeOf(AwesomeExplosion)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      AwesomeExplosion,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                AwesomeExplosion.prototype.__proto__ ||
                  Object.getPrototypeOf(AwesomeExplosion.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              AwesomeExplosion.haxProperties,
              AwesomeExplosion.tag,
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
              _templateObject_a684d830d6ec11e889fc7d07d02f0748()
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
                title: "Awesome explosion",
                description: "Automated conversion of awesome-explosion/",
                icon: "icons:android",
                color: "green",
                groups: ["Explosion"],
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
            return "awesome-explosion";
          }
        }
      ]
    );
    return AwesomeExplosion;
  })(_polymerElement.PolymerElement);
  _exports.AwesomeExplosion = AwesomeExplosion;
  window.customElements.define(AwesomeExplosion.tag, AwesomeExplosion);
});
