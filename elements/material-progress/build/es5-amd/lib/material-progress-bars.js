define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./material-progress-behavior.js"
], function(_polymerLegacy) {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="material-progress-bars">\n  \n  <template>\n    <style>\n      #barsContainer {\n        overflow: hidden;\n        background-color: var(--material-progress-bars-background-color, #E0E0E0);\n        border-radius: calc(var(--material-progress-bar-height) / 2);\n        min-width: var(--material-progress-bar-height);\n        height: var(--material-progress-bar-height);\n        @apply --layout;\n        @apply --material-progress-bars-style;\n      }\n      :host > #barsContainer > ::content > .bar {\n        margin-left: calc(-var(--material-progress-bar-height) / 2);\n        border-radius: 0 calc(var(--material-progress-bar-height) / 2) calc(var(--material-progress-bar-height) / 2) 0;\n      }\n      :host([animated]) > #barsContainer > ::content > .entry {\n        -webkit-transition: width 850ms cubic-bezier(0.4, 0.0, 0.2, 1);\n        -ms-transition: width 850ms cubic-bezier(0.4, 0.0, 0.2, 1);\n        -moz-transition: width 850ms cubic-bezier(0.4, 0.0, 0.2, 1);\n        -o-transition: width 850ms cubic-bezier(0.4, 0.0, 0.2, 1);\n        transition: width 850ms cubic-bezier(0.4, 0.0, 0.2, 1);\n      }\n      :host > #barsContainer > ::content > * > span {\n        margin: 0 calc(var(--material-progress-bar-height) * 1/3) 0 calc(var(--material-progress-bar-height) * 5/6);\n      }\n    </style>\n    <div id="barsContainer">\n      <slot id="content" name=".bar[data-value]"></slot>\n    </div>\n    <div class="legend" hidden$="[[_legendNeeded]]">\n      <template is="dom-repeat" items="[[_legendItems]]" as="l">\n        <span style$="color: [[l.color]];">[[l.label]]</span>\n      </template>\n    </div>\n  </template>\n  \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "material-progress-bars",
    behaviors: [MaterialProgressBehavior],
    properties: { max: { type: Number, value: 100, observer: "_refresh" } },
    _getWidthForBar: function _getWidthForBar(
      barValue,
      barValuesSum,
      maxBarValue,
      barHeight
    ) {
      var realMax = Math.max(barValuesSum, this.max),
        width =
          (0 < realMax ? Math.floor(1e4 * (barValue / realMax)) / 100 : "0") +
          "%";
      return "calc(" + width + " + " + barHeight / 2 + "px" + ")";
    }
  });
});
