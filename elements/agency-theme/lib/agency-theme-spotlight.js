/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `agency-theme-body`
 * `HAX theme to present an agency style site.`
 * @customElement agency-theme-body
 */
class AgencyThemeSpotlight extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          --agency-theme-spotlight-image-height: 10em;
          --agency-theme-spotlight-content-padding: 3vw;
          --agency-theme-spotlight-content-color: white;
          display: block;
          color: white;
        }

        :host([hidden]) {
          display: none;
        }

        .inner {
          display: flex;
          flex-wrap: wrap;
        }

        .image {
          display: flex;
          width: 100%;
          flex: 0 1 auto;
          justify-content: center;
        }

        .image img {
          border-radius: 100%;
          object-fit: cover;
          width: var(--agency-theme-spotlight-image-height);
          height: var(--agency-theme-spotlight-image-height);
        }

        @media screen and (min-width: 500px) {
          .inner {
            flex-wrap: nowrap;
          }
          .image {
            width: auto;
          }
          .image + .content {
            margin-left: var(--agency-theme-spotlight-content-padding);
          }
        }

        .content {
          width: 100%;
          flex: 1 1 auto;
          -ms-flex: 2;
        }
        .title {
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
          margin-bottom: 1em;
        }
      `
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "agency-theme-spotlight";
  }

  static get properties() {
    return {
      image: { type: String }
    };
  }
  // render function
  render() {
    return html`
      <div class="inner">
        <div class="image">
          <img loading="lazy" src="${this.image}" alt="" />
        </div>
        <div class="content">
          <div class="title"><slot name="title"></slot></div>
          <slot></slot>
        </div>
      </div>
    `;
  }
}
window.customElements.define(AgencyThemeSpotlight.tag, AgencyThemeSpotlight);
export { AgencyThemeSpotlight };
