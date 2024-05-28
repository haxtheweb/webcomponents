import { LitElement, html, css } from "lit";
import { SimpleFieldsFieldsetBehaviors } from "./simple-fields-fieldset.js";
import { A11yTab } from "@haxtheweb/a11y-tabs/lib/a11y-tab.js";
/**
 * `simple-fields-tab` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @customElement
 * @group simple-fields
 * @element simple-fields-tab
 * @extends simple-fields-fieldset
 * @class SimpleFieldsTab
 * @extends {A11yTab}
 */
class SimpleFieldsTab extends A11yTab {
  static get tag() {
    return "simple-fields-tab";
  }
  static get styles() {
    return [...super.styles];
  }
  static get properties() {
    return {
      ...super.properties,
      ...SimpleFieldsFieldsetBehaviors.properties,
    };
  }
}
customElements.define(SimpleFieldsTab.tag, SimpleFieldsTab);
export { SimpleFieldsTab };
