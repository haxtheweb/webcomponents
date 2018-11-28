import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import {
  addDebouncer,
  dom,
  flush
} from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import { Templatizer } from "./node_modules/@polymer/polymer/lib/legacy/templatizer-behavior.js";
import { OptionalMutableDataBehavior } from "./node_modules/@polymer/polymer/lib/legacy/mutable-data-behavior.js";
let GrafittoFilter = Polymer({
  _template: html`
    <div id="dom">
      <slot></slot>
    </div>
`,
  is: "grafitto-filter",
  behaviors: [Templatizer, OptionalMutableDataBehavior],
  properties: {
    items: { type: Array, value: [] },
    like: { type: String, value: "" },
    where: { type: String, value: "name" },
    caseSensitive: { type: Boolean, value: !1, reflectToAttribute: !0 },
    as: { type: String, value: "items" },
    filtered: {
      type: Array,
      computed: "_computeFiltered(items, where, like, caseSensitive)",
      observer: "_onFilter"
    },
    f: { type: Function, notify: !0 }
  },
  observers: ["_populateUserTemplate(filtered)"],
  filter: function() {
    this.where = "";
  },
  _computeFiltered: function(items, where, like, caseSensitive) {
    var regex = null;
    if (caseSensitive) {
      regex = new RegExp(like);
    } else {
      regex = new RegExp(like, "i");
    }
    var filtered = [];
    if (this.f) {
      var customFunction = this.f.bind(this);
      filtered = items.filter(customFunction);
    } else {
      var decompose = this._decomposeWhere.bind(this);
      filtered = items.filter(function(item) {
        if ("object" == typeof item) {
          var decomposed = decompose(where, item);
          if ("undefined" == typeof decomposed && "" != where) {
            console.warn(
              "grafitto-filter was unable to find a property in '" + where + "'"
            );
          }
          return regex.test(decomposed);
        }
        if ("string" == typeof item) {
          return regex.test(item);
        }
        if ("number" == typeof item) {
          return regex.test(item.toString());
        }
      });
    }
    return filtered;
  },
  _populateUserTemplate: function(filtered) {
    if (this.ctor) {
      this.__clone[this.as] = filtered;
      return;
    }
    this._userTemplate = this.querySelector("template");
    if (!this._userTemplate) {
      console.warn(
        "grafitto-filter requires a template to be provided in light-dom"
      );
    }
    this.templatize(this._userTemplate);
    this.__clone = this.stamp(null);
    this.__clone[this.as] = filtered;
    dom(this).appendChild(this.__clone.root);
  },
  _decomposeWhere: function(where, item) {
    return where.split(".").reduce(function(a, b) {
      return a && a[b];
    }, item);
  },
  _onFilter: function() {
    this.fire("filter");
  }
});
export { GrafittoFilter };
