/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `site-title`
 * `Title of the site`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteTitle extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-title";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          text-rendering: optimizelegibility;
          position: relative;
        }
        a {
          @apply --site-title-link;
        }
        a h1 {
          text-rendering: optimizelegibility;
          @apply --site-title-heading;
        }
      </style>
      <a href$="[[homeLink]]">
        <h1>[[siteTitle]]</h1>
      </a>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      /**
       * Site title
       */
      siteTitle: {
        type: String
      },
      /**
       * HREF to the home page
       */
      homeLink: {
        type: String
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.siteTitle = toJS(store.siteTitle);
    });
    this.__disposer2 = autorun(() => {
      this.homeLink = toJS(store.homeLink);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__disposer();
    this.__disposer2();
  }
}
window.customElements.define(SiteTitle.tag, SiteTitle);
export { SiteTitle };
