import "@polymer/polymer/polymer.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "drawing-icons/drawing-icons.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "swipe-action/swipe-action.js";
/**
`lrnsys-outline-item`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -
 -

*/
Polymer({
  _template: `
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
      :host #swipe {
        height: 40px;
      }
      :host #input {
        flex-grow: 1;
        margin-right: 10px;
      }
      :host #wrapper {
        display: flex;
        height: 40px;
        border-radius: 0.1em;
        background-color: white;
      }
      :host:focus #wrapper,
      :host:hover #wrapper {
        cursor: pointer;
      }
      :host #swipe #move {
        font-size: 16px;
        padding: 10px;
        color: transparent;
      }
      :host:focus #swipe #move,
      :host:hover #swipe #move {
        color: var(--lrnsys-outline-move-icon-color, #aaaaaa);
      }
      :host #swipe paper-icon-button {
        position: static;
        font-size: 16px;
        height: 36px;
        padding: 10px;
        margin: 4px;
        display: none;
        border-radius: 0.1em;
      }
      :host:focus #swipe paper-icon-button,
      :host:hover #swipe paper-icon-button {
        width: 36px;
        display: block;
      }
      :host [swipe-down-action],
      :host [swipe-up-action]{
        display: flex;
        justify-content: flex-center;
        color: var(--lrnsys-outline-add-button-color, #222222);
      }
      :host [swipe-left-action]{
        display: flex;
        justify-content: flex-end;
      }
      :host [swipe-right-action] {
        display: flex;
        justify-content: flex-start;
      }
      :host #swipe paper-icon-button#add {
        width: 36px;
        margin-right: 2px;
        color: white;
        background-color: var(--lrnsys-outline-add-button-color, #018dff);
      }
      :host #swipe paper-icon-button#delete {
        color: white;
        background-color: var(--lrnsys-outline-delete-button-color, #cc0000);
      }
    </style>
    <swipe-action id="swipe" on-swiped-away="_onSwipedAway">
      <div id="wrapper" data-indent\$="[[indentLevel]]">
        <iron-icon id="move" title="Move" icon="drawing:move" role="presentation"></iron-icon>
        <paper-input id="input" label="Enter a page title" value\$="[[title]]" no-label-float="">
        </paper-input>
        <paper-icon-button id="add" title="Add Item" icon="icons:add" on-tap="add"></paper-icon-button>
        <paper-icon-button id="delete" title="Delete" icon="icons:delete" on-tap="delete"></paper-icon-button>
      </div>
      <div id="down-action" swipe-down-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled\$="[[disableDown]]">
        <paper-icon-button id="down" title="Move downwards" icon="icons:arrow-downward" on-tap="move(1)"></paper-icon-button>
      </div>
      <div id="left-action" swipe-left-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled\$="[[disableLeft]]">
        <paper-icon-button id="left" title="Outdent" icon="icons:arrow-backward" on-tap="setIndent(-1)"></paper-icon-button>
      </div>
      <div id="right-action" swipe-right-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled\$="[[disableRight]]">
        <paper-icon-button id="right" title="Indent" icon="icons:arrow-forward" on-tap="setIndent(1)"></paper-icon-button>
      </div>
      <div id="up-action" swipe-up-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled\$="[[disableUp]]">
        <paper-icon-button id="up" title="Move upwards" icon="icons:arrow-upward" on-tap="move(-1)"></paper-icon-button>
      </div>
    </swipe-action>
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

  listeners: {
    change: "_onChange"
  },

  properties: {
    disableDown: {
      type: Boolean,
      value: false
    },
    disableLeft: {
      type: Boolean,
      value: false
    },
    disableRight: {
      type: Boolean,
      value: false
    },
    disableUp: {
      type: Boolean,
      value: false
    },
    id: {
      type: String,
      value: null
    },
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
    target: {
      type: Object,
      value: null
    },
    value: {
      type: String,
      value: null,
      reflectToAttribute: true
    }
  },

  attached: function() {
    this.fire("attached-item", { item: this });
  },

  ready: function() {
    let root = this;
    this.target = this.$.input;
    root.fire("focus-item", root);
    root.addEventListener("focus", function(e) {
      root.fire("focus-item", root);
    });
    root.addEventListener("mouseover", function(e) {
      root.fire("focus-item", root);
    });
    root.addEventListener("blur", function(e) {
      root.fire("blur-item", root);
    });
    root.addEventListener("mouseout", function(e) {
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
    this.fire("indent-item", { item: this, increase: amount > 0 });
  },

  add: function() {
    let i = this.$.input.querySelector("input").selectionStart,
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
    let i = this.$.input.querySelector("input").selectionStart,
      j = this.$.input.value;
    this.fire("add-item", {
      item: this,
      value: j.slice(0, i),
      new: j.slice(i, j.length)
    });
  },

  _onBackspace: function(e) {
    if (window.getSelection().toString() == this.$.input.value) {
      event.detail.keyboardEvent.preventDefault();
      this.fire("delete-item", { item: this });
    } else if (this.$.input.querySelector("input").selectionStart == 0) {
      this.fire("indent-item", { item: this, increase: false });
    }
  },

  _onArrowUp: function() {
    if (this.$.input.querySelector("input").selectionStart == 0) {
      this.fire("focus-item", { item: this, moveUp: true });
    }
  },

  _onArrowDown: function() {
    if (
      this.$.input.querySelector("input").selectionStart ==
      this.$.input.value.length
    ) {
      this.fire("focus-item", { item: this, moveUp: false });
    }
  },

  _onShiftTab: function() {
    this.setIndent(-1);
  },

  _onTab: function(e) {
    if (this.$.input.querySelector("input").selectionStart == 0) {
      e.preventDefault();
      this.setIndent(1);
    }
  },

  _onShiftArrowUp: function() {
    this.move(-1);
  },

  _onShiftArrowDown: function() {
    this.move(1);
  },

  _onSwipedAway: function(e) {
    if (e.detail.action.id === "right") {
      this.setIndent(1);
    } else if (e.detail.action.id === "left") {
      this.setIndent(-1);
    } else if (e.detail.action.id === "up") {
      this.move(-1);
    } else if (e.detail.action.id === "down") {
      this.move(1);
    }
    this.$.swipe.reset();
  }
});
