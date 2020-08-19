/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorStyles } from "../rich-text-editor-styles.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "../../rich-text-editor.js";
import "../singletons/rich-text-editor-selection.js";
import "../buttons/rich-text-editor-button.js";
import "../buttons/rich-text-editor-more-button.js";
import "../buttons/rich-text-editor-heading-picker.js";
import "../buttons/rich-text-editor-symbol-picker.js";
import "../buttons/rich-text-editor-underline.js";
import "../buttons/rich-text-editor-image.js";
import "../buttons/rich-text-editor-link.js";
import "../buttons/rich-text-editor-button-styles.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/image-icons.js";
import "@lrnwebcomponents/md-extra-icons/md-extra-icons.js";
/**
 * `rich-text-editor-toolbar`
 * `a basic toolbar for the rich text editor`
 *
 * @element rich-text-editor-toolbar
 * @demo ./demo/index.html demo
 * @demo ./demo/config.html custom configuration
 */
class RichTextEditorToolbar extends RichTextEditorStyles(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
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
        :host #toolbar {
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
        :host #toolbar[aria-hidden] {
          visibility: hidden;
          opacity: 0;
          height: 0;
        }
        :host #toolbar .group {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-evenly;
          align-items: stretch;
          padding: 0 3px;
        }
        :host #toolbar .group:not(:last-of-type) {
          margin-right: 3px;
          border-right: var(--rich-text-editor-border);
        }
        :host #toolbar .button {
          display: flex;
          flex: 0 0 auto;
          align-items: stretch;
        }
        :host #toolbar #morebutton {
          flex: 1 0 auto;
          justify-content: flex-end;
        }
        /* hide the more button if all the buttons are displayed */
        :host([responsive-size="xs"]) #morebutton[collapse-max="xs"],
        :host([responsive-size="sm"]) #morebutton[collapse-max*="s"],
        :host([responsive-size="md"]) #morebutton:not([collapse-max*="l"]),
        :host([responsive-size="lg"]) #morebutton:not([collapse-max="xl"]),
        :host([responsive-size="xl"]) #morebutton,
        /* hide the buttons if they should be collaped until */
        :host([responsive-size="xs"]) #toolbar[collapsed] *[collapsed-until*="m"],
        :host([responsive-size="xs"]) #toolbar[collapsed] *[collapsed-until*="l"],
        :host([responsive-size="sm"]) #toolbar[collapsed] *[collapsed-until="md"],
        :host([responsive-size="sm"]) #toolbar[collapsed] *[collapsed-until*="l"],
        :host([responsive-size="md"]) #toolbar[collapsed] *[collapsed-until*="l"],
        :host([responsive-size="lg"]) #toolbar[collapsed] *[collapsed-until="xl"] {
          display: none;
        }
      `
    ];
  }

  static get styles() {
    return [...this.baseStyles, ...this.stickyStyles];
  }

  // render function for toolbar
  static get toolbarTemplate() {
    return html`
      <div
        id="toolbar"
        aria-live="polite"
        aria-hidden="${this.controls ? "false" : "true"}"
        ?collapsed="${this.collapsed}"
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
          on-click="_toggleMore"
        >
        </rich-text-editor-more-button>
      </div>
    `;
  }

  // render function for template
  static get template() {
    return html`
      ${this.toolbarTemplate}
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The editable content, if edits are canceled.
       */
      canceled: {
        name: "canceled",
        type: Object
      },
      /**
       * Is the toolbar collapsed?
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
       * The `id` of the `rich-text-editor` that the toolbar controls.
       */
      controls: {
        name: "controls",
        type: String,
        attribute: "controls"
      },
      /**
       * The `rich-text-editor` element that uis currently in `contenteditable` mode
       */
      editor: {
        name: "editor",
        type: Object,
        attribute: "editor"
      },
      /**
       * The icon for the more button.
       */
      moreIcon: {
        name: "moreIcon",
        type: String,
        attribute: "more-icon",
        value: "more-vert"
      },
      /**
       * The label for the more button.
       */
      moreLabel: {
        name: "moreLabel",
        type: String,
        attribute: "more-label",
        value: "More Buttons"
      },
      /**
       * The label for the more button when toggled.
       */
      moreLabelToggled: {
        name: "moreLabelToggled",
        type: String,
        attribute: "more-label-toggled",
        value: "Fewer Buttons"
      },
      /**
       * The show text label for more button.
       */
      moreShowTextLabel: {
        name: "moreShowTextLabel",
        type: Boolean,
        attribute: "more-show-text-label"
      },
      /**
       * The the size of the editor.
       */
      responsiveSize: {
        name: "responsiveSize",
        type: String,
        attribute: "responsive-size",
        reflect: true
      },
      /**
       * The current text selected range.
       */
      savedSelection: {
        name: "savedSelection",
        type: Object
      },

      /**
       * The current text selected range, which is actually a range.
       */
      range: {
        name: "range",
        type: Object
      },
      /**
       * Should the toolbar stick to the top so that it is always visible?
       */
      sticky: {
        name: "sticky",
        type: Boolean,
        attribute: "sticky",
        reflect: true
      },
      /**
       * Tracks the inline widgets that require selection data
       */
      __inlineWidgets: {
        name: "__inlineWidgets",
        type: Array
      },
      /**
       * Optional space-sperated list of keyboard shortcuts for the editor
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
    window.RichTextEditorSelection.requestAvailability();
    window.ResponsiveUtility.requestAvailability();
    this.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
          attribute: "responsive-size",
          relativeToParent: true
        }
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

  /**
   * Gets editor buttons array, as determined by `config`.
   * @readonly
   */
  get buttons() {
    console.log(this, this.shadowRoot);
    if (this.shadowRoot) {
      let toolbar = this.shadowRoot.querySelector("#toolbar"),
        more = this.shadowRoot.querySelector("#morebutton"),
        max = 0,
        sizes = ["xs", "sm", "md", "lg", "xl"],
        temp = [];
      toolbar.innerHTML = "";
      this.set("__shortcutKeys", []);
      this.config.forEach(item => {
        if (item.type === "button-group") {
          let group = document.createElement("div");
          group.setAttribute("class", "group");
          if (item.collapsedUntil !== undefined && item.collapsedUntil !== null)
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
   * life cycle, element is afixed to the DOM
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * life cycle, element is disconnected
   * @returns {void}
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    //unbind the the toolbar to the rich-text-editor-selection
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
      this.editTarget(editor).bind(this);
    });
    editor.addEventListener("focus", e => {
      this.editTarget(editor).bind(this);
    });
    editor.addEventListener("keydown", e => {
      this._handleShortcutKeys(editor, e).bind(this);
    });
    editor.addEventListener("blur", e => {
      if (
        e.relatedTarget === null ||
        !e.relatedTarget.startsWith === "rich-text-editor"
      )
        this.editTarget(null).bind(this);
    });
  }

  /**
   * cancels edits to the active editor
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
    if (this.editor !== editor) {
      //save changes to previous editor
      if (this.editor !== null) {
        this.editor.contentEditable = false;
        this.editor = null;
      }
      //bind the the toolbar to the rich-text-editor-selection
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
      if (editor) {
        editor.parentNode.insertBefore(this, editor);
        this.canceled = editor.innerHTML;
        this.editor.contentEditable = true;
        this.controls = editor.getAttribute("id");
      } else {
        this.controls = null;
      }
      this.buttons.forEach(button => {
        button.target = editor;
        button.controls = this.controls;
      });
    }
  }

  /**
   * Normalizes selected range data.
   * @returns {object} the selected range
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
   * @param {string} pasteContent the html to be pasted
   * @returns {string} the filtered html as string
   */
  getSanitizeClipboard(pasteContent) {
    let regex = "<body(.*\n)*>(.*\n)*</body>";
    if (pasteContent.match(regex) && pasteContent.match(regex).length > 0)
      pasteContent = pasteContent.match(regex)[0].replace(/<\?body(.*\n)*\>/i);
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
   * @param {string} pasteContent the html to be pasted
   * @returns {void}
   */
  pasteIntoRange(range, pasteContent) {
    console.log("pasteIntoRange", range, pasteContent);
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
      this.getUpdatedSelection().bind(this);
    });
    editor.removeEventListener("focus", e => {
      this.editTarget(editor).bind(this);
    });
    editor.removeEventListener("mousedown", e => {
      this.editTarget(editor).bind(this);
    });
    editor.removeEventListener("keydown", e => {
      this._handleShortcutKeys(editor, e).bind(this);
    });
    editor.removeEventListener("blur", e => {
      if (
        e.relatedTarget === null ||
        !e.relatedTarget.startsWith === "rich-text-editor"
      )
        this.editTarget(null).bind(this);
      this.getUpdatedSelection().bind(this);
    });
  }

  /**
   * Adds a button to the toolbar
   *
   * @param {object} child the child object in the config object
   * @param {object} parent the parent object in the config object
   * @returns {object} the button
   */
  _addButton(child, parent) {
    let button = document.createElement(child.type),
      keys = button.shortcutKeys
        ? button.shortcutKeys.replace(/ctrl\+[xcv]/g, "")
        : "";
    //disable clipboard keys since we're already listening for them

    this.set(`__shortcutKeys.${keys}`, button);

    for (var key in child) {
      button[key] = child[key];
    }
    button.setAttribute("class", "button");
    button.addEventListener("deselect", e => {
      if (this.range && this.range.collapse) this.range.collapse(false);
    });

    if (button.inlineWidget) this.push("__inlineWidgets", button.tag);
    parent.appendChild(button);
    return button;
  }

  _handleKeyboardShortcuts(e) {
    console.log("_handleKeyboardShortcuts", e);
  }

  /**
   * when a shortcut key is pressed, fire the keypressed event on the button associated with it
   * @param {object} editor the editor that detects a shortcut key
   * @param {event} e the key event
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
   * @param {event} e the paste event
   * @returns {void}
   */
  _handlePaste(e) {
    console.log("_handlePaste", e);
    let pasteContent = "";
    // intercept paste event
    if (e && (e.clipboardData || e.originalEvent.clipboardData)) {
      pasteContent = (e.originalEvent || e).clipboardData.getData("text/html");
    } else if (window.clipboardData) {
      pasteContent = window.clipboardData.getData("Text");
    }
    console.log("clipboardData");
    this.pasteIntoRange(
      this.getRange(),
      this.getSanitizeClipboard(pasteContent)
    );
    console.log("pasteIntoRange");
    e.preventDefault();
  }

  /**
   * Handles paste button.
   *
   * @param {event} e the paste button event
   * @returns {void}
   */
  _handlePasteButton(e) {
    console.log("_handlePasteButton", e);
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
   * Gets the updated selected range.
   * @returns {void}
   */
  _rangeChange() {
    this.buttons.forEach(button => {
      button.range = null;
      button.range = this.range;
    });
  }

  /**
   * updates breadcrumb sticky when sticky property changes
   *
   * @param {boolean} newVal the new value
   * @param {boolean} oldVal the old value
   * @returns {void}
   */
  _stickyChanged(newVal, oldVal) {
    if (this.__breadcrumbs) this.__breadcrumbs.sticky = this.sticky;
  }

  /**
   * Toggles collapsed mode when `rich-text-editor-more-button` is tapped
   * @param {event} e the `rich-text-editor-more-button` tap event
   * @returns {void}
   */
  _toggleMore(e) {
    this.collapsed = !this.collapsed;
  }
}
window.customElements.define(RichTextEditorToolbar.tag, RichTextEditorToolbar);
export { RichTextEditorToolbar };
