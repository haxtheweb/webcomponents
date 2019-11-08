/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/chartist-render/chartist-render.js";
/**
 * `progress-donut`
 * shows progress in as a rounded shape w/ hollow middle
 *
 * @customElement
 * @demo demo/index.html
 */
class ProgressDonut extends SchemaBehaviors(SimpleColors) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  constructor() {
    super();
    this.animated = false;
    this.accentColor = "grey";
    this.dark = false;
    this.complete = [];
    this.desc = "";
    this.title = "";
    this.imageSrc = "";
    this.imageAlt = "";
    this.total = 100;
  }
  static get tag() {
    return "progress-donut";
  }

  updated(changedProperties) {
    //console.log('changedProperties',changedProperties,this);
    /*changedProperties.forEach((oldValue, propName) => {
    });*/
    this.makeChart();
  }

  /**
   * Handles chart creation event.
   */
  _onCreated(e) {
    if (this.animated)
      e.detail.on("draw", function(data) {
        if (data.type === "slice") {
          var pathLength = data.element._node.getTotalLength();
          data.element.attr({
            "stroke-dasharray": pathLength + "px " + pathLength + "px"
          });
          var animationDefinition = {
            "stroke-dashoffset": {
              id: "anim" + data.index,
              dur: 500,
              from: -pathLength + "px",
              to: "0px",
              easing: Chartist.Svg.Easing.easeOutQuint,
              fill: "freeze"
            }
          };
          if (data.index !== 0) {
            animationDefinition["stroke-dashoffset"].begin =
              "anim" + (data.index - 1) + ".end";
          }
          data.element.attr({ "stroke-dashoffset": -pathLength + "px" });
          data.element.animate(animationDefinition, false);
        }
      });
  }

  /**
   *refreshes the chart
   *
   * @memberof LrndesignChartBehaviors
   */
  makeChart() {
    let sum = 0,
      chart = this.shadowRoot.querySelector("#chart");
    for (let i = 0; i < this.complete.length; i++) {
      sum += parseFloat(this.complete[i]);
    }
    if (chart) {
      chart.data = { series: this.complete };
      chart.options = {
        donut: true,
        donutWidth: "25%",
        chartPadding: 0,
        showLabel: false,
        startAngle: 0,
        total: Math.max(sum, this.total)
      };
      this.dispatchEvent(new CustomEvent("options-changed", { detail: this }));
      chart.makeChart();
    }
    this.dispatchEvent(new CustomEvent("chart-changed", { detail: this }));
    return chart;
  }
}
window.customElements.define(ProgressDonut.tag, ProgressDonut);
export { ProgressDonut };
