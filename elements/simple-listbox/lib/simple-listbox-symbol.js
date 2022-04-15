/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleListBoxBehaviors } from "@lrnwebcomponents/simple-listbox/simple-listbox.js";
import { SymbolsByType } from "@lrnwebcomponents/simple-symbol-list/simple-symbol-list.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";

/**
 * `simple-listbox-symbol`
 * @element simple-listbox-symbol
 * Uses simple-picker to create an icon picker
 *

 * @demo ./demo/index.html
 */
class SimpleListboxSymbol extends SimpleListBoxBehaviors(LitElement) {

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
       * symbol types to include
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
    return "simple-listbox-symbol";
  }

  constructor() {
    super();
    this.tabsGroups = [
      { 
        "group": "Symbols",
        "tab": "&sect;",
        "groups": [
          "symbols",
        ]
      },
      { 
        "group": "Math",
        "tab": "&divide;",
        "groups": [
          "math",
        ]
      },
      { 
        "group": "Characters",
        "tab": "&Auml;",
        "groups": [
          "characters",
        ]
      },
      { 
        "group": "Greek",
        "tab": "&omega;",
        "groups": [
          "greek",
        ]
      },
      { 
        "group": "Misc",
        "tab": "&spades;",
        "groups": [
          "misc",
        ]
      }
    ];
  }
  
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "tabsGroups" && !!this.tabsGroups) this.updateSymbolsList();
    });
  }
  /**
   * updates list of symbols for listbox and tabs
   */
  updateSymbolsList(){
    this.itemsList =  (this.tabsGroups || []).map((tab,i) => {
      let id=`symbol-${(tab.group || i).replace(/\W/g,'-').toLowerCase()}`;
      return {
        id: id,
        group: tab.group,
        tab: tab.tab ? this._getUnicode(tab.tab) : undefined,
        icon: tab.icon,
        tooltip: tab.tooltip,
        itemsList: (tab.groups || []).map(group=>window.SimpleListboxSymbols[group]).flat().map(item=>{
          return {
            ...item,
            id: `${id}-${item.character.replace(/[\&\;]/g,"")}`,
            html: item.character,
            value: this._getUnicode(item.character),
            tooltip: item.character,
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
      if(!html.match(/^\&[a-zA-Z0-9]+\;$/)) return;
      let temp = document.createElement('textarea');
      temp.innerHTML = html;
    return temp.value;
  }
}

window.SimpleListboxSymbols =
  window.SimpleListboxSymbols || SymbolsByType;

window.customElements.define(SimpleListboxSymbol.tag, SimpleListboxSymbol);
export { SimpleListboxSymbol };
