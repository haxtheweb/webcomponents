import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "@polymer/polymer/lib/utils/async.js";

/**
 * `window.MaterialProgressBehavior` is the base behavior for all `material-progress`
 * elements.
 * @polymerBehavior window.MaterialProgressBehavior
 */
window.MaterialProgressBehaviorImpl = {
  properties: {
    /**
     * Height of the bar and bars, in pixels.
     */
    barHeight: {
      type: Number,
      value: 22,
      observer: "_refresh"
    },
    /**
     * Animate when the size of a bar changes.
     */
    animated: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * Label to display before the legend.
     */
    legendLabel: {
      type: String,
      value: "",
      observer: "_refresh"
    },
    /**
     * The displayed bar nodes (ie direct children with
     * the `bar` class and a `data-value` attribute).
     */
    bars: {
      type: Array,
      value: function() {
        return [];
      },
      notify: true,
      readOnly: true
    },
    /**
     * Sum of all the bars' values.
     */
    sum: {
      type: Number,
      value: 0,
      notify: true,
      readOnly: true,
      reflectToAttribute: true
    },
    /**
     * The legend items to be displayed: Each is composed of the following
     * attributes :
     * - `label`: match the `data-legend` attribute of the corresponding bar.
     * - `color`: match the css `background-color` of the corresponding bar.
     */
    _legendItems: {
      type: Array,
      value: function() {
        return [];
      },
      readOnly: true
    },
    /**
     * Indicates if the legend needs to be displayed.
     */
    _legendNeeded: {
      type: Boolean,
      value: false,
      compute: "_computeLegendNeeded(_legendItems)",
      readOnly: true
    }
  },

  listeners: {
    "dom-mutation": "refresh"
  },

  /**
   * Refresh the element.
   */
  refresh: function() {
    if (this._attached) {
      // Reading and computing fundamental data
      this._computeSumAndBars();
      var i,
        index,
        bar,
        barMeta,
        foundOneValue = false,
        animationDelay = 600 / (this.bars.length - 1);

      // Legend initialization
      this.splice("_legendItems", 0, this._legendItems.length);
      if (this.legendLabel) {
        this.push("_legendItems", { label: this.legendLabel });
      }

      // Computing each bar
      if (this.bars) {
        for (
          i = this.bars.length - 1, index = this._barWithValueCount - 1;
          i >= 0;
          i--
        ) {
          bar = this.bars[i];
          barMeta = this._getBarMeta(bar);
          // Sizing/Styling
          this.toggleClass("visible", barMeta.value > 0, bar);
          this.toggleClass("last", barMeta.value > 0 && !foundOneValue, bar);
          bar.style.width =
            this.bars.length > 0
              ? this._getWidthForBar(
                  barMeta.value,
                  this.sum,
                  this._maxBarValue,
                  this.barHeight
                )
              : "0px";
          bar.style.zIndex = this.bars.length - i;
          if (barMeta.value > 0) {
            foundOneValue = true;
            // Entry animation
            if (!this._initialized) {
              this._playFirstAnimation(bar, index, animationDelay);
            }
            index--;
          }
          // Legend shown if value > 0 or if forced
          if (
            barMeta.legend &&
            (barMeta.value > 0 || barMeta.legendAlwaysVisible)
          ) {
            this.splice("_legendItems", 1, 0, {
              label: barMeta.legend,
              color: window.getComputedStyle(bar).backgroundColor
            });
          }
        }
      }
      // Update Polymer's custom styles
      if (!this._oldBarHeight || this._oldBarHeight !== this.barHeight) {
        this.customStyle["--material-progress-bar-height"] =
          this.barHeight + "px";
        this.updateStyles();
        this._oldBarHeight = this.barHeight;
      }
      this._initialized = foundOneValue;
    }
  },
  ready: function() {
    // Setting up the mutation observer
    this._mutationOptions = {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: false,
      attributeFilter: [
        "data-value",
        "data-legend",
        "data-legend-always-visible"
      ]
    };
    this._mutationFilter = function(mutation) {
      // We only want to listen to mutations (addition, removal, attribute change)
      // of the direct children of the bar's container
      return (
        this._mutationIsChildList(mutation, this.$.barsContainer) ||
        this._mutationIsChildAttributes(mutation, this.$.barsContainer)
      );
    };
  },
  attached: function() {
    this._attached = true;
    this._refresh();
  },
  _refresh: function() {
    this.debounce("refresh", this.refresh, 10);
  },
  _computeSumAndBars: function() {
    var sum = 0,
      value = 0,
      withValueCount = 0,
      max = 0,
      validBars = [],
      allChildren = dom(this.$.content).getDistributedNodes();
    if (allChildren) {
      allChildren.forEach(function(child) {
        if (
          child.classList &&
          child.classList.contains("bar") &&
          child.hasAttribute("data-value")
        ) {
          validBars.push(child);
          value = this._getBarMeta(child).value;
          sum += value;
          withValueCount += value > 0 ? 1 : 0;
          max = Math.max(max, value);
        }
      }, this);
    }
    this._setBars(validBars);
    this._setSum(sum);
    this._maxBarValue = max;
    this._barWithValueCount = withValueCount;
    return sum;
  },
  _getBarMeta: function(bar) {
    var meta = { value: 0, legend: undefined },
      val;
    if (bar && bar.getAttribute) {
      val = Number(bar.getAttribute("data-value"));
      meta.value = isNaN(val) ? 0 : Math.max(0, val);
      meta.legend = bar.getAttribute("data-legend");
      meta.legendAlwaysVisible = bar.hasAttribute("data-legend-always-visible");
    }
    return meta;
  },
  _getWidthForBar: function(barValue, barValuesSum, maxBarValue, barHeight) {
    // To implement
    return "0px";
  },
  _playFirstAnimation: function(node, index, animationDelay) {
    this.toggleClass("entry", true, node);
    (node, index, animationDelay) => {
      async.microTask.run(() => {
        this.toggleClass("entry", false, node);
      }, 500 + animationDelay * index);
    };
  },
  _computeLegendNeeded: function(legendItems) {
    return legendItems && legendItems.length > 0;
  }
};

/** @polymerBehavior */
window.MaterialProgressBehavior = [window.MaterialProgressBehaviorImpl];
