/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, svg, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import {
  buildWebs,
  edgePath,
  labelLines,
  labelWidth,
  glyphFor,
  boxOf,
  tourSteps,
  visibleAt,
  safeUrl,
  KIND_ORDER,
} from "./lib/ecosystem-model.js";

const LINK_LABEL = {
  repo: "Repo",
  npm: "npm",
  docs: "Docs",
  site: "Site",
  profile: "Profile",
  issue: "Issue",
  demo: "Try it",
  example: "Example",
  recording: "Recording",
  slides: "Slides",
};

/**
 * `ecosystem-web`
 * The HAX ecosystem web: every part of HAX as a tile on concentric rings,
 * the connections between them, sub-webs that open from a tile, and tours
 * that walk through it a step at a time. Data comes from one JSON bundle
 * built in PRAW (`src`); the web, tile, tour and step shown are attributes,
 * so a page or a HAXcms theme can route to any of them. Every change the
 * viewer makes fires `ecosystem-web-changed` with the new state and, when
 * the bundle carries slugs, the page path for it.
 *
 * A list view (the List button) shows the same web as nested lists for
 * screen readers and keyboard users.
 *
 * @demo demo/index.html
 * @element ecosystem-web
 * @fires ecosystem-web-changed - {web, node, tour, step, path}
 */
