/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { ChartistRender } from "@lrnwebcomponents/chartist-render/chartist-render.js";
/**
 * `lrndesign-chart-behaviors`
 * @element lrndesign-chart
 * @demo ./demo/index.html
 * @demo ./demo/pie.html pie charts
 * @demo ./demo/bar.html bar charts
 * @demo ./demo/line.html line charts
 * a line chart
 *

 * @extends ChartistRender
 * @see @lrnwebcomponents/chartist-render/chartist-render.js
 * @extends SimpleColors
 * @see @lrnwebcomponents/simple-colors/simple-colors.js
 * @extends SchemaBehaviors
 * @see @lrnwebcomponents/schema-behaviors/schema-behaviors.js
 *
 *
 */
class LrndesignChart extends ChartistRender {
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

  //properties common to line and bar charts
  static get lineBarProperties() {
    return {
      /**
       * Offset X of labels for X-axis
       */
      axisXLabelOffsetX: {
        attribute: "axis-x-label-offset-x",
        type: Number
      },
      /**
       * Offset Y of labels for X-axis
       */
      axisXLabelOffsetY: {
        attribute: "axis-x-label-offset-y",
        type: Number
      },
      /**
       * The offset of the chart drawing area to the border of the container.
       */
      axisXOffset: {
        attribute: "axis-x-offset",
        type: Number
      },
      /**
       * Position where labels are placed.
       * Can be set to `start` or `end`
       * where `start` is equivalent to left or top on vertical axis
       * and `end` is equivalent to right or bottom on horizontal axis.
       */
      axisXPosition: {
        attribute: "axis-x-position",
        type: String
      },
      /**
       * Show axis X grid?
       */
      axisXShowGrid: {
        attribute: "axis-x-show-grid",
        type: Boolean
      },
      /**
       * Show axis X labels?
       */
      axisXShowLabel: {
        attribute: "axis-x-show-label",
        type: Boolean
      },
      /**
       * Offset X of labels for Y-axis
       */
      axisYLabelOffsetX: {
        attribute: "axis-y-label-offset-x",
        type: Number
      },
      /**
       * Offset Y of labels for Y-axis
       */
      axisYLabelOffsetY: {
        attribute: "axis-y-label-offset-y",
        type: Number
      },
      /**
       * Position where labels are placed.
       * Can be set to `start` or `end`
       * where `start` is equivalent to left or top on vertical axis
       * and `end` is equivalent to right or bottom on horizontal axis.
       */
      axisYPosition: {
        attribute: "axis-y-position",
        type: String
      },
      /**
       * Specifies minimum height in pixel of scale steps
       */
      axisYScaleMinSpace: {
        attribute: "axis-y-scale-min-space",
        type: Number
      },
      /**
       * The offset of the chart drawing area to the border of the container.
       */
      axisYOffset: {
        attribute: "axis-y-offset",
        type: Number
      },
      /**
       * Use only integer values (whole numbers) for the scale steps
       */
      axisYOnlyInteger: {
        attribute: "axis-y-only-integer",
        type: Boolean
      },
      /**
       * Show axis Y grid?
       */
      axisYshowGrid: {
        attribute: "axis-y-show-grid",
        type: Boolean
      },
      /**
       * Show axis Y labels?
       */
      axisYshowLabel: {
        attribute: "axis-y-show-label",
        type: Boolean
      },
      /**
       * Position labels at top-left of axis?
       */
      axisYTopLeft: {
        attribute: "axis-y-top-left",
        type: Boolean
      },

      /**
       * Padding below chart drawing area
       */
      chartPaddingBottom: {
        attribute: "chart-padding-bottom",
        type: String
      },

      /**
       * Padding left of chart drawing area
       */
      chartPaddingLeft: {
        attribute: "chart-padding-left",
        type: String
      },

      /**
       * Padding right of chart drawing area
       */
      chartPaddingRight: {
        attribute: "chart-padding-right",
        type: String
      },

      /**
       * Padding above chart drawing area
       */
      chartPaddingTop: {
        attribute: "chart-padding-top",
        type: String
      },
      /**
       * Overriding the natural high of the chart allows you to zoom in
       * or limit the charts highest displayed value.
       */
      high: {
        type: Number
      },
      /**
       * Overriding the natural low of the chart allows you to zoom in
       * or limit the charts lowest displayed value.
       */
      low: {
        type: Number
      },
      /**
       * If the bar chart should add a background fill to the .ct-grids group.
       */
      showGridBackground: {
        attribute: "show-grid-background",
        type: Boolean
      }
    };
  }

