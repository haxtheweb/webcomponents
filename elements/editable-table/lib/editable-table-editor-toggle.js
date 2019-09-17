/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-button/paper-button.js";
import "./editable-table-iconset.js";
import "@polymer/iron-icons/image-icons.js";
import "@polymer/iron-icons/device-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";

/**
 * `editable-table-editor-toggle`
 * `A toggle button for an property in the editable-table interface (editable-table.html).`
 *
 * @microcopy - language worth noting:
 * ```
 <editable-table-editor-toggle
  hidden                           //Hide and disable this toggle? Default is false.
  label="Condensed"                //The label for the toggle button
  prop="condensed"                 //The property controlled by this toggle
  tooltip="Condense cell height."  //A tooltip for this toggle.
  value="true">                    //The value of this toggle.
</editable-table-editor-toggle>```
 *  
 * @demo demo/editor.html
 * 
 * @polymer
 * @customElement
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
      <span hidden$="[[!toggled]]" class="sr-only">[[labelOn]]</span>
      <span hidden$="[[toggled]]" class="sr-only"
        >[[_getLabel(labelOff,labelOn)]]</span
      >
      <paper-button id="button" disabled$="[[disabled]]">
        <iron-icon icon$="[[icon]]"></iron-icon>
      </paper-button>
      <paper-tooltip for="button">[[tooltip]]</paper-tooltip>
    `;
  }

  static get tag() {
    return "editable-table-editor-toggle";
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("click", this._onClick.bind(this));
    });
  }
  disconnectedCallback() {
    this.addEventListener("click", this._onClick.bind(this));
    super.disconnectedCallback();
  }
  static get properties() {
    return {
      /**
       * is the toggle disabled
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * button id
       */
      id: {
        type: String,
        value: null
      },
      /**
       * icon
       */
      icon: {
        type: String,
        value: null
      },
      /**
       * label that indicates that button is toggled off
       */
      labelOff: {
        type: String,
        value: null
      },
      /**
       * label that indicates that button is toggled on
       */
      labelOn: {
        type: String,
        value: null
      },
      /**
       * tool tip for menu setting
       */
      tooltip: {
        type: String,
        value: null
      },
      /**
       * boolean value of menu setting
       */
      toggled: {
        type: Boolean,
        value: false
      }
    };
  }
  _getLabel(off, on) {
    return off || on;
  }

  /**
   * Set up event listener to fire when toggled
   */
  _onClick() {
    console.log("editable-table-setting-changed", this.id, this.toggled);
    this.dispatchEvent(
      new CustomEvent("editable-table-setting-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          prop: this.id,
          value: !this.toggled
        }
      })
    );
  }
}
window.customElements.define(
  EditableTableEditorToggle.tag,
  EditableTableEditorToggle
);
export { EditableTableEditorToggle };
