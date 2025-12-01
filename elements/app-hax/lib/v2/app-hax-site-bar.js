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
    };
  }

  toggleOptionsMenu() {
    const menu = this.shadowRoot.querySelector("simple-context-menu");
    const button = this.shadowRoot.querySelector("#settingsIcon");
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
    console.log("User Access clicked");
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
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          background-color: light-dark(
            white,
            var(--ddd-theme-default-coalyGray, #222)
          );
          border: var(--ddd-border-sm);
          border-color: light-dark(
            var(--ddd-theme-default-slateGray, #c4c4c4),
            var(--ddd-theme-default-slateGray, #666)
          );
          min-height: 260px;
          box-shadow: light-dark(
            2px 2px 12px #1c1c1c,
            2px 2px 12px rgba(0, 0, 0, 0.3)
          );
          border-radius: var(--ddd-radius-sm, 4px);
          transition: all 0.2s ease;
          overflow: visible;
        }
        :host(:hover),
        :host(:focus-within) {
          transform: translateY(-2px);
          border-color: light-dark(
            var(--ddd-theme-default-keystoneYellow, #ffd100),
            var(--ddd-theme-default-keystoneYellow, #ffd100)
          );
          box-shadow: light-dark(
            4px 8px 24px rgba(28, 28, 28, 0.15),
            4px 8px 24px rgba(0, 0, 0, 0.5)
          );
        }
        #mainCard {
          display: flex;
          flex-direction: column;
          overflow: visible;
        }
        .cardContent {
          padding: 12px 16px 20px;
          overflow: visible;
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
          overflow: visible;
        }
        simple-context-menu {
          --simple-context-menu-background: var(
            --simple-toolbar-button-bg,
            white
          );
          --simple-context-menu-background-dark: var(
            --simple-toolbar-button-bg,
            #000000
          );
          --simple-context-menu-border-color: var(
            --simple-toolbar-button-border-color,
            var(--simple-toolbar-border-color, #e0e0e0)
          );
          --simple-context-menu-border-color-dark: var(
            --simple-toolbar-button-border-color,
            var(--simple-toolbar-border-color, #444)
          );
          --simple-context-menu-shadow: var(
            --simple-toolbar-menu-list-box-shadow,
            0 2px 8px rgba(0, 0, 0, 0.15)
          );
          --simple-context-menu-min-width: 180px;
        }
        simple-toolbar-button {
          --simple-toolbar-button-border-radius: 0;
          --simple-toolbar-button-hover-border-color: transparent;
          cursor: pointer;
        }

        .titleBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: var(--ddd-font-size-xs, 14px);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          overflow: visible;
          position: relative;
        }
        p {
          font-size: var(--ddd-font-size-4xs, 12px);
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-2, 8px)
            var(--ddd-spacing-1, 6px) var(--ddd-spacing-2, 10px);
          margin: 0;
          line-height: 1.4;
        }
        ::slotted([slot="heading"]) {
          font-size: var(--ddd-font-size-xs, 14px);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          text-decoration: none;
          display: block;
          margin: 0;
          line-height: 1.2;
        }
        .site-slug {
          font-size: var(--ddd-font-size-4xs, 10px);
          color: light-dark(
            var(--ddd-theme-default-slateGray, #666),
            var(--ddd-theme-default-limestoneGray, #aaa)
          );
          font-family: var(--ddd-font-navigation, monospace);
          margin: var(--ddd-spacing-1, 4px) 0 0 0;
          display: block;
          line-height: 1;
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
          justify-content: start;
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
        ${this.image
          ? html`
              <div class="imageLink">
                <img
                  src="${this.image}"
                  alt="Screenshot of ${this.title || "site"} theme"
                  loading="lazy"
                />
              </div>
            `
          : ""}

        <div class="cardContent">
          <div class="titleBar">
            <div>
              <slot name="heading"></slot>
              ${this.slug
                ? html`<div class="site-slug">
                    ${this.getSiteMachineName()}
                  </div>`
                : ""}
            </div>
            <div class="settings-button">
              <simple-icon-button-lite
                id="settingsIcon"
                icon="hax:settings"
                @click="${this.toggleOptionsMenu}"
                aria-label="Open options"
                aria-haspopup="menu"
              ></simple-icon-button-lite>
              <simple-tooltip
                for="settingsIcon"
                position="left"
                animation-delay="0"
              >
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

          <slot name="pre"></slot>

          <div class="cardBottom">
            <a
              href="${this.siteUrl}"
              target="_blank"
              rel="noopener noreferrer"
              style="flex: 1; text-decoration: none;"
            >
              <button class="open" style="width: 100%;">Open</button>
            </a>
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
