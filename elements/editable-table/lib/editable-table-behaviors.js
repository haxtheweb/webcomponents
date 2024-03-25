/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
/**
 * `editable-table-behaviors`
 * A set of common behaviors for editable-table web components.
 *
 */

/**
 * styling for table cells
 * @const
 * @default
 * @type {array}
 *
 */
export const editableTableCellStyles = [css``];

/**
 * styling for table
 * @const
 * @default
 * @type {array}
 */
export const editableTableStyles = [
  css`
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      margin: var(--ddd-spacing-4) 0;
      font-size: var(--editable-table-font-size, unset);
      font-family: var(--editable-table-font-family, inherit);
      font-weight: var(--editable-table-medium-weight, 300);
      color: var(--editable-table-color, #222);
      background-color: var(--editable-table-bg-color, #fff);
    }
    :host([hidden]) {
      display: none;
    }
    .offscreen {
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
      background-color: var(
        --editable-table-bg-color,
        var(--ddd-theme-default-white, #fff)
      );
    }
    .th,
    .td,
    .th-or-td .icon-container {
      font-weight: var(--editable-table-light-weight, 200);
      color: var(--editable-table-color, #222);
      background-color: var(
        --editable-table-bg-color,
        var(--ddd-theme-default-white, #fff)
      );
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
    .tr {
      display: table-row;
    }
    .th-or-td {
      display: table-cell;
    }
    .thead-tr .th,
    .thead-tr .th .icon-container {
      background-color: var(
        --editable-table-heading-bg-color,
        var(--ddd-theme-default-limestoneLight, #e0e0e0)
      );
      font-weight: var(--editable-table-heavy-weight, 600);
      color: var(
        --editable-table-heading-color,
        var(--ddd-theme-default-coalyGray, #000)
      );
    }
    .tbody-tr .th,
    .tbody-tr .th .icon-container {
      font-weight: var(--editable-table-heavy-weight, 600);
      color: var(
        --editable-table-heading-color,
        var(--ddd-theme-default-coalyGray, #000)
      );
      background-color: var(
        --editable-table-bg-color,
        var(--ddd-theme-default-white, #fff)
      );
      text-align: left;
    }
    *[bordered] .th,
    *[bordered] .td {
      border-width: var(--editable-table-border-width, 1px);
      border-style: var(--editable-table-border-style, solid);
      border-color: var(
        --editable-table-border-color,
        var(--ddd-theme-default-coalyGray, #999)
      );
    }
    *[condensed] {
      --editable-table-cell-vertical-padding: var(
        --editable-table-cell-vertical-padding-condensed,
        2px
      );
      --editable-table-cell-horizontal-padding: var(
        --editable-table-cell-horizontal-padding-condensed,
        4px
      );
    }
    *[striped] .tbody-tr:nth-child(2n + 1) .th-or-td,
    *[striped] .tbody-tr:nth-child(2n + 1) .th-or-td .icon-container {
      background-color: var(
        --editable-table-stripe-bg-color,
        var(--ddd-theme-default-limestoneMaxLight, #f0f0f0)
      );
    }
    *[column-striped] .tbody-tr .th-or-td:nth-child(2n),
    *[column-striped] .tbody-tr .th-or-td:nth-child(2n) .icon-container,
    *[column-striped] .tfoot-tr .th-or-td:nth-child(2n),
    *[column-striped] .tfoot-tr .th-or-td:nth-child(2n) .icon-container {
      background-color: var(
        --editable-table-stripe-bg-color,
        var(--ddd-theme-default-limestoneMaxLight, #f0f0f0)
      );
    }
    .tfoot-tr .th,
    .tfoot-tr .td {
      border-top: 2px solid var(--editable-table-color, #222);
      font-weight: var(--editable-table-heavy-weight, 600);
      color: var(
        --editable-table-heading-color,
        var(--ddd-theme-default-coalyGray, #000)
      );
    }
    caption,
    .th-or-td {
      text-align: left;
    }
    *[numeric-styles] .thead-tr .th-or-td[numeric],
    *[numeric-styles] .tfoot-tr .th-or-td[numeric],
    *[numeric-styles] .th-or-td[numeric] .cell {
      text-align: right;
      --editable-table-cell-justify: flex-end;
    }
    *[numeric-styles] .tfoot-tr .th-or-td[negative],
    *[numeric-styles] .td[negative] .cell {
      color: var(--editable-table-negative-color, red);
      --editable-table-cell-color: var(--editable-table-negative-color, red);
    }
    editable-table-display ::slotted(table) {
      display: none;
    }
    @media screen {
      :host {
        width: 100%;
        max-width: 100%;
      }
      :host([responsive]) {
        overflow-x: visible;
      }
    }
  `,
];

