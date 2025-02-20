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
  }

  static get properties() {
    return {
        id: { type: String },
        tag: { type: String },
        title: { type: String },
        description: { type: String },
        source: { type: String },
        demoLink: { type: String },
        iconImage: {type: Array }
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
          margin:20px;
          font-family: var(--ddd-font-primary);
          background-color: var(--ddd-theme-default-white);
          padding:  4px;
          min-height: 270px;
          border: solid var(--ddd-theme-default-limestoneGray) 1px;
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-boxShadow-md);
          text-align: center;
        }
        .image img{
          display: block;
          width: 220px;
          height: 200px;
          overflow: clip;
          justify-self: center;
          border-radius: 4px;
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
        }
        button {
          display: flex;
          font-size: 10px;
          padding: 8px;
          margin: 0px 2px 0px 2px;
          height: 16px;
          border-radius: var(--ddd-radius-xs);
          align-items: center;
          justify-content: center;
          color: white;
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
      `,
    ];
  }

  render() {
    return html`
      <div class="card">
        <div class="image">
          <a href="${this.demoLink}" target="_blank">
          <img src="${this.source}" alt="${this.title}" ></a>
        </div>
          <h3>${this.title}</h3>
          <p>${this.description}</p>
          <div style="background-color: transparent; display: flex; padding: 8px;" class="haxIcons">
            ${this.iconImage.map(
            (icon) => html`
              <simple-icon-lite
                icon="${icon.icon}" 
                title="${icon.tooltip || ''}" 
              ></simple-icon-lite>
            `
            )}
          </div>
          <div style="background-color: transparent; display: flex; padding: 8px;" class="cardBottom"> 
            <button class="select ${this.isSelected ? 'selected' : ''}" @click=${this.toggleDisplay}>${this.isSelected ? 'Selected' : 'Select'}</button>
            <button class="continue ${this.isSelected ? 'visible' : ''}" @click=${this.continueAction}>Continue</button>
            <a href="${this.demoLink}" target="_blank" style="text-align: end;"><p class="bottomRightText">Demo></p></a>
          </div>
          <div id = "haxIcons">
              <simple-icon-lite
                icon="${icon.icon}" 
                title="${icon.tooltip || ''}" 
              ></simple-icon-lite>
          </div>
        </div>
      </div>
    `;
  }

}
customElements.define(AppHaxUseCase.tag, AppHaxUseCase);
