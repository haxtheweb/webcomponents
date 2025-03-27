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
          text-align: flex-start;
          max-width: 240px;
          margin:16px;
          font-family: var(--ddd-font-primary);
          color: var(--ddd-theme-default-nittanyNavy);
          background-color: white;
          min-height: 270px;
          box-shadow: var(--ddd-boxShadow-md);
          border-radius: 8px;
        }
        .image img {
          width: 100%;
          border-top-right-radius: 8px;
          border-top-left-radius: 8px;
          height: 125px;
          border-bottom: solid var(--ddd-theme-default-nittanyNavy) 12px;
          overflow: clip;
          justify-self: center;
        }
        .image {
          position: relative;
          display: inline-block;
        }
        #haxicons {
          position: absolute; 
          bottom: var(--ddd-spacing-2); 
          left: var(--ddd-spacing-2); 
          padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
          opacity: 0.8;
          gap: var(--ddd-spacing-3);
          color: var(--ddd-primary-8);
          position: absolute;
          width: 40px; /* Adjust size as needed */
          display: flex;
        }
        .icons {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }
        .icon-wrapper {
          position: relative;
        }
        .tooltip-container {
          display: none;
          flex-direction: column;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          color: black;
          padding: 8px;
          border-radius: 6px;
          box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 6px;
          width: max-content;
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
        h3, p {
          margin: 8px;
        }
        p {
          font-size: 12px;
        }
        a:link {
          color: var(--ddd-theme-defaut-skyBlue);
          text-decoration: none;
          font-family: var(--ddd-font-primary);
          font-size: 12px;
        }
        button {
          display: flex;
          background-color: white;
          color: var(--ddd-theme-default-nittanyNavy);
          border: 2px solid var(--ddd-theme-default-nittanyNavy);
          border-radius: 4px;
          font-family: var(--ddd-font-primary);
          font-size: 12px;
          font-weight: 20px;
          padding: 8px;
          margin: 0px 2px 0px 2px;
          height: 16px;
          align-items: center;
          justify-content: center;
        }
        .cardBottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        }

        .cardBottom button, .cardBottom a {
        flex: 1;
        margin: 0 4px;
        }
        .cardBottom a:visited {
          color: var(--simple-colors-default-theme-light-blue-9);
        }
        
        :host([isSelected]) button.select {
          background-color: var(--simple-colors-default-theme-light-blue-12, --accent-color);
          color: var(--simple-colors-default-theme-light-blue-1, --accent-color);
        }
        .titleBar {
          display: inline-flex;
          align-items: center;
          text-align: flex-start;
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
    this.dispatchEvent(new CustomEvent('continue-action'));
  }

  render() {
    return html`
      <div class="card">
        <div class="image">
          <a id="demo" href="${this.demoLink}" target="_blank"></a>
          <img src="${this.source}" alt="${this.title}" ></a>
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
                (icon) => html`<div class="tooltip">${icon.tooltip}</div>`
              )}
            </div>
          </div>
        </div>
        <div class="titleBar">
          <h3 style="font-size: 20px;">${this.title}</h3>
        </div>
          
        <p>${this.description}</p>
          
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
