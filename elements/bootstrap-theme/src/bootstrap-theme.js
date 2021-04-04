/**
 * Copyright 2021 collinkleest
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSMobileMenuMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { BootstrapUserStylesMenuMixin } from "@lrnwebcomponents/bootstrap-theme/lib/BootstrapUserStylesMenuMixin.js";
import { HAXCMSUserStylesMenuMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSUserStylesMenu.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@lrnwebcomponents/map-menu/map-menu.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
// bootstrap elements imports
import "@lrnwebcomponents/bootstrap-theme/lib/BootstrapBreadcrumb.js";
import "@lrnwebcomponents/bootstrap-theme/lib/BootstrapFooter.js";
import "@lrnwebcomponents/bootstrap-theme/lib/BootstrapSearch.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `bootstrap-theme`
 * `Hax bootstrap themeing`
 * @demo demo/index.html
 * @element bootstrap-theme
 */
class BootstrapTheme extends HAXCMSThemeParts(
  BootstrapUserStylesMenuMixin(HAXCMSMobileMenuMixin(HAXCMSLitElementTheme))
) {
  /**
   * Convention we use
   */
  static get tag() {
    return "bootstrap-theme";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          --bootstrap-theme-link-color: #0d6efd;
          --map-menu-item-a-color: var(--bootstrap-theme-link-color);
          --bootstrap-theme-light-color: #000000;
          --bootstrap-theme-light-background-color: #ffffff;
          --bootstrap-theme-light-secondary-background-color: rgb(
            242,
            244,
            244
          );
          --bootstrap-theme-light-secondary-color: rgb(233, 236, 239);
          --bootstrap-theme-dark-background-color: #000000;
          --bootstrap-theme-dark-secondary-background-color: #343a40;
          --bootstrap-theme-dark-color: #ffffff;
          --bootstrap-theme-palenight-background-color: #0d1229;
          --bootstrap-theme-palenight-secondary-background-color: #1a1f36;
          --bootstrap-theme-palenight-color: #ffffff;
          --site-menu-background-color: var(
            --bootstrap-theme-light-secondary-color
          );
          --bootstrap-theme-sans-serif-fonts: "Helvetica Neue", Helvetica, Arial,
            sans-serif;
          --bootstrap-theme-serif-fonts: Georgia, "Times New Roman", Times,
            serif;
          --bootstrap-theme-headings-font-weight: var(
            --bootstrap-theme-headings-font-weight,
            500
          );
          display: block;
          background-color: var(
            --bootstrap-theme-light-secondary-background-color
          );
          width: 100%;
          display: flex;
          padding: 0;
          margin: 0;
          min-height: 100vh;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
        }
        :host([hidden]) {
          display: none;
        }
        [hidden] {
          display: none;
        }
        :host([menu-open]) .menu-outline {
          left: 0;
        }
        :host([is-logged-in][menu-open]) .menu-outline {
          left: 48px;
        }

        :host([responsive-size="xs"]) .main-content,
        :host([responsive-size="sm"]) .main-content {
          overflow-x: hidden;
        }
        :host([responsive-size="xs"]) .page-inner {
          overflow-x: auto;
        }

        map-menu-header .container .title {
          min-height: 34px;
        }

        .menu-outline {
          position: relative;
          top: 0;
          left: -300px;
          bottom: 0;
          z-index: 1;
          overflow-y: auto;
          width: 300px;
          color: #364149;
          background-color: var(
            --bootstrap-theme-light-secondary-background-color
          );
          border-right: 1px solid rgba(0, 0, 0, 0.07);
          transition: left 250ms ease;
        }

        .site-title {
          border-bottom: 1px solid black;
          background-color: var(--bootstrap-theme-light-secondary-color);
        }

        /* main content */
        .site {
          background-color: var(
            --bootstrap-theme-light-secondary-background-color
          );
        }
        .site-body {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          min-width: 400px;
          overflow-y: auto;
          transition: left 250ms ease;
        }
        .site-body .site-inner {
          position: relative;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          overflow-y: auto;
        }
        :host([menu-open]) .site-body {
          left: 300px;
        }
        :host([is-logged-in][menu-open]) .site-body {
          left: 348px;
        }
        :host([is-logged-in]) .site-body {
          left: 48px;
        }
        :host([responsive-size="xs"]) .site-body,
        :host([responsive-size="sm"]) .site-body {
          overflow-x: hidden;
          position: fixed;
        }
        :host([responsive-size="xs"]) .main-content,
        :host([responsive-size="sm"]) .main-content {
          overflow-x: hidden;
        }
        :host([responsive-size="xs"]) .site-inner {
          max-width: 100vw;
        }
        :host([responsive-size="xs"]) .page-inner {
          overflow-x: auto;
        }
        .page-wrapper {
          position: relative;
          outline: 0;
        }
        .main-content > :first-child {
          margin-top: 0 !important;
        }
        .main-content h1,
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5,
        .main-content h6 {
          margin-top: 1.275em;
          margin-bottom: 0.85em;
          font-weight: var(--bootstrap-theme-headings-font-weight);
        }
        .main-content h1,
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5 {
          page-break-after: avoid;
        }
        .main-content *,
        .main-content ::slotted(*) {
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-size: inherit;
        }

        .main-content h2 {
          font-size: 1.75em;
          font-family: Roboto;
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
        .main-content * {
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-size: inherit;
        }
        .page-inner {
          position: relative;
          max-width: 1000px;
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
        article,
        aside,
        details,
        figcaption,
        figure,
        footer,
        header,
        hgroup,
        main,
        nav,
        section,
        summary {
          display: block;
        }

        simple-icon-button,
        simple-icon-button-lite,
        site-print-button {
          color: var(--site-print-button-color, black);
          --site-git-corner-background: var(--bootstrap-theme-light-color);
          --simple-icon-fill-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
          --haxcms-tooltip-color: var(--haxcms-user-styles-color-theme-color-2);
          --haxcms-tooltip-background-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
        }
        /* header */
        .pull-right {
          float: right;
        }
        .btn-container {
          z-index: 2;
          height: 50px;
          padding: 6px;
        }
        .navigation {
          position: fixed;
          top: 50px;
          bottom: 0px;
          margin: 0px 20px;
          max-width: 150px;
          min-width: 90px;
          display: flex;
          place-content: center;
          flex-direction: column;
          font-size: 40px;
          color: rgb(204, 204, 204);
          text-align: center;
          transition: all 0.35s ease 0s;
        }
        .site-header {
          overflow: visible;
          height: 50px;
          padding: 0 8px;
          z-index: 2;
          font-size: 0.85em;
          color: #7e888b;
          background: 0 0;
        }

        /* Light Theme */
        :host([color-theme="0"]) site-search {
          color: #252737;
          --site-search-result-background-color: transparent;
          --site-search-result-background-color-hover: #f5f5f5;
          --site-search-link-color-hover: #252737;
          --site-search-link-text-color: #252737;
          --site-search-link-color: #252737;
          --site-search-result-color: #252737;
        }

        /* Dark Theme */
        :host([color-theme="1"]) {
          background-color: black;
          --simple-fields-background-color: transparent;
          --map-menu-item-a-color: var(--bootstrap-theme-dark-color);
          --haxcms-user-styles-color-theme-color-color: var(
            --bootstrap-theme-dark-color
          );
          --hax-base-styles-a-color: var(--bootstrap-theme-link-color);
          --haxcms-tooltip-background-color: var(--bootstrap-theme-dark-color);
          --haxcms-tooltip-color: var(--bootstrap-theme-dark-background-color);
          --site-menu-background-color: var(
            --bootstrap-theme-dark-secondary-background-color
          );
        }

        :host([color-theme="1"]) site-search {
          --site-search-color: var(--bootstrap-theme-dark-color);
        }

        :host([color-theme="1"]) .site-title {
          border-bottom: 1px solid var(--bootstrap-theme-dark-color);
          background-color: var(
            --bootstrap-theme-dark-secondary-background-color
          );
        }

        :host([color-theme="1"]) .site {
          background-color: var(--bootstrap-theme-dark-background-color);
        }

        :host([color-theme="1"]) .menu-outline {
          background-color: var(
            --bootstrap-theme-dark-secondary-background-color
          );
        }

        :host([color-theme="1"]) .site-title {
          color: #fff;
        }

        :host([color-theme="1"]) .page-title {
          color: #fff;
        }

        :host([color-theme="1"]) .main-section {
          color: var(--bootstrap-theme-dark-color);
        }

        :host([color-theme="1"]) #site-search-input {
          background-color: var(
            --bootstrap-theme-dark-secondary-background-color
          );
        }

        :host([color-theme="1"]) .card {
          background-color: var(
            --bootstrap-theme-dark-secondary-background-color
          );
        }
        :host([color-theme="1"]) .card h1 h2 h3 h4 h5 h6 p {
          color: #fff;
        }
        :host([color-theme="1"]) .site-header .btn {
          color: white;
        }
        :host([color-theme="1"]) .site-header .btn:hover,
        :host([color-theme="1"]) .site-header .btn:focus,
        :host([color-theme="1"]) .site-header .btn:active {
          color: #fffff5;
          background: none;
        }

        :host([color-theme="1"]) .site-header site-active-title {
          color: #fff;
        }

        /* Palenight Theme */
        :host([color-theme="2"]) {
          background-color: var(--bootstrap-theme-palenight-background-color);
          --simple-fields-background-color: transparent;
          --map-menu-item-a-color: var(--bootstrap-theme-palenight-color);
          --haxcms-user-styles-color-theme-color-color: var(
            --bootstrap-theme-palenight-color
          );
          --hax-base-styles-a-color: var(--bootstrap-theme-link-color);
          --haxcms-tooltip-background-color: var(
            --bootstrap-theme-palenight-color
          );
          --haxcms-tooltip-color: var(
            --bootstrap-theme-palenight-background-color
          );
          --site-menu-background-color: var(
            --bootstrap-theme-palenight-secondary-background-color
          );
        }
        :host([color-theme="2"]) site-search {
          --site-search-color: var(--bootstrap-theme-palenight-color);
        }

        :host([color-theme="2"]) .site-title {
          border-bottom: 1px solid var(--bootstrap-theme-palenight-color);
          background-color: var(
            --bootstrap-theme-palenight-secondary-background-color
          );
        }

        :host([color-theme="2"]) .site {
          background-color: var(--bootstrap-theme-palenight-background-color);
        }

        :host([color-theme="2"]) .menu-outline {
          background-color: var(
            --bootstrap-theme-palenight-secondary-background-color
          );
        }

        :host([color-theme="2"]) .site-title {
          color: var(--bootstrap-theme-palenight-color);
        }

        :host([color-theme="2"]) .page-title {
          color: var(--bootstrap-theme-palenight-color);
        }

        :host([color-theme="2"]) .main-section {
          color: var(--bootstrap-theme-palenight-color);
        }

        :host([color-theme="2"]) #site-search-input {
          background-color: var(
            --bootstrap-theme-palenight-secondary-background-color
          );
        }

        :host([color-theme="2"]) .card {
          background-color: var(
            --bootstrap-theme-palenight-secondary-background-color
          );
        }
        :host([color-theme="2"]) .card h1 h2 h3 h4 h5 h6 p {
          color: var(--bootstrap-theme-palenight-color);
        }
        :host([color-theme="2"]) .site-header .btn {
          color: var(--bootstrap-theme-palenight-color);
        }
        :host([color-theme="2"]) .site-header .btn:hover,
        :host([color-theme="2"]) .site-header .btn:focus,
        :host([color-theme="2"]) .site-header .btn:active {
          color: var(--bootstrap-theme-palenight-color);
          background: none;
        }

        :host([color-theme="2"]) .site-header site-active-title {
          color: #fff;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      searchTerm: {
        type: String,
      },
      menuOpen: {
        type: Boolean,
        attribute: "menu-open",
        reflect: true,
      },
      colorTheme: {
        type: String,
        attribute: "color-theme",
        reflect: true,
      },
    };
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    this.menuOpen = true;
    let basePath = this.getBasePath(decodeURIComponent(import.meta.url));
    this._bootstrapPath = basePath + "bootstrap/dist/css/bootstrap.min.css";
    this._themeElements = [];
    this.colorTheme = "0";
    this.searchTerm = "";
    this._siteTitle = "";
    this._pageTitle = "";
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-print-button.js"
    );
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this._siteTitle = toJS(store.manifest.title);
      this._pageTitle = toJS(store.activeTitle);
      this.__disposer.push(reaction);
    });
  }

  render() {
    return html`
      <link rel="stylesheet" href="${this._bootstrapPath}" />
      <div class="site ">
        <div class="menu-outline">
          <div class="site-title">
            <h4>${this._siteTitle}</h4>
          </div>
          ${this.HAXCMSMobileMenu()}
        </div>
        <div id="body" class="site-body">
          <div id="top"></div>
          <div class="site-inner">
            <header
              class="site-header"
              role="navigation"
              .part="${this.editMode ? `edit-mode-active` : ``}"
            >
              <div class="btn-container">
                ${this.HAXCMSMobileMenuButton()}
                <site-print-button
                  class="btn js-toolbar-action"
                ></site-print-button>
                ${this.BootstrapUserStylesMenu()}
                <div class="pull-right link-actions">
                  <bootstrap-search
                    color-theme="${this.colorTheme}"
                    @search-changed=${this.searchChanged}
                  ></bootstrap-search>
                </div>
              </div>
            </header>
            <main class="page-wrapper" role="main">
              <bootstrap-breadcrumb color-theme="${this.colorTheme}">
              </bootstrap-breadcrumb>
              <div class="container p-0 page-title">
                <h3 class="display-6">${this._pageTitle}</h3>
              </div>
              <article class="main-content container card mb-3">
                <div class="normal main-section">
                  <section class="p-2">
                    <site-search
                      hide-input
                      search="${this.searchTerm}"
                      ?hidden="${this.searchTerm != "" ? false : true}"
                      @search-item-selected=${this.searchItemSelected}
                    ></site-search>
                  </section>
                  <section
                    class="p-2"
                    id="contentcontainer"
                    ?hidden="${this.searchTerm != "" ? true : false}"
                  >
                    <div id="slot">
                      <slot id="main-content"></slot>
                    </div>
                  </section>
                </div>
              </article>
            </main>
            <footer>
              <bootstrap-footer color-theme="${this.colorTheme}">
              </bootstrap-footer>
            </footer>
          </div>
        </div>
      </div>
    `;
  }

  searchChanged(evt) {
    if (evt.detail.searchText) {
      import(
        "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js"
      ).then(() => {
        this.searchTerm = evt.detail.searchText;
      });
    } else {
      this.searchTerm = "";
    }
  }

  searchItemSelected(e) {
    this.searchTerm = "";
  }

  _generateBootstrapLink() {
    if (this._bootstrapLink) {
      document.head.removeChild(this._bootstrapLink);
    }
    let basePath = this.getBasePath(decodeURIComponent(import.meta.url));
    console.log(basePath);
    let link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute(
      "href",
      basePath + "bootstrap/dist/css/bootstrap.min.css"
    );
    document.head.appendChild(link);
    return link;
  }

  disconnectedCallback() {
    if (this._bootstrapLink) {
      document.head.removeChild(this._bootstrapLink);
    }
    super.disconnectedCallback();
  }

  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._loadScripts();
    this._bootstrapLink = this._generateBootstrapLink();
  }

  /*
   * Loads jquery first because bootstrap requires jquery to be present first
   * Jquery callback function then loads bootstrap
   */
  _loadScripts() {
    let basePath = this.getBasePath(decodeURIComponent(import.meta.url));
    let jqueryPath = "jquery/dist/jquery.min.js";
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("jquery", basePath + jqueryPath);
    window.addEventListener(
      `es-bridge-jquery-loaded`,
      this._jqueryLoaded.bind(this)
    );
  }

  _bootstrapLoaded(e) {
    this._bootstrap = true;
  }

  _loadBootstrap() {
    let basePath = this.getBasePath(decodeURIComponent(import.meta.url));
    let bootstrapPath = "bootstrap/dist/js/bootstrap.bundle.min.js";
    window.ESGlobalBridge.instance.load("bootstrap", basePath + bootstrapPath);
    window.addEventListener(
      `es-bridge-bootstrap-loaded`,
      this._bootstrapLoaded.bind(this)
    );
  }

  _jqueryLoaded(e) {
    this._jquery = true;
    this._loadBootstrap();
  }

  getBasePath(url) {
    return url.substring(0, url.lastIndexOf("/@lrnwebcomponents/") + 1);
  }

  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define(BootstrapTheme.tag, BootstrapTheme);
export { BootstrapTheme };
