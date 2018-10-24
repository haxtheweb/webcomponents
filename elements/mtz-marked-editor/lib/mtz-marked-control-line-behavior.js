import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./mtz-marked-control-behavior.js";
window.mtz = window.mtz || {};

/**
 * Handles inserting a prefix on the lines selected.
 *
 * @polymerBehavior mtz.MarkedControlLineBehavior
 */
mtz.MarkedControlLineBehaviorImpl = {
  properties: {
    syntaxPrefix: String // Must implement
  },
  /**
   * Toggles a syntax prefix at the start of selected lines
   * @param {MouseEvent|KeyboardEvent} event
   * @protected
   */
  _handleCommand(event) {
    event.preventDefault();
    event.stopPropagation();

    const editor = this.__editor;
    const selection = editor.getSelection();
    const lines = editor.getLines();

    // Grab the newline char
    const newlineChar = lines.length > 1 ? lines[1].match(/(\n|\r\n)/)[0] : "";

    // Grab lines within the selection
    const selectedLines = [];
    let accumulator = 0;
    lines.every(line => {
      // Accumulate line
      accumulator += line.length;
      // Check if selection start is not within the line, skip to next line
      if (accumulator + 1 < selection.start) {
        return true;
      }
      // Line is part of selection or contains selection start, so let's grab it
      selectedLines.push({
        start: accumulator - line.length,
        end: accumulator,
        length: line.length,
        text: line.trimLeft()
      });
      // Stop grabbing lines if we reach the end of the selection
      return accumulator < selection.end;
    });

    // Check the first line for syntax
    const firstLine = selectedLines[0];
    const removeSyntax = firstLine.text.startsWith(this.syntaxPrefix);

    let offset = 0;
    // Toggle syntax on each line
    selectedLines.forEach(line => {
      // if the syntax exists remove it from any lines containing it
      if (removeSyntax && line.text.startsWith(this.syntaxPrefix)) {
        line.text = line.text.slice(this.syntaxPrefix.length, line.end);
      } else if (!removeSyntax) {
        line.text = `${this.syntaxPrefix}${line.text}`;
      }
      // Accumulate number of characters modified in the textarea
      offset += this.syntaxPrefix.length;
    });

    // Selected all the lines affected
    const lastLine = selectedLines[selectedLines.length - 1];
    editor.setSelection(firstLine.start, lastLine.end);

    // If single line, add newline
    if (selectedLines.length === 1 && selectedLines[0].start > 0) {
      firstLine.text = `${newlineChar}${firstLine.text}`;
      firstLine.start += newlineChar.length;
    }

    // Replace all selected lines with modified content
    editor.replaceSelection(
      selectedLines.map(line => line.text).join(newlineChar)
    );
    // Re-select the new content on the lines
    editor.setSelection(
      firstLine.start,
      lastLine.end + (!removeSyntax ? 1 : -1) * offset
    );
    editor.getTextarea().focus();
  }
};

/* @polymerBehavior */
mtz.MarkedControlLineBehavior = [
  mtz.MarkedControlBehavior,
  mtz.MarkedControlLineBehaviorImpl
];
