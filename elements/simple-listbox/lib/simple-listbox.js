import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { AbsolutePositionBehaviorClass } from  "@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";

/**
 * properties shared by listbox and any input using it
 */
const SimpleListboxProperties = {
  /**
   * demo mode for debugging, "items", or "groups"
   */
  demoMode: {
    attribute: "demo-mode",
    type: String,
    reflect: true,
  },
  /**
   * Whether the form control is disabled
   */
  disabled: {
    type: Boolean,
    reflect: true,
  },
  /**
   * sets aria-describedby
   */
  describedBy: {
    type: String,
    attribute: "described-by"
  },
  /**
   * input text to filter listbox options
   */
  filter: {
    type: String,
  },
  /**
   * whether hidden
   */
  hidden: {
    type: Boolean,
    reflect: true,
  },
  /**
   * unique identifier
   */
  id: {
    type: String,
    reflect: true,
    attribute: "id"
  },
  /**
   * array of options [{value: "key", text: "Text"}] for select, radio options, and checkboxes,
   * so that they can appear in a prescribed order,
   * eg. [{value: "b", text: "Option B"}, {value: "a", text: "Option A"}, {value: "c", text: "Option C"}]
   */
  itemsList: {
    type: Array,
    attribute: "items-list",
  },
  /**
   * sets aria-describedby
   */
  labelledBy: {
    type: String,
    attribute: "labelled-by"
  },
  /**
   * if options are grouped, displays them as tabs
   */
  tabs: {
    attribute: "tabs",
    type: Boolean,
    reflect: true
  }
};
/**
 * properties for listbox
 */
const SimpleListboxInternalProperties = {
  ...SimpleListboxProperties,
  /**
   * id of active option
   */
  activeDescendant: {
    type: String,
  },
  /**
   * option that set value
   */
  option: {
    type: Object
  },
  /**
   * option with aria-selected value
   */
  selectedOption: {
    type: Object,
  }
};
/**
 * styles for listbox
 */
const SimpleListboxStyles = [
  css`
    :host {
      display: inline-block;
      z-index: 99999999999;
      position: static;
    }
    :host([hidden])  {
      display: none;
      transition: 0s display 0.5s;
    }
    ul:hover,
    li:hover {
      z-index: 2;
    }
    ul[role="listbox"]:focus-within,
    li:focus-within {
      z-index: 3;
    }
    simple-listbox-tabs::part(tablist){
      outline: 1px solid #ddd;
      display:flex;
      max-height: 5em;
      transition: 0.5s ease-in-out all;
    }
    simple-listbox-tabs::part(tablist-item) {
      flex: 1 0 auto;
    }
    simple-listbox-tabs::part(tab) {
      background-color: white;
      border-bottom: 3px solid white;
    }
    simple-listbox-tabs::part(tab-active) {
      border-bottom: 3px solid black;
    }
    ul[role="listbox"] {
      list-style: none;
      margin: 0;
      padding: 0;
      margin-block-end: 0;
      margin-block-start: 0;
      padding-inline-start: 0;
      padding-inline-end: 0;
      outline: 1px solid #ddd;
      opacity: 1;
      overflow: auto;
      max-height: 12em;
      transition: 0.5s ease-in-out max-height;
    }
    :host([hidden]) ul[role="listbox"] {
      opacity: 0;
      overflow: hidden;
      max-height: 0;
      outline: 0px solid #ddd;
    }
    :host([hidden]) simple-listbox-tabs::part(tablist) {
      max-height: 0em;
      opacity: 0;
      display: none;
      outline: 0px solid #ddd;
    }

    ul[role="listbox"] li[role] {
      font-family: sans-serif;
      margin: 0;
      padding: 0.25em;
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      display: block;
      font-size: 100%;
      background-color: white;
    }

    ul[role="listbox"] li[role="presentation"] {
      color: #444;
      text-transform: uppercase;
      font-size: 80%;
      line-height: 125%;
      letter-spacing: 0.15em;
      background-color: #f0f0f0;
    }

    ul[role="listbox"] li[role="option"][aria-selected="true"] {
      background-color: #eeeeee;
    }

    :host([has-visual-focus]) ul[role="listbox"] li[role="option"][aria-selected="true"] {
      background-color: #d9eaff;
      border-color: #3f51b5;
    }

    ul[role="listbox"] li[role="option"]:hover {
      background-color: #d9eaff;
    }
  `
];

