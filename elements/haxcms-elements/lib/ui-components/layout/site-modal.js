/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
/**
 * `site-modal`
 * `A basic site dialog`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteModal extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-modal";
  }
  constructor() {
    super();
    import("@polymer/paper-tooltip/paper-tooltip.js");
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        paper-icon-button {
          @apply --site-modal-icon;
        }
        paper-tooltip {
          @apply --site-modal-tooltip;
        }
        simple-modal-template {
          @apply --site-modal-modal;
        }
      </style>
      <paper-icon-button
        id="btn"
        icon="[[icon]]"
        title="[[buttonLabel]]"
      ></paper-icon-button>
      <paper-tooltip for="btn" position="[[position]]" offset="14">
        [[buttonLabel]]
      </paper-tooltip>
      <simple-modal-template id="smt" title="[[title]]">
        <div id="content" slot="content"></div>
      </simple-modal-template>
    `;
  }
  static get properties() {
    return {
      title: {
        type: String,
        value: "Dialog"
      },
      icon: {
        type: String,
        value: "icons:menu"
      },
      buttonLabel: {
        type: String,
        value: "Open dialog"
      },
      position: {
        type: String,
        value: "bottom"
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.$.smt.associateEvents(this.$.btn);
    const nodes = dom(this).getEffectiveChildNodes();
    for (var i in nodes) {
      this.$.content.appendChild(nodes[i]);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteModal.tag, SiteModal);
export { SiteModal };
