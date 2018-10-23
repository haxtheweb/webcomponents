import "@polymer/polymer/polymer.js";
import "./mtz-marked-control-behavior.js";
window.mtz = window.mtz || {};

/**
 * Handles wrapping selected text wit ha syntax
 *
 * @polymerBehavior mtz.MarkedControlWrapperBehavior
 */
mtz.MarkedControlWrapperBehaviorImpl = {
  properties: {
    syntaxPrefix: String, // Must implement
    syntaxSuffix: {
      // Optionally implement
      type: String,
      value: ""
    }
  },
  /**
   * Toggles a wrapping syntax around selected text
   * @param {MouseEvent|KeyboardEvent} event
   * @protected
   */
  _handleCommand(event) {
    event.preventDefault();
    event.stopPropagation();

    let cursor = 0;
    const editor = this.__editor;
    const selected = editor.getSelection();
    const content = editor.getContent();

    // Toggle syntax
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

    // Set Cursor location
    editor.setSelection(cursor, cursor + selected.text.length);
    editor.getTextarea().focus();
  }
};

/* @polymerBehavior */
mtz.MarkedControlWrapperBehavior = [
  mtz.MarkedControlBehavior,
  mtz.MarkedControlWrapperBehaviorImpl
];
