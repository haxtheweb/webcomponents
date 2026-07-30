/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { LitElement, html, css } from "lit";
/**
 * `polaris-story-card`
 * `A polaris PSU based branding styled theme`
 * @demo demo/index.html
 * @element polaris-story-card
 */
class PolarisStoryCard extends LitElement {
  static get properties() {
    return {
      image: { type: String },
      label: { type: String },
      pillar: { type: String },
    };
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.image = "";
    this.label = "";
    this.pillar = "";
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          display: inline-flex;
          color-scheme: light dark;
        }

        .wrapper {
          text-align: center;
          min-height: 389px;
          border-radius: 12px;
          overflow: hidden;
          max-width: 100%;
          background-color: var(
            --polaris-story-card-background-color,
            light-dark(#0016e0, var(--ddd-theme-default-nittanyNavy, #001e44))
          );
          color: var(
            --polaris-story-card-color,
            var(--ddd-theme-default-white, #fff)
          );
          position: relative;
          min-width: var(--polaris-story-card-min-width, 255px);
          display: block;
        }
        .card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }

        .body {
          position: absolute;
          bottom: 0.5rem;
          text-align: center;
          font-family: "Roboto", Arial, Helvetica, sans-serif;
          color: var(--ddd-theme-default-white, #fff);
          border: 3px solid var(--ddd-theme-default-white, #fff);
          background-color: rgba(0, 0, 0, 0.58);
          width: 195px;
          left: 1.5rem;
          font-size: 1.5rem !important;
          line-height: 1.875rem !important;
        }

        .label {
          padding: 0;
          margin: 20px 10px;
        }

        .pillar {
          text-transform: uppercase;
          font-family: "Roboto", Arial, Helvetica, sans-serif;
          color: var(--ddd-theme-default-white, #fff);
          position: relative;
          top: 4px;
          padding: 4px 10px;
          background-color: var(--ddd-theme-default-nittanyNavy, #001e44);
          font-weight: 500;
        }
        @media (max-width: 360px) {
          .wrapper {
            min-width: 0;
            width: 100%;
          }
          .body {
            width: calc(100% - 3rem);
          }
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div class="wrapper">
        ${this.image
          ? html`<img
              class="card-image"
              src="${this.image}"
              alt="${this.label || this.pillar || "Story image"}"
              loading="lazy"
              decoding="async"
            />`
          : ``}
        <span class="pillar">${this.pillar}</span>
        <div class="body">
          <div class="label">${this.label}</div>
        </div>
      </div>
    `;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "polaris-story-card";
  }
}
globalThis.customElements.define(PolarisStoryCard.tag, PolarisStoryCard);
export { PolarisStoryCard };
