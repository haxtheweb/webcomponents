/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorStyles } from "./lib/rich-text-editor-styles.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
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
    this.placeholder = "Click to edit";
    this.toolbar = "";
    this.type = "rich-text-editor-toolbar";
    this.id = "";
  }
  /**
   * life cycle, element is afixed to the DOM
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback();
    if (!this.id) this.id = this._generateUUID();
    this.getEditor();
    window.RichTextEditorStyleManager.requestAvailability();
  }
  /**
   * connects the mini-toolbar to a mini editor
   * @returns {void}
   */
  getEditor() {
    let id = this.toolbar ? "#" + this.toolbar : "",
      both = document.querySelector(this.type + id),
      idOnly = id ? document.querySelector(id) : null,
      typeOnly = document.querySelector(this.type),
      //try to match both id and type, if no match try id only, and then type only
      toolbar = both || idOnly || typeOnly;
    //if still no match, create a region of type
    if (!this.toolbar) this.toolbar = this._generateUUID();
    if (!toolbar || !toolbar.addEditableRegion) {
      toolbar = document.createElement(this.type);
      toolbar.id = this.toolbar;
      this.parentNode.appendChild(toolbar);
    }
    toolbar.addEditableRegion(this);
  }

  /**
   * Normalizes selected range data.
   *
   * @returns {object} the selected range
   */
  _getRange() {
    let sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    } else if (sel) {
      return sel;
    } else false;
  }

  /**
   * Generate a UUID
   * @returns {string} a unique id
   */
  _generateUUID() {
    let hex = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
  }
}

window.customElements.define(RichTextEditor.tag, RichTextEditor);
export { RichTextEditor };
