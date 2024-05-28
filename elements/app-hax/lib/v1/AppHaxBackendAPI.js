import { LitElement, html } from "lit";
import { localStorageGet } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/jwt-login/jwt-login.js";
import { toJS, autorun } from "mobx";
import { store } from "./AppHaxStore.js";
import { SimpleColorsSharedStylesGlobal } from "@haxtheweb/simple-colors-shared-styles/simple-colors-shared-styles.js";
import { SimpleIconIconsetsManifest } from "@haxtheweb/simple-icon/lib/simple-iconset-manifest.js";
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
      url="${this.appSettings.login}"
      method="${this.method}"
      refresh-url="${this.appSettings.refreshUrl}"
      redirect-url="${this.appSettings.redirectUrl}"
      logout-url="${this.appSettings.logout}"
      id="jwt"
      @jwt-changed="${this.jwtChanged}"
      @jwt-login-login-failed="${this.jwtFailed}"
    ></jwt-login>`;
  }

  // failed to get valid JWT, wipe current
  jwtFailed(e) {
    this.jwt = null;
    this.token = null;
  }
  // event meaning we either got or removed the jwt
  async jwtChanged(e) {
    this.jwt = e.detail.value;
    // sanity check we actually got a response
    // this fires every time our JWT changes so it can update even after already logging in
    // like hitting refresh or coming back to the app
    if (!this.__loopBlock && this.jwt) {
      this.__loopBlock = true;
      const userData = await this.makeCall("getUserDataPath");
      if (userData && userData.data) {
        store.user = {
          name: userData.data.userName,
        };
        this.__loopBlock = false;
      }
    }
  }

  async makeCall(call, data = {}, save = false, callback = false) {
    if (this.appSettings && this.appSettings[call]) {
      var urlRequest = `${this.basePath}${this.appSettings[call]}`;
      var options = {
        method: this.method,
      };
      if (this.jwt) {
        data.jwt = this.jwt;
      }
      if (this.token) {
        data.token = this.token;
      }
      // encode in search params or body of the request
      if (this.method === "GET") {
        urlRequest += "?" + new URLSearchParams(data).toString();
      } else {
        options.body = JSON.stringify(data);
      }
      const response = await fetch(`${urlRequest}`, options).then(
        (response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 401) {
            // call not allowed, log out bc unauthorized
            globalThis.dispatchEvent(
              new CustomEvent("jwt-login-logout", {
                composed: true,
                bubbles: true,
                cancelable: false,
                detail: true,
              }),
            );
          }
          // we got a miss, logout cause something is wrong
          else if (response.status === 404) {
            // call not allowed, log out bc unauthorized
            globalThis.dispatchEvent(
              new CustomEvent("jwt-login-logout", {
                composed: true,
                bubbles: true,
                cancelable: false,
                detail: true,
              }),
            );
          } else if (response.status === 403) {
            // if this was a 403 it should be because of a bad jwt
            // or out of date one. let's kick off a call to get a new one
            // hopefully from the timing token, knowing this ALSO could kick
            // over here.
            globalThis.dispatchEvent(
              new CustomEvent("jwt-login-refresh-token", {
                composed: true,
                bubbles: true,
                cancelable: false,
                detail: {
                  element: {
                    obj: this,
                    callback: "refreshRequest",
                    params: [call, data, save, callback],
                  },
                },
              }),
            );
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
    const { call, data, save, callback } = response;
    // force the jwt to be the updated jwt
    // this helps avoid any possible event timing issue
    if (jwt) {
      this.jwt = jwt;
      this.makeCall(call, data, save, callback);
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
  }
  // just easier to read here
  _formatSitePostData() {
    const site = toJS(store.site);
    // html contents if we are starting from a file import, otherwise its null
    const items = toJS(store.items);
    const itemFiles = toJS(store.itemFiles);
    const colors = Object.keys(SimpleColorsSharedStylesGlobal.colors);
    const buildData = {
      site: {
        name: site.name,
        description: `${site.type} ${site.structure}`,
        theme: site.theme,
      },
      build: {
        type: site.type,
        structure: site.structure,
        items: items,
        files: itemFiles,
      },
      theme: {
        // select a random color
        color: colors[Math.floor(Math.random() * colors.length)],
        // select a random av icon
        icon: `${SimpleIconIconsetsManifest[0].name}:${
          SimpleIconIconsetsManifest[0].icons[
            Math.floor(
              Math.random() * SimpleIconIconsetsManifest[0].icons.length,
            )
          ]
        }`,
      },
    };
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
