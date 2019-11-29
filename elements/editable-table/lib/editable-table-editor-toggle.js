/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/image-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./editable-table-iconset.js";

/**
 * `editable-table-editor-toggle`
 * @customElement editable-table-editor-toggle
 * `A toggle button for an property in the editable-table interface (editable-table.html).`
 *
 * @microcopy - language worth noting:
 * ``
 * @customElement `
 <editable-table-editor-toggle
  hidden                           //Hide and disable this toggle? Default is false.
  label="Condensed"                //The label for the toggle button
  prop="condensed"                 //The property controlled by this toggle
  tooltip="Condense cell height."  //A tooltip for this toggle.
  value="true">                    //The value of this toggle.
</editable-table-editor-toggle>```
 *  
 * @demo ./demo/editor.html
 * 
 * @polymer

 */
class EditableTableEditorToggle extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host([hidden]) {
          display: none;
        }
        :host paper-button {
          padding: 2px;
          margin: 0;
          width: 100%;
          min-width: unset;
          display: inline-flex;
          justify-content: space-between;
          align-items: center;
          align-content: stretch;
          text-transform: unset;
          font-family: var(--editable-table-secondary-font-family);
          background-color: var(--editable-table-button-bg-color);
          color: var(--editable-table-button-color);
        }
        :host([toggled]) paper-button {
          background-color: var(--editable-table-button-toggled-bg-color);
          color: var(--editable-table-button-toggled-color);
        }
        :host(:not([disabled])) paper-button:focus,
        :host(:not([disabled])) paper-button:hover {
          background-color: var(--editable-table-button-hover-bg-color);
          color: var(--editable-table-button-hover-color);
          cursor: pointer;
        }
        :host([toggled]:not([disabled])) paper-button:focus,
        :host([toggled]:not([disabled])) paper-button:hover {
          background-color: var(--editable-table-button-toggled-hover-bg-color);
          color: var(--editable-table-button-toggled-hover-color);
          cursor: pointer;
        }
        :host([disabled]) paper-button {
          background-color: var(--editable-table-button-disabled-bg-color);
          color: var(--editable-table-button-disabled-color);
          cursor: not-allowed;
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
      </style>
      <paper-button
        id="button"
        active$="[[toggled]]"
        disabled$="[[disabled]]"
        label="[[label]]"
        toggles
        on-click="_onClick"
      >
        <span class="sr-only">[[label]]</span>
        <iron-icon icon$="[[icon]]" aria-hidden="true"></iron-icon>
      </paper-button>
      <paper-tooltip id="tooltip" for="button" aria-hidden
        >[[label]]</paper-tooltip
      >
    `;
  }

  static get tag() {
    return "editable-table-editor-toggle";
  }
  static get properties() {
    return {
      /**
       * Whether toggle is disabled
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Table id for accessibility
       */
      controls: {
        type: String,
        value: "table",
        readOnly: true,
        reflectToAttribute: true
      },
      /**
       * Button id that matches the table property to toggle
       */
      id: {
        type: String,
        value: null
      },
      /**
       * Button icon
       */
      icon: {
        type: String,
        value: null
      },
      /**
       * Button label
       */
      label: {
        type: String,
        value: null
      },
      /**
       * Whether the button is toggled
       */
      toggled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  /**
   * Fires when button is clicked
   * @event change
   */
  _onClick() {
    this.toggled = !this.toggled;
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }
}
window.customElements.define(
  EditableTableEditorToggle.tag,
  EditableTableEditorToggle
);
export { EditableTableEditorToggle };
