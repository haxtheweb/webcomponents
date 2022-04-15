/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleListBoxBehaviors } from "@lrnwebcomponents/simple-listbox/simple-listbox.js";
import { EmojiByType } from "@lrnwebcomponents/simple-emoji-list/simple-emoji-list.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";

/**
 * `simple-listbox-emoji`
 * @element simple-listbox-emoji
 * Uses simple-picker to create an icon picker
 *

 * @demo ./demo/emoji.html
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
        "group": "People",
        "icon": "social:sentiment-satisfied",
        "groups": [
          "emotions",
          "people",
        ]
      },
      { 
        "group": "Nature",
        "icon": "maps:local-florist",
        "groups": [
          "nature",
        ]
      },
      { 
        "group": "Food",
        "icon": "maps:restaurant",
        "groups": [
          "food",
        ]
      },
      { 
        "group": "Travel",
        "icon": "maps:flight",
        "groups": [
          "travel",
        ]
      },
      { 
        "group": "Activities",
        "icon": "maps:directions-bike",
        "groups": [
          "activities",
        ]
      },
      { 
        "group": "Objects",
        "icon": "icons:lightbulb-outline",
        "groups": [
          "objects",
        ]
      },
      { 
        "group": "Symbols",
        "icon": "icons:star",
        "groups": [
          "symbols",
        ]
      },
      { 
        "group": "Flags",
        "icon": "icons:flag",
        "groups": [
          "flags",
        ]
      }
    ];
  }
  
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "tabsGroups" && !!this.tabsGroups) this.updateEmojiList();
    });
  }
  /**
   * updates list of symbols for listbox and tabs
   */
  updateEmojiList(){
    this.itemsList =  (this.tabsGroups || []).map((tab,i) => {
      let id=`emoji-${(tab.group || i).replace(/\W/g,'-').toLowerCase()}`;
      return {
        id: id,
        group: tab.group,
        tab: tab.tab ? this._getUnicode(tab.tab) : undefined,
        icon: tab.icon,
        tooltip: tab.tooltip,
        itemsList: (tab.groups || []).map(group=>EmojiByType[group]).flat().map(item=>{
          return {
            ...item,
            id: `${id}-${item.character.replace(/[\&\#\;]/g,"")}`,
            html: item.character,
            value: this._getUnicode(item.character),
            tooltip: item.description,
            textComparison: item.description || item.shortcodes && item.shortcodes.length > 0 
            ? [...(item.shortcodes || []).map(code=>`:${code}:`), ...(item.shortcodes || []), item.description ].sort()
            : undefined
          }
        })
      }
    });
  }
  /**
   * gets unicode character for an HTML entity
   * @param {string} html HTML entity
   * @returns {string}
   */
  _getUnicode(html){
      if(!html.match(/^\&\#[a-zA-Z0-9]+\;$/)) return;
      let temp = document.createElement('textarea');
      temp.innerHTML = html;
    return temp.value;
  }
}

window.customElements.define(SimpleListboxEmoji.tag, SimpleListboxEmoji);
export { SimpleListboxEmoji };
