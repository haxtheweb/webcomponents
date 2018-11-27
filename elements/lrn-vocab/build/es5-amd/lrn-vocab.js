define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/paper-button/paper-button.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js",
  "./lib/lrn-vocab-dialog.js"
], function(
  _polymerLegacy,
  _paperButton,
  _HAXWiring,
  _schemaBehaviors,
  _lrnVocabDialog
) {
  "use strict";
  function _templateObject_6697da00f1e611e88f5abf4ce1825c15() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: inline-flex;\n        --lrn-vocab-border: 1px dashed #ccc;\n      }\n      paper-button {\n        text-transform: none;\n        padding: 0;\n        margin: 0;\n        position: relative;\n        top:0px;\n        border-radius:0;\n        border-bottom: var(--lrn-vocab-border);\n        background:#f5f5f5;\n        @apply --lrn-vocab-button\n      }\n      paper-button:hover {\n        background:#bbdefb;\n        border-bottom: 1px dashed #2196f3;\n        @apply --lrn-vocab-button-hover\n      }\n    </style>\n\n    <div>\n      <paper-button id="button" noink="">[[term]]</paper-button>\n    </div>\n    <lrn-vocab-dialog id="dialog" opened="{{opened}}" term="[[term]]">\n      <slot></slot>\n    </lrn-vocab-dialog>\n'
    ]);
    _templateObject_6697da00f1e611e88f5abf4ce1825c15 = function _templateObject_6697da00f1e611e88f5abf4ce1825c15() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_6697da00f1e611e88f5abf4ce1825c15()
    ),
    is: "lrn-vocab",
    behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
    properties: {
      term: { type: String, reflectToAttribute: !0 },
      opened: { type: Boolean, value: !1 }
    },
    ready: function ready() {
      var _this = this;
      this.$.button.addEventListener("click", function(e) {
        _this.opened = !_this.opened;
      });
      this.__modal = this.$.dialog;
    },
    attached: function attached() {
      document.body.addEventListener(
        "lrn-vocab-dialog-closed",
        this._accessibleFocus.bind(this)
      );
      var props = {
        canScale: !1,
        canPosition: !1,
        canEditSource: !1,
        gizmo: {
          title: "Vocab",
          description: "Vocabulary term",
          icon: "image:details",
          color: "red",
          groups: ["Vocab"],
          handles: [{ type: "inline", text: "term" }],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [
            {
              property: "term",
              title: "Term",
              description:
                "The word or words to make clickable for more detail.",
              inputMethod: "textfield",
              icon: "editor:title",
              required: !0
            }
          ],
          configure: [
            {
              property: "term",
              title: "Term",
              description:
                "The word or words to make clickable for more detail.",
              inputMethod: "textfield",
              icon: "editor:title",
              required: !0
            },
            {
              slot: "",
              title: "Contents",
              description: "Contents to display in the pop up.",
              inputMethod: "code-editor",
              required: !0
            }
          ],
          advanced: []
        }
      };
      this.setHaxProperties(props);
    },
    _accessibleFocus: function _accessibleFocus(e) {
      if (e.detail === this.__modal) {
        this.$.button.focus();
      }
    }
  });
});
