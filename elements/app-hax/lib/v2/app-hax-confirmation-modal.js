import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-modal/simple-modal.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { store } from "./AppHaxStore.js";

export class AppHaxConfirmationModal extends DDDSuper(LitElement) {
  static get tag() {
    return "app-hax-confirmation-modal";
  }

  constructor() {
    super();
    this.open = false;
    this.title = "";
    this.message = "";
    this.confirmText = "Confirm";
    this.cancelText = "Cancel";
    this.confirmAction = null;
    this.cancelAction = null;
    this.dangerous = false; // For destructive actions like delete/archive
    // Track whether this modal was confirmed so we don't fire cancel logic
    // (and associated sounds) on confirm.
    this._confirmed = false;
  }

  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      title: { type: String },
      message: { type: String },
      confirmText: { type: String },
      cancelText: { type: String },
      dangerous: { type: Boolean },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --simple-modal-z-index: 10000;
          --simple-modal-width: var(--ddd-spacing-32, 480px);
          --simple-modal-max-width: 90vw;
          --simple-modal-max-height: 80vh;
          --simple-modal-border-radius: var(--ddd-radius-md, 8px);
          --simple-modal-titlebar-background: var(
            --ddd-theme-default-nittanyNavy,
            #001e44
          );
          --simple-modal-titlebar-color: var(--ddd-theme-default-white, white);
          --simple-modal-content-padding: var(--ddd-spacing-6, 24px);
          --simple-modal-content-container-background: var(
            --ddd-theme-default-white,
            white
          );
          --simple-modal-background: var(--ddd-theme-default-white, white);
          --simple-modal-box-shadow: var(--ddd-boxShadow-xl);
          --simple-modal-buttons-padding: 0;
          font-family: var(--ddd-font-primary, sans-serif);
        }

        :host([dangerous]) {
          --simple-modal-titlebar-background: var(
            --ddd-theme-default-original87Pink,
            #e4007c
          );
        }

        simple-modal {
          font-family: var(--ddd-font-primary, sans-serif) !important;
        }

        simple-modal::part(title) {
          font-family: var(--ddd-font-primary, sans-serif) !important;
          font-size: var(--ddd-font-size-m, 18px) !important;
          font-weight: var(--ddd-font-weight-bold, 700) !important;
        }

        .modal-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          min-height: var(--ddd-spacing-16, 120px);
        }

        .message {
          font-size: var(--ddd-font-size-s, 16px);
          color: var(--ddd-theme-default-coalyGray, #444);
          margin: 0 0 var(--ddd-spacing-6, 24px) 0;
          line-height: var(--ddd-lh-140, 1.4);
        }

        .button-group {
          display: flex;
          gap: var(--ddd-spacing-3, 12px);
          justify-content: center;
          width: 100%;
        }

        .button {
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-4, 16px);
          border-radius: var(--ddd-radius-sm, 4px);
          font-size: var(--ddd-font-size-xs, 14px);
          font-weight: var(--ddd-font-weight-medium, 500);
          font-family: var(--ddd-font-primary, sans-serif);
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2, 8px);
          min-width: var(--ddd-spacing-20, 80px);
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .button-confirm {
          background: var(--ddd-theme-default-nittanyNavy, #001e44) !important;
          color: var(--ddd-theme-default-white, white) !important;
        }

        .button-confirm:hover:not(:disabled) {
          background: var(
            --ddd-theme-default-keystoneYellow,
            #ffd100
          ) !important;
          color: var(--ddd-theme-default-nittanyNavy, #001e44) !important;
        }

        :host([dangerous]) .button-confirm {
          background: var(
            --ddd-theme-default-original87Pink,
            #e4007c
          ) !important;
        }

        :host([dangerous]) .button-confirm:hover:not(:disabled) {
          background: var(
            --ddd-theme-default-original87Pink-dark,
            #c4006c
          ) !important;
        }

        .button-cancel {
          background: transparent !important;
          border: var(--ddd-border-sm, 2px solid)
            var(--ddd-theme-default-nittanyNavy, #001e44) !important;
        }

        .button-cancel:hover:not(:disabled) {
          background: var(--ddd-theme-default-nittanyNavy, #001e44) !important;
        }

        @media (max-width: 600px) {
          .button-group {
            flex-direction: column;
            gap: var(--ddd-spacing-2, 8px);
          }

          .button {
            width: 100%;
            min-height: var(--ddd-spacing-10, 40px);
          }
        }
      `,
    ];
  }

  openModal() {
    // Prevent body scrolling while modal is open
    document.body.style.overflow = "hidden";
    // Reset confirmation state each time we open
    this._confirmed = false;

    this.open = true;
    const modal = this.shadowRoot.querySelector("simple-modal");
    if (modal) {
      modal.opened = true;
    }
  }

  closeModal() {
    // User explicitly clicked the cancel button.
    const modal = this.shadowRoot.querySelector("simple-modal");
    if (modal) {
      modal.opened = false;
    } else {
      // Fallback if for some reason modal is missing
      this.handleModalClosed();
    }
  }

  handleModalClosed(e) {
    // Restore body scrolling
    document.body.style.overflow = "";

    // simple-modal sends close event, we need to sync our state
    this.open = false;

    if (this._confirmed) {
      // Confirm path already handled confirmAction and success sound
      // in confirmModal; do not fire cancel logic.
    } else {
      // Treat any non-confirm close (cancel button, ESC, clicking backdrop)
      // as a cancel, with a single error sound.
      if (store.appEl && store.appEl.playSound) {
        store.appEl.playSound("error");
      }
      if (this.cancelAction && typeof this.cancelAction === "function") {
        this.cancelAction();
      }
    }
    // Dispatch close event for cleanup (listeners can do DOM cleanup)
    this.dispatchEvent(
      new CustomEvent("close", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  confirmModal() {
    // Mark as confirmed so handleModalClosed doesn't fire cancel logic
    this._confirmed = true;

    const modal = this.shadowRoot.querySelector("simple-modal");
    if (modal) {
      // This will trigger simple-modal-closed -> handleModalClosed
      modal.opened = false;
    } else {
      // Fallback if for some reason modal is missing
      document.body.style.overflow = "";
    }

    // Play a single success sound on confirm
    if (store.appEl && store.appEl.playSound) {
      store.appEl.playSound("success");
    }

    if (this.confirmAction && typeof this.confirmAction === "function") {
      this.confirmAction();
    }
    // Do NOT dispatch the "close" event here; handleModalClosed will
    // always fire when the underlying simple-modal actually closes.
  }

  render() {
    return html`
      <simple-modal
        .opened="${this.open}"
        title="${this.title}"
        @simple-modal-closed="${this.handleModalClosed}"
      >
        <div class="modal-content" slot="content">
          <p class="message">${this.message}</p>
        </div>
        <div class="button-group" slot="buttons">
          <button class="button button-cancel" @click="${this.closeModal}">
            ${this.cancelText}
          </button>
          <button class="button button-confirm" @click="${this.confirmModal}">
            ${this.confirmText}
          </button>
        </div>
      </simple-modal>
    `;
  }
}

customElements.define(AppHaxConfirmationModal.tag, AppHaxConfirmationModal);
