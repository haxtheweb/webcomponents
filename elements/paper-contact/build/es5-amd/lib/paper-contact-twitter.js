define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./paper-contact-behavior.js",
  "./paper-contact-shared-styles.js"
], function(_polymerLegacy) {
  "use strict";
  (0, _polymerLegacy.Polymer)({
    is: "paper-contact-twitter",
    behaviors: [PaperContactBehavior],
    _getTargetUrl: function _getTargetUrl(content) {
      return "https://twitter.com/#!/" + content;
    }
  });
});
