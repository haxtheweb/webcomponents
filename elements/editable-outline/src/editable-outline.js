/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@lrnwebcomponents/json-outline-schema/json-outline-schema.js";
import { getRange } from "./lib/shadows-safari.js";

/**
 * `editable-outline`
 * `a simple outline thats contenteditable in nature`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class EditableOutline extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */
  constructor() {
    super();
    this.polyfillSafe = this.computePolyfillSafe();
    window.JSONOutlineSchema.requestAvailability();
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "editable-outline";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.activeNode = this.$.outline;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
  // Observer manifest for changes
  _manifestChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
    }
  }

  // Observer editMode for changes
  _editModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
    }
  }
  /**
   * Button events internally
   */
  buttonEvents(e) {
    switch (e.target.id) {
      case "indent":
        document.execCommand("indent");
        break;
      case "outdent":
        document.execCommand("outdent");
        break;
    }
  }
  /**
   * Find the next thing to tab forward to.
   */
  _tabKeyPressed(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // try selection / tab block since range can cause issues
    try {
      let range = this.getDeepRange().cloneRange();
      var tagTest = range.commonAncestorContainer.tagName;
      if (typeof tagTest === typeof undefined) {
        tagTest = range.commonAncestorContainer.parentNode.tagName;
      }
      if (this.polyfillSafe) {
        document.execCommand("indent");
        if (e.detail.keyboardEvent) {
          e.detail.keyboardEvent.preventDefault();
          e.detail.keyboardEvent.stopPropagation();
          e.detail.keyboardEvent.stopImmediatePropagation();
        }
      }
    } catch (e) {}
  }
  /**
   * Move back through things when tab back pressed
   */
  _tabBackKeyPressed(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    // try selection / tab block since range can cause issues
    try {
      let range = this.getDeepRange().cloneRange();
      var tagTest = range.commonAncestorContainer.tagName;
      if (typeof tagTest === typeof undefined) {
        tagTest = range.commonAncestorContainer.parentNode.tagName;
      }
      if (this.polyfillSafe) {
        document.execCommand("outdent");
        if (e.detail.keyboardEvent) {
          e.detail.keyboardEvent.preventDefault();
          e.detail.keyboardEvent.stopPropagation();
          e.detail.keyboardEvent.stopImmediatePropagation();
        }
      }
    } catch (e) {}
  }
  /**
   * Selection normalizer
   */
  getDeepSelection() {
    // try and obtain the selection from the nearest shadow
    // which would give us the selection object when running native ShadowDOM
    // with fallback support for the entire window which would imply Shady
    // native API
    if (this.shadowRoot.getSelection) {
      return this.shadowRoot.getSelection();
    }
    // ponyfill from google
    else if (getRange(this.$.outline.parentNode)) {
      return getRange(this.$.outline.parentNode);
    }
    // missed on both, hope the normal one will work
    return window.getSelection();
  }
  /**
   * Get a normalized range based on current selection
   */
  getDeepRange() {
    let sel = this.getDeepSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    } else if (sel) {
      return sel;
    } else false;
  }
  /**
   * These are our bad actors in polyfill'ed browsers.
   * This means that https://github.com/webcomponents/webcomponentsjs/commit/ce464bb533bf39b544c312906499a6044ee0d30d
   * explains things but basically if shadow-dom is polyfilled
   * then we can't safely execute a DOM manipulating execCommand.
   * This
   */
  computePolyfillSafe() {
    if (document.head.createShadowRoot || document.head.attachShadow) {
      return true;
    } else {
      console.log("Shadow DOM missing, certain operations hidden");
      return false;
    }
  }
}
window.customElements.define(EditableOutline.tag, EditableOutline);
export { EditableOutline };
