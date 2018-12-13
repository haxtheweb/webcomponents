import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
`editable-table-editor-toggle`

A toggle button for an property in the editable-table 
interface (editable-table.html).

* @demo demo/index.html

@microcopy - the mental model for this element

<editable-table-editor-toggle
  hidden                          //Hide and disable this toggle? Default is false.
  label="Condensed"               //The label for the toggle button
  prop="condensed"                //The property controlled by this toggle
  tooltip="Condense cell height." //A tooltip for this toggle.
  value="true">                   //The value of this toggle.
</editable-table-editor-toggle>

*/
Polymer({
  _template: html`
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
  `,

  is: "editable-table-editor-toggle",
  listeners: { change: "_onChange" },

  properties: {
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
  },

  /**
   * Set up event listener to fire when toggled
   */
  _onChange: function(e) {
    let root = this;
    if (e.srcElement === this.$.button)
      root.fire("editable-table-setting-changed", {
        prop: this.prop,
        value: e.srcElement.checked
      });
  }
});
