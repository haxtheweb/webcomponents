/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { HAXCMSI18NMixin } from "../../core/utils/HAXCMSI18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";

/**
 * `site-title`
 * `Title of the site`
 *

 * @demo demo/index.html
 */
class SiteTitle extends HAXCMSThemeParts(HAXCMSI18NMixin(LitElement)) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          text-rendering: optimizelegibility;
          position: relative;
          color: inherit;
          --simple-icon-width: 32px;
          --simple-icon-height: 32px;
        }
        a {
          color: inherit;
          display: var(--site-title-link-display, block);
          text-decoration: var(--site-title-link-text-decoration);
        }
        simple-icon-lite {
          margin-right: 8px;
        }
        a h1 {
          display: var(--site-title-link-h1-display, block);
          color: inherit;
          text-rendering: optimizelegibility;
          font-family: var(--site-title-heading-font-family);
          font-size: var(--site-title-heading-font-size);
          margin: var(--site-title-heading-margin);
          padding: var(--site-title-heading-padding);
          text-align: var(--site-title-heading-text-align);
          text-rendering: var(--site-title-heading-text-rendering);
          font-weight: var(--site-title-heading-font-weight);
          line-height: var(--site-title-heading-font-size);
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
    this.HAXCMSI18NMixinBase = "../../../";
    this.__disposer = [];
    this.icon = null;
    this.t = {
      home: "Home",
    };
    this.notitle = false;
    autorun((reaction) => {
      this.siteTitle = toJS(store.siteTitle);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.homeLink = toJS(store.homeLink);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
  }

  _editClick(e) {
    if (this.disabled || this.editMode) {
      e.preventDefault();
    }
  }
  /**
   * LitElement
   */
  render() {
    return html`
      <a
        href="${this.homeLink}"
        title="${this.t.home}"
        @click="${this._editClick}"
        .part="${this.editMode ? `edit-mode-active` : ``}"
        ?disabled="${this.disabled || this.editMode}"
      >
        <simple-icon-lite
          ?hidden="${this.icon ? false : true}"
          icon="${this.icon}"
        ></simple-icon-lite>
        ${this.notitle ? `` : html` <h1>${this.siteTitle}</h1> `}
      </a>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      ...super.properties,
      disabled: {
        type: Boolean,
        reflect: true,
      },
      editMode: {
        type: Boolean,
        attribute: "edit-mode",
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
customElements.define(SiteTitle.tag, SiteTitle);
export { SiteTitle };
