/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

export class AppHaxScrollButton extends LitElement {
  static get tag() {
    return "app-hax-scroll-button";
  }

  constructor() {
    super();
    this.label = "";
    this.targetId = "";
    this.isDarkMode = document.body.classList.contains("dark-mode");
  }

  static get properties() {
    return {
      label: { type: String },
      targetId: { type: String },
      isDarkMode: { type: Boolean, reflect: true },
    };
  }

  scrollToTarget() {
    if (this.targetId) {
      let targetElement = null;
      let appHax = this.closest("app-hax") || document.querySelector("app-hax");

      if (appHax) {
        let useCaseFilter = appHax.shadowRoot
          ? appHax.shadowRoot.querySelector("app-hax-use-case-filter")
          : appHax.querySelector("app-hax-use-case-filter");
        if (useCaseFilter) {
          targetElement = useCaseFilter.shadowRoot
            ? useCaseFilter.shadowRoot.getElementById(this.targetId)
            : useCaseFilter.querySelector(`#${this.targetId}`);
        }
      }
      if (!targetElement) {
        targetElement = document.getElementById(this.targetId);
      }
      if (targetElement) {
        console.log(`Scrolling to:`, targetElement);
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn(
          `Element with id '${this.targetId}' not found inside app-hax-use-case-filter.`,
        );
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this._darkModeObserver = new MutationObserver(() => {
      this.isDarkMode = document.body.classList.contains("dark-mode");
    });
    this._darkModeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
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
      <div @click="${this.scrollToTarget}" tabindex="0" role="button">
        <h5>${this.label}</h5>
      </div>
    `;
  }
}
customElements.define(AppHaxScrollButton.tag, AppHaxScrollButton);
