window.editableTableBehaviors = window.editableTableBehaviors || {};
editableTableBehaviors.displayBehaviors = {
  properties: {
    bordered: { type: Boolean, value: !1 },
    caption: { type: String, value: null },
    columnHeader: { type: Boolean, value: !1, reflectToAttribute: !0 },
    condensed: { type: Boolean, value: !1, reflectToAttribute: !0 },
    data: { type: Array, value: [] },
    filter: { type: Boolean, value: !1, reflectToAttribute: !0 },
    footer: { type: Boolean, value: !1, reflectToAttribute: !0 },
    rowHeader: { type: Boolean, value: !1, reflectToAttribute: !0 },
    sort: { type: Boolean, value: !1, reflectToAttribute: !0 },
    scroll: { type: Boolean, value: !1, reflectToAttribute: !0 },
    striped: { type: Boolean, value: !1, reflectToAttribute: !0 },
    summary: { type: String, value: null }
  },
  getData: function getData() {
    var data = {
      accentColor: this.accentColor,
      bordered: !this.hideBordered ? this.bordered : null,
      caption: this.caption,
      columnHeader: this.columnHeader,
      condensed: !this.hideCondensed ? this.condensed : null,
      dark: !this.hideDark ? this.dark : null,
      data: this.data,
      filter: !this.hideFilter ? this.filter : null,
      footer: this.footer,
      rowHeader: this.rowHeader,
      scroll: !this.hideScroll ? this.scroll : null,
      sort: !this.hideSort ? this.sort : null,
      striped: !this.hideStriped ? this.striped : null,
      summary: this.summary
    };
    return data;
  }
};
window.editableTableBehaviors.cellBehaviors = {
  _getLabel: function _getLabel(index, type) {
    if ("Column" === type) {
      for (
        var numerals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
          results = this._getLetter(index)
            .split("-")
            .reverse(),
          label = "",
          i = 0;
        i < results.length;
        i++
      ) {
        if ("" !== results[i]) label += numerals[results[i]];
      }
      return label;
    } else {
      return index + 1;
    }
  },
  _getLetter: function _getLetter(index) {
    var place = Math.floor(index / 26),
      multiplier = 26 * place,
      remainder = index - multiplier,
      letters = "";
    letters += remainder + "-";
    if (0 < place && 26 > place) {
      letters += place - 1 + "-";
    } else if (26 <= place) {
      letters += this._getLetter(place - 1);
    }
    return letters;
  }
};
window.editableTableBehaviors.editBehaviors = {
  properties: {
    hideBordered: { type: Boolean, value: !1 },
    hideCondensed: { type: Boolean, value: !1 },
    hideAccentColor: { type: Boolean, value: !1 },
    hideDarkTheme: { type: Boolean, value: !1 },
    hideFilter: { type: Boolean, value: !1 },
    hideSort: { type: Boolean, value: !1 },
    hideScroll: { type: Boolean, value: !1 },
    hideStriped: { type: Boolean, value: !1 }
  }
};
