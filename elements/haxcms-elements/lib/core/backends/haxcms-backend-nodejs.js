/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { configureHAXCMSSiteApiRegistry } from "@haxtheweb/haxcms-elements/lib/core/utils/haxcms-site-api-registry.js";
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
  async jwtChanged(e) {
    this.jwt = e.detail.value;
    store.jwt = this.jwt;
    this._syncSiteApiRegistry();
    if (store.cmsSiteEditor && store.cmsSiteEditor.instance) {
      store.cmsSiteEditor.instance.jwt = this.jwt;
    }
    if (
      this.__ignoreNextJwtValidation &&
      this.jwt === this.__ignoreNextJwtValidation
    ) {
      this.__ignoreNextJwtValidation = null;
      return;
    }
    if (this._hasValidJWT(this.jwt)) {
      await this._gateEditorAccess();
    } else {
      this._setConnectionValidated(false);
      this._dispatchNotLoggedIn();
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
    this.__connectionTestPending = null;
    this.__ignoreNextJwtValidation = null;
    // set up a tag to place RIGHT next to the site-builder itself
    this.__disposer.push(
      autorun((reaction) => {
        this.jwt = toJS(store.jwt);
      }),
    );
  }
  _hasValidJWT(jwt) {
    return (
      jwt != null &&
      jwt != "null" &&
      jwt != "" &&
      typeof jwt == "string"
    );
  }
  _setConnectionValidated(validated) {
    store.connectionValidated = validated === true;
  }
  _dispatchNotLoggedIn() {
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-not-logged-in", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: this,
      }),
    );
  }
  _syncSiteApiRegistry() {
    configureHAXCMSSiteApiRegistry(store.appSettings || {}, this.jwt);
  }
  async _runConnectionTest() {
    if (!(store.appSettings && store.appSettings.connectionTest)) {
      const hasValidJWT = this._hasValidJWT(this.jwt);
      this._setConnectionValidated(hasValidJWT);
      return hasValidJWT;
    }
    if (this.__connectionTestPending) {
      return this.__connectionTestPending;
    }
    const requestData = {};
    if (this._hasValidJWT(this.jwt)) {
      requestData.jwt = this.jwt;
    }
    this.__connectionTestPending = fetch(store.appSettings.connectionTest, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then(async (response) => {
        if (!response.ok) {
          return {
            authenticated: false,
          };
        }
        try {
          return await response.json();
        } catch (e) {
          return {
            authenticated: false,
          };
        }
      })
      .then((result) => {
        if (result && result.authenticated) {
          const nextJWT = result.jwt ? result.jwt : this.jwt;
          if (this._hasValidJWT(nextJWT)) {
            if (result.jwt && result.jwt !== this.jwt) {
              this.__ignoreNextJwtValidation = result.jwt;
              this.jwt = result.jwt;
            }
            store.jwt = nextJWT;
            if (store.cmsSiteEditor && store.cmsSiteEditor.instance) {
              store.cmsSiteEditor.instance.jwt = nextJWT;
            }
            this._setConnectionValidated(true);
            return true;
          }
        }
        this._setConnectionValidated(false);
        return false;
      })
      .catch(() => {
        this._setConnectionValidated(false);
        return false;
      })
      .finally(() => {
        this.__connectionTestPending = null;
      });
    return this.__connectionTestPending;
  }
  async _gateEditorAccess() {
    const isAuthenticated = await this._runConnectionTest();
    if (isAuthenticated) {
      this.dynamicallyImportEditor();
      return;
    }
    this.jwt = null;
    store.jwt = null;
    this._syncSiteApiRegistry();
    if (store.cmsSiteEditor && store.cmsSiteEditor.instance) {
      store.cmsSiteEditor.instance.jwt = null;
    }
    this._dispatchNotLoggedIn();
  }
  /**
   * LitElement life cycle - ready
   */
  firstUpdated(changedProperties) {
    setTimeout(() => {
      if (globalThis.appSettings) {
        store.appSettings = globalThis.appSettings;
        this._syncSiteApiRegistry();
        let jwtlogin = this.shadowRoot.querySelector("#jwt");
        jwtlogin.url = globalThis.appSettings.login;
        jwtlogin.refreshUrl = globalThis.appSettings.refreshUrl;
        jwtlogin.logoutUrl = globalThis.appSettings.logout;
        jwtlogin.redirectUrl = globalThis.appSettings.redirectUrl;
        // allow setting in session driven environments
        // it's not a real JWT but it drives the environment to operate correctly
        if (globalThis.appSettings.jwt) {
          this.jwt = globalThis.appSettings.jwt;
          this._syncSiteApiRegistry();
        }
      }
      const shouldValidateConnection =
        (store.appSettings && store.appSettings.connectionTest) ||
        this._hasValidJWT(this.jwt);
      if (shouldValidateConnection) {
        this._gateEditorAccess();
      } else {
        this._setConnectionValidated(false);
        this._dispatchNotLoggedIn();
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
            store.cmsSiteEditor.instance.getSiteFieldsPath =
              globalThis.appSettings.getSiteFieldsPath;
            store.cmsSiteEditor.instance.getFormToken =
              globalThis.appSettings.getFormToken;
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
            globalThis.dispatchEvent(
              new CustomEvent("haxcms-site-editor-loaded", {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: true,
              }),
            );
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
