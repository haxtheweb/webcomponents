define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./mtz-marked-control-behavior.js"
], function(_polymerLegacy, _mtzMarkedControlBehavior) {
  "use strict";
  window.mtz = window.mtz || {};
  mtz.MarkedControlLineBehaviorImpl = {
    properties: { syntaxPrefix: String },
    _handleCommand: function _handleCommand(event) {
      var _this = this;
      event.preventDefault();
      event.stopPropagation();
      var editor = this.__editor,
        selection = editor.getSelection(),
        lines = editor.getLines(),
        newlineChar = 1 < lines.length ? lines[1].match(/(\n|\r\n)/)[0] : "",
        selectedLines = [],
        accumulator = 0;
      lines.every(function(line) {
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
      var firstLine = selectedLines[0],
        removeSyntax = firstLine.text.startsWith(this.syntaxPrefix),
        offset = 0;
      selectedLines.forEach(function(line) {
        if (removeSyntax && line.text.startsWith(_this.syntaxPrefix)) {
          line.text = line.text.slice(_this.syntaxPrefix.length, line.end);
        } else if (!removeSyntax) {
          line.text = "".concat(_this.syntaxPrefix).concat(line.text);
        }
        offset += _this.syntaxPrefix.length;
      });
      var lastLine = selectedLines[selectedLines.length - 1];
      editor.setSelection(firstLine.start, lastLine.end);
      if (1 === selectedLines.length && 0 < selectedLines[0].start) {
        firstLine.text = "".concat(newlineChar).concat(firstLine.text);
        firstLine.start += newlineChar.length;
      }
      editor.replaceSelection(
        selectedLines
          .map(function(line) {
            return line.text;
          })
          .join(newlineChar)
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
});
