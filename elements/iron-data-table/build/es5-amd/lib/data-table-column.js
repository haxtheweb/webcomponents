define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./data-table-column-filter.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  function _templateObject_d386c800db1211e8bf630bf889a443ae() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <template id="header">\n      <data-table-column-filter label="[[column.name]]" value="{{column.filterValue}}" hidden$="[[!column.filterBy]]"></data-table-column-filter>\n      <div hidden$="[[column.filterBy]]">[[column.name]]</div>\n    </template>\n'
      ],
      [
        '\n    <template id="header">\n      <data-table-column-filter label="[[column.name]]" value="{{column.filterValue}}" hidden\\$="[[!column.filterBy]]"></data-table-column-filter>\n      <div hidden\\$="[[column.filterBy]]">[[column.name]]</div>\n    </template>\n'
      ]
    );
    _templateObject_d386c800db1211e8bf630bf889a443ae = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d386c800db1211e8bf630bf889a443ae()
    ),
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
        value: function value() {
          var custom = (0, _polymerDom.dom)(this).querySelector(
            "template[is=header]"
          );
          if (custom && custom.parentElement) {
            var column = custom.parentElement;
            custom._rootDataHost =
              column.dataHost._rootDataHost || column.dataHost;
            return custom;
          }
          return (0, _polymerDom.dom)(this.root).querySelector("#header");
        }
      },
      template: {
        type: Object,
        readOnly: !0,
        value: function value() {
          var template = (0, _polymerDom.dom)(this).querySelector(
            "template:not([is=header])"
          );
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
    _notifyTable: function _notifyTable(table, path, value) {
      if (table.columns) {
        var index = table.columns.indexOf(this);
        table.notifyPath("columns." + index + "." + path, value);
      }
    },
    _alignRightChanged: function _alignRightChanged(table, alignRight) {
      this._notifyTable(table, "alignRight", alignRight);
    },
    _nameChanged: function _nameChanged(table, name) {
      this._notifyTable(table, "name", name);
    },
    _sortByChanged: function _sortByChanged(table, sortBy) {
      this._notifyTable(table, "sortBy", sortBy);
    },
    _flexChanged: function _flexChanged(table, flex) {
      this._notifyTable(table, "flex", flex);
    },
    _headerTemplateChanged: function _headerTemplateChanged(
      table,
      headerTemplate
    ) {
      this._notifyTable(table, "headerTemplate", headerTemplate);
    },
    _hiddenChanged: function _hiddenChanged(table, hidden) {
      this._notifyTable(table, "hidden", hidden);
    },
    _orderChanged: function _orderChanged(table, order) {
      this._notifyTable(table, "order", order);
    },
    _templateChanged: function _templateChanged(table, template) {
      this._notifyTable(table, "template", template);
    },
    _widthChanged: function _widthChanged(table, width) {
      this._notifyTable(table, "width", width);
    },
    _filterByChanged: function _filterByChanged(table, filterBy) {
      this._notifyTable(table, "filterBy", filterBy);
    },
    _filterValueChanged: function _filterValueChanged(
      table,
      filterValue,
      filterBy
    ) {
      this._notifyTable(table, "filterValue", filterValue);
      this.fire("column-filter-changed", {
        value: filterValue,
        filterBy: filterBy
      });
    }
  });
});
