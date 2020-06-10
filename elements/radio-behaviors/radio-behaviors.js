/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
const RadioBehaviors = function(SuperClass) {
  return class extends SuperClass {

    connectedCallback() {
      super.connectedCallback();
      this.observer.observe(this, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }

    /**
     * listen for change event
     */
    firstUpdated(changedProperties){
      if(super.firstUpdated) super.firstUpdated(changedProperties);
      this.selectItem(this.selected);
    }

    /**
     * handle updates
     */

    attributeChangedCallback(name, oldVal, newVal) {
      if(super.attributeChangedCallback) super.attributeChangedCallback(name, oldVal, newVal);
      if (name === "selection" && this.selection !== oldValue) this._handleSelectionChange();
    }

    constructor() {
      super();
    }

    render(){
      return ``;
    }

    /**
     * mutation observer for tabs
     * @readonly
     * @returns {object}
     */
    get observer() {
      let callback = (mutationsList, observer) => this._handleItemChange(mutationsList, observer);
      return new MutationObserver(callback);
    }
    /**
     * query selector for slotted children, can be overridden
     * @readonly
     */
    get _query(){
      return '> item';
    }
    get _selected(){
      return 'selected';
    }

    getDataFromItems(selected){
      let slotted = this.querySelectorAll(`${this._query}`); 
      return Object.keys(slotted || {}).map(key=>this.getDataFromItem(slotted[key],selected));
    }
    getDataFromItem(item,selected){
      let data = {
        id: item.id,
        innerHTML: item.innerHTML,
        selected: item.getAttribute(selected)
      };
      return data;
    }

    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        itemData: {
          type: Array
        }
      };
    }

    

    get selection(){
      return this.getAttribute('selection');
    }

    set selection(value){
      this.setAttribute('selection',value);
    }

    /**
     * selects an item
     * @param {string|object} item id or node
     */
    selectItem(item) {
      if(typeof item === "string") item = this.querySelector(`${this._query}#${item}`);
      console.log('selectItem',item,this.querySelector(`${this._query}`),this.selection);
      if (item && item.id && !item.disabled && item.id !== this.selection) {
        this.setAttribute('selection',item.id);
        this._handleSelectionChange();
      } else if(!this.querySelector(`${this._query}#${this.selection}`)){
        let sel = this.querySelector(`${this._query}[${this._selected}]`) || this.querySelector(`${this._query}`);
        this.setAttribute('selection',sel ? sel.id : undefined);
        this._handleSelectionChange();
      } else if(this.querySelectorAll(`${this._query}[${this._selected}]`).length > 1){
        this._handleSelectionChange();
      }
      this._updateItemData();
    }

    _handleItemChange(mutationsList, observer){
      let changed = false;
      console.log('_handleItemChange',mutationsList, observer,changed);
      mutationsList.forEach(m=>{
        let added = m.type === "childList" ? m.addedNodes.length > 0 : false,
          removed = m.type === "childList" && m.removedNodes.length > 0 ? Object.keys(m.removedNodes || {}).filter(n=>m.removedNodes[n].id === this.selection).length > 0 : false,
          id = m.type === "attributes" && m.attributeName === 'id';
        changed = changed || added || removed || id;
        console.log('m',m,added,removed,id,changed);
      });
      if(changed) {
        this.querySelectorAll(`${this._query}`).forEach(i=>{if(!i.id) i.id = `item-${this._generateUUID()}`});
        this.selectItem(this.selectedItem);
      }
      this._updateItemData();
    }
    _updateItemData(){
      this.itemData = this.getDataFromItems(this._selected);
      if(this.render) this.render();
      console.log('this.itemData',this.itemData,this.render);
    }
    /**
     * shows or hides items based on selection
     *
     */
    _handleSelectionChange(){
      console.log('_handleSelectionChange',this.selection,this.querySelectorAll(`${this._query}`));
      this.querySelectorAll(`${this._query}`).forEach(i=>{
        i.id !== this.selection 
          ? i.removeAttribute(this._selected)
          : i.setAttribute(this._selected,true)
      });
      console.log('after selection Change',this.selection,this.querySelectorAll(`${this._query}`));
      /**
       * Fires when selection update, so that parent radio group can listen for it.
       *
       * @event selection-changed
       */
      this.dispatchEvent(
        new CustomEvent("selection-changed", {
          bubbles: false,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }
    /**
     * generates a unique id
     * @returns {string } unique id
     */
    _generateUUID() {
      return "ss-s-s-s-sss".replace(
        /s/g,
        Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1)
      );
    }
    /**
     * life cycle, element is removed from the DOM
     */
    disconnectedCallback() {
      if (this.observer && this.observer.disconnect) this.observer.disconnect();
      super.disconnectedCallback();
    }
  };
};
/**
 * RadioBehaviors
 * Provides state management when only one child can be selected at a time.
 */
export { RadioBehaviors };
