import { LitElement, html, css } from "lit-element/lit-element.js";
class PaperIconStep extends LitElement {
  static get tag() {
    return "paper-icon-step";
  }
  static get properties() {
    return {
      icon: String,
    };
  }
}
window.customElements.define(PaperIconStep.tag, PaperIconStep);
export { PaperIconStep };
