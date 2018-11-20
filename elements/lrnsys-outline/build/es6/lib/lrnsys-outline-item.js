import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-list/iron-list.js";
import "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../node_modules/@lrnwebcomponents/drawing-icons/drawing-icons.js";
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
      :host #move {
        font-size: 16px;
        padding: 10px;
        color: transparent;
      }
      :host(:focus) #move,
      :host(:hover) #move {
        color: var(--lrnsys-outline-move-icon-color, #aaaaaa);
      }
      :host paper-icon-button {
        position: static;
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
        display: block;
      }
      :host paper-icon-button#add {
        width: 36px;
        margin-right: 2px;
        color: white;
        background-color: var(--lrnsys-outline-add-button-color, #018dff);
      }
      :host paper-icon-button#delete {
        color: white;
        background-color: var(--lrnsys-outline-delete-button-color, #cc0000);
      }
    </style>
    <div id="wrapper" data-indent\$="[[indentLevel]]">
      <iron-icon id="move" title="Move" icon="drawing:move" role="presentation"></iron-icon>
      <paper-input id="input" label="Enter a page title" value\$="[[title]]" no-label-float="">
      </paper-input>
      <paper-icon-button id="add" title="Add Item" icon="icons:add" on-tap="add"></paper-icon-button>
      <paper-icon-button id="delete" title="Delete" icon="icons:delete" on-tap="delete"></paper-icon-button>
    </div>
    <div id="down-action" gesture-disabled\$="[[disableDown]]">
      <paper-icon-button id="down" title="Move downwards" icon="icons:arrow-downward" on-tap="move(1)"></paper-icon-button>
    </div>
    <div id="left-action" gesture-disabled\$="[[disableLeft]]">
      <paper-icon-button id="left" title="Outdent" icon="icons:arrow-backward" on-tap="setIndent(-1)"></paper-icon-button>
    </div>
    <div id="right-action" gesture-disabled\$="[[disableRight]]">
      <paper-icon-button id="right" title="Indent" icon="icons:arrow-forward" on-tap="setIndent(1)"></paper-icon-button>
    </div>
    <div id="up-action"gesture-disabled\$="[[disableUp]]">
      <paper-icon-button id="up" title="Move upwards" icon="icons:arrow-upward" on-tap="move(-1)"></paper-icon-button>
    </div>
    <iron-a11y-keys id="a11y" target="[[target]]" keys="enter" on-keys-pressed="_onEnter"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[target]]" keys="backspace" on-keys-pressed="_onBackspace"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[target]]" keys="up" on-keys-pressed="_onArrowUp"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[target]]" keys="down" on-keys-pressed="_onArrowDown"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[target]]" keys="tab" on-keys-pressed="_onTab"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[target]]" keys="shift+tab" on-keys-pressed="_onShiftTab"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[target]]" keys="shift+up" on-keys-pressed="_onShiftArrowUp"></iron-a11y-keys>
    <iron-a11y-keys id="a11y" target="[[target]]" keys="shift+down" on-keys-pressed="_onShiftArrowDown"></iron-a11y-keys>
`,
  is: "lrnsys-outline-item",
  listeners: { change: "_onChange" },
  properties: {
    disableDown: { type: Boolean, value: !1 },
    disableLeft: { type: Boolean, value: !1 },
    disableRight: { type: Boolean, value: !1 },
    disableUp: { type: Boolean, value: !1 },
    id: { type: String, value: null },
    indentLevel: { type: Number, value: 0 },
    index: { type: Number, value: 0 },
    parent: { type: String, value: null },
    target: { type: Object, value: null },
    value: { type: String, value: null, reflectToAttribute: !0 }
  },
  attached: function() {
    this.fire("attached-item", { item: this });
  },
  ready: function() {
    let root = this;
    this.target = this.$.input;
    root.fire("focus-item", root);
    root.addEventListener("focus", function() {
      root.fire("focus-item", root);
    });
    root.addEventListener("mouseover", function() {
      root.fire("focus-item", root);
    });
    root.addEventListener("blur", function() {
      root.fire("blur-item", root);
    });
    root.addEventListener("mouseout", function() {
      root.fire("blur-item", root);
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
    this.fire("indent-item", { item: this, increase: 0 < amount });
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
    this.fire("move-item", { item: this, moveUp: 0 > amount });
  },
  setSelection: function(start, end) {
    let s = start !== void 0 ? start : 0,
      n = end !== void 0 ? end : s;
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
  _onBackspace: function() {
    if (window.getSelection().toString() == this.$.input.value) {
      event.detail.keyboardEvent.preventDefault();
      this.fire("delete-item", { item: this });
    } else if (0 == this.$.input.selectionStart) {
      this.fire("indent-item", { item: this, increase: !1 });
    }
  },
  _onArrowUp: function() {
    if (0 == this.$.input.selectionStart) {
      this.fire("focus-item", { item: this, moveUp: !0 });
    }
  },
  _onArrowDown: function() {
    if (this.$.input.selectionStart == this.$.input.value.length) {
      this.fire("focus-item", { item: this, moveUp: !1 });
    }
  },
  _onShiftTab: function() {
    this.setIndent(-1);
  },
  _onTab: function(e) {
    if (0 == this.$.input.selectionStart) {
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
