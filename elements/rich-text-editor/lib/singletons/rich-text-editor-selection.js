/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./rich-text-editor-styles.js";
/**
 * `rich-text-editor-selection`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorSelection extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style include="rich-text-editor-styles">
        :host {
          background-color: var(--rich-text-editor-selection-bg);
          @apply --rich-text-editor-content-selection;
        }
      </style>
      <slot></slot>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-selection";
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * removes the selection
   * @param {object} selection object
   * @param {object} contents of the selection object
   * @param {boolean} remove tag wrapping the content
   */
  deselect(contents, unwrap = false) {
    while (unwrap && contents.firstChild) {
      this.insertBefore(contents.firstChild, contents);
      this.removeChild(contents);
    }
    this.parentNode.insertBefore(this.firstChild, this);
    this.parentNode.removeChild(this);
  }

  /**
   * removes the selection
   * @param {object} selection object
   * @param {object} contents of the selection object
   */
  select(selection, contents) {
    this.appendChild(contents);
    selection.insertNode(this);
  }
}
window.customElements.define(
  RichTextEditorSelection.tag,
  RichTextEditorSelection
);
export { RichTextEditorSelection };
