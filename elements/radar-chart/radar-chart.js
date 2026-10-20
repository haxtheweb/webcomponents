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
const LABEL_GAP = 14;
const LABEL_WRAP = 18; // characters per label line
const LINE_HEIGHT = 12;
const FULL_BOX = { w: 700, h: 440 };
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
    };
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
          color: var(--ddd-theme-primary);
          font-family: var(--ddd-font-navigation);
          max-width: var(--radar-chart-max-width, 40rem);
          margin-inline: auto;
        }
        :host([compact]) {
          max-width: var(--radar-chart-compact-max-width, 14rem);
        }
        :host([hidden]) {
          display: none;
        }
        figure {
          margin: var(--ddd-spacing-2) 0;
          padding: var(--ddd-spacing-0);
        }
        figcaption {
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
          text-align: center;
          margin-bottom: var(--ddd-spacing-2);
        }
        .chart {
          position: relative;
        }
        svg {
          width: 100%;
          height: auto;
          overflow: visible;
          display: block;
        }
        .grid {
          fill: none;
          stroke: var(
            --radar-chart-grid-color,
            var(--ddd-theme-default-limestoneGray, currentColor)
          );
          stroke-width: 1;
        }
        .axis {
          stroke: var(
            --radar-chart-grid-color,
            var(--ddd-theme-default-limestoneGray, currentColor)
          );
          stroke-width: 1;
        }
        /* font sizes are viewBox units, so text scales with the chart */
        .scale-label {
          font-size: var(--radar-chart-scale-size, 8px);
          fill: currentColor;
          opacity: 0.7;
        }
        .pct {
          font-size: var(--radar-chart-pct-size, 9px);
          fill: currentColor;
          opacity: 0.75;
        }
        .name {
          font-size: var(--radar-chart-label-size, 10px);
          fill: currentColor;
        }
        .target {
          fill: none;
          stroke: var(
            --radar-chart-target-color,
            var(--ddd-theme-default-keystoneYellow, currentColor)
          );
          stroke-width: 2;
          stroke-dasharray: 6 4;
        }
        .score {
          fill: var(
            --radar-chart-score-color,
            var(--ddd-theme-default-skyBlue, currentColor)
          );
          fill-opacity: 0.3;
          stroke: var(
            --radar-chart-score-color,
            var(--ddd-theme-default-skyBlue, currentColor)
          );
          stroke-width: 2;
        }
        .dot {
          fill: var(
            --radar-chart-score-color,
            var(--ddd-theme-default-skyBlue, currentColor)
          );
          transition: r 0.1s ease-in-out;
        }
        .dot.active {
          r: 6px;
        }
        .tmark {
          fill: var(
            --radar-chart-target-color,
            var(--ddd-theme-default-keystoneYellow, currentColor)
          );
        }
        .hit {
          fill: transparent;
          cursor: pointer;
        }
        .tip {
          position: absolute;
          z-index: 1;
          pointer-events: none;
          box-sizing: border-box;
          max-width: 11rem;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs, 4px);
          font-size: var(--radar-chart-tip-size, 0.75rem);
          line-height: 1.3;
          background: light-dark(
            var(--ddd-theme-default-coalyGray, #222),
            var(--ddd-theme-default-white, #fff)
          );
          color: light-dark(
            var(--ddd-theme-default-white, #fff),
            var(--ddd-theme-default-coalyGray, #222)
          );
          box-shadow: var(--ddd-boxShadow-sm, 0 1px 4px rgba(0, 0, 0, 0.4));
          /* above the point, centered; the modifiers keep it inside the chart */
          transform: translate(-50%, calc(-100% - 10px));
        }
        .tip.start {
          transform: translate(-12%, calc(-100% - 10px));
        }
        .tip.end {
          transform: translate(-88%, calc(-100% - 10px));
        }
        .tip.below {
          transform: translate(-50%, 10px);
        }
        .tip.below.start {
          transform: translate(-12%, 10px);
        }
        .tip.below.end {
          transform: translate(-88%, 10px);
        }
        .tip strong {
          display: block;
        }
        .tip[hidden] {
          display: none;
        }
        ul.legend {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-5);
          margin: var(--ddd-spacing-2) 0 0 0;
          padding: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-xs);
        }
        ul.legend li {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .swatch {
          display: inline-block;
          width: var(--ddd-spacing-5);
          height: 0;
          border-top: var(--ddd-border-md, 3px) solid currentColor;
        }
        .swatch.score {
          border-top-style: solid;
          border-top-color: var(
            --radar-chart-score-color,
            var(--ddd-theme-default-skyBlue, currentColor)
          );
        }
        .swatch.target {
          border-top-style: dashed;
          border-top-color: var(
            --radar-chart-target-color,
            var(--ddd-theme-default-keystoneYellow, currentColor)
          );
        }
        details {
          margin-top: var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-xs);
        }
        summary {
          cursor: pointer;
          padding: var(--ddd-spacing-1) 0;
        }
        summary:focus-visible {
          outline: var(--ddd-border-md, 3px) solid
            var(--ddd-theme-default-keystoneYellow, currentColor);
          outline-offset: 2px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th,
        td {
          border: var(--ddd-border-xs, 1px) solid
            var(--ddd-theme-default-limestoneGray, currentColor);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          text-align: left;
        }
        td.num {
          text-align: right;
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
    let y0 = y + 3 - ((count - 1) * LINE_HEIGHT) / 2;
    if (vertical < -0.35) y0 = y - (count - 1) * LINE_HEIGHT - 2;
    else if (vertical > 0.35) y0 = y + 10;
    return svg`<text x="${x.toFixed(1)}" y="${y0.toFixed(1)}" text-anchor="${anchor}">
      ${lines.map(
        (line, li) =>
          svg`<tspan class="name" x="${x.toFixed(1)}" dy="${li === 0 ? "0" : LINE_HEIGHT}">${line}</tspan>`,
      )}
      <tspan class="pct" x="${x.toFixed(1)}" dy="${LINE_HEIGHT}">${this._pct(row, max)}%</tspan>
    </text>`;
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
      <figure>
        ${compact ? "" : html`<figcaption id="cap">${this.title}</figcaption>`}
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
              return svg`<circle class="tmark" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"></circle>`;
            })}
            ${rows.map((row, i) => {
              const [x, y] = this._point(i, n, row.score, max);
              return svg`<circle class="dot ${i === active ? "active" : ""}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"></circle>`;
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
              <li><span class="swatch score"></span>${this.scoreLabel}</li>
              <li><span class="swatch target"></span>${this.targetLabel}</li>
            </ul>`
          : ""}
        ${compact
          ? ""
          : html`<details>
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
