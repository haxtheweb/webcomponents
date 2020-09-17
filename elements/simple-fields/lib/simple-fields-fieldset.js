import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 *`simple-fields-fieldset` takes in a JSON schema of type fieldset and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @group simple-fields
 * @element simple-fields-fieldset
 */
class SimpleFieldsFieldset extends LitElement {
  static get tag() {
    return "simple-fields-fieldset";
  }
  static get styles() {
    return [
      css`
        fieldset {
          padding: var(--simple-fields-margin-small, 8px)
            var(--simple-fields-margin, 16px);
          margin: var(--simple-fields-margin-small, 8px) 0
            var(--simple-fields-margin, 16px);
          border: 1px solid var(--simple-fields-border-color-light, #ccc);
          border-radius: var(--simple-fields-border-radius, 2px);
          transition: all 0.3s ease-in-out;
        }
        :host(:last-of-type) {
          margin-bottom: 0;
        }
        #label {
          font-family: var(--simple-fields-font-family, sans-serif);
          font-size: var(--simple-fields-font-size, 16px);
          line-height: var(--simple-fields-line-height, 22px);
        }
        :host([error]) #label {
          color: var(--simple-fields-error-color, #dd2c00);
          transition: all 0.3s ease-in-out;
        }
        #description {
          font-family: var(--simple-fields-detail-font-family, sans-serif);
          font-size: var(--simple-fields-detail-font-size, 12px);
          line-height: var(--simple-fields-detail-line-height, 22px);
        }
      `,
    ];
  }
  render() {
    return html`
      <fieldset>${this.legend} ${this.desc} ${this.fields}</fieldset>
    `;
  }
  get legend() {
    return html`
      <legend id="label" ?hidden="${!this.label}">
        ${this.label}${this.error ? "*" : ""}
      </legend>
    `;
  }
  get desc() {
    return html`
      <div id="description" ?hidden="${!this.description}">
        ${this.description}
      </div>
    `;
  }
  get fields() {
    return html`
      <div id="item-fields">
        <slot></slot>
      </div>
    `;
  }
  static get properties() {
    return {
      /**
       * whether the tabbed interface is disabled
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },
      /**
       * whether fieldset has fields with errors
       */
      error: {
        type: Boolean,
        reflect: true,
      },
      /**
       * whether the tabbed interface is hidden
       */
      hidden: {
        type: Boolean,
        reflect: true,
      },
      /**
       * whether the tabbed interface is hidden
       */
      readonly: {
        type: Boolean,
        reflect: true,
      },
      /**
       * fieldset legend
       */
      label: {
        type: String,
        reflect: true,
      },
      /**
       * unique name
       */
      name: {
        type: String,
        reflect: true,
        attribute: "name",
      },
      /**
       * optional description
       */
      description: {
        type: String,
      },
    };
  }
}
window.customElements.define(SimpleFieldsFieldset.tag, SimpleFieldsFieldset);
export { SimpleFieldsFieldset };
