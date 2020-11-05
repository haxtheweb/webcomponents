import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
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
        simple-icon {
          color: gray;
          --simple-icon-height: 50px;
          --simple-icon-width: 50px;
        }
        :host([display="pill"]) simple-icon {
          --simple-icon-height: 50px;
          --simple-icon-width: 50px;
        }
      </style>
      <button>
        <simple-icon icon="[[icon]]"></simple-icon>
      </button>
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
