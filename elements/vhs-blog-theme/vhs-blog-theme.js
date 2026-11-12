/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";
import { vhsBlogLoadFace } from "./lib/vhs-blog-case.js";
import "./lib/vhs-blog-spine.js";
import "./lib/vhs-blog-cover.js";
import "./lib/vhs-blog-tv.js";

// faces the theme chrome itself uses (case title faces load per case)
const CHROME_FACES = [
  "Archivo",
  "Archivo Narrow",
  "Archivo Black",
  "Monoton",
  "Permanent Marker",
  "IBM Plex Mono",
  "Russo One",
  "VT323",
];
// leaf posts per stack on the shelf, like a real bargain bin stack
const STACK_SIZE = 10;

/**
 * @title VHS Blog
 * `A dark, bargain-bin video shelf for blogs and vlogs. Every post is a
 * one-of-a-kind video case generated from a hash of its title; posts with
 * child pages become box sets. Opening a post powers on an old CRT that
 * rolls an 80s title sequence before the page content.`
 *
 * @microcopy - language worth noting:
 *  - case: the generated spine + cover for a post, hashed from its title
 *  - stack: a column of cases on the shelf (box sets are their own stack)
 *  - Keepcase: the theme's own design system (chrome colors, faces, case tables)
 *
 * @haxcms-theme-category Blog, Website
 * @haxcms-theme-internal false
 * @haxcms-theme-priority 0
 * @demo demo/index.html
 * @element vhs-blog-theme
 */
