/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import "./lib/hax-style-switcher.js";

/**
 * `hax-marketing-theme`
 * The theme for the haxtheweb.org landing site: a top bar with the site
 * title and top-level pages, a strip with the style switcher so a visitor
 * can swap theme, palette and design system on the live site, a palette
 * band carrying the page title, the content column, and a footer.
 *
 * Text on a palette color uses that palette's text color, and only large
 * text sits on the band: under some design system bridges a palette pair
 * drops below 4.5:1 (haxtheweb/issues#3370), while large text needs 3:1.
 * The chrome reads only --ddd-* tokens, so a site can give this theme a
 * design system of its own.
 *
 * @title HAX marketing
 * @haxcms-theme-category Website
 * @haxcms-theme-priority 20
 * @element hax-marketing-theme
 */
class HaxMarketingTheme extends HAXCMSThemeParts(
  DDDSuper(HAXCMSLitElementTheme),
) {
  static get tag() {
    return "hax-marketing-theme";
  }

  /**
   * The chrome reads only --ddd-* tokens, so a site can give this theme
   * another design system (metadata.theme.designSystem)
   */
  static get acceptsDesignSystems() {
    return true;
  }

  constructor() {
    super();
    this.topLevel = [];
    this.activeId = null;
    // the palette this theme draws when the site has not picked one
    this.dataPalette = "3";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      skipToContent: "Skip to content",
      site: "Site",
      switcherHeading: "Same site, your pick. Swap it live:",
      payoff: "Every era had its tools. This one's yours.",
      license: "HAX is Apache-2.0, the whole stack.",
    };
    // no I18NMixin in this class chain, so register with the store directly
    I18NManagerStore.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      topLevel: { type: Array, attribute: false },
      activeId: { type: String, attribute: false },
      dataPalette: { type: String, reflect: true, attribute: "data-palette" },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.__marketingDisposer = autorun(() => {
      const manifest = toJS(store.manifest);
      const activeId = toJS(store.activeId);
      Promise.resolve().then(() => {
        this.activeId = activeId;
        this.topLevel =
          manifest && Array.isArray(manifest.items)
            ? manifest.items.filter(
                (item) =>
                  item.parent === null &&
                  !(item.metadata && item.metadata.hideInMenu),
              )
            : [];
      });
    });
  }

  disconnectedCallback() {
    if (this.__marketingDisposer) {
      this.__marketingDisposer();
    }
    super.disconnectedCallback();
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          padding: var(--ddd-spacing-0);
          margin: var(--ddd-spacing-0);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
      `,
    ];
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-primary);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --hax-marketing-measure: 1120px;
          --hax-marketing-gutter: clamp(
            var(--ddd-spacing-4),
            4vw,
            var(--ddd-spacing-8)
          );
        }
        :host([edit-mode]) {
          margin: var(
            --hax-tray-element-align-margin,
            0 0 0
              calc(var(--hax-tray-width) - var(--hax-tray-menubar-min-width))
          );
          transition: margin 0.6s ease-in-out;
        }
        .inner {
          max-width: var(--hax-marketing-measure);
          margin: var(--ddd-spacing-0) auto;
          padding: var(--ddd-spacing-0) var(--hax-marketing-gutter);
          box-sizing: border-box;
        }
        header .inner {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-6);
          padding-top: var(--ddd-spacing-3);
          padding-bottom: var(--ddd-spacing-3);
        }
        header {
          border-bottom: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            );
        }
        site-title {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-weight: var(--ddd-font-weight-black);
          font-size: var(--ddd-font-size-xs);
          --site-title-link-text-decoration: none;
        }
        nav {
          flex: 1 1 0;
          min-width: min(100%, 280px);
        }
        /* DDD gives lists a column flow and a stack gap; the menu is a row */
        nav .menu {
          display: flex;
          flex-flow: row wrap;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-5);
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          list-style: none;
        }
        nav .menu li {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
        nav a {
          display: block;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          color: inherit;
          text-decoration: none;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-0);
          border-bottom: var(--ddd-border-size-sm) solid transparent;
        }
        nav a:hover,
        nav a.active {
          border-bottom-color: var(--ddd-palette-color-4);
        }
        nav a.active {
          font-weight: var(--ddd-font-weight-bold);
        }
        nav a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .switcher {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          border-bottom: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            );
        }
        .band {
          background-color: var(--ddd-palette-color-1);
          color: var(--ddd-palette-text-color-1);
        }
        .band .inner {
          padding-top: var(--ddd-spacing-10);
          padding-bottom: var(--ddd-spacing-10);
        }
        site-active-title {
          --site-active-title-color: var(--ddd-palette-text-color-1);
          color: var(--ddd-palette-text-color-1);
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: clamp(
            var(--ddd-font-size-l),
            6vw,
            var(--ddd-font-size-xxl)
          );
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-0);
        }
        main .inner {
          padding-top: var(--ddd-spacing-10);
          padding-bottom: var(--ddd-spacing-12);
        }
        .pager {
          display: flex;
          justify-content: space-between;
          border-top: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            );
          padding-top: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-10);
        }
        /* small text stays off the palette band: the footer uses the
           neutral surface and ink, with a palette rule above it */
        footer {
          border-top: var(--ddd-spacing-1) solid var(--ddd-palette-color-4);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        footer .inner {
          padding-top: var(--ddd-spacing-8);
          padding-bottom: var(--ddd-spacing-8);
        }
        .payoff {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-s);
          margin: var(--ddd-spacing-0);
        }
        footer p {
          margin: var(--ddd-spacing-2) var(--ddd-spacing-0) var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
        }
      `,
    ];
  }

  render() {
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      <header>
        <div class="inner">
          <site-title></site-title>
          <nav aria-label="${this.t.site}">
            <ul class="menu">
              ${this.topLevel.map(
                (item) => html`
                  <li>
                    <a
                      class="${item.id === this.activeId ? "active" : ""}"
                      href="${item.slug}"
                      aria-current="${
                        item.id === this.activeId ? "page" : "false"
                      }"
                      >${item.title}</a
                    >
                  </li>
                `,
              )}
            </ul>
          </nav>
        </div>
      </header>
      <div class="switcher">
        <div class="inner">
          <hax-style-switcher
            heading="${this.t.switcherHeading}"
          ></hax-style-switcher>
        </div>
      </div>
      <div class="band">
        <div class="inner">
          <site-active-title></site-active-title>
        </div>
      </div>
      <main>
        <div class="inner">
          <site-region name="contentTop"></site-region>
          <article>
            <!-- required for HAX to edit the page: contentcontainer, slot, and the wrapped slot -->
            <div id="contentcontainer">
              <div id="slot"><slot></slot></div>
            </div>
          </article>
          <div class="pager">
            <site-menu-button type="prev" position="top"></site-menu-button>
            <site-menu-button type="next" position="top"></site-menu-button>
          </div>
        </div>
      </main>
      <footer>
        <div class="inner">
          <p class="payoff">${this.t.payoff}</p>
          <p>${this.t.license}</p>
          <site-region name="footerPrimary"></site-region>
        </div>
      </footer>
    `;
  }
}
globalThis.customElements.define(HaxMarketingTheme.tag, HaxMarketingTheme);
export { HaxMarketingTheme };
