import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
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
  properties: { beforeBind: Object },
  observers: ["_beforeBind(beforeBind, item.*, index, selected, expanded)"],
  attached: function() {
    if (!(void 0).useNativeShadow) {
      window.StyleTransformer.dom(
        this,
        "iron-data-table",
        this._scopeCssViaAttr,
        !0
      );
      if (this.domHost) {
        window.StyleTransformer.dom(
          this,
          this.domHost.tagName.toLowerCase(),
          this._scopeCssViaAttr,
          !1
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
