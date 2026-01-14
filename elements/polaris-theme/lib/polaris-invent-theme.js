/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { HAXCMSMobileMenuMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSOperationButtons } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSOperationButtons.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { HAXCMSRememberRoute } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { QRCodeMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { PrintBranchMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { PDFPageMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import "@haxtheweb/scroll-button/scroll-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { HAXCMSToastInstance } from "@haxtheweb/haxcms-elements/lib/core/haxcms-toast.js";
import { LTIResizingMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/LTIResizingMixin.js";

/**
 * `Polaris Invent Theme`
 * `A 2nd polaris theme customized for Invent PSU`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @haxcms-theme-category Website
 * @haxcms-theme-internal false
 * @demo demo/index.html
 * @element polaris-invent-theme
 */
class PolarisInventTheme extends LTIResizingMixin(
  HAXCMSOperationButtons(
    HAXCMSRememberRoute(
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
      super.styles,
      css`
        :host {
          display: block;
          --polaris-content-bg-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          --polaris-header-bg-color: #1e417b;
          --polaris-nav-color: var(--ddd-accent-6);
          --polaris-nav-bg-color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-theme-default-nittanyNavy)
          );
          --polaris-footer-secondary-bg-color: var(
            --ddd-theme-default-beaverBlue
          );
          --polaris-footer-primary-bg-color: var(
            --ddd-theme-default-nittanyNavy
          );

          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          color: light-dark(black, var(--ddd-accent-6));

          --video-player-color: var(--ddd-theme-default-white);
          --video-player-bg-color: var(--ddd-theme-default-nittanyNavy);
          --video-player-border-color: var(--ddd-theme-default-limestoneLight);
          --video-player-caption-color: var(--ddd-theme-default-white);
          --video-player-hover-color: var(--ddd-theme-default-inventOrange);
          --video-player-hover-bg-color: var(--ddd-theme-default-beaver80);
          --video-player-accent-color: var(--ddd-theme-default-inventOrange);
          --video-player-faded-accent-color: var(--ddd-theme-default-beaver80);
          --video-player-disabled-color: var(--ddd-theme-default-disabled);
        }

        :host([is-safari]) {
          background-color: var(--ddd-accent-6);
          color: black;
          --polaris-content-bg-color: var(--ddd-accent-6);
          --polaris-nav-bg-color: var(--ddd-theme-default-skyBlue);
        }

        scroll-button {
          position: fixed;
          right: 0px;
          bottom: 0px;
          z-index: 10000;
          --scroll-button-background-color: var(
            --ddd-theme-default-inventOrange
          );
          --simple-icon-width: 32px;
          --simple-icon-height: 32px;
          --simple-icon-button-border-radius: none;
        }
        .entry-content a {
          color: #1173ca;
        }

        site-active-title h1 {
          font-size: var(--ddd-font-size-l);
          padding: 0;
          margin: 0 0 var(--ddd-spacing-5) 0;
          text-align: start;
          line-height: normal;
        }

        header .wrap {
          padding: 40px 0;
        }

        .site-inner {
          display: flex;
        }

        .wrap {
          margin: 0 auto;
          max-width: 1140px;
        }

        article {
          padding: 16px 40px 16px 16px;
          background-color: var(--polaris-content-bg-color);
          font-family: var(--ddd-font-primary);
          min-width: 280px;
          min-height: 50vh;
        }

        header:not(:empty) {
          background-color: var(--polaris-header-bg-color);
        }

        .nav {
          background-color: var(--polaris-nav-bg-color);
          color: var(--polaris-nav-color);
        }

        #slot {
          line-break: auto;
          min-height: 50vh;
        }

        site-menu {
          font-family: var(--ddd-font-navigation);
          --site-menu-font-size: var(--ddd-font-size-3xs);
          --map-menu-item-a-active-background-color: var(
            --polaris-header-bg-color
          );
          --map-menu-item-button-active-color: white;
          --map-menu-item-button-active-background-color: var(
            --ddd-theme-default-inventOrange
          );
          --map-menu-overflow: visible;
          --site-menu-container-background-color: var(--ddd-accent-6);
          --map-menu-item-a-active-color: var(--ddd-accent-6);
          --map-menu-item-icon-active-color: black;
        }

        site-modal {
          --simple-modal-titlebar-background: var(--polaris-nav-bg-color);
        }

        .link-actions {
          margin: 0;
          display: block;
          padding: 0;
          border-top: 2px solid #e6ecf1;
          margin-top: 16px;
          align-items: center;
          padding-top: 16px;
          flex-direction: row;
          -webkit-box-align: center;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
        }
        .link-actions .inner {
          width: auto;
          margin: 16px;
          display: block;
        }

        @media screen and (min-width: 900px) {
          .link-actions .inner {
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
        }
        site-menu-button {
          --site-menu-button-link-decoration: none;
          --site-menu-button-button-hover-color: black;
          --site-menu-button-icon-fill-color: white;
          color: white;
          background-color: var(--ddd-theme-default-inventOrange);
          border: 1px solid var(--ddd-theme-default-inventOrange);
          margin: 8px;
          display: block;
          padding: 0;
          position: relative;
          align-self: stretch;
          box-shadow: 0 3px 8px 0 rgba(116, 129, 141, 0.1);
          transition: border 300ms ease;
          align-items: center;
          justify-self: stretch;
          text-overflow: ellipsis;
          border-radius: 3px;
          flex-direction: row;
          text-decoration: none;
          -webkit-box-align: center;
          page-break-inside: avoid;
          -ms-grid-row-align: stretch;
          -webkit-box-orient: horizontal;
          -ms-grid-column-align: stretch;
          -webkit-box-direction: normal;
        }
        site-menu-button[disabled] {
          display: none !important;
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
          font-size: 18px;
          font-weight: 500;
          line-height: 1.5;
          text-transform: none;
        }
        site-menu-button div .top {
          font-size: 18px;
          font-weight: 800;
          line-height: 1.625;
          color: white;
        }
        site-menu-button div .bottom {
          font-size: 18px;
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

        .footer-secondary {
          background-color: var(--polaris-footer-secondary-bg-color);
          color: white;
          clear: both;
          padding: 40px 16px 16px;
        }

        @media screen and (max-width: 400px) {
          main {
            width: calc(100vw - 48px);
            overflow: hidden;
          }

          footer {
            width: calc(100vw - 8px);
          }
        }

        footer {
          font-family: var(--ddd-font-secondary);
          background-color: var(--polaris-footer-primary-bg-color);
        }

        .footer-primary {
          color: white;
          font-size: 14px;
          padding: 40px 16px;
          text-align: center;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          line-height: 22px;
          font-weight: 300;
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

        .footer-secondary a:hover {
          color: #ddd;
        }

        .footer-secondary a {
          border-bottom: 1px solid #666;
          color: #999;
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
          color: #2c76c7;
          border-bottom: 1px solid #2c76c7;
        }
        .footer-primary a:hover {
          color: #fff;
          border-bottom: 1px solid #fff;
        }
        a {
          color: #1173ca;
          text-decoration: none;
        }
        #haxcmsmobilemenubutton {
          padding: 0px;
          --simple-icon-height: 30px;
          --simple-icon-width: 30px;
          margin: 2px 6px 0 6px;
        }
        @media only screen and (max-width: 1139px) {
          .wrap {
            max-width: 960px;
          }
        }
        @media only screen and (max-width: 1023px) {
          site-active-title h1 {
            font-size: var(--ddd-font-size-xs);
            margin: 0 0 var(--ddd-spacing-2) 0;
          }
          header .wrap {
            padding: 20px 0;
          }
          scroll-button {
            --simple-icon-width: 20px;
            --simple-icon-height: 20px;
          }
        }
        :host([responsive-size="xl"]) main {
          width: calc(var(--menu-size) + 70%);
        }
        :host([responsive-size="lg"]) main {
          width: calc(var(--menu-size) + 70%);
        }
        :host([responsive-size="md"]) main {
          width: calc(var(--menu-size) + 65%);
        }
        :host([responsive-size="sm"]) main {
          width: calc(var(--menu-size) + 40%);
        }
        :host([responsive-size="xs"]) main {
          width: calc(var(--menu-size) + 20%);
        }
        /* ensure iframe content doesn't get bigger than the main area */
        :host([responsive-size]) main ::slotted(iframe) {
          max-width: 100%;
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
          margin-left: -300px;
          transition: margin 300ms ease;
          height: fit-content;
        }
        :host {
          --menu-size: 300px;
        }
        :host([menu-open]) {
          --menu-size: 0px;
        }
        :host([menu-open]) .left-col {
          margin-left: 0px;
          position: sticky;
          margin-top: 8px;
        }

        .pdf-page-btn,
        .print-branch-btn,
        .search-modal-btn,
        #emailbtnwrapper,
        #qrcodebtnwrapper {
          --simple-icon-height: 24px;
          --simple-icon-width: 24px;
          margin: 8px 4px 0 8px;
          transition: 0.3s ease-in all;
        }

        :host([menu-open]) .pdf-page-btn,
        :host([menu-open]) .search-modal-btn,
        :host([menu-open]) .print-branch-btn,
        :host([menu-open]) #emailbtnwrapper,
        :host([menu-open]) #qrcodebtnwrapper {
          display: inline-flex;
          --simple-icon-height: 24px;
          --simple-icon-width: 24px;
        }

        @media screen and (min-width: 900px) {
          article {
            padding: 64px 80px 40px 40px;
          }
          .left-col {
            flex: 0 0 auto;
            width: auto;
            z-index: 15;
            width: 300px;
            align-items: stretch;
            flex-direction: column;
            -webkit-box-align: stretch;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
          }
        }
      `,
    ];
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.HAXCMSThemeSettings.scrollTarget =
      this.shadowRoot.querySelector("#main");
    globalThis.AbsolutePositionStateManager.requestAvailability().scrollTarget =
      this.HAXCMSThemeSettings.scrollTarget;

    // hook up the scroll target
    this.shadowRoot.querySelector("scroll-button").target =
      this.shadowRoot.querySelector("#main");
  }
  // render function
  render() {
    return html`
      <div id="haxcms-theme-top"></div>
      <header itemtype="http://schema.org/WPHeader">
        <div class="wrap">
          <site-region name="header"></site-region>
          <slot name="header"></slot>
        </div>
      </header>
      <div class="content site-inner">
        <div class="nav">
          ${this.HAXCMSMobileMenuButton("right")}
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
          ${MicroFrontendRegistry.has("@core/htmlToPdf")
            ? this.PDFPageButton("right")
            : ``}
          ${MicroFrontendRegistry.has("@haxcms/siteToHtml")
            ? this.PrintBranchButton("right")
            : html`<replace-tag
                with="site-print-button"
                position="right"
                class="btn js-toolbar-action"
                import-method="view"
                part="print-btn"
              ></replace-tag>`}
          ${this.QRCodeButton("right")}
          <div class="left-col ddd-font-navigation" part="left-col">
            ${this.HAXCMSMobileMenu()}
          </div>
        </div>
        <main id="main">
          <article id="contentcontainer">
            <site-active-title part="page-title"></site-active-title>
            <site-active-tags
              part="page-tags"
              auto-accent-color
            ></site-active-tags>
            <section id="slot" part="slot">
              <slot></slot>
            </section>
          </article>
          <div class="link-actions">
            <div class="inner">
              <replace-tag with="site-menu-button" import-only></replace-tag>
              <site-menu-button
                hide-label
                type="prev"
                position="right"
                class="navigation"
                data-primary="4"
              >
                <div slot="suffix" class="wrapper">
                  <div class="top">Go back</div>
                </div>
              </site-menu-button>
              <site-menu-button
                hide-label
                type="next"
                position="left"
                class="navigation"
                data-primary="4"
              >
                <div slot="prefix" class="wrapper">
                  <div class="top">Continue</div>
                </div>
              </site-menu-button>
            </div>
          </div>
        </main>
      </div>
      <footer
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
        <scroll-button position="left"></scroll-button>
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
    return "polaris-invent-theme";
  }

  appStoreReady(e) {
    if (globalThis.HaxStore && globalThis.HaxStore.requestAvailability()) {
      let store = globalThis.HaxStore.requestAvailability();
      // elements that are in HAXcms that are injected regardless of what editor says
      // because the CMS controls certain internal connectors
      [
        "polaris-cta",
        "polaris-mark",
        "polaris-story-card",
        "polaris-tile",
        "media-quote",
      ].map((name) => {
        let el = globalThis.document.createElement(name);
        store.haxAutoloader.appendChild(el);
      });
      this.windowControllersLoaded.abort();
    }
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    // forcibly set things about the RPG toast for this design
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-display",
      "none",
    );
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-mid-background-image",
      "none",
    );
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-right-background-image",
      "none",
    );
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-left-background-image",
      "none",
    );
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-mid-padding",
      0,
    );
    HAXCMSToastInstance.style.setProperty(
      "--rpg-character-toast-height",
      "96px",
    );
    HAXCMSToastInstance.style.backgroundColor =
      "light-dark(var(--ddd-accent-6), var(--ddd-primary-4))";
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
    this.searchTerm = "";
    this.imageAlt = "";
    this.image = "";
    this.imageLink = "";
    this.__disposer = this.__disposer ? this.__disposer : [];

    autorun((reaction) => {
      if (store.themeData && store.themeData.variables) {
        const vars = toJS(store.themeData.variables);
        this.imageAlt = vars.imageAlt;
        this.image = vars.image;
        this.imageLink = vars.imageLink;
      }
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.siteDescription = toJS(store.siteDescription);
      this.__disposer.push(reaction);
    });
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
   * Delay importing site-search until we click to open it directly
   */
  siteModalClick(e) {
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
    ).then((m) => {
      if (store.getInternalRoute() !== 'search') {
        globalThis.history.replaceState({}, null, "x/search");
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
globalThis.customElements.define(PolarisInventTheme.tag, PolarisInventTheme);
export { PolarisInventTheme };
