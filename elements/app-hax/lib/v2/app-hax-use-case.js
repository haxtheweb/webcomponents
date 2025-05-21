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
    this.title = '';
    this.description = '';
    this.source = '';
    this.demoLink = '';
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
        isSelected: { type: Boolean , reflect: true},
        showContinue: { type: Boolean }
    };
  }

  updated(changedProperties) {
    
  }

  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          text-align: left;
          max-width: 240px;
          margin:12px;
          font-family: var(--ddd-font-primary);
          color: var(--ddd-theme-default-nittanyNavy);
          background-color: white;
          min-height: 270px;
          box-shadow: 2px 2px 12px #1c1c1c;
          border-radius: 8px;
        }
        .cardContent {
          padding: 12px 16px 20px;
        }
        .image img {
          width: 240px;
          height: 142px;
          border-top-right-radius: 8px;
          border-top-left-radius: 8px;
          border-bottom: solid var(--ddd-theme-default-nittanyNavy) 12px;
          overflow: clip;
          justify-self: center;
        }
        .image {
          position: relative;
          display: inline-block;
        }
        .icons {
          position: absolute;
          bottom: 18px;
          left: 10px;
          display: flex;
          gap: 6px;
          z-index: 10;
        }
        .icon-wrapper {
          position: relative;
          width: 32px;
          height: 32px;
          flex-shrink: 0; 
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-wrapper::before {
          content: '';
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
        h3, p {
          margin: 2px;
        }
        p {
          font-size: 12px;
        }
        a:link {
          color: var(--ddd-theme-defaut-skyBlue);
          text-decoration: none;
          font-family: var(--ddd-font-primary);
          font-size: 16px;
        }
        button {
          display: flex;
          background-color: #005fa9;
          color: white;
          border: 0px;
          border-radius: 4px;
          font-family: var(--ddd-font-primary);
          font-size: 12px;
          font-weight: 20px;
          padding: 12px 16px 12px 24px;
          margin: 0px 4px 0px 4px;
          height: 16px;
          align-items: center;
          justify-content: center;
        }
        button:hover {
          background-color: var(--ddd-theme-default-nittanyNavy);
        }
        .cardBottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          padding: 0px 16px 20px 16px;
        }

        .cardBottom button, .cardBottom a {
          flex: 1;
          margin: 0 4px;
        }
        .cardBottom a:visited {
          color: var(--simple-colors-default-theme-light-blue-9);
        }
        
        :host([isSelected]) button.select {
          background-color: var(--ddd-theme-default-nittanyNavy);
        }
        .titleBar {
          display: inline-flex;
          flex-direction: column;
          text-align: left;
          padding: 0px 16px;
        }
        @media (max-width: 1440px) {
          :host, .image img {
            display: flex;
            width: 250px;
            max-width: 20vw;
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
    this.dispatchEvent(new CustomEvent('toggle-display', { 
      detail: { isSelected: this.isSelected },
      bubbles: true,
      composed: true
   }));
  }

  continueAction() {
    if (confirm("Are you sure?")) {
      this.dispatchEvent(new CustomEvent('continue-action'));
    }
    
  }

  render() {
    return html`
    <div class="card">
      <div class="image">
        <a id="demo" href="${this.demoLink}" target="_blank"></a>
        <img src="${this.source}" alt="${this.title}">
        <div class="icons">
          ${this.iconImage.map(
            (icon) => html`
              <div class="icon-wrapper">
                <simple-icon-lite icon="${icon.icon}"></simple-icon-lite>
              </div>
            `
          )}
          <div class="tooltip-container">
            ${this.iconImage.map(
              (icon) => html`
                <div class="tooltip-row">
                  <simple-icon-lite class="tooltip-icon" icon="${icon.icon}"></simple-icon-lite>
                  <div class="tooltip">${icon.tooltip}</div>
                </div>
              `
            )}
          </div>
        </div>
      </div>
        <div class="titleBar">
          <h3 style="font-size: 20px;">${this.title}</h3>
          <p>${this.description}</p>
        </div>
        <div class="cardBottom"> 
          <button class="select ${this.isSelected ? 'selected' : ''}" @click=${this.toggleDisplay}>
            ${this.isSelected ? 'Selected' : 'Select'}
          </button>
          ${this.isSelected 
            ? html`<button class="continue" @click=${this.continueAction}>Continue?</button>`
            : html`<a id="demo" href="${this.demoLink}" target="_blank">Demo -> </a>`
          }
        </div>
        
      </div>
    `;
  }

}
customElements.define(AppHaxUseCase.tag, AppHaxUseCase);
