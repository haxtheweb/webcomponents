import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminControls,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import { store } from "./AppHaxStore.js";
export class AppHaxSiteLogin extends I18NMixin(DDDSuper(LitElement)) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-site-login";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      enterUserName: "Enter User name",
      invalidUsernameOrPassword: "Invalid Username or Password",
      welcomeLetsGo: "Welcome {username}! Let's go!",
      enterYourUsername: "Enter your username",
      username: "Username",
      next: "Next",
      welcomeBack: "Welcome back, {username}!",
      notYou: "Not you?",
      enterYourPassword: "Enter your password",
      password: "Password",
      togglePasswordDisplay: "Toggle password display",
      login: "Login",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.windowControllers = new AbortController();
    this.username = "";
    this.password = "";
    this.i18nDefault("errorMSG", "enterUserName");
    this.hidePassword = true;
    this.hasPass = false;
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      username: { type: String },
      password: { type: String },
      errorMSG: { type: String },
      hidePassword: { type: Boolean },
      hasPass: { type: Boolean },
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    setTimeout(() => {
      this.shadowRoot.querySelector("input").focus();
    }, 0);
  }

  // updated fires every time a property defined above changes
  // this allows you to react to variables changing and use javascript to perform logic
  // updated(changedProperties) {
  //   changedProperties.forEach((oldValue, propName) => {
  //   });
  // }

  // CSS - specific to Lit
  /**
   * HAX UI admin styling, light and dark from the --hax-ui-* tokens: the
   * 40px field, a full-width primary button, a muted prompt line that turns
   * to the danger colour only when a login fails
   */
  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminControls,
      css`
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--ddd-spacing-6, 24px) var(--ddd-spacing-6, 24px)
            var(--ddd-spacing-5, 20px);
          text-align: center;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        rpg-character {
          display: block;
          margin: 0 0 var(--hax-ui-gap-md) 0;
        }
        #errorText {
          margin: 0 0 var(--hax-ui-gap-lg);
          min-height: 1.4em;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--hax-ui-text-muted);
        }
        #errorText.failed {
          color: var(--hax-ui-danger);
        }
        #inputcontainer {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: var(--hax-ui-gap-md);
          width: min(320px, 100%);
        }
        .form-group {
          position: relative;
        }
        .form-group .hax-ui-input {
          padding-inline-end: 40px;
        }
        .hax-ui-btn.primary {
          justify-content: center;
          width: 100%;
          height: var(--hax-ui-field-height);
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
        }
        .notyou {
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text-muted);
        }
        .notyou a {
          color: var(--hax-ui-accent-strong);
          text-decoration: underline;
          cursor: pointer;
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .notyou a:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .visibility-icon {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--hax-ui-text-muted);
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-button-border-radius: var(--hax-ui-radius);
        }
        .visibility-icon:hover {
          color: var(--hax-ui-text);
        }
        .external {
          width: 100%;
          margin-top: var(--hax-ui-gap-lg);
        }
        .external:empty {
          display: none;
        }
        @media (max-width: 600px) {
          :host {
            padding: var(--ddd-spacing-4, 16px);
          }
        }
      `,
    ];
  }
  checkUsername() {
    const value = this.shadowRoot.querySelector("#username").value;
    this.hidePassword = false;
    this.errorMSG = "";
    this.username = value;
    store.appEl.playSound("click2");
    setTimeout(() => {
      this.shadowRoot.querySelector("input").focus();
    }, 0);
  }

  async checkPassword() {
    store.appEl.playSound("click2");

    const value = this.shadowRoot.querySelector("#password").value;
    // attempt login and wait for response from the jwt-login tag via
    // jwt-logged-in event @see _jwtLoggedIn
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-login", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: {
          username: this.username,
          password: value,
        },
      }),
    );
  }

  reset() {
    this.errorMSG = "";
    this.username = "";
    this.hasPass = false;
    this.hidePassword = true;
  }

  nameChange() {
    this.username = this.shadowRoot.querySelector("#username").value;
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("jwt-logged-in", this._jwtLoggedIn.bind(this), {
      signal: this.windowControllers.signal,
    });
    globalThis.addEventListener(
      "jwt-login-login-failed",
      this._jwtLoginFailed.bind(this),
      { signal: this.windowControllers.signal },
    );
  }

  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
  // implies that it failed to connect via the login credentials
  _jwtLoginFailed(_e) {
    this.hidePassword = true;
    this.errorMSG = this.t.invalidUsernameOrPassword;
    store.appEl.playSound("error");
  }
  _jwtLoggedIn(e) {
    if (e.detail) {
      store.user = {
        name: this.username,
      };
      store.appEl.playSound("success");
      this.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {},
        }),
      );
      store.toast(
        this.t.welcomeLetsGo.replace("{username}", () => this.username),
        5000,
        {
          hat: "construction",
        },
      );
      // just to be safe
      store.appEl.reset();
    }
  }

  passChange(_e) {
    const value = this.shadowRoot.querySelector("#password").value;
    if (value) {
      this.hasPass = true;
    } else {
      this.hasPass = false;
    }
  }
  toggleViewPass(e) {
    const password = this.shadowRoot.querySelector("#password");
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    e.target.icon = type === "text" ? "lrn:visible" : "lrn:view-off";
  }

  handleKeyDown(e) {
    if (e.key === "Enter") {
      if (this.hidePassword) {
        this.checkUsername();
      } else {
        this.checkPassword();
      }
    }
  }

  render() {
    return html`
      <rpg-character
        seed="${this.username}"
        width="88"
        height="110"
      ></rpg-character>
      <p
        id="errorText"
        class="${this.errorMSG === this.t.invalidUsernameOrPassword
          ? "failed"
          : ""}"
        role="status"
      >
        ${this.errorMSG}
      </p>
      <div id="inputcontainer">
        ${this.hidePassword
          ? html` <div class="form-group">
                <input
                  id="username"
                  class="hax-ui-input"
                  type="text"
                  placeholder="${this.t.enterYourUsername}"
                  aria-label="${this.t.username}"
                  @input="${this.nameChange}"
                  @keydown="${this.handleKeyDown}"
                />
              </div>
              <button
                class="hax-ui-btn primary"
                ?disabled="${!this.username}"
                @click=${this.checkUsername}
              >
                <simple-icon-lite icon="icons:arrow-forward"></simple-icon-lite>
                ${this.t.next}
              </button>`
          : html` <div class="notyou">
                ${this.t.welcomeBack.replace("{username}", () => this.username)}
                <a @click=${this.reset}>${this.t.notYou}</a>
              </div>
              <div class="form-group">
                <input
                  id="password"
                  class="hax-ui-input"
                  type="password"
                  placeholder="${this.t.enterYourPassword}"
                  aria-label="${this.t.password}"
                  @input="${this.passChange}"
                  @keydown="${this.handleKeyDown}"
                />
                <simple-icon-button-lite
                  icon="lrn:view-off"
                  tabindex="-1"
                  title="${this.t.togglePasswordDisplay}"
                  @click="${this.toggleViewPass}"
                  class="visibility-icon"
                ></simple-icon-button-lite>
              </div>
              <button
                class="hax-ui-btn primary"
                ?disabled="${!this.hasPass}"
                @click=${this.checkPassword}
              >
                <simple-icon-lite icon="icons:input"></simple-icon-lite>
                ${this.t.login}
              </button>`}
        <div class="external">
          <slot name="externalproviders"></slot>
        </div>
      </div>
    `;
  }
}
customElements.define(AppHaxSiteLogin.tag, AppHaxSiteLogin);
