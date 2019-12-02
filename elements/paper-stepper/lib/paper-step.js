import { LitElement, html, css } from "lit-element/lit-element.js";
class PaperStep extends LitElement {
  static get tag() {
    return "paper-step";
  }
}
window.customElements.define(PaperStep.tag, PaperStep);
export { PaperStep };
