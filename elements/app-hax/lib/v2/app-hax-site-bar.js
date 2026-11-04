// dependencies / things imported
import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { HaxUiAdminTokens } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-fields/lib/simple-context-menu.js";
import { toJS } from "mobx";
import { store } from "./AppHaxStore.js";
import "./app-hax-user-access-modal.js";
import "./app-hax-confirmation-modal.js";
import { haxcmsApiMessage } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSApiMessages.js";

let appHaxSiteBarInstanceCount = 0;
// EXPORT (so make available to other documents that reference this file) a class, that extends LitElement
// which has the magic life-cycles and developer experience below added
export class AppHaxSiteBars extends I18NMixin(SimpleColors) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-site-bar";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      copy: "Copy",
      download: "Download",
      archive: "Archive",
      copyOperation: "copy",
      downloadOperation: "download",
      archiveOperation: "archive",
      createTemplate: "Create Template",
      userAccess: "User Access",
      options: "Options",
      openOptions: "Open options",
      lastUpdated: "Last updated",
      site: "site",
      openSite: "Open {title}",
      siteThemeScreenshot: "Screenshot of {title} theme",
      confirm: "Confirm",
      cancel: "Cancel",
      siteOperationConfirmTitle: "{operationName} {siteName}?",
      siteOperationConfirmMessage:
        "Are you sure you want to {operation} {siteName}?",
      siteOperationSuccessful: "{siteName} {operation} successful!",
      siteOperationFailed: "{siteName} {operation} failed",
      createTemplateFrom: "Create template from {siteName}?",
      createTemplateMessage:
        "Choose how to turn this site into a reusable template: download the skeleton file or save it to your templates.",
      saveToTemplates: "Save to templates",
      downloadSkeleton: "Download skeleton",
      downloadSkeletonNotConfigured:
        "Download skeleton endpoint is not configured.",
      skeletonDownloaded: "{siteName} skeleton downloaded!",
      unableToDownloadSkeleton: "Unable to download site skeleton.",
      saveTemplateNotConfigured: "Save template endpoint is not configured.",
      savedToTemplates: "{siteName} saved to templates!",
      unableToSaveTemplate: "Unable to save site as template.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.showOptions = false;
    this.inprogress = false;
    this.textInfo = {};
    this.siteId = "";
    this.description = "";
    this.lastUpdatedTime = 0;
    this.moreOptionsId = `moreOptions-${appHaxSiteBarInstanceCount}`;
    appHaxSiteBarInstanceCount += 1;
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
      lastUpdatedTime: { type: Number, attribute: "last-updated-time" },
      moreOptionsId: { type: String },
    };
  }

  toggleOptionsMenu() {
    const menu = this.shadowRoot.querySelector("simple-context-menu");
    const button = this.shadowRoot.querySelector(`#${this.moreOptionsId}`);
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
    this.siteOperation("copySite", this.t.copy, "icons:content-copy");
  }

  downloadSite() {
    this.closeOptionsMenu();
    this.siteOperation("downloadSite", this.t.download, "file-download");
  }

  archiveSite() {
    this.closeOptionsMenu();
    this.siteOperation("archiveSite", this.t.archive, "icons:archive");
  }
  // translated verb for an operation such as copySite / archiveSite
  _operationVerb(op) {
    const verb = op.replace("Site", "");
    return this.t[`${verb}Operation`] || verb;
  }

  createTemplate() {
    this.closeOptionsMenu();
    const site = this.getSiteRecord();
    if (!site) {
      return;
    }
    this.openCreateTemplateDialog(site);
  }

  getSiteRecord() {
    if (!store || !store.manifest || !Array.isArray(store.manifest.items)) {
      return null;
    }
    return toJS(
      store.manifest.items.filter((item) => item.id === this.siteId).pop(),
    );
  }

  openCreateTemplateDialog(site) {
    if (!site || !site.metadata || !site.metadata.site) {
      return;
    }
    const siteName = site.metadata.site.name || this.title || this.t.site;
    const modal = document.createElement("app-hax-confirmation-modal");
    modal.title = this.t.createTemplateFrom.replace(
      "{siteName}",
      () => siteName,
    );
    modal.message = this.t.createTemplateMessage;
    modal.confirmText = this.t.saveToTemplates;
    modal.cancelText = this.t.downloadSkeleton;
    modal.modal = true;
    modal.cancelIsNeutral = true;
    modal.cancelActionOnPassiveClose = false;
    modal.confirmAction = this.saveSiteAsTemplate.bind(this, site);
    modal.cancelAction = this.downloadSiteSkeleton.bind(this, site);
    document.body.appendChild(modal);
    modal.openModal();
    modal.addEventListener(
      "close",
      () => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      },
      { once: true },
    );
  }

  triggerJsonDownload(data, filename) {
    const fileName =
      filename && typeof filename === "string" && filename.trim() !== ""
        ? filename.trim()
        : "site-template.json";
    const fileData = JSON.stringify(data, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const objectUrl = globalThis.URL.createObjectURL(blob);
    const a = globalThis.document.createElement("a");
    a.href = objectUrl;
    a.setAttribute("download", fileName);
    a.style.display = "none";
    globalThis.document.body.appendChild(a);
    a.click();
    globalThis.document.body.removeChild(a);
    globalThis.URL.revokeObjectURL(objectUrl);
  }

  refreshTemplateResults() {
    let filter = globalThis.document.querySelector("app-hax-use-case-filter");
    if (!filter && store && store.appEl && store.appEl.shadowRoot) {
      filter = store.appEl.shadowRoot.querySelector("app-hax-use-case-filter");
    }
    if (filter && typeof filter.updateSkeletonResults === "function") {
      filter.updateSkeletonResults();
    }
  }

  async downloadSiteSkeleton(site) {
    const api = store && store.AppHaxAPI ? store.AppHaxAPI : null;
    const supportsDownloadSkeleton =
      api && typeof api.supportsCall === "function"
        ? api.supportsCall("downloadSiteSkeleton")
        : false;
    if (
      !store ||
      !api ||
      typeof api.makeCall !== "function" ||
      !supportsDownloadSkeleton
    ) {
      store.toast(this.t.downloadSkeletonNotConfigured, 3000, {
        hat: "random",
      });
      return;
    }
    const siteName =
      site &&
      site.metadata &&
      site.metadata.site &&
      typeof site.metadata.site.name === "string"
        ? site.metadata.site.name
        : "";
    if (!siteName) {
      return;
    }
    try {
      const response = await api.makeCall(
        "downloadSiteSkeleton",
        {
          site: {
            name: siteName,
            id: site.id,
          },
        },
        true,
      );
      const payload = response && response.data ? response.data : null;
      const skeletonData =
        payload && payload.skeleton ? payload.skeleton : payload;
      if (!skeletonData || typeof skeletonData !== "object") {
        throw new Error("Skeleton payload missing from response");
      }
      const fileName =
        payload && payload.filename && typeof payload.filename === "string"
          ? payload.filename
          : `${this.getSiteMachineName() || "site-template"}.json`;
      this.triggerJsonDownload(skeletonData, fileName);
      store.toast(
        this.t.skeletonDownloaded.replace("{siteName}", () => siteName),
        3000,
        {
          hat: "random",
        },
      );
    } catch (error) {
      if (store.appEl && store.appEl.playSound) {
        store.appEl.playSound("error");
      }
      console.error("downloadSiteSkeleton failed:", error);
      store.toast(this.t.unableToDownloadSkeleton, 4000, {
        hat: "random",
      });
    }
  }

  async saveSiteAsTemplate(site) {
    const api = store && store.AppHaxAPI ? store.AppHaxAPI : null;
    const supportsSaveTemplate =
      api && typeof api.supportsCall === "function"
        ? api.supportsCall("saveSiteAsTemplate")
        : false;
    if (
      !store ||
      !api ||
      typeof api.makeCall !== "function" ||
      !supportsSaveTemplate
    ) {
      store.toast(this.t.saveTemplateNotConfigured, 3000, {
        hat: "random",
      });
      return;
    }
    const siteName =
      site &&
      site.metadata &&
      site.metadata.site &&
      typeof site.metadata.site.name === "string"
        ? site.metadata.site.name
        : "";
    if (!siteName) {
      return;
    }
    try {
      const response = await api.makeCall(
        "saveSiteAsTemplate",
        {
          site: {
            name: siteName,
            id: site.id,
          },
        },
        true,
      );
      if (!response || response.status !== 200) {
        throw new Error("saveSiteAsTemplate did not return status 200");
      }
      this.refreshTemplateResults();
      store.toast(
        this.t.savedToTemplates.replace("{siteName}", () => siteName),
        3000,
        {
          hat: "random",
        },
      );
    } catch (error) {
      if (store.appEl && store.appEl.playSound) {
        store.appEl.playSound("error");
      }
      console.error("saveSiteAsTemplate failed:", error);
      store.toast(this.t.unableToSaveTemplate, 4000, {
        hat: "random",
      });
    }
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
          title: this.t.userAccess,
          elements: { content: modal },
          invokedBy: this,
          styles: {
            "--simple-modal-titlebar-background":
              "var(--ddd-theme-default-nittanyNavy, #001e44)",
            "--simple-modal-titlebar-color":
              "var(--ddd-theme-default-white, white)",
            "--simple-modal-width": "80vw",
            "--simple-modal-max-width": "480px",
            "--simple-modal-min-width": "300px",
            "--simple-modal-z-index": "1000",
            "--simple-modal-height": "auto",
            "--simple-modal-min-height": "300px",
            "--simple-modal-max-height": "80vh",
            "--simple-modal-titlebar-height": "80px",
            "--simple-modal-border-radius": "var(--ddd-radius-md, 8px)",
            "--simple-modal-background":
              "light-dark(var(--ddd-theme-default-white, white), var(--ddd-theme-default-coalyGray, #1c1c1c))",
            "--simple-modal-content-container-background":
              "light-dark(var(--ddd-theme-default-white, white), var(--ddd-theme-default-coalyGray, #1c1c1c))",
            "--simple-modal-content-container-color":
              "light-dark(var(--ddd-theme-default-coalyGray, #1c1c1c), var(--ddd-theme-default-white, white))",
            "--simple-modal-buttons-background":
              "light-dark(var(--ddd-theme-default-white, white), var(--ddd-theme-default-coalyGray, #1c1c1c))",
            "--simple-modal-box-shadow": "var(--ddd-boxShadow-xl)",
          },
        },
      });

      this.dispatchEvent(evt);
    });
  }

  // Site operation handler using new confirmation modal
  siteOperation(op, opName, _icon) {
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
    modal.title = this.t.siteOperationConfirmTitle
      .replace("{operationName}", () => opName)
      .replace("{siteName}", () => site.metadata.site.name);
    modal.message = this.t.siteOperationConfirmMessage
      .replace("{operation}", () => this._operationVerb(op))
      .replace("{siteName}", () => site.metadata.site.name);
    modal.confirmText = this.t.confirm;
    modal.cancelText = this.t.cancel;

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
          // Guard against the failure shape: a non-2xx status or missing
          // data means the download did not succeed — do not open a link.
          if (
            response &&
            typeof response === "object" &&
            typeof response.status === "number" &&
            response.status >= 400
          ) {
            console.error(
              "downloadSite failed with status:",
              response.status,
              response,
            );
          } else if (response && response.data && response.data.link) {
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
            console.error("downloadSite response missing data.link:", response);
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

    // Report the operation outcome accurately. A non-2xx status means the
    // operation failed — surface the backend message instead of a false
    // "successful" toast.
    const opResponse =
      store.AppHaxAPI && store.AppHaxAPI.lastResponse
        ? store.AppHaxAPI.lastResponse[op]
        : null;
    if (
      opResponse &&
      typeof opResponse === "object" &&
      typeof opResponse.status === "number" &&
      opResponse.status >= 400
    ) {
      const errMsg = haxcmsApiMessage(
        opResponse,
        this.t.siteOperationFailed
          .replace("{siteName}", () => site.metadata.site.name)
          .replace("{operation}", () => this._operationVerb(op)),
      );
      store.toast(errMsg, 3000, { hat: "random" });
    } else {
      store.toast(
        this.t.siteOperationSuccessful
          .replace("{siteName}", () => site.metadata.site.name)
          .replace("{operation}", () => this._operationVerb(op)),
        3000,
        {
          hat: "random",
        },
      );
    }
  }

  // CSS - specific to Lit
  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      css`
        /* a dashboard record card in the HAX UI admin layer: token surface,
           1px line, 8px corners, 14px title over a 12px muted date */
        :host {
          text-align: left;
          --app-hax-site-card-width: 180px;
          --app-hax-site-card-min-height: 0;
          --app-hax-site-image-height: auto;
          --app-hax-site-title-font-size: var(--hax-ui-admin-font-size);
          --app-hax-site-date-font-size: var(--hax-ui-admin-font-size-xs);
          --app-hax-site-card-content-padding: var(--hax-ui-gap-md)
            var(--hax-ui-gap) var(--hax-ui-gap-md) 10px;
          width: var(--app-hax-site-card-width);
          max-width: var(--app-hax-site-card-width);
          font-family: var(--hax-ui-admin-font-family);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          min-height: var(--app-hax-site-card-min-height);
          transition:
            border-color var(--hax-ui-duration) var(--hax-ui-easing),
            box-shadow var(--hax-ui-duration) var(--hax-ui-easing);
          overflow: visible;
        }

        :host(:hover) {
          border-color: var(--hax-ui-line-strong);
          box-shadow: var(--hax-ui-shadow-popover);
        }

        :host(:focus-within) {
          border-color: var(--hax-ui-accent-strong);
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
          z-index: 2;
        }

        #mainCard {
          display: flex;
          flex-direction: column;
        }

        .cardContent {
          padding: var(--app-hax-site-card-content-padding);
        }

        .cardImage {
          width: 100%;
          overflow: hidden;
          border-top-left-radius: calc(var(--hax-ui-radius-lg) - 1px);
          border-top-right-radius: calc(var(--hax-ui-radius-lg) - 1px);
          border-bottom: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-sunken);
        }

        .titleBar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--hax-ui-gap);
          position: relative;
          overflow: visible;
        }

        .titleText {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .more-options {
          display: flex;
          align-items: center;
          flex: none;
          color: var(--hax-ui-text-muted);
        }

        .more-options simple-icon-button-lite {
          --simple-icon-color: var(--hax-ui-text-muted);
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-button-border-radius: var(--hax-ui-radius);
        }

        .more-options simple-icon-button-lite::part(button) {
          width: var(--hax-ui-row-height);
          height: var(--hax-ui-row-height);
          border-radius: var(--hax-ui-radius);
        }

        .more-options simple-icon-button-lite:hover,
        .more-options simple-icon-button-lite:focus-within {
          color: var(--hax-ui-text);
          --simple-icon-color: var(--hax-ui-text);
        }

        .more-options simple-icon-button-lite::part(button):hover {
          background-color: var(--hax-ui-hover);
        }

        ::slotted([slot="heading"]) {
          display: block;
          font-size: var(--app-hax-site-title-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: var(--hax-ui-row-height);
          margin: 0;
        }

        ::slotted(a[slot="heading"]) {
          text-decoration: none;
        }

        ::slotted(a[slot="heading"]:hover) {
          text-decoration: underline;
        }

        .date {
          display: flex;
          gap: var(--hax-ui-gap);
          font-size: var(--app-hax-site-date-font-size);
          color: var(--hax-ui-text-muted);
          align-items: center;
          line-height: 1;
        }

        .date simple-icon {
          --simple-icon-color: var(--hax-ui-text-muted);
          --simple-icon-width: 12px;
          --simple-icon-height: 12px;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top left;
          display: block;
        }

        .imageLink {
          display: block;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          height: var(--app-hax-site-image-height);
        }

        .imageLink:focus-visible {
          outline: none;
        }

        @media (max-width: 640px) {
          :host {
            --app-hax-site-card-width: clamp(120px, 30vw, 148px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :host {
            transition: none;
          }
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
          ${
            this.image
              ? html`
                  <a
                    class="imageLink"
                    href="${this.siteUrl}"
                    aria-label="${this.t.openSite.replace(
                      "{title}",
                      () => this.title || this.t.site,
                    )}"
                  >
                    <img
                      src="${this.image}"
                      alt="${this.t.siteThemeScreenshot.replace(
                        "{title}",
                        () => this.title || this.t.site,
                      )}"
                      loading="lazy"
                      decoding="async"
                      fetchpriority="low"
                    />
                  </a>
                `
              : ""
          }
        </div>
        <div class="cardContent">
          <div class="titleBar">
            <div class="titleText">
              <slot name="heading"></slot>
              <div class="date">
                <simple-icon
                  icon="hax:calendar"
                  title="${this.t.lastUpdated}"
                ></simple-icon>
                <simple-datetime
                  title="${this.t.lastUpdated}"
                  format="m/j/y"
                  .timestamp="${this.lastUpdatedTime}"
                  unix
                ></simple-datetime>
              </div>
            </div>

            <div class="more-options">
              <simple-icon-button-lite
                id="${this.moreOptionsId}"
                icon="lrn:more-vert"
                @click="${this.toggleOptionsMenu}"
                aria-label="${this.t.openOptions}"
                aria-haspopup="menu"
                title="${this.t.options}"
              ></simple-icon-button-lite>
              <simple-context-menu title="${this.t.options}">
                <simple-toolbar-button
                  icon="content-copy"
                  icon-position="left"
                  align-horizontal="left"
                  show-text-label
                  label="${this.t.copy}"
                  @click=${this.copySite}
                ></simple-toolbar-button>
                <simple-toolbar-button
                  icon="file-download"
                  icon-position="left"
                  align-horizontal="left"
                  show-text-label
                  label="${this.t.download}"
                  @click=${this.downloadSite}
                ></simple-toolbar-button>
                <simple-toolbar-button
                  icon="icons:add-circle"
                  icon-position="left"
                  align-horizontal="left"
                  show-text-label
                  label="${this.t.createTemplate}"
                  @click=${this.createTemplate}
                ></simple-toolbar-button>
                <simple-toolbar-button
                  icon="archive"
                  icon-position="left"
                  align-horizontal="left"
                  show-text-label
                  label="${this.t.archive}"
                  @click=${this.archiveSite}
                ></simple-toolbar-button>
                ${
                  store &&
                  store.AppHaxAPI &&
                  typeof store.AppHaxAPI.supportsCall === "function" &&
                  store.AppHaxAPI.supportsCall("haxiamAddUserAccess")
                    ? html`
                        <simple-toolbar-button
                          icon="account-circle"
                          icon-position="left"
                          align-horizontal="left"
                          show-text-label
                          label="${this.t.userAccess}"
                          @click=${this.openUserAccess}
                        ></simple-toolbar-button>
                      `
                    : ""
                }
              </simple-context-menu>
            </div>
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
