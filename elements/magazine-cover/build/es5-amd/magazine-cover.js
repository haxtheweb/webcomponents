define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.MagazineCover = void 0;
  function _templateObject_7e550090d6fd11e886919f5e940d85a3() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_7e550090d6fd11e886919f5e940d85a3 = function() {
      return data;
    };
    return data;
  }
  var MagazineCover = (function(_PolymerElement) {
    babelHelpers.inherits(MagazineCover, _PolymerElement);
    function MagazineCover() {
      babelHelpers.classCallCheck(this, MagazineCover);
      return babelHelpers.possibleConstructorReturn(
        this,
        (MagazineCover.__proto__ || Object.getPrototypeOf(MagazineCover)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      MagazineCover,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                MagazineCover.prototype.__proto__ ||
                  Object.getPrototypeOf(MagazineCover.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              MagazineCover.haxProperties,
              MagazineCover.tag,
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
              _templateObject_7e550090d6fd11e886919f5e940d85a3()
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
                title: "Magazine cover",
                description: "Automated conversion of magazine-cover/",
                icon: "icons:android",
                color: "green",
                groups: ["Cover"],
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
            return "magazine-cover";
          }
        }
      ]
    );
    return MagazineCover;
  })(_polymerElement.PolymerElement);
  _exports.MagazineCover = MagazineCover;
  window.customElements.define(MagazineCover.tag, MagazineCover);
});
