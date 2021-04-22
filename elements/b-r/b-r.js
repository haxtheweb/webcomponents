/**
 * Copyright 2021
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `b-r`
 * `Creates break statements to show conditional rendering`
 * @demo demo/index.html
 * @element b-r
 */
class BR extends LitElement {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.amount = 1;
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`<div>${this.renderBR(this.amount)}</div>`;
  }

  static get properties() {
    return {
      amount: {
        type: Number,
      },
    };
  }
  renderBR(amount) {
    let count = 0;
    const content = [];
    while (count < amount) {
      content.push(html`<br />`);
      count++;
    }
    return content;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "b-r";
  }
}
customElements.define(BR.tag, BR);
export { BR };
