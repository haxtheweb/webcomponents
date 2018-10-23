define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.AppEditorHax = void 0;
  function _templateObject_5bf30800d6ec11e8afcb8fd6c2cd80ae() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_5bf30800d6ec11e8afcb8fd6c2cd80ae = function() {
      return data;
    };
    return data;
  }
  var AppEditorHax = (function(_PolymerElement) {
    babelHelpers.inherits(AppEditorHax, _PolymerElement);
    function AppEditorHax() {
      babelHelpers.classCallCheck(this, AppEditorHax);
      return babelHelpers.possibleConstructorReturn(
        this,
        (AppEditorHax.__proto__ || Object.getPrototypeOf(AppEditorHax)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      AppEditorHax,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                AppEditorHax.prototype.__proto__ ||
                  Object.getPrototypeOf(AppEditorHax.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              AppEditorHax.haxProperties,
              AppEditorHax.tag,
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
              _templateObject_5bf30800d6ec11e8afcb8fd6c2cd80ae()
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
                title: "App editor-hax",
                description: "Automated conversion of app-editor-hax/",
                icon: "icons:android",
                color: "green",
                groups: ["Editor"],
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
            return "app-editor-hax";
          }
        }
      ]
    );
    return AppEditorHax;
  })(_polymerElement.PolymerElement);
  _exports.AppEditorHax = AppEditorHax;
  window.customElements.define(AppEditorHax.tag, AppEditorHax);
});
