/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDD connector lines: one vocabulary for the edges of graphs, maps and
 * diagrams, so a line means the same thing in every block that draws one.
 *
 * Five kinds of connector, each told apart by width and dash pattern as
 * well as colour, so they still read in greyscale, in print and for readers
 * with colour blindness:
 *
 *   relationship  solid, medium      two things are related or talk
 *   contract      long dash          one side implements an agreed API or spec
 *   membership    round dots         belongs to / is part of
 *   credit        dash dot, lighter  made by / thanks to / derived from
 *   emphasis      solid, heavy       the path being explained right now
 *
 * These are separate from the answer status line styles in
 * DDDStatusTokens.js on purpose: there dotted means "incorrect" and dashed
 * means "revealed", which is not what a graph edge means.
 *
 * Colours default to DDDChart palette slots, so a connector matches the
 * series colours on the same page in light and dark mode. Colour is never
 * the only key: show a legend that pairs each line sample with its word.
 *
 * Standalone on purpose, like DDDBlock.js and DDDChart.js: it adds no
 * exports to d-d-d.js or DDDStyles.js. Import it directly:
 *
 *   import {
 *     DDDConnectorStyles,
 *     measureDDDConnector,
 *   } from "@haxtheweb/d-d-d/lib/DDDConnector.js";
 *   static get styles() { return [super.styles, DDDConnectorStyles]; }
 *
 *   svg`<path class="ddd-connector" data-kind="contract" d="..."></path>
 *       <path class="ddd-connector ddd-motion-draw-in" data-kind="emphasis"
 *         pathLength="1" d="..."></path>
 *       <path class="ddd-connector ddd-motion-flow" data-kind="membership"
 *         d="..."></path>`
 *
 * DDDConnectorStyles includes DDDChartStyles (the colours) and
 * DDDMotionStyles (draw-in and flow, with their reduced-motion stop).
 *
 * Tokens, for each {kind} in DDDConnectorKinds (all set on :host and safe
 * to override per element or per line):
 *   --ddd-connector-{kind}-width    stroke width
 *   --ddd-connector-{kind}-dash     stroke-dasharray (none for solid)
 *   --ddd-connector-{kind}-period   length of one dash period, which the
 *                                   flow motion moves by (0 for solid)
 *   --ddd-connector-{kind}-cap      stroke-linecap (round for dots)
 *   --ddd-connector-{kind}-color    stroke colour (a DDDChart slot)
 *   --ddd-connector-{kind}-opacity  stroke opacity
 * Shared:
 *   --ddd-connector-dimmed-opacity  opacity of lines out of focus
 *                                   (.ddd-connector[data-dimmed])
 *   --ddd-connector-length          set per line by measureDDDConnector()
 *
 * Flow on a solid kind (relationship, emphasis) switches the line to
 * --ddd-motion-flow-dash dots while it moves, since a solid line has no
 * pattern to march. Patterned kinds march their own pattern.
 */
import { css, unsafeCSS } from "lit";
import { DDDChartStyles } from "./DDDChart.js";
import { DDDMotionStyles } from "./DDDMotion.js";

/**
 * The connector kinds and their defaults, in legend order. width is a DDD
 * border size token name, dash and period are SVG user units, chart is the
 * DDDChart slot the colour defaults to.
 */
export const DDDConnectorKinds = [
  {
    kind: "relationship",
    width: "sm",
    dash: "none",
    period: 0,
    cap: "butt",
    chart: 1,
    opacity: "0.9",
  },
  {
    kind: "contract",
    width: "sm",
    dash: "8 4",
    period: 12,
    cap: "butt",
    chart: 3,
    opacity: "1",
  },
  {
    kind: "membership",
    width: "sm",
    dash: "0 6",
    period: 6,
    cap: "round",
    chart: 4,
    opacity: "1",
  },
  {
    kind: "credit",
    width: "xs",
    dash: "6 3 1 3",
    period: 13,
    cap: "butt",
    chart: 7,
    opacity: "0.85",
  },
  {
    kind: "emphasis",
    width: "lg",
    dash: "none",
    period: 0,
    cap: "round",
    chart: 5,
    opacity: "1",
  },
];

