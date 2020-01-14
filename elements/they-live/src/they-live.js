/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";

/**
 * `they-live`
 * @customElement they-live
 * `To demonstrate the hidden reality behind the component`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class TheyLive extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "they-live";
  }
  /**
   * Register CSS styles
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
        }
        .truth {
          font-size: 5.5vw;
          word-break: break-all;
          line-height: 5.5vw;
          position: absolute;
          margin: 0 auto;
          text-align: center;
          display: flex;
          visibility: hidden;
          opacity: 0;
          transition: 0.3s all linear;
          z-index: 2;
          text-align: center;
        }
        :host(:focus),
        :host(:hover) {
          background-color: grey;
        }
        :host(:focus) .content ::slotted(*),
        :host(:hover) .content ::slotted(*) {
          visibility: hidden;
        }
        :host(:focus) .truth,
        :host(:hover) .truth {
          visibility: visible;
          opacity: 1;
        }
      `
    ];
  }

  // life cycle
  constructor() {
    super();
    // put default values here
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element removed from DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  /**
   * runs on first go
   */
  firstUpdated(changedProperties) {
    this.setAttribute("tabindex", "0");
    changedProperties.forEach((oldValue, propName) => {});
  }
  /**
   * updated / notice property changes
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define("they-live", TheyLive);
export { TheyLive };
