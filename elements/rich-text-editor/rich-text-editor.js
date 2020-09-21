/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorStyles } from "./lib/rich-text-editor-styles.js";
import "./lib/singletons/rich-text-editor-selection.js";
import "./lib/toolbars/rich-text-editor-toolbar.js";
import "./lib/toolbars/rich-text-editor-toolbar-mini.js";
import "./lib/toolbars/rich-text-editor-toolbar-full.js";
/**
 * `rich-text-editor`
 * @element rich-text-editor
 * `a standalone rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo ./demo/index.html demo
 * @demo ./demo/mini.html mini floating toolbar
 * @demo ./demo/full.html toolbar with breadcrumb
 * @demo ./demo/config.html custom configuration
 */
class RichTextEditor extends RichTextEditorStyles(LitElement) {
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host([hidden]) {
          display: none;
        }

        :host {
          display: block;
          cursor: pointer;
          min-height: 40px;
        }

        :host([contenteditable="true"]) {
          border: var(--rich-text-editor-border);
          overflow: auto;
        }

        :host([contenteditable="true"]):focus-within,
        :host([contenteditable="true"]):focus {
          padding: 2px;
          margin-bottom: 2px;
        }

        :host(.heightmax[contenteditable="true"]) {
          max-height: calc(100vh - 200px);
          overflow-y: scroll;
        }

        :host(:empty) {
          border: 1px dashed var(--rich-text-editor-border-color);
          outline: 1px dashed var(--rich-text-editor-border-color);
        }

        :host(:empty):before {
          content: attr(placeholder);
          padding: 0 5px;
          display: block;
          z-index: -1;
          color: var(--rich-text-editor-button-disabled-color);
        }

        ::slotted(*:first-child) {
          margin-top: 0;
        }

        ::slotted(*:last-child) {
          margin-bottom: 0;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <slot></slot>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Rich text-editor",
        description: "a standalone rich text editor",
        icon: "icons:android",
        color: "green",
        groups: ["Text"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage",
          },
        ],
        meta: {
          author: "nikkimk",
          owner: "Penn State University",
        },
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "title",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android",
          },
        ],
        advanced: [],
      },
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * editor's unique id
       */
      id: {
        name: "id",
        type: String,
        reflect: true,
        attribute: "id",
      },
      /**
       * Maps to contenteditable attribute
       */
      contenteditable: {
        name: "contenteditable",
        type: Boolean,
        reflect: true,
        attribute: "contenteditable",
      },
      /**
       * Placeholder text for empty editable regions
       */
      placeholder: {
        name: "placeholder",
        type: String,
        reflect: true,
        attribute: "placeholder",
      },

      /**
       * id for toolbar
       */
      toolbar: {
        name: "toolbar",
        type: String,
        reflect: true,
        attribute: "toolbar",
      },

      /**
       * current range
       */
      range: {
        name: "range",
        type: Object,
        attribute: "range",
      },

      /**
       * type of editor toolbar, i.e.
       * full - full for full toolbar with breadcrumb,
       * mini - mini for mini floating toolbar, or
       * default toolbar if neither.
       */
      type: {
        name: "type",
        type: String,
        reflect: true,
        attribute: "type",
      },

      /**
       * contains cancelled edits
       */
      __canceledEdits: {
        type: Object,
      },

      /**
       * connected toolbar
       */
      __connectedToolbar: {
        type: Object,
      },
      /**
       * selection management
       */
      __selection: {
        type: Object,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor";
  }
  constructor() {
    super();
    window.RichTextEditorStyleManager.requestAvailability();
    this.placeholder = "Click to edit";
    this.toolbar = "";
    this.type = "rich-text-editor-toolbar";
    this.id = "";
    this.__selection = window.RichTextEditorSelection.requestAvailability();
    this.addEventListener("paste", (e) => console.log("editor paste", e));
  }

  /**
   * mutation observer
   *
   * @readonly
   * @memberof RichTextEditor
   */
  get observer() {
    let root = this;
    return new MutationObserver((e) => root.updateRange(e));
  }

  /**
   * Called every time the element is removed from the DOM. Useful for
   * running clean up code (removing event listeners, etc.).
   */
  disconnectedCallback() {
    this.contenteditable = false;
    super.disconnectedCallback();
  }

  firstUpdated() {
    if (super.firstUpdated) super.firstUpdated();
    if (this.isEmpty()) this.innerHTML = "";
    this.__selection.registerEditor(this);
    this._editableChange();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    console.log("updated", this.contenteditable);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "contenteditable") this._editableChange();
      if (propName === "range") this._rangeChange();
    });
  }

  getRange() {
    return !this.__selection ? undefined : this.__selection.getRange(this);
  }
  /**
   * gets current value minus placeholder
   *
   * @returns {string}
   * @memberof RichTextEditor
   */
  getValue() {
    return this.isEmpty ||
      this.trimmerHTML(this) === `<p>${editor.placeholder}</p>`
      ? ""
      : this.innerHTML;
  }
  /**
   * determines if editor is empty
   *
   * @returns {string}
   * @memberof RichTextEditor
   */
  isEmpty() {
    return !this.innerHTML || this.trimmerHTML(this) == "";
  }
  /**
   *
   *
   * @memberof RichTextEditor
   */
  paste(pasteContent, sanitized = true) {
    this.__selection.paste(this, pasteContent);
    this.pasteIntoRange(this, pasteContent, sanitized);
  }
  /**
   * revert content to before contenteditable=true
   *
   * @memberof RichTextEditor
   */
  revert() {
    this.innerHTML = this.__canceledEdits;
  }
  /**
   * gets closet document oor shadowRoot
   *
   * @returns node
   * @memberof RichTextEditor
   */
  rootNode() {
    return !this.__selection ? document : this.__selection.getRoot(this);
  }
  /**
   * gets trimmed version of innerHTML
   *
   * @param {obj} node
   * @returns string
   * @memberof RichTextEditor
   */
  trimmerHTML(node) {
    return node.innerHTML.replace(/[\s\t\r\n]/gim, "");
  }
  updateRange(e) {
    console.log("updateRange", e);
    this.range = this.getRange();
    console.log("updateRange 2", this.range);
  }
  /**
   * updates editor placeholder and watches for range changes
   *
   * @memberof RichTextEditor
   */
  _editableChange() {
    let root = this,
      placeholder = `<p>${this.placeholder}</p>`;
    console.log("updated", this.contenteditable);
    if (this.contenteditable) {
      this.__canceledEdits = this.innerHTML;
      console.log("updated 2", this.__selection);
      if (this.isEmpty()) this.innerHTML = placeholder;
      this._rangeChange();
      document.onselectionchange = (e) => this.updateRange(e);
      root.observer.observe(root, {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: false,
      });
    } else {
      console.log("updated 2b", this.__selection);
      if (root.observer) root.observer.disconnect();
      if (this.trimmerHTML(this) === placeholder) {
        this.innerHTML = "";
      }
      document.onselectionchange = (e) => console.log("none");
    }
    console.log("updated 3", this.__selection);
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
      pasteContent = (e.originalEvent || e).clipboardData.getData("text/html");
    } else if (window.clipboardData) {
      pasteContent = window.clipboardData.getData("Text");
    }
    this.__selection.pasteFromClipboard(this, pasteContent);
    e.preventDefault();
  }

  /**
   * updates toolbar's range and placeholder content
   *
   * @memberof RichTextEditor
   */
  _rangeChange() {
    this.__selection.updateToolbars(this);
  }
}

window.customElements.define(RichTextEditor.tag, RichTextEditor);
export { RichTextEditor };
