define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.EditableTable = void 0;
  function _templateObject_b08e81d0d6ee11e8b79c239b3836c732() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_b08e81d0d6ee11e8b79c239b3836c732 = function() {
      return data;
    };
    return data;
  }
  var EditableTable = (function(_PolymerElement) {
    babelHelpers.inherits(EditableTable, _PolymerElement);
    function EditableTable() {
      babelHelpers.classCallCheck(this, EditableTable);
      return babelHelpers.possibleConstructorReturn(
        this,
        (EditableTable.__proto__ || Object.getPrototypeOf(EditableTable)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      EditableTable,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                EditableTable.prototype.__proto__ ||
                  Object.getPrototypeOf(EditableTable.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              EditableTable.haxProperties,
              EditableTable.tag,
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
              _templateObject_b08e81d0d6ee11e8b79c239b3836c732()
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
                title: "Editable table",
                description: "Automated conversion of editable-table/",
                icon: "icons:android",
                color: "green",
                groups: ["Table"],
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
            return "editable-table";
          }
        }
      ]
    );
    return EditableTable;
  })(_polymerElement.PolymerElement);
  _exports.EditableTable = EditableTable;
  window.customElements.define(EditableTable.tag, EditableTable);
});
