import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsField } from "./simple-fields-field.js";
/**
 *`simple-fields-container`
 * provides label, description, error massage, and aria-invalid functionality if needed
 *
 * @group simple-fields
 * @extends simple-fields-field
 * @customElement simple-fields-container
 * @demo ./demo/lite.html Demo
 */
class SimpleFieldsContainer extends SimpleFieldsField {
  static get tag() {
    return "simple-fields-container";
  }
  static get styles() {
    return [
      ...super.styles,
      css`/*
        :host {
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          justify-content: space-between;
          margin: var(--simple-fields-margin, 16px) 0;
        }
        label {
          flex: 1 0 100%;
        }
        ::slotted(*) {
          width: 100%;
          font-size: var(--simple-fields-font-size, 16px);
          font-family: var(--simple-fields-font-family, sans-serif);
          line-height: var(--simple-fields-detail-line-height, 22px);
          border: none;
        }
        .description {
          flex: 1 0 100%;
        }
        .error-message {
          flex: 1 0 100%;
        }
        :host([field-type="input:checkbox"]) label {
          flex: 0 1 auto;
        }
        :host([field-type="input:checkbox"]) ::slotted(*) {
          width: auto;
          height: var(--simple-fields-detail-line-height, 22px);
          flex: 1 1 auto;
          margin: 0 0 0 var(--simple-fields-margin-small, 8px);
          max-width: calc(
            100% - var(--simple-fields-detail-line-height, 22px) -
              var(--simple-fields-margin-small, 8px)
          );
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
        }*/
      `
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Configuration data for field
       */
      data: {
        type: Object
      }
    };
  }
  constructor() {
    super();
  }
  render() {
    return html`
      <div class="label-input">
        ${this.labelElement}
        <slot></slot>
      </div>
      ${this.borderBottom} ${this.descriptionElement}
      ${this.errorElement}
    `;
  }

  /**
   * gets field's id
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get fieldId() {
    return this.field && this.field.id ? this.field.id : undefined;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      console.log('propName',propName);
      if (propName === "field") {
        console.log('field',this.field);
        this.innerHTML = "";
        this.id = `${this.fieldId || ''}-wrapper`;
        if (this.field) {
          this.appendChild(this.field);
          this.setAttribute(
            "field-type",
            `${this.field.tagName.toLowerCase()}:${this.field.type}`
          );
          this.required = this.field.required;
        } else {
          this.innerHTML = '';
          this.required = false;
          this.removeAttribute("field-type");
        }
        if (propName === "invalid") this.field.setAttribute('aria-invalid',this.invalid);
      }
    });
  }
}
window.customElements.define(SimpleFieldsContainer.tag, SimpleFieldsContainer);
export { SimpleFieldsContainer };
