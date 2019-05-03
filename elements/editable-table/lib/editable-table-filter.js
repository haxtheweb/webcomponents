import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "./editable-table-iconset.js";
/**
`editable-table-filter`
Displays a cell in the editable-table-display mode 
(editable-table-display.html) as a filter button.

* @demo demo/index.html

@microcopy - the mental model for this element

<editable-table-filter 
  column-number="1"       //The index of the cell's column
  text="">                //The text of the cell, which will become the filter value when button is toggled.
</editable-table-filter>

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
        }
        :host paper-button > div {
          flex-grow: 1;
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
      <paper-button id="button" class="container">
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
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("tap", this._onFilterTapped.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("tap", this._onFilterTapped.bind(this));
    super.disconnectedCallback();
  }
  static get properties() {
    return {
      /**
       * the column for the filter
       */
      columnNumber: {
        type: Number,
        value: null
      },
      /**
       * is the data filtered
       */
      filtered: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * the column header text
       */
      text: {
        type: String,
        value: ""
      }
    };
  }

  /**
   * listen for button tap
   */
  _getPressed(filtered) {
    return filtered ? "true" : "false";
  }

  /**
   * listen for button tap
   */
  _onFilterTapped() {
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
