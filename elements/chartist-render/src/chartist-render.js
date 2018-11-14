import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";

/**
`chartist-render`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <div id="chart" chart$="[[__chartId]]" class$="ct-chart [[scale]]"></div>
`,

  is: "chartist-render",

  listeners: {
    tap: "makeChart"
  },

  properties: {
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
     * The scale of the chart. (See https://gionkunz.github.io/chartist-js/api-documentation.html)
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
  },
  /**
   * created life cycle
   */
  created: function() {
    const name = "chartist";
    const basePath = pathFromUrl(import.meta.url);
    const location = `${basePath}lib/chartist/dist/chartist.min.js`;
    window.addEventListener(
      `es-bridge-${name}-loaded`,
      this._chartistLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load(name, location);
  },
  _chartistLoaded: function() {
    this.__chartistLoaded = true;
    if (this.__chartId) {
      this._chartReady();
    }
  },
  attached: function() {
    this.__chartId = this._getUniqueId("chartist-render-");
    if (this.__chartistLoaded) {
      this._chartReady();
    }
  },
  /**
   * Makes chart and returns the chart object.
   */
  _checkReady: function() {
    let root = this;
    setInterval(root._chartReady, 500);
  },

  /**
   * Makes chart and returns the chart object.
   */
  _chartReady: function() {
    let container = this.$.chart;
    if (container !== null) {
      this.fire("chartist-render-ready", this);
      if (this.data !== null) this.makeChart();
      clearInterval(this._checkReady);
    }
  },

  /**
   * Makes chart and returns the chart object.
   */
  makeChart: function() {
    let root = this,
      chart;
    if (
      this.__chartistLoaded &&
      this.__chartId &&
      root.data !== null &&
      this.$.chart !== null
    ) {
      if (root.type == "bar") {
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
      root.fire("chartist-render-draw", chart);
      chart.on("created", () => {
        root.addA11yFeatures(chart.container.childNodes[0]);
      });
      return chart;
    } else {
      return null;
    }
  },

  /**
   * Add accessibility features.
   */
  addA11yFeatures: function(svg) {
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
  },

  /**
   * Add accessibility features.
   */
  makeA11yTable: function(svg) {
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
  },

  /**
   * For inserting chart title and description.
   */
  _addA11yFeature: function(svg, tag, html) {
    let el = document.createElement(tag);
    let first = svg.childNodes[0];
    el.innerHTML = html;
    el.setAttribute("id", this.__chartId + "-chart-" + tag);
    svg.insertBefore(el, first);
  },

  /**
   * Get unique ID from the chart
   */
  _getUniqueId(prefix) {
    let id = prefix + Date.now();
    return id;
  }
});
