import { SimpleEmojiList } from "@lrnwebcomponents/simple-emoji-list/simple-emoji-list.js";

let emoji = SimpleEmojiList 
    ? SimpleEmojiList 
    : [],  
  obj = {},
  patterns = [];
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