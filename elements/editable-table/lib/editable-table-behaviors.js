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
          notify: true
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
     * Return table data
     */
    getData() {
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

export const cellBehaviors = function(SuperClass) {
  return class extends SuperClass {
    /**
     * Get the row or column label
     */
    _getLabel(index, type) {
      if (type === "Column") {
        let numerals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
          results = this._getLetter(index)
            .split("-")
            .reverse(),
          label = "";
        for (let i = 0; i < results.length; i++) {
          if (results[i] !== "") label += numerals[results[i]];
        }
        return label;
      } else {
        return index + 1;
      }
    }
    /**
     * Get the row or column label
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
export const editBehaviors = function(SuperClass) {
  return class extends SuperClass {
    static get properties() {
      let props = {
        /**
         * Hide the borders table styles menu option
         */
        hideBordered: {
          type: Boolean,
          value: false
        },
        /**
         * Hide the condensed table styles menu option
         */
        hideCondensed: {
          type: Boolean,
          value: false
        },
        /**
         * Hide the filtering option.
         */
        hideFilter: {
          type: Boolean,
          value: false
        },
        /**
         * Hide the sorting option.
         */
        hideSort: {
          type: Boolean,
          value: false
        },
        /**
         * Hide the responsive table styles menu option
         */
        hideResponsive: {
          type: Boolean,
          value: false
        },
        /**
         * Hide the striped table styles menu option
         */
        hideStriped: {
          type: Boolean,
          value: false
        }
      };
      if (super.properties) {
        props = Object.assign(props, super.properties);
      }
      return props;
    }
  };
};
