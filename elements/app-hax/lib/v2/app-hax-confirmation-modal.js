/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { HaxUiAdminStyles } from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { HaxUiAdminIcons } from "@haxtheweb/d-d-d/lib/HaxUiAdminIcons.js";
import { store } from "./AppHaxStore.js";

export class AppHaxConfirmationModal extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "app-hax-confirmation-modal";
  }

  focusCancelButton() {
    const cancelButton =
      this.shadowRoot && this.shadowRoot.querySelector(".button-cancel");
    if (cancelButton && typeof cancelButton.focus === "function") {
      cancelButton.focus();
    }
  }
  /**
   * Public alias so simple-modal can delegate initial focus consistently.
   */
  focusInitial() {
    this.focusCancelButton();
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      confirm: "Confirm",
      cancel: "Cancel",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.open = false;
    this.title = "";
    this.message = "";
    this.i18nDefault("confirmText", "confirm");
    this.i18nDefault("cancelText", "cancel");
    this.confirmAction = null;
    this.cancelAction = null;
    this.dangerous = false; // For destructive actions like delete/archive
    this.cancelIsNeutral = false;
    this.cancelActionOnPassiveClose = true;
    // Track whether this modal was confirmed so we don't fire cancel logic
    // (and associated sounds) on confirm.
    this._confirmed = false;
    this._cancelClicked = false;
    this._closedHandled = false;
  }

  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      title: { type: String },
      message: { type: String },
      confirmText: { type: String },
      cancelText: { type: String },
      dangerous: { type: Boolean },
      cancelIsNeutral: { type: Boolean },
      cancelActionOnPassiveClose: {
        type: Boolean,
        attribute: "cancel-action-on-passive-close",
      },
    };
  }

  static get styles() {
    return [
      ...HaxUiAdminStyles,
      css`
        /* the HAX UI confirm card (same as haxcms-admin-confirm and the site
           admin leave prompt): a native modal dialog, title, short message,
           safe choice first and focused, primary or danger action last */
        :host {
          display: contents;
        }
        dialog {
          width: min(460px, calc(100vw - 32px));
          max-height: calc(100dvh - 32px);
          box-sizing: border-box;
          margin: auto;
          padding: var(--ddd-spacing-4, 16px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          background-color: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          box-shadow: var(--hax-ui-shadow-popover);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
        }
        dialog::backdrop {
          background-color: rgba(0, 3, 33, 0.32);
        }
        h3 {
          margin: 0;
          font-size: 15px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.3;
          overflow-wrap: anywhere;
        }
        .message {
          margin: var(--hax-ui-gap) 0 0;
          font-size: 13px;
          line-height: 1.4;
          color: var(--hax-ui-text-muted);
          overflow-wrap: anywhere;
        }
        .button-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: var(--hax-ui-gap-md);
          margin-top: var(--hax-ui-gap-lg);
        }
      `,
    ];
  }

  _dialog() {
    return this.shadowRoot ? this.shadowRoot.querySelector("dialog") : null;
  }

  openModal() {
    // Prevent body scrolling while modal is open
    document.body.style.overflow = "hidden";
    // Reset confirmation state each time we open
    this._confirmed = false;
    this._cancelClicked = false;
    this._closedHandled = false;
    this.open = true;
    const show = () => {
      const dialog = this._dialog();
      if (dialog && !dialog.open && typeof dialog.showModal === "function") {
        dialog.showModal();
        this.focusCancelButton();
      }
    };
    if (this._dialog()) {
      show();
    } else if (this.updateComplete) {
      // created and opened in one go: wait for the first render
      this.updateComplete.then(show);
    }
  }

  closeModal() {
    // User explicitly clicked the cancel button.
    this._cancelClicked = true;
    const dialog = this._dialog();
    if (dialog && dialog.open) {
      // fires close -> handleModalClosed
      dialog.close();
    } else {
      this.handleModalClosed();
    }
  }

  handleModalClosed(_e) {
    if (this._closedHandled) {
      return;
    }
    this._closedHandled = true;
    // Restore body scrolling
    document.body.style.overflow = "";
    this.open = false;

    if (this._confirmed) {
      // Confirm path already handled confirmAction and success sound
      // in confirmModal; do not fire cancel logic.
    } else {
      const runCancelAction =
        this._cancelClicked || this.cancelActionOnPassiveClose;
      if (
        runCancelAction &&
        this.cancelAction &&
        typeof this.cancelAction === "function"
      ) {
        this.cancelAction();
      }
      if (
        runCancelAction &&
        !this.cancelIsNeutral &&
        store.appEl &&
        store.appEl.playSound
      ) {
        store.appEl.playSound("error");
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
    const dialog = this._dialog();
    if (dialog && dialog.open) {
      // fires close -> handleModalClosed
      dialog.close();
    } else {
      document.body.style.overflow = "";
    }
    // Play a single success sound on confirm
    if (store.appEl && store.appEl.playSound) {
      store.appEl.playSound("success");
    }
    if (this.confirmAction && typeof this.confirmAction === "function") {
      this.confirmAction();
    }
  }

  _onDialogClose(e) {
    // the native dialog's close event is not composed; ours is
    if (e) {
      e.stopPropagation();
    }
    this.handleModalClosed(e);
  }

  render() {
    return html`
      <dialog
        role="alertdialog"
        aria-labelledby="title"
        aria-describedby="message"
        @close="${this._onDialogClose}"
      >
        <h3 id="title">${this.title}</h3>
        <p id="message" class="message">${this.message}</p>
        <div class="button-group">
          <button
            type="button"
            class="hax-ui-btn ghost button-cancel"
            @click="${this.closeModal}"
          >
            <simple-icon-lite
              icon="${HaxUiAdminIcons.close}"
              aria-hidden="true"
            ></simple-icon-lite>
            ${this.cancelText}
          </button>
          <button
            type="button"
            class="hax-ui-btn ${
              this.dangerous ? "danger-fill" : "primary"
            } button-confirm"
            @click="${this.confirmModal}"
          >
            <simple-icon-lite
              icon="${
                this.dangerous ? HaxUiAdminIcons.delete : HaxUiAdminIcons.check
              }"
              aria-hidden="true"
            ></simple-icon-lite>
            ${this.confirmText}
          </button>
        </div>
      </dialog>
    `;
  }
}

customElements.define(AppHaxConfirmationModal.tag, AppHaxConfirmationModal);
