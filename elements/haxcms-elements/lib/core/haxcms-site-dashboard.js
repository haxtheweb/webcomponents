/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { varGet, varExists } from "@lrnwebcomponents/hax-body/lib/haxutils.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/notification-icons.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-form.js";

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
          transition: 0.8s linear margin;
          border-right: 2px solid #17271f;
          overflow: scroll;
          background-color: var(--haxcms-dashboard-bg, #37474f);
        }
        :host([dashboard-opened]) {
          margin-left: 0;
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
          color: var(--haxcms-color, #ffffff);
          background-color: #000000;
          font-weight: bold;
          text-transform: none;
          border-radius: 0;
          border: none;
          border-right: 1px solid white;
          margin: 0;
        }
        .buttons paper-button:active,
        .buttons paper-button:focus,
        .buttons paper-button:hover {
          color: #ffffff;
        }
        .title {
          color: white;
          font-size: 40px;
          margin: 0;
          padding: 0;
          display: inline-flex;
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
          --eco-json-form-add-color: var(--haxcms-color, #000000);
          --eco-json-form-faded-color: var(--haxcms-color, #000000);
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
                >
                  Click here to access the published version of this site
                </a>
              </span>
            `
          : ""}
      </div>
      <div class="fields-wrapper">
        <simple-fields-form
          id="siteform"
          .headers="${this.headers}"
          .body="${this.body}"
          load-endpoint="${this.loadEndpoint}"
          method="${this.method}"
          @last-error-changed="${this._lastErrorChanged}"
        ></simple-fields-form>
      </div>
      <div class="buttons">
        <paper-button @click="${this._saveSiteFieldsTap}"
          ><iron-icon icon="icons:save"></iron-icon> Save</paper-button
        >
        <paper-button @click="${this._cancel}"
          ><iron-icon icon="icons:cancel"></iron-icon> Cancel</paper-button
        >
      </div>
    `;
  }
  static get properties() {
    return {
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
  _lastErrorChanged(newValue) {
    if (newValue) {
      console.error(newValue);
      const evt = new CustomEvent("simple-toast-show", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: newValue.error
        }
      });
      window.dispatchEvent(evt);
    }
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
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "dashboardOpened" && this.dashboardOpened) {
        // API function so we refresh new data every time
        this.shadowRoot.querySelector("#siteform").loadData();
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
      new CustomEvent("haxcms-load-site-fields", {
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
