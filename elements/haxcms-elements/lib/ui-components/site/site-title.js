/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `site-title`
 * `Title of the site`
 *

 * @demo demo/index.html
 */
class SiteTitle extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          text-rendering: optimizelegibility;
          position: relative;
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-title";
  }
  constructor() {
    super();
    this.__disposer = [];
    this.label = "Home";
    this.notitle = false;
    import("@lrnwebcomponents/simple-icon/simple-icon.js");
    import("@lrnwebcomponents/simple-icon/lib/simple-icons.js");
    autorun((reaction) => {
      this.siteTitle = toJS(store.siteTitle);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.homeLink = toJS(store.homeLink);
      this.__disposer.push(reaction);
    });
  }
  /**
   * LitElement
   */
  render() {
    return html`
      <custom-style>
        <style>
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
        </style>
      </custom-style>
      <a
        href="${this.homeLink}"
        title="${this.label}"
        ?disabled="${this.disabled}"
      >
        <simple-icon
          ?hidden="${this.icon ? false : true}"
          icon="${this.icon}"
        ></simple-icon>
        ${this.notitle ? html`` : html` <h1>${this.siteTitle}</h1> `}
      </a>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      disabled: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Site title
       */
      siteTitle: {
        type: String,
        attribute: "site-title",
      },
      /**
       * HREF to the home page
       */
      homeLink: {
        type: String,
        attribute: "home-link",
      },
      /**
       * Label
       */
      label: {
        type: String,
      },
      /**
       * optional icon
       */
      icon: {
        type: String,
      },
      /**
       * If the title should be displayed or not
       */
      notitle: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteTitle.tag, SiteTitle);
export { SiteTitle };
