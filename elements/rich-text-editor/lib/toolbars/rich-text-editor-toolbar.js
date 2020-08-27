/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorStyles } from "../rich-text-editor-styles.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "../../rich-text-editor.js";
import "../singletons/rich-text-editor-selection.js";

const RichTextEditorToolbarBehaviors = function(SuperClass) {
  return class extends RichTextEditorStyles(SuperClass) {
    /**
     * Store tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-toolbar";
    }

    // render function for styles
    static get stickyStyles() {
      return [
        css`
          :host([sticky]) {
            position: sticky;
            top: 0;
          }
        `
      ];
    }

    // render function for styles
    static get baseStyles() {
      return [
        ...super.styles,
        css`
          :host([hidden]) {
            display: none;
          }
          #toolbar {
            display: flex;
            opacity: 1;
            z-index: 1;
            margin: 0;
            align-items: stretch;
            flex-wrap: wrap;
            justify-content: flex-start;
            background-color: var(--rich-text-editor-bg);
            border: var(--rich-text-editor-border);
            font-size: 12px;
            transition: all 0.5s;
          }
          #toolbar[aria-hidden="true"] {
            visibility: hidden;
            opacity: 0;
            height: 0;
          }
          #toolbar .group {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-evenly;
            align-items: stretch;
            padding: 0 3px;
          }
          #toolbar .group:not(:last-of-type) {
            margin-right: 3px;
            border-right: var(--rich-text-editor-border);
          }
          #toolbar .button {
            display: flex;
            flex: 0 0 auto;
            align-items: stretch;
          }
          #toolbar #morebutton {
            flex: 1 0 auto;
            justify-content: flex-end;
          }
          /* hide more button if all buttons are displayed */
          #toolbar[responsive-size="xs"] #morebutton[collapse-max="xs"],
          #toolbar[responsive-size="sm"] #morebutton[collapse-max*="s"],
          #toolbar[responsive-size="md"] #morebutton:not([collapse-max*="l"]),
          #toolbar[responsive-size="lg"] #morebutton:not([collapse-max="xl"]),
          #toolbar[responsive-size="xl"] #morebutton,
          /* hide buttons if they should be collaped until */
          #toolbar[responsive-size="xs"][collapsed] *[collapsed-until*="m"],
          #toolbar[responsive-size="xs"][collapsed] *[collapsed-until*="l"],
          #toolbar[responsive-size="sm"][collapsed] *[collapsed-until="md"],
          #toolbar[responsive-size="sm"][collapsed] *[collapsed-until*="l"],
          #toolbar[responsive-size="md"][collapsed] *[collapsed-until*="l"],
          #toolbar[responsive-size="lg"][collapsed] *[collapsed-until="xl"] {
            display: none;
          }
        `
      ];
    }

    static get styles() {
      return [...this.baseStyles, ...this.stickyStyles];
    }

    // render function for toolbar
    get toolbarTemplate() {
      return html`
        <div
          id="toolbar"
          aria-live="polite"
          aria-hidden="${this.controls //|| this.alwaysVisible
            ? "false"
            : "true"}"
          ?collapsed="${this.collapsed}"
          @focus="${this._addHighlight}"
        >
          <rich-text-editor-more-button
            id="morebutton"
            class="button"
            controls="toolbar"
            icon="${this.moreIcon}"
            label="${this.moreLabel}"
            ?show-text-label="${this.moreShowTextLabel}"
            ?label-toggled="${this.moreLabelToggled}"
            ?toggled="${!this.collapsed}"
            @click="${this._toggleMore}"
          >
          </rich-text-editor-more-button>
        </div>
      `;
    }

    // render function for template
    render() {
      return html`
        ${this.toolbarTemplate}
      `;
    }

    // properties available to custom element for data binding
    static get properties() {
      return {
        /**
         * keep toolbar visible even when not editor not focused
         * /
        alwaysVisible: {
          type: Boolean,
          attribute: "always-visible",
          reflect: true
        },
        /**
         * editable content, if edits are canceled
         */
        canceled: {
          type: Object
        },
        /**
         * is toolbar collapsed?
         */
        collapsed: {
          name: "collapsed",
          type: Boolean,
          attribute: "collapsed"
        },
        /**
         * Custom configuration of toolbar groups and buttons.
         * (See default value for example using default configuration.)
         */
        config: {
          name: "config",
          type: Object,
          attribute: "config"
        },
        /**
         * `id` of `rich-text-editor` that toolbar controls.
         */
        controls: {
          name: "controls",
          type: String,
          attribute: "controls"
        },
        /**
         * `rich-text-editor` element that is currently in `contenteditable` mode
         */
        editor: {
          name: "editor",
          type: Object,
          attribute: "editor"
        },
        /**
         * `rich-text-editor` unique id
         */
        id: {
          name: "id",
          type: String,
          attribute: "id", 
          reflect: true
        },
        /**
         * icon for more button.
         */
        moreIcon: {
          name: "moreIcon",
          type: String,
          attribute: "more-icon"
        },
        /**
         * label for more button.
         */
        moreLabel: {
          name: "moreLabel",
          type: String,
          attribute: "more-label"
        },
        /**
         * label for more button when toggled.
         */
        moreLabelToggled: {
          name: "moreLabelToggled",
          type: String,
          attribute: "more-label-toggled",
          value: "Fewer Buttons"
        },
        /**
         * show text label for more button.
         */
        moreShowTextLabel: {
          name: "moreShowTextLabel",
          type: Boolean,
          attribute: "more-show-text-label"
        },
        /**
         * size of editor.
         */
        responsiveSize: {
          name: "responsiveSize",
          type: String,
          attribute: "responsive-size",
          reflect: true
        },
        /**
         * current text selected range.
         */
        savedSelection: {
          name: "savedSelection",
          type: Object
        },

        /**
         * current text selected range, which is actually a range.
         */
        range: {
          name: "range",
          type: Object
        },
        /**
         * Should toolbar stick to top so that it is always visible?
         */
        sticky: {
          name: "sticky",
          type: Boolean,
          attribute: "sticky",
          reflect: true
        },
        /**
         * raw array of buttons
         */
        __buttons: {
          name: "__buttons",
          type: Array
        },
        /**
         * Tracks inline widgets that require selection data
         */
        __inlineWidgets: {
          name: "__inlineWidgets",
          type: Array
        },
        /**
         * highlight surrounding selected range
         */
        __selection: {
          type: Object
        },
        /**
         * Optional space-sperated list of keyboard shortcuts for editor
         * to fire this button, see iron-a11y-keys for more info.
         */
        __shortcutKeys: {
          name: "__shortcutKeys",
          type: Array
        }
      };
    }
    constructor() {
      super();
      import("../buttons/rich-text-editor-button.js");
      import("../buttons/rich-text-editor-more-button.js");
      import("../buttons/rich-text-editor-heading-picker.js");
      import("../buttons/rich-text-editor-symbol-picker.js");
      import("../buttons/rich-text-editor-underline.js");
      import("../buttons/rich-text-editor-image.js");
      import("../buttons/rich-text-editor-link.js");
      import("../buttons/rich-text-editor-button-styles.js");
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icons/editor-icons.js");
      import("@polymer/iron-icons/image-icons.js");
      import("@lrnwebcomponents/md-extra-icons/md-extra-icons.js");
      this.__selection = window.RichTextEditorSelection.requestAvailability();

      //this.alwaysVisible = false;
      this.canceled = true;
      this.collapsed = true;
      this.config = [
        {
          label: "History",
          type: "button-group",
          buttons: [
            {
              command: "undo",
              icon: "undo",
              label: "Undo",
              shortcutKeys: "ctrl+z",
              type: "rich-text-editor-button"
            },
            {
              command: "redo",
              icon: "redo",
              label: "Redo",
              shortcutKeys: "ctrl+shift+z",
              type: "rich-text-editor-button"
            }
          ]
        },
        {
          label: "Basic Inline Operations",
          type: "button-group",
          buttons: [
            {
              label: "Format",
              type: "rich-text-editor-heading-picker"
            },
            {
              command: "bold",
              icon: "editor:format-bold",
              label: "Bold",
              shortcutKeys: "ctrl+b",
              toggles: true,
              type: "rich-text-editor-button"
            },
            {
              command: "italic",
              icon: "editor:format-italic",
              label: "Italics",
              shortcutKeys: "ctrl+i",
              toggles: true,
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
              icon: "link",
              label: "Link",
              shortcutKeys: "ctrl+k",
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
              shortcutKeys: "ctrl+x",
              type: "rich-text-editor-button"
            },
            {
              command: "copy",
              icon: "content-copy",
              label: "Copy",
              shortcutKeys: "ctrl+c",
              type: "rich-text-editor-button"
            },
            {
              command: "paste",
              icon: "content-paste",
              label: "Paste",
              shortcutKeys: "ctrl+v",
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
              toggles: true,
              type: "rich-text-editor-button"
            },
            {
              command: "superscript",
              icon: "mdextra:superscript",
              label: "Superscript",
              toggles: true,
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
              toggles: true,
              type: "rich-text-editor-button"
            },
            {
              command: "insertUnorderedList",
              icon: "editor:format-list-bulleted",
              label: "Unordered List",
              toggles: true,
              type: "rich-text-editor-button"
            },
            {
              collapsedUntil: "lg",
              command: "formatBlock",
              commandVal: "blockquote",
              label: "Blockquote",
              icon: "editor:format-quote",
              shortcutKeys: "ctrl+'",
              type: "rich-text-editor-button"
            },
            {
              command: "indent",
              icon: "editor:format-indent-increase",
              event: "text-indent",
              label: "Increase Indent",
              shortcutKeys: "ctrl+]",
              type: "rich-text-editor-button"
            },
            {
              command: "outdent",
              event: "text-outdent",
              icon: "editor:format-indent-decrease",
              label: "Decrease Indent",
              shortcutKeys: "ctrl+[",
              type: "rich-text-editor-button"
            }
          ]
        }
      ];
      this.moreIcon = "more-vert";
      this.moreLabel = "More Buttons";
      this.moreLabelToggled = "Fewer Buttons";
      this.moreShowTextLabel = false;
      this.responsiveSize = "xs";
      this.sticky = false;
      this.__inlineWidgets = [];
      this.__shortcutKeys = [];
      this.__clipboard = document.createElement("textarea");
      this.__clipboard.setAttribute("aria-hidden", true);
      this.__clipboard.style.position = "absolute";
      this.__clipboard.style.left = "-9999px";
      this.__clipboard.style.top = "0px";
      this.__clipboard.style.width = "0px";
      this.__clipboard.style.height = "0px";
      document.body.appendChild(this.__clipboard);
      window.addEventListener("paste", this._handlePaste.bind(this));
      if (navigator.clipboard) {
        this.addEventListener("paste-button", this._handlePasteButton);
      }
    }
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.__buttons = this._getButtons();
      window.ResponsiveUtility.requestAvailability();
      window.dispatchEvent(
        new CustomEvent("responsive-element", {
          detail: { element: this.shadowRoot.querySelector("#toolbar") }
        })
      );
    }
    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "sticky") this._stickyChanged(this.sticky, oldValue);
        if (propName === "range") this._rangeChange();
      });
    }

    connectedCallback() {
      super.connectedCallback();
    }
    /**
     * Gets editor buttons array, as determined by `config`.
     * @readonly
     */
    get buttons() {
      return this.__buttons;
    }
    _getButtons() {
      let toolbar =
        this.shadowRoot && this.shadowRoot.querySelector("#toolbar")
          ? this.shadowRoot.querySelector("#toolbar")
          : undefined;
      if (!!toolbar) {
        let more = toolbar.querySelector("#morebutton"),
          max = 0,
          sizes = ["xs", "sm", "md", "lg", "xl"],
          temp = [];
        toolbar.innerHTML = "";
        this.__shortcutKeys = [];
        this.config.forEach(item => {
          if (item.type === "button-group") {
            let group = document.createElement("div");
            group.setAttribute("class", "group");
            if (
              item.collapsedUntil !== undefined &&
              item.collapsedUntil !== null
            )
              group.setAttribute("collapsed-until", item.collapsedUntil);
            max = Math.max(max, sizes.indexOf(item.collapsedUntil));
            item.buttons.forEach(button => {
              max = Math.max(max, sizes.indexOf(button.collapsedUntil));
              if (navigator.clipboard || button.command !== "paste")
                temp.push(this._addButton(button, group)); //firefox doesn't allow for clipboard button
            });
            toolbar.appendChild(group);
          } else {
            max = Math.max(max, sizes.indexOf(item.collapsedUntil));
            if (navigator.clipboard || item.command !== "paste")
              temp.push(this._addButton(item, toolbar)); //firefox doesn't allow for clipboard button
          }
          toolbar.appendChild(more);
          more.collapseMax = sizes[max];
        });
        return temp;
      }
      return [];
    }

    /**
     * life cycle, element is disconnected
     * @returns {void}
     */
    disconnectedCallback() {
      super.disconnectedCallback();
      //unbind toolbar to rich-text-editor-selection
      this.dispatchEvent(
        new CustomEvent("deselect-rich-text-editor-editor", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            toolbar: this,
            editor: this.editor
          }
        })
      );
    }

    /**
     * adds an editor
     *
     * @param {object} an HTML object that can be edited
     * @returns {void}
     */
    addEditableRegion(editor) {
      editor.addEventListener("mousedown", e => {
        this.editTarget(editor);
      });
      editor.addEventListener("focus", e => {
        this.editTarget(editor);
      });
      editor.addEventListener("keydown", e => {
        this._handleShortcutKeys(editor, e);
      });
      editor.addEventListener("blur", e => {
        if (
          e.relatedTarget === null ||
          !e.relatedTarget.startsWith === "rich-text-editor"
        )
          this.editTarget(null);
      });
      editor.addEventListener("click", e => this._handleEditorClick(editor, e));
    }
    _handleEditorClick(editor, e) {
      if (editor.contentEditable && e.path[0] !== editor) {
        let button = this.buttons.filter(
            button => button.tag === e.path[0].tagName.toLowerCase()
          ),
          range =
            this.__selection && this.__selection.range
              ? this.__selection.range
              : false,
          start =
            range && range.startContainer
              ? range.startContainer.childNodes[range.startOffset]
              : false,
          end =
            range && range.endContainer
              ? range.endContainer.childNodes[range.endOffset - 1]
              : false;
        if (button && button[0] && start === end && start === e.path[0]) {
          button[0]._buttonTap(e);
        } else if (button && button[0]) {
          this.__selection.selectNode(e.path[0]);
        }
      }
    }

    /**
     * cancels edits to active editor
     * @returns {void}
     */
    cancel() {
      this.editor.innerHTML = this.canceled;
      this.editTarget(null);
    }
    /**
     * makes a editor editable
     *
     * @param {object} an HTML object that can be edited
     * @returns {void}
     */
    editTarget(editor) {
      if (("editTarget", this.editor !== editor)) {
        //save changes to previous editor
        if (!!this.editor) {
          this.editor.contentEditable = false;
          this.editor = null;
        }
        //bind toolbar to rich-text-editor-selection
        this.dispatchEvent(
          new CustomEvent("select-rich-text-editor-editor", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              toolbar: this,
              editor: this.editor
            }
          })
        );
        this.editor = editor;
        if (!!editor) {
          editor.parentNode.insertBefore(this, editor);
          this.canceled = editor.innerHTML;
          this.editor.contentEditable = true;
          this.controls = editor.getAttribute("id");
          this._removeHighlight();
        } else {
          this.controls = null;
        }
        console.log("editor change");
        this.buttons.forEach(button => {
          button.target = editor;
          button.controls = this.controls;
          button.range = null;
          button.range = this.range;
        });
      }
    }

    /**
     * Normalizes selected range data.
     * @returns {object} selected range
     */
    getRange() {
      let sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      } else if (sel) {
        return sel;
      } else false;
    }

    /**
     * paste content into a range;
     * override this function to make your own filters
     *
     * @param {string} pasteContent html to be pasted
     * @returns {string} filtered html as string
     */
    getSanitizeClipboard(pasteContent) {
      let regex = "<body(.*\n)*>(.*\n)*</body>";
      if (pasteContent.match(regex) && pasteContent.match(regex).length > 0)
        pasteContent = pasteContent
          .match(regex)[0]
          .replace(/<\?body(.*\n)*\>/i);
      return pasteContent;
    }

    /**
     * make an new editable element
     *
     * @param {object} editor an HTML object that can be edited
     * @returns {void}
     */
    makeEditableRegion(editor) {
      let content = document.createElement("rich-text-editor");
      editor.parentNode.insertBefore(content, editor);
      content.appendChild(editor);
      this.addEditableRegion(content);
    }

    /**
     * paste content into a range
     *
     * @param {object} range where content will be pasted
     * @param {string} pasteContent html to be pasted
     * @returns {void}
     */
    pasteIntoRange(range, pasteContent) {
      let div = document.createElement("div"),
        sel = window.getSelection(),
        parent = range.commonAncestorContainer.parentNode,
        closest = parent.closest(
          "[contenteditable=true]:not([disabled]),input:not([disabled]),textarea:not([disabled])"
        );
      if ((this.editor = closest)) {
        div.innerHTML = pasteContent;
        if (range && range.extractContents) {
          range.extractContents();
        }
        range.insertNode(div);
        while (div.firstChild) {
          div.parentNode.insertBefore(div.firstChild, div);
        }
        div.parentNode.removeChild(div);
      }
    }

    /**
     * removes an editor
     *
     * @param {object} editor an HTML object that can be edited
     * @returns {void}
     */
    removeEditableRegion(editor) {
      editor.removeEventListener("mouseout", e => {
        this.getUpdatedSelection();
      });
      editor.removeEventListener("focus", e => {
        this.editTarget(editor);
      });
      editor.removeEventListener("mousedown", e => {
        this.editTarget(editor);
      });
      editor.removeEventListener("keydown", e => {
        this._handleShortcutKeys(editor, e);
      });
      editor.removeEventListener("blur", e => {
        if (
          e.relatedTarget === null ||
          !e.relatedTarget.startsWith === "rich-text-editor"
        )
          this.editTarget(null);
        this.getUpdatedSelection();
      });
    }

    /**
     * Adds a button to toolbar
     *
     * @param {object} child child object in config object
     * @param {object} parent parent object in config object
     * @returns {object} button
     */
    _addButton(child, parent) {
      let button = document.createElement(child.type),
        keys = button.shortcutKeys
          ? button.shortcutKeys.replace(/ctrl\+[xcv]/g, "")
          : "";
      //disable clipboard keys since we're already listening for them

      this.__shortcutKeys[keys] = button;

      for (var key in child) {
        button[key] = child[key];
      }
      button.setAttribute("class", "button");
      button.addEventListener("deselect", e => {
        console.log("button deselect", this.range, this.range.isCollapsed);
        this._removeHighlight();
        console.log("button deselect 2", this.range, this.range.isCollapsed);
      });

      if (button.inlineWidget) this.push("__inlineWidgets", button.tag);
      parent.appendChild(button);
      return button;
    }
    _addHighlight() {
      console.log("_addHighlight", this.range);
      if (this.__selection) this.__selection.addHighlight();
    }
    _removeHighlight() {
      console.log("_removeHighlight", this.range);
      if (this.__selection) this.__selection.removeHighlight();
    }

    _handleKeyboardShortcuts(e) {
      console.log("_handleKeyboardShortcuts", e);
    }

    /**
     * when a shortcut key is pressed, fire keypressed event on button associated with it
     * @param {object} editor editor that detects a shortcut key
     * @param {event} e key event
     */

    _handleShortcutKeys(editor, e) {
      if (editor.contentEditable) {
        let key = e.key;
        if (e.shiftKey) key = "shift+" + key;
        if (e.altKey) key = "alt+" + key;
        if (
          (window.navigator.platform === "MacIntel" && e.metaKey) ||
          e.ctrlKey
        ) {
          key = "ctrl+" + key;
        }
        if (this.__shortcutKeys[key]) this.__shortcutKeys[key]._keysPressed(e);
      }
    }

    /**
     * Handles paste.
     *
     * @param {event} e paste event
     * @returns {void}
     */
    _handlePaste(e) {
      let pasteContent = "";
      // intercept paste event
      if (e && (e.clipboardData || e.originalEvent.clipboardData)) {
        pasteContent = (e.originalEvent || e).clipboardData.getData(
          "text/html"
        );
      } else if (window.clipboardData) {
        pasteContent = window.clipboardData.getData("Text");
      }
      this.pasteIntoRange(
        this.__selection.getRange(),
        this.getSanitizeClipboard(pasteContent)
      );
      e.preventDefault();
    }

    /**
     * Handles paste button.
     *
     * @param {event} e paste button event
     * @returns {void}
     */
    _handlePasteButton(e) {
      setTimeout(async () => {
        let range = e.detail.range,
          sel = window.getSelection(),
          text = await navigator.clipboard.readText();
        this.__clipboard.value = text;
        this.__clipboard.focus();
        this.__clipboard.select();
        document.execCommand("paste");
        sel.removeAllRanges();
        sel.addRange(range);
        this.pasteIntoRange(
          range,
          this.getSanitizeClipboard(this.__clipboard.value)
        );
      }, 2000);
      e.preventDefault();
    }

    /**
     * Gets updated selected range.
     * @returns {void}
     */
    _rangeChange() {
      if (document.activeElement === this.editor) {
        console.log("toolbar _rangeChange", this.range);
        this.buttons.forEach(button => {
          button.range = null;
          button.range = this.range;
        });
      }
    }

    /**
     * updates breadcrumb sticky when sticky property changes
     *
     * @param {boolean} newVal new value
     * @param {boolean} oldVal old value
     * @returns {void}
     */
    _stickyChanged(newVal, oldVal) {
      if (this.__breadcrumbs) this.__breadcrumbs.sticky = this.sticky;
    }

    /**
     * Toggles collapsed mode when `rich-text-editor-more-button` is tapped
     * @param {event} e `rich-text-editor-more-button` tap event
     * @returns {void}
     */
    _toggleMore(e) {
      this.collapsed = !this.collapsed;
    }
  };
};
/**
 * `rich-text-editor-toolbar`
 * `default toolbar for rich text editor`
 *
 * @element rich-text-editor-toolbar
 */
class RichTextEditorToolbar extends RichTextEditorToolbarBehaviors(
  LitElement
) {}
window.customElements.define(RichTextEditorToolbar.tag, RichTextEditorToolbar);
export { RichTextEditorToolbar, RichTextEditorToolbarBehaviors };