/**
 * styling for table in display mode
 * @const
 * @default
 * @type {array}
 */
export const editableTableDisplayStyles = [
  ...editableTableStyles,
  css`
    caption {
      padding-top: var(--editable-table-cell-vertical-padding, 10px);
      padding-bottom: var(--editable-table-cell-vertical-padding, 10px);
      padding: 0;
    }
    caption > div {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }
    caption > div > div {
      flex: 1 1 auto;
    }
    caption > div > div:last-child {
      flex: 0 0 auto;
    }
    caption button {
      padding: 2px;
      margin: 0;
    }
    .column {
      width: calc(var(--simple-picker-option-size) + 6px);
      overflow: visible;
      display: none;
      margin-right: 0px;
      --simple-picker-border-width: 1px;
      --simple-picker-focus-border-width: 1px;
      --simple-picker-border-color: var(
        --editable-table-border-color,
        var(--ddd-theme-default-coalyGray, #999)
      );
    }
    .th,
    .td {
      padding: var(
          --editable-table-cell-vertical-padding,
          var(--ddd-spacing-3, 10px)
        )
        var(--editable-table-cell-horizontal-padding, var(--ddd-spacing-2, 6px));
    }
    span.cell {
      display: block;
    }
    @media screen {
      :host([responsive][responsive-size="xs"]) .column {
        display: inline-flex;
        width: 30px;
        overflow: visible;
      }
      :host([responsive][responsive-size="xs"]) .th[xs-hidden],
      :host([responsive][responsive-size="xs"]) .td[xs-hidden] {
        display: none;
      }
    }
  `,
];
/**
 * List of display-only properties
 * @const
 * @default
 * @type {object}
 */
export const displayProperties = {
  /**
   * Add borders to table and table cells.
   */
  bordered: {
    attribute: "bordered",
    type: Boolean,
  },
  /**
   * Is striped add alternating column striping.
   */
  columnStriped: {
    attribute: "column-striped",
    type: Boolean,
  },
  /**
   * Condense height of table cells.
   */
  condensed: {
    attribute: "condensed",
    type: Boolean,
  },
  /**
   * Is table in edit-mode? Default is false (display mode).
   */
  disabled: {
    type: Boolean,
    attribute: "disabled",
    reflect: true,
  },
  /**
   * Is table in edit-mode? Default is false (display mode).
   */
  hidden: {
    type: Boolean,
    attribute: "hidden",
    reflect: true,
  },
  /**
   * Right-align numeric values and indicate negative values as red text
   */
  numericStyles: {
    attribute: "numeric-styles",
    type: Boolean,
    reflect: true,
  },
  /**
   * When table is wider than screens,
   * users will select a column to display
   * instead of scrolling across table.
   */
  responsive: {
    attribute: "responsive",
    type: Boolean,
    reflect: true,
  },
  /**
   * Add alternating row striping.
   */
  striped: {
    attribute: "striped",
    type: Boolean,
  },
};
/**
 * List of display-only properties
 * @const
 * @default
 * @type {object}
 */
