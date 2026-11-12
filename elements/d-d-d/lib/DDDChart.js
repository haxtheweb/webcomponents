/**
 * Copyright 2026 The Pennsylvania State University
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDD chart palette: one set of series colours every chart in HAX can share
 * (lrndesign-chart, radar-chart and anything that draws data), so series 1
 * is the same colour in every chart on a page and in light and dark mode.
 *
 * The eight colours are DDD palette tokens, ordered so neighbouring series
 * stay apart for readers with red-green or blue-yellow colour blindness
 * (navy, sky, orange, teal, pink, green, purple, slate), and each one is at
 * least 3:1 against white in light mode and against potentialMidnight in
 * dark mode (non-text contrast). Colour is never the only key: charts that
 * use this still need a legend or a data table.
 *
 * Standalone on purpose, like DDDBlock.js and DDDAccent.js: it adds no
 * exports to d-d-d.js or DDDStyles.js. Import it directly:
 *
 *   import { DDDChartStyles } from "@haxtheweb/d-d-d/lib/DDDChart.js";
 *   static get styles() { return [super.styles, DDDChartStyles, css`...`]; }
 *
 * DDDChartStyles sets these on :host:
 *   --ddd-chart-1 ... --ddd-chart-8   series colours (light / dark pairs)
 *   --ddd-chart-grid                  gridlines and axis rules
 *   --ddd-chart-label                 axis and value labels (text contrast)
 */
import { css, unsafeCSS } from "lit";

/**
 * Series colours as [light token, dark token], in series order.
 */
export const DDDChartPalette = [
  ["beaverBlue", "pughBlue"],
  ["skyBlue", "skyBlue"],
  ["roarGolden", "inventOrange"],
  ["creekTeal", "creekTeal"],
  ["original87Pink", "discoveryCoral"],
  ["forestGreen", "futureLime"],
  ["wonderPurple", "athertonViolet"],
  ["slateGray", "limestoneGray"],
];

const t = (n) => `var(--ddd-theme-default-${n})`;
const series = DDDChartPalette.map(
  ([light, dark], i) =>
    `--ddd-chart-${i + 1}: light-dark(${t(light)}, ${t(dark)});`,
).join("\n  ");

export const DDDChartStyles = css`
  :host {
    ${unsafeCSS(series)}
    --ddd-chart-grid: light-dark(
      var(--ddd-theme-default-limestoneLight),
      var(--ddd-theme-default-slateGray)
    );
    --ddd-chart-label: light-dark(
      var(--ddd-theme-default-slateGray),
      var(--ddd-theme-default-limestoneLight)
    );
  }
`;
