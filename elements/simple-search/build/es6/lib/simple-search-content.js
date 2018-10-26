import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
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
Polymer({
  is: "simple-search-content",
  properties: { content: { type: String, value: null } },
  enableSearch: function(searchObject) {
    let root = this,
      content = [{ matched: !1, text: root.content }];
    if (null === content[0].text) content[0].text = dom(root).innerHTML;
    root.setContent(content);
    searchObject.addEventListener("search", function() {
      root.setContent(content);
      root.setContent(searchObject.findMatches(content));
    });
    searchObject.addEventListener("goto-result", function(e) {
      root.focus(e.detail);
    });
  },
  setContent: function(newContent) {
    this._searchedContent = newContent;
  },
  focus: function(matchNumber) {
    let result = this.$.content.querySelector(
      '[match-number="' + matchNumber + '"]'
    );
    if (result !== void 0 && null !== result) result.focus();
  },
  _getTabIndex: function(matchNumber) {
    return matchNumber !== void 0 && null !== matchNumber ? "1" : "";
  }
});
