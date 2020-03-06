import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 *`simple-fields-select`
 * provides label, description, error massage, and aria-invalid functionality if needed
 *
 * @group simple-fields
 * @customElement simple-fields-select
 * @demo ./demo/lite.html
 */
class SimpleFieldsSelect extends LitElement {
  static get tag() {
    return "simple-fields-select";
  }
  static get styles() {
    return [
      css`
        :host {
          width: 100%;
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        :host([disabled]) {
          opacity: 0.5;
        }
        label,
        .error-message,
        .description {
          font-size: 11px;
          line-height: 22px;
          font-family: sans-serif;
          transition: color ease-in-out;
        }
        :host(:focus-within) label {
          color: blue;
          transition: color ease-in-out;
        }
        select {
          font-size: 16px;
          line-height: 22px;
          font-family: sans-serif;
          width: 100%;
          border: none;
          background: transparent;
          border-bottom: 2px solid #999;
          border-radius: 0;
          transition: color ease-in-out;
        }
        option {
          border-radius: 0;
        }
        :host(:focus-within) select {
          border-bottom: 2px solid blue;
          transition: color ease-in-out;
        }
        .error-message {
          transition: color ease-in-out;
        }
        :host([invalid]) label,
        :host([invalid]) .error-message {
          color: #990000;
        }
        :host([invalid]) label:after {
          content: "*";
        }
      `
    ];
  }
  render() {
    return html`
    <label for="${this.id}.select" ?hidden="${!this.label}">
      ${this.label}
    </label>
    <select 
      id="${this.id}.select" 
      .aria-invalid="${this.invalid ? "true" : "false"}"
      ?disabled="${this.disabled}"
      ?hidden="${this.hidden}"
      @change="${this._onChange}"
      .value="${this.value}">
        ${Object.keys(this.options || {}).map(
          option => html`
            <option
              .id="${this.id}.${option}"
              ?selected="${this.value === option}"
            >
              ${this.options[option]}
            </option>
          `
        )}
      </select>
      <div id="description" ?hidden="${!this.description}">
        ${this.description}
      </div>
      <div id="error-message" ?hidden="${!this.errorMessage || !this.invalid}">
        ${this.errorMessage}
      </div>
    </fieldset>
    `;
  }
  static get properties() {
    return {
      description: {
        type: String
      },
      disabled: {
        type: Boolean,
        reflect: true
      },
      hidden: {
        type: Boolean,
        reflect: true
      },
      id: {
        type: String,
        reflect: true
      },
      name: {
        type: String,
        reflect: true
      },
      errorMessage: {
        type: String
      },
      invalid: {
        type: Boolean,
        reflect: true
      },
      label: {
        type: String
      },
      options: {
        type: Object
      },
      value: {
        reflect: true
      }
    };
  }
  constructor() {
    super();
    this.options = {};
    this.invalid = false;
    this.errorMessage = "";
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "value" && this.value !== oldValue)
        this._fireValueChanged();
    });
  }

  get describedBy() {
    let describedBy = [];
    if (this.label) describedBy.push("label");
    if (this.description) describedBy.push("description");
    if (this.error && this.invalid) describedBy.push("error");
    return describedBy.join(" ");
  }
  _onChange(e) {
    if (e && e.path && e.path[0]) {
      //this.value = e.path[0].selectedOptions.map(option=>option.value);
      this.value = e.path[0].selectedOptions[0].value;
    }
  }
  /**
   * fires when value changes
   * @event value-changed
   */
  _fireValueChanged() {
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
window.customElements.define(SimpleFieldsSelect.tag, SimpleFieldsSelect);
export { SimpleFieldsSelect };
