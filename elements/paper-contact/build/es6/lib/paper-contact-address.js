import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "./paper-contact-behavior.js";
import "./paper-contact-shared-styles.js";
Polymer({
  is: "paper-contact-address",
  properties: { latitude: Number, longitude: Number },
  behaviors: [PaperContactBehavior],
  _getTargetUrl: function(content) {
    let url = `https://www.google.com/maps/search/${content}`;
    if (this.latitude && this.longitude) {
      url += `/@${this.latitude}+${this.longitude}`;
    }
    return url;
  }
});
