/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";

/**
 * `chartist-render`
 * uses the chartist library to render a chart
 *
 * @customElement
 * @demo demo/index.html
 *
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
    this.__chartId = this.generateResourceID().replace("#", "chart-");
    const basePath = this.pathFromUrl(decodeURIComponent(import.meta.url));
    let location = `${basePath}lib/chartist/dist/chartist.min.js`;
    window.addEventListener(
      "es-bridge-chartistLib-loaded",
      this._chartistLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("chartistLib", location);
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
   */
  _getUniqueId(prefix) {
    let id = prefix + Date.now();
    return id;
  }
}
window.customElements.define(ChartistRender.tag, ChartistRender);
export { ChartistRender };
