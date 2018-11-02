define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/paper-dialog-behavior/paper-dialog-behavior.js",
  "./node_modules/@polymer/paper-dialog-behavior/paper-dialog-shared-styles.js"
], function(_polymerLegacy, _paperDialogBehavior) {
  "use strict";
  function _templateObject_dfe3c0b0dea711e8a45edd59e1fa4e33() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="paper-dialog-shared-styles"></style>\n    <slot></slot>\n'
    ]);
    _templateObject_dfe3c0b0dea711e8a45edd59e1fa4e33 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_dfe3c0b0dea711e8a45edd59e1fa4e33()
    ),
    is: "lrndesign-dialog",
    behaviors: [_paperDialogBehavior.PaperDialogBehavior]
  });
});
