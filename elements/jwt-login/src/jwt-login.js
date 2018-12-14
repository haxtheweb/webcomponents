import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
`jwt-login`
a simple element to check for and fetch JWTs

* @demo demo/index.html

@microcopy - the mental model for this element
- jwt - a json web token which is an encrypted security token to talk

*/
let JwtLogin = Polymer({
  _template: html`
    <style>
      :host {
        visibility: hidden;
      }
    </style>
    <iron-ajax
      id="loginrequest"
      method="GET"
      url="[[url]]"
      handle-as="json"
      on-response="loginResponse"
    >
    </iron-ajax>
  `,

  is: "jwt-login",

  properties: {
    /**
     * url
     */
    url: {
      type: String
    },
    /**
     * Key that contains the token in local storage
     */
    key: {
      type: String,
      value: "jwt"
    },
    /**
     * JSON Web token to securely pass around
     */
    jwt: {
      type: String,
      notify: true
    }
  },

  /**
   * Ready life cycle
   */
  ready: function() {
    // set jwt from local storage bin
    this.jwt = localStorage.getItem(this.key);
    this.fire("jwt-token", this.jwt);
  },

  /**
   * Request a user login if we need one or log out
   */
  toggleLogin: function() {
    // null is default, if we don't have anything go get one
    if (this.jwt == null) {
      this.$.loginrequest.generateRequest();
    } else {
      localStorage.removeItem(this.key);
      this.jwt = null;
      this.fire("jwt-logged-in", false);
    }
  },

  /**
   * Login bridge to get a JWT and hang onto it
   */
  loginResponse: function(e) {
    this.jwt = e.detail.response;
    if (this.jwt == null || this.jwt == "") {
      this.fire("jwt-logged-in", false);
    } else {
      // set the jwt into local storage so we can reference later
      localStorage.setItem(this.key, this.jwt);
      this.fire("jwt-token", this.jwt);
      this.fire("jwt-logged-in", true);
    }
  }
});
export { JwtLogin };
