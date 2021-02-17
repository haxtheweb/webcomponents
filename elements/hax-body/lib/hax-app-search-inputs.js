import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-fields/simple-fields.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";
/**
`hax-app-search-inputs`
 An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that we can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.

* @demo demo/index.html

@microcopy - the mental model for this element
 - hax-app - a source of input we're querying for media / content
 - hax-app-search - element controlling the experience of searching an app
 - hax-body - the text are ultimately we are trying to insert this item into
*/
class HaxAppSearchInputs extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .search-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        #cancel {
          flex: 0 0 auto;
        }
        h5 {
          margin: var(--hax-tray-margin, 4px) 0;
          font-size: var(--hax-tray-font-size-xl);
          text-transform: capitalize;
        }
      `,
    ];
  }

  constructor() {
    super();
  }
  render() {
    return html`
      <h5 class="search-label">
        ${this.label}
        <hax-tray-button
          id="cancel"
          class="${!this.searching ? "visibility-hidden" : ""}"
          icon="close"
          label="Cancel Search"
          event-name="cancel-search"
        >
        </hax-tray-button>
      </h5>
      <simple-fields
        id="form"
        .schema="${this.schema}"
        .schematizer="${HaxSchematizer}"
        .elementizer="${HaxElementizer}"
        @value-changed="${this.searchValuesChanged}"
      ></simple-fields>
    `;
  }
  searchValuesChanged(e) {
    if (typeof e.detail.value !== "string") {
      // dispatch the event directly so that we can data bind to input
      this.dispatchEvent(
        new CustomEvent("search-values-changed", {
          detail: e.detail.value,
        })
      );
    }
  }
  static get tag() {
    return "hax-app-search-inputs";
  }

  static get properties() {
    return {
      /**
       * Schema used to generate the input types.
       */
      schema: {
        type: Object,
      },
    };
  }
}
window.customElements.define(HaxAppSearchInputs.tag, HaxAppSearchInputs);
export { HaxAppSearchInputs };
