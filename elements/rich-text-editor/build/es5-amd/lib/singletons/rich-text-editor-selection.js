define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "../rich-text-editor-styles.js"
], function(_exports, _polymerElement, _richTextEditorStyles) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorSelection = void 0;
  function _templateObject_a5c880207cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n      <style include="rich-text-editor-styles">\n        :host {\n          background-color: var(--rich-text-editor-selection-bg);\n          @apply --rich-text-editor-content-selection;\n        }\n        :host([hidden]) {\n          display: none;\n        }\n      </style>\n      <slot></slot>\n    '
    ]);
    _templateObject_a5c880207cbb11e98cbdc9dc12e6ca7b = function _templateObject_a5c880207cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  /**
   * `rich-text-editor-selection`
   * `a button for rich text editor (custom buttons can extend this)`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorSelection = /*#__PURE__*/ (function(_PolymerElement) {
    babelHelpers.inherits(RichTextEditorSelection, _PolymerElement);
    function RichTextEditorSelection() {
      babelHelpers.classCallCheck(this, RichTextEditorSelection);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers
          .getPrototypeOf(RichTextEditorSelection)
          .apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      RichTextEditorSelection,
      [
        {
          key: "connectedCallback",
          /**
           * life cycle, element is afixed to the DOM
           */ value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(RichTextEditorSelection.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            var root = this;
            document.addEventListener("selectionchange", function(e) {
              root.range = root.getRange();
            });
            document.addEventListener(
              "select-rich-text-editor-editor",
              function(e) {
                root._editorChange(e);
              }
            );
            document.addEventListener(
              "deselect-rich-text-editor-editor",
              function(e) {
                root._editorChange(e);
              }
            );
          }
          /**
           * life cycle, element is disconnected
           */
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(RichTextEditorSelection.prototype),
                "disconnectedCallback",
                this
              )
              .call(this);
            var root = this;
            document.removeEventListener("selectionchange", function(e) {
              root.range = root.getRange();
            });
            document.removeEventListener(
              "select-rich-text-editor-editor",
              function(e) {
                root._editorChange(e);
              }
            );
            document.removeEventListener(
              "deselect-rich-text-editor-editor",
              function(e) {
                root._editorChange(e);
              }
            );
          }
          /**
           * Normalizes selection data.
           *
           * @returns {object} the selection
           */
        },
        {
          key: "getRange",
          value: function getRange() {
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
              return sel.getRangeAt(0);
            } else if (sel) {
              return sel;
            } else !1;
          }
          /**
           * Updates the toolbar
           */
        },
        {
          key: "_updateToolbar",
          value: function _updateToolbar() {
            var deleteme = "hello";
            this.getWrapper();
            if (this.toolbar) this.toolbar.selection = this.range;
          }
          /**
           * Updates the selection based on toolbar and editor
           */
        },
        {
          key: "_editorChange",
          value: function _editorChange(e) {
            var deselect =
                1 < arguments.length && arguments[1] !== void 0
                  ? arguments[1]
                  : !1,
              root = this,
              editorChange = root.editor !== e.detail.editor,
              toolbarChange = root.toolbar !== e.detail.toolbar;
            if (deselect || editorChange || toolbarChange) {
              var sel = window.getSelection();
              sel.removeAllRanges();
              root.editor = e.detail.editor;
              root.toolbar = e.detail.toolbar;
              if (root.observer) root.observer.disconnect();
              if (!deselect && e.detail.editor) {
                root.observer = new MutationObserver(function(evt) {
                  root.range = root.getRange();
                });
                root.observer.observe(e.detail.editor, {
                  attributes: !1,
                  childList: !0,
                  subtree: !0,
                  characterData: !1
                });
              }
            }
          }
          /**
           * wraps the range
           */
        },
        {
          key: "getWrapper",
          value: function getWrapper() {
            if (this.range) {
              var ancestor = this.range.commonAncestorContainer,
                parent = ancestor ? ancestor.parentNode : null;
              return ancestor && ancestor.tagName
                ? ancestor
                : parent && ancestor.parentNode.tagName
                ? ancestor.parentNode
                : null;
            }
          }
        },
        {
          key: "wrapOrGetTag",
          value: function wrapOrGetTag(tag) {
            var wrapper = this.getWrapper();
            if (
              tag &&
              (!wrapper || tag.toLowerCase() !== wrapper.tagName.toLowerCase())
            ) {
              wrapper = document.createElement(tag);
              this.wrap(wrapper);
            }
            return wrapper;
          }
        },
        {
          key: "setRangeContents",
          value: function setRangeContents(node) {
            if (this.range) {
              this.range.deleteContents();
              this.range.insertNode(node);
            }
          }
        },
        {
          key: "expandRange",
          value: function expandRange(node) {
            if (this.range) {
              this.range.deleteContents();
              this.range.insertNode(node);
            }
          }
        },
        {
          key: "getRangeContents",
          value: function getRangeContents() {
            return this.range ? this.range.cloneContents() : null;
          }
          /**
           * unwraps the range
           */
        },
        {
          key: "unwrap",
          value: function unwrap(wrapper) {
            if (wrapper.parentNode) {
              wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
              document.body.appendChild(wrapper);
            }
          }
          /**
           * wraps the range (or unwraps ir)
           */
        },
        {
          key: "wrap",
          value: function wrap(wrapper) {
            wrapper.appendChild(this.range.extractContents());
            this.range.insertNode(wrapper);
          }
          /**
           * adds or removes the hightlight
           * @param {boolean} off if true, turns highlight off
           */
        },
        {
          key: "addHighlight",
          value: function addHighlight() {
            var root = this;
            root.dispatchEvent(new CustomEvent("highlight", { detail: root }));
            root.appendChild(this.range.extractContents());
            root.range.insertNode(root);
            root.hidden = !1;
          }
          /**
           * adds or removes the hightlight
           * @param {boolean} off if true, turns highlight off
           */
        },
        {
          key: "removeHighlight",
          value: function removeHighlight() {
            var root = this;
            while (root.firstChild) {
              root.parentNode.insertBefore(root.firstChild, root);
            }
            document.body.appendChild(root);
            root.hidden = !0;
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
        }
      ],
      [
        {
          key: "template", // render function
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_a5c880207cbb11e98cbdc9dc12e6ca7b()
            );
          } // properties available to the custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return {
              editor: { type: Object, value: null },
              hidden: { type: Boolean, value: !0, reflectToAttribute: !0 },
              observer: { type: Object, value: null },
              range: { type: Object, value: null, observer: "_updateToolbar" },
              toolbar: { type: Object, value: null }
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
            return "rich-text-editor-selection";
          }
        }
      ]
    );
    return RichTextEditorSelection;
  })(_polymerElement.PolymerElement);
  _exports.RichTextEditorSelection = RichTextEditorSelection;
  window.customElements.define(
    RichTextEditorSelection.tag,
    RichTextEditorSelection
  );
  window.RichTextEditorSelection = {};
  window.RichTextEditorSelection.instance = null;
  /**
   * Checks to see if there is an instance available, and if not appends one
   */ window.RichTextEditorSelection.requestAvailability = function() {
    if (null == window.RichTextEditorSelection.instance) {
      window.RichTextEditorSelection.instance = document.createElement(
        "rich-text-editor-selection"
      );
    }
    document.body.appendChild(window.RichTextEditorSelection.instance);
    return window.RichTextEditorSelection.instance;
  };
});
