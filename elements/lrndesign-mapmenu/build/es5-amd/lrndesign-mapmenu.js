define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignMapmenu = void 0;
  function _templateObject_a1222390d6f911e8844681f80bd756e0() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_a1222390d6f911e8844681f80bd756e0 = function() {
      return data;
    };
    return data;
  }
  var LrndesignMapmenu = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignMapmenu, _PolymerElement);
    function LrndesignMapmenu() {
      babelHelpers.classCallCheck(this, LrndesignMapmenu);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignMapmenu.__proto__ || Object.getPrototypeOf(LrndesignMapmenu)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignMapmenu,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignMapmenu.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignMapmenu.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignMapmenu.haxProperties,
              LrndesignMapmenu.tag,
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
              _templateObject_a1222390d6f911e8844681f80bd756e0()
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
                title: "Lrndesign mapmenu",
                description: "Automated conversion of lrndesign-mapmenu/",
                icon: "icons:android",
                color: "green",
                groups: ["Mapmenu"],
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
            return "lrndesign-mapmenu";
          }
        }
      ]
    );
    return LrndesignMapmenu;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignMapmenu = LrndesignMapmenu;
  window.customElements.define(LrndesignMapmenu.tag, LrndesignMapmenu);
});
