import { SimpleSymbolList } from "@lrnwebcomponents/simple-symbol-list/simple-symbol-list.js";

let symbols = SimpleSymbolList 
    ? SimpleSymbolList 
    : [],  
  obj = {},
  patterns = [];

symbols.forEach((symbol) => {
  let symboldesc = symbol.character,
    //converts symbol description to markdown
    symbolmd = `${symboldesc
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/([\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/])/g,'\\$1')}`;
  //adds emoji markdown data
  if (symbolmd) {
    obj[symbolmd] = symbol;
    patterns.push({
      match: new RegExp(`;${symbolmd}`, "g"),
      replace: symbol.character,
      excludeAncestors: ["pre", "code"],
      lastChars: [";"],
      examples: [`;${symbolmd}`]
    });
  }
});

/**
 * rich-text-editor regex patterns 
 * and documentation for symbols
 */
export const rteSymbolPatterns = {
  documentation: {
    id: "rte-icon-patterns",
    title: "Icon Pattern Cheatsheet",
    cheatsheet: {}
  },
  patterns: patterns
};