/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import { store } from "./AppHaxStore.js";

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
      enterUsername: "Enter username to grant access",
      usernamePlaceholder: "Username",
      addUser: "Add User",
      cancel: "Cancel",
      userAccessGranted: "User access granted successfully!",
      userNotFound: "User not found or unauthorized",
      loadingAddingUser: "Adding user...",
      grantAccessTo: "Grant access to:",
    };
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
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-primary);
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-6);
          min-width: 420px;
          max-width: 500px;
        }

        .modal-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-4);
        }

        .site-info {
          text-align: center;
          margin-bottom: var(--ddd-spacing-2);
        }

        .site-title {
          color: var(--ddd-theme-default-nittanyNavy);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-s);
          margin: var(--ddd-spacing-1) 0;
        }

        .character-container {
          display: flex;
          justify-content: center;
          margin: var(--ddd-spacing-2) 0;
          padding: var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-theme-default-limestoneLight);
        }

        .input-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }

        input {
          padding: var(--ddd-spacing-3);
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-xs);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-s);
          width: 100%;
          box-sizing: border-box;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        input:focus {
          outline: none;
          border-color: var(--ddd-theme-default-nittanyNavy);
          box-shadow: 0 0 0 2px var(--ddd-theme-default-potential30);
        }

        .buttons {
          display: flex;
          gap: var(--ddd-spacing-3);
          justify-content: center;
          width: 100%;
          margin-top: var(--ddd-spacing-3);
        }

        button {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-white, white);
          border: none;
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-medium);
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        button:hover:not(:disabled) {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          transform: translateY(-1px);
          box-shadow: var(--ddd-boxShadow-sm);
        }

        button:disabled {
          background: var(--ddd-theme-default-slateGray);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
          opacity: 0.6;
        }

        .cancel-button {
          background: transparent;
          color: var(--ddd-theme-default-nittanyNavy);
          border: var(--ddd-border-sm);
        }

        .cancel-button:hover:not(:disabled) {
          background: var(--ddd-theme-default-slateLight);
          color: var(--ddd-theme-default-nittanyNavy);
          transform: translateY(-1px);
        }

        .error {
          color: var(--ddd-theme-default-original87Pink);
          font-size: var(--ddd-font-size-xs);
          text-align: center;
          background-color: var(--ddd-theme-default-original87Pink10);
          padding: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          border: 1px solid var(--ddd-theme-default-original87Pink30);
        }

        .loading {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          justify-content: center;
        }

        .loading simple-icon {
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
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

        h3 {
          margin: 0;
          color: var(--ddd-theme-default-nittanyNavy);
          font-size: var(--ddd-font-size-l);
          text-align: center;
          font-weight: var(--ddd-font-weight-bold);
        }

        p {
          margin: 0;
          color: var(--ddd-theme-default-coalyGray);
          font-size: var(--ddd-font-size-s);
          text-align: center;
          line-height: 1.4;
        }

        .empty-character {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 120px;
          color: var(--ddd-theme-default-slateGray);
          font-size: var(--ddd-font-size-xs);
          text-align: center;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="modal-content">
        <h3>${this.t.userAccess}</h3>

        ${this.siteTitle
          ? html`
              <div class="site-info">
                <p>${this.t.grantAccessTo}</p>
                <div class="site-title">${this.siteTitle}</div>
              </div>
            `
          : ""}

        <p>${this.t.enterUsername}</p>

        <div class="character-container">
          ${this.username
            ? html`
                <rpg-character
                  seed="${this.username}"
                  height="120"
                  width="96"
                ></rpg-character>
              `
            : html`
                <div class="empty-character">
                  Character will appear when you enter a username
                </div>
              `}
        </div>

        <div class="input-container">
          <input
            type="text"
            placeholder="${this.t.usernamePlaceholder}"
            .value="${this.username}"
            @input="${this._handleUsernameInput}"
            ?disabled="${this.loading}"
            @keydown="${this._handleKeydown}"
            autocomplete="off"
          />

          ${this.error ? html`<div class="error">${this.error}</div>` : ""}
        </div>

        <div class="buttons">
          <button
            class="cancel-button"
            @click="${this._handleCancel}"
            ?disabled="${this.loading}"
          >
            ${this.t.cancel}
          </button>

          <button
            @click="${this._handleAddUser}"
            ?disabled="${this.loading || !this.username.trim()}"
          >
            ${this.loading
              ? html`
                  <div class="loading">
                    <simple-icon icon="hax:loading"></simple-icon>
                    <span>${this.t.loadingAddingUser}</span>
                  </div>
                `
              : this.t.addUser}
          </button>
        </div>
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

      if (response.ok) {
        // Play success sound
        if (store.appEl && store.appEl.playSound) {
          store.appEl.playSound("success");
        }
        // Success - show toast and close modal
        this._showSuccessToast();
        this._closeModal();
        // Reset form
        this.username = "";
      } else if (response.status === 403) {
        // User not found or unauthorized
        this.error = this.t.userNotFound;
      } else {
        // Other error
        this.error = `Error: ${response.status} ${response.statusText}`;
      }
    } catch (error) {
      console.error("Error adding user access:", error);
      this.error = "Network error occurred. Please try again.";
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle cancel button click
   */
  _handleCancel() {
    // Play error sound for cancel
    if (store.appEl && store.appEl.playSound) {
      store.appEl.playSound("error");
    }
    this._closeModal();
  }

  /**
   * Add user access via HAXiam API
   */
  async _addUserAccess(username) {
    // This calls the HAXiam API endpoint implemented via hooks system in HAXcms-php
    const endpoint = `${globalThis.location.origin}/api/haxiam/addUserAccess`;

    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${globalThis.jwt || store.jwt || ""}`,
      },
      body: JSON.stringify({
        username: username,
        siteId: store.activeSite?.id || null,
        sitePath: store.activeSite?.location || null,
      }),
    });
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
  firstUpdated() {
    super.firstUpdated();
    // Set site title from store if available
    if (store.activeSite?.title) {
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
  }
}

globalThis.customElements.define(
  AppHaxUserAccessModal.tag,
  AppHaxUserAccessModal,
);
export { AppHaxUserAccessModal };
