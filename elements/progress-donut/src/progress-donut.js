/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import { LrndesignPie } from "@lrnwebcomponents/lrndesign-chart/lib/lrndesign-pie.js";
/**
 * `progress-donut`
 * @element progress-donut
 * shows progress in as a rounded shape w/ hollow middle
 *
 * @extends LrndesignPie
 * @see @lrnwebcomponents/lrndesign-chart/lib/lrndesign-pie.js
 * @see @lrnwebcomponents/lrndesign-chart/lrndesign-chart.js
 * @see @lrnwebcomponents/chartist-render/chartist-render.js
 * @see @lrnwebcomponents/simple-colors/simple-colors.js
 *
 * @demo demo/index.html
 */
class ProgressDonut extends LrndesignPie {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  constructor() {
    super();
    super.setProperties();
    this.animation = -1;
    this.animationDelay = 0;
    this.complete = [];
    this.desc = "";
    this.imageSrc = "";
    this.imageAlt = "";
    this.donut = true;
    this.showLabel = false;
    /*this.donutWidth = "25%";
    this.chartPadding = 0;
    this.startAngle = 0;*/
    this.showTable = false;
    this.addEventListener('chartist-render-draw',this.addAnimation);
  }
  static get tag() {
    return "progress-donut";
  }
  /**
    * Called every time the element is removed from the DOM. Useful for 
    * running clean up code (removing event listeners, etc.).
    */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('chartist-render-draw',this.addAnimation);
  }

  /**
   * Handles chart creation event.
   * @param {event} e create event
   */
  addAnimation(e) {
    let data = e && e.detail ? e.detail : undefined;
    if (this.animation > 0 && data && data.type && data.type === "slice") {
      var pathLength = data.element._node.getTotalLength(),
        val = data.value || this.donutTotal/this.donutData.length, 
        dur = this.animation * val / this.donutTotal;
      data.element.attr({
        "stroke-dasharray": pathLength + "px " + pathLength + "px"
      });
      var animationDefinition = {
        "stroke-dashoffset": {
          id: "anim" + data.index,
          dur: dur,
          from: -pathLength + "px",
          to: "0px",
          fill: "freeze"
        }
      };
      if (data.index !== 0) {
        animationDefinition["stroke-dashoffset"].begin =
          "anim" + (data.index - 1) + ".end";
      } else {
        animationDefinition["stroke-dashoffset"].begin = this.animationDelay;
      }
      if(this.donutData.length > 0) animationDefinition["stroke-dashoffset"].easing = Chartist.Svg.Easing.easeOutQuint;
      data.element.attr({ "stroke-dashoffset": -pathLength + "px" });
      data.element.animate(animationDefinition, false);
    }
  }
  get donutData(){
    return Array.isArray(this.complete) ? this.complete : JSON.parse(this.complete || '[]')
  }
  get donutLabels(){
    return this.donutData.map((h,i)=>`Item ${i+1}`);
  }
  get donutTotal(){
    return Math.max(this.donutData.reduce((sum,val)=>sum+val),this.total);
  }
  get options(){
    return super.options;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "complete" && this.complete !== oldValue) this.data = [this.donutLabels,this.donutData];
    });
    super.updated(changedProperties);
  }
}
window.customElements.define(ProgressDonut.tag, ProgressDonut);
export { ProgressDonut };
