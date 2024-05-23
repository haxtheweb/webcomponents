import { LitElement, html, css } from "lit";
import { SimpleFieldsFieldsetBehaviors } from "./simple-fields-fieldset.js";
import { A11yTabs } from "@haxtheweb/a11y-tabs/a11y-tabs.js";
import "./simple-fields-tab.js";
import { SimpleFieldsButtonStyles } from "./simple-fields-ui.js";
/**
 * `simple-fields-tabs` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @customElement
 * @group simple-fields
 * @element simple-fields-tabs
 * @extends simple-fields-fieldset
 * @class SimpleFieldsTabs
 * @extends {A11yTabs}
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
      ...this.A11yTabsCoreStyles,
      ...SimpleFieldsButtonStyles,
      css`
        :host {
          border: 1px solid var(--simple-fields-border-color-light, #ccc);
          padding: var(--simple-fields-margin-small, 8px)
            var(--simple-fields-margin-small, 8px)
            var(--simple-fields-margin, 16px);
          background-color: var(--simple-fields-background-color, transparent);
          border-radius: var(--simple-fields-border-radius, 2px);
        }
        :host([error]) #tabs .error {
          color: var(--simple-fields-error-color, #b40000);
          transition: border 0.5s ease;
        }
      `,
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      ...SimpleFieldsFieldsetBehaviors.properties,
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
      <span class="label${tab.error ? " error" : ""}" part="tab-label"
        >${tab.label}${tab.error ? "*" : ""}</span
      >
    `;
  }
}
customElements.define(SimpleFieldsTabs.tag, SimpleFieldsTabs);
export { SimpleFieldsTabs };
