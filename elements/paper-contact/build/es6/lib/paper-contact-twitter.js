import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "./paper-contact-behavior.js";
import "./paper-contact-shared-styles.js";
Polymer({
  is: "paper-contact-twitter",
  behaviors: [PaperContactBehavior],
  _getTargetUrl: function(content) {
    return "https://twitter.com/#!/" + content;
  }
});
