// dependencies / things imported
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/rpg-character/rpg-character.js";

export class AppHaxUserMenuToggle extends DDDSuper(LitElement) {
  static get tag() {
    return "app-hax-user-menu-toggle";
  }

  constructor() {
    super();
    this.seed = "";
    this.width = 68;
    this.height = 68;
    this.hat = "none";
    this.walking = false;
    this.ariaLabel = "";
    this.ariaExpanded = "false";
    this.ariaHaspopup = "menu";
    this.title = "";
  }

  static get properties() {
    return {
      seed: { type: String },
      width: { type: Number },
      height: { type: Number },
      hat: { type: String },
      walking: { type: Boolean, reflect: true },
      ariaLabel: { type: String, attribute: "aria-label" },
      ariaExpanded: { type: String, attribute: "aria-expanded" },
      ariaHaspopup: { type: String, attribute: "aria-haspopup" },
      title: { type: String },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
          line-height: 0;
        }

        button {
          cursor: pointer;
          border: none;
          background-color: transparent;
          padding: 0;
          margin: 0;
          line-height: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: light-dark(
            var(--ddd-theme-default-coalyGray, #222),
            var(--ddd-theme-default-white, #fff)
          );
          -webkit-appearance: none;
          appearance: none;
          min-height: var(--top-bar-height, 64px);
          font-family: var(--ddd-font-primary, sans-serif);
        }

        button:focus-visible {
          outline: var(--ddd-border-sm, 2px solid)
            var(--ddd-theme-default-skyBlue);
          outline-offset: 2px;
        }

        rpg-character {
          --simple-toolbar-border-radius: var(--ddd-radius-md);
          border-radius: var(--ddd-radius-md);
          background-color: var(--simple-colors-default-theme-grey-1);
          border: var(--ddd-border-sm);
          border-color: var(--ddd-theme-default-limestoneGray);
          padding: 0;
          margin: 0 8px 0 4px;
          height: var(--ddd-spacing-11, 44px);
          width: var(--ddd-spacing-11, 44px);
          display: block;
        }

        :host([dark]) rpg-character,
        :host([dark-mode]) rpg-character {
          border-color: var(--ddd-theme-default-white, white);
        }

        button:hover rpg-character,
        button:focus rpg-character,
        button:focus-visible rpg-character {
          border-color: var(--ddd-theme-default-skyBlue);
          background-color: var(--simple-colors-default-theme-grey-3);
        }

        ::slotted(*) {
          line-height: 0;
        }
      `,
    ];
  }

  render() {
    return html`
      <button
        class="menu-toggle"
        part="menu-toggle"
        aria-label="${this.ariaLabel}"
        aria-expanded="${this.ariaExpanded}"
        aria-haspopup="${this.ariaHaspopup}"
        title="${this.title}"
      >
        <rpg-character
          seed="${this.seed}"
          width="${this.width}"
          height="${this.height}"
          hat="${this.hat}"
          ?walking="${this.walking}"
          role="img"
          alt=""
        ></rpg-character>
        <slot></slot>
      </button>
    `;
  }
}
customElements.define(AppHaxUserMenuToggle.tag, AppHaxUserMenuToggle);
