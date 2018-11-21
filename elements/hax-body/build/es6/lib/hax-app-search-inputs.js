import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@polymer/paper-item/paper-item.js";
import "../node_modules/@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
Polymer({
  _template: html`
  <custom-style>
    <style is="custom-style">
      :host {
        display: block;
      }
      eco-json-schema-object {
        --eco-json-schema-object-form : {
          -ms-flex: unset;
          -webkit-flex: unset;
          flex: unset;
          -webkit-flex-basis: unset;
          flex-basis: unset;
        };
        --paper-checkbox-size: 22px;
        --paper-checkbox-unchecked-color: var(--simple-colors-blue-grey-background1, grey);
        --paper-checkbox-checked-color: var(--simple-colors-light-green-foreground3, green);
        --paper-checkbox-checked-ink-color: #FFFFFF;
        --paper-checkbox-unchecked-ink-color: #FFFFFF;
        --paper-checkbox-label-color: var(--simple-colors-blue-grey-background1, blue);
        --paper-checkbox-label-checked-color: var(--simple-colors-accent-background1, green);
        --paper-checkbox-label: {
          font-size: 22px;
          line-height: 32px;
        };
        --paper-input-container-invalid-color: var(--simple-colors-red-foreground3, red);
        --secondary-text-color: #FFFFFF;
        --primary-text-color: #FFFFFF;
        --primary-color: #FFFFFF;
        --paper-input-container-input-color: #FFFFFF;
        --paper-input-container-color: #FFFFFF !important;
        --paper-input-container-focus-color: var(--simple-colors-light-green-background1, green) !important;
        --paper-listbox-color: #000000;
        color: white;
      }
      .search-label {
        font-size: 24px;
        color: var(--simple-colors-light-green-background1, green);
        font-weight: bold;
        margin: 0;
        padding: 0;
      }
    </style>
  </custom-style>
  <div class="search-label">Search [[label]]</div>
  <eco-json-schema-object id="form" schema="[[schema]]" value="{{values}}"></eco-json-schema-object>
`,
  is: "hax-app-search-inputs",
  observers: ["_valueChanged(values.*)"],
  properties: {
    label: { type: String, value: "app" },
    values: { type: Object },
    schema: { type: Object }
  },
  _valueChanged: function(change) {
    this.fire("hax-app-search-values-changed", change.base);
  }
});
