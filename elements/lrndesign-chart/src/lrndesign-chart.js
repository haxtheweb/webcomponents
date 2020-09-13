/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ChartistRenderSuper } from "@lrnwebcomponents/chartist-render/chartist-render.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `lrndesign-chart`
 * common properties and behaviors for lrndesign chart types
 *
 * @extends ChartistRenderSuper
 * @see @lrnwebcomponents/chartist-render/chartist-render.js
 * @see @lrnwebcomponents/simple-colors/simple-colors.js
 */
const LrndesignChart = function (SuperClass) {
  return class extends ChartistRenderSuper(SuperClass) {
    /* REQUIRED FOR TOOLING DO NOT TOUCH */

    constructor() {
      super();
      this.setProperties();
      this.makeChart();
    }

    /**
     * Store the tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "lrndesign-chart";
    }

    /**
     * gets axis title options
     * @readonly
     */
    get axisTitles() {
      let axisTitles = {};
      if (this.axisXTitle)
        axisTitles.axisX = {
          axisTitle: this.axisXTitle,
          offset: { x: this.axisXTitleOffsetX, y: this.axisXTitleOffsetY },
          textAnchor: ["start", "end", "middle"].includes(this.axisXTitleAnchor)
            ? this.axisXTitleAnchor
            : "middle",
        };
      if (this.axisYTitle)
        axisTitles.axisY = {
          axisTitle: this.axisYTitle,
          offset: { x: this.axisYTitleOffsetX, y: this.axisYTitleOffsetY },
          textAnchor: ["start", "end", "middle"].includes(this.axisYTitleAnchor)
            ? this.axisYTitleAnchor
            : "middle",
        };
      return this.axisXTitle || this.axisYTitle ? axisTitles : undefined;
    }

    // extends haxProperty definition to line and bar properties
    static get lineBarHaxProperties() {
      return {
        gridBackground: [
          {
            property: "showGridBackground",
            title: "Show Grid Background",
            inputMethod: "boolean",
          },
        ],
        padding: [
          {
            property: "chartPaddingTop",
            title: "Chart Padding (top)",
            inputMethod: "text-field",
          },
          {
            property: "chartPaddingBottom",
            title: "Chart Padding (bottom)",
            inputMethod: "text-field",
          },
          {
            property: "chartPaddingLeft",
            title: "Chart Padding (left)",
            inputMethod: "text-field",
          },
          {
            property: "chartPaddingRight",
            title: "Chart Padding (right)",
            inputMethod: "text-field",
          },
        ],
        minMax: [
          {
            property: "low",
            title: "Chart Minimum",
            description: `
            Overriding the natural low of the chart allows you to zoom in 
            or limit the chart's lowest displayed value`,
            inputMethod: "number",
          },
          {
            property: "high",
            title: "Chart Maximum",
            description: `
            Overriding the natural high of the chart allows you to zoom in 
            or limit the chart's highest displayed value`,
            inputMethod: "number",
          },
        ],
        xAxis: [
          {
            property: "axisXShowGrid",
            title: "X-Axis Show Grid",
            description: "Show the X-Axis's grid.",
            inputMethod: "boolean",
          },
          {
            property: "axisXOffset",
            title: "X-Axis Offset",
            inputMethod: "number",
          },
          {
            property: "axisXPosition",
            title: "X-Axis Position",
            description: `
              Position where labels are placed. Can be set to "start" or "end" 
              where "start" is equivalent to left or top on vertical axis
              and "end" is equivalent to right or bottom on horizontal axis`,
            inputMethod: "text-field",
          },
          {
            property: "axisXShowLabel",
            title: "X-Axis Show Label",
            description: "Show the X-Axis's label.",
            inputMethod: "boolean",
          },
          {
            property: "axisXLabelOffsetX",
            title: "X-Axis Label (horizontal offset)",
            description: "Horizontal position of the X-Axis's labels.",
            inputMethod: "number",
          },
          {
            property: "axisXTitleOffsetY",
            title: "X-Axis Label (vertical offset)",
            description: "Vertical position of the X-Axis's labels.",
            inputMethod: "number",
          },
          {
            property: "axisXTitle",
            title: "X-Axis Title",
            description: "Optional title for X-axis.",
            inputMethod: "textfield",
          },
          {
            property: "axisXTitleOffsetX",
            title: "X-Axis Title (horizontal offset)",
            description: "Horizontal position of the X-Axis's title.",
            inputMethod: "number",
          },
          {
            property: "axisXLabelOffsetY",
            title: "X-Axis Title (vertical offset)",
            description: "Vertical position of the X-Axis's title.",
            inputMethod: "number",
          },
          {
            property: "axisXTitleAnchor",
            title: "X-Axis Title Anchoe",
            description: "Optional anchor for X-axis's title.",
            inputMethod: "select",
            options: {
              middle: "middle",
              end: "end",
              start: "start",
            },
          },
        ],
        yAxis: [
          {
            property: "axisYShowGrid",
            title: "Y-Axis: Show Grid",
            description: "Show the Y-Axis's grid.",
            inputMethod: "boolean",
          },
          {
            property: "axisYOffset",
            title: "Y-Axis Offset",
            inputMethod: "number",
          },
          {
            property: "axisYPosition",
            title: "Y-Axis Position",
            description: `
              Position where labels are placed. Can be set to "start" or "end" 
              where "start" is equivalent to left or top on vertical axis
              and "end" is equivalent to right or bottom on horizontal axis`,
            inputMethod: "text-field",
          },
          {
            property: "axisYShowLabel",
            title: "Y-Axis Show Label",
            description: "Show the Y-Axis's label.",
            inputMethod: "boolean",
          },
          {
            property: "axisYLabelOffsetX",
            title: "Y-Axis Label (horizontal offset)",
            description: "Horizontal position of the Y-Axis's label.",
            inputMethod: "number",
          },
          {
            property: "axisYLabelOffsetY",
            title: "Y-Axis Label (vertical offset)",
            description: "Vertical position of the Y-Axis's label.",
            inputMethod: "number",
          },
          {
            property: "axisYScaleMinSpace",
            title: "Y-Axis Scale Minimum Space",
            description: "Specifies minimum height in pixel of scale steps.",
            inputMethod: "number",
          },
          {
            property: "axisYOnlyInteger",
            title: "Y-Axis Scale (only integers)",
            description:
              "Use only integer values (whole numbers) for the scale steps.",
            inputMethod: "boolean",
          },
          {
            property: "axisYTitle",
            title: "Y-Axis Title",
            description: "Optional title for Y-axis.",
            inputMethod: "textfield",
          },
          {
            property: "axisYTitleOffsetX",
            title: "Y-Axis Title (vertical offset)",
            description: "Horizontal position of the Y-Axis's title.",
            inputMethod: "number",
          },
          {
            property: "axisYLabelOffsetY",
            title: "Y-Axis Title (horizontal offset)",
            description: "Horizontal position of the Y-Axis's title.",
            inputMethod: "number",
          },
          {
            property: "axisYTitleAnchor",
            title: "Y-Axis Title Anchoe",
            description: "Optional anchor for Y-axis's title.",
            inputMethod: "select",
            options: {
              middle: "middle",
              end: "end",
              start: "start",
            },
          },
          {
            property: "axisYTitleFlip",
            title: "Y-Axis Title Flip",
            description: "Flip the title for Y-axis?",
            inputMethod: "boolean",
          },
        ],
      };
    }

    //properties common to line and bar charts
    static get lineBarProperties() {
      return {
        /**
         * Offset X of labels for X-axis
         */
        axisXLabelOffsetX: {
          attribute: "axis-x-label-offset-x",
          type: Number,
        },
        /**
         * Offset Y of labels for X-axis
         */
        axisXLabelOffsetY: {
          attribute: "axis-x-label-offset-y",
          type: Number,
        },
        /**
         * The offset of the chart drawing area to the border of the container.
         */
        axisXOffset: {
          attribute: "axis-x-offset",
          type: Number,
        },
        /**
         * Position where labels are placed.
         * Can be set to `start` or `end`
         * where `start` is equivalent to left or top on vertical axis
         * and `end` is equivalent to right or bottom on horizontal axis.
         */
        axisXPosition: {
          attribute: "axis-x-position",
          type: String,
        },
        /**
         * Show axis X grid?
         */
        axisXShowGrid: {
          attribute: "axis-x-show-grid",
          type: Boolean,
        },
        /**
         * Show axis X labels?
         */
        axisXShowLabel: {
          attribute: "axis-x-show-label",
          type: Boolean,
        },
        /**
         * Optional title of x-axis
         */
        axisXTitle: {
          attribute: "axis-x-title",
          type: String,
        },
        /**
         * Optional x-offset for x-axis title
         */
        axisXTitleOffsetX: {
          attribute: "axis-x-title-offset",
          type: Number,
        },
        /**
         * Optional y-offset for x-axis title
         */
        axisXTitleOffsetY: {
          attribute: "axis-x-title-offset",
          type: Number,
        },
        /**
         * Optional title of x-axis. Possible values are 'start', 'end' and 'middle'.
         */
        axisXTitleAnchor: {
          attribute: "axis-x-title-anchor",
          type: String,
        },
        /**
        /**
         * Offset X of labels for Y-axis
         */
        axisYLabelOffsetX: {
          attribute: "axis-y-label-offset-x",
          type: Number,
        },
        /**
         * Offset Y of labels for Y-axis
         */
        axisYLabelOffsetY: {
          attribute: "axis-y-label-offset-y",
          type: Number,
        },
        /**
         * Position where labels are placed.
         * Can be set to `start` or `end`
         * where `start` is equivalent to left or top on vertical axis
         * and `end` is equivalent to right or bottom on horizontal axis.
         */
        axisYPosition: {
          attribute: "axis-y-position",
          type: String,
        },
        /**
         * Specifies minimum height in pixel of scale steps
         */
        axisYScaleMinSpace: {
          attribute: "axis-y-scale-min-space",
          type: Number,
        },
        /**
         * The offset of the chart drawing area to the border of the container.
         */
        axisYOffset: {
          attribute: "axis-y-offset",
          type: Number,
        },
        /**
         * Use only integer values (whole numbers) for the scale steps
         */
        axisYOnlyInteger: {
          attribute: "axis-y-only-integer",
          type: Boolean,
        },
        /**
         * Show axis Y grid?
         */
        axisYshowGrid: {
          attribute: "axis-y-show-grid",
          type: Boolean,
        },
        /**
         * Show axis Y labels?
         */
        axisYShowLabel: {
          attribute: "axis-y-show-label",
          type: Boolean,
        },
        /**
         * Position labels at top-left of axis?
         */
        axisYTopLeft: {
          attribute: "axis-y-top-left",
          type: Boolean,
        },
        /**
         * Optional title of y-axis
         */
        axisYTitle: {
          attribute: "axis-y-title",
          type: String,
        },
        /**
         * Optional x-offset for y-axis title.
         * Please note, x and y offset values for axisY are flipped due to the rotation of the axisY title by 90 degrees.
         * Therefore changing y moves left/right.
         */
        axisYTitleOffsetX: {
          attribute: "axis-y-title-offset",
          type: Number,
        },
        /**
         * Optional y-offset for y-axis title.
         * Please note, x and y offset values for axisY are flipped due to the rotation of the axisY title by 90 degrees.
         * Therefore changing the x value moves up/down the chart.
         */
        axisYTitleOffsetY: {
          attribute: "axis-y-title-offset",
          type: Number,
        },
        /**
         * Optional title of y-axis. Possible values are 'start', 'end' and 'middle'.
         */
        axisYTitleAnchor: {
          attribute: "axis-y-title-anchor",
          type: String,
        },
        /**
         * Optional title of y-axis
         */
        axisYTitleFlip: {
          attribute: "axis-y-title-flip",
          type: Boolean,
        },

        /**
         * Padding below chart drawing area
         */
        chartPaddingBottom: {
          attribute: "chart-padding-bottom",
          type: String,
        },

        /**
         * Padding left of chart drawing area
         */
        chartPaddingLeft: {
          attribute: "chart-padding-left",
          type: String,
        },

        /**
         * Padding right of chart drawing area
         */
        chartPaddingRight: {
          attribute: "chart-padding-right",
          type: String,
        },

        /**
         * Padding above chart drawing area
         */
        chartPaddingTop: {
          attribute: "chart-padding-top",
          type: String,
        },
        /**
         * Overriding the natural high of the chart allows you to zoom in
         * or limit the charts highest displayed value.
         */
        high: {
          type: Number,
        },
        /**
         * Overriding the natural low of the chart allows you to zoom in
         * or limit the charts lowest displayed value.
         */
        low: {
          type: Number,
        },
        /**
         * If the bar chart should add a background fill to the .ct-grids group.
         */
        showGridBackground: {
          attribute: "show-grid-background",
          type: Boolean,
        },
      };
    }

    /**
     * override this with type-specific options
     * @returns {object} options specific to both bar and line charts
     * @readonly
     * @memberof LrndesignChart
     * @memberof LrndesignChart
     */
    get lineBarOptions() {
      return {
        high: this.high,
        low: this.low,
        axisX: {
          labelOffset: {
            x: this.axisXLabelOffsetX,
            y: this.axisXLabelOffsetY,
            offset: this.axisXOffset,
          },
          position: this.axisXPosition,
          showGrid: this.axisXShowGrid,
          showLabel: this.axisXShowLabel,
        },
        axisY: {
          labelOffset: {
            x: this.axisYLabelOffsetX,
            y: this.axisYLabelOffsetY,
            offset: this.axisYOffset,
          },
          position: this.axisYPosition,
          showGrid: this.axisYShowGrid,
          showLabel: this.axisYShowLabel,
          onlyInteger: this.axisYOnlyInteger,
          scaleMinSpace: this.axisYScaleMinSpace,
        },
        showGridBackground: this.showGridBackground,
        chartPadding: {
          bottom: this.chartPaddingBottom + (this.axisXTitle ? 40 : 0),
          left: this.chartPaddingLeft + (this.axisYTitle ? 30 : 0),
          right: this.chartPaddingRight + (this.axisYTitle ? 15 : 0),
          top: this.chartPaddingTop + (this.axisXTitle ? 20 : 0),
        },
      };
    }

    /**
     *
     * override this with type-specific options
     * @returns {object} options
     * @readonly
     * @memberof LrndesignChart
     */
    get options() {
      return {
        reverseData: this.reverseData,
      };
    }

    updated(changedProperties) {
      changedProperties.forEach((oldValue, propName) => {
        if (
          (propName.indexOf("axisXTitle") > -1 ||
            propName.indexOf("axisYTitle") > -1) &&
          this[propName] !== oldValue
        ) {
          this.pluginAxisTitle = this.axisTitles;
        }
      });
      if (super.updated) super.updated(changedProperties);
    }

    /**
     * Sets properties for chart.
     * Specific chart types can extend this function
     * with type-specific properties.
     */
    setProperties() {
      this.dark = false;
      this.scale = "ct-minor-seventh";
      this.reverseData = false;
      this.rawData = "";
    }

    /**
     * Sets properties specific to bar and line charts.
     * Bar and line charts can include this function
     * in their extended setProperties function.
     */
    setBarLineProperties() {
      this.high = undefined;
      this.low = undefined;
      this.axisXLabelOffsetX = 0;
      this.axisXLabelOffsetY = 0;
      this.axisXOffset = 30;
      this.axisXPosition = "end";
      this.axisXShowGrid = true;
      this.axisXShowLabel = true;
      this.axisXTopLeft = false;
      this.axisXTitleOffsetX = 0;
      this.axisXTitleOffsetY = 50;
      this.axisXTitleAnchor = "middle";
      this.axisYTitleOffsetX = 0;
      this.axisYTitleOffsetY = -25;
      this.axisYTitleAnchor = "middle";
      this.axisYTitleFlip = false;
      this.axisYLabelOffsetX = 0;
      this.axisYLabelOffsetY = 0;
      this.axisYOffset = 30;
      this.axisYOnlyInteger = false;
      this.axisYPosition = "start";
      this.axisYScaleMinSpace = 20;
      this.axisYShowGrid = true;
      this.axisYShowLabel = true;
      this.axisYTopLeft = true;
      this.showGridBackground = false;
      this.chartPaddingBottom = 15;
      this.chartPaddingLeft = 15;
      this.chartPaddingRight = 15;
      this.chartPaddingTop = 15;
    }
    /**
     * life cycle, element is removed from the DOM
     */
    //disconnectedCallback() {}
  };
};
export { LrndesignChart };
