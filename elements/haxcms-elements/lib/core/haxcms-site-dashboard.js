/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { varGet, varExists } from "@lrnwebcomponents/utils/utils.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/notification-icons.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-form.js";
import "@lrnwebcomponents/portal-launcher/portal-launcher.js";
import {
  HaxSchematizer,
  HaxElementizer
} from "@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js";

/**
 * `haxcms-site-dashboard`
 * `Off screen dashboard for modifying internal settings to the site`
 *
 * @demo demo/index.html
 */
class HAXCMSSiteDashboard extends LitElement {
  static get tag() {
    return "haxcms-site-dashboard";
  }
  constructor() {
    super();
    this.backText = 'Back to site list';
    this.backLink = '../../';
    this.manifest = {};
    this.__disposer = [];
    // see up a tag to place RIGHT next to the site-builder itself
    autorun(reaction => {
      this.jwt = toJS(store.jwt);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.dashboardOpened = toJS(store.dashboardOpened);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.manifest = toJS(store.manifest);
      this.__disposer.push(reaction);
    });
  }
  static get styles() {
    return [
      css`
        :host {
          z-index: 1;
          display: inline-block;
          vertical-align: top;
          position: fixed;
          height: 100vh;
          width: 50vw;
          margin-left: -50vw;
          border-right: 2px solid #17271f;
          overflow: scroll;
          background-color: var(--haxcms-dashboard-bg, #37474f);
        }
        :host([dashboard-opened]) {
          margin-left: 0;
        }
        #homebutton {
          display: inline-block;
          vertical-align: top;
          margin-top: 4px;
        }
        #homebutton paper-icon-button {
          color: #ffffff;
          --paper-icon-button-ink-color: var(--haxcms-color, #ffffff);
          background-color: #000000;
          height: 48px;
          width: 48px;
          padding: 8px;
          border-radius: 50%;
        }
        #homebutton paper-icon-button:hover,
        #homebutton paper-icon-button:active,
        #homebutton paper-icon-button:focus {
          background-color: var(--haxcms-color, #ffffff);
        }
        .buttons {
          border: 1px solid #aaaaaa;
          background-color: var(--simple-modal-titlebar-background, #000000);
          color: var(--simple-modal-titlebar-color, #ffffff);
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
        }
        .buttons paper-button {
          color: #ffffff;
          background-color: #000000;
          font-weight: bold;
          text-transform: none;
          border-radius: 0;
          border: none;
          border-right: 1px solid white;
          margin: 0;
        }
        #save {
          background-color: var(--haxcms-system-action-color);
        }
        #cancel {
          background-color: var(--haxcms-system-danger-color);
        }
        #save:active,
        #save:focus,
        #save:hover,
        #cancel:active,
        #cancel:focus,
        #cancel:hover {
          background-color: var(--haxcms-color);
        }
        .buttons paper-button:active,
        .buttons paper-button:focus,
        .buttons paper-button:hover {
          color: #ffffff;
        }
        .title {
          color: white;
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
          #homebutton paper-icon-button {
            height: 36px;
            width: 36px;
            padding: 4px;
          }
        }
        paper-button {
          background-color: white;
          color: black;
        }
        .publishlink {
          color: white;
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
          --a11y-tabs-tab-overflow: scroll;
          --primary-color: var(--haxcms-color, #000000);
          --paper-input-container-focus-color: var(--haxcms-color, #000000);
          --lumo-primary-text-color: var(--haxcms-color, #000000);
          --a11y-tabs-color: var(--haxcms-color, #000000);
          --a11y-tabs-focus-color: var(--haxcms-color, #000000);
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <div class="title-wrapper">
        <portal-launcher>
          <a href="${this.backLink}" tabindex="-1" id="homebutton"
            ><paper-icon-button
              icon="icons:home"
              title="${this.backText}"
            ></paper-icon-button
          ></a>
        </portal-launcher>
        <simple-tooltip for="homebutton" offset="14" position="bottom">
          ${this.backText}
        </simple-tooltip>
        <h2 class="title">${this.manifest.title} settings</h2>
        ${varExists(this.manifest, "metadata.site.static.publishedLocation")
          ? html`
              <span class="toptext">
                <a
                  class="publishlink"
                  href="${varGet(
                    this.manifest,
                    "metadata.site.static.publishedLocation",
                    "#"
                  )}"
                  rel="noopener noreferrer"
                  target="_blank"
                  >Published version
                </a>
              </span>
            `
          : ""}
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
        <paper-button
          title="Save site settings"
          id="save"
          @click="${this._saveSiteFieldsTap}"
          ><iron-icon icon="icons:save"></iron-icon> Save settings</paper-button
        >
        <paper-button
          title="Cancel and close dashboard"
          id="cancel"
          @click="${this._cancel}"
          ><iron-icon icon="icons:cancel"></iron-icon> Cancel</paper-button
        >
      </div>
    `;
  }
  static get properties() {
    return {
      backLink: {
        type: String,
      },
      backText: {
        type: String,
      },
      dashboardOpened: {
        type: Boolean,
        reflect: true,
        attribute: "dashboard-opened"
      },
      /**
       * Allow method to be overridden, useful in local testing
       */
      method: {
        type: String
      },
      /**
       * JSON Web token, it'll come from a global call if it's available
       */
      jwt: {
        type: String
      },
      /**
       * Publishing end point, this has CDN implications so show message
       */
      publishing: {
        type: Boolean
      },
      /**
       * Outline of items in json outline schema format
       */
      manifest: {
        type: Object
      }
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
  firstUpdated(changedProperties) {
    setTimeout(() => {
      if (window.appSettings && window.appSettings.backText) {
        this.backText = window.appSettings.backText;
      }
      if (window.appSettings && window.appSettings.backLink) {
        this.backLink = window.appSettings.backLink;
      }
    }, 0);
  }
  /**
   * Save the fields as we get tapped
   */
  _saveSiteFieldsTap(e) {
    // fire event with details for saving
    window.dispatchEvent(
      new CustomEvent("haxcms-save-site-data", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: this.shadowRoot.querySelector("#siteform").submit()
      })
    );
  }
  /**
   * Close the dashboard and reset state
   */
  _cancel(e) {
    window.dispatchEvent(
      new CustomEvent("haxcms-load-site-dashboard", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: e.target
      })
    );
  }
}
window.customElements.define(HAXCMSSiteDashboard.tag, HAXCMSSiteDashboard);
export { HAXCMSSiteDashboard };
