/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextStyles } from "./lib/buttons/rich-text-editor-button.js";
import * as shadow from "shadow-selection-polyfill/shadow.js";
import "./lib/singletons/rich-text-editor-selection.js";
import "./lib/toolbars/rich-text-editor-toolbar.js";
import "./lib/toolbars/rich-text-editor-toolbar-mini.js";
import "./lib/toolbars/rich-text-editor-toolbar-full.js";
/**
 * `rich-text-editor`
 * @element rich-text-editor
 * a standalone rich text editor
 *
 * @demo ./demo/index.html demo
 * @demo ./demo/mini.html mini floating toolbar
 * @demo ./demo/full.html toolbar with breadcrumb
 * @demo ./demo/config.html custom configuration
 * @demo ./demo/rawhtml.html raw HTML
 */
class RichTextEditor extends LitElement {
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
    this.haxUIElement = true;
    this.placeholder = "Click to edit";
    this.toolbar = "";
    this.type = "rich-text-editor-toolbar";
    this.id = "";
    this.range = undefined;
    this.__focused = false;
    this.__hovered = false;
    this.contenteditable = false;
    this.__selection = window.RichTextEditorSelection.requestAvailability();
    let root = this;
    import("@lrnwebcomponents/code-editor/code-editor.js");
    document.addEventListener(shadow.eventName, this._getRange.bind(root));
  }

  /**
   * mutation observer
   *
   * @readonly
   * @memberof RichTextEditor
   */
  get observer() {
    return new MutationObserver(this._getRange);
  }

  get codeEditor() {
    if (!this.__codeEditor)
      this.__codeEditor = document.createElement("code-editor");
    this.__codeEditor.language = "html";
    return this.__codeEditor;
  }

  get placeHolderHTML() {
    return `<p>${this.placeholder}</p>`;
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.register();
    }, 1);
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
    if (this.isEmpty() && !!this.rawhtml) {
      this.setHTML(this.rawhtml);
    } else {
      if (this.isEmpty()) this.innerHTML = "";
      this._editableChange();
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "contenteditable") this._editableChange();
      if (propName === "range") this._rangeChange();
      if (propName === "rawhtml" && !!this.rawhtml) this.setHTML(this.rawhtml);
      if (propName === "viewSource") {
        console.log(this.codeEditor, this.viewSource);
        if (this.viewSource) {
          this._showSource();
          console.log(this.codeEditor);
        } else {
          this._hideSource();
        }
      }
    });
    if (!this.innerHTML) this.innerHTML = "";
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * allow HAX to toggle edit state when activated
   */
  haxactiveElementChanged(el, val) {
    // overwrite the HAX dom w/ what our editor is supplying
    if (!val && el) {
      el.innerHTML = this.getValue();
    }
    return el;
  }

  disableEditing() {
    this.contenteditable = false;
    this.dispatchEvent(
      new CustomEvent("editing-disabled", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: (this.innerHTML || "").replace(/<!--[^(-->)]*-->/g, "").trim(),
      })
    );
  }
  enableEditing() {
    this.contenteditable = true;
    this.dispatchEvent(
      new CustomEvent("editing-enabled", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: (this.innerHTML || "").replace(/<!--[^(-->)]*-->/g, "").trim(),
      })
    );
  }
  focus() {
    this.__focused = true;
    this.dispatchEvent(
      new CustomEvent("focus", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: this.querySelector("*"),
      })
    );
  }
  getHTML() {
    return this.isEmpty() || this.isPlaceholder()
      ? ""
      : (this.innerHTML || "").replace(/<!--[^(-->)]*-->/g, "").trim();
  }
  _hideSource() {
    this.codeEditor.removeEventListener(
      "value-changed",
      this._handleSourceChange
    );
    this.codeEditor.remove();
    //this.toolbar.show = true;
  }
  /**
   * determines if editor is empty
   *
   * @returns {string}
   * @memberof RichTextEditor
   */
  isEmpty() {
    return !this.innerHTML || this.trimHTML(this) == "";
  }

  isPlaceholder() {
    this.trimHTML(this) === this.trimString(this.placeholderHTML);
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
      this.observer.observe(this, {
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
   * sanitizesHTML
   * override this function to make your own filters
   *
   * @param {string} html html to be pasted
   * @returns {string} filtered html as string
   */
  sanitizeHTML(html) {
    let regex = "<body(.*\n)*>(.*\n)*</body>";
    if (html.match(regex) && html.match(regex).length > 0)
      html = html.match(regex)[0].replace(/<\?body(.*\n)*\>/i);
    return html;
  }
  /**
   * sets html of editor
   *
   * @param {string} [rawhtml=""]
   * @memberof RichTextEditor
   */
  setHTML(rawhtml = "") {
    this.innerHTML = rawhtml.trim();
    this.setCancelHTML(rawhtml.trim());
    if (this.isEmpty()) this.innerHTML = "";
    this._editableChange();
  }
  /**
   * holds on to edits so cancel willwork
   *
   * @param {string} [html=this.innerHTML]
   * @memberof RichTextEditor
   */
  setCancelHTML(html = this.innerHTML) {
    this.__canceledEdits = html || "";
  }
  _showSource() {
    this.parentNode.insertBefore(this.codeEditor, this.nextElementSibling);
    this.codeEditor.value = this.innerHTML;
    this.codeEditor.addEventListener("value-changed", this._handleSourceChange);
    //this.toolbar.show = false;
  }
  /**
   * gets trimmed version of innerHTML
   *
   * @param {obj} node
   * @returns string
   * @memberof RichTextEditor
   */
  trimHTML(node) {
    let str = node ? node.innerHTML : undefined;
    return this.trimString(str);
  }
  trimString(str) {
    return (str || "")
      .replace(/<!--[^(-->)]*-->/g, "")
      .replace(/[\s\t\r\n]/gim, "");
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
    if (this.contenteditable) {
      this.setCancelHTML();
      if (this.isEmpty()) this.innerHTML = this.placeholderHTML || "";
    } else {
      if (this.isPlaceholder()) {
        this.setCancelHTML("");
      }
    }
  }

  _getRange() {
    let shadowRoot = (el) => {
      let parent = el.parentNode;
      return parent ? shadowRoot(parent) : el;
    };
    this.range = shadow.getRange(shadowRoot(this));
    this.updateRange();
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
  /**
   * updates editor content to code-editor value
   *
   * @param {event} e code-editor's value change event
   * @memberof RichTextEditor
   */
  _handleSourceChange(e) {
    if (this.codeEditor.value != this.innerHTML)
      this.innerHTML = this.codeEditor.value;
  }
  _rangeChange(e) {}
}

window.customElements.define(RichTextEditor.tag, RichTextEditor);
export { RichTextEditor };
