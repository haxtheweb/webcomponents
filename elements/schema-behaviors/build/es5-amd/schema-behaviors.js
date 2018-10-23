define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.SchemaBehaviors = void 0;
  function _templateObject_6e4e0cd0d70411e8919023f8494e2c4e() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_6e4e0cd0d70411e8919023f8494e2c4e = function() {
      return data;
    };
    return data;
  }
  var SchemaBehaviors = (function(_PolymerElement) {
    babelHelpers.inherits(SchemaBehaviors, _PolymerElement);
    function SchemaBehaviors() {
      babelHelpers.classCallCheck(this, SchemaBehaviors);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          SchemaBehaviors.__proto__ || Object.getPrototypeOf(SchemaBehaviors)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      SchemaBehaviors,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                SchemaBehaviors.prototype.__proto__ ||
                  Object.getPrototypeOf(SchemaBehaviors.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              SchemaBehaviors.haxProperties,
              SchemaBehaviors.tag,
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
              _templateObject_6e4e0cd0d70411e8919023f8494e2c4e()
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
                title: "Schema behaviors",
                description: "Automated conversion of schema-behaviors/",
                icon: "icons:android",
                color: "green",
                groups: ["Behaviors"],
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
            return "schema-behaviors";
          }
        }
      ]
    );
    return SchemaBehaviors;
  })(_polymerElement.PolymerElement);
  _exports.SchemaBehaviors = SchemaBehaviors;
  window.customElements.define(SchemaBehaviors.tag, SchemaBehaviors);
});
