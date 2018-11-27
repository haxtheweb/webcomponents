import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "./material-progress-behavior.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="material-progress-bars">
  
  <template>
    <style>
      #barsContainer {
        overflow: hidden;
        background-color: var(--material-progress-bars-background-color, #E0E0E0);
        border-radius: calc(var(--material-progress-bar-height) / 2);
        min-width: var(--material-progress-bar-height);
        height: var(--material-progress-bar-height);
        @apply --layout;
        @apply --material-progress-bars-style;
      }
      :host > #barsContainer > ::content > .bar {
        margin-left: calc(-var(--material-progress-bar-height) / 2);
        border-radius: 0 calc(var(--material-progress-bar-height) / 2) calc(var(--material-progress-bar-height) / 2) 0;
      }
      :host([animated]) > #barsContainer > ::content > .entry {
        -webkit-transition: width 850ms cubic-bezier(0.4, 0.0, 0.2, 1);
        -ms-transition: width 850ms cubic-bezier(0.4, 0.0, 0.2, 1);
        -moz-transition: width 850ms cubic-bezier(0.4, 0.0, 0.2, 1);
        -o-transition: width 850ms cubic-bezier(0.4, 0.0, 0.2, 1);
        transition: width 850ms cubic-bezier(0.4, 0.0, 0.2, 1);
      }
      :host > #barsContainer > ::content > * > span {
        margin: 0 calc(var(--material-progress-bar-height) * 1/3) 0 calc(var(--material-progress-bar-height) * 5/6);
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
  </template>
  
</dom-module>`;
document.head.appendChild($_documentContainer);
Polymer({
  is: "material-progress-bars",
  behaviors: [MaterialProgressBehavior],
  properties: { max: { type: Number, value: 100, observer: "_refresh" } },
  _getWidthForBar: function(barValue, barValuesSum, maxBarValue, barHeight) {
    var realMax = Math.max(barValuesSum, this.max),
      width =
        (0 < realMax ? Math.floor(1e4 * (barValue / realMax)) / 100 : "0") +
        "%",
      negativeMargin = barHeight / 2;
    return "calc(" + width + " + " + negativeMargin + "px" + ")";
  }
});
