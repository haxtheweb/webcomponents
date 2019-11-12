/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-styles/paper-styles.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
/**
 * `circle-progress`
 * `Polymer-based web component displaying a circular progress bar.`
 *
 * @demo demo/index.html
 */
class CircleProgress extends mixinBehaviors(
  [IronResizableBehavior],
  PolymerElement
) {
  static get template() {
    return html`
      <style include="paper-material-styles">
        :host {
          @apply --layout-vertical;
          @apply --layout-center-center;
          position: relative;
          width: var(--circle-progress-width, 64px);
          height: var(--circle-progress-height, 64px);
          margin: 24px;
          border-radius: 50%;
        }
        svg {
          position: absolute;
          top: 0;
          left: 0;
          display: none;
        }
        .circle-background {
          stroke: var(--circle-progress-bg-stroke-color, --paper-grey-100);
        }
        .circle-foreground {
          transition: stroke-dashoffset var(--circle-progress-transition, 150ms);
          stroke: var(--circle-progress-stroke-color, blue);
          stroke-linecap: var(--circle-progress-stroke-linecap, round);
        }
      </style>

      <svg id="circle" width="100%" height="100%">
        <circle
          class="circle-background"
          r\$="[[_radius]]"
          cx\$="[[_cx]]"
          cy\$="[[_cy]]"
          fill="transparent"
          stroke-width\$="[[strokeWidth]]"
        ></circle>
        <circle
          class="circle-foreground"
          r\$="[[_radius]]"
          cx\$="[[_cx]]"
          cy\$="[[_cy]]"
          fill="transparent"
          stroke-width\$="[[strokeWidth]]"
          stroke-dasharray\$="[[_dasharray]]"
          stroke-dashoffset\$="[[_dashoffset]]"
          transform\$="[[_transform]]"
        ></circle>
      </svg>
      <slot></slot>
    `;
  }

  static get tag() {
    return "circle-progress";
  }

  static get properties() {
    return {
      ...super.properties,

      /**
       * Value of circular progress bar.
       */
      value: {
        name: "value",
        type: Number,
        value: 0
      },

      /**
       * Maximum of value.
       */
      max: {
        name: "max",
        type: Number,
        value: 100
      },

      /**
       * Stroke width of circle.
       */
      strokeWidth: {
        name: "strokeWidth",
        type: Number,
        value: 4
      },

      /**
       * Starting angle of the progress.
       */
      angle: {
        name: "angle",
        type: Number,
        value: -90
      },

      _cx: {
        name: "_cx",
        type: Number,
        value: null
      },

      _cy: {
        name: "_cy",
        type: Number,
        value: null
      },

      _radius: {
        name: "_radius",
        type: Number,
        computed: "_computeRadius(_cx, _cy, strokeWidth)"
      },

      _transform: {
        name: "_transform",
        type: String,
        computed: "_computeTransform(angle, _cx, _cy)"
      },

      _dasharray: {
        name: "_dasharray",
        type: Number,
        computed: "_computeDashArray(_radius)"
      },

      _dashoffset: {
        name: "_dashoffset",
        type: Number,
        computed: "_computeDashOffset(value, max, _dasharray)"
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("iron-resize", this._onIronResize.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("iron-resize", this._onIronResize.bind(this));
    super.disconnectedCallback();
  }

  _computeDashArray(radius) {
    return 2 * Math.PI * radius;
  }

  _computeDashOffset(value, max, dasharray) {
    return (1 - value / max) * dasharray;
  }

  _computeRadius(cx, cy, strokeWidth) {
    return cx && cy ? Math.max(0, Math.min(cx, cy) - strokeWidth / 2) : 0;
  }

  _computeTransform(angle, cx, cy) {
    return cx && cy ? "rotate(" + angle + ", " + cx + ", " + cy + ")" : "";
  }

  _onIronResize() {
    if (this.offsetWidth && this.offsetHeight) {
      this._cx = this.offsetWidth / 2;
      this._cy = this.offsetHeight / 2;
      this.shadowRoot.querySelector("#circle").style.display = "block";
    }
  }
}
window.customElements.define(CircleProgress.tag, CircleProgress);
export { CircleProgress };
