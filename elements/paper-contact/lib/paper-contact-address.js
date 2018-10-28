import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./paper-contact-behavior.js";
import "./paper-contact-shared-styles.js";

Polymer({
  is: "paper-contact-address",
  properties: {
    /**
     * Latitude of the desired location, e.g. 51.5287718
     */
    latitude: Number,

    /**
     * Longitude of the desired location, e.g. -0.2416798
     */
    longitude: Number
  },

  behaviors: [PaperContactBehavior],

  // Private methods
  _getTargetUrl: function(content) {
    let url = `https://www.google.com/maps/search/${content}`;
    // Only add coordinates if they are known
    if (this.latitude && this.longitude) {
      url += `/@${this.latitude}+${this.longitude}`;
    }
    return url;
  }
});
