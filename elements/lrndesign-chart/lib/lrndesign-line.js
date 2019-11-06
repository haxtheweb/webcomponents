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
    return Object.assign(super.properties, super.lineBarProperties, {
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
    let haxProps = super.haxProperties,
      lineBar = super.lineBarHaxProperties,
      lineQuick = [
        {
          property: "showArea",
          title: "Show Area",
          inputMethod: "boolean"
        },
        {
          property: "showLine",
          title: "Show Link",
          inputMethod: "boolean"
        },
        {
          property: "showPoint",
          title: "Show Point",
          inputMethod: "boolean"
        },
        {
          property: "fullWidth",
          title: "Full Width",
          inputMethod: "boolean"
        }
      ],
      lineAdvanced = [
        {
          property: "lineSmooth",
          title: "Line Smooth",
          inputMethod: "boolean"
        },
        {
          property: "areaBase",
          title: "Area Base",
          description: `
            The base for the area chart that will be used
            to close the area shape (is normally 0).
          `,
          inputMethod: "number"
        }
      ];
    haxProps.gizmo.title = "Link Chart";
    haxProps.gizmo.icon = "editor:show-chart";
    haxProps.settings.quick = haxProps.settings.quick.concat(
      lineBar.gridBackground,
      lineQuick
    );
    haxProps.settings.configure = haxProps.settings.configure.concat(
      lineBar.gridBackground,
      lineQuick,
      lineBar.padding
    );
    haxProps.settings.advanced = haxProps.settings.configure.advanced(
      lineBar.minMax,
      lineAdvanced,
      lineBar.xAxis,
      lineBar.yAxis
    );
    return haxProps;
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
    let options = super._getOptions(),
      lineBar = Object.assign(options, this._getLineBarOptions());
    lineBar.areaBase = this.areaBase;
    lineBar.fullWidth = this.fullWidth;
    lineBar.lineSmooth = this.lineSmooth;
    lineBar.showArea = this.showArea;
    lineBar.showLine = this.showLine;
    lineBar.showPoint = this.showPoint;
    return lineBar;
  }
}
/**
 * life cycle, element is removed from the DOM
 */
//disconnectedCallback() {}
window.customElements.define(LrndesignLine.tag, LrndesignLine);
export { LrndesignLine };
