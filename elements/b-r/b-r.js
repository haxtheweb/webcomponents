/**
 * Copyright 2021
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
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
    this.amount = 0;
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    // a11y (issue #3102 follow-up): the element is a purely decorative
    // stack of breaks for vertical spacing, so hide it from assistive
    // tech to avoid blank-line announcements
    this.setAttribute("aria-hidden", "true");
  }
  /**
   * LitElement render callback
   */
  render() {
    // FIXED (issue #3102 bug 50): the stray </div> closing tag (no
    // matching opening tag; the parser dropped it) was removed
    return html`${this.renderBR(this.amount)}`;
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
    if (amount === 0) {
      amount = globalThis.innerHeight / 21;
    }
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
globalThis.customElements.define(BR.tag, BR);
export { BR };
