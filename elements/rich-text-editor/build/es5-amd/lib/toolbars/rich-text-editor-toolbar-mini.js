define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "./rich-text-editor-toolbar.js",
  "../../node_modules/@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js"
], function(
  _exports,
  _polymerElement,
  _richTextEditorToolbar,
  _absolutePositionBehavior
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorToolbarMini = void 0;
  function _templateObject_a50509107cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n      ",
      '\n      <style>\n        :host #floating {\n          display: flex;\n        }\n      </style>\n      <absolute-position-behavior\n        auto\n        id="floating"\n        fit-to-visible-bounds\n        for$="[[controls]]"\n        position="top"\n      >\n        ',
      "\n      </absolute-position-behavior>\n    "
    ]);
    _templateObject_a50509107cbb11e98cbdc9dc12e6ca7b = function _templateObject_a50509107cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  /**
   * `rich-text-editor-toolbar-mini`
   * `a mini floating toolbar for the rich text editor`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   * @demo demo/mini.html mini floating toolbar
   */ var RichTextEditorToolbarMini = /*#__PURE__*/ (function(
    _RichTextEditorToolba
  ) {
    babelHelpers.inherits(RichTextEditorToolbarMini, _RichTextEditorToolba);
    function RichTextEditorToolbarMini() {
      var _this;
      babelHelpers.classCallCheck(this, RichTextEditorToolbarMini);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(RichTextEditorToolbarMini).call(this)
      );
      _this.config = [
        {
          label: "Basic Inline Operations",
          type: "button-group",
          buttons: [
            {
              command: "bold",
              icon: "editor:format-bold",
              label: "Bold",
              toggles: !0,
              type: "rich-text-editor-button"
            },
            {
              command: "italic",
              icon: "editor:format-italic",
              label: "Italics",
              toggles: !0,
              type: "rich-text-editor-button"
            },
            {
              collapsedUntil: "md",
              command: "removeFormat",
              icon: "editor:format-clear",
              label: "Erase Format",
              type: "rich-text-editor-button"
            }
          ]
        },
        {
          label: "Links",
          type: "button-group",
          buttons: [
            {
              command: "link",
              icon: "link",
              label: "Link",
              prompt: "href",
              toggledCommand: "unlink",
              toggledIcon: "mdextra:unlink",
              toggledLabel: "Unink",
              toggles: !0,
              type: "rich-text-editor-link"
            }
          ]
        },
        {
          collapsedUntil: "md",
          label: "Subscript and Superscript",
          type: "button-group",
          buttons: [
            {
              command: "subscript",
              icon: "mdextra:subscript",
              label: "Subscript",
              toggles: !0,
              type: "rich-text-editor-button"
            },
            {
              command: "superscript",
              icon: "mdextra:superscript",
              label: "Superscript",
              toggles: !0,
              type: "rich-text-editor-button"
            }
          ]
        },
        {
          collapsedUntil: "sm",
          label: "Lists and Indents",
          type: "button-group",
          buttons: [
            {
              command: "insertOrderedList",
              icon: "editor:format-list-numbered",
              label: "Ordered List",
              toggles: !0,
              type: "rich-text-editor-button"
            },
            {
              command: "insertUnorderedList",
              icon: "editor:format-list-bulleted",
              label: "Unordered List",
              toggles: !0,
              type: "rich-text-editor-button"
            }
          ]
        }
      ];
      return _this;
    } // render function
    babelHelpers.createClass(RichTextEditorToolbarMini, null, [
      {
        key: "template",
        get: function get() {
          return (0, _polymerElement.html)(
            _templateObject_a50509107cbb11e98cbdc9dc12e6ca7b(),
            this.styleTemplate,
            this.toolbarTemplate
          );
        } // properties available to the custom element for data binding
      },
      {
        key: "properties",
        get: function get() {
          return {
            /**
             * Sticky is not available on the mini toolbar
             */ sticky: {
              name: "sticky",
              type: Boolean,
              value: !1,
              readOnly: !0
            }
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
          return "rich-text-editor-toolbar-mini";
        }
      }
    ]);
    return RichTextEditorToolbarMini;
  })(_richTextEditorToolbar.RichTextEditorToolbar);
  _exports.RichTextEditorToolbarMini = RichTextEditorToolbarMini;
  window.customElements.define(
    RichTextEditorToolbarMini.tag,
    RichTextEditorToolbarMini
  );
});
