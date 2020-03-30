/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-progress/paper-progress.js";
import "@polymer/paper-styles/shadow.js";
import "@polymer/paper-styles/typography.js";
import "@polymer/paper-styles/color.js";
/**
 * `simple-login`
 * @element simple-login
 * `a simple login form`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class SimpleLogin extends PolymerElement {
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
    afterNextRender(this, function() {
      this.shadowRoot
        .querySelector("#loginform")
        .addEventListener("keypress", this._keyPressLogin.bind(this));
    });
  }
  /**
   * life cycle
   */
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#loginform")
      .removeEventListener("keypress", this._keyPressLogin.bind(this));
    super.disconnectedCallback();
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
