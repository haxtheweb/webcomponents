/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "../../rich-text-editor.js";
import "../rich-text-editor-styles.js";
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
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/config.html custom configuration
 */
class RichTextEditorToolbar extends PolymerElement {
  // render function for styles
  static get stickyTemplate() {
    return html`
      <style>
        :host([sticky]) {
          position: sticky;
          top: 0;
        }
      </style>
    `;
  }

  // render function for styles
  static get styleTemplate() {
    return html`
      <style include="rich-text-editor-styles rich-text-editor-button-styles">
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
          @apply --rich-text-editor-toolbar;
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
          @apply --rich-text-editor-toolbar-group;
        }
        :host #toolbar .group:not(:last-of-type) {
          margin-right: 3px;
          border-right: var(--rich-text-editor-border);
          @apply --rich-text-editor-toolbar-divider;
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
      </style>
    `;
  }

  // render function for toolbar
  static get toolbarTemplate() {
    return html`
      <div
        id="toolbar"
        aria-live="polite"
        aria-hidden$="[[!controls]]"
        collapsed$="[[collapsed]]"
      >
        <rich-text-editor-more-button
          id="morebutton"
          class="button"
          controls="toolbar"
          icon$="[[moreIcon]]"
          label$="[[moreLabel]]"
          show-text-label$="[[moreShowTextLabel]]"
          label-toggled$="[[moreLabelToggled]]"
          toggled$="[[!collapsed]]"
          on-click="_toggleMore"
        >
        </rich-text-editor-more-button>
      </div>
    `;
  }

