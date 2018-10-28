import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
Polymer({
  is: "paper-search-bar",

  /**
   * Fired when the user requests to open the filtering dialog
   *
   * @event paper-search-filter
   */
  /**
   * Fired when the user requests to search for a query
   *
   * @event paper-search-search
   */
  /**
   * Fired when the user taps the clear icon
   *
   * @event paper-search-clear
   */

  properties: {
    /**
     * Text for which the user is searching
     */
    query: {
      type: String,
      notify: true,
      value: ""
    },
    /**
     * Whether to hide the Filter button. Set attribute "hide-filter-button" to do so.
     */
    hideFilterButton: {
      type: Boolean,
      value: false
    },
    /**
     * Whether to disable the Filter button. Set attribute "disable-filter-button" to do so.
     */
    disableFilterButton: {
      type: Boolean,
      value: false
    },
    /**
     * Number of filters the user has been selected (shown in the badge) (optional)
     */
    nrSelectedFilters: {
      type: Number,
      value: 0
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
    }
  },

  behaviors: [IronA11yKeysBehavior],

  keyBindings: {
    enter: "_search"
  },

  focus: function() {
    this.$.input.focus();
  },

  // Private methods
  _filter: function(e) {
    this.fire("paper-search-filter");
  },
  _clear: function() {
    this.query = "";
    this.$.input.focus();
    this.fire("paper-search-clear");
  },
  _search: function() {
    this.fire("paper-search-search");
  }
});
