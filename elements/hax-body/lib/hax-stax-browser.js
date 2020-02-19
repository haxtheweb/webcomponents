import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `hax-stax-browser`
 * @customElement hax-stax-browser
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
        .stax-container {
          text-align: center;
          margin: 0px 16px;
        }
      `
    ];
  }
  constructor() {
    super();
    this.staxList = [];
  }
  render() {
    return html`
      <div class="stax-container">
        ${this.staxList.map(
          stax => html`
            <hax-tray-button
              wide
              index="${stax.index}"
              label="${stax.details.title}"
              .stax="${stax.stax}"
              icon="hax:templates"
              color="green"
              event-name="insert-stax"
            ></hax-tray-button>
          `
        )}
      </div>
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
}
window.customElements.define(HaxStaxBrowser.tag, HaxStaxBrowser);
export { HaxStaxBrowser };
