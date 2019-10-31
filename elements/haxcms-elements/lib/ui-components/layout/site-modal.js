/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
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
        disabled$="[[disabled]]"
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
      disabled: {
        type: Boolean,
        reflectToAttribute: true
      },
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
    this.shadowRoot
      .querySelector("#smt")
      .associateEvents(this.shadowRoot.querySelector("#btn"));
    const nodes = FlattenedNodesObserver.getFlattenedNodes(this);
    for (var i in nodes) {
      this.shadowRoot.querySelector("#content").appendChild(nodes[i]);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteModal.tag, SiteModal);
export { SiteModal };
