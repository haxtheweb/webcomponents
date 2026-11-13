/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";

export class ProductGlance extends SimpleColors {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
          max-width: 100%;
          --product-glance-icon-width: 24px;
          --product-glance-icon-height: var(--product-glance-icon-width, 24px);
        }
        /* one row card: icon tile, bold title, muted subtitle */
        .wrapper {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3, 12px);
          width: 26rem;
          max-width: 100%;
          margin: var(--product-glance-internal-margin, 0.25em);
          padding: var(
            --product-glance-internal-padding,
            var(--ddd-spacing-3, 12px) var(--ddd-spacing-4, 16px)
          );
          border: var(--ddd-border-xs, 1px solid);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight, #e4e5e7),
            var(--ddd-theme-default-slateGray, #314d64)
          );
          border-radius: var(--ddd-radius-md, 12px);
          background-color: transparent;
          font-family: var(--ddd-font-primary, sans-serif);
        }
        .icon-wrapper {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: calc(var(--product-glance-icon-width) + 24px);
          height: calc(var(--product-glance-icon-height) + 24px);
          margin: 0;
          border-radius: var(--ddd-radius-md, 12px);
          /* the tile takes the palette tint (data-palette) when there is
             one */
          background-color: var(
            --ddd-palette-tint,
            light-dark(
              var(--ddd-theme-default-skyMaxLight, #e6f7ff),
              color-mix(
                in srgb,
                var(--ddd-theme-default-skyBlue, #009cde) 24%,
                transparent
              )
            )
          );
          --simple-icon-color: light-dark(
            var(--ddd-theme-default-nittanyNavy, #001e44),
            var(--ddd-theme-default-white, #ffffff)
          );
        }
        .icon-wrapper:empty {
          display: none;
        }
        /* an author picked accent tints the tile and the icon */
        :host([accent-color]:not([accent-color="grey"])) .icon-wrapper {
          background-color: var(
            --simple-colors-default-theme-accent-2,
            var(--ddd-theme-default-skyMaxLight, #e6f7ff)
          );
          --simple-icon-color: var(
            --simple-colors-default-theme-accent-9,
            var(--ddd-theme-default-nittanyNavy, #001e44)
          );
        }
        .icon {
          display: block;
          margin: 0;
          width: var(--product-glance-icon-width);
          height: var(--product-glance-icon-height);
          --simple-icon-height: var(--product-glance-icon-height);
          --simple-icon-width: var(--product-glance-icon-width);
        }
        .text-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1 1 auto;
          min-width: 0;
        }
        .title-text {
          margin-top: var(--product-glance-title-margin-top, 0);
        }
        .title-text ::slotted(p),
        .subtitle-text ::slotted(p) {
          margin: 0;
        }
        .title-text,
        .title-text ::slotted(*) {
          color: var(
            --product-glance-text-color,
            light-dark(
              var(--ddd-theme-default-nittanyNavy, #001e44),
              var(--ddd-theme-default-white, #ffffff)
            )
          );
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-3xs, 18px);
          font-weight: var(--ddd-font-weight-bold, bold);
          line-height: 1.3;
          overflow-wrap: anywhere;
        }

        .subtitle-text,
        .subtitle-text ::slotted(*) {
          color: var(
            --product-glance-subtext-color,
            light-dark(
              var(--ddd-theme-default-slateGray, #314d64),
              var(--ddd-theme-default-limestoneLight, #e4e5e7)
            )
          );
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--ddd-font-size-4xs, 16px);
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        /* forced colors drops the chip fill, so the icon takes the system
           text color instead of its hard-coded one */
        @media (forced-colors: active) {
          simple-icon {
            --simple-icon-color: CanvasText;
          }
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
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("icon") && this.icon) {
      import("@haxtheweb/simple-icon/simple-icon.js");
    }
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="icon-wrapper">
          ${
            this.icon
              ? html`<simple-icon
                  class="icon"
                  icon="${this.icon}"
                  accent-color="${this.accentColor}"
                  .contrast="${this.contrast}"
                  ?dark="${this.dark}"
                ></simple-icon>`
              : html``
          }
        </div>
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
globalThis.customElements.define(ProductGlance.tag, ProductGlance);
