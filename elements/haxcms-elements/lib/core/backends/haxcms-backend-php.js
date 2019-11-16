/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
/**
 * `haxcms-backend-php`
 * `a simple element to check for and fetch JWTs`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
 */
class HAXCMSBackendPHP extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-backend-php";
  }
  /**
   * LitElement
   */
  render() {
    return html`
      <jwt-login
        id="jwt"
        url="${this.jwtLoginLocation}"
        url-logout="${this.jwtLogoutLocation}"
        jwt="${this.jwt}"
        @jwt-changed="${this.jwtChanged}"
      ></jwt-login>
    `;
  }
  jwtChanged(e) {
    this.jwt = e.detail.value;
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    document.body.addEventListener("jwt-token", this._jwtTokenFired.bind(this));
  }
  /**
   * LitElement life cycle - ready
   */
  firstUpdated(changedProperties) {
    if (this.jwt != null && this.jwt != "" && typeof this.jwt == "string") {
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
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    document.body.removeEventListener(
      "jwt-token",
      this._jwtTokenFired.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * JWT token fired, let's capture it
   */
  _jwtTokenFired(e) {
    this.jwt = e.detail;
    store.jwt = this.jwt;
    // support updates after the fact
    if (this.jwt != null && this.jwt != "" && typeof this.jwt == "string") {
      this.dynamicallyImportEditor();
    }
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
window.customElements.define(HAXCMSBackendPHP.tag, HAXCMSBackendPHP);
export { HAXCMSBackendPHP };
