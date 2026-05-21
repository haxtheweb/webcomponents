/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import "@haxtheweb/jwt-login/jwt-login.js";
/**
 * `haxcms-backend-nodejs`
 * `a simple element to check for and fetch JWTs`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 * - jwt - a JSON Web Token used as an encrypted security token for communication
 */
class HAXCMSBackendNodeJS extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-backend-nodejs";
  }
  /**
   * LitElement
   */
  render() {
    return html`
      <jwt-login
        id="jwt"
        jwt="${this.jwt}"
        @jwt-changed="${this.jwtChanged}"
      ></jwt-login>
    `;
  }
  jwtChanged(e) {
    this.jwt = e.detail.value;
    store.jwt = this.jwt;
    if (store.cmsSiteEditor && store.cmsSiteEditor.instance) {
      store.cmsSiteEditor.instance.jwt = this.jwt;
    }
    // support updates after the fact
    if (
      this.jwt != null &&
      this.jwt != "null" &&
      this.jwt != "" &&
      typeof this.jwt == "string"
    ) {
      this.dynamicallyImportEditor();
    }
  }
  /**
   * Detached life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    super.disconnectedCallback();
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__disposer = [];
    // set up a tag to place RIGHT next to the site-builder itself
    this.__disposer.push(
      autorun((reaction) => {
        this.jwt = toJS(store.jwt);
      }),
    );
  }
  /**
   * LitElement life cycle - ready
   */
  firstUpdated(changedProperties) {
    setTimeout(() => {
      if (globalThis.appSettings) {
        let jwtlogin = this.shadowRoot.querySelector("#jwt");
        jwtlogin.url = globalThis.appSettings.login;
        jwtlogin.refreshUrl = globalThis.appSettings.refreshUrl;
        jwtlogin.logoutUrl = globalThis.appSettings.logout;
        jwtlogin.redirectUrl = globalThis.appSettings.redirectUrl;
        // allow setting in session driven environments
        // it's not a real JWT but it drives the environment to operate correctly
        if (globalThis.appSettings.jwt) {
          this.jwt = globalThis.appSettings.jwt;
        }
      }
      if (
        this.jwt != null &&
        this.jwt != "null" &&
        this.jwt != "" &&
        typeof this.jwt == "string"
      ) {
        this.dynamicallyImportEditor();
      } else {
        // other things will have to sort out the fact that while we
        // DO have a dynamic backend, we didn't get a hit on the JWT
        // meaning that we are in a dynamic environment but logged out
        // at the moment (or viewing a site we don't have authorization to)
        globalThis.dispatchEvent(
          new CustomEvent("haxcms-not-logged-in", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: this,
          }),
        );
      }
    }, 500);
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      /**
       * JSON Web token, it'll come from a global call if it's available
       */
      jwt: {
        type: String,
      },
    };
  }
  /**
   * Import the editor
   */
  dynamicallyImportEditor() {
    // Check if we're in view-only mode - if so, don't import editor
    const viewOnlyMode = UserScaffoldInstance.readMemory("ViewOnlyMode");
    if (viewOnlyMode) {
      return;
    }

    // attempt to dynamically import the hax cms site editor
    // which will appear to be injecting into the page
    // but because of this approach it should be non-blocking
    try {
      // prettier-ignore
      import(
        "@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor.js"
      ).then(
        (e) => {
          // if we don't have appSettings by this point
          // it means we don't actually have a backend / directions
          // this would be a published state or a state where
          // there is no actual backend to bother confirming with
          // possibly a user navigated to a site that doesn't
          // have JWT credentials but isn't actually published
          // we also need this here because PHP is the assumed
          // fallback backend
          if (globalThis.appSettings) {
            store.cmsSiteEditorAvailability();
            store.cmsSiteEditor.instance.jwt = this.jwt;
            store.jwt = this.jwt;
            store.cmsSiteEditor.instance.saveNodePath =
              globalThis.appSettings.saveNodePath;
            store.cmsSiteEditor.instance.saveManifestPath =
              globalThis.appSettings.saveManifestPath;
            store.cmsSiteEditor.instance.saveOutlinePath =
              globalThis.appSettings.saveOutlinePath;
            store.cmsSiteEditor.instance.saveNodeDetailsPath =
              globalThis.appSettings.saveNodeDetailsPath || globalThis.appSettings.saveNodePath;
            store.cmsSiteEditor.instance.savePlatformSettingsPath =
              globalThis.appSettings.savePlatformSettingsPath;
            store.cmsSiteEditor.instance.saveAllowedBlocksPath =
              globalThis.appSettings.saveAllowedBlocksPath;
            store.cmsSiteEditor.instance.saveEditorSettingsPath =
              globalThis.appSettings.saveEditorSettingsPath;
            store.cmsSiteEditor.instance.saveAppearanceSettingsPath =
              globalThis.appSettings.saveAppearanceSettingsPath;
            store.cmsSiteEditor.instance.saveSeoSettingsPath =
              globalThis.appSettings.saveSeoSettingsPath;
            store.cmsSiteEditor.instance.getSiteFieldsPath =
              globalThis.appSettings.getSiteFieldsPath;
            store.cmsSiteEditor.instance.getFormToken =
              globalThis.appSettings.getFormToken;
            store.cmsSiteEditor.instance.createNodePath =
              globalThis.appSettings.createNodePath;
            store.cmsSiteEditor.instance.deleteNodePath =
              globalThis.appSettings.deleteNodePath;
            store.cmsSiteEditor.instance.listFilesPath =
              globalThis.appSettings.listFilesPath;
            store.cmsSiteEditor.instance.saveFilePath =
              globalThis.appSettings.saveFilePath;
            store.cmsSiteEditor.instance.fileOperationPath =
              globalThis.appSettings.fileOperationPath;
            store.cmsSiteEditor.instance.contentSearchPath =
              globalThis.appSettings.contentSearchPath ||
              globalThis.appSettings.searchContentPath;
            store.cmsSiteEditor.instance.getUserDataPath =
              globalThis.appSettings.getUserDataPath;
            store.cmsSiteEditor.instance.appStore = globalThis.appSettings.appStore;
          }
        },
        (e) => {
          //import failed
        }
      );
    } catch (err) {
      // error in the event this is a double registration
    }
  }
}
globalThis.customElements.define(HAXCMSBackendNodeJS.tag, HAXCMSBackendNodeJS);
export { HAXCMSBackendNodeJS };
