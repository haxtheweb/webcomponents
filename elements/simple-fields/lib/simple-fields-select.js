import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsField } from "./simple-fields-field.js";
/**
 *`simple-fields-select`
 * provides label, description, error massage, and aria-invalid functionality if needed
 *
 * @group simple-fields
 * @customElement simple-fields-select
 * @demo ./demo/select.html
 */
class SimpleFieldsSelect extends SimpleFieldsField {
  static get tag() {
    return "simple-fields-select";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        select {
          width: 100%;
          border: none;
          background: transparent;
          border-radius: 0;
          transition: color ease-in-out;
        }
        option {
          border-radius: 0;
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
      ?autofocus="${this.autofocus}"
      .autocomplete="${this.autocomplete}"
      .aria-invalid="${this.invalid ? "true" : "false"}"
      @change="${this._onChange}"
      ?disabled="${this.disabled}"
      ?hidden="${this.hidden}"
      ?required="${this.required}"
      ?mutliple="${this.mutliple}"
      size="${this.size}"
      .value="${this.value}">
        ${Object.keys(this.options || {}).map(
          option => html`
            <option
              .id="${this.id}.${option}"
              ?selected="${this.multiple
                ? this.value.contains(option)
                : this.value === option}"
              .value="${option}"
            >
              ${this.options[option]}
            </option>
          `
        )}
      </select>
      <div class="border-bottom blur"></div>
      <div class="border-bottom focus"></div>
      ${this.descriptionElement}
      ${this.errorElement}  
    </fieldset>
    `;
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Whether to allow multiple values
       */
      multiple: {
        type: Boolean
      },
      /**
       * options {value: "Text"} for select as object,
       * eg. {a: "Option A", b: "Option B", c: "Option C"}
       */
      options: {
        type: Object
      },
      /**
       * Size of the control
       */
      size: {
        type: Number
      }
    };
  }
  constructor() {
    super();
    this.multiple = false;
    this.options = {};
  }
  /**
   * handles change in select value
   *
   * @param {event} e change event
   * @memberof SimpleFieldsSelect
   */
  _onChange(e) {
    if (e && e.path && e.path[0]) {
      this.value = this.multiple
        ? e.path[0].selectedOptions.map(option => option.value)
        : e.path[0].selectedOptions[0].value;
    }
  }
  /**
   * fires when value changes
   * @event change
   * @event value-changed
   */
  _fireValueChanged() {
    super._fireValueChanged();
    console.log("change");
    this.dispatchEvent(
      new CustomEvent("change", {
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
