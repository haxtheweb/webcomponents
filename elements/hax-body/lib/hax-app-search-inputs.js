import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/eco-json-schema-form/lib/eco-json-schema-object.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";
/**
`hax-app-search-inputs`
 An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that hax-manager can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.

* @demo demo/index.html

@microcopy - the mental model for this element
 - hax-app - a source of input we're querying for media / content
 - hax-app-search - element controlling the experience of searching an app
 - hax-body - the text are ultimately we are trying to insert this item into
*/
class HaxAppSearchInputs extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-item/paper-item.js");
  }
  static get template() {
    return html`
      <style include="simple-colors hax-shared-styles">
        :host {
          display: block;
        }
        eco-json-schema-object {
          color: var(--hax-color-text);
        }
        .search-label {
          font-size: 24px;
          color: var(--hax-color-text);
          font-weight: bold;
          margin: 0;
          padding: 0;
        }
      </style>
      <div class="search-label">Search [[label]]</div>
      <eco-json-schema-object
        id="form"
        schema="[[schema]]"
        value="{{values}}"
      ></eco-json-schema-object>
    `;
  }

  static get tag() {
    return "hax-app-search-inputs";
  }

  static get observers() {
    return ["_valueChanged(values.*)"];
  }

  static get properties() {
    return {
      /**
       * Title.
       */
      label: {
        type: String,
        value: "app"
      },
      /**
       * Search input values mapped to schema inputs.
       */
      values: {
        type: Object
      },
      /**
       * Schema used to generate the input types.
       */
      schema: {
        type: Object
      }
    };
  }

  /**
   * Search input was added.
   */
  _valueChanged(change) {
    this.dispatchEvent(
      new CustomEvent("hax-app-search-values-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: change.base
      })
    );
  }
}
window.customElements.define(HaxAppSearchInputs.tag, HaxAppSearchInputs);
export { HaxAppSearchInputs };
