/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

// very basic class for micro
const MicroFrontendKeys = [
  "endpoint",
  "name",
  "title",
  "description",
  "params",
  "headers",
  "security",
  "callback",
  "method",
];

// new micro
export class MicroFrontend {
  constructor(values = {}) {
    // set defaults for each key expected
    MicroFrontendKeys.map((key) =>
      key === "params" || key === "headers"
        ? (this[key] = values[key] || {})
        : key === "security"
          ? (this[key] = values[key] || [])
        : (this[key] = values[key] || null),
    );
  }
}

export const MicroFrontendRegCapabilities = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.list = [];
      this.MicroFrontend = MicroFrontend;
      this.authProvider = null;
    }

    setAuthProvider(provider = null) {
      if (typeof provider === "function") {
        this.authProvider = provider;
      } else {
        this.authProvider = null;
      }
    }

    _resolveEndpointTemplate(endpoint = "", params = {}) {
      let resolvedEndpoint = String(endpoint || "");
      let cleanedParams = params;
      if (
        params &&
        typeof params === "object" &&
        !(params instanceof FormData)
      ) {
        cleanedParams = Object.assign({}, params);
        resolvedEndpoint = resolvedEndpoint.replace(
          /\{([A-Za-z0-9_]+)\}/g,
          (match, tokenName) => {
            if (
              Object.prototype.hasOwnProperty.call(cleanedParams, tokenName) &&
              cleanedParams[tokenName] != null
            ) {
              const replacementValue = cleanedParams[tokenName];
              delete cleanedParams[tokenName];
              return encodeURIComponent(String(replacementValue));
            }
            return match;
          },
        );
      }
      return {
        endpoint: resolvedEndpoint,
        params: cleanedParams,
      };
    }

    async _resolveSecurityHeaders(item = null, context = {}) {
      if (
        !item ||
        !Array.isArray(item.security) ||
        item.security.length === 0 ||
        typeof this.authProvider !== "function"
      ) {
        return {};
      }
      try {
        const resolvedHeaders = await this.authProvider(item.security, context);
        if (resolvedHeaders && typeof resolvedHeaders === "object") {
          return resolvedHeaders;
        }
      } catch (e) {
        console.warn("MicroFrontendRegistry auth provider failed", e);
      }
      return {};
    }

    /**
     * Adding more or less alias for define
     * @param {Object} params
     */
    add(params) {
      this.define(new MicroFrontend(params));
    }

    /**
     * define a new micro frontend
     *
     * @param {MicroFrontend} item - instanceof MicroFrontend
     * @returns {Boolean} status of definition being accepted
     */
    define(item) {
      if (!(item instanceof MicroFrontend)) {
        console.warn(
          "MicroFrontendRegistry: use class MicroFrontend instance but if keys match it will register still.",
        );
        console.warn(item);
      }
      // validate item has all keys we care about
      if (Object.keys(item).every((key) => MicroFrontendKeys.includes(key))) {
        // support for local resolution of vercel vs serve for things that are
        // built off of the main registry on localhost
        if (item.endpoint.startsWith("/api/")) {
          var base = "";
          // support base rewrite
          if (globalThis.MicroFrontendRegistryConfig.base) {
            base = globalThis.MicroFrontendRegistryConfig.base;
          }
          // keep local based on if we're local, otherwise we need to leverage deployed address
          else if (
            (!globalThis.HAXCMSContext ||
              globalThis.HAXCMSContext !== "nodejs") &&
            (globalThis.location.origin.startsWith("http://127.0.0.1") ||
              globalThis.location.origin.startsWith("http://localhost"))
          ) {
            base = globalThis.location.origin
              .replace(/127.0.0.1:8(.*)/, "localhost:3000")
              .replace(/localhost:8(.*)/, "localhost:3000");
          }
          // most common case, hit production open api address
          else {
            base = "https://open-apis.hax.cloud";
          }
          item.endpoint = `${base}${item.endpoint}`;
        }
        // check for registry config object
        if (globalThis.MicroFrontendRegistryConfig[item.name]) {
          Object.keys(globalThis.MicroFrontendRegistryConfig[item.name]).map(
            (key) => {
              item[key] =
                globalThis.MicroFrontendRegistryConfig[item.name][key];
            },
          );
        }

        if (!this.has(item.name)) {
          this.list.push(item);
          return true;
        }
      } else {
        return false;
      }
    }

    /**
     * get the definition for a machine named micro
     *
     * @param {String} name - machine name of the micro record requested
     * @returns {MicroFrontend} the micro in question
     */
    get(name, testOnly = false) {
      if (name && this.list.length > 0) {
        const found = this.list.find((item) => item.name === name);
        if (found) {
          return found;
        }
      }
      if (!testOnly) {
        console.error(
          `call for ${name} but not found in micro-frontend-registry`,
        );
      }
      return null;
    }

    /**
     * boolean for having the definition for a machine named micro
     *
     * @param {String} name - machine name of the micro record requested
     * @returns {Boolean} if we have this micro
     */
    has(name) {
      return this.get(name, true) !== null;
    }

    /**
     * set the definition for a machine named micro that was already registered
     *
     * @param {String} name - machine name of the micro record requested
     * @param {MicroFrontend} item - updated micro data
     * @returns {MicroFrontend} the micro in question
     */
    set(name, item = {}) {
      if (name && this.list.length > 0 && this.has(name)) {
        const index = this.list.findIndex((item) => item.name === name);
        this.list[index] = item;
      }
      return null;
    }

    /**
     * generate the call to the micro based on accepting name and params
     *
     * @param {String} name - machine name for the micro to call
     * @param {Object} params - data to send to endpoint
     * @param {Function} callback - Function callback on data return
     * @param {Object} caller - reference to DOM node that called this
     * @param {String} urlStringAddon - a string to add onto the fetch at the end. edge of edge of edge land here
     * @returns {Object} Response object from microservice, otherwise `null`
     */
    async call(
      name,
      params = {},
      callback = null,
      caller = null,
      urlStringAddon = "",
      rawResponse = false,
    ) {
      if (this.has(name)) {
        const item = this.get(name);
        const endpointData = this._resolveEndpointTemplate(item.endpoint, params);
        // default post, but this is not cacheable
        let method = "POST";
        // support definition requiring a certain method
        if (item.method) {
          method = item.method;
        }
        let requestParams = endpointData.params;
        const endpoint = endpointData.endpoint;
        if (!(requestParams instanceof FormData)) {
          if (!requestParams || typeof requestParams !== "object") {
            requestParams = {};
          } else {
            requestParams = Object.assign({}, requestParams);
          }
          // support override when calling
          if (requestParams.__method) {
            method = requestParams.__method;
            delete requestParams.__method;
          }
        }
        method = String(method || "POST").toUpperCase();
        const endpointHeaders =
          item.headers && typeof item.headers === "object"
            ? Object.assign({}, item.headers)
            : {};
        let requestHeaders = Object.assign({}, endpointHeaders);
        let fetchOptions = {};
        if (!(requestParams instanceof FormData)) {
          if (
            requestParams.__headers &&
            typeof requestParams.__headers === "object"
          ) {
            requestHeaders = Object.assign(
              requestHeaders,
              requestParams.__headers,
            );
            delete requestParams.__headers;
          }
          if (
            requestParams.__fetchOptions &&
            typeof requestParams.__fetchOptions === "object"
          ) {
            fetchOptions = Object.assign({}, requestParams.__fetchOptions);
            delete requestParams.__fetchOptions;
          }
        }
        const securityHeaders = await this._resolveSecurityHeaders(item, {
          name,
          endpoint,
          method,
          params: requestParams,
          caller,
        });
        if (
          securityHeaders &&
          typeof securityHeaders === "object" &&
          Object.keys(securityHeaders).length > 0
        ) {
          requestHeaders = Object.assign(requestHeaders, securityHeaders);
        }
        const parseResponse = async (response) => {
          if (rawResponse) {
            return response.text();
          }
          return response.ok
            ? response.json()
            : { status: response.status, data: null };
        };
        let data = null;
        switch (method) {
          case "GET":
          case "HEAD":
            // support for formdata which is already encoded
            const searchPayload =
              requestParams instanceof FormData ? {} : requestParams;
            const searchParams = new URLSearchParams(searchPayload).toString();
            const getOptions = Object.assign({}, fetchOptions, {
              method: method,
            });
            if (Object.keys(requestHeaders).length > 0) {
              getOptions.headers = requestHeaders;
            }
            data = await fetch(
              searchParams
                ? `${endpoint}?${searchParams}${urlStringAddon}`
                : endpoint + urlStringAddon,
              getOptions,
            )
              .then((d) => parseResponse(d))
              .catch((e) => {
                console.warn("Request failed", e);
                // this is endpoint completely failed to respond
                return { status: 500, data: null };
              });
            break;
          case "POST":
          default:
            const postOptions = Object.assign({}, fetchOptions, {
              method: method,
            });
            // support for formdata which is already encoded
            if (requestParams instanceof FormData) {
              postOptions.body = requestParams;
              if (Object.keys(requestHeaders).length > 0) {
                postOptions.headers = requestHeaders;
              }
            } else {
              const normalizedParams =
                requestParams && typeof requestParams === "object"
                  ? requestParams
                  : {};
              const normalizedHeaders = Object.assign({}, requestHeaders);
              if (
                !normalizedHeaders["Content-Type"] &&
                !normalizedHeaders["content-type"]
              ) {
                normalizedHeaders["Content-Type"] = "application/json";
              }
              postOptions.headers = normalizedHeaders;
              postOptions.body = JSON.stringify(normalizedParams);
            }
            data = await fetch(endpoint + urlStringAddon, postOptions)
              .then((d) => parseResponse(d))
              .catch((e) => {
                console.warn("Request failed", e);
                // this is endpoint completely failed to respond
                return { status: 500, data: null };
              });
            break;
        }
        // endpoints can require a callback be hit every time
        if (item.callback) {
          await item.callback(data, caller);
        }
        if (callback) {
          await callback(data, caller);
        }
        return data;
      }
      return null;
    }

    /**
     * generate the call to the micro as a URL
     *
     * @param {String} name - machine name for the micro to call
     * @param {Object} params - data to send to endpoint
     * @returns {String} URL with parameters for a GET
     */
    url(name, params = {}) {
      if (this.has(name)) {
        const item = this.get(name);
        // no null submissions
        for (var key in params) {
          if (params.hasOwnProperty(key)) {
            if (params[key] == null) delete params[key];
          }
        }
        return (
          new URL(item.endpoint).toString() +
          `?${new URLSearchParams(params).toString()}`
        );
      }
      return "";
    }
  };
};