  // extends haxProperty definition to line and bar properties
  static get lineBarHaxProperties() {
    return {
      gridBackground: [
        {
          property: "showGridBackground",
          title: "Show Grid Background",
          inputMethod: "boolean"
        }
      ],
      padding: [
        {
          property: "chartPaddingTop",
          title: "Chart Padding (top)",
          inputMethod: "text-field"
        },
        {
          property: "chartPaddingBottom",
          title: "Chart Padding (bottom)",
          inputMethod: "text-field"
        },
        {
          property: "chartPaddingLeft",
          title: "Chart Padding (left)",
          inputMethod: "text-field"
        },
        {
          property: "chartPaddingRight",
          title: "Chart Padding (right)",
          inputMethod: "text-field"
        }
      ],
      minMax: [
        {
          property: "low",
          title: "Chart Minimum",
          description: `
          Overriding the natural low of the chart allows you to zoom in 
          or limit the chart's lowest displayed value`,
          inputMethod: "number"
        },
        {
          property: "high",
          title: "Chart Maximum",
          description: `
          Overriding the natural high of the chart allows you to zoom in 
          or limit the chart's highest displayed value`,
          inputMethod: "number"
        }
      ],
      xAxis: [
        {
          property: "axisXShowGrid",
          title: "X-Axis Show Grid",
          description: "Show the X-Axis's grid.",
          inputMethod: "boolean"
        },
        {
          property: "axisXOffset",
          title: "X-Axis Offset",
          inputMethod: "number"
        },
        {
          property: "axisXPosition",
          title: "X-Axis Position",
          description: `
            Position where labels are placed. Can be set to "start" or "end" 
            where "start" is equivalent to left or top on vertical axis
            and "end" is equivalent to right or bottom on horizontal axis`,
          inputMethod: "text-field"
        },
        {
          property: "axisXShowLabel",
          title: "X-Axis Show Label",
          description: "Show the X-Axis's label.",
          inputMethod: "boolean"
        },
        {
          property: "axisXLabelOffsetX",
          title: "X-Axis Label (horizontal offset)",
          description: "Horizontal position of the X-Axis's label.",
          inputMethod: "number"
        },
        {
          property: "axisXLabelOffsetY",
          title: "X-Axis Label (vertical offset)",
          description: "Vertical position of the X-Axis's label.",
          inputMethod: "number"
        }
      ],
      yAxis: [
        {
          property: "axisYShowGrid",
          title: "Y-Axis: Show Grid",
          description: "Show the Y-Axis's grid.",
          inputMethod: "boolean"
        },
        {
          property: "axisYOffset",
          title: "Y-Axis Offset",
          inputMethod: "number"
        },
        {
          property: "axisYPosition",
          title: "Y-Axis Position",
          description: `
            Position where labels are placed. Can be set to "start" or "end" 
            where "start" is equivalent to left or top on vertical axis
            and "end" is equivalent to right or bottom on horizontal axis`,
          inputMethod: "text-field"
        },
        {
          property: "axisYShowLabel",
          title: "Y-Axis Show Label",
          description: "Show the Y-Axis's label.",
          inputMethod: "boolean"
        },
        {
          property: "axisYLabelOffsetX",
          title: "Y-Axis Label (horizontal offset)",
          description: "Horizontal position of the Y-Axis's label.",
          inputMethod: "number"
        },
        {
          property: "axisYLabelOffsetY",
          title: "Y-Axis Label (vertical offset)",
          description: "Vertical position of the Y-Axis's label.",
          inputMethod: "number"
        },
        {
          property: "axisYScaleMinSpace",
          title: "Y-Axis Scale Minimum Space",
          description: "Specifies minimum height in pixel of scale steps.",
          inputMethod: "number"
        },
        {
          property: "axisYOnlyInteger",
          title: "Y-Axis Scale (only integers)",
          description:
            "Use only integer values (whole numbers) for the scale steps.",
          inputMethod: "boolean"
        }
      ]
    };
  }

