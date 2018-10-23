define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.CmsHax = void 0;
  function _templateObject_fa9370c0d6ed11e8b46bb761aa1aaf1a() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_fa9370c0d6ed11e8b46bb761aa1aaf1a = function() {
      return data;
    };
    return data;
  }
  var CmsHax = (function(_PolymerElement) {
    babelHelpers.inherits(CmsHax, _PolymerElement);
    function CmsHax() {
      babelHelpers.classCallCheck(this, CmsHax);
      return babelHelpers.possibleConstructorReturn(
        this,
        (CmsHax.__proto__ || Object.getPrototypeOf(CmsHax)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      CmsHax,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                CmsHax.prototype.__proto__ ||
                  Object.getPrototypeOf(CmsHax.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              CmsHax.haxProperties,
              CmsHax.tag,
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
              _templateObject_fa9370c0d6ed11e8b46bb761aa1aaf1a()
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
                title: "Cms hax",
                description: "Automated conversion of cms-hax/",
                icon: "icons:android",
                color: "green",
                groups: ["Hax"],
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
            return "cms-hax";
          }
        }
      ]
    );
    return CmsHax;
  })(_polymerElement.PolymerElement);
  _exports.CmsHax = CmsHax;
  window.customElements.define(CmsHax.tag, CmsHax);
});
