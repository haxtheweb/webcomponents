// dependencies / things imported
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import {
  loadAvatarCode,
  saveAvatarCode,
  AVATAR_EVENT,
} from "@haxtheweb/rpg-character/lib/rpg-character-avatar.js";

/**
 * Open rpg-character-builder in a simple-modal so a person can design their
 * avatar. Save stores it (see rpg-character-avatar.js) and every menu
 * toggle for that user updates.
 * @param {HTMLElement} origin element the modal events dispatch from
 * @param {Object} options { userName, avatarCode, title, saveLabel, cancelLabel }
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
  const hide = () =>
    origin.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
  const buttons = globalThis.document.createElement("div");
  buttons.style.display = "flex";
  buttons.style.gap = "var(--ddd-spacing-3)";
  buttons.style.justifyContent = "flex-end";
  // the modal's buttons live in light DOM, so they carry their own DDD look
  const styleButton = (button, primary) => {
    Object.assign(button.style, {
      fontFamily: "var(--ddd-font-navigation)",
      fontSize: "var(--ddd-font-size-4xs)",
      padding: "var(--ddd-spacing-2) var(--ddd-spacing-4)",
      borderRadius: "var(--ddd-radius-sm)",
      border: "var(--ddd-border-sm)",
      borderColor: "var(--ddd-theme-default-nittanyNavy)",
      cursor: "pointer",
      backgroundColor: primary
        ? "var(--ddd-theme-default-nittanyNavy)"
        : "var(--ddd-theme-default-white)",
      color: primary
        ? "var(--ddd-theme-default-white)"
        : "var(--ddd-theme-default-nittanyNavy)",
    });
  };
  const save = globalThis.document.createElement("button");
  save.textContent = saveLabel;
  styleButton(save, true);
  save.addEventListener("click", () => {
    saveAvatarCode(userName, builder.code);
    hide();
  });
  const cancel = globalThis.document.createElement("button");
  cancel.textContent = cancelLabel;
  styleButton(cancel, false);
  cancel.addEventListener("click", hide);
  buttons.append(cancel, save);
  origin.dispatchEvent(
    new CustomEvent("simple-modal-show", {
      bubbles: true,
      composed: true,
      cancelable: false,
      detail: {
        title,
        elements: { content: builder, buttons },
        invokedBy: origin,
        clone: false,
        modal: true,
        styles: {
          "--simple-modal-titlebar-background":
            "var(--ddd-theme-default-nittanyNavy)",
          "--simple-modal-titlebar-color": "var(--ddd-theme-default-white)",
          "--simple-modal-width": "92vw",
          "--simple-modal-max-width": "960px",
          "--simple-modal-height": "auto",
          "--simple-modal-max-height": "90vh",
          "--simple-modal-z-index": "100000000",
          "--simple-modal-border-radius": "var(--ddd-radius-md)",
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
