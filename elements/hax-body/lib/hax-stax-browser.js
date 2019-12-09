import { LitElement, html, css } from "lit-element/lit-element.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/hax-body/lib/hax-stax-browser-item.js";
/**
 * `hax-stax-browser`
 * @customElement hax-stax-browser
 * `Select a stack / template to insert`
 * @microcopy - the mental model for this element
 * - stax - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxStaxBrowser extends winEventsElement(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        hax-stax-browser-item {
          margin: 10px;
          transition: 0.3s all linear;
        }
      `
    ];
  }
  constructor() {
    super();
    this.staxList = [];
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated"
    };
  }
  render() {
    return html`
      ${this.staxList.map(
        stax => html`
          <div class="stax-container">
            <hax-stax-browser-item
              .index="${stax.index}"
              .title="${stax.details.title}"
              .tag="${stax.details.tag}"
              .image="${stax.details.image}"
              .author="${stax.details.author}"
              .teaser="${stax.details.teaser}"
              .description="${stax.details.description}"
              .examples="${stax.details.examples}"
              .status="${stax.details.status}"
              .stax="${stax.stax}"
            ></hax-stax-browser-item>
          </div>
        `
      )}
    `;
  }
  static get tag() {
    return "hax-stax-browser";
  }
  static get properties() {
    return {
      /**
       * The list of stax
       */
      staxList: {
        type: Array
      }
    };
  }

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property == "staxList"
    ) {
      this[e.detail.property] = [...e.detail.value];
    }
  }
}
window.customElements.define(HaxStaxBrowser.tag, HaxStaxBrowser);
export { HaxStaxBrowser };
