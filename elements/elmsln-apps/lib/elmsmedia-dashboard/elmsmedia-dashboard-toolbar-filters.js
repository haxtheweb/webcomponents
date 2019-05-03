import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "./elmsmedia-dashboard-toolbar-filter.js";
class ElmsmediaDashboardToolbarFilters extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          align-items: center;
        }
        elmsmedia-dashboard-toolbar-filter {
          margin-right: 4.8px;
        }
      </style>

      <template is="dom-repeat" items="[[_filtersArray]]" as="item">
        <elmsmedia-dashboard-toolbar-filter
          path="[[item.path]]"
          prop-value="[[item.propValue]]"
          title="[[item.title]]"
        ></elmsmedia-dashboard-toolbar-filter>
      </template>
    `;
  }

  static get tag() {
    return "elmsmedia-dashboard-toolbar-filters";
  }

  static get properties() {
    return {
      filters: {
        type: Object,
        value: {}
      },
      _filtersArray: {
        type: Array,
        computed: "_filtersArrayCompute(filters, filters.*)"
      }
    };
  }

  _filtersArrayCompute(filters) {
    let filtersArray = [];
    for (f in filters) {
      const prop = f;
      // account for mulitple filter values
      const values = filters[f].split(",");
      // ignore the page property
      if (prop !== "page") {
        values.forEach(value => {
          filtersArray.push({
            path: prop,
            propValue: value,
            title: `${prop}: ${value}`
          });
        });
      }
    }
    return filtersArray;
  }
}
window.customElements.define(
  ElmsmediaDashboardToolbarFilters.tag,
  ElmsmediaDashboardToolbarFilters
);
export { ElmsmediaDashboardToolbarFilters };
