/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css, html } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/paper-progress/paper-progress.js";
import "@lrnwebcomponents/simple-fields/lib/simple-fields-field.js";
import "@material/mwc-button/mwc-button.js";
/**
 * `simple-login`
 * @element simple-login
 * `a simple login form`
 *
 * @microcopy - language worth noting:
 * @demo demo/index.html
 */
class SimpleLogin extends SimpleColors {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-login";
  }
  /**
   * constructor
   */
  constructor() {
    super();
    this.password = '';
    this.username = '';
    this.loading = false;
    this.userInputLabel = "User name";
    this.userInputErrMsg = "User name required";
    this.passwordInputLabel = "Password";
    this.passwordInputErrMsg = "Password required";
    this.loginBtnText = "Login";    
  }

  updated(changedProperties) {
    super.updated();
    changedProperties.forEach((oldValue, propName) => {
      // notify
      if (['username', 'password'].includes(propName)) {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }

  firstUpdated() {
    setTimeout(() => {
      this.shadowRoot
        .querySelector("#loginform")
        .addEventListener("keypress", this._keyPressLogin.bind(this)); 
    },0);
  }
  /**
   * Key pressed for the login
   */
  _keyPressLogin(e) {
    if (e.keyCode == 13) {
      //Enter
      this._login();
      return false;
    }
  }
  _passwordChanged(e) {
    this.password = e.detail.value;
  }
  _usernameChanged(e) {
    this.username = e.detail.value;
  }
  /**
   * Login
   */
  _login() {
    if (
      this.shadowRoot.querySelector("#userinput").validate() &&
      this.shadowRoot.querySelector("#passinput").validate()
    ) {
      this.dispatchEvent(
        new CustomEvent("simple-login-login", {
          cancelable: true,
          bubbles: true,
          composed: true,
          detail: {
            u: this.shadowRoot.querySelector("#userinput").value,
            p: this.shadowRoot.querySelector("#passinput").value
          }
        })
      );
    }
  }
}
window.customElements.define(SimpleLogin.tag, SimpleLogin);
export { SimpleLogin };
