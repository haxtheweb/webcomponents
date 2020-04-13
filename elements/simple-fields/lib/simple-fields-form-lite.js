import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsLite } from "./simple-fields-lite.js";
/**
 * `simple-fields-form-lite`
 * binding and submission capabilities on top of simple-fields-lite
 *
 * @group simple-fields
 * @element simple-fields-form-lite
 * @extends simple-fields-lite
 * @demo ./demo/form-lite.html
 */
class SimpleFieldsFormLite extends SimpleFieldsLite {
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
    return "simple-fields-form-lite";
  }
  // render function
  render() {
    return html`
      <form>
        <slot name="before"></slot>
        <simple-fields-lite id="sf" autofocus></simple-fields-lite>
        <slot></slot>
      </form>
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
    if (this.loadResponse.data.schema) {
      sf.schema = this.loadResponse.data.schema;
    }
    if (this.loadResponse.data.value) sf.value = this.loadResponse.data.value;
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
      if (body) {
        path += "?" + Object.entries(body)
        .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
        .join("&");
      }
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
    let sf = this.shadowRoot.querySelector("#sf");
    if (this.saveEndpoint) {
      fetch(this.saveEndpoint, {
        method: this.method,
        headers: this.headers,
        //make sure to serialize your JSON body
        body: JSON.stringify(sf.value)
      });
    }
    return sf.value;
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
window.customElements.define(SimpleFieldsFormLite.tag, SimpleFieldsFormLite);
export { SimpleFieldsFormLite };
