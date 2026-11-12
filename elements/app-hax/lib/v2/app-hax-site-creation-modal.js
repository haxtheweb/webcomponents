/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { HaxUiAdminTokens } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiDialogTitlebarStyles } from "@haxtheweb/d-d-d/lib/HaxUiDialogFrame.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "web-dialog/index.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/promise-progress/promise-progress.js";
import "./app-hax-simple-hat-progress.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import {
  loadAvatarCode,
  AVATAR_EVENT,
} from "@haxtheweb/rpg-character/lib/rpg-character-avatar.js";
import { store } from "./AppHaxStore.js";
import { toJS } from "mobx";
import { haxcmsApiMessage } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSApiMessages.js";
import { trimChars } from "@haxtheweb/utils/lib/safe-html.js";

export class AppHaxSiteCreationModal extends I18NMixin(DDDSuper(LitElement)) {
  static get tag() {
    return "app-hax-site-creation-modal";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      createNewSite: "Create New Site",
      creatingSite: "Creating Site",
      siteCreated: "Site Created",
      creatingSiteEllipsis: "Creating Site...",
      siteCreatedExclaim: "Site Created!",
      closeModal: "Close modal",
      siteNameRequired: "Site name is required",
      siteNameMinLength: "Site name must be at least 3 characters",
      siteNameMaxLength: "Site name must be less than 50 characters",
      siteNameInvalidCharacters:
        "Site name can only contain letters, numbers, spaces, hyphens, and underscores",
      failedToCreateSite: "Failed to create site. Please try again.",
      siteCreationFailed: "Site creation failed. Please try again.",
      templatePreview: "{title} preview",
      siteName: "Site Name",
      enterSiteName: "Enter your site name...",
      createSite: "Create Site",
      cancel: "Cancel",
      creatingYourSite: "Creating your site...",
      percentComplete: "{percent}% complete",
      siteCreatedSuccessfully: "Site Created Successfully!",
      newSiteReady: 'Your new site "{siteName}" is ready to use.',
      stayHere: "Stay Here",
      goToSite: "Go to Site",
      stepOf: "Step {step} of {total}",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.open = false;
    this.title = "";
    this.description = "";
    this.source = "";
    this.template = "";
    this.themeElement = "";
    this.siteName = "";
    this.currentStep = 1; // 1: naming, 2: creating, 3: success
    this.isCreating = false;
    this.creationProgress = 0;
    this.errorMessage = "";
    this.showConfetti = false;
    this.siteUrl = "";
    this.creationCancelled = false;
    this.promises = [];
    this.max = 100;
    this.skeletonData = null;
    this.skeletonMachineName = null;
    // the person's saved character, so the progress hat sits on them
    this._avatarCode = "";
    this._onAvatarChanged = (e) => {
      if (e.detail && e.detail.userName === this._userName()) {
        this._avatarCode = e.detail.code || "";
        this.requestUpdate();
      }
    };
    // Used to decide if we should write `name=` into the URL
    this.__defaultSiteName = "";
  }

