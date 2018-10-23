define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.DropdownSelect = void 0;
  function _templateObject_77f9a4d0d6ee11e89f9d0f644dca052a() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_77f9a4d0d6ee11e89f9d0f644dca052a = function() {
      return data;
    };
    return data;
  }
  var DropdownSelect = (function(_PolymerElement) {
    babelHelpers.inherits(DropdownSelect, _PolymerElement);
    function DropdownSelect() {
      babelHelpers.classCallCheck(this, DropdownSelect);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          DropdownSelect.__proto__ || Object.getPrototypeOf(DropdownSelect)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      DropdownSelect,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                DropdownSelect.prototype.__proto__ ||
                  Object.getPrototypeOf(DropdownSelect.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              DropdownSelect.haxProperties,
              DropdownSelect.tag,
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
              _templateObject_77f9a4d0d6ee11e89f9d0f644dca052a()
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
                title: "Dropdown select",
                description: "Automated conversion of dropdown-select/",
                icon: "icons:android",
                color: "green",
                groups: ["Select"],
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
            return "dropdown-select";
          }
        }
      ]
    );
    return DropdownSelect;
  })(_polymerElement.PolymerElement);
  _exports.DropdownSelect = DropdownSelect;
  window.customElements.define(DropdownSelect.tag, DropdownSelect);
});
