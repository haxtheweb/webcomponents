/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
/**
 * `haxcms-backend-demo`
 * `a simple element to check for and fetch JWTs`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
 */
Polymer({
  is: "haxcms-backend-demo",
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <jwt-login
      id="jwt"
      url="[[jwtLoginLocation]]"
      url-logout="[[jwtLogoutLocation]]"
      jwt="{{jwt}}"
    ></jwt-login>
  `,
  properties: {
    /**
     * Location of what endpoint to hit for
     */
    jwtLoginLocation: {
      type: String,
      value: window.appSettings.login
    },
    /**
     * Location of what endpoint to hit for logging out
     */
    jwtLogoutLocation: {
      type: String,
      value: window.appSettings.logout
    },
    /**
     * JSON Web token, it'll come from a global call if it's available
     */
    jwt: {
      type: String
    }
  },
  /**
   * created life cycle
   */
  created: function() {
    document.body.addEventListener("jwt-token", this._jwtTokenFired.bind(this));
    document.body.addEventListener(
      "json-outline-schema-active-item-changed",
      this.initialItem.bind(this)
    );
    document.body.addEventListener(
      "json-outline-schema-changed",
      this.initialManifest.bind(this)
    );
    document.body.addEventListener(
      "json-outline-schema-active-body-changed",
      this.initialBody.bind(this)
    );
  },
  /**
   * detached life cycle
   */
  detached: function() {
    document.body.removeEventListener(
      "jwt-token",
      this._jwtTokenFired.bind(this)
    );
    document.body.removeEventListener(
      "json-outline-schema-active-item-changed",
      this.initialItem.bind(this)
    );
    document.body.removeEventListener(
      "json-outline-schema-changed",
      this.initialManifest.bind(this)
    );
    document.body.removeEventListener(
      "json-outline-schema-active-body-changed",
      this.initialBody.bind(this)
    );
  },
  initialItem: function(e) {
    this.__item = e.detail;
  },
  initialManifest: function(e) {
    this.__manifest = e.detail;
  },
  initialBody: function(e) {
    this.__body = e.detail;
  },
  /**
   * JWT token fired, let's capture it
   */
  _jwtTokenFired: function(e) {
    this.jwt = e.detail;
  },
  /**
   * Attached life cycle
   */
  attached: function() {
    if (this.jwt != null) {
      // attempt to dynamically import the hax cms site editor
      // which will appear to be injecting into the page
      // but because of this approach it should be non-blocking
      try {
        import(pathFromUrl(import.meta.url) + "haxcms-site-editor.js").then(
          e => {
            let haxCmsSiteEditorElement = document.createElement(
              "haxcms-site-editor"
            );
            haxCmsSiteEditorElement.jwt = this.jwt;
            haxCmsSiteEditorElement.savePagePath =
              window.appSettings.savePagePath;
            haxCmsSiteEditorElement.saveManifestPath =
              window.appSettings.saveManifestPath;
            haxCmsSiteEditorElement.saveOutlinePath =
              window.appSettings.saveOutlinePath;
            haxCmsSiteEditorElement.createPagePath =
              window.appSettings.createPagePath;
            haxCmsSiteEditorElement.deletePagePath =
              window.appSettings.deletePagePath;
            haxCmsSiteEditorElement.publishPath =
              window.appSettings.publishPath;
            haxCmsSiteEditorElement.appStore = window.appSettings.appStore;
            // pass along the initial state management stuff that may be missed
            // based on timing on the initial setup
            if (typeof this.__item !== typeof undefined) {
              haxCmsSiteEditorElement.activeItem = this.__item;
            }
            if (typeof this.__manifest !== typeof undefined) {
              haxCmsSiteEditorElement.manifest = this.__manifest;
            }
            if (typeof this.__body !== typeof undefined) {
              haxCmsSiteEditorElement.__body = this.__body;
            }
            window.cmsSiteEditor.instance.haxCmsSiteEditorElement = haxCmsSiteEditorElement;
            window.cmsSiteEditor.instance.appendTarget.appendChild(
              haxCmsSiteEditorElement
            );
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
});
