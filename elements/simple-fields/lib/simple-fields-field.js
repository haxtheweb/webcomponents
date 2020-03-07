import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 *`simple-fields-field`
 * a primitive field type that other fields can inherit
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
          display: block;
          width: 100%;
          font-size: var(--simple-fields-font-size, 16px);
          font-family: var(--simple-fields-font-family, sans-serif);
          line-height: var(--simple-fields-line-height, 22px);
          margin: var(--simple-fields-margin, 16px) 0;
        }
        :host([hidden]) {
          display: none;
        }
        :host([disabled]) {
          opacity: var(--simple-fields-disabled-opacity, 0.7);
          transition: opacity ease-in-out;
        }
        :host([type="color"]) .label-input,
        :host([type="checkbox"]) .label-input,
        :host([type="radio"]) .label-input {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          justify-content: flex-start;
        }
        label {
          flex: 1 0 100%;
        }
        :host([type="color"]) label,
        :host([type="checkbox"]) label,
        :host([type="radio"]) label {
          font-size: var(--simple-fields-font-size, 16px);
          font-family: var(--simple-fields-font-family, sans-serif);
          line-height: var(--simple-fields-line-height, 22px);
          flex: 0 1 auto;
        }
        label,
        legend,
        #error-message,
        #description,
        .error-message,
        .description {
          font-size: var(--simple-fields-detail-font-size, 12px);
          font-family: var(--simple-fields-detail-font-family, sans-serif);
          line-height: var(--simple-fields-detail-line-height, 22px);
          transition: color ease-in-out;
        }
        input,
        select,
        textarea,
        ::slotted(*) {
          width: 100%;
          font-size: var(--simple-fields-font-size, 16px);
          font-family: var(--simple-fields-font-family, sans-serif);
          line-height: var(--simple-fields-line-height, 22px);
          border: none;
        }
        :host(:focus-within) label {
          color: var(--simple-fields-accent-color, #003f7d);
          transition: color ease-in-out;
        }
        :host([invalid]) label,
        :host([invalid]) .error-message,
        :host([invalid]) #error-message {
          color: var(--simple-fields-error-color, #ac0000);
          transition: color ease-in-out;
        }
        :host([invalid]) label:after {
          content: "*";
        }
        input[type="color"],
        input[type="checkbox"],
        input[type="radio"] ::slotted(input[type="color"]),
        ::slotted(input[type="checkbox"]),
        ::slotted(input[type="radio"]) {
          width: var(--simple-fields-detail-line-height, 22px);
          height: var(--simple-fields-detail-line-height, 22px);
          flex: 0 0 auto;
          margin: 0 0 0 var(--simple-fields-margin-small, 8px);
          max-width: calc(
            100% - var(--simple-fields-detail-line-height, 22px) -
              var(--simple-fields-margin-small, 8px)
          );
        }
        .box-input:focus {
          outline: none;
        }
        .border-bottom {
          height: 0;
          border-bottom: 2px solid;
        }
        .border-bottom.blur {
          border-bottom-color: #999;
          width: 100%;
        }
        .border-bottom.focus {
          margin: -2px 0 0;
          height: 0;
          width: 0;
          border-bottom-color: var(--simple-fields-accent-color, #003f7d);
          transition: width 0.75s ease-in-out;
        }
        :host(:focus-within) .border-bottom.focus {
          width: 100%;
          transition: width 0.75s ease-in-out;
        }
      `
    ];
  }
  render() {
    return html`
      ${this.labelElement} ${this.borderBottom} ${this.descriptionElement}
      ${this.errorElement}
    `;
  }
  static get properties() {
    return {
      /**
       * Hint for form autofill feature
       */
      autocomplete: {
        type: String
      },
      /**
       * Automatically focus the form control when the page is loaded
       */
      autofocus: {
        type: Boolean
      },
      /**
       * Description of the field
       */
      description: {
        type: String
      },
      /**
       * Whether the form control is disabled
       */
      disabled: {
        type: Boolean,
        reflect: true
      },
      /**
       * Error message to display
       */
      errorMessage: {
        type: String,
        attribute: "error-message"
      },
      /**
       * Whether the field is hidden
       */
      hidden: {
        type: Boolean,
        reflect: true
      },
      /**
       * Associates the control with a form element
       */
      form: {
        type: String
      },
      /**
       * Field element
       */
      field: {
        type: Object
      },
      /**
       * Unique id
       */
      id: {
        type: String,
        reflect: true
      },
      /**
       * Whether field is invalid
       */
      invalid: {
        type: Boolean,
        reflect: true
      },
      /**
       * Label for the field
       */
      label: {
        type: String
      },
      /**
       * Name of the input form control. Submitted with the form as part of a name/value pair.
       */
      name: {
        type: String,
        reflect: true
      },
      /**
       * Whether field is required
       */
      required: {
        type: Boolean
      },
      /**
       * Current value of the form control. Submitted with the form as part of a name/value pair.
       */
      value: {
        reflect: true
      },
      /**
       * Type of input form control
       */
      type: {
        type: String,
        reflect: true
      }
    };
  }
  constructor() {
    super();
    this.autocomplete = "off";
    this.autofocus = false;
    this.disabled = false;
    this.hidden = false;
    this.invalid = false;
    this.field = this.shadowRoot.querySelector("input");
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "type") {
        if (
          !this.type ||
          this.type === "reset" ||
          this.type === "submit" ||
          this.type === "button" ||
          this.type === "image"
        )
          this.type = "text";
        this.field = this.shadowRoot
          ? this.shadowRoot.querySelector("input,textarea")
          : undefined;
      }
      if (propName === "value" && this.value !== oldValue)
        this._fireValueChanged();
    });
  }
  /**
   * gets a decorative border
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get borderBottom() {
    return ["checkbox", "color", "file", "radio", "range"].includes(this.type)
      ? ``
      : html`
          <div class="border-bottom blur"></div>
          <div class="border-bottom focus"></div>
        `;
  }

  /**
   * gets aria-describedby
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get describedBy() {
    let describedBy = [];
    if (this.label) describedBy.push("label");
    if (this.description) describedBy.push("description");
    if (this.error && this.invalid) describedBy.push("error");
    return describedBy.join(" ");
  }

  /**
   * gets field's id
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get fieldId() {
    return `${this.id || "field"}.input`;
  }

  /**
   * gets `<label>`
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get labelElement() {
    return html`
      <label for="${this.fieldId}">${this.label}</label>
    `;
  }

  /**
   * gets element with description
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get descriptionElement() {
    return html`
      <div id="description" ?hidden="${!this.description}">
        ${this.description}
      </div>
    `;
  }

  /**
   * gets element with error message
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get errorElement() {
    return html`
      <div id="error-message" ?hidden="${!this.errorMessage || !this.invalid}">
        ${this.errorMessage}
      </div>
    `;
  }
  /**
   * focuses on field
   * @returns {Boolean}
   * @memberof SimpleFieldsInput
   */
  focus() {
    if (this.field) this.field.focus();
  }
  /**
   * determines whether input satisfies its validation constraints
   * @returns {boolean}
   * @memberof SimpleFieldsInput
   */
  reportValidity() {
    return this.field && this.field.reportValidity();
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
window.customElements.define(SimpleFieldsField.tag, SimpleFieldsField);
export { SimpleFieldsField };
