import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
 * `jwt-login`
 * `a simple element to check for and fetch JWTs`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
 */
class JwtLogin extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
      <style>
        :host {
          display: none;
        }
      </style>
      `
    ];
  }
  constructor() {
    super();
    this.auto = false;
    this.method = "GET";
    this.body = {};
    this.key = "jwt";
  }
  /**
   * LitElement
   */
  render() {
    return html`
      <iron-ajax
        ?auto="${this.auto}"
        id="loginrequest"
        method="${this.method}"
        url="${this.url}"
        handle-as="json"
        content-type="application/json"
        @response-changed="${this.loginResponse}"
      >
      </iron-ajax>
    `;
  }

  static get tag() {
    return "jwt-login";
  }

  static get properties() {
    return {
      /**
       * auto, useful for demos
       */
      auto: {
        type: Boolean
      },
      /**
       * url
       */
      url: {
        type: String
      },
      /**
       * Request method
       */
      method: {
        type: String
      },
      /**
       * Optional body, useful when doing posts
       */
      body: {
        type: Object
      },
      /**
       * Key that contains the token in local storage
       */
      key: {
        type: String
      },
      /**
       * JSON Web token to securely pass around
       */
      jwt: {
        type: String
      }
    };
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "jwt") {
        this._jwtChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("jwt-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "body" && this[propName] != {} && this.shadowRoot) {
        this.shadowRoot.querySelector("#loginrequest").body = { ...this.body };
      }
    });
  }
  _jwtChanged(newValue, oldValue) {
    if (
      (newValue == null || newValue == "") &&
      typeof oldValue !== typeof undefined
    ) {
      // remove this key from local storage bin
      localStorage.removeItem(this.key);
      // jwt was invalid some how
      this.dispatchEvent(
        new CustomEvent("jwt-logged-in", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: false
        })
      );
    } else if (newValue) {
      // set the jwt into local storage so we can reference later
      localStorage.setItem(this.key, newValue);
      this.dispatchEvent(
        new CustomEvent("jwt-token", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: newValue
        })
      );
      this.dispatchEvent(
        new CustomEvent("jwt-logged-in", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true
        })
      );
    }
  }
  /**
   * LitElement life cycle - ready
   */
  firstUpdated(changedProperties) {
    // set jwt from local storage bin
    this.jwt = localStorage.getItem(this.key);
    this.shadowRoot.querySelector("#loginrequest").body = this.body;
  }
  /**
   * Request a user login if we need one or log out
   */
  toggleLogin() {
    // null is default, if we don't have anything go get one
    if (this.jwt == null) {
      this.shadowRoot.querySelector("#loginrequest").generateRequest();
    } else {
      // we were told to logout, reset body
      this.body = {};
      // reset jwt which will do all the events / local storage work
      this.jwt = null;
    }
  }
  /**
   * Login bridge to get a JWT and hang onto it
   */
  loginResponse(e) {
    this.jwt = e.detail.response;
  }
}
window.customElements.define(JwtLogin.tag, JwtLogin);
export { JwtLogin };
