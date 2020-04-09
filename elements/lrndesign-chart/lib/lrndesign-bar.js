/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { LrndesignChart } from "../lrndesign-chart.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";

/**
 * `lrndesign-bar`
 * a bar chart
 *
 * @element lrndesign-bar
 * @extends LrndesignChart
 * @extends SimpleColors
 * @see ../lrndesign-chart.js
 * @demo ./demo/bar.html
 *
 */
class LrndesignBar extends LrndesignChart(SimpleColors) {
  constructor() {
    super();
    this.setProperties();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      ...super.lineBarProperties,
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
        type: Boolean
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-bar";
  }

  // haxProperty definition
  static get haxProperties() {
    let haxProps = super.haxProperties,
      lineBar = super.lineBarHaxProperties,
      barQuick = [
        {
          property: "horizontalBars",
          title: "Horizontal Bars",
          description: `
            Inverts the axes of the bar chart in order to draw
            a horizontal bar chart. Be aware that you also need
            to invert your axis settings as the Y Axis will now display
            the labels and the X Axis the values.`,
          inputMethod: "boolean"
        },
        {
          property: "stackBars",
          title: "Stck Bars",
          description: `
            If set to true this property will cause the series bars
            to be stacked.`,
          inputMethod: "boolean"
        },
        {
          property: "distributeSeries",
          title: "Distribute Series",
          description: `
            If set to true then each bar will represent a series and
            the data array is expected to be a one dimensional array
            of data values rather than a series array of series.`,
          inputMethod: "boolean"
        }
      ],
      barX = [
        {
          property: "axisXScaleMinSpace",
          title: "X-Axis Scale Minimum Space",
          description: "Specifies minimum height in pixel of scale steps.",
          inputMethod: "number"
        },
        {
          property: "axisXOnlyInteger",
          title: "X-Axis Scale (only integers)",
          description:
            "Use only integer values (whole numbers) for the scale steps.",
          inputMethod: "boolean"
        }
      ],
      barY = [
        {
          property: "referenceValue",
          title: "Reference Value",
          description: `
            Unless low/high are explicitly set, bar chart will be
            centered at zero by default.`,
          inputMethod: "number"
        },
        {
          property: "seriesBarDistance",
          title: "Series Bar Distance",
          description: `Specify the distance in pixel of bars in a group.`,
          inputMethod: "number"
        },
        {
          property: "stackMode",
          title: "Stack Mode",
          description: `
            If set to "true" this property will form a total
            for each series point. This will also influence
            the y-axis and the overall bounds of the chart.
            If set to "false" this property will force
            the stacked bars to draw from the zero line.
            In stacked mode the "seriesBarDistance" property will have no effect.`,
          inputMethod: "boolean"
        }
      ];
    haxProps.gizmo.title = "Bar Chart";
    haxProps.gizmo.icon = "editor:insert-chart";
    haxProps.settings.quick = haxProps.settings.quick.concat(
      lineBar.gridBackground,
      barQuick
    );
    haxProps.settings.configure = haxProps.settings.configure.concat(
      lineBar.gridBackground,
      barQuick,
      lineBar.padding
    );
    haxProps.settings.advanced = haxProps.settings.advanced.concat(
      lineBar.minMax,
      lineBar.xAxis,
      barX,
      lineBar.yAxis,
      barY
    );
    return haxProps;
  }

  /**
   * gets options as an array
   * @returns {array} options
   * @readonly
   * @memberof LrndesignChart
   */
  get options() {
    return {
      ...super.options,
      ...this.lineBarOptions,
      axisX: {
        onlyInteger: this.axisXOnlyInteger,
        scaleMinSpace: this.axisXScaleMinSpace
      },
      distributeSeries: this.distributeSeries,
      horizontalBars: this.horizontalBars,
      referenceValue: this.referenceValue,
      seriesBarDistance: this.seriesBarDistance,
      stackBars: this.stackBars,
      stackMode: this.stackMode
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
}
/**
 * life cycle, element is removed from the DOM
 */
//disconnectedCallback() {}
window.customElements.define(LrndesignBar.tag, LrndesignBar);
export { LrndesignBar };
