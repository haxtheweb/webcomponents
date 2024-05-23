/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "./lib/simple-search-content.js";
import "./lib/simple-search-match.js";
/**
  * `simple-search`
  * @element simple-search
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
 
  * @demo ./demo/index.html
  * @demo ./demo/selector.html Searching by CSS selectors
  *
  */
class SimpleSearch extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          width: 100%;
          background-color: var(
            --simple-search-input-background-color,
            transparent
          );
        }

        #input {
          flex-grow: 2;
          margin-right: 4px;
          padding: var(--simple-search-padding, unset);
          margin: var(--simple-search-margin, unset);
          color: var(--simple-search-input-text-color, #000);
          --simple-fields-color: var(--simple-search-input-text-color, #000);
          --simple-fields-container-color: var(
            --simple-search-input-placeholder-color,
            #222
          );
          --simple-fields-background-color: var(
            --simple-fields-input-background-color,
            transparent
          );
          --simple-icon-color: var(
            --simple-search-input-placeholder-color,
            #222
          );
        }

        #xofy {
          margin: 8px;
        }

        button {
          margin: 8px 0 8px;
          border-style: solid;
          border-width: 1px;
          border-color: var(--simple-search-button-border-color, #ccc);
          color: var(--simple-search-button-color, #111);
          background-color: var(--simple-search-button-bg-color, #eee);
          border-color: var(--simple-search-button-border-color, #ccc);
        }

        button:not([disabled]):focus,
        button:not([disabled]):hover {
          cursor: pointer;
          color: var(--simple-search-button-hover-color, #000);
          background-color: var(--simple-search-button-hover-bg-color, #fff);
          border-color: var(--simple-search-button-hover-border-color, #ddd);
        }

        button[disabled] {
          cursor: not-allowed;
          color: var(--simple-search-button-disabled-color, #999);
          background-color: var(--simple-search-button-disabled-bg-color, #eee);
          border-color: var(--simple-search-button-disabled-border-color, #ccc);
        }

        button:not([controls]) {
          display: none;
        }

        #searchnav {
          flex: 1 0 auto;
        }

        #searchnav button {
          display: inline;
          flex: 1 0 auto;
        }

        *[shrink-hide] {
          display: none;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <simple-fields-field
        id="input"
        label="${this.searchInputLabel}"
        ?inline="${this.inline || this.noLabelFloat}"
        @value-changed="${this._handleChange}"
      >
        <simple-icon-lite
          icon="${this.searchInputIcon}"
          slot="${this.inline ? "label-prefix" : "prefix"}"
        ></simple-icon-lite>
      </simple-fields-field>
      <div id="xofy" ?shrink-hide="${this._hasNoSearch(this.searchTerms)}">
        ${this._getResultsSpan(this.resultPointer, this.resultCount)}
      </div>
      <div id="searchnav" ?shrink-hide="${this._hasNoSearch(this.searchTerms)}">
        <button
          id="prev"
          aria-label="${this.prevButtonLabel}"
          role="button"
          controls="${this.controls}"
          tabindex="0"
          ?disabled="${this.__hidePrev}"
          @click="${this._navigateResults}"
        >
          <simple-icon-lite icon="${this.prevButtonIcon}"></simple-icon-lite>
        </button>
        <simple-tooltip for="prev">${this.prevButtonLabel}</simple-tooltip>
        <button
          id="next"
          aria-label="${this.nextButtonLabel}"
          role="button"
          controls="${this.controls}"
          tabindex="0"
          ?disabled="${this.__hideNext}"
          @click="${this._navigateResults}"
        >
          <simple-icon-lite icon="${this.nextButtonIcon}"></simple-icon-lite>
        </button>
        <simple-tooltip for="next">${this.nextButtonLabel}</simple-tooltip>
      </div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * @deprecated always float the label
       */
      alwaysFloatLabel: {
        attribute: "always-float-label",
        type: Boolean,
      },
      /**
       * Is the search case-sensitive
       */
      caseSensitive: {
        attribute: "case-sensitive",
        type: Boolean,
      },
      /**
       * The id of the container element that the navigation buttons control
       */
      controls: {
        attribute: "controls",
        type: String,
      },
      /**
       * displays with label inline
       */
      inline: {
        attribute: "inline",
        type: Boolean,
      },
      /**
       * label for next result icon
       */
      nextButtonIcon: {
        attribute: "next-button-icon",
        type: String,
      },
      /**
       * label for next result button
       */
      nextButtonLabel: {
        attribute: "next-button-label",
        type: String,
      },
      /**
       * @deprecated never float the label
       */
      noLabelFloat: {
        attribute: "no-label-float",
        type: Boolean,
      },
      /**
       * label for previous result icon
       */
      prevButtonIcon: {
        attribute: "prev-button-icon",
        type: String,
      },
      /**
       * label for previous result button
       */
      prevButtonLabel: {
        attribute: "prev-button-label",
        type: String,
      },
      /**
       * Number of results.
       */
      resultCount: {
        attribute: "result-count",
        type: Number,
      },
      /**
       * Which result are we currently on?
       */
      resultPointer: {
        attribute: "result-pointer",
        type: Number,
      },
      /**
       * limits search to within target's elements that match a selectgor
       */
      selector: {
        attribute: "selector",
        type: String,
      },
      /**
       * label for search icon
       */
      searchInputIcon: {
        attribute: "search-input-icon",
        type: String,
      },
      /**
       * label for search input
       */
      searchInputLabel: {
        attribute: "search-input-label",
        type: String,
      },
      /**
       * an array of search terms
       */
      searchTerms: {
        attribute: "search-terms",
        type: Array,
      },
      /**
       * If set, search will be automated and restricted to this object.
       */
      target: {
        type: Object,
      },
      /**
       * Hide next button
       */
      __hideNext: {
        type: Boolean,
      },
      /**
       * Hide prev button
       */
      __hidePrev: {
        type: Boolean,
      },
    };
  }

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
    this.selector = null;
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
    let selector = this.selector ? ` ${this.selector}` : ``,
      selections = this.controls
        ? this.getRootNode().querySelectorAll(`#${this.controls}${selector}`)
        : null;
    this._getSearchText();
    this.resultCount = 0;
    this.resultPointer = 0;
    selections.forEach((selection) => {
      this._searchSelection(selection);
    });
    /**
     * Fires when search changes (detail = { search: this, content: event })
     *
     * @event simple-search
     */
    this.dispatchEvent(
      new CustomEvent("simple-search", {
        detail: { search: this, content: e },
      }),
    );
  }

  _searchSelection(selection) {
    if (selection && selection.innerHTML)
      selection.innerHTML = this.findMatches(selection.innerHTML);
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
        : "0";
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
        new CustomEvent("goto-result", { detail: this.resultPointer }),
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
    this.searchTerms.forEach((term) => {
      let modifier = this.caseSensitive ? "gm" : "gim",
        regex = new RegExp("\\b(" + term + ")\\b", modifier),
        replacer = (match) => {
          this.resultCount++;
          return `<simple-search-match tabindex="0" match-number="${this.resultCount}">${match}</simple-search-match>`;
        };
      results = results.replace(regex, replacer);
    });
    return results;
  }
}
customElements.define(SimpleSearch.tag, SimpleSearch);

export { SimpleSearch };
