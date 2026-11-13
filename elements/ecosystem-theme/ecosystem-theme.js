/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css, html } from "lit";
import { autorun, toJS } from "mobx";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  HaxUiAdminTokens,
  HaxUiDarkChromeDeclarations,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import "@haxtheweb/ecosystem-web/ecosystem-web.js";
import "@haxtheweb/hax-network-bar/hax-network-bar.js";

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
 * - **Web**: the interactive `<ecosystem-web>` routed to that page, with a
 *   link bar to copy the page's address, and the page's own content below.
 *   Selecting a tile, opening a sub-web or picking a tour moves the site to
 *   that page, so the address bar always holds a link to what is shown.
 * - **Site**: a reading layout with the site outline, breadcrumb, title, a
 *   "Where this sits in the web" figure and the page content.
 *
 * The viewer's choice is remembered on their device. Pages that are not part
 * of a web (people, recent activity) open in the Site view.
 *
 * Site-wide settings come from `metadata.theme.variables` in site.json:
 * `ecosystemSrc` (the bundle URL, default `ecosystem-webs.json`), `nav`
 * (`[{label, slug}]`, default the top-level pages), `links`
 * (`[{label, href, kind}]` where kind is `docs`, `portfolio` or `demo`) and
 * `footer` (`[{label, href}]`, plus a `footerNote` line) and `welcome`
 * (`{title, text, tour, tourLabel}`: the greeting on the home page, `tour`
 * being the slug of the tour its button starts).
 *
 * The header is the HAX top bar as the HAX editor draws it (the dark HAX UI
 * chrome, the Future Traveler in its right-hand corner), under the HAX
 * network strip. Merlin, in that strip, can jump to every web, tile and tour
 * of the site as well as across the network.
 *
 * @title Ecosystem
 * @element ecosystem-theme
 * @haxcms-theme-category Website, Course
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
      main: "Main",
      menu: "Menu",
      view: "View",
      web: "Web",
      site: "Site",
      linkToView: "Link to this view",
      copy: "Copy link",
      copied: "Copied",
      outline: "Site outline",
      whereInWeb: "Where this sits in the web",
      openInWeb: "Open in the web",
      theWeb: "The interactive web",
      askMerlin: "Ask Merlin",
      takeTour: "Take the tour",
      welcome: "Welcome",
      merlinWebs: "hax.cloud: webs",
      merlinTours: "hax.cloud: tours",
      merlinPages: "hax.cloud",
    };
    this.view = "web";
    this.menuOpen = false;
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
  }

  static get properties() {
    return {
      ...super.properties,
      /** "web" or "site": the interactive web or the reading layout */
      view: { type: String, reflect: true },
      /** the header menu on narrow screens */
      menuOpen: { type: Boolean, reflect: true, attribute: "menu-open" },
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
          this._copied = false;
          this.menuOpen = false;
          this.view = this._eco() ? this._chosen || "web" : "site";
        });
      }),
    );
  }

  disconnectedCallback() {
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
  _links(kind) {
    const v = this._vars.links;
    return (Array.isArray(v) ? v : []).filter(
      (l) => l && l.kind === kind && /^https?:\/\//.test(l.href || ""),
    );
  }
  _href(item) {
    return item ? item.slug : "";
  }
  _pageUrl() {
    const slug = this._active ? this._active.slug : "";
    return `${this._domain}/${slug}`;
  }

  // ---------- actions ----------
  _setView(v) {
    if (v === "web" && !this._eco()) {
      // a page outside the webs has nothing to draw: the home web opens
      const home = this._items.find((i) => !i.parent);
      this._chosen = "web";
      writeView("web");
      if (home) go(new URL(home.slug, globalThis.document.baseURI).href);
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
    if (item) go(new URL(item.slug, globalThis.document.baseURI).href);
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
    if (item) go(new URL(item.slug, globalThis.document.baseURI).href);
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
      const code = this.shadowRoot.querySelector(".linkbar code");
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
        /* the HAX top bar, as the HAX editor draws it: the dark HAX UI
           chrome in both schemes, 64px, a hairline under it; the Future
           Traveler's corner is the network bar's, above it */
        header.top {
          ${HaxUiDarkChromeDeclarations}
          background-color: var(--ddd-theme-default-coalyGray);
          color: var(--hax-ui-on-titlebar);
          font-family: var(--hax-ui-admin-font-family);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        header.top .wrap {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 0 var(--ddd-spacing-6);
          min-height: 64px;
          padding-inline-end: var(--ddd-spacing-3);
        }
        .brand {
          color: var(--hax-ui-on-titlebar);
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-xs);
          white-space: nowrap;
        }
        .brand:hover {
          text-decoration: none;
        }
        .navs {
          display: contents;
        }
        .brand {
          grid-column: 1;
          grid-row: 1;
        }
        nav.main {
          grid-column: 2;
          grid-row: 1;
        }
        .toggle {
          grid-column: 3;
          grid-row: 1;
        }
        .acts {
          grid-column: 4;
          grid-row: 1;
        }
        .end {
          grid-column: 5;
          grid-row: 1;
        }
        nav.main {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-6);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          min-width: 0;
        }
        nav.main a {
          color: var(--hax-ui-on-titlebar);
          font-weight: var(--ddd-font-weight-regular);
          padding-block: var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-size-md) solid transparent;
        }
        nav.main a:hover {
          text-decoration: none;
          border-bottom-color: var(--ddd-theme-default-pughBlue);
        }
        nav.main a[aria-current="page"] {
          font-weight: var(--ddd-font-weight-bold);
          border-bottom-color: var(--ddd-theme-default-keystoneYellow);
        }
        nav.main a.out {
          color: var(--ddd-theme-default-linkLight);
        }
        .acts {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: var(--ddd-spacing-3);
        }
        .pill {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-rounded);
          line-height: 1.5;
          white-space: nowrap;
        }
        .pill:hover {
          text-decoration: none;
        }
        .pill.portfolio {
          color: var(--hax-ui-on-titlebar);
          border: var(--ddd-border-size-sm) solid var(--hax-ui-line);
        }
        .pill.portfolio:hover {
          background-color: var(--hax-ui-hover);
        }
        .pill.demo {
          color: var(--ddd-theme-default-coalyGray);
          background-color: var(--ddd-theme-default-keystoneYellow);
          border: var(--ddd-border-size-sm) solid
            var(--ddd-theme-default-keystoneYellow);
        }
        /* Web or Site, in the middle like the editor's main action */
        .toggle {
          display: inline-flex;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--ddd-radius-rounded);
          background-color: #111;
        }
        .toggle button {
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-5);
          min-height: 40px;
          border: 0;
          background: transparent;
          color: var(--hax-ui-on-titlebar);
          cursor: pointer;
        }
        .toggle button:hover {
          background-color: var(--hax-ui-hover);
        }
        .toggle button:first-child {
          border-start-start-radius: var(--ddd-radius-rounded);
          border-end-start-radius: var(--ddd-radius-rounded);
        }
        .toggle button:last-child {
          border-start-end-radius: var(--ddd-radius-rounded);
          border-end-end-radius: var(--ddd-radius-rounded);
        }
        .toggle button[aria-pressed="true"] {
          background-color: var(--ddd-theme-default-white);
          color: var(--ddd-theme-default-coalyGray);
          font-weight: var(--ddd-font-weight-bold);
        }
        /* the ring sits outside the button, on the bar, so it keeps its
           contrast on the white pressed half too */
        .toggle button:focus-visible {
          position: relative;
          z-index: 1;
          outline-offset: 2px;
        }
        header.top a:focus-visible,
        header.top button:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
        }
        .end {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .menu-btn {
          display: none;
          width: 44px;
          height: 44px;
          border: 0;
          border-radius: var(--ddd-radius-sm);
          background-color: transparent;
          color: var(--hax-ui-on-titlebar);
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .menu-btn:hover {
          background-color: var(--hax-ui-hover);
        }
        .menu-btn svg {
          width: 22px;
          height: 22px;
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
          min-height: 44px;
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

        /* ---------- link bar ---------- */
        .linkbar {
          background-color: var(--eco-band);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--eco-line);
        }
        .linkbar .wrap {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-3) var(--ddd-spacing-6);
          padding-block: var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
        }
        .linkbar site-breadcrumb {
          flex: 1 1 320px;
          min-width: 0;
        }
        .linkbar .lbl {
          color: var(--eco-muted);
        }
        code.url {
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          background-color: var(--eco-bg);
          border: var(--ddd-border-xs);
          border-color: var(--eco-line);
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          overflow-wrap: anywhere;
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
          min-height: 44px;
          cursor: pointer;
        }
        a.btn:hover {
          text-decoration: none;
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
        main site-breadcrumb {
          display: block;
          margin-bottom: var(--ddd-spacing-6);
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
          header.top .wrap {
            grid-template-columns: minmax(0, 1fr) auto auto;
            gap: 0 var(--ddd-spacing-2);
          }
          .toggle {
            grid-column: 2;
          }
          .end {
            grid-column: 3;
          }
          nav.main,
          .acts {
            grid-column: auto;
            grid-row: auto;
          }
          .brand {
            font-size: var(--ddd-font-size-3xs);
            white-space: normal;
          }
          .menu-btn {
            display: inline-flex;
          }
          .toggle button {
            padding-inline: var(--ddd-spacing-3);
          }
          .navs {
            display: none;
            grid-column: 1 / -1;
            grid-row: 2;
            flex-direction: column;
            align-items: flex-start;
            gap: var(--ddd-spacing-3);
            padding-bottom: var(--ddd-spacing-4);
          }
          :host([menu-open]) .navs {
            display: flex;
          }
          nav.main {
            flex-direction: column;
            align-items: flex-start;
          }
          .acts {
            justify-content: flex-start;
          }
          .welcome .wrap {
            padding-block: var(--ddd-spacing-6);
          }
          .welcome h1 {
            font-size: var(--ddd-font-size-m);
          }
          .linkbar site-breadcrumb,
          .linkbar .lbl,
          .linkbar .btn {
            display: none;
          }
          .linkbar code.url {
            background: transparent;
            border: 0;
            padding: 0;
            color: var(--eco-muted);
            font-family: var(--ddd-font-navigation);
          }
          nav.outline {
            max-width: none;
            flex-basis: 100%;
            padding-block: var(--ddd-spacing-4) 0;
          }
        }
        /* the narrowest phones: everything in the bar stays on one row */
        @media (max-width: 400px) {
          :host {
            --eco-gutter: var(--ddd-spacing-3);
          }
          header.top .wrap {
            gap: 0 var(--ddd-spacing-1);
            padding-inline-end: var(--ddd-spacing-1);
          }
          .toggle button {
            padding-inline: var(--ddd-spacing-2);
          }
          .end {
            gap: 0;
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
    const footer = Array.isArray(this._vars.footer) ? this._vars.footer : [];
    const welcome = web ? this._welcome() : null;
    const tour =
      welcome && welcome.tour ? this._itemBySlug(welcome.tour) : null;
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skip}</a>
      <hax-network-bar
        current="cloud"
        @hax-network-merlin="${this._onMerlin}"
      ></hax-network-bar>
      <header class="top">
        <div class="wrap">
          <a
            class="brand"
            href="${this._items.length ? this._items[0].slug : "./"}"
            >${this._title}</a
          >
          <div class="toggle" role="group" aria-label="${this.t.view}">
            <button
              type="button"
              aria-pressed="${web ? "true" : "false"}"
              @click="${() => this._setView("web")}"
            >
              ${this.t.web}
            </button>
            <button
              type="button"
              aria-pressed="${web ? "false" : "true"}"
              @click="${() => this._setView("site")}"
            >
              ${this.t.site}
            </button>
          </div>
          <div class="navs" id="navs">
            <nav class="main" aria-label="${this.t.main}">
              ${this._nav().map(
                (n) =>
                  html`<a
                    href="${this._href(n.item)}"
                    aria-current="${n.item.id === top ? "page" : "false"}"
                    >${n.label}</a
                  >`,
              )}
              ${this._links("docs").map(
                (l) =>
                  html`<a
                    class="out"
                    href="${l.href}"
                    target="_blank"
                    rel="noopener"
                    >${l.label} ↗</a
                  >`,
              )}
            </nav>
            <div class="acts">
              ${this._links("portfolio").map(
                (l) =>
                  html`<a
                    class="pill portfolio"
                    href="${l.href}"
                    target="_blank"
                    rel="noopener"
                    >${l.label} ↗</a
                  >`,
              )}
              ${this._links("demo").map(
                (l) =>
                  html`<a
                    class="pill demo"
                    href="${l.href}"
                    target="_blank"
                    rel="noopener"
                    >${l.label} ↗</a
                  >`,
              )}
            </div>
          </div>
          <div class="end">
            <button
              class="menu-btn"
              type="button"
              aria-label="${this.t.menu}"
              aria-expanded="${this.menuOpen ? "true" : "false"}"
              aria-controls="navs"
              @click="${() => {
                this.menuOpen = !this.menuOpen;
              }}"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>
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
      ${
        web
          ? html`<div class="linkbar">
              <div class="wrap">
                <site-breadcrumb></site-breadcrumb>
                <span class="lbl">${this.t.linkToView}</span>
                <code class="url">${this._pageUrl()}</code>
                <button class="btn" type="button" @click="${this._copy}">
                  ${this._copied ? this.t.copied : this.t.copy}
                </button>
                <span class="visually-hidden" role="status"
                  >${this._copied ? this.t.copied : ""}</span
                >
              </div>
            </div>`
          : ""
      }
      <div class="${web ? "" : "wrap"}">
        <div class="body">
          ${
            web
              ? ""
              : html`<nav class="outline" aria-label="${this.t.outline}">
                  <p class="ol-head">${this._topTitle(top)}</p>
                  <site-menu></site-menu>
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
                : html`<site-breadcrumb></site-breadcrumb>`
            }
            <div class="content">
              ${
                web
                  ? ""
                  : html`${
                        this._eyebrow()
                          ? html`<p class="eyebrow">${this._eyebrow()}</p>`
                          : ""
                      }<site-active-title></site-active-title>`
              }
              ${
                !web && eco && (eco.node || eco.web !== "main")
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
  /** The page's group, from its eyebrow paragraph (shown above the title in the Site view). */
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
