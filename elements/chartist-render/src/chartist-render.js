/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { generateResourceID } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import "@polymer/iron-ajax/iron-ajax.js";

const ChartistRenderSuper = function (SuperClass) {
  return class extends SuperClass {
    /* REQUIRED FOR TOOLING DO NOT TOUCH */

    constructor() {
      super();
      this.id = "chart";
      this.type = "bar";
      this.scale = "ct-minor-seventh";
      this.responsiveOptions = [];
      this.data = [];
      this.dataSource = "";
      this.showTable = false;
      this.__chartId = generateResourceID("chart-");
      window.ESGlobalBridge.requestAvailability();
      this._loadScripts(
        "chartistLib",
        "lib/chartist/dist/chartist.min.js",
        this._chartistLoaded
      );
      this._updateData();
      this.observer.observe(this, {
        attributes: false,
        childList: true,
        subtree: true,
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
          detail: this,
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
     * an array of plugins to load as [ [classname,  relativePath] ]
     *
     * @readonly
     */
    get plugins() {
      return [
        [
          "Chartist.plugins.ctAxisTitle",
          "lib/chartist-plugin-axistitle/dist/chartist-plugin-axistitle.min.js",
        ],
        [
          "Chartist.plugins.CtPointLabels",
          "lib/chartist-plugin-pointlabels/dist/chartist-plugin-pointlabels.min.js",
        ],
        [
          "Chartist.plugins.fillDonut",
          "lib/chartist-plugin-fill-donut/dist/chartist-plugin-fill-donut.min.js",
        ],
      ];
    }
    /**
     * mutation observer for table
     * @readonly
     * @returns {object}
     */
    get observer() {
      let callback = () => this._updateData();
      return new MutationObserver(callback);
    }

    updated(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        if (
          propName === "chartData" &&
          JSON.stringify(this.chartData) !== JSON.stringify(oldValue)
        ) {
          /**
           * Fires when chartData changes
           * @event chart-data-changed
           */
          this.dispatchEvent(
            new CustomEvent("chart-data-changed", {
              detail: this,
            })
          );
          this._getChart();
        } else if (propName === "dataSource" && this.dataSource !== oldValue) {
          /**
           * Fires when data-source changes
           * @event data-source-changed
           */
          this.dispatchEvent(
            new CustomEvent("data-source-changed", {
              detail: this,
            })
          );
        } else if (
          propName === "data" &&
          JSON.stringify(this.data) !== JSON.stringify(oldValue)
        ) {
          /**
           * Fires when data changes
           * @event data-changed
           */
          this.dispatchEvent(
            new CustomEvent("data-changed", {
              detail: this,
            })
          );
          this._renderTable();
          this._updateChartData();
        } else {
          this._getChart();
        }
      });
    }

    /**
     * Makes chart and returns the chart object.
     * @memberof ChartistRender
     */
    makeChart() {
      this._getChart();
      return this.chart;
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
      this.plugins.forEach((plugin) =>
        window.removeEventListener(
          `es-bridge-${plugin[0]}-loaded`,
          this._getChart.bind(this)
        )
      );
      if (this.observer && this.observer.disconnect) this.observer.disconnect();
      super.disconnectedCallback();
    }

    /**
     * determines if Chartist is ready
     */
    _chartistLoaded() {
      this.__chartistLoaded = true;
      this._getChart();
      this.plugins.forEach((plugin) => this._loadScripts(plugin[0], plugin[1]));
    }

    /**
     * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
     * @param {string} text csv
     * @returns {array} chart raw data
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
     * Get unique ID from the chart
     * @param {string} prefix for unique ID
     * @returns {string} unique ID
     */
    _getUniqueId(prefix) {
      let id = prefix + Date.now();
      return id;
    }
    /**
     * gets options plus plugins
     * @readonly
     */
    get fullOptions() {
      let options = { ...this.options };
      if (Chartist.plugins) {
        options.plugins = [];
        if (
          this.type !== "pie" &&
          this.pluginAxisTitle &&
          Chartist.plugins.ctAxisTitle
        ) {
          options.plugins.push(
            Chartist.plugins.ctAxisTitle(this.pluginAxisTitle)
          );
        }
        if (
          this.type === "line" &&
          this.pluginPointLabels &&
          Chartist.plugins.ctPointLabels
        ) {
          if (!this.pluginPointLabels.labelInterpolationFnc)
            this.pluginPointLabels.labelInterpolationFnc = Chartist.noop;
          options.plugins.push(
            Chartist.plugins.ctPointLabels(this.pluginPointLabels)
          );
        }
        if (
          this.type === "pie" &&
          options.donut &&
          this.pluginFillDonutItems &&
          Chartist.plugins.fillDonut
        ) {
          options.plugins.push(
            Chartist.plugins.fillDonut({ items: this.pluginFillDonutItems })
          );
        }
      }
      return options;
    }

    /**
     * Renders chart when chartData changes
     */
    _getChart() {
      let chart = null,
        target = this.shadowRoot.querySelector("#chart");

      if (target !== null && typeof Chartist === "object" && this.chartData) {
        if (this.type == "bar") {
          if (
            this.responsiveOptions !== undefined &&
            this.responsiveOptions.length > 0
          ) {
            this.responsiveOptions.forEach((option) => {
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
            this.chartData,
            this.fullOptions,
            this.responsiveOptions
          );
        } else if (this.type === "line") {
          chart = Chartist.Line(
            target,
            this.chartData,
            this.fullOptions,
            this.responsiveOptions
          );
        } else if (this.type === "pie") {
          chart = Chartist.Pie(
            target,
            {
              labels: this.chartData.labels || [],
              series: this.chartData.series || [],
            },
            this.fullOptions,
            this.responsiveOptions
          );
        }
        /**
         * Fired when chart is rendering.
         *
         * @event chartist-render-data
         *
         */
        this.dispatchEvent(
          new CustomEvent("chartist-render-data", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: chart,
          })
        );
        if (chart) {
          chart.on("created", (e) => {
            /**
             * Fired once chart is created features are added.
             *
             * @event chartist-render-created
             *
             */
            this.dispatchEvent(
              new CustomEvent("chartist-render-created", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: e,
              })
            );
          });
          chart.on("draw", (e) => {
            /**
             * Fired as shapes are being drawn.
             *
             * @event chartist-render-draw
             *
             */
            this.dispatchEvent(
              new CustomEvent("chartist-render-draw", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: e,
              })
            );
          });
          this.chart = chart;
        }
      }
    }

    /**
     * Convert from csv text to an array in the table function
     * @param {event} e event data
     * @memberof ChartistRender
     */
    _handleResponse(e) {
      this.data = this._CSVtoArray(e.detail.response);
    }

    /**
     * uses ESGlobalBridge to load scripts
     *
     * @param {string} classname class to import from script
     * @param {string} path relative path of script
     * @param {function} [fnc=this._updateData] function to reun when script is loaded
     */
    _loadScripts(classname, path, fnc = this._getChart) {
      let basePath = this.pathFromUrl(decodeURIComponent(import.meta.url)),
        location = `${basePath}${path}`;
      window.addEventListener(`es-bridge-${classname}-loaded`, fnc.bind(this));
      window.ESGlobalBridge.instance.load(classname, location);
    }

    /**
     * updates table when data changes
     * @memberof ChartistRender
     */
    _renderTable() {
      let html = "",
        table = this.querySelector("table"),
        data = this.data ? [this.data.labels, this.data.series] : false;
      if (data) {
        let rowHeads = data[1] && data[1][0] && isNaN(data[1][0]),
          colHeads =
            data[0] &&
            data[0][rowHeads ? 1 : 0] &&
            isNaN(data[0][rowHeads ? 1 : 0]),
          thead = !colHeads
            ? undefined
            : {
                row: rowHeads ? data[0][0] : undefined,
                col: rowHeads ? data[0].slice(1, data[0].length) : data[0],
              },
          tbody = data
            .slice(thead ? 1 : 0, data.length)
            .map((row) =>
              rowHeads
                ? { th: row[0], td: row.slice(1, row.length) }
                : { td: row }
            );
        table = table || document.createElement("table");
        if (thead)
          html += `
          <thead><tr>
            ${thead.row ? `<th scope="row">${thead.row}</th>` : ``}
            ${
              thead.col
                ? thead.col.map((th) => `<th scope="col">${th}</th>`).join("")
                : ``
            }
          </tr></thead>`;
        if (tbody.length > 0)
          html += `
          <tbody>
            ${tbody
              .map(
                (tr) => `
              <tr>
                ${tr.th ? `<th scope="row">${tr.th}</th>` : ``}
                ${tr.td ? tr.td.map((td) => `<td>${td}</td>`).join("") : ``}
              </tr>
            `
              )
              .join("")}
          </tbody>`;
        table.innerHTML = html;
        this.appendChild(table);
      } else if (table) {
        table.innerHTML = "";
      }
    }

    /**
     * updates chartData from data
     *
     */
    _updateChartData() {
      let data = this.data,
        rowHeads = data && data[1] && data[1][0] && isNaN(data[1][0]),
        colHeads =
          data &&
          data[0] &&
          data[0][rowHeads ? 1 : 0] &&
          isNaN(data[0][rowHeads ? 1 : 0]),
        labels = colHeads ? data[0] : undefined,
        body = colHeads && data[1] ? data.slice(1, data.length) : data;
      if (rowHeads) {
        labels = labels.slice(1, labels.length);
        body = body.map((row) => row.slice(1, row.length));
      }
      this.__dataReady = true;
      this.chartData = {
        labels: labels,
        series: this.type === "pie" ? body[0] : body,
      };
    }

    /**
     * Updates data from table
     */
    _updateData() {
      let table = this.querySelector("table"),
        data = [];
      if (table)
        table.querySelectorAll("tr").forEach((tr) => {
          let temp = [];
          tr.querySelectorAll("th,td").forEach((td) => {
            let html = td.innerHTML.trim();
            temp.push(isNaN(html) ? html : parseInt(html));
          });
          data.push(temp);
        });
      if (JSON.stringify(this.data) !== JSON.stringify(data)) this.data = data;
    }
  };
};
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
