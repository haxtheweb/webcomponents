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
        isSelected: { type: Boolean },
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
          max-width: 240px;
          margin:16px;
          font-family: var(--ddd-font-primary);
          color: var(--simple-colors-default-theme-light-blue-12, var(--accent-color));
          background-color: var(--simple-colors-default-theme-light-blue-1, var(--accent-color));
          padding:  4px;
          min-height: 270px;
          border: solid var(--simple-colors-default-theme-light-blue-12, var(--accent-9)) 8px;
          box-shadow: var(--ddd-boxShadow-md);
          text-align: center;
        }
        .image img{
          display: block;
          width: 220px;
          height: 200px;
          overflow: clip;
          justify-self: center;
        }
        h3, p {
          margin: 8px;
        }
        p {
          font-size: 12px;
        }
        a:link {
          color: var(--ddd-theme-defaut-slateMaxLight);
          text-decoration: none;
          font-size: 16px;
        }
        button {
          display: flex;
          background-color: #D9D9D9;
          font-family: 'Press Start 2P';
          font-size: 8px;
          padding: 8px;
          margin: 0px 2px 0px 2px;
          height: 16px;
          align-items: center;
          justify-content: center;
        }
        #haxIcons {
        position: absolute; 
        bottom: var(--ddd-spacing-2); 
        left: var(--ddd-spacing-2); 
        padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
        opacity: 0.8;
        gap: var(--ddd-spacing-3);
        color: var(--ddd-primary-8);
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
        </div>
          <h3 style="font-family: 'Press Start 2P'; font-size: 16px;">${this.title}</h3>
          <p>${this.description}</p>
          ${this.iconImage.map(
          (icon) => html`
            <simple-icon-lite
              icon="${icon.icon}" 
              title="${icon.tooltip || ''}" 
            ></simple-icon-lite>
          `
          )}
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
      </div>
    `;
  }

}
customElements.define(AppHaxUseCase.tag, AppHaxUseCase);
