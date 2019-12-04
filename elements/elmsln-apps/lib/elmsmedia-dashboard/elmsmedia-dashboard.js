import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/app-route/app-route.js";
import "@polymer/app-route/app-location.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/hax-body/lib/hax-app.js";
import "./elmsmedia-dashboard-filters.js";
import "./elmsmedia-dashboard-toolbar-filters.js";
import "./elmsmedia-dashboard-toolbar-button.js";
class ElmsmediaDashboard extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
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
      `
    ];
  }
  constructor() {
    super();
    this.requestEndPoint = "";
    this.queryParams = {};
    setTimeout(() => {
      this.addEventListener("remove-filter", e => {
        this.removeFilter(e.detail.path, e.detail.propValue);
      });
    }, 0);
  }
  render() {
    return html`
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
          .filters="${this.queryParams}"
        ></elmsmedia-dashboard-toolbar-filters>
        <elmsmedia-dashboard-toolbar-button
          icon="filter-list"
          title="Filter"
          @click="${this.toggleFilters}"
        ></elmsmedia-dashboard-toolbar-button>
        <elmsmedia-dashboard-toolbar-button
          icon="search"
          title="Search"
          @click="${this.toggleSearch}"
        ></elmsmedia-dashboard-toolbar-button>
      </div>

      <paper-dialog id="filterDialog">
        <h3>Filter Media</h3>
        <elmsmedia-dashboard-filters
          form="{{queryParams}}"
          @filter-changed="${this._filterChanged}"
        ></elmsmedia-dashboard-filters>
        <div class="buttons">
          <paper-button dialog-dismiss="">Dismiss dialog</paper-button>
        </div>
      </paper-dialog>

      <hax-app
        id="haxSource"
        auto=""
        query-param="title"
        request-end-point="${this.requestEndPoint}"
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
        type: String
      },
      queryParams: {
        type: Object
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
    this.queryParams = { ...newParams };
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
    const searchEnabled = this.shadowRoot.querySelector("#haxSource").search;
    this.shadowRoot.querySelector("#haxSource").search = !searchEnabled;
  }

  toggleFilters(e) {
    this.shadowRoot.querySelector("#filterDialog").toggle();
  }

  removeFilter(path, propValue) {
    const currentParams = Object.assign({}, this.queryParams);
    // get the current value of the filter
    const currentValue = this.get(currentParams, path);
    // remove the specified filter from the current value
    // by converting to an array and filtering it
    const newValue = currentValue
      .split(",")
      .filter(v => v !== propValue)
      .join(",");
    const newParams = _.set(currentParams, path, newValue);
    const newCleanParams = this._cleanParams(newParams);
    this.queryParams = { ...newCleanParams };
  }
}
window.customElements.define(ElmsmediaDashboard.tag, ElmsmediaDashboard);
export { ElmsmediaDashboard };
