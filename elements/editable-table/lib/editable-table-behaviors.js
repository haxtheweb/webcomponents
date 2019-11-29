/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * `editable-table-behaviors`
 * @customElement editable-table-behaviors
 * `A set of common behaviors for editable-table web components.`
 *
 * @polymer
 * @mixinFunction
 */

/**
 * behaviors needed to display the table in either mode
 */
export const displayBehaviors = function(SuperClass) {
  return class extends SuperClass {
    static get properties() {
      return {
        ...super.properties,

        /**
         * Add borders to table and table cells.
         */
        bordered: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true
        },
        /**
         * a table caption
         */
        caption: {
          type: String,
          value: null,
          notify: true
        },
        /**
         * Display the first row as a column header.
         */
        columnHeader: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true
        },
        /**
         * Raw data pulled in from the csv file.
         */
        csvData: {
          type: String,
          value: ""
        },
        /**
         * Condense height of table cells.
         */
        condensed: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true
        },
        /**
         * raw data
         */
        data: {
          type: Array,
          value: [],
          notify: true,
          observer: "_dataChanged"
        },
        /**
         * Location of the CSV file.
         */
        dataCsv: {
          type: String
        },
        /**
         * Enable filtering by cell value.
         */
        filter: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true
        },
        /**
         * Display the last row as a column footer.
         */
        footer: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true
        },
        /**
         * Display the first column as a row header.
         */
        rowHeader: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true
        },
        /**
         * When table is wider than screens,
         * users will select a column to display
         * instead of scrolling across the table.
         */
        responsive: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true
        },
        /**
         * Enable sorting by column header.
         */
        sort: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true
        },
        /**
         * Add alternating row striping.
         */
        striped: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          notify: true
        },
        /**
         * Columns in <thead>
         */
        thead: {
          type: Array,
          computed: "_getThead(data,columnHeader)"
        },
        /**
         * Rows in <tbody>
         */
        tbody: {
          type: Array,
          computed: "_getTbody(data,columnHeader,footer)"
        },
        /**
         * Rows in <tfoot>
         */
        tfoot: {
          type: Array,
          computed: "_getTfoot(data,footer)"
        }
      };
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
        .map(row => {
          return row
            .map(cell => {
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
     * Return table as plain HTML
     * @returns {string} the HTML for the table
     */
    getTableHTML() {
      let getTR = (tr, open = "td", close = "td") => {
          let th = this.rowHeader ? tr.slice(0, 1) : [],
            td = this.rowHeader ? tr.slice(1) : tr;
          return `\n\t\t<tr>${th
            .map(cell => {
              return `\n\t\t\t<th scope="row">${this._replaceBlankCell(
                cell
              )}</th>`;
            })
            .join("")}${td
            .map(cell => {
              return `\n\t\t\t<${open}>${this._replaceBlankCell(
                cell
              )}</${close}>`;
            })
            .join("")}\n\t\t</tr>`;
        },
        headers = this.thead.map(tr => {
          return getTR(tr, `th scope="col"`, `th`);
        }),
        body = this.tbody.map(tr => {
          return getTR(tr);
        }),
        footer = this.tfoot.map(tr => {
          return getTR(tr);
        });
      return [
        "<table>",
        this.caption !== ""
          ? `\n\t<caption>\n\t\t${this.caption}\n\t</caption>`
          : "",
        headers.length > 0 ? `\n\t<thead>${headers.join("")}\n\t</thead>` : "",
        body.length > 0 ? `\n\t<tbody>${body.join("")}\n\t</tbody>` : "",
        footer.length > 0 ? `\n\t<tfoot>${footer.join("")}\n\t</tfoot>` : "",
        "\n</table>"
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
        summary: this.summary
      };
      return data;
    }
    /**
     * imports table HTML as data
     * @param {HTMLElement} table the table element
     */
    importHTML(table) {
      let data = [].slice.call(table.querySelectorAll("tr")).map(row => {
        return [].slice.call(row.querySelectorAll("th,td")).map(cell => {
          return typeof cell.innerHTML === "string"
            ? cell.innerHTML.trim()
            : cell.innerHTML;
        });
      });
      if (data.length > 0 && data[0].length > 0) this.set("data", data);
      this.columnHeader =
        this.columnHeader || table.querySelectorAll("thead").length > 0;
      this.rowHeader =
        this.rowHeader || table.querySelectorAll("tbody th").length > 0;
      this.footer = this.footer || table.querySelectorAll("tfoot").length > 0;
      this.caption =
        this.caption !== null
          ? this.caption
          : table.querySelectorAll("caption").length > 0
          ? table.querySelector("caption").innerHTML.trim()
          : null;
    }
    /**
     * Convert from csv text to an array in the table function
     */
    _loadExternalData(e) {
      let data = this.CSVtoArray(this.csvData);
      if (data.length > 0 && data[0].length > 0) this.set("data", data);
    }

    /**
     * Gets the rows in `<tbody>`
     * @param {array} data the table data as an array
     * @param {boolean} columnHeader does the table have a column header
     * @param {boolean} footer does the table have a footer
     * @returns {array} the `<tbody>` data
     */
    _getTbody(data, columnHeader, footer) {
      if (
        data !== undefined &&
        data !== null &&
        data.length > 0 &&
        data[0].length > 0
      ) {
        let ch = columnHeader ? 1 : 0,
          ft = footer ? data.length - 1 : data.length;
        return data.slice(ch, ft);
      }
    }

    /**
     * Gets the rows in `<tbody>`
     * @param {array} data the table data as an array
     * @param {boolean} columnHeader does the table have a column header
     * @param {boolean} footer does the table have a footer
     * @returns {array} the `<tbody>` data
     */
    _getTfoot(data, footer) {
      return data.length > 0 && data[0].length > 0 && footer
        ? data.slice(data.length - 1)
        : [];
    }

    /**
     * Gets the columns in `<thead>`
     * @param {array} data the table data as an array
     * @param {boolean} columnHeader does the table have a column header
     * @returns {array} the `<thead>`data
     */
    _getThead(data, columnHeader) {
      return data.length > 0 && data[0].length > 0 && columnHeader
        ? data.slice(0, 1)
        : [];
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
export const cellBehaviors = function(SuperClass) {
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
          results = this._getLetter(index)
            .split("-")
            .reverse(),
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
