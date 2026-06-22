import { LitElement, html } from "lit";
import { localStorageGet } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/jwt-login/jwt-login.js";
import { toJS, autorun } from "mobx";
import { licenseList } from "@haxtheweb/license-element/license-element.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { store } from "./AppHaxStore.js";
import {
  configureAppHAXSystemApiRegistry,
  waitForAppHAXSystemApiRegistryReady,
} from "./app-hax-system-api-registry.js";
const SUPPORTED_SITE_LICENSES = Object.keys(new licenseList("select"));
const APP_HAX_SYSTEM_CALL_ALIASES = {
  getUserDataPath: {
    operationId: "sessionUserGet",
    method: "GET",
  },
  createSite: {
    operationId: "createSite",
    method: "POST",
  },
  copySite: {
    operationId: "cloneSite",
    method: "POST",
    pathParams: ["siteName"],
  },
  archiveSite: {
    operationId: "archiveSite",
    method: "POST",
    pathParams: ["siteName"],
  },
  downloadSite: {
    operationId: "downloadSite",
    method: "POST",
    pathParams: ["siteName"],
  },
  downloadSiteSkeleton: {
    operationId: "downloadSiteSkeleton",
    method: "POST",
    pathParams: ["siteName"],
  },
  saveSiteAsTemplate: {
    operationId: "saveSiteAsTemplate",
    method: "POST",
    pathParams: ["siteName"],
  },
  getSitesList: {
    operationId: "listSites",
    method: "GET",
  },
  skeletonsList: {
    operationId: "systemSkeletonsGet",
    method: "GET",
    queryDefaults: {
      includeDisabled: true,
    },
  },
  getSkeleton: {
    operationId: "systemSkeletonDetailGet",
    method: "GET",
    pathParams: ["skeletonName"],
  },
  themesList: {
    operationId: "systemThemesGet",
    method: "GET",
    queryDefaults: {
      includeDisabled: true,
    },
  },
  systemStatus: {
    operationId: "systemStatusGet",
    method: "GET",
  },
  status: {
    operationId: "systemStatusGet",
    method: "GET",
  },
  systemVersion: {
    operationId: "systemVersionGet",
    method: "GET",
  },
  entities: {
    operationId: "systemEntitiesGet",
    method: "GET",
  },
  schemas: {
    operationId: "systemSchemasGet",
    method: "GET",
  },
  getApiKeys: {
    operationId: "getApiKeys",
    method: "GET",
  },
  saveApiKeys: {
    operationId: "saveApiKeysPost",
    method: "POST",
  },
  getMediaSettings: {
    operationId: "getMediaSettings",
    method: "GET",
  },
  saveMediaSettings: {
    operationId: "saveMediaSettingsPost",
    method: "POST",
  },
  systemBlocksList: {
    operationId: "systemBlocksGet",
    method: "GET",
  },
  schemaFileOperation: {
    operationId: "schemaFileOperation",
    method: "POST",
  },
  renameSkeleton: {
    operationId: "systemSkeletonDetailPatch",
    method: "PATCH",
    pathParams: ["skeletonName"],
  },
  deleteSkeleton: {
    operationId: "systemSkeletonDetailDelete",
    method: "DELETE",
    pathParams: ["skeletonName"],
  },
  saveEnabledSkeletons: {
    operationId: "saveEnabledSkeletonsPatch",
    method: "PATCH",
  },
  saveEnabledThemes: {
    operationId: "saveEnabledThemesPatch",
    method: "PATCH",
  },
  saveEnabledBlocks: {
    operationId: "saveEnabledBlocksPatch",
    method: "PATCH",
  },
};
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
    this.__validatedJwt = "";
    this.__systemApiRegistryReady = Promise.resolve(false);
    this.__authFailureCount = 0;
    this.__lastAuthFailureTime = 0;
    this.__maxRapidFailures = 3;
    this.__rapidFailureWindowMs = 10000;
    this.method =
      globalThis && globalThis.appSettings && globalThis.appSettings.demo
        ? "GET"
        : "POST";
    this.basePath = "/";
    if (globalThis.document && globalThis.document.querySelector("app-hax") && globalThis.document.querySelector("app-hax").getAttribute) {
      const basePathAttr = globalThis.document
        .querySelector("app-hax")
        .getAttribute("base-path");
      if (basePathAttr) {
        this.basePath = basePathAttr;
      }
    }
    this.lastResponse = {};
    this.appSettings = {};
    // Detect stale store.appSettings from previous context and update before autorun
    const freshAppSettings =
      globalThis.appSettings &&
      typeof globalThis.appSettings === 'object' &&
      globalThis.appSettings.connectionTest
        ? globalThis.appSettings
        : null;
    const storeSettings = toJS(store.appSettings);
    if (
      freshAppSettings &&
      storeSettings.systemApiBasePath !== freshAppSettings.systemApiBasePath
    ) {
      store.appSettings = freshAppSettings;
      this.appSettings = freshAppSettings;
      if (this.appSettings.method) {
        this.method = this.appSettings.method;
      }
      if (this.appSettings.jwt) {
        this.jwt = this.appSettings.jwt;
      }
      this._configureSystemApiRegistry();
    }
    autorun(() => {
      this.appSettings = toJS(store.appSettings);
      // allow setting in session driven environments
      if (this.appSettings.method) {
        this.method = this.appSettings.method;
      }
      if (this.appSettings.jwt) {
        this.jwt = this.appSettings.jwt;
      }
      this._configureSystemApiRegistry();
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
  _configureSystemApiRegistry() {
    this.__systemApiRegistryReady = configureAppHAXSystemApiRegistry(
      this.appSettings,
      this.jwt,
    );
    return this.__systemApiRegistryReady;
  }
  _getSystemOperationAlias(call = "") {
    if (
      !call ||
      !Object.prototype.hasOwnProperty.call(APP_HAX_SYSTEM_CALL_ALIASES, call)
    ) {
      return null;
    }
    return APP_HAX_SYSTEM_CALL_ALIASES[call];
  }
  supportsCall(call = "") {
    return !!this._getSystemOperationAlias(call);
  }
  _applySystemQueryDefaults(alias = {}, payload = {}) {
    const updatedPayload = Object.assign({}, payload);
    const queryDefaults =
      alias && alias.queryDefaults && typeof alias.queryDefaults === "object"
        ? alias.queryDefaults
        : {};
    Object.keys(queryDefaults).forEach((key) => {
      if (
        !Object.prototype.hasOwnProperty.call(updatedPayload, key) ||
        typeof updatedPayload[key] === "undefined" ||
        updatedPayload[key] === null ||
        `${updatedPayload[key]}`.trim() === ""
      ) {
        updatedPayload[key] = queryDefaults[key];
      }
    });
    return updatedPayload;
  }
  _injectSystemPathParams(call = "", alias = {}, payload = {}, data = {}) {
    const updatedPayload = Object.assign({}, payload);
    const pathParams = Array.isArray(alias.pathParams) ? alias.pathParams : [];
    for (let i = 0; i < pathParams.length; i++) {
      const paramName = pathParams[i];
      const value = this._resolvePathParamValue(call, paramName, data);
      if (
        value !== "" &&
        !Object.prototype.hasOwnProperty.call(updatedPayload, paramName)
      ) {
        updatedPayload[paramName] = value;
      }
    }
    return updatedPayload;
  }
  _buildSystemOperationPayload(call = "", alias = {}, data = {}) {
    const requestData =
      data && typeof data === "object" && !Array.isArray(data)
        ? Object.assign({}, data)
        : {};
    let payload = Object.assign({}, requestData);
    if (Object.prototype.hasOwnProperty.call(payload, "jwt")) {
      delete payload.jwt;
    }
    if (Object.prototype.hasOwnProperty.call(payload, "token")) {
      delete payload.token;
    }
    if (Object.prototype.hasOwnProperty.call(payload, "user_token")) {
      delete payload.user_token;
    }
    payload = this._applySystemQueryDefaults(alias, payload);
    payload = this._injectSystemPathParams(call, alias, payload, requestData);
    if (alias && alias.method) {
      payload.__method = alias.method;
    }
    return payload;
  }
  _resolveResponseStatus(response = null) {
    if (!response || typeof response !== "object") {
      return 0;
    }
    if (typeof response.status === "number") {
      return response.status;
    }
    return 200;
  }
  _handleFailedRequestStatus(
    responseStatus = 0,
    retryKey = "",
    call = "",
    data = {},
    save = false,
    callback = false,
  ) {
    if (responseStatus === 401) {
      this._clearRetryCount(retryKey);
      this._clearAuthSession(true);
      return true;
    }
    if (responseStatus === 404) {
      this._clearRetryCount(retryKey);
      this._clearAuthSession(true);
      return true;
    }
    if (responseStatus === 403) {
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
      return true;
    }
    return false;
  }
  _finalizeCallResponse(call, response = {}, save = false, callback = false) {
    if (save) {
      this.lastResponse[call] = response;
    }
    if (callback) {
      callback();
    }
    return response;
  }
  async _makeSystemOperationCall(
    call = "",
    data = {},
    retryKey = "",
    save = false,
    callback = false,
  ) {
    const alias = this._getSystemOperationAlias(call);
    if (!alias || !alias.operationId) {
      return null;
    }
    await this._configureSystemApiRegistry();
    await waitForAppHAXSystemApiRegistryReady();
    const operationName = `@system/${alias.operationId}`;
    if (!MicroFrontendRegistry.has(operationName)) {
      return {};
    }
    const payload = this._buildSystemOperationPayload(call, alias, data);
    let response = null;
    try {
      response = await MicroFrontendRegistry.call(operationName, payload);
    } catch (e) {
      return {};
    }
    if (!response || typeof response !== "object") {
      return {};
    }
    const responseStatus = this._resolveResponseStatus(response);
    if (
      this._handleFailedRequestStatus(
        responseStatus,
        retryKey,
        call,
        data,
        save,
        callback,
      )
    ) {
      return {};
    }
    if (responseStatus > 0 && responseStatus < 400) {
      this._clearRetryCount(retryKey);
    }
    return response;
  }
  _triggerLogout() {
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: { redirect: true },
      }),
    );
  }
  _clearAuthSession(triggerLogout = false) {
    const now = Date.now();
    if (now - this.__lastAuthFailureTime < this.__rapidFailureWindowMs) {
      this.__authFailureCount++;
    } else {
      this.__authFailureCount = 1;
    }
    this.__lastAuthFailureTime = now;

    if (this.__authFailureCount > this.__maxRapidFailures) {
      console.warn('Auth loop detected; redirecting to login.');
      const redirectUrl = this._renderUrl(this.appSettings && this.appSettings.redirectUrl ? this.appSettings.redirectUrl : '');
      if (redirectUrl) {
        globalThis.location.href = redirectUrl;
      } else {
        globalThis.location.reload();
      }
      return;
    }

    this.jwt = null;
    store.jwt = null;
    this.__validatedJwt = "";
    store.authValidated = false;
    store.authTesting = false;
    store.user = {
      name: "",
    };
    this._clearAllRetryCounts();
    this._configureSystemApiRegistry();
    if (triggerLogout) {
      this._triggerLogout();
    }
  }
  _renderUrl(pathOrUrl) {
    if (!pathOrUrl) {
      return '';
    }
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }
    return `${this.basePath}${pathOrUrl}`;
  }
  async _validateConnection() {
    if (!(this.appSettings && this.appSettings.connectionTest)) {
      const hasJWT = this._hasValidJWT(this.jwt);
      store.authValidated = hasJWT;
      store.authTesting = false;
      return hasJWT;
    }
    if (
      this._hasValidJWT(this.jwt) &&
      this.__validatedJwt &&
      this.__validatedJwt === this.jwt &&
      store.authValidated === true
    ) {
      return true;
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
    if (this._hasValidJWT(this.jwt)) {
      options.headers = {
        Authorization: `Bearer ${this.jwt}`,
      };
    }
    let requestUrl = this._renderUrl(this.appSettings.connectionTest);
    if (this.method === "GET") {
      const search = new URLSearchParams(payload).toString();
      if (search) {
        requestUrl += `?${search}`;
      }
    } else {
      options.headers = Object.assign(options.headers || {}, {
        "Content-Type": "application/json",
      });
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
        let isAuth = false;
        let nextJWT = null;
        let userName = null;
        if (result && result.authenticated) {
          isAuth = true;
          nextJWT = result.jwt || this.jwt;
          userName = result.user;
        } else if (result && result.status === 200 && result.jwt) {
          isAuth = true;
          nextJWT = result.jwt;
          if (result.user && typeof result.user === 'string') {
            userName = result.user;
          }
        } else if (result && result.jwt && typeof result.jwt === 'string' && result.jwt !== '') {
          isAuth = true;
          nextJWT = result.jwt;
        } else if (result && result.status === 200 && result.data && result.data.jwt) {
          isAuth = true;
          nextJWT = result.data.jwt;
          if (result.data.user && typeof result.data.user === 'string') {
            userName = result.data.user;
          }
        }
        if (isAuth && this._hasValidJWT(nextJWT)) {
          this.jwt = nextJWT;
          store.jwt = nextJWT;
          this.__validatedJwt = nextJWT;
          store.authValidated = true;
          if (userName && typeof userName === 'string') {
            store.user = {
              name: userName,
            };
          }
          return true;
        }
        store.authValidated = false;
        this.__validatedJwt = "";
        return false;
      })
      .catch((err) => {
        store.authValidated = false;
        this.__validatedJwt = "";
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
  _resolvePathParamValue(call = "", paramName = "", requestData = {}) {
    const normalizedParamName = String(paramName || "").trim();
    if (!normalizedParamName) {
      return "";
    }
    const payload =
      requestData && typeof requestData === "object" ? requestData : {};
    if (normalizedParamName === "siteName") {
      if (
        payload.site &&
        typeof payload.site === "object" &&
        typeof payload.site.name === "string" &&
        payload.site.name.trim() !== ""
      ) {
        return payload.site.name.trim();
      }
      if (
        typeof payload.siteName === "string" &&
        payload.siteName.trim() !== ""
      ) {
        return payload.siteName.trim();
      }
      if (typeof payload.name === "string" && payload.name.trim() !== "") {
        return payload.name.trim();
      }
      return "";
    }
    if (normalizedParamName === "skeletonName") {
      if (
        typeof payload.skeletonName === "string" &&
        payload.skeletonName.trim() !== ""
      ) {
        return payload.skeletonName.trim();
      }
      if (typeof payload.name === "string" && payload.name.trim() !== "") {
        return payload.name.trim();
      }
      return "";
    }
    if (normalizedParamName === "name") {
      if (typeof payload.name === "string" && payload.name.trim() !== "") {
        return payload.name.trim();
      }
      if (
        typeof payload.skeletonName === "string" &&
        payload.skeletonName.trim() !== ""
      ) {
        return payload.skeletonName.trim();
      }
      if (
        payload.site &&
        typeof payload.site === "object" &&
        typeof payload.site.name === "string" &&
        payload.site.name.trim() !== ""
      ) {
        return payload.site.name.trim();
      }
      if (
        typeof payload.siteName === "string" &&
        payload.siteName.trim() !== ""
      ) {
        return payload.siteName.trim();
      }
      return "";
    }
    if (
      Object.prototype.hasOwnProperty.call(payload, normalizedParamName) &&
      typeof payload[normalizedParamName] !== "undefined" &&
      payload[normalizedParamName] !== null
    ) {
      const value = String(payload[normalizedParamName]).trim();
      if (value !== "") {
        return value;
      }
    }
    return "";
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
      url="${this._renderUrl(this.appSettings.login)}"
      method="${this.method}"
      refresh-url="${this._renderUrl(this.appSettings.refreshUrl)}"
      redirect-url="${this._renderUrl(this.appSettings.redirectUrl)}"
      logout-url="${this._renderUrl(this.appSettings.logout)}"
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
    this._configureSystemApiRegistry();
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
    const requestData =
      data && typeof data === "object" && !Array.isArray(data)
        ? Object.assign({}, data)
        : {};
    const retryKey = this._getRetryKey(call, requestData);
    const systemAlias = this._getSystemOperationAlias(call);
    if (!systemAlias) {
      return this._finalizeCallResponse(call, {}, save, callback);
    }
    const systemResponse = await this._makeSystemOperationCall(
      call,
      requestData,
      retryKey,
      save,
      callback,
    );
    return this._finalizeCallResponse(call, systemResponse, save, callback);
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
      this._configureSystemApiRegistry();
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
    this._configureSystemApiRegistry();
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
        this._configureSystemApiRegistry();
      }
      if (propName === "token") {
        store.token = this[propName];
      }
      if (propName === "appSettings") {
        this._configureSystemApiRegistry();
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