class VhsBlogTheme extends HAXCMSThemeParts(DDDSuper(HAXCMSLitElementTheme)) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "vhs-blog-theme";
  }

  constructor() {
    super();
    this.siteTitle = "";
    this.items = [];
    this.activeId = null;
    this.activeItem = {};
    this.isHome = true;
    this.held = null;
    this.t = {
      ...this.t,
      skipToContent: "Skip to content",
      browse: "Browse",
      allPosts: "All posts",
      close: "Close",
      search: "Search",
      searchSite: "Search this site",
      backToShelf: "Back to the shelf",
      shelf: "The shelf",
      nowHolding: "Now holding",
      play: "Play",
      aisle: "Aisle",
      boxSet: "Box set",
      min: "min",
      minRead: "min read",
      presents: "presents",
      rating: "Accessible to all audiences",
      coverArtFor: "Cover art for",
      titleSequence: "Title sequence",
      titleSequenceFor: "Title sequence for",
      runningTime: "Running time",
      feature: "a keepcase feature",
      channel: "CH 03",
      replayIntro: "Replay intro",
      skipIntro: "Skip intro",
      previousCase: "Previous case",
      nextCase: "Next case",
      previousAndNext: "Previous and next",
      frontCover: "Front cover",
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
      siteTitle: { type: String },
      items: { type: Array },
      activeId: { type: String },
      activeItem: { type: Object },
      isHome: { type: Boolean, reflect: true, attribute: "is-home" },
      held: { type: String },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    CHROME_FACES.forEach((f) => vhsBlogLoadFace(f));
    // store reactions live only while connected
    this.__vhsReactions = [];
    this.__vhsReactions.push(
      autorun(() => {
        const manifest = toJS(store.manifest);
        const router = toJS(store.routerManifest);
        Promise.resolve().then(() => {
          this.siteTitle = manifest && manifest.title ? manifest.title : "";
          this.items =
            router && router.items
              ? router.items.filter(
                  (i) => !(i.metadata && i.metadata.hideInMenu),
                )
              : [];
        });
      }),
    );
    this.__vhsReactions.push(
      autorun(() => {
        const location = toJS(store.location);
        Promise.resolve().then(() => {
          this._noticeLocation(location);
        });
      }),
    );
    this.__vhsReactions.push(
      autorun(() => {
        const activeId = toJS(store.activeId);
        const activeItem = toJS(store.activeItem);
        Promise.resolve().then(() => {
          this.activeId = activeId;
          this.activeItem = activeItem || {};
        });
      }),
    );
  }

  disconnectedCallback() {
    if (this.__vhsReactions) {
      this.__vhsReactions.forEach((dispose) => dispose());
      this.__vhsReactions = null;
    }
    super.disconnectedCallback();
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // a post opens on the TV, so route changes go to the top of the page
    // (see _noticeLocation) rather than jumping past the title sequence
    this.HAXCMSThemeSettings.autoScroll = false;
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
    );
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("isHome")) {
      // the shelf is a listing, not an editable page
      setTimeout(() => {
        store.pageAllowed = !this.isHome;
      }, 0);
    }
  }

  /**
   * The shelf shows at the site root; any other route shows the post.
   */
  _noticeLocation(location) {
    if (!location || !location.route) {
      return;
    }
    const home =
      location.route.name === "home" || location.route.name === "404";
    this.isHome = home;
    const dialog = this.shadowRoot
      ? this.shadowRoot.querySelector("#browse")
      : null;
    if (dialog && dialog.open) {
      dialog.close();
    }
    if (!home) {
      globalThis.scrollTo({ top: 0, left: 0 });
    }
  }

  /**
   * Shelf order: each top level post with children is a box set stack
   * (the parent then its descendants); other top level posts fill stacks
   * of STACK_SIZE in outline order.
   */
  _stacks() {
    const items = this.items || [];
    const byParent = {};
    items.forEach((i) => {
      const key = i.parent ? i.parent : "__root";
      if (!byParent[key]) {
        byParent[key] = [];
      }
      byParent[key].push(i);
    });
    const sortByOrder = (a, b) => (a.order || 0) - (b.order || 0);
    const descendants = (id) => {
      const kids = (byParent[id] || []).slice().sort(sortByOrder);
      let out = [];
      kids.forEach((k) => {
        out.push(k);
        out = out.concat(descendants(k.id));
      });
      return out;
    };
    const roots = (byParent.__root || []).slice().sort(sortByOrder);
    const stacks = [];
    let loose = [];
    let aisle = 0;
    const flush = () => {
      if (loose.length) {
        aisle++;
        stacks.push({
          id: "aisle-" + aisle,
          label: this.t.aisle + " " + aisle,
          box: false,
          items: loose,
        });
        loose = [];
      }
    };
    roots.forEach((r) => {
      const kids = descendants(r.id);
      if (kids.length) {
        flush();
        stacks.push({
          id: "box-" + r.id,
          label: this.t.boxSet + ": " + r.title,
          box: true,
          items: [r].concat(kids),
        });
      } else {
        loose.push(r);
        if (loose.length === STACK_SIZE) {
          flush();
        }
      }
    });
    flush();
    return stacks;
  }

  _readtime(item) {
    return item && item.metadata && item.metadata.readtime
      ? String(item.metadata.readtime)
      : "";
  }

  _peek(item) {
    this.held = item.id;
  }

  _openBrowse() {
    const dialog = this.shadowRoot.querySelector("#browse");
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }

  _closeBrowse() {
    const dialog = this.shadowRoot.querySelector("#browse");
    if (dialog && dialog.open) {
      dialog.close();
    }
  }

  _goShelf(e) {
    e.preventDefault();
    globalThis.history.pushState(null, null, store.location.baseUrl);
    globalThis.dispatchEvent(new PopStateEvent("popstate"));
    globalThis.scrollTo({ top: 0, left: 0 });
  }

  _replay() {
    const tv = this.shadowRoot.querySelector("vhs-blog-tv");
    if (tv) {
      tv.replay();
    }
  }

  _skipIntro() {
    const tv = this.shadowRoot.querySelector("vhs-blog-tv");
    if (tv) {
      tv.skip();
    }
    const target = this.shadowRoot.querySelector("#contentcontainer");
    if (target) {
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start" });
    }
  }

  // allows for global styles to be set against the entire document
  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          background-color: #0f0e13;
          color-scheme: only dark;
        }
      `,
    ];
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          /* Keepcase chrome tokens: this theme is dark by design */
          --vhs-room: #0f0e13;
          --vhs-peg: #17151c;
          --vhs-peg-dot: rgba(255, 255, 255, 0.07);
          --vhs-ink: #f3eee4;
          --vhs-muted: #b8ad9c;
          --vhs-panel: #1b1a20;
          --vhs-line: rgba(255, 255, 255, 0.16);
          --vhs-wood: #3b2718;
          --vhs-wood-hi: #5a3c25;
          --vhs-focus: #ffd60a;
          --vhs-neon: #ff4fa3;
          --vhs-neon-glow: rgba(255, 79, 163, 0.55);
          display: block;
          color-scheme: only dark;
          color: var(--vhs-ink);
          background-color: var(--vhs-room);
          font-family: "Archivo", var(--ddd-font-primary), sans-serif;
          min-height: 100vh;
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
          margin: var(--ddd-spacing-0);
        }
        @media (max-width: 800px) {
          :host([edit-mode]) {
            margin: var(--ddd-spacing-0);
          }
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        a:focus-visible,
        button:focus-visible,
        .case-link:focus-visible {
          outline: 3px solid var(--vhs-focus);
          outline-offset: 3px;
        }

        .sign {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-3) var(--ddd-spacing-4);
          padding: var(--ddd-spacing-4) var(--ddd-spacing-8);
          border-bottom: 1px solid var(--vhs-line);
        }
        .title {
          font-family: "Monoton", "Archivo Black", sans-serif;
          font-size: 40px;
          line-height: 1;
          letter-spacing: 0.04em;
          color: var(--vhs-neon);
          text-shadow:
            0 0 6px var(--vhs-neon-glow),
            0 0 18px var(--vhs-neon-glow);
          text-decoration: none;
          margin-right: auto;
          overflow-wrap: anywhere;
        }
        .btn {
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--vhs-ink);
          background: transparent;
          border: 1.5px solid var(--vhs-line);
          border-radius: var(--ddd-radius-sm);
          min-height: 44px;
          padding: 0 var(--ddd-spacing-4);
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          cursor: pointer;
          text-decoration: none;
        }
        .btn:hover {
          border-color: var(--vhs-ink);
        }
        .btn svg {
          width: 20px;
          height: 20px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }
        site-modal {
          --simple-icon-color: var(--vhs-ink);
        }

        /* the shelf */
        .peg {
          background-color: var(--vhs-peg);
          background-image: radial-gradient(
            circle,
            var(--vhs-peg-dot) 3.5px,
            transparent 4px
          );
          background-size: 36px 36px;
          padding: var(--ddd-spacing-6) var(--ddd-spacing-8)
            var(--ddd-spacing-12);
        }
        .wrap {
          max-width: 1440px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: var(--ddd-spacing-8);
          align-items: start;
        }
        .aisles {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--ddd-spacing-10) var(--ddd-spacing-7);
        }
        .stack h2 {
          display: inline-block;
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin: 0 0 var(--ddd-spacing-3);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          background: var(--vhs-ink);
          color: var(--vhs-room);
          border-radius: 2px;
        }
        .stack ol {
          list-style: none;
          margin: 0;
          padding: 0 0 0 var(--ddd-spacing-6);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .case-link {
          display: block;
          color: inherit;
          text-decoration: none;
          border-radius: 4px;
        }
        .o1 {
          margin-right: 12px;
        }
        .o2 {
          margin-left: 6px;
          margin-right: 4px;
        }
        .o3 {
          margin-right: 20px;
        }
        .board {
          height: 18px;
          margin-top: 3px;
          border-radius: 2px;
          background: linear-gradient(
            180deg,
            var(--vhs-wood-hi),
            var(--vhs-wood) 40%
          );
          box-shadow: 0 10px 0 rgba(0, 0, 0, 0.28);
        }
        .panel {
          position: sticky;
          top: var(--ddd-spacing-4);
          background: var(--vhs-panel);
          border: 1px solid var(--vhs-line);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-4);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
        }
        .lbl {
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--vhs-muted);
        }
        .panel h2 {
          margin: 0;
          font-size: 22px;
          line-height: 1.2;
        }
        .panel p {
          margin: 0;
          font-size: 16px;
          line-height: 1.5;
          color: var(--vhs-muted);
        }
        .panel a.play {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2);
          min-height: 48px;
          border-radius: var(--ddd-radius-sm);
          background-color: var(--vhs-focus);
          color: #111111;
          font-weight: 800;
          font-size: 16px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          text-decoration: none;
        }
        .panel a.play svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }
        .panel a.play:focus-visible {
          outline-color: var(--vhs-ink);
        }
        @media (prefers-reduced-motion: no-preference) {
          .case-link {
            transition: transform 0.2s cubic-bezier(0.3, 1.4, 0.5, 1);
          }
          .case-link:hover,
          .case-link:focus-visible,
          .case-link.held {
            transform: translateX(-22px);
          }
        }
        /* without motion the held case still steps out, just instantly */
        @media (prefers-reduced-motion: reduce) {
          .case-link:hover,
          .case-link:focus-visible,
          .case-link.held {
            transform: translateX(-12px);
          }
        }

        /* the post */
        .stage {
          padding: var(--ddd-spacing-8) var(--ddd-spacing-8)
            var(--ddd-spacing-4);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-4);
        }
        vhs-blog-tv {
          width: 100%;
          max-width: 1000px;
        }
        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-3);
          justify-content: center;
        }
        .case {
          max-width: 1200px;
          margin: var(--ddd-spacing-6) auto 0;
          padding: 0 var(--ddd-spacing-8);
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-8);
          align-items: flex-start;
        }
        .front {
          flex: 0 1 320px;
          min-width: 240px;
          position: sticky;
          top: var(--ddd-spacing-4);
        }
        .case > main {
          flex: 1 1 560px;
          min-width: 0;
        }
        article {
          background: var(--vhs-panel);
          border: 1px solid var(--vhs-line);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-8) var(--ddd-spacing-10)
            var(--ddd-spacing-10);
          box-sizing: border-box;
          font-family: var(--ddd-font-primary);
        }
        article:focus {
          outline: none;
        }
        site-breadcrumb {
          display: flex;
          margin: 0 0 var(--ddd-spacing-3) 0;
        }
        site-active-title h1 {
          font-size: var(--ddd-font-size-3xl);
          margin: 0 0 var(--ddd-spacing-4) 0;
        }
        .pager {
          max-width: 1200px;
          margin: var(--ddd-spacing-8) auto 0;
          padding: 0 var(--ddd-spacing-8) var(--ddd-spacing-12);
          box-sizing: border-box;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--ddd-spacing-7);
        }
        .pager .next {
          grid-column: 2;
        }
        .plabel {
          display: block;
          margin-bottom: var(--ddd-spacing-2);
        }

        footer {
          padding: var(--ddd-spacing-5) var(--ddd-spacing-8);
          border-top: 1px solid var(--vhs-line);
          color: var(--vhs-muted);
          font-size: 14px;
        }

        dialog {
          background: var(--vhs-panel);
          color: var(--vhs-ink);
          border: 1px solid var(--vhs-line);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-5);
          width: min(480px, 90vw);
          max-height: 85vh;
        }
        dialog::backdrop {
          background: rgba(0, 0, 0, 0.7);
        }
        .dlg-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-3);
        }
        .dlg-head h2 {
          margin: 0;
          font-size: 22px;
        }

        @media (max-width: 1300px) {
          .aisles {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 1100px) {
          .wrap {
            grid-template-columns: minmax(0, 1fr);
          }
          .panel {
            position: static;
          }
        }
        @media (max-width: 900px) {
          .front {
            position: static;
            flex-basis: 100%;
          }
        }
        @media (max-width: 700px) {
          .aisles,
          .pager {
            grid-template-columns: minmax(0, 1fr);
          }
          .pager .next {
            grid-column: 1;
          }
          .peg,
          .stage,
          .case,
          .pager,
          .sign,
          footer {
            padding-left: var(--ddd-spacing-4);
            padding-right: var(--ddd-spacing-4);
          }
          article {
            padding: var(--ddd-spacing-5);
          }
          .title {
            font-size: 28px;
          }
        }
      `,
    ];
  }

  _renderShelf() {
    const stacks = this._stacks();
    const flat = stacks.reduce((all, s) => all.concat(s.items), []);
    const held = flat.find((i) => i.id === this.held) || flat[0];
    return html`
      <main id="shelf" class="peg" tabindex="-1">
        <h1 class="sr-only">${this.siteTitle}</h1>
        <div class="wrap">
          <div class="aisles">
            ${stacks.map(
              (s) => html`
                <section class="stack" aria-labelledby="${s.id}">
                  <h2 id="${s.id}">${s.label}</h2>
                  <ol>
                    ${s.items.map((item, i) => {
                      const rt = this._readtime(item);
                      const isBox = s.box && i === 0;
                      return html`
                        <li>
                          <a
                            class="case-link o${i % 4} ${held && held.id === item.id ? "held" : ""}"
                            href="${item.slug}"
                            @mouseenter="${() => this._peek(item)}"
                            @focus="${() => this._peek(item)}"
                          >
                            <span class="sr-only"
                              >${item.title}${rt ? `, ${rt} ${this.t.minRead}` : ""}</span
                            >
                            <vhs-blog-spine
                              aria-hidden="true"
                              case-title="${item.title}"
                              readtime="${rt}"
                              ?boxset="${isBox}"
                              box-label="${this.t.boxSet}"
                              min-label="${this.t.min}"
                            ></vhs-blog-spine>
                          </a>
                        </li>
                      `;
                    })}
                  </ol>
                  <div class="board"></div>
                </section>
              `,
            )}
          </div>
          ${
            held
              ? html`
                  <aside class="panel" aria-labelledby="held-title">
                    <span class="lbl">${this.t.nowHolding}</span>
                    <vhs-blog-cover
                      case-title="${held.title}"
                      readtime="${this._readtime(held)}"
                      presenter="${this.siteTitle}"
                      presents-label="${this.t.presents}"
                      rating-label="${this.t.rating}"
                      min-label="${this.t.min}"
                      cover-label="${this.t.coverArtFor}"
                    ></vhs-blog-cover>
                    <h2 id="held-title" aria-live="polite">${held.title}</h2>
                    ${held.description ? html`<p>${held.description}</p>` : nothing}
                    <a class="play" href="${held.slug}">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                      ${this.t.play}
                      <span class="sr-only">${held.title}</span>
                    </a>
                  </aside>
                `
              : nothing
          }
        </div>
      </main>
    `;
  }

  _renderPost() {
    const item = this.activeItem || {};
    const title = item.title || "";
    const rt = this._readtime(item);
    const stacks = this._stacks();
    const flat = stacks.reduce((all, s) => all.concat(s.items), []);
    const index = flat.findIndex((i) => i.id === this.activeId);
    const prev = index > 0 ? flat[index - 1] : null;
    const next = index > -1 && index < flat.length - 1 ? flat[index + 1] : null;
    const dim = this.editMode ? "edit-mode-active" : "";
    return html`
      <section class="stage" aria-label="${this.t.titleSequence}" part="${dim}">
        <vhs-blog-tv
          crawl-title="${title}"
          presenter="${this.siteTitle}"
          kicker="${this.t.feature}"
          runtime="${rt}"
          runtime-label="${this.t.runningTime}"
          min-label="${this.t.min}"
          play-label="${this.t.play}"
          channel-label="${this.t.channel}"
          sequence-label="${this.t.titleSequenceFor}"
          presents-label="${this.t.presents}"
          ?still="${this.editMode}"
        ></vhs-blog-tv>
        <div class="controls">
          <button class="btn" type="button" @click="${this._replay}">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7"></path>
              <path d="M3 4v5h5"></path>
            </svg>
            ${this.t.replayIntro}
          </button>
          <button class="btn" type="button" @click="${this._skipIntro}">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5l7 7-7 7M13 5l7 7-7 7"></path>
            </svg>
            ${this.t.skipIntro}
          </button>
        </div>
      </section>
      <div class="case">
        <aside class="front" aria-label="${this.t.frontCover}" part="${dim}">
          <vhs-blog-cover
            case-title="${title}"
            readtime="${rt}"
            presenter="${this.siteTitle}"
            presents-label="${this.t.presents}"
            rating-label="${this.t.rating}"
            min-label="${this.t.min}"
            cover-label="${this.t.coverArtFor}"
          ></vhs-blog-cover>
        </aside>
        <main>
          <article id="contentcontainer" tabindex="-1">
            <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
            <site-active-title part="page-title"></site-active-title>
            <div id="slot"><slot></slot></div>
          </article>
        </main>
      </div>
      ${
        prev || next
          ? html`
              <nav
                class="pager"
                aria-label="${this.t.previousAndNext}"
                part="${dim}"
              >
                ${prev ? this._renderPagerCase(prev, this.t.previousCase, "prev") : nothing}
                ${next ? this._renderPagerCase(next, this.t.nextCase, "next") : nothing}
              </nav>
            `
          : nothing
      }
    `;
  }

  _renderPagerCase(item, label, cls) {
    const rt = this._readtime(item);
    return html`
      <div class="${cls}">
        <span class="lbl plabel" aria-hidden="true">${label}</span>
        <a class="case-link" href="${item.slug}">
          <span class="sr-only">${label}: ${item.title}</span>
          <vhs-blog-spine
            aria-hidden="true"
            case-title="${item.title}"
            readtime="${rt}"
            min-label="${this.t.min}"
            box-label="${this.t.boxSet}"
          ></vhs-blog-spine>
        </a>
      </div>
    `;
  }

  render() {
    return html`
      <a
        class="skip-link"
        href="${this.isHome ? "#shelf" : "#contentcontainer"}"
        >${this.t.skipToContent}</a
      >
      <header class="sign" part="header">
        <a class="title" href="./" @click="${this._goShelf}"
          >${this.siteTitle}</a
        >
        <site-region name="header"></site-region>
        ${
          this.isHome
            ? nothing
            : html`<a class="btn" href="./" @click="${this._goShelf}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6"></path>
                </svg>
                ${this.t.backToShelf}
              </a>`
        }
        <button class="btn" type="button" @click="${this._openBrowse}">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          ${this.t.browse}
        </button>
        <site-modal
          icon="icons:search"
          title="${this.t.searchSite}"
          button-label="${this.t.search}"
          dark
        >
          <site-search></site-search>
        </site-modal>
      </header>
      ${this.isHome ? this._renderShelf() : this._renderPost()}
      ${
        this.isHome
          ? html`<div id="contentcontainer" hidden>
              <div id="slot"><slot></slot></div>
            </div>`
          : nothing
      }
      <footer part="footer">
        <site-region name="footerPrimary"></site-region>
        <slot name="footer"></slot>
      </footer>
      <dialog id="browse" aria-labelledby="browse-title">
        <div class="dlg-head">
          <h2 id="browse-title">${this.t.allPosts}</h2>
          <button class="btn" type="button" @click="${this._closeBrowse}">
            ${this.t.close}
          </button>
        </div>
        <site-menu></site-menu>
      </dialog>
    `;
  }
}
globalThis.customElements.define(VhsBlogTheme.tag, VhsBlogTheme);
export { VhsBlogTheme };
