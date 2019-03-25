/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
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
        a:hover,
        a:focus,
        a:active {
          @apply --site-title-link-hover;
        }
        a h1 {
          text-rendering: optimizelegibility;
          @apply --site-title-heading;
        }
        iron-icon {
          @apply --site-title-icon;
        }
        paper-tooltip {
          @apply --site-title-tooltip;
        }
      </style>
      <a id="btn" href$="[[homeLink]]" title$="Go to [[siteTitle]]">
        <iron-icon hidden$="[[!icon]]" icon="[[icon]]"></iron-icon>
        <h1 hidden$="[[notitle]]">[[siteTitle]]</h1>
      </a>
      <paper-tooltip for="btn" position="[[position]]" offset="14">
        [[label]]
      </paper-tooltip>
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
      },
      label: {
        type: String,
        value: "Home"
      },
      position: {
        type: String,
        value: "bottom"
      },
      /**
       * optional icon
       */
      icon: {
        type: String,
        value: false
      },
      /**
       * If the title should be displayed or not
       */
      notitle: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = [];
    autorun(reaction => {
      this.siteTitle = toJS(store.siteTitle);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.homeLink = toJS(store.homeLink);
      this.__disposer.push(reaction);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
  }
}
window.customElements.define(SiteTitle.tag, SiteTitle);
export { SiteTitle };
