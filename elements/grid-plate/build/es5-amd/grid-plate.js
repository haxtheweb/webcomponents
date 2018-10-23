define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.GridPlate = void 0;
  function _templateObject_e2c10af0d6ef11e880ac0b07afe7a6e7() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_e2c10af0d6ef11e880ac0b07afe7a6e7 = function() {
      return data;
    };
    return data;
  }
  var GridPlate = (function(_PolymerElement) {
    babelHelpers.inherits(GridPlate, _PolymerElement);
    function GridPlate() {
      babelHelpers.classCallCheck(this, GridPlate);
      return babelHelpers.possibleConstructorReturn(
        this,
        (GridPlate.__proto__ || Object.getPrototypeOf(GridPlate)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      GridPlate,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                GridPlate.prototype.__proto__ ||
                  Object.getPrototypeOf(GridPlate.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              GridPlate.haxProperties,
              GridPlate.tag,
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
              _templateObject_e2c10af0d6ef11e880ac0b07afe7a6e7()
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
                title: "Grid plate",
                description: "Automated conversion of grid-plate/",
                icon: "icons:android",
                color: "green",
                groups: ["Plate"],
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
            return "grid-plate";
          }
        }
      ]
    );
    return GridPlate;
  })(_polymerElement.PolymerElement);
  _exports.GridPlate = GridPlate;
  window.customElements.define(GridPlate.tag, GridPlate);
});
