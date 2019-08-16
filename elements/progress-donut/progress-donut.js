/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/chartist-render/chartist-render.js";
/**
 * `progress-donut`
 * `Showing progression in a circle shape w/ hollow middle`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 *  -
 */
class ProgressDonut extends SchemaBehaviors(PolymerElement) {
  constructor() {
    super();
    afterNextRender(this, function() {
      this.HAXWiring = new HAXWiring();
      this.HAXWiring.setup(
        ProgressDonut.haxProperties,
        ProgressDonut.tag,
        this
      );
    });
  }
  static get template() {
    return html`
      <style include="simple-colors-shared-styles">
        :host {
          background-color: var(--simple-colors-background1, #ffffff);
          overflow: visible;
          display: block;
        }
        :host #wrapper {
          margin: 0 auto;
          position: relative;
        }
        :host #wrapper > * {
          position: absolute;
        }
        :host #wrapper #chart {
          left: 0;
          top: 0;
        }
        :host #wrapper,
        :host #wrapper #chart {
          width: 250px;
          height: 250px;
        }
        :host([size="xs"]) #wrapper,
        :host([size="xs"]) #wrapper #chart {
          width: 150px;
          height: 150px;
        }
        :host([size="sm"]) #wrapper,
        :host([size="sm"]) #wrapper #chart {
          width: 200px;
          height: 200px;
        }
        :host([size="lg"]) #wrapper,
        :host([size="lg"]) #wrapper #chart {
          width: 300px;
          height: 300px;
        }
        :host([size="xl"]) #wrapper,
        :host([size="xl"]) #wrapper #chart {
          width: 400px;
          height: 400px;
        }
        :host #wrapper > #image {
          left: 20%;
          top: 20%;
          width: 60%;
          height: 60%;
          -webkit-clip-path: circle(50% at 50% 50%);
          clip-path: circle(50% at 50% 50%);
        }
      </style>
      <div id="wrapper">
        <img
          id="image"
          alt\$="[[imageAlt]]"
          aria-hidden="true"
          hidden\$="[[!imageSrc]]"
          src\$="[[imageSrc]]"
          style\$="[[imageStyle]]"
        />
        <chartist-render
          id="chart"
          data\$="[[data]]"
          chart-desc\$="[[desc]]"
          chart-title="[[title]]"
          scale="ct-square"
          options\$="[[options]]"
          title\$="[[title]]"
          type="pie"
        >
        </chartist-render>
      </div>
    `;
  }

  static get tag() {
    return "progress-donut";
  }
  static get properties() {
    let props = {
      /**
       * An array of completed values
       */
      complete: {
        type: Array,
        value: []
      },
      /**
       * The thickness of the donut from 0-100
       */
      donutThickness: {
        type: Number
      },
      /**
       * An array of hex codes to use as colors for each section.
       * If null, colors are determined by accentColor & dark properties
       */
      colors: {
        type: Array,
        value: null
      },
      /**
       * An array of data for the donut chart
       */
      data: {
        type: Array,
        computed: "_getData(complete)"
      },
      /**
       * Accessible long description
       */
      desc: {
        type: String,
        value: null
      },
      /**
       * An array of data for the donut chart
       */
      options: {
        type: Array,
        computed: "_getOptions(complete,total,size,colors,accentColor,dark)"
      },
      /**
       * The source of the image in the center of the object.
       */
      imageSrc: {
        type: String,
        value: null,
        reflectToAttribute: true
      },
      /**
       * The alt text for the image.
       */
      imageAlt: {
        type: String,
        value: null,
        reflectToAttribute: true
      },
      /**
       * The style for the image based on the size of the donut
       */
      imageStyle: {
        type: String,
        computed: "_getImageStyle(size)"
      },
      /**
       * The size of the progress-donut: sx, sm, md, lg, or xl. Default is md
       */
      size: {
        type: String,
        value: "md",
        reflectToAttribute: true
      },
      /**
       * Title
       */
      title: {
        type: String
      },
      /**
       * a selected accent-color: grey, red, pink, purple, etc.
       */
      accentColor: {
        type: String,
        value: "grey",
        reflectToAttribute: true
      },
      /**
       * An array of incomplete values
       */
      total: {
        type: Number,
        value: 100
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Sample gizmo",
        description: "The user will be able to see this for selection in a UI.",
        icon: "av:play-circle-filled",
        color: "grey",
        groups: ["Video", "Media"],
        handles: [
          {
            type: "video",
            url: "source"
          }
        ],
        meta: {
          author: "Your organization on github"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("chartist-render-draw", this._onCreated.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener(
      "chartist-render-draw",
      this._onCreated.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * Makes chart and returns the chart object.
   */
  _getData(complete) {
    return { series: complete };
  }

  /**
   * Makes chart and returns the chart object.
   */
  _getImageStyle(size) {
    let offset = "22%",
      diameter = "56%";
    if (this.size === "xs") {
      offset = "32%";
      diameter = "36%";
    } else if (this.size === "sm") {
      offset = "26%";
      diameter = "48%";
    } else if (this.size === "lg") {
      offset = "20%";
      diameter = "60%";
    } else if (this.size === "xl") {
      offset = "17%";
      diameter = "66%";
    }
    return (
      "left: " +
      offset +
      "; top: " +
      offset +
      "; width: " +
      diameter +
      "; height: " +
      diameter +
      ";"
    );
  }

  /**
   * Makes chart and returns the chart object.
   */
  _getOptions(complete, total, size, colors, accentColor, dark) {
    let sum = 0;
    for (let i = 0; i < complete.length; i++) {
      sum += parseFloat(complete[i]);
    }
    return {
      donut: true,
      showLabel: false,
      startAngle: 0,
      total: Math.max(sum, total)
    };
  }

  /**
   * Handles chart creation event.
   */
  _onCreated(e) {
    this.__chart = e.detail;
    this.makeChart(this.__chart);
  }

  /**
   * Makes chart and returns the chart object.
   */
  makeChart(chart) {
    if (chart !== undefined) {
      let colors = this.colors,
        strokeWidth = "10%",
        hex = SimpleColors.colors,
        accent =
          this.accentColor !== null
            ? this.accentColor.replace(/-([a-z])/g, function(g) {
                return g[1].toUpperCase();
              })
            : null;
      if (colors === undefined || colors === null || colors.length === 0) {
        if (accent !== null && hex[accent] !== null) {
          colors = this.dark
            ? [
                hex[accent][9],
                hex[accent][6],
                hex[accent][3],
                hex[accent][7],
                hex[accent][4]
              ]
            : [
                hex[accent][0],
                hex[accent][3],
                hex[accent][5],
                hex[accent][2],
                hex[accent][4]
              ];
        } else {
          colors = this.dark
            ? [
                hex.orange[6],
                hex.pink[4],
                hex.purple[5],
                hex.cyan[6],
                hex.lime[5]
              ]
            : [
                hex.pink[5],
                hex.deepPurple[4],
                hex.blue[3],
                hex.teal[4],
                hex.yellow[5]
              ];
        }
      }

      if (this.size === "xs") {
        strokeWidth = "8%";
      } else if (this.size === "sm") {
        strokeWidth = "9%";
      } else if (this.size === "lg") {
        strokeWidth = "11%";
      } else if (this.size === "xl") {
        strokeWidth = "12%";
      }
      // From chartist.js docs:
      chart.on("draw", function(data) {
        data.element._node.style.strokeWidth = strokeWidth;
        data.element._node.style.stroke = colors[data.index % colors.length];
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
      return chart;
    }
  }
}
window.customElements.define(ProgressDonut.tag, ProgressDonut);
export { ProgressDonut };
