/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "./editable-table-iconset.js";

/**
 * `editable-table-editor-filter`
 * `Displays a cell in the editable-table-display mode (editable-table-display.html) as a filter button.`
 *
 * @demo ./demo/display.html
 *
 * @polymer
 * @customElement
 */
class EditableTableFilter extends LitElement {
  static get styles() {
    return [
      css`
        paper-button {
          padding: var(--editable-table-cell-padding, 0);
          margin: 0;
          width: auto;
          min-width: unset;
          display: flex;
          justify-content: space-between;
          align-items: center;
          align-content: stretch;
          text-transform: unset;
          font-family: var(--editable-table-font-family);
        }
        paper-button > div {
          flex-grow: 1;
        }
        iron-icon {
          min-width: 24px;
        }
        .sr-only {
          position: absolute;
          left: -9999px;
          font-size: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        #filter-off {
          opacity: 0.25;
        }
        :host(:not([filtered])) .filtered,
        :host(:not([filtered]):not(:focus):not(:hover)) #filter,
        :host(:not([filtered]):focus) #filter-off,
        :host(:not([filtered]):hover) #filter-off,
        :host([filtered]:not(:focus):not(:hover)) #filter-off,
        :host([filtered]:focus) #filter,
        :host([filtered]:hover) #filter {
          display: none;
        }
      `
    ];
  }
  render() {
    return html`
      <paper-button
        id="button"
        class="container"
        @click="${this._onFilterClicked}"
      >
        <span>${this.text}</span>
        <span class="sr-only" .hidden="${!this.filtered}"> (filtered)</span>
        <span class="sr-only"> Toggle filter.</span>
        <iron-icon id="filter" icon="editable-table:filter"></iron-icon>
        <iron-icon id="filter-off" icon="editable-table:filter-off"></iron-icon>
      </paper-button>
      <paper-tooltip for="button"
        >Toggle Column ${this.columnIndex} filter for
        "${this.text}"</paper-tooltip
      >
    `;
  }

  static get tag() {
    return "editable-table-filter";
  }
  constructor() {
    super();
    this.columnIndex = null;
    this.filtered = false;
    this.text = "";
  }
  static get properties() {
    return {
      /**
       * Index of the column
       */
      columnIndex: {
        type: Number,
        attribute: "column-index"
      },
      /**
       * Whether the column is filtered
       */
      filtered: {
        type: Boolean,
        reflect: true
      },
      /**
       * Column header text
       */
      text: {
        type: String
      }
    };
  }

  /**
   * Listens for button click
   */
  _getPressed(filtered) {
    return filtered ? "true" : "false";
  }

  /**
   * Fires when filter button is clicked
   * @event toggle-filter
   */
  _onFilterClicked() {
    this.dispatchEvent(
      new CustomEvent("toggle-filter", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }
}
window.customElements.define(EditableTableFilter.tag, EditableTableFilter);
export { EditableTableFilter };
