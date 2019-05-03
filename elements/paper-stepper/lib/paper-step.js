import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
class PaperStep extends PolymerElement {
  static get tag() {
    return "paper-step";
  }
}
window.customElements.define(PaperStep.tag, PaperStep);
export { PaperStep };
