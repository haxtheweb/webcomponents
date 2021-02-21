import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js";
/**
 * `hax-stax-browser`
 * @element hax-stax-browser
 * `Select a stack / template to insert`
 * @microcopy - the mental model for this element
 * - stax - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxStaxBrowser extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          flex: 0 0 auto;
          overflow-y: auto;
        }
        simple-button-grid {
          overflow: auto;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.staxList = [];
  }
  render() {
    return html`
      <simple-button-grid columns="3" rows="1" always-expanded>
        ${this.staxList.map(
          (stax) => html`
            <hax-tray-button
              icon-position="top"
              show-text-label
              index="${stax.index}"
              label="${stax.details.title}"
              .stax="${stax.stax}"
              icon="hax:templates"
              color="green"
              event-name="insert-stax"
            ></hax-tray-button>
          `
        )}
      </simple-button-grid>
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
        type: Array,
      },
    };
  }
}
window.customElements.define(HaxStaxBrowser.tag, HaxStaxBrowser);
export { HaxStaxBrowser };
