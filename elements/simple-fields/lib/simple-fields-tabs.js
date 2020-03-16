import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsFieldset } from "./simple-fields-fieldset.js";
import { A11yTabs } from "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import "./simple-fields-tab.js";
/**
 * `simple-fields-tabs` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @group simple-fields
 * @customElement simple-fields-tabs
 * @extends a11y-tabs
 * @extends simple-fields-fieldset
 */
class SimpleFieldsTabs extends A11yTabs {
  static get tag() {
    return "simple-fields-tabs";
  }
  static get styles() {
    return [
      ...super.styles,
      ...SimpleFieldsFieldset.styles,
      css`
        :host([error]) #tabs .error {
          color: var(--simple-fields-error-color, #dd2c00);
          transition: border 0.5s ease;
        }
      `
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      ...SimpleFieldsFieldset.properties
    };
  }

  /**
   * query selector for tabs
   * override this for custom elements that extend a11y-tabs
   *
   * @readonly
   * @memberof A11yTabs
   */
  get tabQuery() {
    return "simple-fields-tab";
  }

  /**
   * makes tab label
   *
   * @param {string} flag tab's flag
   * @returns object
   * @memberof A11yTabs
   */
  _tabLabel(tab) {
    return html`
      <span class="label${tab.error ? " error" : ""}"
        >${tab.label}${tab.error ? "*" : ""}</span
      >
    `;
  }
}
window.customElements.define(SimpleFieldsTabs.tag, SimpleFieldsTabs);
export { SimpleFieldsTabs };
