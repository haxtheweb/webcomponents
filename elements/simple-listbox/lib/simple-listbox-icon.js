/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SimpleListBoxBehaviors } from "@lrnwebcomponents/simple-listbox/simple-listbox.js";
import { SimpleIconsetStore } from "@lrnwebcomponents/simple-icon/lib/simple-iconset.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";

/**
 * `simple-listbox-icon`
 * @element simple-listbox-icon
 * Uses simple-picker to create an icon picker
 *

 * @demo ./demo/icons.html
 */
class SimpleListboxIcon extends SimpleListBoxBehaviors(LitElement) {

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
       * if specified, limits iconsets to space-separated list
       */
       includeSets: {
        name: "includeSets",
        type: String,
        attribute: "include-sets",
      },
      /**
       *  space-separated list of icon sets to exclude
       */
       excludeSets: {
        name: "excludeSets",
        type: String,
        attribute: "exclude-sets",
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-listbox-icon";
  }

  constructor() {
    super();
  }

  get includedSets(){
    return !!this.includeSets && !!this.includeSets.split(/\s+/) ? this.includeSets.split(/\s+/) : undefined;
  }

  get excludedSets(){
    return !!this.excludeSets && !!this.excludeSets.split(/\s+/) ? this.excludeSets.split(/\s+/) : undefined;
  }
  /**
   * LitElement life cycle - ready callback
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.updateIconsets();
  }
  
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (["includeSets","excludeSets"].includes(propName)) this.updateIconsets();
    });
  }
  updateIconsets(){
    let list = !this.includedSets 
      ? Object.keys(window.SimplePickerIcons) 
      : this.includedSets.filter(iconset=>Object.keys(window.SimplePickerIcons).includes(iconset));
    if(!!this.excludedSets) list = (list || []).filter(iconset=>!this.excludedSets.includes(iconset));
    this.itemsList =  list.length == 1 
      ? this.getIconsList(window.SimplePickerIcons[list[0]])
      : (list || []).map((key,i) => {
        let id=`icon-${(key || i).toLowerCase()}`;
        return {
          id: id,
          group: key,
          itemsList: this.getIconsList(window.SimplePickerIcons[key])
        }
      });
  }
  getIconsList(iconset){
    return (iconset || []).map(item=>{
      return {
        id: `icon-${item.toLowerCase().replace(/\:/g,'-')}`,
        icon: item,
        value: item,
      }
    })
  }
  _getHTML(icon){
    if(!icon.match(/^[-a-zA-Z0-9]+(-[-a-zA-Z0-9]+)*\:[a-zA-Z0-9]+(-[-a-zA-Z0-9]+)*$/)) return;
    return html`<simple-icon-lite icon="${icon}"></simple-icon-lite>`;
  }
}

window.simpleListboxIconsByCategory = () => {
  let obj = {};
  (SimpleIconsetStore.iconlist || []).forEach((icon,i) => {
    let parts = icon.split(':'), 
    icontype = parts[0];
    obj[icontype] = obj[icontype] || [];
    obj[icontype].push(icon);
  });
  return obj;
};

window.SimplePickerIcons =
  window.SimplePickerIcons || window.simpleListboxIconsByCategory();

window.customElements.define(SimpleListboxIcon.tag, SimpleListboxIcon);
export { SimpleListboxIcon };
