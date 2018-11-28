/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "./lib/lrnsys-outline-item.js";
/**
`lrnsys-outline`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
*/
let LrnsysOutline = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host kbd {
        display: inline-block;
        background: #333;
        color: white;
        border-radius: 4px;
        margin: 4px 4px 4px 0;
        padding: 8px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        font-size:85%;
      }
    </style>
    <h1>[[title]]<paper-icon-button title="Keyboard directions" id="dialogtrigger" icon="icons:help" on-tap="openDirections"></paper-icon-button></h1>
    <paper-dialog id="modal" with-backdrop="">
      <h2>Keyboard shortcuts</h2>
      <div>
        <paper-icon-button title="close directions" style="position: absolute;top: 0; right:0;" icon="icons:cancel" on-tap="closeDirections"></paper-icon-button>
        <ul>
          <li><kbd>Enter</kbd> to <strong>add</strong> an item</li>
          <li><kbd>Backspace</kbd> <em>with entire item selected</em> to <strong>delete</strong> an item.</li>
          <li><kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>←</kbd> / <kbd>→</kbd> to <strong>navigate</strong> through items</li>
          <li><kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> <em>at the beginning of a line</em> to <strong>indent/outdent</strong></li>
          <li><kbd>Shift+↑</kbd> / <kbd>Shift+↓</kbd> to items up/down</li>
        </ul>
      </div>
    </paper-dialog>
    <div id="itemslist">
      <template is="dom-repeat" items="{{items}}" as="item">
        <lrnsys-outline-item disable-down$="[[item.disableDown]]" disable-left$="[[item.disableLeft]]" disable-right$="[[item.disableRight]]" disable-up$="[[item.disableUp]]" id$="[[item.id]]" index$="[[item.index]]" indent-level$="{{item.indent}}" parent\$="{{item.parent}}" title\$="{{item.title}}">
        </lrnsys-outline-item>
      </template>
    </div>
