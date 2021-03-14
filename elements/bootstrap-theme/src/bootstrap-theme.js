/**
 * Copyright 2021 collinkleest
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSMobileMenuMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSUserStylesMenuMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSUserStylesMenu.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
// import "jquery/dist/jquery.js";
// import "bootstrap/dist/js/bootstrap.js";
import { ESGlobalBridgeStore } from "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";

/**
 * `bootstrap-theme`
 * `Hax bootstrap themeing`
 * @demo demo/index.html
 * @element bootstrap-theme
 */
class BootstrapTheme extends HAXCMSThemeParts(
  HAXCMSUserStylesMenuMixin(HAXCMSMobileMenuMixin(HAXCMSLitElementTheme))
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
          --haxcms-color: white !important;
          --hax-base-styles-p-font-size: 12px;
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

        .menu-outline {
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
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

        main-content h2 {
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
        .main-content * {
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-size: inherit;
        }
        .page-inner {
          position: relative;
          max-width: 800px;
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
    };
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    this.menuOpen = true;
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
      <link
        rel="stylesheet"
        href="../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
      />
      <div class="site container-fluid">
        <div class="menu-outline">
          <div id="site-search-input" role="search">
            <input
              type="text"
              aria-label="Search site content"
              placeholder="Type to search"
              .value="${this.searchTerm}"
              id="search"
              @input="${this.searchChanged}"
            />
            ${this.HAXCMSMobileMenu()}
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
                ${this.HAXCMSMobileMenuButton()} ${this.HAXCMSUserStylesMenu()}
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
              <article class="main-content page-inner">
                <div class="normal main-section">
                  <site-search
                    hide-input
                    search="${this.searchTerm}"
                    ?hidden="${this.searchTerm != "" ? false : true}"
                  ></site-search>
                  <section
                    class="card bg-white p-4"
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
          </div>
        </div>
      </div>
    `;
  }

  _wrapSections() {
    // setTimeout(console.log(this.shadowRoot.getElementById("main-content").assignedElements()), 0);
  }

  _applyClasses() {
    console.log("should take 5 seconds....");
    let bootstrapThemeElement = document.querySelector("bootstrap-theme");
    let elements = bootstrapThemeElement.childNodes;

    let mainContent = this.shadowRoot.getElementById("main-content");
    console.log(mainContent);
    console.log(mainContent.assignedElements());
    console.log(
      document
        .querySelector("#site > bootstrap-theme")
        .shadowRoot.querySelector("#main-content")
        .assignedElements()
    );
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
    this._wrapSections();
    this.delay(5000);
    this._applyClasses();
  }

  delay(ms) {
    new Promise((res) => setTimeout(res, ms));
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
