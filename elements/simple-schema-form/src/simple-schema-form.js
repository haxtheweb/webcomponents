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
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
