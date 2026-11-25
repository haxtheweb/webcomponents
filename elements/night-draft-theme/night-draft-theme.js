/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import {
  HAXCMSLitElementTheme,
  css,
  html,
  svg,
  unsafeCSS,
  store,
  autorun,
  toJS,
} from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { loadFontFamily } from "@haxtheweb/d-d-d/lib/fonts.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

// Scratch-outs: three loose marker strokes drawn over struck text
const SCRIBBLE =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40" preserveAspectRatio="none"><g fill="none" stroke="#141414" stroke-opacity="0.62" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="5" d="M2 22 C14 12 22 30 34 19 S56 10 66 23 S88 31 98 17 S112 14 118 21"/><path stroke-width="3.5" d="M3 15 C18 25 27 9 41 17 S60 29 74 14 S95 10 104 24 S115 26 118 12"/><path stroke-width="4" d="M1 28 C20 20 30 33 46 25 S70 15 84 28 S104 30 119 24"/></g></svg>',
  );

/**
 * A url() for CSS from an authored image path, or "" when the path holds
 * characters that would end the url() early.
 */
function cssUrl(value) {
  if (typeof value !== "string" || value === "") {
    return "";
  }
  if (/["'\\()\s<>]/.test(value)) {
    return "";
  }
  return `url("${value}")`;
}

/**
 * `night-draft-theme`
 * A dark blogging theme about a writer at a typewriter, at night. The home
 * page is a lamp-lit desk with the posts' titles floating over it; choosing
 * one flashes to that post's darkened banner, where an arrow nudges down to
 * the letter typed onto paper, title and date at the foot of the page. A
 * black footer goes straight to the next letter. Struck text (s, strike,
 * del) is scratched out with marker but stays in the page. With reduced
 * motion the page is already typed and nothing flashes, flickers or bobs.
 *
 * @title Night Draft
 * @haxcms-theme-category Blog, Portfolio
 * @haxcms-theme-layout Single column
 * @haxcms-theme-description A dark blog: posts typed onto paper under a desk lamp, scratched-out words left in
 * @haxcms-theme-priority 30
 * @demo demo/index.html
 * @element night-draft-theme
 */
class NightDraftTheme extends DDDSuper(HAXCMSLitElementTheme) {
  static get tag() {
    return "night-draft-theme";
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      skipToContent: "Skip to the letter",
      letters: "Letters",
      chooseHint: "Up and down to choose, Enter to read",
      read: "Read the letter",
      readDesk: "Read the note on the desk",
      finishTyping: "Finish typing",
      backTo: "Back to",
      nextLetter: "Next letter",
      scratchedOut: "scratched out:",
    };
    I18NManagerStore.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/night-draft-theme.en.json", import.meta.url).href +
        "/../",
    });
    this.items = [];
    this.activeId = null;
    this.activeItem = {};
    this.siteTitle = "";
    this.selected = 0;
    this.flashing = false;
    this.typingDone = false;
    this.reducedMotion = false;
    this.__typed = new Set();
    this.__lines = [];
    this.__line = 0;
    this.__x = 0;
    this.__pause = 0;
    this.__raf = null;
    this.__started = false;
    this.__fromDesk = false;
    this.__lastLetter = null;
    this.__motionQuery = globalThis.matchMedia
      ? globalThis.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    this.reducedMotion = this.__motionQuery
      ? this.__motionQuery.matches
      : false;
    this.__onMotionChange = (e) => {
      this.reducedMotion = e.matches;
      if (e.matches) {
        // someone turned motion off mid-page: show it all now
        this.flashing = false;
        this._finish();
      }
    };
    this.__onResize = () => this._measure();
    this.__onScroll = () => this._catchUp();
    this.__disposers = [];
  }

  static get properties() {
    return {
      ...super.properties,
      items: { type: Array },
      activeId: { type: String },
      activeItem: { type: Object },
      siteTitle: { type: String },
      selected: { type: Number },
      flashing: { type: Boolean, reflect: true },
      typingDone: { type: Boolean, reflect: true, attribute: "typing-done" },
      reducedMotion: {
        type: Boolean,
        reflect: true,
        attribute: "reduced-motion",
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    // typewriter text and the banner's bold titles, served by HAX (d-d-d)
    loadFontFamily("Special Elite");
    loadFontFamily("Oswald");
    if (this.__motionQuery && this.__motionQuery.addEventListener) {
      this.__motionQuery.addEventListener("change", this.__onMotionChange);
    }
    globalThis.addEventListener("resize", this.__onResize);
    globalThis.addEventListener("scroll", this.__onScroll, { passive: true });
    this.__disposers.push(
      autorun(() => {
        const manifest = toJS(store.manifest);
        this.items = manifest && manifest.items ? manifest.items : [];
        this.siteTitle = manifest && manifest.title ? manifest.title : "";
      }),
    );
    this.__disposers.push(
      autorun(() => {
        const item = toJS(store.activeItem);
        const id = toJS(store.activeId);
        Promise.resolve().then(() => this._activeChanged(item, id));
      }),
    );
  }

  disconnectedCallback() {
    if (this.__motionQuery && this.__motionQuery.removeEventListener) {
      this.__motionQuery.removeEventListener("change", this.__onMotionChange);
    }
    globalThis.removeEventListener("resize", this.__onResize);
    globalThis.removeEventListener("scroll", this.__onScroll);
    if (this.__io) {
      this.__io.disconnect();
    }
    globalThis.cancelAnimationFrame(this.__raf);
    for (const dispose of this.__disposers) {
      dispose();
    }
    this.__disposers = [];
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // the editor needs the whole page: no typing while editing
    if (changedProperties.has("editMode") && this.editMode) {
      this._finish();
    }
  }

  // ---------- the posts ----------
  /** every page but the first (the desk) is a letter */
  get posts() {
    return this.items.length > 1 ? this.items.slice(1) : this.items;
  }

  get isHome() {
    return (
      !this.activeItem ||
      !this.activeItem.id ||
      (this.items.length > 0 && this.activeItem.id === this.items[0].id)
    );
  }

  get nextItem() {
    const posts = this.posts;
    if (!posts.length) {
      return null;
    }
    if (this.isHome) {
      return posts[0];
    }
    const i = posts.findIndex((p) => p.id === this.activeItem.id);
    return posts[(i + 1) % posts.length];
  }

  _timestamp(item) {
    const m = item && item.metadata ? item.metadata : {};
    return m.created || m.updated || 0;
  }

  _date(item) {
    const ts = this._timestamp(item);
    if (!ts) {
      return "";
    }
    const lang = globalThis.document.documentElement.lang || undefined;
    try {
      return new Date(ts * 1000).toLocaleDateString(lang, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return new Date(ts * 1000).toLocaleDateString();
    }
  }

  _iso(item) {
    const ts = this._timestamp(item);
    return ts ? new Date(ts * 1000).toISOString().slice(0, 10) : "";
  }

  _activeChanged(item, id) {
    const changed = this.activeId !== id;
    this.activeItem = item || {};
    this.activeId = id;
    if (!changed) {
      return;
    }
    // a letter opens at its banner, instantly
    globalThis.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (this.__fromDesk && !this.isHome && !this.reducedMotion) {
      this.flashing = false;
      this.updateComplete.then(() => {
        this.flashing = true;
        setTimeout(() => {
          this.flashing = false;
        }, 700);
      });
    }
    this.__fromDesk = false;
    if (this.isHome) {
      const i = this.posts.findIndex((p) => p.id === this.__lastLetter);
      this.selected = i > -1 ? i : 0;
    } else {
      this.__lastLetter = id;
    }
    this._resetTyping();
  }

  // ---------- the desk: choosing a letter ----------
  _select(i, focus) {
    const n = this.posts.length;
    if (!n) {
      return;
    }
    this.selected = (i + n) % n;
    this.updateComplete.then(() => {
      const list = this.shadowRoot.querySelector(".titles");
      const li = list ? list.children[this.selected] : null;
      if (!list || !li) {
        return;
      }
      list.scrollTo({
        top: li.offsetTop - list.clientHeight / 2 + li.offsetHeight / 2,
        behavior: this.reducedMotion ? "auto" : "smooth",
      });
      if (focus) {
        li.querySelector("a").focus({ preventScroll: true });
      }
    });
  }

  _titlesKey(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      this._select(this.selected + (e.key === "ArrowDown" ? 1 : -1), true);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      this._select(e.key === "Home" ? 0 : this.posts.length - 1, true);
    }
  }

  _toPaper(e) {
    if (e) {
      e.preventDefault();
    }
    const paper = this.shadowRoot.querySelector("#paper");
    const start = this.shadowRoot.querySelector("#start");
    if (paper) {
      paper.scrollIntoView({
        behavior: this.reducedMotion ? "auto" : "smooth",
      });
    }
    if (start) {
      start.focus({ preventScroll: true });
    }
  }

  // ---------- the typewriter ----------
  _resetTyping() {
    globalThis.cancelAnimationFrame(this.__raf);
    this.__raf = null;
    this.__line = 0;
    this.__x = 0;
    this.__pause = 0;
    this.__lines = [];
    this.__started = false;
    this.typingDone =
      this.reducedMotion || !!this.editMode || this.__typed.has(this.activeId);
    this.updateComplete.then(() => {
      this._paint();
      // fonts change where lines break, so measure once they are in
      const ready =
        globalThis.document.fonts && globalThis.document.fonts.ready
          ? globalThis.document.fonts.ready
          : Promise.resolve();
      ready.then(() => setTimeout(() => this._measure(), 120));
    });
  }

  /** the content's lines, from the text's own line boxes */
  _measure() {
    if (this.typingDone) {
      return;
    }
    const box =
      this.shadowRoot && this.shadowRoot.querySelector("#contentcontainer");
    if (!box) {
      return;
    }
    const base = box.getBoundingClientRect();
    const rects = [];
    for (const node of Array.from(this.children)) {
      if (node.nodeType !== 1 || node.slot) {
        continue;
      }
      const range = globalThis.document.createRange();
      range.selectNodeContents(node);
      const list = Array.from(range.getClientRects()).filter(
        (x) => x.width > 0.5 && x.height > 4,
      );
      if (!list.length) {
        const b = node.getBoundingClientRect();
        if (b.width > 0 && b.height > 0) {
          list.push(b);
        }
      }
      for (const x of list) {
        rects.push({
          top: x.top - base.top,
          bottom: x.bottom - base.top,
          left: x.left - base.left,
          right: x.right - base.left,
        });
      }
    }
    rects.sort((a, b) => a.top - b.top);
    const lines = [];
    for (const r of rects) {
      const last = lines[lines.length - 1];
      const overlap = last
        ? Math.min(last.bottom, r.bottom) - Math.max(last.top, r.top)
        : -1;
      if (
        last &&
        overlap > 0.5 * Math.min(last.bottom - last.top, r.bottom - r.top)
      ) {
        last.top = Math.min(last.top, r.top);
        last.bottom = Math.max(last.bottom, r.bottom);
        last.left = Math.min(last.left, r.left);
        last.right = Math.max(last.right, r.right);
      } else {
        lines.push({ ...r });
      }
    }
    this.__lines = lines;
    this.__w = base.width;
    this.__h = base.height;
    if (this.__line >= lines.length) {
      this.__line = Math.max(0, lines.length - 1);
    }
    if (!lines.length) {
      // nothing to type yet (content still arriving) or an empty page:
      // show the page, and type it if content arrives (slotchange)
      this.typingDone = true;
      return;
    }
    if (!this.__io) {
      this.__io = new IntersectionObserver(
        (entries) => {
          if (entries.some((en) => en.isIntersecting)) {
            this._start();
          }
        },
        { threshold: 0.02 },
      );
    }
    this.__io.disconnect();
    this.__io.observe(box);
    this._paint();
  }

  _start() {
    if (this.typingDone || this.__started || !this.__lines.length) {
      return;
    }
    this.__started = true;
    this.__x = this.__lines[0].left;
    let last = null;
    // px per ms: a little over forty keystrokes a second
    const speed = 0.5;
    const tick = (t) => {
      if (this.typingDone) {
        return;
      }
      const dt = last === null ? 0 : Math.min(48, t - last);
      last = t;
      if (this.__pause > 0) {
        this.__pause -= dt;
      } else {
        const line = this.__lines[this.__line];
        this.__x += dt * speed;
        if (!line || this.__x >= line.right) {
          this.__line += 1;
          if (this.__line >= this.__lines.length) {
            this._finish();
            return;
          }
          this.__x = this.__lines[this.__line].left;
          // carriage return
          this.__pause = 130;
        }
      }
      this._paint();
      this.__raf = globalThis.requestAnimationFrame(tick);
    };
    this.__raf = globalThis.requestAnimationFrame(tick);
  }

  /** a reader who scrolls ahead does not wait for the typing to reach them */
  _catchUp() {
    if (this.typingDone || !this.__started || !this.__lines.length) {
      return;
    }
    const box = this.shadowRoot.querySelector("#contentcontainer");
    const top = box.getBoundingClientRect().top;
    const view = globalThis.innerHeight * 0.35;
    let i = this.__line;
    while (i < this.__lines.length - 1 && top + this.__lines[i].bottom < view) {
      i++;
    }
    if (i !== this.__line) {
      this.__line = i;
      this.__x = this.__lines[i].left;
      this._paint();
    }
  }

  _finish() {
    globalThis.cancelAnimationFrame(this.__raf);
    this.__raf = null;
    this.typingDone = true;
    if (this.activeId) {
      this.__typed.add(this.activeId);
    }
    this._paint();
  }

  _paint() {
    const cover = this.shadowRoot && this.shadowRoot.querySelector(".cover");
    const caret = this.shadowRoot && this.shadowRoot.querySelector(".caret");
    if (!cover || !caret) {
      return;
    }
    if (this.typingDone) {
      cover.style.clipPath = "";
      return;
    }
    const line = this.__lines[this.__line];
    if (!line) {
      cover.style.clipPath = "none";
      caret.style.transform = "translate(0, 0)";
      return;
    }
    const w = Math.max(this.__w || 0, line.right) + 4;
    const h = Math.max(this.__h || 0, line.bottom) + 4;
    const x = Math.round(this.__x);
    cover.style.clipPath = `polygon(${x}px ${line.top}px, ${w}px ${line.top}px, ${w}px ${h}px, 0px ${h}px, 0px ${line.bottom}px, ${x}px ${line.bottom}px)`;
    caret.style.height = `${line.bottom - line.top}px`;
    caret.style.transform = `translate(${x}px, ${line.top}px)`;
  }

  // ---------- page content: typed ink and scratch-outs ----------
  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        night-draft-theme :is(s, strike, del) {
          text-decoration-line: line-through;
          text-decoration-style: wavy;
          text-decoration-thickness: 0.14em;
          text-decoration-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-coalyGray)
          );
          text-decoration-skip-ink: none;
          color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-limestoneGray)
          );
          background-color: transparent;
          background-image: var(--night-draft-scribble);
          background-repeat: repeat-x;
          background-size: 2.6em 1.05em;
          background-position: 0 58%;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
          padding: var(--ddd-spacing-0) 0.1em;
        }
        night-draft-theme :is(s, strike, del)::before,
        night-draft-theme :is(s, strike, del)::after {
          position: absolute;
          clip-path: inset(50%);
          width: 1px;
          height: 1px;
          overflow: hidden;
          white-space: nowrap;
        }
        night-draft-theme :is(s, strike, del)::before {
          content: " [" var(--night-draft-scratched-out) " ";
        }
        night-draft-theme :is(s, strike, del)::after {
          content: "] ";
        }
        night-draft-theme > :is(p, ul, ol, blockquote, h2, h3, h4, h5, h6) {
          font-family: var(--night-draft-type);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-coalyGray)
          );
          font-size: var(--ddd-font-size-3xs);
          line-height: 2;
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) 2em;
        }
        night-draft-theme > :is(h2, h3, h4, h5, h6) {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: var(--ddd-font-weight-regular);
        }
        night-draft-theme a {
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-coalyGray)
          );
          text-decoration-thickness: 2px;
        }
      `,
    ];
  }

  // ---------- art ----------
  _deskArt() {
    return svg`<svg class="art" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="pool" cx="0.42" cy="0.86" r="0.45">
          <stop offset="0" class="pool-1" stop-opacity="0.42"/>
          <stop offset="0.45" class="pool-2" stop-opacity="0.22"/>
          <stop offset="1" class="pool-3" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" class="beam" stop-opacity="0.28"/>
          <stop offset="1" class="beam" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect class="wall" width="1600" height="900"/>
      <path class="desktop" d="M120 640 L1480 640 L1600 900 L0 900 Z"/>
      <path class="edge" d="M120 640 L1480 640"/>
      <g class="glow">
        <path d="M250 390 L120 900 L1050 900 L380 390 Z" fill="url(#cone)"/>
        <rect width="1600" height="900" fill="url(#pool)"/>
      </g>
      <g transform="translate(-150 70)">
        <ellipse class="iron" cx="330" cy="742" rx="96" ry="22"/>
        <rect class="iron" x="318" y="520" width="20" height="222"/>
        <path class="arm" d="M328 528 L440 360"/>
        <path class="shade" d="M380 300 L560 352 L520 404 L360 352 Z"/>
        <path class="bulb" d="M392 350 L522 394"/>
      </g>
      <path class="crumple" d="M1210 760 l40 -22 l34 12 l12 34 l-30 26 l-44 -6 l-18 -24 z"/>
      <path class="crumple-line" d="M1230 752 l22 14 l20 -8 M1240 790 l18 -16"/>
      <path class="crumple dark" d="M1320 800 l30 -18 l28 10 l8 26 l-26 20 l-34 -6 z"/>
      <rect class="mug" x="1080" y="640" width="70" height="86" rx="8"/>
      <path class="mug-handle" d="M1150 660 q34 0 34 26 q0 26 -34 26"/>
      <ellipse class="coffee" cx="1115" cy="642" rx="35" ry="9"/>
      <g class="typewriter" transform="translate(960 735) scale(0.74) translate(-810 -560)">
        <rect class="sheet-art" x="660" y="370" width="300" height="190"/>
        <g class="typed">
          <rect x="690" y="404" width="210" height="6"/><rect x="690" y="430" width="236" height="6"/>
          <rect x="690" y="456" width="168" height="6"/><rect x="690" y="482" width="220" height="6"/>
          <rect x="690" y="508" width="96" height="6"/>
        </g>
        <rect class="iron" x="580" y="540" width="460" height="46" rx="22"/>
        <rect class="knob" x="548" y="552" width="40" height="22" rx="6"/>
        <rect class="knob" x="1032" y="552" width="40" height="22" rx="6"/>
        <path class="body" d="M600 584 L1020 584 L1080 720 L540 720 Z"/>
        <path class="base" d="M540 720 L1080 720 L1094 760 L526 760 Z"/>
        <g class="keys">
          ${[0, 1, 2, 3].map((row) =>
            Array.from({ length: row === 3 ? 9 : 11 }, (_, k) => {
              const off = row * 10 + (row === 3 ? 40 : 0);
              return svg`<circle cx="${640 + off + k * 34 - row * 6}" cy="${616 + row * 26}" r="9.5"/>`;
            }),
          )}
        </g>
        <rect class="spacebar" x="700" y="732" width="220" height="16" rx="8"/>
        <rect class="knob" x="560" y="532" width="500" height="10"/>
      </g>
    </svg>`;
  }

  _platen() {
    return svg`<svg viewBox="0 0 800 70" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <rect class="knob" x="0" y="16" width="34" height="38" rx="8"/>
      <rect class="knob" x="766" y="16" width="34" height="38" rx="8"/>
      <rect class="iron" x="28" y="8" width="744" height="54" rx="27"/>
      <rect class="shine" x="28" y="16" width="744" height="10" rx="5"/>
      <rect class="bail" x="60" y="54" width="680" height="7"/>
    </svg>`;
  }

  // ---------- render ----------
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color-scheme: dark;
          min-height: 100vh;
          --night-draft-room: light-dark(
            var(--ddd-theme-default-black),
            var(--ddd-theme-default-black)
          );
          --night-draft-paper: light-dark(
            var(--ddd-theme-default-shrineMaxLight),
            var(--ddd-theme-default-shrineMaxLight)
          );
          --night-draft-ink: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-coalyGray)
          );
          --night-draft-moon: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-limestoneMaxLight)
          );
          --night-draft-dim: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-limestoneGray)
          );
          --night-draft-ember: light-dark(
            var(--ddd-theme-default-discoveryCoral),
            var(--ddd-theme-default-discoveryCoral)
          );
          --night-draft-lamp: light-dark(
            var(--ddd-theme-default-roarGolden),
            var(--ddd-theme-default-roarGolden)
          );
          --night-draft-iron: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-coalyGray)
          );
          --night-draft-type:
            "Special Elite", "Courier Prime", "Courier New", monospace;
          --night-draft-display:
            "Oswald", "Impact", "Arial Narrow", var(--ddd-font-navigation);
          background-color: var(--night-draft-room);
          color: var(--night-draft-moon);
          font-family: var(--night-draft-type);
        }
        .titles a,
        .hint,
        .sig,
        .finish,
        .next .lbl {
          font-family: var(--night-draft-type);
        }
        a:focus-visible,
        button:focus-visible,
        .start:focus-visible {
          outline: 3px solid var(--night-draft-lamp);
          outline-offset: 4px;
        }
        .start {
          position: absolute;
          clip-path: inset(50%);
          width: 1px;
          height: 1px;
          overflow: hidden;
          white-space: nowrap;
        }

        /* the room: the desk (home) or a letter's banner */
        .room {
          position: relative;
          height: 100vh;
          height: 100dvh;
          min-height: 520px;
          overflow: hidden;
          background-color: var(--night-draft-room);
          display: grid;
          place-items: center;
        }
        :host([edit-mode]) .room {
          height: 40vh;
          min-height: 280px;
        }
        .art {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .art .wall {
          fill: var(--night-draft-room);
        }
        .art .desktop {
          fill: var(--night-draft-iron);
          opacity: 0.55;
        }
        .art .edge {
          stroke: var(--night-draft-iron);
          stroke-width: 3;
        }
        .art .pool-1,
        .art .beam {
          stop-color: var(--ddd-theme-default-roarLight);
        }
        .art .pool-2 {
          stop-color: var(--ddd-theme-default-roarGolden);
        }
        .art .pool-3 {
          stop-color: var(--ddd-theme-default-black);
        }
        .art .iron,
        .art .body,
        .art .shade,
        .art .mug {
          fill: var(--night-draft-iron);
        }
        .art .base,
        .art .coffee {
          fill: var(--ddd-theme-default-black);
        }
        .art .arm,
        .art .mug-handle {
          fill: none;
          stroke: var(--night-draft-iron);
          stroke-width: 14;
          stroke-linecap: round;
        }
        .art .bulb {
          stroke: var(--ddd-theme-default-roarLight);
          stroke-width: 6;
        }
        .art .knob,
        .art .crumple-line {
          fill: var(--ddd-theme-default-limestoneGray);
          opacity: 0.35;
          stroke: none;
        }
        .art .crumple {
          fill: var(--ddd-theme-default-limestoneGray);
          opacity: 0.3;
        }
        .art .crumple.dark {
          opacity: 0.2;
        }
        .art .sheet-art,
        .art .keys,
        .art .spacebar {
          fill: var(--ddd-theme-default-limestoneLight);
        }
        .art .typed {
          fill: var(--night-draft-iron);
        }
        .glow {
          animation: night-draft-lamp 7s infinite;
        }
        @keyframes night-draft-lamp {
          0%,
          61%,
          66%,
          100% {
            opacity: 1;
          }
          62% {
            opacity: 0.72;
          }
          64% {
            opacity: 0.9;
          }
        }
        .desk-copy {
          position: relative;
          z-index: 1;
          align-self: start;
          width: min(100% - 2 * var(--ddd-spacing-6), 760px);
          margin-top: 6vh;
          text-align: center;
        }
        .desk-copy::before {
          content: "";
          position: absolute;
          inset: -10% -20%;
          z-index: -1;
          background: radial-gradient(
            ellipse at center,
            var(--night-draft-room),
            transparent 70%
          );
          pointer-events: none;
        }
        .site {
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-2);
          font-family: var(--night-draft-display);
          font-weight: var(--ddd-font-weight-bold);
          font-size: clamp(28px, 4.2vw, 44px);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--night-draft-moon);
        }
        .hint {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
          color: var(--night-draft-dim);
        }
        .titles {
          position: relative;
          list-style: none;
          margin: var(--ddd-spacing-0);
          padding: 12vh var(--ddd-spacing-0);
          max-height: 36vh;
          overflow-y: auto;
          scrollbar-width: none;
          overscroll-behavior: contain;
          -webkit-mask-image: linear-gradient(
            transparent,
            black 30%,
            black 70%,
            transparent
          );
          mask-image: linear-gradient(
            transparent,
            black 30%,
            black 70%,
            transparent
          );
        }
        .titles::-webkit-scrollbar {
          display: none;
        }
        .titles a {
          display: block;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          min-height: 24px;
          text-decoration: none;
          color: var(--night-draft-dim);
          transition:
            color 0.2s,
            transform 0.2s;
        }
        .titles .t {
          display: block;
          font-size: clamp(20px, 2.6vw, 28px);
          line-height: var(--ddd-lh-120);
        }
        .titles .d {
          display: block;
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.08em;
        }
        .titles .sel a {
          color: var(--night-draft-moon);
          transform: scale(1.06);
        }
        .titles .sel .t {
          text-decoration: underline;
          text-decoration-color: var(--night-draft-lamp);
          text-decoration-thickness: 2px;
          text-underline-offset: 6px;
        }
        .titles .sel .t::before,
        .titles .sel .t::after {
          content: "\\2014";
          color: var(--night-draft-lamp);
          padding: var(--ddd-spacing-0) 0.4em;
        }

        .banner {
          background-size: cover;
          background-position: center;
        }
        .banner::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            color-mix(in srgb, var(--ddd-theme-default-black) 62%, transparent),
            color-mix(in srgb, var(--ddd-theme-default-black) 86%, transparent)
              75%
          );
        }
        .banner-copy {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: var(--ddd-spacing-0) var(--ddd-spacing-6);
        }
        .banner h1 {
          margin: var(--ddd-spacing-0);
          font-family: var(--night-draft-display);
          font-weight: var(--ddd-font-weight-bold);
          text-transform: uppercase;
          font-size: clamp(44px, 10vw, 140px);
          line-height: 0.95;
          color: var(--night-draft-ember);
          text-shadow: 0 2px 18px var(--ddd-theme-default-black);
        }
        .banner .when {
          display: block;
          margin-top: var(--ddd-spacing-6);
          font-family: var(--night-draft-display);
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--night-draft-ember);
          text-shadow: 0 1px 8px var(--ddd-theme-default-black);
        }
        .flash {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          background-color: var(--night-draft-moon);
          opacity: 0;
        }
        :host([flashing]) .flash {
          animation: night-draft-flash 0.7s ease-out;
        }
        @keyframes night-draft-flash {
          0% {
            opacity: 0.95;
          }
          30% {
            opacity: 0.4;
          }
          100% {
            opacity: 0;
          }
        }
        .nudge {
          position: absolute;
          z-index: 2;
          bottom: var(--ddd-spacing-8);
          left: 50%;
          translate: -50% 0;
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: var(--ddd-radius-circle);
          border: var(--ddd-border-sm);
          border-color: var(--night-draft-moon);
          background-color: var(--night-draft-room);
          color: var(--night-draft-moon);
          cursor: pointer;
          animation: night-draft-nudge 1.8s ease-in-out infinite;
          --simple-icon-width: 32px;
          --simple-icon-height: 32px;
        }
        .nudge:hover {
          border-color: var(--night-draft-lamp);
          color: var(--night-draft-lamp);
        }
        .nudge:active {
          scale: 0.92;
        }
        @keyframes night-draft-nudge {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(10px);
          }
        }

        /* the paper */
        main {
          overflow-x: clip;
          padding: var(--ddd-spacing-16) var(--ddd-spacing-4)
            var(--ddd-spacing-20);
          background-color: var(--night-draft-room);
        }
        #paper {
          position: relative;
          max-width: 760px;
          margin: var(--ddd-spacing-0) auto;
        }
        .platen {
          position: relative;
          z-index: 2;
          height: 54px;
          margin: var(--ddd-spacing-0) -28px -18px;
        }
        .platen svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .platen .knob {
          fill: var(--night-draft-iron);
        }
        .platen .iron {
          fill: var(--ddd-theme-default-black);
        }
        .platen .shine,
        .platen .bail {
          fill: var(--ddd-theme-default-limestoneGray);
          opacity: 0.35;
        }
        .sheet {
          position: relative;
          background-color: var(--night-draft-paper);
          color: var(--night-draft-ink);
          padding: var(--ddd-spacing-16) clamp(20px, 7vw, 72px)
            var(--ddd-spacing-10);
          box-shadow: var(--ddd-boxShadow-xl);
          animation: night-draft-feed 1.1s ease-out both;
          --night-draft-scribble: url("${unsafeCSS(SCRIBBLE)}");
        }
        @keyframes night-draft-feed {
          from {
            transform: translateY(-36px);
            clip-path: inset(0 0 92% 0);
          }
          to {
            transform: none;
            clip-path: inset(0 0 0 0);
          }
        }
        .typing {
          position: relative;
        }
        #contentcontainer {
          position: relative;
          min-height: 6em;
        }
        .cover {
          position: absolute;
          inset: -2px -4px 0 -4px;
          z-index: 2;
          background-color: var(--night-draft-paper);
          pointer-events: none;
        }
        .caret {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 2;
          width: 0.6em;
          background-color: var(--night-draft-ink);
          opacity: 0.85;
          pointer-events: none;
        }
        :host([typing-done]) .cover,
        :host([typing-done]) .caret,
        :host([typing-done]) .finish,
        :host([edit-mode]) .cover,
        :host([edit-mode]) .caret,
        :host([edit-mode]) .finish {
          display: none;
        }
        .finish {
          position: absolute;
          top: var(--ddd-spacing-4);
          right: var(--ddd-spacing-4);
          z-index: 4;
          min-height: 32px;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
          color: var(--night-draft-ink);
          background-color: var(--night-draft-paper);
          border: var(--ddd-border-sm);
          border-color: var(--night-draft-ink);
          cursor: pointer;
        }
        .finish:hover {
          background-color: var(--night-draft-ink);
          color: var(--night-draft-paper);
        }
        .finish:active {
          translate: 0 2px;
        }
        .sig {
          position: relative;
          margin-top: var(--ddd-spacing-12);
          padding-top: var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs);
          border-top-style: dashed;
          border-top-color: var(--night-draft-ink);
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-6);
          justify-content: space-between;
          font-size: var(--ddd-font-size-4xs);
          color: var(--night-draft-ink);
        }
        .sig p {
          margin: var(--ddd-spacing-0);
        }
        .sig .ttl {
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        /* the black footer: the next letter */
        .next {
          background-color: var(--night-draft-room);
          border-top: var(--ddd-border-xs);
          border-top-color: var(--night-draft-iron);
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-4);
          justify-content: space-between;
          align-items: center;
          padding: var(--ddd-spacing-6) clamp(16px, 5vw, 64px);
        }
        .next a {
          color: var(--night-draft-moon);
          text-decoration: none;
          min-height: 44px;
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-color: transparent;
        }
        .next a:hover {
          border-color: var(--night-draft-lamp);
        }
        .next .lbl {
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--night-draft-dim);
        }
        .next .to {
          font-family: var(--night-draft-display);
          font-weight: var(--ddd-font-weight-bold);
          font-size: clamp(22px, 3vw, 32px);
          text-transform: uppercase;
        }
        .next .fwd {
          text-align: right;
          margin-left: auto;
        }
        @media (hover: none) {
          .hint {
            display: none;
          }
        }
        @media (max-width: 600px) {
          .platen {
            margin: var(--ddd-spacing-0) -10px -18px;
          }
        }
        /* reduced motion: nothing flickers, bobs, flashes, feeds or types */
        :host([reduced-motion]) .glow,
        :host([reduced-motion]) .nudge,
        :host([reduced-motion]) .sheet,
        :host([reduced-motion]) .flash {
          animation: none;
        }
        :host([reduced-motion]) .titles a {
          transition: none;
        }
        :host([reduced-motion]) .titles .sel a {
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .glow,
          .nudge,
          .sheet,
          .flash,
          :host([flashing]) .flash {
            animation: none;
          }
          .titles a {
            transition: none;
          }
          .titles .sel a {
            transform: none;
          }
        }
      `,
    ];
  }

  render() {
    const home = this.isHome;
    const item = this.activeItem || {};
    const next = this.nextItem;
    const image = cssUrl(
      item.metadata && item.metadata.image ? item.metadata.image : "",
    );
    const desk = this.items.length ? this.items[0] : null;
    return html`
      <a class="skip-link" href="#contentcontainer">${this.t.skipToContent}</a>
      ${
        home
          ? html`<header class="room desk">
              ${this._deskArt()}
              <div class="desk-copy">
                ${
                  this.siteTitle
                    ? html`<h1 class="site">${this.siteTitle}</h1>`
                    : ""
                }
                <p class="hint">${this.t.chooseHint}</p>
                <nav aria-label="${this.t.letters}">
                  <ol class="titles" @keydown="${this._titlesKey}">
                    ${this.posts.map(
                      (p, i) =>
                        html`<li class="${i === this.selected ? "sel" : ""}">
                          <a
                            href="${p.slug}"
                            @mouseenter="${() => this._select(i)}"
                            @focus="${() => this._select(i)}"
                            @click="${() => {
                              this.__fromDesk = true;
                            }}"
                            ><span class="t">${p.title}</span
                            ><span class="d">${this._date(p)}</span></a
                          >
                        </li>`,
                    )}
                  </ol>
                </nav>
              </div>
              <button
                class="nudge"
                @click="${this._toPaper}"
                aria-label="${this.t.readDesk}"
              >
                <simple-icon-lite
                  icon="hardware:keyboard-arrow-down"
                ></simple-icon-lite>
              </button>
            </header>`
          : html`<header
              class="room banner"
              style="${image ? `background-image: ${image}` : ""}"
            >
              <div class="banner-copy">
                <h1>${item.title}</h1>
                <span class="when">${this._date(item)}</span>
              </div>
              <div class="flash" aria-hidden="true"></div>
              <button
                class="nudge"
                @click="${this._toPaper}"
                aria-label="${this.t.read}"
              >
                <simple-icon-lite
                  icon="hardware:keyboard-arrow-down"
                ></simple-icon-lite>
              </button>
            </header>`
      }
      <main>
        <article
          id="paper"
          aria-label="${item.title || ""}"
          style="--night-draft-scratched-out: '${this.t.scratchedOut.replace(
            /['\\]/g,
            "",
          )}'"
        >
          <span class="start" id="start" tabindex="-1"
            >${item.title || ""}</span
          >
          <div class="platen" aria-hidden="true">${this._platen()}</div>
          <div class="sheet">
            <button class="finish" @click="${this._finish}">
              ${this.t.finishTyping}
            </button>
            <div class="typing">
              <div id="contentcontainer">
                <div id="slot">
                  <slot @slotchange="${this._resetTyping}"></slot>
                </div>
              </div>
              <div class="cover" aria-hidden="true"></div>
              <span class="caret" aria-hidden="true"></span>
            </div>
            <footer class="sig">
              <p class="ttl">${item.title || ""}</p>
              <p>
                <time datetime="${this._iso(item)}">${this._date(item)}</time>
              </p>
            </footer>
          </div>
        </article>
      </main>
      <nav class="next" aria-label="${this.t.nextLetter}">
        ${
          !home && desk
            ? html`<a href="${desk.slug}"
                ><span class="lbl">${this.t.backTo}</span
                ><span class="to">${desk.title}</span></a
              >`
            : html`<span></span>`
        }
        ${
          next
            ? html`<a class="fwd" href="${next.slug}"
                ><span class="lbl">${this.t.nextLetter} &rarr;</span
                ><span class="to">${next.title}</span></a
              >`
            : ""
        }
      </nav>
    `;
  }
}
globalThis.customElements.define(NightDraftTheme.tag, NightDraftTheme);
export { NightDraftTheme, cssUrl };
