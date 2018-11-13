import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: flex;
        flex-direction: column;
        opacity: 1;
        cursor: pointer;

        @apply --iron-data-table-row;
      }

      :host([selected]) .cells {
        @apply --iron-data-table-row-selected;
      }

      :host(:not([header])[even]) {
        @apply --iron-data-table-row-even;
      }

      :host(:not([header]):not([even])) {
        @apply --iron-data-table-row-odd;
      }

      :host(:focus) {
        outline: none;
        @apply --iron-data-table-row-focused;
      }

      :host(:not([header]):hover) {
        @apply --iron-data-table-row-hover;
      }

      :host(:focus):after {
        @apply --iron-data-table-row-focused-after;
      }

      :host:after {
        @apply --iron-data-table-row-after;
      }

      .cells {
        display: flex;
        flex-direction: row;
        width: 100%;
      }
    </style>
    <div class="cells">
      <slot name="data-table-checkbox"></slot>
      <slot name="data-table-cell"></slot>
    </div>
    <div class="details">
      <slot name="data-table-row-detail"></slot>
    </div>
`,
  is: "data-table-row",
  properties: {
    beforeBind: Object,
    expanded: { type: Boolean, reflectToAttribute: !0 },
    index: Number,
    item: Object,
    selected: { type: Boolean, reflectToAttribute: !0 },
    _static: { type: Object, value: { id: 0 } }
  },
  observers: ["_beforeBind(beforeBind, index, item.*, selected, expanded)"],
  attached: function() {
    if (
      this.domHost &&
      "IRON-DATA-TABLE" === this.domHost.tagName.toUpperCase()
    ) {
      var id = this._static.id++,
        item = this.parentElement;
      if (!item._rowId) {
        this._contentElement = document.createElement("content");
        this._contentElement.setAttribute("select", "#item" + id);
        dom(item).appendChild(this._contentElement);
        this.id = "item" + id;
        item._rowId = id;
        dom(this.domHost).appendChild(this);
        this._ownerShadyRoot = void 0;
      }
    }
  },
  _beforeBind: function(beforeBind, index, item, selected, expanded) {
    var data = {
      index: index,
      item: item.base,
      expanded: expanded,
      selected: selected
    };
    beforeBind(data, this);
  }
});
