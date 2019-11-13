/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "@lrnwebcomponents/simple-modal/lib/simple-modal-template.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `site-modal`
 * `A basic site dialog`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteModal extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-modal";
  }
  constructor() {
    super();
    this.title = "Dialog";
    this.icon = "icons:menu";
    this.buttonLabel = "Open dialog";
    this.position = "bottom";
    import("@polymer/paper-tooltip/paper-tooltip.js");
  }
  // render function
  render() {
    return html`
      <custom-style>
        <style>
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
      </custom-style>
      <paper-icon-button
        ?disabled="${this.editMode}"
        id="btn"
        .icon="${this.icon}"
        .title="${this.buttonLabel}"
      ></paper-icon-button>
      <paper-tooltip for="btn" .position="${this.position}" offset="14">
        ${this.buttonLabel}
      </paper-tooltip>
      <simple-modal-template id="smt" .title="${this.title}">
        <div id="content" slot="content"></div>
      </simple-modal-template>
    `;
  }
  static get properties() {
    return {
      disabled: {
        type: Boolean,
        reflect: true
      },
      title: {
        type: String
      },
      icon: {
        type: String
      },
      buttonLabel: {
        type: String,
        attribute: "button-label"
      },
      position: {
        type: String
      }
    };
  }
  firstUpdated(changedProperties) {
    this.shadowRoot
      .querySelector("#smt")
      .associateEvents(this.shadowRoot.querySelector("#btn"));
    const nodes = FlattenedNodesObserver.getFlattenedNodes(this);
    for (var i in nodes) {
      this.shadowRoot.querySelector("#content").appendChild(nodes[i]);
    }
  }
}
window.customElements.define(SiteModal.tag, SiteModal);
export { SiteModal };
