define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignDrawer = void 0;
  function _templateObject_befc7650d6f811e8834c1b273a2b2f11() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_befc7650d6f811e8834c1b273a2b2f11 = function() {
      return data;
    };
    return data;
  }
  var LrndesignDrawer = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignDrawer, _PolymerElement);
    function LrndesignDrawer() {
      babelHelpers.classCallCheck(this, LrndesignDrawer);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignDrawer.__proto__ || Object.getPrototypeOf(LrndesignDrawer)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignDrawer,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignDrawer.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignDrawer.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignDrawer.haxProperties,
              LrndesignDrawer.tag,
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
              _templateObject_befc7650d6f811e8834c1b273a2b2f11()
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
                title: "Lrndesign drawer",
                description: "Automated conversion of lrndesign-drawer/",
                icon: "icons:android",
                color: "green",
                groups: ["Drawer"],
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
            return "lrndesign-drawer";
          }
        }
      ]
    );
    return LrndesignDrawer;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignDrawer = LrndesignDrawer;
  window.customElements.define(LrndesignDrawer.tag, LrndesignDrawer);
});
