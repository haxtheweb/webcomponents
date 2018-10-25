import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="simple-search-content">
  <style>
    :host #content {
      @apply --simple-search-content;
    }
    :host #content [match-number]{
      color: var(--simple-search-match-text-color, #000);
      background-color: var(--simple-search-match-bg-color, #f0f0f0);
      border: 1px solid; 
      border-color: var(--simple-search-match-border-color, #ddd);
      padding: 0.1em 0.25em;
      border-radius: 0.1em;
      font-weight: bold;
      @apply --simple-search-match;
    }
  </style>
  <template>
    <span id="content">
      <template is="dom-repeat" items="[[_searchedContent]]">
        <span match-number\$="[[item.matchNumber]]" tabindex\$="[[_getTabIndex(item.matchNumber)]]">[[item.text]]</span>
      </template>
    </span>
  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer);
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
    let root = this,
      content = [{ matched: false, text: root.content }];
    if (content[0].text === null) content[0].text = dom(root).innerHTML;
    // set rendered content to default unsearched content
    root.setContent(content);
    // listen for changes to search
    searchObject.addEventListener("search", function() {
      // set rendered content to default unsearched content to clear old results
      root.setContent(content);
      // set rendered content to default search results
      root.setContent(searchObject.findMatches(content));
    });

    // listen for navigation through results
    searchObject.addEventListener("goto-result", function(e) {
      root.focus(e.detail);
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
