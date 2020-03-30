import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import "./material-progress-behavior.js";
class MaterialProgressBars extends mixinBehaviors(
  [MaterialProgressBehaviorImpl],
  PolymerElement
) {
  static get template() {
    return html`
      <style>
        #barsContainer {
          overflow: hidden;
          background-color: var(
            --material-progress-bars-background-color,
            #e0e0e0
          );
          border-radius: calc(var(--material-progress-bar-height) / 2);
          min-width: var(--material-progress-bar-height);
          height: var(--material-progress-bar-height);
          @apply --layout;
          @apply --material-progress-bars-style;
        }
        :host > #barsContainer > ::content > .bar {
          margin-left: calc(-var(--material-progress-bar-height) / 2);
          border-radius: 0 calc(var(--material-progress-bar-height) / 2)
            calc(var(--material-progress-bar-height) / 2) 0;
        }
        :host([animated]) > #barsContainer > ::content > .entry {
          -webkit-transition: width 850ms cubic-bezier(0.4, 0, 0.2, 1);
          -ms-transition: width 850ms cubic-bezier(0.4, 0, 0.2, 1);
          -moz-transition: width 850ms cubic-bezier(0.4, 0, 0.2, 1);
          -o-transition: width 850ms cubic-bezier(0.4, 0, 0.2, 1);
          transition: width 850ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        :host > #barsContainer > ::content > * > span {
          margin: 0 calc(var(--material-progress-bar-height) * 1 / 3) 0
            calc(var(--material-progress-bar-height) * 5 / 6);
        }
      </style>
      <div id="barsContainer">
        <slot id="content" name=".bar[data-value]"></slot>
      </div>
      <div class="legend" hidden\$="[[_legendNeeded]]">
        <template is="dom-repeat" items="[[_legendItems]]" as="l">
          <span style\$="color: [[l.color]];">[[l.label]]</span>
        </template>
      </div>
    `;
  }
  static get tag() {
    return "material-progress-bars";
  }
  static get properties() {
    return {
      /**
       * Maximum value represented by all progress bars.
       * Bars will be scaled according to their `data-value` attribute
       * and this maximum.
       * Note that, if the sum of all the bars' values are superior to this
       * `max`
       * @element max, it will override it.
       */
      max: {
        type: Number,
        value: 100,
        observer: "_refresh"
      }
    };
  }
  _getWidthForBar(barValue, barValuesSum, maxBarValue, barHeight) {
    var realMax = Math.max(barValuesSum, this.max),
      width =
        (realMax > 0 ? Math.floor((barValue / realMax) * 10000) / 100 : "0") +
        "%",
      negativeMargin = barHeight / 2;
    return "calc(" + width + " + " + negativeMargin + "px" + ")";
  }
}
window.customElements.define(MaterialProgressBars.tag, MaterialProgressBars);
export { MaterialProgressBars };
