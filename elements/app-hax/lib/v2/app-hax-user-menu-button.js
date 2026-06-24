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
    this.label = "Menu Item";
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
          text-decoration: none;
          align-items: center;
          width: 100%;
          border: none;
          margin: 0;
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          font-size: var(--ddd-font-size-6xs, 12px);
          text-align: left;
          color: light-dark(var(--ddd-theme-default-coalyGray, #222), var(--ddd-theme-default-white, white));
          background: transparent;
          cursor: pointer;
          font-family: var(--ddd-font-primary, sans-serif);
          transition: all 0.2s ease;
          min-height: var(--ddd-spacing-8, 32px);
          box-sizing: border-box;
        }

        .icon {
          padding-right: var(--ddd-spacing-2, 8px);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          --simple-icon-width: var(--ddd-icon-xs, 24px);
          --simple-icon-height: var(--ddd-icon-xs, 24px);
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
