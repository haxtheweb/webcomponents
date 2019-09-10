/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "@polymer/paper-item/paper-item.js";
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
        :host {
          display: block;
        }
        :host .setting {
          font-size: 95%;
          padding: var(--editable-table-toggle-padding, 8px 0px);
          justify-content: space-between;
          width: 100%;
        }
        :host([disabled]) .setting-text {
          opacity: 0.5;
        }
      </style>
      <div class="setting">
        <div class="setting-control">
          <paper-toggle-button
            id="button"
            checked\$="[[value]]"
            disabled\$="[[disabled]]"
            >[[label]]</paper-toggle-button
          >
          <paper-tooltip id="tooltip" for="button">[[tooltip]]</paper-tooltip>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "editable-table-editor-toggle";
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("change", this._onChange.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("change", this._onChange.bind(this));
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
       * label for menu setting
       */
      label: {
        type: String,
        value: null
      },
      /**
       * the property to update
       */
      prop: {
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
      value: {
        type: Boolean,
        value: false
      }
    };
  }

  /**
   * Set up event listener to fire when toggled
   */
  _onChange(e) {
    if (e.srcElement === this.$.button)
      this.dispatchEvent(
        new CustomEvent("editable-table-setting-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            prop: this.prop,
            value: e.srcElement.checked
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
