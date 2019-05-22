import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/app-route/app-route.js";
import "@polymer/app-route/app-location.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/hax-body/lib/hax-app.js";
import "./elmsmedia-dashboard-filters.js";
import "./elmsmedia-dashboard-toolbar-filters.js";
import "./elmsmedia-dashboard-toolbar-button.js";
class ElmsmediaDashboard extends PolymerElement {
  static get template() {
    return html`
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

      <paper-dialog id="filterDialog">
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
        data='{
      "root": "list",
      "gizmoType": "video",
      "url": "http://media.elmsln.local/entity_iframe/node/",
      "id": "id",
      "title": "attributes.title",
      "description": "attributes.body",
      "image": "display.image",
      "customGizmoType": "type"}'
      ></hax-app>
    `;
  }

  static get tag() {
    return "elmsmedia-dashboard";
  }

  static get properties() {
    return {
      requestEndPoint: {
        type: String,
        value: ""
      },
      queryParams: {
        type: Object,
        value: {}
      }
    };
  }

  _computeRequestEndPoint(endPoint, csrfToken) {
    return `${endPoint}/api/data?token=${csrfToken}`;
  }

  /**
   * Listen for filter changes and reset the page count
   * @todo unsetting this object does not always work
   */
  _filterChanged(e) {
    let newParams = Object.assign({}, e.detail);
    newParams = this._cleanParams(newParams);
    this.set("queryParams", {});
    this.set("queryParams", newParams);
  }

  /**
   * Helper function to prepare parameters object for the url
   * @todo this is horribly written
   */
  _cleanParams(params) {
    let newParams = {};
    for (x in params) {
      const prop = x;
      const value = params[x];
      if (value === "" || value === null || value === undefined) {
        // do nothing
      } else {
        // add the clean property to the new params object
        newParams[prop] = value;
      }
    }
    return newParams;
  }

  toggleSearch(e) {
    const searchEnabled = this.$.haxSource.search;
    this.$.haxSource.search = !searchEnabled;
  }

  toggleFilters(e) {
    this.$.filterDialog.toggle();
  }

  removeFilter(path, propValue) {
    const currentParams = Object.assign({}, this.queryParams);
    // get the current value of the filter
    const currentValue = _.get(currentParams, path);
    // remove the specified filter from the current value
    // by converting to an array and filtering it
    const newValue = currentValue
      .split(",")
      .filter(v => v !== propValue)
      .join(",");
    const newParams = _.set(currentParams, path, newValue);
    const newCleanParams = this._cleanParams(newParams);
    this.set("queryParams", {});
    this.set("queryParams", newCleanParams);
  }

  ready() {
    super.ready();
    this.addEventListener("remove-filter", e => {
      this.removeFilter(e.detail.path, e.detail.propValue);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("remove-filter", e => {
      this.removeFilter(e.detail.path, e.detail.propValue);
    });
  }
}
window.customElements.define(ElmsmediaDashboard.tag, ElmsmediaDashboard);
export { ElmsmediaDashboard };
