// TODO: Text-overflow-ellipses

// dependencies / things imported
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";

export class AppHaxUserMenuButton extends DDDSuper(LitElement) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-user-menu-button";
  }

  constructor() {
    super();
    this.icon = "account-circle";
    this.label = "Menu Item";
    this.current = false;
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
      /** optional second line under the label (HAX UI quick links) */
      description: { type: String, reflect: true },
      /** optional keyboard shortcut shown at the end of the row */
      shortcut: { type: String },
      /** the current choice in a pick-one list; the row reads as current */
      current: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      css`
        :host {
          font-family: var(--hax-ui-admin-font-family);
          text-align: left;
          width: 100%;
          display: block;
        }
        /* a HAX UI menu row: 40px, 14px, a 16px icon */
        .menu-button {
          display: flex;
          text-decoration: none;
          align-items: center;
          gap: var(--hax-ui-gap-md, 8px);
          width: 100%;
          border: none;
          margin: 0;
          min-height: var(--hax-ui-row-height-roomy, 40px);
          padding: 0 var(--hax-ui-gap-md, 8px);
          border-radius: var(--hax-ui-radius);
          font-family: inherit;
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.25;
          text-align: left;
          color: var(--hax-ui-text);
          background: transparent;
          cursor: pointer;
          transition: background-color var(--hax-ui-duration)
            var(--hax-ui-easing);
          box-sizing: border-box;
        }
        .menu-button:hover,
        .menu-button:focus-visible {
          background-color: var(--hax-ui-hover);
        }
        .menu-button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: -2px;
        }
        .icon {
          flex: none;
          display: flex;
          align-items: center;
          --simple-icon-width: var(--hax-ui-icon, 16px);
          --simple-icon-height: var(--hax-ui-icon, 16px);
        }
        /* with a description the row grows and the icon sits in a chip,
           the same as the site admin launcher cards */
        :host([description]) .menu-button {
          min-height: var(--ddd-spacing-12, 48px);
          padding-top: var(--hax-ui-gap, 4px);
          padding-bottom: var(--hax-ui-gap, 4px);
          gap: var(--hax-ui-gap-lg, 12px);
        }
        :host([description]) .icon {
          width: var(--ddd-spacing-8, 32px);
          height: var(--ddd-spacing-8, 32px);
          justify-content: center;
          border-radius: var(--hax-ui-radius-lg);
          color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
        }
        .text {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .label {
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        :host([description]) .label {
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .description {
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .hax-ui-kbd {
          flex: none;
        }
        /* phone: no keyboard expected, so no shortcut hints (same media as
           KEYBOARD_SHORTCUTS_HIDDEN_MEDIA in @haxtheweb/utils keyboardShortcuts) */
        @media (max-width: 599px), (pointer: coarse) and (max-height: 599px) {
          .hax-ui-kbd {
            display: none;
          }
        }
        /* the current choice in a pick-one list (preview's device menu) */
        :host([current]) .menu-button {
          background-color: var(--hax-ui-selected);
        }
        /* Log out and other leaving actions */
        :host(.logout) .menu-button {
          color: var(--hax-ui-danger);
        }
        :host(.logout) .menu-button:hover,
        :host(.logout) .menu-button:focus-visible {
          background-color: var(--hax-ui-danger-soft);
        }
      `,
    ];
  }

  render() {
    return html`
      <button
        class="menu-button"
        part="menu-button"
        aria-current="${this.current ? "true" : "false"}"
        @click="${this.handleClick}"
      >
        ${
          this.icon
            ? html`<simple-icon-lite
                class="icon"
                icon="${this.icon}"
                aria-hidden="true"
              ></simple-icon-lite>`
            : ""
        }
        <span class="text">
          <span class="label">${this.label}</span>
          ${
            this.description
              ? html`<span class="description">${this.description}</span>`
              : ""
          }
        </span>
        ${
          this.shortcut
            ? html`<kbd class="hax-ui-kbd" aria-hidden="true"
                >${this.shortcut}</kbd
              >`
            : ""
        }
      </button>
    `;
  }
}
customElements.define(AppHaxUserMenuButton.tag, AppHaxUserMenuButton);
