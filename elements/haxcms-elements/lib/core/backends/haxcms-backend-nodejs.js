/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
/**
 * `haxcms-backend-nodejs`
 * `a simple element to check for and fetch JWTs`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
 */
class HAXCMSBackendNodeJS extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-backend-nodejs";
  }
  // render function
  static get template() {
    return html`
      <jwt-login
        id="jwt"
        url="[[jwtLoginLocation]]"
        url-logout="[[jwtLogoutLocation]]"
        jwt="{{jwt}}"
      ></jwt-login>
    `;
  }
  static get properties() {
    return {
      /**
       * Location of what endpoint to hit for
       */
      jwtLoginLocation: {
        type: String,
        value: function() {
          if (window.appSettings) {
            return window.appSettings.login;
          }
        }
      },
      /**
       * Location of what endpoint to hit for logging out
       */
      jwtLogoutLocation: {
        type: String,
        value: function() {
          if (window.appSettings) {
            return window.appSettings.logout;
          }
        }
      },
      /**
       * JSON Web token, it'll come from a global call if it's available
       */
      jwt: {
        type: String
      }
    };
  }
  /**
   * created life cycle
   */
  constructor() {
    super();
    document.body.addEventListener("jwt-token", this._jwtTokenFired.bind(this));
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
  }
  /**
   * Attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    if (this.jwt != null && this.jwt != "" && typeof this.jwt == "string") {
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
            if (window.appSettings) {
              let haxCmsSiteEditorElement = document.createElement(
                "haxcms-site-editor"
              );
              haxCmsSiteEditorElement.jwt = this.jwt;
              haxCmsSiteEditorElement.saveNodePath =
                window.appSettings.saveNodePath;
              haxCmsSiteEditorElement.saveManifestPath =
                window.appSettings.saveManifestPath;
              haxCmsSiteEditorElement.saveOutlinePath =
                window.appSettings.saveOutlinePath;
              haxCmsSiteEditorElement.getNodeFieldsPath =
                window.appSettings.getNodeFieldsPath;
              haxCmsSiteEditorElement.getSiteFieldsPath =
                window.appSettings.getSiteFieldsPath;
              haxCmsSiteEditorElement.getFormToken =
                window.appSettings.getFormToken;
              haxCmsSiteEditorElement.publishSitePath =
                window.appSettings.publishSitePath;
              haxCmsSiteEditorElement.syncSitePath =
                window.appSettings.syncSitePath;
              haxCmsSiteEditorElement.revertSitePath =
                window.appSettings.revertSitePath;
              haxCmsSiteEditorElement.createNodePath =
                window.appSettings.createNodePath;
              haxCmsSiteEditorElement.deleteNodePath =
                window.appSettings.deleteNodePath;
              haxCmsSiteEditorElement.appStore = window.appSettings.appStore;
              store.cmsSiteEditorAvailability();
              if (!store.cmsSiteEditor.instance.haxCmsSiteEditorElement) {
                store.cmsSiteEditor.instance.haxCmsSiteEditorElement = haxCmsSiteEditorElement;
                store.cmsSiteEditor.instance.appendTarget.appendChild(
                  haxCmsSiteEditorElement
                );
              }
            }
          },
          e => {
            //import failed
          }
        );
      } catch (err) {
        // error in the event this is a double registration
      }
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
}
window.customElements.define(HAXCMSBackendNodeJS.tag, HAXCMSBackendNodeJS);
export { HAXCMSBackendNodeJS };
