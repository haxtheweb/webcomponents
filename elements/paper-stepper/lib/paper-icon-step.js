import { LitElement, html, css } from "lit";
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
customElements.define(PaperIconStep.tag, PaperIconStep);
export { PaperIconStep };
