/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/jwt-login/jwt-login.js";
import "@haxtheweb/h-a-x/h-a-x.js";
import "@haxtheweb/simple-modal/simple-modal.js";
import { enableServices } from "@haxtheweb/micro-frontend-registry/lib/microServices.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { normalizeEventPath } from "@haxtheweb/utils/lib/events.js";
import { DDDVariables } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import {
  configureHAXCMSSiteApiRegistry,
  waitForHAXCMSSiteApiRegistryReady,
} from "./utils/haxcms-site-api-registry.js";

/**
 * `haxcms-site-editor`
 * `haxcms editor element that provides all editing capabilities`
 *
 * @demo demo/index.html
 */

class HAXCMSSiteEditor extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "haxcms-site-editor";
  }

  constructor() {
    super();
    this.__disposer = [];
    this.__lastContentDashboardOperation = "search";
    this.__lastContentSearchQuery = "";
    this.__refreshRetryCounts = {};
    this.__maxRefreshRetries = 2;
    this.method = "POST";
    this.editMode = false;
    this.getUserDataHeaders = {};
    globalThis.SimpleModal.requestAvailability();
    this.__setupDisposers();
  }
  __setupDisposers() {
    if (this.__disposer && this.__disposer.length > 0) {
      return;
    }
    this.__disposer = [];
    this.__disposer.push(
      autorun((reaction) => {
        this.editMode = toJS(store.editMode);
        // force import on editMode enabled
        if (this.editMode && toJS(HAXStore.activeHaxBody)) {
          HAXStore.activeHaxBody.importContent(toJS(store.activeItemContent));
        }
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        this.manifest = toJS(store.manifest);
      }),
    );
    // Sync activeItem directly from store via MobX for proper state management
    this.__disposer.push(
      autorun((reaction) => {
        this.activeItem = toJS(store.activeItem);
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        HAXStore.platformConfig = toJS(store.platformConfig);
      }),
    );
  }
  __disposeDisposers() {
    if (this.__disposer && this.__disposer.length > 0) {
      for (var i in this.__disposer) {
        const disposer = this.__disposer[i];
        if (typeof disposer === "function") {
          disposer();
        } else if (disposer && typeof disposer.dispose === "function") {
          disposer.dispose();
        }
      }
    }
    this.__disposer = [];
  }
  // render function
  render() {
    return html`
      <style>
        haxcms-site-editor {
          display: block;
        }
        haxcms-site-editor[edit-mode] #editbutton {
          width: 100%;
          z-index: 100;
          right: 0;
          bottom: 0;
          border-radius: 0;
          height: 80px;
          margin: 0;
          padding: 8px;
          background-color: lightblue !important;
        }
        h-a-x {
          margin: auto;
          display: none;
        }
        haxcms-site-editor[edit-mode] h-a-x {
          display: block;
        }
      </style>
      <h-a-x
        id="hax"
        element-align="left"
        offset-margin="64px 0 0 0"
        hide-panel-ops="hide-panel-ops"
        hide-toolbar="hide-toolbar"
      ></h-a-x>
    `;
  }

  static get properties() {
    return {
      getUserDataPath: {
        type: String,
        attribute: "get-user-data-path",
      },
      getUserDataHeaders: {
        type: Object,
      },

      /**
       * Allow method to be overridden, useful in local testing
       */
      method: {
        type: String,
      },

      /**
       * JSON Web token, it'll come from a global call if it's available
       */
      jwt: {
        type: String,
      },

      appendTarget: {
        type: Object,
      },
      appElement: {
        type: Object,
      },

      /**
       * appStore object from backend
       */
      appStore: {
        type: Object,
      },

      /**
       * if the node is in an edit state or not
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode",
      },
      /**
       * Active item of the node being worked on, JSON outline schema item format
       */
      activeItem: {
        type: Object,
      },

      /**
       * Outline of items in json outline schema format
       */
      manifest: {
        type: Object,
      },
    };
  }

  __deleteNodeResponseChanged(e) {
    // show message
    if (e.detail.value && e.detail.value.data && e.detail.value.data.title) {
      store.toast(
        `Page deleted ${e.detail.value.data.title}, selecting another page`,
        4000,
      );
      store.playSound("coin");
    }
  }

  __createNodeResponseChanged(e) {
    // sanity check we have a slug, move to this page that we just made
    if (e.detail.value && e.detail.value.data && e.detail.value.data.slug) {
      setTimeout(() => {
        store.playSound("coin");
        const node = e.detail.value.data;
        globalThis.history.pushState({}, null, node.slug);
        globalThis.dispatchEvent(new PopStateEvent("popstate"));
        store.toast(`Created ${node.title}!`, 4000, {
          hat: "random",
        });

        // Auto-enter edit mode if this page was created by a Merlin program
        if (this._merlinCreated) {
          store.editMode = true;
          // Clear the flag
          this._merlinCreated = false;
        }
      }, 900);
    }
  }

  _handleUserDataResponse(e) {
    if (e.detail.response && e.detail.response.data) {
      store.userData = e.detail.response.data;
      this.dispatchEvent(
        new CustomEvent("haxcms-user-data-updated", {
          composed: true,
          bubbles: true,
          cancelable: false,
          detail: e.detail.response.data,
        }),
      );
    }
  }
  _handleContentSearchResponse(e) {
    const response = e.detail && e.detail.response ? e.detail.response : {};
    const responseData =
      response.data && typeof response.data === "object" ? response.data : {};
    const responseOperation =
      typeof responseData.operation === "string"
        ? responseData.operation.toLowerCase().trim()
        : "";
    const operation =
      responseOperation || this.__lastContentDashboardOperation || "search";
    let query = this.__lastContentSearchQuery
      ? String(this.__lastContentSearchQuery)
      : "";
    if (
      responseData &&
      typeof responseData.query === "string"
    ) {
      query = responseData.query;
    }
    if (operation === "replace") {
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-content-dashboard-replace-results", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            operation,
            query,
            data: responseData,
            raw: response,
          },
        }),
      );
      return;
    }
    let results = [];
    if (
      responseData &&
      Array.isArray(responseData.results)
    ) {
      results = responseData.results;
    } else if (
      responseData &&
      Array.isArray(responseData.matches)
    ) {
      results = responseData.matches;
    } else if (Array.isArray(response.matches)) {
      results = response.matches;
    } else if (response.data && Array.isArray(response.data)) {
      results = response.data;
    }
    const matchIds = [];
    results.forEach((result) => {
      if (typeof result === "string") {
        matchIds.push(result);
      } else if (result && typeof result === "object") {
        if (typeof result.id === "string") {
          matchIds.push(result.id);
        } else if (typeof result.id === "number") {
          matchIds.push(String(result.id));
        }
      }
    });
    const uniqueMatchIds = [...new Set(matchIds)];
    if (uniqueMatchIds.length === 0 && Array.isArray(results)) {
      results.forEach((result) => {
        if (typeof result === "string") {
          uniqueMatchIds.push(result);
        }
      });
    }
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-content-dashboard-search-results", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          query,
          matches: uniqueMatchIds,
          results,
          raw: response,
        },
      }),
    );
  }
  _getRefreshRetryKey(target) {
    if (target && target.id) {
      return target.id;
    }
    return "unknown-request";
  }
  _incrementRefreshRetryCount(target) {
    const retryKey = this._getRefreshRetryKey(target);
    if (!this.__refreshRetryCounts[retryKey]) {
      this.__refreshRetryCounts[retryKey] = 0;
    }
    this.__refreshRetryCounts[retryKey] += 1;
    return {
      retryKey,
      retryCount: this.__refreshRetryCounts[retryKey],
    };
  }
  _clearRefreshRetryCount(targetOrKey) {
    let retryKey = targetOrKey;
    if (targetOrKey && typeof targetOrKey === "object") {
      retryKey = this._getRefreshRetryKey(targetOrKey);
    }
    if (this.__refreshRetryCounts[retryKey]) {
      delete this.__refreshRetryCounts[retryKey];
    }
  }
  _clearAllRefreshRetryCounts() {
    this.__refreshRetryCounts = {};
  }
  _resetRefreshRetryCountFromResponse(e) {
    let target = e && e.detail && e.detail.target ? e.detail.target : null;
    if (!target && e && typeof e.composedPath === "function") {
      const path = normalizeEventPath(e);
      target = path && path.length > 0 ? path[0] : null;
    }
    if (target) {
      this._clearRefreshRetryCount(target);
    }
  }
  _responseStatusCode(response) {
    if (!response || typeof response !== "object") {
      return 0;
    }
    if (typeof response.status === "number") {
      return response.status;
    }
    if (typeof response.status === "string") {
      const parsed = parseInt(response.status, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
  _responseStatusText(response, fallbackMessage = "Request failed") {
    if (!response || typeof response !== "object") {
      return fallbackMessage;
    }
    if (
      typeof response.statusText === "string" &&
      response.statusText.trim() !== ""
    ) {
      return response.statusText.trim();
    }
    if (typeof response.message === "string" && response.message.trim() !== "") {
      return response.message.trim();
    }
    if (
      response.data &&
      typeof response.data === "object" &&
      typeof response.data.message === "string" &&
      response.data.message.trim() !== ""
    ) {
      return response.data.message.trim();
    }
    return fallbackMessage;
  }
  _isSuccessfulResponse(response) {
    const status = this._responseStatusCode(response);
    return status === 0 || (status >= 200 && status < 300);
  }
  _siteName() {
    if (
      this.manifest &&
      this.manifest.metadata &&
      this.manifest.metadata.site &&
      this.manifest.metadata.site.name
    ) {
      return String(this.manifest.metadata.site.name);
    }
    return "";
  }
  _buildRequestTarget(
    requestId = "site-request",
    body = {},
    requestExecutor,
    extraHeaders = {},
  ) {
    const defaultHeaders =
      extraHeaders && typeof extraHeaders === "object"
        ? Object.assign({}, extraHeaders)
        : {};
    const target = {
      id: requestId,
      body: body && typeof body === "object" ? body : {},
      headers: defaultHeaders,
    };
    target.generateRequest = async () => {
      target.headers = Object.assign({}, defaultHeaders);
      if (this.jwt) {
        target.headers.Authorization = `Bearer ${this.jwt}`;
      }
      if (typeof requestExecutor === "function") {
        return requestExecutor(target);
      }
      return null;
    };
    return target;
  }
  _emitRequestError(target, status, statusText = "Request failed") {
    this.lastErrorChanged({
      detail: {
        value: {
          status,
          statusText,
        },
        target,
      },
    });
  }
  async _callSiteOperation(operationName, payload, target) {
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      !operationName ||
      !MicroFrontendRegistry ||
      typeof MicroFrontendRegistry.call !== "function" ||
      typeof MicroFrontendRegistry.has !== "function" ||
      !MicroFrontendRegistry.has(operationName)
    ) {
      return {
        unavailable: true,
        response: null,
      };
    }
    try {
      const response = await MicroFrontendRegistry.call(
        operationName,
        payload,
        null,
        null,
      );
      if (this._isSuccessfulResponse(response)) {
        return {
          unavailable: false,
          response,
        };
      }
      const status = this._responseStatusCode(response);
      const statusText = this._responseStatusText(response, "Operation failed");
      this._emitRequestError(target, status, statusText);
      return {
        unavailable: false,
        response: null,
      };
    } catch (error) {
      let status = 500;
      if (error && typeof error.status !== "undefined") {
        const parsed = parseInt(error.status, 10);
        if (!Number.isNaN(parsed)) {
          status = parsed;
        }
      }
      const statusText =
        error && typeof error.message === "string" && error.message.trim() !== ""
          ? error.message.trim()
          : "Operation failed";
      this._emitRequestError(target, status, statusText);
      return {
        unavailable: false,
        response: null,
      };
    }
  }

  async _requestJson({
    requestId = "site-request",
    operationName = "",
    payload = {},
    headers = {},
    unavailableMessage = "",
    onSuccess = null,
  } = {}) {
    const requestTarget = this._buildRequestTarget(
      requestId,
      payload,
      async (target) => {
        let operationResult = {
          unavailable: true,
          response: null,
        };
        if (operationName && typeof operationName === "string") {
          operationResult = await this._callSiteOperation(
            operationName,
            target.body,
            target,
          );
        }
        let response = operationResult.response;
        if (!response) {
          if (operationResult.unavailable && unavailableMessage) {
            store.toast(unavailableMessage, 3000, {
              fire: true,
            });
            store.playSound("error");
          }
          return null;
        }
        this._clearRefreshRetryCount(target);
        if (typeof onSuccess === "function") {
          onSuccess(response, target);
        }
        return response;
      },
      headers,
    );
    return requestTarget.generateRequest();
  }

  /**
   * Handle the last error rolling in
   */
  lastErrorChanged(e) {
    if (e && e.detail && e.detail.value) {
      console.error(e);
      let target = e.detail.target ? e.detail.target : null;
      if (!target && e && typeof e.composedPath === "function") {
        const path = normalizeEventPath(e);
        target = path && path.length > 0 ? path[0] : null;
      }
      // check for JWT needing refreshed vs busted but must be 403
      switch (parseInt(e.detail.value.status, 10)) {
        // cookie data not found, or illegal operation, need to go get it
        // @notice this currently isn't possible but we could modify
        // the backend in the future to support throwing 401s dynamically
        // if we KNOW an event must expire the timing token
        case 405:
        case 401:
          this._clearAllRefreshRetryCounts();
          this.dispatchEvent(
            new CustomEvent("jwt-login-logout", {
              composed: true,
              bubbles: true,
              cancelable: false,
              detail: {
                redirect: true,
              },
            }),
          );
          break;
        case 403:
          const retryMeta = this._incrementRefreshRetryCount(target);
          if (retryMeta.retryCount > this.__maxRefreshRetries) {
            this._clearRefreshRetryCount(retryMeta.retryKey);
            this._clearAllRefreshRetryCounts();
            this.dispatchEvent(
              new CustomEvent("jwt-login-logout", {
                composed: true,
                bubbles: true,
                cancelable: false,
                detail: {
                  redirect: true,
                },
              }),
            );
            return;
          }
          this.dispatchEvent(
            new CustomEvent("jwt-login-refresh-token", {
              composed: true,
              bubbles: true,
              cancelable: false,
              detail: {
                element: {
                  obj: this,
                  callback: "refreshRequest",
                  params: [target, retryMeta.retryKey],
                },
              },
            }),
          );
          break;
        default:
          const statusText =
            e.detail.value.statusText && e.detail.value.statusText !== ""
              ? e.detail.value.statusText
              : "Request failed";
          store.toast(
            e.detail.value.status + " " + statusText,
            5000,
            { fire: true },
          );
          store.playSound("error");
          break;
      }
    }
  }
  /**
   * Attempt to salvage the request that was kicked off
   * when our JWT needed refreshed
   */
  refreshRequest(jwt, element, retryKey = null) {
    // force the jwt to be the updated jwt
    // this helps avoid any possible event timing issue
    if (!jwt) {
      if (retryKey) {
        this._clearRefreshRetryCount(retryKey);
      }
      return;
    }
    this.jwt = jwt;
    const appSettings =
      globalThis.appSettings && typeof globalThis.appSettings === "object"
        ? globalThis.appSettings
        : store && store.appSettings
          ? toJS(store.appSettings)
          : {};
    configureHAXCMSSiteApiRegistry(appSettings, this.jwt);
    if (
      element &&
      element.body &&
      Object.prototype.hasOwnProperty.call(element.body, "jwt")
    ) {
      element.body.jwt = jwt;
    }
    if (element) {
      element.headers = {
        Authorization: `Bearer ${this.jwt}`,
      };
    }
    // again, sanity check on delay
    setTimeout(() => {
      if (element && typeof element.generateRequest === "function") {
        element.generateRequest();
      }
    }, 0);
  }

  loadingChanged(e) {
    this.loading = e.detail.value;
  }
  _ensureBaseDDDVariables() {
    if (!globalThis.document || !globalThis.document.head) {
      return;
    }
    const variableStyles =
      DDDVariables && DDDVariables.cssText ? DDDVariables.cssText : "";
    if (!variableStyles) {
      return;
    }
    if (!globalThis.document.head.querySelector("[data-haxcms-ddd-vars]")) {
      const style = globalThis.document.createElement("style");
      style.setAttribute("data-haxcms-ddd-vars", "");
      style.innerHTML = variableStyles;
      globalThis.document.head.appendChild(style);
    }
  }
  /**
   * Break the shadow root for this element (by design)
   */
  createRenderRoot() {
    return this;
  }
  /**
   * ready life cycle
   */
  firstUpdated(changedProperties) {
    this._ensureBaseDDDVariables();
    if (HAXStore.ready) {
      let detail = {
        detail: true,
      };

      this._storeReadyToGo(detail);
    }
    // fire event suggesting that we were authorized to have a site editor
    // so the UI and other pieces can react to this news
    // this tag is going to be added by a backend if it has determined we have a valid one

    globalThis.dispatchEvent(
      new CustomEvent("haxcms-site-editor-loaded", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    // inject cms styles for uniformity between shadowroot
    const link = globalThis.document.createElement("link");
    link.rel = "stylesheet";
    link.href = new URL("../base.css", import.meta.url).href;
    this.querySelector("#hax")
      .shadowRoot.querySelector("style")
      .parentNode.insertBefore(
        link,
        this.querySelector("#hax").shadowRoot.querySelector("style")
          .nextSibling,
      );
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "appStore") {
        // Passes the location of appstore.json in HAXcms
        const appStoreUrl = JSON.parse(JSON.stringify(this[propName]));

        this.querySelector("#hax").setAttribute(
          "app-store",
          JSON.stringify(appStoreUrl),
        );
      }
      if (propName == "activeItem") {
        this.dispatchEvent(
          new CustomEvent("manifest-changed", {
            detail: this[propName],
          }),
        );

        this._activeItemChanged(this[propName], oldValue);
      } else if (propName == "manifest") {
        this.dispatchEvent(
          new CustomEvent("manifest-changed", {
            detail: this[propName],
          }),
        );

        this._manifestChanged(this[propName], oldValue);
      }
    });
  }
  /**
   * Respond to a failed request to refresh the token by killing the logout process
   */
  _tokenRefreshFailed(e) {
    this._clearAllRefreshRetryCounts();
    this.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: {
          redirect: true,
        },
      }),
    );
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.__disposer || this.__disposer.length === 0) {
      this.__setupDisposers();
    }
    if (this.windowControllers) {
      this.windowControllers.abort();
    }
    this.windowControllers = new AbortController();
    globalThis.addEventListener(
      "jwt-login-refresh-error",
      this._tokenRefreshFailed.bind(this),
      { signal: this.windowControllers.signal },
    );
    this.addEventListener(
      "response",
      this._resetRefreshRetryCountFromResponse.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "hax-store-ready",
      this._storeReadyToGo.bind(this),
      { signal: this.windowControllers.signal },
    );

    // Note: activeItem is now synced via MobX autorun in constructor
    // The json-outline-schema-active-item-changed event is still fired by the store
    // for backward compatibility with external consumers

    globalThis.addEventListener(
      "json-outline-schema-active-body-changed",
      this._bodyChanged.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-save-outline",
      this.saveOutline.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener("haxcms-save-node", this.saveNode.bind(this), {
      signal: this.windowControllers.signal,
    });

    globalThis.addEventListener(
      "haxcms-save-site-data",
      this.saveManifest.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "haxcms-save-seo-data",
      this.saveSEOSettings.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-save-platform-settings",
      this.savePlatformSettings.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "haxcms-save-allowed-blocks",
      this.saveAllowedBlocks.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "haxcms-save-editor-settings",
      this.saveEditorSettings.bind(this),
      { signal: this.windowControllers.signal },
    );
    globalThis.addEventListener(
      "haxcms-save-appearance-settings",
      this.saveAppearanceSettings.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-load-user-data",
      this.loadUserData.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-create-node",
      this.createNode.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );

    globalThis.addEventListener(
      "haxcms-save-node-details",
      this.saveNodeDetails.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.addEventListener(
      "haxcms-load-node-revisions",
      this.loadNodeRevisions.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.addEventListener(
      "haxcms-load-node-revision",
      this.loadNodeRevision.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.addEventListener(
      "haxcms-restore-node-revision",
      this.restoreNodeRevision.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );

    globalThis.addEventListener(
      "haxcms-delete-node",
      this.deleteNode.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.addEventListener(
      "haxcms-content-dashboard-operation",
      this.contentDashboardOperation.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
    globalThis.addEventListener(
      "haxcms-files-dashboard-operation",
      this.filesDashboardOperation.bind(this),
      {
        signal: this.windowControllers.signal,
      },
    );
  }
  disconnectedCallback() {
    if (this.windowControllers) {
      this.windowControllers.abort();
    }
    if (
      this._contentReadyHandler &&
      HAXStore.activeHaxBody &&
      HAXStore.activeHaxBody.removeEventListener
    ) {
      HAXStore.activeHaxBody.removeEventListener(
        "hax-body-content-ready",
        this._contentReadyHandler,
      );
      this._contentReadyHandler = null;
    }
    this.__disposeDisposers();
    super.disconnectedCallback();
  }

  /**
   * Load user data from backend
   */

  loadUserData(e) {
    let userHeaders =
      this.getUserDataHeaders && typeof this.getUserDataHeaders === "object"
        ? { ...this.getUserDataHeaders }
        : {};
    if (Object.keys(userHeaders).length === 0) {
      const appSettings =
        globalThis.appSettings && typeof globalThis.appSettings === "object"
          ? globalThis.appSettings
          : null;
      if (appSettings) {
        if (
          appSettings.getUserDataHeaders &&
          typeof appSettings.getUserDataHeaders === "object"
        ) {
          userHeaders = { ...appSettings.getUserDataHeaders };
        }
        if (
          Object.keys(userHeaders).length === 0 &&
          appSettings.userTokenHeader &&
          appSettings.userToken
        ) {
          const userTokenHeaderName = String(appSettings.userTokenHeader).trim();
          const userTokenHeaderValue = String(appSettings.userToken).trim();
          if (userTokenHeaderName !== "" && userTokenHeaderValue !== "") {
            userHeaders[userTokenHeaderName] = userTokenHeaderValue;
          }
        }
      }
    }
    this._requestJson({
      requestId: "getuserdata",
      headers: userHeaders,
      unavailableMessage: "User data endpoint is not available.",
      onSuccess: (response) => {
        this._handleUserDataResponse({
          detail: {
            response,
          },
        });
      },
    });
  }

  _schemaFormValueChanged(e) {
    let customTag = {
      property: "custom-theme-tag",
      title: "Custom theme tag",
      description: "Tag that supplies the custom theme",
      inputMethod: "textfield",
      required: true,
      validationType: "text",
    }; // @todo figure out why this isn't adding a field in on the fly

    /*if (e.target.value.theme === "haxcms-custom-theme") {
      e.target.addField(customTag.property, customTag);
      e.target.value[customTag.property] = customTag.property;
    } else {
      e.target.removeField(customTag.property);
      delete e.target.value[customTag.property];
    }*/
  }
  /**
   * create node event
   */

  async createNode(e) {
    // Check platform configuration before allowing page creation
    if (!store.platformAllows("addPage")) {
      store.toast("Adding pages is disabled for this site", 3000, {
        fire: true,
      });
      return;
    }

    if (e.detail.values) {
      var reqBody = e.detail.values;
      // ensure site name is set in request
      if (Object.prototype.hasOwnProperty.call(reqBody, "jwt")) {
        delete reqBody.jwt;
      }
      reqBody.site = {
        name: this.manifest.metadata.site.name,
      };
      // store who sent this in-case of multiple instances
      this._originalTarget = e.detail.originalTarget;
      // Store if this was created by a Merlin program for auto-edit enhancement
      this._merlinCreated = reqBody.merlinCreated || false;
      // docxImport use the routine from app-hax
      if (reqBody.docximport) {
        await import(
          "@haxtheweb/file-system-broker/lib/docx-file-system-broker.js"
        ).then(async (e) => {
          // enable core services
          enableServices(["haxcms"]);
          // get the broker for docx selection
          const broker = globalThis.FileSystemBroker.requestAvailability();
          const file = await broker.loadFile("docx");
          // tee up as a form for upload
          const formData = new FormData();
          formData.append("method", reqBody.docximport); // this is a branch or site based importer
          let structure = "course";
          if (
            this.manifest.metadata.build &&
            this.manifest.metadata.structure
          ) {
            structure = this.manifest.metadata.structure;
          }
          formData.append("type", structure);
          formData.append("parentId", reqBody.parent); // optional parent value, if set, this becomes the parent info for top level pages
          formData.append("upload", file);
          this.setProcessingVisual();
          const response = await MicroFrontendRegistry.call(
            "@haxcms/docxToSite",
            formData,
          );
          store.toast("finished!", 300);
          // must be a valid response and have at least SOME html to bother attempting
          if (
            response.status == 200 &&
            response.data &&
            response.data.contents != ""
          ) {
            // @todo right here is where we need to interject our confirmation dialog
            // workflow. We can take the items that just came back and visualize them
            // using our outline / hierarchy visualization
            reqBody.items = response.data.items;
            await import(
              "@haxtheweb/outline-designer/outline-designer.js"
            ).then(async (e) => {
              const outline =
                globalThis.document.createElement("outline-designer");
              outline.items = response.data.items;
              outline.eventData = reqBody;
              outline.storeTools = true;

              const b1 = globalThis.document.createElement("button");
              b1.innerText = "Save";
              b1.classList.add("hax-modal-btn");
              b1.addEventListener("click", async (e) => {
                const data = await outline.getData();
                let deleted = 0;
                let modified = 0;
                let added = 0;
                data.items.map((item) => {
                  if (item.delete) {
                    deleted++;
                  } else if (item.new) {
                    added++;
                  } else if (item.modified) {
                    modified++;
                  }
                });
                let sumChanges = `${
                  added > 0 ? `‣ ${added} new pages will be created\n` : ""
                }${
                  modified > 0 ? `‣ ${modified} pages will be updated\n` : ""
                }${deleted > 0 ? `‣ ${deleted} pages will be deleted\n` : ""}`;
                let confirmation = false;
                // no confirmation required if there are no tracked changes
                if (sumChanges == "") {
                  confirmation = true;
                } else {
                  confirmation = globalThis.confirm(
                    `Saving will commit the following actions:\n${sumChanges}\nAre you sure?`,
                  );
                }
                if (confirmation) {
                  this.setProcessingVisual();
                  this._requestJson({
                    requestId: "createajax",
                    operationName: "@site/createItem",
                    payload: data,
                    unavailableMessage: "Create item endpoint is not available.",
                    onSuccess: (response) => {
                      this.__createNodeResponseChanged({
                        detail: {
                          value: response,
                        },
                      });
                      this._handleCreateResponse({
                        detail: {
                          response,
                        },
                      });
                    },
                  });
                  const evt = new CustomEvent("simple-modal-hide", {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                    detail: {},
                  });
                  globalThis.dispatchEvent(evt);
                }
              });
              const b2 = globalThis.document.createElement("button");
              b2.innerText = "Cancel";
              b2.classList.add("hax-modal-btn");
              b2.classList.add("cancel");
              b2.addEventListener("click", (e) => {
                const evt = new CustomEvent("simple-modal-hide", {
                  bubbles: true,
                  composed: true,
                  cancelable: true,
                  detail: {},
                });
                globalThis.dispatchEvent(evt);
              });
              // button container
              const div = globalThis.document.createElement("div");
              div.classList.add("hax-modal-actions");
              div.appendChild(b2);
              div.appendChild(b1);

              this.dispatchEvent(
                new CustomEvent("simple-modal-show", {
                  bubbles: true,
                  cancelable: true,
                  composed: true,
                  detail: {
                    title: "Confirm structure",
                    titleIcon: "hax:site-map",
                    elements: { content: outline, buttons: div },
                    modal: true,
                    showClose: true,
                    styles: {
                      "--simple-modal-titlebar-background": "black",
                      "--simple-modal-titlebar-color":
                        "var(--ddd-theme-default-white)",
                      "--simple-modal-content-container-background":
                        "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
                      "--simple-modal-width": "80vw",
                      "--simple-modal-max-width": "80vw",
                      "--simple-modal-min-width": "300px",
                      "--simple-modal-z-index": "100000000",
                      "--simple-modal-height": "80vh",
                      "--simple-modal-max-height": "80vh",
                      "--simple-modal-min-height": "400px",
                      "--simple-modal-titlebar-height": "80px",
                      "--simple-modal-content-padding": "var(--ddd-spacing-4)",
                      "--simple-modal-buttons-padding":
                        "0 var(--ddd-spacing-4) var(--ddd-spacing-4)",
                      "--simple-modal-border-radius": "var(--ddd-radius-md)",
                    },
                  },
                }),
              );
            });
          }
        });
      } else {
        this.setProcessingVisual();
        await this._requestJson({
          requestId: "createajax",
          operationName: "@site/createItem",
          payload: reqBody,
          unavailableMessage: "Create item endpoint is not available.",
          onSuccess: (response) => {
            this.__createNodeResponseChanged({
              detail: {
                value: response,
              },
            });
            this._handleCreateResponse({
              detail: {
                response,
              },
            });
          },
        });
        const evt = new CustomEvent("simple-modal-hide", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {},
        });
        globalThis.dispatchEvent(evt);
      }
    }
  }

  _handleCreateResponse(response) {
    setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
      this.dispatchEvent(
        new CustomEvent("haxcms-create-node-success", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: {
            value: true,
            originalTarget: this._originalTarget,
          },
        }),
      );
    }, 300);
  }
  /**
   * delete the node we just got
   */

  deleteNode(e) {
    // Check platform configuration before allowing delete
    if (!store.platformAllows("deletePage")) {
      store.toast("Delete is disabled for this site", 3000, { fire: true });
      return;
    }
    const itemId =
      e && e.detail && e.detail.item && e.detail.item.id
        ? String(e.detail.item.id)
        : "";
    if (!itemId) {
      store.toast("Unable to delete page: missing page id", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    this.setProcessingVisual();
    this._requestJson({
      requestId: "deleteajax",
      operationName: "@site/deleteItem",
      payload: {
        idOrSlug: itemId,
        site: {
          name: this._siteName(),
        },
        node: {
          id: itemId,
        },
      },
      unavailableMessage: "Delete item endpoint is not available.",
      onSuccess: (response) => {
        this.__deleteNodeResponseChanged({
          detail: {
            value: response,
          },
        });
        this._handleDeleteResponse({
          detail: {
            response,
          },
        });
      },
    });
    const evt = new CustomEvent("simple-modal-hide", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {},
    });
    globalThis.dispatchEvent(evt);
  }
  /**
   * node deleted response
   */

  _handleDeleteResponse(response) {
    // this will force ID to update and avoid a page miss
    // when we deleted the node
    globalThis.history.replaceState({}, null, store.fallbackItemSlug());
    globalThis.dispatchEvent(new PopStateEvent("popstate"));
    // delay ensures the fallback has been moved to prior to
    // rebuild of the manifest which should be lacking the deleted ID
    setTimeout(() => {
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
    }, 300);
  }
  /**
   * Establish certain global settings in HAX once it claims to be ready to go
   */

  _storeReadyToGo(event) {
    if (event.detail) {
      HAXStore.connectionRewrites.appendJwt = "jwt";
    }
  }

  /**
   * react to manifest being changed
   */

  _manifestChanged(newValue) {
    if (this.activeItem && newValue.metadata) {
      // set upload manager to point to this location in a more dynamic fashion
      HAXStore.connectionRewrites.appendUploadEndPoint =
        "siteName=" +
        newValue.metadata.site.name +
        "&nodeId=" +
        this.activeItem.id;
    }
  }
  /**
   * active item changed
   */

  _activeItemChanged(newValue, oldValue) {
    if (newValue && this.manifest) {
      // set upload manager to point to this location in a more dynamic fashion
      HAXStore.connectionRewrites.appendUploadEndPoint =
        "siteName=" +
        this.manifest.metadata.site.name +
        "&nodeId=" +
        newValue.id;
    }
  }
  /**
   * handle update responses for nodes and outlines
   */

  _handleNodeResponse(e) {
    // node response may include the item that got updated
    // it also may be a new path so let's ensure that's reflected
    if (
      e.detail.value &&
      e.detail.value.data &&
      e.detail.value.data.slug &&
      this.activeItem.slug !== e.detail.value.data.slug
    ) {
      globalThis.history.replaceState({}, null, e.detail.value.data.slug);
      globalThis.dispatchEvent(new PopStateEvent("popstate"));
    }
    setTimeout(() => {
      store.playSound("coin");
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      ); // updates the node contents itself

      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update-node", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );

      // Restore active element position after DOM update for "keep editing" mode
      if (this._restoreKeepEditMode && this._restoreActiveIndex !== null) {
        // Clean up any existing listener to prevent duplicates
        if (this._contentReadyHandler) {
          HAXStore.activeHaxBody.removeEventListener(
            "hax-body-content-ready",
            this._contentReadyHandler,
          );
        }

        // Wait for hax-body content-ready event instead of arbitrary timeout
        this._contentReadyHandler = () => {
          try {
            if (HAXStore.activeHaxBody && HAXStore.activeHaxBody.children) {
              const bodyChildren = Array.from(HAXStore.activeHaxBody.children);
              // Check if the stored index is still valid
              if (
                this._restoreActiveIndex >= 0 &&
                this._restoreActiveIndex < bodyChildren.length
              ) {
                const elementToRestore = bodyChildren[this._restoreActiveIndex];
                if (elementToRestore) {
                  // Simply set the active node - focus and scroll logic will kick in automatically
                  HAXStore.activeNode = elementToRestore;
                }
              } else if (bodyChildren.length > 0) {
                // Fallback: if index is invalid, activate the last available element
                const fallbackIndex = Math.min(
                  this._restoreActiveIndex,
                  bodyChildren.length - 1,
                );
                const fallbackElement = bodyChildren[fallbackIndex];
                if (fallbackElement) {
                  HAXStore.activeNode = fallbackElement;
                }
              }
            }

            // Force UI component to re-render to update button visibility
            // editMode stayed true, so autorun won't fire - need manual update
            // Use RAF to ensure DOM is settled before requesting update
            requestAnimationFrame(() => {
              const uiElement = globalThis.document.querySelector(
                "haxcms-site-editor-ui",
              );
              if (uiElement) {
                // Force observable to fire by toggling and restoring
                const currentMode = store.editMode;
                store.editMode = false;
                requestAnimationFrame(() => {
                  store.editMode = currentMode;
                });
              }
            });
          } catch (error) {
            console.warn(
              "Failed to restore active element position after save:",
              error,
            );
          }
          // Clean up the restoration flags
          this._restoreActiveIndex = null;
          this._restoreKeepEditMode = false;
          this._contentReadyHandler = null;
        };

        // Listen for content-ready event from hax-body
        if (HAXStore.activeHaxBody) {
          HAXStore.activeHaxBody.addEventListener(
            "hax-body-content-ready",
            this._contentReadyHandler,
            { once: true },
          );
        }
      }

      // force an update in the store to reprocess what is "active"
      // otherwise the page data that was just saved won't be reflected until hitting a different
      // page, causing a temporary state error if going to edit again
      let tmp = store.activeId;
      store.activeId = null;
      store.activeId = tmp;
      store.toast(`Page saved!`, 4000, { hat: "random" });
    }, 300);
  }

  _handleOutlineResponse(e) {
    // trigger a refresh of the data in node
    setTimeout(() => {
      store.playSound("coin");
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
      store.toast(`Outline saved!`, 4000, { hat: "random" });
    }, 300);
  }

  _handleManifestResponse(e) {
    // trigger a refresh of the data in node
    store.playSound("coin");
    this.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    setTimeout(() => {
      globalThis.location.reload();
    }, 300);
  }

  _handlePlatformSettingsResponse(e) {
    // mirror the site manifest save UX
    store.playSound("coin");
    this.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    setTimeout(() => {
      globalThis.location.reload();
    }, 300);
  }
  _handleAllowedBlocksResponse(e) {
    this._handlePlatformSettingsResponse(e);
  }
  _handleEditorSettingsResponse(e) {
    this._handlePlatformSettingsResponse(e);
  }

  _handleAppearanceSettingsResponse(e) {
    // mirror the platform + manifest save UX
    store.playSound("coin");
    this.dispatchEvent(
      new CustomEvent("haxcms-trigger-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: true,
      }),
    );
    setTimeout(() => {
      globalThis.location.reload();
    }, 300);
  }

  _handleNodeDetailsResponse(e) {
    setTimeout(() => {
      store.playSound("coin");
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
      store.toast(`Operation completed!`, 3000, { hat: "construction" });
    }, 300);
  }
  _handleRestoreNodeRevisionResponse(e) {
    const response = e && e.detail ? e.detail.response : null;
    if (!response || !response.data) {
      return;
    }
    setTimeout(() => {
      store.playSound("coin");
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
      this.dispatchEvent(
        new CustomEvent("haxcms-trigger-update-node", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: true,
        }),
      );
      store.toast("Revision restored as a new commit.", 4000, {
        hat: "construction",
      });
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-node-revision-restored", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            source: "backend",
            data: response.data,
            raw: response,
          },
        }),
      );
    }, 300);
  }
  async loadNodeRevisions(e) {
    const detail = e && e.detail ? e.detail : {};
    let nodeId = "";
    if (detail.nodeId) {
      nodeId = String(detail.nodeId);
    } else if (detail.node && detail.node.id) {
      nodeId = String(detail.node.id);
    } else if (this.activeItem && this.activeItem.id) {
      nodeId = String(this.activeItem.id);
    }
    nodeId = nodeId.trim();
    if (!nodeId) {
      return;
    }
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      MicroFrontendRegistry &&
      typeof MicroFrontendRegistry.call === "function" &&
      typeof MicroFrontendRegistry.has === "function" &&
      MicroFrontendRegistry.has("@site/listItemRevisions")
    ) {
      const params = {
        idOrSlug: nodeId,
      };
      if (typeof detail.limit !== "undefined" && detail.limit !== null) {
        params["page.limit"] = String(detail.limit);
      }
      if (typeof detail.offset !== "undefined" && detail.offset !== null) {
        params["page.offset"] = String(detail.offset);
      }
      try {
        const response = await MicroFrontendRegistry.call(
          "@site/listItemRevisions",
          params,
          null,
          null,
        );
        let status = 0;
        if (response && typeof response.status === "number") {
          status = response.status;
        } else if (response && typeof response.status === "string") {
          const parsed = parseInt(response.status, 10);
          status = Number.isNaN(parsed) ? 0 : parsed;
        }
        if (status === 0 || status === 200) {
          const responseData =
            response && response.data && typeof response.data === "object"
              ? response.data
              : null;
          if (responseData) {
            globalThis.dispatchEvent(
              new CustomEvent("haxcms-node-revisions-loaded", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                  source: "backend",
                  data: responseData,
                  raw: response,
                },
              }),
            );
            return;
          }
        }
      } catch (error) {}
    }
  }
  async loadNodeRevision(e) {
    const detail = e && e.detail ? e.detail : {};
    let nodeId = "";
    if (detail.nodeId) {
      nodeId = String(detail.nodeId);
    } else if (detail.node && detail.node.id) {
      nodeId = String(detail.node.id);
    } else if (this.activeItem && this.activeItem.id) {
      nodeId = String(this.activeItem.id);
    }
    nodeId = nodeId.trim();
    const hash = detail.hash ? String(detail.hash).trim() : "";
    if (!nodeId || !hash) {
      return;
    }
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      !MicroFrontendRegistry ||
      typeof MicroFrontendRegistry.call !== "function" ||
      typeof MicroFrontendRegistry.has !== "function" ||
      !MicroFrontendRegistry.has("@site/getItemRevisionById")
    ) {
      return;
    }
    try {
      const response = await MicroFrontendRegistry.call(
        "@site/getItemRevisionById",
        {
          idOrSlug: nodeId,
          revisionId: hash,
        },
        null,
        null,
      );
      let status = 0;
      if (response && typeof response.status === "number") {
        status = response.status;
      } else if (response && typeof response.status === "string") {
        const parsed = parseInt(response.status, 10);
        status = Number.isNaN(parsed) ? 0 : parsed;
      }
      if (
        (status === 0 || status === 200) &&
        response &&
        response.data &&
        typeof response.data === "object"
      ) {
        globalThis.dispatchEvent(
          new CustomEvent("haxcms-node-revision-loaded", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: {
              source: "backend",
              data: response.data,
              raw: response,
            },
          }),
        );
      }
    } catch (error) {}
  }
  async restoreNodeRevision(e) {
    const detail = e && e.detail ? e.detail : {};
    let nodeId = "";
    if (detail.nodeId) {
      nodeId = String(detail.nodeId);
    } else if (detail.node && detail.node.id) {
      nodeId = String(detail.node.id);
    } else if (this.activeItem && this.activeItem.id) {
      nodeId = String(this.activeItem.id);
    }
    nodeId = nodeId.trim();
    const hash = detail.hash ? String(detail.hash).trim() : "";
    if (!nodeId || !hash) {
      return;
    }
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      !MicroFrontendRegistry ||
      typeof MicroFrontendRegistry.call !== "function" ||
      typeof MicroFrontendRegistry.has !== "function" ||
      !MicroFrontendRegistry.has("@site/restoreItemRevision")
    ) {
      return;
    }
    this.setProcessingVisual();
    try {
      const response = await MicroFrontendRegistry.call(
        "@site/restoreItemRevision",
        {
          idOrSlug: nodeId,
          revisionId: hash,
        },
        null,
        null,
      );
      let status = 0;
      if (response && typeof response.status === "number") {
        status = response.status;
      } else if (response && typeof response.status === "string") {
        const parsed = parseInt(response.status, 10);
        status = Number.isNaN(parsed) ? 0 : parsed;
      }
      if (
        (status === 0 || status === 200) &&
        response &&
        response.data &&
        typeof response.data === "object"
      ) {
        this._handleRestoreNodeRevisionResponse({
          detail: {
            response: response,
          },
        });
      }
    } catch (error) {}
  }
  /**
   * Save node event
   */
  async saveNode(e) {
    if (!this.activeItem || !this.activeItem.id || !HAXStore.activeHaxBody) {
      return;
    }
    const siteName = this._siteName();
    if (!siteName) {
      store.toast("Unable to save page: missing site context", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    // Capture active element index before save for "keep editing" mode
    let activeElementIndex = null;
    if (
      e.detail &&
      e.detail.keepEditMode &&
      HAXStore.activeHaxBody &&
      HAXStore.activeNode
    ) {
      const bodyChildren = Array.from(HAXStore.activeHaxBody.children);
      activeElementIndex = bodyChildren.indexOf(HAXStore.activeNode);
      // Store this for restoration after save
      this._restoreActiveIndex = activeElementIndex;
      this._restoreKeepEditMode = true;
    } else {
      this._restoreActiveIndex = null;
      this._restoreKeepEditMode = false;
    }

    // Serialize current DOM content (including page-break) as-is. Entity
    // normalization for attributes like title/description is handled on
    // the backend so we do not clobber freshly edited values here.
    let body = await HAXStore.activeHaxBody.haxToContent();
    const schema = await HAXStore.htmlToHaxElements(body);
    const itemId = String(this.activeItem.id);
    this.setProcessingVisual();
    await this._requestJson({
      requestId: "nodeupdateajax",
      operationName: "@site/updateContentByIdOrSlug",
      payload: {
        idOrSlug: itemId,
        site: {
          name: siteName,
        },
        body,
        schema,
        node: {
          id: itemId,
          body: body,
          schema: schema,
        },
      },
      unavailableMessage: "Page save endpoint is not available.",
      onSuccess: (response) => {
        this._handleNodeResponse({
          detail: {
            value: response,
          },
        });
      },
    });
  }
  /**
   * Save node event
   */

  async saveNodeDetails(e) {
    // Check platform configuration before allowing outline operations
    if (!store.platformAllows("outlineDesigner")) {
      store.toast("Outline operations are disabled for this site", 3000, {
        fire: true,
      });
      return;
    }

    const detail =
      e && e.detail && typeof e.detail === "object" ? e.detail : {};
    const itemId =
      detail && typeof detail.id === "string"
        ? detail.id.trim()
        : detail && detail.id
          ? String(detail.id).trim()
          : detail && typeof detail.idOrSlug === "string"
            ? detail.idOrSlug.trim()
            : detail && detail.idOrSlug
              ? String(detail.idOrSlug).trim()
              : "";
    if (!itemId) {
      store.toast("Unable to complete operation: missing page id", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    const operation =
      detail && typeof detail.operation === "string"
        ? detail.operation.trim()
        : "";
    if (!operation) {
      store.toast("Unable to complete operation: missing operation", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }

    this.setProcessingVisual();
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      !MicroFrontendRegistry ||
      typeof MicroFrontendRegistry.call !== "function" ||
      typeof MicroFrontendRegistry.has !== "function" ||
      !MicroFrontendRegistry.has("@site/updateItem")
    ) {
      store.toast("Item update endpoint is not available.", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    const payload = {
      ...detail,
      idOrSlug: itemId,
    };
    if (Object.prototype.hasOwnProperty.call(payload, "id")) {
      delete payload.id;
    }
    try {
      const response = await MicroFrontendRegistry.call(
        "@site/updateItem",
        payload,
        null,
        null,
      );
      let status = 0;
      if (response && typeof response.status === "number") {
        status = response.status;
      } else if (response && typeof response.status === "string") {
        const parsed = parseInt(response.status, 10);
        status = Number.isNaN(parsed) ? 0 : parsed;
      }
      if (status === 0 || status === 200) {
        this._handleNodeDetailsResponse({
          detail: {
            response: response,
          },
        });
        return;
      }
      const message =
        response && response.message
          ? String(response.message)
          : `Unable to complete operation (${status})`;
      store.toast(message, 4000, { fire: true });
      store.playSound("error");
    } catch (error) {
      store.toast("Unable to complete operation", 4000, { fire: true });
      store.playSound("error");
    }
  }
  /**
   * Save the outline based on an event firing.
   */

  saveOutline(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast("Outline save endpoint is not available.", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    this.setProcessingVisual();
    this._requestJson({
      requestId: "outlineupdateajax",
      operationName: "@site/updateSiteOutline",
      payload: {
        site: {
          name: siteName,
        },
        items: e && e.detail ? e.detail : [],
      },
      unavailableMessage: "Outline save endpoint is not available.",
      onSuccess: (response) => {
        this._handleOutlineResponse({
          detail: {
            response,
          },
        });
      },
    });
  }
  // processing visualization
  setProcessingVisual() {
    let loadingIcon = globalThis.document.createElement("simple-icon-lite");
    loadingIcon.icon = "hax:loading";
    loadingIcon.style.setProperty("--simple-icon-height", "40px");
    loadingIcon.style.setProperty("--simple-icon-width", "40px");
    loadingIcon.style.height = "150px";
    loadingIcon.style.marginLeft = "8px";
    store.toast(`Processing`, 5000, {
      hat: "construction",
      slot: loadingIcon,
    });
  }
  /**
   * Save the outline based on an event firing.
   */

  saveManifest(e) {
    // now let's work on the outline
    let values = e && e.detail ? e.detail : {}; // if we have a cssVariable selected then generate a hexCode off of it
    if (!values || typeof values !== "object") {
      values = {};
    }
    if (!values.manifest || typeof values.manifest !== "object") {
      values.manifest = {};
    }
    const siteName = this._siteName();
    if (!siteName) {
      store.toast("Site save endpoint is not available.", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    // regions translation to simplify submission
    if (values.manifest.theme && values.manifest.theme.regions) {
      Object.keys(values.manifest.theme.regions).forEach((key, index) => {
        if (
          values.manifest.theme.regions[key] &&
          values.manifest.theme.regions[key].length > 0
        ) {
          values.manifest.theme[key] = values.manifest.theme.regions[key].map(
            (item) => (item.node ? item.node : null),
          );
        }
      });
      delete values.manifest.theme.regions;
    }
    if (values.cssVariable) {
      values.hexCode =
        globalThis.SimpleColorsSharedStyles.colors[
          values.cssVariable
            .replace("--simple-colors-default-theme-", "")
            .replace("-7", "")
        ][6];
    } // add in our standard pieces

    values.jwt = this.jwt;

    if (values.site) {
      values.site.name = siteName;
    } else {
      values.site = {
        name: siteName,
      };
    }
    this.setProcessingVisual();
    this._requestJson({
      requestId: "manifestupdateajax",
      operationName: "@site/updateSiteSummary",
      payload: values,
      unavailableMessage: "Site save endpoint is not available.",
      onSuccess: (response) => {
        this._handleManifestResponse({
          detail: {
            response,
          },
        });
      },
    });
  }

  saveSEOSettings(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast("SEO save endpoint is not available.", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    const detail = e && e.detail ? e.detail : {};
    const manifestAuthor =
      this.manifest && this.manifest.metadata && this.manifest.metadata.author
        ? this.manifest.metadata.author
        : {};
    const manifestSite =
      this.manifest && this.manifest.metadata && this.manifest.metadata.site
        ? this.manifest.metadata.site
        : {};
    const manifestSiteSettings =
      manifestSite && manifestSite.settings ? manifestSite.settings : {};
    const normalizeString = (value, fallback = "") =>
      typeof value !== typeof undefined && value !== null
        ? String(value || "")
        : fallback;
    const toBoolValue = (value, defaultValue) => {
      if (
        value === false ||
        value === "false" ||
        value === 0 ||
        value === "0"
      ) {
        return false;
      }
      if (value === true || value === "true" || value === 1 || value === "1") {
        return true;
      }
      return defaultValue;
    };
    const license =
      detail.license && detail.license !== ""
        ? String(detail.license)
        : this.manifest && this.manifest.license
          ? String(this.manifest.license)
          : "by-sa";
    const authorImage = normalizeString(
      detail.authorImage,
      manifestAuthor && manifestAuthor.image
        ? String(manifestAuthor.image)
        : "",
    );
    const authorName = normalizeString(
      detail.authorName,
      manifestAuthor && manifestAuthor.name ? String(manifestAuthor.name) : "",
    );
    const authorEmail = normalizeString(
      detail.authorEmail,
      manifestAuthor && manifestAuthor.email
        ? String(manifestAuthor.email)
        : "",
    );
    const authorSocialLink = normalizeString(
      detail.authorSocialLink,
      manifestAuthor && manifestAuthor.socialLink
        ? String(manifestAuthor.socialLink)
        : "",
    );
    const description = normalizeString(
      detail.description,
      this.manifest && this.manifest.description
        ? String(this.manifest.description)
        : "",
    );
    const logo = normalizeString(
      detail.logo,
      manifestSite && manifestSite.logo ? String(manifestSite.logo) : "",
    );
    const domain = normalizeString(
      detail.domain,
      manifestSite && manifestSite.domain ? String(manifestSite.domain) : "",
    );
    const lang = normalizeString(
      detail.lang,
      manifestSiteSettings && manifestSiteSettings.lang
        ? String(manifestSiteSettings.lang)
        : "",
    );
    const gaID = normalizeString(
      detail.gaID,
      manifestSiteSettings && manifestSiteSettings.gaID
        ? String(manifestSiteSettings.gaID)
        : "",
    );
    const privateSite =
      typeof detail.private !== typeof undefined
        ? toBoolValue(detail.private, false)
        : toBoolValue(
            manifestSiteSettings ? manifestSiteSettings.private : undefined,
            false,
          );
    const canonical =
      typeof detail.canonical !== typeof undefined
        ? toBoolValue(detail.canonical, true)
        : toBoolValue(
            manifestSiteSettings ? manifestSiteSettings.canonical : undefined,
            true,
          );
    const pathauto =
      typeof detail.pathauto !== typeof undefined
        ? toBoolValue(detail.pathauto, true)
        : toBoolValue(
            manifestSiteSettings ? manifestSiteSettings.pathauto : undefined,
            true,
          );
    const publishPagesOn =
      typeof detail.publishPagesOn !== typeof undefined
        ? toBoolValue(detail.publishPagesOn, true)
        : toBoolValue(
            manifestSiteSettings
              ? manifestSiteSettings.publishPagesOn
              : undefined,
            true,
          );
    const seoValues = {
      description,
      logo,
      domain,
      lang,
      gaID,
      private: privateSite,
      canonical,
      pathauto,
      publishPagesOn,
    };
    const payload = {
      site: {
        name: siteName,
      },
      seo: seoValues,
      author: {
        license: license,
        image: authorImage,
        name: authorName,
        email: authorEmail,
        socialLink: authorSocialLink,
      },
      manifest: {
        author: {
          "manifest.license": license,
          "manifest.metadata.author.image": authorImage,
          "manifest.metadata.author.name": authorName,
          "manifest.metadata.author.email": authorEmail,
          "manifest.metadata.author.socialLink": authorSocialLink,
        },
        seo: {
          "manifest.description": description,
          "manifest.metadata.site.logo": logo,
          "manifest.metadata.site.domain": domain,
          "manifest.metadata.site.settings.lang": lang,
          "manifest.metadata.site.settings.gaID": gaID,
          "manifest.metadata.site.settings.private": privateSite,
          "manifest.metadata.site.settings.canonical": canonical,
          "manifest.metadata.site.settings.pathauto": pathauto,
          "manifest.metadata.site.settings.publishPagesOn": publishPagesOn,
        },
      },
    };
    this.setProcessingVisual();
    this._requestJson({
      requestId: "seoupdateajax",
      operationName: "@site/updateSiteSeo",
      payload,
      unavailableMessage: "SEO save endpoint is not available.",
      onSuccess: (response) => {
        this._handleManifestResponse({
          detail: {
            response,
          },
        });
      },
    });
  }

  saveAppearanceSettings(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast("Appearance save endpoint is not available.", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    let values = e && e.detail ? JSON.parse(JSON.stringify(e.detail)) : {};
    if (!values.manifest) {
      values.manifest = {};
    }
    if (!values.manifest.theme) {
      values.manifest.theme = {};
    }
    // regions translation to simplify submission
    if (values.manifest.theme && values.manifest.theme.regions) {
      Object.keys(values.manifest.theme.regions).forEach((key) => {
        if (Array.isArray(values.manifest.theme.regions[key])) {
          values.manifest.theme[key] = values.manifest.theme.regions[key].map(
            (item) => (item.node ? item.node : null),
          );
        }
      });
      delete values.manifest.theme.regions;
    }
    values.jwt = this.jwt;
    if (values.site) {
      values.site.name = siteName;
    } else {
      values.site = {
        name: siteName,
      };
    }
    this.setProcessingVisual();
    this._requestJson({
      requestId: "appearancesettingsajax",
      operationName: "@site/updateSiteAppearance",
      payload: values,
      unavailableMessage: "Appearance save endpoint is not available.",
      onSuccess: (response) => {
        this._handleAppearanceSettingsResponse({
          detail: {
            response,
          },
        });
      },
    });
  }

  savePlatformSettings(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast("Platform settings save endpoint is not available.", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    this.setProcessingVisual();
    this._requestJson({
      requestId: "platformsettingsajax",
      operationName: "@site/updateSitePlatform",
      payload: {
        site: {
          name: siteName,
        },
        platform: e && e.detail ? e.detail : {},
      },
      unavailableMessage: "Platform settings save endpoint is not available.",
      onSuccess: (response) => {
        this._handlePlatformSettingsResponse({
          detail: {
            response,
          },
        });
      },
    });
  }
  saveEditorSettings(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast("Editor settings save endpoint is not available.", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    const detail = e && e.detail ? JSON.parse(JSON.stringify(e.detail)) : {};
    const audience = detail && detail.audience ? String(detail.audience) : "";
    if (audience !== "novice" && audience !== "expert") {
      store.toast("Editor settings are invalid.", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    this.setProcessingVisual();
    this._requestJson({
      requestId: "editorsettingsajax",
      operationName: "@site/updateSiteEditorSettings",
      payload: {
        site: {
          name: siteName,
        },
        platform: {
          audience: audience,
        },
      },
      unavailableMessage: "Editor settings save endpoint is not available.",
      onSuccess: (response) => {
        this._handleEditorSettingsResponse({
          detail: {
            response,
          },
        });
      },
    });
  }
  saveAllowedBlocks(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast("Blocks save endpoint is not available.", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    const detail = e && e.detail ? JSON.parse(JSON.stringify(e.detail)) : {};
    const allowedBlocksDefined = detail.allowedBlocksDefined === true;
    const allowedBlocksValue = Object.prototype.hasOwnProperty.call(
      detail,
      "allowedBlocks",
    )
      ? detail.allowedBlocks
      : [];
    const platform = {};
    if (allowedBlocksDefined) {
      if (allowedBlocksValue === null) {
        platform.allowedBlocks = null;
      } else if (Array.isArray(allowedBlocksValue)) {
        platform.allowedBlocks =
          allowedBlocksValue.length === 0 ? null : allowedBlocksValue;
      } else {
        platform.allowedBlocks = null;
      }
    } else {
      platform.allowedBlocks = [];
    }
    this.setProcessingVisual();
    this._requestJson({
      requestId: "allowedblocksajax",
      operationName: "@site/updateSiteAllowedBlocks",
      payload: {
        site: {
          name: siteName,
        },
        platform: platform,
      },
      unavailableMessage: "Blocks save endpoint is not available.",
      onSuccess: (response) => {
        this._handleAllowedBlocksResponse({
          detail: {
            response,
          },
        });
      },
    });
  }
  /**
   * Notice body of content has changed and import into HAX
   */
  _bodyChanged(e) {
    if (HAXStore.activeHaxBody) {
      HAXStore.activeHaxBody.importContent(e.detail);
    }
  }
  async contentDashboardOperation(e) {
    if (!e.detail || !e.detail.operation) {
      return;
    }
    const operation = e.detail.operation;
    const ids = Array.isArray(e.detail.itemIds) ? e.detail.itemIds : [];
    if (operation === "publish" || operation === "unpublish") {
      const published = operation === "publish";
      ids.forEach((id) => {
        this.saveNodeDetails({
          detail: {
            id,
            operation: "setPublished",
            published,
          },
        });
      });
      return;
    }
    if (operation === "delete") {
      ids.forEach((id) => {
        const item = store.findItem(id);
        if (item) {
          this.deleteNode({
            detail: {
              item,
            },
          });
        }
      });
      return;
    }
    if (operation === "search" || operation === "replace") {
      const searchValue =
        e.detail &&
        typeof e.detail.search === "string" &&
        e.detail.search.trim() !== ""
          ? String(e.detail.search).trim()
          : "";
      if (!searchValue) {
        return;
      }
      this.__lastContentDashboardOperation = operation;
      this.__lastContentSearchQuery = searchValue;
      const body = {
        operation: operation,
        search: searchValue,
      };
      const siteName = this._siteName();
      if (siteName !== "") {
        body.site = {
          name: siteName,
        };
      }
      if (operation === "replace") {
        body.searchMode = "fulltext";
        body.searchSelector = false;
        body.searchField = "content";
        body.replace =
          e.detail && typeof e.detail.replace === "string"
            ? e.detail.replace
            : "";
        if (e.detail && e.detail.replaceConfirm === true) {
          body.replaceConfirm = true;
        }
        if (e.detail && e.detail.replaceDestroyConfirm === true) {
          body.replaceDestroyConfirm = true;
        }
        if (e.detail && e.detail.searchCaseSensitive === true) {
          body.searchCaseSensitive = true;
        }
      } else {
        if (
          e.detail &&
          typeof e.detail.searchField === "string" &&
          e.detail.searchField.trim() !== ""
        ) {
          body.searchField = e.detail.searchField.trim();
        }
        const requestedSearchMode =
          e.detail &&
          typeof e.detail.searchMode === "string" &&
          e.detail.searchMode.trim() !== ""
            ? e.detail.searchMode.trim().toLowerCase()
            : "";
        const selectorMode =
          (e.detail &&
            (e.detail.searchSelector === true ||
              e.detail.searchSelector === "true" ||
              e.detail.searchSelector === 1 ||
              e.detail.searchSelector === "1")) ||
          requestedSearchMode === "selector";
        body.searchSelector = selectorMode;
        if (selectorMode) {
          body.searchMode = "selector";
          body.searchField = "content";
        } else if (requestedSearchMode) {
          body.searchMode = requestedSearchMode;
        }
        if (e.detail && e.detail.searchCaseSensitive === true) {
          body.searchCaseSensitive = true;
        }
        if (
          e.detail &&
          typeof e.detail.searchLimit !== "undefined" &&
          e.detail.searchLimit !== null &&
          e.detail.searchLimit !== ""
        ) {
          const searchLimit = parseInt(e.detail.searchLimit, 10);
          if (!isNaN(searchLimit)) {
            body.searchLimit = searchLimit;
          }
        }
      }
      let response = null;
      if (operation === "replace") {
        response = await this._requestJson({
          requestId: "contentsearchajax",
          operationName: "@site/replaceContent",
          payload: body,
          unavailableMessage: "Content replace endpoint is not available.",
          onSuccess: (responseData) => {
            this._handleContentSearchResponse({
              detail: {
                response: responseData,
              },
            });
          },
        });
      } else {
        const searchPayload = {
          q: searchValue,
        };
        if (
          e.detail &&
          typeof e.detail.searchField === "string" &&
          e.detail.searchField.trim() !== ""
        ) {
          const searchField = e.detail.searchField.trim();
          if (searchField !== "all") {
            searchPayload.fields = searchField;
          }
        }
        if (body.searchMode === "selector") {
          searchPayload.fields = "content";
        }
        if (
          typeof body.searchLimit === "number" &&
          !Number.isNaN(body.searchLimit) &&
          body.searchLimit > 0
        ) {
          searchPayload["page.limit"] = body.searchLimit;
        }
        response = await this._requestJson({
          requestId: "contentsearchajax",
          operationName: "@site/searchContent",
          payload: searchPayload,
          unavailableMessage: "Content search endpoint is not available.",
          onSuccess: (responseData) => {
            this._handleContentSearchResponse({
              detail: {
                response: responseData,
              },
            });
          },
        });
      }
      if (response) {
        return;
      }
      globalThis.dispatchEvent(
        new CustomEvent(
          operation === "replace"
            ? "haxcms-content-dashboard-replace"
            : "haxcms-content-dashboard-search",
          {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: e.detail,
          },
        ),
      );
    }
  }
  filesDashboardOperation(e) {
    if (!e.detail || !e.detail.operation) {
      return;
    }
    if (e.detail.operation === "upload") {
      store.toast("Use the existing upload workflow to process files.", 3000, {
        hat: "construction",
      });
      return;
    }
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-files-dashboard-operation-request", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: e.detail,
      }),
    );
  }
}

globalThis.customElements.define(HAXCMSSiteEditor.tag, HAXCMSSiteEditor);
export { HAXCMSSiteEditor };
