/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

export { SimpleSearchContent };
/**
 * `simple-search-content`
 * `Content that can be searched with simple-search`
 *
 *
 * @microcopy - the mental model for this element
 *
 * `<simple-search-content
 *   content="[[content]]"                // inline content to be searched
 * </simple-search-content>`
 *
 * CSS Variables for matched content:
 * `color: var(--simple-search-match-text-color, #000);
 * background-color: var(--simple-search-match-background-color, #f0f0f0);
 * border-color: var(--simple-search-match-border-color, #ddd);
 * @apply --simple-search-match;`
 *
 * @polymer
 * @customElement
 * @demo demo/index.html
 */
class SimpleSearchContent extends PolymerElement {
  static get is() {
    return "simple-search-content";
  }

  static get properties() {
    return {
      /**
       * Original content. For example: "The quick brown fox jumps over the lazy dog."
       */
      content: {
        type: String,
        value: null
      }
    };
  }

  // render function
  static get template() {
    return html`<style>
      :host #content {
        @apply --simple-search-content;
      }
      :host #content[match-number]{
        color: var(--simple-search-match-text-color, #000);
        background-color: var(--simple-search-match-bg-color, #f0f0f0);
        border: 1px solid; 
        border-color: var(--simple-search-match-border-color, #ddd);
        padding: 0.16px 4px;
        border-radius: 0.16px;
        font-weight: bold;
        @apply --simple-search-match;
      }
    </style>
    <span id="content">
      <template is="dom-repeat" items="[[_searchedContent]]">
        <span match-number\$="[[item.matchNumber]]" tabindex\$="[[_getTabIndex(item.matchNumber)]]">[[item.text]]</span>
      </template>
    </span>`;
  }

  /**
   * associates simple-search-content with a simple-search
   *
   * @param {object} the simple-search element
   */
  enableSearch(searchObject) {
    let root = this,
      content = [{ matched: false, text: root.content }];
    if (content[0].text === null) content[0].text = root.innerHTML;
    // set rendered content to default unsearched content
    root.setContent(content);
    // listen for changes to search
    searchObject.addEventListener("simple-search", function() {
      // set rendered content to default unsearched content to clear old results
      root.setContent(content);
      // set rendered content to default search results
      root.setContent(searchObject.findMatches(content));
    });

    // listen for navigation through results
    searchObject.addEventListener("goto-result", function(e) {
      root.focus(e.detail);
    });
  }
  /**
   * sets array of content to be rendered
   *
   * @param {array} an array of searchable content
   */
  setContent(newContent) {
    this._searchedContent = newContent;
  }

  /**
   * sets focus on a matched result based on match number
   *
   * @param {number} the number of a search result
   */
  focus(matchNumber) {
    let result = this.$.content.querySelector(
      '[match-number="' + matchNumber + '"]'
    );
    if (result !== undefined && result !== null) result.focus();
  }
  /**
   * gets tab index based on whether item is a match that can be focused on
   *
   * @param {number} the number of a search result
   */
  _getTabIndex(matchNumber) {
    return matchNumber !== undefined && matchNumber !== null ? "1" : "";
  }
}
customElements.define(SimpleSearchContent.is, SimpleSearchContent);
