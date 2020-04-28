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
  
  //styles function
  static get styles() {
    return  [
      ...super.styles,
      css`
.ct-center-image {
  width: 100%;
  height: 100%;
  transform: translateX(25%) translateY(25%) scale(0.5);
  clip-path: circle(50% at 50% 50%); }

.ct-center-ellipse {
  fill: var(--chartist-bg-color, #fff); }
      `
    ];
  }

// render function
  render() {
    return html`

${super.render()}`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Progress Donut",
    "description": "Progression donut",
    "icon": "av:play-circle-filled",
    "color": "grey",
    "groups": ["Presentation", "Data"],
    "handles": [],
    "meta": {
      "author": "ELMS:LN"
    }
  },
  "settings": {
    "quick": [
      {
        "property": "animated",
        "title": "Animated",
        "description": "Whether progress animates on first load",
        "inputMethod": "boolean"
      },
      {
        "property": "complete",
        "title": "Complete",
        "description": "An array of completed values.",
        "inputMethod": "array",
        "properties": [
          {
            "title": "Number",
            "description": "Completed number.",
            "inputMethod": "number"
          }
        ]
      },
      {
        "property": "total",
        "title": "Total",
        "description": "Total when all items are complete.",
        "inputMethod": "number"
      },
      {
        "property": "startAngle",
        "title": "Start Angle",
        "description": "Donut angle where progress starts",
        "inputMethod": "number"
      }
    ],
    "configure": [
      {
        "property": "title",
        "title": "Title",
        "description": "The title of the element",
        "inputMethod": "textfield",
        "icon": "editor:title"
      },
      {
        "property": "desc",
        "title": "Description",
        "description": "Accessible long description",
        "inputMethod": "textfield"
      },
      {
        "property": "imageSrc",
        "title": "Image Source",
        "description": "Source of image inside donut.",
        "inputMethod": "haxupload",
        "icon": "link",
        "validationType": "url"
      },
      {
        "property": "imageAlt",
        "title": "Image Alt Text",
        "description": "Alt text for image.",
        "inputMethod": "alt"
      },
      {
        "property": "animated",
        "title": "Animated",
        "description": "Whether progress animates on first load",
        "inputMethod": "boolean"
      },
      {
        "property": "complete",
        "title": "Complete",
        "description": "An array of completed values.",
        "inputMethod": "array"
      },
      {
        "property": "total",
        "title": "Total",
        "description": "Total when all items are complete.",
        "inputMethod": "arrnumberay"
      },
      {
        "property": "startAngle",
        "title": "Start Angle",
        "description": "Donut angle where progress starts",
        "inputMethod": "number"
      }
    ],
    "advanced": []
  }
}
;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
  
  ...super.properties,
  
  /**
   * Timing for animation or -1 for false
   */
  "animation": {
    "type": Number,
    "attribute": "animation"
  },
  /**
   * Timing for animation or 0 none
   */
  "animationDelay": {
    "type": Number,
    "attribute": "animation-delay"
  },
  /**
   * An array of completed values
   */
  "complete": {
    "type": Array
  },
  /**
   * Accessible long description
   */
  "desc": {
    "type": String
  },
  /**
   * Source of image in the center of the object.
   */
  "imageSrc": {
    "attribute": "image-src",
    "type": String,
    "reflect": true
  },
  /**
   * Alt text for image.
   */
  "imageAlt": {
    "attribute": "image-alt",
    "type": String,
    "reflect": true
  }
}
;
  }

  constructor() {
    super();
    super.setProperties();
    this.animation = -1;
    this.animationDelay = 0;
    this.complete = [];
    this.desc = "";
    this.imageSrc = "";
    this.imageAlt = "";
    this.donut = false;
    this.showLabel = false;
    this.showTable = false;
    this.addEventListener("chartist-render-draw", this.addAnimation);
  }

  static get tag() {
    return "progress-donut";
  }
  /**
   * Called every time the element is removed from the DOM. Useful for
   * running clean up code (removing event listeners, etc.).
   */
  disconnectedCallback() {
    this.removeEventListener("chartist-render-draw", this.addAnimation);
    super.disconnectedCallback();
  }

  /**
   * Handles chart creation event.
   * @param {event} e create event
   */
  addAnimation(e) {
    let data = e && e.detail ? e.detail : undefined;
    if (this.animation > 0 && data && data.type && data.type === "slice") {
      var opacity = 1,
        val = data.value || this.donutTotal / this.donutData.length,
        dur = (this.animation * val) / this.donutTotal;
      data.element.attr({
        "c": opacity
      });
      var animationDefinition = {
        "opacity": {
          id: "anim" + data.index,
          dur: dur,
          from: -opacity,
          to: 1,
          fill: "freeze"
        }
      };
      if (data.index !== 0) {
        animationDefinition["opacity"].begin =
          "anim" + (data.index - 1) + ".end";
      } else {
        animationDefinition["opacity"].begin = this.animationDelay;
      }
      if (this.donutData.length > 0)
        animationDefinition["opacity"].easing =
          Chartist.Svg.Easing.easeOutQuint;
      data.element.attr({ "opacity": -opacity });
      data.element.animate(animationDefinition, false);
    }
    console.log(data,data.element._node.getTotalLength());
    if(data && data.index === this.complete.length -1 && this.chart) {
      data.group.append(new Chartist.Svg('ellipse', {
        cx: "50%",
        cy: "50%",
        rx: "32%",
        ry: "32%"
      }, 'ct-center-ellipse'));
      data.group.append(new Chartist.Svg('image', {
        href: this.imageSrc,
        alt: this.imageAlt
      }, 'ct-center-image'));
    }
  }
  get donutData() {
    return Array.isArray(this.complete)
      ? this.complete
      : JSON.parse(this.complete || "[]");
  }
  get donutLabels() {
    return this.donutData.map((h, i) => `Item ${i + 1}`);
  }
  get donutTotal() {
    return Math.max(this.donutData.reduce((sum, val) => sum + val), this.total);
  }
  get options() {
    return super.options;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "complete" && this.complete !== oldValue)
        this.data = [this.donutLabels, this.donutData];
    });
    super.updated(changedProperties);
  }
}
window.customElements.define(ProgressDonut.tag, ProgressDonut);
export { ProgressDonut };
