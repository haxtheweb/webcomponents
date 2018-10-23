define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnsysChartjs = void 0;
  function _templateObject_f8bafee0d6fb11e8a8b645cbe5e2b4cc() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_f8bafee0d6fb11e8a8b645cbe5e2b4cc = function() {
      return data;
    };
    return data;
  }
  var LrnsysChartjs = (function(_PolymerElement) {
    babelHelpers.inherits(LrnsysChartjs, _PolymerElement);
    function LrnsysChartjs() {
      babelHelpers.classCallCheck(this, LrnsysChartjs);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnsysChartjs.__proto__ || Object.getPrototypeOf(LrnsysChartjs)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnsysChartjs,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnsysChartjs.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnsysChartjs.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnsysChartjs.haxProperties,
              LrnsysChartjs.tag,
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
              _templateObject_f8bafee0d6fb11e8a8b645cbe5e2b4cc()
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
                title: "Lrnsys chartjs",
                description: "Automated conversion of lrnsys-chartjs/",
                icon: "icons:android",
                color: "green",
                groups: ["Chartjs"],
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
            return "lrnsys-chartjs";
          }
        }
      ]
    );
    return LrnsysChartjs;
  })(_polymerElement.PolymerElement);
  _exports.LrnsysChartjs = LrnsysChartjs;
  window.customElements.define(LrnsysChartjs.tag, LrnsysChartjs);
});