export const editProperties = {
  /**
   * text editor config
   */
  config: {
    type: Array,
  },
  /**
   * Hide borders table styles menu option
   */
  hideBordered: {
    type: Boolean,
    attribute: "hide-bordered",
  },
  /**
   * Hide condensed table styles menu option
   */
  hideCondensed: {
    type: Boolean,
    attribute: "hide-condensed",
  },
  /**
   * Hide downloadable menu option
   */
  hideDownloadable: {
    type: Boolean,
    attribute: "hide-downloadable",
  },
  /**
   * Hide filtering option.
   */
  hideFilter: {
    type: Boolean,
    attribute: "hide-filter",
  },
  /**
   * Hide numeric styling option.
   */
  hideNumericStyles: {
    type: Boolean,
    attribute: "hide-numeric-styles",
  },
  /**
   * Hide printable menu option
   */
  hidePrintable: {
    type: Boolean,
    attribute: "hide-printable",
  },
  /**
   * Hide responsive table styles menu option
   */
  hideResponsive: {
    type: Boolean,
    attribute: "hide-responsive",
  },
  /**
   * Hide sorting option.
   */
  hideSort: {
    type: Boolean,
    attribute: "hide-sort",
  },
  /**
   * Hide striped table styles menu option
   */
  hideStriped: {
    type: Boolean,
    attribute: "hide-striped",
  },
};
/**
 * List of data manipulation properties
 * @const
 * @default
 * @type {object}
 */
export const dataProperties = {
  /**
   * Allow table to be downloaded as CSV
   */
  downloadable: {
    attribute: "downloadable",
    type: Boolean,
    reflect: true,
  },
  /**
   * Enable filtering by cell value.
   */
  filter: {
    attribute: "filter",
    type: Boolean,
    reflect: true,
  },
  /**
   * Allow table to be printed
   */
  printable: {
    attribute: "printable",
    type: Boolean,
    reflect: true,
  },
  /**
   * Enable sorting by column header.
   */
  sort: {
    attribute: "sort",
    type: Boolean,
    reflect: true,
  },
};
/**
 * List of data table html
 * @const
 * @default
 * @type {object}
 */
export const tableHtmlProperties = {
  /**
   * a table caption
   */
  caption: {
    type: String,
  },
  /**
   * Display first row as a column header.
   */
  columnHeader: {
    attribute: "column-header",
    type: Boolean,
  },
  /**
   * Raw data pulled in from csv file.
   */
  csvData: {
    type: String,
    attribute: "csv-data",
  },
  /**
   * raw data
   */
  data: {
    type: Array,
  },
  /**
   * Location of CSV file.
   */
  dataCsv: {
    type: String,
    attribute: "data-csv",
  },
  /**
   * Display last row as a column footer.
   */
  footer: {
    attribute: "footer",
    type: Boolean,
  },
  /**
   * Display first column as a row header.
   */
  rowHeader: {
    attribute: "row-header",
    type: Boolean,
  },
};

/**
 * behaviors needed to display table in either mode
 * @class
 * @customElement
 */
