/* eslint-disable no-return-assign */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";

export class AppHaxFilterTag extends LitElement {

  static get tag() {
    return "app-hax-filter-tag";
  }

  constructor() {
    super();
    this.label = '';
    
  }

  static get properties() {
    return {
        label: { type: String },
       
    };
  }

  updated(changedProperties) {
    
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-flex;
          font-family: var(--ddd-font-primary);
          color: var(--simple-colors-default-theme-grey-1, var(--accent-color));
          padding-left: 8px;
          padding-right: 8px;
          height: 32px;
          background-color: var(--app-hax-accent-color, var(--accent-color));
          border-radius: 8px;
          font-size: 16px;
          align-items: center;
          justify-content: flex-start;
        }
        div {
          display: flex;
          align-items: center;
        }
        .remove {
          cursor: pointer;
          margin-left: 6px;
          font-weight: bold;
          display: inline-block;
        }
      `,
    ];
  }

  removeTag() {
    this.dispatchEvent(new CustomEvent("remove-tag", { detail: this.label, bubbles: true, composed: true }));
  }

  render() {
    return html`
    <div>
      <h4>${this.label}</h4>
      <span class="remove" @click="${this.removeTag}">✖</span>
      
    </div>
      
    `;
  }

}
customElements.define(AppHaxFilterTag.tag, AppHaxFilterTag);
