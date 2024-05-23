/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-modal/lib/simple-modal-template.js";
import { HAXCMSThemeParts } from "../../core/utils/HAXCMSThemeParts.js";

import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
/**
 * `site-modal`
 * `A basic site dialog`
 *
 * @demo demo/index.html
 */
class SiteModal extends HAXCMSThemeParts(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,

      css`
        :host {
          display: block;
        }
        :host([disabled]) {
          pointer-events: none;
        }
        simple-icon-button-lite {
          color: var(--site-modal-icon-color);
        }
        simple-modal-template {
          --simple-modal-width: 60vw;
          --simple-modal-height: 70vh;
          --simple-modal-min-width: 50vw;
          --simple-modal-min-height: 50vh;
        }
      `,
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
    this.position = "auto";
    this.disabled = false;
  }
  // render function
  render() {
    return html`
      <simple-icon-button-lite
        .part="${this.editMode ? `edit-mode-active` : ``}"
        ?disabled="${this.editMode}"
        id="btn"
        @click="${this.fireEvent}"
        .icon="${this.icon}"
        .title="${this.buttonLabel}"
      ></simple-icon-button-lite>
      <simple-tooltip for="btn" position="${this.position}">
        ${this.buttonLabel}
      </simple-tooltip>
      <simple-modal-template id="smt" .title="${this.title}">
        <div id="content" slot="content"></div>
      </simple-modal-template>
    `;
  }
  /**
   * Fire an event for things to react to above us; useful for lazy loading
   */
  fireEvent(e) {
    this.dispatchEvent(
      new CustomEvent("site-modal-click", {
        detail: { value: true },
      }),
    );
  }
  static get properties() {
    return {
      ...super.properties,
      disabled: {
        type: Boolean,
        reflect: true,
      },
      dark: {
        type: Boolean,
      },
      accentColor: {
        type: String,
        attribute: "accent-color",
      },
      title: {
        type: String,
      },
      icon: {
        type: String,
      },
      buttonLabel: {
        type: String,
        attribute: "button-label",
      },
      position: {
        type: String,
      },
    };
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.shadowRoot
      .querySelector("#smt")
      .associateEvents(this.shadowRoot.querySelector("#btn"));
    setTimeout(() => {
      if (this.children && this.shadowRoot.querySelector("#content")) {
        for (var i in this.children) {
          if (typeof this.children[i] === "object") {
            this.shadowRoot
              .querySelector("#content")
              .appendChild(this.children[i]);
          }
        }
      }
    }, 0);
  }
}
customElements.define(SiteModal.tag, SiteModal);
export { SiteModal };
