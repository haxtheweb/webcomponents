/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { FilteredImage } from "../filtered-image.js";
/**
 * `filtered-image-filters`
 * @customElement filtered-image-filters
 * `An image using an SVG filter. Can be used to make background images have more contrast with text.`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class FilteredImageFilters extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
        table {
          border: 1px solid black;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        table td {
          padding: 0;
          border: 1px solid black;
        }
        table caption,
        table th {
          text-align: left;
          padding: 0.25em 0.5em;
          vertical-align: top;
          border: 1px solid black;
          font-weight: bold;
        }
      </style>
      <label for="filter1">Filter 1:</label>
      <select id="filter1" on-change="_setFilter">
        <option value="">show all filters</option>
        <template is="dom-repeat" items="[[filters]]" as="filter" index-as="i">
          <option value="[[i]]">[[filter.name]]</option>
        </template>
      </select>
      <label for="filter2">Filter 2:</label>
      <select id="filter2" on-change="_setFilter">
        <option value="">none</option>
        <template is="dom-repeat" items="[[filters]]" as="filter" index-as="i">
          <option value="[[i]]">[[filter.name]]</option>
        </template>
      </select>
      <template is="dom-repeat" items="[[__selectedFilters]]" as="filter">
        <table>
          <caption>
            [[filter.name]]
          </caption>
          <tr>
            <th>Levels</th>
            <template is="dom-repeat" items="[[filter.columns.levels]]" as="th">
              <th>[[th]]</th>
            </template>
          </tr>
          <template
            is="dom-repeat"
            items="[[filter.rows.levels]]"
            as="tr"
            index-as="row"
          >
            <tr>
              <th>[[tr]]</th>
              <template
                is="dom-repeat"
                items="[[filter.columns.levels]]"
                as="level"
                index-as="col"
              >
                <td>
                  <filtered-image
                    alt$="[[src]]"
                    src$="[[src]]"
                    height="100"
                    width="100"
                    matrix$="[[_getMatrix(filter,col,row)]]"
                  >
                  </filtered-image>
                </td>
              </template>
            </tr>
          </template>
        </table>
      </template>
    `;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      src: {
        name: "src",
        type: String,
        value: ""
      },
      alt: {
        name: "alt",
        type: String,
        value: ""
      },
      height: {
        name: "width",
        type: String,
        value: ""
      },
      width: {
        name: "unset",
        type: String,
        value: ""
      },
      filter1: {
        name: "filter1",
        type: String,
        value: ""
      },
      filter1: {
        name: "filter2",
        type: String,
        value: ""
      },
      filters: {
        name: "filters",
        type: Array,
        value: [
          {
            name: "Split Saturation",
            columns: {
              levels: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
              coords: [[0, 1], [0, 1]]
            },
            rows: {
              levels: ["Example"],
              coords: []
            }
          },
          {
            name: "Split Desaturation",
            columns: {
              levels: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
              coords: [[1, 0], [2, 0]]
            },
            rows: {
              levels: ["Example"],
              coords: []
            }
          },
          {
            name: "Filter",
            columns: {
              levels: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              coords: [[0, 3]]
            },
            rows: {
              levels: ["Example"],
              coords: []
            }
          },
          {
            name: "Inverse Filter",
            columns: {
              levels: [0, -0.2, -0.4, -0.6, -0.8, -1.0],
              coords: [[1, 3], [2, 3]]
            },
            rows: {
              levels: ["Example"],
              coords: []
            }
          },
          {
            name: "Wash",
            columns: {
              levels: [0, -0.2, -0.4, -0.6, -0.8, -1.0],
              coords: [[3, 0]]
            },
            rows: {
              levels: ["Example"],
              coords: []
            }
          },
          {
            name: "Inverse Wash",
            columns: {
              levels: [0, -0.2, -0.4, -0.6, -0.8, -1.0],
              coords: [[3, 1], [3, 2]]
            },
            rows: {
              levels: ["Example"],
              coords: []
            }
          },
          {
            name: "RGB",
            columns: {
              levels: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              coords: [[0, 0], [1, 1], [2, 2]]
            },
            rows: {
              levels: ["Example"],
              coords: []
            }
          },
          {
            name: "Opacity",
            columns: {
              levels: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              coords: [[3, 3]]
            },
            rows: {
              levels: ["Example"],
              coords: []
            }
          },
          {
            name: "M",
            columns: {
              levels: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              coords: [[3, 4]]
            },
            rows: {
              levels: ["Example"],
              coords: []
            }
          }
        ]
      },
      __selectedFilters: {
        name: "__selectedFilters",
        type: Array,
        computed: "_getSelectedFilters(filter1,filter2)"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "filtered-image-filters";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  _setFilter(e) {
    this.filter1 = this.shadowRoot.querySelector("#filter1").value;
    this.filter2 = this.shadowRoot.querySelector("#filter2").value;
  }
  _getSelectedFilters(filter1, filter2) {
    let f1 = {},
      f2 = {},
      f = this.filters;
    if (filter1 !== "") {
      f1 = this.filters[parseInt(filter1)];
      f = [
        {
          name: f1.name,
          columns: f1.columns,
          rows: f1.rows
        }
      ];
      if (filter2) {
        f[0].name += " and " + this.filters[parseInt(filter2)].name;
        f[0].rows = this.filters[parseInt(filter2)].columns;
      }
    }
    return f;
  }
  _getMatrix(filter, col, row) {
    let matrix = [
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0]
    ];
    filter.columns.coords.forEach(coords => {
      matrix[coords[0]][coords[1]] = filter.columns.levels[col];
    });
    filter.rows.coords.forEach(coords => {
      matrix[coords[0]][coords[1]] = filter.rows.levels[row];
    });
    return JSON.stringify(matrix)
      .replace(/[\[\]]/g, "")
      .replace(/,/g, " ");
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(FilteredImageFilters.tag, FilteredImageFilters);
export { FilteredImageFilters };
