import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
/**
 * `simple-fields-form`
 * `binding and submission capabilities on top of simple-fields`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleFieldsForm extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `
    ];
  }
  static get tag() {
    return "simple-fields-form";
  }
  // render function
  render() {
    return html`
      <simple-fields id="fields" autofocus></simple-fields>
    `;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // request form when it changes
      if (propName === "loadEndpoint") {
        this.fetchData(this.loadEndpoint).then(data => {
          this.loadResponse = data;
        });
      }
      // we have response data from an end point this should create the form
      if (propName === "loadResponse") {
        this.shadowRoot.querySelector(
          "#fields"
        ).fields = this.loadResponse.data.fields;
        this.shadowRoot.querySelector(
          "#fields"
        ).value = this.loadResponse.data.value;
      }
    });
  }
  async fetchData(path) {
    let response = await fetch(path);
    let data = await response.json();
    return data;
  }
  constructor() {
    super();
    this.method = "POST";
  }
  /**
   * Submit form values
   */
  submit() {
    fetch(this.saveEndpoint, {
      method: this.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      //make sure to serialize your JSON body
      body: JSON.stringify(this.shadowRoot.querySelector("#fields").value)
    });
  }
  static get properties() {
    return {
      loadEndpoint: {
        type: String,
        attribute: "load-endpoint"
      },
      saveEndpoint: {
        type: String,
        attribute: "save-endpoint"
      },
      method: {
        type: String
      },
      loadResponse: {
        type: Object
      }
    };
  }
}
window.customElements.define(SimpleFieldsForm.tag, SimpleFieldsForm);
export { SimpleFieldsForm };