export class EcosystemWeb extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "ecosystem-web";
  }

  constructor() {
    super();
    this.src = "";
    this.web = "main";
    this.node = "";
    this.tour = "";
    this.step = -1;
    this.listView = false;
    this.playing = false;
    this._bundle = null;
    this._models = null;
    this._error = "";
    this._view = null;
    this._drag = null;
    this._timer = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      interactiveWeb: "Interactive web",
      ecosystemWeb: "Ecosystem web",
      loading: "Loading the web",
      loadError: "The web could not be loaded.",
      tourFor: "Tour for",
      followAStory: "Follow a story",
      overview: "Overview",
      pressPlay: "Press Play for the tour",
      play: "Play",
      pause: "Pause",
      replay: "Replay",
      previous: "Previous step",
      next: "Next step",
      showAll: "Show all",
      stepOf: "of",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      fit: "Fit the web",
      listView: "List view",
      webView: "Web view",
      open: "Open the",
      web: "web",
      showIn: "Show in the",
      backTo: "Back to the",
      clear: "Clear selection",
      howToRead: "How to read the web",
      howToReadText:
        "Rings run from the center out. Select any tile to see what it is and what it connects to; tiles with a corner badge open their own web.",
      source: "Source",
      connects: "connects to",
      pillar: "Pillars",
      contrib: "People",
      org: "Organizations and ecosystems",
      schema: "Schema contracts",
      rel: "Relationships",
      dragHint: "Drag to pan · pinch or Ctrl + scroll to zoom",
      prerelease: "Pre-release",
      planned: "Planned",
      gap: "Gap",
      inProgress: "In progress",
    };
  }

  static get properties() {
    return {
      ...super.properties,
      /** URL of the JSON bundle built in PRAW: {order, webs: {id: {mmd, json}}, slugs, images} */
      src: { type: String },
      /** The web shown ("main" is the ecosystem web) */
      web: { type: String, reflect: true },
      /** The selected tile's id in that web */
      node: { type: String, reflect: true },
      /** The tour being played */
      tour: { type: String, reflect: true },
      /** The tour step shown, from 0; -1 shows the whole web */
      step: { type: Number, reflect: true },
      /** Show the web as nested lists instead of the drawing */
      listView: { type: Boolean, reflect: true, attribute: "list-view" },
      /** Advance the tour on its own */
      playing: { type: Boolean, reflect: true },
      _models: { type: Object, state: true },
      _error: { type: String, state: true },
      _view: { type: Object, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
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
          --chip: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
          --accent: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          --accent-ink: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --link: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          --edge: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
          --pillar: light-dark(
            var(--ddd-theme-default-roarGolden),
            var(--ddd-theme-default-inventOrange)
          );
          --schema: var(--ddd-theme-default-creekTeal);
          --org: light-dark(
            var(--ddd-theme-default-original87Pink),
            var(--ddd-theme-default-discoveryCoral)
          );
          --person: var(--ddd-theme-default-skyBlue);
          --signal-revealed: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          --signal-disabled: var(--ddd-theme-default-limestoneGray);
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
          flex: 1 1 280px;
          min-width: 0;
        }
        .eyebrow {
          margin: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .eyebrow button {
          font: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
          color: var(--link);
          background: none;
          border: 0;
          padding: 0;
          cursor: pointer;
          text-decoration: underline;
        }
        h2 {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          color: var(--heading);
        }
        .actions,
        .chips,
        .bar .btns {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          align-items: center;
        }
        button.act {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          min-height: 40px;
          padding: 0 var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-rounded);
          border: var(--ddd-border-xs);
          border-color: var(--line);
          background: var(--surface);
          color: var(--fg);
          cursor: pointer;
        }
        button.act[aria-pressed="true"],
        button.act.primary {
          background: var(--accent);
          color: var(--accent-ink);
          border-color: var(--accent);
        }
        button:focus-visible,
        a:focus-visible,
        .node:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .tours {
          display: grid;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--line);
        }
        .tours .lab {
          color: var(--muted);
          margin-inline-end: var(--ddd-spacing-1);
        }
        .body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          min-width: 0;
        }
        @media (max-width: 980px) {
          .body {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        .stage {
          position: relative;
          min-width: 0;
          cursor: grab;
        }
        .stage.dragging {
          cursor: grabbing;
        }
        svg.net {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 1 / 1;
          max-height: 80vh;
          touch-action: none;
          user-select: none;
        }
        .mapctl {
          position: absolute;
          right: var(--ddd-spacing-2);
          bottom: var(--ddd-spacing-2);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }
        .mapctl button {
          width: 44px;
          height: 44px;
          border-radius: var(--ddd-radius-circle);
          border: var(--ddd-border-xs);
          border-color: var(--line);
          background: var(--surface);
          color: var(--fg);
          cursor: pointer;
        }
        .hint {
          margin: 0;
          color: var(--muted);
        }
        .zoomhint {
          position: absolute;
          left: var(--ddd-spacing-2);
          bottom: var(--ddd-spacing-2);
          background: var(--surface);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-rounded);
          border: var(--ddd-border-xs);
          border-color: var(--line);
        }
        .edge {
          fill: none;
          stroke-linecap: round;
        }
        .edge.k-rel {
          stroke: var(--edge);
          stroke-width: 1.3;
          opacity: 0.5;
        }
        .edge.k-pillar {
          stroke: var(--pillar);
          stroke-width: 1.6;
          opacity: 0.5;
        }
        .edge.k-schema {
          stroke: var(--schema);
          stroke-width: 1.6;
          stroke-dasharray: 6 4;
          opacity: 0.65;
        }
        .edge.k-org {
          stroke: var(--org);
          stroke-width: 2.4;
          stroke-dasharray: 0.1 6;
          opacity: 0.7;
        }
        .edge.k-contrib {
          stroke: var(--person);
          stroke-width: 1.1;
          opacity: 0.3;
        }
        .focus .edge {
          opacity: 0.06;
        }
        .focus .edge.hot {
          opacity: 1;
          stroke-width: 3;
        }
        .edge.off {
          opacity: 0 !important;
        }
        .node {
          cursor: pointer;
        }
        .node .tl {
          fill: var(--tile);
          stroke: light-dark(transparent, var(--ddd-theme-default-slateGray));
          stroke-width: 1.5;
        }
        .node.t4 .tl {
          stroke: var(--surface);
          stroke-width: 2;
        }
        .node.st-planned .tl {
          stroke: var(--signal-revealed);
          stroke-dasharray: 5 4;
          stroke-width: 2;
          fill-opacity: 0.35;
        }
        .node.st-gap .tl {
          stroke: var(--signal-disabled);
          stroke-dasharray: 2 4;
          stroke-width: 2.5;
          fill-opacity: 0.25;
        }
        .node.st-planned .ic,
        .node.st-gap .ic {
          opacity: 0.55;
        }
        .node .rim,
        .node .inset {
          fill: none;
          stroke: var(--glyph);
          stroke-opacity: 0.4;
          stroke-width: 1.5;
        }
        .node .halo {
          fill: none;
          stroke: var(--accent);
          stroke-width: 3;
          opacity: 0;
        }
        .node.sel .halo,
        .node:focus-visible .halo {
          opacity: 1;
        }
        .node .lb {
          font-family: var(--ddd-font-primary);
          font-weight: var(--ddd-font-weight-medium);
          font-size: 13px;
          fill: var(--fg);
          text-anchor: middle;
          paint-order: stroke;
          stroke: var(--surface);
          stroke-width: 4px;
          stroke-linejoin: round;
        }
        .node.t0 .lb {
          font-family: var(--ddd-font-secondary);
          font-weight: var(--ddd-font-weight-bold);
          font-size: 15px;
        }
        .node.t1 .lb {
          font-weight: var(--ddd-font-weight-bold);
        }
        .node.t2 .lb,
        .node.t4 .lb {
          font-size: 12px;
        }
        .node .mono {
          font-family: var(--ddd-font-primary);
          font-weight: var(--ddd-font-weight-bold);
          fill: var(--glyph);
          text-anchor: middle;
          dominant-baseline: central;
        }
        .node .badge {
          stroke: var(--surface);
          stroke-width: 2;
        }
        .node .badge.pre {
          fill: var(--signal-revealed);
        }
        .node .badge.web {
          fill: var(--accent);
        }
        .node .badge-ic {
          stroke: var(--surface);
          stroke-width: 2;
          pointer-events: none;
        }
        .node .ic simple-icon-lite {
          color: var(--glyph);
          --simple-icon-width: 100%;
          --simple-icon-height: 100%;
          display: block;
          width: 100%;
          height: 100%;
        }
        .focus .node {
          opacity: 0.16;
        }
        .focus .node.sel,
        .focus .node.rel {
          opacity: 1;
        }
        .node.off {
          opacity: 0 !important;
          pointer-events: none;
        }
        .far .node.t2 .lb,
        .far .node.t3 .lb,
        .far .node.t4 .lb,
        .mid .node.t4 .lb {
          display: none;
        }
        .node.sel .lb,
        .focus .node.rel .lb {
          display: block !important;
        }
        @media (forced-colors: active) {
          .node .tl {
            fill: Canvas;
            stroke: CanvasText;
          }
          .node .rim,
          .node .inset {
            stroke: CanvasText;
          }
          .node .ic simple-icon-lite,
          .mapctl simple-icon-lite {
            /* the glyph is an image tinted by an SVG flood, which forced
               colors drops: keep the tint and give it a system color */
            forced-color-adjust: none;
            color: CanvasText;
          }
          .node .mono,
          .node .lb {
            fill: CanvasText;
          }
          .node .halo {
            stroke: Highlight;
          }
          .node .badge.pre,
          .node .badge.web {
            fill: CanvasText;
          }
          .edge {
            stroke: CanvasText;
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .node,
          .edge {
            transition: opacity var(--ddd-duration-normal, 300ms)
              var(--ddd-timing-ease, ease);
          }
        }
        .rail {
          border-inline-start: var(--ddd-border-xs);
          border-color: var(--line);
          padding: var(--ddd-spacing-4);
          display: grid;
          gap: var(--ddd-spacing-3);
          align-content: start;
          max-height: 80vh;
          overflow: auto;
          min-width: 0;
        }
        @media (max-width: 980px) {
          .rail {
            border-inline-start: 0;
            border-top: var(--ddd-border-xs);
            border-color: var(--line);
            max-height: none;
          }
        }
        .rail h3 {
          margin: 0;
          font-size: var(--ddd-font-size-xxs);
          color: var(--heading);
          overflow-wrap: anywhere;
        }
        .rail .grp {
          color: var(--muted);
          font-family: var(--ddd-font-navigation);
        }
        .rail p {
          margin: 0;
        }
        .st {
          font-family: var(--ddd-font-navigation);
          padding: 0 var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-rounded);
          border: var(--ddd-border-size-sm) solid var(--signal-revealed);
          color: var(--fg);
          justify-self: start;
        }
        .st.gap,
        .st.planned {
          border-style: dashed;
          border-color: var(--signal-disabled);
        }
        .note {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-xs);
          background: var(--chip);
        }
        .lnks {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-1);
        }
        .lnks a,
        .rail a {
          color: var(--link);
          font-weight: var(--ddd-font-weight-bold);
        }
        .relhead {
          margin: var(--ddd-spacing-1) 0 0;
          font-family: var(--ddd-font-navigation);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .rels,
        .list ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 2px;
        }
        .rels button,
        .list button {
          display: block;
          width: 100%;
          min-height: 40px;
          text-align: start;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border: 0;
          border-radius: var(--ddd-radius-xs);
          background: transparent;
          color: var(--fg);
          font: inherit;
          cursor: pointer;
        }
        .rels button:hover,
        .list button:hover {
          background: var(--chip);
        }
        .rels .v {
          color: var(--muted);
        }
        .list {
          padding: var(--ddd-spacing-4);
          display: grid;
          gap: var(--ddd-spacing-4);
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }
        .list h3 {
          margin: 0 0 var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          color: var(--heading);
        }
        .bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs);
          border-color: var(--line);
          background: var(--chip);
        }
        .cap {
          flex: 1 1 320px;
          min-width: 0;
        }
        .cap .n {
          font-family: var(--ddd-font-navigation);
          color: var(--muted);
        }
        .progress {
          height: 4px;
          background: var(--line);
          border-radius: var(--ddd-radius-rounded);
          overflow: hidden;
          margin-top: var(--ddd-spacing-1);
        }
        .progress b {
          display: block;
          height: 100%;
          background: var(--accent);
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
    if (changed.has("src") && this.src) this._load();
    if (changed.has("playing")) this._schedule();
    if (
      ["web", "node", "tour", "step"].some((k) => changed.has(k)) &&
      this._models
    ) {
      this._announce();
    }
  }
  disconnectedCallback() {
    clearInterval(this._timer);
    this._timer = null;
    super.disconnectedCallback();
  }
  async _load() {
    this._error = "";
    try {
      const res = await fetch(this.src);
      if (!res.ok) throw new Error(String(res.status));
      this.loadBundle(await res.json());
    } catch {
      this._error = this.t.loadError;
    }
  }
  /** Use a bundle that is already in memory instead of fetching `src`. */
  loadBundle(bundle) {
    this._bundle = bundle || {};
    this._models = buildWebs(this._bundle);
    if (!this._models[this.web]) this.web = "main";
    this._fit(false);
  }
  get _M() {
    return this._models ? this._models[this.web] : null;
  }
  _webTitle(id) {
    if (id === "main") return this.t.ecosystemWeb;
    const M = this._models && this._models[id];
    return (M && M.meta.name) || id;
  }
  _parentOf(id) {
    if (id === "main") return null;
    const M = this._models && this._models[id];
    const p = M && M.meta.parent;
    return p && p !== id && this._models[p] ? p : "main";
  }
  _canOpen(n) {
    return !!(n && n.web && this._models[n.web] && n.web !== this.web);
  }
  /** The page path for the current state, from the bundle's slugs (empty when it has none). */
  pathFor(web, node, tour, step) {
    const S = (this._bundle && this._bundle.slugs) || {};
    if (tour) {
      const p = S[`tour:${web}:${tour}`];
      return p ? `/${p}${step >= 0 ? `/step-${step + 1}` : ""}` : "";
    }
    if (node && S[`tile:${web}:${node}`]) return `/${S[`tile:${web}:${node}`]}`;
    return S[`web:${web}`] ? `/${S[`web:${web}`]}` : "";
  }
  _announce() {
    this.dispatchEvent(
      new CustomEvent("ecosystem-web-changed", {
        bubbles: true,
        composed: true,
        detail: {
          web: this.web,
          node: this.node,
          tour: this.tour,
          step: this.step,
          path: this.pathFor(this.web, this.node, this.tour, this.step),
        },
      }),
    );
  }

  // ---------- actions ----------
  openWeb(id, nodeId) {
    if (!this._models || !this._models[id]) return;
    this.playing = false;
    this.web = id;
    this.tour = "";
    this.step = -1;
    this.node = nodeId || "";
    this.updateComplete.then(() =>
      nodeId ? this._focusOn(nodeId) : this._fit(true),
    );
  }
  select(id) {
    this.node = id && id !== this.node ? id : "";
    if (this.node) this._focusOn(this.node);
  }
  _focusOn(id) {
    const M = this._M;
    if (!M || !M.nodes.has(id)) return;
    const rel = new Set([id]);
    M.edges.forEach((e) => {
      if (e.from === id) rel.add(e.to);
      if (e.to === id) rel.add(e.from);
    });
    this._view = boxOf(M, [...rel], 110, 620, M.geo.width);
  }
  _fit() {
    const M = this._M;
    if (!M) return;
    const vis = visibleAt(this._steps(), this.step);
    const ids = [...M.nodes.keys()].filter((id) => !vis || vis.has(id));
    this._view = boxOf(M, ids, 90, 600, M.geo.width);
  }
  _steps() {
    const M = this._M;
    return M && this.tour ? tourSteps(M, this.tour) : [];
  }
  pickTour(id) {
    this.playing = false;
    this.node = "";
    this.tour = id;
    this.step = -1;
    this._fit();
  }
  goStep(i) {
    const steps = this._steps();
    if (!steps.length) return;
    this.node = "";
    this.step = Math.max(0, Math.min(steps.length - 1, i));
    const vis = visibleAt(steps, this.step);
    const M = this._M;
    if (!vis) this._fit();
    else
      this._view = boxOf(
        M,
        steps[this.step].ids.length ? steps[this.step].ids : [...vis],
        100,
        560,
        M.geo.width,
      );
    if (this.step >= steps.length - 1) this.playing = false;
  }
  togglePlay() {
    if (!this.tour) {
      const M = this._M;
      this.tour = M && M.tours.length ? M.tours[0].id : "";
    }
    const steps = this._steps();
    if (!this.playing && this.step >= steps.length - 1) this.step = -1;
    this.playing = !this.playing;
    if (this.playing) this.goStep(this.step + 1);
  }
  showAll() {
    this.playing = false;
    this.step = -1;
    this.node = "";
    this._fit();
  }
  _schedule() {
    clearInterval(this._timer);
    this._timer = null;
    if (this.playing)
      this._timer = setInterval(() => this.goStep(this.step + 1), 3200);
  }
  _zoom(f) {
    const v = this._view;
    if (!v) return;
    const M = this._M;
    const nw = Math.max(260, Math.min(M.geo.width * 1.15, v.w * f));
    this._view = { x: v.x + (v.w - nw) / 2, y: v.y + (v.w - nw) / 2, w: nw };
  }

  // ---------- pointer: pan, pinch, wheel ----------
  _svgPoint(e) {
    const r = e.currentTarget.getBoundingClientRect();
    return { r, k: Math.min(r.width, r.height) / this._view.w };
  }
  _down(e) {
    this._ptrs = this._ptrs || new Map();
    this._ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this._moved = false;
    this._drag = { x: e.clientX, y: e.clientY, v: { ...this._view } };
  }
  _move(e) {
    if (!this._drag || !this._ptrs || !this._ptrs.has(e.pointerId)) return;
    const dx = e.clientX - this._drag.x;
    const dy = e.clientY - this._drag.y;
    if (!this._moved && Math.hypot(dx, dy) < 5) return;
    this._moved = true;
    const { k } = this._svgPoint(e);
    this._view = {
      x: this._drag.v.x - dx / k,
      y: this._drag.v.y - dy / k,
      w: this._drag.v.w,
    };
  }
  _up(e) {
    if (this._ptrs) this._ptrs.delete(e.pointerId);
    this._drag = null;
  }
  _wheel(e) {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    this._zoom(Math.exp(e.deltaY * 0.0025));
  }
  _tileClick(id) {
    if (this._moved) return;
    this.select(id);
  }
  _tileKey(e, id) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.select(id);
    }
  }
  _tileOpen(n) {
    if (this._canOpen(n)) this.openWeb(n.web);
  }

  // ---------- drawing ----------
  _shape(n, s) {
    const h = s / 2;
    if (n.shape === "circle") return svg`<circle class="tl" r="${h}"></circle>`;
    if (n.shape === "hex") {
      const r = h * 1.1;
      const p = [];
      for (let k = 0; k < 6; k++) {
        const a = -Math.PI / 2 + (k * Math.PI) / 3;
        p.push(
          `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`,
        );
      }
      return svg`<polygon class="tl" points="${p.join(" ")}" stroke-linejoin="round"></polygon>`;
    }
    if (n.shape === "cyl") {
      const e = s * 0.15;
      return svg`<path class="tl" d="M${-h} ${-h + e}A${h} ${e} 0 0 1 ${h} ${-h + e}V${h - e}A${h} ${e} 0 0 1 ${-h} ${h - e}Z"></path><path class="rim" d="M${-h} ${-h + e}A${h} ${e} 0 0 0 ${h} ${-h + e}"></path>`;
    }
    if (n.shape === "pill") {
      const w = h * 1.3;
      const hh = h * 0.86;
      return svg`<rect class="tl" x="${-w}" y="${-hh}" width="${w * 2}" height="${hh * 2}" rx="${hh}"></rect>`;
    }
    if (n.shape === "talk") {
      const w = h * 1.25;
      return svg`<polygon class="tl" points="${-w},${-h} ${w},${-h} ${w},${h} ${-w},${h} ${-w + 10},0" stroke-linejoin="round"></polygon>`;
    }
    if (n.shape === "org") {
      const w = h * 1.22;
      return svg`<rect class="tl" x="${-w}" y="${-h}" width="${w * 2}" height="${s}" rx="${(s * 0.14).toFixed(1)}"></rect><rect class="inset" x="${-w + 4}" y="${-h + 4}" width="${w * 2 - 8}" height="${s - 8}" rx="${(s * 0.08).toFixed(1)}"></rect>`;
    }
    return svg`<rect class="tl" x="${-h}" y="${-h}" width="${s}" height="${s}" rx="${(s * 0.24).toFixed(1)}"></rect>`;
  }
  _halo(n, s) {
    const h = s / 2 + 5;
    if (n.shape === "circle" || n.shape === "hex")
      return svg`<circle class="halo" r="${n.shape === "hex" ? h + 3 : h}"></circle>`;
    const w =
      n.shape === "pill"
        ? (s / 2) * 1.3 + 5
        : n.shape === "org"
          ? (s / 2) * 1.22 + 5
          : n.shape === "talk"
            ? (s / 2) * 1.25 + 5
            : h;
    return svg`<rect class="halo" x="${-w}" y="${-h}" width="${w * 2}" height="${h * 2}" rx="${s * 0.25}"></rect>`;
  }
  /** an image path from the bundle, resolved against the bundle's own URL; only http(s) is followed */
  _asset(u) {
    try {
      const base = new URL(this.src || "./", globalThis.document.baseURI);
      return safeUrl(new URL(u, base).href);
    } catch {
      return "#";
    }
  }
  _icon(n, s) {
    const images = (this._bundle && this._bundle.images) || {};
    if (n.image && images[n.image]) {
      const r = s / 2 - 4;
      return svg`<image href="${this._asset(images[n.image])}" x="${-r}" y="${-r}" width="${r * 2}" height="${r * 2}" preserveAspectRatio="xMidYMid slice"></image>`;
    }
    if (n.mono) {
      const fs =
        s * (n.mono.length <= 2 ? 0.4 : n.mono.length === 3 ? 0.32 : 0.26);
      return svg`<text class="mono" style="font-size:${fs.toFixed(1)}px">${n.mono}</text>`;
    }
    const k =
      { pill: 0.5, cyl: 0.5, hex: 0.56, org: 0.58, talk: 0.52 }[n.shape] ||
      0.54;
    const z = s * k;
    const dy = n.shape === "cyl" ? s * 0.06 : 0;
    const dx = n.shape === "talk" ? 4 : 0;
    return svg`<foreignObject x="${(-z / 2 + dx).toFixed(1)}" y="${(-z / 2 + dy).toFixed(1)}" width="${z.toFixed(1)}" height="${z.toFixed(1)}"><simple-icon-lite icon="${n.icon || "icons:help"}" aria-hidden="true"></simple-icon-lite></foreignObject>`;
  }
  _tile(n, vis, rel) {
    const t = n.tier;
    const sizes = this._M.geo.sizes;
    const s = sizes[t] != null ? sizes[t] : sizes[sizes.length - 1];
    const h = s / 2;
    const st = n.doc.status;
    const lines = labelLines(n.label, labelWidth(n, t));
    const ly =
      (n.shape === "pill" ? h * 0.86 : n.shape === "hex" ? h * 1.1 : h) + 16;
    const cls = [
      "node",
      `t${t}`,
      st ? `st-${st}` : "",
      this.node === n.id ? "sel" : "",
      rel.has(n.id) ? "rel" : "",
      vis && !vis.has(n.id) ? "off" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const style = `--tile:${n.color};--glyph:${glyphFor(n.color)}`;
    const open = this._canOpen(n);
    return svg`<g class="${cls}" transform="translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})" style="${style}"
      tabindex="${vis && !vis.has(n.id) ? -1 : 0}" role="button" aria-pressed="${this.node === n.id ? "true" : "false"}"
      aria-label="${n.label}${open ? `, ${this.t.open} ${this._webTitle(n.web)} ${this.t.web}` : ""}"
      @click="${() => this._tileClick(n.id)}" @dblclick="${() => this._tileOpen(n)}" @keydown="${(e) => this._tileKey(e, n.id)}">
      ${this._halo(n, s)}${this._shape(n, s)}<g class="ic">${this._icon(n, s)}</g>
      ${st === "prerelease" ? svg`<circle class="badge pre" cx="${h - 1}" cy="${-h + 1}" r="7"></circle>` : nothing}
      ${open ? svg`<circle class="badge web" cx="${h - 1}" cy="${h - 1}" r="9"></circle><path class="badge-ic" d="M${h - 5} ${h - 1}h8M${h - 1} ${h - 5}v8"></path>` : nothing}
      <text class="lb" y="${ly}">${lines.map((l, i) => svg`<tspan x="0" dy="${i ? 14 : 0}">${l}${i < lines.length - 1 ? " " : ""}</tspan>`)}</text>
    </g>`;
  }
  _drawing() {
    const M = this._M;
    const vis = visibleAt(this._steps(), this.step);
    const R = this.node
      ? M.edges.filter((e) => e.from === this.node || e.to === this.node)
      : [];
    const rel = new Set(R.flatMap((e) => [e.from, e.to]));
    const v = this._view || { x: 0, y: 0, w: M.geo.width };
    const k = 800 / v.w;
    const zoom = k < 0.5 ? "far" : k < 0.8 ? "mid" : "near";
    const ordered = [...M.nodes.values()].sort(
      (a, b) =>
        b.tier - a.tier ||
        (a.id === this.node ? 1 : b.id === this.node ? -1 : 0),
    );
    return html`<div
      class="stage ${this._drag && this._moved ? "dragging" : ""}"
    >
      <svg
        class="net ${this.node ? "focus" : ""} ${zoom}"
        viewBox="${v.x.toFixed(1)} ${v.y.toFixed(1)} ${v.w.toFixed(1)} ${v.w.toFixed(1)}"
        role="group"
        aria-label="${this._webTitle(this.web)}"
        @pointerdown="${this._down}"
        @pointermove="${this._move}"
        @pointerup="${this._up}"
        @pointercancel="${this._up}"
        @wheel="${this._wheel}"
      >
        <g class="edges">
          ${M.edges.map((e) => {
            const off = vis && !(vis.has(e.from) && vis.has(e.to));
            return svg`<path class="edge k-${e.kind} ${R.includes(e) ? "hot" : ""} ${off ? "off" : ""}" d="${edgePath(M, e, M.geo.center)}"></path>`;
          })}
        </g>
        <g class="nodes">${ordered.map((n) => this._tile(n, vis, rel))}</g>
      </svg>
      <p class="hint zoomhint">${this.t.dragHint}</p>
      <div class="mapctl">
        <button
          type="button"
          aria-label="${this.t.zoomIn}"
          title="${this.t.zoomIn}"
          @click="${() => this._zoom(1 / 1.4)}"
        >
          +
        </button>
        <button
          type="button"
          aria-label="${this.t.zoomOut}"
          title="${this.t.zoomOut}"
          @click="${() => this._zoom(1.4)}"
        >
          −
        </button>
        <button
          type="button"
          aria-label="${this.t.fit}"
          title="${this.t.fit}"
          @click="${() => this._fit()}"
        >
          <simple-icon-lite
            icon="icons:fullscreen"
            aria-hidden="true"
          ></simple-icon-lite>
        </button>
      </div>
    </div>`;
  }
  _sentence(e, id) {
    const M = this._M;
    const a = M.nodes.get(e.from);
    const b = M.nodes.get(e.to);
    const o = e.from === id ? b : a;
    const lab = e.label || this.t.connects;
    return html`<li>
      <button type="button" @click="${() => this.select(o.id)}">
        ${e.from === id ? html`<span class="v">${lab}</span> ${b.label}` : html`${a.label} <span class="v">${lab} ${b.label}</span>`}
      </button>
    </li>`;
  }
  _rail() {
    const M = this._M;
    if (!this.node || !M.nodes.has(this.node)) {
      const parent = this._parentOf(this.web);
      return html`<aside class="rail" aria-label="${this.t.overview}">
        <h3>
          ${this.web === "main" ? this.t.howToRead : this._webTitle(this.web)}
        </h3>
        <p class="hint">
          ${this.web === "main" ? this.t.howToReadText : M.meta.about || ""}
        </p>
        ${parent ? html`<button class="act" type="button" @click="${() => this.openWeb(parent)}">${this.t.backTo} ${this._webTitle(parent)} ${this.t.web}</button>` : nothing}
      </aside>`;
    }
    const n = M.nodes.get(this.node);
    const d = n.doc || {};
    const SL = M.meta.sectionLabels || {};
    const R = M.edges.filter((e) => e.from === n.id || e.to === n.id);
    const stWord = {
      prerelease: this.t.prerelease,
      planned: this.t.planned,
      gap: this.t.gap,
      "in-progress": this.t.inProgress,
    };
    const home = n.portal === true ? "main" : n.portal;
    return html`<aside class="rail" aria-label="${n.label}">
      <div>
        <h3>${n.label}</h3>
        <div class="grp">${n.group ? n.group.label : ""}</div>
      </div>
      ${d.status ? html`<span class="st ${d.status}">${d.status === "released" && d.version ? `${d.version}` : stWord[d.status] || d.status}</span>` : nothing}
      ${d.desc ? html`<p>${d.desc}</p>` : nothing}
      ${d.source && d.source.url ? html`<p class="hint">${this.t.source}: <a href="${safeUrl(d.source.url)}" target="_blank" rel="noopener">${d.source.label}</a></p>` : nothing}
      ${Object.keys(d.links || {}).length ? html`<div class="lnks">${Object.entries(d.links).map(([k, u]) => html`<a href="${safeUrl(u)}" target="_blank" rel="noopener">${LINK_LABEL[k] || k}</a>`)}</div>` : nothing}
      ${this._canOpen(n) ? html`<button class="act primary" type="button" @click="${() => this.openWeb(n.web)}">${this.t.open} ${this._webTitle(n.web)} ${this.t.web}</button>` : nothing}
      ${this.web !== "main" && home && this._models[home] ? html`<button class="act" type="button" @click="${() => this.openWeb(home, n.id)}">${this.t.showIn} ${this._webTitle(home)} ${this.t.web}</button>` : nothing}
      ${d.note ? html`<p class="note">${d.note}</p>` : nothing}
      ${KIND_ORDER.map((k) => {
        const L = R.filter((e) => e.kind === k);
        return L.length
          ? html`<p class="relhead">${SL[k] || this.t[k]} · ${L.length}</p>
              <ul class="rels">
                ${L.map((e) => this._sentence(e, n.id))}
              </ul>`
          : nothing;
      })}
      <button class="act" type="button" @click="${() => this.select(null)}">
        ${this.t.clear}
      </button>
    </aside>`;
  }
  _list() {
    const M = this._M;
    return html`<div class="list">
      ${M.groups.map((g) => {
        const ns = [...M.nodes.values()].filter((n) => n.group === g);
        return ns.length
          ? html`<section>
              <h3>${g.label}</h3>
              <ul>
                ${ns.map((n) => html`<li><button type="button" aria-pressed="${this.node === n.id ? "true" : "false"}" @click="${() => this.select(n.id)}">${n.label}</button></li>`)}
              </ul>
            </section>`
          : nothing;
      })}
    </div>`;
  }
  _tours() {
    const M = this._M;
    const aud = M.tours.filter((t) => t.kind !== "story");
    const story = M.tours.filter((t) => t.kind === "story");
    const chip = (t) =>
      html`<button
        class="act"
        type="button"
        aria-pressed="${this.tour === t.id ? "true" : "false"}"
        @click="${() => this.pickTour(t.id)}"
      >
        ${t.label}
      </button>`;
    return html`<div class="tours">
      ${aud.length ? html`<div class="chips"><span class="lab">${this.t.tourFor}</span>${aud.map(chip)}</div>` : nothing}
      ${story.length ? html`<div class="chips"><span class="lab">${this.t.followAStory}</span>${story.map(chip)}</div>` : nothing}
    </div>`;
  }
  _bar() {
    const M = this._M;
    const steps = this._steps();
    const t = M.tours.find((x) => x.id === this.tour) || M.tours[0];
    const S = this.step >= 0 && steps[this.step];
    const pct = S ? ((this.step + 1) / steps.length) * 100 : 0;
    const last = this.step >= steps.length - 1 && this.step >= 0;
    return html`<div class="bar">
      <div class="cap" aria-live="polite">
        <div class="n">
          ${S ? `${t.label} · ${this.step + 1} ${this.t.stepOf} ${steps.length}` : this.t.overview}
        </div>
        <div>${S ? S.caption : `${this.t.pressPlay}: ${t.label}.`}</div>
        <div class="progress"><b style="width:${pct}%"></b></div>
      </div>
      <div class="btns">
        <button
          class="act primary"
          type="button"
          aria-label="${this.t.previous}"
          @click="${() => {
            this.playing = false;
            this.goStep(this.step - 1);
          }}"
        >
          ‹
        </button>
        <button class="act primary" type="button" @click="${this.togglePlay}">
          ${this.playing ? this.t.pause : last ? this.t.replay : this.t.play}
        </button>
        <button
          class="act primary"
          type="button"
          aria-label="${this.t.next}"
          @click="${() => {
            this.playing = false;
            if (!this.tour) this.tour = t.id;
            this.goStep(this.step + 1);
          }}"
        >
          ›
        </button>
        <button class="act" type="button" @click="${this.showAll}">
          ${this.t.showAll}
        </button>
      </div>
    </div>`;
  }
  _crumbs() {
    const chain = [];
    let p = this._parentOf(this.web);
    while (p) {
      chain.unshift(p);
      p = this._parentOf(p);
    }
    return chain.length
      ? html`${chain.map((id) => html`<button type="button" @click="${() => this.openWeb(id)}">${this._webTitle(id)}</button> › `)}${this._webTitle(this.web)}`
      : this.t.interactiveWeb;
  }

  render() {
    if (this._error)
      return html`<p class="msg" role="alert">${this._error}</p>`;
    if (!this._M)
      return html`<p class="msg" role="status" aria-busy="true">
        ${this.t.loading}
      </p>`;
    return html`<header>
        <div class="titles">
          <p class="eyebrow">${this._crumbs()}</p>
          <h2>${this._webTitle(this.web)}</h2>
        </div>
        <div class="actions">
          <button
            class="act"
            type="button"
            aria-pressed="${this.listView ? "true" : "false"}"
            @click="${() => {
              this.listView = !this.listView;
            }}"
          >
            ${this.listView ? this.t.webView : this.t.listView}
          </button>
        </div>
      </header>
      ${this._tours()}
      <div class="body">
        ${this.listView ? this._list() : this._drawing()}${this._rail()}
      </div>
      ${this._bar()}`;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(EcosystemWeb.tag, EcosystemWeb);
