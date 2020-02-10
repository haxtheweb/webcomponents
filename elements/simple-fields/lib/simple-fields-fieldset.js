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
    return [css``];
  }
  render() {
    return html`
      <fieldset>
        <legend id="legend" ?hidden="${!this.schema.title}">
          ${this.schema.title}
        </legend>
        <div ?hidden="${!this.schema.description}">
          ${this.schema.description}
        </div>
        <div class="item-fields">
          <slot></slot>
        </div>
      </fieldset>
    `;
  }
  static get properties() {
    return {
      schema: {
        type: Object
      }
    };
  }
  constructor() {
    super();
    this.schema = {};
  }
}
window.customElements.define(SimpleFieldsFieldset.tag, SimpleFieldsFieldset);
export { SimpleFieldsFieldset };
