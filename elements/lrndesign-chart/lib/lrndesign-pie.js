/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { LrndesignChart } from "../lrndesign-chart.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `lrndesign-pie`
 * a pie chart
 *
 * @element lrndesign-pie
 * @extends LrndesignChart
 * @extends SimpleColors
 * @see ../lrndesign-chart.js
 * @demo ./demo/pie.html
 *
 */
class LrndesignPie extends LrndesignChart(SimpleColors) {
  constructor() {
    super();
    this.setProperties();
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * Padding of chart drawing area to container element and labels
       */
      chartPadding: {
        type: Number,
      },
      /**
       * Displays chart as donut instead of pie.
       */
      donut: {
        type: Boolean,
      },
      /**
       * Draw donut segments as shapes instead of strokes.
       */
      donutSolid: {
        type: Boolean,
      },
      /**
       * Donut stroke width, currently done in javascript.
       */
      donutWidth: {
        type: Number,
      },
      /**
       * Empty values will be ignored to avoid drawing
       * unncessary slices and labels
       */
      ignoreEmptyValues: {
        type: Boolean,
      },
      /**
       * Label direction can be 'neutral', 'explode' or 'implode'.
       * The labels anchor will be positioned based on those settings
       * as well as the fact if the labels are on the right or
       * left side of the center of the chart.
       * Usually explode is useful when labels are positioned
       * far away from the center.
       */
      labelDirection: {
        type: String,
      },
      /**
       * Label position offset from the standard position
       * which is half distance of the radius.
       * This value can be either positive or negative.
       * Positive values will position the label away from the center.
       */
      labelOffset: {
        type: Number,
      },
      /**
       * This option can be set to 'inside', 'outside' or 'center'.
       * Positioned with 'inside' the labels will be placed on half the distance
       * of the radius to the border of the Pie by respecting the 'labelOffset'.
       * The 'outside' option will place the labels at the border of the pie
       * and 'center' will place the labels in the absolute center point
       * of the chart. The 'center' option only makes sense
       * in conjunction with the 'labelOffset' option.
       */
      labelPosition: {
        type: String,
        attribute: "label-position",
        reflect: true,
      },
      /**
       * If a label should be shown.
       */
      showLabel: {
        type: Boolean,
      },
      /**
       *  Start angle of the pie chart in degrees where 0 points north.
       * A higher value offsets the start angle clockwise..
       */
      startAngle: {
        type: Number,
      },
      /**
       * Optional total you can specify. By specifying a total value,
       * the sum of the values in the series must be this total in order
       * to draw a full pie. You can use this parameter to draw only parts
       * of a pie or gauge charts.
       */
      total: {
        type: Number,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-pie";
  }

  // haxProperty definition
  static get haxProperties() {
    let haxProps = super.haxProperties,
      pieConfig = [
        {
          property: "donut",
          title: "Donut",
          inputMethod: "boolean",
        },
        {
          property: "showLabel",
          title: "Show Label",
          inputMethod: "boolean",
        },
        {
          property: "startAngle",
          title: "Start Angle",
          inputMethod: "number",
        },
        {
          property: "chartPadding",
          title: "Padding",
          inputMethod: "number",
        },
        {
          property: "total",
          title: "Total",
          description: `
            Optional total you can specify. By specifying a total value,
            the sum of the values in the series must be this total in order
            to draw a full pie. You can use this parameter to draw only parts
            of a pie or gauge charts.`,
          inputMethod: "number",
        },
        {
          property: "ignoreEmptyValues",
          title: "Ignore Empty Values",
          description: `
            Empty values will be ignored to avoid drawing 
            unncessary slices and labels.`,
          inputMethod: "boolean",
        },
      ],
      pieAdvanced = [
        {
          property: "donutWidth",
          title: "Donut Stroke Width",
          inputMethod: "number",
        },
        {
          property: "donutSolid",
          title: "Donut Solid",
          description: `Draw donut segments as shapes instead of strokes.`,
          inputMethod: "boolean",
        },
        {
          property: "labelDirection",
          title: "Label Direction",
          description: `Draw donut segments as shapes instead of strokes.`,
          inputMethod: "select",
          options: {
            neutral: "neutral",
            explode: "explode",
            implode: "implode",
          },
        },
        {
          property: "labelOffset",
          title: "Label Offset",
          description: `
            Label position offset from the standard position
            which is half distance of the radius.
            This value can be either positive or negative.
            Positive values will position the label away from the center.`,
          inputMethod: "number",
        },
        {
          property: "labelPosition",
          title: "Label Position",
          inputMethod: "select",
          options: {
            inside: "inside",
            outside: "outside",
            center: "center",
          },
        },
      ];
    haxProps.gizmo.title = "Pie Chart";
    haxProps.gizmo.icon = "editor:pie-chart";
    haxProps.settings.configure = haxProps.settings.configure.concat(pieConfig);
    haxProps.settings.advanced = haxProps.settings.advanced.concat(pieAdvanced);
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
      startAngle: this.startAngle,
      chartPadding: this.chartPadding,
      donut: this.donut,
      total: this.total,
      donutSolid: this.donutSolid,
      donutWidth: this.donutWidth,
      showLabel: this.showLabel,
      labelOffset: this.labelOffset,
      labelPosition: this.labelPosition,
      labelDirection: this.labelDirection,
      ignoreEmptyValues: this.ignoreEmptyValues,
    };
  }

  /**
   * Overrides default properties with pie-specific properties.
   */
  setProperties() {
    super.setProperties();
    this.scale = "ct-square";
    this.startAngle = 0;
    this.chartPadding = 5;
    this.donut = false;
    this.total = undefined;
    this.donutSolid = false;
    this.donutWidth = 20;
    this.showLabel = true;
    this.labelOffset = 0;
    this.labelPosition = "inside";
    this.labelDirection = "neutral";
    this.ignoreEmptyValues = false;
    this.type = "pie";
  }
}
window.customElements.define(LrndesignPie.tag, LrndesignPie);
export { LrndesignPie };
