import { LitElement, html, css } from "lit";
class CollectionsThemeBanner extends LitElement {
  static get properties() {
    return {
      image: { type: String },
      sitename: { type: String },
      pagetitle: { type: String },
      logo: { type: String },
    }
  }

  constructor() {
    super();
    this.image = null;
    this.sitename = '';
    this.pagetitle = '';
    this.logo = null;
  }

  static get styles() {
    return [css`
      :host {
        display: block;
      }

      .image_wrap {
        background-repeat: no-repeat;
        background-size: cover;
        background-position: right center;
        width: 100%;
        min-height: 32vw;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex: 1 1 auto;
        margin: 0;
        padding: 0;
      }

      @media screen and (max-width: 700px) {
        .image_wrap {
          height: 55vw;
        }
      }

      .image_text {
        background: rgba(0, 0, 0, 0.5);
        width: calc(150px + (355 - 28) * ((100vw - 300px) / (1600 - 300)));
        margin: 0 5vw;
        padding: 2vw;
      }

      .image_text h1 {
        font-size: calc(23px + (72 - 28) * ((100vw - 300px) / (1600 - 300)));
        color: #fff;
        font-weight: 400;
        line-height: 1.1;
        margin: 0;
        padding: 0;
        width: 100%;
      }

      .branding_wrap {
        display: flex;
        align-items: center;
        background-color: #e2801e;
        border-top: solid;
        border-top-width: 4px;
        border-top-color: #fff;
      }
      
      .logo {
        position: absolute;
        width: 40%;
      }

      .logo img {
        width: 48%;
        border: solid;
        border-width: 4px;
        border-color: #fff;
        border-radius: 50%;
        background-color: #e2801e;
        margin: -52px 0 0 25px;
      }

      @media screen and (max-width: 700px) {
        .logo img {
          margin: 0 0 0 5px;
        }
      }

      .company_name {
        width: 76%;
        margin: 0 0 0 auto;
      }

      .company_name h2 {
        font-size: calc(18px + (72 - 28) * ((100vw - 300px) / (1600 - 300)));
        font-weight: 400;
        color: #fff;
        margin: 5px 0 5px 0;
      }
    `];
  }

  render() {
    return html`
      <div class="image_wrap" style="background-image:url(${this.image})">
        <div class="image_text">
          <h1>${this.pagetitle}</h1>
        </div>
      </div>
      <div class="branding_wrap">
        <div class="logo">
          <img src="${this.logo}" alt="" decoding="async" fetchpriority="low"/>
        </div>
        <div class="company_name">
          <h2>${this.sitename}</h2>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "collections-theme-banner";
  }
}
customElements.define(CollectionsThemeBanner.tag, CollectionsThemeBanner);
export { CollectionsThemeBanner };