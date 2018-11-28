define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  window.mtz = window.mtz || {};
  mtz.MarkedControlBehavior = {
    properties: { __editor: Object },
    attached: function attached() {
      this.dispatchEvent(
        new CustomEvent("register-control", { bubbles: !0, composed: !0 })
      );
    }
  };
});
