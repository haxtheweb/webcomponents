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
    // recovered-edit snapshot (sessionStorage safety net) once restored
    this.__pendingRestore = null;
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
        const _mobx_val_0 = toJS(store.editMode);
        const _mobx_val_1 = toJS(HAXStore.activeHaxBody);
        const _mobx_val_2 = toJS(store.activeItemContent);
        Promise.resolve().then(() => {
          this.editMode = _mobx_val_0;
          // force import on editMode enabled
          if (this.editMode && _mobx_val_1) {
            HAXStore.activeHaxBody.importContent(_mobx_val_2);
            // if we recovered unsaved edits from a prior session, apply them
            // after the saved content has been imported into the body
            if (this.__pendingRestore) {
              setTimeout(() => this._applyPendingRestoreIfMatch(), 0);
            }
          }
        });
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.manifest);
        Promise.resolve().then(() => {
          this.manifest = _mobx_val_0;
        });
      }),
    );
    // Sync activeItem directly from store via MobX for proper state management
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.activeItem);
        Promise.resolve().then(() => {
          this.activeItem = _mobx_val_0;
        });
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.platformConfig);
        Promise.resolve().then(() => {
          HAXStore.platformConfig = _mobx_val_0;
        });
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

        // Auto-enter edit mode if this page was created by a Merlin program.
        // Wait until the store has actually adopted the new page as the
        // active item before flipping editMode on; otherwise the editMode
        // autorun imports the previous page's content into the HAX body and
        // the eventual save writes to the duplication source instead of the
        // new page. See haxtheweb/issues#938.
        if (this._merlinCreated) {
          this._autoEnterEditModeForCreatedNode(node);
        }
      }, 900);
    }
  }
  /**
   * Wait until the store has adopted the just-created page as the active
   * item AND its content (with the correct <page-break item-id>) has loaded
   * before entering edit mode. Replaces a fixed-time delay that raced with
   * the manifest refresh + router re-resolve + page-content fetch.
   *
   * Why the page-break id check: the HAX body is saved by serializing its
   * children, the first of which is <page-break item-id="X">. The backend
   * saveNode resolves the target page from that item-id, OVERRIDING the
   * payload node.id. If editMode engages while store.activeItemContent still
   * holds the PREVIOUS page's content (whose page-break points at the
   * duplication source / parent), the body inherits the wrong item-id and
   * the save silently writes to the wrong page, then redirects to that
   * page's slug. Verifying the content's page-break matches the new node
   * before engaging edit mode closes the race for both duplicate and child
   * creates.
   *
   * A self-disposing autorun fires once activeItem.id and the content's
   * page-break item-id both match the new node. A safety timeout bails out
   * (leaving edit to the user) if the store never catches up, rather than
   * risk editing the wrong page.
   */
  _autoEnterEditModeForCreatedNode(node) {
    if (!node || !node.id) {
      this._merlinCreated = false;
      return;
    }
    // tear down any prior pending auto-edit reaction so repeated page
    // creations don't stack reactions against different nodes
    if (this.__autoEditDisposer) {
      this.__autoEditDisposer();
      this.__autoEditDisposer = null;
    }
    if (this.__autoEditSafetyTimer) {
      clearTimeout(this.__autoEditSafetyTimer);
      this.__autoEditSafetyTimer = null;
    }
    const targetId = String(node.id);
    const finish = () => {
      store.editMode = true;
      this._merlinCreated = false;
      if (this.__autoEditDisposer) {
        this.__autoEditDisposer();
        this.__autoEditDisposer = null;
      }
      if (this.__autoEditSafetyTimer) {
        clearTimeout(this.__autoEditSafetyTimer);
        this.__autoEditSafetyTimer = null;
      }
    };
    // fire once the store has adopted the new page as active AND the
    // content loaded for it (page-break item-id matches). Checking the
    // page-break id — not just "content non-empty" — is what prevents
    // importing the previous page's content (and its page-break) into
    // the HAX body, which would route the save to the wrong page.
    this.__autoEditDisposer = autorun(() => {
      const activeItem = toJS(store.activeItem);
      const content = toJS(store.activeItemContent);
      if (
        activeItem &&
        String(activeItem.id) === targetId &&
        this._extractPageBreakItemId(content) === targetId
      ) {
        finish();
      }
    });
    // safety net: if the store hasn't adopted the new page + content in
    // time, abandon auto-edit rather than risk editing the wrong page.
    // The user can open the new page and edit manually.
    this.__autoEditSafetyTimer = setTimeout(() => {
      if (!this.__autoEditDisposer) {
        return;
      }
      this._merlinCreated = false;
      this.__autoEditDisposer();
      this.__autoEditDisposer = null;
      store.toast(
        `Created ${node.title || "page"} — open it to edit`,
        4000,
        { hat: "random" },
      );
    }, 10000);
  }
  /**
   * Extract the item-id from the first <page-break> in an HTML content
   * string. Used by _autoEnterEditModeForCreatedNode to verify the loaded
   * content actually belongs to the just-created page before editing.
   * Returns null if there's no page-break or no item-id.
   */
  _extractPageBreakItemId(content) {
    if (typeof content !== "string" || content === "") {
      return null;
    }
    const match = content.match(
      /<page-break[^>]*?\sitem-id=["']([^"']+)["']/i,
    );
    return match ? String(match[1]) : null;
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
    if (responseData && typeof responseData.query === "string") {
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
    if (responseData && Array.isArray(responseData.results)) {
      results = responseData.results;
    } else if (responseData && Array.isArray(responseData.matches)) {
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
    if (
      typeof response.message === "string" &&
      response.message.trim() !== ""
    ) {
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
        error &&
        typeof error.message === "string" &&
        error.message.trim() !== ""
          ? error.message.trim()
          : "Operation failed";
      this._emitRequestError(target, status, statusText);
      return {
        unavailable: false,
        response: null,
      };
    }
  }
  _normalizeEndpointTarget(endpoint = "") {
    const normalizedEndpoint =
      typeof endpoint === "string" ? endpoint.trim() : "";
    if (normalizedEndpoint === "") {
      return "";
    }
    if (
      normalizedEndpoint.indexOf("http://") === 0 ||
      normalizedEndpoint.indexOf("https://") === 0 ||
      normalizedEndpoint.charAt(0) === "/"
    ) {
      return normalizedEndpoint;
    }
    return `/${normalizedEndpoint}`;
  }

  _normalizeRequestMethod(method = "") {
    const normalizedMethod =
      typeof method === "string" ? method.trim().toUpperCase() : "";
    if (normalizedMethod !== "") {
      return normalizedMethod;
    }
    if (this.method && typeof this.method === "string") {
      const defaultMethod = this.method.trim().toUpperCase();
      if (defaultMethod !== "") {
        return defaultMethod;
      }
    }
    return "POST";
  }

  async _callEndpointRequest(
    endpoint = "",
    payload = {},
    target = null,
    method = "",
  ) {
    const requestTarget = this._normalizeEndpointTarget(endpoint);
    if (requestTarget === "") {
      return {
        unavailable: true,
        response: null,
      };
    }
    const requestPayload =
      payload && typeof payload === "object" && !Array.isArray(payload)
        ? payload
        : {};
    const requestMethod = this._normalizeRequestMethod(method);
    const requestHeaders =
      target && target.headers && typeof target.headers === "object"
        ? Object.assign({}, target.headers)
        : {};
    let requestUrl = requestTarget;
    const requestOptions = {
      method: requestMethod,
      headers: requestHeaders,
      credentials: "include",
    };
    if (requestMethod === "GET" || requestMethod === "HEAD") {
      const searchParams = new URLSearchParams();
      const payloadKeys = Object.keys(requestPayload);
      for (let i = 0; i < payloadKeys.length; i++) {
        const key = payloadKeys[i];
        const value = requestPayload[key];
        if (
          typeof value === "undefined" ||
          value === null ||
          typeof value === "object"
        ) {
          continue;
        }
        searchParams.append(key, `${value}`);
      }
      const queryString = searchParams.toString();
      if (queryString !== "") {
        requestUrl += requestUrl.indexOf("?") === -1 ? "?" : "&";
        requestUrl += queryString;
      }
    } else {
      if (
        !Object.prototype.hasOwnProperty.call(
          requestOptions.headers,
          "Content-Type",
        )
      ) {
        requestOptions.headers["Content-Type"] = "application/json";
      }
      requestOptions.body = JSON.stringify(requestPayload);
    }
    try {
      const response = await fetch(requestUrl, requestOptions);
      const responseText = await response.text();
      let responseData = null;
      if (responseText && responseText.trim() !== "") {
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {}
      }
      const normalizedResponse =
        responseData && typeof responseData === "object"
          ? Object.assign({}, responseData)
          : {};
      if (typeof normalizedResponse.status === "undefined") {
        normalizedResponse.status = response.status;
      }
      if (
        typeof normalizedResponse.statusText === "undefined" &&
        typeof response.statusText === "string" &&
        response.statusText.trim() !== ""
      ) {
        normalizedResponse.statusText = response.statusText;
      }
      if (this._isSuccessfulResponse(normalizedResponse)) {
        return {
          unavailable: false,
          response: normalizedResponse,
        };
      }
      const status = this._responseStatusCode(normalizedResponse);
      const statusText = this._responseStatusText(
        normalizedResponse,
        "Operation failed",
      );
      this._emitRequestError(target, status || response.status, statusText);
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
        error &&
        typeof error.message === "string" &&
        error.message.trim() !== ""
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
    endpoint = "",
    method = "",
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
        const normalizedOperationName =
          operationName && typeof operationName === "string"
            ? operationName.trim()
            : "";
        if (normalizedOperationName !== "") {
          operationResult = await this._callSiteOperation(
            normalizedOperationName,
            target.body,
            target,
          );
        }
        if (
          !operationResult.response &&
          operationResult.unavailable === true &&
          endpoint &&
          typeof endpoint === "string"
        ) {
          operationResult = await this._callEndpointRequest(
            endpoint,
            target.body,
            target,
            method,
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
      // Expired/invalid JWT OR forbidden. The Site API returns 401 for an
      // expired bearer while the System API returns 403; treat both as
      // "try to refresh first" when we still have a jwt, and only log out
      // when the refresh retry cap is exceeded or there are no credentials
      // to refresh in the first place.
      switch (parseInt(e.detail.value.status, 10)) {
        case 401:
        case 405:
        case 403: {
          // no credentials at all -> genuine logged-out state
          if (!this.jwt || this.jwt === "" || this.jwt === "null") {
            this._clearAllRefreshRetryCounts();
            this._snapshotPendingEditForLogout();
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
          const retryMeta = this._incrementRefreshRetryCount(target);
          if (retryMeta.retryCount > this.__maxRefreshRetries) {
            this._clearRefreshRetryCount(retryMeta.retryKey);
            this._clearAllRefreshRetryCounts();
            this._snapshotPendingEditForLogout();
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
        }
        default:
          const statusText =
            e.detail.value.statusText && e.detail.value.statusText !== ""
              ? e.detail.value.statusText
              : "Request failed";
          store.toast(e.detail.value.status + " " + statusText, 5000, {
            fire: true,
          });
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
      // refresh returned no usable jwt (malformed success). The reactive
      // refresh-failure path (_tokenRefreshFailed) handles the normal case;
      // toast here too so this rare path isn't a silent kick to the homepage.
      try {
        store.toast("Session expired, please log in again", 4000, {
          fire: true,
        });
      } catch (e) {}
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
  // Phase 6 (L2 documentation): refresh-token family revocation on logout
  // (implemented in both backends via revokeRefreshSession) is the primary L2
  // fix. A refresh token exfiltrated before logout is invalidated server-side
  // when the user logs out. Access JWTs remain valid until their 15-minute exp
  // and are NOT revoked server-side; revoking those would require access-token
  // jti denylisting, which is not recommended unless the threat model changes.
  _tokenRefreshFailed(e) {
    this._clearAllRefreshRetryCounts();
    // only message + snapshot when we actually had a session to lose,
    // so a login failure (no jwt) doesn't toast "session expired"
    if (this.jwt && this.jwt !== "" && this.jwt !== "null") {
      try {
        store.toast("Session expired, please log in again", 4000, {
          fire: true,
        });
      } catch (ex) {}
      this._snapshotPendingEditForLogout();
    }
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
    globalThis.addEventListener(
      "haxcms-normalize-slugs",
      this.normalizeSlugs.bind(this),
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
    if (this.__autoEditDisposer) {
      this.__autoEditDisposer();
      this.__autoEditDisposer = null;
    }
    if (this.__autoEditSafetyTimer) {
      clearTimeout(this.__autoEditSafetyTimer);
      this.__autoEditSafetyTimer = null;
    }
    this.__disposeDisposers();
    super.disconnectedCallback();
  }

  /**
   * Load user data from backend
   */

  loadUserData(e) {
    const appSettings =
      globalThis.appSettings && typeof globalThis.appSettings === "object"
        ? globalThis.appSettings
        : null;
    let userHeaders =
      this.getUserDataHeaders && typeof this.getUserDataHeaders === "object"
        ? { ...this.getUserDataHeaders }
        : {};
    if (Object.keys(userHeaders).length === 0) {
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
          const userTokenHeaderName = String(
            appSettings.userTokenHeader,
          ).trim();
          const userTokenHeaderValue = String(appSettings.userToken).trim();
          if (userTokenHeaderName !== "" && userTokenHeaderValue !== "") {
            userHeaders[userTokenHeaderName] = userTokenHeaderValue;
          }
        }
      }
    }
    const userDataEndpoint =
      typeof this.getUserDataPath === "string" &&
      this.getUserDataPath.trim() !== ""
        ? this.getUserDataPath.trim()
        : appSettings &&
            typeof appSettings.getUserDataPath === "string" &&
            appSettings.getUserDataPath.trim() !== ""
          ? appSettings.getUserDataPath.trim()
          : "";
    this._requestJson({
      requestId: "getuserdata",
      operationName: "@system/sessionUserGet",
      endpoint: userDataEndpoint,
      method: "GET",
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
            "@system/importDocx",
            formData,
          );
          store.toast("finished!", 300);
          if (
            response.status === 200 &&
            response.data &&
            response.data.items &&
            response.data.items.length > 0
          ) {
            globalThis.dispatchEvent(
              new CustomEvent("haxcms-docx-import-items", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                  items: response.data.items,
                  parentId: reqBody.parent,
                },
              }),
            );
          } else {
            store.toast("Invalid response from DOCX import.", 4000, {
              hat: "construction",
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
    if (event && event.detail) {
      // JWT is now transmitted exclusively via Authorization header
    }
    // offer to restore any unsaved edits recovered from a prior session
    this._offerPendingEditRestore();
  }
  /**
   * Snapshot the in-memory HAX body into sessionStorage so that a hard
   * logout redirect (real auth failure) doesn't silently destroy the edits
   * the user was working on. Best-effort; only when actively editing.
   */
  _snapshotPendingEditForLogout() {
    try {
      if (!this.editMode) {
        return;
      }
      const activeItem = toJS(store.activeItem);
      if (!activeItem || !activeItem.id) {
        return;
      }
      const body = HAXStore.activeHaxBody;
      if (!body) {
        return;
      }
      const content = body.innerHTML;
      if (!content || content.trim() === "") {
        return;
      }
      const snapshot = {
        itemId: String(activeItem.id),
        slug: activeItem.slug || "",
        title: activeItem.title || "",
        content: content,
        savedAt: Date.now(),
      };
      globalThis.sessionStorage.setItem(
        "haxcms-pending-edit",
        JSON.stringify(snapshot),
      );
    } catch (e) {}
  }
  /**
   * On editor startup, look for a recovered-edit snapshot and notify the
   * user. The snapshot is applied automatically when they enter edit mode
   * on the matching page (see the editMode autorun + _applyPendingRestoreIfMatch).
   */
  _offerPendingEditRestore() {
    try {
      const snapRaw = globalThis.sessionStorage.getItem("haxcms-pending-edit");
      if (!snapRaw) {
        return;
      }
      const snapshot = JSON.parse(snapRaw);
      if (!snapshot || !snapshot.itemId || !snapshot.content) {
        globalThis.sessionStorage.removeItem("haxcms-pending-edit");
        return;
      }
      // Phase 4 (L1): enforce a retention TTL so stale snapshots from a
      // long-closed session are not offered indefinitely. Default 30 minutes.
      var maxAgeMs = 30 * 60 * 1000;
      if (
        typeof snapshot.savedAt === "number" &&
        Date.now() - snapshot.savedAt > maxAgeMs
      ) {
        globalThis.sessionStorage.removeItem("haxcms-pending-edit");
        return;
      }
      this.__pendingRestore = snapshot;
      const title = snapshot.title || "a previous page";
      store.toast(
        `Recovered unsaved edits to ${title}. Open that page and select Edit to restore them.`,
        6000,
        { fire: true, hat: "save" },
      );
    } catch (e) {}
  }
  /**
   * Apply a recovered-edit snapshot when the user is editing the page it
   * belonged to. Called after the saved content is imported into the body.
   */
  _applyPendingRestoreIfMatch() {
    if (!this.__pendingRestore) {
      return;
    }
    const snapshot = this.__pendingRestore;
    const activeItem = toJS(store.activeItem);
    if (!activeItem || !activeItem.id) {
      return;
    }
    if (String(activeItem.id) !== String(snapshot.itemId)) {
      return;
    }
    if (!this.editMode || !HAXStore.activeHaxBody) {
      return;
    }
    HAXStore.activeHaxBody.importContent(snapshot.content);
    this.__pendingRestore = null;
    try {
      globalThis.sessionStorage.removeItem("haxcms-pending-edit");
    } catch (e) {}
    try {
      const title = snapshot.title || "this page";
      store.toast(`Restored unsaved edits to ${title}`, 4000, {
        fire: true,
        hat: "save",
      });
    } catch (e) {}
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
      // Also expose the active node id directly so hax-upload-field can
      // retarget local HAXcms uploads to POST /x/api/v1/files and send
      // nodeId as a multipart form field (v1 createFile) instead of as a
      // legacy query param. appendUploadEndPoint is kept because the media
      // browser browse path (hax-app-search) still reads it.
      HAXStore.connectionRewrites.uploadNodeId = String(this.activeItem.id);
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
      // Mirror the active node id for the v1 upload retarget (see
      // _manifestChanged for the rationale).
      HAXStore.connectionRewrites.uploadNodeId = String(newValue.id);
    }
  }
  /**
   * handle update responses for nodes and outlines
   */

  _handleNodeResponse(e) {
    // node response may include the item that got updated
    // it also may be a new path so let's ensure that's reflected
    const nodeResponse =
      e && e.detail && e.detail.value ? e.detail.value : null;
    const nodeData =
      nodeResponse && nodeResponse.data ? nodeResponse.data : null;
    if (
      nodeData &&
      nodeData.slug &&
      this.activeItem &&
      this.activeItem.slug !== nodeData.slug
    ) {
      globalThis.history.replaceState({}, null, nodeData.slug);
      globalThis.dispatchEvent(new PopStateEvent("popstate"));
    }
    // Patch the local manifest item from the server response so the editor
    // reflects the change immediately (slug/title/metadata.overridePathauto)
    // without waiting for the manifest reload. Without this, a second save
    // within the same second resubmits stale slug/override state (the
    // _timeStamp cache-buster doesn't change in-window, so loadJOSData is
    // skipped), which clobbers a just-set override or reverts a custom slug.
    if (nodeData && nodeData.id) {
      const item = store.findItem(nodeData.id);
      if (item) {
        if (typeof nodeData.title === "string") {
          item.title = nodeData.title;
        }
        if (typeof nodeData.slug === "string") {
          item.slug = nodeData.slug;
        }
        if (typeof nodeData.description === "string") {
          item.description = nodeData.description;
        }
        if (nodeData.metadata && typeof nodeData.metadata === "object") {
          if (!item.metadata || typeof item.metadata !== "object") {
            item.metadata = {};
          }
          // content saves set or clear these metadata fields; mirror the
          // server state locally so the next save serializes fresh values.
          const metadataKeys = [
            "tags",
            "icon",
            "image",
            "relatedItems",
            "locked",
            "published",
            "hideInMenu",
            "overridePathauto",
            "pageType",
            "theme",
            "accentColor",
            "linkUrl",
            "linkTarget",
            "author",
            "readtime",
            "videos",
            "images",
          ];
          metadataKeys.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(nodeData.metadata, key)) {
              item.metadata[key] = nodeData.metadata[key];
            } else if (
              Object.prototype.hasOwnProperty.call(item.metadata, key)
            ) {
              delete item.metadata[key];
            }
          });
        }
      }
    }
    // clear a recovered-edit snapshot when its page is successfully saved
    try {
      const snapRaw = globalThis.sessionStorage.getItem("haxcms-pending-edit");
      if (snapRaw) {
        const snap = JSON.parse(snapRaw);
        const currentId = this.activeItem && this.activeItem.id;
        if (snap && String(snap.itemId) === String(currentId)) {
          globalThis.sessionStorage.removeItem("haxcms-pending-edit");
          this.__pendingRestore = null;
        }
      }
    } catch (err) {}
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
      // If the active page's slug changed, redirect to the new URL
      const activeItem = store.activeItem;
      // MicroFrontendRegistry.call returns the full {status, data} envelope,
      // and saveOutline returns {status:200, data:{items: site.manifest.items}}.
      // Read data.items (not response.items, which is always undefined).
      const responseItems =
        e &&
        e.detail &&
        e.detail.response &&
        e.detail.response.data &&
        e.detail.response.data.items
          ? e.detail.response.data.items
          : null;
      if (activeItem && activeItem.id && responseItems) {
        const updatedItem = responseItems.find(
          (item) => item && item.id === activeItem.id,
        );
        if (updatedItem && updatedItem.slug && updatedItem.slug !== activeItem.slug) {
          const newSlug = updatedItem.slug;
          globalThis.history.replaceState({}, null, newSlug);
          globalThis.dispatchEvent(new PopStateEvent("popstate"));
        }
      }
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
    // Patch the local manifest item from the server response so the editor
    // reflects the change immediately (title/slug/description/tags/icon/etc.)
    // without waiting for the manifest reload. This avoids stale values when
    // re-opening quick operations like edit-tags, especially when successive
    // saves happen within the same second (the _timeStamp cache-buster would
    // otherwise not change and skip the loadJOSData reload).
    const response = e && e.detail ? e.detail.response : null;
    const data = response && response.data ? response.data : null;
    // Capture the active page's slug BEFORE patching so we can redirect the
    // browser when a node-details op (setTitle/setParent/indent/outdent/setSlug)
    // changed the active page's slug. Without this, the URL bar keeps the stale
    // slug and the next navigation/reload hits page-not-found.
    const activeItem = store.activeItem;
    const activeId =
      activeItem && activeItem.id ? activeItem.id : null;
    const previousActiveSlug =
      activeItem && typeof activeItem.slug === "string"
        ? activeItem.slug
        : null;
    if (data && data.id) {
      const item = store.findItem(data.id);
      if (item) {
        if (typeof data.title === "string") {
          item.title = data.title;
        }
        if (typeof data.slug === "string") {
          item.slug = data.slug;
        }
        if (typeof data.description === "string") {
          item.description = data.description;
        }
        if (data.metadata && typeof data.metadata === "object") {
          if (!item.metadata || typeof item.metadata !== "object") {
            item.metadata = {};
          }
          // node-detail operations set or clear these metadata fields; the
          // backend deletes on clear, so mirror that locally to keep the
          // manifest item in sync with the server.
          const metadataKeys = [
            "tags",
            "icon",
            "image",
            "relatedItems",
            "locked",
            "published",
            "hideInMenu",
            "overridePathauto",
          ];
          metadataKeys.forEach((key) => {
            if (Object.prototype.hasOwnProperty.call(data.metadata, key)) {
              item.metadata[key] = data.metadata[key];
            } else if (
              Object.prototype.hasOwnProperty.call(item.metadata, key)
            ) {
              delete item.metadata[key];
            }
          });
        }
      }
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
      store.toast(`Operation completed!`, 3000, { hat: "construction" });
      // If this operation changed the active page's slug, redirect to the
      // new URL so the browser doesn't sit on a stale slug that no longer
      // resolves. Mirrors _handleOutlineResponse's redirect behavior.
      if (
        data &&
        data.id &&
        activeId &&
        data.id === activeId &&
        typeof data.slug === "string" &&
        previousActiveSlug !== null &&
        data.slug !== previousActiveSlug
      ) {
        globalThis.history.replaceState({}, null, data.slug);
        globalThis.dispatchEvent(new PopStateEvent("popstate"));
      }
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
    } catch (error) {
      console.warn("Restore revision error:", error);
    } finally {
      this.clearProcessingVisual();
    }
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
  // duration defaults to 5s for short operations; pass a larger value for
  // long-running import/export work on very large sites so the indicator
  // does not vanish mid-operation. Pair with clearProcessingVisual().
  setProcessingVisual(duration = 5000) {
    let loadingIcon = globalThis.document.createElement("simple-icon-lite");
    loadingIcon.icon = "hax:loading";
    loadingIcon.style.setProperty("--simple-icon-height", "40px");
    loadingIcon.style.setProperty("--simple-icon-width", "40px");
    loadingIcon.style.height = "150px";
    loadingIcon.style.marginLeft = "8px";
    store.toast(`Processing`, duration, {
      hat: "construction",
      slot: loadingIcon,
    });
  }

  // dismiss the processing toast. Call this before firing a result toast
  // (success or error) so the new toast gets a fresh auto-hide timer.
  clearProcessingVisual() {
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-toast-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
  }
  /**
   * Save the outline based on an event firing.
   */

  saveManifest(e) {
    // now let's work on the outline
    let values = e && e.detail ? e.detail : {};
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
    // add in our standard pieces

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

  async normalizeSlugs(e) {
    const siteName = this._siteName();
    if (!siteName) {
      store.toast("Slug normalization endpoint is not available.", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    this.setProcessingVisual();
    await waitForHAXCMSSiteApiRegistryReady();
    if (
      !MicroFrontendRegistry ||
      !MicroFrontendRegistry.has("@site/normalizeSiteSlugs")
    ) {
      store.toast("Slug normalization endpoint is not available.", 3000, {
        fire: true,
      });
      store.playSound("error");
      return;
    }
    try {
      const response = await MicroFrontendRegistry.call(
        "@site/normalizeSiteSlugs",
        { site: { name: siteName } },
        null,
        null,
      );
      // normalizeSiteSlugs returns {status:200, data:{changed, preview,
      // changes:[{id,title,oldSlug,newSlug}], skipped:[{...}]}}. Read the
      // changes array (not data.items, which does not exist on this payload).
      if (response && response.data && Array.isArray(response.data.changes)) {
        const changes = response.data.changes;
        store.playSound("success");
        if (changes.length > 0) {
          store.toast(
            `Normalized ${changes.length} page slugs`,
            4000,
            { hat: "random" },
          );
        } else {
          store.toast("Slug normalization completed.", 3000, {
            hat: "random",
          });
        }
        this.dispatchEvent(
          new CustomEvent("haxcms-trigger-update", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: true,
          }),
        );
        // If the active page's slug changed, redirect to the new URL
        const activeItem = store.activeItem;
        if (activeItem && activeItem.id) {
          const updatedItem = changes.find(
            (change) => change && change.id === activeItem.id,
          );
          if (
            updatedItem &&
            updatedItem.newSlug &&
            updatedItem.newSlug !== activeItem.slug
          ) {
            globalThis.history.replaceState({}, null, updatedItem.newSlug);
            globalThis.dispatchEvent(new PopStateEvent("popstate"));
          }
        }
      } else {
        store.playSound("success");
        store.toast("Slug normalization completed.", 3000, {
          hat: "random",
        });
      }
    } catch (error) {
      console.warn(error);
      store.toast("Slug normalization failed.", 3000, { fire: true });
      store.playSound("error");
    }
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
    const authorSocialLink2 = normalizeString(
      detail.authorSocialLink2,
      manifestAuthor && manifestAuthor.socialLink2
        ? String(manifestAuthor.socialLink2)
        : "",
    );
    const authorPhone = normalizeString(
      detail.authorPhone,
      manifestAuthor && manifestAuthor.phone
        ? String(manifestAuthor.phone)
        : "",
    );
    const authorLocation = normalizeString(
      detail.authorLocation,
      manifestAuthor && manifestAuthor.location
        ? String(manifestAuthor.location)
        : "",
    );
    const authorWebsite = normalizeString(
      detail.authorWebsite,
      manifestAuthor && manifestAuthor.website
        ? String(manifestAuthor.website)
        : "",
    );
    const authorWebsite2 = normalizeString(
      detail.authorWebsite2,
      manifestAuthor && manifestAuthor.website2
        ? String(manifestAuthor.website2)
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
        ? toBoolValue(detail.pathauto, false)
        : toBoolValue(
            manifestSiteSettings ? manifestSiteSettings.pathauto : undefined,
            false,
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
        socialLink2: authorSocialLink2,
        phone: authorPhone,
        location: authorLocation,
        website: authorWebsite,
        website2: authorWebsite2,
      },
      manifest: {
        author: {
          "manifest.license": license,
          "manifest.metadata.author.image": authorImage,
          "manifest.metadata.author.name": authorName,
          "manifest.metadata.author.email": authorEmail,
          "manifest.metadata.author.socialLink": authorSocialLink,
          "manifest.metadata.author.socialLink2": authorSocialLink2,
          "manifest.metadata.author.phone": authorPhone,
          "manifest.metadata.author.location": authorLocation,
          "manifest.metadata.author.website": authorWebsite,
          "manifest.metadata.author.website2": authorWebsite2,
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
