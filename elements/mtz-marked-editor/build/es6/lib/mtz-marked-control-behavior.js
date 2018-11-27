import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
window.mtz = window.mtz || {};
mtz.MarkedControlBehavior = {
  properties: { __editor: Object },
  attached() {
    this.dispatchEvent(
      new CustomEvent("register-control", { bubbles: !0, composed: !0 })
    );
  }
};
