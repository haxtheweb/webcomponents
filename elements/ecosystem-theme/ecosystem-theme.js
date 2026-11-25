/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css, html } from "lit";
import { autorun, toJS } from "mobx";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { HaxUiAdminTokens } from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import "@haxtheweb/ecosystem-web/ecosystem-web.js";
import "@haxtheweb/hax-network-bar/hax-network-bar.js";
import {
  siteLens,
  toggleGoggles,
} from "@haxtheweb/haxcms-elements/lib/core/ui/haxcms-goggles-site.js";

/** True when the page address asks for the embed view (?embed, but not ?embed=0). */
function readEmbed() {
  try {
    const q = new URLSearchParams(globalThis.location.search);
    return q.has("embed") && q.get("embed") !== "0";
  } catch {
    return false;
  }
}

/**
 * Move to a page the way the site menu does: the HAXcms router
 * (history.pushState plus popstate, no reload) when the site has one, else a
 * normal load.
 */
function go(url) {
  let router = null;
  try {
    router = globalThis.HAXCMS.requestAvailability().storePieces.siteRouter;
  } catch {
    router = null;
  }
  if (router) {
    globalThis.history.pushState({}, "", url);
    globalThis.dispatchEvent(new PopStateEvent("popstate"));
  } else {
    globalThis.location.assign(url);
  }
}

/**
 * `ecosystem-theme`
 * The hax.cloud theme: the HAX ecosystem as a website. Every page is a web, a
 * tile or a tour from PRAW's ecosystem webs (its `metadata.ecosystem` says
 * which), and every page shows the interactive `<ecosystem-web>` routed to
 * it. Selecting a tile, opening a sub-web or picking a tour moves the site to
 * that page, so the address bar always holds a link to what is shown; the
 * selected tile's text is the web's details panel. A page that is not part
 * of a web (Tours, Recent) shows the whole web with its own content below.
 *
 * Above the web: the HAX network bar, then the breadcrumb, which the web on
 * the page reports (ecosystem-web-trail) and which starts at the home web.
 * The site's menu opens from the web's own menu button, at the page you are
 * on. Merlin, in the network bar, can jump to every web, tile and tour of the
 * site as well as across the network, and its developer list (">") holds
 * "Developer mode: goggles", which puts on the goggles with the Connect lens
 * (lib/ecosystem-connect.js).
 *
 * **Embed**: a page address ending in `?embed` (or the `embed` attribute)
 * draws the page for an iframe on another site: no network strip, no
 * breadcrumb or footer, only the page's title, a link that opens it on the
 * site itself, the web (when the page is part of one) and the page content.
 * Moving around the web inside the frame keeps the embed view.
 *
 * Site-wide settings come from `metadata.theme.variables` in site.json:
 * `ecosystemSrc` (the bundle URL, default `ecosystem-webs.json`), `footer`
 * (`[{label, href}]`, plus a `footerNote` line) and `welcome`
 * (`{title, text}`: the greeting on the home page).
 *
 * @title Ecosystem
 * @element ecosystem-theme
 * @haxcms-theme-category Website, Course, Organization
 * @haxcms-theme-layout Sidebar
 * @haxcms-theme-priority 5
 */
class EcosystemTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {
  static get tag() {
    return "ecosystem-theme";
  }

  constructor() {
    super();
    this.t = {
      skip: "Skip to content",
      whereYouAre: "Where you are",
      siteMenu: "Site menu",
      openOn: "Open on",
      theWeb: "The interactive web",
      welcome: "Welcome",
      merlinWebs: "hax.cloud: webs",
      merlinTours: "hax.cloud: tours",
      merlinPages: "hax.cloud",
      connect: "Connect",
      gogglesAbout:
        "Put on the goggles. On hax.cloud they add the Connect lens: say more about a tile and connect it, copied as a prompt for a pull request to PRAW",
    };
    this.embed = readEmbed();
    this._trail = null;
    this._items = [];
    this._active = null;
    this._vars = {};
    this._title = "";
    this._domain = "";
    this._disposers = [];
    this._onWebChanged = this._onWebChanged.bind(this);
    this._onMerlin = this._onMerlin.bind(this);
  }

