import { LitElement, html } from "lit-element/lit-element.js";
import { A11yCollapseIconButton } from "./a11y-collapse-icon-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
`a11y-collapse-accordion-button`
An accessible expand collapse.
 * 
 * @customElement
 * @see ../a11y-collapse.js
 * @see ./a11y-collapse-button-styles.js
 */
class A11yCollapseAccordionButton extends A11yCollapseIconButton {
  static get tag() {
    return "a11y-collapse-accordion-button";
  }
  render() {
    return html`
      <div
        id="heading"
        ?disabled="${this.disabled}"
        .label="${this.label}"
        aria-controls="content"
        aria-expanded="${this.expanded ? "true" : "false"}"
        role="button"
      >
        <div id="text"><slot></slot></div>
        <iron-icon
          id="expand"
          ?rotated="${this.rotated}"
          .icon="${this.icon}"
          aria-hidden="true"
        >
        </iron-icon>
      </div>
      <paper-tooltip for="heading">${this.tooltip}</paper-tooltip>
    `;
  }
  constructor() {
    super();
    this.addEventListener("click", this._onTap.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this._onTap.bind(this));
  }
}
window.customElements.define(
  A11yCollapseAccordionButton.tag,
  A11yCollapseAccordionButton
);
export { A11yCollapseAccordionButton };
