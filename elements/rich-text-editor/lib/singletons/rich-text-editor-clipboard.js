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
  /**
   * component is ready
   */
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
    console.log(e);
    e.preventDefault();
    this.pasteFromClipboard(this.getRange());
  }
  handleCutButton(e) {
    this.copyToClipboard(e.detail.range, true);
  }
  handleCopyButton(e) {
    this.copyToClipboard(e.detail.range);
  }
  handlePasteButton(e) {
    this.pasteFromClipboard(e.detail.range);
  }
  copyToClipboard(range, cut = false) {
    this.$.clipboard.innerHTML = "";
    if (range && range.cloneContents)
      this.$.clipboard.appendChild(range.cloneContents());
    if (cut && range.extractContents) range.extractContents();
  }
  pasteFromClipboard(range) {
    let div = document.createElement("div"),
      parent = range.commonAncestorContainer.parentNode,
      closest = parent.closest(
        "[contenteditable=true]:not([disabled]),input:not([disabled]),textarea:not([disabled])"
      );
    if (closest) {
      div.innerHTML = this.$.clipboard.innerHTML;
      if (range && range.extractContents) {
        range.extractContents();
        console.log("empty?", range.cloneContents());
      }
      range.insertNode(div);
      while (div.firstChild) {
        div.parentNode.insertBefore(div.firstChild, div);
      }
      div.parentNode.removeChild(div);
    }
  }

  /**
   * Normalizes selected range data.
   * @returns {object} the selected range
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
  if (window.RichTextEditorClipboard.instance == null) {
    window.RichTextEditorClipboard.instance = document.createElement(
      "rich-text-editor-clipboard"
    );
    document.body.appendChild(window.RichTextEditorClipboard.instance);
  }
  return window.RichTextEditorClipboard.instance;
};
