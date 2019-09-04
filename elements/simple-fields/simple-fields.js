/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { MutableData } from "@polymer/polymer/lib/mixins/mutable-data.js";
import { varExists, varGet } from "@lrnwebcomponents/hax-body/lib/haxutils.js";
import "@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js";
import "@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";
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
class SimpleFields extends MutableData(PolymerElement) {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          background-color: #ffffff;
          overflow: visible;
        }

        :host([hidden]) {
          display: none;
        }

        eco-json-schema-object {
          width: 50%;
        }
        eco-json-schema-object {
          color: var(--hax-text-color);
          --eco-json-form-color: var(--hax-text-color);
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
      <style include="simple-colors-shared-styles"></style>
      <eco-json-schema-object
        id="schemaobject"
        autofocus$="[[autofocus]]"
        hide-line-numbers$="[[hideLineNumbers]]"
        on-form-changed="_formFieldsChanged"
        schema="[[__validatedSchema]]"
        value="{{value}}"
      ></eco-json-schema-object>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return;
  }
  // properties available to the custom element for data binding
  static get properties() {
    let props = {
      /**
       * automatically set focus on the first field if that field has autofocus
       */
      autofocus: {
        type: Boolean,
        value: false
      },
      /**
       * hide code-editor line numbers
       */
      hideLineNumbers: {
        type: Boolean,
        value: false
      },
      /**
       * Fields to convert toJSON Schema.
       */
      fields: {
        type: Array,
        value: [],
        observer: "_formFieldsChanged"
      },
      /**
       * Returned value from the form input.
       */
      value: {
        type: Object,
        notify: true,
        value: {},
        observer: "_valueChanged"
      },
      /**
       * Fields to convert to JSON Schema.
       */
      __validatedSchema: {
        type: Array,
        notify: true,
        value: {
          properties: {}
        }
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
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
    let root = this;
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(SimpleFields.haxProperties, SimpleFields.tag, this);
    import("./lib/simple-fields-imports.js");
  }
  /**
   * when form changes, sets focus on the first field if this has auto-focus
   */
  _formFieldsChanged(e) {
    this.dispatchEvent(
      new CustomEvent("fields-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: e ? e.detail : this
      })
    );
  }
  /**
   * fires when either the eco-json-schema-object or the simple-fields object changes the value
   * @param {object} oldValue the old value
   * @param {object} newValue the new value
   */
  _valueChanged(newValue, oldValue) {
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      this._setValues();
      this.dispatchEvent(
        new CustomEvent("value-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }
  }

  /**
   * fires when the fields array changes
   * @param {object} oldValue the old value
   * @param {object} newValue the new value
   */
  _fieldsChanged(newValue, oldValue) {
    //prevent a potential feedback loop
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      this._setValues();
    }
  }
  /**
   * when either the fields or the value changes, updates the schema and form to match
   */
  _setValues() {
    let wiring = window.HAXWiring,
      schema = wiring._getHaxJSONSchemaProperty(this.fields, wiring);
    for (let prop in this.value) {
      if (schema[prop]) schema[prop].value = this.value[prop];
    }
    this.set("__validatedSchema", { properties: schema });
    this.notifyPath("__validatedSchema.properties.*");
  }
}
window.customElements.define(SimpleFields.tag, SimpleFields);
export { SimpleFields };
