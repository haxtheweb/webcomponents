import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./AppHaxStore.js";
import { HaxUiAdminTokens } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";

export class AppHaxUseCase extends I18NMixin(LitElement) {
  static get tag() {
    return "app-hax-use-case";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      untitledTemplate: "Untitled template",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.title = "";
    this.description = "";
    this.source = "";
    this.demoLink = "";
    this.iconImage = [];
    this.isSelected = false;
    this.showContinue = false;
  }

  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      source: { type: String },
      demoLink: { type: String },
      iconImage: { type: Array },
      isSelected: { type: Boolean, reflect: true },
      showContinue: { type: Boolean },
    };
  }

  static get styles() {
    return [
      ...HaxUiAdminTokens,
      css`
        /* the same record card as a site on the dashboard (HAX UI admin
           layer); the whole card is the button, and it reads as selected
           while its create dialog is open */
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0;
          --app-hax-use-case-card-width: 180px;
          --app-hax-use-case-card-height: auto;
          --app-hax-use-case-image-height: auto;
          --app-hax-use-case-title-font-size: var(--hax-ui-admin-font-size);
          text-align: left;
          font-family: var(--hax-ui-admin-font-family);
          color: var(--hax-ui-text);
          cursor: pointer;
        }

        .card {
          display: flex;
          flex-direction: column;
          padding: 0;
          height: var(--app-hax-use-case-card-height);
          width: var(--app-hax-use-case-card-width);
          background-color: var(--hax-ui-surface);
          color: inherit;
          font: inherit;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          overflow: hidden;
          text-align: left;
          cursor: pointer;
          transition:
            border-color var(--hax-ui-duration) var(--hax-ui-easing),
            box-shadow var(--hax-ui-duration) var(--hax-ui-easing),
            background-color var(--hax-ui-duration) var(--hax-ui-easing);
        }

        .card:hover {
          border-color: var(--hax-ui-line-strong);
          box-shadow: var(--hax-ui-shadow-popover);
        }

        .card:focus-visible {
          border-color: var(--hax-ui-accent-strong);
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }

        :host([isselected]) .card {
          border: 2px solid var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-selected);
        }

        /* every card is the same shape: a 4:3 preview, so a tall theme
           screenshot is cropped to its top instead of stretching the card
           (overflow: hidden stops aspect-ratio growing to fit the image) */
        .image {
          height: var(--app-hax-use-case-image-height);
          aspect-ratio: 4 / 3;
          overflow: hidden;
          min-height: 0;
          flex-shrink: 0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--hax-ui-gap-md);
          box-sizing: border-box;
          border-bottom: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-sunken);
        }

        .image img,
        .image-placeholder {
          width: 100%;
          height: 100%;
          border-radius: var(--hax-ui-radius);
        }

        .image img {
          object-fit: cover;
          display: block;
          object-position: top left;
        }

        .image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--hax-ui-text-muted);
        }

        @media (prefers-reduced-motion: reduce) {
          .card {
            transition: none;
          }
        }

        /* Icons */
        .icons {
          position: absolute;
          bottom: 14px;
          left: 8px;
          display: flex;
          gap: 4px;
          z-index: 10;
        }

        .icon-wrapper {
          position: relative;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-wrapper::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        simple-icon-lite {
          color: var(--hax-ui-text-muted);
          --simple-icon-width: var(--ddd-icon-4xs, 20px);
          --simple-icon-height: var(--ddd-icon-4xs, 20px);
        }

        .image-placeholder simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-xl, 64px);
          --simple-icon-width: var(--ddd-icon-xl, 64px);
        }

        /* Tooltip */
        .tooltip-container {
          display: none;
          position: absolute;
          top: 32px;
          left: 0;
          flex-direction: column;
          width: max-content;
          padding: 8px;
          background-color: white;
          color: black;
          border-radius: 6px;
          box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 6px;
          z-index: 20;
        }

        .icons:hover .tooltip-container {
          display: block;
        }

        .tooltip-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 8px;
          border-bottom: 1px solid #ccc;
        }

        .tooltip-row:last-child {
          border-bottom: none;
        }

        .tooltip {
          font-size: 12px;
          white-space: nowrap;
        }

        .tooltip-icon {
          width: 20px;
          height: 20px;
        }

        /* Links */
        a:link {
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-3xs, 11px);
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          text-decoration: underline;
          transition: color var(--ddd-duration-normal, 0.3s) ease-in-out;
        }

        a:visited {
          color: var(--ddd-theme-default-slateGray, #666);
        }

        a:hover,
        a:focus {
          color: var(--ddd-theme-default-keystoneYellow, #ffd100);
          text-decoration: none;
        }

        /* Title */
        .title {
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: var(--hax-ui-gap-md) 10px;
        }

        .title h3 {
          font-size: var(--app-hax-use-case-title-font-size);
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.3;
          height: calc(1.3em * 2);
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin: 2px 0 0 0;
        }

        /* Responsive */
        @media (max-width: 780px) {
          :host {
            margin: 0;
            min-height: auto;
            width: auto;
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          :host {
            --app-hax-use-case-card-width: clamp(120px, 30vw, 144px);
          }
        }
      `,
    ];
  }

  toggleDisplay() {
    this.isSelected = !this.isSelected;
    this.showContinue = this.isSelected;

    this.dispatchEvent(
      new CustomEvent("toggle-display", {
        detail: { isSelected: this.isSelected },
        bubbles: true,
        composed: true,
      }),
    );

    // If selected, immediately trigger the continue action to open modal
    if (this.isSelected) {
      setTimeout(() => {
        this.continueAction();
      }, 100); // Small delay to allow state to update
    }
  }

  continueAction() {
    this.dispatchEvent(
      new CustomEvent("continue-action", {
        detail: {
          title: this.title,
          description: this.description,
          source: this.source,
          template: this.title, // Using title as template identifier
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  openDemo() {
    if (this.demoLink) {
      globalThis.open(this.demoLink, "_blank");
    }
  }

  render() {
    const hasSource =
      this.source &&
      typeof this.source === "string" &&
      this.source.trim() !== "";
    const safeTitle =
      this.title && typeof this.title === "string" && this.title.trim() !== ""
        ? this.title.trim()
        : this.t.untitledTemplate;
    const cardLabel =
      this.description &&
      typeof this.description === "string" &&
      this.description.trim() !== ""
        ? `${safeTitle}: ${this.description.trim()}`
        : safeTitle;

    const primaryIcon =
      Array.isArray(this.iconImage) &&
      this.iconImage[0] &&
      this.iconImage[0].icon
        ? this.iconImage[0].icon
        : "icons:cloud-download";

    return html`
      <button
        class="card"
        @click="${this.toggleDisplay}"
        aria-label="${cardLabel}"
        aria-pressed="${this.isSelected ? "true" : "false"}"
      >
        <div class="image">
          ${
            hasSource
              ? html`<img
                  src="${this.source}"
                  alt="${safeTitle}"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="high"
                />`
              : html`<div class="image-placeholder" aria-hidden="true">
                  <simple-icon-lite icon="${primaryIcon}"></simple-icon-lite>
                </div>`
          }
        </div>
        <div class="title">
          <h3>${safeTitle}</h3>
        </div>
      </button>
    `;
  }
}
customElements.define(AppHaxUseCase.tag, AppHaxUseCase);
