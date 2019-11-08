/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { SimpleColorsPolymer } from "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
/**
 * `csv-render`
 * `Remote render a CSV file in place as an accessible table.`
 *
 * @microcopy - language worth noting:
 *  - CSV is comma separated values
 *
 * @customElement
 * @polymer
 * @polymerLegacy
 * @demo demo/index.html
 */
class CsvRender extends SimpleColorsPolymer {
  constructor() {
    super();
    import("@lrnwebcomponents/hexagon-loader/hexagon-loader.js");
    import("@polymer/iron-ajax/iron-ajax.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icon/iron-icon.js");
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      import("@polymer/paper-button/paper-button.js");
      import("@polymer/paper-tooltip/paper-tooltip.js");
    });
  }
  static get template() {
    return html`
      <style include="simple-colors-shared-styles-polymer">
        :host {
          display: block;
        }
        .table {
          width: 100%;
          border: 1px solid var(--simple-colors-default-theme-accent-6);
          border-collapse: collapse;
          white-space: nowrap;
          font-size: 16px;
          background-color: var(--simple-colors-default-theme-grey-1);
        }
        .table thead {
          padding-bottom: 0.16px;
          position: sticky;
        }
        .table caption {
          background-color: var(--simple-colors-default-theme-accent-1);
          font-weight: bold;
          padding: 8px;
          border: 1px solid var(--simple-colors-default-theme-accent-6);
          border-bottom: none;
        }
        :host(:not([accent-color])) .table caption,
        :host([accent-color="grey"]) .table caption {
          background-color: var(--simple-colors-default-theme-accent-2);
        }
        .table tbody tr {
          position: relative;
          height: 48px;
          -webkit-transition-duration: 0.28s;
          transition-duration: 0.28s;
          -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          -webkit-transition-property: background-color;
          transition-property: background-color;
        }
        .table tbody tr:hover {
          background-color: var(--simple-colors-default-theme-accent-1);
        }
        :host(:not([accent-color])) .table tbody tr:hover,
        :host([accent-color="grey"]) .table tbody tr:hover {
          background-color: var(--simple-colors-default-theme-accent-2);
        }
        .table td,
        .table thead th,
        .table th {
          padding: 0 1.125em;
          text-align: left;
        }
        .table td {
          border-top: 1px solid var(--simple-colors-default-theme-accent-6);
          border-bottom: 1px solid var(--simple-colors-default-theme-accent-6);
        }
        .table th {
          position: relative;
          vertical-align: bottom;
          text-overflow: ellipsis;
          font-size: 16px;
          font-weight: bold;
          line-height: 24px;
          letter-spacing: 0;
          color: rgba(0, 0, 0, 0.54);
          height: 48px;
          padding-bottom: 8px;
          box-sizing: border-box;
        }
        #loading {
          position: absolute;
        }
        #download paper-button {
          color: var(--simple-colors-default-theme-accent-6);
          border-radius: 36px;
          width: 36px;
          height: 36px;
          min-width: unset;
          padding: 0;
          margin: 0;
          display: inline-flex;
        }
        iron-icon {
          display: inline-flex;
          margin: 0;
          padding: 0;
        }
        #download paper-button:hover,
        #download paper-button:focus,
        #download paper-button:active {
          color: var(--simple-colors-default-theme-accent-8);
          outline: 2px solid var(--simple-colors-default-theme-accent-6);
        }
      </style>
      <iron-ajax
        auto
        url="[[dataSource]]"
        handle-as="text"
        debounce-duration="500"
        last-response="{{tableData}}"
        on-response="handleResponse"
      ></iron-ajax>
      <hexagon-loader
        id="loading"
        accent-color="[[accentColor]]"
        loading
        item-count="4"
        size="small"
      ></hexagon-loader>
      <a href="[[dataSource]]" id="download" tabindex="-1">
        <paper-button
          ><iron-icon icon="file-download"></iron-icon
        ></paper-button>
      </a>
      <paper-tooltip for="download" animation-delay="200" offset="14"
        >Download table data</paper-tooltip
      >
      <table class="table" summary="[[summary]]">
        <template is="dom-if" if="[[caption]]">
          <caption>
            [[caption]]
          </caption>
        </template>
        <thead>
          <tr>
            <template is="dom-repeat" items="[[tableHeadings]]" as="heading">
              <th scope="col">[[heading]]</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template is="dom-repeat" items="[[table]]" as="row">
            <tr>
              <template is="dom-repeat" items="[[row]]" as="col">
                <td>[[col]]</td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    `;
  }

  static get tag() {
    return "csv-render";
  }
  static get properties() {
    return {
      /**
       * Location of the CSV file.
       */
      dataSource: {
        type: String
      },

      /**
       * Caption for the table to improve accessibility and readability.
       */
      caption: {
        type: String
      },
      /**
       * Summary to improve accessibility for screen readers.
       */
      summary: {
        type: String
      },
      /**
       * Table busted out as an array.
       */
      table: {
        type: Array,
        value: []
      },
      /**
       * Headings from the first row of the csv
       */
      tableHeadings: {
        type: Array,
        value: []
      },
      /**
       * Raw data pulled in from the csv file.
       */
      tableData: {
        type: String,
        value: ""
      },
      /**
       * Color class work to apply
       */
      color: {
        type: String,
        observer: "_getAccentColor"
      }
    };
  }
  /**
   * Convert from csv text to an array in the table function
   */
  handleResponse(e) {
    this.table = this.CSVtoArray(this.tableData);
    this.tableHeadings = this.table.shift();
    this.shadowRoot.querySelector("#loading").loading = false;
  }
  /**
   * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
   */
  CSVtoArray(text) {
    let p = "",
      row = [""],
      ret = [row],
      i = 0,
      r = 0,
      s = !0,
      l;
    for (l in text) {
      l = text[l];
      if ('"' === l) {
        if (s && l === p) row[i] += l;
        s = !s;
      } else if ("," === l && s) l = row[++i] = "";
      else if ("\n" === l && s) {
        if ("\r" === p) row[i] = row[i].slice(0, -1);
        row = ret[++r] = [(l = "")];
        i = 0;
      } else row[i] += l;
      p = l;
    }
    return ret;
  }

  _getAccentColor(color) {
    color = color.replace("-text", "");
    if (
      (!this.accentColor || this.accentColor === "grey") &&
      this.colors[color]
    ) {
      this.accentColor = color;
    }
  }
}
window.customElements.define(CsvRender.tag, CsvRender);
export { CsvRender };
