/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

export class AppHaxScrollButton extends LitElement {

  static get tag() {
    return "app-hax-scroll-button";
  }

  constructor() {
    super();
    this.label = '';
    this.isDarkMode = document.body.classList.contains("dark-mode");
  }

  static get properties() {
    return {
        label: { type: String },
        isDarkMode: {type: Boolean, reflect: true},
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._darkModeObserver = new MutationObserver(() => {
      this.isDarkMode = document.body.classList.contains("dark-mode");
    });
    this._darkModeObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._darkModeObserver) {
      this._darkModeObserver.disconnect();
    }
  }


  static get styles() {
    return [
      css`
        :host {
          display: flex;
          font-family: "Press Start 2P";
          background-image: url("/elements/app-hax/lib/assets/images/scroll-button-LM.png");
          background-size: cover;
          background-position: center;
          width: 300px;
          height: 50px;
          color: var(--app-hax-accent-color, var(--accent-color));
          align-items: center;
          justify-content: center;
          text-align: center;
          margin: 8px;
        }
        :host([isDarkMode]) {
          background-image: url("/elements/app-hax/lib/assets/images/scroll-button-DM.png");
        }
        div {
          display: flex;
          align-items: center;
        }
      `,
    ];
  }

  render() {
    return html`
    <div>
      <h4>${this.label}</h4>  
    </div>
      
    `;
  }

}
customElements.define(AppHaxScrollButton.tag, AppHaxScrollButton);
