/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { MutableData } from "@polymer/polymer/lib/mixins/mutable-data.js";
import { varExists, varGet } from "@lrnwebcomponents/utils/utils.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/eco-json-schema-form/eco-json-schema-form.js";
import "@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";
import "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
/**
 * `simple-fields`
 * Uses eco-json-form and HAX wiring to display a series of fields
 * @polymer
 * @demo ./demo/index.html
 * @customElement simple-fields
 */
class SimpleFields extends MutableData(PolymerElement) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
    import("./lib/simple-fields-imports.js");
  }
  /**
   * Fires when form changes to set focus on the first field if this has auto-focus
   * @event fields-changed
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
      /**
       * Fires when value changes
       * @event value-changed
       */
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
    let wiring = new HAXWiring(),
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
