import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
class ProductBanner extends SimpleColors {
  static get properties() {
    return {
      ...super.properties,
      primaryText: { type: String, attribute: "primary-text" },
      secondaryText: { type: String, attribute: "secondary-text" },
      logo: { type: String },
      image: { type: String },
      alt: { type: String },
    };
  }
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
    this.alt = "";
    this.accentColor = "orange";
  }
  static get styles() {
    return [
      super.styles,
      css`
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

        .image-text {
          background: rgba(0, 0, 0, 0.5);
          width: calc(150px + (355 - 28) * ((100vw - 300px) / (1600 - 300)));
          margin: 0 5vw;
          padding: 2vw;
        }
        :host([dark]) .image-text {
          background: rgba(255, 255, 255, 0.5);
        }

        .image-text h1 {
          font-size: calc(23px + (72 - 28) * ((100vw - 300px) / (1600 - 300)));
          color: var(
            --product-banner-text-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
          font-weight: 400;
          line-height: 1.1;
          margin: 0;
          padding: 0;
          width: 100%;
        }

        .branding_wrap {
          display: flex;
          align-items: center;
          background-color: var(
            --product-banner-color,
            var(--simple-colors-default-theme-accent-7, #e2801e)
          );
          border-top: solid;
          border-top-width: 4px;
          border-top-color: var(
            --product-banner-text-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
        }

        .logo {
          position: absolute;
          width: 35%;
        }

        .logo img {
          display: block;
          width: 50%;
          max-width: 300px;
          border: solid;
          border-width: 4px;
          border-color: var(
            --product-banner-text-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
          border-radius: 50%;
          background-color: var(
            --product-banner-color,
            var(--simple-colors-default-theme-accent-7, #e2801e)
          );
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
          color: var(
            --product-banner-text-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
          margin: 5px 0 5px 0;
        }
      `,
    ];
  }

  render() {
    return html`
      <div id="banner_wrap">
        <div
          class="image_wrap"
          alt="${this.alt}"
          style="background-image:url('${this.image}')"
        >
          <div class="image"></div>
          ${this.primaryText
            ? html`
                <div class="image-text">
                  <h1>${this.primaryText}</h1>
                </div>
              `
            : ``}
        </div>
        <div class="branding_wrap">
          ${this.logo
            ? html`
                <div class="logo">
                  <img src="${this.logo}" alt="" />
                </div>
              `
            : ``}
          ${this.secondaryText
            ? html`
                <div class="company_name">
                  <h2>${this.secondaryText}</h2>
                </div>
              `
            : ``}
        </div>
      </div>
    `;
  }
  static get tag() {
    return "product-banner";
  }
}
customElements.define(ProductBanner.tag, ProductBanner);
export { ProductBanner };
