define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  (0, _polymerLegacy.Polymer)({
    is: "paper-icon-stepper",
    properties: {
      selectedValues: { type: Array, notify: !0, value: [] },
      _selected: { type: Number, value: -1 }
    },
    previous: function previous() {
      if (0 > this._selected) {
        return;
      }
      var index = this.selectedValues.indexOf(this._selected);
      this.splice("selectedValues", index, 1);
      this._selected--;
    },
    next: function next() {
      if (this._selected === this._items.length - 1) {
        return;
      }
      if (0 <= this._selected) {
        this._selected++;
      } else if (0 >= this.selectedValues.length) {
        this._selected = 0;
      } else {
        this._selected = this.selectedValues[this.selectedValues.length]++;
      }
      this.push("selectedValues", this._selected);
    },
    clear: function clear() {
      this.selectedValues = [];
      this._selected = -1;
    },
    _onItemsChanged: function _onItemsChanged() {
      this._items = this.$.selector.items;
    }
  });
});
