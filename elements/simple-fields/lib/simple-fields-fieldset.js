import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 *`simple-fields-fieldset` takes in a JSON schema of type fieldset and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 * 
 * @group simple-fields
 * @customElement simple-fields-fieldset
 * @demo ./demo/schema.html Schema
 * @demo ./demo/form.html Form
 */
class SimpleFieldsFieldset extends LitElement {
  static get tag() {
    return "simple-fields-fieldset";
  }
  static get styles() {
    return [
      css`
        fieldset {
          padding: 10px;
          margin: 10px 10px 20px;
          border: 1px solid #ccc;
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
      label: {
        type: String,
        reflect: true
      },
      name: {
        type: String,
        reflect: true,
        attribute: "name"
      },
      description: {
        type: String
      }
    };
  }
}
window.customElements.define(SimpleFieldsFieldset.tag, SimpleFieldsFieldset);
export { SimpleFieldsFieldset };
