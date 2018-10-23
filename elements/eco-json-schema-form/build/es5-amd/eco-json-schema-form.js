define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.EcoJsonSchemaForm = void 0;
  function _templateObject_93b58ef0d6ee11e8b29d0dbf6437317f() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_93b58ef0d6ee11e8b29d0dbf6437317f = function() {
      return data;
    };
    return data;
  }
  var EcoJsonSchemaForm = (function(_PolymerElement) {
    babelHelpers.inherits(EcoJsonSchemaForm, _PolymerElement);
    function EcoJsonSchemaForm() {
      babelHelpers.classCallCheck(this, EcoJsonSchemaForm);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          EcoJsonSchemaForm.__proto__ ||
          Object.getPrototypeOf(EcoJsonSchemaForm)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      EcoJsonSchemaForm,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                EcoJsonSchemaForm.prototype.__proto__ ||
                  Object.getPrototypeOf(EcoJsonSchemaForm.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              EcoJsonSchemaForm.haxProperties,
              EcoJsonSchemaForm.tag,
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
              _templateObject_93b58ef0d6ee11e8b29d0dbf6437317f()
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
                title: "Eco json-schema-form",
                description: "Automated conversion of eco-json-schema-form/",
                icon: "icons:android",
                color: "green",
                groups: ["Json"],
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
            return "eco-json-schema-form";
          }
        }
      ]
    );
    return EcoJsonSchemaForm;
  })(_polymerElement.PolymerElement);
  _exports.EcoJsonSchemaForm = EcoJsonSchemaForm;
  window.customElements.define(EcoJsonSchemaForm.tag, EcoJsonSchemaForm);
});
