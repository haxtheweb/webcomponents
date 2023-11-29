import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/simple-icon.js";

class CollectionItem extends LitElement {
  static get properties() {
    return {
      url: { type: String },
      image: { type: String },
      alt: { type: String },
      icon: { type: String },
      line1: { type: String },
      line2: { type: String },
      line3: { type: String },
    };
  }
  constructor() {
    super();
    this.url = null;
    this.image = null;
    this.alt = null;
    this.icon = null;
    this.line1 = null;
    this.line2 = null;
    this.line3 = null;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }


  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          font-family: roboto, sans-serif;
        }

        a {
          text-decoration: none;
          color: #363533;
          display: block;
          width: 100%;
          min-height: 300px;
          border: solid 1px #dcdcdc;
        }
        a:focus-within,
        a:focus,
        a:hover {
          box-shadow: 1px 1px 5px #dcdcdc;
        }

        .wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .line-1 {
          font-size: 28px;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.4;
        }

        .line-2 {
          font-size: 18px;
          text-align: center;
          width: 90%;
          margin: 0 0 15px 0;
          line-height: 1.2;
        }

        .line3 {
          margin-top: -10px;
        }

        .icon {
          background-color: #fff;
          border-radius: 50%;
          position: relative;
          bottom: 50px;
          border: solid;
          border-color: #363533;
          border-width: 5px;
          margin: 0 0 -40px 0;
        }

        simple-icon {
          --simple-icon-width: 70px;
          --simple-icon-height: 70px;
          fill: #363533;
        }

        .image {
          background-color: grey;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: right center;
          width: 100%;
          height: 150px;
        }
      `,
    ];
  }

  render() {
    return html`
      <a href="${this.url}" title="${this.alt}">
        <div class="wrap">
          <div class="image" style="background-image:url(${this.image})"></div>
          <div class="icon">
            <simple-icon icon="${this.icon}"></simple-icon>
          </div>
          <div class="line-1">${this.line1}</div>
          <div class="line-2">${this.line2}</div>
          <div class="line-3">${this.line3}</div>
        </div>
      </a>
    `;
  }
  static get tag() {
    return "collection-item";
  }
}
customElements.define(CollectionItem.tag, CollectionItem);
export { CollectionItem };
