/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "./lib/singletons/rich-text-editor-selection.js";
import { RichTextEditorStyles } from "@lrnwebcomponents/rich-text-editor/lib/rich-text-editor-styles.js";
import "./lib/toolbars/rich-text-editor-toolbar.js";
import "./lib/toolbars/rich-text-editor-toolbar-mini.js";
import "./lib/toolbars/rich-text-editor-toolbar-full.js";
import * as shadow from "shadow-selection-polyfill/shadow.js";
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
    return  [
      ...super.styles,
      css`
:host([hidden]) {
  display: none;
}

:host {
  display: block;
  cursor: pointer;
  min-height: 40px;
  outline: var(--rich-text-editor-border-width, 1px) solid transparent;
}

:host(:empty) {
  outline: var(--rich-text-editor-border-width, 1px) dashed var(--rich-text-editor-border-color);
}

:host(:hover),
:host([contenteditable="true"]),
:host([contenteditable="true"]):focus-within,
:host([contenteditable="true"]):focus {
  outline: var(--rich-text-editor-border-width, 1px) solid var(--rich-text-editor-border-focus-color);
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

:host(:empty):before {
  content: attr(placeholder);
  padding: 0 5px;
  display: block;
  z-index: -1;
  color: var(--rich-text-editor-button-disabled-color);
}

*::selection .rich-text-editor-selection {
  background-color: var(--rich-text-editor-selection-bg);
}

::slotted(*:first-child) {
  margin-top: 0;
}

::slotted(*:last-child) {
  margin-bottom: 0;
}
      `
    ];
  }

// render function
  render() {
    return html`

<slot
  @focus="${(e) => (this.__focused = true)}"
  @blur="${(e) => (this.__focused = false)}"
  @mouseover="${(e) => (this.__hovered = true)}"
  @mouseout="${(e) => (this.__hovered = false)}"></slot>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Rich text-editor",
    "description": "a standalone rich text editor",
    "icon": "icons:android",
    "color": "green",
    "groups": ["Text"],
    "handles": [
      {
        "type": "todo:read-the-docs-for-usage"
      }
    ],
    "meta": {
      "author": "nikkimk",
      "owner": "Penn State University"
    }
  },
  "settings": {
    "configure": [
      {
        "property": "title",
        "description": "",
        "inputMethod": "textfield",
        "required": false,
        "icon": "icons:android"
      }
    ],
    "advanced": []
  }
}
;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
  
  ...super.properties,
  
  /**
   * editor's unique id
   */
  "id": {
    "name": "id",
    "type": String,
    "reflect": true,
    "attribute": "id"
  },
  /**
   * Maps to contenteditable attribute
   */
  "contenteditable": {
    "name": "contenteditable",
    "type": Boolean,
    "reflect": true,
    "attribute": "contenteditable"
  },
  /**
   * don't reveal toolbar on mouseover
   */
  "disableHover": {
    "name": "disableHover",
    "type": Boolean,
    "attribute": "disable-hover"
  },
  /**
   * Placeholder text for empty editable regions
   */
  "placeholder": {
    "name": "placeholder",
    "type": String,
    "reflect": true,
    "attribute": "placeholder"
  },

  /**
   * id for toolbar
   */
  "toolbar": {
    "name": "toolbar",
    "type": String,
    "reflect": true,
    "attribute": "toolbar"
  },

  /**
   * current range
   */
  "range": {
    "name": "range",
    "type": Object,
    "attribute": "range"
  },
  /**
   * raw html
   */
  "rawhtml": {
    "type": String,
    "attribute": "rawhtml"
  },

  /**
   * type of editor toolbar, i.e.
   * full - full for full toolbar with breadcrumb,
   * mini - mini for mini floating toolbar, or
   * default toolbar if neither.
   */
  "type": {
    "name": "type",
    "type": String,
    "reflect": true,
    "attribute": "type"
  },
  /**
   * whether to update range
   */
  "updateRange": {
    "type": Boolean
  },

  /**
   * contains cancelled edits
   */
  "__canceledEdits": {
    "type": Object
  },

  /**
   * connected toolbar
   */
  "__connectedToolbar": {
    "type": Object
  },

  /**
   * has focus
   */
  "__focused": {
    "type": Boolean
  },

  /**
   * is hovered
   */
  "__hovered": {
    "type": Boolean
  },

  /**
   * selection management
   */
  "__selection": {
    "type": Object
  }
}
;
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
    this.range = undefined;
    this.__selection = window.RichTextEditorSelection.requestAvailability();
    let root = this;
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
    if (this.isEmpty() && !!this.rawhtml) this.setHTML(this.rawhtml);
    if (this.isEmpty()) this.innerHTML = "";
    this._editableChange();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "contenteditable") this._editableChange();
      if (propName === "range") this._rangeChange();
      if (propName === "rawhtml" && !!this.rawhtml) this.setHTML(this.rawhtml);
    });
  }
  disableEditing() {
    console.log("disableEditing", !this.innerHTML, this.trimHTML(this));
    this.contenteditable = false;
    this.dispatchEvent(
      new CustomEvent("editing-disabled", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: (this.innerHTML || "").replace(/<!--[^(-->)]*-->/g, "").trim(),
      })
    );
    console.log("disableEditing 2", !this.innerHTML, this.trimHTML(this));
  }
  enableEditing() {
    console.log("enableEditing", !this.innerHTML, this.trimHTML(this));
    this.contenteditable = true;
    this.dispatchEvent(
      new CustomEvent("editing-enabled", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: (this.innerHTML || "").replace(/<!--[^(-->)]*-->/g, "").trim(),
      })
    );
    console.log("enableEditing 2", !this.innerHTML, this.trimHTML(this));
  }
  focus() {
    console.log("focus", !this.innerHTML, this.trimHTML(this));
    this.__focused = true;
    this.dispatchEvent(
      new CustomEvent("focus", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: this.querySelector("*"),
      })
    );
    console.log("focus", !this.innerHTML, this.trimHTML(this));
  }
  getHTML() {
    return this.isEmpty() || this.isPlaceholder()
      ? ""
      : (this.innerHTML || "").replace(/<!--[^(-->)]*-->/g, "").trim();
  }
  /**
   * determines if editor is empty
   *
   * @returns {string}
   * @memberof RichTextEditor
   */
  isEmpty() {
    console.log("isEmpty", !this.innerHTML, this.trimHTML(this));
    return !this.innerHTML || this.trimHTML(this) == "";
  }
  isPlaceholder() {
    console.log(
      "isPlaceholder",
      this.trimHTML(this),
      this.trimString(this.placeholderHTML)
    );
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
  setHTML(rawhtml = "") {
    console.log("setHTML", rawhtml);
    this.innerHTML = rawhtml.trim();
    this.setCancelHTML(rawhtml.trim());
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
      if (this.isEmpty()) this.innerHTML = this.placeholderHTML;
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
  _rangeChange(e) {}
}

window.customElements.define(RichTextEditor.tag, RichTextEditor);
export { RichTextEditor };