const tokens = DDDConnectorKinds.map((k) =>
  [
    `--ddd-connector-${k.kind}-width: var(--ddd-border-size-${k.width});`,
    `--ddd-connector-${k.kind}-dash: ${k.dash};`,
    `--ddd-connector-${k.kind}-period: ${k.period};`,
    `--ddd-connector-${k.kind}-cap: ${k.cap};`,
    `--ddd-connector-${k.kind}-color: var(--ddd-chart-${k.chart});`,
    `--ddd-connector-${k.kind}-opacity: ${k.opacity};`,
  ].join("\n    "),
).join("\n    ");

const kindRules = DDDConnectorKinds.map(
  (k) => `.ddd-connector[data-kind="${k.kind}"] {
    --ddd-connector-width: var(--ddd-connector-${k.kind}-width);
    --ddd-connector-dash: var(--ddd-connector-${k.kind}-dash);
    --ddd-connector-period: var(--ddd-connector-${k.kind}-period);
    --ddd-connector-cap: var(--ddd-connector-${k.kind}-cap);
    --ddd-connector-color: var(--ddd-connector-${k.kind}-color);
    --ddd-connector-opacity: var(--ddd-connector-${k.kind}-opacity);
  }`,
).join("\n  ");

export const DDDConnectorTokens = css`
  :host {
    ${unsafeCSS(tokens)}
    --ddd-connector-dimmed-opacity: var(--ddd-opacity-40, 0.4);
  }
`;

export const DDDConnectorStyles = [
  DDDChartStyles,
  DDDMotionStyles,
  DDDConnectorTokens,
  css`
    .ddd-connector {
      --ddd-connector-width: var(--ddd-connector-relationship-width);
      --ddd-connector-dash: var(--ddd-connector-relationship-dash);
      --ddd-connector-period: var(--ddd-connector-relationship-period);
      --ddd-connector-cap: var(--ddd-connector-relationship-cap);
      --ddd-connector-color: var(--ddd-connector-relationship-color);
      --ddd-connector-opacity: var(--ddd-connector-relationship-opacity);
      fill: none;
      stroke: var(--ddd-connector-color);
      stroke-width: var(--ddd-connector-width);
      stroke-dasharray: var(--ddd-connector-dash);
      stroke-linecap: var(--ddd-connector-cap);
      stroke-linejoin: round;
      stroke-opacity: var(--ddd-connector-opacity);
    }
    ${unsafeCSS(kindRules)}
    .ddd-connector[data-kind="relationship"].ddd-motion-flow,
    .ddd-connector[data-kind="emphasis"].ddd-motion-flow,
    .ddd-connector:not([data-kind]).ddd-motion-flow {
      --ddd-connector-dash: var(--ddd-motion-flow-dash);
      --ddd-connector-period: var(--ddd-motion-flow-period);
      --ddd-connector-cap: round;
    }
    .ddd-connector[data-dimmed] {
      stroke-opacity: var(--ddd-connector-dimmed-opacity);
    }
    /* a legend sample: an inline svg line that draws with the same tokens */
    .ddd-connector-sample {
      display: inline-block;
      vertical-align: middle;
      width: var(--ddd-icon-xs);
      height: var(--ddd-icon-4xs);
      overflow: visible;
    }
  `,
];

/**
 * Measure an SVG geometry element and store its length in user units as
 * --ddd-connector-length, so .ddd-motion-draw-in can run on a line that
 * keeps its dash pattern (no pathLength="1" needed). Returns the length,
 * or 0 when the element cannot be measured (not rendered, not SVG).
 * @param {SVGGeometryElement} el
 * @returns {Number}
 */
export function measureDDDConnector(el) {
  if (!el || typeof el.getTotalLength !== "function") {
    return 0;
  }
  let length = 0;
  try {
    length = el.getTotalLength();
  } catch {
    length = 0;
  }
  if (!Number.isFinite(length) || length <= 0) {
    return 0;
  }
  const rounded = Math.ceil(length);
  el.style.setProperty("--ddd-connector-length", String(rounded));
  return rounded;
}
