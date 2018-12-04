import {
  html,
  Polymer
} from "../../node_modules/@polymer/polymer/polymer-legacy.js";
import "../../node_modules/@polymer/app-route/app-route.js";
import "../../node_modules/@polymer/app-route/app-location.js";
import "../../node_modules/@polymer/paper-dialog/paper-dialog.js";
import "../../node_modules/@polymer/paper-button/paper-button.js";
import "../../node_modules/@lrnwebcomponents/hax-body/lib/hax-app.js";
import "./elmsmedia-dashboard-filters.js";
import "./elmsmedia-dashboard-toolbar-filters.js";
import "./elmsmedia-dashboard-toolbar-button.js";
let ElmsmediaDashboard = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      paper-dialog {
        padding: 1em;
      }
      #toolbar {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    </style>

    <app-location route="{{route}}"></app-location>
    <app-route
      route="{{route}}"
      pattern="/:page"
      data="{{data}}"
      tail="{{tail}}"
      query-params="{{queryParams}}"
    ></app-route>

    <div id="toolbar">
      <elmsmedia-dashboard-toolbar-filters
        filters="[[queryParams]]"
      ></elmsmedia-dashboard-toolbar-filters>
      <elmsmedia-dashboard-toolbar-button
        icon="filter-list"
        title="Filter"
        on-click="toggleFilters"
      ></elmsmedia-dashboard-toolbar-button>
      <elmsmedia-dashboard-toolbar-button
        icon="search"
        title="Search"
        on-click="toggleSearch"
      ></elmsmedia-dashboard-toolbar-button>
    </div>

    <paper-dialog id="filterDialog" with-backdrop="">
      <h3>Filter Media</h3>
      <elmsmedia-dashboard-filters
        form="{{queryParams}}"
        on-filter-changed="_filterChanged"
      ></elmsmedia-dashboard-filters>
      <div class="buttons">
        <paper-button dialog-dismiss="">Dismiss dialog</paper-button>
      </div>
    </paper-dialog>

    <hax-app
      id="haxSource"
      auto=""
      query-param="title"
      request-end-point="[[requestEndPoint]]"
      request-params="{{queryParams}}"
      data="{
      &quot;root&quot;: &quot;list&quot;,
      &quot;gizmoType&quot;: &quot;video&quot;,
      &quot;url&quot;: &quot;http://media.elmsln.local/entity_iframe/node/&quot;,
      &quot;id&quot;: &quot;id&quot;,
      &quot;title&quot;: &quot;attributes.title&quot;,
      &quot;description&quot;: &quot;attributes.body&quot;,
      &quot;image&quot;: &quot;display.image&quot;,
      &quot;customGizmoType&quot;: &quot;type&quot;}"
    ></hax-app>
  `,
  is: "elmsmedia-dashboard",
  properties: {
    requestEndPoint: { type: String, value: "" },
    queryParams: { type: Object, value: {} }
  },
  _computeRequestEndPoint: function(endPoint, csrfToken) {
    return `${endPoint}/api/data?token=${csrfToken}`;
  },
  _filterChanged: function(e) {
    let newParams = Object.assign({}, e.detail);
    newParams = this._cleanParams(newParams);
    this.set("queryParams", {});
    this.set("queryParams", newParams);
  },
  _cleanParams: function(params) {
    let newParams = {};
    for (x in params) {
      const prop = x,
        value = params[x];
      if ("" === value || null === value || value === void 0) {
      } else {
        newParams[prop] = value;
      }
    }
    return newParams;
  },
  toggleSearch: function(e) {
    const searchEnabled = this.$.haxSource.search;
    this.$.haxSource.search = !searchEnabled;
  },
  toggleFilters: function(e) {
    this.$.filterDialog.toggle();
  },
  removeFilter: function(path, propValue) {
    const currentParams = Object.assign({}, this.queryParams),
      currentValue = _.get(currentParams, path),
      newValue = currentValue
        .split(",")
        .filter(v => v !== propValue)
        .join(","),
      newParams = _.set(currentParams, path, newValue),
      newCleanParams = this._cleanParams(newParams);
    this.set("queryParams", {});
    this.set("queryParams", newCleanParams);
  },
  ready: function() {
    this.addEventListener("remove-filter", e => {
      this.removeFilter(e.detail.path, e.detail.propValue);
    });
  },
  detached: function() {
    this.removeEventListener("remove-filter", e => {
      this.removeFilter(e.detail.path, e.detail.propValue);
    });
  }
});
export { ElmsmediaDashboard };
