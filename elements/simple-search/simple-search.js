/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./lib/simple-search-content.js";

export { SimpleSearch };
/**
 * `simple-search`
 * `A button used in simple-search`
 *
 *
 * @microcopy - the mental model for this element
 *
 * ```<simple-search
 *   case-sensitive$="[[caseSensitive]]"     // is search case sensitive?
 *   controls$="[[controls]]">
 * </simple-search>```
 *
 *   The searchTerms property provides an array of search terms entered in to the input.
 *   The findMatches function returns an array of parsed results.
 *   For example if I searched for the with
 *   `findMatches("The quick brown fox jumps over the lazy dog.")`,
 *   the array would be:
 *   ``[
 *     {
 *       "matched": true,
 *       "matchNumber": 1,
 *       "text": "The"
 *     },{
 *       "matched": false,
 *       "text": " quick brown fox jumps over "
 *     },{
 *       "matched": true,
 *       "matchNumber": 2,
 *       "text": "the"
 *     },{
 *       "matched": false,
 *       "text": " lazy dog."
 *     }
 *   ]```
 *   or `findMatches("The quick brown fox jumps over the lazy dog.",true)`,
 *   the array would be:
 *   ```[
 *     {
 *       "matched": false,
 *       "text": "The quick brown fox jumps over "
 *     },{
 *       "matched": true,
 *       "matchNumber": 1,
 *       "text": "the"
 *     },{
 *       "matched": false,
 *       "text": " lazy dog."
 *     }
 *   ]```
 *
 *   CSS Variables:
 *   For the input field...
 *   ```--paper-input-container-input-color: var(--simple-search-input-color, #111);
 *   --paper-input-container-focus-color: var(--simple-search-input-placeholder-color, #000);
 *   --paper-input-container-color: var(--simple-search-input-line-color, #fff);
 *   @apply --simple-search-container;```
 *
 *   For buttons:
 *   ```color: var(--simple-search-button-color, #111);
 *   background-color: var(--simple-search-button-bg-color, #eee);
 *   border-color: var(--simple-search-button-border-color, #ccc);
 *   @apply --simple-search-button;`
 *
 *   For buttons on hover:
 *   ```color: var(--simple-search-button-hover-color, #000);
 *   background-color: var(--simple-search-button-hover-bg-color, #fff);
 *   border-color: var(--simple-search-button-hover-border-color, #ddd);
 *   @apply --simple-search-button-hover;```
 *
 *   For disabled buttons:
 *   ```color: var(--simple-search-button-disabled-color, #666);
 *   background-color: var(--simple-search-button-disabled-bg-color, #ccc);
 *   border-color: var(--simple-search-button-disabled-border-color, #aaa);
 *   @apply --simple-search-button-disabled;```
 *
 * @polymer
 * @customElement
 * @demo demo/index.html
 *
 */
class SimpleSearch extends PolymerElement {
  static get is() {
    return "simple-search";
  }

