define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "../../node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js",
  "../../rich-text-editor.js",
  "../rich-text-editor-styles.js",
  "../singletons/rich-text-editor-selection.js",
  "../buttons/rich-text-editor-button.js",
  "../buttons/rich-text-editor-more-button.js",
  "../buttons/rich-text-editor-heading-picker.js",
  "../buttons/rich-text-editor-symbol-picker.js",
  "../buttons/rich-text-editor-link.js",
  "../buttons/rich-text-editor-button-styles.js",
  "../../node_modules/@polymer/iron-icons/iron-icons.js",
  "../../node_modules/@polymer/iron-icons/editor-icons.js",
  "../../node_modules/@polymer/iron-icons/image-icons.js",
  "../../node_modules/@lrnwebcomponents/md-extra-icons/md-extra-icons.js"
], function(
  _exports,
  _polymerElement,
  _responsiveUtility,
  _richTextEditor,
  _richTextEditorStyles,
  _richTextEditorSelection,
  _richTextEditorButton,
  _richTextEditorMoreButton,
  _richTextEditorHeadingPicker,
  _richTextEditorSymbolPicker,
  _richTextEditorLink,
  _richTextEditorButtonStyles,
  _ironIcons,
  _editorIcons,
  _imageIcons,
  _mdExtraIcons
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorToolbar = void 0;
  function _templateObject4_a4fd67f07cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n      ",
      " ",
      " ",
      "\n    "
    ]);
    _templateObject4_a4fd67f07cbb11e98cbdc9dc12e6ca7b = function _templateObject4_a4fd67f07cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  function _templateObject3_a4fd67f07cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n      <div\n        id="toolbar"\n        aria-live="polite"\n        aria-hidden$="[[!controls]]"\n        collapsed$="[[collapsed]]"\n      >\n        <rich-text-editor-more-button\n          id="morebutton"\n          class="button"\n          controls="toolbar"\n          icon$="[[moreIcon]]"\n          label$="[[moreLabel]]"\n          show-text-label$="[[moreShowTextLabel]]"\n          label-toggled$="[[moreLabelToggled]]"\n          toggled$="[[!collapsed]]"\n          on-tap="_toggleMore"\n        >\n        </rich-text-editor-more-button>\n      </div>\n    '
    ]);
    _templateObject3_a4fd67f07cbb11e98cbdc9dc12e6ca7b = function _templateObject3_a4fd67f07cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  function _templateObject2_a4fd67f07cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n      <style include="rich-text-editor-styles"></style>\n      <style include="rich-text-editor-button-styles">\n        :host([hidden]) {\n          display: none;\n        }\n        :host #toolbar {\n          display: flex;\n          opacity: 1;\n          margin: 0;\n          align-items: stretch;\n          flex-wrap: wrap;\n          justify-content: flex-start;\n          background-color: var(--rich-text-editor-bg);\n          border: var(--rich-text-editor-border);\n          font-size: 12px;\n          transition: all 0.5s;\n          @apply --rich-text-editor-toolbar;\n        }\n        :host #toolbar[aria-hidden] {\n          visibility: hidden;\n          opacity: 0;\n          height: 0;\n        }\n        :host #toolbar .group {\n          display: flex;\n          flex-wrap: nowrap;\n          justify-content: space-evenly;\n          align-items: stretch;\n          padding: 0 3px;\n          @apply --rich-text-editor-toolbar-group;\n        }\n        :host #toolbar .group:not(:last-of-type) {\n          margin-right: 3px;\n          border-right: var(--rich-text-editor-border);\n          @apply --rich-text-editor-toolbar-divider;\n        }\n        :host #toolbar .button {\n          display: flex;\n          flex: 0 0 auto;\n          align-items: stretch;\n        }\n        :host #toolbar #morebutton {\n          flex: 1 0 auto;\n          justify-content: flex-end;\n        }\n        /* hide the more button if all the buttons are displayed */\n        :host([responsive-size="xs"]) #morebutton[collapse-max="xs"],\n        :host([responsive-size="sm"]) #morebutton[collapse-max*="s"],\n        :host([responsive-size="md"]) #morebutton:not([collapse-max*="l"]),\n        :host([responsive-size="lg"]) #morebutton:not([collapse-max="xl"]),\n        :host([responsive-size="xl"]) #morebutton,\n        /* hide the buttons if they should be collaped until */\n        :host([responsive-size="xs"]) #toolbar[collapsed] *[collapsed-until*="m"],\n        :host([responsive-size="xs"]) #toolbar[collapsed] *[collapsed-until*="l"],\n        :host([responsive-size="sm"]) #toolbar[collapsed] *[collapsed-until="md"],\n        :host([responsive-size="sm"]) #toolbar[collapsed] *[collapsed-until*="l"],\n        :host([responsive-size="md"]) #toolbar[collapsed] *[collapsed-until*="l"],\n        :host([responsive-size="lg"]) #toolbar[collapsed] *[collapsed-until="xl"] {\n          display: none;\n        }\n      </style>\n    '
    ]);
    _templateObject2_a4fd67f07cbb11e98cbdc9dc12e6ca7b = function _templateObject2_a4fd67f07cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  function _templateObject_a4fd67f07cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n      <style>\n        :host([sticky]) {\n          position: sticky;\n          top: 0;\n        }\n      </style>\n    "
    ]);
    _templateObject_a4fd67f07cbb11e98cbdc9dc12e6ca7b = function _templateObject_a4fd67f07cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  /**
   * `rich-text-editor-toolbar`
   * `a basic toolbar for the rich text editor`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   * @demo demo/index.html demo
   * @demo demo/config.html custom configuration
   */ var RichTextEditorToolbar = /*#__PURE__*/ (function(_PolymerElement) {
    babelHelpers.inherits(RichTextEditorToolbar, _PolymerElement);
    function RichTextEditorToolbar() {
      babelHelpers.classCallCheck(this, RichTextEditorToolbar);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers
          .getPrototypeOf(RichTextEditorToolbar)
          .apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      RichTextEditorToolbar,
      [
        {
          key: "connectedCallback",
          /**
           * life cycle, element is afixed to the DOM
           */ value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(RichTextEditorToolbar.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            var root = this;
            window.RichTextEditorSelection.requestAvailability();
            window.ResponsiveUtility.requestAvailability();
            window.dispatchEvent(
              new CustomEvent("responsive-element", {
                detail: {
                  element: root,
                  attribute: "responsive-size",
                  relativeToParent: !0
                }
              })
            );
          }
          /**
           * life cycle, element is disconnected
           */
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            var root = this; //unbind the the toolbar to the rich-text-editor-selection
            root.dispatchEvent(
              new CustomEvent("deselect-rich-text-editor-editor", {
                bubbles: !0,
                cancelable: !0,
                composed: !0,
                detail: { toolbar: root, editor: root.editor }
              })
            );
          }
          /**
           * adds an editor
           *
           * @param {object} an HTML object that can be edited
           */
        },
        {
          key: "addEditableRegion",
          value: function addEditableRegion(editor) {
            var root = this;
            editor.addEventListener("keydown", function(e) {
              root.editTarget(editor);
            });
            editor.addEventListener("mousedown", function(e) {
              root.editTarget(editor);
            });
            editor.addEventListener("blur", function(e) {
              if (
                null === e.relatedTarget ||
                "rich-text-editor" === !e.relatedTarget.startsWith
              )
                root.editTarget(null); //root.getUpdatedSelection();
            }); /*editor.addEventListener("mouseout", e => {
      root.getUpdatedSelection();
    });*/
          }
          /**
           * cancels edits to the active editor
           */
        },
        {
          key: "cancel",
          value: function cancel() {
            this.editor.innerHTML = this.canceled;
            this.editTarget(null);
          }
          /**
           * makes a editor editable
           *
           * @param {object} an HTML object that can be edited
           */
        },
        {
          key: "editTarget",
          value: function editTarget(editor) {
            var root = this,
              sel = window.getSelection();
            if (root.editor !== editor) {
              //save changes to previous editor
              if (null !== root.editor) {
                root.editor.contentEditable = !1;
                root.editor = null;
              } //bind the the toolbar to the rich-text-editor-selection
              root.dispatchEvent(
                new CustomEvent("select-rich-text-editor-editor", {
                  bubbles: !0,
                  cancelable: !0,
                  composed: !0,
                  detail: { toolbar: root, editor: root.editor }
                })
              );
              root.editor = editor;
              if (editor) {
                editor.parentNode.insertBefore(root, editor);
                root.canceled = editor.innerHTML;
                root.editor.contentEditable = !0;
                root.controls = editor.getAttribute("id");
              } else {
                root.controls = null;
              }
            }
          }
          /**
           * Gets the updated selection.
           */
        },
        {
          key: "_selectionChange",
          value: function _selectionChange() {
            var root = this;
            root.buttons.forEach(function(button) {
              button.selection = null;
              button.selection = root.selection;
            });
          }
          /**
           * make an new editable element
           *
           * @param {object} an HTML object that can be edited
           */
        },
        {
          key: "makeEditableRegion",
          value: function makeEditableRegion(editor) {
            var root = this,
              content = document.createElement("rich-text-editor");
            editor.parentNode.insertBefore(content, editor);
            content.appendChild(editor);
            root.addEditableRegion(content);
          }
          /**
           * removes an editor
           *
           * @param {object} an HTML object that can be edited
           */
        },
        {
          key: "removeEditableRegion",
          value: function removeEditableRegion(editor) {
            var root = this;
            editor.removeEventListener("click", function(e) {
              root.editTarget(editor);
            });
            editor.removeEventListener("blur", function(e) {
              if (
                null === e.relatedTarget ||
                "rich-text-editor" === !e.relatedTarget.startsWith
              )
                root.editTarget(null);
              root.getUpdatedSelection();
            });
            editor.removeEventListener("mouseout", function(e) {
              root.getUpdatedSelection();
            });
          }
          /**
           * Adds a button to the toolbar
           *
           * @param {object} the child object in the config object
           * @param {object} the parent object in the config object
           */
        },
        {
          key: "_addButton",
          value: function _addButton(child, parent) {
            var root = this,
              button = document.createElement(child.type);
            for (var key in child) {
              button[key] = child[key];
            }
            button.setAttribute("class", "button");
            button.addEventListener("deselect", function(e) {
              if (root.range && root.range.collapse) root.range.collapse(!1);
            });
            parent.appendChild(button);
            return button;
          }
          /**
           * Gets the groups array for the dom-repeat.
           *
           * @param {object} the toolbar buttons config object
           * @param {array} an array the buttons grouped by size
           */
        },
        {
          key: "_getButtons",
          value: function _getButtons(config) {
            var root = this,
              toolbar = root.$.toolbar,
              more = this.$.morebutton,
              max = 0,
              sizes = ["xs", "sm", "md", "lg", "xl"],
              temp = [];
            toolbar.innerHTML = "";
            config.forEach(function(item) {
              if ("button-group" === item.type) {
                var group = document.createElement("div");
                group.setAttribute("class", "group");
                if (
                  item.collapsedUntil !== void 0 &&
                  null !== item.collapsedUntil
                )
                  group.setAttribute("collapsed-until", item.collapsedUntil);
                max = Math.max(max, sizes.indexOf(item.collapsedUntil));
                item.buttons.forEach(function(button) {
                  max = Math.max(max, sizes.indexOf(button.collapsedUntil));
                  temp.push(root._addButton(button, group));
                });
                toolbar.appendChild(group);
              } else {
                max = Math.max(max, sizes.indexOf(item.collapsedUntil));
                temp.push(root._addButton(item, toolbar));
              }
              toolbar.appendChild(more);
              more.collapseMax = sizes[max];
            });
            return temp;
          }
          /**
           * updates breadcrumb sticky
           */
        },
        {
          key: "_stickyChanged",
          value: function _stickyChanged(newVal, oldVal) {
            if (this.__breadcrumbs) this.__breadcrumbs.sticky = this.sticky;
          }
          /**
           * Toggles collapsed mode when `rich-text-editor-more-button` is tapped
           * @param {object} e the `rich-text-editor-more-button` tap event
           * @returns {void}
           */
        },
        {
          key: "_toggleMore",
          value: function _toggleMore(e) {
            this.collapsed = !this.collapsed;
          }
        }
      ],
      [
        {
          key: "stickyTemplate", // render function for styles
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_a4fd67f07cbb11e98cbdc9dc12e6ca7b()
            );
          } // render function for styles
        },
        {
          key: "styleTemplate",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject2_a4fd67f07cbb11e98cbdc9dc12e6ca7b()
            );
          } // render function for toolbar
        },
        {
          key: "toolbarTemplate",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject3_a4fd67f07cbb11e98cbdc9dc12e6ca7b()
            );
          } // render function for template
        },
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject4_a4fd67f07cbb11e98cbdc9dc12e6ca7b(),
              this.styleTemplate,
              this.stickyTemplate,
              this.toolbarTemplate
            );
          } // properties available to the custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * The editor buttons, as determined by `config`.
               */ buttons: {
                name: "buttons",
                type: Array,
                computed: "_getButtons(config)"
              },
              /**
               * The editable content, if edits are canceled.
               */ canceled: { name: "canceled", type: Object, value: !0 },
              /**
               * Is the toolbar collapsed?
               */ collapsed: { name: "collapsed", type: Boolean, value: !0 },
              /**
               * Custom configuration of toolbar groups and buttons.
               * (See default value for example using default configuration.)
               */ config: {
                name: "config",
                type: Object,
                value: [
                  {
                    label: "History",
                    type: "button-group",
                    buttons: [
                      {
                        command: "undo",
                        icon: "undo",
                        label: "Undo",
                        type: "rich-text-editor-button"
                      },
                      {
                        command: "redo",
                        icon: "redo",
                        label: "Redo",
                        type: "rich-text-editor-button"
                      }
                    ]
                  },
                  {
                    label: "Basic Inline Operations",
                    type: "button-group",
                    buttons: [
                      {
                        label: "Heading",
                        type: "rich-text-editor-heading-picker"
                      },
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
                    label: "Clipboard Operations",
                    type: "button-group",
                    buttons: [
                      {
                        command: "cut",
                        icon: "content-cut",
                        label: "Cut",
                        type: "rich-text-editor-button"
                      },
                      {
                        command: "copy",
                        icon: "content-copy",
                        label: "Copy",
                        type: "rich-text-editor-button"
                      },
                      {
                        command: "paste",
                        icon: "content-paste",
                        label: "Paste",
                        type: "rich-text-editor-button"
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
                    icon: "editor:functions",
                    label: "Insert Symbol",
                    symbolTypes: ["symbols"],
                    type: "rich-text-editor-symbol-picker"
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
                      },
                      {
                        collapsedUntil: "lg",
                        command: "formatBlock",
                        commandVal: "blockquote",
                        label: "Blockquote",
                        icon: "editor:format-quote",
                        type: "rich-text-editor-button"
                      },
                      {
                        label: "Increase Indent",
                        icon: "editor:format-indent-increase",
                        event: "text-indent",
                        command: "indent",
                        type: "rich-text-editor-button"
                      },
                      {
                        label: "Decrease Indent",
                        icon: "editor:format-indent-decrease",
                        event: "text-outdent",
                        command: "outdent",
                        type: "rich-text-editor-button"
                      }
                    ]
                  }
                ]
              },
              /**
               * The `id` of the `rich-text-editor` that the toolbar controls.
               */ controls: { name: "controls", type: String, value: null },
              /**
               * The `rich-text-editor` element that uis currently in `contenteditable` mode
               */ editor: { name: "editor", type: Object, value: null },
              /**
               * The icon for the more button.
               */ moreIcon: {
                name: "moreIcon",
                type: String,
                value: "more-vert"
              },
              /**
               * The label for the more button.
               */ moreLabel: {
                name: "moreLabel",
                type: String,
                value: "More Buttons"
              },
              /**
               * The label for the more button when toggled.
               */ moreLabelToggled: {
                name: "moreLabelToggled",
                type: String,
                value: "Fewer Buttons"
              },
              /**
               * The show text label for more button.
               */ moreShowTextLabel: {
                name: "moreShowTextLabel",
                type: Boolean,
                value: !1
              },
              /**
               * The the size of the editor.
               */ responsiveSize: {
                name: "responsiveSize",
                type: String,
                value: "xs",
                reflectToAttribute: !0
              },
              /**
               * The current text selection.
               */ savedSelection: {
                name: "savedSelection",
                type: Object,
                value: null
              },
              /**
               * The current text selection, which is actually a range.
               */ selection: {
                name: "selection",
                type: Object,
                value: null,
                observer: "_selectionChange"
              },
              /**
               * Should the toolbar stick to the top so that it is always visible?
               */ sticky: {
                name: "sticky",
                type: Boolean,
                value: !1,
                reflectToAttribute: !0,
                observer: "_stickyChanged"
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
            return "rich-text-editor-toolbar";
          }
        }
      ]
    );
    return RichTextEditorToolbar;
  })(_polymerElement.PolymerElement);
  _exports.RichTextEditorToolbar = RichTextEditorToolbar;
  window.customElements.define(
    RichTextEditorToolbar.tag,
    RichTextEditorToolbar
  );
});
