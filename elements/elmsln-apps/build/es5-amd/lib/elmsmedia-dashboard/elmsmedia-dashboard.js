define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/app-route/app-route.js",
  "../../node_modules/@polymer/app-route/app-location.js",
  "../../node_modules/@polymer/paper-dialog/paper-dialog.js",
  "../../node_modules/@polymer/paper-button/paper-button.js",
  "../../node_modules/@lrnwebcomponents/hax-body/lib/hax-app.js",
  "./elmsmedia-dashboard-filters.js",
  "./elmsmedia-dashboard-toolbar-filters.js",
  "./elmsmedia-dashboard-toolbar-button.js"
], function(
  _exports,
  _polymerLegacy,
  _appRoute,
  _appLocation,
  _paperDialog,
  _paperButton,
  _haxApp,
  _elmsmediaDashboardFilters,
  _elmsmediaDashboardToolbarFilters,
  _elmsmediaDashboardToolbarButton
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.ElmsmediaDashboard = void 0;
  function _templateObject_4ffd5ae0f76d11e89310d7f0fbc64afe() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      paper-dialog {\n        padding: 1em;\n      }\n      #toolbar {\n        display: flex;\n        justify-content: flex-end;\n        align-items: center;\n      }\n    </style>\n\n    <app-location route="{{route}}"></app-location>\n    <app-route\n      route="{{route}}"\n      pattern="/:page"\n      data="{{data}}"\n      tail="{{tail}}"\n      query-params="{{queryParams}}"\n    ></app-route>\n\n    <div id="toolbar">\n      <elmsmedia-dashboard-toolbar-filters\n        filters="[[queryParams]]"\n      ></elmsmedia-dashboard-toolbar-filters>\n      <elmsmedia-dashboard-toolbar-button\n        icon="filter-list"\n        title="Filter"\n        on-click="toggleFilters"\n      ></elmsmedia-dashboard-toolbar-button>\n      <elmsmedia-dashboard-toolbar-button\n        icon="search"\n        title="Search"\n        on-click="toggleSearch"\n      ></elmsmedia-dashboard-toolbar-button>\n    </div>\n\n    <paper-dialog id="filterDialog" with-backdrop="">\n      <h3>Filter Media</h3>\n      <elmsmedia-dashboard-filters\n        form="{{queryParams}}"\n        on-filter-changed="_filterChanged"\n      ></elmsmedia-dashboard-filters>\n      <div class="buttons">\n        <paper-button dialog-dismiss="">Dismiss dialog</paper-button>\n      </div>\n    </paper-dialog>\n\n    <hax-app\n      id="haxSource"\n      auto=""\n      query-param="title"\n      request-end-point="[[requestEndPoint]]"\n      request-params="{{queryParams}}"\n      data="{\n      &quot;root&quot;: &quot;list&quot;,\n      &quot;gizmoType&quot;: &quot;video&quot;,\n      &quot;url&quot;: &quot;http://media.elmsln.local/entity_iframe/node/&quot;,\n      &quot;id&quot;: &quot;id&quot;,\n      &quot;title&quot;: &quot;attributes.title&quot;,\n      &quot;description&quot;: &quot;attributes.body&quot;,\n      &quot;image&quot;: &quot;display.image&quot;,\n      &quot;customGizmoType&quot;: &quot;type&quot;}"\n    ></hax-app>\n  '
    ]);
    _templateObject_4ffd5ae0f76d11e89310d7f0fbc64afe = function _templateObject_4ffd5ae0f76d11e89310d7f0fbc64afe() {
      return data;
    };
    return data;
  }
  var ElmsmediaDashboard = (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_4ffd5ae0f76d11e89310d7f0fbc64afe()
    ),
    is: "elmsmedia-dashboard",
    properties: {
      requestEndPoint: { type: String, value: "" },
      queryParams: { type: Object, value: {} }
    },
    _computeRequestEndPoint: function _computeRequestEndPoint(
      endPoint,
      csrfToken
    ) {
      return "".concat(endPoint, "/api/data?token=").concat(csrfToken);
    },
    _filterChanged: function _filterChanged(e) {
      var newParams = Object.assign({}, e.detail);
      newParams = this._cleanParams(newParams);
      this.set("queryParams", {});
      this.set("queryParams", newParams);
    },
    _cleanParams: function _cleanParams(params) {
      var newParams = {};
      for (x in params) {
        var prop = x,
          value = params[x];
        if ("" === value || null === value || value === void 0) {
        } else {
          newParams[prop] = value;
        }
      }
      return newParams;
    },
    toggleSearch: function toggleSearch(e) {
      var searchEnabled = this.$.haxSource.search;
      this.$.haxSource.search = !searchEnabled;
    },
    toggleFilters: function toggleFilters(e) {
      this.$.filterDialog.toggle();
    },
    removeFilter: function removeFilter(path, propValue) {
      var currentParams = Object.assign({}, this.queryParams),
        currentValue = _.get(currentParams, path),
        newValue = currentValue
          .split(",")
          .filter(function(v) {
            return v !== propValue;
          })
          .join(","),
        newParams = _.set(currentParams, path, newValue),
        newCleanParams = this._cleanParams(newParams);
      this.set("queryParams", {});
      this.set("queryParams", newCleanParams);
    },
    ready: function ready() {
      var _this = this;
      this.addEventListener("remove-filter", function(e) {
        _this.removeFilter(e.detail.path, e.detail.propValue);
      });
    },
    detached: function detached() {
      var _this2 = this;
      this.removeEventListener("remove-filter", function(e) {
        _this2.removeFilter(e.detail.path, e.detail.propValue);
      });
    }
  });
  _exports.ElmsmediaDashboard = ElmsmediaDashboard;
});
