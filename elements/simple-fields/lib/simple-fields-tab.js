import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsFieldset } from "./simple-fields-fieldset.js";
import { A11yTab } from "@lrnwebcomponents/a11y-tabs/lib/a11y-tab.js";
/**
 * `simple-fields-tab` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @group simple-fields
 * @element simple-fields-tab
 * @extends a11y-tab
 * @extends simple-fields-fieldset
 */
class SimpleFieldsTab extends A11yTab {
  static get tag() {
    return "simple-fields-tab";
  }
  static get styles() {
    return [...super.styles, ...SimpleFieldsFieldset.styles];
  }
  static get properties() {
    return {
      ...super.properties,
      ...SimpleFieldsFieldset.properties,
    };
  }
}
window.customElements.define(SimpleFieldsTab.tag, SimpleFieldsTab);
export { SimpleFieldsTab };
