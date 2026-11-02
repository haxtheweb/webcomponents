/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, svg } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

// geometry of the drawing, expressed in viewBox units. The full chart is wider
// than tall so axis labels have room on the left and right; the compact chart
// has no labels so it only needs the plot itself.
const RADIUS = 150;
const LABEL_GAP = 16;
const LABEL_WRAP = 18; // characters per label line
const LINE_HEIGHT = 17;
const FULL_BOX = { w: 720, h: 520 };
const COMPACT_BOX = { w: 340, h: 340 };

const DEFAULT_CATEGORIES = [
  "Legal & Licensing",
  "Governance & Decision-Making",
  "Community Engagement",
  "Documentation & Onboarding",
  "Project Operations & Roadmap",
  "Security & Risk Management",
  "Accessibility, Standards & Interoperability",
  "Adoption, Impact & Institutional Fit",
  "Financial & Organizational Sustainability",
];

/**
 * Turn whatever a property / attribute / HAX form handed us into an array.
 * Accepts an array, a JSON array string, or a delimited string.
 * @param {*} value
 * @param {RegExp} splitter used when the string is not JSON
 * @returns {Array}
 */
const toList = (value, splitter) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || value.trim() === "") return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // not JSON, fall through to delimited parsing
  }
  return value
    .split(splitter)
    .map((item) => item.trim())
    .filter((item) => item !== "");
};

const listConverter = (splitter) => ({
  fromAttribute: (value) => toList(value, splitter),
  toAttribute: (value) => JSON.stringify(value),
});

/**
 * `radar-chart`
 * A radar (spider) chart for maturity models, skill evaluations and facet
 * scoring such as HEOSAT. Draws an SVG for sighted users and always provides
 * the same data as a text description and a data table.
 *
 * @demo demo/index.html
 * @element radar-chart
 */
