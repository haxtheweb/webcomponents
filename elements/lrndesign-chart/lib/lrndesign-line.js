/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LrndesignChartBehaviors } from "./lrndesign-chart-behaviors.js";

/**
 * `lrndesign-line`
 * a line chart
 *
 * @customElement
 * @demo demo/line.html
 *
 */
class LrndesignLine extends LrndesignChartBehaviors {
  constructor() {
    super();
    this.setProperties();
  }

  static get properties() {
    return Object.assign(super.properties(), {
      /**
       * The base for the area chart that will be used
       * to close the area shape (is normally 0).
       */
      areaBase: {
        attribute: "area-base",
        type: Number
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
        attribute: "full-width",
        type: Boolean
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
        attribute: "line-smooth",
        type: Boolean
      },
      /**
       * If the line chart should draw an area.
       */
      showArea: {
        attribute: "show-area",
        type: Boolean
      },
      /**
       * If the line should be drawn or not.
       */
      showLine: {
        attribute: "show-line",
        type: Boolean
      },
      /**
       * If the line should be drawn or not.
       */
      showPoint: {
        attribute: "show-point",
        type: Boolean
      }
    });
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-line";
  }

  // haxProperty definition
  static get haxProperties() {
    return {
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
  }

  /**
   * Overrides default properties with line-specific properties.
   */
  setProperties() {
    super.setProperties();
    this.setBarLineProperties();
    this.areaBase = 0;
    this.fullWidth = false;
    this.lineSmooth = true;
    this.showArea = false;
    this.showLine = true;
    this.showPoint = true;
    this.type = "line";
  }

  /**
   * returns options as an array
   */
  _getOptions() {
    return {
      high: this.high,
      low: this.low,
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
  }
}
/**
 * life cycle, element is removed from the DOM
 */
//disconnectedCallback() {}
window.customElements.define(LrndesignLine.tag, LrndesignLine);
export { LrndesignLine };
