/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * CSS reset and additional base styles for lrnwebcomponents and apps
 */
const LrnCssResetStyles = [
  css`
    /* REQUIRED FOR TOOLING DO NOT TOUCH */
  `,
];
const AttachStylesToHead = (
  styles = LrnCssResetStyles,
  id = "LrnCssResetStyles"
) => {
  if (!window.LrnCssResetStyles) {
    window[id] = document.createElement("div");
    let s = document.createElement("style"),
      css = LrnCssResetStyles.map((st) => st.cssText).join("");
    s.setAttribute("id", id);
    s.setAttribute("type", "text/css");
    if (s.styleSheet) {
      // IE
      s.styleSheet.cssText = css;
    } else {
      // the world
      s.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName("head")[0].appendChild(s);
  }
};
/**
 * `lrn-css-reset`
 * `an element that applies CSS reset and additional base styles
 * @microcopy - language worth noting:
 *  -
 *
 * @class LrnCssReset
 * @extends {LitElement}
 * @demo demo/index.html
 * @element lrn-css-reset
 */
class LrnCssReset extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrn-css-reset";
  }
  static get styles() {
    return LrnCssResetStyles;
  }
  static get properties() {
    return {
      applyToHead: {
        type: Boolean,
        attribute: "apply-to-head",
      },
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    if (this.applyToHead)
      AttachStylesToHead(LrnCssResetStyles, "LrnCssResetStyles");
  }
  render() {
    return html`<slot></slot>`;
  }
}
customElements.define(LrnCssReset.tag, LrnCssReset);
export { LrnCssResetStyles, AttachStylesToHead, LrnCssReset };
