define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.BuildForEdit = void 0;
  function _templateObject_e9e0a640d6ec11e8a00141c006540441() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_e9e0a640d6ec11e8a00141c006540441 = function() {
      return data;
    };
    return data;
  }
  var BuildForEdit = (function(_PolymerElement) {
    babelHelpers.inherits(BuildForEdit, _PolymerElement);
    function BuildForEdit() {
      babelHelpers.classCallCheck(this, BuildForEdit);
      return babelHelpers.possibleConstructorReturn(
        this,
        (BuildForEdit.__proto__ || Object.getPrototypeOf(BuildForEdit)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      BuildForEdit,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                BuildForEdit.prototype.__proto__ ||
                  Object.getPrototypeOf(BuildForEdit.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              BuildForEdit.haxProperties,
              BuildForEdit.tag,
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
              _templateObject_e9e0a640d6ec11e8a00141c006540441()
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
                title: "Build for-edit",
                description: "Automated conversion of build-for-edit/",
                icon: "icons:android",
                color: "green",
                groups: ["For"],
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
            return "build-for-edit";
          }
        }
      ]
    );
    return BuildForEdit;
  })(_polymerElement.PolymerElement);
  _exports.BuildForEdit = BuildForEdit;
  window.customElements.define(BuildForEdit.tag, BuildForEdit);
});
