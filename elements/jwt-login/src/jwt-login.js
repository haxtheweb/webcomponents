import { LitElement } from "lit";
/**
 * `jwt-login`
 * `a simple element to check for and fetch JWTs`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
 * @element jwt-login
 */
class JwtLogin extends LitElement {
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.auto = false;
    this.method = "GET";
    this.body = {};
    this.key = "jwt";
    this.jwt = null;
    this.ready = false;
  }
  /**
   * Handle the last error rolling in
   */
  lastErrorChanged(e) {
    if (e && this.__context != "logout") {
      // check for JWT needing refreshed vs busted but must be 403
      console.warn(e);
      this.dispatchEvent(
        new CustomEvent("jwt-login-refresh-error", {
          composed: true,
          bubbles: true,
          cancelable: false,
          detail: {
            value: e,
          },
        }),
      );
    }
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
        type: Boolean,
      },
      /**
       * refreshUrl to get a new JSON web token
       */
      refreshUrl: {
        type: String,
        attribute: "refresh-url",
      },
      /**
       * where to redirect for a login token if we REALLY are logged out
       */
      redirectUrl: {
        type: String,
        attribute: "redirect-url",
      },
      /**
       * logout url
       */
      logoutUrl: {
        type: String,
        attribute: "logout-url",
      },
      /**
       * url to get the JWT
       */
      url: {
        type: String,
      },
      /**
       * Request method
       */
      method: {
        type: String,
      },
      /**
       * Optional body, useful when doing posts
       */
      body: {
        type: Object,
      },
      /**
       * Key that contains the token in local storage
       */
      key: {
        type: String,
      },
      /**
       * JSON Web token to securely pass around
       */
      jwt: {
        type: String,
      },
    };
  }
  /**
   * LitElement life cycle - properties changed callback
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (
        ["auto", "method", "url"].includes(propName) &&
        this.url &&
        !this.jwt &&
        this.ready &&
        this.auto
      ) {
        clearTimeout(this.__debounce);
        this.__debounce = setTimeout(() => {
          this.generateRequest(this.url, this.body);
        }, 0);
      }
      if (propName == "jwt") {
        this._jwtChanged(this[propName], oldValue);
        // notify
        this.dispatchEvent(
          new CustomEvent("jwt-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
    });
  }
  _jwtChanged(newValue, oldValue) {
    if (
      (newValue == null || newValue == "" || newValue == "null") &&
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
          detail: false,
        }),
      );
    } else if (newValue) {
      // set the jwt into local storage so we can reference later
      try {
        localStorage.setItem(this.key, JSON.stringify(newValue));
      } catch (e) {}
      this.dispatchEvent(
        new CustomEvent("jwt-token", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: newValue,
        }),
      );
      this.dispatchEvent(
        new CustomEvent("jwt-logged-in", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true,
        }),
      );
    }
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener(
      "jwt-login-refresh-token",
      this.requestRefreshToken.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "jwt-login-toggle",
      this.toggleLogin.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );

    globalThis.addEventListener(
      "jwt-login-login",
      this.loginRequest.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );

    globalThis.addEventListener(
      "jwt-login-logout",
      this.logoutRequest.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  /**
   * LitElement life cycle - ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.ready = true;
    // set jwt from local storage bin
    try {
      this.jwt = JSON.parse(localStorage.getItem(this.key));
    } catch (e) {
      this.jwt = null;
    }
  }
  /**
   * Request a refresh token
   */
  requestRefreshToken(e) {
    this.__context = "refresh";
    if (e.detail.element) {
      this.__element = e.detail.element;
    }
    this.generateRequest(this.refreshUrl);
  }
  // generate request for token data
  generateRequest(url, body = {}) {
    let data = {
      method: this.method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (this.method != "GET") {
      data.body = JSON.stringify(body);
    }
    fetch(url, data)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          // prevent infinite loop if we fail on the logout endpoint
          if (
            this.__context == "logout" &&
            this.__redirect &&
            this.redirectUrl
          ) {
            setTimeout(() => {
              globalThis.location.href = this.redirectUrl;
            }, 100);
          }
          // message so things know out login attempt failed
          else if (this.__context == "login") {
            this.dispatchEvent(
              new CustomEvent("jwt-login-login-failed", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: true,
              }),
            );
          }
          this.lastErrorChanged(response);
        }
      })
      .then((jwtData) => {
        try {
          const token = jwtData;
          if (token) {
            // support direct response back
            // or nested object
            if (token.jwt) {
              this.loginResponse(token.jwt);
            } else {
              this.loginResponse(token);
            }
          }
        } catch (e) {
          console.warn(e);
        }
      });
  }
  /**
   * Request a user login if we need one or log out
   */
  toggleLogin(e) {
    // null is default, if we don't have anything go get one
    if (this.jwt == null) {
      this.loginRequest(e);
    } else {
      this.logoutRequest(e);
    }
  }
  loginRequest(e) {
    this.__context = "login";
    // detail of a login request event is the body which should have
    // the authorization data in it
    this.body = e.detail;
    this.generateRequest(this.url, this.body);
  }
  logoutRequest(e) {
    this.__context = "logout";
    this.__redirect = e.detail.redirect;
    // we were told to logout, reset body
    this.body = {};
    // reset jwt which will do all the events / local storage work
    this.jwt = null;
    this.generateRequest(this.logoutUrl);
  }
  /**
   * Login bridge to get a JWT and hang onto it
   */
  loginResponse(response) {
    // trap in case front end thinks this is a valid response..
    switch (this.__context) {
      case "login":
        this.jwt = response;
        break;
      case "refresh":
        // jwt change events will propagate and do their thing
        this.jwt = response;
        // if we had a requesting element, let's let it do its thing
        if (this.__element) {
          this.__element.obj[this.__element.callback](
            this.jwt,
            ...this.__element.params,
          );
          this.__element = false;
        }
        break;
      case "logout":
        if (this.__redirect && this.redirectUrl) {
          setTimeout(() => {
            globalThis.location.href = this.redirectUrl;
          }, 100);
        }
        break;
    }
  }
}
customElements.define(JwtLogin.tag, JwtLogin);
export { JwtLogin };
