define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignPanelcard = void 0;
  function _templateObject_e07a6ac0d6f911e888e12347af284e79() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_e07a6ac0d6f911e888e12347af284e79 = function() {
      return data;
    };
    return data;
  }
  var LrndesignPanelcard = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignPanelcard, _PolymerElement);
    function LrndesignPanelcard() {
      babelHelpers.classCallCheck(this, LrndesignPanelcard);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignPanelcard.__proto__ ||
          Object.getPrototypeOf(LrndesignPanelcard)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignPanelcard,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignPanelcard.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignPanelcard.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignPanelcard.haxProperties,
              LrndesignPanelcard.tag,
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
              _templateObject_e07a6ac0d6f911e888e12347af284e79()
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
                title: "Lrndesign panelcard",
                description: "Automated conversion of lrndesign-panelcard/",
                icon: "icons:android",
                color: "green",
                groups: ["Panelcard"],
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
            return "lrndesign-panelcard";
          }
        }
      ]
    );
    return LrndesignPanelcard;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignPanelcard = LrndesignPanelcard;
  window.customElements.define(LrndesignPanelcard.tag, LrndesignPanelcard);
});
