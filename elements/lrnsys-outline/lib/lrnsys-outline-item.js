import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lrnwebcomponents/drawing-icons/drawing-icons.js";
/**
`lrnsys-outline-item`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        --indent-multiplier: 20px;
      }
      :host [data-indent="0"] #move {
        margin-right: calc(var(--indent-multiplier) * 0);
      }
      :host [data-indent="1"] #move {
        margin-right: calc(var(--indent-multiplier) * 1);
      }
      :host [data-indent="2"] #move {
        margin-right: calc(var(--indent-multiplier) * 2);
      }
      :host [data-indent="3"] #move {
        margin-right: calc(var(--indent-multiplier) * 3);
      }
      :host [data-indent="4"] #move {
        margin-right: calc(var(--indent-multiplier) * 4);
      }
      :host [data-indent="5"] #move {
        margin-right: calc(var(--indent-multiplier) * 5);
      }
      :host [data-indent="6"] #move {
        margin-right: calc(var(--indent-multiplier) * 6);
      }
      :host #input {
        flex-grow: 1;
        margin-right: 10px;
      }
      :host #wrapper {
        display: flex;
        height: 40px;
        border-radius: 0.16px;
        background-color: white;
      }
      :host(:focus) #wrapper,
      :host(:hover) #wrapper {
        cursor: pointer;
      }
      #move {
        font-size: 16px;
        padding: 10px;
        color: transparent;
      }
      :host(:focus) #move,
      :host(:hover) #move {
        color: var(--lrnsys-outline-move-icon-color, #aaaaaa);
      }
      paper-icon-button {
        font-size: 16px;
        height: 36px;
        padding: 10px;
        margin: 4px;
        display: none;
        border-radius: 0.16px;
      }
      :host(:focus) paper-icon-button,
      :host(:hover) paper-icon-button {
        width: 36px;
        display: inline-flex;
      }
      paper-icon-button#add {
        width: 36px;
        margin-right: 2px;
        color: white;
        background-color: var(--lrnsys-outline-add-button-color, #018dff);
      }
      paper-icon-button#delete {
        color: white;
        background-color: var(--lrnsys-outline-delete-button-color, #cc0000);
      }
    </style>
    <div id="wrapper" data-indent$="[[indentLevel]]">
      <iron-icon
        id="move"
        title="Move"
        icon="drawing:move"
        role="presentation"
      ></iron-icon>
      <paper-input
        id="input"
        label="Enter a page title"
        value="{{title}}"
        no-label-float=""
      >
      </paper-input>
      <paper-icon-button
        id="add"
        title="Add Item"
        icon="icons:add"
        on-tap="add"
      ></paper-icon-button>
      <paper-icon-button
        id="delete"
        title="Delete"
        icon="icons:delete"
        on-tap="delete"
      ></paper-icon-button>
    </div>
    <paper-icon-button
      id="down"
      title="Move downwards"
      icon="icons:arrow-downward"
      on-tap="moveDown"
    ></paper-icon-button>
    <paper-icon-button
      id="left"
      title="Outdent"
      icon="icons:arrow-back"
      on-tap="moveOut"
    ></paper-icon-button>
    <paper-icon-button
      id="right"
      title="Indent"
      icon="icons:arrow-forward"
      on-tap="moveIn"
    ></paper-icon-button>
    <paper-icon-button
      id="up"
      title="Move upwards"
      icon="icons:arrow-upward"
      on-tap="moveUp"
    ></paper-icon-button>
    <iron-a11y-keys
      id="a11y"
      target="[[__inputTarget]]"
      keys="enter"
      on-keys-pressed="_onEnter"
    ></iron-a11y-keys>
    <iron-a11y-keys
      id="a11y"
      target="[[__inputTarget]]"
      keys="backspace"
      on-keys-pressed="_onBackspace"
    ></iron-a11y-keys>
    <iron-a11y-keys
      id="a11y"
      target="[[__inputTarget]]"
      keys="up"
      on-keys-pressed="_onArrowUp"
    ></iron-a11y-keys>
    <iron-a11y-keys
      id="a11y"
      target="[[__inputTarget]]"
      keys="down"
      on-keys-pressed="_onArrowDown"
    ></iron-a11y-keys>
    <iron-a11y-keys
      id="a11y"
      target="[[__inputTarget]]"
      keys="tab"
      on-keys-pressed="_onTab"
    ></iron-a11y-keys>
    <iron-a11y-keys
      id="a11y"
      target="[[__inputTarget]]"
      keys="shift+tab"
      on-keys-pressed="_onShiftTab"
    ></iron-a11y-keys>
    <iron-a11y-keys
      id="a11y"
      target="[[__inputTarget]]"
      keys="shift+up"
      on-keys-pressed="_onShiftArrowUp"
    ></iron-a11y-keys>
    <iron-a11y-keys
      id="a11y"
      target="[[__inputTarget]]"
      keys="shift+down"
      on-keys-pressed="_onShiftArrowDown"
    ></iron-a11y-keys>
  `,
  is: "lrnsys-outline-item",
  listeners: {
    change: "_onChange"
  },
  properties: {
    indentLevel: {
      type: Number,
      value: 0
    },
    index: {
      type: Number,
      value: 0
    },
    parent: {
      type: String,
      value: null
    },
    value: {
      type: String,
      value: null,
      notify: true,
      reflectToAttribute: true
    }
  },
  /**
   * attached life cycle
   */
  attached: function() {
    this.fire("attached-item", { item: this });
  },
  /**
   * ready life cycle
   */
  ready: function() {
    this.__inputTarget = this.$.input;
    this.fire("focus-item", this);
    this.addEventListener("focus", e => {
      this.fire("focus-item", this);
    });
    this.addEventListener("mouseover", e => {
      this.fire("focus-item", this);
    });
    this.addEventListener("blur", e => {
      this.fire("blur-item", this);
    });
    this.addEventListener("mouseout", e => {
      this.fire("blur-item", this);
    });
  },
  /**
   * detached life cycle
   */
  detached: function() {
    this.removeEventListener("focus", e => {
      this.fire("focus-item", this);
    });
    this.removeEventListener("mouseover", e => {
      this.fire("focus-item", this);
    });
    this.removeEventListener("blur", e => {
      this.fire("blur-item", this);
    });
    this.removeEventListener("mouseout", e => {
      this.fire("blur-item", this);
    });
  },

  focus: function() {
    this.$.input.focus();
    return this;
  },

  value: function() {
    this.title = this.$.input.value;
    return this.title;
  },

  delete: function() {
    this.fire("delete-item", { item: this });
  },

  setIndent: function(amount) {
    this.fire("indent-item", { item: this, increase: amount > 0 });
  },

  add: function() {
    let i = this.$.input.selectionStart,
      j = this.$.input.value;
    this.fire("add-item", {
      item: this,
      value: j.slice(0, i),
      new: j.slice(i, j.length)
    });
  },

  move: function(amount) {
    this.fire("move-item", { item: this, moveUp: amount < 0 });
  },
  moveUp: function(e) {
    this.move(-1);
  },
  moveDown: function(e) {
    this.move(1);
  },
  moveOut: function(e) {
    this.setIndent(-1);
  },
  moveIn: function(e) {
    this.setIndent(1);
  },
  setSelection: function(start, end) {
    let s = start !== undefined ? start : 0,
      n = end !== undefined ? end : s;
    try {
      this.$.input.querySelector("input").setSelectionRange(s, n);
    } catch (e) {
      console.log(e);
    }
    this.focus();
  },

  _onChange: function() {
    this.fire("change-item", { item: this, value: this.$.input.value });
  },

  _onEnter: function() {
    let i = this.$.input.selectionStart,
      j = this.$.input.value;
    this.fire("add-item", {
      item: this,
      value: j.slice(0, i),
      new: j.slice(i, j.length)
    });
  },

  _onBackspace: function(e) {
    if (window.getSelection().toString() == this.$.input.value) {
      e.detail.keyboardEvent.preventDefault();
      this.fire("delete-item", { item: this });
    } else if (this.$.input.selectionStart == 0) {
      this.fire("indent-item", { item: this, increase: false });
    }
  },

  _onArrowUp: function() {
    if (this.$.input.selectionStart == 0) {
      this.fire("focus-item", { item: this, moveUp: true });
    }
  },

  _onArrowDown: function() {
    if (this.$.input.selectionStart == this.$.input.value.length) {
      this.fire("focus-item", { item: this, moveUp: false });
    }
  },

  _onShiftTab: function() {
    this.setIndent(-1);
  },

  _onTab: function(e) {
    if (this.$.input.selectionStart == 0) {
      e.preventDefault();
      this.setIndent(1);
    }
  },

  _onShiftArrowUp: function() {
    this.move(-1);
  },

  _onShiftArrowDown: function() {
    this.move(1);
  }
});
