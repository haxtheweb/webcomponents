/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-form.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import { HaxUiBaseStyles } from "@lrnwebcomponents/hax-body/lib/hax-ui-styles.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";

/**
 * `haxcms-site-dashboard`
 * `Off screen dashboard for modifying internal settings to the site`
 *
 * @demo demo/index.html
 */
class HAXCMSSiteDashboard extends SimpleColors {
  static get tag() {
    return "haxcms-site-dashboard";
  }
  constructor() {
    super();
    this.manifest = {};
    this.__disposer = [];
    // see up a tag to place RIGHT next to the site-builder itself
    autorun((reaction) => {
      this.jwt = toJS(store.jwt);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.dashboardOpened = toJS(store.dashboardOpened);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.manifest = toJS(store.manifest);
      this.__disposer.push(reaction);
    });
  }
  static get styles() {
    return [
      ...HaxUiBaseStyles,
      css`
        :host {
          z-index: 1;
          display: inline-block;
          vertical-align: top;
          position: fixed;
          height: calc(100vh - 48px);
          width: 50vw;
          margin-left: -50vw;
          border-right: 2px solid #17271f;
          overflow: scroll;
          color: black;
          background-color: var(--haxcms-dashboard-bg, orange);
        }
        :host([dashboard-opened]) {
          margin-left: 0;
        }
        .buttons {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
        }
        button.hax-modal-btn {
          font-size: 30px;
          padding: 8px;
          margin: 4px;
          color: white;
          background-color: green;
          border: 4px solid black;
          border-radius: 8px;
          font-family: "Press Start 2P", sans-serif;
        }
        button.hax-modal-btn.cancel {
          background-color: red;
        }
        button.hax-modal-btn:hover,
        button.hax-modal-btn:focus {
          outline: 2px solid black;
          cursor: pointer;
          background-color: darkgreen;
        }
        button.hax-modal-btn.cancel:hover,
        button.hax-modal-btn.cancel:focus {
          background-color: darkred;
        }
        .title {
          color: black;
          font-size: 24px;
          margin: 0 0 0 16px;
          padding: 0;
          display: inline-flex;
        }
        @media screen and (max-width: 600px) {
          :host {
            width: 90vw;
            margin-left: -90vw;
          }
          .title {
            font-size: 14px;
            margin: 0;
          }
          .toptext {
            font-size: 11px;
          }
          button.hax-modal-btn {
            font-size: 14px;
          }
        }
        button {
          background-color: white;
          color: black;
        }
        .title-wrapper {
          padding: 0 16px;
        }
        .toptext {
          padding: 0;
          margin: 0;
          font-size: 12px;
          font-style: italic;
          display: inline-flex;
        }
        .fields-wrapper {
          height: auto;
          background-color: white;
        }
        #siteform {
          --a11y-tabs-height: 80vh;
          --a11y-tabs-tab-height: 75vh;
          --primary-color: var(--haxcms-color, #000000);
          --paper-input-container-focus-color: var(--haxcms-color, #000000);
          --lumo-primary-text-color: var(--haxcms-color, #000000);
          --a11y-tabs-color: var(--haxcms-color, #000000);
          --a11y-tabs-focus-color: var(--haxcms-color, #000000);
          color: var(--hax-ui-color);
          --simple-fields-color: var(--hax-ui-color);
        }
      `,
    ];
  }
  // render function
  render() {
    return html`
      <div class="title-wrapper">
        <h2 class="title">${this.manifest.title} settings</h2>
      </div>
      <div class="fields-wrapper">
        <simple-fields-form
          id="siteform"
          autoload
          .headers="${this.headers}"
          .body="${this.body}"
          .schematizer="${HaxSchematizer}"
          .elementizer="${HaxElementizer}"
          load-endpoint="${this.loadEndpoint}"
          method="${this.method}"
        ></simple-fields-form>
      </div>
      <div class="buttons">
        <button class="hax-modal-btn" @click="${this._saveSiteFieldsTap}">
          Save
        </button>
        <button class="hax-modal-btn cancel" @click="${this._cancel}">
          cancel
        </button>
      </div>
    `;
  }
  static get properties() {
    return {
      ...super.properties,
      dashboardOpened: {
        type: Boolean,
        reflect: true,
        attribute: "dashboard-opened",
      },
      /**
       * Allow method to be overridden, useful in local testing
       */
      method: {
        type: String,
      },
      /**
       * JSON Web token, it'll come from a global call if it's available
       */
      jwt: {
        type: String,
      },
      /**
       * Publishing end point, this has CDN implications so show message
       */
      publishing: {
        type: Boolean,
      },
      /**
       * Outline of items in json outline schema format
       */
      /**
       * Outline of items in json outline schema format
       */
      manifest: {
        type: Object,
      },
    };
  }
  /**
   * Detatched life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "dashboardOpened" && this.dashboardOpened) {
        // API function so we refresh new data every time
        this.removeAttribute("aria-hidden");
        this.removeAttribute("tabindex");
      }
      if (propName === "dashboardOpened" && !this.dashboardOpened) {
        this.setAttribute("aria-hidden", "aria-hidden");
        this.setAttribute("tabindex", "-1");
      }
    });
  }
  /**
   * Save the fields as we get tapped
   */
  _saveSiteFieldsTap(e) {
    store.playSound("click");
    // fire event with details for saving
    window.dispatchEvent(
      new CustomEvent("haxcms-save-site-data", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: this.shadowRoot.querySelector("#siteform").submit(),
      })
    );
  }
  /**
   * Close the dashboard and reset state
   */
  _cancel(e) {
    store.playSound("error");
    window.dispatchEvent(
      new CustomEvent("haxcms-load-site-dashboard", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: e.target,
      })
    );
  }
}
customElements.define(HAXCMSSiteDashboard.tag, HAXCMSSiteDashboard);
export { HAXCMSSiteDashboard };
