import { LitElement, html } from "lit";
import "@lrnwebcomponents/jwt-login/jwt-login.js";
import { store } from "../HAXCMSAppStore.js";

// this element will manage all connectivity to the backend
// this way everything is forced to request through calls to this
// so that it doesn't get messy down below in state
export class AppHaxBackendBroker extends LitElement {
  constructor() {
    super();
    this.jwt = null;
    store.backendBroker = this;
  }
  static get properties() {
    return {
      jwt: { type: String }
    }
  }

  render() {
    html`
    <jwt-login
    auto
    id="jwt"
    jwt="${this.jwt}"
    @jwt-changed="${this.jwtChanged}"
  ></jwt-login>`;
  }
   
  jwtChanged(e) {
    this.jwt = e.detail.value;
    store.jwt = this.jwt;
  }
}

window.AppHax = window.AppHax || {};

window.AppHax.requestAvailability = () => {
  var instance = document.querySelector(AppHaxBackendBroker.tag);
  if (!instance) {
    instance = document.createElement(AppHaxBackendBroker.tag);
    document.appendChild(instance);
  }
  return instance;
};
window.AppHax.requestAvailability();

customElements.define(AppHaxBackendBroker.tag, AppHaxBackendBroker);