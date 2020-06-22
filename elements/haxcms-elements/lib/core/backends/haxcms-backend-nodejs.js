/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
/**
 * `haxcms-backend-nodejs`
 * `a simple element to check for and fetch JWTs`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
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
   * Detatched life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.__disposer = [];
    // see up a tag to place RIGHT next to the site-builder itself
    autorun(reaction => {
      this.jwt = toJS(store.jwt);
      this.__disposer.push(reaction);
    });
  }
  /**
   * LitElement life cycle - ready
   */
  firstUpdated(changedProperties) {
    setTimeout(() => {
      if (window.appSettings) {
        let jwtlogin = this.shadowRoot.querySelector("#jwt");
        jwtlogin.url = window.appSettings.login;
        jwtlogin.refreshUrl = window.appSettings.refreshUrl;
        jwtlogin.logoutUrl = window.appSettings.logout;
        jwtlogin.redirectUrl = window.appSettings.redirectUrl;
        // allow setting in session driven environments
        // its not a real JWT but it drives the environment to operate correctly
        if (window.appSettings.jwt) {
          this.jwt = window.appSettings.jwt;
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
        window.dispatchEvent(
          new CustomEvent("haxcms-not-logged-in", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: this
          })
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
        type: String
      }
    };
  }
  /**
   * Import the editor
   */
  dynamicallyImportEditor() {
    // attempt to dynamically import the hax cms site editor
    // which will appear to be injecting into the page
    // but because of this approach it should be non-blocking
    try {
      import("@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-editor.js").then(
        e => {
          // if we don't have appSettings by this point
          // it means we don't actually have a backend / directions
          // this would be a published state or a state where
          // there is no actual backend to bother confiring with
          // possibly a user navigated to a site that doesn't
          // have JWT credentials but isn't actually published
          // we also need this here because PHP is the assumed
          // fallback backend
          if (window.appSettings) {
            store.cmsSiteEditorAvailability();
            store.cmsSiteEditor.instance.jwt = this.jwt;
            store.jwt = this.jwt;
            store.cmsSiteEditor.instance.saveNodePath =
              window.appSettings.saveNodePath;
            store.cmsSiteEditor.instance.saveManifestPath =
              window.appSettings.saveManifestPath;
            store.cmsSiteEditor.instance.saveOutlinePath =
              window.appSettings.saveOutlinePath;
            store.cmsSiteEditor.instance.getNodeFieldsPath =
              window.appSettings.getNodeFieldsPath;
            store.cmsSiteEditor.instance.getSiteFieldsPath =
              window.appSettings.getSiteFieldsPath;
            store.cmsSiteEditor.instance.getFormToken =
              window.appSettings.getFormToken;
            store.cmsSiteEditor.instance.publishSitePath =
              window.appSettings.publishSitePath;
            store.cmsSiteEditor.instance.syncSitePath =
              window.appSettings.syncSitePath;
            store.cmsSiteEditor.instance.revertSitePath =
              window.appSettings.revertSitePath;
            store.cmsSiteEditor.instance.createNodePath =
              window.appSettings.createNodePath;
            store.cmsSiteEditor.instance.deleteNodePath =
              window.appSettings.deleteNodePath;
            store.cmsSiteEditor.instance.getUserDataPath =
              window.appSettings.getUserDataPath;
            store.cmsSiteEditor.instance.appStore = window.appSettings.appStore;
          }
        },
        e => {
          //import failed
        }
      );
    } catch (err) {
      // error in the event this is a double registration
    }
  }
}
window.customElements.define(HAXCMSBackendNodeJS.tag, HAXCMSBackendNodeJS);
export { HAXCMSBackendNodeJS };
