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
    firstUpdated(changedProperties) {
      if (super.firstUpdated) super.firstUpdated(changedProperties);
      this.selectItem(this.selected);
    }

    /**
     * handle updates
     */

    attributeChangedCallback(name, oldVal, newVal) {
      if (super.attributeChangedCallback)
        super.attributeChangedCallback(name, oldVal, newVal);
      if (name === "selection" && this.selection !== oldValue)
        this._handleSelectionChange();
    }

    constructor() {
      super();
      this.addEventListener(this._selectEvent, this._handleSelectItem);
    }

    render() {
      return ``;
    }

    /**
     * mutation observer for tabs
     * @readonly
     * @returns {object}
     */
    get observer() {
      let callback = (mutationsList, observer) =>
        this._handleItemChange(mutationsList, observer);
      return new MutationObserver(callback);
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
    /**
     * query selector for slotted children, can be overridden
     * @readonly
     */
    get _query() {
      return "> item";
    }
    /**
     * attribute to apply to selected item, can be overridden
     * @readonly
     */
    get _selected() {
      return "selected";
    }
    /**
     * name of event that selects item, can be overridden
     * @readonly
     */
    get _selectEvent() {
      return "select-item";
    }
    /**
     * index of selected item
     * @readonly
     */
    get selectedIndex() {
      let item = this.itemData.filter(i => i.id === this.selection);
      return item && item[0] ? item[0].index : 0;
    }
    /**
     * id of selected item
     * @readonly
     */
    get selection() {
      return this.getAttribute("selection");
    }
    /**
     * sets id of selected item
     * @readonly
     */
    set selection(value) {
      this.setAttribute("selection", value);
    }
    /**
     * updates array of items
     * @returns
     */
    _getDataFromItems() {
      let slotted = this.querySelectorAll(`${this._query}`);
      return Object.keys(slotted || {}).map(key =>
        this._getDataFromItem(slotted[key], key, this.selected)
      );
    }
    /**
     * updates iitem for item array
     * @returns
     */
    _getDataFromItem(item, index, selected) {
      if (!item.id || item.id.trim().length < 1) item.id = this._generateUUID();
      let data = {
        id: item.id,
        index: parseInt(index),
        node: item,
        innerHTML: item.innerHTML,
        selected: item.getAttribute(selected)
      };
      return data;
    }
    /**
     * sets item _selected attribute
     *
     * @param {*} item
     */
    _setItemSelected(item) {
      item.id !== this.selection
        ? item.removeAttribute(this._selected)
        : item.setAttribute(this._selected, true);
    }

    /**
     * selects an item
     * @param {string|object} item id or node
     */
    selectItem(item) {
      if (typeof item === "string" && item.trim().length > 0)
        item = this.querySelector(`${this._query}#${item}`);
      if (item && item.id && !item.disabled && item.id !== this.selection) {
        this.setAttribute("selection", item.id);
        this._handleSelectionChange();
      } else if (
        this.selection &&
        !this.querySelector(`${this._query}#${this.selection}`)
      ) {
        let sel =
          this.querySelector(`${this._query}[${this._selected}]`) ||
          this.querySelector(`${this._query}`);
        this.setAttribute("selection", sel ? sel.id : undefined);
        this._handleSelectionChange();
      } else if (
        this.querySelectorAll(`${this._query}[${this._selected}]`).length > 1
      ) {
        this._handleSelectionChange();
      }
      this._updateItemData();
    }
    /**
     * updates when slotted item changes
     * @param {*} mutationsList
     * @param {*} observer
     */
    _handleItemChange(mutationsList, observer) {
      let changed = false;
      mutationsList.forEach(m => {
        let added = m.type === "childList" ? m.addedNodes.length > 0 : false,
          removed =
            m.type === "childList" && m.removedNodes.length > 0
              ? Object.keys(m.removedNodes || {}).filter(
                  n => m.removedNodes[n].id === this.selection
                ).length > 0
              : false,
          id = m.type === "attributes" && m.attributeName === "id";
        changed = changed || added || removed || id;
      });
      if (changed) {
        this.querySelectorAll(`${this._query}`).forEach(i => {
          if (!i.id) i.id = this._generateUUID();
        });
        this.selectItem(this.selection);
      }
      this._updateItemData();
    }
    /**
     * handles item selection event
     * @param {event} e
     */
    _handleSelectItem(e) {
      if (e.stopPropagation) e.stopPropagation();
      this.selectItem(e.detail.controls);
    }
    /**
     * shows or hides items based on selection
     */
    _handleSelectionChange() {
      this.querySelectorAll(`${this._query}`).forEach(i =>
        this._setItemSelected(i)
      );
      /**
       * Fires when selection update, so that parent radio group can listen for it.
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
     * updates items list and rerenders as needed;
     */
    _updateItemData() {
      this.itemData = this._getDataFromItems();
      if (this.render) this.render();
    }
    /**
     * generates a unique id
     * @returns {string } unique id
     */
    _generateUUID() {
      return "item-ss-s-s-s-sss".replace(
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
      this.removeEventListener(this._selectEvent, this._handleSelectItem);
      super.disconnectedCallback();
    }
  };
};
/**
 * RadioBehaviors
 * Provides state management when only one child can be selected at a time.
 */
export { RadioBehaviors };
