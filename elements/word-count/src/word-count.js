import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
/**
 * `word-count`
 * `Count the words on whatever this wraps`
 *
 * @demo demo/index.html
 */
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        --word-count-color: #888888;
        --word-count-color-hover: #000000;
      }
      :host:after{
        content: attr(words-text);
        font-size: 10px;
        position: relative;
        transition: .3s font-size,color ease;
        display: flex;
        line-height: 16px;
        flex-direction: row-reverse;
        margin: 12px;
        color: var(--word-count-color);
        @apply --word-count-text;
      }
      :host(:hover):after {
        font-size: 12px;
        font-weight: bold;
        color: var(--word-count-color-hover);
        @apply --word-count-text-hover;
      }
      :host(:focus):after {
        font-size: 12px;
        font-weight: bold;
        color: var(--word-count-color-hover);
        @apply --word-count-text-hover;
      }
      :host(:active):after {
        font-size: 12px;
        font-weight: bold;
        color: var(--word-count-color-hover);
        @apply --word-count-text-hover;
      }
    </style>
    <slot></slot>
`,

  is: "word-count",

  hostAttributes: {
    tabindex: "0"
  },

  properties: {
    /**
     * Words
     */
    words: {
      type: Number
    },
    /**
     * Prefix text.
     */
    wordsPrefix: {
      type: String,
      value: "Words:"
    },
    /**
     * Text to output
     */
    wordsText: {
      type: String,
      computed: "_computeWordsText(words, wordsPrefix)",
      reflectToAttribute: true
    }
  },

  /**
   * Ready life cycle
   */
  ready: function() {
    // mutation observer that ensures state applied correctly
    this._observer = new FlattenedNodesObserver(this, info => {
      if (info.addedNodes.length > 0 || info.removedNodes.length > 0) {
        this._updateWords();
      }
    });
  },

  /**
   * Update words based on data in the slot.
   */
  _updateWords: function() {
    if (dom(this).textContent !== "") {
      this.words = parseInt(dom(this).textContent.split(/\s+/g).length - 1);
    } else {
      this.words = 0;
    }
  },

  /**
   * Computer the text to output for words
   */
  _computeWordsText: function(words, prefix) {
    return prefix + " " + words;
  }
});
