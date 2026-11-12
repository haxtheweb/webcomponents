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
    if (
      newValue &&
      typeof newValue === "object" &&
      newValue.jwt &&
      typeof newValue.jwt === "string"
    ) {
      actualValue = newValue.jwt;
    }
    if (
      (actualValue == null || actualValue == "" || actualValue == "null") &&
      typeof oldValue !== typeof undefined
    ) {
      // Phase 3: clear any stale localStorage key from a previous version so
      // users are migrated away from persisted access tokens.
      try {
        localStorage.removeItem(this.key);
      } catch {
        // intentionally empty
      }
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
    globalThis.addEventListener("focus", this._onVisibilityChange.bind(this), {
      signal: this.windowControllers.signal,
    });
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
      try {
        localStorage.removeItem(this.key);
      } catch {
        // intentionally empty
      }
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
        }
        return this._handleResponseError(response, {
          ctx,
          element,
          proactive,
          redirect,
        }).then(() => null);
      })
      .then((jwtData) => {
        if (!jwtData) {
          return;
        }
        try {
          const token = jwtData;
          let actualJwt = token;
          if (token.jwt && typeof token.jwt === "string") {
            actualJwt = token.jwt;
          } else if (
            token.data &&
            token.data.jwt &&
            typeof token.data.jwt === "string"
          ) {
            actualJwt = token.data.jwt;
          } else if (typeof token === "string") {
            actualJwt = token;
          }
          // a 2xx login that carries no token is not a login (#3209 item 12)
          if (
            ctx === "login" &&
            (typeof actualJwt !== "string" ||
              actualJwt === "" ||
              actualJwt === "null")
          ) {
            this.__loginInFlight = false;
            this._dispatchLoginFailed({ status: 200 });
            return;
          }
          // announce request tokens BEFORE the jwt changes so listeners have
          // them in place when retried / follow-up calls fire
          if (ctx === "login" || ctx === "refresh") {
            this._dispatchSessionTokens(token, ctx);
          }
          this._handleResponseSuccess(actualJwt, {
            ctx,
            element,
            proactive,
            redirect,
          });
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
      case "refresh": {
        this.__refreshInFlight = false;
        this.__refreshPromise = null;
        this.jwt = actualJwt;
        if (element) {
          this._invokeRefreshCallback(element, actualJwt);
        }
        let subs = this.__refreshSubscribers;
        this.__refreshSubscribers = [];
        for (let i = 0; i < subs.length; i++) {
          this._invokeRefreshCallback(subs[i], actualJwt);
        }
        break;
      }
      case "logout":
        this._finishLogout(true, 200, meta.redirect);
        break;
    }
  }

  /**
   * Security (SEC-SESSION): HAXcms login and refresh responses carry the
   * request tokens (userToken, and siteToken when a site resolves) next to
   * the JWT, because connection-settings may omit them for anonymous page
   * loads. Re-broadcast any that are present as `jwt-login-session-tokens`
   * ({ userToken?, siteToken?, context }) so the host app can store them.
   * Nothing is dispatched when neither token is present.
   */
  _dispatchSessionTokens(payload, context) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return;
    }
    const detail = {};
    const sources = [payload];
    if (payload.data && typeof payload.data === "object") {
      sources.push(payload.data);
    }
    ["userToken", "siteToken"].forEach((key) => {
      for (let i = 0; i < sources.length; i++) {
        const value =
          typeof sources[i][key] === "string" ? sources[i][key].trim() : "";
        if (value !== "") {
          detail[key] = value;
          return;
        }
      }
    });
    if (!detail.userToken && !detail.siteToken) {
      return;
    }
    detail.context = context;
    this.dispatchEvent(
      new CustomEvent("jwt-login-session-tokens", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: detail,
      }),
    );
  }

  _invokeRefreshCallback(element, jwt) {
    if (
      !element ||
      !element.obj ||
      typeof element.obj[element.callback] !== "function"
    ) {
      return;
    }
    try {
      element.obj[element.callback](jwt, ...element.params);
    } catch (e) {
      console.warn("jwt refresh callback error", e);
    }
  }

  // Phase 2: error handler uses the captured context. Each context reports
  // only its own failure: jwt-login-refresh-error means "a refresh failed,
  // the session is gone" and nothing else (haxtheweb/issues#3209). Async so a
  // failed login can pass the server's message and Retry-After along.
  async _handleResponseError(response, meta) {
    const ctx = meta.ctx;
    const proactive = meta.proactive;
    const redirect = meta.redirect;
    if (ctx === "login") {
      this.__loginInFlight = false;
      this._dispatchLoginFailed(await this._readFailure(response));
      // a rejected login is not a failed refresh: stop here so app-hax does
      // not log out and reload before the form can show the error
      return;
    }
    if (ctx === "refresh") {
      this._failRefresh(response, proactive, "failed");
      return;
    }
    // logout: the local session is already cleared (logoutRequest nulls the
    // jwt first). Report the server's answer, but never as a refresh-error:
    // listeners answer that with another logout, which looped forever.
    console.warn("jwt logout failed", response);
    this._finishLogout(false, response ? response.status : 0, redirect);
  }

  /**
   * Pull what a failed login response says about itself. Both HAXcms
   * backends send { status, data: { message } }; the brute-force guard adds a
   * Retry-After header on 429.
   * @returns {{status: number, message: string, retryAfter: number}}
   */
  async _readFailure(response) {
    // tolerate null and non-Response objects (tests pass plain stubs)
    const r = response || {};
    const detail = {
      status: typeof r.status === "number" ? r.status : 0,
      message: "",
      retryAfter: 0,
    };
    if (r.headers && typeof r.headers.get === "function") {
      const retry = parseInt(r.headers.get("Retry-After"), 10);
      if (retry > 0) {
        detail.retryAfter = retry;
      }
    }
    if (typeof r.json === "function") {
      try {
        const body = await r.json();
        const holder =
          body && body.data && typeof body.data === "object" ? body.data : body;
        if (holder && typeof holder.message === "string") {
          detail.message = holder.message;
        }
      } catch {
        // no JSON body: status alone will have to do
      }
    }
    return detail;
  }

  /**
   * `jwt-login-login-failed` detail is { status, message, retryAfter }
   * (status 0 = the request never reached the server). It used to be `true`;
   * the object is still truthy for listeners that only test the detail.
   */
  _dispatchLoginFailed(detail = {}) {
    this.dispatchEvent(
      new CustomEvent("jwt-login-login-failed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: Object.assign(
          { status: 0, message: "", retryAfter: 0 },
          detail,
        ),
      }),
    );
  }

  /**
   * `jwt-login-logout-complete` fires once the logout request settles, so a
   * host can wait for the server to drop the session before reloading.
   * detail: { ok, status } (status 0 = network error or no logout url)
   */
  _dispatchLogoutComplete(ok, status) {
    this.dispatchEvent(
      new CustomEvent("jwt-login-logout-complete", {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: { ok: ok === true, status: status || 0 },
      }),
    );
  }

  /**
   * A refresh failed (bad response or network error): drop the pending
   * refresh state. A proactive refresh only warns; any other refresh fires
   * jwt-login-refresh-error ({ value }) because the session is gone.
   */
  _failRefresh(value, proactive, what) {
    this.__refreshInFlight = false;
    this.__refreshPromise = null;
    this.__refreshSubscribers = [];
    if (proactive) {
      console.warn("jwt proactive refresh " + what, value);
      return;
    }
    console.warn("jwt refresh " + what, value);
    this.dispatchEvent(
      new CustomEvent("jwt-login-refresh-error", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: { value: value },
      }),
    );
  }

  /**
   * Every logout path ends here: clear the in-flight flag, report the result
   * as `jwt-login-logout-complete`, then follow redirectUrl if asked to.
   */
  _finishLogout(ok, status, redirect) {
    this.__logoutInFlight = false;
    this._dispatchLogoutComplete(ok, status);
    if (redirect && this.redirectUrl) {
      setTimeout(() => {
        // security: validate scheme before navigation (JS-URL)
        globalThis.location.href = this.safeRedirect(this.redirectUrl);
      }, 100);
    }
  }

  // Phase 2: network error handler uses the captured context
  _handleNetworkError(err, meta) {
    let ctx = meta.ctx;
    let proactive = meta.proactive;
    if (ctx === "login") {
      this.__loginInFlight = false;
      this._dispatchLoginFailed({ status: 0 });
      console.warn("jwt login network error", err);
      return;
    }
    if (ctx === "refresh") {
      this._failRefresh(err, proactive, "network error");
      return;
    }
    if (ctx === "logout") {
      this._finishLogout(false, 0, meta.redirect);
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
    let redirect = e && e.detail ? e.detail.redirect : false;
    if (
      this.logoutUrl &&
      this.logoutUrl !== "" &&
      this.logoutUrl !== "undefined"
    ) {
      if (this.isDifferentDomain(this.logoutUrl)) {
        // security: validate scheme before navigation (JS-URL)
        globalThis.location.href = this.safeRedirect(this.logoutUrl);
      } else {
        this.generateRequest(
          this.logoutUrl,
          {},
          {
            context: "logout",
            redirect: redirect,
          },
        );
      }
    } else {
      this._finishLogout(true, 0, redirect);
    }
  }

  isDifferentDomain(urlToCheck) {
    try {
      let currentUrl = new URL(globalThis.location.href);
      let targetUrl = new URL(urlToCheck, globalThis.location.href);
      return currentUrl.hostname !== targetUrl.hostname;
    } catch (error) {
      console.error("Invalid URL provided:", error);
      return false;
    }
  }

  // security: only allow http(s) navigation; blocks javascript:/data: schemes that would execute on location.href assignment (JS-URL)
  safeRedirect(raw) {
    try {
      const u = new URL(raw, globalThis.location.href);
      if (u.protocol !== "https:" && u.protocol !== "http:") {
        return "/";
      }
      return u.href;
    } catch {
      return "/";
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
    let parts = jwt.split(".");
    if (parts.length < 2) {
      return 0;
    }
    try {
      let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      while (payload.length % 4) {
        payload += "=";
      }
      let decoded = globalThis.atob(payload);
      let parsed = JSON.parse(decoded);
      if (parsed && typeof parsed.exp === "number") {
        return parsed.exp;
      }
    } catch {
      // intentionally empty
    }
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
    let exp = this._decodeJwtExpUnverified(this.jwt);
    if (!exp) {
      return;
    }
    let msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      return;
    }
    let leadMs = 60000;
    let delay = msUntilExpiry - leadMs;
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
    let exp = this._decodeJwtExpUnverified(this.jwt);
    if (!exp) {
      return;
    }
    let msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0 || msUntilExpiry < 120000) {
      this._requestProactiveRefreshToken();
    } else {
      this._scheduleProactiveRefresh();
    }
  }
}
globalThis.customElements.define(JwtLogin.tag, JwtLogin);
export { JwtLogin };
