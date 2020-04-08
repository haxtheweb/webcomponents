/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { generateResourceID } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@polymer/iron-ajax/iron-ajax.js";

const ChartistRenderSuper = function(SuperClass) {
  return class extends SuperClass {
    /* REQUIRED FOR TOOLING DO NOT TOUCH */

    constructor() {
      super();
      this.id = "chart";
      this.type = "bar";
      this.scale = "ct-minor-seventh";
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
      console.log(this,'dataSource',this.dataSource);
      this._renderChart();
      this.observer.observe(this, {
        attributes: false,
        childList: true,
        subtree: true
      });
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
    /**
     * mutation observer for table
     * @readonly
     * @returns {object}
     */
    get observer() {
      let callback = () => this._renderChart();
      return new MutationObserver(callback);
    }

    updated(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "data") {
          if (this.data !== oldValue) this._renderTable();
        } else if (propName === "dataSource") {
          if (this.data !== oldValue) this._renderTable();

          console.log("data-source-changed", this.dataSource);
        } else {
          this._renderChart();
        }
      });
    }

    /**
     * Makes chart and returns the chart object.
     * @memberof ChartistRender
     */
    makeChart() {
      setTimeout(() => {
        this.chart = this._renderChart();
      }, 100);
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
     * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
     * @param {string} text csv data
     * @returns {array} chart data
     */
    _CSVtoArray(text) {
      let p = "",
        row = [""],
        ret = [row],
        i = 0,
        r = 0,
        s = !0,
        l;
      for (l in text) {
        l = text[l];
        if ('"' === l) {
          if (s && l === p) row[i] += l;
          s = !s;
        } else if ("," === l && s) {
          if (row[i].trim().match(/^\d+$/m) !== null)
            row[i] = parseInt(row[i].trim());
          l = row[++i] = "";
        } else if ("\n" === l && s) {
          if ("\r" === p) row[i] = row[i].slice(0, -1);
          if (row[i].trim().match(/^\d+$/m) !== null)
            row[i] = parseInt(row[i].trim());
          row = ret[++r] = [(l = "")];
          i = 0;
        } else row[i] += l;
        p = l;
      }
      if (row[i].trim().match(/^\d+$/m) !== null)
        row[i] = parseInt(row[i].trim());
      return ret;
    }

    /**
     * Convert from csv text to an array in the table function
     * @param {event} e event data
     * @memberof ChartistRender
     */
    _handleResponse(e) {
      this.rawData = e.detail.response;
      let raw = this._CSVtoArray(this.rawData);
      this.__dataReady = true;
      this.data = {
        labels: raw[0],
        series: this.type !== "pie" ? raw.slice(1, raw.length) : raw[1]
      };
      console.log("raw-data-changed", this.rawData, raw, this.data);
    }
    /**
     * replaces existing slotted table with a new one based on data
     * @memberof ChartistRender
     */
    _renderTable() {
      let html = "",
        table = this.querySelector("table");
      if (this.data) {
        if (table) table.remove();
        table = document.createElement("table");
        if (this.data.labels)
          html += `<thead><tr>${(this.data.labels || [])
            .map(label => `<th scope="col">${label}</th>`)
            .join("")}</tr></thead>`;
        if (this.data.series)
          html += `<tbody>
            ${
              this.data.series && Array.isArray(this.data.series[0])
                ? (this.data.series || [])
                    .map(
                      row =>
                        `<tr>${(row || [])
                          .map(col => `<td>${col}</td>`)
                          .join("")}</tr>`
                    )
                    .join("")
                : `<tr>${(this.data.series || [])
                    .map(col => `<td>${col}</td>`)
                    .join("")}</tr>`
            }
          </tbody>`;
        table.innerHTML = html;
        this.appendChild(table);
      }
    }

    /**
     * Renders chart and returns the chart object.
     */
    _renderChart() {
      let chart = null,
        target = this.shadowRoot.querySelector("#chart"),
        table = this.querySelector("table")
          ? this.querySelector("table").cloneNode(true)
          : false,
        data = !table
          ? false
          : {
              labels: (
                [...table.querySelectorAll("thead th[scope=col]")] || []
              ).map(label => (label.innerHTML || "").trim()),
              series: ([...table.querySelectorAll("tbody tr")] || []).map(row =>
                ([...row.querySelectorAll("td")] || []).map(td => {
                  let cell = (td.innerHTML || "").trim();
                  return cell && cell !== null && cell !== ""
                    ? parseFloat(cell)
                    : "null";
                })
              )
            };
      if (target !== null && typeof Chartist === "object" && data) {
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
            data,
            this.options,
            this.responsiveOptions
          );
        } else if (this.type === "line") {
          chart = Chartist.Line(
            target,
            data,
            this.options,
            this.responsiveOptions
          );
        } else if (this.type === "pie") {
          chart = Chartist.Pie(
            target,
            {
              labels: data.labels || [],
              series: data.series ? data.series[0] : []
            },
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
     * Get unique ID from the chart
     * @param {string} prefix for unique ID
     * @returns {string} unique ID
     */
    _getUniqueId(prefix) {
      let id = prefix + Date.now();
      return id;
    }
  }
}
/**
 * @element chartist-render
 * @extends SchemaBehaviors
 * @demo ./demo/index.html 
 * @demo ./demo/csv.html CSV Loading
 * 
 * `chartist-render`
 * uses chartist library to render a chart
 *
### Styling

`<chartist-render>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--chartist-bg-padding` | padding inside chartist-render | 0px
`--chartist-bg-margin` | margin chartist chartist-render | 15px 0
`--chartist-text-color` | default label color for charts | #000
`--chartist-bg-color` | default label color for charts | #000
`--chartist-text-color` | default label color for charts | #000
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
 */
class ChartistRender extends ChartistRenderSuper(LitElement) {}
window.customElements.define(ChartistRender.tag, ChartistRender);
export { ChartistRender, ChartistRenderSuper };
