import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import { store } from "./AppHaxStore.js";
export class AppHaxSiteLogin extends DDDSuper(LitElement) {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-site-login";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.username = "";
    this.password = "";
    this.errorMSG = "Enter User name";
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

  firstUpdated() {
    super.firstUpdated();
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
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: var(--ddd-spacing-6, 24px);
          text-align: center;
          font-family: var(--ddd-font-primary, sans-serif);
          background: var(--ddd-theme-default-white, white);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
        }

        rpg-character {
          display: block;
          margin: 0 0 var(--ddd-spacing-4, 16px) 0;
          width: 120px;
          height: 120px;
        }

        #errorText {
          color: var(--ddd-theme-default-original87Pink, #e4007c);
          font-size: var(--ddd-font-size-xs, 14px);
          margin: var(--ddd-spacing-2, 8px) 0;
          min-height: var(--ddd-spacing-5, 20px);
          font-weight: var(--ddd-font-weight-medium, 500);
        }

        #inputcontainer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: var(--ddd-spacing-4, 16px);
        }

        .form-group {
          width: 100%;
          position: relative;
        }

        input {
          width: 100%;
          padding: var(--ddd-spacing-3, 12px);
          border: var(--ddd-border-sm, 2px solid)
            var(--ddd-theme-default-slateGray, #666);
          border-radius: var(--ddd-radius-sm, 4px);
          font-size: var(--ddd-font-size-s, 16px);
          font-family: var(--ddd-font-primary, sans-serif);
          box-sizing: border-box;
          transition: border-color 0.2s ease;
          background-color: var(--ddd-theme-default-limestoneMaxLight, #f5f5f5);
          color: var(--ddd-theme-default-coalyGray, #444);
        }

        input:focus {
          outline: none;
          border-color: var(--ddd-theme-default-nittanyNavy, #001e44);
        }

        input::placeholder {
          color: var(--ddd-theme-default-slateGray, #666);
          text-transform: capitalize;
        }

        button {
          padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-4, 16px);
          border-radius: var(--ddd-radius-sm, 4px);
          font-size: var(--ddd-font-size-s, 16px);
          font-weight: var(--ddd-font-weight-medium, 500);
          font-family: var(--ddd-font-primary, sans-serif);
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2, 8px);
          width: 100%;
          min-height: var(--ddd-spacing-10, 40px);
          background: var(--ddd-theme-default-nittanyNavy, #001e44);
          color: var(--ddd-theme-default-white, white);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        button:hover:not(:disabled) {
          background: var(--ddd-theme-default-keystoneYellow, #ffd100);
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          transform: translateY(-1px);
          box-shadow: var(--ddd-boxShadow-md);
        }

        .notyou {
          padding: var(--ddd-spacing-2, 8px);
          font-size: var(--ddd-font-size-s, 16px);
          color: var(--ddd-theme-default-coalyGray, #444);
        }

        .notyou a {
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
          text-decoration: underline;
          cursor: pointer;
          font-weight: var(--ddd-font-weight-medium, 500);
        }

        .notyou a:hover {
          color: var(--ddd-theme-default-keystoneYellow, #ffd100);
        }

        .visibility-icon {
          position: absolute;
          right: var(--ddd-spacing-3, 12px);
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: var(--ddd-theme-default-slateGray, #666);
          cursor: pointer;
          padding: var(--ddd-spacing-1, 4px);
          border-radius: var(--ddd-radius-xs, 2px);
          transition: color 0.2s ease;
          --simple-icon-width: var(--ddd-icon-xs, 16px);
          --simple-icon-height: var(--ddd-icon-xs, 16px);
        }

        .visibility-icon:hover {
          color: var(--ddd-theme-default-nittanyNavy, #001e44);
        }

        .external {
          text-align: center;
          width: 100%;
          margin-top: var(--ddd-spacing-4, 16px);
        }

        @media (max-width: 600px) {
          :host {
            padding: var(--ddd-spacing-4, 16px);
          }

          rpg-character {
            width: 80px;
            height: 80px;
          }

          button {
            font-size: var(--ddd-font-size-xs, 14px);
            padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          }
        }
      `,
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  checkUsername() {
    // eslint-disable-next-line prefer-destructuring
    const value = this.shadowRoot.querySelector("#username").value;
    this.hidePassword = false;
    this.errorMSG = "";
    this.username = value;
    store.appEl.playSound("click2");
    setTimeout(() => {
      this.shadowRoot.querySelector("input").focus();
    }, 0);
  }

  // eslint-disable-next-line class-methods-use-this
  async checkPassword() {
    store.appEl.playSound("click2");
    // eslint-disable-next-line prefer-destructuring
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

  // eslint-disable-next-line class-methods-use-this
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
  _jwtLoginFailed(e) {
    this.hidePassword = true;
    this.errorMSG = "Invalid Username or Password";
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
      store.toast(`Welcome ${this.username}! Let's go!`, 5000, {
        hat: "construction",
      });
      // just to be safe
      store.appEl.reset();
    }
  }

  passChange(e) {
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

  render() {
    return html`
      <rpg-character seed="${this.username}"></rpg-character>
      <p id="errorText">${this.errorMSG}</p>
      <div id="inputcontainer">
        ${this.hidePassword
          ? html` <div class="form-group">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  aria-label="Username"
                  @input="${this.nameChange}"
                />
              </div>
              <button
                ?disabled="${!this.username}"
                @click=${this.checkUsername}
              >
                <simple-icon-lite icon="icons:arrow-forward"></simple-icon-lite>
                Next
              </button>`
          : html` <div class="notyou">
                Welcome back, ${this.username}!
                <a @click=${this.reset}>Not you?</a>
              </div>
              <div class="form-group">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  aria-label="Password"
                  @input="${this.passChange}"
                />
                <simple-icon-button-lite
                  icon="lrn:view-off"
                  tabindex="-1"
                  title="Toggle password display"
                  @click="${this.toggleViewPass}"
                  class="visibility-icon"
                ></simple-icon-button-lite>
              </div>
              <button ?disabled="${!this.hasPass}" @click=${this.checkPassword}>
                <simple-icon-lite icon="icons:login"></simple-icon-lite>
                Login
              </button>`}
        <div class="external">
          <slot name="externalproviders"></slot>
        </div>
      </div>
    `;
  }
}
customElements.define(AppHaxSiteLogin.tag, AppHaxSiteLogin);
