/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { PrintBranchMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { EmailPageMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/EmailPageMixin.js";
import { PDFPageMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import { QRCodeMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { HAXCMSMobileMenuMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSOperationButtons } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSOperationButtons.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";
import { MicroFrontendRegistry } from "@lrnwebcomponents/micro-frontend-registry/micro-frontend-registry.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-modal.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-content.js";
import { DDDSuper, DDDFonts } from "@lrnwebcomponents/d-d-d/d-d-d.js";
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
class CleanTwo extends HAXCMSOperationButtons(
  HAXCMSRememberRoute(
    EmailPageMixin(
      PDFPageMixin(
        PrintBranchMixin(
          QRCodeMixin(
            HAXCMSThemeParts(
              HAXCMSMobileMenuMixin(DDDSuper(HAXCMSLitElementTheme)),
            ),
          ),
        ),
      ),
    ),
  ),
) {
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          --ddd-theme-body-font-size: var(--ddd-font-size-xxs);
          display: block;
          background-color: white;
          --simple-tooltip-background: var(--ddd-theme-polaris-info);
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: var(--ddd-theme-polaris-infoLight);
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
          --hax-base-styles-a-color-active: #000000;
        }
        .link-actions {
          margin: 0;
          display: block;
          padding: 0;
          border-top: 2px solid #e6ecf1;
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
          --site-menu-button-button-hover-color: var(
            --haxcms-color,
            var(--simple-colors-default-theme-purple-7)
          );
          color: #242a31;
          border: 1px solid #e6ecf1;
          margin: 0;
          display: block;
          padding: 0;
          position: relative;
          align-self: stretch;
          box-shadow: 0 3px 8px 0 rgba(116, 129, 141, 0.1);
          transition: border 0.3s ease;
          align-items: center;
          justify-self: stretch;
          text-overflow: ellipsis;
          border-radius: 3px;
          flex-direction: row;
          text-decoration: none;
          background-color: #ffffff;
          -webkit-box-align: center;
          page-break-inside: avoid;
          -ms-grid-row-align: stretch;
          -webkit-box-orient: horizontal;
          -ms-grid-column-align: stretch;
          -webkit-box-direction: normal;
        }
        replace-tag[with="site-git-corner"],
        site-git-corner {
          height: 40px;
          width: 40px;
          margin-left: -66px;
          padding: 0;
          --github-corner-size: 40px;
          --site-git-corner-color: black;
          --site-git-corner-background: transparent;
          background-color: transparent;
          color: black;
          padding: 8px;
          display: block;
          float: unset;
        }
        .email-btn,
        .print-branch-btn simple-icon-button-lite,
        .pdf-page-btn simple-icon-button-lite {
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
          color: black;
          padding: 8px;
          display: block;
          width: 36px;
          margin-left: -60px;
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
          font-weight: 500;
          line-height: 1.5;
          text-transform: none;
        }
        site-menu-button div .top {
          font-size: 12px;
          font-weight: 400;
          line-height: 1.625;
          color: #444444;
        }
        simple-datetime {
          color: #444444;
        }
        site-menu-button div .bottom {
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
          max-height: 50px;
          overflow: hidden;
        }
        site-menu-button[type="next"] div {
          text-align: left;
        }
        site-menu-button[type="prev"] div {
          text-align: right;
        }
        site-active-title {
          display: block;
          padding: 0;
          flex-wrap: wrap;
          align-items: baseline;
          flex-direction: row;
          -webkit-box-align: baseline;
          -webkit-box-lines: multiple;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
          flex: auto;
          margin: 0;
          background-color: white;
        }
        site-active-title h1 {
          margin: 0 0 var(--ddd-spacing-4) 0;
        }

        .body-wrapper {
          flex: 1;
          height: auto;
          height: 100vh;
          position: absolute;
          font-size: 16px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          padding: 0;
          transition: margin-bottom 0.3s ease;
          align-items: stretch;
          -moz-transition: margin-bottom 0.3s ease;
          -webkit-box-align: stretch;
          overflow-x: hidden;
        }
        :host([is-logged-in]) .body-wrapper {
          height: calc(100vh - 48px);
        }
        :host([menu-open]) .body-wrapper .left-col {
          margin-left: 0px;
          position: sticky;
          top: 0px;
        }
        .body-wrapper .content-wrapper .content {
          margin: 0;
          padding: 0 var(--ddd-spacing-2) var(--ddd-spacing-8) var(--ddd-spacing-16);
        }

        nav {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          flex: 0 0 auto;
          display: flex;
          z-index: 15;
          min-width: 332px;
          background: #f5f7f9;
          align-items: stretch;
          border-right: 1px solid #e6ecf1;
          flex-direction: column;
          -webkit-box-align: stretch;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        .left-col {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          flex: 0 1 0%;
          margin: 0;
          padding: 0;
          margin-left: -332px;
          background-color: #f5f7f9;
          transition: margin 0.3s ease;
          height: fit-content;
        }
        @media screen and (min-width: 900px) {
          .left-col {
            flex: 0 0 auto;
            width: auto;
            z-index: 15;
            width: 332px;
            align-items: stretch;
            border-right: 1px solid #e6ecf1;
            flex-direction: column;
            -webkit-box-align: stretch;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
          }
        }
        site-menu {
          --site-menu-color: #000000;
          --site-menu-active-color: #e6ecf1;
          --site-menu-item-active-item-color: var(
            --simple-colors-default-theme-light-blue-1,
            rgba(100, 100, 255, 0.1)
          );
          font-family: var(--ddd-font-navigation);
          --site-menu-font-size: var(--ddd-font-size-xs);
          overflow-y: auto;
          flex: 1 1 auto;
          height: calc(100vh - var(--ddd-spacing-10));
          width: 300px;
          left: 0;
          margin: 0;
          display: block;
          padding: var(--ddd-spacing-10) var(--ddd-spacing-4);
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }

        site-menu::part(map-menu) {
          margin-right: -16px;
          padding-right: 8px;
        }

        :host([is-logged-in]) site-menu {
          height: calc(100vh - 48px - var(--ddd-spacing-10));
        }

        main {
          margin: 0 auto;
          max-width: 800px;
          padding: 0 32px;
        }
        :host([responsive-size="xl"]) main {
          max-width: 900px;
          padding: 0 6vw;
        }
        :host([responsive-size="lg"]) main {
          width: 800px;
        }

        .qr-code-btn {
          padding: 8px;
          display: block;
          margin-left: -60px;
          width: 36px;
        }
        .content-wrapper {
          max-width: 100%;
          margin: 0;
          display: flex;
          padding: 0;
          background-color: #ffffff;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        .header {
          z-index: 2;
          height: 0;
          margin-top: var(--ddd-spacing-10);
        }
        :host([edit-mode]) .header {
          z-index: unset;
        }
        .header #haxcmsmobilemenubutton {
          margin-left: -52px;
          padding: 4px;
          color: black;
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
        }
        .header site-menu-content {
          display: inline-flex;
          float: right;
          color: black;
          margin-right: -52px;
        }
        .header site-menu-content[mobile] {
          position: fixed;
          right: 16px;
          top: 64px;
          width: 32px;
          height: 32px;
          margin-right: 0px;
          display: block;
          background-color: var(--hax-ui-background-color, #ffffff);
        }
        .content {
          flex: 1 1 auto;
          margin: 0px 16px;
          display: block;
          padding: 0;
        }
        @media screen and (max-width: 640px) {
          site-breadcrumb {
            display: none;
          }
          .header {
            height: 0px;
          }
          site-active-title h1 {
            width: 100%;
            word-break: break-all;
          }
        }
        @media screen and (max-width: 400px) {
          .content {
            min-width: 200px;
          }
          .body-wrapper {
            overflow-x: hidden;
          }

          :host([menu-open]) #haxcmsmobilemenubutton {
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
        @media screen and (max-width: 600px) {
          .link-actions .inner {
            display: block;
          }
          site-menu-button {
            margin: 10px 0;
          }
          #slot ::slotted(iframe) {
            width: auto;
          }
          #slot ::slotted(h1),
          #slot ::slotted(h2),
          #slot ::slotted(h3) {
            font-size: 1.1em !important;
          }
          #slot ::slotted(h4),
          #slot ::slotted(h5),
          #slot ::slotted(h6) {
            font-size: 0.9em !important;
          }
          #slot ::slotted(replace-tag) {
            overflow: hidden;
          }
        }
        .right-col {
          margin: 0;
          padding: 0;
          position: relative;
          margin-right: auto;
          max-width: 100%;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          min-height: 100%;
          color: #3b454e;
        }
        .site-menu-content-wrapper {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          flex: 0 0 auto;
          padding-right: 0;
          width: 200px;
          flex: 1;
          margin: 0;
          display: block;
          max-height: 976px;
          z-index: 1;
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          height: 100%;
          margin: 0;
          display: flex;
          margin-top: 100px;
          flex-direction: column;
          padding-bottom: 40px;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        .right-col site-menu-content {
          flex: 1;
          width: 200px;
          margin: 0;
          display: flex;
          padding: 0;
          background-color: #ffffff;
          overflow: hidden;
          position: fixed;
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
        }
        .footer {
          margin: 0;
          display: flex;
          padding: 0;
          border-top: 2px solid #e6ecf1;
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
        simple-icon-button,
        site-rss-button,
        replace-tag[with="site-rss-button"],
        replace-tag[with="site-print-button"],
        site-print-button {
          color: black;
        }
        site-rss-button,
        site-print-button,
        site-modal {
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
          padding: 8px;
          display: block;
          margin-left: -52px;
          width: 36px;
        }
        site-breadcrumb {
          --site-breadcrumb-margin: var(--ddd-spacing-2) 0 var(--ddd-spacing-7);
        }
        .search-modal-btn {
          margin-top: 16px;
        }
      `,
    ];
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    document.body.style.overflow = "hidden";
    this.HAXCMSThemeSettings.scrollTarget =
      this.shadowRoot.querySelector(".body-wrapper");
    window.AbsolutePositionStateManager.requestAvailability().scrollTarget =
      this.HAXCMSThemeSettings.scrollTarget;
    // shadow ready which means we should be able to open this even on a slow load
    // if we are the route in question
    store.internalRoutes["search"].callback = this.siteModalForceClick;
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
        <div class="left-col" part="left-col">${this.HAXCMSMobileMenu()}</div>
        <div class="content-wrapper">
          <div class="content">
            <header class="header">
              ${!["lg", "xl"].includes(this.responsiveSize)
                ? html`
                    <div part="site-menu-content">
                      <site-menu-content
                        .part="${this.editMode ? `edit-mode-active` : ``}"
                        mobile
                      ></site-menu-content>
                    </div>
                  `
                : ``}
              ${this.HAXCMSMobileMenuButton("right")}
              <site-modal
                @site-modal-click="${this.siteModalClick}"
                ?disabled="${this.editMode}"
                icon="icons:search"
                title="Search site"
                class="search-modal-btn"
                button-label="Search"
                part="search-btn"
                position="right"
              >
                <site-search></site-search>
              </site-modal>
              ${MicroFrontendRegistry.has("@core/htmlToPdf")
                ? this.PDFPageButton()
                : ``}
              ${MicroFrontendRegistry.has("@haxcms/siteToHtml")
                ? this.PrintBranchButton()
                : html`<replace-tag
                    with="site-print-button"
                    position="right"
                    class="btn js-toolbar-action"
                    import-method="view"
                    part="print-btn"
                  ></replace-tag>`}
              ${this.EmailPageButton("right")} ${this.QRCodeButton("right")}
              <replace-tag
                with="site-rss-button"
                type="rss"
                import-method="view"
                part="rss-btn"
                position="right"
              ></replace-tag>
              <replace-tag
                with="site-git-corner"
                size="small"
                circle
                position="right"
                direction="right"
                import-method="view"
                part="git-corner-btn"
              ></replace-tag>
            </header>
            <site-search
              hide-input
              part="search-btn"
              search="${this.searchTerm}"
              @search-item-selected="${this.searchItemSelected}"
              ?hidden="${this.searchTerm != "" ? false : true}"
            ></site-search>
            <main>
              <div id="haxcms-theme-top"></div>
              <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
              <site-active-title part="page-title"></site-active-title>
              <site-active-tags
                part="page-tags"
                auto-accent-color
              ></site-active-tags>
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
              <div class="footer" part="footer">
                <div class="footer-left" part="footer-left">
                  Last updated
                  <replace-tag with="simple-datetime" import-only></replace-tag>
                  <simple-datetime
                    unix
                    .timestamp="${this.pageTimestamp}"
                  ></simple-datetime>
                </div>
              </div>
            </footer>
          </div>
        </div>
        ${["lg", "xl"].includes(this.responsiveSize)
          ? html`
              <div class="right-col" part="site-menu-content right-col">
                <div class="site-menu-content-wrapper">
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
    let props = {};
    if (super.properties) {
      props = super.properties;
    }
    return {
      ...props,
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
    this.loadDDDFonts(DDDFonts);
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
  siteModalForceClick(e) {
    setTimeout(() => {
      const theme = document.querySelector("clean-two");
      // edge cases where we're switching themes and this callback is not valid
      if (
        theme &&
        theme.shadowRoot &&
        theme.shadowRoot.querySelector("site-modal") &&
        theme.shadowRoot.querySelector("site-modal").shadowRoot &&
        theme.shadowRoot
          .querySelector("site-modal")
          .shadowRoot.querySelector("simple-icon-button-lite")
      ) {
        theme.shadowRoot
          .querySelector("site-modal")
          .shadowRoot.querySelector("simple-icon-button-lite")
          .click();
      }
    }, 500);
  }
  /**
   * Delay importing site-search until we click to open it directly
   */
  siteModalClick(e) {
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js"
    ).then((m) => {
      if (store.getInternalRoute() !== 'search') {
        window.history.replaceState({}, null, "x/search");
      }
      const params = new URLSearchParams(store.currentRouterLocation.search);
      const input = window.SimpleModal.requestAvailability().querySelector("site-search").shadowRoot.querySelector("simple-fields-field");
      input.focus();
      // if we have a search param already, set it to the field on open
      if (params.get("search")) {
        input.value = params.get("search");
        // stall to allow value to be set
        setTimeout(() => {
          input.select();          
        }, 0);
      }
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
customElements.define(CleanTwo.tag, CleanTwo);
export { CleanTwo };
