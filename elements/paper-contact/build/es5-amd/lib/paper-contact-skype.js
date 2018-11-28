define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./paper-contact-behavior.js",
  "./paper-contact-shared-styles.js"
], function(_polymerLegacy, _paperContactBehavior, _paperContactSharedStyles) {
  "use strict";
  (0, _polymerLegacy.Polymer)({
    is: "paper-contact-skype",
    behaviors: [PaperContactBehavior],
    _getTargetUrl: function _getTargetUrl(content) {
      return "skype:" + content + "?call";
    }
  });
});
