/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "../rich-text-editor-styles.js";
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
        :host([hidden]) {
          display: none;
        }
      </style>
      <slot></slot>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      hidden: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      range: {
        type: Object,
        value: null,
        observer: "_updateToolbar"
      },
      toolbar: {
        type: Object,
        value: null
      }
    };
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
    document.addEventListener("selectionchange", e => {
      root.range = root.getRange();
    });
    document.addEventListener("select-rich-text-editor-toolbar", e => {
      root._toolbarChange(e);
    });
    document.addEventListener("deselect-rich-text-editor-toolbar", e => {
      root._toolbarChange(e, false);
    });
  }

  /**
   * life cycle, element is disconnected
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    let root = this;
    document.removeEventListener("selectionchange", e => {
      root.range = root.getRange();
    });
    document.removeEventListener("select-rich-text-editor-toolbar", e => {
      root._toolbarChange(e);
    });
    document.removeEventListener("deselect-rich-text-editor-toolbar", e => {
      root._toolbarChange(e, false);
    });
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

  /**
   * Updates the toolbar
   */
  _updateToolbar() {
    if (this.toolbar) this.toolbar.selection = this.range();
  }

  _toolbarChange(e, deselect = false) {
    if (!deselect || this.toolbar === e.detail) {
      sel.removeAllRanges();
      this.toolbar = deselect ? null : e.detail;
    }
  }

  /**
   * Preserves the selection when a button is pressed
   *
   * @param {object} the button
   * @returns {void}
   * /
  _preserveSelection() {
    let sel = window.getSelection(),
      temp = this.selection;
    this.buttons.forEach(button => {
      button.selection = temp;
    });
    sel.removeAllRanges();
    sel.addRange(temp);
  }


  /**
   * removes the selection
   * @param {object} selection object
   * @param {object} contents of the selection object
   * @param {boolean} remove tag wrapping the content
   */
  deselect(contents = null, unwrap = false) {
    while (unwrap && contents.firstChild) {
      this.insertBefore(contents.firstChild, contents);
      this.removeChild(contents);
    }
    this.parentNode.insertBefore(this.firstChild, this);
    document.body.appendChild(this);
    this.hidden = true;
  }

  /**
   * removes the selection
   * @param {object} selection object
   * @param {object} contents of the selection object
   */
  select(range = null, contents = null) {
    if (!range) range = this.getRange();
    if (!contents)
      contents = range && range.cloneContents ? range.cloneContents() : "";
    this.appendChild(contents);
    range.insertNode(this);
    this.hidden = false;
  }
}
window.customElements.define(
  RichTextEditorSelection.tag,
  RichTextEditorSelection
);
export { RichTextEditorSelection };

window.RichTextEditorSelection = {};
window.RichTextEditorSelection.instance = null;
/**
 * Checks to see if there is an instance available, and if not appends one
 */
window.RichTextEditorSelection.requestAvailability = function() {
  if (window.RichTextEditorSelection.instance == null) {
    window.RichTextEditorSelection.instance = document.createElement(
      "rich-text-editor-selection"
    );
  }
  document.body.appendChild(window.RichTextEditorSelection.instance);
  return window.RichTextEditorSelection.instance;
};