  static get properties() {
    return {
      ...super.properties,
      /** draw the page for an iframe on another site: no site chrome (set by ?embed in the address) */
      embed: { type: Boolean, reflect: true },
      /** where the page sits, as the web on it reports (ecosystem-web-trail) */
      _trail: { type: Array, state: true },
      _items: { type: Array, state: true },
      _active: { type: Object, state: true },
      _vars: { type: Object, state: true },
      _title: { type: String, state: true },
      _domain: { type: String, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    // hax.cloud's own lens: Merlin's developer list and ?goggles=connect
    // links put the goggles on with it; the lens loads the first time
    siteLens({
      id: "connect",
      text: this.t.connect,
      icon: "icons:create",
      about: this.t.gogglesAbout,
      load: () => import("./lib/ecosystem-connect.js").then((m) => m.lens),
    });
    this._disposers.push(
      autorun(() => {
        const m = toJS(store.manifest);
        const items = m && m.items ? m.items : [];
        const meta = (m && m.metadata) || {};
        const theme = meta.theme || {};
        const site = meta.site || {};
        Promise.resolve().then(() => {
          this._items = items;
          this._vars = theme.variables || {};
          this._title = (m && m.title) || "";
          this._domain = String(site.domain || "").replace(/^https?:\/\//, "");
        });
      }),
      autorun(() => {
        const a = toJS(store.activeItem);
        Promise.resolve().then(() => {
          this._active = a || null;
        });
      }),
    );
  }

  disconnectedCallback() {
    this._disposers.forEach((d) => d());
    this._disposers = [];
    super.disconnectedCallback();
  }

  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
      `,
    ];
  }

  // ---------- page data ----------
  /** The web, tile and tour this page shows, or null when it is not part of a web. */
  _eco() {
    const a = this._active;
    const e = a && a.metadata && a.metadata.ecosystem;
    return e && e.web ? e : null;
  }
  _itemBySlug(slug) {
    return this._items.find((i) => i.slug === slug) || null;
  }
  _pageUrl() {
    const slug = this._active ? this._active.slug : "";
    return `${this._domain}/${slug}`;
  }

  // ---------- actions ----------
  /** Move to a page of this site, staying in the embed view when in it. */
  _go(slug) {
    const u = new URL(slug, globalThis.document.baseURI);
    if (this.embed) u.search = "?embed";
    go(u.href);
  }
  /** The web moved (a tile, sub-web or tour): follow it when it has a page. */
  _onWebChanged(e) {
    const d = e.detail || {};
    const slug = String(d.path || "").replace(/^\//, "");
    if (!slug || !this._active || slug === this._active.slug) return;
    if (!this._eco() && d.web === "main" && !d.node && !d.tour) return;
    const item = this._itemBySlug(slug);
    if (item) this._go(item.slug);
  }
  /**
   * Merlin opened from the network strip for the first time: every web, tour
   * and tile of the site becomes a place he can jump to.
   */
  _onMerlin(e) {
    const d = e.detail || {};
    const merlin = d.merlin;
    if (!merlin || typeof merlin.defineOption !== "function") return;
    const byId = new Map(this._items.map((i) => [i.id, i]));
    this._items.forEach((i) => {
      const eco = (i.metadata && i.metadata.ecosystem) || null;
      const parent = i.parent ? byId.get(i.parent) : null;
      let path = this.t.merlinPages;
      let icon = "hax:page-details";
      if (eco && eco.tour) {
        path = this.t.merlinTours;
        icon = "maps:directions-walk";
      } else if (eco && !eco.node) {
        path = this.t.merlinWebs;
        icon = "hax:site-map";
      } else if (eco && parent) {
        path = `${this.t.merlinPages}: ${parent.title}`;
        icon = "hax:blocks";
      }
      merlin.defineOption({
        title: i.title,
        description: i.description || "",
        icon,
        tags: ["hax.cloud"],
        path,
        context: "*",
        value: { target: this, method: "goTo", args: [i.slug] },
        eventName: "super-daemon-element-method",
      });
    });
  }
  /** Put the goggles on or take them off, with hax.cloud's Connect lens (as Merlin does). */
  goggles() {
    return toggleGoggles("connect");
  }

  /** Go to a page of this site by its slug. */
  goTo(slug) {
    const item = this._itemBySlug(slug);
    if (item) this._go(item.slug);
  }
  /** The home page's greeting, when the site sets one and this is the home page. */
  _welcome() {
    const w = this._vars.welcome;
    const home = this._items.find((i) => !i.parent);
    if (!w || !w.title || !home || !this._active) return null;
    return this._active.id === home.id ? w : null;
  }
  // ---------- styles ----------
  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      css`
        :host {
          display: block;
          color-scheme: light dark;
          --eco-bg: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --eco-fg: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --eco-heading: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --eco-eyebrow: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-pughBlue)
          );
          --eco-muted: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --eco-line: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --eco-band: light-dark(
            var(--ddd-theme-default-slateMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          --eco-panel: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          --eco-current: light-dark(
            var(--ddd-theme-default-skyMaxLight),
            var(--ddd-theme-default-beaverBlue)
          );
          --eco-link: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          --eco-wrap: 1440px;
          --eco-gutter: var(--ddd-spacing-8);
          background-color: var(--eco-bg);
          color: var(--eco-fg);
          font-family: var(--ddd-font-primary);
          min-height: 100vh;
        }
        :host([dark-mode]) {
          color-scheme: dark;
        }
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        a {
          color: var(--eco-link);
          font-weight: var(--ddd-font-weight-bold);
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        a:focus-visible,
        button:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .wrap {
          max-width: var(--eco-wrap);
          margin: 0 auto;
          box-sizing: border-box;
          padding-inline: var(--eco-gutter);
        }

        /* ---------- header ---------- */
        hax-network-bar {
          --hax-network-bar-max-width: var(--eco-wrap);
          --hax-network-bar-gutter: var(--eco-gutter);
        }
        /* ---------- the view bar ---------- */
        .viewbar {
          color-scheme: dark;
          position: relative;
          z-index: 1;
          background-color: var(--ddd-theme-default-potentialMidnight);
          color: var(--ddd-theme-default-white);
          border-bottom: var(--ddd-spacing-1) solid
            var(--ddd-theme-default-keystoneYellow);
          font-family: var(--ddd-font-navigation);
        }
        .viewbar .wrap {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
          min-height: 56px;
          padding-block: var(--ddd-spacing-2);
        }
        .vb-crumbs {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          flex: 1 1 280px;
          min-width: 0;
        }

        [hidden] {
          display: none !important;
        }
        /* the breadcrumb, following the web, on its own row of the bar */
        .viewbar .vb-crumbs {
          order: 10;
          flex: 1 1 100%;
        }
        .trail {
          min-width: 0;
          text-align: start;
          font-size: var(--ddd-font-size-3xs);
          line-height: var(--ddd-lh-120);
        }
        .trail ol {
          flex: 1 1 auto;
          min-width: 0;
          justify-content: flex-start;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-2);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .trail li {
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-width: 0;
        }
        .trail li + li::before {
          content: "/";
          color: var(--ddd-theme-default-limestoneLight);
        }
        .trail a {
          color: var(--ddd-theme-default-white);
          text-decoration: underline;
          text-underline-offset: 3px;
          padding-block: var(--ddd-spacing-1);
        }
        .trail a:hover,
        .trail a:focus-visible {
          color: var(--ddd-theme-default-keystoneYellow);
        }
        .trail [aria-current="page"] {
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-theme-default-white);
        }
        /* the site's menu, in the panel the web opens from its menu button */
        nav.sitemenu {
          font-size: var(--ddd-font-size-4xs);
          --site-menu-font-size: var(--ddd-font-size-4xs);
          --site-menu-container-background-color: transparent;
          --site-menu-background-color: transparent;
          --site-menu-color: var(--eco-fg);
          --site-menu-item-active-item-color: var(--eco-heading);
          --map-menu-item-a-color: var(--eco-fg);
          --map-menu-item-a-active-color: var(--eco-heading);
          --map-menu-item-a-active-background-color: var(--eco-current);
          --map-menu-item-border-radius: var(--ddd-radius-sm);
          --map-menu-container-background-color: transparent;
          --map-menu-header-button-padding: var(--ddd-spacing-2)
            var(--ddd-spacing-3) var(--ddd-spacing-2) var(--ddd-spacing-8);
        }
        @media (max-width: 1100px) {
          .vb-crumbs {
            order: 3;
            flex-basis: 100%;
          }
        }

        /* ---------- welcome ---------- */
        .welcome {
          background-color: var(--eco-band);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--eco-line);
        }
        .welcome .wrap {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-4) var(--ddd-spacing-10);
          padding-block: var(--ddd-spacing-8);
        }
        .welcome .words {
          flex: 1 1 520px;
          min-width: 0;
        }
        .welcome .kicker {
          margin: 0 0 var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--eco-eyebrow);
        }
        .welcome h1 {
          margin: 0 0 var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-l);
          line-height: 1.15;
          color: var(--eco-heading);
          text-wrap: balance;
        }
        .welcome p.text {
          margin: 0;
          max-width: 68ch;
          font-size: var(--ddd-font-size-xs);
          line-height: 1.5;
        }

        .btn {
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-theme-default-white);
          background-color: var(--ddd-theme-default-nittanyNavy);
          border: var(--ddd-border-size-sm) solid
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-pughBlue)
            );
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          min-height: var(--ddd-target-comfortable, 44px);
          cursor: pointer;
        }
        a.btn:hover {
          text-decoration: none;
        }

        /* ---------- embed view ---------- */
        :host([embed]) {
          min-height: 0;
        }
        .embedbar {
          background-color: var(--eco-band);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--eco-line);
        }
        .embedbar .wrap {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-6);
          padding-block: var(--ddd-spacing-2);
        }
        .embedbar h1 {
          margin: var(--ddd-spacing-0);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.2;
          color: var(--eco-heading);
          overflow-wrap: anywhere;
        }
        .embedbar a.btn {
          display: inline-flex;
          align-items: center;
          box-sizing: border-box;
          line-height: 1.2;
          text-decoration: none;
          color: var(--ddd-theme-default-white);
          background-color: var(--ddd-theme-default-nittanyNavy);
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-pughBlue)
          );
        }

        /* ---------- web view ---------- */
        .webview {
          max-width: var(--eco-wrap);
          margin: 0 auto;
        }
        .webview ecosystem-web {
          --ddd-theme-primary: var(--ddd-theme-default-nittanyNavy);
        }

        /* ---------- the page under the web ---------- */
        main {
          display: block;
          min-width: 0;
        }
        .content {
          max-width: var(--eco-wrap);
          margin: 0 auto;
          box-sizing: border-box;
          padding: var(--ddd-spacing-12) var(--eco-gutter) var(--ddd-spacing-8);
        }
        .eyebrow {
          margin: 0 0 var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--eco-eyebrow);
        }
        site-active-title {
          --site-active-title-color: var(--eco-heading);
          color: var(--eco-heading);
        }
        #slot {
          font-size: var(--ddd-font-size-xs);
          line-height: 1.5;
        }
        ::slotted(h2) {
          color: var(--eco-heading);
        }
        ::slotted(p[data-eyebrow]) {
          display: none;
        }
        :host([edit-mode]) ::slotted(p[data-eyebrow]) {
          display: block;
        }

        /* ---------- footer ---------- */
        footer {
          background-color: var(--ddd-theme-default-nittanyNavy);
          color: var(--ddd-theme-default-white);
          color-scheme: dark;
        }
        footer .wrap {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-3) var(--ddd-spacing-8);
          padding-block: var(--ddd-spacing-6);
          font-size: var(--ddd-font-size-4xs);
        }
        footer a {
          color: var(--ddd-theme-default-linkLight);
          font-weight: var(--ddd-font-weight-regular);
        }

        /* ---------- narrow screens ---------- */
        @media (max-width: 900px) {
          :host {
            --eco-gutter: var(--ddd-spacing-4);
          }
          .welcome .wrap {
            padding-block: var(--ddd-spacing-6);
          }
          .welcome h1 {
            font-size: var(--ddd-font-size-m);
          }
        }
        /* the narrowest phones: everything in the bar stays on one row */
        @media (max-width: 400px) {
          :host {
            --eco-gutter: var(--ddd-spacing-3);
          }
        }
      `,
    ];
  }

  // ---------- render ----------
  render() {
    const eco = this._eco();
    const at = eco || { web: "main", node: "", tour: "" };
    const src = this._vars.ecosystemSrc || "ecosystem-webs.json";
    const embed = this.embed;
    // an embedded page outside the webs is only its text
    const web = !(embed && !eco);
    const welcome = !embed ? this._welcome() : null;
    return html`
      <a
        class="skip-link"
        href="${web && !embed ? "#webview" : "#contentcontainer"}"
        >${this.t.skip}</a
      >
      ${embed ? this._renderEmbedBar() : this._renderTop()}
      ${
        welcome
          ? html`<section class="welcome" aria-labelledby="welcome">
              <div class="wrap">
                <div class="words">
                  <p class="kicker">${this.t.welcome}</p>
                  <h1 id="welcome">${welcome.title}</h1>
                  ${welcome.text ? html`<p class="text">${welcome.text}</p>` : ""}
                </div>
              </div>
            </section>`
          : ""
      }
      <main>
        ${
          web
            ? html`<section class="webview" aria-label="${this.t.theWeb}">
                ${
                  eco && !welcome && this._active
                    ? html`<h1 class="visually-hidden">
                        ${this._active.title}
                      </h1>`
                    : ""
                }
                <ecosystem-web
                  id="webview"
                  tabindex="-1"
                  site-nav
                  src="${src}"
                  web="${at.web}"
                  node="${at.node || ""}"
                  tour="${at.tour || ""}"
                  @ecosystem-web-changed="${this._onWebChanged}"
                  @ecosystem-web-trail="${this._onTrail}"
                >
                  <nav
                    slot="menu"
                    class="sitemenu"
                    aria-label="${this.t.siteMenu}"
                  >
                    <site-menu></site-menu>
                  </nav>
                </ecosystem-web>
              </section>`
            : ""
        }
        <div class="content" ?hidden="${!!eco && !embed}">
          ${
            eco || embed
              ? ""
              : html`${
                    this._eyebrow()
                      ? html`<p class="eyebrow">${this._eyebrow()}</p>`
                      : ""
                  }<site-active-title></site-active-title>`
          }
          <div id="contentcontainer">
            <div id="slot">
              <slot @slotchange="${() => this.requestUpdate()}"></slot>
            </div>
          </div>
        </div>
      </main>
      ${embed ? "" : this._renderFooter()}
    `;
  }
  /** The network bar, then the breadcrumb: everything above a page on the site itself. */
  _renderTop() {
    return html`
      <hax-network-bar
        current="cloud"
        @hax-network-merlin="${this._onMerlin}"
      ></hax-network-bar>
      <div class="viewbar">
        <div class="wrap">${this._renderTrail()}</div>
      </div>
    `;
  }
  /** The web on the page says where it is (ecosystem-web-trail). */
  _onTrail(e) {
    const d = e.detail || {};
    this._trail = Array.isArray(d.trail) ? d.trail : null;
  }
  /**
   * The breadcrumb: the webs above the page, its web, then its tile or tour,
   * as the web on the page reports them, so the breadcrumb and the web never
   * disagree. A page outside the webs (Tours, Magic script) gets its
   * breadcrumb from the site's outline. It is all the bar holds: it starts at
   * the home web, so it is also the way home.
   */
  _renderTrail() {
    const t = this._trail;
    const slug = this._active ? this._active.slug : "";
    const last = t && t.length ? t[t.length - 1] : null;
    if (!this._eco()) {
      return this._crumbList(this._outlineTrail());
    }
    if (!last || String(last.path || "").replace(/^\//, "") !== slug) {
      // the web has not said where it is yet
      return "";
    }
    return this._crumbList(t);
  }
  /**
   * A page outside the webs (Tours, Magic script, Recent): home, the pages
   * above it in the site, then the page.
   */
  _outlineTrail() {
    const home = this._items.find((i) => !i.parent);
    const a = this._active;
    if (!a) return [];
    const up = [];
    const byId = new Map(this._items.map((i) => [i.id, i]));
    let p = a.parent ? byId.get(a.parent) : null;
    while (p) {
      up.unshift(p);
      p = p.parent ? byId.get(p.parent) : null;
    }
    const chain = [home, ...up.filter((i) => i !== home), a].filter(
      (i, n, all) => i && all.indexOf(i) === n,
    );
    return chain.map((i) => ({ label: i.title, path: i.slug }));
  }
  _crumbList(t) {
    if (!t || !t.length) return "";
    return html`<nav class="vb-crumbs trail" aria-label="${this.t.whereYouAre}">
      <ol>
        ${t.map(
          (c, i) =>
            html`<li>
              ${
                i === t.length - 1
                  ? html`<span aria-current="page">${c.label}</span>`
                  : html`<a href="${String(c.path || "").replace(/^\//, "")}"
                      >${c.label}</a
                    >`
              }
            </li>`,
        )}
      </ol>
    </nav>`;
  }
  /** The embed view's only chrome: the page's title and a link that opens it on the site. */
  _renderEmbedBar() {
    const title = this._active ? this._active.title : this._title;
    return html`
      <div class="embedbar">
        <div class="wrap">
          <h1>${title}</h1>
          ${
            this._domain
              ? html`<a
                  class="btn"
                  href="https://${this._pageUrl()}"
                  target="_blank"
                  rel="noopener"
                  >${this.t.openOn} ${this._domain} ↗</a
                >`
              : ""
          }
        </div>
      </div>
    `;
  }
  _renderFooter() {
    const footer = Array.isArray(this._vars.footer) ? this._vars.footer : [];
    return html`
      <footer>
        <div class="wrap">
          ${
            this._vars.footerNote
              ? html`<span>${this._vars.footerNote}</span>`
              : ""
          }
          ${footer
            .filter((l) => l && /^https?:\/\//.test(l.href || ""))
            .map((l) => html`<a href="${l.href}">${l.label}</a>`)}
          <site-region name="footerPrimary"></site-region>
        </div>
      </footer>
    `;
  }
  /** The page's group, from its eyebrow paragraph (shown above the title of a page outside the webs). */
  _eyebrow() {
    const kids = this.children ? [...this.children] : [];
    const p = kids.find(
      (k) => k.tagName === "P" && k.hasAttribute("data-eyebrow"),
    );
    return p ? p.textContent.trim() : "";
  }
}

globalThis.customElements.define(EcosystemTheme.tag, EcosystemTheme);
export { EcosystemTheme };
