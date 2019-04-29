define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js"],function(_exports,_polymerLegacy,_polymerDom,_flattenedNodesObserver){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.WordCount=void 0;function _templateObject_6d6f46e06a8311e9a406639d72d02073(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n        --word-count-color: #888888;\n        --word-count-color-hover: #000000;\n      }\n      :host:after {\n        content: attr(words-text);\n        font-size: 10px;\n        position: relative;\n        transition: 0.3s font-size, color ease;\n        display: flex;\n        line-height: 16px;\n        flex-direction: row-reverse;\n        margin: 12px;\n        color: var(--word-count-color);\n        @apply --word-count-text;\n      }\n      :host(:hover):after {\n        font-size: 12px;\n        font-weight: bold;\n        color: var(--word-count-color-hover);\n        @apply --word-count-text-hover;\n      }\n      :host(:focus):after {\n        font-size: 12px;\n        font-weight: bold;\n        color: var(--word-count-color-hover);\n        @apply --word-count-text-hover;\n      }\n      :host(:active):after {\n        font-size: 12px;\n        font-weight: bold;\n        color: var(--word-count-color-hover);\n        @apply --word-count-text-hover;\n      }\n    </style>\n    <slot></slot>\n  "]);_templateObject_6d6f46e06a8311e9a406639d72d02073=function _templateObject_6d6f46e06a8311e9a406639d72d02073(){return data};return data}/**
 * `word-count`
 * `Count the words on whatever this wraps`
 *
 * @demo demo/index.html
 */var WordCount=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_6d6f46e06a8311e9a406639d72d02073()),is:"word-count",hostAttributes:{tabindex:"0"},properties:{/**
     * Words
     */words:{type:Number},/**
     * Prefix text.
     */wordsPrefix:{type:String,value:"Words:"},/**
     * Text to output
     */wordsText:{type:String,computed:"_computeWordsText(words, wordsPrefix)",reflectToAttribute:!0}},/**
   * Ready life cycle
   */ready:function ready(){var _this=this;// mutation observer that ensures state applied correctly
this._observer=new _flattenedNodesObserver.FlattenedNodesObserver(this,function(info){if(0<info.addedNodes.length||0<info.removedNodes.length){_this._updateWords()}})},/**
   * Update words based on data in the slot.
   */_updateWords:function _updateWords(){if(""!==(0,_polymerDom.dom)(this).textContent){this.words=parseInt((0,_polymerDom.dom)(this).textContent.split(/\s+/g).length-1)}else{this.words=0}},/**
   * Computer the text to output for words
   */_computeWordsText:function _computeWordsText(words,prefix){return prefix+" "+words}});_exports.WordCount=WordCount});