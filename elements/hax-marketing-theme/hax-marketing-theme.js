/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import {
  HAXCMSLitElementTheme,
  css,
  html,
  store,
  autorun,
  toJS,
} from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import "@haxtheweb/hax-network-bar/hax-network-bar.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/hax-marketing-theme/lib/hax-style-switcher.js";
import "@haxtheweb/hax-marketing-theme/lib/hax-reel.js";
import { applyMarketingPalette } from "@haxtheweb/hax-marketing-theme/lib/hax-marketing-palette.js";

/**
 * `hax-marketing-theme`
 * Marketing theme, first built for the haxtheweb.org site.
 *
 * A marketing theme anyone can use: a header with the site's logo, name and
 * top-level pages, a band in the palette's lead color that carries the page
 * title (with the site's own art and a screen on the home page), a wide
 * content column for section blocks, the live style switcher, and a footer
 * with every page. Band, buttons, edges and shadows all follow the site's
 * palette, and the chrome reads only --ddd-* tokens, so any design system
 * fits. What is particular to a site (logo, art, eyebrow, payoff line,
 * network bar) comes from the site's theme variables, not from this file.
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

  static get acceptsDesignSystems() {
    return true;
  }

  constructor() {
    super();
    this._items = [];
    this._all = [];
    this.activeId = null;
    this.activeDescription = "";
    this._vars = {};
    this._title = "";
    this._logo = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      skipToContent: "Skip to content",
      site: "Site",
      changeLogo: "Change the logo",
      anotherPicture: "Show another picture",
      anotherTheme: "Show another theme",
      switcherHeading: "Same site, your pick. Swap it live:",
    };
    // no I18NMixin in this class chain, so register with the store directly
    I18NManagerStore.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.__repaint = () => {
      // the design system and palette settle over a few frames
      [0, 400, 1500].forEach((wait) =>
        setTimeout(() => applyMarketingPalette(this), wait),
      );
    };
  }

  static get properties() {
    return {
      ...super.properties,
      activeId: { type: String },
      activeDescription: { type: String },
      dataPalette: { type: String, reflect: true, attribute: "data-palette" },
      _items: { type: Array },
      _all: { type: Array },
      _vars: { type: Object },
      _title: { type: String },
      _logo: { type: String },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    // the site outline, read while the theme is on the page
    this.__stopStore = autorun(() => {
      const activeId = toJS(store.activeId);
      const manifest = toJS(store.manifest);
      const activeItem = toJS(store.activeItem);
      Promise.resolve().then(() => {
        this.activeId = activeId;
        this._all =
          manifest && manifest.items
            ? manifest.items.filter(
                (item) => !(item.metadata && item.metadata.hideInMenu),
              )
            : [];
        this._items = this._all.filter((item) => item.parent === null);
        this.activeDescription =
          activeItem && activeItem.description ? activeItem.description : "";
        const meta = manifest && manifest.metadata ? manifest.metadata : {};
        this._vars =
          meta.theme && meta.theme.variables ? meta.theme.variables : {};
        this._title = manifest && manifest.title ? manifest.title : "";
        this._logo = meta.site && meta.site.logo ? meta.site.logo : "";
        this.__repaint();
      });
    });
    globalThis.addEventListener("design-system-active-changed", this.__repaint);
    this.__scheme = globalThis.matchMedia("(prefers-color-scheme: dark)");
    this.__scheme.addEventListener("change", this.__repaint);
    // palette and dark mode arrive as attributes on this element and the page
    this.__watch = new MutationObserver(this.__repaint);
    this.__watch.observe(this, {
      attributes: true,
      attributeFilter: ["data-palette", "dark-mode", "class"],
    });
    this.__watch.observe(globalThis.document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });
    this.__watch.observe(globalThis.document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    this.__repaint();
  }

  disconnectedCallback() {
    if (this.__stopStore) {
      this.__stopStore();
      this.__stopStore = null;
    }
    globalThis.removeEventListener(
      "design-system-active-changed",
      this.__repaint,
    );
    if (this.__scheme) {
      this.__scheme.removeEventListener("change", this.__repaint);
    }
    if (this.__watch) {
      this.__watch.disconnect();
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
        hax-marketing-theme h2 {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: clamp(
            var(--ddd-font-size-m),
            3.2vw,
            var(--ddd-font-size-xl)
          );
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-16) var(--ddd-spacing-0)
            var(--ddd-spacing-4);
        }
        /* call-to-action buttons in the page take the palette's lead color */
        hax-marketing-theme simple-cta {
          --ddd-theme-primary: var(--hm-brand);
          --ddd-theme-accent: var(--hm-on-brand);
        }
        hax-marketing-theme h2 + p,
        hax-marketing-theme p.lead {
          font-size: var(--ddd-font-size-xs);
          line-height: var(--ddd-lh-150);
          max-width: 62ch;
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
          --ink: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --line: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          /* roles set from the palette by hax-marketing-palette.js; these are
             what shows until it has run */
          --night: var(--hm-brand, var(--ddd-theme-default-potentialMidnight));
          --on-night: var(--hm-on-brand, var(--ddd-theme-default-white));
          --spark: var(--hm-accent, var(--ddd-theme-default-keystoneYellow));
          --on-spark: var(
            --hm-on-accent,
            var(--ddd-theme-default-potentialMidnight)
          );
          --rule: var(--hm-shade, var(--ddd-theme-default-keystoneYellow));
          --edge: var(--hm-edge, var(--ink));
          background-color: var(--surface);
          color: var(--ink);
          --hax-marketing-measure: 1180px;
          --hax-marketing-gutter: clamp(
            var(--ddd-spacing-4),
            4vw,
            var(--ddd-spacing-8)
          );
          --hax-network-bar-max-width: var(--hax-marketing-measure);
          --hax-network-bar-gutter: var(--hax-marketing-gutter);
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
        a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }

        /* header */
        header {
          background-color: var(--surface);
          border-bottom: var(--ddd-border-size-md) solid var(--edge);
        }
        header .inner {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-6);
          padding-top: var(--ddd-spacing-3);
          padding-bottom: var(--ddd-spacing-3);
        }
        .brand a {
          color: inherit;
          text-decoration: none;
          display: inline-block;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-0);
        }
        .brand .logo {
          width: var(--ddd-spacing-12);
          height: var(--ddd-spacing-12);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-weight: var(--ddd-font-weight-black);
          font-size: var(--ddd-font-size-s);
          min-height: var(--ddd-spacing-12);
        }
        .brand img {
          width: auto;
          height: var(--ddd-spacing-12);
        }
        nav {
          flex: 1 1 0;
          min-width: min(100%, 280px);
        }
        nav ul {
          display: flex;
          flex-flow: row wrap;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-6);
          list-style: none;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
        nav li {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
        nav a {
          display: block;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-medium);
          color: inherit;
          text-decoration: none;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-0);
          border-bottom: var(--ddd-border-size-md) solid transparent;
        }
        nav a:hover,
        nav a[aria-current="page"] {
          border-bottom-color: var(--edge);
        }
        nav a[aria-current="page"] {
          font-weight: var(--ddd-font-weight-bold);
        }
        .cta,
        .ghost {
          display: inline-block;
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-3xs);
          text-decoration: none;
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
        }
        header .cta {
          color: var(--on-night);
          background-color: var(--night);
          border: var(--ddd-border-size-md) solid var(--edge);
        }
        header .cta:hover {
          color: var(--ink);
          background-color: var(--surface);
        }

        /* hero */
        .hero {
          background-color: var(--night);
          color: var(--on-night);
          border-bottom: var(--ddd-spacing-2) solid var(--rule);
          overflow: hidden;
        }
        .hero .inner {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
          gap: var(--ddd-spacing-10);
          align-items: center;
          padding-top: var(--ddd-spacing-12);
          padding-bottom: var(--ddd-spacing-12);
        }
        .hero:not(.home) .inner {
          grid-template-columns: minmax(0, 1fr) auto;
          padding-top: var(--ddd-spacing-8);
          padding-bottom: var(--ddd-spacing-8);
        }
        .eyebrow {
          font-family: var(--ddd-font-navigation, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-3);
        }
        site-active-title {
          --site-active-title-color: var(--on-night);
          color: var(--on-night);
          display: block;
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-weight: var(--ddd-font-weight-black);
          font-size: clamp(
            var(--ddd-font-size-l),
            5vw,
            var(--ddd-font-size-3xl)
          );
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-0);
          text-wrap: balance;
        }
        site-active-title h1 {
          font: inherit;
          color: inherit;
          margin: var(--ddd-spacing-0);
        }
        .hero.home site-active-title {
          font-size: clamp(
            var(--ddd-font-size-xl),
            6.4vw,
            var(--ddd-font-size-4xl)
          );
        }
        .lede {
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-140);
          max-width: 56ch;
          margin: var(--ddd-spacing-4) var(--ddd-spacing-0) var(--ddd-spacing-0);
        }
        .hero:not(.home) .lede {
          font-size: var(--ddd-font-size-xs);
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-3);
          margin-top: var(--ddd-spacing-6);
        }
        .hero .cta {
          color: var(--on-spark);
          background-color: var(--spark);
          border: var(--ddd-border-size-md) solid var(--spark);
        }
        .hero .ghost {
          color: var(--on-night);
          border: var(--ddd-border-size-md) solid var(--on-night);
        }
        .hero .cta:hover,
        .hero .ghost:hover {
          color: var(--night);
          background-color: var(--on-night);
          border-color: var(--on-night);
        }
        .hero a:focus-visible {
          outline: var(--ddd-border-size-md) solid var(--on-night);
          outline-offset: var(--ddd-spacing-1);
        }
        .art {
          position: relative;
          min-height: 320px;
        }
        .burst {
          position: absolute;
          inset: -8% 8% 6% -8%;
          background-color: var(--rule);
          clip-path: polygon(
            50% 0%,
            61% 14%,
            79% 6%,
            80% 25%,
            98% 28%,
            88% 44%,
            100% 58%,
            83% 64%,
            85% 83%,
            67% 80%,
            58% 97%,
            46% 83%,
            29% 93%,
            27% 74%,
            8% 73%,
            17% 56%,
            2% 43%,
            19% 34%,
            13% 15%,
            32% 18%,
            38% 2%
          );
        }
        .traveler {
          position: relative;
          display: block;
          width: min(74%, 380px);
          --reel-frame-border: var(--ddd-spacing-1) solid var(--on-night);
          --reel-frame-radius: 50%;
          margin: 0 0 22% 6%;
        }
        .screen {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 56%;
          --reel-frame-border: var(--ddd-border-size-md) solid var(--on-night);
          --reel-frame-radius: var(--ddd-radius-md);
          --reel-frame-shadow: var(--ddd-spacing-2) var(--ddd-spacing-2)
            var(--ddd-spacing-0)
            var(--hm-shade-2, var(--ddd-theme-default-beaverBlue));
          color: var(--on-night);
          padding: 0 var(--ddd-spacing-2) 0 0;
        }
        .sticker {
          width: var(--ddd-spacing-24);
          height: var(--ddd-spacing-24);
          transform: rotate(6deg);
        }

        /* content */
        main .inner {
          padding-top: var(--ddd-spacing-10);
          padding-bottom: var(--ddd-spacing-12);
        }
        .pager {
          display: flex;
          justify-content: space-between;
          border-top: var(--ddd-border-size-xs) solid var(--line);
          padding-top: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-12);
        }

        /* live switcher */
        .switcher {
          border-top: var(--ddd-border-size-md) solid var(--edge);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .switcher .inner {
          padding-top: var(--ddd-spacing-6);
          padding-bottom: var(--ddd-spacing-6);
        }

        /* footer */
        footer {
          background-color: var(--night);
          color: var(--on-night);
          border-top: var(--ddd-spacing-2) solid var(--rule);
        }
        footer .inner {
          padding-top: var(--ddd-spacing-10);
          padding-bottom: var(--ddd-spacing-10);
        }
        .payoff {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-weight: var(--ddd-font-weight-black);
          font-size: clamp(
            var(--ddd-font-size-m),
            4vw,
            var(--ddd-font-size-xl)
          );
          line-height: var(--ddd-lh-120);
          margin: var(--ddd-spacing-0);
          text-wrap: balance;
        }
        .cols {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--ddd-spacing-8);
          margin-top: var(--ddd-spacing-8);
        }
        footer h2 {
          font-family: var(--ddd-font-navigation, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-2);
        }
        footer ul {
          list-style: none;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
        footer li {
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
        footer a {
          display: inline-block;
          color: var(--on-night);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-0);
        }
        footer a:focus-visible {
          outline: var(--ddd-border-size-md) solid var(--on-night);
          outline-offset: var(--ddd-spacing-1);
        }
        .legal {
          font-size: var(--ddd-font-size-4xs);
          margin: var(--ddd-spacing-8) var(--ddd-spacing-0) var(--ddd-spacing-0);
        }

        @media (max-width: 820px) {
          .hero .inner,
          .hero:not(.home) .inner {
            grid-template-columns: 1fr;
            gap: var(--ddd-spacing-6);
            padding-top: var(--ddd-spacing-8);
            padding-bottom: var(--ddd-spacing-8);
          }
          .art {
            min-height: 0;
            max-width: 420px;
          }
          .sticker {
            display: none;
          }
          header .cta {
            display: none;
          }
        }
      `,
    ];
  }

  // bring the first block of the page fully into view
  _toContent(e) {
    const target =
      this.querySelector("hax-use-case-picker") ||
      this.shadowRoot.querySelector("#contentcontainer");
    if (!target) {
      return;
    }
    e.preventDefault();
    const calm = globalThis.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const top = target.getBoundingClientRect().top + globalThis.scrollY - 16;
    globalThis.scrollTo({ top, behavior: calm ? "auto" : "smooth" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  render() {
    const home = this._items.length ? this._items[0] : null;
    const isHome = home && home.id === this.activeId;
    const start = this._all.find((item) => item.slug === "get-started");
    const v = this._vars || {};
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      ${
        v.network === "hax"
          ? html`<hax-network-bar current="docs"></hax-network-bar>`
          : ``
      }
      <header>
        <div class="inner">
          <div class="brand">
            ${
              Array.isArray(v.logos) && v.logos.length
                ? html`<hax-reel
                    class="logo"
                    effect="channel"
                    label="${this.t.changeLogo}"
                    .items="${v.logos}"
                  ></hax-reel>`
                : this._logo
                  ? html`<img src="${this._logo}" alt="" />`
                  : ``
            }
            <a href="${home ? home.slug : "./"}">${this._title}</a>
          </div>
          <nav aria-label="${this.t.site}">
            <ul>
              ${this._items.slice(1).map(
                (item) => html`
                  <li>
                    <a
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
          ${
            home && v.cta
              ? html`<a class="cta" href="${home.slug}">${v.cta}</a>`
              : ``
          }
        </div>
      </header>
      <div class="hero ${isHome ? "home" : ""}">
        <div class="inner">
          <div>
            ${
              isHome && v.eyebrow
                ? html`<p class="eyebrow">${v.eyebrow}</p>`
                : ``
            }
            <site-active-title></site-active-title>
            ${
              this.activeDescription
                ? html`<p class="lede">${this.activeDescription}</p>`
                : ``
            }
            ${
              isHome
                ? html`<div class="actions">
                    ${
                      v.heroAction
                        ? html`<a
                            class="cta"
                            href="#contentcontainer"
                            @click="${this._toContent}"
                            >${v.heroAction}</a
                          >`
                        : ``
                    }
                    ${
                      start
                        ? html`<a class="ghost" href="${start.slug}"
                            >${start.title}</a
                          >`
                        : ``
                    }
                  </div>`
                : ``
            }
          </div>
          ${
            isHome && Array.isArray(v.art) && v.art.length
              ? html`<div class="art">
                  <div class="burst" aria-hidden="true"></div>
                  <hax-reel
                    class="traveler"
                    round
                    effect="glitch"
                    label="${this.t.anotherPicture}"
                    .items="${v.art}"
                  ></hax-reel>
                  ${
                    Array.isArray(v.screens) && v.screens.length
                      ? html`<hax-reel
                          class="screen"
                          caption
                          effect="channel"
                          label="${this.t.anotherTheme}"
                          .items="${v.screens}"
                        ></hax-reel>`
                      : ``
                  }
                </div>`
              : !isHome && v.sticker
                ? html`<img class="sticker" src="${v.sticker}" alt="" />`
                : ``
          }
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
      <div class="switcher">
        <div class="inner">
          <hax-style-switcher
            heading="${this.t.switcherHeading}"
          ></hax-style-switcher>
        </div>
      </div>
      <footer>
        <div class="inner">
          ${v.payoff ? html`<p class="payoff">${v.payoff}</p>` : ``}
          <div class="cols">
            <div>
              <h2>${this._title}</h2>
              <ul>
                ${this._items.map(
                  (item) =>
                    html`<li><a href="${item.slug}">${item.title}</a></li>`,
                )}
              </ul>
            </div>
            ${this._items
              .filter((item) =>
                this._all.some((child) => child.parent === item.id),
              )
              .map(
                (item) => html`
                  <div>
                    <h2>${item.title}</h2>
                    <ul>
                      ${this._all
                        .filter((child) => child.parent === item.id)
                        .map(
                          (child) =>
                            html`<li>
                              <a href="${child.slug}">${child.title}</a>
                            </li>`,
                        )}
                    </ul>
                  </div>
                `,
              )}
          </div>
          ${v.legal ? html`<p class="legal">${v.legal}</p>` : ``}
          <site-region name="footerPrimary"></site-region>
        </div>
      </footer>
    `;
  }
}
globalThis.customElements.define(HaxMarketingTheme.tag, HaxMarketingTheme);
export { HaxMarketingTheme };
