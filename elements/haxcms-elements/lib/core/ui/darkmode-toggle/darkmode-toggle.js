import { LitElement, html, css } from "lit";

const sun = new URL("./images/sunIcon.png", import.meta.url).href;
const moon = new URL("./images/moonIcon.png", import.meta.url).href;

export class DarkmodeToggle extends LitElement {
  constructor() {
    super();
    this.checked = false;
    this.label = "Dark mode";
    this.disabled = false;
  }

  static get tag() {
    return "darkmode-toggle";
  }

  _toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  _handleKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._toggle();
    }
  }

  static get properties() {
    return {
      checked: {
        type: Boolean,
        reflect: true,
      },
      disabled: {
        type: Boolean,
        reflect: true,
      },
      label: {
        type: String,
      },
    };
  }

  render() {
    const iconSrc = this.checked ? moon : sun;
    return html`
      <button
        class="darkmode-toggle-btn"
        ?disabled="${this.disabled}"
        aria-pressed="${this.checked}"
        aria-label="${this.label}"
        @click="${this._toggle}"
        @keydown="${this._handleKeydown}"
      >
        <img
          class="icon"
          src="${iconSrc}"
          alt=""
          aria-hidden="true"
        />
        <span class="label">${this.label}</span>
      </button>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
      }

      .darkmode-toggle-btn {
        display: flex;
        align-items: center;
        width: 100%;
        border: none;
        margin: 0;
        padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
        font-size: var(--ddd-font-size-6xs, 12px);
        text-align: left;
        font-family: var(--ddd-font-primary, sans-serif);
        color: light-dark(
          var(--ddd-theme-default-coalyGray, #222),
          var(--ddd-theme-default-white, white)
        );
        background: transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        min-height: var(--ddd-spacing-8, 32px);
        box-sizing: border-box;
      }

      .darkmode-toggle-btn:hover,
      .darkmode-toggle-btn:active,
      .darkmode-toggle-btn:focus {
        background-color: light-dark(
          var(--ddd-theme-default-limestoneGray, #f5f5f5),
          var(--ddd-theme-default-coalyGray, #333)
        );
        outline: none;
      }

      :host([disabled]) .darkmode-toggle-btn {
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
      }

      :host([disabled]) .darkmode-toggle-btn:hover,
      :host([disabled]) .darkmode-toggle-btn:active,
      :host([disabled]) .darkmode-toggle-btn:focus {
        background: transparent;
      }

      .icon {
        padding-right: var(--ddd-spacing-2, 8px);
        flex-shrink: 0;
        display: block;
        width: var(--ddd-icon-xs, 24px);
        height: var(--ddd-icon-xs, 24px);
      }

      .label {
        flex: 1;
        text-align: left;
      }
    `;
  }
}
globalThis.customElements.define(DarkmodeToggle.tag, DarkmodeToggle);
