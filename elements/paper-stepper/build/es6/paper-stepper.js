import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
let PaperStepper = Polymer({
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
  _tapPrevious: function() {
    this.$.selector.selectPrevious();
  },
  _tapNext: function() {
    this.$.selector.selectNext();
  },
  _getDisablePrevious: function(selected, disablePrevious) {
    return 0 < selected && !disablePrevious;
  },
  _getDisableNext: function(selected, nrItems, disableNext) {
    return selected < nrItems - 1 && !disableNext;
  },
  _computeProgressValue: function(selected, items) {
    return selected + 1;
  },
  _onItemsChanged: function(e) {
    this._items = this.$.selector.items;
  }
});
export { PaperStepper };
