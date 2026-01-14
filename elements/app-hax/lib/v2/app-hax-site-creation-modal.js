import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "web-dialog/index.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/promise-progress/promise-progress.js";
import "./app-hax-simple-hat-progress.js";
import { store } from "./AppHaxStore.js";
import { toJS } from "mobx";

export class AppHaxSiteCreationModal extends DDDSuper(LitElement) {
  static get tag() {
    return "app-hax-site-creation-modal";
  }

  constructor() {
    super();
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
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          font-family: var(--ddd-font-primary, sans-serif);
        }

        web-dialog {
          --dialog-width: var(--ddd-spacing-32, 480px);
          --dialog-max-width: 90vw;
          --dialog-max-height: 80vh;
          --dialog-border-radius: var(--ddd-radius-md, 8px);
          z-index: 1000;
        }

        web-dialog::part(backdrop) {
          background: rgba(0, 0, 0, 0.6);
        }

        web-dialog::part(dialog) {
          background: var(--ddd-theme-default-white, white);
          border-radius: var(--ddd-radius-md, 8px);
          box-shadow: var(--ddd-boxShadow-xl);
          padding: 0;
          overflow: hidden;
        }

        .modal-header {
          padding: var(--ddd-spacing-4, 16px);
          border-bottom: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-limestoneGray, #f5f5f5);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-white, white);
        }

        .modal-title {
          font-size: var(--ddd-font-size-m, 18px);
          font-weight: var(--ddd-font-weight-bold, 700);
          margin: 0;
        }

