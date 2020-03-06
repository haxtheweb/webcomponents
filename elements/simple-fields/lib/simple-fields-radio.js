import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 *`simple-fields-radio`
 * provides label, description, error massage, and aria-invalid functionality if needed
 *
 * @group simple-fields
 * @customElement simple-fields-radio
 * @demo ./demo/lite.html
 */
class SimpleFieldsRadio extends LitElement {
  static get tag() {
    return "simple-fields-radio";
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
        fieldset {
          margin: 0;
          padding: 0;
          border: none;
        }
        fieldset:focus-within legend {
          color: blue;
        }
        legend {
          padding-inline-start: unset;
          padding-inline-end: unset;
          font-size: 16px;
        }
        #options {
          display: flex;
          flex-wrap: wrap;
        }
        .option {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          justify-content: space-between;
          font-family: sans-serif;
          font-size: 16px;
          line-height: 22px;
          margin: 0 8px;
        }
        .option:first-of-type {
          margin: 0 8px 0 0;
        }
        .option:last-of-type {
          margin: 0 0 0 8px;
        }
        .option:focus-within label {
          color: blue;
        }
        .error-message,
        .description,
        legend {
          font-size: 11px;
          line-height: 22px;
          font-family: sans-serif;
          transition: color ease-in-out;
        }
        label {
          flex: 0 1 auto;
          transition: color ease-in-out;
        }
        input {
          font-family: sans-serif;
          width: auto;
          height: 22px;
          flex: 1 1 auto;
          margin: 0 0 0 8px;
          max-width: calc(100% - 33px - 8px);
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
      <fieldset>
        <legend id="legend" ?hidden="${!this.label}">
          ${this.label}
        </legend>
        <div id="options">
          ${Object.keys(this.options || {}).map(
            option => html`
              <div class="option">
                <label for="${this.id}.${option}"
                  >${this.options[option]}</label
                >
                <input
                  .id="${this.id}.${option}"
                  .aria-invalid="${this.invalid ? "true" : "false"}"
                  .checked="${this.value === option}"
                  @click="${e => (this.value = option)}"
                  ?disabled="${this.disabled}"
                  ?hidden="${this.hidden}"
                  type="radio"
                  .value="${option}"
                />
              </div>
            `
          )}
        </div>
        <div id="description" ?hidden="${!this.description}">
          ${this.description}
        </div>
        <div
          id="error-message"
          ?hidden="${!this.errorMessage || !this.invalid}"
        >
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
window.customElements.define(SimpleFieldsRadio.tag, SimpleFieldsRadio);
export { SimpleFieldsRadio };
