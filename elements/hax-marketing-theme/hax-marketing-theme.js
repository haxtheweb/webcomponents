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
import { unsafeCSS } from "lit";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import "@haxtheweb/hax-network-bar/hax-network-bar.js";
import "@haxtheweb/scroll-button/scroll-button.js";
import "@haxtheweb/hax-marketing-theme/lib/hax-story-link.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/hax-marketing-theme/lib/hax-style-switcher.js";
import "@haxtheweb/hax-marketing-theme/lib/hax-reel.js";
import { applyMarketingPalette } from "@haxtheweb/hax-marketing-theme/lib/hax-marketing-palette.js";

/**
 * `hax-marketing-theme`
 * Marketing theme, first built for the haxtheweb.org site.
 *
 * A marketing theme anyone can use: a header with the site's logo, name and
 * top-level pages (a page with pages under it opens a menu of them), a Remix
 * button that restyles the site live, a band in the palette's lead color that
 * carries the page title (with the site's own art and a screen on the home
 * page), a wide content column for section blocks, previous and next page
 * links, a back to top button, and a footer with every page. Band, buttons,
 * edges and shadows all follow the site's palette, and the chrome reads only
 * --ddd-* tokens, so any design system fits. What is particular to a site
 * (logo, art, eyebrow, payoff line, footer links, network bar) comes from the
 * site's theme variables, not from this file.
 *
 * @title HAX marketing
 * @haxcms-theme-category Website, Landing page
 * @haxcms-theme-layout Top nav
 * @haxcms-theme-design-system Future Traveler
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
    this._menu = "";
    this._remix = false;
    this._editor = false;
    this._deep = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      skipToContent: "Skip to content",
      site: "Site",
      changeLogo: "Change the logo",
      anotherPicture: "Show another picture",
      anotherTheme: "Show another theme",
      switcherHeading: "Same site, your pick. Swap it live:",
      remix: "Remix",
      remixRandom: "Remix this site: a look picked by chance",
      remixOptions: "Show every way to remix this site",
      pagesUnder: "Pages under {name}",
      previous: "Previous",
      next: "Next",
      pages: "Previous and next page",
      footerLinks: "More",
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
      _menu: { type: String },
      _remix: { type: Boolean },
      _editor: { type: Boolean },
      _deep: { type: Boolean },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    // the site outline, read while the theme is on the page
    this.__stopStore = autorun(() => {
      const activeId = toJS(store.activeId);
      const manifest = toJS(store.manifest);
      const activeItem = toJS(store.activeItem);
      const editor = !!store.isLoggedIn;
      Promise.resolve().then(() => {
        this._editor = editor;
        this._menu = "";
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
    // the back to top button shows once the page has moved a screen down
    this.__scrolled = () => {
      this._deep = globalThis.scrollY > globalThis.innerHeight;
    };
    globalThis.addEventListener("scroll", this.__scrolled, { passive: true });
    // a click anywhere else closes an open menu
    this.__away = (e) => {
      if (
        this._menu &&
        !e.composedPath().some((el) => el.localName === "nav")
      ) {
        this._menu = "";
      }
    };
    globalThis.addEventListener("click", this.__away);
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
    globalThis.removeEventListener("scroll", this.__scrolled);
    globalThis.removeEventListener("click", this.__away);
    if (this.__watch) {
      this.__watch.disconnect();
    }
    super.disconnectedCallback();
  }

  HAXCMSGlobalStyleSheetContent() {
    // keyed to this element's own tag, so a theme that extends this one gets
    // the same page rules under its own name
    const tag = unsafeCSS(this.tagName.toLowerCase());
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
        ${tag} h2 {
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
        ${tag} simple-cta {
          --ddd-theme-primary: var(--hm-brand);
          --ddd-theme-accent: var(--hm-on-brand);
        }
        ${tag} h2 + p,
        ${tag} p.lead {
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
          position: relative;
          z-index: 3;
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
        /* the logo and the page sticker light up and lift off when pointed at */
        .brand .logo,
        .sticker {
          transition:
            transform 0.2s ease-out,
            filter 0.2s ease-out;
        }
        .brand .logo:hover,
        .brand .logo:focus-within,
        .sticker:hover,
        .sticker:focus-within {
          filter: drop-shadow(0 0 var(--ddd-spacing-1) var(--spark))
            drop-shadow(0 0 var(--ddd-spacing-3) var(--spark));
        }
        @media (prefers-reduced-motion: no-preference) {
          .brand .logo:hover,
          .brand .logo:focus-within {
            animation: liftoff 1.4s ease-in-out infinite;
          }
          .sticker:hover,
          .sticker:focus-within {
            animation: liftoff 1.8s ease-in-out infinite;
          }
        }
        @keyframes liftoff {
          0%,
          100% {
            transform: translate(0, 0) rotate(var(--tilt, 0deg));
          }
          50% {
            transform: translate(6%, -14%)
              rotate(calc(var(--tilt, 0deg) + 9deg));
          }
        }
        nav {
          flex: 1 1 0;
          min-width: min(100%, 280px);
        }
        nav ul {
          display: flex;
          flex-flow: row wrap;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-5);
          list-style: none;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
        nav li {
          position: relative;
          display: flex;
          align-items: center;
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
        nav a[aria-current="page"],
        nav li.within > a {
          border-bottom-color: var(--edge);
        }
        nav a[aria-current="page"],
        nav li.within > a {
          font-weight: var(--ddd-font-weight-bold);
        }
        nav .more {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--ddd-spacing-6);
          height: var(--ddd-spacing-6);
          margin-left: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-0);
          border: none;
          border-radius: var(--ddd-radius-xs);
          background-color: transparent;
          color: inherit;
          cursor: pointer;
        }
        nav .more svg,
        .remix svg {
          width: var(--ddd-icon-4xs);
          height: var(--ddd-icon-4xs);
          fill: none;
          stroke: currentColor;
          stroke-width: 2.4;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        nav .more:hover,
        nav .more[aria-expanded="true"] {
          background-color: var(--ink);
          color: var(--surface);
        }
        nav .more[aria-expanded="true"] svg {
          transform: rotate(180deg);
        }
        nav .sub {
          display: none;
          position: absolute;
          z-index: 4;
          top: 100%;
          left: calc(var(--ddd-spacing-3) * -1);
          min-width: 200px;
          flex-flow: column;
          gap: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          background-color: var(--surface);
          border: var(--ddd-border-size-md) solid var(--edge);
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-spacing-1) var(--ddd-spacing-1)
            var(--ddd-spacing-0) var(--rule);
        }
        nav li.open > .sub {
          display: flex;
        }
        @media (hover: hover) {
          nav li:hover > .sub {
            display: flex;
          }
        }
        nav .sub a {
          border-bottom-width: var(--ddd-border-size-sm);
        }
        button:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .tools {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-3);
        }
        /* remix: the dice restyles by chance, the arrow opens every option */
        .remix {
          display: inline-flex;
          border: var(--ddd-border-size-sm) solid var(--edge);
          border-radius: 999px;
          overflow: hidden;
        }
        .remix button {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-spacing-10);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          border: none;
          background-color: var(--surface);
          color: var(--ink);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          cursor: pointer;
        }
        .remix button + button {
          border-left: var(--ddd-border-size-sm) solid var(--edge);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
        }
        .remix button:hover,
        .remix button[aria-expanded="true"] {
          background-color: var(--ink);
          color: var(--surface);
        }
        .remix button:focus-visible {
          outline-offset: calc(var(--ddd-spacing-1) * -1);
        }
        .remix .dice {
          width: var(--ddd-icon-3xs);
          height: var(--ddd-icon-3xs);
        }
        @media (prefers-reduced-motion: no-preference) {
          .remix button:hover .dice {
            animation: roll 0.5s ease-in-out;
          }
        }
        @keyframes roll {
          to {
            transform: rotate(360deg);
          }
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
        /* the one thing in the header that has to be seen */
        header .cta {
          color: var(--on-spark);
          background-color: var(--spark);
          border: var(--ddd-border-size-md) solid var(--edge);
          box-shadow: var(--ddd-spacing-1) var(--ddd-spacing-1)
            var(--ddd-spacing-0) var(--edge);
          transition:
            transform 0.12s ease-out,
            box-shadow 0.12s ease-out;
        }
        header .cta:hover {
          color: var(--on-night);
          background-color: var(--night);
          transform: translate(
            calc(var(--ddd-spacing-1) * -0.5),
            calc(var(--ddd-spacing-1) * -0.5)
          );
          box-shadow: calc(var(--ddd-spacing-1) * 1.5)
            calc(var(--ddd-spacing-1) * 1.5) var(--ddd-spacing-0) var(--edge);
        }
        header .cta:active {
          transform: translate(var(--ddd-spacing-1), var(--ddd-spacing-1));
          box-shadow: none;
        }
        @media (prefers-reduced-motion: reduce) {
          header .cta {
            transition: none;
          }
          header .cta:hover,
          header .cta:active {
            transform: none;
          }
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
        .crumb {
          font-family: var(--ddd-font-navigation, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-2);
        }
        .crumb a {
          display: inline-block;
          color: var(--on-night);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-0);
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
          --tilt: 6deg;
          width: var(--ddd-spacing-24);
          height: var(--ddd-spacing-24);
          transform: rotate(var(--tilt));
          color: var(--on-night);
        }

        /* content */
        main .inner {
          padding-top: var(--ddd-spacing-10);
          padding-bottom: var(--ddd-spacing-12);
        }
        /* previous and next page, by name */
        .pager {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-12);
        }
        .pager a {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          color: var(--ink);
          text-decoration: none;
          background-color: var(--surface);
          border: var(--ddd-border-size-md) solid var(--edge);
          border-radius: var(--ddd-radius-sm);
        }
        .pager a.to-next {
          grid-column: 2;
          text-align: right;
          align-items: flex-end;
        }
        .pager a:hover {
          color: var(--on-night);
          background-color: var(--night);
          box-shadow: var(--ddd-spacing-1) var(--ddd-spacing-1)
            var(--ddd-spacing-0) var(--rule);
        }
        .pager .way {
          font-family: var(--ddd-font-navigation, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .pager .where {
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
        }
        scroll-button {
          position: fixed;
          z-index: 5;
          right: var(--ddd-spacing-4);
          bottom: var(--ddd-spacing-4);
          --scroll-button-color: var(--on-night);
          --scroll-button-background-color: var(--night);
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
        }
        scroll-button[hidden] {
          display: none;
        }

        /* remix panel, opened from the header */
        .switcher {
          border-bottom: var(--ddd-border-size-md) solid var(--edge);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .switcher[hidden] {
          display: none;
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
          line-height: var(--ddd-lh-150);
          margin: var(--ddd-spacing-8) var(--ddd-spacing-0) var(--ddd-spacing-0);
        }
        .legal + .legal {
          margin-top: var(--ddd-spacing-1);
        }

        @media (max-width: 820px) {
          .hero .inner,
          .hero:not(.home) .inner {
            grid-template-columns: 1fr;
            gap: var(--ddd-spacing-6);
            padding-top: var(--ddd-spacing-8);
            padding-bottom: var(--ddd-spacing-8);
          }
          /* on a phone the burst sits behind the art only, clear of the buttons */
          .art {
            min-height: 0;
            width: min(100%, 340px);
            margin: var(--ddd-spacing-8) auto var(--ddd-spacing-0);
          }
          .burst {
            inset: -4% 14% 12% -2%;
          }
          .sticker {
            display: none;
          }
          header .cta {
            padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          }
          nav .sub {
            left: 0;
          }
        }
        @media (max-width: 520px) {
          .pager {
            grid-template-columns: 1fr;
          }
          .pager a.to-next {
            grid-column: 1;
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

  _toggleMenu(id) {
    this._menu = this._menu === id ? "" : id;
  }

  _menuKey(e) {
    if (e.key === "Escape" && this._menu) {
      const button = this.shadowRoot.querySelector(
        'nav .more[aria-expanded="true"]',
      );
      this._menu = "";
      if (button) {
        button.focus();
      }
    }
  }

  get _switcher() {
    return this.shadowRoot.querySelector("hax-style-switcher");
  }

  _remixRandom() {
    if (this._switcher) {
      this._switcher.random();
    }
  }

  _remixToggle() {
    this._remix = !this._remix;
    if (this._remix) {
      this.updateComplete.then(() => {
        const first = this._switcher
          ? this._switcher.shadowRoot.querySelector("select")
          : null;
        if (first) {
          first.focus();
        }
      });
    }
  }

  _children(item) {
    return this._all.filter((child) => child.parent === item.id);
  }

  _nav(items, active) {
    const chevron = html`<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>`;
    return items.map((item) => {
      const children = this._children(item);
      const within = active && active.parent === item.id;
      return html`
        <li
          class="${this._menu === item.id ? "open" : ""} ${
            within ? "within" : ""
          }"
        >
          <a
            href="${item.slug}"
            aria-current="${item.id === this.activeId ? "page" : "false"}"
            >${item.title}</a
          >
          ${
            children.length
              ? html`<button
                    type="button"
                    class="more"
                    aria-expanded="${this._menu === item.id ? "true" : "false"}"
                    aria-controls="sub-${item.id}"
                    aria-label="${this.t.pagesUnder.replace(
                      "{name}",
                      () => item.title,
                    )}"
                    @click="${() => this._toggleMenu(item.id)}"
                  >
                    ${chevron}
                  </button>
                  <ul class="sub" id="sub-${item.id}">
                    ${children.map(
                      (child) =>
                        html`<li>
                          <a
                            href="${child.slug}"
                            aria-current="${
                              child.id === this.activeId ? "page" : "false"
                            }"
                            >${child.title}</a
                          >
                        </li>`,
                    )}
                  </ul>`
              : ``
          }
        </li>
      `;
    });
  }

  /**
   * The band under the header that carries the page title. A theme that
   * extends this one can return its own band here.
   * @param {object} page home, isHome, start, v (theme variables), at, active, parent, stickers
   */
  renderHero({ isHome, start, v, at, parent, stickers }) {
    return html`
      <div class="hero ${isHome ? "home" : ""}">
        <div class="inner">
          <div>
            ${
              isHome && v.eyebrow
                ? html`<p class="eyebrow">${v.eyebrow}</p>`
                : ``
            }
            ${
              parent
                ? html`<p class="crumb">
                    <a href="${parent.slug}">${parent.title}</a> /
                  </p>`
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
                          effect="glitch"
                          name-href="#contentcontainer"
                          label="${this.t.anotherTheme}"
                          .items="${v.screens}"
                          @reel-name="${this._toContent}"
                        ></hax-reel>`
                      : ``
                  }
                </div>`
              : !isHome && stickers.length
                ? html`<hax-reel
                    class="sticker"
                    effect="glitch"
                    label="${this.t.anotherPicture}"
                    .items="${stickers}"
                    .index="${Math.max(at, 0) % stickers.length}"
                  ></hax-reel>`
                : ``
          }
        </div>
      </div>
    `;
  }

  /**
   * Nothing here. A theme that extends this one can return what it wants
   * drawn above the page content, inside the content column.
   * @param {object} page home, isHome, v (theme variables), active, parent
   */
  renderContentTop() {
    return html``;
  }

  render() {
    const home = this._items.length ? this._items[0] : null;
    const isHome = home && home.id === this.activeId;
    const start = this._all.find((item) => item.slug === "get-started");
    const v = this._vars || {};
    const at = this._all.findIndex((item) => item.id === this.activeId);
    const active = at > -1 ? this._all[at] : null;
    const parent =
      active && active.parent
        ? this._all.find((item) => item.id === active.parent)
        : null;
    const before = at > 0 ? this._all[at - 1] : null;
    const after =
      at > -1 && at < this._all.length - 1 ? this._all[at + 1] : null;
    const stickers = Array.isArray(v.stickers)
      ? v.stickers
      : v.sticker
        ? [{ src: v.sticker, alt: "" }]
        : [];
    const links = Array.isArray(v.footerLinks) ? v.footerLinks : [];
    const stories = Array.isArray(v.remixStories) ? v.remixStories : [];
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      ${
        v.network === "hax"
          ? html`<hax-network-bar
              current="${v.networkCurrent || "web"}"
            ></hax-network-bar>`
          : ``
      }
      <header>
        <div class="inner">
          <div class="brand">
            ${
              Array.isArray(v.logos) && v.logos.length
                ? html`<hax-reel
                    class="logo"
                    effect="glitch"
                    label="${this.t.changeLogo}"
                    .items="${v.logos}"
                  ></hax-reel>`
                : this._logo
                  ? html`<img src="${this._logo}" alt="" />`
                  : ``
            }
            <a href="${home ? home.slug : "./"}">${this._title}</a>
          </div>
          <nav aria-label="${this.t.site}" @keydown="${this._menuKey}">
            <ul>
              ${this._nav(this._items.slice(1), active)}
            </ul>
          </nav>
          <div class="tools">
            ${
              this._editor
                ? ``
                : html`<span class="remix">
                    <button
                      type="button"
                      aria-label="${this.t.remixRandom}"
                      @click="${this._remixRandom}"
                    >
                      <svg class="dice" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
                        <path
                          d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01"
                        />
                      </svg>
                      ${this.t.remix}
                    </button>
                    <button
                      type="button"
                      aria-expanded="${this._remix ? "true" : "false"}"
                      aria-controls="remix"
                      aria-label="${this.t.remixOptions}"
                      @click="${this._remixToggle}"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </span>`
            }
            ${
              home && v.cta
                ? html`<a class="cta" href="${home.slug}">${v.cta}</a>`
                : ``
            }
          </div>
        </div>
      </header>
      <div class="switcher" id="remix" ?hidden="${!this._remix}">
        <div class="inner">
          <hax-style-switcher heading="${this.t.switcherHeading}">
            ${stories.map(
              (story) =>
                html`<hax-story-link
                  compact
                  named
                  story="${story.story}"
                  about="${story.about}"
                ></hax-story-link> `,
            )}
          </hax-style-switcher>
        </div>
      </div>
      ${this.renderHero({ home, isHome, start, v, at, active, parent, stickers })}
      <main>
        <div class="inner">
          <site-region name="contentTop"></site-region>
          ${this.renderContentTop({ home, isHome, v, active, parent })}
          <article>
            <!-- required for HAX to edit the page: contentcontainer, slot, and the wrapped slot -->
            <div id="contentcontainer">
              <div id="slot"><slot></slot></div>
            </div>
          </article>
          ${
            before || after
              ? html`<div
                  class="pager"
                  role="navigation"
                  aria-label="${this.t.pages}"
                >
                  ${
                    before
                      ? html`<a class="to-prev" href="${before.slug}"
                          ><span class="way">← ${this.t.previous}</span
                          ><span class="where">${before.title}</span></a
                        >`
                      : ``
                  }
                  ${
                    after
                      ? html`<a class="to-next" href="${after.slug}"
                          ><span class="way">${this.t.next} →</span
                          ><span class="where">${after.title}</span></a
                        >`
                      : ``
                  }
                </div>`
              : ``
          }
        </div>
      </main>
      <scroll-button ?hidden="${!this._deep}"></scroll-button>
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
              .filter((item) => this._children(item).length)
              .map(
                (item) => html`
                  <div>
                    <h2>${item.title}</h2>
                    <ul>
                      ${this._children(item).map(
                        (child) =>
                          html`<li>
                            <a href="${child.slug}">${child.title}</a>
                          </li>`,
                      )}
                    </ul>
                  </div>
                `,
              )}
            ${
              links.length
                ? html`<div>
                    <h2>${this.t.footerLinks}</h2>
                    <ul>
                      ${links.map((link) =>
                        /^https?:\/\//.test(`${link.url}`)
                          ? html`<li>
                              <a href="${link.url}">${link.label}</a>
                            </li>`
                          : ``,
                      )}
                    </ul>
                  </div>`
                : ``
            }
          </div>
          ${v.copyright ? html`<p class="legal">${v.copyright}</p>` : ``}
          ${v.legal ? html`<p class="legal">${v.legal}</p>` : ``}
          <site-region name="footerPrimary"></site-region>
        </div>
      </footer>
    `;
  }
}
globalThis.customElements.define(HaxMarketingTheme.tag, HaxMarketingTheme);
export { HaxMarketingTheme };
