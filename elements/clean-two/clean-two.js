/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { HAXCMSMobileMenuMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";

/**
 * `clean-two`
 * `A 2nd clean theme`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @demo demo/index.html
 * @element clean-two
 */
class CleanTwo extends HAXCMSThemeParts(
  HAXCMSMobileMenuMixin(HAXCMSLitElementTheme)
) {
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          font-size: 16px;
          --haxcms-base-styles-body-font-size:16px;
          --hax-base-styles-a-font-size: 16px;
          --hax-base-styles-p-font-size: 16px;
          --hax-base-styles-list-font-size: 16px;
          --haxcms-base-styles-body-font-family: "Helvetica Neue",Helvetica,Arial,sans-serif
          --haxcms-base-styles-body-line-height: 1.7;
          --hax-base-styles-list-line-height: 1.7;
          --hax-base-styles-p-line-height: 1.7;
          --hax-base-styles-p-letter-spacing: .2px;
          --haxcms-base-styles-body-letter-spacing : .2px;
          --hax-base-styles-p-min-height: auto;
          --hax-base-styles-list-max-width: auto;
          --haxcms-base-styles-p-min-height: auto;
          --hax-base-styles-list-padding-bottom: auto;
          --hax-base-styles-h1-font-size: inherit;
          --hax-base-styles-h2-font-size: inherit;
          --hax-base-styles-h3-font-size: inherit;
          --hax-base-styles-h4-font-size: inherit;
          --hax-base-styles-h5-font-size: inherit;
          --hax-base-styles-h6-font-size: inherit;
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
          --hax-base-styles-a-color-visited:  var(--haxcms-color, var(--simple-colors-default-theme-purple-7));
          --hax-base-styles-a-color: var(--haxcms-color, var(--simple-colors-default-theme-purple-7));
          --hax-base-styles-a-color-active: #000000;
          --site-search-result-background-color: transparent;
          --site-search-result-background-color-hover: #F5F5F5;
          --site-search-link-color-hover: #252737;
          --site-search-link-text-color: #252737;
          --site-search-link-color: #252737;
          --site-search-result-color: #252737;
        }
        .link-actions {
          margin: 0;
          display: block;
          padding: 0;
          border-top: 2px solid #E6ECF1;
          margin-top: 24px;
          align-items: center;
          padding-top: 24px;
          flex-direction: row;
          -webkit-box-align: center;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
        }
        .link-actions .inner {
          width: auto;
          margin: 0;
          display: grid;
          padding: 0;
          -ms-grid-rows: auto;
          grid-column-gap: 24px;
          -ms-grid-columns: 1fr 1fr;
          grid-template-rows: auto;
          grid-template-areas: "previous next";
          grid-template-columns: 1fr 1fr;
        }
        site-menu-button {
          --site-menu-button-link-decoration: none;
          --site-menu-button-button-hover-color: var(--haxcms-color, var(--simple-colors-default-theme-purple-7));
          color: #242A31;
          border: 1px solid #E6ECF1;
          margin: 0;
          display: block;
          padding: 0;
          position: relative;
          align-self: stretch;
          box-shadow: 0 3px 8px 0 rgba(116, 129, 141, 0.1);
          transition: border 250ms ease;
          align-items: center;
          justify-self: stretch;
          text-overflow: ellipsis;
          border-radius: 3px;
          flex-direction: row;
          -moz-transition: border 250ms ease;
          text-decoration: none;
          background-color: #FFFFFF;
          -webkit-box-align: center;
          page-break-inside: avoid;
          -ms-grid-row-align: stretch;
          -webkit-box-orient: horizontal;
          -webkit-transition: border 250ms ease;
          -ms-grid-column-align: stretch;
          -webkit-box-direction: normal;
        }
        replace-tag[with="site-git-corner"],
        site-git-corner {
          height: 40px;
          width: 40px;
          margin:0;
          padding:0;
          --site-git-corner-color: black;
          --site-git-corner-background: transparent;
          background-color: transparent;
          color: black;
        }
        site-menu-button[edit-mode][disabled] {
          display: block;
        }
        site-menu-button[type="prev"] {
          grid-area: previous;
        }
        site-menu-button[type="next"] {
          grid-area: next;
        }
        site-menu-button div.wrapper {
          flex: 1;
          margin: 0;
          display: block;
          padding: 16px;
          text-overflow: ellipsis;
          text-decoration: none;
          font-size: 16px;
          font-family: Content-font, Roboto, sans-serif;
          font-weight: 500;
          line-height: 1.5;
          text-transform: none;
        }
        site-menu-button div .top {
          font-size: 12px;
          font-family: Content-font, Roboto, sans-serif;
          font-weight: 400;
          line-height: 1.625;
          color: #444444;
        }
        simple-datetime {
          color: #444444;
        }
        site-menu-button div .bottom {
          font-size: 16px;
          font-family: Content-font, Roboto, sans-serif;
          font-weight: 500;
          line-height: 1.5;
        }
        site-menu-button[type="next"] div {
         text-align: left; 
        }
        site-menu-button[type="prev"] div {
         text-align: right; 
        }
        site-active-title {
          padding: 8px 0px;
          flex-wrap: wrap;
          align-items: baseline;
          flex-direction: row;
          -webkit-box-align: baseline;
          -webkit-box-lines: multiple;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
          flex: auto;
          margin: 0;
          display: flex;
          background-color: white;
          --site-active-title-font-size: 22px;
          --site-active-title-line-height: 22px;
          font-size: 22px;
          line-height: 22px;
        }

        .body-wrapper {
          flex: 1;
          height: auto;
          min-height: 100vh;
          font-size: 16px;
          color: #3B454E;
          background-color: #ffffff;
          width: auto;
          margin: 0 auto;
          display: flex;
          padding: 0;
          transition: margin-bottom 250ms ease;
          align-items: stretch;
          -moz-transition: margin-bottom 250ms ease;
          -webkit-box-align: stretch;
          -webkit-transition: margin-bottom 250ms ease;
        }
        :host([is-logged-in][menu-open]) .body-wrapper {
          margin-left: 48px;
        }
        :host([menu-open]) .body-wrapper .left-col {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
        }

        :host([is-logged-in][menu-open]) .body-wrapper nav {
          margin-left: 48px;
        }
        :host([is-logged-in][menu-open]) .body-wrapper .content-wrapper {
          margin-left: 0;
        }
        :host([is-logged-in]) .body-wrapper .content-wrapper {
          margin-left: 48px;
        }
        .body-wrapper .content-wrapper .content {
          margin: 0;
          padding: 32px 64px;
        }
        
        nav {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          flex: 0 0 auto;
          padding-left: calc((100vw - 1448px) / 3);
          display: flex;
          z-index: 15;
          min-width: 300px;
          background: #F5F7F9;
          align-items: stretch;
          border-right: 1px solid #E6ECF1;
          flex-direction: column;
          -webkit-box-align: stretch;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        .left-col {
          flex: 1;
          margin: 0;
          padding: 0;
          display: none;
          background-color: #F5F7F9;
        }
        @media screen and (min-width: 1024px){
          .left-col {
            flex: 0 0 auto;
            width: auto;
            z-index: 15;
            width: 300px;
            align-items: stretch;
            border-right: 1px solid #E6ECF1;
            flex-direction: column;
            -webkit-box-align: stretch;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
          }
        }
        site-menu {
          --site-menu-font-size: 15px;
          --site-menu-color: #000000;
          --site-menu-active-color: #E6ECF1;
          --site-menu-item-active-item-color: var(--haxcms-color, var(--simple-colors-default-theme-purple-7));
          overflow-y: auto;
          flex: 1 1 auto;
          height: 100vh;
          width: 300px;
          left: 0;
          margin: 32px 0 32px 0;
          display: block;
          padding: 0;
          position: fixed;
          font-size: 15px;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        :host([is-logged-in][menu-open]) site-menu {
          left: 48px;
        }

        .content-wrapper {
          max-width: 100%;
          flex: 1 1 auto;
          margin: 0;
          display: flex;
          padding: 0;
          background-color: #ffffff;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        .header {
          position: sticky;
          top: 0;
          width: 100%;
          padding: 0;
          margin: 0;
          z-index: 2;
          height: 40px;
        }
        .header #haxcmsmobilemenubutton {
          float: left;
          margin-left: -52px;
          padding: 8px;
        }
        .header site-menu-content {
          display: inline-flex;
          float: right;
          color: black;
          font-size: 1.5em;
          margin-right: -52px;
        }
        .content {
          flex: 1 1 auto;
          margin: 0px 16px;
          display: block;
          padding: 0;
          width: 560px;
        }
        @media screen and (max-width: 400px) {
          .content {
            width: 200px;
          }
          .body-wrapper {
            overflow-x: hidden;
          }
          .header site-menu-content {
            margin-right: -40px;
          }
          site-menu {
            width: 250px;
          }
          #haxcmsmobilemenunav {
            min-width: 250px;
            margin-left: 0px;
          }
          :host([menu-open]) #haxcmsmobilemenubutton{
            margin-left: -52px;
          }
          .link-actions .inner {
            display: block;
          }
          site-menu-button {
            margin: 10px 0;
          }
          #slot ::slotted(iframe) {
            width: auto;
          } 
        }
        @media screen and (min-width: 400px) and (max-width: 600px) {
          .header site-menu-content {
            margin-right: -40px;
          }
          .link-actions .inner {
            display: block;
          }
          site-menu-button {
            margin: 10px 0;
          }
          #slot ::slotted(iframe) {
            width: auto;
          }
          .content {
            width: 300px;
          }
          #slot ::slotted(*) {
            word-break: break-all;
          }
          #slot ::slotted(replace-tag) {
            overflow: hidden;
          }
        }
        @media screen and (min-width: 601px) {
          .content {
            width: 65vw;
          }
        }
        @media screen and (min-width: 913px) {
          .content {
            width: 40vw;
          }
        }
        @media screen and (min-width: 1024px) {
          .content-wrapper {
            margin: 0px 88px;
          }
          .content {
            width: 50vw;
          }
        }
        @media screen and (min-width: 1514px) {
          .body-wrapper .content-wrapper .content {
            padding: 32px 0 32px 64px;
          }
        }
        .right-col {
          margin: 0;
          padding: 0;
          position: relative;
          margin-right: auto;
          max-width: 100%;
          background-color: #ffffff;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          min-height: 100%;
          color: #3B454E;
        }
        .site-menu-content-wrapper {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          flex: 0 0 auto;
          padding-right: 0;
          min-width: 240px;
          flex: 1;
          margin: 0;
          display: block;
          max-width: 100%;
          max-height: 976px;
          z-index: 1;
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          height: 100%;
          margin: 0;
          display: flex;
          padding-top: 40px;
          flex-direction: column;
          padding-bottom: 40px;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        .right-col site-menu-content {
          flex: 1;
          margin: 0;
          display: flex;
          padding: 0;
          overflow: hidden;
          position: fixed;
          min-width: 224px;
          counter-reset: toc;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        .right-col site-menu-content::before {
          top: 0;
          left: 0;
          height: 100%;
          content: " ";
          position: absolute;
          border-left: 1px solid #E6ECF1;
        }
        .footer {
          margin: 0;
          display: flex;
          padding: 0;
          border-top: 2px solid #E6ECF1;
          margin-top: 24px;
          align-items: center;
          padding-top: 24px;
          flex-direction: row;
          -webkit-box-align: center;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
        }
        .footer-left {
          flex: 1;
          margin: 0;
          display: block;
          padding: 0;
          font-size: 12px;
          color: #444444;
        }
        .footer-right {
          display: flex;
          align-items: center;
          flex-direction: row;
          -webkit-box-align: center;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
          margin: 0px;
          padding: 0px;
          overflow-x: hidden;
        }
        simple-icon-button,
        site-rss-button,
        replace-tag[with="site-rss-button"],
        replace-tag[with="site-print-button"],
        site-print-button {
          color: black;
          --haxcms-tooltip-color: #F5F5F5;
          --haxcms-tooltip-background-color: #252737;
        }
      `,
    ];
  }
  searchItemSelected(e) {
    // an item was picked, let's just make the UI jump to that item
    this.searchTerm = "";
  }
  searchChanged(e) {
    var target = normalizeEventPath(e)[0];
    if (target.value) {
      // prettier-ignore
      import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js"
      ).then(() => {
        this.searchTerm = target.value;
      });
    } else {
      this.searchTerm = "";
    }
  }
  // render function
  render() {
    return html`
      <div class="body-wrapper">
        <div class="left-col">${this.HAXCMSMobileMenu()}</div>
        <div class="content-wrapper">
          <div class="content">
            <header class="header">
              ${this.HAXCMSMobileMenuButton()}
              ${this.responsiveSize != "xl"
                ? html`
                    <replace-tag
                      with="site-menu-content"
                      import-only
                    ></replace-tag>
                    <site-menu-content
                      .part="${this.editMode ? `edit-mode-active` : ``}"
                      mobile
                    ></site-menu-content>
                  `
                : ``}
              <replace-tag with="site-active-title" import-only></replace-tag>
              <site-active-title></site-active-title>
            </header>
            <site-search
              hide-input
              search="${this.searchTerm}"
              @search-item-selected="${this.searchItemSelected}"
              ?hidden="${this.searchTerm != "" ? false : true}"
            ></site-search>
            <main>
              <article
                id="contentcontainer"
                ?hidden="${this.searchTerm != "" ? true : false}"
              >
                <section id="slot">
                  <slot></slot>
                </section>
              </article>
            </main>
            <footer>
              <div class="link-actions">
                <div class="inner">
                  <replace-tag
                    with="site-menu-button"
                    import-only
                  ></replace-tag>
                  <site-menu-button
                    hide-label
                    type="prev"
                    position="right"
                    class="navigation"
                    @label-changed="${this.__prevPageLabelChanged}"
                  >
                    <div slot="suffix" class="wrapper">
                      <div class="top">Previous</div>
                      <div class="bottom">${this.prevPage}</div>
                    </div>
                  </site-menu-button>
                  <site-menu-button
                    hide-label
                    type="next"
                    position="left"
                    class="navigation"
                    @label-changed="${this.__nextPageLabelChanged}"
                  >
                    <div slot="prefix" class="wrapper">
                      <div class="top">Next</div>
                      <div class="bottom">${this.nextPage}</div>
                    </div>
                  </site-menu-button>
                </div>
              </div>
              <div class="footer">
                <div class="footer-left">
                  Last updated
                  <replace-tag with="simple-datetime" import-only></replace-tag>
                  <simple-datetime
                    unix
                    .timestamp="${this.pageTimestamp}"
                  ></simple-datetime>
                </div>
                <div class="footer-right">
                  <replace-tag
                    with="site-print-button"
                    class="btn js-toolbar-action"
                    import-method="view"
                  ></replace-tag>
                  <replace-tag
                    with="site-rss-button"
                    type="rss"
                    import-method="view"
                  ></replace-tag>
                  <replace-tag
                    with="site-git-corner"
                    size="small"
                    circle
                    import-method="view"
                  ></replace-tag>
                </div>
              </div>
            </footer>
          </div>
        </div>
        ${this.responsiveSize == "xl"
          ? html`
              <div class="right-col">
                <div class="site-menu-content-wrapper">
                  <replace-tag
                    with="site-menu-content"
                    import-only
                  ></replace-tag>
                  <site-menu-content
                    .part="${this.editMode ? `edit-mode-active` : ``}"
                  ></site-menu-content>
                </div>
              </div>
            `
          : ``}
      </div>
    `;
  }

  __prevPageLabelChanged(e) {
    this.prevPage = e.detail.value;
  }
  __nextPageLabelChanged(e) {
    this.nextPage = e.detail.value;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      searchTerm: {
        type: String,
      },
      prevPage: {
        type: String,
      },
      nextPage: {
        type: String,
      },
      pageTimestamp: {
        type: Number,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "clean-two";
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    this.searchTerm = "";
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });

    autorun((reaction) => {
      if (
        store.activeItem &&
        store.activeItem.metadata &&
        store.activeItem.metadata.updated
      ) {
        this.pageTimestamp = toJS(store.activeItem.metadata.updated);
      }
      this.__disposer.push(reaction);
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
}
window.customElements.define(CleanTwo.tag, CleanTwo);
export { CleanTwo };
