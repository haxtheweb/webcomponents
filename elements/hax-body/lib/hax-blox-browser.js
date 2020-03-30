import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `hax-blox-browser`
 * @element hax-blox-browser
 * `List of layout blox to select from`
 * @microcopy - the mental model for this element
 * - blox - silly name for the general public when talking about custom elements and what it provides in the end.
 */
class HaxBloxBrowser extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .blox-container {
          text-align: center;
          margin: 0px 16px;
        }
      `
    ];
  }
  constructor() {
    super();
    this.bloxList = [];
  }
  render() {
    return html`
      <div class="blox-container">
        ${this.bloxList.map(
          blox => html`
            <hax-tray-button
              wide
              index="${blox.index}"
              .layout="${blox.details.layout}"
              label="${blox.details.title}"
              icon="${blox.details.icon}"
              event-name="insert-blox"
              color="orange"
              .blox="${blox.blox}"
            ></hax-tray-button>
          `
        )}
      </div>
    `;
  }

  static get tag() {
    return "hax-blox-browser";
  }

  static get properties() {
    return {
      /**
       * The list of blox
       */
      bloxList: {
        type: Array
      }
    };
  }
}
window.customElements.define(HaxBloxBrowser.tag, HaxBloxBrowser);
export { HaxBloxBrowser };
