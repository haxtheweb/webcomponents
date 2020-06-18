import { LitElement, html, css } from "lit-element/lit-element.js";
import { RadioBehaviors } from "@lrnwebcomponents/radio-behaviors/radio-behaviors.js";
/**
 * `a11y-carousel`
 * Layers images over each other with a slider interface to compare them
 * @demo demo/index.html
 * @element a11y-carousel
 */
class a11yCarousel extends RadioBehaviors(LitElement) {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 15px 0;
          padding: 0;

        }
        :host([hidden]),
        ::slotted(figure:not([active])) {
          display: none !important;
        }
      `
    ];
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      figures: {
        type: Array
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-carousel";
  }
  constructor() {
    super();
  }
  render() {
    console.log("this.itemData", this.itemData);
    return html`
      ${(this.itemData || []).map(
        item =>
          html`
            <button
              id="select-${item.id}"
              @click="${e => this.selectItem(`${item.id}`)}"
            >
              ${item.id}
            </button>
          `
      )}<slot></slot>
    `;
  }
  /**
   * query selector for slotted children, can be overridden
   * @readonly
   */
  get _query() {
    return "figure";
  }
  get _selected() {
    return "active";
  }
}
window.customElements.define(a11yCarousel.tag, a11yCarousel);
export { a11yCarousel };
