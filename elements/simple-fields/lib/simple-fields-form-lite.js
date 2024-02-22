import { LitElement, html, css } from "lit";
import { SimpleFieldsLite } from "./simple-fields-lite.js";
import { SimpleFields } from "../simple-fields.js";
/**
 * `simple-fields-form-lite`
 * binding and submission capabilities on top of simple-fields-lite
 *
 * @group simple-fields
 * @element simple-fields-form-lite
 * @extends simple-fields-lite
 * @demo ./demo/form-lite.html
 */
class SimpleFieldsFormLite extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
  static get tag() {
    return "simple-fields-form-lite";
  }
  // render function
  render() {
    return html`
      <form part="form">
        <slot name="before"></slot>
        <simple-fields-lite
          id="sf"
          .autofocus="${!this.disableAutofocus}"
          .language="${this.language}"
          .resources="${this.resources}"
          .schema="${this.schema}"
          .elementizer="${this.elementizer}"
          .value="${this.value}"
          @value-changed="${this._valueChanged}"
          part="fields"
        >
        </simple-fields-lite>
        <slot name="after"></slot>
        <slot></slot>
      </form>
    `;
  }
  /**
   * gets form element that matches given form ID
   *
   * @param {*} id
   * @returns
   * @memberof SimpleFieldsLite
   */
  getFormElementById(id) {
    return (this.__formElementsArray || []).filter((el) => el.id === id)[0];
  }
  /**
   * updates the form value when a field changes
   *
   * @param {*} e value-changed event
   * @memberof SimpleFieldsFormLite
   */
  _valueChanged(e) {
    this.value = e.detail.value;
  }
  /**
   * allow setting value
   */
  setValue(value) {
    this.value = value;
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
            detail: this.loadResponse,
          }),
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
    if (this.loadResponse.data.schema) {
      this.schema = this.loadResponse.data.schema;
    }
    if (this.loadResponse.data.value) this.value = this.loadResponse.data.value;
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
      this.body,
    ).then((data) => {
      this.loading = false;
      this.loadResponse = data;
      /**
       * fires event when forma data is loaded
       * @event simple-fields-form-data-loaded
       */
      this.dispatchEvent(
        new CustomEvent("simple-fields-form-data-loaded", {
          detail: {
            value: data,
          },
        }),
      );
    });
  }
  async fetchData(path, method, headers, body) {
    let response = {};
    if (method == "GET") {
      if (body) {
        path +=
          "?" +
          Object.entries(body)
            .map(
              ([key, val]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(val)}`,
            )
            .join("&");
      }
      response = await fetch(path, {
        method: method,
        headers: headers,
      });
    } else {
      response = await fetch(path, {
        method: method,
        headers: headers,
        //make sure to serialize your JSON body
        body: JSON.stringify(body),
      });
    }

    let data = await response.json();
    return data;
  }
  constructor() {
    super();
    this._setFieldProperties();
    this._setFormProperties();
  }
  /**
   * allows constructor to be overridden
   *
   * @memberof SimpleFieldsFormLite
   */
  _setFieldProperties() {
    this.disableAutofocus = false;
    this.language = "en";
    this.resources = {};
    this.schema = {};
    this.value = {};
  }
  /**
   * allows constructor to be overridden
   *
   * @memberof SimpleFieldsFormLite
   */
  _setFormProperties() {
    this.method = "POST";
    this.loading = false;
    this.autoload = false;
    this.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
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
        body: JSON.stringify(sf.value),
      });
    }
    return sf.value;
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
      /*
       * Disables autofocus on fields.
       */
      disableAutofocus: {
        type: Boolean,
      },
      /*
       * Error messages by field name,
       * eg. `{ contactinfo.email: "A valid email is required." }`
       */
      error: {
        type: Object,
      },
      /*
       * Language of the fields.
       */
      language: {
        type: String,
        attribute: "lang",
        reflect: true,
      },
      /*
       * resource link
       */
      resources: {
        type: Object,
      },
      /*
       * Fields schema.
       * _See [Fields Schema Format](fields-schema-format) above._
       */
      schema: {
        type: Object,
      },
      /**
       * Conversion from JSON Schema to HTML form elements.
       * _See [Configuring schemaConversion Property](configuring-the-schemaConversion-property) above._
       */
      schemaConversion: {
        type: Object,
        attribute: "schema-conversion",
      },
      /*
       * value of fields
       */
      value: {
        type: Object,
      },
    };
  }
  /**
   * properties specific to form function
   *
   * @readonly
   * @static
   * @memberof SimpleFieldsFormLite
   */
  static get formProperties() {
    return {
      autoload: {
        type: Boolean,
        reflect: true,
      },
      loading: {
        type: Boolean,
        reflect: true,
      },
      loadEndpoint: {
        type: String,
        attribute: "load-endpoint",
      },
      saveEndpoint: {
        type: String,
        attribute: "save-endpoint",
      },
      method: {
        type: String,
      },
      headers: {
        type: Object,
      },
      body: {
        type: Object,
      },
      loadResponse: {
        type: Object,
      },
    };
  }
  /**
   * gets the simple-fields object
   *
   * @readonly
   * @memberof SimpleFieldsLite
   */
  get formFields() {
    return this.shadowRoot &&
      this.shadowRoot.querySelector &&
      this.shadowRoot.querySelector("#sf")
      ? this.shadowRoot.querySelector("#sf")
      : undefined;
  }
  /**
   * form elements by id
   *
   * @readonly
   * @memberof SimpleFieldsLite
   */
  get formElements() {
    return this.formFields ? this.formFields.formElements : {};
  }
  /**
   * list of form elements in order
   *
   * @readonly
   * @memberof SimpleFieldsLite
   */
  get formElementsArray() {
    return this.formFields ? this.formFields.formElementsArray : [];
  }
  /**
   * Props down
   */
  static get properties() {
    return {
      ...this.fieldProperties,
      ...this.formProperties,
    };
  }
}
customElements.define(SimpleFieldsFormLite.tag, SimpleFieldsFormLite);
export { SimpleFieldsFormLite };
