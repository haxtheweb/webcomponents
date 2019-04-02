/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "./rich-text-editor-styles.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
/**
 * `rich-text-editor-link`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorLink extends RichTextEditorButton {
  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-link";
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    let root = this;
    root.addEventListener("mousedown", function(e) {
      e.preventDefault();
    });
    root.addEventListener("keydown", function(e) {
      e.preventDefault();
    });
  }

  /**
   * Handles button tap;
   */
  _buttonTap(e) {
    e.preventDefault();
    let button = document.createElement("button");
    button.appendNode(this.selection.extractContents());
    this.selection.insertNode(button);
    console.log("tap");
  }
}
window.customElements.define(RichTextEditorLink.tag, RichTextEditorLink);
export { RichTextEditorLink };
