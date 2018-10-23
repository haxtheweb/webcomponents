define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignMaterialwordart = void 0;
  function _templateObject_c0b24730d6f911e89fe86116d4988a37() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_c0b24730d6f911e89fe86116d4988a37 = function() {
      return data;
    };
    return data;
  }
  var LrndesignMaterialwordart = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignMaterialwordart, _PolymerElement);
    function LrndesignMaterialwordart() {
      babelHelpers.classCallCheck(this, LrndesignMaterialwordart);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignMaterialwordart.__proto__ ||
          Object.getPrototypeOf(LrndesignMaterialwordart)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignMaterialwordart,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignMaterialwordart.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignMaterialwordart.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignMaterialwordart.haxProperties,
              LrndesignMaterialwordart.tag,
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
              _templateObject_c0b24730d6f911e89fe86116d4988a37()
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
                title: "Lrndesign materialwordart",
                description:
                  "Automated conversion of lrndesign-materialwordart/",
                icon: "icons:android",
                color: "green",
                groups: ["Materialwordart"],
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
            return "lrndesign-materialwordart";
          }
        }
      ]
    );
    return LrndesignMaterialwordart;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignMaterialwordart = LrndesignMaterialwordart;
  window.customElements.define(
    LrndesignMaterialwordart.tag,
    LrndesignMaterialwordart
  );
});
