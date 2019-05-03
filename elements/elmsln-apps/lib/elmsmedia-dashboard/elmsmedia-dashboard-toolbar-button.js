import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
class ElmsmediaDashboardToolbarButton extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
        }
        #title {
          font-size: 1em;
          margin: 0;
          margin-right: 0.3em;
          padding: 0;
        }
      </style>
      <paper-button id="button">
        <h3 id="title">[[title]]</h3>
        <iron-icon id="icon" icon="[[icon]]"></iron-icon>
      </paper-button>
    `;
  }

  static get tag() {
    return "elmsmedia-dashboard-toolbar-button";
  }

  static get properties() {
    return {
      title: {
        type: String,
        value: ""
      },
      icon: {
        type: String,
        value: ""
      }
    };
  }
}
window.customElements.define(
  ElmsmediaDashboardToolbarButton.tag,
  ElmsmediaDashboardToolbarButton
);
export { ElmsmediaDashboardToolbarButton };
