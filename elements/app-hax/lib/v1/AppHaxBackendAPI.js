import { LitElement, html } from "lit";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
import { toJS, autorun } from 'mobx';
import { store } from "./AppHaxStore.js";

// this element will manage all connectivity to the backend
// this way everything is forced to request through calls to this
// so that it doesn't get messy down below in state
export class AppHaxBackendAPI extends LitElement {
  static get tag() {
    return 'app-hax-backend-api';
  }

  constructor() {
    super();
    this.jwt = null;
    this.method = window.appSettings.demo ? 'GET' : 'POST';
    this.baseAddress = '/';
    this.lastResponse = {};
    this.appSettings = {};
    autorun(() => {
      this.appSettings = toJS(store.appSettings);
    });
    autorun(() => {
      this.jwt = toJS(store.jwt);
    });
  }
  
  static get properties() {
    return {
      jwt: { type: String },
      baseAddress: { type: String, attribute: 'base-address' },
      appSettings: { type: Object },
      method: { type: String },
    }
  }

  render() {
    // eslint-disable-next-line no-unused-expressions
    html`
      <jwt-login
      auto
      id="jwt"
      jwt="${this.jwt}"
      @jwt-changed="${this.jwtChanged}"
      url="${this.appSettings.login}"
      refresh-url="${this.appSettings.refreshUrl}"
      redirect-url="${this.appSettings.redirectUrl}"
      logout-url="${this.appSettings.logoutUrl}"
    ></jwt-login>`;
  }

  // event meaning we either got or removed the jwt
  jwtChanged(e) {
    this.jwt = e.detail.value;
  }

  async makeCall(call, data = {}, save = false) {
    if (this.appSettings && this.appSettings[call]) {
      var urlRequest = `${this.baseAddress}${this.appSettings[call]}`;
      var options = {
        method: this.method,
      };
      if (this.jwt) {
        data.jwt = this.jwt;
      }
      // encode in search params or body of the request
      if (this.method === 'GET') {
        urlRequest+= '?' + new URLSearchParams(data).toString();
      }
      else {
        options.body = JSON.stringify(data);
      }
      const response = await fetch(`${urlRequest}`, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return {};
      });
      // ability to save the output if this is being done as a bg task
      // that way we can get access to the result later on
      if (save) {
        this.lastResponse[call] = response;
      }
      return response;
    }
  }

  // set instance of API in store
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // set store refernece to this singleton
    store.AppHaxAPI = this;
    store.newSitePromiseList = [
      async () => await this.makeCall('createSite', toJS(store.site), true),
      ...store.newSitePromiseList];
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'jwt') {
        store.jwt = this[propName];
      }
    });
  }
}


window.AppHaxAPI = window.AppHaxAPI || {};

window.AppHaxAPI.requestAvailability = () => {
  if (!window.AppHaxAPI.instance) {
    window.AppHaxAPI.instance = document.createElement(AppHaxBackendAPI.tag);
    document.body.appendChild(window.AppHaxAPI.instance);
  }
  return window.AppHaxAPI.instance;
};
export const AppHaxAPI = window.AppHaxAPI.requestAvailability();

customElements.define(AppHaxBackendAPI.tag, AppHaxBackendAPI);