`,

  is: "lrnsys-outline",

  listeners: {
    "delete-item": "_handleRemoveItem",
    "indent-item": "_handleIndentItem",
    "focus-item": "_handleFocusItem",
    "add-item": "_handleAddItem",
    "move-item": "_handleMoveItem",
    "change-item": "_handleChangeItem",
    "focus-item": "_handleFocusItem",
    "blur-item": "_handleBlurItem"
  },

  properties: {
    title: {
      type: String,
      value: "Content Outline"
    },
    data: {
      type: Array,
      value: null
    },
    items: {
      type: Array,
      value: null,
      notify: true
    }
  },

  /**
   * Display directions for keyboard usage
   */
  openDirections: function(e) {
    this.$.modal.opened = true;
  },

  /**
   * Display directions for keyboard usage
   */
  closeDirections: function(e) {
    this.$.modal.opened = false;
    this.$.dialogtrigger.focus();
  },

  /**
   * Attached lifecycle
   */
  attached: function() {
    this.__modal = this.$.modal;
    document.body.addEventListener(
      "iron-overlay-canceled",
      this._accessibleFocus.bind(this)
    );
    // fix stack order
    document.body.appendChild(this.$.modal);
  },

  /**
   * Set ourselves as having focus after the modal closes.
   */
  _accessibleFocus: function(e) {
    // this is OUR modal, we found her, oh modal, We've missed
    // you so much. thank you for coming home. We're so, so, so
    // sorry that we appended you to the body. We'll never do it
    // again (until the next time you open).
    if (e.detail === this.__modal) {
      // focus on our dialog triggering button
      this.$.dialogtrigger.focus();
    }
  },

  ready: function() {
    if (this.data === null || this.data.length < 1) {
      this.__tempid = this.__tempid === undefined ? 0 : this.__tempid + 1;
      this.data = [
        {
          id: "outline-item-" + this.__tempid,
          title: "",
          order: 0,
          parent: null
        }
      ];
    }
    this.setData(this.data);
  },

  /**
   * gets a nested array of items to convert & updates the dom-repeat
   */
  setData: function(data) {
    this.items = [];
    this.items = data;
    if (data !== undefined && data.length > 0) {
      let prevIndent = -1;
      for (var i in data) {
        let indent = parseInt(this._getIndent(data, i));
        this.__tempid = this.__tempid === undefined ? 0 : this.__tempid + 1;
        data[i].index = parseInt(i);
        data[i].indent = indent;
        data[i].prevSibling = this._getSibling(parseInt(i), indent, true);
        data[i].nextSibling = this._getSibling(parseInt(i), indent, false);
        data[i].disableUp = data[i].prevSibling === null;
        data[i].disableDown = data[i].nextSibling === null;
        data[i].disableLeft = indent === 0;
        data[i].disableRight = indent > prevIndent;
        data[i].id =
          data[i].id === undefined
            ? "outline-item-" + this.__tempid
            : data[i].id;
        prevIndent = indent;
      }
    }
    this.items = [];
    this.items = data;
  },

  /**
   * gets a flat array of items to convert & updates it to a nested array
   */
  getData: function() {
    for (var i in this.items) {
      this.items[i].order = this._getOrder(this.items[i]);
    }
    return this.items;
  },

  /**
   * adds a new item
   */
  addItem: function(item) {
    let items = this.items,
      i = item.index;
    this.__tempid = this.__tempid + 1;
    items.splice(i + 1, 0, {
      id: "outline-item-" + this.__tempid,
      title: "",
      indent: item.indent,
      parent: item.parent
    });
    this._refreshData();
    this.__focusedItem = item.nextElementSibling;
    this.__focusedItem.focus();
  },

  /**
   * removes an item
   */
  removeItem: function(item) {
    let i = item.index,
      items;
    if (confirm("Do you really want to delete " + this.items[i].title + "?")) {
      this.__focusedItem = item.previousElementSibling;
      for (k in this.items) {
        if (this.items[k].parent == this.items[i].id) {
          this.items[k].parent = this.items[i].parent;
        }
      }
      this.items.splice(i, 1);
      this._refreshData();
      this.__focusedItem.focus();
    }
  },

  /**
   * moves an grop of items down
   */
  moveItem: function(item, moveUp) {
    let root = this,
      sourceStart = item.index,
      sourceEnd = this._getLastChild(item),
      sourceCount = sourceEnd - sourceStart + 1;
    let target = moveUp
      ? this.items[sourceStart].prevSibling
      : this._getLastChild(this.items[sourceEnd + 1]) - sourceCount + 1;
    let items = this.items,
      items2;
    if (target > -1 && target < this.items.length) {
      if ((moveUp && !item.disableUp) || (!moveUp && !item.disableDown)) {
        items2 = items.splice(
          target,
          0,
          items.splice(sourceStart, sourceCount)
        );
        this.setData(items);
        this.__focusedItem = this.$.itemslist.querySelectorAll(
          "lrnsys-outline-item"
        )[target];
        this.__focusedItem.focus();
      }
    }
  },

  /**
   * refresh the array
   */
  _refreshData: function() {
    let data = this.items;
    this.items = [];
    this.items = data;
    if (this.__focusedItem !== undefined && this.__focusedItem !== null)
      this.__focusedItem.focus();
  },

  /**
   * adjust indent
   */
  _adjustIndent: function(item, amount) {
    if (
      (amount > 0 && !item.disableRight) ||
      (amount < 0 && !item.disableLeft)
    ) {
      let i = parseInt(item.index),
        oldIndent = item.indent,
        indent = item.indent + amount,
        n = i + 1;
      let prevParent = item.prevSibling !== null ? item.prevSibling.id : null;
      let grandParent =
        this._getItemById(item.parent) && this._getItemById(item.parent).parent
          ? this._getItemById(item.parent).parent.id
          : null;
      item.indent = indent;
      item.parent = amount > 0 ? prevParent : grandParent;
      item.prevSibling = this._getSibling(i, indent, true);
      item.nextSibling = this._getSibling(i, indent, false);
      item.disableUp = item.prevSibling === null;
      item.disableDown = item.nextSibling === null;
      item.disableLeft = indent === 0;
      item.disableRight =
        this.items[i - 1] === null || indent > this.items[i - 1].indent;
      while (
        this.items[n] !== null &&
        this.items[n] !== undefined &&
        oldIndent < this.items[n].indent
      ) {
        this.items[n].indent = this.items[n].indent + amount;
        n++;
        next = this.items[n];
      }
      this._refreshData();
    }
  },

  /**
   * gets all children of an item
   */
  _getLastChild: function(item) {
    let next =
      item !== undefined && item !== null
        ? this._getSibling(item.index, item.indent, false)
        : null;
    if (next !== null && next !== undefined) {
      return next - 1;
    } else if (
      item.parent !== null &&
      item.parent !== null &&
      this._getItemById(item.parent) !== null
    ) {
      return this._getLastChild(this._getItemById(item.parent));
    } else {
      return this.items.length - 1;
    }
  },

  /**
   * converts a nested array of items and returns a flat list with indents
   */
  _getIndent: function(data, i) {
    if (data[i].parent !== undefined) {
      let k = data.findIndex(j => j.id === data[i].parent);
      if (data[k] !== undefined && data[k].indent !== undefined) {
        return data[k].indent + 1;
      }
    }
    return 0;
  },

  /**
   * returns order relative to siblings
   */
  _getOrder: function(item) {
    let ctr = 0,
      order = 0;
    for (var i in this.items) {
      if (this.items[i].parent == item.parent && this.items[i].id == item.id) {
        order = ctr;
      } else if (this.items[i].parent == item.parent) {
        ctr++;
      }
    }
    return order;
  },

  /**
   * returns previous or next sibling
   */
  _getSibling: function(index, indent, prev) {
    let inc = prev ? -1 : 1,
      i = index + inc,
      sib = null;
    while (i < this.items.length && i > -1) {
      if (sib === null && this.items[i].parent === this.items[index].parent) {
        sib = i;
      }
      i += inc;
    }
    return sib;
  },

  /**
   * get an item by item id
   */
  _getItemById: function(id, offset) {
    let i = this.items.findIndex(j => j.id === id);
    offset = offset === undefined ? 0 : offset;
    if (this.items[i + offset] !== undefined) {
      return this.items[i + offset];
    } else {
      return null;
    }
  },

  /**
   * listener to add an item
   */
  _handleAddItem: function(e) {
    this.addItem(e.detail.item);
  },

  /**
   * listener to delete an item
   */
  _handleRemoveItem: function(e) {
    this.removeItem(e.detail.item);
  },

  /**
   * listener to move an item
   */
  _handleMoveItem: function(e) {
    this.moveItem(e.detail.item, e.detail.moveUp, e.detail.byGroup);
  },

  /**
   * listener to move focus up or down
   */
  _handleFocusItem: function(e) {
    let item = e.detail.moveUp
      ? e.detail.item.previousElementSibling
      : e.detail.item.nextElementSibling;
    item.setSelection();
  },

  /**
   * listener to increase or decrease indent
   */
  _handleIndentItem: function(e) {
    let amt = e.detail.increase ? 1 : -1;
    this._adjustIndent(this._getItemById(e.detail.item.id), amt);
  },

  /**
   * listener to handle changes to text inputs
   */
  _handleChangeItem: function(e) {
    this._getItemById(e.detail.item.id).title = e.detail.value;
    this._refreshData();
  },

  /**
   * listener for focus or mouseover
   */
  _handleFocusItem: function(e) {
    this.__focusedItem = e.srcElement;
  },

  /**
   * listener for blur or mouseout
   */
  _handleBlurItem: function(e) {}
});
export { LrnsysOutline };
