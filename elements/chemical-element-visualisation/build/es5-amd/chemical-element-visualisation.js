define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.ChemicalElementVisualisation = void 0;
  function _templateObject_7236d730d6ed11e889cfd75697f275a4() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_7236d730d6ed11e889cfd75697f275a4 = function() {
      return data;
    };
    return data;
  }
  var ChemicalElementVisualisation = (function(_PolymerElement) {
    babelHelpers.inherits(ChemicalElementVisualisation, _PolymerElement);
    function ChemicalElementVisualisation() {
      babelHelpers.classCallCheck(this, ChemicalElementVisualisation);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          ChemicalElementVisualisation.__proto__ ||
          Object.getPrototypeOf(ChemicalElementVisualisation)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      ChemicalElementVisualisation,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                ChemicalElementVisualisation.prototype.__proto__ ||
                  Object.getPrototypeOf(ChemicalElementVisualisation.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              ChemicalElementVisualisation.haxProperties,
              ChemicalElementVisualisation.tag,
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
              _templateObject_7236d730d6ed11e889cfd75697f275a4()
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
                title: "Chemical element-visualisation",
                description:
                  "Automated conversion of chemical-element-visualisation/",
                icon: "icons:android",
                color: "green",
                groups: ["Element"],
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
            return "chemical-element-visualisation";
          }
        }
      ]
    );
    return ChemicalElementVisualisation;
  })(_polymerElement.PolymerElement);
  _exports.ChemicalElementVisualisation = ChemicalElementVisualisation;
  window.customElements.define(
    ChemicalElementVisualisation.tag,
    ChemicalElementVisualisation
  );
});
