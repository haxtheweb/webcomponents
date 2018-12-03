import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./paper-chip.js";
let ElmsmediaDashboardToolbarFilter = Polymer({
  _template: html`
    <custom-style>
      <style is="custom-style">
        :host {
          display: flex;
          font-size: 0.8em;
        }
        paper-icon-button {
          --paper-icon-button: {
            height: 30px;
            width: 30px;
            margin-right: -12px;
          }
        }
      </style>
    </custom-style>
    <paper-chip>
      [[title]]
      <paper-icon-button
        id="clear"
        icon="clear"
        title="Remove filter"
        on-click="remove"
      ></paper-icon-button>
    </paper-chip>
    <paper-tooltip
      for="clear"
      position="top"
      animation-delay="100"
      margin-top="5"
      aria-hidden="true"
      >Remove Filter</paper-tooltip
    >
  `,
  is: "elmsmedia-dashboard-toolbar-filter",
  properties: {
    path: {
      type: String,
      value: ""
    },
    propValue: {
      type: String,
      value: ""
    },
    title: {
      type: String,
      value: ""
    }
  },
  remove: function(e) {
    this.fire("remove-filter", {
      path: this.path,
      propValue: this.propValue
    });
  }
});
export { ElmsmediaDashboardToolbarFilter };
