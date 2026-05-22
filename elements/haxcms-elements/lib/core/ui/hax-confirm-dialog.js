import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

class HAXConfirmDialog extends DDD {
  static get tag() {
    return "hax-confirm-dialog";
  }
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.addEventListener("keydown", this._handleKeydown);
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", this._handleKeydown);
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    setTimeout(() => this._focusInitialAction(), 300);
  }

  static get properties() {
    return {
      message: { type: String },
      confirmLabel: { type: String, attribute: "confirm-label" },
      cancelLabel: { type: String, attribute: "cancel-label" },
      destructive: { type: Boolean, reflect: true },
      closeOnConfirm: { type: Boolean, attribute: "close-on-confirm" },
      closeOnCancel: { type: Boolean, attribute: "close-on-cancel" },
      confirmCallback: { type: Object, attribute: false },
      cancelCallback: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this.message = "";
    this.confirmLabel = "Confirm";
    this.cancelLabel = "Cancel";
    this.destructive = false;
    this.closeOnConfirm = true;
    this.closeOnCancel = true;
    this.confirmCallback = null;
    this.cancelCallback = null;
    this.__focusableSelector =
      "button:not([disabled]), [href], input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
    this._handleKeydown = this._handleKeydown.bind(this);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-primary);
        }
        .confirm-shell {
          border: var(--ddd-border-sm) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-theme-default-slateGray)
            );
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-4);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          background-image: repeating-linear-gradient(
              0deg,
              transparent 0,
              transparent 11px,
              light-dark(rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0.08)) 11px,
              light-dark(rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0.08)) 12px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0,
              transparent 11px,
              light-dark(rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0.08)) 11px,
              light-dark(rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0.08)) 12px
            );
        }
        .message {
          margin: 0;
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150, 1.5);
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: var(--ddd-spacing-2);
          margin-top: var(--ddd-spacing-4);
        }
        button {
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-120, 1.2);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          margin: 0;
          min-height: 44px;
          min-width: 124px;
          color: var(--ddd-theme-default-white);
          background-color: var(--ddd-theme-default-skyBlue);
          border: var(--ddd-border-xs) solid var(--ddd-theme-default-navy);
          border-radius: var(--ddd-radius-sm);
          font-family: var(--ddd-font-navigation, sans-serif);
          cursor: pointer;
        }
        button:hover,
        button:focus-visible {
          outline: var(--ddd-border-xs) solid
            var(--ddd-theme-default-keystoneYellow);
          outline-offset: 2px;
          background-color: var(--ddd-theme-default-nittanyNavy);
        }
        button.destructive {
          background-color: var(--ddd-theme-default-discoveryCoral);
          border-color: var(--ddd-theme-default-discoveryCoral);
        }
        button.destructive:hover,
        button.destructive:focus-visible {
          background-color: var(--ddd-theme-default-error);
          border-color: var(--ddd-theme-default-error);
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="confirm-shell">
        <p class="message">${this.message}</p>
        <div class="actions">
          <button
            type="button"
            data-action="cancel"
            autofocus
            @click=${this._cancelTap}
          >
            ${this.cancelLabel}
          </button>
          <button
            type="button"
            data-action="confirm"
            class="${this.destructive ? "destructive" : ""}"
            @click=${this._confirmTap}
          >
            ${this.confirmLabel}
          </button>
        </div>
      </div>
    `;
  }
  _getFocusableElements() {
    if (!this.shadowRoot) {
      return [];
    }
    return Array.from(
      this.shadowRoot.querySelectorAll(this.__focusableSelector),
    );
  }
  _focusInitialAction() {
    if (!this.shadowRoot) {
      return;
    }
    const cancelButton = this.shadowRoot.querySelector(
      "button[data-action='cancel']",
    );
    const confirmButton = this.shadowRoot.querySelector(
      "button[data-action='confirm']",
    );
    const target = cancelButton || confirmButton;
    if (target && typeof target.focus === "function") {
      target.focus();
    }
  }
  _handleKeydown(event) {
    if (!event || event.key !== "Tab") {
      return;
    }
    const focusables = this._getFocusableElements();
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const activeElement = this.shadowRoot.activeElement;
    const activeIsTracked = focusables.includes(activeElement);
    if (event.shiftKey) {
      if (activeElement === first || !activeIsTracked) {
        event.preventDefault();
        last.focus();
      }
    } else if (activeElement === last || !activeIsTracked) {
      event.preventDefault();
      first.focus();
    }
  }

  _runCallback(callback, event) {
    if (callback && typeof callback === "function") {
      callback(event);
    }
  }

  _closeModal() {
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
  }

  _cancelTap(event) {
    this._runCallback(this.cancelCallback, event);
    this.dispatchEvent(
      new CustomEvent("hax-confirm-dialog-cancel", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          confirmed: false,
          value: false,
          event: event,
        },
      }),
    );
    if (this.closeOnCancel) {
      this._closeModal();
    }
  }

  _confirmTap(event) {
    this._runCallback(this.confirmCallback, event);
    this.dispatchEvent(
      new CustomEvent("hax-confirm-dialog-confirm", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          confirmed: true,
          value: true,
          event: event,
        },
      }),
    );
    if (this.closeOnConfirm) {
      this._closeModal();
    }
  }
}

globalThis.customElements.define(HAXConfirmDialog.tag, HAXConfirmDialog);
export { HAXConfirmDialog };
