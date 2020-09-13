import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-ripple/paper-ripple.js";
class LrnappStudioSubmissionEditAddAsset extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          cursor: pointer;
        }
        :host([display="box"]) {
          display: block;
          width: 200px;
          height: 200px;
          background: lightgray;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        :host([display="pill"]) {
          display: block;
          background: lightgray;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        iron-icon {
          color: gray;
          --iron-icon-height: 50px;
          --iron-icon-width: 50px;
        }
        :host([display="pill"]) iron-icon {
          --iron-icon-height: 50px;
          --iron-icon-width: 50px;
        }
      </style>
      <paper-button>
        <iron-icon icon="[[icon]]"></iron-icon>
        <paper-ripple></paper-ripple>
      </paper-button>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-edit-add-asset";
  }

  static get properties() {
    return {
      icon: {
        type: String,
        value: "add",
      },
      /**
       * Change the display of the add asset element
       *
       * @type String Options: 'box', 'pill'
       */
      display: {
        type: String,
        value: "box",
        reflectToAttribute: true,
      },
    };
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditAddAsset.tag,
  LrnappStudioSubmissionEditAddAsset
);
export { LrnappStudioSubmissionEditAddAsset };
