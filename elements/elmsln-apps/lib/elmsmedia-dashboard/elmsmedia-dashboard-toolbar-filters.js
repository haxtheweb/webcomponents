import { LitElement, html, css } from "lit-element/lit-element.js";
import "./elmsmedia-dashboard-toolbar-filter.js";
class ElmsmediaDashboardToolbarFilters extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          align-items: center;
        }
        elmsmedia-dashboard-toolbar-filter {
          margin-right: 4.8px;
        }
      `
    ];
  }
  render() {
    return html`
      ${this._filtersArray.map(
        item => html`
          <elmsmedia-dashboard-toolbar-filter
            path="${item.path}"
            prop-value="${item.propValue}"
            title="${item.title}"
          ></elmsmedia-dashboard-toolbar-filter>
        `
      )}
    `;
  }
  static get tag() {
    return "elmsmedia-dashboard-toolbar-filters";
  }
  constructor() {
    super();
    this.filters = {};
    this._filtersArray = [];
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "filters") {
        this._filtersArray = this._filtersArrayCompute(this[propName]);
      }
    });
  }
  static get properties() {
    return {
      filters: {
        type: Object
      },
      _filtersArray: {
        type: Array
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