export const displayBehaviors = function (SuperClass) {
  return class extends SuperClass {
    static get properties() {
      return {
        ...super.properties,
        ...displayProperties,
        ...dataProperties,
        ...tableHtmlProperties,
      };
    }

    constructor() {
      super();
      this.disabled = false;
      this.hidden = false;
      this.columnHeader = false;
      this.downloadable = false;
      this.data = [];
      this.filter = false;
      this.footer = false;
      this.rowHeader = false;
      this.sort = false;
      this.dataCsv = undefined;
      Object.keys(displayProperties).forEach((key) => {
        this[key] = false;
      });
      this.fetchData();
    }

    connectedCallback() {
      super.connectedCallback();
      setTimeout(() => {
        if (!this.dataCsv) this.loadSlottedTable();
        this.__ready = true;
      }, 0);
    }

    firstUpdated(changedProperties) {
      if (super.firstUpdated) super.firstUpdated(changedProperties);
      this.fetchData();
    }

    updated(changedProperties) {
      if (super.updated) super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "dataCsv" && this[propName]) this.fetchData();
        if (propName === "csvData") this._loadExternalData();
        if (propName === "striped" && this.striped) this.columnStriped = false;
        if (propName === "columnStriped" && this.columnStriped)
          this.striped = false;
        if (propName == "data") this._dataChanged(this.data, oldValue);
      });
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
        this.footer ? (this.data || []).length - 1 : (this.data || []).length,
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

    /**
     * converts csv string to array
     * @param {string} text CSV string
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
     * makes toggle focusable
     */
    focus() {
      let query =
          "simple-toolbar-button,rich-text-editor,rich-text-editor-rowcol,editable-table-filter,editable-table-sort",
        target =
          this.shadowRoot && this.shadowRoot.querySelector(query)
            ? this.shadowRoot.querySelector(query)
            : undefined;
      if (target)
        setTimeout(function () {
          target.focus();
        }, 0);
    }
    /**
     * gets table CSV as download
     * @param {string} the title of the media
     */
    download() {
      let a = globalThis.document.createElement("a"),
        title =
          this.downloadable && this.caption.trim() != ""
            ? `Table as CSV`
            : `${this.caption} CSV`,
        filename = title.replace(/[^\w\d]/g, ""),
        data = this.getTableCSV();
      a.setAttribute(
        "href",
        "data:text/plain;charset=UTF-8," + encodeURIComponent(data),
      );
      a.setAttribute("download", filename + ".csv");
      a.style.display = "none";
      globalThis.document.body.appendChild(a);
      a.click();
      globalThis.document.body.removeChild(a);

      /**
       * Fires when transcript is printed
       * @event csv-downloaded
       */
      this.dispatchEvent(
        new CustomEvent("csv-downloaded", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            table: this,
            data: data,
            filename: filename,
          },
        }),
      );
    }

    /**
     * prints the active transcript
     * @param {string} the title of the media
     */
    print() {
      let table = !this.shadowRoot
          ? false
          : this.shadowRoot.querySelector("table"),
        print = !table
          ? false
          : globalThis.open(
              "",
              "",
              "left=0,top=0,width=552,height=477,toolbar=0,scrollbars=0,status=0",
            );
      if (print) {
        print.document.head.innerHTML += `<style>
          ${editableTableDisplayStyles
            .map((s) => s.cssText.replace(/:host/g, "table"))
            .join(" ")}
          table {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        </style>`;
        print.document.body.innerHTML = this.getTableHTML(true);
        print.document.close();
        print.focus();
        print.print();
        print.addEventListener("afterprint", (event) => {
          print.close();
        });
      }

      /**
       * Fires when transcript is printed
       * @event transcript-printed
       */
      this.dispatchEvent(
        new CustomEvent("table-printed", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: this,
        }),
      );
    }

    /**
     * fetches data from a csv file
     *
     */
    fetchData() {
      if (this.dataCsv && this.dataCsv !== "") {
        // typical use-case
        fetch(this.dataCsv)
          .then((response) => response.text())
          .then((data) => {
            this.csvData = data;
            // unset the fetch so that we don't continually do this. This is a more advanced quick backdoor as opposed to data
            // that we should be storing for any reason
            this.dataCsv = null;
          })
          .catch((err) => {
            this.loadSlottedTable();
          });
      }
    }

    /**
     * Return table data as plain CSV
     * @returns {string} for CSV
     */
    getTableCSV() {
      return this.data
        .map((row) => {
          return row
            .map((cell) => {
              cell = this._replaceBlankCell(cell);
              return this._isNumericCell(cell)
                ? cell.replace(/,/g, "")
                : `\"${cell.replace(/"/g, '""')}\"`;
            })
            .join(",");
        })
        .join("\n");
    }

    /**
     * converts str string into HTML
     *
     * @param {string} str html as string
     * @returns {html}
     */
    getHTML(str = " ") {
      this.__tempDiv =
        this.__tempDiv || globalThis.document.createElement("template");
      this.__tempDiv.innerHTML = str;
      let temp = this.__tempDiv.content.cloneNode(true);
      return temp;
    }

    /**
     * Return table as plain HTML
     * @returns {string} HTML for table
     */
    getTableHTML(addStyleClasses = false, asNode = false) {
      let headers = [],
        body = [],
        footer = [];
      let getTR = (tr, open = "td", close = "td", type = "tbody") => {
        let th = this.rowHeader ? tr.slice(0, 1) : [],
          td = this.rowHeader ? tr.slice(1) : tr;
        return `\n\t\t<tr${
          !addStyleClasses ? "" : ` class="${type}-tr tr"`
        }>${th
          .map((cell) => {
            return `\n\t\t\t<th scope="row"${
              !addStyleClasses ? "" : ` class="${close} th-or-td"`
            }>${this._replaceBlankCell(cell)}</th>`;
          })
          .join("")}${td
          .map((cell) => {
            return `\n\t\t\t<${open}${
              !addStyleClasses ? "" : ` class="${close} th-or-td"`
            }>${this._replaceBlankCell(cell)}</${close}>`;
          })
          .join("")}\n\t\t</tr>`;
      };
      if (this.thead) {
        headers = this.thead.map((tr) => {
          return getTR(tr, `th scope="col"`, `th`, "thead");
        });
      }
      if (this.tbody) {
        body = this.tbody.map((tr) => {
          return getTR(tr);
        });
      }
      if (this.tfoot) {
        footer = this.tfoot.map((tr) => {
          return getTR(tr, "td", "td", "tfoot");
        });
      }
      let props = this.getTableProperties();
      let attr = "";
      Object.keys(this.getTableProperties()).forEach((i) => {
        if (
          props[i] &&
          (Object.keys(displayProperties).includes(i) ||
            Object.keys(dataProperties).includes(i))
        ) {
          let kebabize = (str) => {
            return str
              .split("")
              .map((letter, idx) => {
                return letter.toUpperCase() === letter
                  ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}`
                  : letter;
              })
              .join("");
          };
          attr += `${kebabize(i)} `;
        }
      });
      let response = [
        `<table ${attr}>`,
        this.caption &&
        this.caption !== "" &&
        this.caption !== null &&
        this.caption !== "null" &&
        this.caption !== "undefined"
          ? `\n\t<caption${!addStyleClasses ? "" : ` class="caption"`}>\n\t\t${
              this.caption
            }\n\t</caption>`
          : "",
        headers.length > 0
          ? `\n\t<thead${
              !addStyleClasses ? "" : ` class="thead"`
            }>${headers.join("")}\n\t</thead>`
          : "",
        body.length > 0
          ? `\n\t<tbody${!addStyleClasses ? "" : ` class="tbody"`}>${body.join(
              "",
            )}\n\t</tbody>`
          : "",
        footer.length > 0
          ? `\n\t<tfoot${
              !addStyleClasses ? "" : ` class="tfoot"`
            }>${footer.join("")}\n\t</tfoot>`
          : "",
        "\n</table>",
      ].join("");
      // allow response as a DOM node
      if (asNode) {
        let div = globalThis.document.createElement("div");
        div.innerHTML = response;
        return div.querySelector("table");
      }
      return response;
    }

    /**
     * return HTML object of table data
     * @returns {object} HTML object for managed table
     */
    getTableHTMLNode() {
      let n = globalThis.document.createElement("editable-table-display");
      // replicate values that we had previously so they get reflected back into DOM
      let props = this.getTableProperties();
      for (var i in props) {
        n[i] = props[i];
      }
      n.innerHTML = this.getTableHTML();
      return n;
    }
    /**
     * Return table data and configuration
     * @returns {object} an object with all table data and configurations
     */
    getTableProperties() {
      let data = {
        bordered: !this.hideBordered && this.bordered,
        caption: this.caption,
        columnHeader: this.columnHeader,
        columnStriped: this.columnStriped,
        condensed: !this.hideCondensed && this.condensed,
        data: this.data,
        downloadable: this.downloadable,
        filter: !this.hideFilter && this.filter,
        footer: this.footer,
        numericStyles: this.numericStyles,
        printable: this.printable,
        rowHeader: this.rowHeader,
        responsive: !this.hideResponsive && this.responsive,
        sort: !this.hideSort && this.sort,
        striped: !this.hideStriped && this.striped,
        summary: this.summary,
      };
      return data;
    }
    /**
     * imports table HTML as data
     * @param {HTMLElement} table table element
     */
    importHTML(table) {
      let spans = [],
        data = [...table.querySelectorAll("tr")].map((row, rownum) => {
          return [...row.querySelectorAll("th,td")].map((cell, colnum) => {
            let celltype = cell.matches("th") ? "th" : "td",
              colspan = cell.matches("[colspan]")
                ? cell.getAttribute("colspan")
                : false,
              rowspan = cell.matches("[rowspan]")
                ? cell.getAttribute("rowspan")
                : false;
            if (colspan || rowspan) {
              spans.push({
                type: celltype,
                row: rownum,
                col: colnum,
                rows:
                  rowspan && rowspan.trim() !== ""
                    ? parseInt(rowspan.trim())
                    : undefined,
                cols:
                  colspan && colspan.trim() !== ""
                    ? parseInt(colspan.trim())
                    : undefined,
              });
            }
            return typeof cell.innerHTML === "string"
              ? cell.innerHTML.trim()
              : cell.innerHTML;
          });
        });
      //removes colspans and row spans
      spans.forEach((span) => {
        if (span.cols)
          for (let i = 1; i < span.cols; i++) {
            data[span.row].splice(span.col + 1, 0, "&nbsp;");
          }
        if (span.rows)
          for (let i = 1; i < span.rows; i++)
            data[span.row + 1].splice(span.col, 0, "&nbsp;");
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

      Object.keys(displayProperties).forEach((key) => {
        if (table.matches(`.${displayProperties[key].attribute || key}`))
          this[key] = true;
      });
    }

    /**
     * loads table data from slotted HTML
     *
     * @memberof EditableTable
     */
    loadSlottedTable() {
      let table = this.children.item(0);
      // support wrapping editable-table-display tag or primative
      if (table && table.tagName === "EDITABLE-TABLE-DISPLAY") {
        table = table.children.item(0);
      }
      if (
        !!table &&
        table.tagName === "TABLE" &&
        table.children &&
        table.children.length > 0
      ) {
        this.importHTML(table);
      }
    }

    /**
     * Fires when data changed
     * @event change
     * @param {event} event
     */
    _dataChanged(newValue, oldValue) {
      /*if (
        this.__ready &&
        (!newValue || newValue.length < 1 || newValue[0].length < 1)
      ) {
        this.loadSlottedTable();
      }*/
    }

    /**
     * Sets a cell's negative number style
     * @param {string} cell cell contents
     * @returns {boolean} whether cell contents are numeric and negative
     */
    _isNegative(cell) {
      return this._isNumericCell(cell) && cell.trim().indexOf("-") === 0;
    }

    /**
     * Sets a cell's numeric style
     * @param {string} cell cell contents
     * @returns {boolean} whether cell contents are numeric
     */
    _isNumericCell(cell) {
      return !!cell && !isNaN(cell.trim().replace(/\$/g, ""));
    }

    /**
     * Determines if an entire body column dontains numeric data
     * @param {number} index column index
     * @returns {boolean} if columns contents are numeric
     */
    _isNumericColumn(index) {
      let numeric = true;
      for (let i = 0; i < this.tbody.length; i++) {
        if (!this._isNumericCell(this.tbody[i][index])) numeric = false;
      }
      return numeric;
    }

    /**
     * Hides a row if filtered
     *
     * @param {array} tr array of cells
     * @returns {boolean} whether row is filtered
     * @memberof EditableTableDisplay
     */
    _isRowFiltered(tr) {
      let filter = (this.filterText || "").trim(),
        cellText = this.filterColumn && tr ? tr[this.filterColumn].trim() : "",
        filtered;
      if (!this.filterCaseSensitive) {
        filter = filter.toLowerCase();
        cellText = cellText.toLowerCase();
      }
      filtered = this.filterContains
        ? !cellText.match(filter)
        : cellText !== filter;
      return filtered;
    }

    /**
     * Calculates whether cell is a `<th>` or `<td>`
     * @param {boolean} rowHeader if cell is a rowheader
     * @param {number} index current column number
     * @returns {boolean} whether cell is a `<th>` or `<td>`
     */
    _isRowHeader(rowHeader, index) {
      return index === 0 && rowHeader;
    }
    /**
     * Convert from csv text to an array in table function
     */
    _loadExternalData(e) {
      let data = this.CSVtoArray(this.csvData);
      if (data.length > 0 && data[0].length > 0) this.data = data;
      this.columnHeader = true;
    }
    /**
     * replaces a blank cell with "-" for accessibility
     * @param {string} cell cell contents
     * @returns {string} cell contents or "-" if empty
     */
    _replaceBlankCell(cell) {
      return String(cell).trim() === "" ? "-" : cell;
    }
  };
};

/**
 * behaviors needed to display table in either mode
 * @class
 * @extends displayBehaviors
 * @customElement
 */
export const editBehaviors = function (SuperClass) {
  return class extends displayBehaviors(SuperClass) {
    static get properties() {
      return {
        ...super.properties,
        ...editProperties,
      };
    }

    constructor() {
      super();
      this.hidden = false;
      this.disabled = false;
      this.hideBordered = false;
      this.hideCondensed = false;
      this.hideDownloadable = false;
      this.hideFilter = false;
      this.hideResponsive = false;
      this.hidePrintable = false;
      this.hideSort = false;
      this.caption = "";
      this.hideStriped = false;
      this.config = [
        {
          type: "button-group",
          buttons: [
            {
              command: "close",
              icon: "close",
              label: "Close toolbar",
              toggles: false,
              type: "rich-text-editor-button",
            },
          ],
        },
        {
          type: "button-group",
          buttons: [
            {
              command: "bold",
              icon: "editor:format-bold",
              label: "Bold",
              toggles: true,
              type: "rich-text-editor-button",
            },
            {
              command: "italic",
              icon: "editor:format-italic",
              label: "Italics",
              toggles: true,
              type: "rich-text-editor-button",
            },
            {
              command: "removeFormat",
              icon: "editor:format-clear",
              label: "Erase Format",
              type: "rich-text-editor-button",
            },
          ],
        },
        {
          type: "button-group",
          buttons: [
            {
              command: "link",
              icon: "link",
              label: "Link",
              toggledCommand: "unlink",
              toggledIcon: "mdextra:unlink",
              toggledLabel: "Unink",
              toggles: true,
              type: "rich-text-editor-link",
            },
          ],
        },
        {
          label: "Subscript and Superscript",
          buttons: [
            {
              command: "subscript",
              icon: "mdextra:subscript",
              label: "Subscript",
              toggles: true,
              type: "rich-text-editor-button",
            },
            {
              command: "superscript",
              icon: "mdextra:superscript",
              label: "Superscript",
              toggles: true,
              type: "rich-text-editor-button",
            },
          ],
        },
      ];
    }
  };
};

/**
 * behaviors needed for table cells, row headers, and columns
 * @class
 * @customElement
 */
export const cellBehaviors = function (SuperClass) {
  return class extends SuperClass {
    /**
     * Get row or column label
     * @param {number} index of row or column
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
     * @param {number} index of row or column
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
