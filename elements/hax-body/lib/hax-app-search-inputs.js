import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-item/paper-item.js";
import "eco-json-schema-form/eco-json-schema-wizard.js";
import "simple-colors/simple-colors.js";
/**
`hax-app-search-inputs`
 An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that hax-manager can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.

@demo demo/index.html

@microcopy - the mental model for this element
 - hax-app - a source of input we're querying for media / content
 - hax-app-search - element controlling the experience of searching an app
 - hax-body - the text are ultimately we are trying to insert this item into
*/
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
      }
      .search-label {
        font-size: 24px;
        color: var(--simple-colors-light-green-background1);
        font-weight: bold;
        margin: 0;
        padding: 0;
      }
      eco-json-schema-object {
        color: white;
        --eco-json-schema-object-form : {
          -ms-flex: unset;
          -webkit-flex: unset;
          flex: unset;
          -webkit-flex-basis: unset;
          flex-basis: unset;
        };
        --paper-checkbox-size: 22px;
        --paper-checkbox-unchecked-color: var(--simple-colors-blue-grey-background1);
        --paper-checkbox-checked-color: var(--simple-colors-light-green-foreground3);
        --paper-checkbox-checked-ink-color: #FFFFFF;
        --paper-checkbox-unchecked-ink-color: #FFFFFF;
        --paper-checkbox-label-color: var(--simple-colors-blue-grey-background1);
        --paper-checkbox-label-checked-color: var(--simple-colors-accent-background1);
        --paper-checkbox-label: {
          font-size: 22px;
          line-height: 32px;
        };
        --paper-input-container-invalid-color: var(--simple-colors-red-foreground3);
        --secondary-text-color: #FFFFFF;
        --primary-text-color: #FFFFFF;
        --primary-color: #FFFFFF;
        --paper-input-container-input-color: #FFFFFF;
        --paper-input-container-color: #FFFFFF !important;
        --paper-input-container-focus-color: var(--simple-colors-light-green-background1) !important;
        --paper-listbox-color: #000000;
      }
    </style>
    <div class="search-label">Search [[label]]</div>
    <eco-json-schema-object id="form" schema="[[schema]]" value="{{values}}"></eco-json-schema-object>
`,

  is: "hax-app-search-inputs",

  observers: ["_valueChanged(values.*)"],

  properties: {
    /**
     * Title.
     */
    label: {
      type: String,
      value: "app"
    },
    /**
     * Search input values mapped to schema inputs.
     */
    values: {
      type: Object
    },
    /**
     * Schema used to generate the input types.
     */
    schema: {
      type: Object
    }
  },

  /**
   * Search input was added.
   */
  _valueChanged: function(change) {
    this.fire("hax-app-search-values-changed", change.base);
  }
});
