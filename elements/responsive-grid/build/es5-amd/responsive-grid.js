define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.ResponsiveGrid = void 0;
  function _templateObject_0928f400d70411e8923f9301bdc9704e() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_0928f400d70411e8923f9301bdc9704e = function() {
      return data;
    };
    return data;
  }
  var ResponsiveGrid = (function(_PolymerElement) {
    babelHelpers.inherits(ResponsiveGrid, _PolymerElement);
    function ResponsiveGrid() {
      babelHelpers.classCallCheck(this, ResponsiveGrid);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          ResponsiveGrid.__proto__ || Object.getPrototypeOf(ResponsiveGrid)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      ResponsiveGrid,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                ResponsiveGrid.prototype.__proto__ ||
                  Object.getPrototypeOf(ResponsiveGrid.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              ResponsiveGrid.haxProperties,
              ResponsiveGrid.tag,
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
              _templateObject_0928f400d70411e8923f9301bdc9704e()
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
                title: "Responsive grid",
                description: "Automated conversion of responsive-grid/",
                icon: "icons:android",
                color: "green",
                groups: ["Grid"],
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
            return "responsive-grid";
          }
        }
      ]
    );
    return ResponsiveGrid;
  })(_polymerElement.PolymerElement);
  _exports.ResponsiveGrid = ResponsiveGrid;
  window.customElements.define(ResponsiveGrid.tag, ResponsiveGrid);
});
