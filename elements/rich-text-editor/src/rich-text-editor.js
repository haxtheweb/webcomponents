/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "./lib/rich-text-editor-styles.js";
import "./lib/rich-text-editor-toolbar.js";
import "./lib/rich-text-editor-clipboard.js";
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
    document.head.append(style);
  }
  /**
   * ready
   */
  ready() {
    super.ready();
    let root = this,
      clipboard = window.RichTextEditorClipboard.requestAvailability();
    console.log("ready", clipboard);
    //find an editor by id
    let id = document.querySelector(
        "rich-text-editor-toolbar#" + this.editorId
      ),
      editor =
        id !== null ? id : document.querySelector("rich-text-editor-toolbar");
    if (editor === null) {
      editor = document.createElement("rich-text-editor-toolbar");
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
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}

export { RichTextEditor };

window.customElements.define(RichTextEditor.tag, RichTextEditor);
