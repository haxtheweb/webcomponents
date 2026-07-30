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
    // Phase 2 (M2 race fix): per-request context is now captured in closures
    // inside generateRequest, so overlapping login/refresh/logout fetches can
    // no longer clobber each other via a single mutable __context field.
    // Shared refresh state so overlapping reactive refreshes subscribe to the
    // same promise instead of overwriting each other's __element.
    this.__refreshInFlight = false;
    this.__refreshPromise = null;
    this.__refreshSubscribers = [];
    // Track login/logout in-flight so proactive refresh is skipped while those
    // are active, and so logout can cancel a pending proactive refresh.
    this.__loginInFlight = false;
    this.__logoutInFlight = false;
    this.__proactiveRefreshTimer = null;
  }

  static get tag() {
    return "jwt-login";
  }

  static get properties() {
    return {
      auto: { type: Boolean },
      refreshUrl: { type: String, attribute: "refresh-url" },
      redirectUrl: { type: String, attribute: "redirect-url" },
      logoutUrl: { type: String, attribute: "logout-url" },
      url: { type: String },
      method: { type: String },
      body: { type: Object },
      key: { type: String },
      jwt: { type: String },
    };
  }

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
          this.generateRequest(this.url, this.body, {
            context: "login",
          });
        }, 0);
      }
      if (propName == "jwt") {
        this._jwtChanged(this[propName], oldValue);
        this.dispatchEvent(
          new CustomEvent("jwt-changed", {
            detail: { value: this[propName] },
          }),
        );
      }
    });
  }

  // Phase 3 (M1): the access JWT is no longer written to or read from
  // localStorage. It lives in element state / MobX stores only for the current
  // page lifetime. Rehydration after a page reload happens via connectionTest
  // + the HttpOnly refresh cookie. HAXiam's server-injected appSettings.jwt
  // is preserved as a non-persistent bootstrap input (see firstUpdated).
  _jwtChanged(newValue, oldValue) {
    let actualValue = newValue;
    if (newValue && typeof newValue === 'object' && newValue.jwt && typeof newValue.jwt === 'string') {
      actualValue = newValue.jwt;
    }
    if (
      (actualValue == null || actualValue == "" || actualValue == "null") &&
      typeof oldValue !== typeof undefined
    ) {
      // Phase 3: clear any stale localStorage key from a previous version so
      // users are migrated away from persisted access tokens.
      try { localStorage.removeItem(this.key); } catch (e) {}
      this.dispatchEvent(
        new CustomEvent("jwt-logged-in", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: false,
        }),
      );
    } else if (actualValue) {
      // Phase 3: no longer writing to localStorage; the token stays in-memory.
      this.dispatchEvent(
        new CustomEvent("jwt-token", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: actualValue,
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
    this._scheduleProactiveRefresh();
  }

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
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "jwt-login-login",
      this.loginRequest.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "jwt-login-logout",
      this.logoutRequest.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "visibilitychange",
      this._onVisibilityChange.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "focus",
      this._onVisibilityChange.bind(this),
      { signal: this.windowControllers.signal },
    );
  }

  disconnectedCallback() {
    clearTimeout(this.__proactiveRefreshTimer);
    this.__proactiveRefreshTimer = null;
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.ready = true;
    // Phase 3 (M1): no longer reading the JWT from localStorage on startup.
    // The access JWT must come from appSettings.jwt (HAXiam / server-injected
    // bootstrap) or from connectionTest + the HttpOnly refresh cookie. Clear
    // any stale localStorage key from a previous version.
    Promise.resolve().then(() => {
      try { localStorage.removeItem(this.key); } catch (e) {}
    });
  }

  // Phase 2 (M2 race fix): requestRefreshToken now subscribes to a shared
  // refresh promise when one is in flight, instead of overwriting the single
  // __element/__context fields. This prevents overlapping reactive refreshes
  // from dropping each other's retry callbacks.
  requestRefreshToken(e) {
    const element = e && e.detail && e.detail.element ? e.detail.element : null;
    if (this.__refreshInFlight && this.__refreshPromise) {
      if (element) {
        this.__refreshSubscribers.push(element);
      }
      return;
    }
    this._startRefresh(element, false);
  }

  // Centralized refresh starter. `element` is the requesting element (for
  // reactive refresh) or null (for proactive refresh). `proactive` indicates
  // whether this is a silent proactive refresh (failure stays non-fatal).
  _startRefresh(element, proactive) {
    if (!this.refreshUrl || this.refreshUrl === "") {
      return;
    }
    this.__refreshInFlight = true;
    this.__refreshSubscribers = [];
    if (element) {
      this.__refreshSubscribers.push(element);
    }
    const meta = {
      context: "refresh",
      element: null,
      proactive: proactive,
    };
    this.__refreshPromise = this.generateRequest(this.refreshUrl, {}, meta);
  }

  // Phase 2 (M2 race fix): generateRequest now accepts a `meta` object and
  // captures it in closures so the async response handlers use the context
  // that was active when the request was started, not a mutable field that
  // may have been overwritten by a later entry point.
  generateRequest(url, body = {}, meta = {}) {
    const ctx = meta.context || "login";
    const element = meta.element || null;
    const proactive = meta.proactive || false;
    const redirect = meta.redirect || false;
    let data = {
      method: this.method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (this.method != "GET") {
      data.body = JSON.stringify(body);
    }
    return fetch(url, data)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          this._handleResponseError(response, { ctx, element, proactive, redirect });
          return null;
        }
      })
      .then((jwtData) => {
        if (!jwtData) {
          return;
        }
        try {
          const token = jwtData;
          let actualJwt = token;
          if (token.jwt && typeof token.jwt === 'string') {
            actualJwt = token.jwt;
          } else if (token.data && token.data.jwt && typeof token.data.jwt === 'string') {
            actualJwt = token.data.jwt;
          } else if (typeof token === 'string') {
            actualJwt = token;
          }
          this._handleResponseSuccess(actualJwt, { ctx, element, proactive, redirect });
        } catch (e) {
          console.warn(e);
        }
      })
      .catch((err) => {
        this._handleNetworkError(err, { ctx, element, proactive, redirect });
      });
  }

  // Phase 2: success handler uses the captured context, not this.__context
  _handleResponseSuccess(actualJwt, meta) {
    const ctx = meta.ctx;
    const element = meta.element;
    switch (ctx) {
      case "login":
        this.__loginInFlight = false;
        this.jwt = actualJwt;
        break;
      case "refresh":
        this.__refreshInFlight = false;
        this.__refreshPromise = null;
        this.jwt = actualJwt;
        if (element) {
          this._invokeRefreshCallback(element, actualJwt);
        }
        var subs = this.__refreshSubscribers;
        this.__refreshSubscribers = [];
        for (var i = 0; i < subs.length; i++) {
          this._invokeRefreshCallback(subs[i], actualJwt);
        }
        break;
      case "logout":
        this.__logoutInFlight = false;
        if (meta.redirect && this.redirectUrl) {
          setTimeout(() => {
            globalThis.location.href = this.redirectUrl;
          }, 100);
        }
        break;
    }
  }

  _invokeRefreshCallback(element, jwt) {
    if (!element || !element.obj || typeof element.obj[element.callback] !== 'function') {
      return;
    }
    try {
      element.obj[element.callback](jwt, ...element.params);
    } catch (e) {
      console.warn("jwt refresh callback error", e);
    }
  }

  // Phase 2: error handler uses the captured context
  _handleResponseError(response, meta) {
    var ctx = meta.ctx;
    var proactive = meta.proactive;
    var redirect = meta.redirect;
    if (ctx === "logout" && redirect && this.redirectUrl) {
      setTimeout(() => {
        globalThis.location.href = this.redirectUrl;
      }, 100);
      return;
    }
    if (ctx === "login") {
      this.__loginInFlight = false;
      this.dispatchEvent(
        new CustomEvent("jwt-login-login-failed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: true,
        }),
      );
    }
    if (ctx === "refresh") {
      this.__refreshInFlight = false;
      this.__refreshPromise = null;
      this.__refreshSubscribers = [];
      if (proactive) {
        console.warn("jwt proactive refresh failed", response);
        return;
      }
      console.warn("jwt refresh failed", response);
      this.dispatchEvent(
        new CustomEvent("jwt-login-refresh-error", {
          composed: true,
          bubbles: true,
          cancelable: false,
          detail: { value: response },
        }),
      );
      return;
    }
    console.warn(response);
    this.dispatchEvent(
      new CustomEvent("jwt-login-refresh-error", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: { value: response },
      }),
    );
  }

  // Phase 2: network error handler uses the captured context
  _handleNetworkError(err, meta) {
    var ctx = meta.ctx;
    var proactive = meta.proactive;
    if (ctx === "login") {
      this.__loginInFlight = false;
    }
    if (ctx === "refresh") {
      this.__refreshInFlight = false;
      this.__refreshPromise = null;
      this.__refreshSubscribers = [];
      if (proactive) {
        console.warn("jwt proactive refresh network error", err);
        return;
      }
      console.warn("jwt refresh network error", err);
      this.dispatchEvent(
        new CustomEvent("jwt-login-refresh-error", {
          composed: true,
          bubbles: true,
          cancelable: false,
          detail: { value: err },
        }),
      );
      return;
    }
    if (ctx === "logout") {
      this.__logoutInFlight = false;
    }
    console.warn(err);
  }

  toggleLogin(e) {
    if (this.jwt == null) {
      this.loginRequest(e);
    } else {
      this.logoutRequest(e);
    }
  }

  loginRequest(e) {
    this.__loginInFlight = true;
    this.body = e.detail;
    this.generateRequest(this.url, this.body, {
      context: "login",
    });
  }

  // Phase 2: logout cancels any pending proactive refresh and marks logout
  // in-flight so a late proactive refresh result cannot re-arm the JWT
  logoutRequest(e) {
    clearTimeout(this.__proactiveRefreshTimer);
    this.__proactiveRefreshTimer = null;
    this.__logoutInFlight = true;
    this.__refreshInFlight = false;
    this.__refreshPromise = null;
    this.__refreshSubscribers = [];
    this.body = {};
    this.jwt = null;
    var redirect = e && e.detail ? e.detail.redirect : false;
    if (
      this.logoutUrl &&
      this.logoutUrl !== "" &&
      this.logoutUrl !== "undefined"
    ) {
      if (this.isDifferentDomain(this.logoutUrl)) {
        globalThis.location.href = this.logoutUrl;
      } else {
        this.generateRequest(this.logoutUrl, {}, {
          context: "logout",
          redirect: redirect,
        });
      }
    } else if (redirect && this.redirectUrl) {
      setTimeout(() => {
        globalThis.location.href = this.redirectUrl;
      }, 100);
    }
  }

  isDifferentDomain(urlToCheck) {
    try {
      var currentUrl = new URL(globalThis.location.href);
      var targetUrl = new URL(urlToCheck, globalThis.location.href);
      return currentUrl.hostname !== targetUrl.hostname;
    } catch (error) {
      console.error("Invalid URL provided:", error);
      return false;
    }
  }

  // Phase 5 (L3): renamed from _decodeJwtExp to make it explicit that this is
  // an UNVERIFIED decode of the exp claim for proactive-refresh scheduling
  // only. It does NOT validate the JWT signature -- the server always
  // re-validates the real token on the refresh call. Do not use this for any
  // auth/security decision.
  _decodeJwtExpUnverified(jwt) {
    if (!jwt || typeof jwt !== "string") {
      return 0;
    }
    var parts = jwt.split(".");
    if (parts.length < 2) {
      return 0;
    }
    try {
      var payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      while (payload.length % 4) {
        payload += "=";
      }
      var decoded = globalThis.atob(payload);
      var parsed = JSON.parse(decoded);
      if (parsed && typeof parsed.exp === "number") {
        return parsed.exp;
      }
    } catch (e) {}
    return 0;
  }

  _hasValidJwtForRefresh(jwt) {
    if (!jwt) {
      return false;
    }
    if (typeof jwt === "string") {
      return jwt !== "" && jwt !== "null";
    }
    if (typeof jwt === "object" && jwt.jwt && typeof jwt.jwt === "string") {
      return jwt.jwt !== "" && jwt.jwt !== "null";
    }
    return false;
  }

  _scheduleProactiveRefresh() {
    clearTimeout(this.__proactiveRefreshTimer);
    this.__proactiveRefreshTimer = null;
    if (!this.refreshUrl || this.refreshUrl === "") {
      return;
    }
    if (this.__loginInFlight || this.__logoutInFlight) {
      return;
    }
    if (globalThis.appSettings && globalThis.appSettings.jwt) {
      return;
    }
    if (!this._hasValidJwtForRefresh(this.jwt)) {
      return;
    }
    var exp = this._decodeJwtExpUnverified(this.jwt);
    if (!exp) {
      return;
    }
    var msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      return;
    }
    var leadMs = 60000;
    var delay = msUntilExpiry - leadMs;
    if (delay < 0) {
      delay = 0;
    }
    this.__proactiveRefreshTimer = setTimeout(() => {
      this.__proactiveRefreshTimer = null;
      this._requestProactiveRefreshToken();
    }, delay);
  }

  _requestProactiveRefreshToken() {
    if (this.__refreshInFlight) {
      return;
    }
    if (this.__loginInFlight || this.__logoutInFlight) {
      return;
    }
    if (!this._hasValidJwtForRefresh(this.jwt)) {
      return;
    }
    if (!this.refreshUrl || this.refreshUrl === "") {
      return;
    }
    this._startRefresh(null, true);
  }

  _onVisibilityChange() {
    if (
      !globalThis.document ||
      globalThis.document.visibilityState !== "visible"
    ) {
      return;
    }
    if (!this._hasValidJwtForRefresh(this.jwt)) {
      return;
    }
    if (this.__loginInFlight || this.__logoutInFlight) {
      return;
    }
    var exp = this._decodeJwtExpUnverified(this.jwt);
    if (!exp) {
      return;
    }
    var msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0 || msUntilExpiry < 120000) {
      this._requestProactiveRefreshToken();
    } else {
      this._scheduleProactiveRefresh();
    }
  }
}
globalThis.customElements.define(JwtLogin.tag, JwtLogin);
export { JwtLogin };
