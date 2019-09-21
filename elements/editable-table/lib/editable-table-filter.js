/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "./editable-table-iconset.js";

/**
 * `editable-table-editor-filter`
 * `Displays a cell in the editable-table-display mode (editable-table-display.html) as a filter button.`
 *
 * @demo demo/display.html
 *
 * @polymer
 * @customElement
 */
class EditableTableFilter extends PolymerElement {
  static get template() {
    return html`
      <style is="custom-style">
        :host paper-button {
          padding: 0;
          margin: 0;
          width: 100%;
          min-width: unset;
          display: inline-flex;
          justify-content: space-between;
          align-items: center;
          align-content: stretch;
          text-transform: unset;
          font-family: var(--editable-table-font-family);
        }
        :host paper-button > div {
          flex-grow: 1;
        }
        :host iron-icon {
          min-width: 24px;
        }
        :host .sr-only {
          position: absolute;
          left: -9999px;
          font-size: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        :host #filter-off {
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
      </style>
      <paper-button id="button" class="container" on-click="_onFilterClicked">
        <span>[[text]]</span>
        <span class="sr-only" hidden\$="[[!filtered]]"> (filtered)</span>
        <span class="sr-only"> Toggle filter.</span>
        <iron-icon id="filter" icon="editable-table:filter"></iron-icon>
        <iron-icon id="filter-off" icon="editable-table:filter-off"></iron-icon>
      </paper-button>
      <paper-tooltip for="button">Toggle filter for "[[text]]"</paper-tooltip>
    `;
  }

  static get tag() {
    return "editable-table-filter";
  }
  static get properties() {
    return {
      /**
       * Index of the column
       */
      columnIndex: {
        type: Number,
        value: null
      },
      /**
       * Whether the column is filtered
       */
      filtered: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Column header text
       */
      text: {
        type: String,
        value: ""
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
