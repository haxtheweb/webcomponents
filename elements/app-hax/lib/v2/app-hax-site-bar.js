/* eslint-disable no-console */
// dependencies / things imported
import { html, css, unsafeCSS } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { toJS } from "mobx";
import { store } from "./AppHaxStore.js";
import "./app-hax-user-access-modal.js";
import "./app-hax-confirmation-modal.js";

const DropDownBorder = new URL(
  "../assets/images/DropDownBorder.svg",
  import.meta.url,
);
// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class AppHaxSiteBars extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-site-bar";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.showOptions = false;
    this.inprogress = false;
    this.textInfo = {};
    this.siteId = "";
    this.description = "";
    this._boundKeydownHandler = this._handleMenuKeydown.bind(this);
  }

  // Clean up event listeners when component is removed
  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._boundKeydownHandler);
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      showOptions: { type: Boolean },
      inprogress: { type: Boolean, reflect: true },
      textInfo: { type: Object },
      siteId: { type: String, reflect: true, attribute: "site-id" },
      title: { type: String },
      description: { type: String },
      siteUrl: { type: String, attribute: "site-url" },
    };
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  updated(changedProperties) {
    if (changedProperties.has('showOptions')) {
      if (this.showOptions) {
        // Menu opened - add keyboard listener and focus first menu item
        document.addEventListener('keydown', this._boundKeydownHandler);
        this._focusFirstMenuItem();
      } else {
        // Menu closed - remove keyboard listener
        document.removeEventListener('keydown', this._boundKeydownHandler);
      }
    }
  }

  toggleOptionsMenu() {
    const wasOpen = this.showOptions;
    this.showOptions = !this.showOptions;
    
    // If we're closing the menu, return focus to the settings button
    if (wasOpen && !this.showOptions) {
      this._returnFocusToSettingsButton();
    }
  }

  closeOptionsMenu() {
    this.showOptions = false;
    this._returnFocusToSettingsButton();
  }

  handleKeydown(e, callback) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback.call(this);
    }
  }

  // Accessibility helper methods
  _focusFirstMenuItem() {
    // Use setTimeout to ensure the DOM has updated
    setTimeout(() => {
      // Focus the close button first as it appears first in the DOM
      const closeButton = this.shadowRoot.querySelector('.close-menu-btn');
      if (closeButton) {
        closeButton.focus();
      } else {
        // Fallback to first menu item if close button not found
        const firstMenuItem = this.shadowRoot.querySelector('.menu-item');
        if (firstMenuItem) {
          firstMenuItem.focus();
        }
      }
    }, 0);
  }

  _returnFocusToSettingsButton() {
    setTimeout(() => {
      const settingsButton = this.shadowRoot.querySelector('#settingsIcon');
      if (settingsButton) {
        settingsButton.focus();
      }
    }, 0);
  }

  _handleMenuKeydown(e) {
    if (!this.showOptions) return;

    // Get all focusable elements in the menu in DOM order
    const menuItems = Array.from(this.shadowRoot.querySelectorAll('.close-menu-btn, .menu-item'));

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.closeOptionsMenu();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        // Only handle arrow keys if focus is within our menu
        const arrowCurrentIndex = menuItems.indexOf(e.target);
        if (arrowCurrentIndex !== -1) {
          e.preventDefault();
          if (e.key === 'ArrowDown') {
            const nextIndex = arrowCurrentIndex < menuItems.length - 1 ? arrowCurrentIndex + 1 : 0;
            menuItems[nextIndex].focus();
          } else {
            const prevIndex = arrowCurrentIndex > 0 ? arrowCurrentIndex - 1 : menuItems.length - 1;
            menuItems[prevIndex].focus();
          }
        }
        break;
      case 'Tab':
        e.preventDefault();
        // Find which menu item is currently focused
        let currentFocusedIndex = -1;
        for (let i = 0; i < menuItems.length; i++) {
          if (menuItems[i] === document.activeElement || 
              menuItems[i] === this.shadowRoot.activeElement) {
            currentFocusedIndex = i;
            break;
          }
        }
        
        // If no menu item is focused, start with the first one
        if (currentFocusedIndex === -1) {
          menuItems[0].focus();
          break;
        }
        
        // Trap focus within the menu - tab forward or backward through all items
        if (e.shiftKey) {
          // Shift+Tab - go to previous item, or wrap to last
          const prevTabIndex = currentFocusedIndex > 0 ? currentFocusedIndex - 1 : menuItems.length - 1;
          menuItems[prevTabIndex].focus();
        } else {
          // Tab - go to next item, or wrap to first
          const nextTabIndex = currentFocusedIndex < menuItems.length - 1 ? currentFocusedIndex + 1 : 0;
          menuItems[nextTabIndex].focus();
        }
        break;
    }
  }
  copySite() {
    this.showOptions = false;
    this.siteOperation("copySite", "Copy", "icons:content-copy");
  }

  downloadSite() {
    this.showOptions = false;
    this.siteOperation("downloadSite", "Download", "file-download");
  }

  archiveSite() {
    this.showOptions = false;
    this.siteOperation("archiveSite", "Archive", "icons:archive");
  }

  openUserAccess() {
    console.log("User Access clicked");
    // Close the options menu first
    this.showOptions = false;

    // Import simple-modal and then show the user access modal
    import("@haxtheweb/simple-modal/simple-modal.js").then(() => {
      // Create and show the user access modal
      const modal = document.createElement("app-hax-user-access-modal");

      // Set the site title for context
      if (this.title) {
        modal.siteTitle = this.title;
      }

      // Show the modal using the simple-modal system
      const evt = new CustomEvent("simple-modal-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          title: "User Access",
          elements: { content: modal },
          invokedBy: this,
          styles: {
            "--simple-modal-titlebar-background":
              "var(--ddd-theme-default-nittanyNavy, #001e44)",
            "--simple-modal-titlebar-color":
              "var(--ddd-theme-default-white, white)",
            "--simple-modal-width": "90vw",
            "--simple-modal-max-width": "var(--ddd-spacing-32, 480px)",
            "--simple-modal-min-width": "300px",
            "--simple-modal-z-index": "1000",
            "--simple-modal-height": "auto",
            "--simple-modal-min-height": "300px",
            "--simple-modal-max-height": "80vh",
            "--simple-modal-titlebar-height": "64px",
            "--simple-modal-border-radius": "var(--ddd-radius-md, 8px)",
            "--simple-modal-background":
              "var(--ddd-theme-default-white, white)",
            "--simple-modal-box-shadow": "var(--ddd-boxShadow-xl)",
          },
        },
      });

      this.dispatchEvent(evt);
    });
  }

  // Site operation handler using new confirmation modal
  siteOperation(op, opName, icon) {
    if (store.appEl && store.appEl.playSound) {
      store.appEl.playSound("click");
    }

    store.activeSiteOp = op;
    store.activeSiteId = this.siteId;

    // Find the site data from the store
    const site = toJS(
      store.manifest.items.filter((item) => item.id === this.siteId).pop(),
    );

    if (!site) {
      console.error("Site not found for ID:", this.siteId);
      return;
    }

    // Create and configure the confirmation modal
    const modal = document.createElement("app-hax-confirmation-modal");
    modal.title = `${opName} ${site.metadata.site.name}?`;
    modal.message = `Are you sure you want to ${op.replace("Site", "")} ${site.metadata.site.name}?`;
    modal.confirmText = "Confirm";
    modal.cancelText = "Cancel";

    // Mark archive operations as dangerous for red styling
    modal.dangerous = op === "archiveSite";

    modal.confirmAction = this.confirmOperation.bind(this);
    modal.cancelAction = this.cancelOperation.bind(this);

    // Add modal to document and show it
    document.body.appendChild(modal);
    modal.openModal();

    // Clean up modal when it closes
    modal.addEventListener(
      "close",
      () => {
        document.body.removeChild(modal);
      },
      { once: true },
    );
  }

  cancelOperation() {
    store.activeSiteOp = "";
    store.activeSiteId = null;
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
      }),
    );
    if (store.appEl && store.appEl.playSound) {
      store.appEl.playSound("error");
    }
  }

  async confirmOperation() {
    const op = toJS(store.activeSiteOp);
    const site = toJS(store.activeSite);

    if (!site) {
      console.error("No active site found for operation:", op);
      return;
    }

    // Make the API call to perform the operation
    await store.AppHaxAPI.makeCall(
      op,
      {
        site: {
          name: site.metadata.site.name,
          id: site.id,
        },
      },
      true,
      () => {
        const activeOp = toJS(store.activeSiteOp);
        // Download is special - it opens a download link
        if (activeOp === "downloadSite") {
          globalThis.open(
            store.AppHaxAPI.lastResponse.downloadSite.data.link,
            "_blank",
          );
        } else {
          // For copy and archive, refresh the site listing
          store.refreshSiteListing();
        }
      },
    );

    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
      }),
    );

    if (store.appEl && store.appEl.playSound) {
      store.appEl.playSound("success");
    }

    store.toast(
      `${site.metadata.site.name} ${op.replace("Site", "")} successful!`,
      3000,
      {
        hat: "random",
      },
    );
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          text-align: left;
          width: 264px;
          max-width: 264px;
          font-family: var(--ddd-font-primary);
          color: var(--ddd-theme-default-nittanyNavy);
          background-color: white;
          min-height: 260px;
          box-shadow: 2px 2px 12px #1c1c1c;
          border-radius: 4px;
        }
        #mainCard {
          display: flex;
          flex-direction: column;
        }
        .cardContent {
          padding: 12px 16px 20px;
        }
        .imageLink img {
          width: 100%;
          height: 125px;
          object-fit: cover;
          border-top-right-radius: 8px;
          border-top-left-radius: 8px;
          border-bottom: solid var(--ddd-theme-default-nittanyNavy) 8px;
          overflow: clip;
          justify-self: center;
        }
        .imageLink {
          position: relative;
          display: block;
          width: 100%;
        }
        .settings-button {
          position: relative;
          display: inline-block;
          align-self: center;
        }

        .options-menu {
          position: absolute;
          top: -125px;
          right: 0;
          background: var(--ddd-theme-default-white, white);
          border: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-slateGray, #666);
          box-shadow: var(--ddd-boxShadow-lg);
          border-radius: var(--ddd-radius-md, 8px);
          padding: var(--ddd-spacing-2, 8px);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1, 4px);
          z-index: 1000;
          overflow: visible;
          min-width: 140px;
        }
        :host([dark]) .options-menu,
        body.dark-mode .options-menu {
          background: var(--ddd-theme-default-coalyGray, #333);
          color: var(--ddd-theme-default-white, white);
          border-color: var(--ddd-theme-default-slateGray, #666);
        }
        .close-menu-btn {
          position: absolute;
          top: var(--ddd-spacing-1, 4px);
          right: var(--ddd-spacing-1, 4px);
          background: transparent;
          border: none;
          color: var(--ddd-theme-default-slateGray, #666);
          cursor: pointer;
          font-size: var(--ddd-font-size-s, 16px);
          font-weight: var(--ddd-font-weight-bold, 700);
          padding: var(--ddd-spacing-1, 4px);
          border-radius: var(--ddd-radius-xs, 2px);
          line-height: 1;
          min-height: auto;
          box-shadow: none;
          width: var(--ddd-spacing-5, 20px);
          height: var(--ddd-spacing-5, 20px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        :host([dark]) .close-menu-btn,
        body.dark-mode .close-menu-btn {
          color: var(--ddd-theme-default-white, white);
        }
        .close-menu-btn:hover,
        .close-menu-btn:focus {
          background: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
          transform: none;
          box-shadow: none;
          outline: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
        }
        :host([dark]) .close-menu-btn:hover,
        :host([dark]) .close-menu-btn:focus,
        body.dark-mode .close-menu-btn:hover,
        body.dark-mode .close-menu-btn:focus {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          outline-color: var(--ddd-theme-default-white, white);
        }
        .menu-item {
          display: flex;
          align-items: center;
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          border-radius: var(--ddd-radius-xs, 2px);
          cursor: pointer;
          font-size: var(--ddd-font-size-3xs, 11px);
          font-family: var(--ddd-font-primary, sans-serif);
          transition: all 0.2s ease;
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          text-decoration: none;
          min-height: var(--ddd-spacing-5, 20px);
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
          gap: var(--ddd-spacing-1, 4px);
        }
        :host([dark]) .menu-item,
        body.dark-mode .menu-item {
          color: var(--ddd-theme-default-white, white);
        }
        .menu-item:hover,
        .menu-item:focus {
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          outline: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
        }
        :host([dark]) .menu-item:hover,
        :host([dark]) .menu-item:focus,
        body.dark-mode .menu-item:hover,
        body.dark-mode .menu-item:focus {
          background: var(--ddd-theme-default-slateGray, #555);
          color: var(--ddd-theme-default-white, white);
        }
        .menu-item simple-icon-lite {
          flex-shrink: 0;
          width: var(--ddd-icon-3xs, 16px);
          height: var(--ddd-icon-3xs, 16px);
        }

        .titleBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: var(--ddd-font-size-xs, 14px);
          color: var(--ddd-theme-default-nittanyNavy);
        }
        p {
          font-size: var(--ddd-font-size-4xs, 12px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-2, 8px) var(--ddd-spacing-1, 6px) var(--ddd-spacing-2, 10px);
          margin: 0;
          line-height: 1.4;
        }
        ::slotted([slot="heading"]) {
          font-size: var(--ddd-font-size-xs, 14px);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--ddd-theme-default-nittanyNavy);
          text-decoration: none;
          display: block;
          margin: 0;
          line-height: 1.2;
        }
        button {
          display: flex;
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-white, white);
          border: var(--ddd-border-xs, 1px solid) transparent;
          border-radius: var(--ddd-radius-sm, 4px);
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-3xs, 11px);
          font-weight: var(--ddd-font-weight-medium, 500);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          min-height: var(--ddd-spacing-7, 28px);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: var(--ddd-boxShadow-sm);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        button:hover {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          transform: translateY(-1px);
          box-shadow: var(--ddd-boxShadow-md);
        }
        .cardBottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;
          padding: 0px 12px 16px 12px;
          gap: 4px;
        }
        .cardBottom button {
          flex: 1;
          margin: 0 2px;
          min-width: 0;
        }
        ::slotted(a[slot="heading"]),
        ::slotted(span[slot="subHeading"]),
        ::slotted(div[slot="pre"]) {
          display: block;
        }
      `,
    ];
  }

  __clickButton() {
    this.opened = !this.opened;
  }

  // HTML - specific to Lit
  render() {
    return html`
      <div id="mainCard">
        <div class="imageLink">
          <img
            src="https://image.freepik.com/free-vector/programming-website-landing-page_23-2148452312.jpg"
          />
        </div>

        <div class="cardContent">
          <div class="titleBar">
            <slot name="heading"></slot>
            <div class="settings-button">
              <simple-tooltip
                for="settingsIcon"
                position="top"
                animation-delay="0"
              >
                Options
              </simple-tooltip>
              <simple-icon-button-lite
                id="settingsIcon"
                icon="hax:settings"
                @click="${this.toggleOptionsMenu}"
                aria-label="Open options"
                aria-expanded="${this.showOptions}"
                aria-haspopup="menu"
              ></simple-icon-button-lite>

              ${this.showOptions
                ? html`
                    <div
                      id="options-menu-${this.siteId}"
                      class="options-menu"
                      role="menu"
                      aria-labelledby="settingsIcon"
                    >
                      <button
                        class="close-menu-btn"
                        @click="${this.toggleOptionsMenu}"
                        aria-label="Close menu"
                      >
                        ×
                      </button>
                      <button
                        class="menu-item"
                        @click="${this.copySite}"
                        role="menuitem"
                        aria-label="Copy site"
                      >
                        <simple-icon-lite icon="content-copy"></simple-icon-lite>
                        Copy
                      </button>
                      <button
                        class="menu-item"
                        @click="${this.downloadSite}"
                        role="menuitem"
                        aria-label="Download site"
                      >
                        <simple-icon-lite icon="file-download"></simple-icon-lite>
                        Download
                      </button>
                      <button
                        class="menu-item"
                        @click="${this.archiveSite}"
                        role="menuitem"
                        aria-label="Archive site"
                      >
                        <simple-icon-lite icon="archive"></simple-icon-lite>
                        Archive
                      </button>
                      <button
                        class="menu-item"
                        @click="${this.openUserAccess}"
                        role="menuitem"
                        aria-label="Manage user access"
                      >
                        <simple-icon-lite icon="account-circle"></simple-icon-lite>
                        User Access
                      </button>
                    </div>
                  `
                : ""}
            </div>
          </div>

          <slot name="pre"></slot>

          <div class="cardBottom">
            <button
              class="open"
              @click=${() => window.open(this.siteUrl, "_blank")}
            >
              Open
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // HAX specific callback
  // This teaches HAX how to edit and work with your web component
  /**
   * haxProperties integration via file reference
   */
}
customElements.define(AppHaxSiteBars.tag, AppHaxSiteBars);
