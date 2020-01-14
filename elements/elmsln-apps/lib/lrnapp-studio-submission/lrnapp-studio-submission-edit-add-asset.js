import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
class LrnappStudioSubmissionEditAddAsset extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
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
      `
    ];
  }
  render() {
    return html`
      <paper-button>
        <iron-icon icon="${this.icon}"></iron-icon>
      </paper-button>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-edit-add-asset";
  }
  constructor() {
    super();
    this.icon = "add";
    this.display = "box";
  }
  static get properties() {
    return {
      icon: {
        type: String
      },
      /**
       * Change the display of the add asset element
       *
       * @type String Options: 'box', 'pill'
       */
      display: {
        type: String,
        reflect: true
      }
    };
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditAddAsset.tag,
  LrnappStudioSubmissionEditAddAsset
);
export { LrnappStudioSubmissionEditAddAsset };