export class RadarChart extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "radar-chart";
  }

  constructor() {
    super();
    this.title = "Maturity by category";
    this.maxScore = 5;
    this.categories = [...DEFAULT_CATEGORIES];
    this.scores = DEFAULT_CATEGORIES.map(() => 0);
    this.targetScores = DEFAULT_CATEGORIES.map(() => 5);
    this.showLegend = true;
    this.compact = false;
    this._tip = null;
    this.scoreLabel = "Your score";
    this.targetLabel = "Target / Level 5";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      chartOf: "Radar chart",
      showData: "Show data as a table",
      category: "Category",
      outOf: "out of",
      noData: "No categories to display.",
      chart: "Chart",
      radar: "Radar",
    };
    this.registerLocalization({
      context: this,
      basePath: import.meta.url,
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      maxScore: { type: Number, attribute: "max-score" },
      categories: { type: Array, converter: listConverter(/\r?\n/) },
      scores: { type: Array, converter: listConverter(/[\s,]+/) },
      targetScores: {
        type: Array,
        attribute: "target-scores",
        converter: listConverter(/[\s,]+/),
      },
      showLegend: {
        type: Boolean,
        attribute: "show-legend",
        // defaults to true, so allow show-legend="false" to turn it off
        converter: {
          fromAttribute: (value) => value !== null && value !== "false",
          toAttribute: (value) => (value ? "" : null),
        },
      },
      /**
       * Smaller chart with no axis labels, scale labels, legend or data table;
       * values are shown by hovering a point.
       */
      compact: { type: Boolean, reflect: true },
      scoreLabel: { type: String, attribute: "score-label" },
      targetLabel: { type: String, attribute: "target-label" },
      _tip: { state: true },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-navigation);
          width: 100%;
          box-sizing: border-box;
          max-width: var(--radar-chart-max-width, 40rem);
          margin-inline: auto;
          /* series and ring colours; the public custom properties win */
          --radar-chart-internal-score: var(
            --radar-chart-score-color,
            light-dark(
              var(--ddd-theme-default-link),
              color-mix(
                in srgb,
                var(--ddd-theme-default-skyBlue) 50%,
                var(--ddd-theme-default-white)
              )
            )
          );
          --radar-chart-internal-target: var(
            --radar-chart-target-color,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-white)
            )
          );
          --radar-chart-internal-grid: var(
            --radar-chart-grid-color,
            light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            )
          );
          --radar-chart-internal-page: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --radar-chart-internal-muted: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --radar-chart-internal-border: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        :host([compact]) {
          max-width: var(--radar-chart-compact-max-width, 14rem);
        }
        :host([hidden]) {
          display: none;
        }
        /* labelled block frame shared with the other DDD learning blocks */
        figure.frame {
          box-sizing: border-box;
          margin: var(--ddd-spacing-2) 0;
          padding: var(--ddd-spacing-0);
          border: var(--ddd-border-xs);
          border-color: var(--radar-chart-internal-border);
          border-radius: var(--ddd-radius-md);
          overflow: hidden;
        }
        .frame-header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          margin: 0;
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4);
          border-bottom: var(--ddd-border-xs);
          border-color: var(--radar-chart-internal-border);
          text-align: start;
        }
        :host([compact]) .frame-header {
          gap: var(--ddd-spacing-2);
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-spacing-3);
        }
        .frame-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xs);
          height: var(--ddd-icon-xs);
          border-radius: var(--ddd-radius-circle);
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        :host([compact]) .frame-chip {
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
        }
        /* a small radar pentagon */
        .frame-chip-icon {
          display: block;
          width: var(--ddd-icon-4xs);
          height: var(--ddd-icon-4xs);
          background-color: currentColor;
          clip-path: polygon(50% 8%, 88% 37%, 74% 84%, 26% 84%, 12% 37%);
        }
        :host([compact]) .frame-chip-icon {
          width: 12px;
          height: 12px;
        }
        .frame-text {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-width: 0;
        }
        .frame-label {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--radar-chart-internal-muted);
        }
        :host([compact]) .frame-label {
          font-size: var(--ddd-font-size-6xs);
        }
        :host(:lang(ar)) .frame-label,
        :host(:lang(fa)) .frame-label,
        :host(:lang(he)) .frame-label,
        :host(:lang(ur)) .frame-label {
          letter-spacing: 0;
        }
        .frame-title {
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.3;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          overflow-wrap: anywhere;
        }
        .frame-title:empty {
          display: none;
        }
        .chart {
          position: relative;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-2) 0;
        }
        :host([compact]) .chart {
          padding: var(--ddd-spacing-2);
        }
        svg {
          width: 100%;
          height: auto;
          overflow: visible;
          display: block;
        }
        .grid {
          fill: none;
          stroke: var(--radar-chart-internal-grid);
          stroke-width: 1;
        }
        .axis {
          stroke: var(--radar-chart-internal-grid);
          stroke-width: 1;
        }
        /* font sizes are viewBox units, so text scales with the chart */
        .scale-label {
          font-family: var(--ddd-font-navigation);
          font-size: var(--radar-chart-scale-size, 12px);
          fill: var(--radar-chart-internal-muted);
        }
        .pct {
          font-family: var(--ddd-font-navigation);
          font-size: var(--radar-chart-pct-size, 13px);
          fill: var(--radar-chart-internal-muted);
          font-variant-numeric: tabular-nums;
        }
        .name {
          font-family: var(--ddd-font-primary);
          font-size: var(--radar-chart-label-size, 15px);
          font-weight: var(--ddd-font-weight-medium);
          fill: currentColor;
        }
        .target {
          fill: none;
          stroke: var(--radar-chart-internal-target);
          stroke-width: 2;
          stroke-dasharray: 6 4;
        }
        .score {
          fill: var(--radar-chart-internal-score);
          fill-opacity: 0.22;
          stroke: var(--radar-chart-internal-score);
          stroke-width: 2.5;
          stroke-linejoin: round;
        }
        .dot {
          fill: var(--radar-chart-internal-score);
          stroke: var(--radar-chart-internal-page);
          stroke-width: 2;
          transition: r 0.1s ease-in-out;
        }
        .dot.active {
          r: 6.5px;
        }
        .tmark {
          fill: var(--radar-chart-internal-page);
          stroke: var(--radar-chart-internal-target);
          stroke-width: 2;
        }
        .hit {
          fill: transparent;
          cursor: pointer;
        }
        @media (prefers-reduced-motion: reduce) {
          .dot {
            transition: none;
          }
        }
        .tip {
          position: absolute;
          z-index: 1;
          pointer-events: none;
          box-sizing: border-box;
          max-width: 12rem;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-color: var(--radar-chart-internal-border);
          border-radius: var(--ddd-radius-sm);
          font-family: var(--ddd-font-primary);
          font-size: var(--radar-chart-tip-size, var(--ddd-font-size-5xs));
          line-height: 1.45;
          background: var(--radar-chart-internal-page);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          box-shadow: var(--ddd-boxShadow-sm);
          /* above the point, centered; the modifiers keep it inside the chart */
          transform: translate(-50%, calc(-100% - 12px));
        }
        .tip.start {
          transform: translate(-12%, calc(-100% - 12px));
        }
        .tip.end {
          transform: translate(-88%, calc(-100% - 12px));
        }
        .tip.below {
          transform: translate(-50%, 12px);
        }
        .tip.below.start {
          transform: translate(-12%, 12px);
        }
        .tip.below.end {
          transform: translate(-88%, 12px);
        }
        .tip strong {
          display: block;
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .tip[hidden] {
          display: none;
        }
        /* DDD gives every list a column layout and body size; undo that */
        ul.legend {
          list-style: none;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-5);
          margin: 0;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-4)
            var(--ddd-spacing-3);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-5xs);
        }
        ul.legend li {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-5xs);
        }
        svg.swatch {
          display: inline-block;
          flex: none;
          width: 28px;
          height: 12px;
          overflow: visible;
        }
        .swatch .score-line {
          stroke: var(--radar-chart-internal-score);
          stroke-width: 3;
        }
        .swatch .score-mark {
          fill: var(--radar-chart-internal-score);
        }
        .swatch .target-line {
          stroke: var(--radar-chart-internal-target);
          stroke-width: 2;
          stroke-dasharray: 6 4;
        }
        .swatch .target-mark {
          fill: var(--radar-chart-internal-page);
          stroke: var(--radar-chart-internal-target);
          stroke-width: 2;
        }
        details.frame-footer {
          border-top: var(--ddd-border-xs);
          border-color: var(--radar-chart-internal-border);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-5xs);
          max-width: none;
          overflow: visible;
        }
        /* a quiet footer link rather than the DDD accordion summary */
        details.frame-footer > summary,
        details.frame-footer[open] > summary,
        details.frame-footer > summary:hover,
        details.frame-footer > summary:focus {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          cursor: pointer;
          padding: var(--ddd-spacing-1) 0;
          list-style: none;
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
          background-color: transparent;
          filter: none;
          transition: none;
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
        }
        details.frame-footer > summary::after,
        details.frame-footer[open] > summary::after {
          content: none;
        }
        summary::-webkit-details-marker {
          display: none;
        }
        summary::before {
          content: "";
          flex: none;
          width: 0;
          height: 0;
          border-block: 5px solid transparent;
          border-inline-start: 7px solid currentColor;
          transition: transform 0.15s ease-in-out;
        }
        :host(:dir(rtl)) summary::before {
          transform: scaleX(-1);
        }
        details[open] summary::before {
          transform: rotate(90deg);
        }
        summary:hover {
          text-decoration: underline;
        }
        summary:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        @media (prefers-reduced-motion: reduce) {
          summary::before {
            transition: none;
          }
        }
        /* DDD boxes every table part; keep only row separators */
        table {
          border-collapse: collapse;
          width: 100%;
          margin-top: var(--ddd-spacing-2);
          border: 0 none;
          border-color: var(--radar-chart-internal-border);
        }
        thead,
        tbody,
        tr {
          border: 0 none;
        }
        caption {
          /* the title is already in the frame header; keep it for screen readers */
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        th,
        td {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border: 0 none;
          border-top: 1px solid;
          font-size: var(--ddd-font-size-5xs);
          text-align: start;
        }
        thead th {
          border-top: none;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--radar-chart-internal-muted);
        }
        tbody th {
          font-weight: var(--ddd-font-weight-medium);
        }
        td.num {
          font-variant-numeric: tabular-nums;
        }
      `,
    ];
  }

  /** Normalized view of the data, always the same length as categories. */
  get _data() {
    const max = Number(this.maxScore) > 0 ? Number(this.maxScore) : 5;
    const names = toList(this.categories, /\r?\n/);
    const scores = toList(this.scores, /[\s,]+/);
    const targets = toList(this.targetScores, /[\s,]+/);
    const clamp = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0;
    };
    return {
      max,
      rows: names.map((name, i) => ({
        name: String(name),
        score: clamp(scores[i]),
        target: clamp(targets[i]),
      })),
    };
  }

  /** Size and center of the drawing for the current mode. */
  get _box() {
    const { w, h } = this.compact ? COMPACT_BOX : FULL_BOX;
    return { w, h, cx: w / 2, cy: h / 2 };
  }

  /** Point on spoke `i` of `n` at `value` of `max`, `extra` units further out. */
  _point(i, n, value, max, extra = 0) {
    const { cx, cy } = this._box;
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const r = (value / max) * RADIUS + extra;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  _polygon(rows, key, max, level) {
    return rows
      .map((row, i) =>
        this._point(i, rows.length, level ?? row[key], max)
          .map((n) => n.toFixed(1))
          .join(","),
      )
      .join(" ");
  }

  /** Greedy word wrap so long category names fit beside the chart. */
  _lines(name) {
    const lines = [];
    let line = "";
    for (const word of name.split(/\s+/)) {
      if (line && `${line} ${word}`.length > LABEL_WRAP) {
        lines.push(line);
        line = word;
      } else {
        line = line ? `${line} ${word}` : word;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  _pct(row, max) {
    return Math.round((row.score / max) * 100);
  }

  /** Text alternative that carries every value in the chart. */
  _description({ max, rows }) {
    return rows
      .map(
        (row) =>
          `${row.name}: ${this.scoreLabel} ${row.score} ${this.t.outOf} ${max}, ${this.targetLabel} ${row.target}`,
      )
      .join("; ");
  }

  _renderLabel(row, i, n, max) {
    const { cx, cy } = this._box;
    const [x, y] = this._point(i, n, max, max, LABEL_GAP);
    const anchor = Math.abs(x - cx) < 8 ? "middle" : x < cx ? "end" : "start";
    const lines = this._lines(row.name);
    // the label grows away from the chart: upward above it, downward below it
    const count = lines.length + 1;
    const vertical = (y - cy) / (RADIUS + LABEL_GAP);
    let y0 = y + 5 - ((count - 1) * LINE_HEIGHT) / 2;
    if (vertical < -0.35) y0 = y - (count - 1) * LINE_HEIGHT - 4;
    else if (vertical > 0.35) y0 = y + 15;
    return svg`<text x="${x.toFixed(1)}" y="${y0.toFixed(1)}" text-anchor="${anchor}">
      ${lines.map(
        (line, li) =>
          svg`<tspan class="name" x="${x.toFixed(1)}" dy="${li === 0 ? "0" : LINE_HEIGHT}">${line}</tspan>`,
      )}
      <tspan class="pct" x="${x.toFixed(1)}" dy="${LINE_HEIGHT}">${row.score} / ${row.target}</tspan>
    </text>`;
  }

  /** "Chart · Radar" type label for the block header. */
  get _typeLabel() {
    return `${this.t.chart} · ${this.t.radar}`;
  }

  /** Decorative type chip for the block header. */
  _renderChip() {
    // drawn with CSS so the chart stays the first svg in the shadow root
    return html`<span class="frame-chip" aria-hidden="true"
      ><span class="frame-chip-icon"></span
    ></span>`;
  }

  _showTip(i, x, y) {
    this._tip = { i, x, y };
  }

  _hideTip() {
    this._tip = null;
  }

  _renderTip(rows, max) {
    const tip = this._tip;
    const row = tip && rows[tip.i];
    if (!row) return "";
    const { w, h } = this._box;
    const fx = tip.x / w;
    const fy = tip.y / h;
    const classes = [
      fx < 0.25 ? "start" : fx > 0.75 ? "end" : "",
      fy < 0.25 ? "below" : "",
    ].join(" ");
    return html`<div
      class="tip ${classes}"
      aria-hidden="true"
      style="left:${(fx * 100).toFixed(1)}%;top:${(fy * 100).toFixed(1)}%"
    >
      <strong>${row.name}</strong>
      ${this.scoreLabel}: ${row.score} ${this.t.outOf} ${max}
      (${this._pct(row, max)}%)<br />
      ${this.targetLabel}: ${row.target}
    </div>`;
  }

  render() {
    const data = this._data;
    const { max, rows } = data;
    const n = rows.length;
    if (n < 3) {
      return html`<p>${this.t.noData}</p>`;
    }
    const levels = Array.from(
      { length: Math.min(Math.floor(max), 10) },
      (_, i) => i + 1,
    );
    const step = max / levels.length;
    const { w, h } = this._box;
    const compact = this.compact;
    const active = this._tip ? this._tip.i : -1;
    return html`
      <figure class="frame">
        ${compact
          ? html`<div class="frame-header">
              ${this._renderChip()}
              <span class="frame-label">${this._typeLabel}</span>
            </div>`
          : html`<figcaption class="frame-header">
              ${this._renderChip()}
              <span class="frame-text">
                <span class="frame-label">${this._typeLabel}</span>
                <span class="frame-title" id="cap">${this.title}</span>
              </span>
            </figcaption>`}
        <div class="chart">
          <svg
            viewBox="0 0 ${w} ${h}"
            role="img"
            aria-label="${ifDefined(compact ? this.title : undefined)}"
            aria-labelledby="${ifDefined(compact ? undefined : "cap")}"
            aria-describedby="desc"
          >
            ${levels.map(
              (l) =>
                svg`<polygon class="grid" points="${this._polygon(rows, "", max, l * step)}"></polygon>`,
            )}
            ${rows.map((row, i) => {
              const [x, y] = this._point(i, n, max, max);
              return svg`<line class="axis" x1="${this._box.cx}" y1="${this._box.cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"></line>`;
            })}
            ${compact
              ? ""
              : levels.map((l) => {
                  const [x, y] = this._point(0, n, l * step, max);
                  return svg`<text class="scale-label" x="${x + 3}" y="${y - 2}">${Number((l * step).toFixed(1))}</text>`;
                })}
            <polygon
              class="target"
              points="${this._polygon(rows, "target", max)}"
            ></polygon>
            <polygon
              class="score"
              points="${this._polygon(rows, "score", max)}"
            ></polygon>
            ${rows.map((row, i) => {
              const [x, y] = this._point(i, n, row.target, max);
              return svg`<rect class="tmark" x="${(x - 4).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="8" height="8"></rect>`;
            })}
            ${rows.map((row, i) => {
              const [x, y] = this._point(i, n, row.score, max);
              return svg`<circle class="dot ${i === active ? "active" : ""}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5"></circle>`;
            })}
            ${compact
              ? ""
              : rows.map((row, i) => this._renderLabel(row, i, n, max))}
            ${rows.map((row, i) => {
              // generous invisible targets; target points first so the
              // score point wins where the two coincide
              const [x, y] = this._point(i, n, row.target, max);
              return svg`<circle class="hit" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12"
                @pointerenter="${() => this._showTip(i, x, y)}"
                @pointerdown="${() => this._showTip(i, x, y)}"
                @pointerleave="${this._hideTip}"></circle>`;
            })}
            ${rows.map((row, i) => {
              const [x, y] = this._point(i, n, row.score, max);
              return svg`<circle class="hit" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12"
                @pointerenter="${() => this._showTip(i, x, y)}"
                @pointerdown="${() => this._showTip(i, x, y)}"
                @pointerleave="${this._hideTip}"></circle>`;
            })}
          </svg>
          ${this._renderTip(rows, max)}
        </div>
        <p id="desc" hidden>${this._description(data)}</p>
        ${this.showLegend && !compact
          ? html`<ul class="legend">
              <li>
                <svg
                  class="swatch score"
                  viewBox="0 0 28 12"
                  aria-hidden="true"
                  focusable="false"
                >
                  <line class="score-line" x1="0" y1="6" x2="28" y2="6"></line>
                  <circle class="score-mark" cx="14" cy="6" r="4"></circle></svg
                >${this.scoreLabel}
              </li>
              <li>
                <svg
                  class="swatch target"
                  viewBox="0 0 28 12"
                  aria-hidden="true"
                  focusable="false"
                >
                  <line class="target-line" x1="0" y1="6" x2="28" y2="6"></line>
                  <rect
                    class="target-mark"
                    x="10"
                    y="2"
                    width="8"
                    height="8"
                  ></rect></svg
                >${this.targetLabel}
              </li>
            </ul>`
          : ""}
        ${compact
          ? ""
          : html`<details class="frame-footer">
              <summary>${this.t.showData}</summary>
              <table>
                <caption>
                  ${this.title}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">${this.t.category}</th>
                    <th scope="col">${this.scoreLabel}</th>
                    <th scope="col">${this.targetLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map(
                    (row) =>
                      html`<tr>
                        <th scope="row">${row.name}</th>
                        <td class="num">${row.score} / ${max}</td>
                        <td class="num">${row.target} / ${max}</td>
                      </tr>`,
                  )}
                </tbody>
              </table>
            </details>`}
      </figure>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(RadarChart.tag, RadarChart);
