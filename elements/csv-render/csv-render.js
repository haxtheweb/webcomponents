/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `csv-render`
 * `Remote render a CSV file in place as an accessible table.`
 *
 * @microcopy - language worth noting:
 *  - CSV is comma separated values
 *
 * @demo ./demo/index.html
 * @element csv-render
 */
class CsvRender extends SimpleColors {
  /**
   * LitElement style construction
   */
  static get styles() {
    return [
      css`
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
          left: calc(50% - 70px);
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
      `
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.table = [];
    this.tableHeadings = [];
    this.tableData = "";
    import("@lrnwebcomponents/hexagon-loader/hexagon-loader.js");
    import("@polymer/iron-ajax/iron-ajax.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/paper-button/paper-button.js");
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "color") {
        this._getAccentColor(this[propName], oldValue);
      }
    });
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <iron-ajax
        auto
        url="${this.dataSource}"
        handle-as="text"
        debounce-duration="500"
        @last-response-changed="${this.tableDataChanged}"
        @response="${this.handleResponse}"
      ></iron-ajax>
      <hexagon-loader
        id="loading"
        accent-color="${this.accentColor}"
        loading
        item-count="4"
        size="small"
      ></hexagon-loader>
      <a href="${this.dataSource}" id="download" tabindex="-1">
        <paper-button
          ><iron-icon icon="file-download"></iron-icon
        ></paper-button>
      </a>
      <simple-tooltip for="download" animation-delay="200" offset="14"
        >Download table data</simple-tooltip
      >
      <table class="table" summary="${this.summary}">
        ${this.caption
          ? html`
              <caption>
                ${this.caption}
              </caption>
            `
          : ""}
        <thead>
          <tr>
            ${this.tableHeadings.map(
              heading =>
                html`
                  <th scope="col">${heading}</th>
                `
            )}
          </tr>
        </thead>
        <tbody>
          ${this.table.map(
            row => html`
              <tr>
                ${row.map(
                  col => html`
                    <td>${col}</td>
                  `
                )}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  static get tag() {
    return "csv-render";
  }
  tableDataChanged(e) {
    this.tableData = e.detail.value;
  }
  static get properties() {
    return {
      /**
       * Location of the CSV file.
       */
      dataSource: {
        type: String,
        attribute: "data-source"
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
        type: Array
      },
      /**
       * Headings from the first row of the csv
       */
      tableHeadings: {
        type: Array
      },
      /**
       * Raw data pulled in from the csv file.
       */
      tableData: {
        type: String,
        attribute: "table-data"
      },
      /**
       * Color class work to apply
       */
      color: {
        type: String
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
