import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
window.mtz = window.mtz || {};

/**
 * Handles registering the control with the editor, gaining an instance of the editor
 *
 * @polymerBehavior mtz.MarkedControlBehavior
 */
mtz.MarkedControlBehavior = {
  properties: {
    /* Reference to the editor. Set programatically */
    __editor: Object
  },
  /**
   * Registers the control with the editor to obtain the editor instance
   * @fires register-control
   */
  attached() {
    this.dispatchEvent(
      new CustomEvent("register-control", {
        bubbles: true,
        composed: true
      })
    );
  }
};