        .close-button {
          background: transparent;
          border: none;
          color: var(--ddd-theme-default-white, white);
          cursor: pointer;
          padding: var(--ddd-spacing-2, 8px);
          border-radius: var(--ddd-radius-sm, 4px);
          transition: background-color 0.2s ease;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-content {
          min-height: var(--ddd-spacing-20, 200px);
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          padding: var(--ddd-spacing-6, 24px);
        }

        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2, 8px);
          margin-bottom: var(--ddd-spacing-4, 16px);
        }

        .step-dot {
          width: var(--ddd-spacing-3, 12px);
          height: var(--ddd-spacing-3, 12px);
          border-radius: 50%;
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          transition: background-color 0.3s ease;
        }

        .step-dot.active {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
        }

        .step-dot.completed {
          background: var(--ddd-theme-default-futureLime, #99cc33);
        }

        .template-info {
          display: flex;
          gap: var(--ddd-spacing-4, 16px);
          margin-bottom: var(--ddd-spacing-4, 16px);
          padding: var(--ddd-spacing-3, 12px);
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          border-radius: var(--ddd-radius-sm, 4px);
          width: 100%;
          align-items: flex-start;
        }

        .template-image {
          flex-shrink: 0;
          width: 120px;
          height: 80px;
          border-radius: var(--ddd-radius-sm, 4px);
          overflow: hidden;
          border: var(--ddd-border-xs, 1px solid)
            var(--ddd-theme-default-slateGray, #666);
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
          font-size: var(--ddd-font-size-s, 16px);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          margin: 0 0 var(--ddd-spacing-2, 8px) 0;
        }

        .template-description {
          font-size: var(--ddd-font-size-xs, 14px);
          color: var(--ddd-theme-default-coalyGray, #444);
          margin: 0;
        }

        .form-group {
          width: 100%;
          margin-bottom: var(--ddd-spacing-4, 16px);
          position: relative;
        }

        .form-label {
          display: block;
          font-size: var(--ddd-font-size-xs, 14px);
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          margin-bottom: var(--ddd-spacing-2, 8px);
          text-align: left;
        }

        .form-input {
          width: 100%;
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-3, 12px)
            var(--ddd-spacing-3, 12px) var(--ddd-spacing-8, 32px);
          border: var(--ddd-border-sm, 2px solid)
            var(--ddd-theme-default-slateGray, #666);
          border-style: solid;
          border-width: var(--ddd-border-sm, 2px);
          border-radius: var(--ddd-radius-sm, 4px);
          border-color: var(--ddd-theme-default-slateGray, #666);
          font-size: var(--ddd-font-size-s, 16px);
          font-family: var(--ddd-font-primary, sans-serif);
          box-sizing: border-box;
          transition: all 0.2s ease;
          background-color: var(--ddd-theme-default-limestoneMaxLight, #f5f5f5);
          color: var(--ddd-theme-default-coalyGray, #222);
          min-height: var(--ddd-spacing-8, 32px);
        }

        .form-icon {
          position: absolute;
          left: var(--ddd-spacing-2, 8px);
          bottom: var(--ddd-spacing-4, 8px);
          font-size: var(--ddd-font-size-xs, 14px);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          pointer-events: none;
          z-index: 1;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        .form-input:focus {
          outline: none;
          border: var(--ddd-border-md, 2px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
        }

        .form-input:invalid {
          border-color: var(--ddd-theme-default-original87Pink, #e4007c);
        }

        .form-input:required:valid {
          border-color: var(--ddd-theme-default-futureLime, #99cc33);
        }

        .error-message {
          color: var(--ddd-theme-default-original87Pink, #e4007c);
          font-size: var(--ddd-font-size-xs, 12px);
          margin-top: var(--ddd-spacing-2, 8px);
          text-align: left;
        }

        .progress-container {
          width: 100%;
          margin: var(--ddd-spacing-4, 16px) 0;
        }

        .progress-text {
          font-size: var(--ddd-font-size-s, 16px);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          margin-bottom: var(--ddd-spacing-4, 16px);
        }

        .hat-progress-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: var(--ddd-spacing-4, 16px) 0;
          padding: 0 var(--ddd-spacing-4, 16px);
          min-height: 180px;
        }

        app-hax-simple-hat-progress {
          width: 160px;
          height: 160px;
          max-width: calc(100% - var(--ddd-spacing-8, 32px));
        }

        .progress-bar {
          width: 100%;
          height: var(--ddd-spacing-3, 12px);
          background: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          border-radius: var(--ddd-radius-sm, 4px);
          overflow: hidden;
          margin-bottom: var(--ddd-spacing-2, 8px);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            var(--ddd-theme-default-nittanyNavy, #001e44) 0%,
            var(--ddd-theme-default-futureLime, #99cc33) 100%
          );
          border-radius: var(--ddd-radius-sm, 4px);
          transition: width 0.5s ease;
          width: 0%;
        }

        .progress-percentage {
          font-size: var(--ddd-font-size-xs, 12px);
          color: var(--ddd-theme-default-coalyGray, #444);
        }

        promise-progress {
          display: none;
        }

        .success-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .success-hat-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: var(--ddd-spacing-2, 8px) 0;
        }

        .success-icon {
          font-size: var(--ddd-font-size-4xl, 48px);
          color: var(--ddd-theme-default-futureLime, #99cc33);
          margin-bottom: var(--ddd-spacing-4, 16px);
        }

        .success-title {
          font-size: var(--ddd-font-size-s, 16px);
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          margin: var(--ddd-spacing-2, 8px) 0 var(--ddd-spacing-1, 4px) 0;
        }

        .success-subtitle {
          font-size: var(--ddd-font-size-xs, 12px);
          color: var(--ddd-theme-default-coalyGray, #444);
          margin: 0 0 var(--ddd-spacing-2, 8px) 0;
          line-height: var(--ddd-lh-140, 1.4);
        }

        .button-group {
          display: flex;
          gap: var(--ddd-spacing-3, 12px);
          justify-content: center;
          margin-top: var(--ddd-spacing-4, 16px);
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
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .button-primary {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-white, white);
        }

        .button-primary:hover:not(:disabled),
        .button-primary:focus:not(:disabled) {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          outline: var(--ddd-border-sm, 2px solid)
            var(--ddd-theme-default-keystoneYellow, #ffd100);
          outline-offset: var(--ddd-spacing-1, 2px);
        }

        .button-secondary {
          background: transparent;
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          border: var(--ddd-border-sm, 2px solid)
            var(--ddd-theme-default-nittanyNavy, #001e44);
        }

        .button-secondary:hover:not(:disabled),
        .button-secondary:focus:not(:disabled) {
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-white, white);
          outline: var(--ddd-border-sm, 2px solid)
            var(--ddd-theme-default-nittanyNavy, #001e44);
          outline-offset: var(--ddd-spacing-1, 2px);
        }

        .button-success {
          background: var(--ddd-theme-default-futureLime, #99cc33);
          color: var(--ddd-theme-default-white, white);
        }

        .button-success:hover:not(:disabled),
        .button-success:focus:not(:disabled) {
          background: var(--ddd-theme-default-original87Pink, #e4007c);
          outline: var(--ddd-border-sm, 2px solid)
            var(--ddd-theme-default-original87Pink, #e4007c);
          outline-offset: var(--ddd-spacing-1, 2px);
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
          animation-delay: -0.5s;
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

        @media (max-width: 600px) {
          web-dialog {
            --dialog-width: 95vw;
            --dialog-max-height: 90vh;
          }

          .modal-content {
            padding: var(--ddd-spacing-4, 16px);
          }

          .button-group {
            flex-direction: column;
            gap: var(--ddd-spacing-2, 8px);
            margin-top: var(--ddd-spacing-3, 12px);
          }

          .button {
            width: 100%;
            min-height: var(--ddd-spacing-10, 40px);
            font-size: var(--ddd-font-size-xs, 14px);
            padding: var(--ddd-spacing-3, 12px);
          }

          app-hax-simple-hat-progress {
            width: 120px;
            height: 120px;
          }

          .hat-progress-container {
            padding: 0 var(--ddd-spacing-2, 8px);
            min-height: 140px;
          }

          .modal-title {
            font-size: var(--ddd-font-size-s, 16px);
          }

          .form-input {
            min-height: var(--ddd-spacing-10, 40px);
            font-size: var(--ddd-font-size-s, 16px);
          }
        }
      `,
    ];
  }

  openModal() {
    this.open = true;
    this.currentStep = 1;
    // Preserve any prepopulated siteName from the caller; default to empty string
    this.siteName = this.siteName || "";
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
      }

      // Focus the input after the modal opens
      setTimeout(() => {
        const input =
          this.shadowRoot && this.shadowRoot.querySelector(".form-input");
        if (input) {
          input.focus();
          // Select the full value so it's easy to overwrite via keyboard
          if (typeof input.select === "function") {
            input.select();
          }
        }
      }, 100);
    });
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

  handleModalClosed(e) {
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
      this.errorMessage = "Site name is required";
      return false;
    }
    if (name.length < 3) {
      this.errorMessage = "Site name must be at least 3 characters";
      return false;
    }
    if (name.length > 50) {
      this.errorMessage = "Site name must be less than 50 characters";
      return false;
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      this.errorMessage =
        "Site name can only contain letters, numbers, spaces, hyphens, and underscores";
      return false;
    }
    this.errorMessage = "";
    return true;
  }

  async createSite() {
    if (!this.validateSiteName()) {
      return;
    }

    // Set up the site data in store for the API call
    store.site.name = this.siteName;
    // If skeleton data exists, use its build configuration
    if (this.skeletonData && this.skeletonData.build) {
      store.site.structure =
        this.skeletonData.build.structure || "from-skeleton";
      store.site.type = this.skeletonData.build.type || "skeleton";
      // Pass skeleton items and files to store for API formatting
      if (this.skeletonData.build.items) {
        store.items = this.skeletonData.build.items;
      }
      if (this.skeletonData.build.files) {
        store.itemFiles = this.skeletonData.build.files;
      }
    } else {
      store.site.structure = this.themeElement || "website";
      store.site.type = "own";
      store.items = null;
      store.itemFiles = null;
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
        this.errorMessage = "Failed to create site. Please try again.";
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

  promiseProgressFinished(e) {
    if (e.detail.value) {
      // Site creation completed successfully!
      const createResponse = store.AppHaxAPI.lastResponse.createSite.data;

      // Set the real site URL from the API response
      if (createResponse && createResponse.slug) {
        this.siteUrl = createResponse.slug.replace("index.html", "");
      } else {
        // Fallback URL if API doesn't return proper response
        const siteSlug = this.siteName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-");
        this.siteUrl = siteSlug;
      }

      // Success!
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
          this.shadowRoot.querySelector(".button.button-success");
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
    return html`
      <div class="step-indicator">
        ${[1, 2].map(
          (step) => html`
            <div
              class="step-dot ${this.currentStep > step
                ? "completed"
                : this.currentStep === step
                  ? "active"
                  : ""}"
            ></div>
          `,
        )}
      </div>
    `;
  }

  renderNamingStep() {
    return html`
      <div class="template-info">
        ${this.source
          ? html`
              <div class="template-image">
                <img src="${this.source}" alt="${this.title} preview" />
              </div>
            `
          : ""}
        <div class="template-details">
          <h3 class="template-title">${this.title}</h3>
          <p class="template-description">${this.description}</p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="siteName">Site Name</label>
        <simple-icon-lite
          class="form-icon"
          icon="icons:create"
        ></simple-icon-lite>
        <input
          id="siteName"
          class="form-input"
          type="text"
          .value="${this.siteName}"
          @input="${(e) => {
            this.siteName = e.target.value;
            this.validateSiteName();
          }}"
          @keydown="${this.handleKeyDown}"
          placeholder="Enter your site name..."
          maxlength="50"
          required
        />
        ${this.errorMessage
          ? html` <div class="error-message">${this.errorMessage}</div> `
          : ""}
      </div>
    `;
  }

  renderNamingButtons() {
    return html`
      <div class="button-group">
        <button
          class="button button-primary"
          @click="${this.createSite}"
          ?disabled="${!this.siteName.trim() || this.errorMessage}"
        >
          <simple-icon-lite icon="icons:add-circle"></simple-icon-lite>
          Create Site
        </button>
        <button class="button button-secondary" @click="${this.closeModal}">
          Cancel
        </button>
      </div>
    `;
  }

  renderCreatingStep() {
    return html`
      <div class="progress-container">
        <p class="progress-text">Creating your site...</p>

        <div class="hat-progress-container">
          <app-hax-simple-hat-progress
            .progress="${this.creationProgress}"
            .max="100"
          ></app-hax-simple-hat-progress>
        </div>

        <promise-progress
          id="promise-progress"
          .list="${this.promises}"
          @value-changed="${this.progressValueChanged}"
          @max-changed="${this.progressMaxChanged}"
          @promise-progress-finished="${this.promiseProgressFinished}"
        ></promise-progress>

        <div class="progress-bar">
          <div
            class="progress-fill"
            style="width: ${this.creationProgress}%"
          ></div>
        </div>
        <div class="progress-percentage">
          ${this.creationProgress}% complete
        </div>
      </div>
    `;
  }

  renderSuccessStep() {
    return html`
      <div class="success-content">
        <div class="success-hat-container">
          <app-hax-simple-hat-progress
            .progress="${this.creationProgress || 100}"
            .max="100"
          ></app-hax-simple-hat-progress>
        </div>
        <h2 class="success-title">Site Created Successfully!</h2>
        <p class="success-subtitle">
          Your new site "${this.siteName}" is ready to use.
        </p>
      </div>
    `;
  }

  renderSuccessButtons() {
    return html`
      <div class="button-group">
        <button class="button button-secondary" @click="${this.closeModal}">
          <simple-icon-lite icon="icons:home"></simple-icon-lite>
          Stay Here
        </button>
        <button class="button button-success" @click="${this.goToSite}">
          <simple-icon-lite icon="icons:launch"></simple-icon-lite>
          Go to Site
        </button>
      </div>
    `;
  }

  render() {
    return html`
      <web-dialog
        .open="${this.open}"
        center
        @close="${this.handleModalClosed}"
      >
        <div class="modal-header">
          <h2 class="modal-title">
            ${this.currentStep === 1
              ? "Create New Site"
              : this.currentStep === 2
                ? "Creating Site..."
                : "Site Created!"}
          </h2>
          <button
            class="close-button"
            @click="${this.closeModal}"
            ?disabled="${this.isCreating}"
            aria-label="Close modal"
          >
            <simple-icon-lite icon="icons:close"></simple-icon-lite>
          </button>
        </div>

        <div class="modal-content">
          ${this.showConfetti ? html`<div class="confetti"></div>` : ""}
          ${this.renderStepIndicator()}
          ${this.currentStep === 1
            ? this.renderNamingStep()
            : this.currentStep === 2
              ? this.renderCreatingStep()
              : this.renderSuccessStep()}
          ${this.currentStep === 1
            ? this.renderNamingButtons()
            : this.currentStep === 3
              ? this.renderSuccessButtons()
              : html``}
        </div>
      </web-dialog>
    `;
  }
}

customElements.define(AppHaxSiteCreationModal.tag, AppHaxSiteCreationModal);
