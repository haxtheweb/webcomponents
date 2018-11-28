define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/iron-icons/iron-icons.js",
  "./node_modules/@polymer/paper-input/paper-input.js",
  "./node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "./lib/simple-search-content.js"
], function(
  _exports,
  _polymerLegacy,
  _ironIcons,
  _paperInput,
  _paperTooltip,
  _simpleSearchContent
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.SimpleSearch = void 0;
  function _templateObject_8b547a00f32c11e8939f89fb6f7f8da7() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n  <custom-style>\n    <style is="custom-style">\n      :host {\n        display: flex;\n        align-items: flex-end;\n        justify-content: space-between;\n        width: 100%;\n      }\n      :host #input {\n        flex-grow: 2;\n        margin-right: 4px;\n        --paper-input-container-input-color: var(--simple-search-input-text-color, #000);\n        --paper-input-container-focus-color: var(--simple-search-input-line-color, #000);\n        --paper-input-container-color: var(--simple-search-input-placeholder-color, #222);\n        color: var(--simple-search-input-placeholder-color, #222);\n        @apply --simple-search-container;\n      }\n      :host #xofy {\n        margin: 8px;\n      }\n      :host button {\n        margin: 8px 0 8px;\n        color: var(--simple-search-button-color, #111);\n        background-color: var(--simple-search-button-bg-color, #eee);\n        border-color: var(--simple-search-button-border-color, #ccc);\n        @apply --simple-search-button;\n      }\n      :host button:not([disabled]):focus,\n      :host button:not([disabled]):hover {\n        cursor: pointer;\n        color: var(--simple-search-button-hover-color, #000);\n        background-color: var(--simple-search-button-hover-bg-color, #fff);\n        border-color: var(--simple-search-button-hover-border-color, #ddd);\n        @apply --simple-search-button-hover;\n      }\n      :host button[disabled] {\n        cursor: not-allowed;\n        color: var(--simple-search-button-disabled-color, #999);\n        background-color: var(--simple-search-button-disabled-bg-color, #eee);\n        border-color: var(--simple-search-button-disabled-border-color, #ccc);\n        @apply --simple-search-button-disabled;\n      }\n      :host button:not([controls]) {\n        display: none;\n      }\n      :host [shrink-hide] {\n        display: none;\n      }\n    </style>\n    </custom-style>\n    <paper-input id="input" always-float-label$="[[alwaysFloatLabel]]" label="[[searchInputLabel]]" no-label-float$="[[noLabelFloat]]">\n      <iron-icon icon="[[searchInputIcon]]" slot="prefix"></iron-icon>\n    </paper-input>\n    <div id="xofy" shrink-hide$="[[noSearch]]"></div>\n    <div shrink-hide$="[[noResults]]">\n      <button id="prev" aria-label="[[prevButtonLabel]]" aria-role="button" controls$="[[controls]]" disabled$="[[prevButtonDisabled]]" tabindex="0">\n        <iron-icon icon="[[prevButtonIcon]]"></iron-icon>\n      </button>\n      <paper-tooltip for="prev">[[prevButtonLabel]]</paper-tooltip>\n      <button id="next" aria-label="[[nextButtonLabel]]" aria-role="button" controls$="[[controls]]" disabled$="[[nextButtonDisabled]]" tabindex="0">\n        <iron-icon icon$="[[nextButtonIcon]]"></iron-icon>\n      </button>\n      <paper-tooltip for="next">[[nextButtonLabel]]</paper-tooltip>\n    </div>\n'
      ],
      [
        '\n  <custom-style>\n    <style is="custom-style">\n      :host {\n        display: flex;\n        align-items: flex-end;\n        justify-content: space-between;\n        width: 100%;\n      }\n      :host #input {\n        flex-grow: 2;\n        margin-right: 4px;\n        --paper-input-container-input-color: var(--simple-search-input-text-color, #000);\n        --paper-input-container-focus-color: var(--simple-search-input-line-color, #000);\n        --paper-input-container-color: var(--simple-search-input-placeholder-color, #222);\n        color: var(--simple-search-input-placeholder-color, #222);\n        @apply --simple-search-container;\n      }\n      :host #xofy {\n        margin: 8px;\n      }\n      :host button {\n        margin: 8px 0 8px;\n        color: var(--simple-search-button-color, #111);\n        background-color: var(--simple-search-button-bg-color, #eee);\n        border-color: var(--simple-search-button-border-color, #ccc);\n        @apply --simple-search-button;\n      }\n      :host button:not([disabled]):focus,\n      :host button:not([disabled]):hover {\n        cursor: pointer;\n        color: var(--simple-search-button-hover-color, #000);\n        background-color: var(--simple-search-button-hover-bg-color, #fff);\n        border-color: var(--simple-search-button-hover-border-color, #ddd);\n        @apply --simple-search-button-hover;\n      }\n      :host button[disabled] {\n        cursor: not-allowed;\n        color: var(--simple-search-button-disabled-color, #999);\n        background-color: var(--simple-search-button-disabled-bg-color, #eee);\n        border-color: var(--simple-search-button-disabled-border-color, #ccc);\n        @apply --simple-search-button-disabled;\n      }\n      :host button:not([controls]) {\n        display: none;\n      }\n      :host [shrink-hide] {\n        display: none;\n      }\n    </style>\n    </custom-style>\n    <paper-input id="input" always-float-label\\$="[[alwaysFloatLabel]]" label="[[searchInputLabel]]" no-label-float\\$="[[noLabelFloat]]">\n      <iron-icon icon="[[searchInputIcon]]" slot="prefix"></iron-icon>\n    </paper-input>\n    <div id="xofy" shrink-hide\\$="[[noSearch]]"></div>\n    <div shrink-hide\\$="[[noResults]]">\n      <button id="prev" aria-label="[[prevButtonLabel]]" aria-role="button" controls\\$="[[controls]]" disabled\\$="[[prevButtonDisabled]]" tabindex="0">\n        <iron-icon icon="[[prevButtonIcon]]"></iron-icon>\n      </button>\n      <paper-tooltip for="prev">[[prevButtonLabel]]</paper-tooltip>\n      <button id="next" aria-label="[[nextButtonLabel]]" aria-role="button" controls\\$="[[controls]]" disabled\\$="[[nextButtonDisabled]]" tabindex="0">\n        <iron-icon icon\\$="[[nextButtonIcon]]"></iron-icon>\n      </button>\n      <paper-tooltip for="next">[[nextButtonLabel]]</paper-tooltip>\n    </div>\n'
      ]
    );
    _templateObject_8b547a00f32c11e8939f89fb6f7f8da7 = function _templateObject_8b547a00f32c11e8939f89fb6f7f8da7() {
      return data;
    };
    return data;
  }
  var SimpleSearch = (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_8b547a00f32c11e8939f89fb6f7f8da7()
    ),
    is: "simple-search",
    properties: {
      alwaysFloatLabel: { type: Boolean, value: !1 },
      caseSensitive: { type: Boolean, value: null },
      controls: { type: String, value: null },
      nextButtonDisabled: {
        type: Boolean,
        computed:
          "_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,1)"
      },
      nextButtonIcon: { type: String, value: "arrow-forward" },
      nextButtonLabel: { type: String, value: "next result" },
      noLabelFloat: { type: Boolean, value: !1 },
      noResults: { type: Boolean, computed: "_hasNoResults(resultCount)" },
      noSearch: { type: Boolean, computed: "_hasNoSearch(searchTerms)" },
      prevButtonDisabled: {
        type: Boolean,
        computed:
          "_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,-1)"
      },
      prevButtonIcon: { type: String, value: "arrow-back" },
      prevButtonLabel: { type: String, value: "previous result" },
      resultCount: { type: Number, value: 0 },
      resultPointer: { type: Number, value: 0 },
      resultsSpan: {
        type: String,
        computed: "_getResultsSpan(noSearch,resultPointer,resultCount)"
      },
      searchInputIcon: { type: String, value: "search" },
      searchInputLabel: { type: String, value: "search" },
      searchTerms: { type: Array, value: [] },
      target: { type: Object, value: null }
    },
    ready: function ready() {
      var root = this,
        search = root.$.input;
      root._getSearchText(search.value);
      root.addEventListener("change", function(e) {
        root._getSearchText(search.value);
        root.resultCount = 0;
        root.resultPointer = 0;
        root.fire("search", root);
      });
      root.$.prev.addEventListener("tap", function(e) {
        root._navigateResults(-1);
      });
      root.$.next.addEventListener("tap", function(e) {
        root._navigateResults(1);
      });
    },
    _hasNoResults: function _hasNoResults(resultCount) {
      return 1 > resultCount;
    },
    _hasNoSearch: function _hasNoSearch(searchTerms) {
      return 1 > searchTerms.length;
    },
    _getResultsSpan: function _getResultsSpan(
      noSearch,
      resultPointer,
      resultCount
    ) {
      var html = "";
      if (0 < resultCount && 0 < resultPointer) {
        html = resultPointer + "/" + resultCount;
      } else {
        html = " " + resultCount;
      }
      this.$.xofy.innerHTML = html;
      return this.$.xofy.innerHTML;
    },
    _navigateResults: function _navigateResults(increment) {
      if (
        0 < this.resultPointer + increment &&
        this.resultPointer + increment <= this.resultCount
      ) {
        this.resultPointer += increment;
        this.fire("goto-result", this.resultPointer);
      }
    },
    _isNavButtonDisabled: function _isNavButtonDisabled(
      resultPointer,
      resultCount,
      resultsSpan,
      increment
    ) {
      return (
        "" == resultsSpan ||
        0 >= resultPointer + increment ||
        resultPointer + increment > resultCount
      );
    },
    _getSearchText: function _getSearchText(find) {
      var temp = [];
      if (find !== void 0 && null !== find) {
        temp = find.split(/[\"\']/gm);
        for (var i = 0; i < temp.length; i++) {
          temp[i] = temp[i].trim();
          if ("" === temp[i]) temp.splice(i, 1);
        }
      }
      this.set("searchTerms", temp.slice(0));
    },
    findMatches: function findMatches(content) {
      for (
        var root = this,
          terms = root.searchTerms,
          modifier = this.caseSensitive ? "gm" : "gim",
          results = content.slice(0),
          updateResults = function updateResults(find) {
            for (var i = 0; i < results.length; i++) {
              if (!1 === results[i].matched) {
                var regex = new RegExp("\\b" + find + "\\b", modifier),
                  text = results[i].text,
                  start = text.search(regex),
                  end = start + find.length;
                if (-1 < start) {
                  root.resultCount += 1;
                  var pre = text.slice(0, start),
                    match = text.slice(start, end),
                    post = text.slice(end, text.length),
                    update = results.splice(
                      i,
                      1,
                      { matched: !1, text: pre, searchObject: root },
                      {
                        matched: !0,
                        matchNumber: root.resultCount,
                        text: match,
                        searchObject: root
                      },
                      { matched: !1, text: post, searchObject: root }
                    );
                }
              }
            }
          },
          i = 0;
        i < terms.length;
        i++
      ) {
        updateResults(terms[i]);
      }
      root.resultPointer = 0;
      return results;
    }
  });
  _exports.SimpleSearch = SimpleSearch;
});
