/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleListBoxBehaviors } from "@lrnwebcomponents/simple-listbox/simple-listbox.js";
import { SimpleEmojiList } from "@lrnwebcomponents/simple-emoji-list/simple-emoji-list.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";

/**
 * `simple-listbox-emoji`
 * @element simple-listbox-emoji
 * Uses simple-picker to create an icon picker
 *

 * @demo ./demo/index.html
 */
class SimpleListboxEmoji extends SimpleListBoxBehaviors(LitElement) {

  static get styles(){
    return [
      ...super.styles,
      css`
        ul[role="listbox"]{
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }
        ul[role="listbox"] li[role="presentation"] {
          flex: 1 1 100%;
        }
        ul[role="listbox"] li[role="option"] {
          display: inline;
          flex: 0 0 auto;
        }
      `
    ];
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * emoji types to include
       */
       tabsGroups: {
        name: "tabsGroups",
        type: Array,
        attribute: "tabs-groups",
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-listbox-emoji";
  }

  constructor() {
    super();
    this.tabsGroups = [
      { 
        "tooltip": "People",
        "icon": "social:sentiment-satisfied",
        "groups": [
          "emotions",
          "people",
        ]
      },
      { 
        "tooltip": "Nature",
        "icon": "maps:local-florist",
        "groups": [
          "nature",
        ]
      },
      { 
        "tooltip": "Food",
        "icon": "maps:restaurant",
        "groups": [
          "food",
        ]
      },
      { 
        "tooltip": "Travel",
        "icon": "maps:flight",
        "groups": [
          "travel",
        ]
      },
      { 
        "tooltip": "Activities",
        "icon": "maps:directions-bike",
        "groups": [
          "activities",
        ]
      },
      { 
        "tooltip": "Objects",
        "icon": "icons:lightbulb-outline",
        "groups": [
          "objects",
        ]
      },
      { 
        "tooltip": "Symbols",
        "icon": "icons:star",
        "groups": [
          "symbols",
        ]
      },
      { 
        "tooltip": "Flags",
        "icon": "icons:flag",
        "groups": [
          "flags",
        ]
      }
    ];
  }
  /**
   * LitElement life cycle - ready callback
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "tabsGroups" && !!this.tabsGroups) this.updateEmoji();
    });
    this.expanded = true;
  }
  updateEmoji(){
    this.itemsList =  (this.tabsGroups || []).map((tab,i) => {
      let id=`emoji-${(tab.tooltip || i).replace(/\W/g,'-').toLowerCase()}`;
      return {
        id: id,
        group: tab.tooltip,
        emoji: tab.emoji ? this._getUnicode(tab.emoji) : undefined,
        icon: tab.icon,
        tooltip: tab.tooltip,
        itemsList: (tab.groups || []).map(group=>window.SimplePickerEmojis[group]).flat().map(item=>{
          return {
            ...item,
            id: `${id}-${item.value.replace(/[\&\#\;]/g,"")}`,
            html: item.value,
            value: this._getUnicode(item.value),
          }
        })
      }
    });
  }
  _getUnicode(html){
      if(!html.match(/^\&\#[a-zA-Z0-9]+\;$/)) return;
      let temp = document.createElement('textarea');
      temp.innerHTML = html;
    return temp.value;
  }
}

window.simpleListboxEmojisByCategory = () => {
  let obj = {};
  (SimpleEmojiList || []).forEach((emoji) => {
    let emojitype = emoji.type || "";
    obj[emojitype] = obj[emojitype] || [];
    obj[emojitype].push({
      ...emoji,
      value: emoji.character,
      tooltip: emoji.description,
    });
  });
  return obj;
};

window.SimplePickerEmojis =
  window.SimplePickerEmojis || window.simpleListboxEmojisByCategory();

window.customElements.define(SimpleListboxEmoji.tag, SimpleListboxEmoji);
export { SimpleListboxEmoji };
