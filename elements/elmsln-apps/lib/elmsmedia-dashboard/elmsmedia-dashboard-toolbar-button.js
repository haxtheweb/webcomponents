import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
let ElmsmediaDashboardToolbarButton = Polymer({
  _template: html`
    <style>
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: .7;
      }
      #title {
        font-size: 1em;
        margin: 0;
        margin-right: .3em;
        padding: 0;
      }
    </style>
    <paper-button id="button">
      <h3 id="title">[[title]]</h3>
      <iron-icon id="icon" icon="[[icon]]"></iron-icon>
    </paper-button>
`,

  is: 'elmsmedia-dashboard-toolbar-button',

  properties: {
    title: {
      type: String,
      value: '',
    },
    icon: {
      type: String,
      value: '',
    },
  }
});
export { ElmsmediaDashboardToolbarButton };