/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
/**
 * `editable-table-behaviors`
 * A set of common behaviors for editable-table web components.
 *
 */

/**
 * behaviors needed to display the table in either mode
 */
export const displayBehaviors = function (SuperClass) {
  return class extends SuperClass {
    static get properties() {
      return {
        ...super.properties,

        /**
         * Add borders to table and table cells.
         */
        bordered: {
          attribute: "bordered",
          type: Boolean,
          notify: true,
        },
        /**
         * a table caption
         */
        caption: {
          type: String,
          value: null,
          notify: true,
        },
        /**
         * Display the first row as a column header.
         */
        columnHeader: {
          attribute: "column-header",
          type: Boolean,
          notify: true,
        },
        /**
         * Raw data pulled in from the csv file.
         */
        csvData: {
          type: String,
        },
        /**
         * Condense height of table cells.
         */
        condensed: {
          attribute: "condensed",
          type: Boolean,
          notify: true,
        },
        /**
         * raw data
         */
        data: {
          type: Array,
          notify: true,
        },
        /**
         * Location of the CSV file.
         */
        dataCsv: {
          type: String,
        },
        /**
         * Enable filtering by cell value.
         */
        filter: {
          attribute: "filter",
          type: Boolean,
          reflect: true,
          notify: true,
        },
        /**
         * Display the last row as a column footer.
         */
        footer: {
          attribute: "footer",
          type: Boolean,
          notify: true,
        },
        /**
         * Display the first column as a row header.
         */
        rowHeader: {
          attribute: "row-header",
          type: Boolean,
          notify: true,
        },
        /**
         * When table is wider than screens,
         * users will select a column to display
         * instead of scrolling across the table.
         */
        responsive: {
          attribute: "responsive",
          type: Boolean,
          reflect: true,
          notify: true,
        },
        /**
         * Enable sorting by column header.
         */
        sort: {
          attribute: "sort",
          type: Boolean,
          reflect: true,
          notify: true,
        },
        /**
         * Add alternating row striping.
         */
        striped: {
          attribute: "striped",
          type: Boolean,
          notify: true,
        },
      };
    }
    /**
     * Rows in <thead>
     */
    get thead() {
      return this.columnHeader ? (this.data || []).slice(0, 1) : [];
    }
    /**
     * Rows in <tbody>
     */
    get tbody() {
      return (this.data || []).slice(
        this.columnHeader ? 1 : 0,
        this.footer ? (this.data || []).length - 1 : (this.data || []).length
      );
    }
    /**
     * Rows in <tfoot>
     */
    get tfoot() {
      return this.footer
        ? (this.data || []).slice((this.data || []).length - 1)
        : [];
    }

    constructor() {
      super();
      this.bordered = false;
      this.columnHeader = false;
      this.condensed = false;
      this.data = [];
      this.filter = false;
      this.footer = false;
      this.rowHeader = false;
      this.responsive = false;
      this.sort = false;
      this.striped = false;
    }

    updated(changedProperties) {
      if (super.updated) super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === this.dataCsv) this.fetchData();
        if (propName === this.csvData) this._loadExternalData();
        if (propName == "data") this._dataChanged(this.data, oldValue);
      });
    }

    fetchData() {
      if (this.dataCsv && this.dataCsv !== "")
        fetch(this.dataCsv)
          .then((response) => response.text())
          .then((data) => (data = this.csvData));
    }

    /**
     * converts csv string to array
     * @param {string} text the CSV string
     * @returns {array} a multidimensional table array
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
    /**
     * Return table data as plain CSV
     * @returns {string} for the CSV
     */
    getTableCSV() {
      return this.data
        .map((row) => {
          return row
            .map((cell) => {
              cell = this._replaceBlankCell(cell);
              return this._isNumeric(cell)
                ? cell.replace(/,/g, "")
                : `\"${cell.replace(/"/g, '""')}\"`;
            })
            .join(",");
        })
        .join("\n");
    }
    /**
     * return HTML object of table data
     * @returns {object} HTML object for managed table
     */
    getTableHTMLNode() {
      let n = document.createElement("editable-table-display");
      // replicate values that we had previously so they get reflected back into the DOM
      let props = this.getTableProperties();
      for (var i in props) {
        n[i] = props[i];
      }
      n.innerHTML = this.getTableHTML();
      return n;
    }
    /**
     * Return table as plain HTML
     * @returns {string} the HTML for the table
     */
    getTableHTML() {
      let headers = [],
        body = [],
        footer = [];
      let getTR = (tr, open = "td", close = "td") => {
        let th = this.rowHeader ? tr.slice(0, 1) : [],
          td = this.rowHeader ? tr.slice(1) : tr;
        return `\n\t\t<tr>${th
          .map((cell) => {
            return `\n\t\t\t<th scope="row">${this._replaceBlankCell(
              cell
            )}</th>`;
          })
          .join("")}${td
          .map((cell) => {
            return `\n\t\t\t<${open}>${this._replaceBlankCell(
              cell
            )}</${close}>`;
          })
          .join("")}\n\t\t</tr>`;
      };
      if (this.thead) {
        headers = this.thead.map((tr) => {
          return getTR(tr, `th scope="col"`, `th`);
        });
      }
      if (this.tbody) {
        body = this.tbody.map((tr) => {
          return getTR(tr);
        });
      }
      if (this.tfoot) {
        footer = this.tfoot.map((tr) => {
          return getTR(tr);
        });
      }
      let props = this.getTableProperties();
      let attr = "";
      ["bordered", "striped", "condensed"].forEach((i) => {
        if (props[i]) {
          attr += `${i} `;
        }
      });
      return [
        `<table ${attr}>`,
        this.caption !== "" && this.caption !== null && this.caption !== "null"
          ? `\n\t<caption>\n\t\t${this.caption}\n\t</caption>`
          : "",
        headers.length > 0 ? `\n\t<thead>${headers.join("")}\n\t</thead>` : "",
        body.length > 0 ? `\n\t<tbody>${body.join("")}\n\t</tbody>` : "",
        footer.length > 0 ? `\n\t<tfoot>${footer.join("")}\n\t</tfoot>` : "",
        "\n</table>",
      ].join("");
    }
    /**
     * Return table data and configuration
     * @returns {object} an object with all the table data and configurations
     */
    getTableProperties() {
      let data = {
        bordered: !this.hideBordered ? this.bordered : null,
        caption: this.caption,
        columnHeader: this.columnHeader,
        condensed: !this.hideCondensed ? this.condensed : null,
        data: this.data,
        filter: !this.hideFilter ? this.filter : null,
        footer: this.footer,
        rowHeader: this.rowHeader,
        responsive: !this.hideResponsive ? this.responsive : null,
        sort: !this.hideSort ? this.sort : null,
        striped: !this.hideStriped ? this.striped : null,
        summary: this.summary,
      };
      return data;
    }
    /**
     * imports table HTML as data
     * @param {HTMLElement} table the table element
     */
    importHTML(table) {
      let data = [].slice.call(table.querySelectorAll("tr")).map((row) => {
        return [].slice.call(row.querySelectorAll("th,td")).map((cell) => {
          return typeof cell.innerHTML === "string"
            ? cell.innerHTML.trim()
            : cell.innerHTML;
        });
      });
      if (data.length > 0 && data[0].length > 0) this.data = data;
      this.columnHeader =
        this.columnHeader || table.querySelectorAll("thead").length > 0;
      this.rowHeader =
        this.rowHeader || table.querySelectorAll("tbody th").length > 0;
      this.footer = this.footer || table.querySelectorAll("tfoot").length > 0;
      this.caption =
        table.querySelectorAll("caption").length > 0
          ? table.querySelector("caption").innerHTML.trim()
          : undefined;
    }
    /**
     * Convert from csv text to an array in the table function
     */
    _loadExternalData(e) {
      let data = this.CSVtoArray(this.csvData);
      if (data.length > 0 && data[0].length > 0) this.set("data", data);
    }
    /**
     * replaces a blank cell with "-" for accessibility
     * @param {string} cell the cell contents
     * @returns {string} the cell contents or "-" if empty
     */
    _replaceBlankCell(cell) {
      return String(cell).trim() === "" ? "-" : cell;
    }

    /**
     * Sets a cell's numeric style
     * @param {string} cell the cell contents
     * @returns {boolean} whether cell contents are numeric
     */
    _isNumeric(cell) {
      return cell !== null && !isNaN(cell.trim().replace(/\$/g, ""));
    }
  };
};

