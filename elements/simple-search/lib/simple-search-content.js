import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
/**
`simple-search-content`
An inline element that can be searched with the seimple-search element

@demo demo/index.html

@microcopy - the mental model for this element
  <simple-search-content 
    content="[[content]]"                // inline content to be searched
  </simple-search-content>

  CSS Variables for matched content:
  color: var(--simple-search-match-text-color, #000);
  background-color: var(--simple-search-match-background-color, #f0f0f0);
  border-color: var(--simple-search-match-border-color, #ddd);
  @apply --simple-search-match;
*/
Polymer({
  is: "simple-search-content",
  _template: html`
    <style is="custom-style">
      #content {
        @apply --simple-search-content;
      }
      #content[match-number]{
        color: var(--simple-search-match-text-color, #000);
        background-color: var(--simple-search-match-bg-color, #f0f0f0);
        border: 1px solid; 
        border-color: var(--simple-search-match-border-color, #ddd);
        padding: 16px 4px;
        border-radius: 16px;
        font-weight: bold;
        @apply --simple-search-match;
      }
    </style>
    <span id="content">
      <template is="dom-repeat" items="[[_searchedContent]]">
        <span match-number\$="[[item.matchNumber]]" tabindex\$="[[_getTabIndex(item.matchNumber)]]">[[item.text]]</span>
      </template>
    </span>
`,
  properties: {
    /**
     * Original content. For example: "The quick brown fox jumps over the lazy dog."
     */
    content: {
      type: String,
      value: null
    }
  },
  /**
   * associates simple-search-content with a simple-search
   */
  enableSearch: function(searchObject) {
    var content = [{ matched: false, text: this.content }];
    if (content[0].text === null) content[0].text = dom(this).innerHTML;
    // set rendered content to default unsearched content
    this.setContent(content);
    // listen for changes to search
    searchObject.addEventListener("search", () => {
      // set rendered content to default unsearched content to clear old results
      this.setContent(content);
      // set rendered content to default search results
      this.setContent(searchObject.findMatches(content));
    });

    // listen for navigation through results
    searchObject.addEventListener("goto-result", e => {
      this.focus(e.detail);
    });
  },
  /**
   * sets array of content to be rendered
   */
  setContent: function(newContent) {
    this._searchedContent = newContent;
  },
  /**
   * sets focus on a matched result based on match number
   */
  focus: function(matchNumber) {
    let result = this.$.content.querySelector(
      '[match-number="' + matchNumber + '"]'
    );
    if (result !== undefined && result !== null) result.focus();
  },
  /**
   * gets tab index based on whether item is a match that can be focused on
   */
  _getTabIndex: function(matchNumber) {
    return matchNumber !== undefined && matchNumber !== null ? "1" : "";
  }
});
