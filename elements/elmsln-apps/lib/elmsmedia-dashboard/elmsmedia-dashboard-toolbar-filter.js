import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./paper-chip.js";
class ElmsmediaDashboardToolbarFilter extends PolymerElement {
  static get template() {
    return html`
      <style>
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
    `;
  }
  static get tag() {
    return "elmsmedia-dashboard-toolbar-filter";
  }
  static get properties() {
    return {
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
    };
  }
  remove(e) {
    this.dispatchEvent(
      new CustomEvent("remove-filter", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          path: this.path,
          propValue: this.propValue
        }
      })
    );
  }
}
window.customElements.define(
  ElmsmediaDashboardToolbarFilter.tag,
  ElmsmediaDashboardToolbarFilter
);
export { ElmsmediaDashboardToolbarFilter };
