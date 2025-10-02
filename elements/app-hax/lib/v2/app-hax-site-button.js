/* eslint-disable no-console */
// dependencies / things imported
import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "wired-elements/lib/wired-button.js";

const postIt = new URL("../assets/images/PostIt.svg", import.meta.url).href;

// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class AppHaxSiteButton extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-site-button";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.label = null;
    this.value = null;
    this.disabled = false;
    this.elevation = "3";
    this.active = false;
    this.comingSoon = false;
    this.addEventListener("click", this._handleClick);
    this.addEventListener("focus", this._handleFocus);
    this.addEventListener("blur", this._handleBlur);
    this.addEventListener("mouseover", this._handleFocus);
    this.addEventListener("mouseout", this._handleBlur);
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      label: { type: String },
      value: { type: String },
      disabled: { type: Boolean, reflect: true },
      elevation: { type: Number },
      active: { type: Boolean, reflect: true },
      comingSoon: { type: Boolean, reflect: true, attribute: "coming-soon" },
    };
  }

  // CSS - specific to Lit
  static get styles() {
    return css`
      :host {
        --background-color: transparent;
        --background-color-active: white;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-family: "Press Start 2P", sans-serif;
        width: fit-content;
        margin: 20px 0;
      }
      :host([coming-soon]) .haxButton {
        pointer-events: none;
        background-color: var(--simple-colors-default-theme-grey-6);
      }
      @media (max-width: 800px) {
        :host {
          width: 320px;
        }
      }
      :host([active]) .haxButton {
        color: var(--app-hax-background-color, var(--background-color-active));
        background-color: var(--app-hax-accent-color, var(--accent-color));
      }
      .haxButton {
        background-color: var(
          --app-hax-background-color,
          var(--background-color)
        );
        color: var(--app-hax-accent-color, var(--accent-color));
        font-size: var(--app-hax-site-button-font-size, 26px);
      }
      .contents {
        display: flex;
        justify-content: right;
      }
      .label {
        width: var(--app-hax-site-button-width, auto);
        min-width: var(--app-hax-site-button-min-width, auto);
        height: var(--app-hax-site-button-height, auto);
        display: inline-flex;
      }
      .coming-soon {
        display: block;
        height: 90px;
        width: 110px;
        z-index: 1;
        position: absolute;
        margin-right: -25px;
        margin-top: -25px;
      }
    `;
  }

  _handleFocus() {
    if (!this.disabled && !this.comingSoon) {
      this.active = true;
      this.elevation = "5";
    }
  }

  _handleBlur() {
    if (!this.disabled && !this.comingSoon) {
      this.active = false;
      this.elevation = "3";
    }
  }

  _handleClick() {
    if (!this.disabled && !this.comingSoon) {
      this.shadowRoot.querySelector(".haxButton").blur();
    }
  }

  // HTML - specific to Lit
  render() {
    return html`
      <wired-button
        elevation=${this.elevation}
        ?disabled=${this.disabled || this.comingSoon}
        class="haxButton"
        @click="${this._handleClick}"
      >
        <div class="contents">
          <span class="label"> ${this.label} </span>
          ${this.comingSoon
            ? html`<img
                src="${postIt}"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                alt="Feature coming soon"
                class="coming-soon"
              />`
            : ``}
        </div>
      </wired-button>
    `;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  /**
   * haxProperties integration via file reference
   */
}

customElements.define(AppHaxSiteButton.tag, AppHaxSiteButton);
