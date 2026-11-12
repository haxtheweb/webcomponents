/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
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
import { vhsBlogCase, vhsBlogLoadFace } from "./lib/vhs-blog-case.js";
import "./lib/vhs-blog-spine.js";
import "./lib/vhs-blog-cover.js";
import "./lib/vhs-blog-tv.js";
import "./lib/vhs-blog-vcr.js";
import "./lib/vhs-blog-console.js";

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
// upright tapes in the tower beside the console, and per tower shelf
const TOWER_SIZE = 16;
const TOWER_ROW = 8;
// tape load timeline (ms): lid opens, cassette drops, lid presses, route
const LOAD_INSERT = 380;
const LOAD_PRESS = 1150;
const LOAD_ROUTE = 1500;

/**
 * @title VHS Blog
 * `A dark, bargain-bin video shelf for blogs and vlogs. Every post is a
 * one-of-a-kind video case generated from a hash of its title; posts with
 * child pages become box sets. Picking a tape drops it into a top-loading
 * VCR on a console TV, which rolls an 80s title sequence while the post
 * loads below.`
 *
 * @microcopy - language worth noting:
 *  - case / tape: the generated spine + cover for a post, hashed from its title
 *  - stack: a column of cases on the shelf (box sets are their own stack)
 *  - tower: the upright tapes beside the console (the first posts)
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
    this.phase = "idle";
    this.loadingTitle = "";
    this.__timers = [];
    this.t = {
      ...this.t,
      skipToContent: "Skip to content",
      browse: "Browse",
      allPosts: "All posts",
      close: "Close",
      search: "Search",
      searchSite: "Search this site",
      shelf: "The shelf",
      console: "Entertainment console",
      tower: "Tape tower",
      topShelf: "Top shelf",
      bottomShelf: "Bottom shelf",
      hintIdle:
        "Pick a tape. It drops into the VCR, the TV warms up, and the post loads below.",
      hintPlaying: "Now playing. The post is below.",
      vcr: "VCR",
      topLoad: "Top load",
      clock: "12:00",
      load: "LOAD",
      play: "Play",
      eject: "Eject",
      prev: "Prev",
      skip: "Skip",
      next: "Next",
      tvOff: "The TV is off",
      aisle: "Aisle",
      boxSet: "Box set",
      min: "min",
      minShort: "m",
      minRead: "min read",
      presents: "presents",
      rating: "Accessible to all audiences",
      coverArtFor: "Cover art for",
      titleSequenceFor: "Title sequence for",
      runningTime: "Running time",
      feature: "a keepcase feature",
      channel: "CH 03",
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
      /** tape load state: idle, open, insert, press, playing */
      phase: { type: String, reflect: true },
      loadingTitle: { type: String },
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
    this._clearTimers();
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
    // the shelf and the post are different templates, so the slot wrapper
    // HAX edits inside is a new node after every switch; re-point the
    // editor at the live one (same contract simple-blog follows)
    const live = this.shadowRoot
      ? this.shadowRoot.querySelector("#contentcontainer")
      : null;
    if (live && live !== this.contentContainer) {
      this.contentContainer = live;
    }
    if (
      changedProperties.has("activeId") &&
      !this.isHome &&
      !this.editMode &&
      this.phase === "playing"
    ) {
      const tv = this.shadowRoot.querySelector("vhs-blog-tv");
      if (tv) {
        tv.replay();
      }
    }
  }

  /**
   * The shelf shows at the site root; any other route plays the post.
   */
  _noticeLocation(location) {
    if (!location || !location.route) {
      return;
    }
    const home =
      location.route.name === "home" || location.route.name === "404";
    this._clearTimers();
    this.isHome = home;
    this.phase = home ? "idle" : "playing";
    this.loadingTitle = "";
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
   * Editing always happens on the post layout, even at the site root, so
   * the content HAX edits is the content on screen.
   */
  _showPost() {
    return !this.isHome || this.editMode;
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

  /**
   * The first TOWER_SIZE loose posts stand in the tower by the console;
   * the rest fill aisles of STACK_SIZE, then the box sets.
   */
  _shelf() {
    const tower = [];
    const rest = [];
    const boxes = [];
    this._stacks().forEach((s) => {
      if (s.box) {
        boxes.push(s);
      } else {
        s.items.forEach((i) => {
          (tower.length < TOWER_SIZE ? tower : rest).push(i);
        });
      }
    });
    const aisles = [];
    for (let i = 0; i < rest.length; i += STACK_SIZE) {
      const n = aisles.length + 1;
      aisles.push({
        id: "aisle-" + n,
        label: this.t.aisle + " " + n,
        box: false,
        items: rest.slice(i, i + STACK_SIZE),
      });
    }
    return { tower, aisles: aisles.concat(boxes) };
  }

  _flat() {
    return this._stacks().reduce((all, s) => all.concat(s.items), []);
  }

  _readtime(item) {
    const rt = item && item.metadata ? parseInt(item.metadata.readtime, 10) : 0;
    return rt > 0 ? String(rt) : "";
  }

  _clearTimers() {
    (this.__timers || []).forEach((id) => clearTimeout(id));
    this.__timers = [];
  }

  /**
   * A tape link was activated: run the load, then route. Modified clicks
   * (new tab, new window) keep the browser's own behavior.
   */
  _insert(e, item) {
    if (
      e &&
      (e.defaultPrevented ||
        e.button > 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey)
    ) {
      return;
    }
    if (e) {
      e.preventDefault();
    }
    this._loadTape(item);
  }

  /**
   * Drop a tape into the VCR: lid up, cassette in, lid down, then route to
   * the post. Reduced motion and edit mode skip straight to the route.
   */
  _loadTape(item) {
    if (!item) {
      return;
    }
    this._clearTimers();
    if (!this.isHome && item.id === this.activeId) {
      this._replay();
      return;
    }
    const href = new URL(item.slug, globalThis.document.baseURI).href;
    const go = () => {
      globalThis.history.pushState(null, null, href);
      globalThis.dispatchEvent(new PopStateEvent("popstate"));
    };
    const reduce =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.loadingTitle = item.title;
    if (reduce || this.editMode) {
      go();
      return;
    }
    globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    this.phase = "open";
    this.__timers = [
      setTimeout(() => {
        this.phase = "insert";
      }, LOAD_INSERT),
      setTimeout(() => {
        this.phase = "press";
      }, LOAD_PRESS),
      setTimeout(go, LOAD_ROUTE),
    ];
  }

  _vcrDisabled() {
    if (["open", "insert", "press"].includes(this.phase)) {
      return "eject prev play skip next";
    }
    if (this.isHome) {
      return "eject prev skip";
    }
    const flat = this._flat();
    const idx = flat.findIndex((i) => i.id === this.activeId);
    const off = [];
    if (idx <= 0) {
      off.push("prev");
    }
    if (idx === -1 || idx >= flat.length - 1) {
      off.push("next");
    }
    return off.join(" ");
  }

  _vcrKey(e) {
    const key = e.detail ? e.detail.key : "";
    const flat = this._flat();
    const idx = flat.findIndex((i) => i.id === this.activeId);
    if (key === "eject") {
      this._goShelf();
    } else if (key === "prev" && !this.isHome && idx > 0) {
      this._loadTape(flat[idx - 1]);
    } else if (key === "next" || (key === "play" && this.isHome)) {
      if (this.isHome) {
        this._loadTape(this._shelf().tower[0] || flat[0]);
      } else if (idx > -1 && idx < flat.length - 1) {
        this._loadTape(flat[idx + 1]);
      }
    } else if (key === "play") {
      this._replay();
    } else if (key === "skip") {
      this._skipIntro();
    }
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
    if (e) {
      e.preventDefault();
    }
    this._clearTimers();
    this.phase = "idle";
    this.loadingTitle = "";
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
          --vhs-walnut: #5a2c14;
          --vhs-walnut-dark: #3f1d0c;
          --vhs-walnut-edge: #8a4a26;
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
        .case-link:focus-visible,
        .tape:focus-visible {
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

        /* the den: console, VCR and the tape tower */
        .den {
          position: relative;
          padding: var(--ddd-spacing-10) var(--ddd-spacing-8) 0;
          overflow: hidden;
          background:
            radial-gradient(
              ellipse 60% 50% at 85% 10%,
              rgba(255, 200, 120, 0.1),
              transparent 70%
            ),
            repeating-linear-gradient(
              90deg,
              #1a1410 0 118px,
              #130f0c 118px 120px
            );
        }
        .setup {
          max-width: 1380px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-8);
          align-items: flex-end;
          justify-content: center;
        }
        vhs-blog-console {
          flex: 0 1 860px;
          min-width: 0;
        }
        .tower {
          flex: 0 1 470px;
          min-width: 0;
          box-sizing: border-box;
          padding: 14px 14px 0;
          border-radius: 6px 6px 0 0;
          background: linear-gradient(
            180deg,
            var(--vhs-walnut),
            var(--vhs-walnut-dark)
          );
          box-shadow: 0 30px 40px rgba(0, 0, 0, 0.6);
        }
        .tower h2 {
          margin: 0 0 10px;
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #e9d9b0;
        }
        .tape-row {
          list-style: none;
          margin: 0;
          padding: 0 4px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          flex-wrap: wrap;
          gap: 3px;
          align-items: flex-end;
          min-height: 230px;
          background: #1e0f06;
          box-shadow: inset 0 10px 18px rgba(0, 0, 0, 0.6);
        }
        .tape-row li {
          display: block;
        }
        .tboard {
          height: 16px;
          margin: 0 -14px 14px;
          background: linear-gradient(180deg, var(--vhs-walnut-edge), #5c2c13);
          box-shadow: 0 6px 0 rgba(0, 0, 0, 0.35);
        }
        .tape-row .tape {
          width: 50px;
          height: 222px;
          box-sizing: border-box;
          border-top: 5px solid #121212;
          border-bottom: 5px solid #121212;
          background: var(--vhs-case-bg);
          color: var(--vhs-case-ink);
          --vhs-art-bg: var(--vhs-case-bg);
          --vhs-art-ac: var(--vhs-case-accent);
          --vhs-art-ink: var(--vhs-case-ink);
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          text-decoration: none;
          box-shadow:
            inset 2px 0 0 rgba(255, 255, 255, 0.18),
            inset -2px 0 0 rgba(0, 0, 0, 0.25);
        }
        .tape .tart {
          flex: none;
          width: 100%;
          height: 40px;
        }
        .tape .vt {
          flex: 1;
          min-height: 0;
          writing-mode: vertical-rl;
          padding: 6px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-family: var(--vhs-case-family), Impact, sans-serif;
          font-weight: var(--vhs-case-weight);
          font-style: var(--vhs-case-style);
          text-transform: var(--vhs-case-transform);
          letter-spacing: var(--vhs-case-spacing);
          font-size: var(--vhs-tape-size);
          line-height: 1;
        }
        .tape .stk {
          flex: none;
          margin: 4px 0 8px;
          font-family: "Permanent Marker", cursive;
          font-size: 13px;
          background: var(--vhs-case-sticker);
          color: #1b1b1b;
          padding: 2px 4px;
          border-radius: 2px;
          transform: rotate(var(--vhs-case-tilt));
        }
        .tape-row .tape.out {
          background: transparent;
          border-color: transparent;
          outline: 2px dashed rgba(255, 255, 255, 0.35);
          outline-offset: -2px;
          box-shadow: none;
        }
        .tape.out > :not(.sr-only) {
          visibility: hidden;
        }
        .art-sunburst {
          background: repeating-conic-gradient(
            from 0deg at 50% 115%,
            var(--vhs-art-ac) 0 6deg,
            var(--vhs-art-bg) 6deg 12deg
          );
        }
        .art-horizon {
          background:
            linear-gradient(var(--vhs-art-ac) 0 46%, transparent 46%),
            repeating-linear-gradient(
                90deg,
                var(--vhs-art-ink) 0 1px,
                transparent 1px 8px
              )
              bottom / 100% 54% no-repeat,
            var(--vhs-art-bg);
        }
        .art-stripes {
          background: repeating-linear-gradient(
            135deg,
            var(--vhs-art-ac) 0 6px,
            var(--vhs-art-bg) 6px 12px
          );
        }
        .art-dots {
          background:
            radial-gradient(circle, var(--vhs-art-ac) 2.5px, transparent 3px) 0
              0 / 9px 9px,
            var(--vhs-art-bg);
        }
        .art-portrait {
          background:
            radial-gradient(
              circle at 50% 40%,
              var(--vhs-art-ac) 0 24%,
              transparent 25%
            ),
            radial-gradient(
              ellipse at 50% 115%,
              var(--vhs-art-ac) 0 46%,
              transparent 47%
            ),
            var(--vhs-art-bg);
        }
        .hint {
          text-align: center;
          color: var(--vhs-muted);
          font-size: 16px;
          margin: 0;
          padding: 14px 0 18px;
        }
        .carpet {
          height: 40px;
          margin: 0 calc(-1 * var(--ddd-spacing-8));
          background: repeating-linear-gradient(
            115deg,
            #2a1a12 0 3px,
            #21140d 3px 6px
          );
        }

        /* the shelf below the console */
        .peg {
          background-color: var(--vhs-peg);
          background-image: radial-gradient(
            circle,
            var(--vhs-peg-dot) 3.5px,
            transparent 4px
          );
          background-size: 36px 36px;
          padding: var(--ddd-spacing-8) var(--ddd-spacing-8)
            var(--ddd-spacing-12);
        }
        .aisles {
          max-width: 1380px;
          margin: 0 auto;
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
        .lbl {
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--vhs-muted);
        }
        @media (prefers-reduced-motion: no-preference) {
          .case-link {
            transition: transform 0.2s cubic-bezier(0.3, 1.4, 0.5, 1);
          }
          .case-link:hover,
          .case-link:focus-visible {
            transform: translateX(-22px);
          }
          .tape {
            transition: transform 0.15s;
          }
          .tape:hover,
          .tape:focus-visible {
            transform: translateY(-14px);
          }
        }
        /* without motion the case still steps out, just instantly */
        @media (prefers-reduced-motion: reduce) {
          .case-link:hover,
          .case-link:focus-visible {
            transform: translateX(-12px);
          }
          .tape:hover,
          .tape:focus-visible {
            transform: translateY(-8px);
          }
        }

        /* the post, below the console */
        .post {
          padding-top: var(--ddd-spacing-8);
        }
        .case {
          max-width: 1200px;
          margin: 0 auto;
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
          padding: 0 var(--ddd-spacing-8);
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
          .den,
          .peg,
          .case,
          .pager,
          .sign,
          footer {
            padding-left: var(--ddd-spacing-4);
            padding-right: var(--ddd-spacing-4);
          }
          .carpet {
            margin: 0 calc(-1 * var(--ddd-spacing-4));
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

  /**
   * Largest type size that keeps the whole title on the tape spine: the
   * spine is about 42px across (lines stack sideways in vertical writing)
   * and its length is what is left after the art and the sticker.
   */
  _tapeSize(c, rt) {
    const length = rt ? 124 : 156;
    const words = c.title.split(/\s+/);
    const longest = Math.max(...words.map((w) => w.length));
    const width = c.transform === "uppercase" ? 0.74 : 0.62;
    for (let px = 24; px > 12; px--) {
      const advance = (px * width) / c.scale;
      const lines = Math.floor(42 / (px * 1.05));
      const perLine = Math.floor(length / advance);
      if (lines < 1 || longest > perLine) {
        continue;
      }
      let used = 1;
      let fill = 0;
      words.forEach((w) => {
        const need = fill ? fill + 1 + w.length : w.length;
        if (need > perLine) {
          used++;
          fill = w.length;
        } else {
          fill = need;
        }
      });
      if (used <= lines) {
        return px;
      }
    }
    return 12;
  }

  _renderTape(item) {
    const c = vhsBlogCase(item.title);
    vhsBlogLoadFace(c.family);
    const rt = this._readtime(item);
    const size = this._tapeSize(c, rt);
    const vars = {
      "--vhs-case-bg": c.bg,
      "--vhs-case-ink": c.ink,
      "--vhs-case-accent": c.accent,
      "--vhs-case-family": `"${c.family}"`,
      "--vhs-case-weight": String(c.weight),
      "--vhs-case-style": c.fontStyle,
      "--vhs-case-transform": c.transform,
      "--vhs-case-spacing": c.letterSpacing,
      "--vhs-case-sticker": c.sticker,
      "--vhs-case-tilt": c.tilt + "deg",
      "--vhs-tape-size": size + "px",
    };
    const current = !this.isHome && item.id === this.activeId;
    const loading = this.phase !== "idle" && item.title === this.loadingTitle;
    return html`
      <li>
        <a
          class="tape ${current || loading ? "out" : ""}"
          href="${item.slug}"
          style=${styleMap(vars)}
          aria-current="${current ? "page" : "false"}"
          @click="${(e) => this._insert(e, item)}"
        >
          <span class="sr-only"
            >${item.title}${rt ? `, ${rt} ${this.t.minRead}` : ""}</span
          >
          <span class="tart art-${c.art}" aria-hidden="true"></span>
          <span class="vt" aria-hidden="true">${item.title}</span>
          ${
            rt
              ? html`<span class="stk" aria-hidden="true"
                  >${rt}${this.t.minShort}</span
                >`
              : nothing
          }
        </a>
      </li>
    `;
  }

  _renderDen(tower) {
    const showPost = this._showPost();
    const active = this.activeItem || {};
    const playing = this.phase === "playing" && showPost;
    const tapeTitle =
      this.phase === "playing" ? active.title || "" : this.loadingTitle;
    const rows = [];
    for (let i = 0; i < tower.length; i += TOWER_ROW) {
      rows.push(tower.slice(i, i + TOWER_ROW));
    }
    const dim = this.editMode ? "edit-mode-active" : "";
    return html`
      <section class="den" aria-label="${this.t.console}" part="${dim}">
        <div class="setup">
          <vhs-blog-console>
            <vhs-blog-vcr
              slot="vcr"
              phase="${this.phase}"
              tape-title="${tapeTitle}"
              disabled="${this._vcrDisabled()}"
              label="${this.t.vcr}"
              lid-label="${this.t.topLoad}"
              clock-label="${this.t.clock}"
              load-label="${this.t.load}"
              playing-label="${this.t.play}"
              eject-label="${this.t.eject}"
              prev-label="${this.t.prev}"
              play-label="${this.t.play}"
              skip-label="${this.t.skip}"
              next-label="${this.t.next}"
              @vhs-blog-vcr-key="${this._vcrKey}"
            ></vhs-blog-vcr>
            <vhs-blog-tv
              bare
              ?off="${!playing}"
              off-label="${this.t.tvOff}"
              crawl-title="${active.title || ""}"
              presenter="${this.siteTitle}"
              kicker="${this.t.feature}"
              runtime="${this._readtime(active)}"
              runtime-label="${this.t.runningTime}"
              min-label="${this.t.min}"
              play-label="${this.t.play}"
              channel-label="${this.t.channel}"
              sequence-label="${this.t.titleSequenceFor}"
              presents-label="${this.t.presents}"
              ?still="${this.editMode}"
            ></vhs-blog-tv>
          </vhs-blog-console>
          ${
            rows.length
              ? html`
                  <div class="tower" role="group" aria-label="${this.t.tower}">
                    ${rows.map(
                      (row, r) => html`
                        <h2>
                          ${r === 0 ? this.t.topShelf : this.t.bottomShelf}
                        </h2>
                        <ul class="tape-row">
                          ${row.map((item) => this._renderTape(item))}
                        </ul>
                        <div class="tboard"></div>
                      `,
                    )}
                  </div>
                `
              : nothing
          }
        </div>
        <p class="hint">${playing ? this.t.hintPlaying : this.t.hintIdle}</p>
        <div class="carpet"></div>
      </section>
    `;
  }

  _renderAisles(aisles) {
    return html`
      <main id="shelf" class="peg" tabindex="-1">
        <h1 class="sr-only">${this.siteTitle}</h1>
        ${
          aisles.length
            ? html`<div class="aisles">
                ${aisles.map(
                  (s) => html`
                    <section class="stack" aria-labelledby="${s.id}">
                      <h2 id="${s.id}">${s.label}</h2>
                      <ol>
                        ${s.items.map((item, i) => {
                          const rt = this._readtime(item);
                          return html`
                            <li>
                              <a
                                class="case-link o${i % 4}"
                                href="${item.slug}"
                                @click="${(e) => this._insert(e, item)}"
                              >
                                <span class="sr-only"
                                  >${item.title}${rt ? `, ${rt} ${this.t.minRead}` : ""}</span
                                >
                                <vhs-blog-spine
                                  aria-hidden="true"
                                  case-title="${item.title}"
                                  readtime="${rt}"
                                  ?boxset="${s.box && i === 0}"
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
              </div>`
            : nothing
        }
      </main>
    `;
  }

  _renderPost() {
    const item = this.activeItem || {};
    const title = item.title || "";
    const rt = this._readtime(item);
    const flat = this._flat();
    const index = flat.findIndex((i) => i.id === this.activeId);
    const prev = index > 0 ? flat[index - 1] : null;
    const next = index > -1 && index < flat.length - 1 ? flat[index + 1] : null;
    const dim = this.editMode ? "edit-mode-active" : "";
    return html`
      <div class="post peg">
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
      </div>
    `;
  }

  _renderPagerCase(item, label, cls) {
    const rt = this._readtime(item);
    return html`
      <div class="${cls}">
        <span class="lbl plabel" aria-hidden="true">${label}</span>
        <a
          class="case-link"
          href="${item.slug}"
          @click="${(e) => this._insert(e, item)}"
        >
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
    const showPost = this._showPost();
    const shelf = this._shelf();
    return html`
      <a class="skip-link" href="${showPost ? "#contentcontainer" : "#shelf"}"
        >${this.t.skipToContent}</a
      >
      <header class="sign" part="header">
        <a class="title" href="./" @click="${this._goShelf}"
          >${this.siteTitle}</a
        >
        <site-region name="header"></site-region>
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
      ${this._renderDen(shelf.tower)}
      ${showPost ? this._renderPost() : this._renderAisles(shelf.aisles)}
      ${
        showPost
          ? nothing
          : html`<div id="contentcontainer" hidden>
              <div id="slot"><slot></slot></div>
            </div>`
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
