/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `paper-fab-speed-dial`
 * @element paper-fab-speed-dial
 * `A speed dial setup for a floating action button`
 *
 * @demo demo/index.html
 */
class PaperFabSpeedDial extends PolymerElement {
  constructor() {
    super();
    // prettier-ignore
    import(
      "@lrnwebcomponents/paper-fab-speed-dial/lib/paper-fab-speed-dial-overlay.js"
    );
  }
  static get tag() {
    return "paper-fab-speed-dial";
  }
  static get properties() {
    return {
      icon: {
        type: String,
        value: "add",
      },
      opened: {
        type: Boolean,
        notify: true,
      },
      disabled: {
        type: Boolean,
        value: false,
      },
    };
  }
  // Public methods
  open(e) {
    // Required for mobile Safari to avoid passing the tap event to an element below the FAB
    if (e) {
      e.preventDefault();
    }
    this.opened = true;
  }
  close(e) {
    // Required for mobile Safari to avoid passing the tap event to an element below the FAB
    if (e) {
      e.preventDefault();
    }
    this.opened = false;
  }
}
window.customElements.define(PaperFabSpeedDial.tag, PaperFabSpeedDial);
export { PaperFabSpeedDial };
