// dependencies / things imported
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import {
  loadAvatarCode,
  saveAvatarCode,
  AVATAR_EVENT,
} from "@haxtheweb/rpg-character/lib/rpg-character-avatar.js";
import {
  SITE_ADMIN_TITLEBAR_STYLES,
  SITE_ADMIN_MODAL_SIZE,
} from "../admin/site-admin-sections.js";

/**
 * Open rpg-character-builder in a simple-modal so a person can design their
 * avatar. Save stores it (see rpg-character-avatar.js) and every menu
 * toggle for that user updates.
 * @param {HTMLElement} origin element the modal events dispatch from
 * @param {Object} options { userName, avatarCode, title, saveLabel, cancelLabel }
 * The dialog uses the site admin titlebar and the builder's own action bar
 * (Cancel, Save), so it reads like any other admin screen.
 */
export async function openCharacterBuilder(origin, options) {
  const { userName, avatarCode, title, saveLabel, cancelLabel } = options;
  await import("@haxtheweb/rpg-character/lib/rpg-character-builder.js");
  await import("@haxtheweb/simple-modal/simple-modal.js");
  const builder = globalThis.document.createElement("rpg-character-builder");
  const current = loadAvatarCode(userName, { avatarCode });
  if (current) {
    builder.code = current;
  } else {
    builder.seed = userName || "";
  }
  // the builder draws its own HAX UI action bar: changes are staged and
  // Save stays quiet until something changes, like the site admin dialog
  builder.actions = true;
  builder.saveLabel = saveLabel || "";
  builder.cancelLabel = cancelLabel || "";
  const hide = () =>
    origin.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
  builder.addEventListener("rpg-character-builder-save", (e) => {
    saveAvatarCode(
      userName,
      e.detail && e.detail.code ? e.detail.code : builder.code,
    );
    hide();
  });
  builder.addEventListener("rpg-character-builder-cancel", hide);
  // the site admin dialog's titlebar, at a size that suits one character:
  // full screen on a phone, up to 1100 x 820 on a desktop
  const gap = "clamp(0px, 2vw - 8px, 32px)";
  origin.dispatchEvent(
    new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title,
        titleIcon: HaxUiAdminIcons.author,
        elements: { content: builder },
        invokedBy: origin,
        clone: false,
        modal: true,
        styles: {
          ...SITE_ADMIN_TITLEBAR_STYLES,
          ...SITE_ADMIN_MODAL_SIZE,
          "--simple-modal-width": `min(1100px, calc(100vw - 2 * ${gap}))`,
          "--simple-modal-max-width": "1100px",
          "--simple-modal-height": `min(820px, calc(100dvh - 2 * ${gap}))`,
          "--simple-modal-max-height": "820px",
          "--simple-modal-content-padding": "0",
          "--simple-modal-content-container-background":
            "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
          "--simple-modal-z-index": "100000000",
        },
      },
    }),
  );
}

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
    this.title = "";
    this.avatarCode = "";
    this._code = "";
    this._onAvatarChanged = (e) => {
      if (e.detail && e.detail.userName === this.seed) {
        this._code = e.detail.code;
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener(AVATAR_EVENT, this._onAvatarChanged);
  }

  disconnectedCallback() {
    globalThis.removeEventListener(AVATAR_EVENT, this._onAvatarChanged);
    super.disconnectedCallback();
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // seed is the user name; their saved avatar (if any) wins over its look
    if (changedProperties.has("seed") || changedProperties.has("avatarCode")) {
      this._code = loadAvatarCode(this.seed, { avatarCode: this.avatarCode });
    }
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
      title: { type: String },
      /** avatar code supplied by the backend (userData.avatarCode), if any */
      avatarCode: { type: String, attribute: "avatar-code" },
      _code: { type: String, state: true },
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
          outline: var(--ddd-border-size-sm, 2px) solid
            var(--ddd-theme-default-skyBlue);
          outline-offset: 2px;
        }

        rpg-character {
          --simple-toolbar-border-radius: var(--ddd-radius-md);
          border-radius: var(--ddd-radius-md);
          /* a host can set these to keep the frame the same in every
             theme (the site editor's always-dark top bar does) */
          background-color: var(
            --app-hax-user-menu-toggle-background,
            var(--simple-colors-default-theme-grey-1)
          );
          border: var(--ddd-border-sm);
          border-color: var(
            --app-hax-user-menu-toggle-border-color,
            var(--ddd-theme-default-limestoneGray)
          );
          padding: 0;
          margin: 0 8px 0 4px;
          height: var(--ddd-spacing-11, 44px);
          width: var(--ddd-spacing-11, 44px);
          display: block;
        }

        :host([dark]) rpg-character,
        :host([dark-mode]) rpg-character {
          border-color: var(
            --app-hax-user-menu-toggle-border-color,
            var(--ddd-theme-default-white, white)
          );
        }

        button:hover rpg-character,
        button:focus rpg-character,
        button:focus-visible rpg-character {
          border-color: var(--ddd-theme-default-skyBlue);
          background-color: var(
            --app-hax-user-menu-toggle-background-hover,
            var(--simple-colors-default-theme-grey-3)
          );
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
        title="${this.title}"
      >
        <!-- decorative: the button itself carries the accessible name, so
             role=img with empty alt here would be an unnamed image
             (axe: role-img-alt) -->
        <rpg-character
          seed="${this.seed}"
          code="${this._code}"
          width="${this.width}"
          height="${this.height}"
          hat="${this.hat}"
          ?walking="${this.walking}"
          aria-hidden="true"
        ></rpg-character>
        <slot></slot>
      </button>
    `;
  }
}
customElements.define(AppHaxUserMenuToggle.tag, AppHaxUserMenuToggle);
