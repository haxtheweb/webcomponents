/* eslint-disable no-console */
// dependencies / things imported
import { html, css, unsafeCSS } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-fields/lib/simple-context-menu.js";
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
    this.lastUpdatedTime = 0;
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
      slug: { type: String },
      description: { type: String },
      siteUrl: { type: String, attribute: "site-url" },
      image: { type: String },
      lastUpdatedTime: { type: Number, attribute: "last-updated-time"}
    };
  }

  toggleOptionsMenu() {
    const menu = this.shadowRoot.querySelector("simple-context-menu");
    const button = this.shadowRoot.querySelector("#moreOptions");
    if (menu && button) {
      menu.toggle(button);
    }
  }

  closeOptionsMenu() {
    const menu = this.shadowRoot.querySelector("simple-context-menu");
    if (menu) {
      menu.close();
    }
  }

  handleKeydown(e, callback) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback.call(this);
    }
  }

  // Extract site machine name from full path
  getSiteMachineName() {
    if (!this.slug) return "";
    // Extract just the last part of the path (machine name)
    const parts = this.slug.split("/").filter((part) => part.length > 0);
    return parts.length > 0 ? parts[parts.length - 1] : this.slug;
  }
  copySite() {
    this.closeOptionsMenu();
    this.siteOperation("copySite", "Copy", "icons:content-copy");
  }

  downloadSite() {
    this.closeOptionsMenu();
    this.siteOperation("downloadSite", "Download", "file-download");
  }

  archiveSite() {
    this.closeOptionsMenu();
    this.siteOperation("archiveSite", "Archive", "icons:archive");
  }

  openUserAccess() {
    // Close the options menu first
    this.closeOptionsMenu();

    // Set the active site ID so the modal can access store.activeSite
    store.activeSiteId = this.siteId;

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
            "--simple-modal-titlebar-color": "light-dark(black, white)",
            "--simple-modal-width": "90vw",
            "--simple-modal-max-width": "var(--ddd-spacing-32, 480px)",
            "--simple-modal-min-width": "300px",
            "--simple-modal-z-index": "1000",
            "--simple-modal-height": "auto",
            "--simple-modal-min-height": "300px",
            "--simple-modal-max-height": "80vh",
            "--simple-modal-titlebar-height": "80px",
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
    // Error sound for cancel is now handled centrally in
    // app-hax-confirmation-modal to avoid duplicate sounds.
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
          const response = store.AppHaxAPI.lastResponse.downloadSite;
          if (response && response.data && response.data.link) {
            const link = response.data.link;
            const name = response.data.name || "";
            // Use an anchor element so this is treated as a real navigation
            // and not blocked as a popup by the browser.
            const a = globalThis.document.createElement("a");
            a.href = link;
            if (name) {
              a.setAttribute("download", name);
            }
            a.style.display = "none";
            globalThis.document.body.appendChild(a);
            a.click();
            globalThis.document.body.removeChild(a);
          } else {
            console.error(
              "downloadSite response missing data.link:",
              response,
            );
          }
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

    // Success sound for confirm is now handled centrally in
    // app-hax-confirmation-modal to avoid duplicate sounds.

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
          width: 180px;
          max-width: 180px;
          font-family: var(--ddd-font-primary);
          background-color: light-dark(
            white,
            var(--ddd-theme-default-roarMaxlight)
          );
          border: var(--ddd-border-sm);
          min-height: 260px;
          box-shadow: light-dark(
            2px 2px 12px #1c1c1c,
            2px 2px 12px rgba(0, 0, 0, 0.3)
          );
          transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
          overflow: visible;
          
        }

        :host(:hover),
        :host(:focus),
        :host(:focus-within) {
          border: var(--ddd-border-md);
          border-color:var(--ddd-theme-default-beaverBlue, #0078d4);
          box-shadow: light-dark(
            4px 8px 24px rgba(28, 28, 28, 0.15),
            4px 8px 24px rgba(0, 0, 0, 0.5)
          );
          transform: scale(1.03);
          transform-origin: center top;
          z-index: 2;
        }

        #mainCard {
          display: flex;
          flex-direction: column;
        }

        .cardContent {
          padding: var(--ddd-spacing-2);
        }

        .cardImage {
          width: 100%;
          object-fit: cover;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-bottom: 1px solid var(--ddd-theme-default-limestoneGray);
          background-color: var(--ddd-theme-default-skyLight);
        }

        .titleBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: visible;
          margin-bottom: 8px;
        }

        .more-options {
          display: flex;
          align-items: center;
        }

        .more-options simple-icon-button-lite {
          --simple-icon-color: var(--ddd-theme-default-nittanyNavy);
        }

        .more-options simple-icon-button-lite:hover,
        .more-options simple-icon-button-lite:focus,
        .more-options simple-icon-button-lite::part(button):hover,
        .more-options simple-icon-button-lite::part(button):focus {
          color: var(--ddd-theme-default-accent);
          --simple-icon-color: var(--ddd-theme-default-accent);
        }

        ::slotted([slot="heading"]) {
          font-size: 20px;
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--ddd-theme-default-nittanyNavy);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
        }

        ::slotted(a[slot="heading"]) {
            text-decoration: none;
        }

        .date {
          display: flex;
          gap: var(--ddd-spacing-1, 4px);
          margin-top: var(--ddd-spacing-2, 8px);
          font-size: 16px;
          color: var(--ddd-theme-default-limestoneGray);
          font-weight: var(--ddd-font-weight-bold, 500);
          align-items: center;
          line-height: 1;
        }

        .date simple-icon {
          --simple-icon-color: var(--ddd-theme-default-limestoneGray);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .imageLink {
          display: block;
          overflow: hidden;
          height: 180px;
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
        <div class="cardImage">
        ${this.image
          ? html`
              <a
                class="imageLink"
                href="${this.siteUrl}"
                target="_blank"
                rel="noopener noreferrer"
                tabindex="-1"
                aria-label="Open ${this.title || "site"}"
              >
                <img
                  src="${this.image}"
                  alt="Screenshot of ${this.title || "site"} theme"
                  loading="lazy"
                />
              </a>
            `
          : ""}

        </div>
        <div class="cardContent">
          <div class="titleBar">
            <slot name="heading"></slot>

            <div class="more-options">
              <simple-icon-button-lite
                id="moreOptions"
                icon="lrn:more-vert"
                @click="${this.toggleOptionsMenu}"
                aria-label="Open options"
                aria-haspopup="menu"
              ></simple-icon-button-lite>

              <simple-tooltip for="moreOptions" position="left">
                Options
              </simple-tooltip>

              <simple-context-menu title="Options">
                <simple-toolbar-button
                  icon="content-copy"
                  icon-position="left"
                  align-horizontal="left"
                  show-text-label
                  label="Copy"
                  @click=${this.copySite}
                ></simple-toolbar-button>
                <simple-toolbar-button
                  icon="file-download"
                  icon-position="left"
                  align-horizontal="left"
                  show-text-label
                  label="Download"
                  @click=${this.downloadSite}
                ></simple-toolbar-button>
                <simple-toolbar-button
                  icon="archive"
                  icon-position="left"
                  align-horizontal="left"
                  show-text-label
                  label="Archive"
                  @click=${this.archiveSite}
                ></simple-toolbar-button>
                ${store.appSettings && store.appSettings.haxiamAddUserAccess
                  ? html`
                      <simple-toolbar-button
                        icon="account-circle"
                        icon-position="left"
                        align-horizontal="left"
                        show-text-label
                        label="User Access"
                        @click=${this.openUserAccess}
                      ></simple-toolbar-button>
                    `
                  : ""}
              </simple-context-menu>
            </div>
          </div>

          <div class="date">
            <simple-icon icon="hax:calendar"></simple-icon>
            <simple-datetime
                format="m/j/y"
                .timestamp="${this.lastUpdatedTime}"
                unix
            ></simple-datetime>
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