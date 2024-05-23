/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { css, html } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-progress/simple-progress.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
/**
 * `simple-login`
 * @element simple-login
 * `a simple login form`
 *
 * @microcopy - language worth noting:
 * @demo demo/index.html
 */
class SimpleLogin extends SimpleColors {
  //styles function
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }

        #loginform {
          width: var(--login-form-width, 450px);
          height: var(--login-form-height, auto);
          --simple-camera-snap-color: var(--login-form-color, #36bed4);
          --simple-camera-snap-error: var(--login-form-error, red);
          --simple-camera-snap-background: var(--login-form-background, white);
          --simple-camera-snap-border-radius: var(
            --login-form-image-bnorder-radius,
            100%
          );
          box-shadow:
            0 12px 16px 1px rgba(0, 0, 0, 0.14),
            0 4px 22px 3px rgba(0, 0, 0, 0.12),
            0 6px 7px -4px rgba(0, 0, 0, 0.4);
        }

        #loginformcontent {
          padding: var(--login-form-padding, 48px);
        }

        #loginformcontent > * {
          margin-top: var(
            --login-form-margin-top,
            var(--login-form-margin, 8px)
          );
          margin-bottom: var(
            --login-form-margin-bottom,
            var(--login-form-margin, 8px)
          );
        }

        #loginbtn,
        #buttons ::slotted(button) {
          cursor: pointer;
          width: var(--login-btn-width, auto);
          margin: var(--login-btn-margin, 24px auto 0);
          display: var(--login-btn-display, inline-flex);
        }

        #loginbtn[disabled] {
          background-color: var(
            --login-btn-disabled-background-color,
            var(--simple-colors-default-theme-accent-12, #000000)
          );
        }

        h1 {
          margin: 0;
        }

        h2 {
          margin: 0;
        }

        simple-progress {
          width: 100%;
        }

        ::slotted(simple-login-avatar) {
          margin: 0 auto;
        }

        #errormsg {
          margin-top: 16px;
          color: var(--login-error-label-color, var(--error-color));
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <div id="loginform">
      <simple-progress ?disabled="${!this.loading}"></simple-progress>
      <div id="loginformcontent">
        ${this.title ? html`<h1>${this.title}</h1>` : ``}
        ${this.subtitle ? html`<h2>${this.subtitle}</h2>` : ``}
        <div id="errormsg">${this.errorMsg}</div>
        <slot></slot>
        <simple-fields-field
          id="userinput"
          value="${this.username}"
          @value-changed="${this._usernameChanged}"
          type="text"
          ?disabled="${this.loading}"
          label="${this.userInputLabel}"
          required
          error-message="${this.userInputErrMsg}"
        ></simple-fields-field>
        <simple-fields-field
          id="passinput"
          required
          value="${this.password}"
          @value-changed="${this._passwordChanged}"
          ?disabled="${this.loading}"
          type="password"
          label="${this.passwordInputLabel}"
          error-message="${this.passwordInputErrMsg}"
        ></simple-fields-field>
        <button
          @click="${this._login}"
          ?disabled="${this.loading}"
          id="loginbtn"
        >
          ${this.loginBtnText}
        </button>
        <span id="buttons"><slot name="buttons"></slot></span>
      </div>
    </div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Title of the loginscreen
       */
      title: String,
      /**
       * Subtitle of the loginscreen
       */
      subtitle: String,
      /**
       * Error message to show (example : "Invalid username")
       */
      errorMsg: String,
      /**
       * Content of the username field
       */
      username: {
        type: String,
      },
      /**
       * Content of the password field
       */
      password: {
        type: String,
      },
      /**
       * When true, all fields are disabled and the progress bar is visible
       */
      loading: {
        type: Boolean,
      },
      /**
       * Placeholder of the username field
       */
      userInputLabel: {
        type: String,
        attribute: "user-input-label",
      },
      /**
       * Error message of the username field
       */
      userInputErrMsg: {
        type: String,
      },
      /**
       * Placeholder of the password field
       */
      passwordInputLabel: {
        type: String,
        attribute: "password-input-label",
      },
      /**
       * Error message of the password field
       */
      passwordInputErrMsg: {
        type: String,
      },
      /**
       * Login button label
       */
      loginBtnText: {
        type: String,
        attribute: "login-btn-text",
      },
    };
  }

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
    this.password = "";
    this.username = "";
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
      if (["username", "password"].includes(propName)) {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    setTimeout(() => {
      this.shadowRoot
        .querySelector("#loginform")
        .addEventListener("keypress", this._keyPressLogin.bind(this));
    }, 0);
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
            p: this.shadowRoot.querySelector("#passinput").value,
          },
        }),
      );
    }
  }
}
customElements.define(SimpleLogin.tag, SimpleLogin);
export { SimpleLogin };
