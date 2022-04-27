/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleListboxIconStyles, SimpleListBoxBehaviors } from "@lrnwebcomponents/simple-listbox/simple-listbox.js";
import { EmojiByType } from "@lrnwebcomponents/simple-emoji-list/simple-emoji-list.js";

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
      ...SimpleListboxIconStyles
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
        itemsList: (tab.groups || []).map(group=>EmojiByType[group]).flat().map(emoji=>this.updateEmoji(id,emoji))
      }
    });
  }
  /**
   * updates emoji data object 
   * @param {string} id 
   * @param {object} emoji raw emoji data object
   * @returns 
   */
  updateEmoji(id,emoji){
    return {
      ...emoji,
      id: `${id}-${emoji.character.replace(/[\&\#\;]/g,"")}`,
      html: emoji.character,
      value: this._getUnicode(emoji.character),
      tooltip: emoji.description,
      textComparison: emoji.description || emoji.shortcodes && emoji.shortcodes.length > 0 
      ? [...(emoji.shortcodes || []).map(code=>`:${code}:`), ...(emoji.shortcodes || []), emoji.description ].sort()
      : undefined
    };
  }
}

window.customElements.define(SimpleListboxEmoji.tag, SimpleListboxEmoji);
export { SimpleListboxEmoji };
