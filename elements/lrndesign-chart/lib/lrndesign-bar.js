import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "chartist-render/chartist-render.js";
import "hax-body-behaviors/hax-body-behaviors.js";
import "schema-behaviors/schema-behaviors.js";
/**
`lrndesign-bar`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -
 -

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <iron-ajax id="datasource" url="{{dataSource}}" handle-as="text" last-response="{{rawData}}" on-response="handleResponse"></iron-ajax>
    <chartist-render id="chartist" type="bar" scale\$="[[scale]]" chart-title\$="[[chartTitle]]" chart-desc\$="[[chartDesc]]" data\$="[[data]]" options\$="{{options}}" responsive-options\$="[[responsiveOptions]]"></chartist-render>
`,

  is: "lrndesign-bar",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * The unique identifier of the chart.
     */
    chartId: {
      type: String,
      value: "chart"
    },
    /**
     * The chart title used for accessibility.
     */
    chartTitle: {
      type: String,
      value: null
    },
    /**
     * The chart description used for accessibility.
     */
    chartDesc: {
      type: String,
      value: ""
    },
    /**
     * Scale of the chart.
     */
    scale: {
      type: String,
      notify: true
    },
    /**
     * Data as an array.
     */
    data: {
      type: Object,
      value: {},
      observer: "_dataUpdated"
    },
    /**
     * Options as an array.
     */
    options: {
      type: Object,
      notify: true,
      value: {}
    },
    /**
     * Fixed width for the chart as a string (i.e. '100px' or '50%').
     */
    width: {
      type: String,
      value: undefined
    },
    /**
     * Fixed height for the chart as a string (i.e. '100px' or '50%').
     */
    height: {
      type: String,
      value: undefined
    },
    /**
     *  Padding-top for chart.
     */
    paddingTop: {
      type: Number,
      value: 5
    },
    /**
     *  Padding-right for chart.
     */
    paddingRight: {
      type: Number,
      value: 5
    },
    /**
     *  Padding-bottom for chart.
     */
    paddingBottom: {
      type: Number,
      value: 5
    },
    /**
     *  Padding-left for chart.
     */
    paddingLeft: {
      type: Number,
      value: 5
    },
    /**
     * Overriding the natural high of the chart allows you to zoom in
     * or limit the charts highest displayed value.
     */
    high: {
      type: Number,
      value: undefined
    },
    /**
     * Overriding the natural low of the chart allows you to zoom in
     * or limit the charts lowest displayed value.
     */
    low: {
      type: Number,
      value: undefined
    },
    /**
     * Unless low/high are explicitly set, bar chart will be
     * centered at zero by default. Set referenceValue to null to auto scale.
     */
    referenceValue: {
      type: Number,
      value: 0
    },
    /**
     * Specify the distance in pixel of bars in a group.
     */
    seriesBarDistance: {
      type: Number,
      value: 15
    },
    /**
     * If set to true this property will cause the series bars
     * to be stacked. Check the "stackMode" option
     * for further stacking options.
     */
    stackBars: {
      type: Boolean,
      value: false
    },
    /**
     * If set to "true" this property will form a total
     * for each series point. This will also influence
     * the y-axis and the overall bounds of the chart.
     * If set to "false" this property will force
     * the stacked bars to draw from the zero line.
     * In stacked mode the "seriesBarDistance" property will have no effect.
     */
    stackModeAccumulate: {
      type: Boolean,
      value: true
    },
    /**
     * Inverts the axes of the bar chart in order to draw
     * a horizontal bar chart. Be aware that you also need
     * to invert your axis settings as the Y Axis will now display
     * the labels and the X Axis the values.
     */
    horizontalBars: {
      type: Boolean,
      value: false
    },
    /**
     * If set to true then each bar will represent a series and
     * the data array is expected to be a one dimensional array
     * of data values rather than a series array of series.
     * This is useful if the bar chart should represent
     * a profile rather than some data over time.
     */
    distributeSeries: {
      type: Boolean,
      value: false
    },
    /**
     * Reverse data including labels, the series order as well as
     * the whole series data arrays.
     */
    reverseData: {
      type: Boolean,
      value: false
    },
    /**
     * If the bar chart should add a background fill to the .ct-grids group.
     */
    showGridBackground: {
      type: Boolean,
      value: false
    },
    /**
     * The offset of the chart drawing area to the border of the container.
     */
    axisXOffset: {
      type: Number,
      value: 30
    },
    /**
     * The offset of the chart drawing area to the border of the container.
     */
    axisYOffset: {
      type: Number,
      value: 30
    },
    /**
     * Position labels at top-left of axis?
     */
    axisXTopLeft: {
      type: Boolean,
      value: false
    },
    /**
     * Position labels at top-left of axis?
     */
    axisYTopLeft: {
      type: Boolean,
      value: true
    },
    /**
     * Offset X of labels for X-axis
     */
    axisXLabelOffsetX: {
      type: Number,
      value: 0
    },
    /**
     * Offset Y of labels for X-axis
     */
    axisXLabelOffsetY: {
      type: Number,
      value: 0
    },
    /**
     * Offset X of labels for Y-axis
     */
    axisYLabelOffsetX: {
      type: Number,
      value: 0
    },
    /**
     * Offset Y of labels for Y-axis
     */
    axisYLabelOffsetY: {
      type: Number,
      value: 0
    },
    /**
     * Show axis X labels?
     */
    axisXShowLabel: {
      type: Boolean,
      value: true
    },
    /**
     * Show axis Y labels?
     */
    axisYshowLabel: {
      type: Boolean,
      value: true
    },
    /**
     * Show axis X grid?
     */
    axisXShowGrid: {
      type: Boolean,
      value: true
    },
    /**
     * Show axis Y grid?
     */
    axisYshowGrid: {
      type: Boolean,
      value: true
    },
    /**
     * Use only integer values (whole numbers) for the scale steps
     */
    axisXOnlyInteger: {
      type: Boolean,
      value: false
    },
    /**
     * Use only integer values (whole numbers) for the scale steps
     */
    axisYOnlyInteger: {
      type: Boolean,
      value: false
    },
    /**
     * The responsive options.
     * (See https://gionkunz.github.io/chartist-js/api-documentation.html.)
     */
    responsiveOptions: {
      type: Array,
      value: []
    },
    /**
     * Location of the CSV file.
     */
    dataSource: {
      type: String,
      notify: true,
      observer: "_dataSourceChanged"
    },
    /**
     * Raw data pulled in from the csv file.
     */
    rawData: {
      type: String,
      notify: true,
      value: ""
    }
  },

  /**
   * Generate the request when we notice data source change.
   * This enables us to use the same element with things that
   * manually generate the data within the app instead of
   * pulling it dynamically from a file / endpoint.
   */
  _dataSourceChanged: function(newValue, oldValue) {
    if (typeof newValue !== undefined) {
      this.$.datasource.generateRequest();
    }
  },

  /**
   * Convert from csv text to an array in the table function
   */
  handleResponse: function(e) {
    let raw = this.CSVtoArray(this.rawData);
    this.set("data", {});
    this.set("data", {
      labels: raw[0],
      series: raw.slice(1, raw.length)
    });
  },

  /**
   * Update the chart object when we get new data.
   */
  _dataUpdated: function(newValue, oldValue) {
    // hard reset value to ensure they are updated in the event
    // this is presenting them on the screen some how.
    this.set("options", {});
    this.set("options", this._getOptions());
    let chart = this.$.chartist.makeChart();
  },

  /**
   * wire it for hax-body
   */
  attached: function() {
    // Establish hax properties if they exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Bar Chart",
        description: "Creates an accessible bar chart based on a CSV.",
        icon: "editor:nsert-chart",
        color: "green darken-4",
        groups: ["Data", "Presentation"],
        handles: [
          {
            type: "data",
            url: "csvFile"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "data-source",
            title: "CSV File",
            description: "The URL for your CSV file.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url",
            required: true
          },
          {
            property: "chartTitle",
            title: "Chart Title",
            description: "Accessible alt text for your chart.",
            inputMethod: "textfield",
            icon: "text-field",
            required: true
          },
          {
            property: "chartDesc",
            title: "Chart Description",
            description: "Accessible description of your chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "stackBars",
            title: "Stacked bars?",
            description: "Display as a stacked bar graph.",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "horizontalBars",
            title: "Horizonal bars?",
            description: "Display as a horizonal bar graph.",
            inputMethod: "boolean",
            icon: "check-box"
          }
        ],
        configure: [
          {
            property: "width",
            title: "Width",
            description: "The width of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "height",
            title: "Height",
            description: "The height of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "paddingTop",
            title: "Padding-Top",
            description: "The padding at the top of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "paddingRight",
            title: "Padding-Right",
            description: "The padding at the right of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "paddingBottom",
            title: "Padding-Bottom",
            description: "The padding at the bottom of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "paddingLeft",
            title: "Padding-Left",
            description: "The padding at the left of the chart.",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "high",
            title: "Highest Displayed Value",
            description:
              "Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value.",
            inputMethod: "textfield",
            icon: "text-field",
            validationType: "number"
          },
          {
            property: "low",
            title: "Lowest Displayed Value",
            description:
              "Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value.",
            inputMethod: "textfield",
            icon: "text-field",
            validationType: "number"
          },
          {
            property: "referenceValue",
            title: "Reference Value",
            description:
              "Unless low/high are explicitly set, bar chart will be centered at zero by default. Set referenceValue to null to auto scale.",
            inputMethod: "textfield",
            icon: "text-field",
            validationType: "number"
          },
          {
            property: "axisXShowGrid",
            title: "X-Axis Grid",
            description: "Should axis X grid be shown?",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "axisYShowGrid",
            title: "Y-Axis Grid",
            description: "Should Y-axis grid be shown?",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "showGridBackground",
            title: "Show Grid Background?",
            description:
              "If the bar chart should add a background fill to the .ct-grids group.",
            inputMethod: "boolean",
            icon: "check-box"
          }
        ],
        advanced: [
          {
            property: "scale",
            title: "Scale Name",
            description:
              "The ratio of width:height of the chart (See https://gionkunz.github.io/chartist-js/getting-started.html#default-sass-settings for $ct-scales and $ct-scales-names).",
            inputMethod: "textfield",
            icon: "text-field"
          },
          {
            property: "reverseData",
            title: "Reverse Data",
            description:
              "Reverse data including labels, the series order as well as the whole series data arrays.",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "stackModeAccumulate",
            title: "Stacked Bars Accumulate",
            description:
              'If set to "true" this property will form a total for each series point. If set to "false" this property will force the stacked bars to draw from the zero line. This will also influence the y-axis and the overall bounds of the chart. In stacked mode the seriesBarDistance property will have no effect.',
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "distributeSeries",
            title: "Distribute Series",
            description:
              'If set to "true" then each bar will represent a series and the data array is expected to be a one dimensional array of data values rather than a series array of series. This is useful if the bar chart should represent a profile rather than some data over time.',
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "axisXOnlyInteger",
            title: "X-Axis Integers",
            description: "Round X-Axis Scale to Integers",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "axisYOnlyInteger",
            title: "Y-Axis Integers",
            description: "Round Y-Axis Scale to Integers",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "axisXShowLabel",
            title: "X-Axis Labels",
            description: "Should axis X labels be shown?",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "axisYShowLabel",
            title: "Y-Axis Labels",
            description: "Should Y-axis labels be shown?",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "axisXLabelOffsetX",
            title: "X-Axis Label X-Offset",
            description: "Horizontal Offset offset of X-Axis labels.",
            inputMethod: "textfield",
            icon: "text-field",
            validationType: "number"
          },
          {
            property: "axisXLabelOffsetY",
            title: "X-Axis Label Y-Offset",
            description: "Vertical Offset offset of X-Axis labels.",
            inputMethod: "textfield",
            icon: "text-field",
            validationType: "number"
          },
          {
            property: "axisYLabelOffsetX",
            title: "Y-Axis Label X-Offset",
            description: "Horizontal Offset offset of Y-Axis labels.",
            inputMethod: "textfield",
            icon: "text-field",
            validationType: "number"
          },
          {
            property: "axisYLabelOffsetY",
            title: "Y-Axis Label Y-Offset",
            description: "Vertical Offset offset of Y-Axis labels.",
            inputMethod: "textfield",
            icon: "text-field",
            validationType: "number"
          }
        ]
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * returns options as an array
   */
  _getOptions: function() {
    return {
      width: this.width,
      height: this.height,
      high: this.high,
      low: this.low,
      chartPadding: {
        top: this.paddingTop,
        right: this.paddingRight,
        bottom: this.paddingBottom,
        left: this.paddingLeft
      },
      referenceValue: this.referenceValue,
      seriesBarDistance: this.seriesBarDistance,
      stackBars: this.stackBars,
      stackMode: this.stackModeAccumulate == true ? "accumulate" : "overlap",
      horizontalBars: this.horizontalBars,
      distributeSeries: this.distributeSeries,
      reverseData: this.reverseData,
      showGridBackground: this.showGridBackground,
      axisX: {
        offset: this.axisXOffset,
        position: this.axisXTopLeft == true ? "start" : "end",
        labelOffset: {
          x: this.axisXLabelOffsetX,
          y: this.axisXLabelOffsetY
        },
        showLabel: this.axisXShowLabel,
        showGrid: this.axisXShowGrid,
        onlyInteger: this.axisXOnlyInteger
      },
      axisY: {
        offset: this.axisYOffset,
        position: this.axisYTopLeft == true ? "start" : "end",
        labelOffset: {
          x: this.axisYLabelOffsetX,
          y: this.axisYLabelOffsetY
        },
        showLabel: this.axisYShowLabel,
        showGrid: this.axisYShowGrid,
        onlyInteger: this.axisYOnlyInteger
      }
    };
  },

  /**
   * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
   */
  CSVtoArray: function(text) {
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
});
