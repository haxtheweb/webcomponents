import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { HaxUiAdminTokens } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminControls } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";

class HAXConfirmDialog extends I18NMixin(DDD) {
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
    // labels fall back to translatable defaults in render when not provided
    this.confirmLabel = null;
    this.cancelLabel = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      confirm: "Confirm",
      cancel: "Cancel",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.destructive = false;
    this.closeOnConfirm = true;
    this.closeOnCancel = true;
    this.confirmCallback = null;
    this.cancelCallback = null;
    this.__focusableSelector =
      "button:not([disabled]), [href], input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
    this._handleKeydown = this._handleKeydown.bind(this);
  }

  /**
   * The admin's leave prompt look: a muted message under the modal's title
   * and the HAX UI buttons on the right (cancel plain, confirm primary, or
   * a danger fill when destructive). Open it with SITE_ADMIN_CONFIRM_STYLES
   * so the modal around it is the matching surface panel.
   */
  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminControls,
      css`
        :host {
          display: block;
          padding: var(--hax-ui-gap) var(--ddd-spacing-4, 16px)
            var(--ddd-spacing-4, 16px);
          color: var(--hax-ui-text);
          font-family: var(--hax-ui-admin-font-family);
        }
        .message {
          margin: 0 0 var(--hax-ui-gap-lg);
          font-size: 13px;
          line-height: 1.45;
          color: var(--hax-ui-text-muted);
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: var(--hax-ui-gap-md);
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
            class="hax-ui-btn ghost"
            data-action="cancel"
            autofocus
            @click=${this._cancelTap}
          >
            ${this.cancelLabel || this.t.cancel}
          </button>
          <button
            type="button"
            data-action="confirm"
            class="hax-ui-btn ${
              this.destructive ? "danger-fill destructive" : "primary"
            }"
            @click=${this._confirmTap}
          >
            ${this.confirmLabel || this.t.confirm}
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
  /**
   * Public alias for _focusInitialAction so that simple-modal can delegate
   * initial focus to this component via a consistent interface.
   */
  focusInitial() {
    this._focusInitialAction();
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
