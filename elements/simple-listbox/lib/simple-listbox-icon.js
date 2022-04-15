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
  /**
   * icons that must be added to listbox options
   *
   * @readonly
   * @memberof SimpleListboxIcon
   */
  get includedSets(){
    return !!this.includeSets && !!this.includeSets.split(/\s+/) ? this.includeSets.split(/\s+/) : undefined;
  }
  /**
   * icons that must NOT be added to listbox options
   *
   * @readonly
   * @memberof SimpleListboxIcon
   */
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
  /**
   * updates list of icons for listbox and tabs
   */
  updateIconsets(){
    let groupedIcons = SimpleIconsetStore.groupedIconlist || [],
      list = !this.includedSets 
        ? Object.keys(groupedIcons) 
        : this.includedSets.filter(iconset=>Object.keys(groupedIcons).includes(iconset));
    if(!!this.excludedSets) list = (list || []).filter(iconset=>!this.excludedSets.includes(iconset));
    this.itemsList =  list.length == 1 
      ? this.getIconsetOptions(groupedIcons[list[0]])
      : (list || []).map((key,i) => {
        let id=`icon-${(key || i).toLowerCase()}`;
        return {
          id: id,
          group: key,
          itemsList: this.getIconsetOptions(groupedIcons[key])
        }
      });
  }
  /**
   * gets icons list as an array of options
   * @param {array} iconset array of icon obbjects
   * @returns {array}
   */
  getIconsetOptions(iconset){
    return (iconset || []).map(item=>{
      return {
        id: `icon-${item.toLowerCase().replace(/\:/g,'-')}`,
        icon: item,
        value: item,
      }
    })
  }
  /**
   * gets template for an icon based on icon name
   * @param {string} icon name of icon
   * @returns {object}
   */
  _getIconTemplate(icon){
    if(!icon.match(/^[-a-zA-Z0-9]+(-[-a-zA-Z0-9]+)*\:[a-zA-Z0-9]+(-[-a-zA-Z0-9]+)*$/)) return;
    return html`<simple-icon-lite icon="${icon}"></simple-icon-lite>`;
  }
}

window.customElements.define(SimpleListboxIcon.tag, SimpleListboxIcon);
export { SimpleListboxIcon };
