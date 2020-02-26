import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 *`simple-fields-fieldset` takes in a JSON schema of type fieldset and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 * @group simple-fields
 * @demo demo/index.html
 * @customElement simple-fields-fieldset
 */
class SimpleFieldsFieldset extends LitElement {
  static get tag() {
    return "simple-fields-fieldset";
  }
  static get styles() {
    return [
      css`
        fieldset {
          padding: 20px;
          margin: 20px;
        }
      `
    ];
  }
  render() {
    return html`
      <fieldset>
        ${this.legend} ${this.desc} ${this.fields}
      </fieldset>
    `;
  }
  get legend() {
    return html`
      <legend id="legend" ?hidden="${!this.label}">
        ${this.label}
      </legend>
    `;
  }
  get desc() {
    return html`
      <div ?hidden="${!this.description}">
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
      label: {
        type: String,
        reflect: true
      },
      name: {
        type: String,
        reflect: true,
        attribute: 'name'
      },
      description: {
        type: String
      }
    };
  }
  constructor() {
    super();
  }
}
window.customElements.define(SimpleFieldsFieldset.tag, SimpleFieldsFieldset);
export { SimpleFieldsFieldset };
