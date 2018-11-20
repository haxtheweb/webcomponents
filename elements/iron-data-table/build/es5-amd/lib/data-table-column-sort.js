define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./data-table-icons.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_d31ee190ecf111e8afe6e3e72f732a1f() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        margin: 4px;\n      }\n\n      :host([hidden]) {\n        display: none;\n      }\n\n      paper-icon-button {\n        position: relative;\n        opacity: .84;\n        transition: all .2s;\n      }\n\n      paper-icon-button:hover,\n      paper-icon-button[focused] {\n        color: var(--default-primary-color);\n      }\n\n      paper-icon-button:not([direction]) {\n        opacity: .16;\n      }\n\n      paper-icon-button[direction=\'desc\'] {\n        transform: rotate(-180deg);\n      }\n\n      paper-icon-button[hidden] {\n        display: none;\n      }\n\n      .order {\n        font-size: 9px;\n        font-weight: bold;\n        position: absolute;\n        right: 4px;\n        bottom: 8px;\n      }\n    </style>\n\n    <div style="position: relative">\n      <paper-icon-button id="sortIcon" on-tap="_sort" icon="data-table:arrow-upward" direction$="[[direction]]">\n      </paper-icon-button>\n      <div class="order">[[order]]</div>\n    </div>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        margin: 4px;\n      }\n\n      :host([hidden]) {\n        display: none;\n      }\n\n      paper-icon-button {\n        position: relative;\n        opacity: .84;\n        transition: all .2s;\n      }\n\n      paper-icon-button:hover,\n      paper-icon-button[focused] {\n        color: var(--default-primary-color);\n      }\n\n      paper-icon-button:not([direction]) {\n        opacity: .16;\n      }\n\n      paper-icon-button[direction=\'desc\'] {\n        transform: rotate(-180deg);\n      }\n\n      paper-icon-button[hidden] {\n        display: none;\n      }\n\n      .order {\n        font-size: 9px;\n        font-weight: bold;\n        position: absolute;\n        right: 4px;\n        bottom: 8px;\n      }\n    </style>\n\n    <div style="position: relative">\n      <paper-icon-button id="sortIcon" on-tap="_sort" icon="data-table:arrow-upward" direction\\$="[[direction]]">\n      </paper-icon-button>\n      <div class="order">[[order]]</div>\n    </div>\n'
      ]
    );
    _templateObject_d31ee190ecf111e8afe6e3e72f732a1f = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d31ee190ecf111e8afe6e3e72f732a1f()
    ),
    is: "data-table-column-sort",
    properties: {
      direction: { type: String, notify: !0 },
      path: String,
      order: {
        type: Number,
        computed: "_order(path, sortOrder, sortOrder.length)"
      },
      sortOrder: Array
    },
    observers: ["_sortOrderChanged(sortOrder.*)"],
    _order: function _order(path, sortOrder, length) {
      if (1 >= length) {
        return "";
      }
      for (var i = 0; i < length; i++) {
        if (sortOrder[i].path === path) {
          return i + 1;
        }
      }
    },
    _sortOrderChanged: function _sortOrderChanged(sortOrder) {
      if (sortOrder.base) {
        sortOrder.base.forEach(
          function(sort) {
            if (sort.path === this.path) {
              this.direction = sort.direction;
            }
          }.bind(this)
        );
      }
    },
    _sort: function _sort() {
      switch (this.direction) {
        case "asc":
          this.direction = "desc";
          break;
        case "desc":
          this.direction = null;
          break;
        default:
          this.direction = "asc";
          break;
      }
      this.fire("sort-direction-changed", {
        path: this.path,
        direction: this.direction
      });
    }
  });
});
