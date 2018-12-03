import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./elmsmedia-dashboard-toolbar-filter.js";
let ElmsmediaDashboardToolbarFilters = Polymer({
  _template: html`
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
      <elmsmedia-dashboard-toolbar-filter path="[[item.path]]" prop-value="[[item.propValue]]" title="[[item.title]]"></elmsmedia-dashboard-toolbar-filter>
    </template>
`,

  is: 'elmsmedia-dashboard-toolbar-filters',

  properties: {
    filters: {
      type: Object,
      value: {}
    },
    _filtersArray: {
      type: Array,
      computed: '_filtersArrayCompute(filters, filters.*)'
    }
  },

  _filtersArrayCompute: function (filters) {
    let filtersArray = [];
    for (f in filters) {
      const prop = f;
      // account for mulitple filter values
      const values = filters[f].split(',');
      // ignore the page property
      if (prop !== 'page') {
        values.forEach(value => {
          filtersArray.push({ path: prop, propValue: value, title: `${prop}: ${value}`});
        });
      }
    }
    return filtersArray;
  }
});
export { ElmsmediaDashboardToolbarFilters };