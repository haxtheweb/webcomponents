import { LitElement, html, css } from "lit-element/lit-element.js";
import { boolean } from "@storybook/addon-knobs";
import { SimpleFieldsFieldset } from "./simple-fields-fieldset";

/**
`simple-fields-array-item` takes in a JSON schema of type array and builds a form,
exposing a `value` property that represents an array described by the schema.

@group simple-fields
@customeElement simple-fields-array-item
* @demo demo/index.html
*/
class SimpleFieldsArrayItem extends LitElement {
  static get tag() {
    return "simple-fields-array-item";
  }
  constructor() {
    super();
    this.globalOptions = {
      icon: "settings",
      tooltip: "configure item"
    };
    this.schema = {};
    setTimeout(() => {
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icons/editor-icons.js");
      import("@polymer/paper-icon-button/paper-icon-button.js");
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
      import("@lrnwebcomponents/a11y-collapse/a11y-collapse.js");
    }, 0);
  }
  static get styles() {
    return [css``];
  }
  render() {
    return html`
      <a11y-collapse
        id="item"
        accordion
        .icon="${this.globalOptions.icon}"
        .tooltip="${this.globalOptions.icon}"
      >
        <p slot="heading">
          <slot name="sort"></slot>
          <slot name="preview"></slot>
        </p>
        <div slot="content">
          <div>
            <div class="item-fields">
              <slot></slot>
            </div>
            <paper-icon-button
              id="remove"
              icon="icons:delete"
              aria-label="Remove this item"
              aria-describedby="item"
              class="remove-array-item array-item-button"
              controls="item"
              @onclick="${e => this.removeItem(this.schema)}"
              role="button"
            >
            </paper-icon-button>
            <simple-tooltip for="remove">Remove this item</simple-tooltip>
          </div>
        </div>
      </a11y-collapse>
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
  removeItem(schema) {
    this.dispatchEvent(
      new CustomEvent("remove-item", {
        bubbles: false,
        cancelable: true,
        composed: true,
        detail: schema
      })
    );
  }
}
window.customElements.define(SimpleFieldsArrayItem.tag, SimpleFieldsArrayItem);
export { SimpleFieldsArrayItem };
