import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-icon/iron-icon.js";
class LrnappStudioBlock extends LitElement {
  constructor() {
    super();
    this.title = null;
    this.icon = null;
  }
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-size: 12px;
        }
        .studio-block__header {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          border: 1px solid lightgray;
          border-bottom: none;
        }
        .studio-block__content {
          padding: 0 16px;
          border: 1px solid lightgray;
        }
        .studio-block__icon-wrapper {
          width: 32px;
        }
        .studio-block__header h3 {
          margin: 0;
          font-style: none;
          font-size: inherit;
        }
      `
    ];
  }
  render() {
    return html`
      <div class="studio-block__header">
        <div class="studio-block__icon-wrapper">
          <iron-icon icon="${this.icon}" ?hidden="${!this.icon}"></iron-icon>
        </div>
        <h3 ?hidden="${!this.title}">${this.title}</h3>
      </div>
      <div class="studio-block__content"><slot></slot></div>
    `;
  }

  static get tag() {
    return "lrnapp-studio-block";
  }
  static get properties() {
    return {
      title: {
        type: String
      },
      icon: {
        type: String
      }
    };
  }
}
window.customElements.define(LrnappStudioBlock.tag, LrnappStudioBlock);
export { LrnappStudioBlock };
