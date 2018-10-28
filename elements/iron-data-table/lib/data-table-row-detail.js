import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./data-table-templatizer-behavior.js";
Polymer({
  _template: html`
    <style>
      :host {
        padding: 0 24px 0 24px;
        display: flex;
        align-items: center;
      }
    </style>
    <slot></slot>
`,

  is: "data-table-row-detail",

  behaviors: [saulis.DataTableTemplatizerBehavior],

  properties: {
    beforeBind: Object
  },

  observers: ["_beforeBind(beforeBind, item.*, index, selected, expanded)"],

  attached: function() {
    if (!undefined.useNativeShadow) {
      // details is supposed to be placed outside the local dom of iron-data-table.
      window.StyleTransformer.dom(
        this,
        "iron-data-table",
        this._scopeCssViaAttr,
        true
      );
      if (this.domHost) {
        window.StyleTransformer.dom(
          this,
          this.domHost.tagName.toLowerCase(),
          this._scopeCssViaAttr,
          false
        );
      }
    }
  },

  _beforeBind: function(beforeBind, item, index, selected, expanded) {
    var data = {
      index: index,
      item: item.base,
      expanded: expanded,
      selected: selected
    };

    beforeBind(data, this);
  }
});
