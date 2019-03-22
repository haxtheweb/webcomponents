/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import * as Chartist from "chartist/dist/chartist.min.js";
import "./lib/chartist-render-shared-styles";

export { ChartistRender };
/**
 * `chartist-render`
 * Uses the chartist library to render a chart.
 *
 * @polymer
 * @customElement
 * @demo demo/index.html
 *
 */
class ChartistRender extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style is="custom-style" include="chartist-render-shared-styles">
        :host {
          display: block;
        }
      </style>
      <div id="chart" chart$="[[__chartId]]" class$="ct-chart [[scale]]"></div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The unique identifier of the chart.
       */
      id: {
        type: String,
        value: "chart"
      },
      /**
       * The type of chart:bar, line, or pie
       */
      type: {
        type: String,
        value: "bar"
      },
      /**
       * The scale of the chart. (See https://gionkunz.github.io/chartist-js/api-documentation.html)```
Container class	Ratio
.ct-square          1
.ct-minor-second	  15:16
.ct-major-second	  8:9
.ct-minor-third	    5:6
.ct-major-third	    4:5
.ct-perfect-fourth	3:4
.ct-perfect-fifth	  2:3
.ct-minor-sixth	    5:8
.ct-golden-section	1:1.618
.ct-major-sixth	    3:5
.ct-minor-seventh	  9:16
.ct-major-seventh	  8:15
.ct-octave	        1:2
.ct-major-tenth	    2:5
.ct-major-eleventh	3:8
.ct-major-twelfth	  1:3
.ct-double-octave	  1:4```
       */
      scale: {
        type: String,
        observer: "makeChart"
      },
      /**
       * The chart title used for accessibility.
       */
      chartTitle: {
        type: String,
        value: null,
        observer: "makeChart"
      },
      /**
       * The chart description used for accessibility.
       */
      chartDesc: {
        type: String,
        value: "",
        observer: "makeChart"
      },
      /**
       * The chart data.
       */
      data: {
        type: Object,
        value: null,
        observer: "makeChart"
      },
      /**
       * The options available at  https://gionkunz.github.io/chartist-js/api-documentation.html.
       */
      options: {
        type: Object,
        value: null,
        observer: "makeChart"
      },
      /**
       * The responsive options. (See https://gionkunz.github.io/chartist-js/api-documentation.html.)
       */
      responsiveOptions: {
        type: Array,
        value: [],
        observer: "makeChart"
      },
      /**
       * The show data in table form as well? Default is false.
       */
      showTable: {
        type: Boolean,
        value: false,
        observer: "makeChart"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "chartist-render";
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this._chartistLoaded();
  }

  ready() {
    super.ready();
    this.__chartId = this._getUniqueId("chartist-render-");
    if (this.__chartistLoaded) this._chartReady();
  }

  /**
   * determines if char is ready
   */
  _chartistLoaded() {
    this.__chartistLoaded = true;
    if (this.__chartId) this._chartReady();
  }
  /**
   * Makes chart and returns the chart object.
   */
  _checkReady() {
    let root = this;
    setInterval(root._chartReady, 500);
  }

  /**
   * Makes chart and returns the chart object.
   */
  _chartReady() {
    let root = this,
      container = root.$.chart;
    if (container !== null) {
      window.dispatchEvent(
        new CustomEvent("chartist-render-ready", { detail: root })
      );
      if (root.data !== null) root.makeChart();
      clearInterval(root._checkReady);
    }
  }
  /**
   * Makes chart and returns the chart object.
   */
  makeChart() {
    let root = this,
      chart;
    if (
      this.__chartistLoaded &&
      this.__chartId &&
      root.data !== null &&
      this.$.chart !== null
    ) {
      if (root.type == "bar") {
        if (
          root.responsiveOptions !== undefined &&
          root.responsiveOptions.length > 0
        ) {
          root.responsiveOptions.forEach(option => {
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
          this.$.chart,
          root.data,
          root.options,
          root.responsiveOptions
        );
      } else if (root.type == "line") {
        chart = Chartist.Line(
          this.$.chart,
          root.data,
          root.options,
          root.responsiveOptions
        );
      } else if (root.type == "pie") {
        chart = Chartist.Pie(
          this.$.chart,
          root.data,
          root.options,
          root.responsiveOptions
        );
      }
      window.dispatchEvent(
        new CustomEvent("chartist-render-draw", { detail: chart })
      );
      chart.on("created", () => {
        root.addA11yFeatures(chart.container.childNodes[0]);
      });
      return chart;
    } else {
      return null;
    }
  }

  /**
   * Add accessibility features.
   */
  addA11yFeatures(svg) {
    let desc =
      this.data.labels !== undefined && this.data.labels !== null
        ? this.chartDesc + this.makeA11yTable(svg)
        : this.chartDesc;
    this._addA11yFeature(svg, "desc", desc);
    this._addA11yFeature(svg, "title", this.chartTitle);
    svg.setAttribute(
      "aria-labelledby",
      this.__chartId + "-chart-title " + this.__chartId + "-chart-desc"
    );
  }

  /**
   * Add accessibility features.
   */
  makeA11yTable(svg) {
    let title =
      this.chartTitle !== null ? this.chartTitle : "A " + this.type + " chart.";
    let table = [
      '<table summary="Each column is a series of data, and the first column is the data label.">',
      "<caption>" + title + "</caption>",
      "<tbody>"
    ];
    for (var i = 0; i < this.data.labels.length; i++) {
      table.push('<tr><th scope="row">' + this.data.labels[i] + "</th>");
      if (this.type == "pie") {
        table.push("<td>" + this.data.series[i] + "</td>");
      } else {
        for (var j = 0; j < this.data.series.length; j++) {
          table.push("<td>" + this.data.series[j][i] + "</td>");
        }
      }
      table.push("</tr>");
    }
    table.push("</tbody></table>");
    return table.join("");
  }

  /**
   * For inserting chart title and description.
   */
  _addA11yFeature(svg, tag, html) {
    let el = document.createElement(tag);
    let first = svg.childNodes[0];
    el.innerHTML = html;
    el.setAttribute("id", this.__chartId + "-chart-" + tag);
    svg.insertBefore(el, first);
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
