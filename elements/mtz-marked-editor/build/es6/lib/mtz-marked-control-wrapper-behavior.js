import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "./mtz-marked-control-behavior.js";
window.mtz = window.mtz || {};
mtz.MarkedControlWrapperBehaviorImpl = {
  properties: {
    syntaxPrefix: String,
    syntaxSuffix: { type: String, value: "" }
  },
  _handleCommand(event) {
    event.preventDefault();
    event.stopPropagation();
    let cursor = 0;
    const editor = this.__editor,
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
        `${this.syntaxPrefix}${selected.text}${this.syntaxSuffix}`
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
