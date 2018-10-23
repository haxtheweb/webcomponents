define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.GeneCrossover = void 0;
  function _templateObject_7415be70d6ef11e8a8462f2577c25979() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_7415be70d6ef11e8a8462f2577c25979 = function() {
      return data;
    };
    return data;
  }
  var GeneCrossover = (function(_PolymerElement) {
    babelHelpers.inherits(GeneCrossover, _PolymerElement);
    function GeneCrossover() {
      babelHelpers.classCallCheck(this, GeneCrossover);
      return babelHelpers.possibleConstructorReturn(
        this,
        (GeneCrossover.__proto__ || Object.getPrototypeOf(GeneCrossover)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      GeneCrossover,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                GeneCrossover.prototype.__proto__ ||
                  Object.getPrototypeOf(GeneCrossover.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              GeneCrossover.haxProperties,
              GeneCrossover.tag,
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
              _templateObject_7415be70d6ef11e8a8462f2577c25979()
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
                title: "Gene crossover",
                description: "Automated conversion of gene-crossover/",
                icon: "icons:android",
                color: "green",
                groups: ["Crossover"],
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
            return "gene-crossover";
          }
        }
      ]
    );
    return GeneCrossover;
  })(_polymerElement.PolymerElement);
  _exports.GeneCrossover = GeneCrossover;
  window.customElements.define(GeneCrossover.tag, GeneCrossover);
});
