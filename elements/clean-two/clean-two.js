/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { ResponsiveUtilityBehaviors } from "@lrnwebcomponents/responsive-utility/lib/responsive-utility-behaviors.js";
import "@polymer/paper-icon-button/paper-icon-button.js";

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
  ResponsiveUtilityBehaviors(HAXCMSLitElementTheme)
) {
  //styles function
  static get styles() {
    return [
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
        :host([edit-mode]) {
          opacity: 1;
        }
        /**
        * Hide the slotted content during edit mode. This must be here to work.
        */
       :host([edit-mode]) #slot {
          display: none;
        }
        #slot {
          min-height: 50vh;
        }

        :host([hidden]) {
          display: none;
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
        site-git-corner {
          height: 40px;
          width: 40px;
          margin:0;
          padding:0;
          --site-git-corner-color: black;
          --site-git-corner-background: transparent;
        }
        site-menu-button[edit-mode][disabled] {
          display: block;
        }
        site-menu-button[disabled] {
          display: none;
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
          color: #9DAAB6;
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
        }

        .body-wrapper {
          flex: 1;
          height: auto;
          min-height: 100vh;
          font-size: 16px;
          color: #3B454E;
          background-color: #ffffff;
          width: 100%;
          margin: 0 auto;
          display: flex;
          padding: 0;
          transition: margin-bottom 250ms ease;
          align-items: stretch;
          -moz-transition: margin-bottom 250ms ease;
          -webkit-box-align: stretch;
          -webkit-transition: margin-bottom 250ms ease;
        }
        :host([is-logged-in]) .body-wrapper.with-menu {
          margin-left: 48px;
        }
        .body-wrapper.with-menu .left-col {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
        }
        @media screen and (max-width: 1024px) {
          :host([is-logged-in]) .body-wrapper.with-menu nav {
            margin-left: 48px;
          }
          :host([is-logged-in]) .body-wrapper.with-menu .content-wrapper {
            margin-left: 0;
          }
          :host .body-wrapper .content-wrapper {
            margin-left: 48px;
            margin-right: 48px;
            width: auto;
          }
          .body-wrapper .content-wrapper .content {
            width: auto;
            margin: 0;
            padding: 32px;
          }
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
            min-width: 300px;
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
          --site-menu-active-color: #E6ECF1;
          --site-menu-item-active-item-color: var(--haxcms-color, var(--simple-colors-default-theme-purple-7));
          overflow-y: auto;
          flex: 1 1 auto;
          width: 300px;
          margin: 32px 0 32px -24px;
          display: block;
          padding: 0;
          position: fixed;
          font-size: 15px;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        .content-wrapper {
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
          background-color: white;
          z-index: 2;
          height: 40px;
        }
        .content site-menu-content {
          display: inline-flex;
          float: right;
          color: black;
          font-size: 1.5em;
        }
        .content #menubtn {
          float: left;
        }
        @media screen and (min-width: 1024px) {
          .content-wrapper {
            margin: 0px 88px;
          }
        }
        .content {
          flex: 1 1 auto;
          margin: 0px 16px;
          display: block;
          padding: 0;
          width: 750px;
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
          min-width: 300px;
          padding-right: calc((100vw - 1448px) / 3);
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
          color: #888888;
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
        }
        paper-icon-button,
        site-rss-button,
        site-print-button {
          --iron-icon-fill-color: black;
          --haxcms-tooltip-color: #F5F5F5;
          --haxcms-tooltip-background-color: #252737;
        }
      `
    ];
  }
  searchItemSelected(e) {
    // an item was picked, let's just make the UI jump to that item
    this.searchTerm = "";
  }
  searchChanged(e) {
    if (e.path[0].value) {
      import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js").then(
        () => {
          this.searchTerm = e.path[0].value;
        }
      );
    } else {
      this.searchTerm = "";
    }
  }
  // render function
  render() {
    return html`
      <div class="body-wrapper ${this.withMenu}">
        <div class="left-col">
          <nav id="nav" role="navigation" aria-labelledby="leftnavheading">
            <site-menu id="leftnavheading"></site-menu>
          </nav>
        </div>
        <div class="content-wrapper">
          <div class="content">
            ${this.responsiveSize != "xl"
              ? html`
                  <div class="header">
                    <paper-icon-button
                      .part="${this.editMode ? `edit-mode-active` : ``}"
                      icon="icons:menu"
                      id="menubtn"
                      @click="${this.toggleMenu}"
                    ></paper-icon-button>
                    <site-menu-content mobile></site-menu-content>
                  </div>
                `
              : ``}
            <site-active-title></site-active-title>
            <site-search
              hide-input
              search="${this.searchTerm}"
              @search-item-selected="${this.searchItemSelected}"
              ?hidden="${this.searchTerm != "" ? false : true}"
            ></site-search>
            <div
              id="contentcontainer"
              ?hidden="${this.searchTerm != "" ? true : false}"
            >
              <div id="slot">
                <slot></slot>
              </div>
            </div>
            <div class="link-actions">
              <div class="inner">
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
                <simple-datetime
                  unix
                  .timestamp="${this.pageTimestamp}"
                ></simple-datetime>
              </div>
              <div class="footer-right">
                <site-print-button
                  class="btn js-toolbar-action"
                ></site-print-button>
                <site-print-button
                  type="site"
                  class="btn js-toolbar-action"
                ></site-print-button>
                <site-rss-button type="rss"></site-rss-button>
                <site-git-corner size="small" circle></site-git-corner>
              </div>
            </div>
          </div>
        </div>
        ${this.responsiveSize == "xl"
          ? html`
              <div class="right-col">
                <div class="site-menu-content-wrapper">
                  <site-menu-content></site-menu-content>
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
        type: String
      },
      withMenu: {
        type: String
      },
      prevPage: {
        type: String
      },
      nextPage: {
        type: String
      },
      pageTimestamp: {
        type: Number
      }
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
    this.withMenu = "with-menu";
    this.HAXCMSThemeSettings.autoScroll = true;
    this.searchTerm = "";
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun(reaction => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });

    autorun(reaction => {
      if (
        store.activeItem &&
        store.activeItem.metadata &&
        store.activeItem.metadata.updated
      ) {
        this.pageTimestamp = toJS(store.activeItem.metadata.updated);
      }
      this.__disposer.push(reaction);
    });

    import("@lrnwebcomponents/simple-datetime/simple-datetime.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-content.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-print-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-git-corner.js");
  }
  toggleMenu(e) {
    if (this.withMenu == "with-menu") {
      this.withMenu = "";
      this.shadowRoot.querySelector("#nav").setAttribute("tabindex", "-1");
    } else {
      this.withMenu = "with-menu";
      this.shadowRoot.querySelector("#nav").removeAttribute("tabindex");
    }
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
