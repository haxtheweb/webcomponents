/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
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

  updated(changedProperties) {}

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          text-align: left;
          margin: 4px;
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
          box-shadow: light-dark(
            0px 1px 3px rgba(0, 0, 0, 0.1),
            0px 1px 3px rgba(0, 0, 0, 0.2)
          );
          border-radius: var(--ddd-radius-sm, 4px);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        :host(:hover),
        :host(:focus-within) {
          transform: translateY(-2px) scale(1.02);
          border-color: light-dark(
            var(--ddd-theme-default-keystoneYellow, #ffd100),
            var(--ddd-theme-default-keystoneYellow, #ffd100)
          );
          box-shadow: light-dark(
            4px 8px 24px rgba(28, 28, 28, 0.15),
            4px 8px 24px rgba(0, 0, 0, 0.5)
          );
        }
        .cardContent {
          padding: 8px 12px 16px;
        }
        .image img {
          border-top-right-radius: 6px;
          border-top-left-radius: 6px;
          border-bottom: solid var(--ddd-theme-default-nittanyNavy) 8px;
          overflow: clip;
          justify-self: center;
        }
        .image {
          position: relative;
          display: inline-block;
        }
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
        .tooltip-container {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 32px;
          left: 0; /* Align with first icon */
          background-color: white;
          color: black;
          padding: 8px;
          border-radius: 6px;
          box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 6px;
          width: max-content;
          z-index: 20;
        }
        .tooltip {
          font-size: 12px;
          padding: 4px 8px;
          border-bottom: 1px solid #ccc;
          text-align: left;
          white-space: nowrap;
        }
        .tooltip:last-child {
          border-bottom: none;
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

        .tooltip-icon {
          width: 20px;
          height: 20px;
        }
        h3 {
          font-size: var(--ddd-font-size-4xs);
        }
        p {
          font-size: var(--ddd-font-size-4xs);
          padding: 0;
          margin: 0;
        }
        a:link {
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          text-decoration: underline;
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-3xs, 11px);
          font-weight: var(--ddd-font-weight-medium, 500);
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        a:visited {
          color: var(--ddd-theme-default-slateGray, #666);
        }

        a:hover,
        a:focus {
          color: var(--ddd-theme-default-keystoneYellow, #ffd100);
          text-decoration: none;
        }
        simple-icon-lite {
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          --simple-icon-width: var(--ddd-icon-4xs, 20px);
          --simple-icon-height: var(--ddd-icon-4xs, 20px);
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
          margin: 0px var(--ddd-spacing-1, 4px);
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
        button:focus,
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

        .cardBottom button,
        .cardBottom a {
          flex: 1;
          margin: 0 2px;
          min-width: 0;
          font-size: var(--ddd-font-size-3xs, 11px);
        }

        :host([isSelected]) button.select {
          background-color: var(--ddd-theme-default-nittanyNavy);
        }
        .titleBar {
          display: inline-flex;
          flex-direction: column;
          text-align: left;
          padding: 0px var(--ddd-spacing-3, 12px);
        }
        .titleBar h3 {
          margin: 0;
          font-size: var(--ddd-font-size-4xs, 14px);
          height: var(--ddd-spacing-6, 24px);
          overflow: hidden;
        }
        .titleBar p {
          font-size: var(--ddd-font-size-4xs, 12px);
          line-height: 1.4;
          height: var(--ddd-spacing-12, 48px);
          overflow: hidden;
        }
        @media (max-width: 768px) {
          :host {
            margin: var(--ddd-spacing-1, 4px);
            min-height: 200px;
            width: 100%;
            max-width: none;
          }
          .image img {
            width: 100%;
            max-width: none;
          }
          .cardContent {
            padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px)
              var(--ddd-spacing-4, 16px);
          }
          .titleBar {
            padding: 0px var(--ddd-spacing-3, 12px);
          }
          .cardBottom {
            gap: var(--ddd-spacing-2, 8px);
            padding: 0px var(--ddd-spacing-3, 12px) var(--ddd-spacing-4, 16px)
              var(--ddd-spacing-3, 12px);
          }
          .cardBottom button,
          .cardBottom a {
            font-size: var(--ddd-font-size-3xs, 12px);
            padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
            min-height: var(--ddd-spacing-8, 32px);
            margin: 0;
          }
          h3 {
            font-size: var(--ddd-font-size-s, 16px) !important;
            margin: var(--ddd-spacing-2, 8px) 0;
          }
          p {
            font-size: var(--ddd-font-size-xs, 14px);
            line-height: 1.4;
          }
        }

        @media (min-width: 769px) {
          :host,
          .image img {
            display: flex;
            width: 220px;
          }
          :host .collapseFilter {
            display: flex;
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
    return html`
      <div class="card" @click="${this.toggleDisplay}">
        <div class="image">
          <img src="${this.source}" alt="${this.title}" />
          <div class="icons">
            ${this.iconImage.map(
              (icon) => html`
                <div class="icon-wrapper">
                  <simple-icon-lite icon="${icon.icon}"></simple-icon-lite>
                </div>
              `,
            )}
            <div class="tooltip-container">
              ${this.iconImage.map(
                (icon) => html`
                  <div class="tooltip-row">
                    <simple-icon-lite
                      class="tooltip-icon"
                      icon="${icon.icon}"
                    ></simple-icon-lite>
                    <div class="tooltip">${icon.tooltip}</div>
                  </div>
                `,
              )}
            </div>
          </div>
        </div>
        <div class="titleBar">
          <h3>${this.title}</h3>
          <p>${this.description}</p>
        </div>
        <div class="cardBottom">
          <button
            class="select ${this.isSelected ? "selected" : ""}"
          >
            ${this.isSelected ? "Selected" : "Select"}
          </button>
          <!-- https://github.com/haxtheweb/issues/issues/2527
          ${!this.isSelected
            ? html`<button class="demo" @click=${() => this.openDemo()}>
                Demo
              </button>`
            : ""}
            -->
        </div>
      </div>
    `;
  }
}
customElements.define(AppHaxUseCase.tag, AppHaxUseCase);
