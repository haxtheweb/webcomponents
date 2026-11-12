/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { HaxUiAdminStyles } from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import { loadAvatarCode } from "@haxtheweb/rpg-character/lib/rpg-character-avatar.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import { store } from "./AppHaxStore.js";
import { haxcmsApiMessage } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSApiMessages.js";

/**
 * `app-hax-user-access-modal`
 * `Modal for managing user access to HAXiam sites`
 *
 * @demo demo/index.html
 * @element app-hax-user-access-modal
 */
class AppHaxUserAccessModal extends I18NMixin(DDD) {
  /**
   * Convention we use
   */
  static get tag() {
    return "app-hax-user-access-modal";
  }

  constructor() {
    super();
    this.username = "";
    this.loading = false;
    this.error = "";
    this.siteTitle = "";
    this.t = {
      userAccess: "User Access",
      characterWillAppear: "Character will appear when you enter a username",
      enterUsername: "Enter username to grant access",
      usernamePlaceholder: "Username",
      addUser: "Add User",
      cancel: "Cancel",
      userAccessGranted: "User access granted successfully!",
      userNotFound: "User not found or unauthorized",
      loadingAddingUser: "Adding user...",
      grantAccessTo: "Grant access to:",
      networkErrorTryAgain: "Network error occurred. Please try again.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Username to add
       */
      username: {
        type: String,
      },
      /**
       * Loading state
       */
      loading: {
        type: Boolean,
      },
      /**
       * Error message
       */
      error: {
        type: String,
      },
      /**
       * Current site title
       */
      siteTitle: {
        type: String,
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminStyles,
      css`
        /* HAX UI admin layer: the site admin dialog's body, field and action
           bar, so it reads like the other admin dialogs in light and dark */
        :host {
          display: block;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          background-color: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          min-width: min(420px, 100%);
          max-width: 520px;
        }

        .modal-content {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-lg);
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px);
        }

        .site-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .site-info p {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }

        .site-title {
          font-weight: var(--ddd-font-weight-bold, 700);
          font-size: 15px;
          color: var(--hax-ui-text);
          overflow-wrap: anywhere;
        }

        .person {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-lg);
        }

        .character-container {
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 96px;
          height: 120px;
          border-radius: var(--hax-ui-radius-lg);
          border: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-sunken);
          overflow: hidden;
        }

        .empty-character {
          padding: var(--hax-ui-gap-md);
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
          text-align: center;
        }

        .input-container {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap);
        }

        .input-container label {
          font-weight: var(--ddd-font-weight-medium, 500);
        }

        .input-container .hax-ui-input {
          width: 100%;
          box-sizing: border-box;
        }

        .error {
          display: flex;
          gap: var(--hax-ui-gap-md);
          align-items: flex-start;
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-danger);
          background-color: var(--hax-ui-danger-soft);
          border: 1px solid var(--hax-ui-danger);
        }

        /* the action bar: Cancel, then the primary action, bottom right */
        .buttons {
          display: flex;
          gap: var(--hax-ui-gap-md);
          justify-content: flex-end;
          align-items: center;
          min-height: var(--hax-ui-action-bar-height);
          padding: 0 var(--ddd-spacing-5, 20px);
          border-top: 1px solid var(--hax-ui-line);
          box-sizing: border-box;
        }

        .loading {
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
        }

        .loading simple-icon {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading simple-icon {
            animation: none;
          }
        }

        @media (max-width: 480px) {
          .person {
            flex-direction: column;
            align-items: stretch;
          }
          .character-container {
            align-self: center;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="modal-content">
        ${
          this.siteTitle
            ? html`
                <div class="site-info">
                  <p>${this.t.grantAccessTo}</p>
                  <div class="site-title">${this.siteTitle}</div>
                </div>
              `
            : ""
        }

        <div class="person">
          <div class="character-container">
            ${
              this.username
                ? html`
                    <rpg-character
                      seed="${this.username}"
                      code="${loadAvatarCode(this.username)}"
                      height="120"
                      width="96"
                      aria-hidden="true"
                    ></rpg-character>
                  `
                : html`
                    <div class="empty-character">
                      ${this.t.characterWillAppear}
                    </div>
                  `
            }
          </div>

          <div class="input-container">
            <label for="username">${this.t.enterUsername}</label>
            <input
              id="username"
              class="hax-ui-input"
              type="text"
              placeholder="${this.t.usernamePlaceholder}"
              .value="${this.username}"
              @input="${this._handleUsernameInput}"
              ?disabled="${this.loading}"
              @keydown="${this._handleKeydown}"
              autocomplete="off"
              aria-invalid="${this.error ? "true" : "false"}"
              aria-describedby="username-error"
            />
          </div>
        </div>

        <div id="username-error" role="alert">
          ${this.error ? html`<div class="error">${this.error}</div>` : ""}
        </div>
      </div>

      <div class="buttons">
        <button
          type="button"
          class="hax-ui-btn ghost cancel-button"
          @click="${this._handleCancel}"
          ?disabled="${this.loading}"
        >
          ${this.t.cancel}
        </button>

        <button
          type="button"
          class="hax-ui-btn primary add-button"
          @click="${this._handleAddUser}"
          ?disabled="${this.loading || !this.username.trim()}"
        >
          ${
            this.loading
              ? html`
                  <span class="loading">
                    <simple-icon
                      icon="hax:loading"
                      aria-hidden="true"
                    ></simple-icon>
                    <span>${this.t.loadingAddingUser}</span>
                  </span>
                `
              : this.t.addUser
          }
        </button>
      </div>
    `;
  }

  /**
   * Handle username input changes
   */
  _handleUsernameInput(e) {
    this.username = e.target.value;
    // Clear error when user types
    if (this.error) {
      this.error = "";
    }
  }

  /**
   * Handle keydown events
   */
  _handleKeydown(e) {
    if (e.key === "Enter" && this.username.trim() && !this.loading) {
      this._handleAddUser();
    } else if (e.key === "Escape") {
      this._handleCancel();
    }
  }

  /**
   * Handle add user button click
   */
  async _handleAddUser() {
    if (!this.username.trim()) {
      return;
    }

    this.loading = true;
    this.error = "";

    try {
      const response = await this._addUserAccess(this.username.trim());
      if (response.status == "success") {
        // Play success sound
        if (store.appEl && store.appEl.playSound) {
          store.appEl.playSound("success");
        }
        // Success - show toast and close modal
        this._showSuccessToast();
        this._closeModal();
        // Reset form
        this.username = "";
      } else {
        // show why it failed (user not set up, already has access, not
        // your site, ...) in the user's language when a code is present
        this.error = haxcmsApiMessage(response, this.t.userNotFound);
      }
    } catch (error) {
      console.error("Error adding user access:", error);
      this.error = this.t.networkErrorTryAgain;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle cancel button click
   */
  _handleCancel() {
    // Removed sound effects for modal close/cancel as requested
    this._closeModal();
  }

  /**
   * Add user access via HAXiam API
   */
  async _addUserAccess(username) {
    // Get the site name from the store - this should be the directory name
    let siteName = null;
    if (store.activeSite && store.activeSite.name) {
      siteName = store.activeSite.name;
    } else if (
      store.activeSite &&
      store.activeSite.metadata &&
      store.activeSite.metadata.site &&
      store.activeSite.metadata.site.name
    ) {
      siteName = store.activeSite.metadata.site.name;
    }

    if (!siteName) {
      throw new Error("Unable to determine site name");
    }

    // Use the secure AppHaxAPI.makeCall method with proper token validation
    const response = await store.AppHaxAPI.makeCall("haxiamAddUserAccess", {
      userName: username,
      siteName: siteName,
    });

    // Convert to fetch-like response object for compatibility with existing error handling
    return response;
  }

  /**
   * Show success toast with RPG character matching the added user
   */
  _showSuccessToast() {
    // Use the existing toast system but with the character seed matching the added user
    store.toast(this.t.userAccessGranted, 4000, {
      hat: "construction",
      userName: this.username, // This ensures the toast character matches the user we just added
    });
  }

  /**
   * Close the modal
   */
  _closeModal() {
    // Restore body scrolling
    document.body.style.overflow = "";

    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
  }

  /**
   * Focus input when modal opens
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // Set site title from store if available
    if (store.activeSite && store.activeSite.title) {
      this.siteTitle = store.activeSite.title;
    }

    // Focus input after a brief delay
    setTimeout(() => {
      const input = this.shadowRoot.querySelector("input");
      if (input) {
        input.focus();
      }
    }, 100);
  }

  /**
   * Reset form when modal opens
   */
  connectedCallback() {
    super.connectedCallback();
    this.username = "";
    this.error = "";
    this.loading = false;

    // Prevent body scrolling when modal is connected/opened
    document.body.style.overflow = "hidden";
  }
}

globalThis.customElements.define(
  AppHaxUserAccessModal.tag,
  AppHaxUserAccessModal,
);
export { AppHaxUserAccessModal };
