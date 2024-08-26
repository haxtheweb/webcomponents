/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { HAXCMSRememberRoute } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { QRCodeMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { EmailPageMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/EmailPageMixin.js";
import { HAXCMSMobileMenuMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { LTIResizingMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/LTIResizingMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/scroll-button/scroll-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "./lib/clean-one-search-box.js";
import { PrintBranchMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { PDFPageMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `clean-one`
 * `Clean HAXcms theme, one.`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @demo demo/index.html
 * @element clean-one
 */
class CleanOne extends LTIResizingMixin(
  PrintBranchMixin(
    PDFPageMixin(
      EmailPageMixin(
        QRCodeMixin(
          HAXCMSThemeParts(
            HAXCMSMobileMenuMixin(
              HAXCMSRememberRoute(DDDSuper(HAXCMSLitElementTheme)),
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
      super.styles,
      css`
        :host {
          width: 100%;
          margin: 0;
          display: flex;
          padding: 0;
          min-height: 100vh;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          --ddd-theme-body-font-size: var(--ddd-font-size-xxs);
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          color: light-dark(black, var(--ddd-accent-6));
          --simple-tooltip-background: var(--ddd-theme-default-info);
          --simple-tooltip-text-color: var(--ddd-theme-default-infoLight);
          --simple-tooltip-opacity: 1;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }
        site-git-corner {
          --site-git-corner-background: black;
        }

        :host([hidden]) {
          display: none;
        }
        [hidden] {
          display: none;
        }
        site-menu-button:not(:defined) {
          display: none;
        }
        .btn-container {
          z-index: 2;
          height: 50px;
          padding: 6px;
        }
        .btn-container .btn {
          padding: 8px 4px;
        }
        site-menu {
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          color: light-dark(black, var(--ddd-accent-6));
          height: var(--clean-one-site-menu-height, calc(100vh - 60px));
          --site-menu-active-color: var(
            --haxcms-user-styles-color-theme-color-3
          );
          --site-menu-item-active-item-color: var(
            --simple-colors-default-theme-light-blue-1,
            rgba(100, 100, 255, 0.1)
          );
          --haxcms-tooltip-color: var(--ddd-theme-default-infoLight);
          --haxcms-tooltip-background-color: var(--ddd-theme-default-info);
          --map-menu-item-a-active-background-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --map-menu-item-a-active-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          --map-menu-item-icon-active-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --site-menu-container-background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          font-family: var(--ddd-font-navigation);
          --site-menu-font-size: var(--ddd-font-size-3xs);
        }

        :host([is-logged-in]) site-menu {
          height: var(--clean-one-site-menu-height, calc(100vh - 108px));
        }
        scroll-button {
          --scroll-button-color: var(--haxcms-user-styles-color-theme-color-1);
          --scroll-button-background-color: var(
            --haxcms-user-styles-color-theme-color-2
          );
          --scroll-button-tooltip-background-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
          --scroll-button-tooltip-color: var(
            --haxcms-user-styles-color-theme-color-2
          );
        }
        simple-icon-button,
        simple-icon-button-lite,
        site-rss-button,
        site-print-button,
        site-git-corner {
          color: light-dark(
            var(--site-print-button-color, black),
            var(--ddd-accent-6)
          );
          --site-git-corner-background: var(
            --haxcms-user-styles-color-theme-color-1
          );
          --site-git-corner-color: var(
            --haxcms-user-styles-color-theme-color-2
          );
          --simple-icon-fill-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
          --haxcms-tooltip-color: var(--ddd-theme-default-infoLight);
          --haxcms-tooltip-background-color: var(--ddd-theme-default-info);
        }
        .pdf-page-btn,
        .print-branch-btn {
          padding: 8px 4px;
          display: inline-flex;
        }
        site-breadcrumb {
          --site-breadcrumb-margin: var(--ddd-spacing-2) 0 var(--ddd-spacing-7);
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
          --site-menu-button-link-decoration: none;
          --site-menu-button-button-hover-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --haxcms-tooltip-color: var(--ddd-theme-default-infoLight);
          --haxcms-tooltip-background-color: var(--ddd-theme-default-info);
          --site-menu-button-button-hover-background-color: var(
            --ddd-theme-default-limestoneLight
          );
        }
        scroll-button,
        site-breadcrumb {
          color: light-dark(black, var(--ddd-accent-6));
          --site-breadcrumb-color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          --site-breadcrumb-last-color: light-dark(black, var(--ddd-accent-6));
        }

        * {
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          -webkit-tap-highlight-color: transparent;
          -webkit-text-size-adjust: none;
          -webkit-touch-callout: none;
          -webkit-font-smoothing: antialiased;
        }
        /* links */

        :host([menu-open]) .menu-outline {
          left: 0;
        }
        .menu-outline {
          position: absolute;
          top: 0;
          left: -300px;
          bottom: 0;
          z-index: 1;
          overflow-y: hidden;
          width: 300px;
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          color: light-dark(black, var(--ddd-accent-6));
          border-right: var(--ddd-border-xs);
          transition: left 0.3s ease;
        }
        /* content */
        .main-section h1 {
          font-size: 2em;
        }
        :host([edit-mode]) .main-section {
          outline: 1px solid grey;
          outline-offset: 20px;
        }
        .main-content h1,
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5,
        .main-content h6 {
          margin-top: 1.275em;
          margin-bottom: 0.85em;
          font-weight: 700;
        }
        .main-content h1,
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5 {
          page-break-after: avoid;
        }
        :host([responsive-size="xs"][menu-open]) .pull-right {
          display: none;
        }
        .pull-right {
          top: 4px;
          right: 16px;
          position: fixed;
        }
        :host([is-logged-in]) .pull-right {
          margin-top: 48px;
        }
        #emailbtnwrapper {
          display: inline-flex;
        }
        .main-content ::slotted(*) {
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-size: inherit;
        }
        @media (prefers-reduced-motion: reduce) {
          #site-search-input,
          .site-body,
          .navigation,
          .menu-outline {
            transition: none !important;
          }
        }

        :host([menu-open]) .site-body {
          left: 300px;
        }
        .site-body {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          min-width: 375px;
          overflow-y: auto;
          transition: left 0.3s ease;
        }

        :host([responsive-size="xs"]) .page-wrapper,
        :host([responsive-size="sm"]) .page-wrapper,
        :host([responsive-size="md"]) .page-wrapper,
        :host([responsive-size="lg"]) .page-wrapper {
          padding: 48px 16px;
        }
        :host([responsive-size="sm"]) .page-wrapper {
          padding: 24px;
        }

        :host([responsive-size="xs"]) .page-inner {
          overflow-x: auto;
          text-align: left;
        }
        @media screen and (max-width: 640px) {
          site-breadcrumb {
            display: none;
          }
          .site-header {
            padding: 0px;
          }
          .header {
            height: 0px;
          }
          .main-content site-active-title h1 {
            height: 48px;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            font-size: var(--ddd-font-size-xs);
          }
        }
        h1 {
          font-size: 2em;
          margin: 0.67em 0;
        }
        .main-content h2 {
          font-size: 1.75em;
        }
        .main-content h3 {
          font-size: 1.5em;
        }
        .main-content h4 {
          font-size: 1.25em;
        }
        .main-content h5 {
          font-size: 1em;
        }
        .main-content h6 {
          font-size: 1em;
          color: #777;
        }
        .main-content h1,
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5,
        .main-content h6 {
          margin-top: 1.275em;
          margin-bottom: 0.85em;
          font-weight: 700;
        }

        .main-content h1,
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5 {
          page-break-after: avoid;
        }
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5,
        .main-content p {
          orphans: 3;
          widows: 3;
        }
        .main-content blockquote,
        .main-content dl,
        .main-content ol,
        .main-content p,
        .main-content table,
        .main-content ul {
          margin-top: 0;
          margin-bottom: 0.85em;
        }
        .main-content ol,
        .main-content ul {
          padding: 0;
          margin: 0;
          margin-bottom: 0.85em;
          padding-left: 2em;
        }
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5,
        .main-content p {
          orphans: 3;
          widows: 3;
        }
        article,
        aside,
        details,
        figcaption,
        figure,
        header,
        hgroup,
        main,
        nav,
        section,
        summary {
          display: block;
        }
        footer {
          display: flex;
        }
        .site-header {
          overflow: visible;
          z-index: 2;
          background: transparent;
          position: fixed;
          display: block;
          padding: 0 16px;
        }
        @media (max-width: 1400px) {
          .site-header {
            height: 50px;
            position: fixed;
            width: 100vw;
            background-color: light-dark(white, black);
          }
          .pdf-page-btn,
          .print-branch-btn,
          .btn-container .btn {
            padding: 0 4px;
          }
        }
        @media (max-width: 900px) {
          footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
          }
          :host([menu-open]) footer {
            left: 300px;
          }
        }

        @media (max-width: 700px) {
          .link-actions {
            display: none;
          }
        }
        @media (max-width: 1240px) {
          .site-body .body-inner {
            position: static;
            min-height: calc(100% - 98px);
          }
        }
        @media (max-width: 1240px) {
          .site-body {
            padding-bottom: 20px;
          }
        }
        .site-body .site-inner {
          position: relative;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          overflow-y: auto;
        }
        .page-wrapper {
          position: relative;
          outline: 0;
        }
        .page-inner {
          position: relative;
          max-width: 840px;
          margin: 0 auto;
          min-height: 90vh;
          padding: 20px 15px 40px 15px;
        }
        .main-section {
          display: block;
          word-wrap: break-word;
          color: var(--haxcms-user-styles-color-theme-color-color);
          line-height: 1.7;
          text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
        }
        /* Navigation arrows */
        site-menu-button {
          --site-menu-button-icon-width: 64px;
          --site-menu-button-icon-height: 64px;
        }
        :host([menu-open]) site-menu-button[type="prev"] {
          left: 300px;
        }
        site-menu-button[type="prev"] {
          left: 0;
        }
        site-menu-button[type="next"] {
          right: 0;
        }
        .main-content site-active-title h1 {
          margin: 0 0 var(--ddd-spacing-4) 0;
        }
        .navigation {
          position: fixed;
          top: 40vh;
          bottom: 20vh;
          margin: 0 20px;
          max-width: 150px;
          min-width: 90px;
          display: flex;
          justify-content: center;
          align-content: center;
          flex-direction: column;
          font-size: 40px;
          color: #ccc;
          text-align: center;
        }
        @media screen and (max-width: 600px) {
          .page-wrapper {
            width: 100vw;
          }
          #slot ::slotted(iframe) {
            width: auto;
          }
          #slot ::slotted(h1),
          #slot ::slotted(h2),
          #slot ::slotted(h3) {
            font-size: 1.5em !important;
          }
          #slot ::slotted(h4),
          #slot ::slotted(h5),
          #slot ::slotted(h6) {
            font-size: 1.2em !important;
          }
          #slot ::slotted(replace-tag) {
            overflow: hidden;
          }
        }
        @media (max-width: 1240px) {
          .navigation {
            position: static;
            margin: 0 auto;
            display: inline-flex;
          }
        }
        /* color,font,size switchers */

        .site-header .font-settings .font-enlarge {
          line-height: 30px;
          font-size: 1.4em;
        }
        .site-header .font-settings .font-reduce {
          line-height: 30px;
          font-size: 1em;
        }
        .site-header .font-settings .font-reduce {
          line-height: 30px;
          font-size: 1em;
        }

        .site-body {
          overflow-y: scroll;
          color: var(--haxcms-user-styles-color-theme-color-color);
          background: var(--haxcms-user-styles-color-theme-color-background);
        }

        button,
        select {
          text-transform: none;
        }
        button,
        input {
          line-height: normal;
        }
        button,
        input,
        select,
        textarea {
          font-family: inherit;
          font-size: 100%;
          margin: 0;
        }
        scroll-button {
          position: absolute;
          bottom: 0;
          right: 16px;
        }
        #site-search-input {
          padding: 6px;
          background: 0 0;
          transition: top 0.5s ease;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
          border-top: 1px solid rgba(0, 0, 0, 0.07);
          margin-bottom: 10px;
          margin-top: -1px;
        }
        site-search {
          height: auto;
          width: auto;
          font-size: inherit;
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          color: light-dark(black, var(--ddd-accent-6));
        }
      `,
    ];
  }

  // render function
  render() {
    return html`
      <div class="site">
        <div class="menu-outline">
          <div id="site-search-input" role="search" part="search-btn">
            <clean-one-search-box
              @input-changed="${this.searchChanged}"
              value="${this.searchTerm}"
            ></clean-one-search-box>
          </div>
          ${this.HAXCMSMobileMenu()}
        </div>
        <div id="body" class="site-body" part="site-body">
          <div id="haxcms-theme-top"></div>
          <div class="site-inner">
            <header class="site-header">
              <div class="btn-container">
                <div class="pull-left">
                  ${this.HAXCMSMobileMenuButton()}
                  ${MicroFrontendRegistry.has("@haxcms/siteToHtml")
                    ? this.PrintBranchButton("bottom")
                    : html`
                        <site-print-button
                          class="btn js-toolbar-action"
                          part="print-btn"
                        ></site-print-button>
                      `}
                  ${MicroFrontendRegistry.has("@core/htmlToPdf")
                    ? this.PDFPageButton("bottom")
                    : ``}
                </div>
                <div class="pull-right">
                  ${this.EmailPageButton()} ${this.QRCodeButton()}
                  <site-rss-button
                    type="rss"
                    class="btn js-toolbar-action"
                    part="rss-btn"
                  ></site-rss-button>
                  <site-git-corner
                    size="small"
                    part="git-corner-btn"
                  ></site-git-corner>
                </div>
              </div>
            </header>
            <main class="page-wrapper" role="main">
              <article class="main-content page-inner">
                <site-breadcrumb
                  part="page-breadcrumb ${this.editMode
                    ? `edit-mode-active`
                    : ``}"
                  ?hidden="${this.searchTerm != "" ? true : false}"
                ></site-breadcrumb>
                <site-active-title
                  part="page-title"
                  ?hidden="${this.searchTerm != "" ? true : false}"
                ></site-active-title>
                <site-active-tags
                  part="page-tags"
                  auto-accent-color
                  ?hidden="${this.searchTerm != "" ? true : false}"
                ></site-active-tags>
                <div class="normal main-section">
                  <site-search
                    hide-input
                    part="search-btn"
                    search="${this.searchTerm}"
                    ?hidden="${this.searchTerm != "" ? false : true}"
                  ></site-search>
                  <section
                    id="contentcontainer"
                    ?hidden="${this.searchTerm != "" ? true : false}"
                  >
                    <div id="slot">
                      <slot></slot>
                    </div>
                  </section>
                </div>
              </article>
            </main>
          </div>
          <footer>
            <!-- These two buttons allow you to go left and right through the pages in the manifest -->
            <site-menu-button
              type="prev"
              position="right"
              class="navigation"
            ></site-menu-button>
            <site-menu-button
              type="next"
              position="left"
              class="navigation"
            ></site-menu-button>
          </footer>
        </div>
        <scroll-button
          .part="${this.editMode ? `edit-mode-active` : ``}"
        ></scroll-button>
      </div>
    `;
  }

  searchChanged(e) {
    if (e.detail.value) {
      // prettier-ignore
      import(
         "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
       ).then(() => {
        if (store.getInternalRoute() !== 'search') {
          globalThis.history.replaceState({}, null, "x/search");
        }
         this.searchTerm = e.detail.value;
       });
    } else {
      this.searchTerm = "";
    }
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      searchTerm: {
        type: String,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "clean-one";
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    this.searchTerm = "";
    // prettier-ignore
    import(
       "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js"
     );
    // prettier-ignore
    import(
       "@haxtheweb/haxcms-elements/lib/ui-components/site/site-print-button.js"
     );
    // prettier-ignore
    import(
       "@haxtheweb/haxcms-elements/lib/ui-components/site/site-rss-button.js"
     );
    // prettier-ignore
    import(
       "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-git-corner.js"
     );
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.searchTerm = "";
      this.__disposer.push(reaction);
    });
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // only way to hit this
    globalThis.document.body.style.overflow = "hidden";
    this.HAXCMSThemeSettings.scrollTarget =
      this.shadowRoot.querySelector("main");
    globalThis.AbsolutePositionStateManager.requestAvailability().scrollTarget =
      this.HAXCMSThemeSettings.scrollTarget;
    // hook up the scroll target
    this.shadowRoot.querySelector("scroll-button").target =
      this.shadowRoot.querySelector("main");

    const params = new URLSearchParams(store.currentRouterLocation.search);
    // if we have a search param already, set it to the field on open
    if (store.getInternalRoute() === "search" && params.get("search")) {
      import(
        "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
      ).then(() => {
        this.searchTerm = params.get("search");
        this.shadowRoot.querySelector("clean-one-search-box").focus();
        // stall to allow value to be set
        setTimeout(() => {
          this.shadowRoot.querySelector("clean-one-search-box").select();
        }, 0);
      });
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
  /**
   * Previous page to hook into when prev is hit
   */
  prevPage(e) {
    super.prevPage(e);
  }
  /**
   * Next page to hook into when next is hit
   */
  nextPage(e) {
    super.nextPage(e);
  }
}
customElements.define(CleanOne.tag, CleanOne);
export { CleanOne };
