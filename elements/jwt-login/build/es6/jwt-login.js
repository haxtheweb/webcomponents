import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/iron-ajax/iron-ajax.js";
let JwtLogin = Polymer({
  _template: html`
    <style>
      :host {
        visibility: hidden;
      }
    </style>
    <iron-ajax id="loginrequest" method="GET" url="[[url]]" handle-as="json" on-response="loginResponse">
    </iron-ajax>
`,
  is: "jwt-login",
  properties: {
    url: { type: String },
    key: { type: String, value: "jwt" },
    jwt: { type: String, notify: !0 }
  },
  ready: function() {
    this.jwt = localStorage.getItem(this.key);
    this.fire("jwt-token", this.jwt);
  },
  toggleLogin: function() {
    if (null == this.jwt) {
      this.$.loginrequest.generateRequest();
    } else {
      localStorage.removeItem(this.key);
      this.jwt = null;
      this.fire("jwt-logged-in", !1);
    }
  },
  loginResponse: function(e) {
    this.jwt = e.detail.response;
    if (null == this.jwt || "" == this.jwt) {
      this.fire("jwt-logged-in", !1);
    } else {
      localStorage.setItem(this.key, this.jwt);
      this.fire("jwt-token", this.jwt);
      this.fire("jwt-logged-in", !0);
    }
  }
});
export { JwtLogin };
