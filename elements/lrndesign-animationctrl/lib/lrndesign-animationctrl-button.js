import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
class LrndesignAnimationctrlButton extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        paper-button {
          @apply --animationctrl-button;
        }
        iron-icon {
          display: inline-flex;
        }
        :host iron-icon[hidden] {
          display: none;
        }
      </style>
      <paper-button raised="" id="[[name]]" on-tap="_tap">
        [[name]]
        <iron-icon icon="[[icon]]" hidden$="[[!icon]]"></iron-icon>
      </paper-button>
    `;
  }

  static get tag() {
    return "lrndesign-animationctrl-button";
  }

  static get properties() {
    return {
      /**
       * Machine name of the button. This should be unique
       * to the animationctrl set
       */
      name: {
        type: String,
        value: "buttonid"
      },
      /**
       * Name of the Icon
       */
      icon: {
        type: String,
        value: false
      }
    };
  }
  /**
   * Fire event
   */
  _tap(e) {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent("lrndesign-animationctrl-click", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { button: this.name }
      })
    );
  }
}
window.customElements.define(
  LrndesignAnimationctrlButton.tag,
  LrndesignAnimationctrlButton
);
export { LrndesignAnimationctrlButton };
