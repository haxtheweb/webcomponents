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
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
// bootstrap elements imports
import "@lrnwebcomponents/bootstrap-theme/lib/BootstrapBreadcrumb.js";
import "@lrnwebcomponents/bootstrap-theme/lib/BootstrapFooter.js";
import "@lrnwebcomponents/bootstrap-theme/lib/BootstrapMenu.js";
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
          display: block;
          background-color: rgb(242, 244, 244);
          width: 100%;
          display: flex;
          padding: 0;
          margin: 0;
          min-height: 100vh;
          flex-direction: column;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans",
            sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
            "Noto Color Emoji";
          --map-menu-item-a-color: var(--bootstrap-menu-item-a-color, #0d6efd);
          --bootstrap-light-theme-color: #000000;
          --bootstrap-light-theme-background-color: #ffffff;
          --bootstrap-dark-theme-background-color: #000000;
          --bootstrap-dark-theme-secondary-background-color: #343a40;
          --bootstrap-dark-theme-color: #ffffff;
          --bootstrap-link-color: #0d6efd;
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

        /* main content */
        .menu-outline {
          /* font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; */
          position: absolute;
          top: 0;
          left: -300px;
          bottom: 0;
          z-index: 1;
          overflow-y: auto;
          width: 300px;
          color: #364149;
          background: #fafafa;
          border-right: 1px solid rgba(0, 0, 0, 0.07);
          transition: left 250ms ease;
        }
        .site {
          background-color: rgb(242, 244, 244);
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
          font-weight: 700;
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
        .main-content h2,
        .main-content h3,
        .main-content h4,
        .main-content h5,
        .main-content p {
          orphans: 3;
          widows: 3;
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

        /* site menu navigation buttons */
        site-menu-button:not(:defined) {
          display: none;
        }
        site-menu-button {
          --site-menu-button-icon-fill-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
          --haxcms-tooltip-color: var(--haxcms-user-styles-color-theme-color-2);
          --haxcms-tooltip-background-color: var(
            --haxcms-user-styles-color-theme-color-1
          );
        }
        site-menu-button {
          --site-menu-button-icon-width: 64px;
          --site-menu-button-icon-height: 64px;
        }
        :host([is-logged-in][menu-open]) site-menu-button[type="prev"] {
          left: 348px;
        }
        :host([is-logged-in]) site-menu-button[type="prev"] {
          left: 48px;
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
        simple-icon-button,
        simple-icon-button-lite,
        site-rss-button,
        site-print-button,
        site-git-corner {
          color: var(--site-print-button-color, black);
          --site-git-corner-background: var(--bootstrap-light-theme-color);
          --site-git-corner-color: var(
            --bootstrap-light-theme-background-color
          );
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
        .site-header site-active-title h1 {
          color: inherit;
          text-decoration: none;
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          right: 0;
          margin: 10px 200px;
          font-size: 20px;
          font-weight: 200;
          text-align: center;
          line-height: 50px;
          opacity: 0;
          transition: opacity 0.2s ease;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .site-header site-active-title h1:hover {
          opacity: 1;
        }
        /* site search stuff */
        #site-search-input {
          padding: 6px;
          background: 0 0;
          transition: top 0.5s ease;
          background: #fff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
          border-top: 1px solid rgba(0, 0, 0, 0.07);
          margin-bottom: 10px;
          margin-top: -1px;
        }
        #site-search-input input,
        #site-search-input input:focus,
        #site-search-input input:hover {
          width: 100%;
          background: 0 0;
          border: 1px solid transparent;
          box-shadow: none;
          outline: 0;
          line-height: 22px;
          padding: 7px 7px;
          color: inherit;
        }
        site-search {
          height: auto;
          width: auto;
          font-size: inherit;
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
          --github-corner-background: white;
          --map-menu-item-a-color: var(--bootstrap-dark-theme-color);
          --haxcms-user-styles-color-theme-color-color: var(
            --bootstrap-dark-theme-color
          );
          --hax-base-styles-a-color: var(--bootstrap-link-color);
          --haxcms-tooltip-background-color: var(--bootstrap-dark-theme-color);
          --haxcms-tooltip-color: var(--bootstrap-dark-theme-background-color);
          --site-menu-button-icon-fill-color: white;
        }

        :host([color-theme="1"]) simple-fields-field {
        }

        :host([color-theme="1"]) site-menu-button {
          --haxcms-tooltip-color: var(---bootstrap-dark-theme-color);
          --haxcms-tooltip-background-color: var(--bootstrap-dark-theme-color);
        }

        :host([color-theme="1"]) .main-section {
          color: var(--bootstrap-dark-theme-color);
        }

        :host([color-theme="1"]) #site-search-input {
          background-color: var(
            --bootstrap-dark-theme-secondary-background-color
          );
        }

        :host([color-theme="1"]) site-git-corner {
          --site-git-corner-background: var(--bootstrap-dark-theme-color);
          --site-git-corner-color: var(--bootstrap-dark-theme-background-color);
        }

        :host([color-theme="1"]) .card {
          background-color: var(
            --bootstrap-dark-theme-secondary-background-color
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

        :host([color-theme="1"]) site-search {
          color: var(--bootstrap-dark-theme-color);
          --site-search-result-background-color: transparent;
          --site-search-result-background-color-hover: transparent;
          --site-search-link-color-hover: var(--bootstrap-dark-theme-color);
          --site-search-link-text-color: var(--bootstrap-dark-theme-color);
          --site-search-link-color: var(--bootstrap-dark-theme-color);
          --site-search-result-color: var(--bootstrap-dark-theme-color);
        }
        :host([color-theme="2"]) site-search {
          color: var(--simple-colors-default-theme-light-blue-1, #cfd4e3);
          --site-search-result-background-color: transparent;
          --site-search-result-background-color-hover: transparent;
          --site-search-link-color-hover: var(
            --simple-colors-default-theme-light-blue-1,
            #cfd4e3
          );
          --site-search-link-text-color: var(
            --simple-colors-default-theme-light-blue-1,
            #cfd4e3
          );
          --site-search-link-color: var(
            --simple-colors-default-theme-light-blue-1,
            #cfd4e3
          );
          --site-search-result-color: var(
            --simple-colors-default-theme-light-blue-1,
            #cfd4e3
          );
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
    this.headerTags = ["H2", "H3", "H4", "H5", "H6"];
    let basePath = this.getBasePath(decodeURIComponent(import.meta.url));
    this._bootstrapPath = basePath + "bootstrap/dist/css/bootstrap.min.css";
    this._themeElements = [];
    this.colorTheme = "0";
    this.searchTerm = "";
    // event listener for search changed
    this.addEventListener("searchChanged", (evt) => {
      if (evt.detail.searchText) {
        import(
          "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js"
        ).then(() => {
          this.searchTerm = evt.detail.searchText;
        });
      }
    });
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js"
    );
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js"
    );
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-print-button.js"
    );
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-rss-button.js"
    );
    // prettier-ignore
    import(
      "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-git-corner.js"
    );
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.searchTerm = "";
      this.__disposer.push(reaction);
    });
  }

  render() {
    return html`
      <link rel="stylesheet" href="${this._bootstrapPath}" />
      <div class="site container-fluid">
        <div class="menu-outline">
          <div id="site-search-input" role="search">
            <!-- <input
              type="text"
              aria-label="Search site content"
              placeholder="Type to search"
              .value="${this.searchTerm}"
              id="search"
              @input="${this.searchChanged}"
            /> -->
            <bootstrap-search
              color-theme="${this.colorTheme}"
            ></bootstrap-search>
            <bootstrap-menu color-theme="${this.colorTheme}"> </bootstrap-menu>
          </div>
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
                ${this.BootstrapUserStylesMenu()}
                <div class="pull-right link-actions">
                  <site-print-button
                    class="btn js-toolbar-action"
                  ></site-print-button>
                  <site-rss-button
                    type="rss"
                    class="btn js-toolbar-action"
                  ></site-rss-button>
                  <site-git-corner size="small"></site-git-corner>
                </div>
              </div>
              <site-active-title></site-active-title>
            </header>
            <main class="page-wrapper" role="main">
              <bootstrap-breadcrumb color-theme="${this.colorTheme}">
              </bootstrap-breadcrumb>
              <article class="main-content page-inner">
                <div class="normal main-section">
                  <site-search
                    hide-input
                    search="${this.searchTerm}"
                    ?hidden="${this.searchTerm != "" ? false : true}"
                  ></site-search>
                  <section
                    class="card p-4"
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

  _wrapSections() {
    if (this._themeElements) {
      this._applyClasses(this._themeElements);
    }
  }

  _applyClasses(nodes) {
    nodes.forEach((node) => {
      if (this.headerTags.includes(node.nodeName)) {
        node.classList.add("display-6");
      }
    });
  }

  _applyMutationObserver() {
    this._observer = new MutationObserver((mutationList, observer) => {
      mutationList.forEach((mutationEntry) => {
        if (mutationEntry.addedNodes) {
          mutationEntry.addedNodes.forEach((item) => {
            this._themeElements.push(item);
          });
          this._wrapSections();
        } else if (mutationEntry.removedNodes) {
          mutationEntry.removedNodes.forEach((item) => {
            this._themeElements.splice(this._themeElements.indexOf(item), 1);
          });
        }
      });
    });
    this._observer.observe(this, { childList: true });
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
    this._applyMutationObserver();
    this._wrapSections();
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

  prevPage(e) {
    super.prevPage(e);
  }

  nextPage(e) {
    super.nextPage(e);
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
