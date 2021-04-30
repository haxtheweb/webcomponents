import { html, css, LitElement } from 'lit-element';
import { SimpleIcon } from '@lrnwebcomponents/simple-icon/simple-icon.js';
import { SimpleColors } from '@lrnwebcomponents/simple-colors/simple-colors.js';
import '@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js';
import '@lrnwebcomponents/simple-icon/lib/simple-icons.js';

export class ProductGlance extends SimpleColors {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: inline-block;
        }
        .product-glance-wrapper {
          display: grid;
          grid-template-columns: 3vw 1vw 30vw;
          margin: 1%;
        }

        .product-glance-icon-wrapper {
          border-radius: 100%;
          border: 1px solid grey;
        }

        .icon {
          width: 100%;
          height: 100%;
        }

        .product-glance-title-text {
          margin-top: var(--product-glance-title-margin-top, 0.01vw);
          margin-bottom: 0.25vw;
          color: var(--simple-colors-default-theme-grey-10, black);
        }

        .product-glance-subtitle-text {
          margin-top: 0.25vw;
          margin-bottom: 0.01vw;
          color: var(--simple-colors-default-theme-grey-6);
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
    this.title = 'Main product attribute description';
    this.subtitle = 'Sub-description describing product attribute';
    this.icon = 'star';
  }

  render() {
    return html`
      <div class="product-glance-wrapper">
        <div class="product-glance-icon-wrapper">
          <simple-icon
            class="icon"
            icon="${this.icon}"
            accent-color="${this.accentColor}"
          ></simple-icon>
        </div>
        <div></div>
        <div class="product-glance-text-wrapper">
          <b><p class="product-glance-title-text">${this.title}</p></b>
          <p class="product-glance-subtitle-text">${this.subtitle}</p>
        </div>
      </div>
    `;
  }
}
