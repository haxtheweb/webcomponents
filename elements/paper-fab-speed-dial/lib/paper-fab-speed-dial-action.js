import { LitElement, html, css } from "lit-element/lit-element.js";
class PaperFabSpeedDialAction extends LitElement {
  static get tag() {
    return "paper-fab-speed-dial-action";
  }
  static get properties() {
    return {
      /**
       * Icon that is shown next to the content
       */
      icon: String,
    };
  }
}
window.customElements.define(
  PaperFabSpeedDialAction.tag,
  PaperFabSpeedDialAction
);
export { PaperFabSpeedDialAction };
