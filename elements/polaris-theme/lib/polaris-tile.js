import { LitElement, html, css } from 'lit';

export class PolarisTile extends LitElement {

  static get tag() {
    return "polaris-tile";
  }
  constructor() {
    super();
    this.type = null;
    this.line1 = null;
    this.line2 = null;
    this.image = null;
    this.link = null;
  }

  static get properties() {
    return {
      type: { type: String, reflect: true },
      line1: { type: String },
      line2: { type: String },
      image: { type: String },
      link: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      :host .button {
        position: absolute;
        bottom: 14px;
        right: 14px;
        width: 23px;
        height: 23px;
        background-image: url('https://static-00.iconduck.com/assets.00/external-link-icon-2048x2048-wo7lfgrz.png');
        background-size: cover;
        transition: transform 0.2s;
      }
      :host([type="1"]) .button,
      :host([type="3"]) .button,
      :host([type="5"]) .button {
        filter: brightness(4);
      }

      :host([type]) .button:hover {
        transform: scale(1.3);
      }

      .tile.clickable:hover {
        cursor: pointer;
      }

      .tile {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 281px;
        width: 336px;
        font-family: "Roboto", 'Franklin Gothic Medium', Tahoma, sans-serif;
        font-size: 32px;
        color: white;
        box-shadow: rgba(0, 3, 33, 0.1) 0px 8px 16px 0px;
        position: relative;
      }

      .splitspacer {
        width: 242px;
        margin: auto;
      }

      .split-line {
        margin: 0 0 16px 0;
        border: 16px;
        height: 3px;
        background-color: rgb(0, 30, 68);
      }

      .additionalText {
        font-family: Tahoma;
        display: block;
        color: rgb(0, 30, 68);
        font-size: 18px;
        font-weight: normal;
        margin: 0 0 20px 0;
        border: 0;
        padding: 0 47px;
      }

      .name {
        margin: 0 0 16px 0;
        border: 0;
        padding: 0 47px;
        margin-bottom: 18px;
      }

      :host([type]) .tile,
      :host([type="1"]) .tile {
        background-color: rgb(30, 64, 124);
      }
      :host([type="2"]) .tile {
        background-color: #ffffff;
        color: rgb(0, 30, 68);
      }

      :host([type="3"]) .tile {
        background-color: rgba(0, 0, 0, 0);
        background-image: linear-gradient(rgb(30, 64, 124) 0%, rgb(0, 30, 68) 65%, rgb(0, 30, 68) 100%);
      }

      :host([type="4"]) .tile {
        background-color: rgb(0, 30, 68);
      }

      :host([type="5"]) .tile {
        background-blend-mode: multiply;
        background-color: rgba(0, 3, 33, 0.5);
        background-position: 50% 50%;
        background-size: cover;
      }
    `;
  }

  render() {
    return html`
      <div
       class="tile"
       style="${this.image ? `background-image: url(${this.image});`:``}"
       >
        <div class="content">
          <div class="name">
            <slot>${this.line1}</slot>
          </div>
          ${this.line2 ? html`
          <div class="splitspacer">
            <hr class="split-line" />
          </div>
          <div class="additionalText">
            ${this.line2}
          </div>
          ` : ``}
          ${this.link ? html`<a class="button" href="${this.link}" title="${this.line1 ? this.line1 : "Additional details about this fact"}"></a>`: ``}
        </div>
      </div>
    `;
  }
}

customElements.define(PolarisTile.tag, PolarisTile);