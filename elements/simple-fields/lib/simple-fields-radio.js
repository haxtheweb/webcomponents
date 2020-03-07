import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsField } from "./simple-fields-field.js"
/**
 *`simple-fields-radio`
 * provides label, description, error massage, and aria-invalid functionality if needed
 *
 * @group simple-fields
 * @extends simple-fields-field
 * @customElement simple-fields-radio
 * @demo ./demo/lite.html
 */
class SimpleFieldsRadio extends SimpleFieldsField {
  static get tag() {
    return "simple-fields-radio";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host(:focus-within) label {
          color: unset;
        }
        fieldset {
          margin: 0;
          padding: 0;
          border: none;
        }
        fieldset:focus-within legend {
          color: var(--simple-fields-accent, #003f7d);
        }
        legend {
          padding-inline-start: unset;
          padding-inline-end: unset;
        }
        #options {
          display: var(--simple-fields-radio-option-display, flex);
          flex-wrap: var(--simple-fields-radio-option-flex-wrap, wrap);
        }
        .option {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          justify-content: space-between;
          margin: 0 var(--simple-fields-margin-small, 8px);
        }
        .option:first-of-type {
          margin: 0 var(--simple-fields-margin-small, 8px) 0 0;
        }
        .option:last-of-type {
          margin: 0 0 0 var(--simple-fields-margin-small, 8px);
        }
        .option:focus-within label {
          color: var(--simple-fields-accent, #003f7d);
        }
        label {
          flex: 0 1 auto;
          transition: color ease-in-out;
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
                  class="radio-label"
                  >${this.options[option]}</label
                >
                <input
                  .id="${this.id}.${option}"
                  ?autofocus="${this.autofocus}"
                  autocomplete="${this.autocomplete}"
                  .aria-invalid="${this.invalid ? "true" : "false"}"
                  .checked="${this.value === option}"
                  @click="${e => (this.value = option)}"
                  ?disabled="${this.disabled}"
                  ?hidden="${this.hidden}"
                  .form="${this.form}"
                  ?required="${this.required}"
                  type="radio"
                  .value="${option}"
                />
              </div>
            `
          )}
        </div>
        ${this.descriptionElement}
        ${this.errorElement}  
      </fieldset>
    `;
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * options {value: "Text"} for select as object, 
       * eg. {a: "Option A", b: "Option B", c: "Option C"}
       */
      options: {
        type: Object
      }
    };
  }
  constructor() {
    super();
    this.options = {};
  }
}
window.customElements.define(SimpleFieldsRadio.tag, SimpleFieldsRadio);
export { SimpleFieldsRadio };
