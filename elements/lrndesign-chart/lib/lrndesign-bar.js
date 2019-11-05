/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LrndesignChartBehaviors } from "./lrndesign-chart-behaviors.js";

/**
 * `lrndesign-bar`
 * a bar chart
 *
 * @customElement
 * @demo demo/bar.html
 *
 */
class LrndesignBar extends LrndesignChartBehaviors {
  constructor() {
    super();
    this.setProperties();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return Object.assign(super.properties(), super.lineBarProperties(), {
      /**
       * Use only integer values (whole numbers) for the scale steps
       */
      axisXOnlyInteger: {
        attribute: "axis-x-only-integer",
        type: Boolean
      },
      /**
       * TODO
       */
      axisXScaleMinSpace: {
        attribute: "axis-x-min-space",
        type: Number
      },
      /**
       * If set to true then each bar will represent a series and
       * the data array is expected to be a one dimensional array
       * of data values rather than a series array of series.
       * This is useful if the bar chart should represent
       * a profile rather than some data over time.
       */
      distributeSeries: {
        attribute: "distribute-series",
        type: Boolean
      },
      /**
       * Inverts the axes of the bar chart in order to draw
       * a horizontal bar chart. Be aware that you also need
       * to invert your axis settings as the Y Axis will now display
       * the labels and the X Axis the values.
       */
      horizontalBars: {
        attribute: "horizontal-bars",
        type: Boolean
      },
      /**
       * Unless low/high are explicitly set, bar chart will be
       * centered at zero by default. Set referenceValue to null to auto scale.
       */
      referenceValue: {
        attribute: "reference-value",
        type: Number
      },
      /**
       * Specify the distance in pixel of bars in a group.
       */
      seriesBarDistance: {
        attribute: "series-bar-distance",
        type: Number
      },
      /**
       * If set to true this property will cause the series bars
       * to be stacked. Check the "stackMode" option
       * for further stacking options.
       */
      stackBars: {
        attribute: "stack-bars",
        type: Boolean
      },
      /**
       * If set to "true" this property will form a total
       * for each series point. This will also influence
       * the y-axis and the overall bounds of the chart.
       * If set to "false" this property will force
       * the stacked bars to draw from the zero line.
       * In stacked mode the "seriesBarDistance" property will have no effect.
       */
      stackMode: {
        attribute: "stack-mode",
        type: String
      }
    });
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-bar";
  }
  // haxProperty definition
  static get haxProperties() {
    return {
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
  }

  /**
   * Overrides default properties with bar-specific properties.
   */
  setProperties() {
    super.setProperties();
    this.setBarLineProperties();
    this.axisXOnlyInteger = false;
    this.axisXScaleMinSpace = 30;
    this.distributeSeries = false;
    this.horizontalBars = false;
    this.referenceValue = 0;
    this.seriesBarDistance = 15;
    this.stackBars = false;
    this.stackMode = true;
    this.type = "bar";
  }

  /**
   * returns options as an array
   */
  _getOptions() {
    return {
      width: this.width,
      height: this.height,
      high: this.high,
      low: this.low,
      referenceValue: this.referenceValue,
      seriesBarDistance: this.seriesBarDistance,
      stackBars: this.stackBars,
      stackModeAccumulate: this.stackModeAccumulate,
      horizontalBars: this.horizontalBars,
      distributeSeries: this.distributeSeries,
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
        showLabel: this.axisYshowLabel,
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
window.customElements.define(LrndesignBar.tag, LrndesignBar);
export { LrndesignBar };