/**
 * styles for list items that should display inline
 */
const SimpleListboxIconStyles = [
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

/**
 * a simple list of autocomplete items when element is in demo-mode
 *
 * @readonly
 */
const SimpleListBoxDemoGroups = [
  {
    group: "Vale of Arryn",
    itemsList: [
      "Arryn"
    ]
  }, 
  {
    group: "Crownlands",
    itemsList: [
      "Baratheon",
      "Targaryen"
    ]
  }, 
  {
    group: "North",
    itemsList: [
      "Bolton",
      "Mormont",
      "Stark",
      "Umber"
    ]
  }, 
  {
    group: "Reach",
    itemsList: [
      "Florent",
      "Hightower",
      "Redwyne",
      "Tarley",
      "Tyrell"
    ]
  },
  {
    group: "Riverlands",
    itemsList: [
      "Frey",
      "Tully"
    ]
  },
  {
    group: "Iron Islands",
    itemsList: [
      "Greyjoy"
    ]
  },
  {
    group: "Westerlands",
    itemsList: [
      "Lannister"
    ]
  },
  {
    group: "Dorne",
    itemsList: [
      "Martell"
    ]
  },
  {
    group: "Stormlands",
    itemsList: [
      "Seaworth",
      "Selmy"
    ]
  },
];

/**
 * a simple list of autocomplete items when element is in demo-mode
 *
 * @readonly
 */
const SimpleListBoxDemoItems = SimpleListBoxDemoGroups.map(g=>g.itemsList).flat().sort();

const SimpleListBoxBehaviors = function (SuperClass) {
  return class extends AbsolutePositionBehaviorClass(SuperClass) {
    static get styles() {
      return [
        ...(super.styles ? super.styles : []),
        ...SimpleListboxStyles
      ];
    }
  
    static get properties() {
      return {
        ...(super.properties ? super.properties : {}),
        ...SimpleListboxInternalProperties,
      };
    }
    constructor() {
      super();
      this.filter = "";
      this.itemsList = [];
    }

    render(){
      return !this.tabs ? this.listboxTemplate : this.tablistTemplate;
    }
    /**
     * an object containing proerty info that can be used for debugging
     *
     * @readonly
     */
    get stateInfo() {
      return {
        activeDescendant: this.activeDescendant,
        option: this.option,
        itemsList: this.itemsList,
        filteredOptions: this.filteredOptions,
        value: this.value,
        firstOption: this.firstOption,
        nextOption: this.nextOption,
        lastOption: this.lastOption
      };
    }
  
    firstUpdated(changedProperties) {
      if (super.firstUpdated) super.firstUpdated(changedProperties);
    }
  
    updated(changedProperties) {
      if (super.updated) super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "option") 
        this.dispatchEvent(
          new CustomEvent("value-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this,
          })
        );
      });
      if(this.tablist && this.tablist.updateTabs) setTimeout(this.tablist.updateTabs(),10);
    }
    /**
     * gets a sorted list of option
     *
     * @readonly
     * @memberof SimpleFieldsField
     */
    get sortedList() {
      let list = !this.demoMode 
          ? this.itemsList 
          : this.demoMode == "groups" 
          ? SimpleListBoxDemoGroups 
          : SimpleListBoxDemoItems,
        sorted = (list || []).map((item, i) => typeof item !== "object" ? { id: i, value: item } : item), 
        isGroup = false,
        flattened = [];
      Object.keys(this.options || {})
        .sort((a, b) => (a > b ? 1 : -1))
        .forEach((key) =>
          sorted.push({ id: key, value: this.options[key] })
        );
      sorted.forEach((item,i)=>{
        let option = this._getOption(item,i);
        if(!option.itemsList){
          flattened.push(option)
        } else {
          option.group = option.group || option.id;
          option.tab = option.tab || option.group;
          option.tooltip = option.tooltip || option.group;
          flattened.push({...option});
          isGroup = true;
          option.itemsList.sort((a, b) => (a > b ? 1 : -1)).forEach((subitem,j)=>flattened.push(this._getOption(subitem,`${i}-${j}`)));
        }
      });

      return flattened;
    }
    /**
     * updates options list
     *
     * @param {event} event
     * @memberof SimpleFieldsCombo
     */
    get filteredOptions() {
      if (typeof this.filter !== "string" || typeof this.filter !== "number") this.filter = "";
      this.filter = this.filter.toLowerCase();
  
      var i,
        option,
        textContent, lastGroup, filteredOptions = [];
  
  
      for (i = 0; i < this.sortedList.length; i++) {
        option = this.sortedList[i];
        option.id = i;
        option.textComparison = option.group 
          ? undefined
          : option.textComparison && Array.isArray(option.textComparison) && option.textComparison.length > 0 
          ? option.textComparison.map(text=>text.toLowerCase())
          : [ (option.textComparison || option.value || "").toLowerCase() ];
        let filtered = this.filter.length === 0 || !option.group && option.textComparison.filter(text=>text.indexOf(filter) === 0).length > 0;
        if(!!option.group){
          lastGroup = option;
        } else if (filtered) {
          if(!!lastGroup) {
            filteredOptions.push(lastGroup);
            lastGroup = undefined;
          }
          filteredOptions.push(option);
          textContent = (option.value || '').trim();
        }
      }
      return filteredOptions;
    }

    /**
     * get's option data
     * @param {*} item item to convert to option data
     * @param {string} id iunique identifer
     * @returns {object}
     */
    _getOption(item,id){
      let option = typeof item !== "object" ? { text: item } : item;
      option.id = id;
      option.text = option.text || option.value || option;
      if(option.itemsList) option.textComparison = option.textComparison && Array.isArray(option.textComparison) && option.textComparison.length > 0 
        ? option.textComparison.map(text=>text.toLowerCase())
        : [ (option.textComparison || option.value || "").toLowerCase() ];
      return option;
    }
    /**
     * listbox's id
     *
     * @readonly
     * @returns {string}
     * @memberof SimpleFieldsContainer
     */
    get listboxId() {
      return `${this.id || "simple"}-listbox`;
    }
    /**
     * tablist element from shadowRoot
     *
     * @readonly
     */
    get tablist() {
      if (!this._tablist)
        this._tablist =
          this.shadowRoot && this.shadowRoot.querySelector(`simple-listbox-tabs`)
            ? this.shadowRoot.querySelector(`simple-listbox-tabs`)
            : undefined;
      return this._tablist;
    }
    /**
     * listbox element from shadowRoot
     *
     * @readonly
     */
    get listbox() {
      if (!this._listbox)
        this._listbox =
          this.shadowRoot && this.shadowRoot.querySelector(`#${this.listboxId}`)
            ? this.shadowRoot.querySelector(`#${this.listboxId}`)
            : undefined;
      return this._listbox;
    }
    /**
     * template for tablist in listbox
     *
     * @readonly
     */
    get tablistTemplate(){
      import("./lib/simple-listbox-tabs.js");
      return html`
        <simple-listbox-tabs 
          part="tabsdisplay" 
          exportparts="tablist tablist-item tab tab-active tab-disabled">
          <div role="tabpanel" part="tabpanel">${this.listboxTemplate}</div>
        </simple-listbox-tabs>`;
    }
    /**
     * template for listbox
     *
     * @readonly
     */
    get listboxTemplate() {
      return html`
        <ul
          .aria-labelledBy="${this.labelledBy}"
          .aria-describedBy="${this.describedBy}"
          
          ?hidden="${this.hidden}"
          id="${this.listboxId}"
          role="listbox"
          part="listbox"
        >
          ${this.listboxInnerTemplate}
        </ul>
      `;
    }
    /**
     * template for listbox options
     *
     * @readonly
     */
    get listboxInnerTemplate() {
      return (this.filteredOptions || []).map((option) =>
        this.getListItem(option)
      );
    }
    /**
     * gets value of option
     *
     * @readonly
     */
    get value(){
      return !!this.option ? this.option.value : undefined;
    }
    /**
     * template for list item for a given option
     * @param {object} option object representing option with id and value properties
     * @returns 
     */
    getListItem(option) {
      return !option.group 
        ? html`
          <li
            aria-selected="${option && this.selectedOption && option.id == this.selectedOption.id}"
            id="option${option.id}"
            role="option"
            part="listbox-li"
            @click="${(e) => this._onOptionClick(e, option)}"
            style="${option.style}"
            data-option="${JSON.stringify(option)}"
          >
            ${this.getListItemInner(option)}
          </li>` 
        : this.getGroupItem(option);
    }
    /**
     * template for listbox list item that represents a group label
     */
    getGroupItem(option){
      return html`
      <li
        id="option${option.id}"
        role="presentation"
        part="listbox-group"
        data-group="${option.tab}"
        data-tooltip="${option.tooltip}"
        data-icon="${option.icon}"
      >
        ${this.getListItemInner(option)}
      </li>`;
    }
  
    /**
     * template for text content of a list item option
     * @param {object} option object representing option with id and value properties
     * @returns 
     */
    getListItemInner(option) {
      return html`
        ${option.group ? option.group : option.icon ? html`<simple-icon-lite icon="${option.icon}"></simple-icon-lite>` : option.text}
        ${!option.tooltip ? '' : this.getListItemTooltip(option)}
      `;
    }
  
    /**
     * template for text content of a list item option
     * @param {object} option object representing option with id and value properties
     * @returns 
     */
    getListItemTooltip(option) {
      return html`<simple-tooltip for="option${option.id}">${option.tooltip}</simple-tooltip>`;
    }
    /**
     * sets aria-activeDescendant of listbox
     *
     * @param {object} option
     * @memberof SimpleFieldsCombo
     */
    setActiveDescendant(option) {
      if (option && this.expanded) {
        this.activeDescendant = `option${option.id}`;
        this.scrollToListItem(option);
      } else {
        this.activeDescendant = "";
        this.scrollToListItem(this.firstOption);
      }
    }
    /**
     * reset's active 
     */
    resetActiveDescendant(){
      this.option = false;
      this.setActiveDescendant(false);
    }
    /**
     * sets the selected option, inlcuding active descendent and input selection
     *
     * @param {object} option
     * @param {string} flag
     * @memberof SimpleFieldsCombo
     */
    setOption(option) {
      if(!option) return;
      this.option = option;
      this.setActiveDescendant(option);
      this.selectedOption = option;
      this.scrollToListItem(option);
      console.log('setOption',this.stateInfo);
    }


    setInputValue(option, flag = false){
      if(!option) return;
      if (this.isInline && this.isList) {
        this.value = option.value;
        this.input.value = option.value;
        if (flag) {
          //set selection at the end of value
          setTimeout(() => {
            this.input.setSelectionRange(
              option.value.length,
              option.value.length
            );
          }, 0);
        } else {
          //select suggested characters
          setTimeout(() => {
            this.input.setSelectionRange(
              this.filter.length,
              option.value.length
            );
          }, 0);
        }
      }

    }

    /**
     * scroll to a list item based on option data
     * @param {object} option 
     */
    scrollToListItem(option) {
      if (
        !!this._getOptionById(option)
      )
        this.listbox.scrollTop = this._getOptionById(option).offsetTop;
    }
    /**
     * gets option element given its idata object
     * @param {object} option 
     * @returns {object}
     */
    _getOptionById(option){
      return !!this.listbox &&
      !!option && 
      !!option.id &&
      !!this.shadowRoot &&
      !!this.shadowRoot.querySelector(`#option${option.id}`) 
      ? !!this.shadowRoot.querySelector(`#option${option.id}`)
      : undefined;
    }
    /**
     * handles option click
     * @param {event} event 
     * @param {option data} option 
     */
    _onOptionClick(event, option) {
      if(!this.disabled) this.setOption(option);
    }

    /**
     * filters out group items from sorted list 
     *
     * @readonly
     */
    get optionsOnly(){
      return (this.sortedList || []).filter(option=>!option.group);
    }

  
    /**
     * whether or not list has options
     *
     * @readonly
     */
    get hasOptions() {
      return this.optionsOnly.length > 0;
    }

    /**
     * first option from options
     *
     * @readonly
     */
    get firstOption(){
      return this.hasOptions ? this.optionsOnly[0] : false;
    }
  
    /**
     * last option from options
     *
     * @readonly
     */
    get lastOption(){
      return this.hasOptions ? this.optionsOnly[this.optionsOnly.length - 1] : false;
    }
  
    /**
     * option that appears before active desciendant in list of options
     *
     * @readonly
     */
    get previousOption() {
      var index,
        optionId = !this.option ? undefined : this.option.id,
        firstId = !this.firstOption ? undefined : this.firstOption.id,
        itemIds = this.optionsOnly.map((o) => o.id);
      if (!!firstId && optionId !== firstId) {
        index = itemIds.indexOf(optionId);
        return this.optionsOnly[index - 1];
      }
      return this.firstId;
    }
    /**
     * option that appears after active desciendant in list of options
     *
     * @readonly
     */
    get nextOption() {
      var index,
        optionId = !this.option ? undefined : this.option.id,
        lastId = !this.lastOption ? undefined : this.lastOption.id,
        itemIds = this.optionsOnly.map((o) => o.id);
      if (!!lastId  && optionId !== lastId) {
        index = itemIds.indexOf(optionId);
        return this.optionsOnly[index + 1];
      }
      return this.firstOption;
    }
    /**
     * gets unicode character for an HTML entity
     * @param {string} html HTML entity
     * @returns {string}
     */
    _getUnicode(html){
        if(!html.match(/^\&\#[a-zA-Z0-9]+\;$/)) return;
        let temp = document.createElement('textarea');
        temp.innerHTML = html;
      return temp.value;
    }
  };
}
/**
 *`simple-listbox`
 * input tags and validate an array of input
 * can return as a string or object based on
 * requirements of the implementing element
 *
 * @customElement
 * @class SimpleListbox
 * @extends {SimpleListBoxBehaviors(LitElement)}
 * @demo ./demo/index.html Overview
 * @demo ./demo/groups.html Groups of Items
 * @demo ./demo/icons.html Icons
 * @demo ./demo/emoji.html Emojis
 * @demo ./demo/symbols.html Symbols
 */
class SimpleListbox extends SimpleListBoxBehaviors(LitElement) {
  static get tag() {
    return "simple-listbox";
  }
}
window.customElements.define(SimpleListbox.tag, SimpleListbox);
export { 
  SimpleListbox, 
  SimpleListBoxBehaviors, 
  SimpleListboxProperties, 
  SimpleListboxInternalProperties, 
  SimpleListboxStyles, 
  SimpleListboxIconStyles, 
  SimpleListBoxDemoGroups, 
  SimpleListBoxDemoItems };
