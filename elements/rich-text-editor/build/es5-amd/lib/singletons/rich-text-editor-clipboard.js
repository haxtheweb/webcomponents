define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js"
], function(_exports, _polymerElement) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorClipboard = void 0;
  function _templateObject_a4e54c107cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n      <style>\n        :host {\n          display: none !important;\n        }\n      </style>\n      <textarea id="clipboard" aria-hidden="true"></textarea>\n    '
    ]);
    _templateObject_a4e54c107cbb11e98cbdc9dc12e6ca7b = function _templateObject_a4e54c107cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  /**
   * `rich-text-editor-clipboard`
   * `a heading picker for the rich-text-editor`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorClipboard = /*#__PURE__*/ (function(_PolymerElement) {
    babelHelpers.inherits(RichTextEditorClipboard, _PolymerElement);
    function RichTextEditorClipboard() {
      babelHelpers.classCallCheck(this, RichTextEditorClipboard);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers
          .getPrototypeOf(RichTextEditorClipboard)
          .apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      RichTextEditorClipboard,
      [
        {
          key: "ready",
          value: function ready() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(RichTextEditorClipboard.prototype),
                "ready",
                this
              )
              .call(this);
            var root = this;
            window.addEventListener("cut", root.handleCut.bind(root));
            window.addEventListener("copy", root.handleCopy.bind(root));
            window.addEventListener("paste", root.handlePaste.bind(root));
            window.addEventListener(
              "cut-button",
              root.handleCopyButton.bind(root)
            );
            window.addEventListener(
              "copy-button",
              root.handleCopyButton.bind(root)
            );
            window.addEventListener(
              "paste-button",
              root.handlePasteButton.bind(root)
            );
          }
        },
        {
          key: "handleCut",
          value: function handleCut(e) {
            e.preventDefault();
            this.copyToClipboard(this.getRange(), !0);
          }
        },
        {
          key: "handleCopy",
          value: function handleCopy(e) {
            e.preventDefault();
            this.copyToClipboard(this.getRange());
          }
        },
        {
          key: "handlePaste",
          value: function handlePaste(e) {
            e.preventDefault();
            this.pasteToClipboard(this.getRange());
          }
        },
        {
          key: "handleCutButton",
          value: function handleCutButton(e) {
            this.copyToClipboard(e.detail.selection, !0);
          }
        },
        {
          key: "handleCopyButton",
          value: function handleCopyButton(e) {
            this.copyToClipboard(e.detail.selection);
          }
        },
        {
          key: "handlePasteButton",
          value: function handlePasteButton(e) {
            this.pasteToClipboard(e.detail.selection);
          }
        },
        {
          key: "copyToClipboard",
          value: function copyToClipboard(selection) {
            var cut =
              1 < arguments.length && arguments[1] !== void 0
                ? arguments[1]
                : !1;
            this.$.clipboard.innerHTML = "";
            if (selection)
              this.$.clipboard.appendChild(selection.cloneContents());
            if (cut && selection.extractContents) selection.extractContents();
          }
        },
        {
          key: "pasteToClipboard",
          value: function pasteToClipboard(selection) {
            var div = document.createElement("div"),
              parent = selection.commonAncestorContainer.parentNode,
              closest = parent.closest(
                "[contenteditable=true]:not([disabled]),input:not([disabled]),textarea:not([disabled])"
              );
            if (closest) {
              div.innerHTML = this.$.clipboard.innerHTML;
              if (selection && selection.extractContents) {
                selection.extractContents();
                selection.insertNode(div);
                while (div.firstChild) {
                  div.parentNode.insertBefore(div.firstChild, div);
                }
                div.parentNode.removeChild(div);
              }
            }
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
        }
      ],
      [
        {
          key: "properties", // properties available to the custom element for data binding
          get: function get() {
            return {};
          }
        },
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_a4e54c107cbb11e98cbdc9dc12e6ca7b()
            );
          }
          /**
           * Store the tag name to make it easier to obtain directly.
           * @notice function name must be here for tooling to operate correctly
           */
        },
        {
          key: "tag",
          get: function get() {
            return "rich-text-editor-clipboard";
          }
        }
      ]
    );
    return RichTextEditorClipboard;
  })(_polymerElement.PolymerElement);
  _exports.RichTextEditorClipboard = RichTextEditorClipboard;
  window.customElements.define(
    RichTextEditorClipboard.tag,
    RichTextEditorClipboard
  );
  window.RichTextEditorClipboard = {};
  window.RichTextEditorClipboard.instance = null;
  /**
   * Checks to see if there is an instance available, and if not appends one
   */ window.RichTextEditorClipboard.requestAvailability = function() {
    if (null == window.RichTextEditorClipboard.instance) {
      window.RichTextEditorClipboard.instance = document.createElement(
        "rich-text-editor-clipboard"
      );
    }
    document.body.appendChild(window.RichTextEditorClipboard.instance);
    return window.RichTextEditorClipboard.instance;
  };
});
