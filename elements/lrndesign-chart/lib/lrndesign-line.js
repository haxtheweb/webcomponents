import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "chartist-render/chartist-render.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
`lrndesign-line`
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
    <iron-ajax auto="" url="{{dataSource}}" handle-as="text" last-response="{{rawData}}" on-response="handleResponse"></iron-ajax>
    <chartist-render id="chartist" type="line" scale\$="[[scale]]" chart-title\$="[[chartTitle]]" chart-desc\$="[[chartDesc]]" data\$="[[data]]" options\$="{{options}}" responsive-options\$="[[responsiveOptions]]"></chartist-render>
`,

  is: "lrndesign-line",
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
      notify: true,
      value: "ct-octave"
    },
    /**
     * Data as an array.
     */
    data: {
      type: Array,
      notify: true,
      value: []
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
     * If the line should be drawn or not.
     */
    showLine: {
      type: Boolean,
      value: true
    },
    /**
     * If the line should be drawn or not.
     */
    showPoint: {
      type: Boolean,
      value: true
    },
    /**
     * If the line chart should draw an area.
     */
    showArea: {
      type: Boolean,
      value: false
    },
    /**
     * The base for the area chart that will be used
     * to close the area shape (is normally 0).
     */
    areaBase: {
      type: Number,
      value: 0
    },
    /**
     * Specify if the lines should be smoothed.
     * This value can be true or false where true
     * will result in smoothing using the default
     * smoothing interpolation function Chartist.
     * Interpolation.cardinal and false results in
     * Chartist.Interpolation.none.
     * You can also choose other smoothing /
     * interpolation functions available in the Chartist.
     * Interpolation module, or write your own
     * interpolation function. Check the examples
     * for a brief description..
     */
    lineSmooth: {
      type: Boolean,
      value: true
    },
    /**
     * If the bar chart should add a background fill to the .ct-grids group.
     */
    showGridBackground: {
      type: Boolean,
      value: false
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
     *  Padding-top for chart.
     */
    paddingTop: {
      type: Number,
      value: 15
    },
    /**
     *  Padding-right for chart.
     */
    paddingRight: {
      type: Number,
      value: 15
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
      value: 10
    },
    /**
     * When set to true, the last grid line on the x-axis
     * is not drawn and the chart elements will expand
     * to the full available width of the chart.
     * For the last label to be drawn correctly
     * you might need to add chart padding or offset the
     * last label with a draw event handler.
     */
    fullWidth: {
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
      notify: true
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
   * Convert from csv text to an array in the table function
   */
  handleResponse: function(e) {
    let root = this;
    let raw = root.CSVtoArray(root.rawData);
    root.data = {
      labels: raw[0],
      series: raw.slice(1, raw.length)
    };
    root.options = root._getOptions();
    let chart = root.$.chartist.makeChart();
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
        title: "Line Chart",
        description: "Creates an accessible line chart based on a CSV.",
        icon: "editor:show-chart",
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
            property: "showLine",
            title: "Show Line",
            description: "If the line should be drawn or not.",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "showPoint",
            title: "Show Point",
            description: "If the points should be drawn or not.",
            inputMethod: "boolean",
            icon: "check-box"
          },
          {
            property: "showArea",
            title: "Show Area",
            description: "If the line chart should draw an area.",
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
            property: "areaBase",
            title: "Area base",
            description:
              "Specify if the lines should be smoothed. This value can be true or false where true will result in smoothing using the default smoothing interpolation function Chartist.Interpolation.cardinal and false results in Chartist.Interpolation.none. You can also choose other smoothing / interpolation functions available in the Chartist.Interpolation module, or write your own interpolation function. Check the examples for a brief description.",
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
            property: "fullWidth",
            title: "Full Width",
            description:
              "When set to true, the last grid line on the x-axis is not drawn and the chart elements will expand to the full available width of the chart. For the last label to be drawn correctly you might need to add chart padding or offset the last label with a draw event handler.",
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
          },
          {
            property: "lineSmooth",
            title: "Show Area",
            description:
              "Specify if the lines should be smoothed. This value can be true or false where true will result in smoothing using the default smoothing interpolation function Chartist.Interpolation.cardinal and false results in Chartist.Interpolation.none. You can also choose other smoothing / interpolation functions available in the Chartist.Interpolation module, or write your own interpolation function. Check the examples for a brief description..",
            inputMethod: "boolean",
            icon: "check-box"
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
      showLine: this.showLine,
      showPoint: this.showPoint,
      showArea: this.showArea,
      areaBase: this.areaBase,
      lineSmooth: this.lineSmooth,
      fullWidth: this.fullWidth,
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
        showGrid: this.axisXShowGrid
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
