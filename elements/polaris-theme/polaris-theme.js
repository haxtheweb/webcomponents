/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { PrintBranchMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { PDFPageMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import { QRCodeMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { HAXCMSMobileMenuMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSOperationButtons } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSOperationButtons.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/scroll-button/scroll-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-modal.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/blocks/site-children-block.js";
import { autorun, toJS } from "mobx";
/**
 * `polaris-theme`
 * `A 2nd polaris theme`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @demo demo/index.html
 * @element polaris-theme
 */
class PolarisTheme extends HAXCMSOperationButtons(
  PDFPageMixin(
    PrintBranchMixin(
      QRCodeMixin(
        HAXCMSThemeParts(HAXCMSMobileMenuMixin(HAXCMSLitElementTheme))
      )
    )
  )
) {
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          --polaris-bg-color: #f5f5f5;
          --polaris-content-bg-color: #ffffff;
          --polaris-header-bg-color: #262C3A;
          --polaris-nav-bg-color: #1173ca;
          --polaris-footer-1-bg-color: #262C3A;
          --polaris-footer-2-bg-color: #141720;
          background-color: var(--polaris-bg-color);
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: "Open Sans", sans-serif;
          font-weight: 300;
        }

        a {
            color: #1173ca;
            text-decoration: none;
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
            color: #1173ca;
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

        .site-inner, .wrap {
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
          --site-top-menu-link-color: #EDEDED;
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
          background-color: #fff;
          border-radius: 3px;
          margin-bottom: 40px;
          padding: 40px;
        }

        site-modal {
          float: right;
          --simple-modal-titlebar-background: var(--polaris-nav-bg-color);
        }

        .footer-1 {
          background-color: var(--polaris-footer-1-bg-color);
          color: #999;
          clear: both;
          padding: 40px 0 16px;
        }

        footer {
          background-color: var(--polaris-footer-2-bg-color);
        }

        .footer-2 {
          color: #EDEDED;
          font-size: 14px;
          padding: 40px 0;
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
        #psumark {
          display: inline;
          width: 218px;
          float: left;
          margin: 0px 30px 0px 40px;
        }
        #psumark a {
          display: block;
        }
        @media only screen and (max-width: 1023px) {
          #psumark {
            float: none;
            margin: 15px auto;
            max-width: 218px;
            width: 100%;
            text-align: center;
            display: block;
          }
        }
        .site-title a, .site-title a:hover {
          color: #EDEDED;
        }
        header a img {
          margin-bottom: -4px;
          margin-bottom: -4px;
        }

        img {
            height: auto;
            width: auto;
        }
        embed, iframe, img, object, video, .wp-caption {
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
          color: #999;
          font-family: "Lato", sans-serif;
          font-size: 16px;
          font-weight: 300;
          line-height: 1;
          margin: 0 0 24px;
        }
        .footer-1 a:hover {
          color: #ddd;
        }

        .footer-1 a {
          border-bottom: 1px solid #666;
          color: #999;
        }
        .footer-1 p {
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
        .psu_footer_links a {
          margin: 0 8px;
        }
        .psu_footer_links {
          text-align: left;
          padding-top: 3px;
        }

        .footer-2 a {
            color: #2c76c7;
            border-bottom: 1px solid #2c76c7;
        }
        .footer-2 a:hover {
          color: #FFF;
          border-bottom: 1px solid #fff;
        }
        a {
            color: #1173ca;
            text-decoration: none;
        }
        /** end PSU speciifc looking stuff */
        @media only screen and (max-width: 1139px){
          main {
            width: 620px;
          }
          aside {
            width: 300px;
          }
          .site-inner, .wrap {
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
    <header itemtype="http://schema.org/WPHeader">
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
        <slot name="header">
          <div id="psumark">
            <a href="http://www.psu.edu">
              <img src="https://camp.tlt.psu.edu/wp-content/themes/genesis-psu/images/PS_HOR_REV_RGB_2C.png" alt=" Visit the Pennsylvania State University Home Page">
            </a>
          </div>
          <div class="title-area">
            <p class="site-title" itemprop="headline">
            <site-title 
            .part="${this.editMode ? `edit-mode-active` : ``}"
            ?disabled="${this.editMode}" part="site-title"></site-title>
            <p class="site-description" itemprop="description">${this.siteDescription}</p>
          </div>
        </slot>
      </div>
    </header>
    <nav itemtype="http://schema.org/SiteNavigationElement">
      <div class="wrap">
        <site-top-menu indicator="arrow"></site-top-menu>
      </div>
    </nav>
    <div class="content site-inner wrap">
      <main>
        <article id="contentcontainer">
          <div id="haxcms-theme-top"></div>
          <site-breadcrumb></site-breadcrumb>
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
      <aside role="complementary" aria-label="Primary Sidebar" itemtype="http://schema.org/WPSideBar">
        <section>
          <h4>Contents</h4>
          <site-children-block
            dynamic-methodology="ancestor"
          ></site-children-block>
        </section>
      </aside>
    </div>
    <footer itemtype="http://schema.org/WPFooter" .part="${this.editMode ? `edit-mode-active` : ``}"
>
      <section class="footer-1">
        <div class="wrap">
          <slot name="footer-1"><p>Penn State encourages qualified persons with disabilities to participate in its programs and activities. If you anticipate needing any type of accommodation or have questions about the physical access provided, please contact <a href="mailto:tlt@psu.edu">tlt@psu.edu</a> or 814-865-2030 in advance of your participation or visit.</p></slot>
        </div>
      </section>
      <section class="footer-2">
        <div class="wrap">
          <slot name="footer-2">
          <div class="footer-logo">
            <a href="http://www.psu.edu">
              <img src="https://camp.tlt.psu.edu/wp-content/themes/genesis-psu/images/PS_HOR_REV_RGB_2C.png" alt=" Visit the Pennsylvania State University Home Page" class="footer-logo">
            </a>
          </div>
          <div class="psu_footer_links">
            Copyright 2023 © The Pennsylvania State University
            <a href="http://www.psu.edu/web-privacy-statement">Privacy</a>
            <a href="http://guru.psu.edu/policies/AD85.html">Non-Discrimination</a>
            <a href="http://guru.psu.edu/policies/OHR/hr11.html">Equal Opportunity</a>
            <a href="http://www.psu.edu/accessibilitystatement">Accessibility</a>
            <a href="http://www.psu.edu/legal-statements">Legal</a>
          </div>
          </slot>
        </div>
      </section>
      <scroll-button
      ></scroll-button>
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
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    // @todo support injection of blocks specific to polaris
    // this way we can have blocks whos definitions only get
    // loaded in when we have a theme that intentionally
    // has been designed around them
    this.HAXCMSThemeSettings.autoScroll = true;
    this.searchTerm = "";
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      this.siteDescription = toJS(store.siteDescription);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.activeManifestIndex = toJS(store.activeManifestIndex);
      this.__disposer.push(reaction);
    });

    autorun(() => {
      const badDevice = toJS(store.badDevice);
      // good device, we can inject font we use
      if (badDevice === false) {
        const link = document.createElement("link");
        link.setAttribute(
          "href",
          "https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
        );
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("fetchpriority", "low");
        document.head.appendChild(link);
      }
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
   * life cycle, element is afixed to the DOM
   */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      this.__link = document.createElement("link");
      this.__link.rel = "stylesheet";
      this.__link.href =
      "https://fonts.googleapis.com/css2?family=Caveat&family=Lato:wght@300;700&family=Open+Sans&family=Press+Start+2P&display=swap";
      document.head.appendChild(this.__link);
      this.HAXCMSThemeSettings.scrollTarget =
      this.shadowRoot.querySelector("article");
      window.AbsolutePositionStateManager.requestAvailability().scrollTarget =
        this.HAXCMSThemeSettings.scrollTarget;

      // hook up the scroll target
      this.shadowRoot.querySelector("scroll-button").target =
        this.shadowRoot.querySelector("#haxcms-theme-top");
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
customElements.define(PolarisTheme.tag, PolarisTheme);
export { PolarisTheme };
