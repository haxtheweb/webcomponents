import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `lrndesign-contentblock`
 * @customElement lrndesign-contentblock
 * `An incredibly basic content block`
 * @demo demo/index.html
 */
class LrndesignContentblock extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          position: relative;
          box-sizing: border-box;
        }
      </style>
      <h3>[[title]]</h3>
      <slot></slot>
    `;
  }
  static get tag() {
    return "lrndesign-contentblock";
  }
  static get properties() {
    return {
      /**
       * Heading for this block
       */
      title: {
        type: String
      }
    };
  }
}
window.customElements.define(LrndesignContentblock.tag, LrndesignContentblock);
export { LrndesignContentblock };
