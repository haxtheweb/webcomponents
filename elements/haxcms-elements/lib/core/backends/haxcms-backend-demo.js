/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/jwt-login/jwt-login.js";
/**
 * `haxcms-backend-demo`
 * `a simple element to check for and fetch JWTs`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
 */
class HAXCMSBackendDemo extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-backend-demo";
  }
  // render function
  render() {
    return html`
      <jwt-login
        auto
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
   * created life cycle
   */
  constructor() {
    super();
    this.jwt = false;
    this.__disposer = [];
    // see up a tag to place RIGHT next to the site-builder itself
    autorun((reaction) => {
      this.jwt = toJS(store.jwt);
      this.__disposer.push(reaction);
    });
  }
  _jwtChanged(newValue) {
    //console.warn("JWT now set to: " + newValue);
  }
  /**
   * LitElement life cycle - properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "jwt" && this.jwt) {
        this._jwtChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * LitElement life cycle - element ready
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
        // its not a real JWT but it drives the environment to operate correctly
        if (globalThis.appSettings.jwt) {
          this.jwt = globalThis.appSettings.jwt;
        }
      }
      try {
        // prettier-ignore
        import(
          "@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor.js"
        ).then(
          (e) => {
            // validate availability
            store.cmsSiteEditorAvailability();
            store.cmsSiteEditor.instance.jwt = this.jwt;
            store.jwt = this.jwt;
            store.cmsSiteEditor.instance.method = "GET";
            store.cmsSiteEditor.instance.saveNodePath =
              globalThis.appSettings.saveNodePath;
            store.cmsSiteEditor.instance.saveManifestPath =
              globalThis.appSettings.saveManifestPath;
            store.cmsSiteEditor.instance.saveOutlinePath =
              globalThis.appSettings.saveOutlinePath;
            store.cmsSiteEditor.instance.getSiteFieldsPath =
              globalThis.appSettings.getSiteFieldsPath;
            store.cmsSiteEditor.instance.createNodePath =
              globalThis.appSettings.createNodePath;
            store.cmsSiteEditor.instance.deleteNodePath =
              globalThis.appSettings.deleteNodePath;
            store.cmsSiteEditor.instance.publishSitePath =
              globalThis.appSettings.publishSitePath;
            store.cmsSiteEditor.instance.syncSitePath =
              globalThis.appSettings.syncSitePath;
            store.cmsSiteEditor.instance.revertSitePath =
              globalThis.appSettings.revertSitePath;
            store.cmsSiteEditor.instance.getUserDataPath =
              globalThis.appSettings.getUserDataPath;
            store.cmsSiteEditor.instance.appStore = globalThis.appSettings.appStore;
          },
          (e) => {
            //import failed
            console.warn(e);
          }
        );
      } catch (err) {
        // error in the event this is a double registration
      }
    }, 500);
  }
}
customElements.define(HAXCMSBackendDemo.tag, HAXCMSBackendDemo);
export { HAXCMSBackendDemo };
