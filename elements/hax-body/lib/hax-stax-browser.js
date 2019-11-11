import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hax-body/lib/hax-stax-browser-item.js";
/**
 * `hax-stax-browser`
 * `Select a stack / template to insert`
 * @microcopy - the mental model for this element
 * - stax - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxStaxBrowser extends LitElement {
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
    this.__staxList = [];
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  }
  render() {
    return html`
      ${this.__staxList.map(
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
      },
      __staxList: {
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
      e.detail.property
    ) {
      // make sure we set array's empty first to force a repaint of paths
      if (
        typeof this[e.detail.property] !== typeof undefined &&
        this[e.detail.property] != null &&
        typeof this[e.detail.property].length !== typeof undefined
      ) {
        this[e.detail.property] = [];
      }
      this[e.detail.property] = e.detail.value;
    }
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "staxList") {
        this.__staxList = this[propName];
      }
    });
  }
}
window.customElements.define(HaxStaxBrowser.tag, HaxStaxBrowser);
export { HaxStaxBrowser };
