import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
Polymer({
  is: "paper-search-bar",
  properties: {
    query: { type: String, notify: !0, value: "" },
    hideFilterButton: { type: Boolean, value: !1 },
    disableFilterButton: { type: Boolean, value: !1 },
    nrSelectedFilters: { type: Number, value: 0 },
    icon: { type: String, value: "search" },
    placeholder: { type: String, value: "Search" }
  },
  behaviors: [IronA11yKeysBehavior],
  keyBindings: { enter: "_search" },
  focus: function() {
    this.$.input.focus();
  },
  _filter: function() {
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
