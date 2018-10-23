define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.CodeEditor = void 0;
  function _templateObject_17b5efc0d6ee11e88cbb43291b7c1636() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_17b5efc0d6ee11e88cbb43291b7c1636 = function() {
      return data;
    };
    return data;
  }
  var CodeEditor = (function(_PolymerElement) {
    babelHelpers.inherits(CodeEditor, _PolymerElement);
    function CodeEditor() {
      babelHelpers.classCallCheck(this, CodeEditor);
      return babelHelpers.possibleConstructorReturn(
        this,
        (CodeEditor.__proto__ || Object.getPrototypeOf(CodeEditor)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      CodeEditor,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                CodeEditor.prototype.__proto__ ||
                  Object.getPrototypeOf(CodeEditor.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              CodeEditor.haxProperties,
              CodeEditor.tag,
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
              _templateObject_17b5efc0d6ee11e88cbb43291b7c1636()
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
                title: "Code editor",
                description: "Automated conversion of code-editor/",
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
            return "code-editor";
          }
        }
      ]
    );
    return CodeEditor;
  })(_polymerElement.PolymerElement);
  _exports.CodeEditor = CodeEditor;
  window.customElements.define(CodeEditor.tag, CodeEditor);
});
