import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsSchema } from "@lrnwebcomponents/simple-fields/lib/simple-fields-schema.js";
/**
 * `simple-fields-form`
 * `binding and submission capabilities on top of simple-fields`
 * @demo ./demo/form.html
 * @customElement simple-fields-form
 */
class SimpleFieldsForm extends SimpleFieldsSchema {
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
      <form><simple-fields-schema id="fields" autofocus></simple-fields-schema></form>
    `;
  }
  /**
   * first update hook; also implies default settings
   */
  firstUpdated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // request form when it changes
      if (propName === "loadEndpoint" && this.autoload) {
        this.loadData();
      }
    });
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
        this.shadowRoot.querySelector(
          "#fields"
        ).value = this.loadResponse.data.value;
        this.shadowRoot.querySelector(
          "#fields"
        ).schema = this.loadResponse.data.schema;
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
   * load data from the end point
   */
  loadData() {
    this.loading = true;
    this.fetchData(
      this.loadEndpoint,
      this.method,
      this.headers,
      this.body
    ).then(data => {
      this.loading = false;
      this.loadResponse = data;
      /**
       * fires event when forma data is loaded
       * @event simple-fields-form-data-loaded
       */
      this.dispatchEvent(
        new CustomEvent("simple-fields-form-data-loaded", {
          detail: {
            value: data
          }
        })
      );
    });
  }
  async fetchData(path, method, headers, body) {
    let response = {};
    if (method == "GET") {
      response = await fetch(path, {
        method: method,
        headers: headers
      });
    } else {
      response = await fetch(path, {
        method: method,
        headers: headers,
        //make sure to serialize your JSON body
        body: JSON.stringify(body)
      });
    }

    let data = await response.json();
    return data;
  }
  constructor() {
    super();
    this.method = "POST";
    this.loading = false;
    this.autoload = false;
    this.headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    this.body = {};
  }
  /**
   * Submit form values if we have an end point, otherwise return value
   * of the fields as they currently exist.
   */
  submit() {
    if (this.saveEndpoint) {
      fetch(this.saveEndpoint, {
        method: this.method,
        headers: this.headers,
        //make sure to serialize your JSON body
        body: JSON.stringify(this.shadowRoot.querySelector("#fields").value)
      });
    }
    return this.shadowRoot.querySelector("#fields").value;
  }
  /**
   * Props down
   */
  static get properties() {
    return {
      ...super.properties,
      autoload: {
        type: Boolean,
        reflect: true
      },
      loading: {
        type: Boolean,
        reflect: true
      },
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
      headers: {
        type: Object
      },
      body: {
        type: Object
      },
      loadResponse: {
        type: Object
      }
    };
  }
}
window.customElements.define(SimpleFieldsForm.tag, SimpleFieldsForm);
export { SimpleFieldsForm };
