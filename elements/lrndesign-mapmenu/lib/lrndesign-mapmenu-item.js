import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
class LrndesignMapmenuItem extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --lrndesign-mapmenu-item-height: 16px;
        }
        iron-icon {
          --iron-icon-height: var(--lrndesign-mapmenu-item-height);
          display: inline-flex;
        }
      `,
    ];
  }
  render() {
    return html`
      ${this.icon ? html` <iron-icon icon="${this.icon}"></iron-icon> ` : ``}
      <span id="title">${this.title}</span>
    `;
  }
  static get tag() {
    return "lrndesign-mapmenu-item";
  }
  constructor() {
    super();
    this.icon = "";
    this.title = "";
    this.url = "";
  }
  static get properties() {
    return {
      icon: {
        type: String,
      },
      title: {
        type: String,
      },
      url: {
        type: String,
      },
    };
  }
}
window.customElements.define(LrndesignMapmenuItem.tag, LrndesignMapmenuItem);
export { LrndesignMapmenuItem };
