/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `agency-theme-body`
 * `HAX theme to present an agency style site.`
 * @element agency-theme-body
 */
class AgencyThemeBand extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          --agency-theme-band-bg-color: #333a4a;
          --agency-theme-band-slice-height: 3.5vw;
          --agency-theme-band-content-max-width: 900px;
          --agency-theme-band-content-padding: 1em;
          display: block;
          margin-top: calc(var(--agency-theme-band-slice-height) * -1);
        }

        :host([hidden]) {
          display: none;
        }
        #wrapper {
          margin: var(--agency-theme-band-slice-height) 0;
          position: relative;
        }
        #slice {
          width: 100%;
          height: var(--agency-theme-band-slice-height);
          margin-bottom: -1px;
        }
        #slice svg {
          width: 100%;
          height: 100%;
        }
        #inner {
          background-image: linear-gradient(
            to bottom,
            #333a4a,
            rgba(46, 49, 65, 0.8)
          );
        }
        #inner-wrapper {
          max-width: var(--agency-theme-band-content-max-width);
          padding: var(--agency-theme-band-content-padding);
          margin: auto;
        }
      `
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "agency-theme-band";
  }

  // render function
  render() {
    return html`
      <div id="wrapper">
        <div id="slice">
          <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' preserveAspectRatio='none'><polygon points='0,100 100,0 100,100' style='fill:#333a4a'></svg>
        </div>
        <div id="inner">
          <div id="inner-wrapper">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
window.customElements.define(AgencyThemeBand.tag, AgencyThemeBand);
export { AgencyThemeBand };
