import { Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./lib/paper-fab-speed-dial-overlay.js";
Polymer({
  is: "paper-fab-speed-dial",
  properties: {
    icon: {
      type: String,
      value: "add"
    },
    opened: {
      type: Boolean,
      notify: true
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  // Public methods
  open: function(e) {
    // Required for mobile Safari to avoid passing the tap event to an element below the FAB
    if (e) {
      e.preventDefault();
    }

    this.opened = true;
  },
  close: function(e) {
    // Required for mobile Safari to avoid passing the tap event to an element below the FAB
    if (e) {
      e.preventDefault();
    }

    this.opened = false;
  }
});
