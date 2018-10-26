define(["./node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  (0, _polymerLegacy.Polymer)({
    is: "paper-stepper",
    properties: {
      selected: { type: Number, notify: !0, value: 0 },
      progressBar: { type: Boolean, value: !1 },
      backLabel: { type: String, value: "Back" },
      nextLabel: { type: String, value: "Next" },
      disablePrevious: { type: Boolean, value: !1 },
      disableNext: { type: Boolean, value: !1 },
      noButtons: { type: Boolean, value: !1 }
    },
    _tapPrevious: function _tapPrevious() {
      this.$.selector.selectPrevious();
    },
    _tapNext: function _tapNext() {
      this.$.selector.selectNext();
    },
    _getDisablePrevious: function _getDisablePrevious(
      selected,
      disablePrevious
    ) {
      return 0 < selected && !disablePrevious;
    },
    _getDisableNext: function _getDisableNext(selected, nrItems, disableNext) {
      return selected < nrItems - 1 && !disableNext;
    },
    _computeProgressValue: function _computeProgressValue(selected) {
      return selected + 1;
    },
    _onItemsChanged: function _onItemsChanged() {
      this._items = this.$.selector.items;
    }
  });
});
