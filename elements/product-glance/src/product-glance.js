import { html, css } from "lit-element";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";

export class ProductGlance extends SimpleColors {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: inline-block;
          --product-glance-icon-width: 20px;
          --product-glance-icon-height: var(--product-glance-icon-width, 20px);
        }
        .wrapper {
          display: grid;
          grid-template-columns: 3.5em 0.5em 21em;
          margin: var(--product-glance-internal-margin, 0.25em);
          background-color: var(--simple-colors-default-theme-grey-1, #eeeeee);
          padding: var(--product-glance-internal-padding, 0.5em);
        }
        .icon-wrapper {
          padding: var(--product-glance-internal-padding, 0.5em);
          display: block;
          margin: 0 auto;
        }

        .icon {
          margin: 0;
          width: var(--product-glance-icon-width);
          height: var(--product-glance-icon-height);
          --simple-icon-height: var(--product-glance-icon-height);
          --simple-icon-width: var(--product-glance-icon-width);
          border: 2px solid var(--simple-colors-default-theme-grey-4, #eeeeee);
          border-radius: 50%;
          padding: var(--product-glance-internal-padding, 0.5em);
          display: block;
        }
        .title-text {
          margin-top: var(--product-glance-title-margin-top, 8px);
        }
        .title-text ::slotted(p),
        .subtitle-text ::slotted(p) {
          margin: 0;
        }
        .title-text,
        .title-text ::slotted(*) {
          color: var(
            --product-glance-text-color,
            var(--simple-colors-default-theme-grey-12, #222222)
          );
          font-family: "OpenSans-Bold", "OpenSans", "Arial", sans-serif;
          font-size: 1.25em;
          font-weight: bold;
        }

        .subtitle-text,
        .subtitle-text ::slotted(*) {
          color: var(
            --product-glance-subtext-color,
            var(--simple-colors-default-theme-grey-8, #555555)
          );
          font-family: "OpenSans-Bold", "OpenSans", "Arial", sans-serif;
          font-size: 0.9em;
          line-height: 1em;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      subtitle: { type: String },
      icon: { type: String },
    };
  }

  constructor() {
    super();
  }
  updated() {
    if (this.icon) {
      import("@lrnwebcomponents/simple-icon/simple-icon.js");
    }
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="icon-wrapper">
          ${this.icon
            ? html`<simple-icon
                class="icon"
                icon="${this.icon}"
                accent-color="${this.accentColor}"
                .contrast="${this.contrast}"
                ?dark="${this.dark}"
              ></simple-icon>`
            : html``}
        </div>
        <div></div>
        <div class="text-wrapper">
          <div class="title-text"><slot name="title">${this.title}</slot></div>
          <div class="subtitle-text">
            <slot name="subtitle">${this.subtitle}</slot>
          </div>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "product-glance";
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
customElements.define(ProductGlance.tag, ProductGlance);
