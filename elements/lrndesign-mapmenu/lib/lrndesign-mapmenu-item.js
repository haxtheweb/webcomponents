import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
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
        simple-icon {
          --simple-icon-height: var(--lrndesign-mapmenu-item-height);
          display: inline-flex;
        }
      `,
    ];
  }
  render() {
    return html`
      ${this.icon
        ? html` <simple-icon icon="${this.icon}"></simple-icon> `
        : ``}
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
