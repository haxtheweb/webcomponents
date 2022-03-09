"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rteSymbolPatterns = void 0;

var _simpleSymbolList = require("@lrnwebcomponents/simple-symbol-list/simple-symbol-list.js");

var symbols = _simpleSymbolList.SimpleSymbolList ? _simpleSymbolList.SimpleSymbolList : [],
    obj = {},
    patterns = [];
symbols.forEach(function (symbol) {
  var symboldesc = symbol.character,
      //converts symbol description to markdown
  symbolmd = "".concat(symboldesc.toLowerCase().replace(/\s+/g, "_").replace(/([\+\*\?\^\$\\\.\[\]\{\}\(\)\|\/])/g, '\\$1')); //adds emoji markdown data

  if (symbolmd) {
    obj[symbolmd] = symbol;
    patterns.push({
      match: new RegExp(";".concat(symbolmd), "g"),
      replace: symbol.character,
      excludeAncestors: ["pre", "code"],
      lastChars: [";"],
      examples: [";".concat(symbolmd)]
    });
  }
});
/**
 * rich-text-editor regex patterns 
 * and documentation for symbols
 */

var rteSymbolPatterns = {
  documentation: {
    id: "rte-symbol-patterns",
    title: "Symbol Pattern Cheatsheet",
    cheatsheet: {}
  },
  patterns: patterns
};
exports.rteSymbolPatterns = rteSymbolPatterns;