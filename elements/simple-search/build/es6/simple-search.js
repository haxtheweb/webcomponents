import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/iron-icons/iron-icons.js";
import "./node_modules/@polymer/paper-input/paper-input.js";
import "./node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "./lib/simple-search-content.js";
Polymer({
  _template: html`
  <custom-style>
    <style is="custom-style">
      :host {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        width: 100%;
      }
      :host #input {
        flex-grow: 2;
        margin-right: 4px;
        --paper-input-container-input-color: var(--simple-search-input-text-color, #000);
        --paper-input-container-focus-color: var(--simple-search-input-line-color, #000);
        --paper-input-container-color: var(--simple-search-input-placeholder-color, #222);
        color: var(--simple-search-input-placeholder-color, #222);
        @apply --simple-search-container;
      }
      :host #xofy {
        margin: 8px;
      }
      :host button {
        margin: 8px 0 8px;
        color: var(--simple-search-button-color, #111);
        background-color: var(--simple-search-button-bg-color, #eee);
        border-color: var(--simple-search-button-border-color, #ccc);
        @apply --simple-search-button;
      }
      :host button:not([disabled]):focus,
      :host button:not([disabled]):hover {
        cursor: pointer;
        color: var(--simple-search-button-hover-color, #000);
        background-color: var(--simple-search-button-hover-bg-color, #fff);
        border-color: var(--simple-search-button-hover-border-color, #ddd);
        @apply --simple-search-button-hover;
      }
      :host button[disabled] {
        cursor: not-allowed;
        color: var(--simple-search-button-disabled-color, #999);
        background-color: var(--simple-search-button-disabled-bg-color, #eee);
        border-color: var(--simple-search-button-disabled-border-color, #ccc);
        @apply --simple-search-button-disabled;
      }
      :host button:not([controls]) {
        display: none;
      }
      :host [shrink-hide] {
        display: none;
      }
    </style>
    </custom-style>
    <paper-input id="input" always-float-label\$="[[alwaysFloatLabel]]" label="[[searchInputLabel]]" no-label-float\$="[[noLabelFloat]]">
      <iron-icon icon="[[searchInputIcon]]" slot="prefix"></iron-icon>
    </paper-input>
    <div id="xofy" shrink-hide\$="[[noSearch]]"></div>
    <div shrink-hide\$="[[noResults]]">
      <button id="prev" aria-label="[[prevButtonLabel]]" aria-role="button" controls\$="[[controls]]" disabled\$="[[prevButtonDisabled]]" tabindex="0">
        <iron-icon icon="[[prevButtonIcon]]"></iron-icon>
      </button>
      <paper-tooltip for="prev">[[prevButtonLabel]]</paper-tooltip>
      <button id="next" aria-label="[[nextButtonLabel]]" aria-role="button" controls\$="[[controls]]" disabled\$="[[nextButtonDisabled]]" tabindex="0">
        <iron-icon icon\$="[[nextButtonIcon]]"></iron-icon>
      </button>
      <paper-tooltip for="next">[[nextButtonLabel]]</paper-tooltip>
    </div>
`,
  is: "simple-search",
  properties: {
    alwaysFloatLabel: { type: Boolean, value: !1 },
    caseSensitive: { type: Boolean, value: null },
    controls: { type: String, value: null },
    nextButtonDisabled: {
      type: Boolean,
      computed: "_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,1)"
    },
    nextButtonIcon: { type: String, value: "arrow-forward" },
    nextButtonLabel: { type: String, value: "next result" },
    noLabelFloat: { type: Boolean, value: !1 },
    noResults: { type: Boolean, computed: "_hasNoResults(resultCount)" },
    noSearch: { type: Boolean, computed: "_hasNoSearch(searchTerms)" },
    prevButtonDisabled: {
      type: Boolean,
      computed: "_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,-1)"
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
  ready: function() {
    let root = this,
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
  _hasNoResults: function(resultCount) {
    return 1 > resultCount;
  },
  _hasNoSearch: function(searchTerms) {
    return 1 > searchTerms.length;
  },
  _getResultsSpan: function(noSearch, resultPointer, resultCount) {
    let html = "";
    if (0 < resultCount && 0 < resultPointer) {
      html = resultPointer + "/" + resultCount;
    } else {
      html = " " + resultCount;
    }
    this.$.xofy.innerHTML = html;
    return this.$.xofy.innerHTML;
  },
  _navigateResults: function(increment) {
    if (
      0 < this.resultPointer + increment &&
      this.resultPointer + increment <= this.resultCount
    ) {
      this.resultPointer += increment;
      this.fire("goto-result", this.resultPointer);
    }
  },
  _isNavButtonDisabled: function(
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
  _getSearchText: function(find) {
    let temp = [];
    if (find !== void 0 && null !== find) {
      temp = find.split(/[\"\']/gm);
      for (let i = 0; i < temp.length; i++) {
        temp[i] = temp[i].trim();
        if ("" === temp[i]) temp.splice(i, 1);
      }
    }
    this.set("searchTerms", temp.slice(0));
  },
  findMatches: function(content) {
    let root = this,
      terms = root.searchTerms,
      modifier = this.caseSensitive ? "gm" : "gim",
      results = content.slice(0),
      updateResults = function(find) {
        for (let i = 0; i < results.length; i++) {
          if (!1 === results[i].matched) {
            let regex = new RegExp("\\b" + find + "\\b", modifier),
              text = results[i].text,
              start = text.search(regex),
              end = start + find.length;
            if (-1 < start) {
              root.resultCount += 1;
              let pre = text.slice(0, start),
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
      };
    for (let i = 0; i < terms.length; i++) {
      updateResults(terms[i]);
    }
    root.resultPointer = 0;
    return results;
  }
});
