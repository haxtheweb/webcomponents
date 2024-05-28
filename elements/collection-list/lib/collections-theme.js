/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { PrintBranchMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PrintBranchMixin.js";
import { PDFPageMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/PDFPageMixin.js";
import { QRCodeMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/QRCodeMixin.js";
import { HAXCMSMobileMenuMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSMobileMenu.js";
import { HAXCMSOperationButtons } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSOperationButtons.js";
import { varExists, varGet } from "@haxtheweb/utils/utils.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@haxtheweb/scroll-button/scroll-button.js";
import "./collections-theme-banner.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `collections-theme`
 * `A theme for presenting collections of material`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A headless content management system
 *  - HAXCMSTheme - A super class that provides correct baseline wiring to build a new theme
 *
 * @demo demo/index.html
 * @element collections-theme
 */
class CollectionsTheme extends HAXCMSOperationButtons(
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
      super.styles,
      css`
        :host {
          --bg-color: #ffffff;
          --content-bg-color: #ffffff;
          --nav-link-color: #363533;
          --icon-color: #363533;
          --header-bg-color: var(
            --haxcms-color,
            var(--simple-colors-default-theme-orange-6, #e2801e)
          );
          --nav-bg-color: var(
            --haxcms-color,
            var(--simple-colors-default-theme-orange-6, #e2801e)
          );
          --footer-secondary-bg-color: var(
            --haxcms-color,
            var(--simple-colors-default-theme-orange-6, #e2801e)
          );
          --footer-primary-bg-color: var(
            --haxcms-color,
            var(--simple-colors-default-theme-orange-6, #e2801e)
          );

          display: block;
          letter-spacing: normal;
          background-color: var(--bg-color);
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
          --site-search-result-background-color: transparent;
          --site-search-result-background-color-hover: #f5f5f5;
          --site-search-link-color-hover: #252737;
          --site-search-link-text-color: #252737;
          --site-search-link-color: #252737;
          --site-search-result-color: #252737;
        }

        #contentcontainer {
          width: 68%;
          margin: 0 auto 24px;
        }

        :host([edit-mode]) #contentcontainer {
          width: 68%;
          margin: 0 336px 24px;
        }

        #nav {
          display: flex;
          justify-content: flex-end;
          background-color: var(--nav-bg-color);
        }
        site-top-menu {
          font-family: "Roboto", sans-serif;
          --site-top-menu-wrapper-justify-content: end;
          --site-top-menu-bg: var(--nav-bg-color);
          --site-top-menu-indicator-color: #ffffff;
          --site-top-menu-link-active-color: #ffffff;
          --site-top-menu-link-color: #ffffff;
          --site-top-menu-link-bg-color: var(--nav-link-color);
          --site-top-menu-link-color-hover: var(--nav-bg-color);
          --site-top-menu-link-bg-color-hover: var(--nav-link-color);
          clear: both;
          font-weight: 300;
          line-height: 1.5;
          width: 100%;
        }
        site-top-menu::part(button) {
          font-size: 18px;
          padding: 16px;
          font-family: "Roboto", sans-serif;
          font-weight: 300;
          text-decoration: none;
          text-transform: uppercase;
        }
        site-top-menu::part(indicator) {
          margin-top: -4px;
          border-bottom-width: 4px;
        }

        @media only screen and (max-width: 700px) {
          .link a {
            font-size: 16px;
            padding: 4px;
          }
        }

        main {
          padding-top: 100px;
          font-family: "Roboto", sans-serif;
        }

        @media only screen and (max-width: 1600px) {
          main {
            padding-top: 90px;
          }
        }

        @media only screen and (max-width: 1200px) {
          main {
            padding-top: 60px;
          }
        }

        @media only screen and (max-width: 800px) {
          main {
            padding-top: 50px;
          }
        }
        scroll-button {
          --scroll-button-color: var(--bg-color);
          --scroll-button-active-color: var(--nav-bg-color);
          --scroll-button-background-color: var(--nav-bg-color);
          --scroll-button-tooltip-background-color: var(--nav-link-color);
          --scroll-button-tooltip-color: var(--bg-color);
          --simple-icon-height: 24px;
          --simple-icon-width: 24px;
          position: fixed;
          right: 0;
          bottom: 64px;
          margin-right: 24px;
        }
        header {
          padding: 4px;
          margin-top: 2px;
        }
        footer {
          display: block;
        }
        footer .wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: var(--footer-primary-bg-color);
          min-height: 200px;
          margin: 0;
          padding: 0;
        }
        footer
          .site-region-wrapper
          .footer-secondary
          footer
          .site-region-wrapper
          .footer-primary {
          display: flex;
        }
        .footer-primary {
          font-family: "Roboto", sans-serif;
          color: #ffffff;
          font-weight: 300;
          font-size: 18px;
          line-height: 1.2;
          text-align: center;
          margin: 0;
          padding: 0;
        }
        .footer-secondary {
          font-family: "Roboto", sans-serif;
          font-size: 18px;
          color: #ffffff;
          font-weight: 300;
          line-height: 1.2;
          margin: 24px 0 0 0;
          padding: 0;
        }
        .legal-statement {
          display: flex;
          margin: 0;
          padding: 10px 0px 0px;
        }
        .legal-item {
          color: #ffffff;
          padding: 0px 8px 24px;
          border-right: 2px solid #ffffff;
          height: 0px;
          margin: 0;
        }
        .legal-item:last-child {
          border: none;
        }
        .legal-item a {
          text-decoration: none;
          color: #ffffff;
        }
        .legal-item a:focus,
        .legal-item a:hover {
          color: #000000;
        }
        .legal-item a:focus {
          outline-offset: 4px;
        }
        .mark a {
          display: flex;
          background-color: var(--footer-primary-bg-color);
          border: 2px solid #ffffff;
          border-radius: 50%;
          padding: 8px;
          opacity: 0.4;
        }
        .mark {
          margin: 24px 0px 16px;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
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
    this.HAXCMSThemeSettings.scrollTarget =
      this.shadowRoot.querySelector("#contentcontainer");
    globalThis.AbsolutePositionStateManager.requestAvailability().scrollTarget =
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
      <nav
        id="nav"
        part="site-top-menu"
        itemtype="http://schema.org/SiteNavigationElement"
      >
        <site-top-menu
          .part="${this.editMode ? `edit-mode-active` : ``}"
          indicator="line"
        ></site-top-menu>
      </nav>
      <collections-theme-banner
        image="${this.image}"
        sitename="${this.title}"
        pagetitle="${this.activeTitle}"
        logo="${this.logo}"
      >
      </collections-theme-banner>
      <div id="haxcms-theme-top"></div>
      <main>
        <article id="contentcontainer">
          <section id="slot">
            <slot></slot>
          </section>
        </article>
      </main>
      <footer
        itemtype="http://schema.org/WPFooter"
        .part="${this.editMode ? `edit-mode-active` : ``}"
      >
        <section class="footer">
          <div class="wrap">
            <div class="footer-secondary">
              <slot name="footer-secondary"></slot>
              <site-region name="footerSecondary"></site-region>
            </div>
            <div class="footer-primary">
              <slot name="footer-primary"></slot>
              <site-region name="footerPrimary"></site-region>
            </div>
          </div>
        </section>
        <scroll-button
          .part="${this.editMode ? `edit-mode-active` : ``}"
        ></scroll-button>
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
        const link = globalThis.document.createElement("link");
        link.setAttribute(
          "href",
          "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400&display=swap",
        );
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("fetchpriority", "low");
        globalThis.document.head.appendChild(link);
      }
    });
    autorun((reaction) => {
      let manifest = toJS(store.manifest);
      this.color = this._getColor(manifest);
      this.title = varGet(manifest, "title", "");
      this.image = varGet(
        manifest,
        "metadata.theme.variables.image",
        "assets/banner.jpg",
      );
      this.logo = varGet(manifest, "metadata.site.logo", "assets/banner.jpg");
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      let activeItem = toJS(store.activeItem);
      if (activeItem && activeItem.metadata && activeItem.metadata.image) {
        this.image = activeItem.metadata.image;
      } else {
        let manifest = toJS(store.manifest);
        this.image = varGet(
          manifest,
          "metadata.theme.variables.image",
          "assets/banner.jpg",
        );
      }
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.activeTitle = toJS(store.activeTitle);
      this.__disposer.push(reaction);
    });
  }
  _getColor(manifest) {
    if (
      manifest &&
      varExists(manifest, "metadata.theme.variables.cssVariable")
    ) {
      return manifest.metadata.theme.variables.cssVariable
        .replace("--simple-colors-default-theme-", "")
        .replace("-7", "");
    }
  }
}
customElements.define(CollectionsTheme.tag, CollectionsTheme);
export { CollectionsTheme };
