import { LitElement, html, css } from "lit";

class ResponsiveIframe extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        #container {
          position: relative;
          padding-top: 60%;
          height: 0;
          width: 100%;
        }
        #container ::slotted(iframe) {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="container">
        <slot></slot>
      </div>
    `;
  }
}
globalThis.customElements.define("responsive-iframe", ResponsiveIframe);
