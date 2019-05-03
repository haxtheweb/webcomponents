import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "./lib/lrndesign-animationctrl-button.js";
/**
`lrndesign-animationctrl`
A LRN element

* @demo demo/index.html
*/
class LrndesignAnimationctrl extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          background: var(--animationctrl-bg-color);
          --animationctrl-bg-color: #f5f5f5;
        }
        .buttons {
          padding: 16px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: stretch;
          @apply --animationctrl-buttons;
        }
        :host .buttons ::slotted(*) {
          display: flex;
        }
      </style>
      <div class="buttons"><slot></slot></div>
    `;
  }
  static get tag() {
    return "lrndesign-animationctrl";
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener(
        "lrndesign-animationctrl-button-click",
        this._buttonClicked.bind(this)
      );
    });
  }
  disconnectedCallback() {
    this.removeEventListener(
      "lrndesign-animationctrl-button-click",
      this._buttonClicked.bind(this)
    );
    super.disconnectedCallback();
  }
  _buttonClicked(e) {}
}
window.customElements.define(
  LrndesignAnimationctrl.tag,
  LrndesignAnimationctrl
);
export { LrndesignAnimationctrl };
