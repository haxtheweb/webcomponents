define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/paper-dialog-behavior/paper-dialog-behavior.js",
  "./node_modules/@polymer/paper-dialog-behavior/paper-dialog-shared-styles.js"
], function(_polymerLegacy, _paperDialogBehavior) {
  "use strict";
  function _templateObject_6c3567d0dbab11e89cf953c8c0c47ccb() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="paper-dialog-shared-styles"></style>\n    <slot></slot>\n'
    ]);
    _templateObject_6c3567d0dbab11e89cf953c8c0c47ccb = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_6c3567d0dbab11e89cf953c8c0c47ccb()
    ),
    is: "lrndesign-dialog",
    behaviors: [_paperDialogBehavior.PaperDialogBehavior]
  });
});
