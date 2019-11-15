/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./lib/simple-search-content.js";
import "./lib/simple-search-match.js";
/**
 * `simple-search`
 * a button used in simple-search
 * 
### Styling

`<simple-search>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-search-button-color` | text color for button | #111
`--simple-search-button-bg-color` | background-color for button | #eee
`--simple-search-button-border-color` | border-color for button | #ccc
`--simple-search-button-disabled-color` | background-color for disabled seach button | #999
`--simple-search-button-disabled-bg-color` | text color for disabled seach button | #eee
`--simple-search-button-disabled-border-color` | border-color for disabled seach button | #ccc
`--simple-search-button-hover-color` | text color for button when hovered or focused | #000
`--simple-search-button-hover-bg-color` | background-color for button when hovered or focused | #fff
`--simple-search-button-hover-border-color` | border-color for button when hovered or focused | #ddd
`--simple-search-input-placeholder-color` | text-color for search input's placeholder | #222
`--simple-search-container-padding` | search input's padding | unset
`--simple-search-margin` | search input's margin | unset
 *
 * @customElement
 * @demo ./demo/index.html
 *
 */
class SimpleSearch extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  static get tag() {
    return "simple-search";
  }
  constructor() {
    super();
    this.alwaysFloatLabel = false;
    this.caseSensitive = null;
    this.controls = null;
    this.nextButtonIcon = "arrow-forward";
    this.nextButtonLabel = "next result";
    this.noLabelFloat = false;
    this.prevButtonIcon = "arrow-back";
    this.prevButtonLabel = "previous result";
    this.resultCount = 0;
    this.resultPointer = 0;
    this.searchInputIcon = "search";
    this.searchInputLabel = "search";
    this.searchTerms = [];
    this.target = null;
    this.__hideNext = true;
    this.__hidePrev = true;
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "resultPointer" || propName === "resultCount")
        this._getNavDisabled(this.resultPointer, this.resultCount);
    });
  }

  /**
   * are there any results to navigate?
   */
  _handleChange(e) {
    this._getSearchText();
    this.resultCount = 0;
    this.resultPointer = 0;

    /**
     * Fires when search changes (detail = { search: this, content: event })
     *
     * @event simple-search
     */
    this.dispatchEvent(
      new CustomEvent("simple-search", { detail: { search: this, content: e } })
    );
  }

  /**
   * are there any results to navigate?
   *
   * @param {number} total number of results
   * @returns {boolean} whether or not there are results
   */
  _hasNoResults(count) {
    return count < 1;
  }

  /**
   * are there any results to navigate?
   *
   * @param {array} array of search terms
   * @returns {boolean} whether or not there are search terms
   */
  _hasNoSearch(terms) {
    return terms.length < 1;
  }

  /**
   * get results span text
   *
   * @param {boolean} whether or not there are search terms
   * @param {number} the current search result's position
   * @param {number} the total number of search results
   * @returns {string} "y results" or "x/y" text
   */
  _getResultsSpan(pointer, count) {
    return count > 0 && pointer > 0
      ? pointer + "/" + count
      : count > 0
      ? count
      : "";
  }

  /**
   * navigate results
   */
  _navigateResults(e) {
    let increment = e.currentTarget.id === "next" ? 1 : -1;
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
  _getNavDisabled(pointer, count) {
    this.__hidePrev = this._isNavButtonDisabled(pointer, count, -1);
    this.__hideNext = this._isNavButtonDisabled(pointer, count);
  }

  /**
   * navigate results
   */
  _isNavButtonDisabled(pointer, count, inc = 1) {
    return !count || count === 0 || pointer + inc <= 0 || pointer + inc > count;
  }

  /**
   * gets the tab-index of cues based on whether or not interactive cues are disabled
   *
   * @param {string} a string of search text
   */
  _getSearchText() {
    let find = this.shadowRoot.querySelector("#input").value,
      temp = new Array();
    if (find !== undefined && find !== null) {
      temp = find.split(/[\"\']/gm);
      for (let i = 0; i < temp.length; i++) {
        temp[i] = temp[i].trim();
        if (temp[i] === "") temp.splice(i, 1);
      }
    }
    //this.searchTerms = [];
    this.searchTerms = temp.slice(0);
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
  findMatches(results) {
    this.resultPointer = 0;
    results = results.replace(/<\/?simple-search-match[^>]*>/g, "");
    this.searchTerms.forEach(term => {
      let modifier = this.caseSensitive ? "gm" : "gim",
        regex = new RegExp("\\b(" + term + ")\\b", modifier),
        replacer = match => {
          this.resultCount++;
          return `<simple-search-match tabindex="0" match-number="${
            this.resultCount
          }">${match}</simple-search-match>`;
        };
      results = results.replace(regex, replacer);
    });
    return results;
  }
}
customElements.define(SimpleSearch.tag, SimpleSearch);

export { SimpleSearch };
