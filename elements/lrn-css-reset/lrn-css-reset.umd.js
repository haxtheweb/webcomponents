/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
// register globally so we can make sure there is only one
window.LrnCssReset = window.LrnCssReset || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same lrn-css-reset element, making it a singleton.
window.LrnCssReset.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!window.LrnCssReset.instance) {
    window.LrnCssReset.instance = document.createElement("lrn-css-reset");
    document.body.appendChild(window.LrnCssReset.instance);
  }
  return window.LrnCssReset.instance;
};

/**
 * `lrn-css-reset`
 * `CSS reset and additional base styles for lrnwebcomponents and apps`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @element lrn-css-reset
 */
class LrnCssReset extends LitElement {
  
  //styles function
  static get styles() {
    return  [
      
      css`
@import url(../../modern-css-reset/dist/reset.min.css);
      `
    ];
  }

// Template return function
  render() {
    return html`

<slot></slot>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {...super.properties};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrn-css-reset";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    
    window.addEventListener("lrn-css-reset-hide", this.hide LrnCssReset.bind(this));
    window.addEventListener("lrn-css-reset-show", this.show LrnCssReset.bind(this));
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    window.removeEventListener("lrn-css-reset-hide", this.hide LrnCssReset.bind(this));
    window.removeEventListener("lrn-css-reset-show", this.show LrnCssReset.bind(this));
    super.disconnectedCallback();
  }
  /**
   * Hide callback
   */
  hideLrnCssReset (e) {
    // add your code to run when the singleton hides
  }
  /**
   * Show / available callback
   */
  showLrnCssReset (e) {
    // add your code to run when the singleton is called for
  }

  
}
customElements.define(LrnCssReset.tag, LrnCssReset);
export { LrnCssReset };
