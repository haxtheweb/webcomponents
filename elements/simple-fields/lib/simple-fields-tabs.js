import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsFieldset } from "./simple-fields-fieldset.js";
import { A11yTabs } from "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import "./simple-fields-tab.js";
/**
 * `simple-fields-tabs` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @group simple-fields
 * @element simple-fields-tabs
 * @extends a11y-tabs
 * @extends simple-fields-fieldset
 */
class SimpleFieldsTabs extends A11yTabs {
  constructor() {
    super();
    this.fullWidth = true;
  }
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
        :host {
          --a11y-tabs-font-family: var(--simple-fields-font-family, sans-serif);
          --a11y-tabs-font-size: var(--simple-fields-detail-font-size, 12px);
          --a11y-tabs-color: var(--simple-fields-color, black);
          --a11y-tabs-focus-color: var(--simple-fields-color, black);
          --a11y-tabs-border-color: var(
            --simple-fields-border-color-light,
            #ccc
          );
          --a11y-tabs-margin: var(--simple-fields-margin, 16px) 0;
          --a11y-tabs-border-radius: var(--simple-fields-border-radius, 2px);
          --a11y-tabs-button-padding: var(--simple-fields-margin-small, 8px);
          --a11y-tabs-content-padding: var(--simple-fields-margin, 16px);
        }
      `,
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      ...SimpleFieldsFieldset.properties,
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
