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
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-top-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-tags.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
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

        header:not(:empty) {
          background-color: var(--polaris-header-bg-color);
        }

        nav {
          background-color: var(--polaris-nav-bg-color);
        }
        article {
          background-color: var(--polaris-content-bg-color);
        }

        .footer-1 {
          background-color: var(--polaris-footer-1-bg-color);
        }

        .footer-2 {
          background-color: var(--polaris-footer-2-bg-color);
        }
      `,
    ];
  }
  // render function
  render() {
    return html`
    <div id="haxcms-theme-top"></div>
    <header itemtype="http://schema.org/WPHeader">
      <slot name="header"></slot>
    </header>
    <nav itemtype="http://schema.org/SiteNavigationElement">
      <site-top-menu></site-top-menu>
    </nav>
    <main>
      <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
      <site-active-title part="page-title"></site-active-title>
      <site-active-tags
        part="page-tags"
        auto-accent-color
      ></site-active-tags>
      <article id="contentcontainer">
        <section id="slot">
          <slot></slot>
        </section>
      </article>
    </main>
    <footer itemtype="http://schema.org/WPFooter">
      <section class="footer-1">
        <slot name="footer-1"></slot>
      </section>
      <section class="footer-2">
        <slot name="footer-2"></slot>
      </section>
    </footer>
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
    return "polaris-theme";
  }
  /**
   * Add elements to cheat on initial paint here
   */
  constructor() {
    super();
    this.HAXCMSThemeSettings.autoScroll = true;
    this.searchTerm = "";
    this.__disposer = this.__disposer ? this.__disposer : [];
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
