// TODO: Create app-hax-user-menu-button to be tossed into this
// TODO: Create prefix and suffix sections for sound/light toggles and other shtuff

// dependencies / things imported
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

export class AppHaxUserMenu extends DDDSuper(LitElement) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-user-menu";
  }

  constructor() {
    super();
    this.isOpen = false;
    this.icon = "account-circle";
  }

  static get properties() {
    return {
      isOpen: { type: Boolean, reflect: true, attribute: "is-open" },
      icon: { type: String, reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          font-family: var(--ddd-font-primary, sans-serif);
          text-align: center;
          display: inline-block;
          margin: 0px;
          padding: 0px;
          position: relative;
        }

        .entireComponent {
          max-height: var(--ddd-spacing-10, 40px);
        }

        .menuToggle {
          cursor: pointer;
          max-height: var(--ddd-spacing-10, 40px);
        }

        .user-menu {
          display: none;
        }

        .user-menu.open {
          display: block;
          top: var(--ddd-spacing-12, 48px);
          right: 0px;
          position: absolute;
          border: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-slateGray, #666);
          background: var(--ddd-theme-default-white, white);
          border-radius: var(--ddd-radius-sm, 4px);
          box-shadow: var(--ddd-boxShadow-lg);
          min-width: var(--ddd-spacing-30, 200px);
          z-index: 1000;
          overflow: hidden;
        }

        :host([dark]) .user-menu.open,
        body.dark-mode .user-menu.open {
          background: var(--ddd-theme-default-coalyGray, #333);
          border-color: var(--ddd-theme-default-slateGray, #666);
        }

        .user-menu.open ::slotted(*) {
          display: block;
          width: 100%;
          margin: 0;
          font-size: var(--ddd-font-size-3xs, 12px);
          text-align: left;
          font-family: var(--ddd-font-primary, sans-serif);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          background: transparent;
          text-decoration: none;
        }

        :host([dark]) .user-menu.open ::slotted(*),
        body.dark-mode .user-menu.open ::slotted(*) {
          color: var(--ddd-theme-default-white, white);
        }

        .user-menu.open .main-menu ::slotted(*:hover),
        .user-menu.open .main-menu ::slotted(*:active),
        .user-menu.open .main-menu ::slotted(*:focus) {
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
        }

        :host([dark]) .user-menu.open .main-menu ::slotted(*:hover),
        :host([dark]) .user-menu.open .main-menu ::slotted(*:active),
        :host([dark]) .user-menu.open .main-menu ::slotted(*:focus),
        body.dark-mode .user-menu.open .main-menu ::slotted(*:hover),
        body.dark-mode .user-menu.open .main-menu ::slotted(*:active),
        body.dark-mode .user-menu.open .main-menu ::slotted(*:focus) {
          background: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
        }

        .user-menu.open .post-menu ::slotted(*:hover),
        .user-menu.open .post-menu ::slotted(*:active),
        .user-menu.open .post-menu ::slotted(*:focus) {
          background: var(--ddd-theme-default-original87Pink, #e4007c);
          color: var(--ddd-theme-default-white, white);
        }

        .user-menu ::slotted(button) {
          cursor: pointer;
        }

        .user-menu ::slotted(*) simple-icon-lite {
          padding-right: var(--ddd-spacing-2, 8px);
        }

        .pre-menu,
        .post-menu {
          border-top: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-limestoneGray, #f5f5f5);
        }

        .pre-menu:first-child,
        .main-menu:first-child {
          border-top: none;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="entireComponent">
        <div class="menuToggle" part="menuToggle">
          <slot name="menuButton"
            ><simple-icon-lite icon="${this.icon}"></simple-icon-lite
          ></slot>
        </div>

        <div class="user-menu ${this.isOpen ? "open" : ""}">
          <div class="pre-menu">
            <slot name="pre-menu"></slot>
          </div>
          <div class="main-menu">
            <slot name="main-menu"></slot>
          </div>
          <div class="post-menu">
            <slot name="post-menu"></slot>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define(AppHaxUserMenu.tag, AppHaxUserMenu);
