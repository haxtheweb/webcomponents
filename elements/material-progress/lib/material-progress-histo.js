import { Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./material-progress-behavior.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="material-progress-histo">
  
  <template>
    <style>
      #barsContainer {
        @apply(--layout-vertical);
        @apply(--material-progress-histo-style);
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
        margin: 0 calc(var(--material-progress-bar-height) * 1/3);
      }
    </style>
    <div id="barsContainer">
      <content id="content" selector=".bar[data-value]">
        <span>test</span>
      </content>
    </div>
    <div class="legend" hidden\$="[[_legendNeeded]]">
      <template is="dom-repeat" items="[[_legendItems]]" as="l">
        <span style\$="color: [[l.color]];">[[l.label]]</span>
      </template>
    </div>
  </template>
  
</dom-module>`;

document.head.appendChild($_documentContainer);
Polymer({
  is: "material-progress-histo",
  behaviors: [MaterialProgressBehavior],
  properties: {
    /**
     * Scales the bar relatively to the sum of all bars
     * instead of the maximum bar `data-value`.
     */
    scaleToSum: {
      type: Boolean,
      value: false,
      observer: "_refresh"
    }
  },
  _getWidthForBar: function(barValue, barValuesSum, maxBarValue, barHeight) {
    var scaleBase = this.scaleToSum ? barValuesSum : maxBarValue;
    var width =
      (scaleBase > 0 ? Math.floor((barValue / scaleBase) * 10000) / 100 : "0") +
      "%";
    return width;
  }
});
