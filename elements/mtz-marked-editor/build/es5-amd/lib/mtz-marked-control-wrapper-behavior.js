define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./mtz-marked-control-behavior.js"
], function(_polymerLegacy, _mtzMarkedControlBehavior) {
  "use strict";
  window.mtz = window.mtz || {};
  mtz.MarkedControlWrapperBehaviorImpl = {
    properties: {
      syntaxPrefix: String,
      syntaxSuffix: { type: String, value: "" }
    },
    _handleCommand: function _handleCommand(event) {
      event.preventDefault();
      event.stopPropagation();
      var cursor = 0,
        editor = this.__editor,
        selected = editor.getSelection(),
        content = editor.getContent();
      if (
        content.substr(
          selected.start - this.syntaxPrefix.length,
          this.syntaxPrefix.length
        ) === this.syntaxPrefix &&
        content.substr(selected.end, this.syntaxSuffix.length) ===
          this.syntaxSuffix
      ) {
        editor.setSelection(
          selected.start - this.syntaxPrefix.length,
          selected.end + this.syntaxSuffix.length
        );
        editor.replaceSelection(selected.text);
        cursor = selected.start - this.syntaxPrefix.length;
      } else {
        editor.replaceSelection(
          ""
            .concat(this.syntaxPrefix)
            .concat(selected.text)
            .concat(this.syntaxSuffix)
        );
        cursor = selected.start + this.syntaxSuffix.length;
      }
      editor.setSelection(cursor, cursor + selected.text.length);
      editor.getTextarea().focus();
    }
  };
  mtz.MarkedControlWrapperBehavior = [
    mtz.MarkedControlBehavior,
    mtz.MarkedControlWrapperBehaviorImpl
  ];
});
