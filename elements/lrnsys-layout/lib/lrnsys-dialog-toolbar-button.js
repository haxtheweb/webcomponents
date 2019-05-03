import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
class LrnsysDialogToolbarButton extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
        iron-icon {
          display: inline-block;
          height: 16px;
          width: 16px;
        }
      </style>
      <paper-button raisedon-tap="_onTap" id$="[[id]]" aria-label$="[[title]]">
        <iron-icon icon="[[icon]]"></iron-icon> [[title]]
      </paper-button>
      <paper-tooltip for$="[[id]]" animation-delay="200"
        >[[title]]</paper-tooltip
      >
    `;
  }
  static get tag() {
    return "lrnsys-dialog-toolbar-button";
  }

  static get properties() {
    return {
      /**
       * The title of the button.
       */
      title: {
        type: String
      },
      /**
       * The button icon.
       */
      icon: {
        type: String
      },
      /**
       * The button ID.
       */
      id: {
        type: String
      }
    };
  }

  /**
   * Ready lifecycle
   */
  ready() {
    super.ready();
    this.dispatchEvent(
      new CustomEvent("button-initialized", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { id: this.id }
      })
    );
  }

  /**
   * Button has been tapped.
   */
  _onTap(e) {
    var normalizedEvent = dom(e);
    var localTarget = normalizedEvent.localTarget;
    var id = localTarget.getAttribute("id");
    this.dispatchEvent(
      new CustomEvent("dialog-toolbar-button-tapped", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { id: id }
      })
    );
  }
}
window.customElements.define(
  LrnsysDialogToolbarButton.tag,
  LrnsysDialogToolbarButton
);
export { LrnsysDialogToolbarButton };
