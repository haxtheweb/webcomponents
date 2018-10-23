define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnMarkdownEditor = void 0;
  function _templateObject_7aa925b0d6f411e8a6c5196223595f90() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_7aa925b0d6f411e8a6c5196223595f90 = function() {
      return data;
    };
    return data;
  }
  var LrnMarkdownEditor = (function(_PolymerElement) {
    babelHelpers.inherits(LrnMarkdownEditor, _PolymerElement);
    function LrnMarkdownEditor() {
      babelHelpers.classCallCheck(this, LrnMarkdownEditor);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrnMarkdownEditor.__proto__ ||
          Object.getPrototypeOf(LrnMarkdownEditor)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrnMarkdownEditor,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnMarkdownEditor.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnMarkdownEditor.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnMarkdownEditor.haxProperties,
              LrnMarkdownEditor.tag,
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
              _templateObject_7aa925b0d6f411e8a6c5196223595f90()
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
                title: "Lrn markdown-editor",
                description: "Automated conversion of lrn-markdown-editor/",
                icon: "icons:android",
                color: "green",
                groups: ["Markdown"],
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
            return "lrn-markdown-editor";
          }
        }
      ]
    );
    return LrnMarkdownEditor;
  })(_polymerElement.PolymerElement);
  _exports.LrnMarkdownEditor = LrnMarkdownEditor;
  window.customElements.define(LrnMarkdownEditor.tag, LrnMarkdownEditor);
});
