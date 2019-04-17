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
 * `simple-fields`
 * `Uses eco-json-form and HAX wiring to display a series of fields`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleFields extends PolymerElement {
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

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Simple fields",
        description:
          "Uses eco-json-form and HAX wiring to display a series of fields",
        icon: "icons:android",
        color: "green",
        groups: ["Fields"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "nikkimk",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "fields",
            description: "",
            inputMethod: "array",
            required: false,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Returned value from the form input.
       */
      initialValue: {
        type: "Object",
        notify: true,
        value: {},
        observer: "_valueChanged"
      },

      value: {
        type: "Object",
        notify: true,
        value: {}
      },
      /**
       * Fields to conver toJSON Schema.
       */
      fields: {
        type: "Array",
        value: [],
        observer: "_fieldsChanged"
      },
      /**
       * Fields to conver toJSON Schema.
       */
      __validatedSchema: {
        type: "Array",
        value: { properties: {} }
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-fields";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(SimpleFields.haxProperties, SimpleFields.tag, this);
  }

  /**
   * Value in the form has changed, reflect to the preview.
   */
  _valueChanged(newValue) {
    console.log("_valueChanged", newValue, this.schema);
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
window.customElements.define(SimpleFields.tag, SimpleFields);
export { SimpleFields };
