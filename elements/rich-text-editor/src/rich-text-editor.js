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
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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

  connectedCallback() {
    super.connectedCallback();
    this.register();
  }

  /**
   * life cycle, element is disconnected
   * @returns {void}
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.register(true);
  }

  firstUpdated() {
    if (super.firstUpdated) super.firstUpdated();
    if (this.isEmpty()) this.innerHTML = "";
    this._editableChange();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "contenteditable") this._editableChange();
    });
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
   * allows editor to fit within a stick toolbar
   *
   * @param {boolean} sticky
   * @memberof RichTextEditor
   */
  makeSticky(sticky = true) {
    if (!sticky) {
      this.classList.add("heightmax");
    } else {
      this.classList.remove("heightmax");
    }
  }
  /**
   * set observer on or off
   *
   * @param {boolean} [on=true]
   * @memberof RichTextEditor
   */
  observeChanges(on = true) {
    if (on) {
      let editor = this;
      this.observer.observe(editor, {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: false,
      });
    } else {
      if (this.observer) this.observer.disconnect;
    }
  }

  /**
   *
   *
   * @memberof RichTextEditor
   */
  paste(pasteContent, sanitized = true) {
    this._handlePaste(pasteContent);
  }
  /**
   * handles registration to selection singleton's toolbars list
   * @param {boolean} remove whether to remove
   * @event register
   */
  register(remove = false) {
    window.dispatchEvent(
      new CustomEvent("register", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          remove: remove,
          editor: this,
        },
      })
    );
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
   * holds on to edits so cancel willwork
   *
   * @param {string} [html=this.innerHTML]
   * @memberof RichTextEditor
   */
  setCancelHTML(html = this.innerHTML) {
    this.__canceledEdits = html;
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
    this.dispatchEvent(
      new CustomEvent("getrange", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
  }
  /**
   * updates editor placeholder and watches for range changes
   *
   * @memberof RichTextEditor
   */
  _editableChange() {
    let placeholder = `<p>${this.placeholder}</p>`;
    if (this.contenteditable) {
      this.setCancelHTML();
      if (this.isEmpty()) this.innerHTML = placeholder;
    } else {
      if (this.trimmerHTML(this) === placeholder) {
        this.setCancelHTML("");
      }
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
      pasteContent = (e.originalEvent || e).clipboardData.getData("text/html");
    } else if (window.clipboardData) {
      pasteContent = window.clipboardData.getData("Text");
    }
    this.dispatchEvent(
      new CustomEvent("pastefromclipboard", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      })
    );
    e.preventDefault();
  }
}

window.customElements.define(RichTextEditor.tag, RichTextEditor);
export { RichTextEditor };
