/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, svg, css, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { SimpleIconsetStore } from "@haxtheweb/simple-icon/lib/simple-iconset.js";
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
  parseGlyph,
  easeOut,
  lerpView,
  safeImage,
  LENSES,
  lensOf,
  impactIndex,
  impactCuts,
  timelineSteps,
  searchNodes,
  degree,
} from "./lib/ecosystem-model.js";

/** Glyphs by icon name, shared by every ecosystem-web on the page. */
const GLYPHS = new Map();
/** How long a camera move takes, in ms. */
const CAM_MS = 460;
/** How long the web fades out before a new one opens, in ms. */
const SWAP_MS = 160;
/** The tour id of "Over time", the web growing year by year. */
const TIME = "_time";
/** How many search matches the list shows. */
const MAX_HITS = 14;

function reducedMotion() {
  return !!(
    globalThis.matchMedia &&
    globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

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

/** Up to three initials of a label, as a stand-in for art. */
function initials(label) {
  return String(label || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** One glyph shape as an SVG template (attributes come from parseGlyph). */
function glyphShape(sh) {
  const a = sh.a;
  const v = (k) => (a[k] == null ? nothing : a[k]);
  switch (sh.tag) {
    case "path":
      return svg`<path d="${v("d")}" fill-rule="${v("fill-rule")}" clip-rule="${v("clip-rule")}" transform="${v("transform")}" opacity="${v("opacity")}" fill="${v("fill")}" stroke="${v("stroke")}" stroke-width="${v("stroke-width")}"></path>`;
    case "circle":
      return svg`<circle cx="${v("cx")}" cy="${v("cy")}" r="${v("r")}" transform="${v("transform")}" opacity="${v("opacity")}" fill="${v("fill")}" stroke="${v("stroke")}" stroke-width="${v("stroke-width")}"></circle>`;
    case "ellipse":
      return svg`<ellipse cx="${v("cx")}" cy="${v("cy")}" rx="${v("rx")}" ry="${v("ry")}" transform="${v("transform")}" opacity="${v("opacity")}" fill="${v("fill")}" stroke="${v("stroke")}" stroke-width="${v("stroke-width")}"></ellipse>`;
    case "rect":
      return svg`<rect x="${v("x")}" y="${v("y")}" width="${v("width")}" height="${v("height")}" rx="${v("rx")}" ry="${v("ry")}" transform="${v("transform")}" opacity="${v("opacity")}" fill="${v("fill")}" stroke="${v("stroke")}" stroke-width="${v("stroke-width")}"></rect>`;
    case "polygon":
      return svg`<polygon points="${v("points")}" transform="${v("transform")}" opacity="${v("opacity")}" fill="${v("fill")}" stroke="${v("stroke")}" stroke-width="${v("stroke-width")}"></polygon>`;
    case "polyline":
      return svg`<polyline points="${v("points")}" transform="${v("transform")}" opacity="${v("opacity")}" fill="${v("fill")}" stroke="${v("stroke")}" stroke-width="${v("stroke-width")}"></polyline>`;
    case "line":
      return svg`<line x1="${v("x1")}" y1="${v("y1")}" x2="${v("x2")}" y2="${v("y2")}" transform="${v("transform")}" opacity="${v("opacity")}" stroke="${v("stroke")}" stroke-width="${v("stroke-width")}"></line>`;
    default:
      return nothing;
  }
}

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
 * screen readers and keyboard users. Layers hide kinds of connection; a lens
 * reads every tile by one measure (freshness, bus factor, impact, evidence,
 * parity) from the bundle's `layers`; search finds a tile by name, group or
 * verb; "Over time" grows the web year by year; Present fills the screen.
 * In the HAX editor the element shows the web's Mermaid and JSON source.
 *
 * Finishing a tour or the timeline fires `user-engagement` (verb
 * experienced), the event HAX elements use for learner records.
 *
 * @demo demo/index.html
 * @element ecosystem-web
 * @fires ecosystem-web-changed - {web, node, tour, step, lens, path}
 * @fires user-engagement - {activityDisplay: "experienced", objectName, objectId, resultCompletion}
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
    this.compact = false;
    this.lens = "";
    this._toursOpen = false;
    this._hidden = new Set();
    this._panel = "";
    this._q = "";
    this._qAct = 0;
    this._editing = false;
    this._presenting = false;
    this._srcTab = "mmd";
    this._key = this._key.bind(this);
    this._fsChange = this._fsChange.bind(this);
    this._bundle = null;
    this._models = null;
    this._error = "";
    this._cam = null;
    this._raf = 0;
    this._edgePrev = null;
    this._drag = null;
    this._timer = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      interactiveWeb: "Interactive web",
      ecosystemWeb: "Ecosystem web",
      loading: "Loading the web",
      loadError: "The web could not be loaded.",
      tours: "Tours",
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
      overTime: "Over time",
      growTheWeb: "Press Play to grow the web year by year.",
      today: "Today",
      todayCaption: "The whole web as it stands today.",
      nextYear: "Next",
      nextCaption: "Planned next:",
      everythingElse: "Everything else",
      everythingElseCaption: "The rest of the web.",
      personJoins: "1 person joins",
      peopleJoin: "{n} people join",
      andMore: "and {n} more",
      layers: "Layers",
      show: "Show",
      readBy: "Read by",
      connectionsOnly: "Connections only",
      search: "Search",
      searchLabel: "Search the web",
      searchPlaceholder: "Search people, parts, verbs",
      searchMatches: "matches",
      searchMatch: "match",
      searchNone:
        'Nothing matches. Try a person, a group, an icon or a verb like "styles".',
      searchHelp: 'Type a name, a group, an icon or a verb like "styles".',
      links: "links",
      present: "Present full screen",
      exitPresent: "Exit full screen",
      notMeasured: "Not measured for this tile.",
      faded: "faded: not measured",
      lensFresh: "Freshness",
      lensBus: "Bus factor",
      lensImpact: "Impact",
      lensEvidence: "Evidence",
      lensParity: "Parity",
      freshAbout:
        "How recently the code behind a tile changed: the last commit on main to its path. A filled corner dot means main has changed more than 14 days after the last release, so a release is due. Faded tiles have no code path to check.",
      freshA: "Changed in the last 90 days",
      freshB: "Changed this year",
      freshC: "Quiet for over a year",
      freshText: "Last change on main {date}, {ago}.",
      freshReleased: "Last release {date}.",
      freshDue: "Main has changed since the last release.",
      freshDueKey:
        "with a release due: main changed 14+ days after the last release",
      today0: "today",
      dayAgo: "a day ago",
      daysAgo: "{n} days ago",
      monthsAgo: "{n} months ago",
      busAbout:
        "How many people besides the maintainers are connected to each code part, by any kind of connection in any web. Only code parts count (a repo or npm link, or a release); other tiles are faded. The corner badge shows the count.",
      busA: "Two or more others",
      busB: "One other person",
      busC: "Only the maintainers",
      busText: "Besides the maintainers: {who}.",
      busNone: "Only the maintainers are connected to it.",
      impactAbout:
        "How much else touches a tile: its distinct connections across every web it appears in. Bands split this web into thirds.",
      impactA: "Most connected third",
      impactB: "Middle third",
      impactC: "Least connected third",
      impactText: "{n} distinct connections across {w} webs.",
      impactText1: "{n} distinct connections across 1 web.",
      evidenceAbout:
        "How well a tile is backed up: a cited source, links, and evidence on its connections.",
      evidenceA: "Strong: three or more",
      evidenceB: "Some: one or two",
      evidenceC: "None yet",
      evidenceText:
        "{n} pieces of evidence: sources, links and connection evidence.",
      evidenceNone: "No source, links or connection evidence yet.",
      parityAbout:
        "From the parity run: three dots per feature, left to right: API pair (Node.js and PHP), CLI, Agent. A filled dot matches; an open dot has a gap to close. The surfaces compared get a plain ring; planned parts a dashed one.",
      parityApiAbout:
        "For each API operation: whether the PHP and Node.js backends both implement it, and whether the CLI and the MCP server call it. Faded tiles are not API operations.",
      parityA: "Matches everywhere measured",
      parityB: "Matches in part",
      parityC: "Gaps on every surface measured",
      parityS: "A surface being compared",
      parityP: "Planned: will need parity",
      paritySurface:
        "One of the surfaces the parity run compares: the same seeded operations go to each, and the sites they write are compared.",
      parityPlanned:
        "Planned. When it lands it joins the parity run on every surface.",
      parityDots: ["API pair (Node.js and PHP)", "CLI", "Agent"],
      parityMatch: "matches",
      parityGap: "gap",
      parityNone: "not measured",
      parityDotsKey: "filled matches, open has a gap, small not measured",
      parityOp:
        "PHP backend: {php}. Node.js backend: {nodejs}. CLI calls it: {cli}. MCP calls it: {mcp}.",
      yes: "yes",
      no: "no",
      authorSource: "Web source",
      authorHelp:
        "The web is two files in PRAW: Mermaid for its structure and JSON for descriptions, links, evidence, tours and years. Edit them there; this view shows what the element read.",
      copy: "Copy this file",
      copied: "Copied",
      problems: "Problems in this web",
      noProblems: "No problems found in this web.",
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
      /** Only the drawing: no header, tours, details or step bar (a figure on a page) */
      compact: { type: Boolean, reflect: true },
      _models: { type: Object, state: true },
      _error: { type: String, state: true },
      /** Read every tile by one measure: fresh, bus, impact, evidence or parity */
      lens: { type: String, reflect: true },
      _toursOpen: { type: Boolean, state: true },
      _hidden: { type: Object, state: true },
      _panel: { type: String, state: true },
      _q: { type: String, state: true },
      _qAct: { type: Number, state: true },
      _editing: { type: Boolean, state: true },
      _presenting: { type: Boolean, state: true },
      _srcTab: { type: String, state: true },
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
        button.act[aria-expanded="true"]:not(.tours-toggle),
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
        .tourlist {
          display: grid;
          gap: var(--ddd-spacing-2);
        }
        .tours-toggle {
          display: none;
          justify-self: start;
        }
        /* on a phone the tours fold behind one button, so the drawing is
           on the first screen */
        @media (max-width: 600px) {
          .tours-toggle {
            display: inline-flex;
            align-items: center;
          }
          .tours:not([data-open]) .tourlist {
            display: none;
          }
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
        .stage[data-dragging] {
          cursor: grabbing;
        }
        :host([compact]) svg.net {
          aspect-ratio: 16 / 9;
          max-height: none;
        }
        :host([compact]) .zoomhint {
          display: none;
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
          inset-inline-end: var(--ddd-spacing-2);
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
          inset-inline-start: var(--ddd-spacing-2);
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
        .lift .edge {
          opacity: 1;
          stroke-width: 3;
        }
        .scrim {
          fill: var(--surface);
          opacity: 0;
          pointer-events: none;
        }
        .net.focus .scrim {
          opacity: 0.84;
        }
        .lift {
          pointer-events: none;
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
        .node .gl {
          fill: var(--glyph);
          stroke: none;
          overflow: visible;
          pointer-events: none;
        }
        .node .gl [stroke] {
          stroke: var(--glyph);
        }
        .node .gl [fill="none"] {
          fill: none;
        }
        .node .art-fb {
          display: none;
        }

        .node.off {
          opacity: 0 !important;
          pointer-events: none;
        }
        .net[data-zoom="far"] .node.t2 .lb,
        .net[data-zoom="far"] .node.t3 .lb,
        .net[data-zoom="far"] .node.t4 .lb,
        .net[data-zoom="mid"] .node.t4 .lb {
          display: none;
        }
        .node.sel .lb,
        .lift .node .lb {
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
          .node .gl {
            fill: CanvasText;
          }
          .node image.art {
            display: none;
          }
          .node .art-fb {
            display: block;
          }
          .node .gl [stroke] {
            stroke: CanvasText;
          }
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
          .scrim {
            fill: Canvas;
          }
        }
        @media (prefers-reduced-motion: no-preference) {
          .node,
          .edge,
          .scrim {
            transition: opacity var(--ddd-duration-normal, 300ms)
              var(--ddd-timing-ease, ease);
          }
          svg.net {
            transition: opacity 160ms ease-out;
          }
          svg.net[data-swap] {
            opacity: 0;
          }
          /* connections draw in from the tile they leave */
          .edge.enter {
            stroke-dasharray: 1 !important;
            stroke-dashoffset: 1;
            animation: ew-draw 0.9s ease-out forwards;
          }
          .edge.enter.rev {
            stroke-dashoffset: -1;
          }
          @keyframes ew-draw {
            to {
              stroke-dashoffset: 0;
            }
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
        :host {
          --lens-a: light-dark(
            var(--ddd-theme-default-forestGreen),
            var(--ddd-theme-default-futureLime)
          );
          --lens-b: light-dark(
            var(--ddd-theme-default-roarGolden),
            var(--ddd-theme-default-keystoneYellow)
          );
          --lens-c: light-dark(
            var(--ddd-theme-default-original87Pink),
            var(--ddd-theme-default-discoveryCoral)
          );
          --match: light-dark(
            var(--ddd-theme-default-inventOrange),
            var(--ddd-theme-default-keystoneYellow)
          );
        }
        /* the strips under the header: layers and lenses, search */
        .strip {
          display: grid;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--line);
        }
        .strip .lab {
          color: var(--muted);
          margin-inline-end: var(--ddd-spacing-1);
        }
        button.act.layer::before {
          content: "";
          display: inline-block;
          width: 18px;
          margin-inline-end: var(--ddd-spacing-2);
          vertical-align: middle;
          border-top: 3px solid var(--edge);
        }
        button.act.layer[data-k="pillar"]::before {
          border-top-color: var(--pillar);
        }
        button.act.layer[data-k="schema"]::before {
          border-top: 3px dashed var(--schema);
        }
        button.act.layer[data-k="org"]::before {
          border-top: 3px dotted var(--org);
        }
        button.act.layer[data-k="contrib"]::before {
          border-top-color: var(--person);
        }
        .lenskey {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
          align-items: center;
          color: var(--muted);
        }
        .lenskey p {
          margin: 0;
          flex: 0 0 100%;
        }
        .lenskey .k {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          color: var(--fg);
        }
        .lenskey svg {
          width: 22px;
          height: 22px;
          flex: none;
        }
        .lenskey svg.dots {
          width: 54px;
        }
        .lenskey circle {
          fill: none;
          stroke-width: 3;
        }
        .node .lring,
        .node .ldots,
        .node .lbadge {
          display: none;
        }
        .node .lring {
          fill: none;
          stroke-width: 3;
        }
        .net.lensing .node .lring,
        .net.lensing .node .ldots,
        .net.lensing .node .lbadge {
          display: inline;
        }
        .net.lensing .node.lens-a .lring,
        .lenskey .a circle {
          stroke: var(--lens-a);
        }
        .net.lensing .node.lens-b .lring,
        .lenskey .b circle {
          stroke: var(--lens-b);
          stroke-dasharray: 9 5;
        }
        .net.lensing .node.lens-c .lring,
        .lenskey .c circle {
          stroke: var(--lens-c);
          stroke-dasharray: 2 5;
          stroke-linecap: round;
        }
        .net.lensing .node.lens-s .lring,
        .lenskey .s circle {
          stroke: var(--accent);
        }
        .net.lensing .node.lens-p .lring,
        .lenskey .p circle {
          stroke: var(--signal-revealed);
          stroke-dasharray: 5 5;
        }
        .net.lensing .node.lens-na .lring {
          display: none;
        }
        .net.lensing .node.lens-na .body {
          opacity: 0.28;
        }
        .net.lensing .node.lens-na .lb {
          opacity: 0.45;
        }
        .ldots circle,
        .lenskey .dots circle {
          stroke-width: 2.5;
        }
        .ldots .m,
        .lenskey .dots .m {
          fill: var(--lens-a);
          stroke: var(--lens-a);
        }
        .ldots .g,
        .lenskey .dots .g {
          fill: var(--surface);
          stroke: var(--lens-c);
        }
        .ldots .n,
        .lenskey .dots .n {
          fill: var(--line);
          stroke: var(--line);
        }
        .lbadge circle {
          fill: var(--surface);
          stroke: var(--fg);
          stroke-width: 1.5;
        }
        .lbadge text {
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          font-size: 12px;
          fill: var(--fg);
          text-anchor: middle;
          dominant-baseline: central;
        }
        .lbadge circle.due,
        .lenskey circle.due {
          fill: var(--lens-b);
          stroke: var(--surface);
          stroke-width: 2;
        }
        .lensnote {
          border-inline-start: var(--ddd-border-size-md) solid var(--accent);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          background: var(--chip);
        }
        .lensnote b {
          display: block;
          font-family: var(--ddd-font-navigation);
        }
        .lensnote ul {
          margin: var(--ddd-spacing-1) 0 0;
          padding-inline-start: var(--ddd-spacing-5);
        }
        /* layers: a hidden kind of connection goes, and People takes the
           person tiles with it */
        .net.hide-rel .k-rel,
        .net.hide-pillar .k-pillar,
        .net.hide-schema .k-schema,
        .net.hide-org .k-org,
        .net.hide-contrib .k-contrib,
        .net.hide-contrib .node.t4 {
          display: none;
        }
        /* search: matches stay, the rest fall back */
        .net.searching .edges .edge {
          opacity: 0.06;
        }
        .net.searching .nodes .node:not(.match) {
          opacity: 0.16;
        }
        .node.match .halo {
          opacity: 1;
          stroke: var(--match);
          stroke-width: 4;
        }
        .net.searching .node.match .lb {
          display: block !important;
        }
        .search {
          position: relative;
          max-width: 520px;
        }
        .search input {
          box-sizing: border-box;
          width: 100%;
          min-height: 44px;
          padding: 0 var(--ddd-spacing-3);
          font: inherit;
          font-size: var(--ddd-font-size-4xs);
          color: var(--fg);
          background: var(--surface);
          border: var(--ddd-border-sm);
          border-color: var(--edge);
          border-radius: var(--ddd-radius-sm);
        }
        .search input:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .lensnote li,
        .qres li,
        .author li {
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .qres {
          position: absolute;
          inset-inline: 0;
          top: 100%;
          z-index: 2;
          box-shadow: var(--ddd-boxShadow-sm);
          list-style: none;
          margin: var(--ddd-spacing-1) 0 0;
          padding: var(--ddd-spacing-1);
          max-height: 320px;
          overflow: auto;
          border: var(--ddd-border-xs);
          border-color: var(--line);
          border-radius: var(--ddd-radius-sm);
          background: var(--surface);
        }
        .qres li[role="option"] {
          display: flex;
          gap: var(--ddd-spacing-2);
          align-items: baseline;
          min-height: 40px;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          cursor: pointer;
        }
        .qres li[aria-selected="true"],
        .qres li[role="option"]:hover {
          background: var(--chip);
          outline: var(--ddd-border-xs);
          outline-color: var(--accent);
        }
        .qres .ql {
          flex: 1 1 auto;
          min-width: 0;
        }
        .qres .qg,
        .qres .qc,
        .qres .qe,
        .qres .qh {
          color: var(--muted);
        }
        .qres .qg {
          display: block;
        }
        .qres .qe,
        .qres .qh {
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
        }
        /* presenting: the web fills the screen */
        :host([data-presenting]) {
          position: fixed;
          inset: 0;
          z-index: 1000;
          border-radius: 0;
          border: 0;
          display: flex;
          flex-direction: column;
          overflow: auto;
          padding-block: env(safe-area-inset-top, 0px)
            env(safe-area-inset-bottom, 0px);
        }
        :host([data-presenting]) .body {
          flex: 1 1 auto;
          min-height: 0;
        }
        :host([data-presenting]) .stage {
          display: grid;
          min-height: 0;
        }
        :host([data-presenting]) svg.net {
          height: 100%;
          max-height: none;
          aspect-ratio: auto;
        }
        :host([data-presenting]) .rail {
          max-height: none;
        }
        /* author view, in the HAX editor */
        .author {
          display: grid;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs);
          border-color: var(--line);
        }
        .author h3 {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
          color: var(--heading);
        }
        .author textarea {
          box-sizing: border-box;
          width: 100%;
          min-height: 220px;
          font-family: var(--ddd-font-secondary);
          font-size: var(--ddd-font-size-4xs);
          color: var(--fg);
          background: var(--chip);
          border: var(--ddd-border-xs);
          border-color: var(--line);
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-2);
        }
        .author ul {
          margin: 0;
          padding-inline-start: var(--ddd-spacing-5);
        }
        @media (forced-colors: active) {
          .net.lensing .node .lring,
          .lenskey circle {
            stroke: CanvasText;
          }
          .node.match .halo {
            stroke: Highlight;
          }
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
      ["web", "node", "tour", "step", "lens"].some((k) => changed.has(k)) &&
      this._models
    ) {
      this._announce();
    }
    this._applyCam();
    this._drawIn();
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this._key);
    globalThis.document.addEventListener("fullscreenchange", this._fsChange);
  }
  disconnectedCallback() {
    this.removeEventListener("keydown", this._key);
    globalThis.document.removeEventListener("fullscreenchange", this._fsChange);
    clearInterval(this._timer);
    this._timer = null;
    clearTimeout(this._swapTimer);
    globalThis.cancelAnimationFrame(this._raf);
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
    // tile art: each web's own images (theme thumbnails live in the themes
    // web), then the bundle's, which win
    const webs = this._bundle.webs || {};
    this._images = Object.assign(
      {},
      ...Object.values(webs).map((w) => (w && w.json && w.json.images) || {}),
      this._bundle.images || {},
    );
    if (!this._models[this.web]) this.web = "main";
    this._layers = this._bundle.layers || {};
    this._impact = null;
    this._edgePrev = null;
    this._cam = null;
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
  /** "<title> web", without doubling the word when the title already ends in it */
  _webName(id) {
    const title = this._webTitle(id);
    const w = this.t.web;
    return title.toLowerCase().endsWith(w.toLowerCase())
      ? title
      : `${title} ${w}`;
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
          lens: this.lens,
          path: this.pathFor(this.web, this.node, this.tour, this.step),
        },
      }),
    );
  }

  // ---------- actions ----------
  openWeb(id, nodeId) {
    if (!this._models || !this._models[id]) return;
    this.playing = false;
    const net = this._net();
    const go = () => {
      this.web = id;
      this._q = "";
      this.tour = "";
      this.step = -1;
      this.node = nodeId || "";
      this.updateComplete.then(() => {
        // start a little zoomed in and fade the new web in while the camera
        // pulls back, so the swap reads as one movement instead of a blink
        const target = this._target(nodeId);
        if (!target) return;
        const n = this._net();
        if (n && !reducedMotion()) {
          const w = target.w * 0.72;
          this._cam = {
            x: target.x + (target.w - w) / 2,
            y: target.y + (target.w - w) / 2,
            w,
          };
          this._applyCam();
          n.removeAttribute("data-swap");
        }
        this._camTo(target);
      });
    };
    clearTimeout(this._swapTimer);
    if (net && id !== this.web && !reducedMotion()) {
      net.setAttribute("data-swap", "");
      this._swapTimer = setTimeout(go, SWAP_MS);
    } else {
      go();
    }
  }
  select(id) {
    this.node = id && id !== this.node ? id : "";
    if (this.node) this._focusOn(this.node);
  }
  /** Where the camera goes for a tile (and its connections), or the whole web. */
  _target(id) {
    const M = this._M;
    if (!M) return null;
    if (id && M.nodes.has(id)) {
      const rel = new Set([id]);
      M.edges.forEach((e) => {
        if (e.from === id) rel.add(e.to);
        if (e.to === id) rel.add(e.from);
      });
      return boxOf(M, [...rel], 110, 620, M.geo.width);
    }
    const vis = visibleAt(this._steps(), this.step);
    const ids = [...M.nodes.keys()].filter((k) => !vis || vis.has(k));
    return boxOf(M, ids, 90, 600, M.geo.width);
  }
  _focusOn(id) {
    const t = this._target(id);
    if (t) this._camTo(t);
  }
  _fit(animate) {
    const t = this._target("");
    if (t) this._camTo(t, animate !== false);
  }

  // ---------- camera ----------
  _net() {
    return this.shadowRoot ? this.shadowRoot.querySelector("svg.net") : null;
  }
  _clampW(w) {
    const M = this._M;
    const max = M ? M.geo.width * 1.15 : w;
    return Math.max(260, Math.min(max, w));
  }
  /** Write the camera straight to the drawing; no re-render. */
  _applyCam() {
    const net = this._net();
    const v = this._cam;
    if (!net || !v) return;
    net.setAttribute(
      "viewBox",
      `${v.x.toFixed(1)} ${v.y.toFixed(1)} ${v.w.toFixed(1)} ${v.w.toFixed(1)}`,
    );
    const k = 800 / v.w;
    const zoom = k < 0.5 ? "far" : k < 0.8 ? "mid" : "near";
    if (net.getAttribute("data-zoom") !== zoom)
      net.setAttribute("data-zoom", zoom);
  }
  /** Move the camera to t, eased over CAM_MS (at once under reduced motion). */
  _camTo(t, animate) {
    globalThis.cancelAnimationFrame(this._raf);
    const to = { x: t.x, y: t.y, w: this._clampW(t.w) };
    to.x = t.x + (t.w - to.w) / 2;
    to.y = t.y + (t.w - to.w) / 2;
    if (animate === false || !this._cam || reducedMotion()) {
      this._cam = to;
      this._applyCam();
      return;
    }
    const from = { ...this._cam };
    const t0 = globalThis.performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / CAM_MS);
      this._cam = lerpView(from, to, easeOut(p));
      this._applyCam();
      if (p < 1) this._raf = globalThis.requestAnimationFrame(tick);
    };
    this._raf = globalThis.requestAnimationFrame(tick);
  }
  /** Apply the camera on the next frame (pointer moves come faster than frames). */
  _queueCam() {
    if (this._queued) return;
    this._queued = true;
    globalThis.requestAnimationFrame(() => {
      this._queued = false;
      this._applyCam();
    });
  }
  /** Screen-to-drawing scale and the letterbox offsets of the square viewBox. */
  _metrics() {
    const net = this._net();
    const r = net.getBoundingClientRect();
    const k = Math.min(r.width, r.height) / this._cam.w;
    return {
      r,
      k,
      ox: (r.width - this._cam.w * k) / 2,
      oy: (r.height - this._cam.w * k) / 2,
    };
  }
  /** Zoom by f around a screen point (the middle when none is given). */
  _zoomAt(f, px, py, animate) {
    if (!this._cam || !this._net()) return;
    const { r, k, ox, oy } = this._metrics();
    const sx = (px == null ? r.left + r.width / 2 : px) - r.left - ox;
    const sy = (py == null ? r.top + r.height / 2 : py) - r.top - oy;
    const ux = this._cam.x + sx / k;
    const uy = this._cam.y + sy / k;
    const nw = this._clampW(this._cam.w * f);
    const k2 = (k * this._cam.w) / nw;
    const t = { x: ux - sx / k2, y: uy - sy / k2, w: nw };
    if (animate) {
      this._camTo(t);
    } else {
      globalThis.cancelAnimationFrame(this._raf);
      this._cam = t;
      this._queueCam();
    }
  }
  _steps() {
    const M = this._M;
    if (!M || !this.tour) return [];
    if (this.tour === TIME) {
      if (!M._time) M._time = timelineSteps(M, this.t);
      return M._time;
    }
    return tourSteps(M, this.tour);
  }
  /** The label of the tour being played ("Over time" for the timeline). */
  _tourLabel() {
    const M = this._M;
    if (this.tour === TIME) return this.t.overTime;
    const t = M.tours.find((x) => x.id === this.tour) || M.tours[0];
    return t ? t.label : "";
  }
  pickTour(id) {
    this._toursOpen = false;
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
      this._camTo(
        boxOf(
          M,
          steps[this.step].ids.length ? steps[this.step].ids : [...vis],
          100,
          560,
          M.geo.width,
        ),
      );
    if (this.step >= steps.length - 1) {
      if (this.playing || this._lastStep !== this.step) this._engage();
      this.playing = false;
    }
    this._lastStep = this.step;
  }
  /**
   * Finishing a tour or the timeline is a learner record: one user-engagement
   * event with the verb experienced, the shape every HAX element sends (the
   * HAXcms progress store finishes the xAPI statement).
   */
  _engage() {
    const name = `${this._webTitle(this.web)}: ${this._tourLabel()}`;
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        detail: {
          activityDisplay: "experienced",
          objectName: name,
          objectId: `ecosystem-web:${this.web}:${this.tour}`,
          resultCompletion: true,
        },
      }),
    );
  }
  togglePlay() {
    this._q = "";
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
    this._q = "";
    this._fit();
  }
  _schedule() {
    clearInterval(this._timer);
    this._timer = null;
    if (this.playing)
      this._timer = setInterval(
        () => this.goStep(this.step + 1),
        this.tour === TIME ? 2600 : 3200,
      );
  }
  _zoom(f) {
    this._zoomAt(f, null, null, true);
  }

  // ---------- pointer: pan, pinch, wheel ----------
  _down(e) {
    if (!this._cam) return;
    this._ptrs = this._ptrs || new Map();
    this._ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    globalThis.cancelAnimationFrame(this._raf);
    if (this._ptrs.size === 1) {
      this._moved = false;
      this._drag = { x: e.clientX, y: e.clientY, v: { ...this._cam } };
    } else if (this._ptrs.size === 2) {
      const [a, b] = [...this._ptrs.values()];
      this._moved = true;
      this._drag = {
        pinch: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        w: this._cam.w,
      };
    }
  }
  _move(e) {
    if (!this._drag || !this._ptrs || !this._ptrs.has(e.pointerId)) return;
    this._ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this._drag.pinch) {
      if (this._ptrs.size < 2) return;
      const [a, b] = [...this._ptrs.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const want = this._drag.w * (this._drag.pinch / d);
      this._zoomAt(want / this._cam.w, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    const dx = e.clientX - this._drag.x;
    const dy = e.clientY - this._drag.y;
    if (!this._moved && Math.hypot(dx, dy) < 5) return;
    if (!this._moved) {
      this._moved = true;
      const stage = e.currentTarget.parentElement;
      if (stage) stage.setAttribute("data-dragging", "");
      if (e.currentTarget.setPointerCapture)
        e.currentTarget.setPointerCapture(e.pointerId);
    }
    const { k } = this._metrics();
    this._cam = {
      x: this._drag.v.x - dx / k,
      y: this._drag.v.y - dy / k,
      w: this._drag.v.w,
    };
    this._queueCam();
  }
  _up(e) {
    if (this._ptrs) this._ptrs.delete(e.pointerId);
    if (this._ptrs && this._ptrs.size === 1 && this._drag && this._drag.pinch) {
      // one finger left after a pinch: carry on panning from here
      const [p] = [...this._ptrs.values()];
      this._drag = { x: p.x, y: p.y, v: { ...this._cam } };
      return;
    }
    this._drag = null;
    const stage = e.currentTarget && e.currentTarget.parentElement;
    if (stage) stage.removeAttribute("data-dragging");
  }
  _wheel(e) {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    this._zoomAt(Math.exp(e.deltaY * 0.0025), e.clientX, e.clientY);
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

  // ---------- layers and lenses ----------
  /** Show or hide one kind of connection (People also takes the person tiles). */
  toggleLayer(kind) {
    const h = new Set(this._hidden);
    if (h.has(kind)) h.delete(kind);
    else h.add(kind);
    this._hidden = h;
  }
  /** Read the web by a lens ("" for connections only). */
  setLens(kind) {
    this.lens = LENSES.indexOf(kind) >= 0 ? kind : "";
  }
  /** What every lens needs: the web, the outside layers, impact across webs. */
  _lensCtx() {
    const M = this._M;
    if (!this._impact) this._impact = impactIndex(this._models);
    const main = this._models.main;
    const people = new Set();
    if (main)
      main.nodes.forEach((n) => {
        if (n.group && n.group.id === "people") people.add(n.id);
      });
    return {
      M,
      web: this.web,
      layers: this._layers || {},
      impact: this._impact,
      cut: impactCuts(M, this._impact),
      people,
      maintainers: new Set((this._layers && this._layers.maintainers) || []),
    };
  }
  /** Whether a lens measures anything in this web. */
  _lensAvailable(kind, ctx) {
    if (kind === "impact" || kind === "evidence") return true;
    return [...ctx.M.nodes.values()].some((n) => lensOf(kind, n, ctx) != null);
  }
  /** The lens readings for every tile of the web, or null with no lens. */
  _readings() {
    const M = this._M;
    if (!this.lens || !M) return null;
    const key = `${this.web}:${this.lens}`;
    if (this._readCache && this._readCache.key === key)
      return this._readCache.map;
    const ctx = this._lensCtx();
    const map = new Map();
    M.nodes.forEach((n) => map.set(n.id, lensOf(this.lens, n, ctx)));
    this._readCache = { key, map, ctx };
    return map;
  }
  _lensName(kind) {
    const k = kind.charAt(0).toUpperCase() + kind.slice(1);
    return this.t[`lens${k}`] || kind;
  }
  _bandWord(kind, band) {
    return this.t[`${kind}${band.toUpperCase()}`] || "";
  }
  _ago(days) {
    if (days < 1) return this.t.today0;
    if (days === 1) return this.t.dayAgo;
    if (days < 60) return this.t.daysAgo.replace("{n}", days);
    return this.t.monthsAgo.replace("{n}", Math.round(days / 30.4));
  }
  /** A reading in words. */
  _readingText(kind, r) {
    const t = this.t;
    if (!r) return t.notMeasured;
    if (kind === "fresh")
      return [
        t.freshText
          .replace("{date}", r.date)
          .replace("{ago}", this._ago(r.days)),
        r.released ? t.freshReleased.replace("{date}", r.released) : "",
        r.due ? t.freshDue : "",
      ]
        .filter(Boolean)
        .join(" ");
    if (kind === "bus") {
      const main = this._models.main;
      const names = r.who.map((x) => {
        const b = main && main.nodes.get(x);
        return b ? b.label : x;
      });
      return names.length
        ? t.busText.replace("{who}", names.join(", "))
        : t.busNone;
    }
    if (kind === "impact")
      return (r.webs === 1 ? t.impactText1 : t.impactText)
        .replace("{n}", r.count)
        .replace("{w}", r.webs);
    if (kind === "evidence")
      return r.count ? t.evidenceText.replace("{n}", r.count) : t.evidenceNone;
    if (kind === "parity") {
      if (r.op)
        return t.parityOp.replace(/\{(php|nodejs|cli|mcp)\}/g, (m, k) =>
          r.op[k] ? t.yes : t.no,
        );
      if (r.band === "s") return t.paritySurface;
      if (r.band === "p") return t.parityPlanned;
      return r.dots
        .map(
          (x, i) =>
            `${t.parityDots[i]}: ${x === "match" ? t.parityMatch : x === "gap" ? t.parityGap : t.parityNone}.`,
        )
        .join(" ");
    }
    return "";
  }
  _dots(ds) {
    return ds.map(
      (x, i) =>
        svg`<circle class="${x === "match" ? "m" : x === "gap" ? "g" : "n"}" cx="${(i - 1) * 14}" cy="0" r="${x ? 5 : 3}"></circle>`,
    );
  }
  /** The key under the lens buttons: what the lens reads and how many tiles fall in each band. */
  _lensKey() {
    const map = this._readings();
    if (!map) return nothing;
    const kind = this.lens;
    const cnt = { a: 0, b: 0, c: 0, s: 0, p: 0, na: 0 };
    let due = 0;
    map.forEach((r) => {
      cnt[r ? r.band : "na"]++;
      if (r && r.due) due++;
    });
    const api = kind === "parity" && this.web === "openapi";
    const about =
      kind === "parity"
        ? api
          ? this.t.parityApiAbout
          : this.t.parityAbout
        : this.t[`${kind}About`];
    const order =
      kind === "parity" && !api ? ["a", "b", "c", "s", "p"] : ["a", "b", "c"];
    return html`<div class="lenskey" aria-live="polite">
      <p>${about}</p>
      ${order
        .filter((b) => cnt[b] || ["a", "b", "c"].indexOf(b) >= 0)
        .map(
          (b) =>
            html`<span class="k ${b}"
              ><svg viewBox="-12 -12 24 24" aria-hidden="true">
                <circle r="9"></circle></svg
              ><span><b>${cnt[b]}</b> ${this._bandWord(kind, b)}</span></span
            >`,
        )}
      ${
        kind === "parity" && !api
          ? html`<span class="k"
              ><svg class="dots" viewBox="-27 -8 54 16" aria-hidden="true">
                ${this._dots(["match", "gap", null])}</svg
              ><span>${this.t.parityDotsKey}</span></span
            >`
          : nothing
      }
      ${
        kind === "fresh"
          ? html`<span class="k"
              ><svg viewBox="-12 -12 24 24" aria-hidden="true">
                <circle class="due" r="7"></circle></svg
              ><span><b>${due}</b> ${this.t.freshDueKey}</span></span
            >`
          : nothing
      }
      ${
        cnt.na
          ? html`<span class="k"
              ><span><b>${cnt.na}</b> ${this.t.faded}</span></span
            >`
          : nothing
      }
    </div>`;
  }
  /** The lens reading for the selected tile, in the details. */
  _lensNote(n) {
    const map = this._readings();
    if (!map) return nothing;
    const r = map.get(n.id);
    const why = r && r.why && r.why.length ? r.why : [];
    return html`<div class="lensnote">
      <b
        >${this._lensName(this.lens)}${
          r ? `: ${this._bandWord(this.lens, r.band)}` : ""
        }</b
      >${this._readingText(this.lens, r)}
      ${
        why.length
          ? html`<ul>
              ${why.map((w) => html`<li>${w}</li>`)}
            </ul>`
          : nothing
      }
    </div>`;
  }
  _layersStrip() {
    const ctx = this._lensCtx();
    const SL = this._M.meta.sectionLabels || {};
    const kinds = KIND_ORDER.filter((k) =>
      this._M.edges.some((e) => e.kind === k),
    );
    const lenses = LENSES.filter(
      (k) => k === this.lens || this._lensAvailable(k, ctx),
    );
    return html`<div class="strip">
      <div class="chips" role="group" aria-label="${this.t.layers}">
        <span class="lab">${this.t.show}</span>
        ${kinds.map(
          (k) =>
            html`<button
              class="act layer"
              type="button"
              data-k="${k}"
              aria-pressed="${this._hidden.has(k) ? "false" : "true"}"
              @click="${() => this.toggleLayer(k)}"
            >
              ${SL[k] || this.t[k]}
            </button>`,
        )}
      </div>
      <div class="chips" role="group" aria-label="${this.t.readBy}">
        <span class="lab">${this.t.readBy}</span>
        <button
          class="act"
          type="button"
          aria-pressed="${this.lens ? "false" : "true"}"
          @click="${() => this.setLens("")}"
        >
          ${this.t.connectionsOnly}
        </button>
        ${lenses.map(
          (k) =>
            html`<button
              class="act"
              type="button"
              aria-pressed="${this.lens === k ? "true" : "false"}"
              @click="${() => this.setLens(k)}"
            >
              ${this._lensName(k)}
            </button>`,
        )}
      </div>
      ${this._lensKey()}
    </div>`;
  }

  // ---------- search ----------
  _hits() {
    return this._q && this._M ? searchNodes(this._M, this._q) : [];
  }
  _searchStrip() {
    const hits = this._hits();
    const shown = hits.slice(0, MAX_HITS);
    const act = shown.length ? Math.min(this._qAct, shown.length - 1) : -1;
    const open = !!this._q;
    return html`<div class="strip">
      <div class="search">
        <input
          id="q"
          type="search"
          role="combobox"
          aria-expanded="${open ? "true" : "false"}"
          aria-controls="qres"
          aria-autocomplete="list"
          aria-activedescendant="${act >= 0 ? `qo-${shown[act].id}` : nothing}"
          autocomplete="off"
          placeholder="${this.t.searchPlaceholder}"
          aria-label="${this.t.searchLabel}"
          .value="${this._q}"
          @input="${(e) => {
            this._q = e.target.value;
            this._qAct = 0;
          }}"
          @keydown="${this._qKey}"
        />
        <ul
          class="qres"
          id="qres"
          role="listbox"
          aria-label="${this.t.searchLabel}"
          ?hidden="${!open}"
        >
          ${
            open
              ? html`<li class="qh" role="presentation">
                    ${hits.length}
                    ${hits.length === 1 ? this.t.searchMatch : this.t.searchMatches}
                  </li>
                  ${
                    shown.length
                      ? shown.map(
                          (n, i) =>
                            html`<li
                              role="option"
                              id="qo-${n.id}"
                              aria-selected="${i === act ? "true" : "false"}"
                              @pointerdown="${(e) => {
                                e.preventDefault();
                                this.pick(n.id);
                              }}"
                            >
                              <span class="ql"
                                >${n.label}<span class="qg"
                                  >${n.group ? n.group.label : ""}</span
                                ></span
                              ><span class="qc"
                                >${degree(this._M, n.id)} ${this.t.links}</span
                              >
                            </li>`,
                        )
                      : html`<li class="qe" role="presentation">
                          ${this.t.searchNone}
                        </li>`
                  }`
              : nothing
          }
        </ul>
      </div>
    </div>`;
  }
  _qKey(e) {
    const shown = this._hits().slice(0, MAX_HITS);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!shown.length) return;
      const d = e.key === "ArrowDown" ? 1 : -1;
      this._qAct = (this._qAct + d + shown.length) % shown.length;
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (shown[this._qAct]) this.pick(shown[this._qAct].id);
    } else if (e.key === "Escape") {
      this._q = "";
    }
    e.stopPropagation();
  }
  /** Select a tile found by search, showing whatever hides it first. */
  pick(id) {
    const M = this._M;
    const n = M && M.nodes.get(id);
    if (!n) return;
    this._q = "";
    const vis = visibleAt(this._steps(), this.step);
    if (vis && !vis.has(id)) {
      this.playing = false;
      this.step = -1;
    }
    if (n.tier === 4 && this._hidden.has("contrib"))
      this.toggleLayer("contrib");
    this.node = id;
    this._focusOn(id);
  }

  // ---------- strips, presenting, keys ----------
  _toggle(panel) {
    this._panel = this._panel === panel ? "" : panel;
    if (this._panel === "search")
      this.updateComplete.then(() => {
        const q = this.shadowRoot.querySelector("#q");
        if (q) q.focus();
      });
  }
  /** Fill the screen with the web (full screen where the browser allows it). */
  present(on) {
    this._presenting = on === undefined ? !this._presenting : !!on;
    this.toggleAttribute("data-presenting", this._presenting);
    const doc = globalThis.document;
    if (this._presenting) {
      try {
        const r = this.requestFullscreen && this.requestFullscreen();
        if (r && r.catch) r.catch(() => {});
      } catch {
        // full screen refused: the fixed layout still fills the window
      }
    } else if (doc.fullscreenElement) {
      try {
        const r = doc.exitFullscreen();
        if (r && r.catch) r.catch(() => {});
      } catch {
        // already out of full screen
      }
    }
    this.updateComplete.then(() => this._fit(false));
  }
  _fsChange() {
    const doc = globalThis.document;
    if (!doc.fullscreenElement && this._presenting) this.present(false);
  }
  /** Keys: / searches; arrows step a tour; + - 0 zoom; Escape leaves full screen. */
  _key(e) {
    const path = e.composedPath ? e.composedPath() : [];
    const typing = path.some(
      (el) => el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA"),
    );
    if (typing || !this._M || this.compact) return;
    if (e.key === "/") {
      e.preventDefault();
      if (this._panel !== "search") this._toggle("search");
      return;
    }
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      if (!this.tour) return;
      e.preventDefault();
      this.playing = false;
      this.goStep(this.step + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      if (!this.tour) return;
      e.preventDefault();
      this.playing = false;
      this.goStep(this.step - 1);
    } else if (e.key === "+" || e.key === "=") {
      this._zoom(1 / 1.4);
    } else if (e.key === "-") {
      this._zoom(1.4);
    } else if (e.key === "0") {
      this._fit();
    } else if (e.key === "Escape" && this._presenting) {
      this.present(false);
    }
  }

  // ---------- author view (HAX editor) ----------
  haxHooks() {
    return { editModeChanged: "haxeditModeChanged" };
  }
  haxeditModeChanged(value) {
    this._editing = !!value;
  }
  _author() {
    const raw = ((this._bundle && this._bundle.webs) || {})[this.web] || {};
    const json =
      typeof raw.json === "string"
        ? raw.json
        : JSON.stringify(raw.json || {}, null, 2);
    const text = this._srcTab === "json" ? json : raw.mmd || "";
    const file = `${this.web === "main" ? "hax-ecosystem" : `hax-${this.web}`}.${this._srcTab === "json" ? "json" : "mmd"}`;
    const errs = this._M.errors || [];
    return html`<section class="author" aria-label="${this.t.authorSource}">
      <h3>${this.t.authorSource}</h3>
      <p class="hint">${this.t.authorHelp}</p>
      <div class="chips" role="group" aria-label="${this.t.authorSource}">
        ${["mmd", "json"].map(
          (k) =>
            html`<button
              class="act"
              type="button"
              aria-pressed="${this._srcTab === k ? "true" : "false"}"
              @click="${() => {
                this._srcTab = k;
              }}"
            >
              ${this.web === "main" ? "hax-ecosystem" : `hax-${this.web}`}.${k}
            </button>`,
        )}
        <button
          class="act"
          type="button"
          @click="${(e) => this._copy(e, text)}"
        >
          ${this.t.copy}
        </button>
      </div>
      <textarea
        readonly
        spellcheck="false"
        aria-label="${file}"
        .value="${text}"
      ></textarea>
      <p class="relhead">
        ${errs.length ? this.t.problems : this.t.noProblems}
      </p>
      ${
        errs.length
          ? html`<ul>
              ${errs.map((x) => html`<li>${x}</li>`)}
            </ul>`
          : nothing
      }
    </section>`;
  }
  _copy(e, text) {
    const b = e.currentTarget;
    const done = () => {
      b.textContent = this.t.copied;
    };
    try {
      const c = globalThis.navigator.clipboard;
      if (c && c.writeText) c.writeText(text).then(done, () => {});
    } catch {
      // the source stays selectable in the box below
    }
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
    if (/^data:/i.test(u || "")) return safeImage(u);
    try {
      const base = new URL(this.src || "./", globalThis.document.baseURI);
      return safeImage(new URL(u, base).href);
    } catch {
      return "#";
    }
  }
  _icon(n, s) {
    const images = this._images || {};
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
    const g = this._glyph(n.icon || "icons:help");
    if (!g) return nothing;
    if (g.art) {
      // drawn as designed; under forced colors the tile's initials stand in,
      // since an image keeps its own colors there
      const fb = initials(n.label);
      const fs = s * (fb.length <= 2 ? 0.36 : 0.28);
      return svg`<image class="art" href="${safeImage(g.art)}" x="${(-z / 2 + dx).toFixed(1)}" y="${(-z / 2 + dy).toFixed(1)}" width="${z.toFixed(1)}" height="${z.toFixed(1)}" aria-hidden="true"></image><text class="mono art-fb" style="font-size:${fs.toFixed(1)}px">${fb}</text>`;
    }
    return svg`<svg class="gl" x="${(-z / 2 + dx).toFixed(1)}" y="${(-z / 2 + dy).toFixed(1)}" width="${z.toFixed(1)}" height="${z.toFixed(1)}" viewBox="${g.vb}" aria-hidden="true">${g.shapes.map(glyphShape)}</svg>`;
  }
  /**
   * A tile glyph as plain SVG shapes. The bundle carries the glyphs the webs
   * use; any other icon is read once from its HAX iconset file.
   */
  _glyph(name) {
    if (GLYPHS.has(name)) return GLYPHS.get(name);
    const icons = (this._bundle && this._bundle.icons) || {};
    const b = icons[name];
    if (b && b.d) {
      const g = parseGlyph(b.d, b.vb);
      GLYPHS.set(name, g);
      return g;
    }
    const url = SimpleIconsetStore.getIcon(name);
    if (typeof url !== "string") return null;
    GLYPHS.set(name, null);
    fetch(url)
      .then((r) => (r.ok ? r.text() : ""))
      .then((text) => {
        GLYPHS.set(name, parseGlyph(text));
        this.requestUpdate();
      })
      .catch(() => {});
    return null;
  }
  _tile(n, vis, rel, ghost, reads, hits) {
    const t = n.tier;
    const sizes = this._M.geo.sizes;
    const s = sizes[t] != null ? sizes[t] : sizes[sizes.length - 1];
    const h = s / 2;
    const st = n.doc.status;
    if (!n._lines) n._lines = labelLines(n.label, labelWidth(n, t));
    const lines = n._lines;
    const ly =
      (n.shape === "pill" ? h * 0.86 : n.shape === "hex" ? h * 1.1 : h) + 16;
    const cls = [
      "node",
      `t${t}`,
      st ? `st-${st}` : "",
      this.node === n.id ? "sel" : "",
      rel.has(n.id) ? "rel" : "",
      vis && !vis.has(n.id) ? "off" : "",
      hits && hits.has(n.id) ? "match" : "",
    ];
    const r = reads ? reads.get(n.id) : null;
    if (reads) cls.push(`lens-${r ? r.band : "na"}`);
    const cn = cls.filter(Boolean).join(" ");
    const style = `--tile:${n.color};--glyph:${glyphFor(n.color)}`;
    const open = this._canOpen(n);
    // a lens rings the tile (solid, dashed or dotted by band, so the band
    // never rests on color alone) and may add dots or a count badge
    const lensMarks = reads
      ? svg`<circle class="lring" r="${(h + 9).toFixed(1)}"></circle>
        ${r && r.dots ? svg`<g class="ldots" transform="translate(0 ${(-h - 15).toFixed(1)})">${this._dots(r.dots)}</g>` : nothing}
        ${r && (r.badge != null || r.due) ? svg`<g class="lbadge" transform="translate(${(-h + 2).toFixed(1)} ${(-h + 2).toFixed(1)})">${r.due ? svg`<circle class="due" r="7"></circle>` : svg`<circle r="10"></circle><text>${r.badge}</text>`}</g>` : nothing}`
      : nothing;
    const body = svg`<g class="body">${lensMarks}${this._halo(n, s)}${this._shape(n, s)}<g class="ic">${this._icon(n, s)}</g>
      ${st === "prerelease" ? svg`<circle class="badge pre" cx="${h - 1}" cy="${-h + 1}" r="7"></circle>` : nothing}
      ${open ? svg`<circle class="badge web" cx="${h - 1}" cy="${h - 1}" r="9"></circle><path class="badge-ic" d="M${h - 5} ${h - 1}h8M${h - 1} ${h - 5}v8"></path>` : nothing}</g>
      <text class="lb" y="${ly}">${lines.map((l, i) => svg`<tspan x="0" dy="${i ? 14 : 0}">${l}${i < lines.length - 1 ? " " : ""}</tspan>`)}</text>`;
    // the copy drawn above the scrim: seen, not focused or clicked (the
    // tile underneath, in the same place, takes the click)
    if (ghost)
      return svg`<g class="${cn}" transform="translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})" style="${style}">${body}</g>`;
    return svg`<g class="${cn}" transform="translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})" style="${style}"
      tabindex="${vis && !vis.has(n.id) ? -1 : 0}" role="button" aria-pressed="${this.node === n.id ? "true" : "false"}"
      aria-label="${n.label}${open ? `, ${this.t.open} ${this._webName(n.web)}` : ""}"
      @click="${() => this._tileClick(n.id)}" @dblclick="${() => this._tileOpen(n)}" @keydown="${(e) => this._tileKey(e, n.id)}">
      ${body}
    </g>`;
  }
  _drawing() {
    const M = this._M;
    const vis = visibleAt(this._steps(), this.step);
    const R = new Set(
      this.node
        ? M.edges.filter((e) => e.from === this.node || e.to === this.node)
        : [],
    );
    const rel = new Set([...R].flatMap((e) => [e.from, e.to]));
    if (!M._ordered)
      M._ordered = [...M.nodes.values()].sort((a, b) => b.tier - a.tier);
    const ordered = M._ordered;
    const C = M.geo.center;
    // a selected tile dims the rest with one scrim and redraws itself, its
    // neighbours and their connections above it: a handful of elements
    // change instead of every tile and connection in the web
    const ghosts = ordered.filter((n) => rel.has(n.id) && n.id !== this.node);
    if (this.node && M.nodes.has(this.node))
      ghosts.push(M.nodes.get(this.node));
    const reads = this._readings();
    const hits = this._q ? new Set(this._hits().map((n) => n.id)) : null;
    const netCls = [
      "net",
      this.node ? "focus" : "",
      reads ? "lensing" : "",
      hits ? "searching" : "",
      ...[...this._hidden].map((k) => `hide-${k}`),
    ]
      .filter(Boolean)
      .join(" ");
    return html`<div class="stage">
      <svg
        class="${netCls}"
        role="group"
        aria-label="${this._webTitle(this.web)}"
        @pointerdown="${this._down}"
        @pointermove="${this._move}"
        @pointerup="${this._up}"
        @pointercancel="${this._up}"
        @wheel="${this._wheel}"
      >
        <g class="edges">
          ${repeat(
            M.edges,
            (e, i) => `${this.web}:${i}`,
            (e, i) => {
              const off = vis && !(vis.has(e.from) && vis.has(e.to));
              if (!e._d) e._d = edgePath(M, e, C);
              return svg`<path class="edge k-${e.kind} ${off ? "off" : ""}" data-i="${i}" d="${e._d}"></path>`;
            },
          )}
        </g>
        <g class="nodes">
          ${repeat(
            ordered,
            (n) => `${this.web}:${n.id}`,
            (n) => this._tile(n, vis, rel, false, reads, hits),
          )}
        </g>
        <rect
          class="scrim"
          x="-100000"
          y="-100000"
          width="200000"
          height="200000"
        ></rect>
        <g class="lift" aria-hidden="true">
          ${repeat(
            [...R],
            (e) => `${this.web}:${this.node}:${M.edges.indexOf(e)}`,
            (e) =>
              svg`<path class="edge k-${e.kind} hot enter ${e.to === this.node ? "rev" : ""}" pathLength="1" d="${e._d || edgePath(M, e, C)}" @animationend="${this._edgeDone}"></path>`,
          )}
          ${repeat(
            ghosts,
            (n) => `${this.web}:${this.node}:${n.id}`,
            (n) => this._tile(n, vis, rel, true, reads, hits),
          )}
        </g>
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
  /**
   * Connections that just came into play draw in: the ones a tour step adds
   * and, when a web opens, its own. (A selected tile's connections draw in
   * as they are added above the scrim.) Works on the rendered paths, so it
   * costs nothing when nothing changed.
   */
  _drawIn() {
    const net = this._net();
    if (!net) {
      this._edgePrev = null;
      return;
    }
    const paths = net.querySelectorAll(".edges path.edge");
    const now = new Map();
    paths.forEach((p) =>
      now.set(p.dataset.i, p.classList.contains("off") ? 0 : 1),
    );
    const had = this._edgePrev;
    const prev = had && had.web === this.web ? had.map : null;
    this._edgePrev = { web: this.web, map: now };
    if (!had || reducedMotion()) return;
    const fresh = [];
    if (!prev) {
      // a web was just opened: its connections draw in (on a big web only
      // the pillar ones, so phones keep their frame rate)
      const on = [...paths].filter((p) => now.get(p.dataset.i) >= 1);
      fresh.push(
        ...(on.length <= 160
          ? on
          : on.filter((p) => p.classList.contains("k-pillar"))),
      );
    } else {
      paths.forEach((p) => {
        const a = prev.get(p.dataset.i);
        const b = now.get(p.dataset.i);
        if (b === 1 && a === 0) fresh.push(p);
      });
    }
    if (!fresh.length) return;
    fresh.forEach((p) => p.classList.remove("enter", "rev"));
    // one reflow for the batch, so the animation restarts on every path
    net.getBoundingClientRect();
    fresh.forEach((p) => {
      p.setAttribute("pathLength", "1");
      p.classList.add("enter");
      p.addEventListener("animationend", this._edgeDone, { once: true });
    });
  }
  /** After drawing in, a connection goes back to its own line style. */
  _edgeDone(e) {
    e.target.classList.remove("enter", "rev");
    e.target.removeAttribute("pathLength");
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
        ${parent ? html`<button class="act" type="button" @click="${() => this.openWeb(parent)}">${this.t.backTo} ${this._webName(parent)}</button>` : nothing}
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
      ${this._lensNote(n)}
      ${d.status ? html`<span class="st ${d.status}">${d.status === "released" && d.version ? `${d.version}` : stWord[d.status] || d.status}</span>` : nothing}
      ${d.desc ? html`<p>${d.desc}</p>` : nothing}
      ${d.source && d.source.url ? html`<p class="hint">${this.t.source}: <a href="${safeUrl(d.source.url)}" target="_blank" rel="noopener">${d.source.label}</a></p>` : nothing}
      ${Object.keys(d.links || {}).length ? html`<div class="lnks">${Object.entries(d.links).map(([k, u]) => html`<a href="${safeUrl(u)}" target="_blank" rel="noopener">${LINK_LABEL[k] || k}</a>`)}</div>` : nothing}
      ${this._canOpen(n) ? html`<button class="act primary" type="button" @click="${() => this.openWeb(n.web)}">${this.t.open} ${this._webName(n.web)}</button>` : nothing}
      ${this.web !== "main" && home && this._models[home] ? html`<button class="act" type="button" @click="${() => this.openWeb(home, n.id)}">${this.t.showIn} ${this._webName(home)}</button>` : nothing}
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
    const picked =
      this.tour === TIME
        ? { label: this.t.overTime }
        : M.tours.find((t) => t.id === this.tour);
    const time = !M.meta.noTimeline
      ? html`<button
          class="act"
          type="button"
          aria-pressed="${this.tour === TIME ? "true" : "false"}"
          @click="${() => this.pickTour(TIME)}"
        >
          ${this.t.overTime}
        </button>`
      : nothing;
    return html`<div class="tours" ?data-open="${this._toursOpen}">
      <button
        class="act tours-toggle"
        type="button"
        aria-expanded="${this._toursOpen ? "true" : "false"}"
        aria-controls="tourlist"
        @click="${() => {
          this._toursOpen = !this._toursOpen;
        }}"
      >
        ${this.t.tours}${picked ? `: ${picked.label}` : ""}
      </button>
      <div class="tourlist" id="tourlist">
        ${aud.length || time !== nothing ? html`<div class="chips"><span class="lab">${this.t.tourFor}</span>${aud.map(chip)}${time}</div>` : nothing}
        ${story.length ? html`<div class="chips"><span class="lab">${this.t.followAStory}</span>${story.map(chip)}</div>` : nothing}
      </div>
    </div>`;
  }
  _bar() {
    const M = this._M;
    const steps = this._steps();
    const t = M.tours.find((x) => x.id === this.tour) || M.tours[0];
    const label = this.tour ? this._tourLabel() : t.label;
    const S = this.step >= 0 && steps[this.step];
    const pct = S ? ((this.step + 1) / steps.length) * 100 : 0;
    const last = this.step >= steps.length - 1 && this.step >= 0;
    return html`<div class="bar">
      <div class="cap" aria-live="polite">
        <div class="n">
          ${S ? (this.tour === TIME ? S.label : `${label} · ${this.step + 1} ${this.t.stepOf} ${steps.length}`) : this.t.overview}
        </div>
        <div>
          ${S ? S.caption : this.tour === TIME ? this.t.growTheWeb : `${this.t.pressPlay}: ${label}.`}
        </div>
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
    if (this.compact) return this._drawing();
    return html`<header>
        <div class="titles">
          <p class="eyebrow">${this._crumbs()}</p>
          <h2>${this._webTitle(this.web)}</h2>
        </div>
        <div class="actions">
          <button
            class="act"
            type="button"
            aria-expanded="${this._panel === "layers" ? "true" : "false"}"
            aria-controls="layers"
            @click="${() => this._toggle("layers")}"
          >
            ${this.t.layers}${this.lens ? `: ${this._lensName(this.lens)}` : ""}
          </button>
          <button
            class="act"
            type="button"
            aria-expanded="${this._panel === "search" ? "true" : "false"}"
            aria-controls="search"
            @click="${() => this._toggle("search")}"
          >
            ${this.t.search}
          </button>
          <button
            class="act"
            type="button"
            aria-pressed="${this._presenting ? "true" : "false"}"
            @click="${() => this.present()}"
          >
            ${this._presenting ? this.t.exitPresent : this.t.present}
          </button>
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
      <div id="layers" ?hidden="${this._panel !== "layers"}">
        ${this._panel === "layers" ? this._layersStrip() : nothing}
      </div>
      <div id="search" ?hidden="${this._panel !== "search"}">
        ${this._panel === "search" ? this._searchStrip() : nothing}
      </div>
      <div class="body">
        ${this.listView ? this._list() : this._drawing()}${this._rail()}
      </div>
      ${this._bar()} ${this._editing ? this._author() : nothing}`;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(EcosystemWeb.tag, EcosystemWeb);
