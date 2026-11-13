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
import "@haxtheweb/retro-tv/lib/retro-vcr.js";
import "@haxtheweb/retro-tv/lib/retro-console.js";
import "@haxtheweb/retro-tv/lib/retro-controller.js";
import {
  retroKitKey,
  retroKitInField,
} from "@haxtheweb/retro-tv/lib/retro-kit.js";
import "./lib/vhs-blog-console.js";
import "./lib/vhs-blog-back.js";
import { KeepcaseTokens } from "./lib/KeepcaseTokens.js";
import { KeepcaseDDDMap } from "./lib/KeepcaseDDDMap.js";
import { activateKeepcaseDesignSystem } from "./lib/KeepcaseDesignSystem.js";

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
// deck timeline (ms) once a cassette is over the open lid: it drops in,
// the lid presses down, then the route changes
const LOAD_INSERT = 380;
const LOAD_PRESS = 1150;
const LOAD_ROUTE = 1500;
// unboxing a tape from the tower (ms): off the shelf and turned to its
// front, tipped open, cassette slides out, cassette flies to the deck
const UNBOX_PULL = 720;
const UNBOX_OPEN = 300;
const UNBOX_SLIDE = 650;
const UNBOX_FLY = 650;
// a carried-in cassette is already over the lid, so the deck starts sooner
const HANDOFF = 320;
// rewind / fast forward between posts, and the reduced motion hold
const SEEK = 900;
const STILL_HOLD = 700;
// the cassette as the VCR draws it, so a flying one can match it
const CASSETTE_W = 310;
const CASSETTE_H = 46;
// tower titles cast on channel 4
const CAST_SIZE = 8;

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
    this.channel = 3;
    this.staticHeld = false;
    this.tvPower = true;
    this.flipped = false;
    this._unbox = null;
    this.__timers = [];
    this.__anims = [];
    this.__run = 0;
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
      hintLoading: "Loading",
      hintStatic: "Channel 4: static. Something keeps tumbling through it.",
      hintChannel: "Channel {channel}: {name}.",
      hintBlocks:
        "Channel 2: HAX Blocks. Grab the blocks before your rivals do: A grabs, B takes one back, Start publishes.",
      tvOn: "Turn the TV on",
      consoleLabel: "HAX 64 console",
      consolePower: "Console power",
      consoleReset: "Reset the game",
      gameController: "Game controller",
      padUp: "Up: grab",
      padDown: "Down: take back",
      padLeft: "Left",
      padRight: "Right",
      padSelect: "Select: remix your fighter",
      padStart: "Start: publish your page",
      padB: "B: take back the last block",
      padA: "A: grab a block",
      skipAnimation: "Skip animation",
      pauseStatic: "Pause static",
      vcr: "VCR",
      topLoad: "Top load",
      clock: "12:00",
      load: "LOAD",
      play: "Play",
      eject: "Eject",
      prev: "Rew",
      prevHint: "previous post",
      skip: "Skip",
      next: "FF",
      nextHint: "next post",
      rewDisplay: "REW",
      ffDisplay: "FF",
      tvOff: "The TV is off",
      changeChannel: "Change channel",
      readPost: "Scroll down to read the post",
      readCue: "READ",
      channelStatic: "Channel 4: static",
      noSignal: "No signal · HAX the web",
      channelKnob: "Channel",
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
      channel: "CH",
      previousCase: "Previous case",
      nextCase: "Next case",
      previousAndNext: "Previous and next",
      boxArt: "Box art",
      showBack: "Show the back of the box",
      frontOfBox: "Front of the box · select it to turn it over",
      backOfBox: "Back of the box · select it to turn it over",
      distributedBy: "Exclusively distributed by",
      publishedWith: "Published with HAXcms",
      qrOpens: "QR code that opens",
    };
    // blocks authored in posts take on Keepcase through the DDD bridge
    activateKeepcaseDesignSystem();
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
      /** tape load state: idle, unbox, lift, open, insert, press, rew, ff, playing */
      phase: { type: String, reflect: true },
      loadingTitle: { type: String },
      /** TV channel: 3 plays the tape, 4 is static */
      channel: { type: Number },
      staticHeld: { type: Boolean, attribute: "static-held" },
      /** the console's power button: the visitor can turn the set off */
      tvPower: { type: Boolean, attribute: "tv-power" },
      /** the box art is turned to its back */
      flipped: { type: Boolean, reflect: true },
      _unbox: { type: Object, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    CHROME_FACES.forEach((f) => vhsBlogLoadFace(f));
    this.__onDenKey = this.__onDenKey || ((e) => this._onDenKey(e));
    globalThis.addEventListener("keydown", this.__onDenKey);
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
    globalThis.removeEventListener("keydown", this.__onDenKey);
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
    this.flipped = false;
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
    (this.__anims || []).forEach((a) => a.cancel());
    this.__anims = [];
    this.__run = (this.__run || 0) + 1;
    this._unbox = null;
  }

  _reduced() {
    return Boolean(
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }

  _route(item) {
    const href = new URL(item.slug, globalThis.document.baseURI).href;
    globalThis.history.pushState(null, null, href);
    globalThis.dispatchEvent(new PopStateEvent("popstate"));
  }

  /** the deck takes over a cassette that is already over its open lid */
  _deck(item, insertAt, pressAt, routeAt) {
    this.phase = "open";
    this.__timers.push(
      setTimeout(() => {
        this.phase = "insert";
      }, insertAt),
      setTimeout(() => {
        this.phase = "press";
      }, pressAt),
      setTimeout(() => this._route(item), routeAt),
    );
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
    this._loadTape(item, e ? e.currentTarget : null);
  }

  /**
   * Play a post. A tape picked from the tower beside the console comes off
   * the shelf in its sleeve, turns to its front, opens, and its cassette
   * flies into the VCR. Anything else (aisles, pager, narrow screens where
   * the tower sits below the console) goes straight into the deck. Reduced
   * motion shows the sleeve where it lands, then plays; edit mode routes.
   */
  _loadTape(item, from) {
    if (!item) {
      return;
    }
    this._clearTimers();
    if (!this.isHome && item.id === this.activeId) {
      this._replay();
      return;
    }
    this.loadingTitle = item.title;
    if (this.editMode) {
      this._route(item);
      return;
    }
    const tape =
      from && from.classList && from.classList.contains("tape")
        ? from
        : this.shadowRoot.querySelector(
            `.tower a.tape[data-id="${globalThis.CSS.escape(item.id)}"]`,
          );
    const tv = this.shadowRoot.querySelector("vhs-blog-tv");
    const tr = tape ? tape.getBoundingClientRect() : null;
    const sr = tv ? tv.getBoundingClientRect() : null;
    // the tower has to be beside the TV and the TV on screen
    const beside =
      tr &&
      sr &&
      tr.left >= sr.right &&
      sr.top >= -sr.height / 2 &&
      sr.bottom <= globalThis.innerHeight + sr.height / 2;
    if (beside) {
      this._unboxTape(item, tr, sr);
      return;
    }
    if (this._reduced()) {
      this._route(item);
      return;
    }
    globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    this._deck(item, LOAD_INSERT, LOAD_PRESS, LOAD_ROUTE);
  }

  _animate(el, keyframes, options) {
    const a = el.animate(keyframes, { fill: "forwards", ...options });
    this.__anims.push(a);
    // a cancelled animation (another tape, skip, a route) just ends the run
    return a.finished.catch(() => null);
  }

  async _unboxTape(item, tr, sr) {
    const run = this.__run;
    const sx = sr.left + sr.width / 2;
    const sy = sr.top + sr.height / 2;
    // the sleeve comes out at the post cover's own size when the TV allows
    const h = Math.round(Math.min(427, sr.height * 0.92));
    const w = Math.round(h * 0.75);
    const still = this._reduced();
    this.loadingTitle = item.title;
    this._unbox = { item, sx, sy, w, h, still };
    this.phase = still ? "lift" : "unbox";
    await this.updateComplete;
    if (still) {
      this.__timers.push(setTimeout(() => this._route(item), STILL_HOLD));
      return;
    }
    const sleeve = this.shadowRoot.querySelector(".fly .sleeve");
    const cas = this.shadowRoot.querySelector(".fly .cas");
    const vcr = this.shadowRoot.querySelector("retro-vcr");
    if (!sleeve || !cas || !vcr) {
      this._route(item);
      return;
    }
    const tilt = "rotateX(-14deg) rotateY(-8deg)";
    const cs = w / CASSETTE_W;
    const out = `translate(0, ${-(h / 2 + 18)}px) scale(${cs})`;
    // 1. off the shelf spine first, turning to show the front
    await this._animate(
      sleeve,
      [
        {
          transform: `translate(${tr.left + tr.width / 2 - sx}px, ${tr.top + tr.height / 2 - sy}px) rotateY(90deg) scale(${tr.height / h})`,
        },
        { transform: "none" },
      ],
      { duration: UNBOX_PULL, easing: "cubic-bezier(0.25, 0.8, 0.3, 1)" },
    );
    if (run !== this.__run) return;
    // 2. tipped back, open end up
    await this._animate(sleeve, [{ transform: "none" }, { transform: tilt }], {
      duration: UNBOX_OPEN,
      easing: "ease-out",
    });
    if (run !== this.__run) return;
    // 3. the cassette slides out of the sleeve
    await this._animate(
      cas,
      [
        { transform: `scale(${cs})`, opacity: 1 },
        { transform: out, opacity: 1 },
      ],
      { duration: UNBOX_SLIDE, easing: "cubic-bezier(0.3, 0.7, 0.3, 1)" },
    );
    if (run !== this.__run) return;
    // 4. lid up; the cassette flies over it and the sleeve drops away
    this.phase = "lift";
    await this.updateComplete;
    const target = vcr.cassetteRect();
    if (!target || run !== this.__run) return;
    this._animate(
      sleeve,
      [
        { transform: tilt, opacity: 1 },
        { transform: "translate(-60px, 560px) scale(0.7)", opacity: 0 },
      ],
      { duration: 550, easing: "cubic-bezier(0.5, 0, 0.8, 0.4)" },
    );
    await this._animate(
      cas,
      [
        { transform: out, opacity: 1 },
        {
          transform: `translate(${target.left + target.width / 2 - sx}px, ${target.top + target.height / 2 - sy}px) scale(${target.width / CASSETTE_W})`,
          opacity: 1,
        },
      ],
      { duration: UNBOX_FLY, easing: "cubic-bezier(0.4, 0.1, 0.2, 1)" },
    );
    if (run !== this.__run) return;
    // 5. the deck takes it from here
    this._unbox = null;
    this._deck(
      item,
      60,
      HANDOFF + LOAD_PRESS - LOAD_INSERT,
      HANDOFF + LOAD_ROUTE - LOAD_INSERT,
    );
  }

  /** jump past whatever is animating straight to the post */
  _skipAnimation() {
    const title = this.loadingTitle;
    const item = this._flat().find((i) => i.title === title);
    this._clearTimers();
    if (item) {
      this._route(item);
    }
  }

  /**
   * Rewind or fast forward to the post before or after this one: the
   * key stays down and the TV runs tracking lines, then the next tape plays.
   */
  _seek(item, dir) {
    this._clearTimers();
    if (!item) {
      return;
    }
    if (this.editMode || this._reduced()) {
      this._route(item);
      return;
    }
    this.loadingTitle = item.title;
    this.phase = dir;
    this.__timers.push(setTimeout(() => this._route(item), SEEK));
  }

  _channel(e) {
    this.channel = e.detail.channel;
    this.staticHeld = false;
  }

  _knob() {
    const tv = this.shadowRoot.querySelector("vhs-blog-tv");
    if (tv) {
      tv.changeChannel();
    }
  }

  _tvPowerChanged(e) {
    this.tvPower = !!(e.detail && e.detail.power);
  }

  /** a controller button: the HAX 64 goes on, then the button plays */
  _onPad(e) {
    const tv = this.shadowRoot.querySelector("vhs-blog-tv");
    if (!tv) {
      return;
    }
    this.tvPower = true;
    if (this.channel !== 2) {
      tv.tune(2);
      return;
    }
    tv.press(e.detail.button);
  }

  _onConsolePower(e) {
    const tv = this.shadowRoot.querySelector("vhs-blog-tv");
    if (tv) {
      this.tvPower = true;
      tv.tune(e.detail.power ? 2 : 3);
    }
  }

  _onConsoleReset() {
    const tv = this.shadowRoot.querySelector("vhs-blog-tv");
    if (tv) {
      tv.reset();
      this.tvPower = true;
      if (this.channel !== 2) {
        tv.tune(2);
      }
    }
  }

  /**
   * A and B light the controller (and play) while HAX Blocks is on, and the
   * arrows do too while focus is in the den; never while typing.
   */
  _onDenKey(e) {
    const k = retroKitKey(e);
    const pad =
      this.shadowRoot && this.shadowRoot.querySelector("retro-controller");
    if (!k || !pad || this.editMode || retroKitInField(e)) {
      return;
    }
    const path = e.composedPath();
    if (path.includes(pad)) {
      return;
    }
    const den = this.shadowRoot.querySelector(".den");
    const playing = this.tvPower && this.channel === 2;
    if (k === "a" || k === "b" ? playing : playing && path.includes(den)) {
      e.preventDefault();
      pad.press(k);
    }
  }

  _toggleStatic() {
    this.staticHeld = !this.staticHeld;
  }

  _flip() {
    this.flipped = !this.flipped;
  }

  _vcrDisabled() {
    if (
      ["unbox", "lift", "open", "insert", "press", "rew", "ff"].includes(
        this.phase,
      )
    ) {
      return "eject rew play skip ff";
    }
    if (this.isHome) {
      return "eject rew skip";
    }
    const flat = this._flat();
    const idx = flat.findIndex((i) => i.id === this.activeId);
    const off = [];
    if (idx <= 0) {
      off.push("rew");
    }
    if (idx === -1 || idx >= flat.length - 1) {
      off.push("ff");
    }
    return off.join(" ");
  }

  _vcrKey(e) {
    const key = e.detail ? e.detail.key : "";
    const flat = this._flat();
    const idx = flat.findIndex((i) => i.id === this.activeId);
    if (key === "eject") {
      this._goShelf();
    } else if (key === "rew" && !this.isHome && idx > 0) {
      this._seek(flat[idx - 1], "rew");
    } else if (key === "ff" || (key === "play" && this.isHome)) {
      if (this.isHome) {
        this._loadTape(this._shelf().tower[0] || flat[0]);
      } else if (idx > -1 && idx < flat.length - 1) {
        this._seek(flat[idx + 1], "ff");
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

  /** the screen was pressed with a post below it: go read it */
  _readPost() {
    const target = this.shadowRoot.querySelector("#contentcontainer");
    if (target) {
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        block: "start",
        behavior: this._reduced() ? "auto" : "smooth",
      });
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
      KeepcaseTokens,
      KeepcaseDDDMap,
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
          /* the set sits close under the header; the VCR is on top of the
             tape tower, so its cassette has headroom there instead */
          padding: 30px var(--ddd-spacing-8) 0;
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
        /* the set and the stand scale with the window's height, so the
           top of the post shows under them on any desktop screen */
        .setup {
          --vhs-den-zoom: 1;
        }
        @media (min-width: 901px) and (max-height: 1300px) {
          .setup {
            --vhs-den-zoom: 0.9;
          }
        }
        @media (min-width: 901px) and (max-height: 1100px) {
          .setup {
            --vhs-den-zoom: 0.8;
          }
        }
        @media (min-width: 901px) and (max-height: 950px) {
          .setup {
            --vhs-den-zoom: 0.7;
          }
        }
        @media (min-width: 901px) and (max-height: 800px) {
          .setup {
            --vhs-den-zoom: 0.6;
          }
        }
        vhs-blog-console {
          flex: 0 1 860px;
          min-width: 0;
          zoom: var(--vhs-den-zoom);
        }
        /* the VCR on top of the tape tower, with headroom above it for a
           cassette waiting over the open lid; never taller than the set */
        .stand {
          flex: 0 1 470px;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding-top: 60px;
          zoom: calc(var(--vhs-den-zoom) * 0.82);
        }
        .stand retro-vcr {
          display: block;
          margin: 0 6px;
        }
        /* the HAX 64 and its controller, in the cubby between the drawers */
        vhs-blog-console retro-console,
        vhs-blog-console retro-controller {
          zoom: 0.8;
        }
        .tower {
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
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-3);
          min-height: 44px;
          text-align: center;
          color: var(--vhs-muted);
          font-size: 16px;
          margin: 0;
          padding: 14px 0 18px;
        }
        .btn[aria-pressed="true"] {
          border-color: var(--vhs-focus);
          color: var(--vhs-focus);
        }

        /* a tape coming off the tower: sleeve and cassette in flight */
        .fly {
          position: fixed;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          perspective: 1400px;
        }
        .fly .sleeve {
          position: absolute;
          transform-style: preserve-3d;
        }
        .fly .fr {
          position: absolute;
          inset: 0;
          transform: translateZ(var(--vhs-depth));
          box-shadow: 0 30px 50px rgba(0, 0, 0, 0.7);
        }
        .fly .sd {
          position: absolute;
          left: 0;
          top: 0;
          width: var(--vhs-depth);
          height: 100%;
          box-sizing: border-box;
          transform-origin: left center;
          transform: rotateY(-90deg);
          background: var(--vhs-case-bg);
          color: var(--vhs-case-ink);
          --vhs-art-bg: var(--vhs-case-bg);
          --vhs-art-ac: var(--vhs-case-accent);
          --vhs-art-ink: var(--vhs-case-ink);
          border-top: 5px solid #121212;
          border-bottom: 5px solid #121212;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }
        .fly .sd .tart {
          flex: none;
          width: 100%;
          height: 58px;
        }
        .fly .sd .vt {
          flex: 1;
          min-height: 0;
          writing-mode: vertical-rl;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 0;
          font-family: var(--vhs-case-family), Impact, sans-serif;
          font-weight: var(--vhs-case-weight);
          text-transform: var(--vhs-case-transform);
          font-size: 20px;
          line-height: 1;
          overflow: hidden;
        }
        .fly .mouth {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: var(--vhs-depth);
          transform-origin: top center;
          transform: rotateX(90deg);
          background: linear-gradient(180deg, #050505, #1b1b1b);
          box-shadow: inset 0 0 0 3px var(--vhs-case-bg);
        }
        .fly .cas {
          position: absolute;
          width: 310px;
          height: 46px;
          box-sizing: border-box;
          border-radius: 4px;
          background: repeating-linear-gradient(
            90deg,
            #161616 0 3px,
            #1f1f1f 3px 6px
          );
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 10px;
          opacity: 0;
        }
        .fly .cas .lbl {
          flex: 1;
          min-width: 0;
          height: 30px;
          background: var(--vhs-case-bg);
          color: var(--vhs-case-ink);
          border: 2px solid #f5f1e8;
          display: flex;
          align-items: center;
          padding: 0 8px;
          font-family: var(--vhs-case-family), Impact, sans-serif;
          font-weight: var(--vhs-case-weight);
          text-transform: var(--vhs-case-transform);
          font-size: 17px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fly .cas .win {
          flex: none;
          width: 44px;
          height: 18px;
          border-radius: 9px;
          background: #2c2c2c;
          box-shadow: inset 0 0 0 2px #444;
        }
        /* reduced motion: the sleeve just appears where it lands */
        .fly.still .sd,
        .fly.still .mouth,
        .fly.still .cas {
          display: none;
        }
        .fly.still .fr {
          transform: none;
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
        /* the box art turns over to its back */
        .flip {
          position: relative;
          perspective: 1600px;
        }
        .card {
          display: grid;
          transform-style: preserve-3d;
        }
        .face {
          grid-area: 1 / 1;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .face-back {
          transform: rotateY(180deg);
        }
        :host([flipped]) .card {
          transform: rotateY(180deg);
        }
        .fliphit {
          position: absolute;
          inset: 0;
          z-index: 1;
          margin: 0;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          border-radius: 8px;
        }
        @media (forced-colors: active) {
          .fliphit {
            border: 2px solid ButtonText;
          }
        }
        .flipnote {
          margin: var(--ddd-spacing-3) 0 0;
          text-align: center;
          font-family: "Archivo Narrow", sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--vhs-muted);
        }
        @media (prefers-reduced-motion: no-preference) {
          .card {
            transition: transform 0.7s cubic-bezier(0.3, 0.7, 0.3, 1);
          }
        }
        /* without motion the box swaps sides with a short fade */
        @media (prefers-reduced-motion: reduce) {
          :host([flipped]) .card,
          .face-back {
            transform: none;
          }
          .face {
            backface-visibility: visible;
            -webkit-backface-visibility: visible;
            transition: opacity 0.15s;
          }
          .face-back,
          :host([flipped]) .face-front {
            opacity: 0;
          }
          :host([flipped]) .face-back {
            opacity: 1;
          }
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

  _caseVars(c) {
    return {
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
    };
  }

  _renderTape(item) {
    const c = vhsBlogCase(item.title);
    vhsBlogLoadFace(c.family);
    const rt = this._readtime(item);
    const vars = {
      ...this._caseVars(c),
      "--vhs-tape-size": this._tapeSize(c, rt) + "px",
    };
    const current = !this.isHome && item.id === this.activeId;
    const loading = this.phase !== "idle" && item.title === this.loadingTitle;
    return html`
      <li>
        <a
          class="tape ${current || loading ? "out" : ""}"
          href="${item.slug}"
          data-id="${item.id}"
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
    const seek = this.phase === "rew" || this.phase === "ff" ? this.phase : "";
    const loading = !["idle", "playing"].includes(this.phase);
    let hint = playing ? this.t.hintPlaying : this.t.hintIdle;
    if (loading) {
      hint = `${this.t.hintLoading} ${this.loadingTitle}…`;
    }
    if (![2, 3, 4].includes(this.channel)) {
      const set =
        this.shadowRoot && this.shadowRoot.querySelector("vhs-blog-tv");
      hint = this.t.hintChannel
        .replace("{channel}", this.channel)
        .replace("{name}", set ? set.programNameFor(this.channel) : "");
    }
    if (this.channel === 4) {
      hint = this.t.hintStatic;
    }
    if (this.channel === 2) {
      hint = this.t.hintBlocks;
    }
    const label = vhsBlogCase(tapeTitle || " ");
    const tapeVars = {
      "--retro-vcr-tape-bg": label.bg,
      "--retro-vcr-tape-ink": label.ink,
      "--retro-vcr-tape-family": `"${label.family}"`,
      "--retro-vcr-tape-weight": String(label.weight),
      "--retro-vcr-tape-transform": label.transform,
      "--retro-vcr-tape-size": "17px",
    };
    return html`
      <section class="den" aria-label="${this.t.console}" part="${dim}">
        <div class="setup">
          <vhs-blog-console
            channel="${this.channel}"
            ?power="${this.tvPower}"
            knob-label="${this.t.channelKnob}"
            power-on-label="${this.t.tvOn}"
            power-off-label="${this.t.tvOff}"
            @vhs-blog-console-knob="${this._knob}"
            @vhs-blog-console-power="${this._tvPowerChanged}"
          >
            <retro-console
              slot="game"
              ?power="${this.tvPower && this.channel === 2}"
              label="${this.t.consoleLabel}"
              power-label="${this.t.consolePower}"
              reset-label="${this.t.consoleReset}"
              .fighters="${tower.slice(0, 4).map((i) => i.title)}"
              @retro-console-power="${this._onConsolePower}"
              @retro-console-reset="${this._onConsoleReset}"
            ></retro-console>
            <retro-controller
              slot="game"
              label="${this.t.gameController}"
              up-label="${this.t.padUp}"
              down-label="${this.t.padDown}"
              left-label="${this.t.padLeft}"
              right-label="${this.t.padRight}"
              select-label="${this.t.padSelect}"
              start-label="${this.t.padStart}"
              b-label="${this.t.padB}"
              a-label="${this.t.padA}"
              @retro-controller-press="${this._onPad}"
            ></retro-controller>
            <vhs-blog-tv
              bare
              tunable
              channel="${this.channel}"
              ?held="${this.staticHeld}"
              seek="${seek}"
              .cast="${tower.slice(0, CAST_SIZE).map((i) => i.title)}"
              change-label="${this.t.changeChannel}"
              static-label="${this.t.channelStatic}"
              off-air-label="${this.t.noSignal}"
              @vhs-blog-tv-channel="${this._channel}"
              @vhs-blog-tv-read="${this._readPost}"
              read-label="${showPost ? this.t.readPost : ""}"
              read-cue="${this.t.readCue}"
              ?off="${!this.tvPower || (this.channel === 3 && !playing)}"
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
          <div class="stand">
            <retro-vcr
              style=${styleMap(tapeVars)}
              keys="eject rew play skip ff"
              phase="${this.phase}"
              tape-label="${tapeTitle}"
              disabled="${this._vcrDisabled()}"
              label="${this.t.vcr}"
              lid-label="${this.t.topLoad}"
              clock-label="${this.t.clock}"
              load-label="${this.t.load}"
              playing-label="${this.t.play}"
              eject-label="${this.t.eject}"
              rew-label="${this.t.prev}"
              rew-hint="${this.t.prevHint}"
              play-label="${this.t.play}"
              skip-label="${this.t.skip}"
              ff-label="${this.t.next}"
              ff-hint="${this.t.nextHint}"
              rew-word="${this.t.rewDisplay}"
              ff-word="${this.t.ffDisplay}"
              @retro-vcr-key="${this._vcrKey}"
            ></retro-vcr>
            ${
              rows.length
                ? html`
                    <div
                      class="tower"
                      role="group"
                      aria-label="${this.t.tower}"
                    >
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
        </div>
        <div class="hint">
          <span role="status">${hint}</span>
          ${
            loading && !this._reduced()
              ? html`<button
                  class="btn"
                  type="button"
                  @click="${this._skipAnimation}"
                >
                  ${this.t.skipAnimation}
                </button>`
              : nothing
          }
          ${
            this.channel === 4 && !this._reduced()
              ? html`<button
                  class="btn"
                  type="button"
                  aria-pressed="${this.staticHeld ? "true" : "false"}"
                  @click="${this._toggleStatic}"
                >
                  ${this.t.pauseStatic}
                </button>`
              : nothing
          }
        </div>
        <div class="carpet"></div>
        ${this._renderFly()}
      </section>
    `;
  }

  /**
   * The sleeve and cassette that travel from the tower to the VCR. Purely
   * visual: the tape link stays the control, and the status line says
   * what is loading.
   */
  _renderFly() {
    const u = this._unbox;
    if (!u) {
      return nothing;
    }
    const c = vhsBlogCase(u.item.title);
    const depth = Math.round(u.w * 0.19);
    const layer = {
      "perspective-origin": `${u.sx}px ${u.sy}px`,
    };
    const sleeve = {
      ...this._caseVars(c),
      left: `${u.sx - u.w / 2}px`,
      top: `${u.sy - u.h / 2}px`,
      width: `${u.w}px`,
      height: `${u.h}px`,
      "--vhs-depth": `${depth}px`,
    };
    const cas = {
      ...this._caseVars(c),
      left: `${u.sx - CASSETTE_W / 2}px`,
      top: `${u.sy - CASSETTE_H / 2}px`,
    };
    return html`
      <div
        class="fly ${u.still ? "still" : ""}"
        style=${styleMap(layer)}
        aria-hidden="true"
      >
        <div class="cas" style=${styleMap(cas)}>
          <span class="win"></span><span class="lbl">${u.item.title}</span
          ><span class="win"></span>
        </div>
        <div class="sleeve" style=${styleMap(sleeve)}>
          <div class="sd">
            <span class="tart art-${c.art}"></span
            ><span class="vt">${u.item.title}</span>
          </div>
          <div class="mouth"></div>
          <div class="fr">
            <vhs-blog-cover
              case-title="${u.item.title}"
              readtime="${this._readtime(u.item)}"
              presenter="${this.siteTitle}"
              presents-label="${this.t.presents}"
              rating-label="${this.t.rating}"
              min-label="${this.t.min}"
            ></vhs-blog-cover>
          </div>
        </div>
      </div>
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
          <aside class="front" aria-label="${this.t.boxArt}" part="${dim}">
            <div class="flip">
              <div class="card">
                <div class="face face-front" ?inert="${this.flipped}">
                  <vhs-blog-cover
                    case-title="${title}"
                    readtime="${rt}"
                    presenter="${this.siteTitle}"
                    presents-label="${this.t.presents}"
                    rating-label="${this.t.rating}"
                    min-label="${this.t.min}"
                    cover-label="${this.t.coverArtFor}"
                  ></vhs-blog-cover>
                </div>
                <div class="face face-back" ?inert="${!this.flipped}">
                  <vhs-blog-back
                    case-title="${title}"
                    description="${item.description || ""}"
                    url="${item.slug ? new URL(item.slug, globalThis.document.baseURI).href : ""}"
                    readtime="${rt}"
                    presenter="${this.siteTitle}"
                    distributed-label="${this.t.distributedBy}"
                    running-time-label="${this.t.runningTime}"
                    min-label="${this.t.min}"
                    published-label="${this.t.publishedWith}"
                    qr-label="${this.t.qrOpens}"
                  ></vhs-blog-back>
                </div>
              </div>
              <button
                class="fliphit"
                type="button"
                aria-pressed="${this.flipped ? "true" : "false"}"
                @click="${this._flip}"
              >
                <span class="sr-only">${this.t.showBack}</span>
              </button>
            </div>
            <p class="flipnote">
              ${this.flipped ? this.t.backOfBox : this.t.frontOfBox}
            </p>
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
