/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import "@haxtheweb/simple-fields/lib/simple-fields-form.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button.js";
import { HaxUiBaseStyles } from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";

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
    this.siteTitle = "";
    this.method = "POST";
    this.loadEndpoint = "";
    this.body = {};
    this.headers = {};
    this.__disposer = [];
    // see up a tag to place RIGHT next to the site-builder itself
    autorun((reaction) => {
      this.jwt = toJS(store.jwt);
      this.__disposer.push(reaction);
    });
    autorun((reaction) => {
      this.siteTitle = toJS(store.siteTitle);
      this.__disposer.push(reaction);
    });
  }
  static get styles() {
    return [
      HaxUiBaseStyles,
      css`
        :host {
          z-index: 1;
          display: block;
          border-right: 2px solid #17271f;
          overflow: scroll;
          color: black;
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
          font-family: sans-serif;
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
          --a11y-tabs-height: 65vh;
          --a11y-tabs-tab-height: 60vh;
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
        <h2 class="title">${this.siteTitle} settings</h2>
      </div>
      <div class="fields-wrapper">
        <simple-fields-form
          id="siteform"
          .headers="${this.headers}"
          .body="${this.body}"
          .schematizer="${HaxSchematizer}"
          .elementizer="${HaxElementizer}"
          load-endpoint="${this.loadEndpoint}"
          @simple-fields-form-data-loaded="${this.fieldDataLoaded}"
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
      loadEndpoint: {
        type: String,
        attribute: "load-endpoint",
      },
      headers: {
        type: Object,
      },
      body: {
        type: Object,
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
      siteTitle: {
        type: String,
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
  fieldDataLoaded() {
    const itemManifest = store.getManifestItems(true);
    var items = [
      {
        text: ``,
        value: null,
      },
    ];
    itemManifest.forEach((el) => {
      if (el.id != this.itemId) {
        // calculate -- depth so it looks like a tree
        let itemBuilder = el;
        // walk back through parent tree
        let distance = "- ";
        while (itemBuilder && itemBuilder.parent != null) {
          itemBuilder = itemManifest.find((i) => i.id == itemBuilder.parent);
          // double check structure is sound
          if (itemBuilder) {
            distance = "--" + distance;
          }
        }
        items.push({
          text: distance + el.title,
          value: el.id,
        });
      }
    });
    requestAnimationFrame(() => {
      const fields = this.shadowRoot.querySelector("#siteform").fields;
      // loop through and set itemsList dynamically
      fields
        .find((item) => item.property === "manifest")
        .properties.find((item2) => item2.property === "theme")
        .properties.find((item3) => item3.property === "regions")
        .properties.map((item4) => {
          // shouldn't be possible otherwise but verify this is an array
          if (item4.inputMethod === "array") {
            item4.properties[0].itemsList = items;
          }
        });
      setTimeout(() => {
        this.shadowRoot.querySelector("#siteform").fields = [...fields];
        requestAnimationFrame(() => {
          this.shadowRoot.querySelector("#siteform").requestUpdate();
        });
      }, 0);
    });
  }
  generateRequest() {
    this.shadowRoot.querySelector("#siteform").loadData();
  }
  /**
   * Save the fields as we get tapped
   */
  _saveSiteFieldsTap(e) {
    store.playSound("click");
    // fire event with details for saving
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-site-data", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: this.shadowRoot.querySelector("#siteform").submit(),
      }),
    );
    setTimeout(() => {
      globalThis.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          cancelable: true,
          detail: {},
        }),
      );
    }, 0);
  }
  /**
   * Close the dashboard and reset state
   */
  _cancel(e) {
    store.playSound("error");
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
  }
}
customElements.define(HAXCMSSiteDashboard.tag, HAXCMSSiteDashboard);
export { HAXCMSSiteDashboard };
