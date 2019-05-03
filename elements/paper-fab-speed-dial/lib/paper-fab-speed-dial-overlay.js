import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { IronOverlayBehavior } from "@polymer/iron-overlay-behavior/iron-overlay-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
class PaperFabSpeedDialOverlay extends mixinBehaviors(
  [IronOverlayBehavior],
  PolymerElement
) {
  static get template() {
    return html`
      <slot></slot>
    `;
  }
  static get tag() {
    return "paper-fab-speed-dial-overlay";
  }
}
window.customElements.define(
  PaperFabSpeedDialOverlay.tag,
  PaperFabSpeedDialOverlay
);
export { PaperFabSpeedDialOverlay };
