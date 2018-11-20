define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_92e840f0ecf411e8b6efa79baa919867() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: inline-block;\n        transform: none !important;\n        position: static !important;\n        margin: 0px 2px 2px 0px;\n        padding: 2px;\n      }\n      :host > paper-button {\n        padding: 0;\n        margin: 0;\n        height: 100%;\n        width: 100%;\n        min-width: unset;\n      }\n      :host iron-image {\n        width: 100%;\n        height: 100%;\n      }\n      :host > paper-button:focus iron-image,\n      :host > paper-button:hover iron-image{\n        opacity: 0.7;\n        outline: 2px solid var(--lrndesign-gallery-focus-color);\n      }\n    </style>\n    <paper-button id="lrnsysbutton" item$="[[item]]" aria-controls$="[[controls]]" target$="[[target]]" title$="[[alt]]" tabindex="-1">\n      <iron-image alt$="[[alt]]" class="lrndesign-gallery-thumb-image" fade="" sizing="cover" src$="[[thumbnail]]" style$="[[imageStyle]]">\n      </iron-image>\n    </paper-button>\n    <iron-a11y-keys id="a11y" keys="enter" target$="[[button]]" on-keys-pressed="_tapped">\n    </iron-a11y-keys>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: inline-block;\n        transform: none !important;\n        position: static !important;\n        margin: 0px 2px 2px 0px;\n        padding: 2px;\n      }\n      :host > paper-button {\n        padding: 0;\n        margin: 0;\n        height: 100%;\n        width: 100%;\n        min-width: unset;\n      }\n      :host iron-image {\n        width: 100%;\n        height: 100%;\n      }\n      :host > paper-button:focus iron-image,\n      :host > paper-button:hover iron-image{\n        opacity: 0.7;\n        outline: 2px solid var(--lrndesign-gallery-focus-color);\n      }\n    </style>\n    <paper-button id="lrnsysbutton" item\\$="[[item]]" aria-controls\\$="[[controls]]" target\\$="[[target]]" title\\$="[[alt]]" tabindex="-1">\n      <iron-image alt\\$="[[alt]]" class="lrndesign-gallery-thumb-image" fade="" sizing="cover" src\\$="[[thumbnail]]" style\\$="[[imageStyle]]">\n      </iron-image>\n    </paper-button>\n    <iron-a11y-keys id="a11y" keys="enter" target\\$="[[button]]" on-keys-pressed="_tapped">\n    </iron-a11y-keys>\n'
      ]
    );
    _templateObject_92e840f0ecf411e8b6efa79baa919867 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_92e840f0ecf411e8b6efa79baa919867()
    ),
    is: "lrndesign-gallery-thumb",
    listeners: { tap: "_tapped" },
    properties: {
      alt: { type: String, value: null },
      button: { type: Object, value: null },
      controls: { type: String, value: null },
      imageStyle: { type: String, value: null, reflectToAttribute: !0 },
      item: { type: String, value: null },
      roundedEdges: { type: Boolean, value: !0 },
      target: { type: Object, value: null },
      thumbnail: { type: String, value: null }
    },
    ready: function ready() {
      this.button = this.$.lrnsysbutton;
    },
    _tapped: function _tapped(e) {
      e.preventDefault();
      this.fire("navTap", { item: this.item, type: "thumbnail" });
    }
  });
});
