/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { LrndesignChart } from "../lrndesign-chart.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";

/**
 * `lrndesign-line`
 * a line chart
 *
 * @element lrndesign-line
 * @extends LrndesignChart
 * @extends SimpleColors
 * @see ../lrndesign-chart.js
 * @demo ./demo/line.html
 *
 */
class LrndesignLine extends LrndesignChart(SimpleColors) {
  constructor() {
    super();
    this.setProperties();
  }

  static get properties() {
    return {
      ...super.properties,
      ...super.lineBarProperties,
      /**
       * The base for the area chart that will be used
       * to close the area shape (is normally 0).
       */
      areaBase: {
        attribute: "area-base",
        type: Number,
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
        type: Boolean,
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
        type: Boolean,
      },
      /**
       * If the line chart should draw an area.
       */
      showArea: {
        attribute: "show-area",
        type: Boolean,
      },
      /**
       * If the line should be drawn or not.
       */
      showLine: {
        attribute: "show-line",
        type: Boolean,
      },
      /**
       * If the line should be drawn or not.
       */
      showPoint: {
        attribute: "show-point",
        type: Boolean,
      },
      /**
       * Optional point labels
       */
      showPointLabels: {
        attribute: "show-point-labels",
        type: Boolean,
      },
      /**
       * Optional anchor for point labels
       */
      pointLabelsAnchor: {
        attribute: "point-labels-anchor",
        type: String,
      },
      /**
       * Optional x-offset for point labels
       */
      pointLabelsOffsetX: {
        attribute: "point-labels-offset-x",
        type: Number,
      },
      /**
       * Optional y-offset for point labels
       */
      pointLabelsOffsetY: {
        attribute: "point-labels-offset-y",
        type: Number,
      },
      /**
       * Optional interpolation function for point labels
       */
      pointLabelFunction: {},
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-line";
  }

  // haxProperty definition
  static get haxProperties() {
    let haxProps = super.haxProperties,
      lineBar = super.lineBarHaxProperties,
      lineConfig = [
        {
          property: "showArea",
          title: "Show Area",
          inputMethod: "boolean",
        },
        {
          property: "showLine",
          title: "Show Link",
          inputMethod: "boolean",
        },
        {
          property: "showPoint",
          title: "Show Point",
          inputMethod: "boolean",
        },
        {
          property: "fullWidth",
          title: "Full Width",
          inputMethod: "boolean",
        },
        {
          property: "showPointLabels",
          title: "Show Point Labels",
          inputMethod: "boolean",
        },
      ],
      lineAdvanced = [
        {
          property: "pointLabelsAnchor",
          title: "Show Point Labels",
          inputMethod: "select",
          options: {
            middle: "Middle",
            start: "Start",
            end: "End",
          },
        },
        {
          property: "pointLabelsOffsetX",
          title: "Point Labels X-Offset",
          inputMethod: "number",
        },
        {
          property: "pointLabelsOffsetY",
          title: "Point Labels Y-Offset",
          inputMethod: "number",
        },
        {
          property: "lineSmooth",
          title: "Line Smooth",
          inputMethod: "boolean",
        },
        {
          property: "areaBase",
          title: "Area Base",
          description: `
            The base for the area chart that will be used
            to close the area shape (is normally 0).
          `,
          inputMethod: "number",
        },
      ];
    haxProps.gizmo.title = "Link Chart";
    haxProps.gizmo.icon = "editor:show-chart";
    haxProps.settings.configure = haxProps.settings.configure.concat(
      lineBar.gridBackground,
      lineConfig,
      lineBar.padding,
    );
    haxProps.settings.advanced = haxProps.settings.advanced.concat(
      lineBar.minMax,
      lineAdvanced,
      lineBar.xAxis,
      lineBar.yAxis,
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
      areaBase: this.areaBase,
      fullWidth: this.fullWidth,
      lineSmooth: this.lineSmooth,
      showArea: this.showArea,
      showLine: this.showLine,
      showPoint: this.showPoint,
    };
  }

  /**
   * gets axis title options
   * @readonly
   */
  get pointLabels() {
    return this.showPointLabels
      ? {
          labelOffset: {
            x: this.pointLabelsOffsetX,
            y: this.pointLabelsOffsetY,
          },
          textAnchor: ["start", "end", "middle"].includes(
            this.pointLabelsAnchor,
          )
            ? this.pointLabelsAnchor
            : "middle",
          labelInterpolationFnc: this.pointLabelFunction || undefined,
        }
      : undefined;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        (propName === "showPointLabels" ||
          propName.indexOf("pointLabel") > -1) &&
        propName !== "pluginPointLabels" &&
        this[propName] !== oldValue
      ) {
        this.pluginPointLabels = this.pointLabels;
      }
    });
    if (super.updated) super.updated(changedProperties);
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
    this.showPointLabels = false;
    this.pointLabelsAnchor = "middle";
    this.pointLabelsOffsetX = 0;
    this.pointLabelsOffsetY = -10;
    this.type = "line";
  }
}
/**
 * life cycle, element is removed from the DOM
 */
//disconnectedCallback() {}
globalThis.customElements.define(LrndesignLine.tag, LrndesignLine);
export { LrndesignLine };
