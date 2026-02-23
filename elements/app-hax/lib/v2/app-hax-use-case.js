/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { store } from "./AppHaxStore.js";

export class AppHaxUseCase extends LitElement {
  static get tag() {
    return "app-hax-use-case";
  }

  constructor() {
    super();
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
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0;
        text-align: left;
        font-family: var(--ddd-font-primary);
        color: light-dark(
          var(--ddd-theme-default-nittanyNavy),
          var(--ddd-theme-default-white)
        );
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .card:hover .image,
      .card:focus .image,
      .card:focus-within .image {
        transform: translateY(-2px) scale(1.02);
        border: var(--ddd-border-lg);
        box-shadow: light-dark(
          4px 8px 24px rgba(28, 28, 28, 0.15),
          4px 8px 24px rgba(0, 0, 0, 0.5)
        );
        border-color:var(--ddd-theme-default-beaverBlue);
        outline: none;
      }

      :host([dark]) .card:hover .image,
      :host([dark]) .card:focus .image,
      :host([dark]) .card:focus-within .image {
        border-color: var(--ddd-theme-default-skyBlue);
      }

      /* Layout Containers */
      .card {
        outline: none;
        display: flex;
        flex-direction: column;
        padding: 4px;
        height: 300px;
        width: 180px;
        background-color: transparent;
        border: none;
        text-align: left;
      }

      .image {
        transition: transform 0.2s ease-in-out;
        height: 240px; 
        flex-shrink: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border: var(--ddd-border-xs);
        border-color: var(--ddd-theme-default-slateGray, #c4c4c4);
        box-shadow: light-dark(
          0 1px 3px rgba(28, 28, 28, 0.1),
          0 1px 3px rgba(0, 0, 0, 0.3)
        );
        background-color: white;
      }

      .image img,
      .image-placeholder {
        width: 85%;
        height: 85%;
      }

      .image img {
        object-fit: cover;
        display: block;
      }

      .image-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        
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
        color: var(--ddd-theme-default-nittanyNavy, #001e44);
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
        transition: color 0.2s ease;
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
        padding: 4px var(--ddd-spacing-1, 4px) 0;
      }

      .title h3 {
        font-size: var(--ddd-font-size-4xs, 14px);
        line-height: 1.2;
        height: calc(1.2em * 2); 
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        margin: 2px 0 0 0;
      }

      /* Responsive */
      @media (max-width: 780px) {
        :host {
          margin: var(--ddd-spacing-1, 4px);
          min-height: 200px;
          width: 100%;
          max-width: none;
        }

        .card {
          padding: var(--ddd-spacing-2, 8px)
            var(--ddd-spacing-3, 12px)
            var(--ddd-spacing-4, 16px);
        }

        .title {
          font-size: var(--ddd-font-size-s, 16px) !important;
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

    const primaryIcon =
      Array.isArray(this.iconImage) &&
      this.iconImage[0] &&
      this.iconImage[0].icon
        ? this.iconImage[0].icon
        : "icons:cloud-download";

    return html`
      <button class="card" @click="${this.toggleDisplay}">
        <div class="image">
          ${hasSource
            ? html`<img src="${this.source}" alt="${this.title}" />`
            : html`<div class="image-placeholder" aria-hidden="true">
                <simple-icon-lite icon="${primaryIcon}"></simple-icon-lite>
              </div>`}
        </div>
        <div class="title">
          <h3>${this.title}</h3>
        </div>
      </button>
    `;
  }
}
customElements.define(AppHaxUseCase.tag, AppHaxUseCase);
