define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./material-progress-behavior.js"
], function(_polymerLegacy, _materialProgressBehavior) {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="material-progress-histo">\n  \n  <template>\n    <style>\n      #barsContainer {\n        @apply --layout-vertical;\n        @apply --material-progress-histo-style;\n      }\n      :host > #barsContainer > ::content > * {\n        height: 0px;\n      }\n      :host > #barsContainer > ::content > .bar {\n        border-radius: calc(var(--material-progress-bar-height) / 2);\n      }\n      :host > #barsContainer > ::content > .bar.visible:not(.last) {\n        margin-bottom: 12px;\n      }\n      :host > #barsContainer > ::content > .bar.visible {\n        min-width: var(--material-progress-bar-height);\n      }\n      :host > #barsContainer > ::content > .bar:not(.visible) > * {\n        visibility: hidden;\n      }\n      :host > #barsContainer > ::content > * > span {\n        margin: 0 calc(var(--material-progress-bar-height) * 1/3);\n      }\n    </style>\n    <div id="barsContainer">\n      <slot id="content" name=".bar[data-value]">\n        <span>test</span>\n      </slot>\n    </div>\n    <div class="legend" hidden$="[[_legendNeeded]]">\n      <template is="dom-repeat" items="[[_legendItems]]" as="l">\n        <span style$="color: [[l.color]];">[[l.label]]</span>\n      </template>\n    </div>\n  </template>\n  \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "material-progress-histo",
    behaviors: [MaterialProgressBehavior],
    properties: {
      scaleToSum: { type: Boolean, value: !1, observer: "_refresh" }
    },
    _getWidthForBar: function _getWidthForBar(
      barValue,
      barValuesSum,
      maxBarValue,
      barHeight
    ) {
      var scaleBase = this.scaleToSum ? barValuesSum : maxBarValue,
        width =
          (0 < scaleBase
            ? Math.floor(1e4 * (barValue / scaleBase)) / 100
            : "0") + "%";
      return width;
    }
  });
});