export class MicroFrontendRegistryNodeJS extends MicroFrontendRegCapabilities(
  Object,
) {
  constructor() {
    super();
  }
}

/**
 * `micro-frontend-registry`
 * `A singleton for registration and managing access to leverage microservices for web components`
 *
 * @demo demo/index.html
 * @element micro-frontend-registry
 */
class MicroFrontendRegistryEl extends MicroFrontendRegCapabilities(
  HTMLElement,
) {
  static get tag() {
    return "micro-frontend-registry";
  }

  constructor() {
    super();
  }
}
globalThis.customElements.define(
  MicroFrontendRegistryEl.tag,
  MicroFrontendRegistryEl,
);

// register globally so we can make sure there is only one
globalThis.MicroFrontendRegistry = globalThis.MicroFrontendRegistry || {};
globalThis.MicroFrontendRegistryConfig =
  globalThis.MicroFrontendRegistryConfig || {};
globalThis.MicroFrontendRegistry.requestAvailability = () => {
  if (!globalThis.MicroFrontendRegistry.instance) {
    // weird but this would imply no DOM and thus node
    if (
      globalThis.document &&
      globalThis.document.body &&
      globalThis.document.body.appendChild
    ) {
      globalThis.MicroFrontendRegistry.instance =
        globalThis.document.createElement(MicroFrontendRegistryEl.tag);
      globalThis.document.body.appendChild(
        globalThis.MicroFrontendRegistry.instance,
      );
    } else {
      console.log("NODE WHATS UP MAN!");
      globalThis.MicroFrontendRegistry.instance =
        new MicroFrontendRegistryNodeJS();
    }
  }
  return globalThis.MicroFrontendRegistry.instance;
};
// most common way to access registry
export const MicroFrontendRegistry =
  globalThis.MicroFrontendRegistry.requestAvailability();
