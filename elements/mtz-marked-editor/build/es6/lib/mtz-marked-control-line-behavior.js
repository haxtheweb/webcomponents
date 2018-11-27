import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "./mtz-marked-control-behavior.js";
window.mtz = window.mtz || {};
mtz.MarkedControlLineBehaviorImpl = {
  properties: { syntaxPrefix: String },
  _handleCommand(event) {
    event.preventDefault();
    event.stopPropagation();
    const editor = this.__editor,
      selection = editor.getSelection(),
      lines = editor.getLines(),
      newlineChar = 1 < lines.length ? lines[1].match(/(\n|\r\n)/)[0] : "",
      selectedLines = [];
    let accumulator = 0;
    lines.every(line => {
      accumulator += line.length;
      if (accumulator + 1 < selection.start) {
        return !0;
      }
      selectedLines.push({
        start: accumulator - line.length,
        end: accumulator,
        length: line.length,
        text: line.trimLeft()
      });
      return accumulator < selection.end;
    });
    const firstLine = selectedLines[0],
      removeSyntax = firstLine.text.startsWith(this.syntaxPrefix);
    let offset = 0;
    selectedLines.forEach(line => {
      if (removeSyntax && line.text.startsWith(this.syntaxPrefix)) {
        line.text = line.text.slice(this.syntaxPrefix.length, line.end);
      } else if (!removeSyntax) {
        line.text = `${this.syntaxPrefix}${line.text}`;
      }
      offset += this.syntaxPrefix.length;
    });
    const lastLine = selectedLines[selectedLines.length - 1];
    editor.setSelection(firstLine.start, lastLine.end);
    if (1 === selectedLines.length && 0 < selectedLines[0].start) {
      firstLine.text = `${newlineChar}${firstLine.text}`;
      firstLine.start += newlineChar.length;
    }
    editor.replaceSelection(
      selectedLines.map(line => line.text).join(newlineChar)
    );
    editor.setSelection(
      firstLine.start,
      lastLine.end + (!removeSyntax ? 1 : -1) * offset
    );
    editor.getTextarea().focus();
  }
};
mtz.MarkedControlLineBehavior = [
  mtz.MarkedControlBehavior,
  mtz.MarkedControlLineBehaviorImpl
];
