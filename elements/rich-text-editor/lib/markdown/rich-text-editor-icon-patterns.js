import { SimpleIconsetStore } from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";

let icons = SimpleIconsetStore 
  && SimpleIconsetStore.iconlist 
  ? SimpleIconsetStore.iconlist 
  : [], regex = `!\\((${icons.map(icon=>icon.replace(/([\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/])/g,'\\$1')).join('|')})\\)`;

/**
 * rich-text-editor regex patterns 
 * and documentation for simple icons
 */
export const rteIconPatterns = {
  documentation: {
    id: "rte-icon-patterns",
    title: "Icon Pattern Cheatsheet",
    cheatsheet: {}
  },
  patterns: [
    {
      match: new RegExp(regex, "g"),
      replace: `<simple-icon-lite icon="$1"></simple-icon-lite>`,
      excludeAncestors: ["pre", "code"],
      lastChars: [")"],
      examples: icons.map(icon=>`!(${icon})`)
    }
  ]
};