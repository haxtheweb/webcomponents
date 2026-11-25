/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, svg, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  DAY,
  FILES,
  buildModel,
  commitsTo,
  median,
  themeCost,
  elementLinks,
  seriesValues,
  journeyCost,
} from "./lib/growth-model.js";

const VIEWS = ["themes", "elements", "platforms", "cache"];
const SERIES_ON = ["commits", "prs", "elements", "themes", "platforms"];
/** Each chart series' stroke and dash, so it reads without colour too. */
const SERIES_STYLE = {
  commits: ["--ddd-theme-default-slateGray", ""],
  prs: ["--ddd-theme-default-link", "6 3"],
  issues: ["--ddd-theme-default-original87Pink", "2 3"],
  elements: ["--ddd-theme-default-creekTeal", ""],
  themes: ["--ddd-theme-default-inventOrange", ""],
  platforms: ["--ddd-theme-default-roarGolden", "8 4"],
  sites: ["--ddd-theme-default-forestGreen", "3 2"],
};
const S3 = Math.sqrt(3);

function reducedMotion() {
  return !!(
    globalThis.matchMedia &&
    globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
/** Fill {name} slots in a translated string. */
function fill(str, vals) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) =>
    vals[k] === undefined ? m : vals[k],
  );
}

/**
 * `ecosystem-growth`
 * How HAX grew, drawn as a crystal: themes, elements and platforms appear in
 * the order they were made around what they share, and the cache view shows
 * what that sharing saves a visitor. Reads the growth data layer PRAW
 * publishes (haxtheweb/issues#3409) from `src`; nothing is baked in.
 *
 * @demo demo/index.html
 * @element ecosystem-growth
 */
