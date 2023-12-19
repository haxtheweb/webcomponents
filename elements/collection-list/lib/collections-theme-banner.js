import { LitElement, html, css } from "lit";
class CollectionsThemeBanner extends LitElement {
  static get properties() {
    return {
      image: { type: String },
      sitename: { type: String },
      pagetitle: { type: String },
      logo: { type: String },
    };
  }

  constructor() {
    super();
    this.image = null;
    this.sitename = "";
    this.pagetitle = "";
    this.logo = null;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          line-height: initial;
        }

        .wrap {
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
          .wrap {
            height: 55vw;
          }
        }

        .image-text {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(2px);
          width: calc(150px + (355 - 28) * ((100vw - 300px) / (1600 - 300)));
          margin: 0 5vw;
          padding: 2vw;
        }

        .image-text h1 {
          font-size: calc(23px + (72 - 28) * ((100vw - 300px) / (1600 - 300)));
          color: #ffffff;
          font-weight: 400;
          line-height: 1.1;
          margin: 0;
          padding: 0;
          width: 100%;
        }

        .branding {
          display: flex;
          align-items: center;
          background-color: var(--header-bg-color);
          border-top: solid;
          border-top-width: 4px;
          border-top-color: #ffffff;
        }

        .logo {
          position: absolute;
          width: 40%;
        }

        .logo img {
          width: 300px;
          border: solid;
          height: 300px;
          border-width: 4px;
          border-color: #ffffff;
          border-radius: 50%;
          background-color: var(--header-bg-color);
          margin: -64px 0px 0px 64px;
        }

        @media only screen and (max-width: 1600px) {
          .logo img {
            width: 200px;
            height: 200px;
            margin: -50px 0px 0px 50px;
          }
        }

        @media only screen and (max-width: 1200px) {
          .logo img {
            width: 100px;
            height: 100px;
            margin: 0px 0px 0px 25px;
          }
        }

        @media only screen and (max-width: 800px) {
          .logo img {
            width: 64px;
            height: 64px;
            margin: 0px 0px 0px 16px;
          }
        }

        .company {
          width: 76%;
          margin: 0 0 0 auto;
          padding: 0;
        }

        .company h2 {
          font-size: calc(18px + (72 - 28) * ((100vw - 300px) / (1600 - 300)));
          font-weight: 400;
          color: #ffffff;
          margin: 4px 0 4px 0;
          padding: 0;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="wrap" style="background-image:url('${this.image}')">
        <div class="image-text">
          <h1>${this.pagetitle}</h1>
        </div>
      </div>
      <div class="branding">
        <div class="logo">
          <img src="${this.logo}" alt="" decoding="async" fetchpriority="low" />
        </div>
        <div class="company">
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
