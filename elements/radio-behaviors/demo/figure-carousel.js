/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RadioBehaviors } from "../radio-behaviors.js";
/**
 * `figure-carousel`
 *
 * @demo ./demo/index.html
 * @element figure-carousel
 */
class figureCarousel extends RadioBehaviors(LitElement) {
  //styles function
  static get styles() {
    return [
      css`
        :host,
        ::slotted(figure) {
          display: block;
          width: 400px;
          margin: 0;
        }
        :host([hidden]),
        ::slotted(figure:not([active])) {
          display: none !important;
        }
      `,
    ];
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      figures: {
        type: Array,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "figure-carousel";
  }
  constructor() {
    super();
  }
  render() {
    console.log("this.itemData", this.itemData);
    return html`
      ${(this.itemData || []).map(
        (item) => html`
          <button
            id="select-${item.id}"
            @click="${(e) => this.selectItem(`${item.id}`)}"
          >
            ${item.id}
          </button>
        `,
      )}<slot></slot>
    `;
  }
  /**
   * query selector for slotted children, can be overridden
   * @readonly
   */
  get __query() {
    return "figure";
  }
  get __selected() {
    return "active";
  }
}
customElements.define(figureCarousel.tag, figureCarousel);
export { figureCarousel };
