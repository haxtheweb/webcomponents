define(["../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js"], function(
  _polymerDom
) {
  "use strict";
  var _Mathmax = Math.max;
  window.MaterialProgressBehaviorImpl = {
    properties: {
      barHeight: { type: Number, value: 22, observer: "_refresh" },
      animated: { type: Boolean, value: !1, reflectToAttribute: !0 },
      legendLabel: { type: String, value: "", observer: "_refresh" },
      bars: {
        type: Array,
        value: function value() {
          return [];
        },
        notify: !0,
        readOnly: !0
      },
      sum: {
        type: Number,
        value: 0,
        notify: !0,
        readOnly: !0,
        reflectToAttribute: !0
      },
      _legendItems: {
        type: Array,
        value: function value() {
          return [];
        },
        readOnly: !0
      },
      _legendNeeded: {
        type: Boolean,
        value: !1,
        compute: "_computeLegendNeeded(_legendItems)",
        readOnly: !0
      }
    },
    listeners: { "dom-mutation": "refresh" },
    refresh: function refresh() {
      if (this._attached) {
        this._computeSumAndBars();
        var i,
          index,
          bar,
          barMeta,
          foundOneValue = !1,
          animationDelay = 600 / (this.bars.length - 1);
        this.splice("_legendItems", 0, this._legendItems.length);
        if (this.legendLabel) {
          this.push("_legendItems", { label: this.legendLabel });
        }
        if (this.bars) {
          for (
            i = this.bars.length - 1, index = this._barWithValueCount - 1;
            0 <= i;
            i--
          ) {
            bar = this.bars[i];
            barMeta = this._getBarMeta(bar);
            this.toggleClass("visible", 0 < barMeta.value, bar);
            this.toggleClass("last", 0 < barMeta.value && !foundOneValue, bar);
            bar.style.width =
              0 < this.bars.length
                ? this._getWidthForBar(
                    barMeta.value,
                    this.sum,
                    this._maxBarValue,
                    this.barHeight
                  )
                : "0px";
            bar.style.zIndex = this.bars.length - i;
            if (0 < barMeta.value) {
              foundOneValue = !0;
              if (!this._initialized) {
                this._playFirstAnimation(bar, index, animationDelay);
              }
              index--;
            }
            if (
              barMeta.legend &&
              (0 < barMeta.value || barMeta.legendAlwaysVisible)
            ) {
              this.splice("_legendItems", 1, 0, {
                label: barMeta.legend,
                color: window.getComputedStyle(bar).backgroundColor
              });
            }
          }
        }
        if (!this._oldBarHeight || this._oldBarHeight !== this.barHeight) {
          this.customStyle["--material-progress-bar-height"] =
            this.barHeight + "px";
          this.updateStyles();
          this._oldBarHeight = this.barHeight;
        }
        this._initialized = foundOneValue;
      }
    },
    ready: function ready() {
      this._mutationOptions = {
        childList: !0,
        subtree: !0,
        attributes: !0,
        characterData: !1,
        attributeFilter: [
          "data-value",
          "data-legend",
          "data-legend-always-visible"
        ]
      };
      this._mutationFilter = function(mutation) {
        return (
          this._mutationIsChildList(mutation, this.$.barsContainer) ||
          this._mutationIsChildAttributes(mutation, this.$.barsContainer)
        );
      };
    },
    attached: function attached() {
      this._attached = !0;
      this._refresh();
    },
    _refresh: function _refresh() {
      this.debounce("refresh", this.refresh, 10);
    },
    _computeSumAndBars: function _computeSumAndBars() {
      var sum = 0,
        value = 0,
        withValueCount = 0,
        max = 0,
        validBars = [],
        allChildren = (0, _polymerDom.dom)(
          this.$.content
        ).getDistributedNodes();
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
            withValueCount += 0 < value ? 1 : 0;
            max = _Mathmax(max, value);
          }
        }, this);
      }
      this._setBars(validBars);
      this._setSum(sum);
      this._maxBarValue = max;
      this._barWithValueCount = withValueCount;
      return sum;
    },
    _getBarMeta: function _getBarMeta(bar) {
      var meta = { value: 0, legend: void 0 },
        val;
      if (bar && bar.getAttribute) {
        val = +bar.getAttribute("data-value");
        meta.value = isNaN(val) ? 0 : _Mathmax(0, val);
        meta.legend = bar.getAttribute("data-legend");
        meta.legendAlwaysVisible = bar.hasAttribute(
          "data-legend-always-visible"
        );
      }
      return meta;
    },
    _getWidthForBar: function _getWidthForBar() {
      return "0px";
    },
    _playFirstAnimation: function _playFirstAnimation(
      node,
      index,
      animationDelay
    ) {
      this.toggleClass("entry", !0, node);
      (function(node, index, animationDelay) {
        this.async(function() {
          this.toggleClass("entry", !1, node);
        }, 500 + animationDelay * index);
      }.bind(this)(node, index, animationDelay));
    },
    _computeLegendNeeded: function _computeLegendNeeded(legendItems) {
      return legendItems && 0 < legendItems.length;
    }
  };
  window.MaterialProgressBehavior = [
    window.MaterialProgressBehaviorImpl,
    window.MutationObserverBehavior
  ];
});
