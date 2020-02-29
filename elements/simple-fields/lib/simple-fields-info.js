import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-popover/simple-popover.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
/**
 *`simple-fields-info` takes in a JSON schema of type fieldset and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 * @group simple-fields
 * @demo demo/index.html
 * @customElement simple-fields-info
 */
class SimpleFieldsInfo extends LitElement {
  static get tag() {
    return "simple-fields-info";
  }
  static get styles() {
    return [
      css`
        :host {
          position: relative;
          width: 24px;
          height: 24px;
          margin: 0 8px;
          overflow: visible;
        }
        simple-popover {
          display: flex;
          visibility: hidden;
          transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;
        }
        :host(:hover) simple-popover,
        :host(:focus-within) simple-popover {
          visibility: visible;
          overflow: visible;
        }
      `
    ];
  }
  render() {
    return html`
      <iron-icon id="info-icon" icon="info"></iron-icon>
      <simple-popover auto for="info-icon">
        <slot></slot>
      </simple-popover>
    `;
  }
  static get properties() {
    return {
      id: {
        type: String,
        reflect: true,
        attribute: "id"
      }
    };
  }
  constructor() {
    super();
  }
}
window.customElements.define(SimpleFieldsInfo.tag, SimpleFieldsInfo);
export { SimpleFieldsInfo };
