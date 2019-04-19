/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { MutableData } from "@polymer/polymer/lib/mixins/mutable-data.js";
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
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(SimpleFields.haxProperties, SimpleFields.tag, this);
  }
  /**
   * fires when either the eco-json-schema-object or the simple-fields object changes the value
   * @param {object} oldValue the old value
   * @param {object} newValue the new value
   */
  _valueChanged(oldValue, newValue) {
    //prevent a feddback loop when the eco-json-schema-object's values change to reflect the changes to simple-fields
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      this._setValues();
    }
  }

  /**
   * fires when the fields array changes
   * @param {object} oldValue the old value
   * @param {object} newValue the new value
   */
  _fieldsChanged(oldValue, newValue) {
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
    //form won't refresh unless we set it to null. notifyPath wasn't enough to refresh it
    this.__validatedSchema = null;
    this.__validatedSchema = { properties: schema };
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleFields.tag, SimpleFields);
export { SimpleFields };
