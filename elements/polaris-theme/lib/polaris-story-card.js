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
      ...styles,
      css`
        :host {
          display: inline-flex;
        }

        .wrapper {
          text-align: center;
          min-height: 389px;
          border-radius: 12px;
          background-color: var(--polaris-story-card-background-color, #0016e0);
          color: var(--polaris-story-card-color, #fff);
          position: relative;
          min-width: var(--polaris-story-card-min-width, 255px);
          display: block;
        }

        .body {
          position: absolute;
          bottom: 0.5rem;
          text-align: center;
          font-family: "Roboto", Arial, Helvetica, sans-serif;
          color: #fff;
          border: 3px solid #fff;
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
          color: white;
          position: relative;
          top: 4px;
          padding: 4px 10px;
          background-color: #001e44;
          font-weight: 500;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div
        class="wrapper"
        style="background: url('${this.image}') center center no-repeat;"
      >
        <span class="pillar">${this.pillar}</span>
        <div class="body">
          <div class="label">${this.label}</div>
        </div>
      </div>
    `;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "polaris-story-card";
  }
}
customElements.define(PolarisStoryCard.tag, PolarisStoryCard);
export { PolarisStoryCard };