/**
 * behaviors needed for table cells, row headers, and columns
 */
export const cellBehaviors = function (SuperClass) {
  return class extends SuperClass {
    /**
     * Get the row or column label
     * @param {number} index of the row or column
     * @param  {boolean} whenther it's a row
     * @returns {string} a row number or a column letter
     */
    _getLabel(index, row) {
      if (row) {
        return index + 1;
      } else {
        let numerals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
          results = this._getLetter(index).split("-").reverse(),
          label = "";
        for (let i = 0; i < results.length; i++) {
          if (results[i] !== "") label += numerals[results[i]];
        }
        return label;
      }
    }

    /**
     * Converts index to a letter.
     * @param {number} index of the row or column
     * @returns {string} a column letter
     */
    _getLetter(index) {
      let place = Math.floor(index / 26),
        multiplier = 26 * place,
        remainder = index - multiplier,
        letters = "";
      letters += remainder + "-";
      if (place > 0 && place < 26) {
        letters += place - 1 + "-";
      } else if (place >= 26) {
        letters += this._getLetter(place - 1);
      }
      return letters;
    }
  };
};

/**
 * behaviors needed for table cells, row headers, and columns
 */
export const editableTableCellStyles = [
  css`
    .cell-button {
      padding-top: var(--editable-table-cell-vertical-padding, 10px);
      padding-bottom: var(--editable-table-cell-vertical-padding, 10px);
      padding-left: var(--editable-table-cell-horizontal-padding, 6px);
      padding-right: var(--editable-table-cell-horizontal-padding, 6px);
      margin: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      align-content: stretch;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      background-color: transparent;
      border: none;
      border-radius: 0;
    }
    .sr-only {
      position: absolute;
      left: -9999px;
      font-size: 0;
      height: 0;
      width: 0;
      overflow: hidden;
      margin: 0;
      padding: 0;
    }
  `,
];

