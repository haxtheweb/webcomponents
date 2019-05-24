define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "./lib/rich-text-editor-styles.js",
  "./lib/singletons/rich-text-editor-clipboard.js",
  "./lib/toolbars/rich-text-editor-toolbar.js",
  "./lib/toolbars/rich-text-editor-toolbar-mini.js",
  "./lib/toolbars/rich-text-editor-toolbar-full.js"
], function(
  _exports,
  _polymerElement,
  _HAXWiring,
  _ironA11yKeys,
  _richTextEditorStyles,
  _richTextEditorClipboard,
  _richTextEditorToolbar,
  _richTextEditorToolbarMini,
  _richTextEditorToolbarFull
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditor = void 0;
  function _templateObject_a45408907cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n<style>:host([hidden]) {\n  display: none;\n}\n:host {\n  display: block;\n  min-height: 20px;\n  cursor: pointer;\n  @apply --rich-text-editor-content;\n}\n:host([contenteditable="true"]) {\n  border: var(--rich-text-editor-border);\n  overflow: auto;\n  @apply --rich-text-editor-content-edit;\n}\n:host(.heightmax[contenteditable="true"]) {\n  max-height: calc(100vh - 200px);\n  overflow-y: scroll;\n}\n:host([contenteditable="true"]):empty:before {\n  content: attr(placeholder);\n  display: block;\n  @apply --rich-text-editor-content-placeholder;\n}\nspan {\n  background-color: blue;\n}\n.rich-text-editor-selection {\n  background-color: var(--rich-text-editor-selection-bg);\n  @apply --rich-text-editor-content-selection;\n}</style>\n<style include="rich-text-editor-styles"></style>\n<slot></slot>'
    ]);
    _templateObject_a45408907cbb11e98cbdc9dc12e6ca7b = function _templateObject_a45408907cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  /**
   * `rich-text-editor`
   * `a standalone rich text editor`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   * @demo demo/index.html demo
   * @demo demo/mini.html mini floating toolbar
   * @demo demo/full.html toolbar with breadcrumb
   * @demo demo/config.html custom configuration
   */ var RichTextEditor = /*#__PURE__*/ (function(_PolymerElement) {
    babelHelpers.inherits(RichTextEditor, _PolymerElement);
    function RichTextEditor() {
      babelHelpers.classCallCheck(this, RichTextEditor);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(RichTextEditor).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      RichTextEditor,
      [
        {
          key: "connectedCallback",
          /**
           * life cycle, element is afixed to the DOM
           */ value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(RichTextEditor.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            var style = document.createElement("style");
            style.setAttribute("is", "custom-style");
            style.setAttribute("include", "rich-text-editor-styles");
            if (!this.id) this.id = this._generateUUID();
            document.head.append(style);
          }
          /**
           * ready
           */
        },
        {
          key: "ready",
          value: function ready() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(RichTextEditor.prototype),
                "ready",
                this
              )
              .call(this);
            this.getEditor();
          }
          /**
           * connects the mini-toolbar to a mini editor
           */
        },
        {
          key: "getEditor",
          value: function getEditor() {
            window.RichTextEditorClipboard.requestAvailability();
            var root = this,
              toolbar = "rich-text-editor-toolbar",
              id = this.toolbar ? "#" + this.toolbar : "",
              type =
                "full" === this.type || "mini" === this.type
                  ? "-" + this.type
                  : "",
              both = document.querySelector(toolbar + type + id),
              idOnly = document.querySelector(
                toolbar +
                  id +
                  "," +
                  toolbar +
                  "-full" +
                  id +
                  "," +
                  toolbar +
                  "-mini" +
                  id
              ),
              typeOnly = document.querySelector(toolbar + type), //try to match both id and type, if no match try id only, and then type only
              editor = both || idOnly || typeOnly; //if still no match, create a region of type
            if (!this.toolbar) this.toolbar = this._generateUUID();
            if (!editor || !editor.addEditableRegion) {
              editor = document.createElement(toolbar + type);
              editor.id = this.toolbar;
              root.parentNode.appendChild(editor);
            }
            editor.addEditableRegion(root);
          }
          /**
           * Normalizes selection data.
           *
           * @returns {object} the selection
           */
        },
        {
          key: "_getRange",
          value: function _getRange() {
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
              return sel.getRangeAt(0);
            } else if (sel) {
              return sel;
            } else !1;
          }
          /**
           * Generate a UUID
           */
        },
        {
          key: "_generateUUID",
          value: function _generateUUID() {
            var hex = Math.floor(65536 * (1 + Math.random()))
              .toString(16)
              .substring(1);
            return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
          }
          /**
           * life cycle, element is removed from the DOM
           */ //disconnectedCallback() {}
        }
      ],
      [
        {
          key: "template", // render function
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_a45408907cbb11e98cbdc9dc12e6ca7b()
            );
          } // haxProperty definition
        },
        {
          key: "haxProperties",
          get: function get() {
            return {
              canScale: !0,
              canPosition: !0,
              canEditSource: !1,
              gizmo: {
                title: "Rich text-editor",
                description: "a standalone rich text editor",
                icon: "icons:android",
                color: "green",
                groups: ["Text"],
                handles: [{ type: "todo:read-the-docs-for-usage" }],
                meta: { author: "nikkimk", owner: "Penn State University" }
              },
              settings: {
                quick: [],
                configure: [
                  {
                    property: "title",
                    description: "",
                    inputMethod: "textfield",
                    required: !1,
                    icon: "icons:android"
                  }
                ],
                advanced: []
              }
            };
          } // properties available to the custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * The id for the toolbar
               */ toolbar: { name: "toolbar", type: "String", value: "" },
              /**
               * The editor's unique id
               */ id: { name: "id", type: "String", value: "" },
              /**
               * The type of editor toolbar, i.e.
               * `full` for full toolbar with breadcrumb,
               * `mini` for mini floating toolbar, or
               * the default toolbar if neither.
               */ type: { name: "type", type: "String", value: "" }
            };
          }
          /**
           * Store the tag name to make it easier to obtain directly.
           * @notice function name must be here for tooling to operate correctly
           */
        },
        {
          key: "tag",
          get: function get() {
            return "rich-text-editor";
          }
        }
      ]
    );
    return RichTextEditor;
  })(_polymerElement.PolymerElement);
  _exports.RichTextEditor = RichTextEditor;
  window.customElements.define(RichTextEditor.tag, RichTextEditor);
});
