import { Polymer } from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./lib/paper-fab-speed-dial-overlay.js";
Polymer({
  is: "paper-fab-speed-dial",
  properties: {
    icon: { type: String, value: "add" },
    opened: { type: Boolean, notify: !0 },
    disabled: { type: Boolean, value: !1 }
  },
  open: function(e) {
    if (e) {
      e.preventDefault();
    }
    this.opened = !0;
  },
  close: function(e) {
    if (e) {
      e.preventDefault();
    }
    this.opened = !1;
  }
});
