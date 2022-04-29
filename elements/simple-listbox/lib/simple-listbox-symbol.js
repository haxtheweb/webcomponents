/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SymbolsByType } from "@lrnwebcomponents/simple-symbol-list/simple-symbol-list.js";

/**
 * `simple-listbox-symbol`
 * @element simple-listbox-symbol
 * Uses simple-picker to create an icon picker
 *

 * @demo ./demo/index.html
 */
export const SimpleListboxSymbol = [
  { 
    "group": "Symbols",
    "tab": "&sect;",
    "symbols": "symbols"
  },
  { 
    "group": "Math",
    "tab": "&divide;",
    "symbols": "math"
  },
  { 
    "group": "Characters",
    "tab": "&Auml;",
    "symbols": "characters",
  },
  { 
    "group": "Greek",
    "tab": "&omega;",
    "symbols": "greek"
  },
  { 
    "group": "Misc",
    "tab": "&spades;",
    "symbols": "misc"
  }
].map((tab,i) => {
  let id=`symbol-${(tab.group || i).replace(/\W/g,'-').toLowerCase()}`,
    getUnicode = (html) => {
      if(!html.match(/^\&[a-zA-Z0-9]+\;$/)) return;
      let temp = document.createElement('textarea');
      temp.innerHTML = html;
      return temp.value;
    };
  return {
    id: id,
    group: tab.group,
    tab: getUnicode(tab.tab),
    itemsList: SymbolsByType[tab.symbols].map(symbol=>{
      return {
        ...symbol,
        id: `${id}-${symbol.character.replace(/[\&\;]/g,"")}`,
        html: symbol.character,
        value: getUnicode(symbol.character),
        tooltip: symbol.character,
        textComparison: [symbol.character,getUnicode(symbol.character)]
      };
    })
  }
});