/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `site-active-title`
 * `Title of the active page in the site`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteActiveTitle extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-active-title";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        h2 {
          text-rendering: optimizelegibility;
          font-family: sans-serif;
          color: var(--site-active-title-color, #383f45);
          @apply --site-active-title-heading;
        }
      </style>
      <h2>[[pageTitle]]</h2>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      pageTitle: {
        type: String
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.pageTitle = toJS(store.pageTitle);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__disposer();
  }
}
window.customElements.define(SiteActiveTitle.tag, SiteActiveTitle);
export { SiteActiveTitle };
