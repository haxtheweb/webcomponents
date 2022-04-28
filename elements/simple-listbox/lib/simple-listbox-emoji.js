/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { EmojiByType } from "@lrnwebcomponents/simple-emoji-list/simple-emoji-list.js";

export const SimpleListboxEmoji = [
  { 
    "group": "People",
    "icon": "icons:thumb-up",
    "emoji": "people"
  },
  { 
    "group": "Emotions",
    "icon": "social:sentiment-satisfied",
    "emoji": "emotions",
  },
  { 
    "group": "Nature",
    "icon": "maps:local-florist",
    "emoji": "nature",
  },
  { 
    "group": "Food",
    "icon": "maps:restaurant",
    "emoji": "food",
  },
  { 
    "group": "Travel",
    "icon": "maps:flight",
    "emoji": "travel",
  },
  { 
    "group": "Activities",
    "icon": "maps:directions-bike",
    "emoji": "activities",
  },
  { 
    "group": "Objects",
    "icon": "icons:lightbulb-outline",
    "emoji": "objects",
  },
  { 
    "group": "Symbols",
    "icon": "icons:star",
    "emoji": "symbols",
  },
  { 
    "group": "Flags",
    "icon": "icons:flag",
    "emoji": "flags",
  }
].map((tab,i) => {
  let id=`emoji-${(tab.group || i).replace(/\W/g,'-').toLowerCase()}`;
  return {
    id: id,
    group: tab.group,
    icon: tab.icon,
    tooltip: tab.tooltip,
    itemsList: EmojiByType[tab.emoji].map(emoji=>{
      let val = undefined;
      if(emoji.character.match(/^\&\#[a-zA-Z0-9]+\;$/)) {
        let temp = document.createElement('textarea');
        temp.innerHTML = emoji.character;
        val = temp.value;
      }
      return {
        ...emoji,
        id: `${id}-${emoji.character.replace(/[\&\#\;]/g,"")}`,
        html: emoji.character,
        value: val,
        tooltip: emoji.description,
        textComparison: emoji.description || emoji.shortcodes && emoji.shortcodes.length > 0 
        ? [...(emoji.shortcodes || []).map(code=>`:${code}:`), ...(emoji.shortcodes || []), emoji.description ].sort()
        : undefined
      }
    })
  }
});