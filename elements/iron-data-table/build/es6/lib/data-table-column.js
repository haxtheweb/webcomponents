import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "./data-table-column-filter.js";
Polymer({
  _template: html`
    <template id="header">
      <data-table-column-filter label="[[column.name]]" value="{{column.filterValue}}" hidden\$="[[!column.filterBy]]"></data-table-column-filter>
      <div hidden\$="[[column.filterBy]]">[[column.name]]</div>
    </template>
`,
  is: "data-table-column",
  properties: {
    alignRight: { type: Boolean, value: !1 },
    name: { type: String, value: "" },
    filterBy: String,
    filterValue: String,
    width: { type: String, value: "100px" },
    flex: { type: Number, value: 1 },
    hidden: { type: Boolean, value: !1 },
    order: { type: Number, notify: !0 },
    sortBy: { type: String },
    table: Object,
    headerTemplate: {
      type: Object,
      readOnly: !0,
      value: function() {
        var custom = dom(this).querySelector("template[is=header]");
        if (custom && custom.parentElement) {
          var column = custom.parentElement;
          custom._rootDataHost =
            column.dataHost._rootDataHost || column.dataHost;
          return custom;
        }
        return dom(this.root).querySelector("#header");
      }
    },
    template: {
      type: Object,
      readOnly: !0,
      value: function() {
        var template = dom(this).querySelector("template:not([is=header])");
        if (template) {
          if (this.dataHost) {
            template._rootDataHost =
              this.dataHost._rootDataHost || this.dataHost;
          }
          return template;
        }
      }
    }
  },
  observers: [
    "_alignRightChanged(table, alignRight)",
    "_filterValueChanged(table, filterValue, filterBy)",
    "_filterByChanged(table, filterBy)",
    "_flexChanged(table, flex)",
    "_headerTemplateChanged(table, headerTemplate)",
    "_hiddenChanged(table, hidden)",
    "_nameChanged(table, name)",
    "_orderChanged(table, order)",
    "_sortByChanged(table, sortBy)",
    "_templateChanged(table, template)",
    "_widthChanged(table, width)"
  ],
  _notifyTable: function(table, path, value) {
    if (table.columns) {
      var index = table.columns.indexOf(this);
      table.notifyPath("columns." + index + "." + path, value);
    }
  },
  _alignRightChanged: function(table, alignRight) {
    this._notifyTable(table, "alignRight", alignRight);
  },
  _nameChanged: function(table, name) {
    this._notifyTable(table, "name", name);
  },
  _sortByChanged: function(table, sortBy) {
    this._notifyTable(table, "sortBy", sortBy);
  },
  _flexChanged: function(table, flex) {
    this._notifyTable(table, "flex", flex);
  },
  _headerTemplateChanged: function(table, headerTemplate) {
    this._notifyTable(table, "headerTemplate", headerTemplate);
  },
  _hiddenChanged: function(table, hidden) {
    this._notifyTable(table, "hidden", hidden);
  },
  _orderChanged: function(table, order) {
    this._notifyTable(table, "order", order);
  },
  _templateChanged: function(table, template) {
    this._notifyTable(table, "template", template);
  },
  _widthChanged: function(table, width) {
    this._notifyTable(table, "width", width);
  },
  _filterByChanged: function(table, filterBy) {
    this._notifyTable(table, "filterBy", filterBy);
  },
  _filterValueChanged: function(table, filterValue, filterBy) {
    this._notifyTable(table, "filterValue", filterValue);
    this.fire("column-filter-changed", {
      value: filterValue,
      filterBy: filterBy
    });
  }
});
