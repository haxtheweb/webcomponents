/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
`lrnsys-render-html`
A legacy element which just directly renders HTML.
WARNING: DO NOT USE THIS UNLESS YOU KNOW WHAT YOU ARE DOING!

This element is meant to render html from a source that has already been sanitized.
Polymer will, by design, not render html for security reasons. This element gets around
that. Do not render raw user input through this element! This would allow XSS attacks for
your users.

* @demo demo/index.html
*/
class LrnsysRenderHtml extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `
    ];
  }
  render() {
    return html`
      <div id="container"></div>
    `;
  }

  static get tag() {
    return "lrnsys-render-html";
  }

  static get properties() {
    return {
      /**
       * String to render as HTML directly
       */
      html: {
        type: String
      }
    };
  }
  firstUpdated() {
    this.shadowRoot.querySelector("#container").innerHTML = this.html;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "html" && this.shadowRoot) {
        this.shadowRoot.querySelector("#container").innerHTML = this[propName];
      }
    });
  }
}
window.customElements.define(LrnsysRenderHtml.tag, LrnsysRenderHtml);
export { LrnsysRenderHtml };
