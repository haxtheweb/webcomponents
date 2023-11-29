/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { PrintBranchMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { PDFPageMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import { QRCodeMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { HAXCMSMobileMenuMixin } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSOperationButtons } from "@lrnwebcomponents/haxcms-elements/lib/core/utils/HAXCMSOperationButtons.js";
import { varExists, varGet } from "@lrnwebcomponents/utils/utils.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-region.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@lrnwebcomponents/scroll-button/scroll-button.js";
import "./collections-theme-banner.js";

/**
 * `collection-theme`
 * `A theme for presenting collections of material`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @demo demo/index.html
 * @element collection-theme
 */
class CollectionsTheme extends HAXCMSOperationButtons(
  HAXCMSRememberRoute(
    PDFPageMixin(
      PrintBranchMixin(
        QRCodeMixin(
          HAXCMSThemeParts(HAXCMSMobileMenuMixin(HAXCMSLitElementTheme))
        )
      )
    )
  )
) {

  static get properties() {
    return {
      ...super.properties,
      image: { type: String },
      title: { type: String },
      color: { type: String },
      icon: { type: String },
      activeTitle: { type: String },
    };
  }
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          font-size: 18px;
          font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
          letter-spacing: normal;
          line-height: 28.8px;
          background-color: white;
          --haxcms-base-styles-body-font-size:18px;
          --hax-base-styles-a-font-size: 18px;
          --hax-base-styles-p-font-size: 18px;
          --hax-base-styles-list-font-size: 18px;
          --haxcms-base-styles-body-font-family: "Open Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
          --haxcms-base-styles-body-line-height: 28.8px;
          --hax-base-styles-list-line-height: 28.8px
          --hax-base-styles-p-line-height: 28.8px;
          --hax-base-styles-p-letter-spacing: normal;
          --haxcms-base-styles-body-letter-spacing : normal;
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

        #container {
          width: 80%;
          margin: 0 auto 25px auto;
        }

        #nav {
          display: flex;
          justify-content: flex-end;
          background-color: #e2801e;
        }

        .link {
          background-color: #363533;
          border-bottom: solid 4px #fff;
          width: auto;
        }

        .link a {
          display: flex;
          flex: 1 1 auto;
          align-items: center;
          font-family: roboto, sans-serif;
          font-size: 18px;
          font-weight: 300;
          text-decoration: none;
          text-transform: uppercase;
          color: #fff;
          padding: 15px;
        }

        @media only screen and (max-width: 700px) {
          .link a {
            font-size: 16px;
            padding: 5px;
          }
        }

        page-banner {
          font-family: "Roboto", sans-serif;
        }

        homepage-banner {
          margin-bottom: 160px;
          font-family: "Roboto", sans-serif;
        }

        @media only screen and (max-width: 1600px) {
          homepage-banner {
            margin-bottom: 90px;
          }
        }

        @media only screen and (max-width: 1200px) {
          homepage-banner {
            margin-bottom: 60px;
          }
        }

        @media only screen and (max-width: 800px) {
          homepage-banner {
            margin-bottom: 50px;
          }
        }
        scroll-button {
           --scroll-button-color: var(--haxcms-user-styles-color-theme-color-1);
           --scroll-button-background-color: var(--haxcms-user-styles-color-theme-color-2);
           --scroll-button-tooltip-background-color:var(--haxcms-user-styles-color-theme-color-1);
           --scroll-button-tooltip-color: var(--haxcms-user-styles-color-theme-color-2);
         }
      `,
    ];
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
      "https://fonts.googleapis.com/css2?family=Caveat&family=Lato:wght@300;700&family=Open+Sans&display=swap";
    document.head.appendChild(this.__link);
    this.HAXCMSThemeSettings.scrollTarget =
      this.shadowRoot.querySelector("article");
    window.AbsolutePositionStateManager.requestAvailability().scrollTarget =
      this.HAXCMSThemeSettings.scrollTarget;

    // hook up the scroll target
    this.shadowRoot.querySelector("scroll-button").target =
      this.shadowRoot.querySelector("#haxcms-theme-top");
  }

  // render function
  render() {
    return html`
    <header itemtype="http://schema.org/WPHeader">
      <site-region name="header"></site-region>
    </header>
    <nav id="nav" part="site-top-menu" itemtype="http://schema.org/SiteNavigationElement">
      <site-top-menu
      .part="${this.editMode ? `edit-mode-active` : ``}"
      indicator="none"></site-top-menu>
    </nav>
    <collections-theme-banner
      image="${this.image}"
      sitename="${this.title}"
      pagetitle="${this.activeTitle}"
      logo="${this.logo}"
    >
    </collections-theme-banner>
    <main>
      <article
        id="contentcontainer"
      >
        <section id="slot">
          <slot></slot>
        </section>
      </article>
    </main>
    <footer
        itemtype="http://schema.org/WPFooter"
        .part="${this.editMode ? `edit-mode-active` : ``}"
      >
      <section class="footer-secondary">
        <div class="wrap">
        </div>
      </section>
      <section class="footer-primary">
        <div class="wrap">
          <slot name="footer-secondary"></slot>
          <site-region name="footerSecondary"></site-region>
          <slot name="footer-primary"></slot>
          <site-region name="footerPrimary"></site-region>
        </div>
      </section>
      <scroll-button .part="${this.editMode ? `edit-mode-active` : ``}"></scroll-button>
    </footer>
    `;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "collections-theme";
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
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
      let manifest = toJS(store.manifest);
      this.color = this._getColor(manifest);
      this.title = varGet(manifest, "title", "");
      this.image = varGet(
        manifest,
        "metadata.theme.variables.image",
        "assets/banner.jpg"
      );
      this.logo = varGet(
        manifest,
        "metadata.theme.variables.logo",
        "assets/banner.jpg"
      );
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.activeTitle = toJS(store.activeTitle);
      this.__disposer.push(reaction);
    });
  }
}
customElements.define(CollectionsTheme.tag, CollectionsTheme);
export { CollectionsTheme };
