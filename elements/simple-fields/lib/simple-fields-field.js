import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 *`simple-fields-field`
 * provides label, description, error massage, and aria-invalid functionality if needed
 *
 * @group simple-fields
 * @customElement simple-fields-field
 * @demo ./demo/schema.html Schema
 * @demo ./demo/form.html Form
 */
class SimpleFieldsField extends LitElement {
  static get tag() {
    return "simple-fields-field";
  }
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          justify-content: space-between;
          margin: 16px 0;
        }
        :host([hidden]) {
          display: none;
        }
        label {
          flex: 1 0 100%;
          transition: color ease-in-out;
        } 
        .description {
          flex: 1 0 100%;
        }
        .error-message {
          flex: 1 0 100%;
          transition: color ease-in-out;
        } 
        :host([field-type="input:checkbox"]) label {
          flex: 0 1 auto;
          line-height: 33px;
          font-size: 16px;
        }
        :host([field-type="input:checkbox"]) ::slotted(*) {
          width: auto;
          height: 33px;
          flex: 1 1 auto;
          margin: 0 0 0 8px;
          max-width: calc(100% - 33px - 8px);
        }
        div {
          margin: 0;
        }
        :host([invalid]) label,
        :host([invalid]) .error-message {
          color: #990000;
        }
        :host([invalid]) label:after {
          content: "*";
        }
        :host(:not([invalid])) .error-message {
          display: none;
        }
        label,
        .error-message, 
        .description {
          font-size: 11px;
          line-height: 22px;
          font-family: sans-serif;
        }
        ::slotted(*) {
          width: 100%;
          font-size: 16px;
          line-height: 22px;
          font-family: sans-serif;
          border: none;
        }
        ::slotted(input),
        ::slotted(textarea) {
          border-bottom: 2px solid #999;
          transition: all ease-in-out;
        }
        :host(:focus-within) ::slotted(input),
        :host(:focus-within) ::slotted(textarea) {
          border-bottom: 2px solid blue;
          outline: none;
          transition: all ease-in-out;
        } 
        :host(:focus-within) label {
          color: blue;
        } 
      `
    ];
  }
  render() {
    return html`
      ${this.labelSibling}
      <slot class="${this.describedBy}"></slot>
      ${this.errorSibling} ${this.descriptionSibling}
    `;
  }
  static get properties() {
    return {
      data: {
        type: Object
      },
      description: {
        type: String
      },
      errorMessage: {
        type: String
      },
      field: {
        type: Object
      },
      fieldId: {
        type: String
      },
      invalid: {
        type: Boolean,
        reflect: true
      },
      label: {
        type: String
      }
    };
  }
  constructor() {
    super();
    this.data = {};
    this.invalid = false;
    this.errorMessage = "";
    this.fieldId = "";
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "field") {
        this.innerHTML = "";
        if (this.field) {
          this.appendChild(this.field);
          this.fieldId = this.field.id;
          this.setAttribute('field-type',`${this.field.tagName.toLowerCase()}:${this.field.type}`);
        } else {
          this.fieldId = undefined;
          this.removeAttribute('field-type');
        }
      }
      if (["field", "invalid"].includes(propName)) {
        if (this.data.invalidProperty && this.field)
          this.field[this.data.invalidProperty] = this.invalid;
      } else {
        if (this.field) this.field.setAttribute("aria-invalid", this.invalid);
      }
    });
  }

  get describedBy() {
    let describedBy = [];
    //if(this.label && this.fieldId && this.data.labelSlot) describedBy.push(this.labelId);
    if (this.description && this.fieldId && this.data.descriptionSlot)
      describedBy.push(this.descriptionId);
    if (this.error && this.fieldId && this.data.errorSlot)
      describedBy.push(this.errorId);
    if (this.field) {
      this.field.setAttribute("aria-describedBy", describedBy.join(" "));
    } else {
      this.field.removetAttribute("aria-describedBy");
    }
    return describedBy.join(" ");
  }
  get descriptionId() {
    return `${this.fieldId}-error`;
  }
  get descriptionSibling() {
    let type = this._getSibling(
      this.description,
      this.data.descriptionProperty,
      this.data.descriptionSlot
    );
    if (type === "slot") this._getDescriptionSlot(this.data.descriptionSlot);
    return type === "" ? this._getDescriptionSlot() : ``;
  }
  get errorId() {
    return `${this.fieldId}-error`;
  }
  get errorSibling() {
    let type = this._getSibling(
      this.errorMessage,
      this.data.errorProperty,
      this.data.errorSlot
    );
    if (type === "slot") this._getErrorSlot(this.data.errorSlot);
    return type === "" ? this._getErrorSlot() : ``;
  }
  get labelId() {
    return `${this.fieldId}-label`;
  }
  get labelSibling() {
    let type = this._getSibling(
      this.label,
      this.data.labelProperty,
      this.data.labelSlot
    );
    if (type === "slot") this._getLabelSlot(this.data.labelSlot);
    return type === "" ? this._getLabelSlot() : ``;
  }
  _getDescriptionSlot(slot = "") {
    return this.description
      ? html`
          <div id="${this.descriptionId}" slot="${slot}" class="description">
            ${this.description}
          </div>
        `
      : ``;
  }
  _getErrorSlot(slot = "") {
    return this.errorMessage
      ? html`
          <div id="${this.errorId}" slot="${slot}" class="error-message">
            ${this.errorMessage}
          </div>
        `
      : ``;
  }
  _getLabelSlot(slot = "") {
    return this.label
      ? html`
          <label id="${this.labelId}" for="${this.fieldId}" slot="${slot}">
            ${this.label}
          </label>
        `
      : ``;
  }
  _getSibling(value, prop, slot, callback = () => {}) {
    if (prop) {
      this.field[prop] = value;
      return "prop";
    } else if (slot) {
      if (this.field.querySelector(`[slot="${slot}"]`))
        this.field.querySelector(`[slot="${slot}"]`).remove();
      return "slot";
    } else {
      return "";
    }
  }
}
window.customElements.define(SimpleFieldsField.tag, SimpleFieldsField);
export { SimpleFieldsField };
