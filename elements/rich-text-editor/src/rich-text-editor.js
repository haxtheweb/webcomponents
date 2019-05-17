/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "./lib/rich-text-editor-styles.js";
import "./lib/singletons/rich-text-editor-clipboard.js";
import "./lib/toolbars/rich-text-editor-toolbar.js";
import "./lib/toolbars/rich-text-editor-toolbar-mini.js";
import "./lib/toolbars/rich-text-editor-toolbar-full.js";
/**
 * `rich-text-editor`
 * `a standalone rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/mini.html mini floating toolbar
 * @demo demo/full.html toolbar with breadcrumb
 * @demo demo/config.html custom configuration
 */
class RichTextEditor extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    let style = document.createElement("style");
    style.setAttribute("is", "custom-style");
    style.setAttribute("include", "rich-text-editor-styles");
    if (!this.id) this.id = this._generateUUID();
    document.head.append(style);
  }
  /**
   * ready
   */
  ready() {
    super.ready();
    this.getEditor();
  }
  /**
   * connects the mini-toolbar to a mini editor
   */
  getEditor() {
    window.RichTextEditorClipboard.requestAvailability();
    let root = this,
      toolbar = "rich-text-editor-toolbar",
      id = this.toolbar ? "#" + this.toolbar : "",
      type =
        this.type === "full" || this.type === "mini" ? "-" + this.type : "",
      both = document.querySelector(toolbar + type + id),
      idOnly = document.querySelector(
        toolbar +
          id +
          "," +
          toolbar +
          "-full" +
          id +
          "," +
          toolbar +
          "-mini" +
          id
      ),
      typeOnly = document.querySelector(toolbar + type),
      //try to match both id and type, if no match try id only, and then type only
      editor = both || idOnly || typeOnly;
    //if still no match, create a region of type
    if (!this.toolbar) this.toolbar = this._generateUUID();
    if (!editor || !editor.addEditableRegion) {
      editor = document.createElement(toolbar + type);
      editor.id = this.toolbar;
      root.parentNode.appendChild(editor);
    }
    editor.addEditableRegion(root);
  }

  /**
   * Normalizes selection data.
   *
   * @returns {object} the selection
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
   */
  _generateUUID() {
    let hex = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}

export { RichTextEditor };

window.customElements.define(RichTextEditor.tag, RichTextEditor);