  static get properties() {
    return {
      open: { type: Boolean, reflect: true },
      title: { type: String },
      description: { type: String },
      source: { type: String },
      template: { type: String },
      themeElement: { type: String },
      siteName: { type: String },
      currentStep: { type: Number },
      isCreating: { type: Boolean },
      creationProgress: { type: Number },
      errorMessage: { type: String },
      showConfetti: { type: Boolean },
      siteUrl: { type: String },
      creationCancelled: { type: Boolean },
      promises: { type: Array },
      max: { type: Number },
      skeletonData: { type: Object },
      skeletonMachineName: { type: String },
    };
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiDialogTitlebarStyles,
      css`
        /* HAX UI admin layer: the same titlebar, surface, field and action
           bar as the site admin dialog, so it follows dark mode */
        :host {
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
        }

        web-dialog {
          --dialog-width: 440px;
          --dialog-max-width: calc(100vw - var(--ddd-spacing-8, 32px));
          --dialog-max-height: calc(100dvh - var(--ddd-spacing-8, 32px));
          --dialog-border-radius: var(--hax-ui-radius-lg);
          z-index: 1000;
        }

        web-dialog::part(backdrop) {
          background: rgba(0, 0, 0, 0.6);
        }

        web-dialog::part(dialog) {
          background: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          border-radius: var(--hax-ui-radius-lg);
          box-shadow: var(--hax-ui-shadow-popover);
          padding: 0;
          overflow: hidden;
        }

        .modal-content {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: var(--hax-ui-gap-lg);
          position: relative;
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px)
            var(--ddd-spacing-5, 20px);
        }

        .step-indicator {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
        }

        .step-label {
          flex: 1;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }

        .step-dot {
          width: var(--ddd-spacing-6, 24px);
          height: var(--ddd-spacing-1, 4px);
          border-radius: var(--hax-ui-radius-pill);
          background: var(--hax-ui-line);
          transition: background-color var(--hax-ui-duration)
            var(--hax-ui-easing);
        }

        .step-dot.active {
          background: var(--hax-ui-accent-strong);
        }

        .step-dot.completed {
          background: var(--hax-ui-success);
        }

        .template-info {
          display: flex;
          gap: var(--hax-ui-gap-lg);
          padding: var(--hax-ui-gap-md);
          background: var(--hax-ui-sunken);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          align-items: center;
        }

        .template-image {
          flex-shrink: 0;
          width: 96px;
          height: 64px;
          border-radius: var(--hax-ui-radius);
          overflow: hidden;
          border: 1px solid var(--hax-ui-line);
        }

        .template-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .template-details {
          flex: 1;
          min-width: 0;
          text-align: left;
        }

        .template-title {
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
          margin: 0 0 2px 0;
        }

        .template-description {
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          margin: 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap);
          position: relative;
        }

        .form-label {
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--hax-ui-text);
          text-align: left;
        }

        .form-field {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          height: var(--hax-ui-field-height);
          padding: 0 var(--hax-ui-gap-lg) 0 calc(var(--hax-ui-icon) + 20px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size);
          font-family: inherit;
          box-sizing: border-box;
          background-color: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          transition: border-color var(--hax-ui-duration) var(--hax-ui-easing);
        }

        .form-icon {
          position: absolute;
          left: var(--hax-ui-gap-lg);
          color: var(--hax-ui-text-muted);
          pointer-events: none;
          z-index: 1;
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
        }

        .form-input:hover {
          border-color: var(--hax-ui-text-muted);
        }

        .form-input:focus {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 1px;
          border-color: var(--hax-ui-accent-strong);
        }

        .form-input[aria-invalid="true"] {
          border-color: var(--hax-ui-danger);
        }

        .error-message {
          color: var(--hax-ui-danger);
          font-size: var(--hax-ui-admin-font-size-xs);
          text-align: left;
        }

        .progress-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--hax-ui-gap-md);
        }

        .progress-text,
        .progress-percentage {
          margin: 0;
          text-align: center;
        }

        .progress-text {
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-medium, 500);
        }

        .progress-percentage {
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }

        /* the person's saved character wears the progress hat */
        .hat-avatar {
          position: relative;
          width: 160px;
          height: 222px;
          margin: 0 auto;
        }

        .hat-avatar rpg-character {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
        }

        /* the brim sits on the character's own hair line: the art's crown
           is centred at x 208 of 405 (77px at 150px wide) and the sprite
           is 1.5px left of its box's centre, so the hat is placed from
           the left rather than centred; 16px down puts the brim's bottom
           edge on the bottom of the hair line */
        .hat-avatar app-hax-simple-hat-progress {
          position: absolute;
          left: calc(50% - 78.5px);
          top: 16px;
          width: 150px;
          z-index: 1;
        }

        promise-progress {
          display: none;
        }

        .success-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--hax-ui-gap);
          text-align: center;
        }

        .success-title {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          font-size: var(--ddd-font-size-4xs, 16px);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
          margin: var(--hax-ui-gap-md) 0 0 0;
        }

        .success-title simple-icon-lite {
          color: var(--hax-ui-success);
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
        }

        .success-subtitle {
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text-muted);
          margin: 0;
          line-height: var(--ddd-lh-140, 1.4);
        }

        /* the action bar: staged actions at the bottom right, primary last */
        .button-group {
          display: flex;
          gap: var(--hax-ui-gap-md);
          justify-content: flex-end;
          align-items: center;
          min-height: var(--hax-ui-action-bar-height);
          padding: 0 var(--ddd-spacing-5, 20px);
          border-top: 1px solid var(--hax-ui-line);
          box-sizing: border-box;
        }

        .button {
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-lg);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-medium, 500);
          font-family: inherit;
          cursor: pointer;
          transition:
            background-color var(--hax-ui-duration) var(--hax-ui-easing),
            border-color var(--hax-ui-duration) var(--hax-ui-easing);
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--hax-ui-gap);
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
        }

        .button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }

        .button:disabled {
          opacity: var(--ddd-state-disabled-opacity, 0.5);
          cursor: not-allowed;
        }

        .button-primary {
          background: var(--hax-ui-primary);
          color: var(--hax-ui-on-primary);
          font-weight: var(--ddd-font-weight-bold, 700);
        }

        .button-primary:hover:not(:disabled) {
          background: var(--hax-ui-primary-hover);
        }

        .button-secondary {
          background: transparent;
          color: var(--hax-ui-text);
          border-color: var(--hax-ui-line-strong);
        }

        .button-secondary:hover:not(:disabled) {
          background: var(--hax-ui-hover);
          border-color: var(--hax-ui-text-muted);
        }

        .confetti {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          background: var(--ddd-theme-default-futureLime, #99cc33);
          animation: confetti-fall 3s linear infinite;
        }

        .confetti-piece:nth-child(2n) {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          animation-delay: -0.6s;
        }

        .confetti-piece:nth-child(3n) {
          background: var(--ddd-theme-default-original87Pink, #e4007c);
          animation-delay: -1s;
        }

        .confetti-piece:nth-child(4n) {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          animation-delay: -1.5s;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .confetti-piece {
            animation: none;
            display: none;
          }
        }

        @media (max-width: 600px) {
          .modal-content {
            padding: var(--ddd-spacing-4, 16px);
          }

          .button-group {
            padding: 0 var(--ddd-spacing-4, 16px);
          }

          .button {
            min-height: var(--hax-ui-row-height-roomy);
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener(AVATAR_EVENT, this._onAvatarChanged);
  }

  disconnectedCallback() {
    globalThis.removeEventListener(AVATAR_EVENT, this._onAvatarChanged);
    super.disconnectedCallback();
  }

  _userName() {
    const user = store && store.user ? toJS(store.user) : null;
    return user && user.name ? user.name : "";
  }

  updated(changedProperties) {
    if (changedProperties.has("open") && this.open) {
      this._avatarCode = loadAvatarCode(this._userName());
    }
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("open") || changedProperties.has("currentStep")) {
      this._syncDialogA11yLabel();
    }
  }

  _getDialogLabel() {
    if (this.currentStep === 1) {
      return this.t.createNewSite;
    }
    if (this.currentStep === 2) {
      return this.t.creatingSite;
    }
    return this.t.siteCreated;
  }

  _syncDialogA11yLabel() {
    const modal =
      this.shadowRoot && this.shadowRoot.querySelector("web-dialog");
    if (!modal) {
      return;
    }
    const label = this._getDialogLabel();
    modal.setAttribute("aria-label", label);
    if (modal.shadowRoot) {
      const dialogFocusTrap = modal.shadowRoot.querySelector("#dialog");
      if (dialogFocusTrap) {
        dialogFocusTrap.setAttribute("aria-label", label);
      }
    }
  }

  _getNameParamFromUrl() {
    try {
      const url = new URL(globalThis.location.href);
      return url.searchParams.get("name") || "";
    } catch {
      return "";
    }
  }

  _sanitizeNameForUrl(raw) {
    if (!raw || typeof raw !== "string") {
      return "";
    }
    // Strip non letter/number chars (keeping spaces for readability)
    let name = raw.replace(/[^a-zA-Z0-9\s]+/g, "");
    name = name.replace(/\s+/g, " ").trim();
    if (name.length > 50) {
      name = name.substring(0, 50).trim();
    }
    return name;
  }

  _updateUrlQueryParam(param, value) {
    if (!param || typeof param !== "string") {
      return;
    }
    try {
      const url = new URL(globalThis.location.href);
      if (value === null || typeof value === "undefined" || value === "") {
        url.searchParams.delete(param);
      } else {
        url.searchParams.set(param, value);
      }
      globalThis.history.replaceState(
        globalThis.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    } catch {
      // do nothing
    }
  }

  _clearUseCaseUrlParams() {
    // The `use-case` deep-link param (and its historical spelling variants)
    // should not linger in the URL once a site has actually been created,
    // otherwise reloading the page looks like the use-case was never opened.
    this._updateUrlQueryParam("use-case", "");
    this._updateUrlQueryParam("use_case", "");
    this._updateUrlQueryParam("useCase", "");
  }

  _syncUrlNameParam() {
    const current = this._sanitizeNameForUrl(this.siteName);
    const defaultName = this._sanitizeNameForUrl(this.__defaultSiteName);

    // Keep the on-screen value sanitized as well.
    if (current !== this.siteName) {
      this.siteName = current;
    }

    // Only write `name=` when the user has changed it away from the default.
    if (!current || current === defaultName) {
      this._updateUrlQueryParam("name", "");
    } else {
      this._updateUrlQueryParam("name", current);
    }
  }

  _handleSiteNameInput(e) {
    const value = e && e.target ? e.target.value : "";
    this.siteName = this._sanitizeNameForUrl(value);
    this.validateSiteName();
    this._syncUrlNameParam();
  }

  openModal() {
    this.open = true;
    this.currentStep = 1;

    // Preserve any prepopulated siteName from the caller (typically the use-case title)
    this.siteName = this.siteName || "";
    this.__defaultSiteName = this.siteName;

    // If URL has ?name=..., use it (sanitized) to prepopulate the field
    const urlName = this._getNameParamFromUrl();
    if (urlName) {
      const sanitized = this._sanitizeNameForUrl(urlName);
      if (sanitized) {
        this.siteName = sanitized;
      }
    }

    // Keep URL in sync with the current name state (do not write `name=` for defaults)
    this._syncUrlNameParam();

    this.errorMessage = "";
    this.showConfetti = false;
    this.isCreating = false;
    this.creationProgress = 0;
    this.creationCancelled = false;
    this.siteUrl = "";

    // Prevent body scrolling while modal is open
    document.body.style.overflow = "hidden";

    // Wait for the component to update before setting modal state
    this.updateComplete.then(() => {
      const modal =
        this.shadowRoot && this.shadowRoot.querySelector("web-dialog");
      if (modal) {
        modal.open = true;
        this._syncDialogA11yLabel();
      }

      // Focus the site name once the dialog has opened (see
      // _onDialogOpened); this is the fallback if that event never comes
      setTimeout(() => this._focusSiteName(), 100);
    });
  }

  /**
   * web-dialog focuses its first focusable element (the close button) in an
   * animation frame after it opens, which flashed the focus ring on Close;
   * move focus to the site name right after that instead.
   */
  _onDialogOpened() {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => this._focusSiteName()),
    );
  }

  _focusSiteName() {
    if (this.currentStep !== 1) {
      return;
    }
    const input =
      this.shadowRoot && this.shadowRoot.querySelector(".form-input");
    if (input && this.shadowRoot.activeElement !== input) {
      input.focus();
      // Select the full value so it's easy to overwrite via keyboard
      if (typeof input.select === "function") {
        input.select();
      }
    }
  }

  closeModal() {
    // If creation is in progress, cancel it
    if (this.isCreating) {
      this.creationCancelled = true;
    }

    // Consider it cancelled if we're in step 1 OR if we're in step 3 (success) and user chooses to stay
    const wasCancelled = this.currentStep === 1 || this.currentStep === 3;

    // Removed sound effects for modal close/cancel as requested

    // Restore body scrolling
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    this.open = false;
    const modal =
      this.shadowRoot && this.shadowRoot.querySelector("web-dialog");
    if (modal) {
      modal.open = false;
    }

    this.currentStep = 1;
    this.siteName = "";
    this.__defaultSiteName = "";
    this.errorMessage = "";
    this.showConfetti = false;
    this.isCreating = false;
    this.creationProgress = 0;
    this.creationCancelled = false;
    this.siteUrl = "";
    this.themeElement = "";
    this.skeletonData = null;
    this.skeletonMachineName = null;

    this.dispatchEvent(
      new CustomEvent("modal-closed", {
        bubbles: true,
        composed: true,
        detail: { cancelled: wasCancelled },
      }),
    );
  }

  handleModalClosed(_e) {
    // web-dialog sends close event, we need to sync our state
    if (this.isCreating) {
      this.creationCancelled = true;
    }

    // Consider it cancelled if we're in step 1 OR if we're in step 3 (success) and user closes/stays
    const wasCancelled = this.currentStep === 1 || this.currentStep === 3;

    // Removed sound effects for modal close/cancel as requested

    // Restore body scrolling
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    this.open = false;
    this.currentStep = 1;
    this.siteName = "";
    this.__defaultSiteName = "";
    this.errorMessage = "";
    this.showConfetti = false;
    this.isCreating = false;
    this.creationProgress = 0;
    this.creationCancelled = false;
    this.siteUrl = "";
    this.themeElement = "";
    this.skeletonData = null;

    this.dispatchEvent(
      new CustomEvent("modal-closed", {
        bubbles: true,
        composed: true,
        detail: { cancelled: wasCancelled },
      }),
    );
  }

  handleKeyDown(e) {
    if (e.key === "Enter" && this.currentStep === 1) {
      this.createSite();
    }
  }

  validateSiteName() {
    const name = this.siteName.trim();
    if (!name) {
      this.errorMessage = this.t.siteNameRequired;
      return false;
    }
    if (name.length < 3) {
      this.errorMessage = this.t.siteNameMinLength;
      return false;
    }
    if (name.length > 50) {
      this.errorMessage = this.t.siteNameMaxLength;
      return false;
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      this.errorMessage = this.t.siteNameInvalidCharacters;
      return false;
    }
    this.errorMessage = "";
    return true;
  }

  _extractSkeletonMachineName() {
    if (!this.skeletonData || typeof this.skeletonData !== "object") {
      return null;
    }
    let machineName = null;
    if (
      this.skeletonData.meta &&
      typeof this.skeletonData.meta === "object" &&
      this.skeletonData.meta.machineName &&
      typeof this.skeletonData.meta.machineName === "string"
    ) {
      machineName = this.skeletonData.meta.machineName;
    } else if (
      this.skeletonData.meta &&
      typeof this.skeletonData.meta === "object" &&
      this.skeletonData.meta.name &&
      typeof this.skeletonData.meta.name === "string"
    ) {
      machineName = this.skeletonData.meta.name;
    } else if (
      this.skeletonData.metadata &&
      typeof this.skeletonData.metadata === "object" &&
      this.skeletonData.metadata.skeleton &&
      typeof this.skeletonData.metadata.skeleton === "object" &&
      this.skeletonData.metadata.skeleton.machineName &&
      typeof this.skeletonData.metadata.skeleton.machineName === "string"
    ) {
      machineName = this.skeletonData.metadata.skeleton.machineName;
    }
    if (!machineName) {
      return null;
    }
    return machineName.replace(/\.json$/i, "").trim();
  }

  async createSite() {
    if (!this.validateSiteName()) {
      return;
    }

    // Set up the site data in store for the API call
    store.site.name = this.siteName;
    store.site.license = null;
    // If skeleton data exists, use its build configuration
    if (this.skeletonData && this.skeletonData.build) {
      store.site.structure =
        this.skeletonData.build.structure || "from-skeleton";
      store.site.type = this.skeletonData.build.type || "skeleton";
      if (
        this.skeletonData.site &&
        typeof this.skeletonData.site === "object" &&
        this.skeletonData.site.license &&
        typeof this.skeletonData.site.license === "string"
      ) {
        store.site.license = this.skeletonData.site.license;
      }
      // Pass skeleton items and files to store for API formatting
      if (this.skeletonData.build.items) {
        store.items = this.skeletonData.build.items;
      }
      if (this.skeletonData.build.files) {
        store.itemFiles = this.skeletonData.build.files;
      }
      store.skeletonMachineName =
        this.skeletonMachineName || this._extractSkeletonMachineName();
    } else {
      store.site.structure = this.themeElement || "website";
      store.site.type = "own";
      store.items = null;
      store.itemFiles = null;
      store.skeletonMachineName = null;
    }
    store.site.theme = this.themeElement || "polaris-flex-theme"; // Use selected theme

    this.currentStep = 2;
    this.isCreating = true;
    this.creationProgress = 0;
    this.creationCancelled = false;

    // Set up promises from store for real site creation
    this.promises = toJS(store.newSitePromiseList);

    try {
      // Start the promise progress system
      await this.updateComplete; // Wait for render
      const promiseProgress =
        this.shadowRoot.querySelector("#promise-progress");
      if (promiseProgress) {
        promiseProgress.process();
      }
    } catch (error) {
      if (!this.creationCancelled) {
        this.errorMessage = this.t.failedToCreateSite;
        this.currentStep = 1;
        this.isCreating = false;
        console.error("Site creation error:", error);
      }
    }
  }

  generateConfetti() {
    const confettiContainer = this.shadowRoot.querySelector(".confetti");
    if (!confettiContainer) return;

    // Clear existing confetti
    confettiContainer.innerHTML = "";

    // Generate confetti pieces
    for (let i = 0; i < 50; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.animationDuration = Math.random() * 3 + 2 + "s";
      piece.style.animationDelay = Math.random() * 2 + "s";
      confettiContainer.appendChild(piece);
    }

    // Remove confetti after animation
    setTimeout(() => {
      confettiContainer.innerHTML = "";
      this.showConfetti = false;
    }, 5000);
  }

  progressValueChanged(e) {
    this.creationProgress = e.detail.value;
    // Update the hat progress component
    const hatProgress = this.shadowRoot.querySelector(
      "app-hax-simple-hat-progress",
    );
    if (hatProgress) {
      hatProgress.progress = this.creationProgress;
      hatProgress.requestUpdate();
    }
  }

  progressMaxChanged(e) {
    this.max = e.detail.value;
  }

  async promiseProgressFinished(e) {
    if (e.detail.value) {
      // Verify the create actually succeeded before showing the success
      // view. A non-2xx status or missing data means creation failed —
      // surface the backend message instead of confetti + "Go to Site".
      const createResult = store.AppHaxAPI.lastResponse.createSite;
      if (!(
        createResult &&
        typeof createResult === "object" &&
        typeof createResult.status === "number" &&
        createResult.status >= 200 &&
        createResult.status < 400 &&
        createResult.data
      )) {
        this.currentStep = 1;
        this.isCreating = false;
        this.errorMessage = haxcmsApiMessage(
          createResult,
          this.t.siteCreationFailed,
        );
        return;
      }

      // Site creation completed successfully!
      const createResponse = createResult.data;

      // Set the real site URL from the API response
      if (createResponse && createResponse.slug) {
        this.siteUrl = createResponse.slug.replace("index.html", "");
      } else if (createResponse && createResponse.link) {
        this.siteUrl = createResponse.link;
      } else {
        // Fallback URL if API doesn't return proper response
        const siteSlug = trimChars(
          this.siteName
            .toLowerCase()
            .replace(/[^a-z0-9_-]+/g, "-")
            .replace(/[-_]{2,}/g, "-"),
          "-_",
        );
        this.siteUrl = `/_sites/${siteSlug}/`;
      }

      // Success! Now that the site actually exists, drop the deep-link
      // `use-case` param so a reload doesn't look like nothing happened.
      this._clearUseCaseUrlParams();

      this.currentStep = 3;
      this.isCreating = false;
      this.creationProgress = this.max || 100; // Ensure 100% completion

      // Update hat progress to show 100% completion
      const hatProgress = this.shadowRoot.querySelector(
        "app-hax-simple-hat-progress",
      );
      if (hatProgress) {
        hatProgress.progress = this.creationProgress;
        hatProgress.requestUpdate();
      }

      this.showConfetti = true;
      this.generateConfetti();

      // After success UI renders, move focus to the primary action (Go to Site)
      this.updateComplete.then(() => {
        const goToSiteButton =
          this.shadowRoot &&
          this.shadowRoot.querySelector(".button.go-to-site");
        if (goToSiteButton) {
          goToSiteButton.focus();
        }
      });

      // Trigger confetti on main page
      this.triggerMainPageConfetti();

      // Play success sound if available
      if (store.appEl && store.appEl.playSound) {
        store.appEl.playSound("success");
      }
      // Always refresh site state after create and resolve URL from the
      // server list if needed (or to stabilize any race conditions).
      await this._refreshSiteListingFromServer();
    }
  }

  async _refreshSiteListingFromServer() {
    if (store && store.refreshSiteListing) {
      store.refreshSiteListing();
    }

    const api = store && store.AppHaxAPI ? store.AppHaxAPI : null;
    if (!api || !api.makeCall) {
      return;
    }

    // Verify the create succeeded (status < 400 with data) before trusting
    // the create response to match against the server list. On failure,
    // skip the server-list refresh and return early.
    const createResult =
      api.lastResponse && api.lastResponse.createSite
        ? api.lastResponse.createSite
        : null;
    if (
      !createResult ||
      typeof createResult !== "object" ||
      typeof createResult.status !== "number" ||
      createResult.status >= 400 ||
      !createResult.data
    ) {
      return;
    }
    const createResponse = createResult.data;

    // Give the backend a brief moment to complete async writes before a
    // cache-busted list refresh.
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const results = await api.makeCall("getSitesList", { _t: Date.now() });
      if (!results || !results.data) {
        return;
      }

      store.manifest = results.data;

      if (
        !results.data.items ||
        !Array.isArray(results.data.items) ||
        results.data.items.length === 0
      ) {
        return;
      }

      let matchedSite = null;

      if (createResponse && createResponse.id) {
        matchedSite = results.data.items.find(
          (item) => item && item.id === createResponse.id,
        );
      }

      if (!matchedSite && createResponse && createResponse.slug) {
        const createSlug = createResponse.slug.replace("index.html", "");
        matchedSite = results.data.items.find(
          (item) =>
            item &&
            item.slug &&
            (item.slug === createSlug || item.slug === createResponse.slug),
        );
      }

      if (!matchedSite && this.siteName) {
        const normalizedSiteName = trimChars(
          this.siteName
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_-]+/g, "-")
            .replace(/[-_]{2,}/g, "-"),
          "-_",
        );
        matchedSite = results.data.items.find((item) => {
          if (
            !item ||
            !item.metadata ||
            !item.metadata.site ||
            !item.metadata.site.name
          ) {
            return false;
          }
          const itemName = trimChars(
            item.metadata.site.name
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9_-]+/g, "-")
              .replace(/[-_]{2,}/g, "-"),
            "-_",
          );
          return itemName === normalizedSiteName;
        });
      }

      if (matchedSite && matchedSite.slug) {
        this.siteUrl = matchedSite.slug.replace("index.html", "");
      }
    } catch {
      // Non-fatal: UI already has a fallback URL and can still continue.
    }
  }

  triggerMainPageConfetti() {
    // Find the main page confetti container and trigger confetti
    const mainConfettiContainer =
      store.appEl &&
      store.appEl.shadowRoot &&
      store.appEl.shadowRoot.querySelector("#confetti");
    if (mainConfettiContainer) {
      // Import and trigger confetti on main page
      import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
        () => {
          setTimeout(() => {
            mainConfettiContainer.setAttribute("popped", "");
            // Remove the attribute after animation to allow future confetti
            setTimeout(() => {
              mainConfettiContainer.removeAttribute("popped");
            }, 3000);
          }, 0);
        },
      );
    }
  }

  goToSite() {
    if (this.siteUrl) {
      globalThis.open(this.siteUrl, "_blank");
    }
    // Restore body scrolling before closing
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    this.closeModal();
  }

  renderStepIndicator() {
    const step = Math.min(this.currentStep, 2);
    return html`
      <div class="step-indicator">
        <span class="step-label">
          ${this.t.stepOf
            .replace("{step}", () => step)
            .replace("{total}", () => 2)}
        </span>
        ${[1, 2].map(
          (dot) => html`
            <div
              aria-hidden="true"
              class="step-dot ${
                this.currentStep > dot
                  ? "completed"
                  : this.currentStep === dot
                    ? "active"
                    : ""
              }"
            ></div>
          `,
        )}
      </div>
    `;
  }

  renderNamingStep() {
    return html`
      <div class="template-info">
        ${
          this.source
            ? html`
                <div class="template-image">
                  <img
                    src="${this.source}"
                    alt="${this.t.templatePreview.replace(
                      "{title}",
                      () => this.title,
                    )}"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="high"
                  />
                </div>
              `
            : ""
        }
        <div class="template-details">
          <h3 class="template-title">${this.title}</h3>
          <p class="template-description">${this.description}</p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="siteName">${this.t.siteName}</label>
        <div class="form-field">
          <simple-icon-lite
            class="form-icon"
            icon="icons:create"
            aria-hidden="true"
          ></simple-icon-lite>
          <input
            id="siteName"
            class="form-input"
            type="text"
            .value="${this.siteName}"
            @input="${(e) => {
              this._handleSiteNameInput(e);
            }}"
            @keydown="${this.handleKeyDown}"
            placeholder="${this.t.enterSiteName}"
            maxlength="50"
            required
            aria-invalid="${this.errorMessage ? "true" : "false"}"
            aria-describedby="siteNameError"
          />
        </div>
        <div id="siteNameError" class="error-message" role="alert">
          ${this.errorMessage || ""}
        </div>
      </div>
    `;
  }

  renderNamingButtons() {
    return html`
      <div class="button-group">
        <button class="button button-secondary" @click="${this.closeModal}">
          ${this.t.cancel}
        </button>
        <button
          class="button button-primary"
          @click="${this.createSite}"
          ?disabled="${!this.siteName.trim() || this.errorMessage}"
        >
          <simple-icon-lite
            icon="icons:add"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this.t.createSite}
        </button>
      </div>
    `;
  }

  renderCreatingStep() {
    return html`
      <div class="progress-container">
        ${this.renderHatAvatar(this.creationProgress)}

        <promise-progress
          id="promise-progress"
          .list="${this.promises}"
          @value-changed="${this.progressValueChanged}"
          @max-changed="${this.progressMaxChanged}"
          @promise-progress-finished="${this.promiseProgressFinished}"
        ></promise-progress>

        <p class="progress-text" role="status">${this.t.creatingYourSite}</p>
        <div class="progress-percentage">
          ${this.t.percentComplete.replace(
            "{percent}",
            () => this.creationProgress,
          )}
        </div>
      </div>
    `;
  }

  renderSuccessStep() {
    return html`
      <div class="success-content">
        ${this.renderHatAvatar(this.creationProgress || 100)}
        <h2 class="success-title">
          <simple-icon-lite
            icon="icons:check-circle"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this.t.siteCreatedSuccessfully}
        </h2>
        <p class="success-subtitle">
          ${this.t.newSiteReady.replace("{siteName}", () => this.siteName)}
        </p>
      </div>
    `;
  }

  /**
   * The progress hat on the person's saved character (their seed look when
   * nothing is saved), so the wait reads as theirs.
   */
  renderHatAvatar(progress) {
    return html`
      <div class="hat-avatar">
        <app-hax-simple-hat-progress
          .progress="${progress}"
          .max="100"
        ></app-hax-simple-hat-progress>
        <rpg-character
          seed="${this._userName()}"
          code="${this._avatarCode}"
          width="120"
          height="150"
          aria-hidden="true"
        ></rpg-character>
      </div>
    `;
  }

  renderSuccessButtons() {
    return html`
      <div class="button-group">
        <button class="button button-secondary" @click="${this.closeModal}">
          ${this.t.stayHere}
        </button>
        <button
          class="button button-primary go-to-site"
          @click="${this.goToSite}"
        >
          ${this.t.goToSite}
          <simple-icon-lite
            icon="icons:launch"
            aria-hidden="true"
          ></simple-icon-lite>
        </button>
      </div>
    `;
  }

  render() {
    return html`
      <web-dialog
        .open="${this.open}"
        center
        aria-label="${this._getDialogLabel()}"
        @open="${this._onDialogOpened}"
        @close="${this.handleModalClosed}"
      >
        <div class="modal-header hax-ui-dialog-titlebar">
          <h2 class="modal-title hax-ui-dialog-title">
            ${
              this.currentStep === 1
                ? this.t.createNewSite
                : this.currentStep === 2
                  ? this.t.creatingSiteEllipsis
                  : this.t.siteCreatedExclaim
            }
          </h2>
          <button
            class="close-button hax-ui-dialog-close"
            @click="${this.closeModal}"
            ?disabled="${this.isCreating}"
            aria-label="${this.t.closeModal}"
          >
            <simple-icon-lite icon="icons:close"></simple-icon-lite>
          </button>
        </div>

        <div class="modal-content">
          ${this.showConfetti ? html`<div class="confetti"></div>` : ""}
          ${this.renderStepIndicator()}
          ${
            this.currentStep === 1
              ? this.renderNamingStep()
              : this.currentStep === 2
                ? this.renderCreatingStep()
                : this.renderSuccessStep()
          }
        </div>
        ${
          this.currentStep === 1
            ? this.renderNamingButtons()
            : this.currentStep === 3
              ? this.renderSuccessButtons()
              : html``
        }
      </web-dialog>
    `;
  }
}

customElements.define(AppHaxSiteCreationModal.tag, AppHaxSiteCreationModal);
