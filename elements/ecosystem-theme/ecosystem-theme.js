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
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import "@haxtheweb/ecosystem-web/ecosystem-web.js";
import "@haxtheweb/hax-network-bar/hax-network-bar.js";
import {
  haxNetworkGlyph,
  HaxNetworkGlyphStyles,
} from "@haxtheweb/hax-network-bar/lib/hax-network.js";

const VIEW_KEY = "hax-cloud-view";

/** Read a remembered view; storage can be missing or refuse (private windows). */
function readView() {
  try {
    const v = globalThis.localStorage.getItem(VIEW_KEY);
    return v === "web" || v === "site" ? v : "";
  } catch {
    return "";
  }
}
function writeView(v) {
  try {
    globalThis.localStorage.setItem(VIEW_KEY, v);
  } catch {
    // nothing to keep it in; the view still switches for this page
  }
}

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
 * which), and every page has two views:
 *
 * - **Network view** (`view="web"`): the interactive `<ecosystem-web>`
 *   routed to that page, and the page's own content below. Selecting a
 *   tile, opening a sub-web or picking a tour moves the site to that page,
 *   so the address bar always holds a link to what is shown.
 * - **Content view** (`view="site"`): a reading layout with the site
 *   outline, title, a "Where this sits in the web" figure and the page
 *   content.
 *
 * The viewer's choice is remembered on their device. Pages that are not part
 * of a web (people, recent activity) open in the Content view.
 *
 * **Embed**: a page address ending in `?embed` (or the `embed` attribute)
 * draws the page for an iframe on another site: no network strip, no row
 * under it, no outline or footer, only the page's title, a link that opens it
 * on the site itself, the web (when the page is part of one) and the page
 * content. Moving around the web inside the frame keeps the embed view.
 *
 * Site-wide settings come from `metadata.theme.variables` in site.json:
 * `ecosystemSrc` (the bundle URL, default `ecosystem-webs.json`), `nav`
 * (`[{label, slug}]`, default the top-level pages: the site's places, in the
 * menu on its name) and `footer` (`[{label, href}]`, plus a `footerNote` line) and `welcome`
 * (`{title, text, tour, tourLabel}`: the greeting on the home page, `tour`
 * being the slug of the tour its button starts).
 *
 * The header is the HAX network bar, then one row: the site's name, opening
 * a menu of its places; the breadcrumb; the two views, Network view and
 * Content view; and the link to this view, whose address is the Copy
 * button. HAXTheWeb, Build now and Web components are not repeated there:
 * the network bar has them. Merlin, in that bar, can jump to every web,
 * tile and tour of the site as well as across the network.
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
      home: "home",
      view: "View",
      networkView: "Network view",
      contentView: "Content view",
      networkViewAbout: "Every part of HAX as a web you can move through",
      contentViewAbout: "This page to read, with the site outline",
      places: "Places on this site",
      copyThis: "Copy the link to this view",
      copy: "Copy link",
      copied: "Copied",
      outline: "Site outline",
      whereInWeb: "Where this sits in the web",
      openInWeb: "Open in the web",
      openOn: "Open on",
      theWeb: "The interactive web",
      askMerlin: "Ask Future",
      takeTour: "Take the tour",
      welcome: "Welcome",
      merlinWebs: "hax.cloud: webs",
      merlinTours: "hax.cloud: tours",
      merlinPages: "hax.cloud",
    };
    this.view = "web";
    this.embed = readEmbed();
    this.placesOpen = false;
    this.outlineOpen = false;
    this._items = [];
    this._active = null;
    this._vars = {};
    this._title = "";
    this._domain = "";
    this._copied = false;
    this._chosen = readView();
    this._disposers = [];
    this._onWebChanged = this._onWebChanged.bind(this);
    this._onMerlin = this._onMerlin.bind(this);
    this._away = (e) => {
      if (this.placesOpen && !e.composedPath().includes(this)) {
        this.placesOpen = false;
      }
    };
  }

  static get properties() {
    return {
      ...super.properties,
      /** "web" or "site": the interactive web or the reading layout */
      view: { type: String, reflect: true },
      /** draw the page for an iframe on another site: no site chrome (set by ?embed in the address) */
      embed: { type: Boolean, reflect: true },
      /** the menu of the site's places, on its name */
      placesOpen: { type: Boolean, reflect: true, attribute: "places-open" },
      /** the site outline on narrow screens, where it folds behind its heading */
      outlineOpen: { type: Boolean, reflect: true, attribute: "outline-open" },
      _items: { type: Array, state: true },
      _active: { type: Object, state: true },
      _vars: { type: Object, state: true },
      _title: { type: String, state: true },
      _domain: { type: String, state: true },
      _copied: { type: Boolean, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("click", this._away);
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
          const moved = !!(this._active && a && this._active.id !== a.id);
          this._active = a || null;
          this._copied = false;
          this.placesOpen = false;
          this.outlineOpen = false;
          // an embed always shows the web: the viewer's remembered choice is for the site itself
          this.view = this._eco()
            ? (!this.embed && this._chosen) || "web"
            : "site";
          if (moved) this._showPage();
        });
      }),
    );
  }

  /**
   * On a narrow screen the outline sits above the page: after choosing a
   * page from it, the outline folds and the page's title is brought into
   * view, so the reader lands on what they picked instead of the menu.
   */
  async _showPage() {
    const narrow =
      globalThis.matchMedia &&
      globalThis.matchMedia("(max-width: 900px)").matches;
    if (!narrow || this.embed) return;
    await this.updateComplete;
    if (this.view !== "site") return;
    // after the base theme's own scroll to the top of the new page
    globalThis.requestAnimationFrame(() => {
      const main = this.shadowRoot && this.shadowRoot.querySelector("main");
      if (main) main.scrollIntoView({ block: "start", behavior: "auto" });
    });
  }

  disconnectedCallback() {
    globalThis.removeEventListener("click", this._away);
    this._disposers.forEach((d) => d());
    this._disposers = [];
    clearTimeout(this._copyTimer);
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
  /** The top-level page the active page sits under, for the main nav. */
  _topId() {
    const byId = new Map(this._items.map((i) => [i.id, i]));
    let i = this._active ? byId.get(this._active.id) : null;
    while (i && i.parent && byId.has(i.parent)) i = byId.get(i.parent);
    return i ? i.id : "";
  }
  /** The outline's heading: the section the page is in (the site title on a top-level page). */
  _topTitle(id) {
    const i = this._items.find((x) => x.id === id);
    return i ? i.title : this._title;
  }
  _nav() {
    const v = this._vars.nav;
    if (Array.isArray(v) && v.length)
      return v
        .map((n) => ({ label: n.label, item: this._itemBySlug(n.slug) }))
        .filter((n) => n.item);
    return this._items
      .filter((i) => !i.parent)
      .map((i) => ({ label: i.title, item: i }));
  }
  _href(item) {
    return item ? item.slug : "";
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
  _setView(v) {
    if (v === "web" && !this._eco()) {
      // a page outside the webs has nothing to draw: the home web opens
      const home = this._items.find((i) => !i.parent);
      this._chosen = "web";
      writeView("web");
      if (home) this._go(home.slug);
      return;
    }
    this._chosen = v;
    writeView(v);
    this.view = v;
  }
  /** The web moved (a tile, sub-web or tour): follow it when it has a page. */
  _onWebChanged(e) {
    const d = e.detail || {};
    const slug = String(d.path || "").replace(/^\//, "");
    if (!slug || !this._active || slug === this._active.slug) return;
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
  _askMerlin() {
    const bar = this.shadowRoot.querySelector("hax-network-bar");
    if (bar && typeof bar.openMerlin === "function") bar.openMerlin();
  }
  _copy() {
    const url = `https://${this._pageUrl()}`;
    const done = () => {
      this._copied = true;
      clearTimeout(this._copyTimer);
      this._copyTimer = setTimeout(() => {
        this._copied = false;
      }, 2000);
    };
    const select = () => {
      const code = this.shadowRoot.querySelector(".copylink code");
      const sel = globalThis.getSelection && globalThis.getSelection();
      if (code && sel) {
        const r = globalThis.document.createRange();
        r.selectNodeContents(code);
        sel.removeAllRanges();
        sel.addRange(r);
      }
    };
    if (globalThis.navigator.clipboard) {
      globalThis.navigator.clipboard.writeText(url).then(done, select);
    } else {
      select();
    }
  }

  // ---------- styles ----------
  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      HaxNetworkGlyphStyles,
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
          --site-breadcrumb-margin: 0;
          --site-breadcrumb-last-color: var(--ddd-theme-default-white);
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
        .vb-crumbs site-breadcrumb {
          min-width: 0;
          flex: 1 1 auto;
        }

        /* hax.cloud: the site's name in slab type, opening its places */
        .places {
          position: relative;
          flex: none;
        }
        .places-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: 40px;
          padding: 0 var(--ddd-spacing-2) 0 var(--ddd-spacing-1);
          border: var(--ddd-border-size-sm) solid
            var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-sm);
          background-color: transparent;
          color: var(--ddd-theme-default-white);
          font-family: var(--ddd-font-secondary, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          cursor: pointer;
          --prop: var(--ddd-theme-default-original87Pink);
          --glyph-size: 26px;
        }
        .places-btn:hover,
        .places-btn[aria-expanded="true"] {
          border-color: var(--ddd-theme-default-white);
        }
        .places-btn:focus-visible {
          outline: var(--ddd-border-size-md) solid
            var(--ddd-theme-default-keystoneYellow);
          outline-offset: 2px;
        }
        .places-btn:active {
          transform: translateY(1px);
        }
        .places-btn svg {
          width: 20px;
          height: 20px;
          transition: transform 0.15s;
        }
        :host([places-open]) .places-btn svg {
          transform: rotate(180deg);
        }
        .places-menu {
          display: none;
          position: absolute;
          top: calc(100% + var(--ddd-spacing-2));
          left: 0;
          min-width: 240px;
          margin: 0;
          padding: var(--ddd-spacing-2);
          list-style: none;
          background-color: var(--ddd-theme-default-potentialMidnight);
          border: var(--ddd-border-size-md) solid var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-spacing-1) var(--ddd-spacing-1) 0
            var(--ddd-theme-default-keystoneYellow);
        }
        :host([places-open]) .places-menu {
          display: block;
        }
        .places-menu a {
          display: block;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-xs);
          color: var(--ddd-theme-default-white);
          font-size: var(--ddd-font-size-4xs);
          text-decoration: none;
        }
        .places-menu a:hover,
        .places-menu a:focus-visible {
          background-color: var(--ddd-theme-default-white);
          color: var(--ddd-theme-default-potentialMidnight);
          outline: none;
        }
        .places-menu a[aria-current="page"] {
          font-weight: var(--ddd-font-weight-bold);
          box-shadow: inset var(--ddd-spacing-1) 0 0
            var(--ddd-theme-default-keystoneYellow);
        }

        /* the two views: a sticker switch, the view you are in filled */
        .views {
          display: inline-flex;
          flex: none;
          padding: 3px;
          gap: 3px;
          border: var(--ddd-border-size-md) solid var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-rounded, 999px);
          box-shadow: var(--ddd-spacing-1) var(--ddd-spacing-1) 0
            var(--ddd-theme-default-keystoneYellow);
        }
        .views button {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-control-height-sm, 40px);
          padding: 0 var(--ddd-spacing-4) 0 var(--ddd-spacing-3);
          border: var(--ddd-border-size-sm) solid
            var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-rounded, 999px);
          background-color: transparent;
          color: var(--ddd-theme-default-white);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          white-space: nowrap;
          cursor: pointer;
        }
        .views button svg {
          width: 20px;
          height: 20px;
          flex: none;
        }
        .views button:hover {
          border-color: var(--ddd-theme-default-white);
        }
        .views button:focus-visible {
          outline: var(--ddd-border-size-md) solid
            var(--ddd-theme-default-keystoneYellow);
          outline-offset: 2px;
        }
        .views button:active {
          transform: translateY(1px);
        }
        .views button[aria-pressed="true"] {
          background-color: var(--ddd-theme-default-keystoneYellow);
          color: var(--ddd-theme-default-potentialMidnight);
          border-color: var(--ddd-theme-default-potentialMidnight);
        }

        /* the link to this view: the address is the button */
        .copylink {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          flex: 0 1 auto;
          min-width: 0;
          min-height: 40px;
          padding: 0 var(--ddd-spacing-3);
          border: var(--ddd-border-size-md) solid var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-theme-default-white);
          color: var(--ddd-theme-default-potentialMidnight);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          box-shadow: var(--ddd-spacing-1) var(--ddd-spacing-1) 0
            var(--ddd-theme-default-keystoneYellow);
          cursor: pointer;
          transition:
            transform 0.12s,
            box-shadow 0.12s;
        }
        .copylink:hover {
          transform: translate(-1px, -1px);
          box-shadow: calc(var(--ddd-spacing-1) * 1.5)
            calc(var(--ddd-spacing-1) * 1.5) 0
            var(--ddd-theme-default-keystoneYellow);
        }
        .copylink:active {
          transform: translate(2px, 2px);
          box-shadow: none;
        }
        .copylink:focus-visible {
          outline: var(--ddd-border-size-md) solid
            var(--ddd-theme-default-keystoneYellow);
          outline-offset: 3px;
        }
        .copylink code {
          all: unset;
          font-family: var(--ddd-font-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }
        .copylink .what {
          font-weight: var(--ddd-font-weight-bold);
          font-family: var(--ddd-font-navigation);
          white-space: nowrap;
        }
        .copylink svg {
          flex: none;
          width: 18px;
          height: 18px;
        }
        @media (prefers-reduced-motion: reduce) {
          .copylink,
          .copylink:hover,
          .copylink:active,
          .views button:active,
          .places-btn:active {
            transform: none;
            transition: none;
          }
        }
        @media (max-width: 1100px) {
          .vb-crumbs {
            order: 3;
            flex-basis: 100%;
          }
        }
        @media (max-width: 640px) {
          .views .long,
          .copylink code,
          .copylink .what {
            display: none;
          }
          .views button {
            padding: 0 var(--ddd-spacing-3);
          }
          .viewbar .wrap {
            gap: var(--ddd-spacing-2);
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
        .welcome .go {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-3);
        }
        .welcome .btn {
          display: inline-flex;
          align-items: center;
          box-sizing: border-box;
          min-height: var(--ddd-target-comfortable, 44px);
          line-height: 1.2;
        }
        .welcome a.btn:not(.ghost) {
          color: var(--ddd-theme-default-white);
          background-color: var(--ddd-theme-default-nittanyNavy);
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-pughBlue)
          );
        }
        .btn.ghost {
          color: var(--eco-heading);
          background-color: transparent;
          border-color: var(--eco-heading);
        }
        .btn.ghost:hover {
          background-color: var(--eco-current);
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

        /* ---------- site view ---------- */
        .body {
          display: flex;
          flex-wrap: wrap;
          gap: 0 var(--ddd-spacing-12);
        }
        nav.outline {
          flex: 1 1 280px;
          max-width: 320px;
          box-sizing: border-box;
          padding-block: var(--ddd-spacing-8);
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
          /* a row with children starts its title past the expand chevron
             and the progress ring map-menu draws around it on the page you
             are on (28px from the row start), so the two never touch */
          --map-menu-header-button-padding: var(--ddd-spacing-2)
            var(--ddd-spacing-3) var(--ddd-spacing-2) var(--ddd-spacing-8);
        }
        .ol-toggle {
          display: none;
        }
        .ol-head {
          margin: 0 0 var(--ddd-spacing-3);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--eco-muted);
        }
        main {
          flex: 999 1 640px;
          min-width: 0;
          box-sizing: border-box;
        }
        :host([view="site"]) main {
          max-width: 880px;
          padding-block: var(--ddd-spacing-8) var(--ddd-spacing-16);
        }
        :host([view="web"]) .content {
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
        figure.where {
          margin: var(--ddd-spacing-6) 0 var(--ddd-spacing-8);
          border: var(--ddd-border-xs);
          border-color: var(--eco-line);
          border-radius: var(--ddd-radius-md);
          overflow: hidden;
        }
        figure.where figcaption {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          background-color: var(--eco-panel);
          font-size: var(--ddd-font-size-4xs);
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
          nav.outline {
            max-width: none;
            flex-basis: 100%;
            padding-block: var(--ddd-spacing-4) 0;
          }
          /* the outline folds behind a button with its heading, and closes
             when a page is chosen (_showPage) */
          nav.outline .ol-head,
          nav.outline .ol-menu {
            display: none;
          }
          :host([outline-open]) nav.outline .ol-menu {
            display: block;
            padding-top: var(--ddd-spacing-2);
          }
          .ol-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--ddd-spacing-2);
            width: 100%;
            min-height: var(--ddd-target-comfortable, 44px);
            box-sizing: border-box;
            margin: 0;
            padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
            border: var(--ddd-border-xs);
            border-color: var(--eco-line);
            border-radius: var(--ddd-radius-sm);
            background-color: var(--eco-panel);
            color: var(--eco-heading);
            font-family: var(--ddd-font-navigation);
            font-size: var(--ddd-font-size-4xs);
            font-weight: var(--ddd-font-weight-bold);
            letter-spacing: 0.12em;
            text-transform: uppercase;
            text-align: start;
            cursor: pointer;
          }
          .ol-toggle:hover {
            background-color: var(--eco-current);
          }
          .ol-toggle svg {
            flex: none;
            width: 20px;
            height: 20px;
            transition: transform 0.2s ease;
          }
          :host([outline-open]) .ol-toggle svg {
            transform: rotate(180deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ol-toggle svg {
            transition: none;
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
    const web = this.view === "web" && !!eco;
    const top = this._topId();
    const src = this._vars.ecosystemSrc || "ecosystem-webs.json";
    const embed = this.embed;
    const welcome = web && !embed ? this._welcome() : null;
    const tour =
      welcome && welcome.tour ? this._itemBySlug(welcome.tour) : null;
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skip}</a>
      ${embed ? this._renderEmbedBar() : this._renderTop(web, top)}
      ${
        welcome
          ? html`<section class="welcome" aria-labelledby="welcome">
              <div class="wrap">
                <div class="words">
                  <p class="kicker">${this.t.welcome}</p>
                  <h1 id="welcome">${welcome.title}</h1>
                  ${welcome.text ? html`<p class="text">${welcome.text}</p>` : ""}
                </div>
                <div class="go">
                  ${
                    tour
                      ? html`<a class="btn" href="${tour.slug}"
                          >${welcome.tourLabel || this.t.takeTour}</a
                        >`
                      : ""
                  }
                  <button
                    class="btn ghost"
                    type="button"
                    @click="${this._askMerlin}"
                  >
                    ${this.t.askMerlin}
                  </button>
                </div>
              </div>
            </section>`
          : ""
      }
      <div class="${web ? "" : "wrap"}">
        <div class="body">
          ${
            web || embed
              ? ""
              : html`<nav class="outline" aria-label="${this.t.outline}">
                  <p class="ol-head">${this._topTitle(top)}</p>
                  <button
                    class="ol-toggle"
                    type="button"
                    aria-expanded="${this.outlineOpen ? "true" : "false"}"
                    aria-controls="outline-menu"
                    @click="${() => {
                      this.outlineOpen = !this.outlineOpen;
                    }}"
                  >
                    <span>${this._topTitle(top)}</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </button>
                  <div id="outline-menu" class="ol-menu">
                    <site-menu></site-menu>
                  </div>
                </nav>`
          }
          <main>
            ${
              web
                ? html`<section class="webview" aria-label="${this.t.theWeb}">
                    <ecosystem-web
                      src="${src}"
                      web="${eco.web}"
                      node="${eco.node || ""}"
                      tour="${eco.tour || ""}"
                      @ecosystem-web-changed="${this._onWebChanged}"
                    ></ecosystem-web>
                  </section>`
                : ""
            }
            <div class="content">
              ${
                web || embed
                  ? ""
                  : html`${
                        this._eyebrow()
                          ? html`<p class="eyebrow">${this._eyebrow()}</p>`
                          : ""
                      }<site-active-title></site-active-title>`
              }
              ${
                !web && !embed && eco && (eco.node || eco.web !== "main")
                  ? html`<figure class="where">
                      <ecosystem-web
                        compact
                        src="${src}"
                        web="${eco.web}"
                        node="${eco.node || ""}"
                        @ecosystem-web-changed="${this._onWebChanged}"
                      ></ecosystem-web>
                      <figcaption>
                        <span>${this.t.whereInWeb}</span>
                        <button
                          class="btn"
                          type="button"
                          @click="${() => this._setView("web")}"
                        >
                          ${this.t.openInWeb}
                        </button>
                      </figcaption>
                    </figure>`
                  : ""
              }
              <div id="contentcontainer">
                <div id="slot">
                  <slot @slotchange="${() => this.requestUpdate()}"></slot>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      ${embed ? "" : this._renderFooter()}
    `;
  }
  /**
   * The network bar, then one row: the site's name opening its places, the
   * breadcrumb, the two views and the link to this view. Everything above a
   * page on the site itself.
   */
  _renderTop(web, top) {
    return html`
      <hax-network-bar
        current="cloud"
        @hax-network-merlin="${this._onMerlin}"
      ></hax-network-bar>
      <div class="viewbar">
        <div class="wrap">
          <div class="places">
            <button
              class="places-btn glyph-host"
              type="button"
              aria-expanded="${this.placesOpen ? "true" : "false"}"
              aria-controls="places"
              aria-label="${this._title} (${this.t.places})"
              @click="${this._togglePlaces}"
              @keydown="${this._placesKey}"
            >
              ${haxNetworkGlyph("cloud")}<span>${this._title}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </button>
            <ul
              class="places-menu"
              id="places"
              aria-label="${this.t.places}"
              @keydown="${this._placesKey}"
            >
              ${this._nav().map(
                (n) =>
                  html`<li>
                    <a
                      href="${this._href(n.item)}"
                      aria-current="${n.item.id === top ? "page" : "false"}"
                      >${n.label}</a
                    >
                  </li>`,
              )}
            </ul>
          </div>
          <div class="vb-crumbs">
            <site-breadcrumb></site-breadcrumb>
          </div>
          <div class="views" role="group" aria-label="${this.t.view}">
            <button
              type="button"
              aria-pressed="${web ? "true" : "false"}"
              aria-label="${this.t.networkView}"
              title="${this.t.networkViewAbout}"
              @click="${() => this._setView("web")}"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="5" r="2.5"></circle>
                <circle cx="5" cy="19" r="2.5"></circle>
                <circle cx="19" cy="19" r="2.5"></circle>
                <path d="M12 7.5v4M12 11.5l-5.5 5.5M12 11.5l5.5 5.5"></path>
              </svg>
              <span class="long">${this.t.networkView}</span>
            </button>
            <button
              type="button"
              aria-pressed="${web ? "false" : "true"}"
              aria-label="${this.t.contentView}"
              title="${this.t.contentViewAbout}"
              @click="${() => this._setView("site")}"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14 3H6v18h12V7z"></path>
                <path d="M14 3v4h4M9 12h6M9 16h6"></path>
              </svg>
              <span class="long">${this.t.contentView}</span>
            </button>
          </div>
          <button
            class="copylink"
            type="button"
            aria-label="${this._pageUrl()} ${this._copied ? this.t.copied : this.t.copy}"
            title="${this.t.copyThis}"
            @click="${this._copy}"
          >
            ${
              this._copied
                ? html`<svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12l5 5L19 7"></path>
                  </svg>`
                : html`<svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"
                    ></path>
                    <path
                      d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"
                    ></path>
                  </svg>`
            }
            <code>${this._pageUrl()}</code>
            <span class="what"
              >${this._copied ? this.t.copied : this.t.copy}</span
            >
          </button>
          <span class="visually-hidden" role="status"
            >${this._copied ? this.t.copied : ""}</span
          >
        </div>
      </div>
    `;
  }
  _togglePlaces(e) {
    e.stopPropagation();
    this.placesOpen = !this.placesOpen;
    if (this.placesOpen) {
      this.updateComplete.then(() => {
        const first = this.shadowRoot.querySelector(".places-menu a");
        if (first) first.focus();
      });
    }
  }
  /** Escape closes the places menu; the arrow keys move through it */
  _placesKey(e) {
    if (e.key === "Escape" && this.placesOpen) {
      this.placesOpen = false;
      const b = this.shadowRoot.querySelector(".places-btn");
      if (b) b.focus();
      return;
    }
    if (!this.placesOpen || (e.key !== "ArrowDown" && e.key !== "ArrowUp"))
      return;
    const links = [...this.shadowRoot.querySelectorAll(".places-menu a")];
    const at = links.indexOf(this.shadowRoot.activeElement);
    const next =
      e.key === "ArrowDown"
        ? (at + 1) % links.length
        : (at - 1 + links.length) % links.length;
    if (links[next]) {
      e.preventDefault();
      links[next].focus();
    }
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
  /** The page's group, from its eyebrow paragraph (shown above the title in the Content view). */
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
