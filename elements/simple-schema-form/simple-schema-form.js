/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-input/paper-textarea.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js";
import "@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";
import "@lrnwebcomponents/code-editor/code-editor.js";
import "@lrnwebcomponents/app-datepicker/app-datepicker.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";
import "@lrnwebcomponents/simple-icon-picker/simple-icon-picker.js";
import "@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js";
import "@lrnwebcomponents/paper-input-flagged/paper-input-flagged.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";

/**
 * `simple-schema-form`
 * `a simplified way of working with eco-json-schema`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleSchemaForm extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          background-color: #ffffff;
          overflow: hidden;
        }

        :host([hidden]) {
          display: none;
        }

        eco-json-schema-object {
          width: 50%;
        }
        eco-json-schema-object {
          color: var(--hax-text-color);
          --eco-json-schema-object-form : {
            -ms-flex: unset;
            -webkit-flex: unset;
            flex: unset;
            -webkit-flex-basis: unset;
            flex-basis: unset;
          }
        }
        eco-json-schema-object .hax-code-editor {
          padding: 0;
        }
      </style>
      <eco-json-schema-object
        id="schema-object"
        schema="[[__validatedSchema]]"
        value="{{value}}"
      ></eco-json-schema-object>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Returned value from the form input.
       */
      initialValue: {
        type: Object,
        notify: true,
        value: {},
        observer: "_valueChanged"
      },

      value: {
        type: Object,
        notify: true,
        value: {}
      },
      /**
       * Fields to conver toJSON Schema.
       */
      fields: {
        type: Array,
        value: [],
        observer: "_fieldsChanged"
      },
      /**
       * Fields to conver toJSON Schema.
       */
      __validatedSchema: {
        type: Array,
        value: { properties: {} }
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-schema-form";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Value in the form has changed, reflect to the preview.
   */
  _valueChanged(newValue) {
    if (newValue && this.schema) {
      for (var i in newValue) {
        this.schema[i].value = newValue[i];
      }
    }
  }

  _fieldsChanged() {
    let wiring = window.HAXWiring,
      fields = this.fields,
      schema = {
        $schema: "http://json-schema.org/schema#",
        title: this.title,
        type: "object",
        properties: {
          fields: { fields }
        }
      };
    this.set("__validatedSchema", {
      properties: wiring._getHaxJSONSchemaProperty(fields, wiring)
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleSchemaForm.tag, SimpleSchemaForm);
export { SimpleSchemaForm };