export class EcosystemGrowth extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "ecosystem-growth";
  }

  constructor() {
    super();
    this.src = "https://hax.cloud/data/growth/";
    this.view = "themes";
    this._M = null;
    this._raw = null;
    this._error = "";
    this._now = 0;
    this._visit = 0;
    this._cacheMode = "site";
    this._playing = false;
    this._sel = null;
    this._log = true;
    this._on = new Set(SERIES_ON);
    this._hover = null;
    this._shown = new Map();
    this._last = 0;
    this._acc = 0;
    this._chartW = 600;
    this._tools = null;
    this._presenting = false;
    this._visible = true;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "How HAX grew",
      eyebrow: "Growth, reuse and what it saves",
      loading: "Loading the growth data…",
      failed: "The growth data could not be loaded.",
      views: "View",
      themes: "Themes",
      elements: "Elements",
      platforms: "Platforms",
      cache: "Cache",
      play: "Play",
      pause: "Pause",
      fullScreen: "Full screen",
      exitFullScreen: "Exit full screen",
      date: "Date",
      step: "Step",
      siteBySite: "Site by site",
      themeByTheme: "Theme by theme",
      journey: "Cache journey",
      chart: "Growth over time",
      logScale: "Log scale",
      linearScale: "Linear scale",
      chartHint:
        "On a log scale a straight climb means steady multiplying, and a bend upward means it is speeding up.",
      chartData: "Chart data, by year",
      month: "Month",
      seriesShown: "Series to show",
      sharedCore: "Shared core",
      noCore: "No shared core yet",
      themesOverTime: "Themes over time",
      elementsOverTime: "Elements over time",
      platformsOverTime: "Platforms over time",
      cacheSite: "Cache: page to page, site to site",
      cacheTheme: "Cache: one host, many themes",
      nThemes: "Themes",
      typicalAdds: "Typical theme adds",
      nElements: "Element packages",
      links: "Dependency links",
      typicalSize: "Typical size",
      nProperties: "Network properties",
      nPlatforms: "Platforms",
      commitsMonth: "Commits this month",
      stepNeeds: "This step needs",
      alreadyCached: "Already cached",
      fetchedNew: "Fetched new",
      files: "{n} files",
      rateThemes:
        "{n} new themes in the 12 months to {date}: about one every {days} days.",
      rate30: "{n} new themes in the last 30 days.",
      noThemes: "No new themes in the 12 months to {date}.",
      preCore:
        "These first themes come before the shared theme core, which arrives on {date}; every theme here is later built on it.",
      coreText:
        "Every theme loads the same shared core: {core} gzipped across {files} files. A typical theme adds {own} of its own, about {pct}% of the core. Hexagons are drawn to that scale.",
      selectTheme: "Select a theme to compare it with the core.",
      vsCore: "{name} and the core",
      coreBar: "Shared core (gzipped)",
      ownBar: "{name}’s own code (gzipped)",
      themeCost:
        "A first visit to a {name} site loads {first}. After a visitor has seen a clean-one site on the same host, it needs {after} more.",
      twoLayers: "It builds on {base}, so it reuses two layers.",
      newEls: "{n} new packages in the 12 months to {date}.",
      elText:
        "The most-used packages sit in the middle; everything around them builds on them. Most used by {date}: {top}. {ddd} of these {n} packages build on DDD. Hexagon size is each package’s main file, gzipped; a gold outline marks packages that 20 or more others use.",
      selectElement:
        "Select an element to see what it depends on (orange) and what uses it (blue).",
      dependsOn: "Depends on {n}",
      usedBy: "Used by {n}",
      none: "none",
      firstCommit: "First commit {date}.",
      mainFile: "Main file {size} gzipped.",
      onDDD: "Built on DDD.",
      notDDD: "Not on DDD.",
      platText:
        "They all work on one site format, site.json: some run sites, some build or edit them, and PRAW holds the rules for it.",
      platKey:
        "Coloured: the properties in the HAX network bar, in their network colours. Grey: the platforms that run and build HAX. Size grows with commits to date; a ring pulses with each month’s commits.",
      selectPlat: "Select one to see what it is for.",
      platCommits: "{n} commits by {date}.",
      siteIntro:
        "A visitor reads a few pages of one HAX site, then moves to the next site on the same host. Between pages of a site only the elements that page adds are fetched.",
      themeIntro:
        "A visitor opens one HAX site after another on the same host, each on a different theme, in the order the themes were made.",
      firstStep:
        "The first HAX page on a host fetches everything: {need} across {files} files.",
      laterStep:
        "This step needs {need}; {cached} of it is already cached, so it fetches only {fetch}.",
      sameSite: "Same site",
      nextSite: "Next site",
      start: "Start",
      bundleSite: "If every page were its own bundle",
      bundleTheme: "If each site were its own bundle",
      unbundled: "HAX: unbundled files, cached per file",
      cacheKey:
        "Orange cells are fetched now, gold ones were already cached. Outlined cells are the shared core.",
      bytesOver: "Bytes so far",
      builtOnce: "Built once, reused",
      onEachOther: "Built on each other",
      readIt: "How to read it",
      sources:
        "Dates: when each file appeared at its current path, and each repository’s first commit. Bytes: gzip of each file’s source, file by file, with third-party code left out. Browsers keep one cache per site, so savings between sites apply on the same host.",
      dataFrom: "Data: {src}",
      drawing:
        "{view} on {date}: {n} shown. The panel beside it lists the same figures.",
      slowed: "Playback slowed 30× for the last month",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/ecosystem-growth.en.json", import.meta.url).href +
        "/../",
    });
    this._frame = this._frame.bind(this);
    this._fsChange = this._fsChange.bind(this);
  }

  static get properties() {
    return {
      ...super.properties,
      /** Folder (ending in /) that holds the growth JSON files. */
      src: { type: String },
      /** The view shown first: themes, elements, platforms or cache. */
      view: { type: String, reflect: true },
      _M: { state: true },
      _error: { state: true },
      _now: { state: true },
      _visit: { state: true },
      _cacheMode: { state: true },
      _playing: { state: true },
      _sel: { state: true },
      _log: { state: true },
      _on: { state: true },
      _chartW: { state: true },
      _presenting: { state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          container-type: inline-size;
          color-scheme: light dark;
          --surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --fg: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --heading: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --muted: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --line: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          --accent: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          --accent-ink: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --out: light-dark(
            var(--ddd-theme-default-inventOrange),
            var(--ddd-theme-default-inventOrange)
          );
          --in: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          --stage: var(--ddd-theme-default-nittanyNavy);
          background: var(--surface);
          color: var(--fg);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
          border: var(--ddd-border-xs);
          border-color: var(--line);
          border-radius: var(--ddd-radius-md);
          overflow: clip;
        }
        :host([data-presenting]) {
          position: fixed;
          inset: var(--ddd-spacing-0);
          z-index: 1000;
          overflow: auto;
          border-radius: var(--ddd-radius-0);
        }
        [hidden] {
          display: none !important;
        }
        header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--line);
        }
        .titles {
          flex: 1 1 240px;
          min-width: 0;
        }
        .eyebrow {
          margin: var(--ddd-spacing-0);
          color: var(--muted);
          font-size: var(--ddd-font-size-4xs);
        }
        h2 {
          margin: var(--ddd-spacing-0);
          color: var(--heading);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-120);
        }
        .actions,
        .row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .group {
          display: inline-flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1);
        }
        button.act {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          min-height: 44px;
          min-width: 44px;
          padding: var(--ddd-spacing-0) var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-rounded);
          border: var(--ddd-border-xs);
          border-color: var(--line);
          background: var(--surface);
          color: var(--fg);
          cursor: pointer;
        }
        button.act[aria-pressed="true"],
        button.act[aria-current="step"] {
          background: var(--accent);
          color: var(--accent-ink);
          border-color: var(--accent);
        }
        button:focus-visible,
        input:focus-visible,
        canvas:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 340px);
          gap: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-4);
        }
        @container (max-width: 860px) {
          .body {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        .stage {
          position: relative;
          aspect-ratio: 16 / 11;
          background: var(--stage);
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
        }
        @container (max-width: 520px) {
          .stage {
            aspect-ratio: 4 / 5;
          }
        }
        canvas {
          position: absolute;
          inset: var(--ddd-spacing-0);
          width: 100%;
          height: 100%;
          display: block;
        }
        .time {
          margin-top: var(--ddd-spacing-3);
        }
        .time input {
          flex: 1 1 200px;
          min-height: 44px;
          accent-color: var(--accent);
        }
        .when {
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-xs);
          min-width: 7em;
        }
        aside h3 {
          margin: var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-1);
          color: var(--heading);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
        }
        aside h4 {
          margin: var(--ddd-spacing-4) var(--ddd-spacing-0) var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
        }
        aside p {
          margin: var(--ddd-spacing-2) var(--ddd-spacing-0);
        }
        .muted {
          color: var(--muted);
        }
        dl {
          border: none;
          padding: var(--ddd-spacing-0);
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--ddd-spacing-2);
          margin: var(--ddd-spacing-2) var(--ddd-spacing-0);
        }
        dl div {
          border-top: var(--ddd-border-sm);
          border-color: var(--line);
          padding-top: var(--ddd-spacing-1);
        }
        dt {
          color: var(--muted);
          font-size: var(--ddd-font-size-4xs);
        }
        dd {
          margin: var(--ddd-spacing-0);
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-xs);
        }
        .bar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: var(--ddd-spacing-0) var(--ddd-spacing-2);
          align-items: center;
          margin: var(--ddd-spacing-2) var(--ddd-spacing-0);
        }
        .bar span {
          grid-column: 1 / -1;
        }
        .bar i {
          display: block;
          height: var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-xs);
          background: var(--ddd-theme-default-slateGray);
        }
        .bar.hax i {
          background: var(--ddd-theme-default-keystoneYellow);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-theme-default-roarGolden);
        }
        .out {
          color: var(--out);
          font-weight: var(--ddd-font-weight-bold);
        }
        .in {
          color: var(--in);
          font-weight: var(--ddd-font-weight-bold);
        }
        ol.journey {
          list-style: none;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          display: grid;
          gap: var(--ddd-spacing-1);
        }
        ol.journey button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          text-align: start;
          border-radius: var(--ddd-radius-sm);
        }
        ol.journey b {
          margin-inline-start: auto;
        }
        .mark {
          font-size: var(--ddd-font-size-4xs);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-rounded);
          padding: var(--ddd-spacing-0) var(--ddd-spacing-2);
          white-space: nowrap;
        }
        .chart {
          padding: var(--ddd-spacing-0) var(--ddd-spacing-4)
            var(--ddd-spacing-4);
        }
        .chart .row {
          justify-content: space-between;
        }
        .chart h3 {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
          font-family: var(--ddd-font-navigation);
        }
        .legend button {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-0) var(--ddd-spacing-3);
        }
        .legend button[aria-pressed="false"] {
          text-decoration: line-through;
          background: var(--surface);
          color: var(--fg);
          border-color: var(--line);
        }
        .legend button[aria-pressed="false"] svg {
          opacity: 0.35;
        }
        .legend button[aria-pressed="true"] {
          background: var(--surface);
          color: var(--fg);
          border-color: var(--fg);
        }
        svg.lines {
          display: block;
          width: 100%;
          height: auto;
          margin-top: var(--ddd-spacing-2);
          color: var(--fg);
        }
        details {
          margin-top: var(--ddd-spacing-2);
        }
        table {
          border-collapse: collapse;
          font-size: var(--ddd-font-size-4xs);
        }
        th,
        td {
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--line);
          text-align: end;
        }
        th:first-child,
        td:first-child {
          text-align: start;
        }
        .scroll {
          overflow-x: auto;
        }
        .msg {
          padding: var(--ddd-spacing-4);
        }
      `,
    ];
  }

  // ---------- data ----------

  updated(changed) {
    if (super.updated) super.updated(changed);
    if (changed.has("src")) this._load();
    if (changed.has("_M") && this._M) this._afterLoad();
  }

  async _load() {
    if (this._ro) this._ro.disconnect();
    if (this._io) this._io.disconnect();
    this._ro = null;
    this._io = null;
    this._M = null;
    this._error = "";
    const base = this.src && this.src.endsWith("/") ? this.src : this.src + "/";
    try {
      const parts = await Promise.all(
        FILES.map((f) =>
          globalThis
            .fetch(
              new URL(f + ".json", new URL(base, globalThis.location.href))
                .href,
            )
            .then((r) => {
              if (!r.ok) throw new Error(r.status);
              return r.json();
            }),
        ),
      );
      const raw = {};
      FILES.forEach((f, i) => {
        raw[f] = parts[i];
      });
      this._raw = raw;
      this._M = buildModel(raw);
    } catch {
      this._error = this.t.failed;
    }
  }

  _afterLoad() {
    this._now = this._M.T1;
    this._visit = 0;
    this._shown = new Map();
    if (!VIEWS.includes(this.view)) this.view = "themes";
    this.updateComplete.then(() => {
      this._watch();
      this._registerTools();
      this._kick();
    });
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.document.addEventListener("fullscreenchange", this._fsChange);
  }

  disconnectedCallback() {
    globalThis.document.removeEventListener("fullscreenchange", this._fsChange);
    if (this._ro) this._ro.disconnect();
    if (this._io) this._io.disconnect();
    if (this._tools) this._tools.abort();
    this._tools = null;
    this._raf = 0;
    super.disconnectedCallback();
  }

  _watch() {
    const cv = this.shadowRoot.querySelector("canvas");
    const chart = this.shadowRoot.querySelector(".chart");
    if (!cv || this._ro) return;
    this._ro = new ResizeObserver(() => {
      this._size();
      if (chart) this._chartW = Math.max(280, Math.round(chart.clientWidth));
      this._kick();
    });
    this._ro.observe(cv);
    if (chart) this._ro.observe(chart);
    this._io = new IntersectionObserver((entries) => {
      this._visible = entries[0].isIntersecting;
      if (this._visible) this._kick();
    });
    this._io.observe(cv);
  }

  _size() {
    const cv = this.shadowRoot.querySelector("canvas");
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    // sharper drawing on dense screens; 1 where a browser doesn't report it
    // eslint-disable-next-line baseline-js/use-baseline -- devicePixelRatio is in every engine; Baseline lists it as limited only for Safari's zoom behaviour, which changes nothing here
    const d = Math.min(2, globalThis.devicePixelRatio || 1);
    this._W = r.width;
    this._H = r.height;
    cv.width = Math.round(r.width * d);
    cv.height = Math.round(r.height * d);
    this._ctx = cv.getContext("2d");
    this._ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  /** Draw on the next frame, and keep drawing while anything moves. */
  _kick() {
    this._animUntil = Math.max(this._animUntil || 0, performance.now() + 1200);
    if (!this._raf) {
      this._raf = 1;
      globalThis.requestAnimationFrame(this._frame);
    }
  }

  _frame(now) {
    if (!this._raf || !this.isConnected) {
      this._raf = 0;
      return;
    }
    const dt = this._last ? Math.min(50, now - this._last) : 16;
    this._last = now;
    if (this._playing) this._advance(dt);
    if (this._M && this._W && this._visible !== false) this._draw(now);
    if (this._playing || now < this._animUntil) {
      globalThis.requestAnimationFrame(this._frame);
    } else {
      this._raf = 0;
      this._last = 0;
    }
  }

  _advance(dt) {
    const M = this._M;
    if (this.view === "cache") {
      const n = this._steps().length;
      this._acc += dt;
      if (this._acc > (this._cacheMode === "site" ? 1800 : 450)) {
        this._acc = 0;
        if (this._visit >= n - 1) this._play(false);
        else this._visit += 1;
      }
      return;
    }
    const span = M.T1 - M.T0;
    const slow = this.view === "themes" && this._now > M.T1 - 30 * DAY ? 30 : 1;
    this._now = Math.min(M.T1, this._now + (dt * span) / 26000 / slow);
    if (this._now >= M.T1) this._play(false);
  }

  _play(on) {
    const M = this._M;
    if (!M) return;
    if (on === undefined) on = !this._playing;
    if (on) {
      if (this.view === "cache" && this._visit >= this._steps().length - 1)
        this._visit = 0;
      if (this.view !== "cache" && this._now >= M.T1 - DAY) {
        this._now = M.T0;
        this._shown = new Map();
      }
    }
    this._playing = on;
    if (on) this._kick();
  }

  _steps() {
    return this._cacheMode === "site" ? this._M.journey : this._M.visits;
  }

  // ---------- drawing ----------

  _css(name, fallback) {
    const v = globalThis.getComputedStyle(this).getPropertyValue(name).trim();
    return v || fallback;
  }

  _color(name) {
    return this._css("--ddd-theme-default-" + name, "#888888");
  }

  _geom(ring) {
    const W = this._W;
    const H = this._H;
    const s = Math.min(W / (3 * ring + 2.4), H / (S3 * (2 * ring + 1.4)));
    return {
      s,
      px: (q, r) => [W / 2 + s * 1.5 * q, H / 2 + s * S3 * (r + q / 2)],
    };
  }

  _hex(cx, cy, R) {
    const x = this._ctx;
    x.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const X = cx + R * Math.cos(a);
      const Y = cy + R * Math.sin(a);
      if (i) x.lineTo(X, Y);
      else x.moveTo(X, Y);
    }
    x.closePath();
  }

  _pill(text, cx, cy, size, gold) {
    const x = this._ctx;
    x.font =
      "500 " + size + "px " + this._css("--ddd-font-navigation", "sans-serif");
    const w = x.measureText(text).width + size * 0.9;
    const h = size * 1.6;
    x.fillStyle = "rgba(0, 30, 68, 0.88)";
    x.beginPath();
    x.roundRect(cx - w / 2, cy - h / 2, w, h, h / 2);
    x.fill();
    x.fillStyle = gold ? this._color("keystoneYellow") : "#ffffff";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, cx, cy + 1);
    x.textAlign = "start";
  }

  _grow(item, now) {
    if (!this._shown.has(item))
      this._shown.set(item, reducedMotion() ? -1e9 : now);
    return ease(clamp((now - this._shown.get(item) - 300) / 450, 0, 1));
  }

  _yearColor(d) {
    const y = parseInt(String(d).slice(0, 4), 10);
    if (y <= 2020) return this._color("skyBlue");
    if (y <= 2025) return this._color("creekTeal");
    return this._color("inventOrange");
  }

  _lattice(list, s, px) {
    const x = this._ctx;
    x.strokeStyle = "rgba(30, 64, 124, 0.75)";
    x.lineWidth = 1;
    list.forEach((i) => {
      const [a, b] = px(i.q, i.r);
      this._hex(a, b, s * 0.94);
      x.stroke();
    });
  }

  _line(a, b, c, d, color, w, g) {
    const x = this._ctx;
    x.strokeStyle = color;
    x.lineWidth = w;
    x.beginPath();
    x.moveTo(a, b);
    x.lineTo(a + (c - a) * g, b + (d - b) * g);
    x.stroke();
  }

  _draw(now) {
    const x = this._ctx;
    x.fillStyle = this._color("nittanyNavy");
    x.fillRect(0, 0, this._W, this._H);
    if (this.view === "elements") this._drawElements(now);
    else if (this.view === "platforms") this._drawPlatforms(now);
    else if (this.view === "cache") this._drawCache();
    else this._drawThemes(now);
  }

  _drawThemes(now) {
    const M = this._M;
    const { s, px } = this._geom(M.themeRing);
    const x = this._ctx;
    this._lattice(M.themes, s, px);
    const coreOn = this._now >= M.coreDate;
    const cR = s * 1.75;
    const W = this._W;
    const H = this._H;
    this._hex(W / 2, H / 2, cR);
    if (coreOn) {
      x.fillStyle = "rgba(255, 209, 0, 0.18)";
      x.fill();
      x.strokeStyle = this._color("keystoneYellow");
      x.lineWidth = 2;
      x.stroke();
    } else {
      x.setLineDash([5, 5]);
      x.strokeStyle = "rgba(255, 255, 255, 0.45)";
      x.stroke();
      x.setLineDash([]);
    }
    const vis = M.themes.filter((i) => i.T <= this._now);
    vis.forEach((i) => {
      const g = this._grow(i, now);
      const [a, b] = px(i.q, i.r);
      let hx = W / 2;
      let hy = H / 2;
      let ok = coreOn;
      if (i.home && i.home.T <= this._now) {
        [hx, hy] = px(i.home.q, i.home.r);
        ok = true;
      }
      if (ok && !i.isBase)
        this._line(
          hx,
          hy,
          a,
          b,
          i.home ? this._color("discoveryCoral") : "rgba(255, 209, 0, 0.42)",
          i.home ? 1.5 : 1,
          g,
        );
    });
    vis.forEach((i) => {
      const [a, b] = px(i.q, i.r);
      const R = cR * Math.sqrt(i.gz / M.core.gz) * this._grow(i, now);
      if (R <= 0) return;
      x.fillStyle = i.isBase
        ? this._color("keystoneYellow")
        : i.home
          ? this._color("discoveryCoral")
          : this._yearColor(i.d);
      this._hex(a, b, Math.max(R, 1.5));
      x.fill();
      if (i === this._hover || i === this._sel) {
        this._hex(a, b, s * 0.94);
        x.strokeStyle = "#ffffff";
        x.lineWidth = 2;
        x.stroke();
      }
    });
    if (this._sel && this._sel.T <= this._now && M.themes.includes(this._sel)) {
      const [a, b] = px(this._sel.q, this._sel.r);
      this._hex(a, b, cR);
      x.setLineDash([4, 4]);
      x.strokeStyle = "rgba(255, 255, 255, 0.6)";
      x.lineWidth = 1;
      x.stroke();
      x.setLineDash([]);
    }
    this._pill(
      coreOn
        ? this.t.sharedCore + " · " + this._bytes(M.core.gz)
        : this.t.noCore,
      W / 2,
      H / 2,
      clamp(s * 0.36, 11, 16),
      true,
    );
    if (this._playing && this._now > M.T1 - 30 * DAY)
      this._pill(this.t.slowed, W / 2, H - 16, 12, true);
    this._hoverPill(s, px);
  }

  _drawElements(now) {
    const M = this._M;
    const { s, px } = this._geom(M.elRing);
    const x = this._ctx;
    this._lattice(M.els, s, px);
    const vis = M.els.filter((i) => i.T <= this._now);
    const h = this._hover || this._sel;
    const focus = h && M.els.includes(h) && h.T <= this._now ? h : null;
    x.lineWidth = 1;
    x.strokeStyle = "rgba(255, 255, 255, 0.07)";
    x.beginPath();
    vis.forEach((i) => {
      const [a, b] = px(i.q, i.r);
      i.out.forEach((o) => {
        if (o.T > this._now) return;
        const [c, d] = px(o.q, o.r);
        x.moveTo(a, b);
        x.lineTo(c, d);
      });
    });
    x.stroke();
    if (focus) {
      const [a, b] = px(focus.q, focus.r);
      focus.out.forEach((o) => {
        if (o.T > this._now) return;
        const [c, d] = px(o.q, o.r);
        this._line(a, b, c, d, this._color("inventOrange"), 1.5, 1);
      });
      focus.inn.forEach((o) => {
        if (o.T > this._now) return;
        const [c, d] = px(o.q, o.r);
        this._line(c, d, a, b, this._color("skyBlue"), 1.2, 1);
      });
    }
    const max = Math.max(...M.els.map((e) => e.gz));
    vis.forEach((i) => {
      const [a, b] = px(i.q, i.r);
      const R =
        s * 0.92 * Math.max(0.2, Math.sqrt(i.gz / max)) * this._grow(i, now);
      const related = focus && (focus.out.includes(i) || focus.inn.includes(i));
      x.globalAlpha = focus && !related && i !== focus ? 0.35 : 1;
      x.fillStyle = this._yearColor(i.d);
      this._hex(a, b, R);
      x.fill();
      x.globalAlpha = 1;
      if (i.inn.length >= 20) {
        this._hex(a, b, R);
        x.strokeStyle = this._color("keystoneYellow");
        x.lineWidth = 2;
        x.stroke();
      }
      if (i === focus) {
        this._hex(a, b, s * 0.94);
        x.strokeStyle = "#ffffff";
        x.lineWidth = 2;
        x.stroke();
      }
    });
    M.els.slice(0, 6).forEach((i) => {
      if (i.T > this._now) return;
      const [a, b] = px(i.q, i.r);
      this._pill(i.label, a, b, clamp(s * 0.36, 10, 13), true);
    });
    this._hoverPill(s, px);
  }

  _drawPlatforms(now) {
    const M = this._M;
    const { s, px } = this._geom(M.platRing + 0.6);
    const x = this._ctx;
    const W = this._W;
    const H = this._H;
    this._lattice(M.plats, s, px);
    this._hex(W / 2, H / 2, s * 0.9);
    x.fillStyle = "rgba(255, 209, 0, 0.2)";
    x.fill();
    x.strokeStyle = this._color("keystoneYellow");
    x.lineWidth = 2;
    x.stroke();
    const vis = M.plats.filter((i) => i.T <= this._now);
    const ym = new Date(this._now).toISOString().slice(0, 7);
    const max = Math.max(...M.plats.map((p) => commitsTo(p, M.T1)));
    vis.forEach((i) => {
      const [a, b] = px(i.q, i.r);
      this._line(
        W / 2,
        H / 2,
        a,
        b,
        "rgba(255, 209, 0, 0.45)",
        1.5,
        this._grow(i, now),
      );
    });
    vis.forEach((i) => {
      const [a, b] = px(i.q, i.r);
      const R =
        s *
        0.92 *
        Math.max(0.2, Math.sqrt(commitsTo(i, this._now) / max)) *
        this._grow(i, now);
      const mo = i.monthly[ym] || 0;
      if (mo) {
        this._hex(a, b, R + Math.min(s * 0.35, 3 + mo / 8));
        x.strokeStyle =
          "rgba(255, 209, 0, " + Math.min(0.9, 0.25 + mo / 150) + ")";
        x.lineWidth = 2;
        x.stroke();
      }
      x.fillStyle =
        i.kind === "property" && i.color
          ? this._color(i.color)
          : this._color("limestoneLight");
      this._hex(a, b, R);
      x.fill();
      if (i === this._hover || i === this._sel) {
        this._hex(a, b, s * 0.94);
        x.strokeStyle = "#ffffff";
        x.lineWidth = 2;
        x.stroke();
      }
      this._pill(
        i.label,
        a,
        b + Math.max(R, s * 0.3) + 10,
        clamp(s * 0.16, 11, 14),
        i.kind === "property",
      );
    });
    this._pill(
      M.center ? M.center.label : "site.json",
      W / 2,
      H / 2,
      clamp(s * 0.2, 11, 16),
      true,
    );
  }

  _drawCache() {
    const M = this._M;
    const { s, px } = this._geom(M.modRing);
    const x = this._ctx;
    const steps = this._steps();
    const v = steps[this._visit];
    const need = new Set(v.set);
    const had = this._visit ? steps[this._visit - 1].cached : new Set();
    M.mods.forEach((m) => {
      const [a, b] = px(m.q, m.r);
      const R = s * 0.92 * Math.max(0.25, Math.sqrt(m.gz / 30000));
      const n = need.has(m.i);
      const old = had.has(m.i);
      this._hex(a, b, R);
      x.fillStyle =
        n && !old
          ? this._color("inventOrange")
          : n
            ? this._color("keystoneYellow")
            : old
              ? "rgba(255, 209, 0, 0.28)"
              : "rgba(30, 64, 124, 0.55)";
      x.fill();
      if (m.core) {
        x.strokeStyle = "rgba(255, 255, 255, 0.55)";
        x.lineWidth = 1;
        x.stroke();
      }
    });
    const head =
      this._cacheMode === "site"
        ? (v.next
            ? this.t.nextSite
            : this._visit
              ? this.t.sameSite
              : this.t.start) +
          ": " +
          v.site +
          " (" +
          v.theme +
          ") · " +
          v.page
        : v.label;
    this._pill(
      head,
      this._W / 2,
      16,
      13,
      this._cacheMode === "site" && (v.next || !this._visit),
    );
  }

  _hoverPill(s, px) {
    const h = this._hover || this._sel;
    if (!h || h.T > this._now || typeof h.q !== "number") return;
    const [a, b] = px(h.q, h.r);
    this._pill(
      h.label +
        " · " +
        String(h.d).slice(0, 7) +
        (h.gz ? " · " + this._bytes(h.gz) : ""),
      a,
      b - s * 1.05,
      13,
      true,
    );
  }

  _hit(X, Y) {
    const M = this._M;
    if (!M || this.view === "cache") return null;
    const list =
      this.view === "elements"
        ? M.els
        : this.view === "platforms"
          ? M.plats
          : M.themes;
    const ring =
      this.view === "elements"
        ? M.elRing
        : this.view === "platforms"
          ? M.platRing + 0.6
          : M.themeRing;
    const { s, px } = this._geom(ring);
    let best = null;
    let bd = s * 0.9;
    list.forEach((i) => {
      if (i.T > this._now) return;
      const [a, b] = px(i.q, i.r);
      const d = Math.hypot(X - a, Y - b);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    return best;
  }

  _bytes(b) {
    if (b >= 1e6) return (b / 1e6).toFixed(1) + " MB";
    if (b >= 1e3) return Math.round(b / 1e3) + " KB";
    return b + " B";
  }

  _date(t) {
    return new Date(t).toLocaleDateString(undefined, {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  // ---------- interaction ----------

  _pointer(e) {
    const r = e.currentTarget.getBoundingClientRect();
    return this._hit(e.clientX - r.left, e.clientY - r.top);
  }

  _move(e) {
    const h = this._pointer(e);
    if (h !== this._hover) {
      this._hover = h;
      e.currentTarget.style.cursor = h ? "pointer" : "default";
      this._kick();
    }
  }

  _click(e) {
    this._sel = this._pointer(e);
    this._kick();
  }

  _setView(v) {
    this.view = v;
    this._sel = null;
    this._hover = null;
    this._play(false);
    if (v === "cache") this._visit = 0;
    this._kick();
  }

  _range(e) {
    const v = Number(e.target.value) / 1000;
    this._play(false);
    if (this.view === "cache")
      this._visit = Math.round(v * (this._steps().length - 1));
    else this._now = this._M.T0 + (this._M.T1 - this._M.T0) * v;
    this._kick();
  }

  _rangeValue() {
    const M = this._M;
    if (this.view === "cache")
      return Math.round(
        (this._visit / Math.max(1, this._steps().length - 1)) * 1000,
      );
    return Math.round(((this._now - M.T0) / (M.T1 - M.T0)) * 1000);
  }

  _present() {
    this._presenting = !this._presenting;
    this.toggleAttribute("data-presenting", this._presenting);
    const doc = globalThis.document;
    try {
      if (this._presenting && this.requestFullscreen) {
        const r = this.requestFullscreen();
        if (r && r.catch) r.catch(() => {});
      } else if (!this._presenting && doc.fullscreenElement) {
        const r = doc.exitFullscreen();
        if (r && r.catch) r.catch(() => {});
      }
    } catch {
      // full screen refused: the fixed layout still fills the window
    }
    this.updateComplete.then(() => {
      this._size();
      this._kick();
    });
  }

  _fsChange() {
    if (!globalThis.document.fullscreenElement && this._presenting)
      this._present();
  }

  // ---------- agents ----------

  /**
   * Read-only WebMCP tools over the same model the drawing uses, so an agent
   * can ask what a person can see (haxtheweb/issues#3131). Feature-detected;
   * withdrawn when the element leaves the page.
   */
  _registerTools() {
    const mc = globalThis.document && globalThis.document.modelContext;
    if (!mc || typeof mc.registerTool !== "function" || this._tools) return;
    this._tools = new AbortController();
    const M = this._M;
    const raw = this._raw;
    const ro = { readOnlyHint: true };
    const tools = [
      {
        name: "growth_series",
        description:
          "Monthly growth of HAX: commits, prs, issues, elements, themes, platforms or sites, between two months (YYYY-MM).",
        inputSchema: {
          type: "object",
          properties: {
            series: { type: "string", enum: M.series.map((s) => s.key) },
            from: { type: "string" },
            to: { type: "string" },
          },
          required: ["series"],
        },
        annotations: ro,
        execute: async ({ series, from, to }) =>
          JSON.stringify(seriesValues(M, series, from, to)),
      },
      {
        name: "growth_theme_cost",
        description:
          "What a HAX theme costs a visitor to load (gzipped bytes and files), its own code against the shared core, and what it still fetches when other themes are already cached on the same host.",
        inputSchema: {
          type: "object",
          properties: {
            theme: {
              type: "string",
              description: "Theme tag, such as clean-one.",
            },
            cached: {
              type: "array",
              items: { type: "string" },
              description:
                "Theme tags the visitor already loaded on this host.",
            },
          },
          required: ["theme"],
        },
        annotations: ro,
        execute: async ({ theme, cached }) =>
          JSON.stringify(
            themeCost(M, theme, cached) || {
              error: "unknown theme",
              themes: M.themes.filter((t) => !t.isBase).map((t) => t.key),
            },
          ),
      },
      {
        name: "growth_element_dependencies",
        description:
          "Which HAX element packages an element depends on and which depend on it, with when it appeared and its size.",
        inputSchema: {
          type: "object",
          properties: {
            element: {
              type: "string",
              description:
                "Package name without the scope, such as video-player.",
            },
          },
          required: ["element"],
        },
        annotations: ro,
        execute: async ({ element }) =>
          JSON.stringify(
            elementLinks(M, element) || { error: "unknown element" },
          ),
      },
      {
        name: "growth_simulate_journey",
        description:
          "Simulate a visitor moving through HAX sites and pages on one host: for each step (a theme and the elements on the page) how many gzipped bytes it needs, fetches new and gets from cache.",
        inputSchema: {
          type: "object",
          properties: {
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  theme: { type: "string" },
                  site: { type: "string" },
                  page: { type: "string" },
                  elements: { type: "array", items: { type: "string" } },
                },
                required: ["theme"],
              },
            },
          },
          required: ["steps"],
        },
        annotations: ro,
        execute: async ({ steps }) =>
          JSON.stringify(
            journeyCost(
              M,
              Array.isArray(steps) ? steps.slice(0, 50) : [],
              raw.payload,
            ),
          ),
      },
    ];
    tools.forEach((tool) => {
      try {
        mc.registerTool(tool, { signal: this._tools.signal });
      } catch {
        // an agent-side failure must never break the page
      }
    });
  }

  // ---------- render ----------

  render() {
    if (this._error)
      return html`<p class="msg" role="alert">${this._error}</p>`;
    if (!this._M)
      return html`<p class="msg" role="status" aria-busy="true">
        ${this.t.loading}
      </p>`;
    const cache = this.view === "cache";
    const steps = cache ? this._steps() : null;
    const when = cache
      ? fill(this.t.step, {}) + " " + (this._visit + 1) + " / " + steps.length
      : this._date(this._now);
    return html`
      <header>
        <div class="titles">
          <p class="eyebrow">${this.t.eyebrow}</p>
          <h2>${this.t.title}</h2>
        </div>
        <div class="actions">
          <div class="group" role="group" aria-label="${this.t.views}">
            ${VIEWS.map(
              (v) =>
                html`<button
                  class="act"
                  type="button"
                  aria-pressed="${this.view === v ? "true" : "false"}"
                  @click="${() => this._setView(v)}"
                >
                  ${this.t[v]}
                </button>`,
            )}
          </div>
          <button
            class="act"
            type="button"
            aria-pressed="${this._presenting ? "true" : "false"}"
            @click="${this._present}"
          >
            ${this._presenting ? this.t.exitFullScreen : this.t.fullScreen}
          </button>
        </div>
      </header>
      <div class="body">
        <div>
          <div class="stage">
            <canvas
              tabindex="0"
              role="img"
              aria-label="${this._drawingLabel(when)}"
              @pointermove="${this._move}"
              @pointerleave="${() => {
                this._hover = null;
                this._kick();
              }}"
              @click="${this._click}"
            ></canvas>
          </div>
          <div class="row time">
            ${
              cache
                ? html`<div
                    class="group"
                    role="group"
                    aria-label="${this.t.journey}"
                  >
                    <button
                      class="act"
                      type="button"
                      aria-pressed="${this._cacheMode === "site" ? "true" : "false"}"
                      @click="${() => this._mode("site")}"
                    >
                      ${this.t.siteBySite}
                    </button>
                    <button
                      class="act"
                      type="button"
                      aria-pressed="${this._cacheMode === "theme" ? "true" : "false"}"
                      @click="${() => this._mode("theme")}"
                    >
                      ${this.t.themeByTheme}
                    </button>
                  </div>`
                : nothing
            }
            <button
              class="act"
              type="button"
              aria-pressed="${this._playing ? "true" : "false"}"
              @click="${() => this._play()}"
            >
              ${this._playing ? this.t.pause : this.t.play}
            </button>
            <input
              type="range"
              min="0"
              max="1000"
              .value="${String(this._rangeValue())}"
              aria-label="${cache ? this.t.step : this.t.date}"
              aria-valuetext="${when}"
              @input="${this._range}"
            />
            <span class="when" aria-hidden="true">${when}</span>
          </div>
        </div>
        <aside>${this._panel()}</aside>
      </div>
      ${this._chart()}
    `;
  }

  _mode(m) {
    this._cacheMode = m;
    this._visit = 0;
    this._play(false);
    this._kick();
  }

  _drawingLabel(when) {
    const M = this._M;
    const n =
      this.view === "elements"
        ? M.els.filter((i) => i.T <= this._now).length
        : this.view === "platforms"
          ? M.plats.filter((i) => i.T <= this._now).length
          : this.view === "cache"
            ? this._steps()[this._visit].files
            : M.themes.filter((i) => !i.isBase && i.T <= this._now).length;
    return fill(this.t.drawing, { view: this.t[this.view], date: when, n });
  }

  _num(k, v) {
    return html`<div>
      <dt>${k}</dt>
      <dd>${v}</dd>
    </div>`;
  }

  _bars(a, la, b, lb) {
    const m = Math.max(a, b, 1);
    return html`<div class="bar">
        <span>${la}</span
        ><i style="width:${Math.max(1, (a / m) * 100).toFixed(1)}%"></i
        ><b>${this._bytes(a)}</b>
      </div>
      <div class="bar hax">
        <span>${lb}</span
        ><i style="width:${Math.max(1, (b / m) * 100).toFixed(1)}%"></i
        ><b>${this._bytes(b)}</b>
      </div>`;
  }

  _panel() {
    if (this.view === "cache") return this._cachePanel();
    if (this.view === "elements") return this._elementsPanel();
    if (this.view === "platforms") return this._platformsPanel();
    return this._themesPanel();
  }

  _themesPanel() {
    const M = this._M;
    const t = this._now;
    const th = M.themes.filter((i) => !i.isBase && i.T <= t);
    const last = th.filter((i) => i.T > t - 365 * DAY).length;
    const l30 = th.filter((i) => i.T > t - 30 * DAY).length;
    const coreOn = t >= M.coreDate;
    const own = median(th.map((i) => i.gz));
    const sel =
      this._sel && !this._sel.isBase && this._sel.cost && this._sel.T <= t
        ? this._sel
        : null;
    return html`<h3>${this.t.themesOverTime}</h3>
      <dl>
        ${this._num(this.t.nThemes, th.length)}
        ${this._num(this.t.sharedCore, coreOn ? this._bytes(M.core.gz) : "—")}
        ${this._num(this.t.typicalAdds, th.length ? this._bytes(own) : "—")}
      </dl>
      <p>
        ${l30 >= 3 ? fill(this.t.rate30, { n: l30 }) + " " : ""}${
          last
            ? fill(this.t.rateThemes, {
                n: last,
                date: this._date(t),
                days: Math.max(1, Math.round(365 / last)),
              })
            : fill(this.t.noThemes, { date: this._date(t) })
        }
      </p>
      <h4>${this.t.builtOnce}</h4>
      <p>
        ${
          coreOn
            ? fill(this.t.coreText, {
                core: this._bytes(M.core.gz),
                files: M.core.files,
                own: this._bytes(own),
                pct: ((own / M.core.gz) * 100).toFixed(1),
              })
            : fill(this.t.preCore, { date: this._date(M.coreDate) })
        }
      </p>
      ${
        sel
          ? html`<h4>${fill(this.t.vsCore, { name: sel.key })}</h4>
              ${this._bars(M.core.gz, this.t.coreBar, sel.gz, fill(this.t.ownBar, { name: sel.key }))}
              <p>
                ${fill(this.t.themeCost, { name: sel.key, first: this._bytes(sel.cost.gz), after: this._bytes(sel.cost.afterCleanOne) })}
                ${sel.home ? fill(this.t.twoLayers, { base: sel.home.key }) : ""}
              </p>`
          : html`<p class="muted">${this.t.selectTheme}</p>`
      }
      <p class="muted">${this.t.sources}</p>`;
  }

  _elementsPanel() {
    const M = this._M;
    const t = this._now;
    const vis = M.els.filter((i) => i.T <= t);
    const links = vis.reduce(
      (a, i) => a + i.out.filter((o) => o.T <= t).length,
      0,
    );
    const inT = (i) => i.inn.filter((o) => o.T <= t).length;
    const top = vis
      .filter((i) => i.inn.length)
      .sort((a, b) => inT(b) - inT(a))
      .slice(0, 5);
    const sel =
      this._sel && M.els.includes(this._sel) && this._sel.T <= t
        ? this._sel
        : null;
    const names = (l) => l.filter((o) => o.T <= t).map((o) => o.key);
    return html`<h3>${this.t.elementsOverTime}</h3>
      <dl>
        ${this._num(this.t.nElements, vis.length)}
        ${this._num(this.t.links, links)}
        ${this._num(this.t.typicalSize, this._bytes(median(vis.map((i) => i.gz))))}
      </dl>
      <p>
        ${fill(this.t.newEls, { n: vis.filter((i) => i.T > t - 365 * DAY).length, date: this._date(t) })}
      </p>
      <h4>${this.t.onEachOther}</h4>
      <p>
        ${fill(this.t.elText, { date: this._date(t), top: top.map((i) => i.key + " (" + inT(i) + ")").join(", "), ddd: vis.filter((i) => i.ddd).length, n: vis.length })}
      </p>
      ${
        sel
          ? html`<h4>${sel.key}</h4>
              <p>
                ${fill(this.t.firstCommit, { date: sel.d })}
                ${fill(this.t.mainFile, { size: this._bytes(sel.gz) })}
                ${sel.ddd ? this.t.onDDD : this.t.notDDD}
              </p>
              <p>
                <span class="out"
                  >${fill(this.t.dependsOn, { n: names(sel.out).length })}</span
                >: ${names(sel.out).join(", ") || this.t.none}
              </p>
              <p>
                <span class="in"
                  >${fill(this.t.usedBy, { n: names(sel.inn).length })}</span
                >: ${names(sel.inn).join(", ") || this.t.none}
              </p>`
          : html`<p class="muted">${this.t.selectElement}</p>`
      }`;
  }

  _platformsPanel() {
    const M = this._M;
    const t = this._now;
    const vis = M.plats.filter((i) => i.T <= t);
    const ym = new Date(t).toISOString().slice(0, 7);
    const commits = M.series.find((s) => s.key === "commits");
    const cm = commits ? commits.values[M.months.indexOf(ym)] || 0 : 0;
    const sel =
      this._sel && M.plats.includes(this._sel) && this._sel.T <= t
        ? this._sel
        : null;
    return html`<h3>${this.t.platformsOverTime}</h3>
      <dl>
        ${this._num(this.t.nProperties, vis.filter((i) => i.kind === "property").length)}
        ${this._num(this.t.nPlatforms, vis.filter((i) => i.kind === "platform").length)}
        ${this._num(this.t.commitsMonth, cm.toLocaleString())}
      </dl>
      <p>${this.t.platText}</p>
      <h4>${this.t.readIt}</h4>
      <p>${this.t.platKey}</p>
      ${
        sel
          ? html`<h4>
                ${sel.label}${/^https:\/\//.test(sel.url || "") ? html` · <a href="${sel.url}">${sel.url.replace(/^https:\/\//, "").replace(/\/$/, "")}</a>` : nothing}
              </h4>
              <p>${sel.purpose}</p>
              <p>
                ${sel.repo} · ${fill(this.t.firstCommit, { date: sel.d })}
                ${fill(this.t.platCommits, { n: commitsTo(sel, t).toLocaleString(), date: this._date(t) })}
              </p>`
          : html`<p class="muted">${this.t.selectPlat}</p>`
      }`;
  }

  _cachePanel() {
    const steps = this._steps();
    const v = steps[this._visit];
    const done = steps.slice(0, this._visit + 1);
    const got = done.reduce((a, q) => a + q.fetch, 0);
    const full = done.reduce((a, q) => a + q.need, 0);
    const site = this._cacheMode === "site";
    return html`<h3>${site ? this.t.cacheSite : this.t.cacheTheme}</h3>
      <p class="muted">${site ? this.t.siteIntro : this.t.themeIntro}</p>
      <dl>
        ${this._num(this.t.stepNeeds, fill(this.t.files, { n: v.files }))}
        ${this._num(this.t.alreadyCached, fill(this.t.files, { n: v.files - v.newFiles }))}
        ${this._num(this.t.fetchedNew, fill(this.t.files, { n: v.newFiles }))}
      </dl>
      <p>
        ${
          this._visit
            ? html`${site ? html`<strong>${v.next ? this.t.nextSite : this.t.sameSite}.</strong> ` : nothing}${fill(this.t.laterStep, { need: this._bytes(v.need), cached: this._bytes(v.need - v.fetch), fetch: this._bytes(v.fetch) })}`
            : fill(this.t.firstStep, {
                need: this._bytes(v.need),
                files: v.files,
              })
        }
      </p>
      <h4>${this.t.bytesOver}</h4>
      ${this._bars(full, site ? this.t.bundleSite : this.t.bundleTheme, got, this.t.unbundled)}
      <p class="muted">${this.t.cacheKey}</p>
      ${
        site
          ? html`<h4>${this.t.journey}</h4>
              <ol class="journey">
                ${steps.map(
                  (q, k) =>
                    html`<li>
                      <button
                        class="act"
                        type="button"
                        aria-current="${k === this._visit ? "step" : "false"}"
                        @click="${() => {
                          this._play(false);
                          this._visit = k;
                          this._kick();
                        }}"
                      >
                        <span class="mark"
                          >${k === 0 ? this.t.start : q.next ? this.t.nextSite : this.t.sameSite}</span
                        >${q.label}<b>${this._bytes(k ? q.fetch : q.need)}</b>
                      </button>
                    </li>`,
                )}
              </ol>`
          : nothing
      }
      <p class="muted">${this.t.sources}</p>`;
  }

  _chart() {
    const M = this._M;
    const w = this._chartW;
    const h = Math.round(clamp(w * 0.3, 200, 300));
    const pl = 44;
    const pr = 10;
    const pt = 10;
    const pb = 24;
    const shown = M.series.filter((s) => this._on.has(s.key));
    const vals = shown.flatMap((s) =>
      s.values.filter((v) => v !== null && v !== undefined),
    );
    const mx = Math.max(1, ...vals);
    const Y = (v) =>
      this._log
        ? pt +
          (h - pt - pb) *
            (1 - Math.log10(Math.max(1, v)) / Math.log10(Math.max(10, mx)))
        : pt + (h - pt - pb) * (1 - v / mx);
    const n = M.months.length;
    const X = (i) => pl + ((w - pl - pr) * i) / Math.max(1, n - 1);
    const ticks = this._log
      ? [1, 10, 100, 1000, 10000].filter((t) => t <= mx * 1.01)
      : [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(mx * f));
    const years = [];
    M.months.forEach((m, i) => {
      if (m.endsWith("-01")) years.push([m.slice(0, 4), i]);
    });
    const cur = M.months.indexOf(
      new Date(Math.min(this._now, M.T1)).toISOString().slice(0, 7),
    );
    const path = (s) => {
      let d = "";
      let pen = false;
      s.values.forEach((v, i) => {
        if (v === null || v === undefined || (this._log && v < 1)) {
          pen = false;
          return;
        }
        d += (pen ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1);
        pen = true;
      });
      return d;
    };
    const style = (k) =>
      SERIES_STYLE[k] || ["--ddd-theme-default-slateGray", ""];
    return html`<section class="chart" aria-labelledby="gh">
      <div class="row">
        <h3 id="gh">${this.t.chart}</h3>
        <button
          class="act"
          type="button"
          aria-pressed="${this._log ? "true" : "false"}"
          @click="${() => {
            this._log = !this._log;
          }}"
        >
          ${this._log ? this.t.logScale : this.t.linearScale}
        </button>
      </div>
      <div class="group legend" role="group" aria-label="${this.t.seriesShown}">
        ${M.series.map(
          (s) =>
            html`<button
              class="act"
              type="button"
              aria-pressed="${this._on.has(s.key) ? "true" : "false"}"
              @click="${() => this._toggle(s.key)}"
            >
              <svg width="26" height="10" aria-hidden="true">
                <line
                  x1="1"
                  y1="5"
                  x2="25"
                  y2="5"
                  stroke="var(${style(s.key)[0]})"
                  stroke-width="3"
                  stroke-dasharray="${style(s.key)[1]}"
                ></line></svg
              >${s.label}
            </button>`,
        )}
      </div>
      <svg
        class="lines"
        viewBox="0 0 ${w} ${h}"
        role="img"
        aria-label="${this.t.chart}: ${shown.map((s) => s.label).join(", ")}"
      >
        ${ticks.map((t) => svg`<line x1="${pl}" x2="${w - pr}" y1="${Y(t)}" y2="${Y(t)}" stroke="currentColor" stroke-opacity=".15"></line><text x="${pl - 6}" y="${Y(t) + 4}" text-anchor="end" font-size="12" fill="currentColor">${t.toLocaleString()}</text>`)}
        ${years.map(([y, i]) => svg`<text x="${X(i)}" y="${h - 6}" text-anchor="middle" font-size="12" fill="currentColor">${w < 520 ? "'" + y.slice(2) : y}</text>`)}
        ${shown.map((s) => svg`<path d="${path(s)}" fill="none" stroke="var(${style(s.key)[0]})" stroke-width="2.5" stroke-dasharray="${style(s.key)[1]}"></path>`)}
        ${cur >= 0 && this.view !== "cache" ? svg`<line x1="${X(cur)}" x2="${X(cur)}" y1="${pt}" y2="${h - pb}" stroke="currentColor" stroke-width="1.5"></line>` : nothing}
      </svg>
      <p class="muted">${this.t.chartHint}</p>
      <details>
        <summary>${this.t.chartData}</summary>
        <div class="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">${this.t.month}</th>
                ${M.series.map((s) => html`<th scope="col">${s.label}</th>`)}
              </tr>
            </thead>
            <tbody>
              ${years.concat([[M.months[n - 1], n - 1]]).map(
                ([, i]) =>
                  html`<tr>
                    <th scope="row">${M.months[i]}</th>
                    ${M.series.map((s) => html`<td>${s.values[i] === null || s.values[i] === undefined ? "—" : s.values[i].toLocaleString()}</td>`)}
                  </tr>`,
              )}
            </tbody>
          </table>
        </div>
      </details>
    </section>`;
  }

  _toggle(k) {
    const on = new Set(this._on);
    if (on.has(k)) on.delete(k);
    else on.add(k);
    this._on = on;
  }

  /**
   * haxHooks this element implements
   */
  haxHooks() {
    return {
      gizmoRegistration: "haxgizmoRegistration",
    };
  }

  /**
   * Register the haxProperties locales so HAX can translate the editor UI.
   */
  haxgizmoRegistration(_store) {
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: `ecosystem-growth.haxProperties`,
          localesPath:
            new URL("./locales/ecosystem-growth.en.json", import.meta.url)
              .href + "/../",
        },
      }),
    );
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(EcosystemGrowth.tag, EcosystemGrowth);
