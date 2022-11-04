import { LitElement, html, css } from "lit";
import { SimpleFieldsFormLite } from "./simple-fields-form-lite.js";
import { SimpleFields } from "../simple-fields.js";
/**
 * `simple-fields-form`
 * binding and submission capabilities on top of simple-fields
 *
 * @group simple-fields
 * @element simple-fields-form
 * @demo ./demo/form.html
 */
class SimpleFieldsForm extends SimpleFieldsFormLite {
  static get tag() {
    return "simple-fields-form";
  }
  // render function
  render() {
    return html`
      <form part="form">
        <slot name="before"></slot>
        <simple-fields
          id="sf"
          .autofocus="${!this.disableAutofocus}"
          ?watchColorPrefs="${this.watchColorPrefs}"
          language="${this.language || ""}"
          .resources="${this.resources}"
          .schema="${this.schema}"
          .fields="${this.fields}"
          .schematizer="${this.fieldsConversion}"
          .elementizer="${this.elementizer}"
          .value="${this.value}"
          @value-changed="${this._valueChanged}"
          part="fields"
        >
        </simple-fields>
        <slot></slot>
      </form>
    `;
  }
  /**
   * applies loaded datda to simple-fields-lite
   *
   * @memberof SimpleFieldsFormLite
   */
  _applyLoadedData() {
    if (this.loadResponse.data.schema) {
      this.schema = this.loadResponse.data.schema;
    } else if (this.loadResponse.data.fields) {
      this.fields = this.loadResponse.data.fields;
    }
    if (this.loadResponse.data.value) this.value = this.loadResponse.data.value;
  }
  /**
   * properties specific to field function
   *
   * @readonly
   * @static
   * @memberof SimpleFieldsFormLite
   */
  static get fieldProperties() {
    return {
      ...super.fieldProperties,
      /**
       * Fields to convert to JSON Schema.
       */
      fields: {
        type: "Array",
      },
      /**
       * Conversion from inputMethods to JSON schema types and formats.
       * _See [Configuring fieldsConversion Property](configuring-the-fieldsconversion-property) above._
       */
      fieldsConversion: {
        type: "Object",
        attribute: "fields-conversion",
      },
    };
  }
  /**
   * forces form rebuild
   *
   * @memberof SimpleFieldsFormLite
   */
  rebuildForm() {
    if (this.shadowRoot.querySelector("#sf"))
      this.shadowRoot.querySelector("#sf").rebuidForm();
  }

  /**
   * gets default schemaConversion so parts of it can be overridden easily
   *
   * @readonly
   * @memberof SimpleFields
   */
  get defaultSchemaConversion() {
    return SimpleFields.defaultSchemaConversion;
  }
}
customElements.define(SimpleFieldsForm.tag, SimpleFieldsForm);
export { SimpleFieldsForm };
