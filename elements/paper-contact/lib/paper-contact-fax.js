import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./paper-contact-behavior.js";
import "./paper-contact-shared-styles.js";
Polymer({
  is: "paper-contact-fax",

  behaviors: [PaperContactBehavior],

  // Private methods
  _getTargetUrl: function(content) {
    return "fax:" + content;
  }
});
