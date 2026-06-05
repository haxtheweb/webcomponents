/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { PrintBranchMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { PDFPageMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import { QRCodeMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { HAXCMSMobileMenuMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSOperationButtons } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSOperationButtons.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/scroll-button/scroll-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/blocks/site-children-block.js";
import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
/**
 * @title Polaris
 * `A HAXcms inspired by an old wordpress theme
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @haxcms-theme-category Website
 * @haxcms-theme-internal false
 * @haxcms-theme-priority 10
 * @demo demo/index.html
 * @element polaris-theme
 */
class PolarisTheme extends HAXCMSOperationButtons(
  PDFPageMixin(
    PrintBranchMixin(
      QRCodeMixin(
        HAXCMSThemeParts(
          HAXCMSMobileMenuMixin(DDDSuper(HAXCMSLitElementTheme)),
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
          display: block;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          color-scheme: light dark;
          --polaris-bg-color: light-dark(#f5f5f5, #141720);
          --polaris-content-bg-color: light-dark(#ffffff, #1f2432);
          --polaris-header-bg-color: light-dark(#262c3a, #0f1629);
          --polaris-nav-bg-color: light-dark(#1173ca, #215a97);
          --polaris-footer-secondary-bg-color: light-dark(#262c3a, #0f1629);
          --polaris-footer-primary-bg-color: light-dark(#141720, #0b0e17);
          --polaris-link-color: light-dark(#1173ca, #7bb7ff);
          --polaris-link-hover-color: light-dark(#0b4b83, #b2d5ff);
          --polaris-muted-color: light-dark(#999, #c7ceda);
          background-color: var(--polaris-bg-color);
        }
        :host([dark-mode]) {
          color: #f5f5f5;
          --polaris-bg-color: #111827;
          --polaris-content-bg-color: #1f2937;
          --polaris-header-bg-color: #111827;
          --polaris-nav-bg-color: #0b4b83;
          --polaris-footer-secondary-bg-color: #111827;
          --polaris-footer-primary-bg-color: #020617;
        }

        .search-modal-btn {
          --simple-icon-width: 36px;
          --simple-icon-height: 36px;
          padding: 6px;
          color: white;
        }
        scroll-button {
          position: fixed;
          right: 0px;
          bottom: 125px;
          z-index: 10000;
          --simple-icon-width: 48px;
          --simple-icon-height: 48px;
          --simple-icon-button-border-radius: none;
        }
        .entry-content a {
          color: var(--polaris-link-color);
        }
        :host([dark-mode]) .entry-content a,
        :host([dark-mode]) a {
          color: #9ecbff;
        }

        site-active-title {
          font-size: 28px;
          line-height: 1;
          font-family: "Open Sans", sans-serif;
          font-weight: 300;
        }
        site-active-title h1 {
          margin: 0;
          padding: 0;
          font-size: 36px;
        }
        site-breadcrumb {
          margin: 0 0 16px 4px;
        }

        header .wrap {
          padding: 40px 0;
        }

        .content.wrap {
          clear: both;
          padding-top: 40px;
        }

        .site-inner,
        .wrap {
          margin: 0 auto;
          max-width: 1140px;
        }

        article {
          border-radius: 3px;
          margin-bottom: 40px;
          margin-bottom: 40px;
          padding: 40px 40px 24px;
          padding: 40px 40px 24px;
          background-color: var(--polaris-content-bg-color);
        }

        header:not(:empty) {
          background-color: var(--polaris-header-bg-color);
        }

        nav {
          background-color: var(--polaris-nav-bg-color);
        }
        .site-title {
          color: #ffffff;
        }
        .title-area {
          width: 63%;
          margin-left: 30px;
          padding: 12px 0px 0px 0px;
          float: left;
          font-family: "Lato", sans-serif;
          font-weight: 700;
        }
        site-top-menu {
          --site-top-menu-bg: var(--polaris-nav-bg-color);
          --site-top-menu-indicator-color: #ffffff;
          --site-top-menu-link-active-color: #ffffff;
          --site-top-menu-link-color: #ededed;
          --site-top-menu-link-bg-color-hover: #ffffff;
          --site-top-menu-link-bg-color-hover: #0b4b83;
          clear: both;
          font-family: "Lato", sans-serif;
          line-height: 1.5;
          width: 100%;
        }
        site-top-menu::part(button) {
          font-size: 16px;
          padding: 20px 16px;
          font-weight: 400;
          text-transform: uppercase;
        }
        site-top-menu::part(indicator) {
          margin-top: -8px;
        }
        main {
          float: left;
          width: 740px;
        }
        aside {
          float: right;
          width: 360px;
        }
        aside section h4 {
          font-size: 16px;
          margin: 0 0 24px 0;
          text-transform: uppercase;
          font-family: "Open Sans", sans-serif;
          font-weight: 300;
        }

        aside section {
          background-color: var(--polaris-content-bg-color);
          border-radius: 3px;
          margin-bottom: 40px;
          padding: 40px;
        }
        :host([dark-mode]) aside section {
          background-color: var(--polaris-content-bg-color);
        }

        site-modal {
          float: right;
          --simple-modal-titlebar-background: var(--polaris-nav-bg-color);
        }

        .footer-secondary {
          background-color: var(--polaris-footer-secondary-bg-color);
          color: var(--polaris-muted-color);
          clear: both;
          padding: 40px 16px 16px;
        }

        footer {
          background-color: var(--polaris-footer-primary-bg-color);
        }

        .footer-primary {
          color: #ededed;
          font-size: 14px;
          padding: 40px 16px;
          text-align: center;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          line-height: 22px;
          font-weight: 300;
        }
        .site-inner {
          clear: both;
          padding-top: 40px;
          padding-top: 40px;
        }

        /** stuff to refactor out after this is initially working visually */
        #mark {
          display: inline-flex;
          width: 218px;
          float: left;
          margin: 0px 30px 0px 40px;
        }
        #mark a {
          display: block;
        }
        @media only screen and (max-width: 1023px) {
          #mark {
            float: none;
            margin: 15px auto;
            max-width: 218px;
            width: 100%;
            text-align: center;
            display: block;
          }
        }
        .site-title a,
        .site-title a:hover {
          color: #ededed;
        }
        header a img {
          margin-bottom: -4px;
          margin-bottom: -4px;
        }

        img {
          height: auto;
          width: auto;
        }
        embed,
        iframe,
        img,
        object,
        video,
        .wp-caption {
          max-width: 100%;
        }
        .wrap:after {
          clear: both;
          content: " ";
          display: table;
        }
        .wrap:before {
          content: " ";
          display: table;
        }
        .site-title {
          font-family: "Lato", sans-serif;
          font-size: 28px;
          font-weight: 300;
          line-height: 1;
          margin: 0 0 8px;
          margin: 0 0 8px;
          text-transform: uppercase;
        }
        .site-description {
          color: var(--polaris-muted-color);
          font-family: "Lato", sans-serif;
          font-size: 16px;
          font-weight: 300;
          line-height: 1;
          margin: 0 0 24px;
        }
        :host([dark-mode]) .site-description {
          color: var(--polaris-link-hover-color);
        }
        .footer-secondary a:hover {
          color: #ddd;
        }

        .footer-secondary a {
          border-bottom: 1px solid var(--polaris-muted-color);
          color: var(--polaris-muted-color);
        }
        :host([dark-mode]) .footer-secondary {
          color: #d1d5db;
        }
        :host([dark-mode]) .footer-secondary a {
          border-bottom-color: #d1d5db;
          color: #f5f5f5;
        }
        .footer-secondary p {
          margin: 0 0 24px;
          padding: 0;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 16px;
          font-weight: 300;
          line-height: 26px;
        }
        .footer-logo img {
          width: 110px;
        }
        .footer-logo {
          float: left;
          margin-right: 30px;
        }

        a img {
          margin-bottom: -4px;
          margin-bottom: -4px;
        }
        img {
          height: auto;
          width: auto;
        }
        .footer_links a {
          margin: 0 8px;
        }
        .footer_links {
          text-align: left;
          padding-top: 3px;
        }

        .footer-primary a {
          color: var(--polaris-link-color);
          border-bottom: 1px solid var(--polaris-link-color);
        }
        :host([dark-mode]) .footer-primary {
          color: #f5f5f5;
        }
        :host([dark-mode]) .footer-primary a {
          color: #9ecbff;
          border-bottom-color: #9ecbff;
        }
        .footer-primary a:hover {
          color: var(--polaris-link-hover-color);
          border-bottom: 1px solid var(--polaris-link-hover-color);
        }
        a {
          color: var(--polaris-link-color);
          text-decoration: none;
        }
        @media only screen and (max-width: 1139px) {
          main {
            width: 620px;
          }
          aside {
            width: 300px;
          }
          .site-inner,
          .wrap {
            max-width: 960px;
          }
        }
        @media only screen and (max-width: 1023px) {
          aside,
          main {
            width: 100%;
          }
          .site-title,
          .site-description,
          site-top-menu {
            text-align: center;
          }
          .site-title {
            padding: 0px 60px;
          }
          header .wrap {
            padding: 20px 0;
          }
          .content.wrap {
            width: 100%;
          }
        }
      `,
    ];
  }
  // render function
  render() {
    return html`
      <header itemscope itemtype="http://schema.org/WPHeader">
        <site-modal
          @site-modal-click="${this.siteModalClick}"
          .part="${this.editMode ? `edit-mode-active` : ``}"
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
        <div class="wrap">
          <site-region name="header"></site-region>
          <slot name="header">
            <div id="mark">
              <a href="${this.imageLink}">
                <img
                  src="${this.image}"
                  alt="${this.imageAlt}"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                />
              </a>
            </div>
            <div class="title-area">
              <p class="site-title" itemprop="headline">
                <site-title
                  .part="${this.editMode ? `edit-mode-active` : ``}"
                  ?disabled="${this.editMode}"
                  part="site-title"
                ></site-title>
              </p>

              <p class="site-description" itemprop="description">
                ${this.siteDescription}
              </p>
            </div>
          </slot>
        </div>
      </header>
      <nav itemscope itemtype="http://schema.org/SiteNavigationElement">
        <site-top-menu indicator="none"></site-top-menu>
      </nav>
      <div class="content site-inner wrap">
        <main>
          <article id="contentcontainer">
            <div id="haxcms-theme-top"></div>
            <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
            <site-active-title part="page-title"></site-active-title>
            <site-active-tags
              part="page-tags"
              auto-accent-color
            ></site-active-tags>
            <section id="slot">
              <slot></slot>
            </section>
          </article>
        </main>
        <aside
          role="complementary"
          aria-label="Primary Sidebar"
          itemscope
          itemtype="http://schema.org/WPSideBar"
          part="page-primary-sidebar"
        >
          <section>
            <h4>Contents</h4>
            <site-children-block
              part="page-children-block"
              dynamic-methodology="ancestor"
            ></site-children-block>
          </section>
        </aside>
      </div>
      <footer
        itemscope
        itemtype="http://schema.org/WPFooter"
        .part="${this.editMode ? `edit-mode-active` : ``}"
      >
        <section class="footer-secondary">
          <div class="wrap">
            <slot name="footer-secondary"></slot>
            <site-region name="footerSecondary"></site-region>
          </div>
        </section>
        <section class="footer-primary">
          <div class="wrap">
            <slot name="footer-primary"></slot>
            <site-region name="footerPrimary"></site-region>
          </div>
        </section>
        <scroll-button></scroll-button>
      </footer>
    `;
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
      siteDescription: {
        type: String,
      },
      imageLink: {
        type: String,
      },
      image: {
        type: String,
      },
      imageAlt: {
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
    return "polaris-theme";
  }

  appStoreReady(e) {
    if (globalThis.HaxStore && globalThis.HaxStore.requestAvailability()) {
      let store = globalThis.HaxStore.requestAvailability();
      // elements that are in HAXcms that are injected regardless of what editor says
      // because the CMS controls certain internal connectors
      ["polaris-cta", "polaris-mark", "polaris-story-card", "polaris-tile"].map(
        (name) => {
          let el = globalThis.document.createElement(name);
          store.haxAutoloader.appendChild(el);
        },
      );
      this.windowControllersLoaded.abort();
    }
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    this.windowControllersLoaded = new AbortController();
    globalThis.addEventListener(
      "hax-store-app-store-loaded",
      this.appStoreReady.bind(this),
      {
        once: true,
        passive: true,
        signal: this.windowControllersLoaded.signal,
      },
    );
    // @todo support injection of blocks specific to polaris
    // this way we can have blocks whos definitions only get
    // loaded in when we have a theme that intentionally
    // has been designed around them
    this.HAXCMSThemeSettings.autoScroll = true;
    this.searchTerm = "";
    this.imageAlt = "";
    this.image = "";
    this.imageLink = "";
    this.__disposer = this.__disposer ? this.__disposer : [];
    this.__disposer.push(
      autorun((reaction) => {
        if (store.themeData && store.themeData.variables) {
          const vars = toJS(store.themeData.variables);
          this.imageAlt = vars.imageAlt;
          this.image = vars.image;
          this.imageLink = vars.imageLink;
        }
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        this.siteDescription = toJS(store.siteDescription);
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        this.activeManifestIndex = toJS(store.activeManifestIndex);
      }),
    );

    autorun(() => {
      const badDevice = toJS(store.badDevice);
      // good device, we can inject font we use
      if (badDevice === false) {
        const link = globalThis.document.createElement("link");
        link.setAttribute(
          "href",
          "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap",
        );
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("fetchpriority", "low");
        globalThis.document.head.appendChild(link);
      }
    });

    this.__disposer.push(
      autorun((reaction) => {
        if (
          store.activeItem &&
          store.activeItem.metadata &&
          store.activeItem.metadata.updated
        ) {
          this.pageTimestamp = toJS(store.activeItem.metadata.updated);
        }
      }),
    );
  }
  /**
   * Delay importing site-search until we click to open it directly
   */
  siteModalClick(e) {
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
    ).then((m) => {
      if (store.getInternalRoute() !== 'displays/search') {
        globalThis.history.replaceState({}, null, "x/displays/search");
      }
      const params = new URLSearchParams(store.currentRouterLocation.search);
      const input = globalThis.SimpleModal.requestAvailability().querySelector("site-search").shadowRoot.querySelector("simple-fields-field");
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
}
globalThis.customElements.define(PolarisTheme.tag, PolarisTheme);
export { PolarisTheme };
