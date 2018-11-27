define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js"
], function(_polymerLegacy, _ironA11yKeys) {
  "use strict";
  (0, _polymerLegacy.Polymer)({
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
    focus: function focus() {
      this.$.input.focus();
    },
    _filter: function _filter(e) {
      this.fire("paper-search-filter");
    },
    _clear: function _clear() {
      this.query = "";
      this.$.input.focus();
      this.fire("paper-search-clear");
    },
    _search: function _search() {
      this.fire("paper-search-search");
    }
  });
});
