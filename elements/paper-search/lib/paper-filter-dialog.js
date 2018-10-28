import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";

Polymer({
  is: "paper-filter-dialog",

  /**
   * Fired when the user requests to save the filter selection
   *
   * @event save
   */

  properties: {
    /**
     * All filters from which the user can choose
     */
    filters: Array,
    /**
     * All filters that have been selected by the user, e.g. `{ age: [ "child", "teen" ] }`
     */
    selectedFilters: {
      type: Object,
      notify: true,
      value: {}
    },

    /**
     * Text for the reset button. Use this property to localize the element.
     */
    resetButton: {
      type: String,
      value: "Reset"
    },

    /**
     * Text for the save button. Use this property to localize the element.
     */
    saveButton: {
      type: String,
      value: "Save filters"
    },

    /**
     * Label shown if no values are selected for a filter. Use this property to localize the element.
     */
    noValuesLabel: {
      type: String,
      value: "No filters yet"
    },

    /**
     * Internal copy that is changed. Copied back to original variable only once the user clicks on [Apply]
     */
    _selectedFilters: {
      type: Object,
      value: {}
    },
    _selectedFilter: Object,
    _selectedFilterValues: {
      type: Array,
      value: []
    }
  },

  // Public methods
  /**
   * Opens the filter dialog
   */
  open: function() {
    // Attach dialog to the body to ensure it's on top of all existing overlays
    // XXX - Known issue: this generates addEventListener errors from a11y
    dom(document.body).appendChild(this);

    // Wait until dialog is added to the DOM (required for Safari)
    setTimeout(
      function() {
        this.$.dialog.open();

        // Clone selected filters, so it can be changed without touching the external property
        this._selectedFilters = Object.assign({}, this.selectedFilters);
      }.bind(this),
      1
    );
  },

  close: function() {
    this.$.dialog.close();
  },

  /**
   * Handles if the user taps on a filter
   */
  _tapSelectFilter: function(e) {
    this.$.selector.select(e.model.filter);

    this._preselectFilterValues();
  },

  /**
   * Separate function for unit testing
   */
  _preselectFilterValues: function() {
    // Check all values that are selected
    var selectedValueIds = this._selectedFilters[this._selectedFilter.id];
    var isSelected = function(value) {
      return (
        Boolean(selectedValueIds) && selectedValueIds.indexOf(value.id) >= 0
      );
    };
    this._selectedFilterValues = this._selectedFilter.values.map(function(
      value
    ) {
      return Object.assign({}, value, {
        selected: isSelected(value)
      });
    });
  },
  _tapReset: function(e) {
    this._selectedFilters = {};
  },
  _tapApply: function(e) {
    this.selectedFilters = this._selectedFilters;

    this.fire("save");
  },
  _tapSelectValues: function(e) {
    // Captured IDs of the selected items
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

  /**
   * True if any filter was set
   * @param  {[type]} selectedFilters  [description]
   * @return {[type]}                   [description]
   */
  _hasSelectedFilters: function(selectedFilters) {
    // Iterate until we find a filter that is selected
    for (selectedFilter in selectedFilters) {
      if (selectedFilters[selectedFilter].length > 0) {
        return true;
      }
    }

    return false;
  },
  // Returns the concated names of the selected values for a specific filter
  _getSelectedValuesNames: function(filter, _selectedFilters) {
    var selectedValueIds = _selectedFilters[filter.id];
    if (!filter.values || !selectedValueIds) {
      return this.noValuesLabel;
    }

    // Capture names of all selected values
    var names = filter.values
      .filter(function(value) {
        // Only consider values that are selected
        return selectedValueIds.indexOf(value.id) >= 0;
      })
      .map(function(value) {
        // Capture name of the selected value
        return value.name;
      });

    return names.length > 0 ? names.join(", ") : this.noValuesLabel;
  }
});
