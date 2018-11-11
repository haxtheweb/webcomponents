define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="simple-search-content">\n<template>\n  <style>\n    :host #content {\n      @apply --simple-search-content;\n    }\n    :host #content[match-number]{\n      color: var(--simple-search-match-text-color, #000);\n      background-color: var(--simple-search-match-bg-color, #f0f0f0);\n      border: 1px solid; \n      border-color: var(--simple-search-match-border-color, #ddd);\n      padding: 0.16px 4px;\n      border-radius: 0.16px;\n      font-weight: bold;\n      @apply --simple-search-match;\n    }\n  </style>\n    <span id="content">\n      <template is="dom-repeat" items="[[_searchedContent]]">\n        <span match-number$="[[item.matchNumber]]" tabindex$="[[_getTabIndex(item.matchNumber)]]">[[item.text]]</span>\n      </template>\n    </span>\n  </template>\n\n  \n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "simple-search-content",
    properties: { content: { type: String, value: null } },
    enableSearch: function enableSearch(searchObject) {
      var root = this,
        content = [{ matched: !1, text: root.content }];
      if (null === content[0].text)
        content[0].text = (0, _polymerDom.dom)(root).innerHTML;
      root.setContent(content);
      searchObject.addEventListener("search", function() {
        root.setContent(content);
        root.setContent(searchObject.findMatches(content));
      });
      searchObject.addEventListener("goto-result", function(e) {
        root.focus(e.detail);
      });
    },
    setContent: function setContent(newContent) {
      this._searchedContent = newContent;
    },
    focus: function focus(matchNumber) {
      var result = this.$.content.querySelector(
        '[match-number="' + matchNumber + '"]'
      );
      if (result !== void 0 && null !== result) result.focus();
    },
    _getTabIndex: function _getTabIndex(matchNumber) {
      return matchNumber !== void 0 && null !== matchNumber ? "1" : "";
    }
  });
});
