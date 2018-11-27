define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "./mtz-marked-control-line-behavior.js"
], function(
  _polymerLegacy,
  _ironA11yKeys,
  _paperIconButton,
  _mtzMarkedControlLineBehavior
) {
  "use strict";
  function _templateObject_b28fdbd0f1e411e8b0c5216ab96a7cdc() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: inline-block;\n      }\n    </style>\n\n    <paper-icon-button icon="[[icon]]" noink="[[noink]]" on-click="_handleCommand" alt="[[title]]"></paper-icon-button>\n\n    <iron-a11y-keys keys="[[keys]]" on-keys-pressed="_handleCommand" target="[[__editor]]"></iron-a11y-keys>\n'
    ]);
    _templateObject_b28fdbd0f1e411e8b0c5216ab96a7cdc = function _templateObject_b28fdbd0f1e411e8b0c5216ab96a7cdc() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b28fdbd0f1e411e8b0c5216ab96a7cdc()
    ),
    is: "mtz-marked-control-link",
    behaviors: [mtz.MarkedControlBehavior],
    properties: { title: String, icon: String, keys: String, noink: Boolean },
    _handleCommand: function _handleCommand(event) {
      event.preventDefault();
      event.stopPropagation();
      var editor = this.__editor,
        selection = editor.getSelection(),
        regex = /\[(.*)\]\((.*)\)/,
        matches = selection.text.match(regex),
        text,
        link;
      if (matches) {
        text = matches[1];
        link = matches[2];
        var match = link || text;
        editor.replaceSelection(match);
        editor.setSelection(
          selection.start,
          selection.end - (selection.length - match.length)
        );
      } else {
        if (this._isLink(selection)) {
          text = prompt("What text would you like to display?");
          if (!text) return;
          link = selection.text;
        } else {
          link = prompt("What link would you like to use?");
          if (!link) return;
          text = selection.text;
        }
        if (link.startsWith("http://")) {
          alert("Links must be https://");
          return;
        }
        var newLink = regex[Symbol.replace](
          "[]()",
          "[".concat(text, "](").concat(link, ")")
        );
        editor.replaceSelection(newLink);
        editor.setSelection(
          selection.start,
          selection.end + (newLink.length - selection.length)
        );
      }
    },
    _isLink: function _isLink(selection) {
      return selection.text.startsWith("https://");
    }
  });
});