  static get properties() {
    return {
      /**
       * always float the label
       */
      alwaysFloatLabel: {
        type: Boolean,
        value: false
      },
      /**
       * Is the search case-sensitive
       */
      caseSensitive: {
        type: Boolean,
        value: null
      },
      /**
       * The id of the container element that the navigation buttons control
       */
      controls: {
        type: String,
        value: null
      },
      /**
       * is the previous next button disabled
       */
      nextButtonDisabled: {
        type: Boolean,
        computed:
          "_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,1)"
      },
      /**
       * label for next result icon
       */
      nextButtonIcon: {
        type: String,
        value: "arrow-forward"
      },
      /**
       * label for next result button
       */
      nextButtonLabel: {
        type: String,
        value: "next result"
      },
      /**
       * never float the label
       */
      noLabelFloat: {
        type: Boolean,
        value: false
      },
      /**
       * are there any results to navigate?
       */
      noResults: {
        type: Boolean,
        computed: "_hasNoResults(resultCount)"
      },
      /**
       * is there an active search?
       */
      noSearch: {
        type: Boolean,
        computed: "_hasNoSearch(searchTerms)"
      },
      /**
       * is the previous result button disabled
       */
      prevButtonDisabled: {
        type: Boolean,
        computed:
          "_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,-1)"
      },
      /**
       * label for previous result icon
       */
      prevButtonIcon: {
        type: String,
        value: "arrow-back"
      },
      /**
       * label for previous result button
       */
      prevButtonLabel: {
        type: String,
        value: "previous result"
      },
      /**
       * Number of results.
       */

      resultCount: {
        type: Number,
        value: 0
      },
      /**
       * Which result are we currently on?
       */
      resultPointer: {
        type: Number,
        value: 0
      },
      /**
       * Number of results.
       */
      resultsSpan: {
        type: String,
        computed: "_getResultsSpan(noSearch,resultPointer,resultCount)"
      },
      /**
       * label for search icon
       */
      searchInputIcon: {
        type: String,
        value: "search"
      },
      /**
       * label for search input
       */
      searchInputLabel: {
        type: String,
        value: "search"
      },
      /**
       * an array of search terms
       */
      searchTerms: {
        type: Array,
        value: []
      },
      /**
       * The container element that the navigation buttons control
       */
      target: {
        type: Object,
        value: null
      }
<<<<<<< HEAD
    };
  }
=======
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
      :host div[shrink-hide] {
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
    /**
     * always float the label
     */
    alwaysFloatLabel: {
      type: Boolean,
      value: false
    },
    /**
     * Is the search case-sensitive
     */
    caseSensitive: {
      type: Boolean,
      value: null
    },
    /**
     * The id of the container element that the navigation buttons control
     */
    controls: {
      type: String,
      value: null
    },
    /**
     * is the previous next button disabled
     */
    nextButtonDisabled: {
      type: Boolean,
      computed: "_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,1)"
    },
    /**
     * label for next result icon
     */
    nextButtonIcon: {
      type: String,
      value: "arrow-forward"
    },
    /**
     * label for next result button
     */
    nextButtonLabel: {
      type: String,
      value: "next result"
    },
    /**
     * never float the label
     */
    noLabelFloat: {
      type: Boolean,
      value: false
    },
    /**
     * are there any results to navigate?
     */
    noResults: {
      type: Boolean,
      computed: "_hasNoResults(resultCount)"
    },
    /**
     * is there an active search?
     */
    noSearch: {
      type: Boolean,
      computed: "_hasNoSearch(searchTerms)"
    },
    /**
     * is the previous result button disabled
     */
    prevButtonDisabled: {
      type: Boolean,
      computed: "_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,-1)"
    },
    /**
     * label for previous result icon
     */
    prevButtonIcon: {
      type: String,
      value: "arrow-back"
    },
    /**
     * label for previous result button
     */
    prevButtonLabel: {
      type: String,
      value: "previous result"
    },
    /**
     * Number of results.
     */
>>>>>>> fcf162e9ecd7fb50efcb839b6ceb297d98d087e6

  // render function
  static get template() {
    return html`
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
      <paper-input id="input" always-float-label\$="[[alwaysFloatLabel]]" label="[[searchInputLabel]]" no-label-float\$="[[noLabelFloat]]" on-change="_handleChange">
        <iron-icon icon="[[searchInputIcon]]" slot="prefix"></iron-icon>
      </paper-input>
      <div id="xofy" shrink-hide\$="[[noSearch]]"></div>
      <div shrink-hide\$="[[noResults]]">
        <button id="prev" aria-label="[[prevButtonLabel]]" aria-role="button" controls\$="[[controls]]" disabled\$="[[prevButtonDisabled]]" on-tap="_navigateResults" tabindex="0">
          <iron-icon icon="[[prevButtonIcon]]"></iron-icon>
        </button>
        <paper-tooltip for="prev">[[prevButtonLabel]]</paper-tooltip>
        <button id="next" aria-label="[[nextButtonLabel]]" aria-role="button" controls\$="[[controls]]" disabled\$="[[nextButtonDisabled]]" on-tap="_navigateResults" tabindex="0">
          <iron-icon icon\$="[[nextButtonIcon]]"></iron-icon>
        </button>
        <paper-tooltip for="next">[[nextButtonLabel]]</paper-tooltip>
      </div>`;
  }

  ready() {
    super.ready();
    let root = this,
      search = root.$.input;
    root._getSearchText(search.value);
  }

  /**
   * are there any results to navigate?
   */
  _handleChange(e) {
    let root = this;
    root._getSearchText(root.$.input.value);
    root.resultCount = 0;
    root.resultPointer = 0;
    root.dispatchEvent(
      new CustomEvent("simple-search", { detail: { search: root, content: e } })
    );
  }

  /**
   * are there any results to navigate?
   *
   * @param {number} total number of results
   * @returns {boolean} whether or not there are results
   */
  _hasNoResults(resultCount) {
    return resultCount < 1;
  }

  /**
   * are there any results to navigate?
   *
   * @param {array} array of search terms
   * @returns {boolean} whether or not there are search terms
   */
  _hasNoSearch(searchTerms) {
    return searchTerms.length < 1;
  }

  /**
   * get results span text
   *
   * @param {boolean} whether or not there are search terms
   * @param {number} the current search result's position
   * @param {number} the total number of search results
   * @returns {string} "y results" or "x/y" text
   */
  _getResultsSpan(noSearch, resultPointer, resultCount) {
    let html = "";
    if (resultCount > 0 && resultPointer > 0) {
      html = resultPointer + "/" + resultCount;
    } else {
      html = " " + resultCount;
    }
    this.$.xofy.innerHTML = html;
    return this.$.xofy.innerHTML;
  }

  /**
   * navigate results
   */
  _navigateResults(e) {
    let root = this,
      increment = e.currentTarget.id === "next" ? 1 : -1;
    if (
      this.resultPointer + increment > 0 &&
      this.resultPointer + increment <= this.resultCount
    ) {
      this.resultPointer += increment;
      this.dispatchEvent(
        new CustomEvent("goto-result", { detail: this.resultPointer })
      );
    }
  }

  /**
   * navigate results
   */
  _isNavButtonDisabled(pointer, count, span, inc) {
    return span == "" || pointer + inc <= 0 || pointer + inc > count;
  }

  /**
   * gets the tab-index of cues based on whether or not interactive cues are disabled
   *
   * @param {string} a string of search text
   */
  _getSearchText(find) {
    let temp = new Array();
    if (find !== undefined && find !== null) {
      temp = find.split(/[\"\']/gm);
      for (let i = 0; i < temp.length; i++) {
        temp[i] = temp[i].trim();
        if (temp[i] === "") temp.splice(i, 1);
      }
    }
    this.set("searchTerms", []);
    this.set("searchTerms", temp.slice(0));
  }

  /**
   * search a string of content for any terms and return an array of results.
   * For example if I searched for the with
   * `findMatches("The quick brown fox jumps over the lazy dog.")`,
   * the array would be:
   * ```[
   *   {
   *     "matched": true,
   *     "matchNumber": 1,
   *     "text": "The",
   *     "searchObject": root
   *   },{
   *     "matched": false,
   *     "text": " quick brown fox jumps over ",
   *     "searchObject": root
   *   },{
   *     "matched": true,
   *     "matchNumber": 2,
   *     "text": "the",
   *     "searchObject": root
   *   },{
   *     "matched": false,
   *     "text": " lazy dog.",
   *     "searchObject": root
   *   }
   * ]```
   *
   * or `findMatches("The quick brown fox jumps over the lazy dog.",true)`,
   * the array would be:
   * ```[
   *   {
   *     "matched": false,
   *     "text": "The quick brown fox jumps over ",
   *     "searchObject": root
   *   },{
   *     "matched": true,
   *     "matchNumber": 1,
   *     "text": "the",
   *     "searchObject": root
   *   },{
   *     "matched": false,
   *     "text": " lazy dog.",
   *     "searchObject": root
   *   }
   * ]```
   *
   * @param {array} an array of search terms
   * @returns {array} an array of search results
   */
  findMatches(content) {
    let root = this,
      terms = root.searchTerms,
      modifier = this.caseSensitive ? "gm" : "gim",
      results = content.slice(0),
      updateResults = function(find) {
        for (let i = 0; i < results.length; i++) {
          if (results[i].matched === false) {
            let regex = new RegExp("\\b" + find + "\\b", modifier),
              text = results[i].text,
              start = text.search(regex),
              end = start + find.length;
            if (start > -1) {
              root.resultCount += 1;
              let pre = text.slice(0, start),
                match = text.slice(start, end),
                post = text.slice(end, text.length),
                update = results.splice(
                  i,
                  1,
                  {
                    matched: false,
                    text: pre,
                    searchObject: root
                  },
                  {
                    matched: true,
                    matchNumber: root.resultCount,
                    text: match,
                    searchObject: root
                  },
                  {
                    matched: false,
                    text: post,
                    searchObject: root
                  }
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
}
customElements.define(SimpleSearch.is, SimpleSearch);
