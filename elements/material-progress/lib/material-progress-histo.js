import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { MaterialProgressBehavior } from "./material-progress-behavior.js";
class MaterialProgressHisto extends mixinBehaviors(
  [MaterialProgressBehavior],
  PolymerElement
) {
  static get template() {
    return html`
      <style>
        #barsContainer {
          @apply --layout-vertical;
          @apply --material-progress-histo-style;
        }
        :host > #barsContainer > ::content > * {
          height: 0px;
        }
        :host > #barsContainer > ::content > .bar {
          border-radius: calc(var(--material-progress-bar-height) / 2);
        }
        :host > #barsContainer > ::content > .bar.visible:not(.last) {
          margin-bottom: 12px;
        }
        :host > #barsContainer > ::content > .bar.visible {
          min-width: var(--material-progress-bar-height);
        }
        :host > #barsContainer > ::content > .bar:not(.visible) > * {
          visibility: hidden;
        }
        :host > #barsContainer > ::content > * > span {
          margin: 0 calc(var(--material-progress-bar-height) * 1 / 3);
        }
      </style>
      <div id="barsContainer">
        <slot id="content" name=".bar[data-value]">
          <span>test</span>
        </slot>
      </div>
      <div class="legend" hidden\$="[[_legendNeeded]]">
        <template is="dom-repeat" items="[[_legendItems]]" as="l">
          <span style\$="color: [[l.color]];">[[l.label]]</span>
        </template>
      </div>
    `;
  }
  static get tag() {
    return "material-progress-histo";
  }
  static get properties() {
    return {
      /**
       * Scales the bar relatively to the sum of all bars
       * instead of the maximum bar `data-value`.
       */
      scaleToSum: {
        type: Boolean,
        value: false,
        observer: "_refresh"
      }
    };
  }
  _getWidthForBar(barValue, barValuesSum, maxBarValue, barHeight) {
    var scaleBase = this.scaleToSum ? barValuesSum : maxBarValue;
    var width =
      (scaleBase > 0 ? Math.floor((barValue / scaleBase) * 10000) / 100 : "0") +
      "%";
    return width;
  }
}
window.customElements.define(MaterialProgressHisto.tag, MaterialProgressHisto);
export { MaterialProgressHisto };
