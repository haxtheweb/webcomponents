import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-styles/shadow.js";
import "@polymer/paper-styles/typography.js";
import "@polymer/paper-styles/color.js";

/**
 * `site-login`
 * `Visual element to broker a user login`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteLogin extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-progress/paper-progress.js");
  }
  static get template() {
    return html`
      <style>
        #loginform {
          width: 450px;
          height: 450px;
          background: var(--login-form-background-color, white);
          @apply --shadow-elevation-12dp;
          @apply --login-form;
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
          --paper-button-raised-keyboard-focus: {
            background-color: var(
              --login-btn-raised-background-color,
              var(--paper-pink-a200)
            ) !important;
            color: var(--login-btn-text-color, white) !important;
          }
          @apply --login-btn;
        }
        #loginbtn[disabled] {
          background-color: var(
            --login-btn-disabled-background-color,
            var(--paper-indigo-100)
          );
        }

        h1 {
          @apply --paper-font-display1;
          margin: 0;
          @apply --login-title;
        }

        h2 {
          @apply --paper-font-title;
          margin: 0;
          @apply --login-subtitle;
        }

        paper-progress {
          width: 100%;
        }

        #errormsg {
          margin-top: 16px;
          color: var(--login-error-label-color, var(--error-color));
          @apply --paper-font-menu;
        }
      </style>
      <div id="loginform">
        <paper-progress disabled="[[!loading]]" indeterminate></paper-progress>
        <div id="loginformcontent">
          <h1>[[title]]</h1>
          <h2>[[subtitle]]</h2>
          <div id="errormsg">[[errorMsg]]</div>
          <paper-input
            id="userinput"
            value="{{username}}"
            disabled="[[loading]]"
            type="text"
            label="[[userInputLabel]]"
            required
            error-message="[[userInputErrMsg]]"
          ></paper-input>
          <paper-input
            id="passinput"
            value="{{password}}"
            disabled="[[loading]]"
            type="password"
            label="[[passwordInputLabel]]"
            required
            error-message="[[passwordInputErrMsg]]"
          ></paper-input>
          <paper-button
            on-click="_login"
            disabled="[[loading]]"
            id="loginbtn"
            raised
            class="indigo"
            >[[loginBtnText]]</paper-button
          >
          <slot name="links"></slot>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "site-login";
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
        type: String,
        notify: true
      },

      /**
       * Content of the password field
       */
      password: {
        type: String,
        notify: true
      },

      /**
       * When true, all fields are disabled and the progress bar is visible
       */
      loading: {
        type: Boolean,
        value: false
      },

      /**
       * Placeholder of the username field
       */
      userInputLabel: {
        type: String,
        value: "Username"
      },

      /**
       * Error message of the username field
       */
      userInputErrMsg: {
        type: String,
        value: "Username required"
      },

      /**
       * Placeholder of the password field
       */
      passwordInputLabel: {
        type: String,
        value: "Password"
      },

      /**
       * Error message of the password field
       */
      passwordInputErrMsg: {
        type: String,
        value: "Password required"
      },

      /**
       * Login button label
       */
      loginBtnText: {
        type: String,
        value: "Login"
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.shadowRoot
        .querySelector("#loginform")
        .addEventListener("keypress", this._keyPress.bind(this));
    });
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
