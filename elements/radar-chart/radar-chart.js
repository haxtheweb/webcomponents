/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, svg } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

// geometry of the drawing, expressed in viewBox units
const SIZE = 500;
const CENTER = SIZE / 2;
const RADIUS = 160;
const LABEL_FACTOR = 1.18;

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
      scoreLabel: { type: String, attribute: "score-label" },
      targetLabel: { type: String, attribute: "target-label" },
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
        .scale-label,
        .pct {
          font-size: var(--ddd-font-size-4xs, 10px);
          fill: currentColor;
          opacity: 0.75;
        }
        .name {
          font-size: var(--ddd-font-size-3xs, 12px);
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

  /** Point on spoke `i` of `n` at `value` of `max`, scaled by `factor`. */
  _point(i, n, value, max, factor = 1) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const r = (value / max) * RADIUS * factor;
    return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
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

  /** Split long names onto two lines at the middle word. */
  _lines(name) {
    const words = name.split(" ");
    if (words.length < 3) return [name];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
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
    const [x, y] = this._point(i, n, max, max, LABEL_FACTOR);
    const anchor =
      Math.abs(x - CENTER) < 8 ? "middle" : x < CENTER ? "end" : "start";
    const lines = this._lines(row.name);
    return svg`<text x="${x}" y="${y}" text-anchor="${anchor}">
      ${lines.map(
        (line, li) =>
          svg`<tspan class="name" x="${x}" dy="${li === 0 ? "0" : "1.2em"}">${line}</tspan>`,
      )}
      <tspan class="pct" x="${x}" dy="1.3em">${this._pct(row, max)}%</tspan>
    </text>`;
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
    return html`
      <figure>
        <figcaption id="cap">${this.title}</figcaption>
        <svg
          viewBox="0 0 ${SIZE} ${SIZE}"
          role="img"
          aria-labelledby="cap"
          aria-describedby="desc"
        >
          ${levels.map(
            (l) =>
              svg`<polygon class="grid" points="${this._polygon(rows, "", max, l * step)}"></polygon>`,
          )}
          ${rows.map((row, i) => {
            const [x, y] = this._point(i, n, max, max);
            return svg`<line class="axis" x1="${CENTER}" y1="${CENTER}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"></line>`;
          })}
          ${levels.map((l) => {
            const [x, y] = this._point(0, n, l * step, max);
            return svg`<text class="scale-label" x="${x + 4}" y="${y - 2}">${Number((l * step).toFixed(1))}/${max}</text>`;
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
            const [x, y] = this._point(i, n, row.score, max);
            return svg`<circle class="dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"></circle>`;
          })}
          ${rows.map((row, i) => this._renderLabel(row, i, n, max))}
        </svg>
        <p id="desc" hidden>${this._description(data)}</p>
        ${
          this.showLegend
            ? html`<ul class="legend">
                <li><span class="swatch score"></span>${this.scoreLabel}</li>
                <li><span class="swatch target"></span>${this.targetLabel}</li>
              </ul>`
            : ""
        }
        <details>
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
        </details>
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
