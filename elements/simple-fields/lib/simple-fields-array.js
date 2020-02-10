import { LitElement, html, css } from "lit-element/lit-element.js";
import { boolean } from "@storybook/addon-knobs";
import { SimpleFieldsFieldset } from "./simple-fields-fieldset";

/**
 * `simple-fields-array` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 * @group simple-fields
 * @demo demo/index.html
 * @customeElement simple-fields-array
 */
class SimpleFieldsArray extends LitElement {
  static get tag() {
    return "simple-fields-array";
  }
  constructor() {
    super();
    this.globalOptions = {
      icon: "settings",
      tooltip: "configure item"
    };
    this.items = [];
    setTimeout(() => {
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/paper-icon-button/paper-icon-button.js");
      import("@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js");
    }, 0);
  }
  static get styles() {
    return [css``];
  }
  render() {
    return html`
      <fieldset>
        <legend id="legend" class="flex" ?hidden="${!this.schema.title}">
          ${this.schema.title}
        </legend>
        <div ?hidden="${!this.schema.description}">
          ${this.schema.description}
        </div>
        <a11y-collapse-group
          id="form"
          icon="settings"
          class="vertical flex layout"
          .global-options="${this.globalOptions}"
        >
          <slot></slot>
        </a11y-collapse-group>
        <paper-button id="add-button" @click="${e => this.addItem(this)}">
          Add an item
          <iron-icon icon="add-circle"></iron-icon>
        </paper-button>
      </fieldset>
    `;
  }

  static get properties() {
    return {
      globalOptions: {
        type: Object
      },
      schema: {
        type: Object
      }
    };
  }
  addItem(array) {
    this.dispatchEvent(
      new CustomEvent("add-item", {
        bubbles: false,
        cancelable: true,
        composed: true,
        detail: array
      })
    );
  }
}
window.customElements.define(SimpleFieldsArray.tag, SimpleFieldsArray);
export { SimpleFieldsArray };