  // render function for template
  static get template() {
    return html`
      ${this.styleTemplate} ${this.stickyTemplate} ${this.toolbarTemplate}
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The editor buttons, as determined by `config`.
       */
      buttons: {
        name: "buttons",
        type: Array,
        computed: "_getButtons(config)"
      },
      /**
       * The editable content, if edits are canceled.
       */
      canceled: {
        name: "canceled",
        type: Object,
        value: true
      },
      /**
       * Is the toolbar collapsed?
       */
      collapsed: {
        name: "collapsed",
        type: Boolean,
        value: true
      },

      /**
       * Custom configuration of toolbar groups and buttons.
       * (See default value for example using default configuration.)
       */
      config: {
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
        ]
      },
      /**
       * The `id` of the `rich-text-editor` that the toolbar controls.
       */
      controls: {
        name: "controls",
        type: String,
        value: null
      },
      /**
       * The `rich-text-editor` element that uis currently in `contenteditable` mode
       */
      editor: {
        name: "editor",
        type: Object,
        value: null
      },
      /**
       * The icon for the more button.
       */
      moreIcon: {
        name: "moreIcon",
        type: String,
        value: "more-vert"
      },
      /**
       * The label for the more button.
       */
      moreLabel: {
        name: "moreLabel",
        type: String,
        value: "More Buttons"
      },
      /**
       * The label for the more button when toggled.
       */
      moreLabelToggled: {
        name: "moreLabelToggled",
        type: String,
        value: "Fewer Buttons"
      },
      /**
       * The show text label for more button.
       */
      moreShowTextLabel: {
        name: "moreShowTextLabel",
        type: Boolean,
        value: false
      },
      /**
       * The the size of the editor.
       */
      responsiveSize: {
        name: "responsiveSize",
        type: String,
        value: "xs",
        reflectToAttribute: true
      },
      /**
       * The current text selected range.
       */
      savedSelection: {
        name: "savedSelection",
        type: Object,
        value: null
      },

      /**
       * The current text selected range, which is actually a range.
       */
      range: {
        name: "range",
        type: Object,
        value: null,
        observer: "_rangeChange"
      },
      /**
       * Should the toolbar stick to the top so that it is always visible?
       */
      sticky: {
        name: "sticky",
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: "_stickyChanged"
      },
      /**
       * Tracks the inline widgets that require selection data
       */
      __inlineWidgets: {
        name: "__inlineWidgets",
        type: Array,
        value: []
      },

      /**
       * Optional space-sperated list of keyboard shortcuts for the editor
       * to fire this button, see iron-a11y-keys for more info.
       * /
      __a11yKeys: {
        name: "__a11yKeys",
        type: Array,
        computed: "_getA11yKeys(__shortcutKeys,editor)"
      },
    
      /**
       * Optional space-sperated list of keyboard shortcuts for the editor
       * to fire this button, see iron-a11y-keys for more info.
       * /
      __osKeys: {
        name: "__osKeys",
        type: Array,
        computed: "_getOsKeys(__shortcutKeys)"
      },

      /**
       * Optional space-sperated list of keyboard shortcuts for the editor
       * to fire this button, see iron-a11y-keys for more info.
       */
      __shortcutKeys: {
        name: "__shortcutKeys",
        type: Array,
        value: []
      }
    };
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-toolbar";
  }
  /**
   * life cycle, element is afixed to the DOM
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    let root = this;
    this.__clipboard = document.createElement("textarea");
    this.__clipboard.setAttribute("aria-hidden", true);
    this.__clipboard.style.position = "absolute";
    this.__clipboard.style.left = "-9999px";
    this.__clipboard.style.top = "0px";
    this.__clipboard.style.width = "0px";
    this.__clipboard.style.height = "0px";
    document.body.appendChild(this.__clipboard);
    window.addEventListener("paste", root._handlePaste.bind(root));
    if (navigator.clipboard) {
      this.addEventListener("paste-button", root._handlePasteButton.bind(root));
    }
    window.RichTextEditorSelection.requestAvailability();
    window.ResponsiveUtility.requestAvailability();
    window.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: root,
          attribute: "responsive-size",
          relativeToParent: true
        }
      })
    );
  }

  /**
   * life cycle, element is disconnected
   * @returns {void}
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    let root = this;
    //unbind the the toolbar to the rich-text-editor-selection
    root.dispatchEvent(
      new CustomEvent("deselect-rich-text-editor-editor", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          toolbar: root,
          editor: root.editor
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
    let root = this;
    editor.addEventListener("mousedown", e => {
      root.editTarget(editor);
    });
    editor.addEventListener("focus", e => {
      root.editTarget(editor);
    });
    editor.addEventListener("keydown", e => {
      root._handleShortcutKeys(editor, e);
    });
    editor.addEventListener("blur", e => {
      if (
        e.relatedTarget === null ||
        !e.relatedTarget.startsWith === "rich-text-editor"
      )
        root.editTarget(null);
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
    let root = this;

    if (root.editor !== editor) {
      //save changes to previous editor
      if (root.editor !== null) {
        root.editor.contentEditable = false;
        root.editor = null;
      }
      //bind the the toolbar to the rich-text-editor-selection
      root.dispatchEvent(
        new CustomEvent("select-rich-text-editor-editor", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            toolbar: root,
            editor: root.editor
          }
        })
      );
      root.editor = editor;
      if (editor) {
        editor.parentNode.insertBefore(root, editor);
        root.canceled = editor.innerHTML;
        root.editor.contentEditable = true;
        root.controls = editor.getAttribute("id");
      } else {
        root.controls = null;
      }
      root.buttons.forEach(button => {
        button.target = editor;
        button.controls = root.controls;
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
    let root = this,
      content = document.createElement("rich-text-editor");
    editor.parentNode.insertBefore(content, editor);
    content.appendChild(editor);
    root.addEditableRegion(content);
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
    let root = this;
    editor.removeEventListener("mouseout", e => {
      root.getUpdatedSelection();
    });
    editor.removeEventListener("focus", e => {
      root.editTarget(editor);
    });
    editor.removeEventListener("mousedown", e => {
      root.editTarget(editor);
    });
    editor.removeEventListener("keydown", e => {
      root._handleShortcutKeys(editor, e);
    });
    editor.removeEventListener("blur", e => {
      if (
        e.relatedTarget === null ||
        !e.relatedTarget.startsWith === "rich-text-editor"
      )
        root.editTarget(null);
      root.getUpdatedSelection();
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
    let root = this,
      button = document.createElement(child.type),
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
      if (root.range && root.range.collapse) root.range.collapse(false);
    });

    if (button.inlineWidget) root.push("__inlineWidgets", button.tag);
    parent.appendChild(button);
    return button;
  }

  _handleKeyboardShortcuts(e) {
    console.log("_handleKeyboardShortcuts", e);
  }

  /**
   * Gets the groups array for the dom-repeat.
   *
   * @param {object} config the toolbar buttons config object
   * @returns {array} the buttons array
   */
  _getButtons(config) {
    let root = this,
      toolbar = root.shadowRoot.querySelector("#toolbar"),
      more = this.shadowRoot.querySelector("#morebutton"),
      max = 0,
      sizes = ["xs", "sm", "md", "lg", "xl"],
      temp = [];
    toolbar.innerHTML = "";
    this.set("__shortcutKeys", []);
    config.forEach(item => {
      if (item.type === "button-group") {
        let group = document.createElement("div");
        group.setAttribute("class", "group");
        if (item.collapsedUntil !== undefined && item.collapsedUntil !== null)
          group.setAttribute("collapsed-until", item.collapsedUntil);
        max = Math.max(max, sizes.indexOf(item.collapsedUntil));
        item.buttons.forEach(button => {
          max = Math.max(max, sizes.indexOf(button.collapsedUntil));
          if (navigator.clipboard || button.command !== "paste")
            temp.push(root._addButton(button, group)); //firefox doesn't allow for clipboard button
        });
        toolbar.appendChild(group);
      } else {
        max = Math.max(max, sizes.indexOf(item.collapsedUntil));
        if (navigator.clipboard || item.command !== "paste")
          temp.push(root._addButton(item, toolbar)); //firefox doesn't allow for clipboard button
      }
      toolbar.appendChild(more);
      more.collapseMax = sizes[max];
    });
    return temp;
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
  _rangeChange(e) {
    let root = this;
    root.buttons.forEach(button => {
      button.range = null;
      button.range = root.range;
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

export { RichTextEditorToolbar };

window.customElements.define(RichTextEditorToolbar.tag, RichTextEditorToolbar);
