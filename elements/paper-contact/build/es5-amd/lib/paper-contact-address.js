define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./paper-contact-behavior.js",
  "./paper-contact-shared-styles.js"
], function(_polymerLegacy, _paperContactBehavior, _paperContactSharedStyles) {
  "use strict";
  (0, _polymerLegacy.Polymer)({
    is: "paper-contact-address",
    properties: { latitude: Number, longitude: Number },
    behaviors: [PaperContactBehavior],
    _getTargetUrl: function _getTargetUrl(content) {
      var url = "https://www.google.com/maps/search/".concat(content);
      if (this.latitude && this.longitude) {
        url += "/@".concat(this.latitude, "+").concat(this.longitude);
      }
      return url;
    }
  });
});
