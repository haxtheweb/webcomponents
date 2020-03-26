import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFields } from "../simple-fields.js";
import { SimpleFieldsFormLite } from "./simple-fields-form-lite.js";
/**
 * `simple-fields-form`
 * binding and submission capabilities on top of simple-fields
 *
 * @group simple-fields
 * @customElement simple-fields-form
 * @demo ./demo/form.html
 */
class SimpleFieldsForm extends SimpleFieldsFormLite {
  static get tag() {
    return "simple-fields-form";
  }
  // render function
  render() {
    return html`
      <form>
        <slot name="before"></slot>
        <simple-fields id="sf" autofocus></simple-fields>
        <slot></slot>
      </form>
    `;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (this.autoload && !this.loadResponse && !this.loading) {
        if (propName === "loadEndpoint" || propName === "autoload") {
          this.loadData();
        }
      }
      // we have response data from an end point this should create the form
      if (propName === "loadResponse" && this.loadResponse.data) {
        this._applyLoadedData();
        /**
         * fires event for things to react to about the response
         * @event response
         */
        this.dispatchEvent(
          new CustomEvent("response", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: this.loadResponse
          })
        );
      }
    });
  }
  /**
   * applies loaded datda to simple-fields-lite
   *
   * @memberof SimpleFieldsFormLite
   */
  _applyLoadedData() {
    let sf = this.shadowRoot.querySelector("#sf");
    //console.log(this.loadResponse.data.schema, this.loadResponse.data.fields);
    if (this.loadResponse.data.schema) {
      sf.schema = this.loadResponse.data.schema;
    } else if (this.loadResponse.data.fields) {
      sf.fields = this.loadResponse.data.fields;
    }
    if (this.loadResponse.data.value) sf.value = this.loadResponse.data.value;
  }
  /**
   * Props down
   */
  static get properties() {
    return {
      ...super.properties,
      ...SimpleFields.properties
    };
  }
}
window.customElements.define(SimpleFieldsForm.tag, SimpleFieldsForm);
export { SimpleFieldsForm };
