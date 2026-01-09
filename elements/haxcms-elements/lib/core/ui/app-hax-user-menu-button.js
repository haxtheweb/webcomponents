// TODO: Text-overflow-ellipses

// dependencies / things imported
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

export class AppHaxUserMenuButton extends DDDSuper(LitElement) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-user-menu-button";
  }

  constructor() {
    super();
    this.icon = "account-circle";
    this.label = "Default";
  }

  handleClick(e) {
    // Find the parent anchor element and trigger its click
    const parentAnchor = this.parentElement;
    if (parentAnchor && parentAnchor.tagName.toLowerCase() === "a") {
      e.stopPropagation();
      parentAnchor.click();
    }
  }

  static get properties() {
    return {
      icon: { type: String },
      label: { type: String },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          font-family: var(--ddd-font-primary, sans-serif);
          text-align: center;
          width: 100%;
          display: block;
        }

        .menu-button {
          display: flex;
          align-items: center;
          width: 100%;
          border: none;
          margin: 0;
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          font-size: var(--ddd-font-size-3xs, 12px);
          text-align: left;
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          background: transparent;
          cursor: pointer;
          font-family: var(--ddd-font-primary, sans-serif);
          transition: all 0.2s ease;
          min-height: var(--ddd-spacing-8, 32px);
          box-sizing: border-box;
        }

        :host([dark]) .menu-button,
        body.dark-mode .menu-button {
          color: var(--ddd-theme-default-white, white);
        }

        .menu-button:hover,
        .menu-button:active,
        .menu-button:focus {
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          outline: none;
        }

        :host([dark]) .menu-button:hover,
        :host([dark]) .menu-button:active,
        :host([dark]) .menu-button:focus,
        body.dark-mode .menu-button:hover,
        body.dark-mode .menu-button:active,
        body.dark-mode .menu-button:focus {
          background: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
        }

        :host(.logout) .menu-button:hover,
        :host(.logout) .menu-button:active,
        :host(.logout) .menu-button:focus {
          background: var(--ddd-theme-default-original87Pink, #e4007c);
          color: var(--ddd-theme-default-white, white);
        }

        .icon {
          padding-right: var(--ddd-spacing-2, 8px);
          font-size: var(--ddd-font-size-xs, 14px);
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .label {
          flex: 1;
          text-align: left;
        }
      `,
    ];
  }

  render() {
    return html`
      <button
        class="menu-button"
        part="menu-button"
        @click="${this.handleClick}"
      >
        ${this.icon
          ? html`<simple-icon-lite
              class="icon"
              icon="${this.icon}"
            ></simple-icon-lite>`
          : ""}
        <span class="label">${this.label}</span>
      </button>
    `;
  }
}
customElements.define(AppHaxUserMenuButton.tag, AppHaxUserMenuButton);
