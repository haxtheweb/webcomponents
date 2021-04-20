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
          display: block;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div>
        <br>
      </div>
    `;
  }

  static get properties() {
    return {
      amount:{
        type: Number,
        reflect: true
      }
    };
  }


  /**
   * Convention we use
   */
  static get tag() {
    return "b-r";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    for (let i=1; i<this.amount; i++){
      let br = document.createElement("br");
      this.shadowRoot.querySelector("div").appendChild(br);
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
  }
}
customElements.define(BR.tag, BR);
export { BR };
