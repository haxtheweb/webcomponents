/* Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `rich-text-editor-clipboard`
 * `a heading picker for the rich-text-editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorClipboard extends PolymerElement {
  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }
  static get template() {
    return html`
      <style>
        :host {
          display: none !important;
        }
      </style>
      <textarea id="clipboard" aria-hidden="true"></textarea>
    `;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-clipboard";
  }

  ready() {
    super.ready();
    let root = this;
    window.addEventListener("cut", root.handleCut.bind(root));
    window.addEventListener("copy", root.handleCopy.bind(root));
    window.addEventListener("paste", root.handlePaste.bind(root));
    window.addEventListener("cut-button", root.handleCopyButton.bind(root));
    window.addEventListener("copy-button", root.handleCopyButton.bind(root));
    window.addEventListener("paste-button", root.handlePasteButton.bind(root));
  }
  handleCut(e) {
    e.preventDefault();
    this.copyToClipboard(this.getRange(), true);
  }
  handleCopy(e) {
    e.preventDefault();
    this.copyToClipboard(this.getRange());
  }
  handlePaste(e) {
    e.preventDefault();
    this.pasteToClipboard(this.getRange());
  }
  handleCutButton(e) {
    this.copyToClipboard(e.detail.selection, true);
  }
  handleCopyButton(e) {
    this.copyToClipboard(e.detail.selection);
  }
  handlePasteButton(e) {
    this.pasteToClipboard(e.detail.selection);
  }
  copyToClipboard(selection, cut = false) {
    this.$.clipboard.innerHTML = "";
    console.log(selection);
    if (selection) this.$.clipboard.appendChild(selection.cloneContents());
    if (cut && selection.extractContents) selection.extractContents();
  }
  pasteToClipboard(selection) {
    let div = document.createElement("div"),
      parent = selection.commonAncestorContainer.parentNode,
      closest = parent.closest(
        "[contenteditable=true]:not([disabled]),input:not([disabled]),textarea:not([disabled])"
      );
    if (closest) {
      div.innerHTML = this.$.clipboard.innerHTML;
      if (selection && selection.extractContents) {
        selection.extractContents();
        selection.insertNode(div);
        while (div.firstChild) {
          div.parentNode.insertBefore(div.firstChild, div);
        }
        div.parentNode.removeChild(div);
      }
    }
  }

  /**
   * Normalizes selection data.
   *
   * @returns {object} the selection
   */
  getRange() {
    let sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    } else if (sel) {
      return sel;
    } else false;
  }
}
window.customElements.define(
  RichTextEditorClipboard.tag,
  RichTextEditorClipboard
);
export { RichTextEditorClipboard };

window.RichTextEditorClipboard = {};
window.RichTextEditorClipboard.instance = null;
/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.RichTextEditorClipboard.requestAvailability = function() {
  console.log(
    "window.RichTextEditorClipboard.requestAvailability",
    window.RichTextEditorClipboard.instance
  );
  if (window.RichTextEditorClipboard.instance == null) {
    window.RichTextEditorClipboard.instance = document.createElement(
      "rich-text-editor-clipboard"
    );
  }
  document.body.appendChild(window.RichTextEditorClipboard.instance);
  return window.RichTextEditorClipboard.instance;
};