/**
 * behaviors needed for table cells, row headers, and columns
 */
export const editableTableStyles = [
  css`
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      margin: 15px 0;
      font-size: var(--editable-table-font-size, unset);
      font-family: var(--editable-table-font-family, inherit);
      font-weight: var(--editable-table-medium-weight, 300);
      color: var(--editable-table-color, #222);
      background-color: var(--editable-table-bg-color, #fff);

      --simple-picker-font-family: var(
        --editable-table-secondary-font-family,
        "Roboto",
        "Noto",
        sans-serif
      );
      --simple-picker-font-size: var(
        --editable-table-secondary-font-size,
        12px
      );
      --simple-picker-color: var(--editable-table-color, #222);
      --simple-picker-background-color: var(--editable-table-bg-color, #fff);
      --paper-font-caption: {
        font-family: var(
          --editable-table-secondary-font-family,
          "Roboto",
          "Noto",
          sans-serif
        );
      }
    }
    :host([hidden]) {
      display: none;
    }
    .sr-only {
      position: absolute;
      left: -9999px;
      font-size: 0;
      height: 0;
      width: 0;
      overflow: hidden;
      margin: 0;
      padding: 0;
    }
    table {
      width: calc(100% - 2 * var(--editable-table-border-width, 1px));
      display: table;
      border-collapse: collapse;
      border-width: var(--editable-table-border-width, 1px);
      border-style: var(--editable-table-border-style, solid);
      border-color: var(--editable-table-border-color, #999);
      font-weight: var(--editable-table-light-weight, 200);
      color: var(--editable-table-color, #222);
      background-color: var(--editable-table-bg-color, #fff);
    }
    .th,
    .td {
      font-weight: var(--editable-table-light-weight, 200);
      color: var(--editable-table-color, #222);
      background-color: var(--editable-table-bg-color, #fff);
    }
    caption {
      font-size: var(
        --editable-table-caption-font-size,
        var(--editable-table-font-size, unset)
      );
      font-weight: var(--editable-table-heavy-weight, 600);
      color: var(
        --editable-table-caption-color,
        var(--editable-table-color, #222)
      );
      background-color: var(
        --editable-table-caption-bg-color,
        var(--editable-table-bg-color, #fff)
      );
      width: 100%;
    }
    tr {
      display: table-row;
    }
    .th-or-td {
      display: table-cell;
    }
    table[column-header] .thead .th {
      background-color: var(--editable-table-heading-bg-color, #e8e8e8);
      font-weight: var(--editable-table-heavy-weight, 600);
      color: var(--editable-table-heading-color, #000);
    }
    table[row-header] .tbody .th {
      font-weight: var(--editable-table-heavy-weight, 600);
      color: var(--editable-table-heading-color, #000);
      background-color: var(--editable-table-bg-color, #fff);
      text-align: left;
    }
    table[bordered] .th,
    table[bordered] .td {
      border-width: var(--editable-table-border-width, 1px);
      border-style: var(--editable-table-border-style, solid);
      border-color: var(--editable-table-border-color, #999);
    }
    table[condensed] {
      --editable-table-cell-vertical-padding: var(
        --editable-table-cell-vertical-padding-condensed,
        2px
      );
      --editable-table-cell-horizontal-padding: var(
        --editable-table-cell-horizontal-padding-condensed,
        4px
      );
    }
    table[striped] .tbody tr:nth-child(2n) .th,
    table[striped] .tbody tr:nth-child(2n) .td {
      background-color: var(--editable-table-stripe-bg-color, #f0f0f0);
    }
    table[footer] .tfoot .th,
    table[footer] .tfoot .td {
      border-top: 3px solid var(--editable-table-color, #222);
    }
    table[footer] .tfoot .th,
    table[footer] .tfoot .td {
      font-weight: var(--editable-table-heavy-weight, 600);
      color: var(--editable-table-heading-color, #000);
    }
    caption,
    table .th-or-td {
      text-align: left;
    }
    table .th-or-td[numeric] {
      text-align: var(--editable-table-numeric-text-align, unset);
    }
    table .td[negative] .cell {
      color: var(--editable-table-negative-color, --editable-table-color);
    }
    editable-table-sort {
      width: 100%;
    }
    button {
      background-color: transparent;
      border: none;
      border-radius: 0;
    }
    ::slotted(table) {
      display: none;
    }
    @media screen {
      :host {
        overflow-x: auto;
        width: 100%;
        max-width: 100%;
      }
      :host([responsive]) {
        overflow-x: visible;
      }
    }
  `,
];
