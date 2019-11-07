import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-styles/shadow.js";
import "@polymer/paper-styles/typography.js";
import "@polymer/paper-styles/color.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `site-login`
 * `Visual element to broker a user login`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteLogin extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        #loginform {
          width: 450px;
          height: 450px;
          background: var(--login-form-background-color, white);
          box-shadow: 0 12px 16px 1px rgba(0, 0, 0, 0.14),
            0 4px 22px 3px rgba(0, 0, 0, 0.12),
            0 6px 7px -4px rgba(0, 0, 0, 0.4);
        }
        #loginformcontent {
          padding: 48px;
        }
        #loginformcontent > * {
          margin-top: 8px;
          margin-bottom: 8px;
        }
        #loginbtn {
          margin-top: 24px;
          float: right;
          background-color: var(
            --login-btn-background-color,
            var(--paper-indigo-500)
          );
          color: var(--login-btn-text-color, white);
        }
        #loginbtn[disabled] {
          background-color: var(
            --login-btn-disabled-background-color,
            var(--paper-indigo-100)
          );
        }
        h1 {
          margin: 0;
        }
        h2 {
          margin: 0;
        }
        paper-progress {
          width: 100%;
        }
        #errormsg {
          margin-top: 16px;
          color: var(--login-error-label-color, var(--error-color));
        }
      `
    ];
  }
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
    this.loading = false;
    this.userInputLabel = "Username";
    this.userInputErrMsg = "Username required";
    this.passwordInputLabel = "Password";
    this.passwordInputErrMsg = "Password required";
    this.loginBtnText = "Login";
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-progress/paper-progress.js");
  }
  render() {
    return html`
      <custom-style>
        <style>
          #loginbtn {
            --paper-button-raised-keyboard-focus: {
              background-color: var(
                --login-btn-raised-background-color,
                var(--paper-pink-a200)
              ) !important;
              color: var(--login-btn-text-color, white) !important;
            }
            @apply --login-btn;
          }

          h1 {
            @apply --paper-font-display1;
            @apply --login-title;
          }

          h2 {
            @apply --paper-font-title;
            @apply --login-subtitle;
          }

          #errormsg {
            @apply --paper-font-menu;
          }
        </style>
      </custom-style>
      <div id="loginform">
        <paper-progress
          ?disabled="${!this.loading}"
          indeterminate
        ></paper-progress>
        <div id="loginformcontent">
          <h1>${this.title}</h1>
          <h2>${this.subtitle}</h2>
          <div id="errormsg">${this.errorMsg}</div>
          <paper-input
            id="userinput"
            .value="${this.username}"
            @value-changed="${this.usernameChanged}"
            ?disabled="${this.loading}"
            type="text"
            label="${this.userInputLabel}"
            required
            error-message="${this.userInputErrMsg}"
          ></paper-input>
          <paper-input
            id="passinput"
            .value="${this.password}"
            @value-changed="${this.passwordChanged}"
            ?disabled="${this.loading}"
            type="password"
            label="${this.passwordInputLabel}"
            required
            error-message="${this.passwordInputErrMsg}"
          ></paper-input>
          <paper-button
            @click="${this._login}"
            ?disabled="${this.loading}"
            id="loginbtn"
            raised
            class="indigo"
            >${this.loginBtnText}</paper-button
          >
          <slot name="links"></slot>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "site-login";
  }
  usernameChanged(e) {
    this.username = e.detail.value;
  }

  passwordChanged(e) {
    this.password = e.detail.value;
  }
  static get properties() {
    return {
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
        type: String
      },

      /**
       * Content of the password field
       */
      password: {
        type: String
      },

      /**
       * When true, all fields are disabled and the progress bar is visible
       */
      loading: {
        type: Boolean
      },

      /**
       * Placeholder of the username field
       */
      userInputLabel: {
        type: String,
        attribute: "user-input-label"
      },

      /**
       * Error message of the username field
       */
      userInputErrMsg: {
        type: String,
        attribute: "user-input-err-msg"
      },

      /**
       * Placeholder of the password field
       */
      passwordInputLabel: {
        type: String,
        attribute: "password-input-label"
      },

      /**
       * Error message of the password field
       */
      passwordInputErrMsg: {
        type: String,
        attribute: "password-input-err-msg"
      },

      /**
       * Login button label
       */
      loginBtnText: {
        type: String,
        attribute: "login-btn-text"
      }
    };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // notify when any of these change
      if (["username", "password"].includes(propName)) {
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
  firstUpdated(changedProperties) {
    this.shadowRoot
      .querySelector("#loginform")
      .addEventListener("keypress", this._keyPress.bind(this));
  }
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#loginform")
      .removeEventListener("keypress", this._keyPress.bind(this));
    super.disconnectedCallback();
  }
  /**
   * Listen for key presses
   */
  _keyPress(e) {
    if (e.keyCode == 13) {
      //Enter
      this._login();
      return false;
    }
  }

  _login() {
    if (
      this.shadowRoot.querySelector("#userinput").validate() &&
      this.shadowRoot.querySelector("#passinput").validate()
    ) {
      this.dispatchEvent(
        new CustomEvent("login-btn-click", { bubbles: true, composed: true })
      );
    }
  }
}

window.customElements.define(SiteLogin.tag, SiteLogin);
export { SiteLogin };
