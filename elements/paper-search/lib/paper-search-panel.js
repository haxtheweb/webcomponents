import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./paper-search-bar.js";
import "./paper-filter-dialog.js";

class PaperSearchPanel extends PolymerElement {
  static get tag() {
    return "paper-search-panel";
  }

  /**
   * Fired when the user changes the parameter defining the currently shown items
   *
   * @event change-request-params
   */
  /**
   * Fired when the user requests to search for a query
   *
   * @event search
   */

  static get properties() {
    return {
      /**
       * Query for which the user was searching
       */
      search: {
        type: String,
        observer: "_onChangeRequest",
        notify: true
      },
      /**
       * All filters from which the user can choose
       */
      filters: Object,
      /**
       * All filters that have been selected by the user, e.g. `{ age: [ "child", "teen" ] }`
       */
      selectedFilters: {
        type: Object,
        observer: "_onChangeRequest",
        notify: true,
        value: {}
      },
      /**
       * Items that are currently shown in the lister
       */
      items: Array,
      /**
       * True if further items could be loaded
       */
      hasMore: {
        type: Boolean,
        value: false
      },

      /**
       * True if items are currently loaded
       */
      loading: {
        type: Boolean,
        value: false
      },

      /**
       * Whether to hide the Filter button. Set attribute "hide-filter-button" to do so.
       */
      hideFilterButton: {
        type: Boolean,
        value: false
      },

      /**
       * Number of items loaded per page (i.e. for each click on [more])
       */
      count: {
        type: Number,
        notify: true,
        value: 20
      },
      /**
       * Icon shown in the search background
       */
      icon: {
        type: String,
        value: "search"
      },
      /**
       * Text shown in the search box if the user didn't enter any query
       */
      placeholder: {
        type: String,
        value: "Search"
      },

      /**
       * Text shown if no results are found. Use this property to localize the element.
       */
      noResultsText: {
        type: String,
        value: "No matching results found."
      },

      /**
       * Text for the more button to load more data. Use this property to localize the element.
       */
      moreButton: {
        type: String,
        value: "More"
      },

      /**
       * Text for the reset button in the filter dialog. Use this property to localize the element.
       */
      resetButton: String,

      /**
       * Text for the save button in the filter dialog. Use this property to localize the element.
       */
      saveButton: String,

      /**
       * Label shown if no values are selected for a filter. Use this property to localize the element.
       */
      noValuesLabel: String,

      _hasItems: {
        type: Boolean,
        computed: "_computeHasItems(items)",
        value: false
      }
    };
  }

  getPaperSearchBarInstance() {
    return this.shadowRoot.querySelector("#paperSearchBar");
  }

  // Private methods
  _loadMore() {
    this.count += 20;
    this._updateData();
  }
  _computeHasItems(items) {
    return typeof items !== "undefined" && items.length > 0;
  }
  _showNoResults(_hasItems, loading) {
    return !_hasItems && !loading;
  }
  _onChangeRequest(newValue, oldValue) {
    // Ignore initial setting of properties (caller is supposed to trigger this call automatically)
    if (typeof oldValue !== "undefined") {
      // Set back to default to avoid endless listers
      this.count = 20;
      this._updateData();
    }
  }
  _updateData() {
    this.dispatchEvent(
      new CustomEvent("change-request-params", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true
      })
    );
  }
  _onFilter() {
    this.shadowRoot.querySelector("#filterDialog").open();
  }
  _onSearch() {
    this.dispatchEvent(
      new CustomEvent("search", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true
      })
    );
  }
  // Counts the selected filters
  _getNrSelectedFilters(selectedFilters) {
    if (Object.keys(selectedFilters).length <= 0) {
      return 0;
    }

    var nrSelectedFilters = Object.keys(selectedFilters)
      .map(function(key) {
        // Returns number of selected value for a filter
        return selectedFilters[key].length;
      })
      .reduce(function(sum, value) {
        // Sum up the selected values across filters
        return sum + value;
      });

    return nrSelectedFilters;
  }

  _disableFilterButton(filters) {
    return !(filters && filters.length > 0);
  }
}
window.customElements.define(PaperSearchPanel.tag, PaperSearchPanel);
export { PaperSearchPanel };
