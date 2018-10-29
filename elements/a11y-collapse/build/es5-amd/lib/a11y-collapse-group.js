define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "../node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js",
  "../a11y-collapse.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_2461b760db1511e8b5f31152f9ef48ff() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n        @apply --a11y-collapse-group;\n      }\n      :host #heading {\n        font-weight: bold;\n        @apply --a11y-collapse-group-heading;\n      }\n      :host ::slotted(a11y-collapse){\n        margin: 0;\n        border-radius: 0em;\n      }\n      :host ::slotted(a11y-collapse):not(:first-of-type) {\n        border-top: none;\n      }\n    </style>\n    <slot id="heading"></slot>\n    <slot></slot>\n'
    ]);
    _templateObject_2461b760db1511e8b5f31152f9ef48ff = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_2461b760db1511e8b5f31152f9ef48ff()
    ),
    is: "a11y-collapse-group",
    behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
    properties: {
      accordion: { type: Boolean, value: !1, reflectToAttribute: !0 },
      disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
      globalOptions: { type: Object, value: {} },
      radio: { type: Boolean, value: !1 },
      __items: { type: Array, value: [] }
    },
    ready: function ready() {
      this.addEventListener("a11y-collapse-click", function(e) {
        this.radioToggle(e.detail);
      });
      this.addEventListener("a11y-collapse-attached", function(e) {
        this._attachItem(e.detail);
      });
      this.addEventListener("a11y-collapse-detached", function(e) {
        this._detachItem(e.detail);
      });
    },
    _attachItem: function _attachItem(item) {
      for (var key in this.globalOptions) {
        if (this.globalOptions.hasOwnProperty(key)) {
          item._overrideProp(key, this.globalOptions[key]);
        }
      }
      this.push("__items", item);
    },
    _detachItem: function _detachItem() {
      for (var i = 0; i < this.__items.length; i++) {
        if (this.__items[i] === e.detail) this.splice("_items", i, 1);
      }
    },
    radioToggle: function radioToggle(item) {
      if (this.radio && item.expanded) {
        for (var i = 0; i < this.__items.length; i++) {
          if (this.__items[i] !== item) this.__items[i].toggle(!1);
        }
      }
    },
    detached: function detached() {
      this.removeEventListener("a11y-collapse-click", function(e) {
        this.radioToggle(e.detail);
      });
      this.removeEventListener("a11y-collapse-attached", function(e) {
        this.push("__items", e.detail);
      });
      this.removeEventListener("a11y-collapse-detached", function(e) {
        this._detachItem(e.detail);
      });
      this.set("__items", []);
    },
    attached: function attached() {
      this.setHaxProperties({
        canScale: !0,
        canPosition: !0,
        canEditSource: !1,
        gizmo: {
          title: "Sample gizmo",
          description:
            "The user will be able to see this for selection in a UI.",
          icon: "av:play-circle-filled",
          color: "grey",
          groups: ["Video", "Media"],
          handles: [{ type: "video", url: "source" }],
          meta: { author: "Your organization on github" }
        },
        settings: {
          quick: [
            {
              property: "title",
              title: "Title",
              description: "The title of the element",
              inputMethod: "textfield",
              icon: "editor:title"
            }
          ],
          configure: [
            {
              property: "title",
              title: "Title",
              description: "The title of the element",
              inputMethod: "textfield",
              icon: "editor:title"
            }
          ],
          advanced: []
        }
      });
    }
  });
});
