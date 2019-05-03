import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
class PaperIconStep extends PolymerElement {
  static get tag() {
    return "paper-icon-step";
  }
  static get properties() {
    return {
      icon: String
    };
  }
}
window.customElements.define(PaperIconStep.tag, PaperIconStep);
export { PaperIconStep };
