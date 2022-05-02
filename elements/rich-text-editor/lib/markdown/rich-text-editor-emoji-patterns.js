import { SimpleEmojiList } from "@lrnwebcomponents/simple-emoji-list/simple-emoji-list.js";
import "@lrnwebcomponents/simple-listbox/simple-listbox.js"; 
import { SimpleListboxEmoji } from '@lrnwebcomponents/simple-listbox/lib/simple-listbox-emoji.js';

let emoji = SimpleEmojiList 
    ? SimpleEmojiList 
    : [],  
  obj = {},
  patterns = [],
  lastChars = {};
  emoji.forEach((emoji) => {
    let shortcodes = emoji.shortcodes || [ emoji.description || emoji.character || "zzz"];
    shortcodes.forEach(emojidesc => {
      //converts emoji description to markdown
      let emojimd = `${emojidesc
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/([\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/])/g,'\\$1')}`;
      //handles emoji with identical descriptions
      if (emojimd && obj[emojimd]) {
        let ctr = 2,
          test = `${emojimd}-${ctr}`;
        while (obj[test]) {
          ctr++;
          test = `${emojimd}-${ctr}`;
        }
        emojimd = test;
      }
      //adds emoji markdown data
      if (emojimd) {
        obj[emojimd] = emoji;
        patterns.push({
          name: emoji.description,
          match: new RegExp(`:${emojimd}:`, "g"),
          replace: emoji.character,
          excludeAncestors: ["pre", "code"],
          lastChars: [":"],
          examples: [`:${emojimd}:`]
        });
      }
    });
  });
  console.log(SimpleListboxEmoji);
  //adds emoji listbox when ":" prefix is entered
  patterns.push({
    name: "emoji listbox open",
    match: new RegExp(`(?:^|\\W:)([a-zA-z0-9_+])*`,'g'),
    command: "openListbox",
    settings: {
      itemsList: SimpleListboxEmoji,
      grid: true,
      iconsOnly: true,
      tabs: true,
    },
    lastChars: [":"],
  });
  //closes emoji listbox when ":" suffix is entered
  patterns.push({
    name: "emoji listbox close",
    match: new RegExp(`(?:^|\\W):[\\w_]+[\\s\\t\\n:]`),
    command: "closeListbox",
    lastChars: [":","enter","space"],
  });
/**
 * rich-text-editor regex patterns 
 * and documentation for emoji
 */
export const rteEmojiPatterns = {
  documentation: {
    id: "rte-emoji-patterns",
    title: "Emoji Pattern Cheatsheet",
    cheatsheet: {}
  },
  patterns: patterns
};