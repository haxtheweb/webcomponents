import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/hax-body/lib/hax-blox-browser-item.js";
/**
 * `hax-blox-browser`
 * @customElement hax-blox-browser
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
        hax-blox-browser-item {
          margin: 10px;
          -webkit-transition: 0.3s all linear;
          transition: 0.3s all linear;
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
      ${this.bloxList.map(
        blox => html`
          <div class="blox-container">
            <hax-blox-browser-item
              .index="${blox.index}"
              .layout="${blox.details.layout}"
              .title="${blox.details.title}"
              .tag="${blox.details.tag}"
              .icon="${blox.details.icon}"
              .author="${blox.details.author}"
              .teaser="${blox.details.teaser}"
              .description="${blox.details.description}"
              .examples="${blox.details.examples}"
              .status="${blox.details.status}"
              .blox="${blox.blox}"
            ></hax-blox-browser-item>
          </div>
        `
      )}
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
