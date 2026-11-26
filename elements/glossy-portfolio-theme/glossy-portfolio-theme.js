/**
 * Copyright 2025 The Pennsylvania State University
 * Copyright 2025 NazmanRosman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { GlossyPageStyles } from "./lib/GlossyPageStyles.js";
import { activateGlossyDesignSystem } from "./lib/GlossyDesignSystem.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";

import "./lib/glossy-portfolio-card.js";
import "./lib/glossy-portfolio-header.js";
import "./lib/glossy-portfolio-footer.js";
import "./lib/glossy-portfolio-home.js";
import "./lib/glossy-portfolio-grid.js";
import "./lib/glossy-portfolio-breadcrumb.js";
import { applyFromStore } from "@haxtheweb/haxcms-elements/lib/core/utils/storeApply.js";
/**
 * @title Glossy Portfolio
 * `A theme for creating glossy portfolio-style websites`
 * @demo index.html
 * @haxcms-theme-category Website, Portfolio
 * @haxcms-theme-layout Top nav
 * @element glossy-portfolio-theme
 */
export class GlossyPortfolioTheme extends DDDSuper(
  I18NMixin(HAXCMSLitElementTheme),
) {
  static get tag() {
    return "glossy-portfolio-theme";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      skipToContent: "Skip to content",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/glossy-portfolio-theme.en.json", import.meta.url)
          .href + "/../",
    });
    this.title = "";
    this.HAXCMSThemeSettings.autoScroll = true;
    this.activeParent = ""; // set with activeItem, used for parentSlug and parentTitle
    this.__disposer = this.__disposer || [];

    autorun((_reaction) => {
      const _mobx_val_0 = toJS(store.activeItem);
      applyFromStore(_reaction, () => {
        this.isHome = false; // default to false
        const active = _mobx_val_0;
        if (active) {
          if (active.order === 0 && store.ancestorItem === null) {
            this.isHome = true;
          }
        }
      });
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      siteDescription: { type: String },
      relatedItem: { type: Object },
      isHome: { type: Boolean },
      items: { type: Object },
    };
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    // blocks authored in the portfolio take on Glossy through the DDD bridge
    // (lib/GlossyDesignSystem.js): its tokens, the page typography and the
    // underlined content links, plus the Manrope and Inter faces HAX serves
    activateGlossyDesignSystem();
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      GlossyPageStyles,
      css`
        :host {
          box-sizing: border-box;
          color-scheme: dark;
          --bg-color: #111111;
          --main-font: "Manrope", "Manrope Placeholder", sans-serif;
          --max-width: 1200px;
          --page-padding: 0 25px;
          --link-color: #6cddff;
          --link-color-hover: #9ae7ff;
          --main-font-size: var(--ddd-font-size-3xs, 18px);
          --mobile-page-padding: 0 15px;
          --text-color: var(--ddd-theme-default-white); /* Default text color */
          --footer-height: 76px;
          --max-width-text: 840px; /* Max width for text content */
        }

        * {
          box-sizing: border-box;
        }

        :host {
          display: block;
          color: var(--text-color);
          font-family: var(--main-font);
          margin: auto;
          box-sizing: border-box;
          overflow: visible;
          min-height: 100vh;
          background-color: var(--bg-color);
        }
        :host([dark-mode]) {
          --bg-color: #111111;
          --text-color: var(--ddd-theme-default-white);
          --link-color: #6cddff;
          --link-color-hover: #9ae7ff;
          color-scheme: dark;
        }

        :host([edit-mode]) {
          margin: var(
            --hax-tray-element-align-margin,
            0 0 0
              calc(var(--hax-tray-width) - var(--hax-tray-menubar-min-width))
          );
          transition: margin var(--ddd-duration-slow, 0.6s) ease-in-out;
        }

        :host([edit-mode][tray-status="collapsed"]) {
          margin: 0;
        }
        @media (max-width: 800px) {
          :host([edit-mode]) {
            margin: 0;
          }
        }

        :host([is-logged-in]) {
          glossy-portfolio-header {
            padding-top: 52px;
          }
        }

        glossy-portfolio-header {
          position: fixed;
          top: 0;
          /* Ensure header is above other content */
          z-index: var(--ddd-z-sticky, 200);
        }

        site-active-title h1 {
          margin-bottom: 0;
        }

        #contentcontainer,
        #slot {
          z-index: 2;
          background-color: var(--bg-color);
          width: 100%;
        }

        #slot {
          min-height: 0;
        }

        .max-body-width {
          width: 100%;
          max-width: var(--max-width);
          margin: auto;
          z-index: 2; /* Ensure content is above the background */
          background-color: var(--bg-color); /* Match background color */
        }
        #contentcontainer {
          max-width: var(--max-width-text);
          margin: 0;
          padding: var(--page-padding);
          padding-top: 80px;
        }

        glossy-portfolio-breadcrumb {
          margin-top: 40px;
        }

        glossy-portfolio-footer {
          position: relative;
          bottom: 0;
          width: 100%;
        }
        .body-wrapper {
          display: flex;
          flex-direction: column;
          min-height: calc(100vh + var(--footer-height));
          width: 100%;
          z-index: 2;
        }

        /* .grow and .not-grow makes sure the footer is at the bottom of page */
        .grow {
          flex: 1 0 auto; /* Allow this element to grow and fill available space */
        }
        .not-grow {
          flex: 0 0 auto; /* Prevent this element from growing */
        }

        body.no-scroll {
          overflow: hidden; /* Prevents scrolling when open mobile nav link*/
        }

        .padding-bottom {
          padding-bottom: 100px;
        }

        /* Extra small devices (phones) */
        @media (max-width: 575.98px) {
          :host *,
          :root * {
            --page-padding: 0 15px;
          }
          :root,
          html,
          body {
            font-size: 16px;
          }
          #contentcontainer {
            padding-top: 60px;
          }
          glossy-portfolio-breadcrumb {
            margin-top: 20px;
          }
        }
      `,
    ];
  }

  // Lit render the HTML

  render() {
    return html`
      <!-- temporary margin-top  -->
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      <glossy-portfolio-header role="banner"></glossy-portfolio-header>

      <div class="body-wrapper">
        ${
          this.isHome
            ? html`<glossy-portfolio-home></glossy-portfolio-home>`
            : html``
        }
        <main class="max-body-width" role="main">
          <article id="contentcontainer" class="grow contentcontainer">
            <glossy-portfolio-breadcrumb></glossy-portfolio-breadcrumb>
            <site-active-title></site-active-title>
            <div id="slot"><slot></slot></div>
          </article>
        </main>
        <glossy-portfolio-grid class="grow"></glossy-portfolio-grid>
        <div class="padding-bottom"></div>
        <glossy-portfolio-footer class="not-grow"></glossy-portfolio-footer>
      </div>
    `;
  }

  disconnectedCallback() {
    // dispose the store reaction (and any inherited ones) so a detached
    // theme stops reacting to the site store
    for (let i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
}

globalThis.customElements.define(
  GlossyPortfolioTheme.tag,
  GlossyPortfolioTheme,
);
