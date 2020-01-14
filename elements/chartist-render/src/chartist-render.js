/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { generateResourceID } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";

/**
 * `chartist-render`
 * uses chartist library to render a chart
 *
### Styling

`<chartist-render>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--chartist-label-color` | default label color for charts | #000
`--chartist-pie-label-color` | label color for pie charts | `--chartist-label-color`
`--chartist-color-a` | background color for 1st series |  #d70206
`--chartist-color-label-a` | color for 1st series label |  `--chartist-label-color`
`--chartist-color-b` | background color for 2nd series |  #f05b4f
`--chartist-color-label-b` | color for 2nd series label |  `--chartist-label-color`
`--chartist-color-c` | background color for 3rd series |  #f4c63d
`--chartist-color-label-c` | color for 3rd series label |  `--chartist-label-color`
`--chartist-color-d` | background color for 4th series |  #d17905
`--chartist-color-label-d` | color for 4th series label |  `--chartist-label-color`
`--chartist-color-e` | background color for 5th series |  #453d3f
`--chartist-color-label-e` | color for 5th series label |  `--chartist-label-color`
`--chartist-color-f` | background color for 6th series |  #59922b
`--chartist-color-label-f` | color for 6th series label |  `--chartist-label-color`
`--chartist-color-g` | background color for 7th series |  #0544d3
`--chartist-color-label-g` | color for 7th series label |  `--chartist-label-color`
`--chartist-color-h` | background color for 8th series |  #6b0392
`--chartist-color-label-h` | color for 8th series label |  `--chartist-label-color`
`--chartist-color-i` | background color for 9th series |  #f05b4f
`--chartist-color-label-i` | color for 9th series label |  `--chartist-label-color`
`--chartist-color-j` | background color for 10th series |  #dda458
`--chartist-color-label-j` | color for 10th series label |  `--chartist-label-color`
`--chartist-color-k` | background color for 11th series |  #eacf7d
`--chartist-color-label-k` | color for 11th series label |  `--chartist-label-color`
`--chartist-color-l` | background color for 12th series |  #86797d
`--chartist-color-label-l` | color for 12th series label |  `--chartist-label-color`
`--chartist-color-m` | background color for 13th series |  #b2c326
`--chartist-color-label-m` | color for 13th series label |  `--chartist-label-color`
`--chartist-color-n` | background color for 14th series |  #6188e2
`--chartist-color-label-n` | color for 15th series label |  `--chartist-label-color`
`--chartist-color-0` | background color for 15th series |  #a748ca
`--chartist-color-label-o` | color for 15th series label |  `--chartist-label-color`
 * @extends SchemaBehaviors
 * @demo ./demo/index.html 
 * @customElement chartist-render
 */
class ChartistRender extends SchemaBehaviors(LitElement) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  constructor() {
    super();
    this.id = "chart";
    this.type = "bar";
    this.scale = "ct-minor-seventh";
    this.chartTitle = null;
    this.chartDesc = null;
    this.data = null;
    this.options = null;
    this.responsiveOptions = [];
    this.showTable = false;
    this.__chartId = generateResourceID("chart-");
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    let location = `${basePath}lib/chartist/dist/chartist.min.js`;
    window.addEventListener(
      "es-bridge-chartistLib-loaded",
      this._chartistLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("chartistLib", location);
    /**
     * Fired once once chart is ready.
     *
     * @event chartist-render-ready
     *
     */
    this.dispatchEvent(
      new CustomEvent("chartist-render-ready", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
    if (typeof Chartist === "object") this._chartistLoaded.bind(this);
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "chartist-render";
  }

  updated(changedProperties) {
    this._renderChart();
  }

  // simple path from a url modifier
  pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf("/") + 1);
  }

  disconnectedCallback() {
    window.removeEventListener(
      "es-bridge-chartistLib-loaded",
      this._chartistLoaded.bind(this)
    );
    super.disconnectedCallback();
  }

  /**
   * determines if char is ready
   */
  _chartistLoaded() {
    this.__chartistLoaded = true;
    this._renderChart();
  }

  /**
   * Makes chart and returns the chart object.
   */
  makeChart() {
    setTimeout(() => {
      this.chart = this._renderChart();
    }, 100);
  }

  /**
   * Renders chart and returns the chart object.
   */
  _renderChart() {
    let chart = null,
      target = this.shadowRoot.querySelector("#chart");
    if (target !== null && typeof Chartist === "object" && this.data !== null) {
      if (this.type == "bar") {
        if (
          this.responsiveOptions !== undefined &&
          this.responsiveOptions.length > 0
        ) {
          this.responsiveOptions.forEach(option => {
            if (option[1] !== undefined) {
              if (
                option[1].axisX &&
                option[1].axisX.labelInterpolationFnc == "noop"
              )
                option[1].axisX.labelInterpolationFnc = Chartist.noop;
              if (
                option[1].axisY &&
                option[1].axisY.labelInterpolationFnc == "noop"
              )
                option[1].axisY.labelInterpolationFnc = Chartist.noop;
            }
          });
        }
        chart = Chartist.Bar(
          target,
          this.data,
          this.options,
          this.responsiveOptions
        );
      } else if (this.type === "line") {
        chart = Chartist.Line(
          target,
          this.data,
          this.options,
          this.responsiveOptions
        );
      } else if (this.type === "pie") {
        chart = Chartist.Pie(
          target,
          this.data,
          this.options,
          this.responsiveOptions
        );
      }
      /**
       * Fired when chart is being drawn.
       *
       * @event chartist-render-draw
       *
       */
      this.dispatchEvent(
        new CustomEvent("chartist-render-draw", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: chart
        })
      );
      chart.on("created", () => {
        this.addA11yFeatures(chart.container.children[0]);
        /**
         * Fired once chart is created and accessibility features are added.
         *
         * @event chartist-render-created
         *
         */
        this.dispatchEvent(
          new CustomEvent("chartist-render-created", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: chart
          })
        );
      });
    }
    return chart;
  }

  /**
   * Add accessibility features.
   * @param {object} svg chart SVG
   */
  addA11yFeatures(svg) {
    if (this.data && this.data.series) {
      svg.setAttribute("aria-labelledby", `${this.__chartId}-desc`);
    } else {
      svg.setAttribute("aria-labelledby", `${this.__chartId}-title`);
    }
  }

  /**
   * Get unique ID from the chart
   * @param {string} prefix for unique ID
   * @returns {string} unique ID
   */
  _getUniqueId(prefix) {
    let id = prefix + Date.now();
    return id;
  }
}
window.customElements.define(ChartistRender.tag, ChartistRender);
export { ChartistRender };
