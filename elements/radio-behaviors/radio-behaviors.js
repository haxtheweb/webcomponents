/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
const RadioBehaviors = function (SuperClass) {
  return class extends SuperClass {
    render() {
      return ``;
    }

    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        itemData: {
          type: Array,
        },
        selection: {
          type: String,
          attribute: "selection",
        },
      };
    }

    constructor() {
      super();
      this.addEventListener(this.__selectEvent, this._handleSelectItem);
    }

    connectedCallback() {
      super.connectedCallback();
      this.__observer.observe(this, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    /**
     * life cycle, element is removed from the DOM
     */
    disconnectedCallback() {
      if (this.__observer && this.__observer.disconnect)
        this.__observer.disconnect();
      this.removeEventListener(this.__selectEvent, this._handleSelectItem);
      super.disconnectedCallback();
    }

    /**
     * listen for change event
     */
    firstUpdated(changedProperties) {
      if (super.firstUpdated) super.firstUpdated(changedProperties);
      this.selectItem(this.selection);
    }

    /**
     * listen for change event
     */
    updated(changedProperties) {
      if (super.updated) super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "selection" && this.selection !== oldValue)
          this.selectItem(this.selection);
      });
    }
    /**
     * index of selected item
     * @readonly
     */
    get selectedIndex() {
      let item = this.itemData.filter((i) => i.id === this.selection);
      return item && item[0] ? item[0].index : 0;
    }

    /**
     * mutation observer for tabs
     * @readonly
     * @returns {object}
     */
    get __observer() {
      let callback = (mutationsList, observer) =>
        this._handleItemChange(mutationsList, observer);
      return new MutationObserver(callback);
    }
    /**
     * allows no item to be selected
     * @readonly
     */
    get __allowNull() {
      return false;
    }
    /**
     * query selector for slotted children, can be overridden
     * @readonly
     */
    get __query() {
      return "> item";
    }
    /**
     * attribute to apply to selected item, can be overridden
     * @readonly
     */
    get __selected() {
      return "selected";
    }
    /**
     * name of event that selects item, can be overridden
     * @readonly
     */
    get __selectEvent() {
      return "select-item";
    }

    /**
     * selects an item
     * @param {string|object} item id or node
     */
    selectItem(item) {
      //make sure item is an object
      item =
        typeof item === "string" && item.trim().length > 0
          ? this._getItemById(item)
          : typeof item === "integer"
            ? this._getItemByIndex(item)
            : item;

      //make sure an item is selected if null is unallowed
      if (!this.__allowNull && (!item || item.disabled)) {
        item =
          this.selection && this._getItemByQuery(`#${this.selection}`)
            ? this._getItemByQuery(`#${this.selection}`)
            : this.__selected && this._getItemByQuery(`[${this.__selected}]`)
              ? this._getItemByQuery(`[${this.__selected}]`)
              : this._getItemByQuery();
      }

      //only update if item isn't already selected
      if (item && !this._isItemSelected(item)) {
        item.id = item.id || this._generateUUID();
        this.selection = item.id;
        this._handleSelectionChange();
      } else if (!item && this.__allowNull && this.selection) {
        this.selection = undefined;
        this._handleSelectionChange();
      }

      //make sure itemData is up-to-date
      this._updateItemData();
    }
    /**
     * updates array of items
     * @returns
     */
    _getDataFromItems() {
      let slotted = this.querySelectorAll(`${this.__query}`);
      return Object.keys(slotted || {}).map((key) =>
        this._getDataFromItem(slotted[key], key, this.__selected),
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
        selected: item.getAttribute(selected),
      };
      return data;
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
          .substring(1),
      );
    }

    /**
     * gets first non-disabled item that matches a given id
     *
     * @param {string} id
     * @returns object
     */
    _getItemById(id) {
      return this._getItemByQuery(`#${id}`);
    }

    /**
     * gets non-disabled item at a given index
     *
     * @param {integer} index
     * @returns object
     */
    _getItemByIndex(index) {
      let items = this.querySelectorAll(this.__query);
      return items && items[index] && !items[index].disabled
        ? items[index]
        : undefined;
    }

    /**
     * gets first non-disabled item that matches query
     *
     * @param {string} query
     * @returns object
     */
    _getItemByQuery(query = "") {
      let item = this.querySelector(`${this.__query}${query}`);
      return item && !item.disabled ? item : undefined;
    }
    /**
     * updates when slotted item changes
     * @param {*} mutationsList
     * @param {*} observer
     */
    _handleItemChange(mutationsList, observer) {
      let changed = false;
      //see if any mutations are relevant enough
      mutationsList.forEach((m) => {
        let added = m.type === "childList" ? m.addedNodes.length > 0 : false,
          removed =
            m.type === "childList" && m.removedNodes.length > 0
              ? Object.keys(m.removedNodes || {}).filter(
                  (n) => m.removedNodes[n].id === this.selection,
                ).length > 0
              : false,
          id = m.type === "attributes" && m.attributeName === "id";
        changed = changed || added || removed || id;
      });
      if (changed) {
        this.querySelectorAll(`${this.__query}`).forEach((i) => {
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
      this.querySelectorAll(`${this.__query}`).forEach((i) =>
        this._setItemSelected(i),
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
          detail: this,
        }),
      );
    }
    /**
     * checks to see if item is the selected item
     *
     * @param {*} item
     * @returns
     */
    _isItemSelected(item) {
      return (
        item &&
        ((item.id && item.id === this.selection) ||
          item.hasAttribute(this.__selected))
      );
    }
    /**
     * sets item __selected attribute
     *
     * @param {*} item
     */
    _setItemSelected(item) {
      item.id !== this.selection
        ? item.removeAttribute(this.__selected)
        : item.setAttribute(this.__selected, true);
    }
    /**
     * updates items list and rerenders as needed;
     */
    _updateItemData() {
      this.itemData = this._getDataFromItems();
      if (this.render) this.render();
    }
  };
};
/**
 * RadioBehaviors
 * Provides state management when only one child can be selected at a time.
 */
export { RadioBehaviors };
