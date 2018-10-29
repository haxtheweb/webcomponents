import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
Polymer({
  is: "paper-filter-dialog",
  properties: {
    filters: Array,
    selectedFilters: { type: Object, notify: !0, value: {} },
    resetButton: { type: String, value: "Reset" },
    saveButton: { type: String, value: "Save filters" },
    noValuesLabel: { type: String, value: "No filters yet" },
    _selectedFilters: { type: Object, value: {} },
    _selectedFilter: Object,
    _selectedFilterValues: { type: Array, value: [] }
  },
  open: function() {
    dom(document.body).appendChild(this);
    setTimeout(
      function() {
        this.$.dialog.open();
        this._selectedFilters = Object.assign({}, this.selectedFilters);
      }.bind(this),
      1
    );
  },
  close: function() {
    this.$.dialog.close();
  },
  _tapSelectFilter: function(e) {
    this.$.selector.select(e.model.filter);
    this._preselectFilterValues();
  },
  _preselectFilterValues: function() {
    var selectedValueIds = this._selectedFilters[this._selectedFilter.id],
      isSelected = function(value) {
        return !!selectedValueIds && 0 <= selectedValueIds.indexOf(value.id);
      };
    this._selectedFilterValues = this._selectedFilter.values.map(function(
      value
    ) {
      return Object.assign({}, value, { selected: isSelected(value) });
    });
  },
  _tapReset: function() {
    this._selectedFilters = {};
  },
  _tapApply: function() {
    this.selectedFilters = this._selectedFilters;
    this.fire("save");
  },
  _tapSelectValues: function() {
    const selectedValues = this._selectedFilterValues
      .filter(function(value) {
        return value.selected;
      })
      .map(function(value) {
        return value.id;
      });
    this._selectedFilters = Object.assign({}, this._selectedFilters, {
      [this._selectedFilter.id]: selectedValues
    });
    this.$.selector.deselect(this._selectedFilter);
  },
  _hasSelectedFilters: function(selectedFilters) {
    for (selectedFilter in selectedFilters) {
      if (0 < selectedFilters[selectedFilter].length) {
        return !0;
      }
    }
    return !1;
  },
  _getSelectedValuesNames: function(filter, _selectedFilters) {
    var selectedValueIds = _selectedFilters[filter.id];
    if (!filter.values || !selectedValueIds) {
      return this.noValuesLabel;
    }
    var names = filter.values
      .filter(function(value) {
        return 0 <= selectedValueIds.indexOf(value.id);
      })
      .map(function(value) {
        return value.name;
      });
    return 0 < names.length ? names.join(", ") : this.noValuesLabel;
  }
});
