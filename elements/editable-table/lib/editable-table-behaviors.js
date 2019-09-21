/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
/**
 * `editable-table-behaviors`
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
      let props = {
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
        }
      };
      if (super.properties) {
        props = Object.assign(props, super.properties);
      }
      return props;
    }
    /**
     * Fires when data changed
     * @event change
     * @param {event} the event
     */
    _dataChanged(e) {
      this.dispatchEvent(
        new CustomEvent("change", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: e
        })
      );
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
