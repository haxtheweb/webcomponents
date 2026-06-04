import { LitElement, html } from "lit";
import { localStorageGet } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/jwt-login/jwt-login.js";
import { toJS, autorun } from "mobx";
import { licenseList } from "@haxtheweb/license-element/license-element.js";
import { store } from "./AppHaxStore.js";
const SUPPORTED_SITE_LICENSES = Object.keys(new licenseList("select"));
// this element will manage all connectivity to the backend
// this way everything is forced to request through calls to this
// so that it doesn't get messy down below in state
export class AppHaxBackendAPI extends LitElement {
  static get tag() {
    return "app-hax-backend-api";
  }

  constructor() {
    super();
    this.jwt = localStorageGet("jwt", null);
    this.__loopBlock = false;
    this.__connectionTestPending = null;
    this.__retryCounts = {};
    this.__maxRefreshRetries = 2;
    this.method =
      window && globalThis.appSettings && globalThis.appSettings.demo
        ? "GET"
        : "POST";
    this.basePath = "/";
    this.lastResponse = {};
    this.appSettings = {};
    autorun(() => {
      this.appSettings = toJS(store.appSettings);
      // allow setting in session driven environments
      if (this.appSettings.method) {
        this.method = this.appSettings.method;
      }
      if (this.appSettings.jwt) {
        this.jwt = this.appSettings.jwt;
      }
    });
    autorun(() => {
      this.token = toJS(store.token);
    });
  }
  _hasValidJWT(jwt) {
    return jwt !== "null" && !!jwt;
  }
  _getRetryKey(call, data = {}) {
    const safeData = {};
    Object.keys(data).forEach((key) => {
      if (key !== "jwt" && key !== "token") {
        safeData[key] = data[key];
      }
    });
    return `${call}:${JSON.stringify(safeData)}`;
  }
  _incrementRetryCount(retryKey) {
    if (!this.__retryCounts[retryKey]) {
      this.__retryCounts[retryKey] = 0;
    }
    this.__retryCounts[retryKey] += 1;
    return this.__retryCounts[retryKey];
  }
  _clearRetryCount(retryKey) {
    if (this.__retryCounts[retryKey]) {
      delete this.__retryCounts[retryKey];
    }
  }
  _clearAllRetryCounts() {
    this.__retryCounts = {};
  }
  _triggerLogout() {
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: true,
      }),
    );
  }
  _clearAuthSession(triggerLogout = false) {
    this.jwt = null;
    store.jwt = null;
    store.authValidated = false;
    store.authTesting = false;
    store.user = {
      name: "",
    };
    this._clearAllRetryCounts();
    if (triggerLogout) {
      this._triggerLogout();
    }
  }
  async _validateConnection() {
    if (!(this.appSettings && this.appSettings.connectionTest)) {
      const hasJWT = this._hasValidJWT(this.jwt);
      store.authValidated = hasJWT;
      store.authTesting = false;
      return hasJWT;
    }
    if (this.__connectionTestPending) {
      return this.__connectionTestPending;
    }
    store.authTesting = true;
    const payload = {};
    if (this._hasValidJWT(this.jwt)) {
      payload.jwt = this.jwt;
    }
    if (this.token) {
      payload.token = this.token;
    }
    const options = {
      method: this.method,
    };
    let requestUrl = `${this.basePath}${this.appSettings.connectionTest}`;
    if (this.method === "GET") {
      const search = new URLSearchParams(payload).toString();
      if (search) {
        requestUrl += `?${search}`;
      }
    } else {
      options.headers = {
        "Content-Type": "application/json",
      };
      options.body = JSON.stringify(payload);
    }
    this.__connectionTestPending = fetch(requestUrl, options)
      .then(async (response) => {
        if (!response.ok) {
          return {
            authenticated: false,
          };
        }
        try {
          return await response.json();
        } catch (e) {
          return {
            authenticated: false,
          };
        }
      })
      .then((result) => {
        if (result && result.authenticated) {
          const nextJWT = result.jwt ? result.jwt : this.jwt;
          if (this._hasValidJWT(nextJWT)) {
            this.jwt = nextJWT;
            store.jwt = nextJWT;
            store.authValidated = true;
            if (result.user && typeof result.user === "string") {
              store.user = {
                name: result.user,
              };
            }
            return true;
          }
        }
        store.authValidated = false;
        return false;
      })
      .catch(() => {
        store.authValidated = false;
        return false;
      })
      .finally(() => {
        store.authTesting = false;
        this.__connectionTestPending = null;
      });
    return this.__connectionTestPending;
  }
  async _syncUserAfterValidation() {
    if (this.__loopBlock) {
      return;
    }
    this.__loopBlock = true;
    const userData = await this.makeCall("getUserDataPath");
    if (userData && userData.data) {
      store.user = {
        name: userData.data.userName,
      };
    } else {
      this._clearAuthSession(false);
    }
    this.__loopBlock = false;
  }

  static get properties() {
    return {
      jwt: { type: String },
      basePath: { type: String, attribute: "base-path" },
      appSettings: { type: Object },
      method: { type: String },
      token: { type: String },
    };
  }

  render() {
    return html`<jwt-login
      jwt="${this.jwt}"
      url="${this.basePath}${this.appSettings.login}"
      method="${this.method}"
      refresh-url="${this.basePath}${this.appSettings.refreshUrl}"
      redirect-url="${this.appSettings.redirectUrl}"
      logout-url="${this.basePath}${this.appSettings.logout}"
      id="jwt"
      @jwt-changed="${this.jwtChanged}"
      @jwt-login-login-failed="${this.jwtFailed}"
    ></jwt-login>`;
  }

  // failed to get valid JWT, wipe current
  jwtFailed(e) {
    this._clearAuthSession(false);
  }
  // event meaning we either got or removed the jwt
  async jwtChanged(e) {
    this.jwt = e.detail.value;
    if (!this._hasValidJWT(this.jwt)) {
      this._clearAuthSession(false);
      return;
    }
    const isAuthenticated = await this._validateConnection();
    if (!isAuthenticated) {
      this._clearAuthSession(true);
      return;
    }
    await this._syncUserAfterValidation();
  }

  async makeCall(call, data = {}, save = false, callback = false) {
    if (this.appSettings && this.appSettings[call]) {
      const retryKey = this._getRetryKey(call, data);
      const requestData = Object.assign({}, data);
      var urlRequest = `${this.basePath}${this.appSettings[call]}`;
      var options = {
        method: this.method,
      };
      if (this.jwt) {
        requestData.jwt = this.jwt;
      }
      if (this.token) {
        requestData.token = this.token;
      }
      // encode in search params or body of the request
      if (this.method === "GET") {
        urlRequest += "?" + new URLSearchParams(requestData).toString();
      } else {
        options.headers = {
          "Content-Type": "application/json",
        };
        options.body = JSON.stringify(requestData);
      }
      const response = await fetch(`${urlRequest}`, options).then(
        (response) => {
          if (response.ok) {
            this._clearRetryCount(retryKey);
            return response.json();
          } else if (response.status === 401) {
            this._clearRetryCount(retryKey);
            this._clearAuthSession(true);
          }
          // we got a miss, logout cause something is wrong
          else if (response.status === 404) {
            this._clearRetryCount(retryKey);
            this._clearAuthSession(true);
          } else if (response.status === 403) {
            const retryCount = this._incrementRetryCount(retryKey);
            if (retryCount > this.__maxRefreshRetries) {
              this._clearRetryCount(retryKey);
              this._clearAuthSession(true);
            } else {
              globalThis.dispatchEvent(
                new CustomEvent("jwt-login-refresh-token", {
                  composed: true,
                  bubbles: true,
                  cancelable: false,
                  detail: {
                    element: {
                      obj: this,
                      callback: "refreshRequest",
                      params: [call, data, save, callback, retryKey],
                    },
                  },
                }),
              );
            }
          }
          return {};
        },
      );
      // ability to save the output if this is being done as a bg task
      // that way we can get access to the result later on
      if (save) {
        this.lastResponse[call] = response;
      }
      if (callback) {
        callback();
      }
      return response;
    }
  }

  /**
   * Attempt to salvage the request that was kicked off
   * when our JWT needed refreshed
   */
  refreshRequest(jwt, response) {
    const { call, data, save, callback, retryKey } = response;
    // force the jwt to be the updated jwt
    // this helps avoid any possible event timing issue
    if (jwt) {
      this.jwt = jwt;
      this.makeCall(call, data, save, callback);
    } else if (retryKey) {
      this._clearRetryCount(retryKey);
    }
  }

  // set instance of API in store
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // set store refernece to this singleton
    store.AppHaxAPI = this;
    // site creation roped into the promise list
    // after knowing our data structure since we'll definitely call this
    store.newSitePromiseList = [
      ...store.newSitePromiseList,
      async () =>
        await this.makeCall("createSite", this._formatSitePostData(), true),
    ];
    if (this.appSettings && this.appSettings.connectionTest) {
      this._validateConnection().then((isAuthenticated) => {
        if (isAuthenticated) {
          this._syncUserAfterValidation();
        } else {
          this._clearAuthSession(false);
        }
      });
    } else if (this._hasValidJWT(this.jwt)) {
      this.jwtChanged({
        detail: {
          value: this.jwt,
        },
      });
    } else {
      store.authValidated = false;
      store.authTesting = false;
    }
  }

  _normalizeSiteLicense(rawValue) {
    if (!rawValue || typeof rawValue !== "string") {
      return null;
    }
    const value = rawValue
      .trim()
      .toLowerCase()
      .replace(/_/g, "-");
    if (value === "") {
      return null;
    }
    if (SUPPORTED_SITE_LICENSES.includes(value)) {
      return value;
    }
    for (const code of SUPPORTED_SITE_LICENSES) {
      if (
        value.indexOf(`/licenses/${code}`) !== -1 ||
        value.indexOf(`cc ${code}`) !== -1 ||
        value.indexOf(`cc-${code}`) !== -1 ||
        value.indexOf(`cc:${code}`) !== -1
      ) {
        return code;
      }
    }
    return null;
  }
  // just easier to read here
  _formatSitePostData() {
    const site = toJS(store.site);
    // html contents if we are starting from a file import, otherwise its null
    const items = toJS(store.items);
    const itemFiles = toJS(store.itemFiles);
    const skeletonMachineName = toJS(store.skeletonMachineName);
    const useTrustedSkeleton =
      site &&
      site.structure === "from-skeleton" &&
      typeof skeletonMachineName === "string" &&
      skeletonMachineName !== "";
    const buildData = {
      site: {
        name: site.name,
        description: `${site.type} ${site.structure}`,
        theme: site.theme,
      },
      build: {
        type: site.type,
        structure: site.structure,
        items: useTrustedSkeleton ? null : items,
        files: useTrustedSkeleton ? null : itemFiles,
      },
    };
    const normalizedLicense = this._normalizeSiteLicense(site.license);
    if (normalizedLicense) {
      buildData.site.license = normalizedLicense;
    }
    if (useTrustedSkeleton) {
      buildData.build.skeletonMachineName = skeletonMachineName;
      return buildData;
    }
    return buildData;
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "jwt") {
        store.jwt = this[propName];
      }
      if (propName === "token") {
        store.token = this[propName];
      }
    });
  }
}

globalThis.AppHaxAPI = globalThis.AppHaxAPI || {};

globalThis.AppHaxAPI.requestAvailability = () => {
  if (!globalThis.AppHaxAPI.instance) {
    globalThis.AppHaxAPI.instance = globalThis.document.createElement(
      AppHaxBackendAPI.tag,
    );
    globalThis.document.body.appendChild(globalThis.AppHaxAPI.instance);
  }
  return globalThis.AppHaxAPI.instance;
};
export const AppHaxAPI = globalThis.AppHaxAPI.requestAvailability();

customElements.define(AppHaxBackendAPI.tag, AppHaxBackendAPI);
