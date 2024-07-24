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
  "callback",
  "method",
];

// new micro
export class MicroFrontend {
  constructor(values = {}) {
    // set defaults for each key expected
    MicroFrontendKeys.map((key) =>
      key === "params"
        ? (this[key] = values[key] || {})
        : (this[key] = values[key] || null),
    );
  }
}

/**
 * `micro-frontend-registry`
 * `A singleton for registration and managing access to leverage microservices for web components`
 *
 * @demo demo/index.html
 * @element micro-frontend-registry
 */
class MicroFrontendRegistryEl extends HTMLElement {
  static get tag() {
    return "micro-frontend-registry";
  }

  constructor() {
    super();
    this.list = [];
    this.MicroFrontend = MicroFrontend;
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
            item[key] = globalThis.MicroFrontendRegistryConfig[item.name][key];
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
  ) {
    if (this.has(name)) {
      const item = this.get(name);
      // default post, but this is not cacheable
      let method = "POST";
      // support definition requiring a certain method
      if (item.method) {
        method = item.method;
      }
      // support override when calling
      if (params.__method) {
        method = params.__method;
        delete params.__method;
      }
      let data = null;
      switch (method) {
        case "GET":
        case "HEAD":
          // support for formdata which is already encoded
          const searchParams = new URLSearchParams(params).toString();
          data = await fetch(
            searchParams
              ? `${item.endpoint}?${searchParams}${urlStringAddon}`
              : item.endpoint + urlStringAddon,
            {
              method: method,
            },
          )
            .then((d) => {
              return d.ok ? d.json() : { status: d.status, data: null };
            })
            .catch((e, d) => {
              console.warn("Request failed", e);
              // this is endpoint completely failed to respond
              return { status: 500, data: null };
            });
          break;
        case "POST":
        default:
          // support for formdata which is already encoded
          data = await fetch(item.endpoint + urlStringAddon, {
            method: method,
            body: params instanceof FormData ? params : JSON.stringify(params),
          })
            .then((d) => {
              return d.ok ? d.json() : { status: d.status, data: null };
            })
            .catch((e, d) => {
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
}
customElements.define(MicroFrontendRegistryEl.tag, MicroFrontendRegistryEl);

// register globally so we can make sure there is only one
globalThis.MicroFrontendRegistry = globalThis.MicroFrontendRegistry || {};
globalThis.MicroFrontendRegistryConfig =
  globalThis.MicroFrontendRegistryConfig || {};
globalThis.MicroFrontendRegistry.requestAvailability = () => {
  if (!globalThis.MicroFrontendRegistry.instance) {
    globalThis.MicroFrontendRegistry.instance =
      globalThis.document.createElement(MicroFrontendRegistryEl.tag);
    globalThis.document.body.appendChild(
      globalThis.MicroFrontendRegistry.instance,
    );
  }
  return globalThis.MicroFrontendRegistry.instance;
};
// most common way to access registry
export const MicroFrontendRegistry =
  globalThis.MicroFrontendRegistry.requestAvailability();
