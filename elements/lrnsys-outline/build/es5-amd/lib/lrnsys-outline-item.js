define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-list/iron-list.js",
  "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "../node_modules/@polymer/paper-input/paper-input.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../node_modules/@lrnwebcomponents/swipe-action/swipe-action.js",
  "../node_modules/@lrnwebcomponents/drawing-icons/drawing-icons.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_9fbd04a0db3311e8858fbdcba928ff3f() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        --indent-multiplier: 20px;\n      }\n      :host [data-indent="0"] #move {\n        margin-right: calc(var(--indent-multiplier) * 0);\n      }\n      :host [data-indent="1"] #move {\n        margin-right: calc(var(--indent-multiplier) * 1);\n      }\n      :host [data-indent="2"] #move {\n        margin-right: calc(var(--indent-multiplier) * 2);\n      }\n      :host [data-indent="3"] #move {\n        margin-right: calc(var(--indent-multiplier) * 3);\n      }\n      :host [data-indent="4"] #move {\n        margin-right: calc(var(--indent-multiplier) * 4);\n      }\n      :host [data-indent="5"] #move {\n        margin-right: calc(var(--indent-multiplier) * 5);\n      }\n      :host [data-indent="6"] #move {\n        margin-right: calc(var(--indent-multiplier) * 6);\n      }\n      :host #swipe {\n        height: 40px;\n      }\n      :host #input {\n        flex-grow: 1;\n        margin-right: 10px;\n      }\n      :host #wrapper {\n        display: flex;\n        height: 40px;\n        border-radius: 0.1em;\n        background-color: white;\n      }\n      :host:focus #wrapper,\n      :host:hover #wrapper {\n        cursor: pointer;\n      }\n      :host #swipe #move {\n        font-size: 16px;\n        padding: 10px;\n        color: transparent;\n      }\n      :host:focus #swipe #move,\n      :host:hover #swipe #move {\n        color: var(--lrnsys-outline-move-icon-color, #aaaaaa);\n      }\n      :host #swipe paper-icon-button {\n        position: static;\n        font-size: 16px;\n        height: 36px;\n        padding: 10px;\n        margin: 4px;\n        display: none;\n        border-radius: 0.1em;\n      }\n      :host:focus #swipe paper-icon-button,\n      :host:hover #swipe paper-icon-button {\n        width: 36px;\n        display: block;\n      }\n      :host [swipe-down-action],\n      :host [swipe-up-action]{\n        display: flex;\n        justify-content: flex-center;\n        color: var(--lrnsys-outline-add-button-color, #222222);\n      }\n      :host [swipe-left-action]{\n        display: flex;\n        justify-content: flex-end;\n      }\n      :host [swipe-right-action] {\n        display: flex;\n        justify-content: flex-start;\n      }\n      :host #swipe paper-icon-button#add {\n        width: 36px;\n        margin-right: 2px;\n        color: white;\n        background-color: var(--lrnsys-outline-add-button-color, #018dff);\n      }\n      :host #swipe paper-icon-button#delete {\n        color: white;\n        background-color: var(--lrnsys-outline-delete-button-color, #cc0000);\n      }\n    </style>\n    <swipe-action id="swipe" on-swiped-away="_onSwipedAway">\n      <div id="wrapper" data-indent$="[[indentLevel]]">\n        <iron-icon id="move" title="Move" icon="drawing:move" role="presentation"></iron-icon>\n        <paper-input id="input" label="Enter a page title" value$="[[title]]" no-label-float="">\n        </paper-input>\n        <paper-icon-button id="add" title="Add Item" icon="icons:add" on-tap="add"></paper-icon-button>\n        <paper-icon-button id="delete" title="Delete" icon="icons:delete" on-tap="delete"></paper-icon-button>\n      </div>\n      <div id="down-action" swipe-down-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled$="[[disableDown]]">\n        <paper-icon-button id="down" title="Move downwards" icon="icons:arrow-downward" on-tap="move(1)"></paper-icon-button>\n      </div>\n      <div id="left-action" swipe-left-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled$="[[disableLeft]]">\n        <paper-icon-button id="left" title="Outdent" icon="icons:arrow-backward" on-tap="setIndent(-1)"></paper-icon-button>\n      </div>\n      <div id="right-action" swipe-right-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled$="[[disableRight]]">\n        <paper-icon-button id="right" title="Indent" icon="icons:arrow-forward" on-tap="setIndent(1)"></paper-icon-button>\n      </div>\n      <div id="up-action" swipe-up-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled$="[[disableUp]]">\n        <paper-icon-button id="up" title="Move upwards" icon="icons:arrow-upward" on-tap="move(-1)"></paper-icon-button>\n      </div>\n    </swipe-action>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="enter" on-keys-pressed="_onEnter"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="backspace" on-keys-pressed="_onBackspace"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="up" on-keys-pressed="_onArrowUp"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="down" on-keys-pressed="_onArrowDown"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="tab" on-keys-pressed="_onTab"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="shift+tab" on-keys-pressed="_onShiftTab"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="shift+up" on-keys-pressed="_onShiftArrowUp"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="shift+down" on-keys-pressed="_onShiftArrowDown"></iron-a11y-keys>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        --indent-multiplier: 20px;\n      }\n      :host [data-indent="0"] #move {\n        margin-right: calc(var(--indent-multiplier) * 0);\n      }\n      :host [data-indent="1"] #move {\n        margin-right: calc(var(--indent-multiplier) * 1);\n      }\n      :host [data-indent="2"] #move {\n        margin-right: calc(var(--indent-multiplier) * 2);\n      }\n      :host [data-indent="3"] #move {\n        margin-right: calc(var(--indent-multiplier) * 3);\n      }\n      :host [data-indent="4"] #move {\n        margin-right: calc(var(--indent-multiplier) * 4);\n      }\n      :host [data-indent="5"] #move {\n        margin-right: calc(var(--indent-multiplier) * 5);\n      }\n      :host [data-indent="6"] #move {\n        margin-right: calc(var(--indent-multiplier) * 6);\n      }\n      :host #swipe {\n        height: 40px;\n      }\n      :host #input {\n        flex-grow: 1;\n        margin-right: 10px;\n      }\n      :host #wrapper {\n        display: flex;\n        height: 40px;\n        border-radius: 0.1em;\n        background-color: white;\n      }\n      :host:focus #wrapper,\n      :host:hover #wrapper {\n        cursor: pointer;\n      }\n      :host #swipe #move {\n        font-size: 16px;\n        padding: 10px;\n        color: transparent;\n      }\n      :host:focus #swipe #move,\n      :host:hover #swipe #move {\n        color: var(--lrnsys-outline-move-icon-color, #aaaaaa);\n      }\n      :host #swipe paper-icon-button {\n        position: static;\n        font-size: 16px;\n        height: 36px;\n        padding: 10px;\n        margin: 4px;\n        display: none;\n        border-radius: 0.1em;\n      }\n      :host:focus #swipe paper-icon-button,\n      :host:hover #swipe paper-icon-button {\n        width: 36px;\n        display: block;\n      }\n      :host [swipe-down-action],\n      :host [swipe-up-action]{\n        display: flex;\n        justify-content: flex-center;\n        color: var(--lrnsys-outline-add-button-color, #222222);\n      }\n      :host [swipe-left-action]{\n        display: flex;\n        justify-content: flex-end;\n      }\n      :host [swipe-right-action] {\n        display: flex;\n        justify-content: flex-start;\n      }\n      :host #swipe paper-icon-button#add {\n        width: 36px;\n        margin-right: 2px;\n        color: white;\n        background-color: var(--lrnsys-outline-add-button-color, #018dff);\n      }\n      :host #swipe paper-icon-button#delete {\n        color: white;\n        background-color: var(--lrnsys-outline-delete-button-color, #cc0000);\n      }\n    </style>\n    <swipe-action id="swipe" on-swiped-away="_onSwipedAway">\n      <div id="wrapper" data-indent\\$="[[indentLevel]]">\n        <iron-icon id="move" title="Move" icon="drawing:move" role="presentation"></iron-icon>\n        <paper-input id="input" label="Enter a page title" value\\$="[[title]]" no-label-float="">\n        </paper-input>\n        <paper-icon-button id="add" title="Add Item" icon="icons:add" on-tap="add"></paper-icon-button>\n        <paper-icon-button id="delete" title="Delete" icon="icons:delete" on-tap="delete"></paper-icon-button>\n      </div>\n      <div id="down-action" swipe-down-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled\\$="[[disableDown]]">\n        <paper-icon-button id="down" title="Move downwards" icon="icons:arrow-downward" on-tap="move(1)"></paper-icon-button>\n      </div>\n      <div id="left-action" swipe-left-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled\\$="[[disableLeft]]">\n        <paper-icon-button id="left" title="Outdent" icon="icons:arrow-backward" on-tap="setIndent(-1)"></paper-icon-button>\n      </div>\n      <div id="right-action" swipe-right-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled\\$="[[disableRight]]">\n        <paper-icon-button id="right" title="Indent" icon="icons:arrow-forward" on-tap="setIndent(1)"></paper-icon-button>\n      </div>\n      <div id="up-action" swipe-up-action="" swipe-size="40" swipe-rubber-band="10" gesture-disabled\\$="[[disableUp]]">\n        <paper-icon-button id="up" title="Move upwards" icon="icons:arrow-upward" on-tap="move(-1)"></paper-icon-button>\n      </div>\n    </swipe-action>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="enter" on-keys-pressed="_onEnter"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="backspace" on-keys-pressed="_onBackspace"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="up" on-keys-pressed="_onArrowUp"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="down" on-keys-pressed="_onArrowDown"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="tab" on-keys-pressed="_onTab"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="shift+tab" on-keys-pressed="_onShiftTab"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="shift+up" on-keys-pressed="_onShiftArrowUp"></iron-a11y-keys>\n    <iron-a11y-keys id="a11y" target="[[target]]" keys="shift+down" on-keys-pressed="_onShiftArrowDown"></iron-a11y-keys>\n'
      ]
    );
    _templateObject_9fbd04a0db3311e8858fbdcba928ff3f = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_9fbd04a0db3311e8858fbdcba928ff3f()
    ),
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
    attached: function attached() {
      this.fire("attached-item", { item: this });
    },
    ready: function ready() {
      var root = this;
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
    focus: function focus() {
      this.$.input.focus();
      return this;
    },
    value: function value() {
      this.title = this.$.input.value;
      return this.title;
    },
    delete: function _delete() {
      this.fire("delete-item", { item: this });
    },
    setIndent: function setIndent(amount) {
      this.fire("indent-item", { item: this, increase: 0 < amount });
    },
    add: function add() {
      var i = this.$.input.querySelector("input").selectionStart,
        j = this.$.input.value;
      this.fire("add-item", {
        item: this,
        value: j.slice(0, i),
        new: j.slice(i, j.length)
      });
    },
    move: function move(amount) {
      this.fire("move-item", { item: this, moveUp: 0 > amount });
    },
    setSelection: function setSelection(start, end) {
      var s = start !== void 0 ? start : 0,
        n = end !== void 0 ? end : s;
      try {
        this.$.input.querySelector("input").setSelectionRange(s, n);
      } catch (e) {
        console.log(e);
      }
      this.focus();
    },
    _onChange: function _onChange() {
      this.fire("change-item", { item: this, value: this.$.input.value });
    },
    _onEnter: function _onEnter() {
      var i = this.$.input.querySelector("input").selectionStart,
        j = this.$.input.value;
      this.fire("add-item", {
        item: this,
        value: j.slice(0, i),
        new: j.slice(i, j.length)
      });
    },
    _onBackspace: function _onBackspace() {
      if (window.getSelection().toString() == this.$.input.value) {
        event.detail.keyboardEvent.preventDefault();
        this.fire("delete-item", { item: this });
      } else if (0 == this.$.input.querySelector("input").selectionStart) {
        this.fire("indent-item", { item: this, increase: !1 });
      }
    },
    _onArrowUp: function _onArrowUp() {
      if (0 == this.$.input.querySelector("input").selectionStart) {
        this.fire("focus-item", { item: this, moveUp: !0 });
      }
    },
    _onArrowDown: function _onArrowDown() {
      if (
        this.$.input.querySelector("input").selectionStart ==
        this.$.input.value.length
      ) {
        this.fire("focus-item", { item: this, moveUp: !1 });
      }
    },
    _onShiftTab: function _onShiftTab() {
      this.setIndent(-1);
    },
    _onTab: function _onTab(e) {
      if (0 == this.$.input.querySelector("input").selectionStart) {
        e.preventDefault();
        this.setIndent(1);
      }
    },
    _onShiftArrowUp: function _onShiftArrowUp() {
      this.move(-1);
    },
    _onShiftArrowDown: function _onShiftArrowDown() {
      this.move(1);
    },
    _onSwipedAway: function _onSwipedAway(e) {
      if ("right" === e.detail.action.id) {
        this.setIndent(1);
      } else if ("left" === e.detail.action.id) {
        this.setIndent(-1);
      } else if ("up" === e.detail.action.id) {
        this.move(-1);
      } else if ("down" === e.detail.action.id) {
        this.move(1);
      }
      this.$.swipe.reset();
    }
  });
});