  /**
   * override this with type-specific options
   * @returns {object} options specific to both bar and line charts
   * @readonly
   * @memberof LrndesignChart
   * @memberof LrndesignChart
   */
  static get lineBarOptions() {
    return {
      high: this.high,
      low: this.low,
      axisX: {
        labelOffset: {
          x: this.axisXLabelOffsetX,
          y: this.axisXLabelOffsetY,
          offset: this.axisXOffset
        },
        position: this.axisXPosition,
        showGrid: this.axisXShowGrid,
        showLabel: this.axisXShowLabel
      },
      axisY: {
        labelOffset: {
          x: this.axisYLabelOffsetX,
          y: this.axisYLabelOffsetY,
          offset: this.axisYOffset
        },
        position: this.axisYPosition,
        showGrid: this.axisYShowGrid,
        showLabel: this.axisYShowLabel,
        onlyInteger: this.axisYOnlyInteger,
        scaleMinSpace: this.axisYScaleMinSpace
      },
      showGridBackground: this.showGridBackground,
      chartPadding: {
        bottom: this.chartPaddingBottom,
        left: this.chartPaddingLeft,
        right: this.chartPaddingRight,
        top: this.chartPaddingTop
      }
    };
  }

  /**
   *
   * override this with type-specific options
   * @returns {object} options
   * @readonly
   * @memberof LrndesignChart
   */
  static get options() {
    return {
      reverseData: this.reverseData
    };
  }

  updated(changedProperties) {
    if(super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      /**
       * Fired when data source changes.
       *
       * @event data-source-changed
       * @param {string} dataSource data source of the chart
       *
       */
      if (propName === "dataSource")
        this.dispatchEvent(
          new CustomEvent("data-source-changed", {
            detail: this
          })
        );
      /**
       * Fired when raw data changes.
       *
       * @event raw-data-changed
       * @param {string} rawData raw CSV data for the chart which will be converted into an array
       *
       */
      if (propName === "rawData")
        this.dispatchEvent(
          new CustomEvent("raw-data-changed", {
            detail: this
          })
        );
      if(propName === "data" && this.data && this.data !== oldValue){
        this._renderTable();
        this.dispatchEvent(
          new CustomEvent("data-changed", {
            detail: this
          })
        );
      }
    });
  }
  /**
   * creates an accessible table based on data object
   * @memberof LrndesignChart
   */
  _renderTable(){
    let table = this.querySelector('table');
    if(table) table.remove();
    let html = '';
    table = document.createElement('table');
    if(this.data.labels) html += `<thead><tr>${(this.data.labels || []).map(label=>`<th scope="col">${label}</th>`).join('')}</tr></thead>`;
    if(this.data.series) html += `<tbody>
        ${this.data.series && Array.isArray(this.data.series[0]) 
          ? (this.data.series || []).map(row=>`<tr>${(row || []).map(col=>`<td>${col}</td>`).join('')}</tr>`).join('')
          : `<tr>${(this.data.series || []).map(col=>`<td>${col}</td>`).join('')}</tr>`
        }
      </tbody>`;
    table.innerHTML = html;
    this.appendChild(table);
    console.log('data-changed',this.data,this.querySelector('table'));
  }

  /**
   * refreshes the chart
   */
  makeChart() {
    let chart = this.shadowRoot.querySelector("#chart");
    if (chart) {
      chart.options = this._getOptions();
      /**
       * Fired when chart options change.
       *
       * @event options-changed
       * @param {object} chart options
       *
       */
      this.dispatchEvent(new CustomEvent("options-changed", { detail: this }));
      chart.makeChart();
      /**
       * Fired when chart changes.
       *
       * @event chart-changed
       *
       */
      this.dispatchEvent(new CustomEvent("chart-changed", { detail: this }));
    }
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
    this.axisYLabelOffsetX = 0;
    this.axisYLabelOffsetY = 0;
    this.axisYOffset = 30;
    this.axisYOnlyInteger = false;
    this.axisYPosition = "start";
    this.axisYScaleMinSpace = 20;
    this.axisYShowGrid = true;
    this.axisYshowLabel = true;
    this.axisYTopLeft = true;
    this.showGridBackground = false;
    this.chartPaddingBottom = 5;
    this.chartPaddingLeft = 10;
    this.chartPaddingRight = 15;
    this.chartPaddingTop = 15;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(LrndesignChart.tag, LrndesignChart);
export { LrndesignChart };
