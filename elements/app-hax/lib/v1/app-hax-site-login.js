import { html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import { store } from "./AppHaxStore.js";
export class AppHaxSiteLogin extends SimpleColors {
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
        }
        #inputcontainer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        a {
          color: red;
        }

        // This does not work
        #errorText > p {
          visibility: hidden;
          background-color: lightblue;
          color: red;
          font-weight: bold;
        }
        rpg-character {
          display: block;
          margin: 0px;
        }
        .external {
          text-align: center;
        }
        input {
          font-family: "Press Start 2P", sans-serif;
          font-size: 28px;
          padding: 8px;
          border: 4px solid black;
          border-radius: 8px;
          width: 75%;
        }
        button {
          font-family: "Press Start 2P", sans-serif;
          font-size: 30px;
          padding: 8px;
          border: 4px solid black;
          border-radius: 8px;
          min-width: 50%;
          margin: 16px;
        }
        button:focus,
        button:hover {
          background-color: var(--simple-colors-default-theme-green-8);
          color: var(--simple-colors-default-theme-grey-1);
          outline: 2px solid var(--simple-colors-default-theme-grey-1);
          cursor: pointer;
        }
        .notyou {
          padding: 8px;
        }
        .visibility-icon {
          color: var(--simple-colors-default-theme-grey-12);
          background-color: var(--simple-colors-default-theme-grey-3);
          border: 2px solid var(--simple-colors-default-theme-grey-12);
          position: relative;
          margin-top: -44px;
          margin-bottom: 20px;
          margin-left: 70%;
          z-index: 1;
          padding: 2px;
          --simple-icon-width: 26px;
          --simple-icon-height: 26px;
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
          ? html`<input
                id="username"
                type="text"
                placeholder="user name"
                aria-label="user name"
                @input="${this.nameChange}"
              />
              <button
                ?disabled="${!this.username}"
                @click=${this.checkUsername}
              >
                Next &gt;
              </button>`
          : html`<div class="notyou">
                Hey ${this.username}! <a @click=${this.reset}>not you?</a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="password"
                @input="${this.passChange}"
              />
              <simple-icon-button-lite
                icon="lrn:view-off"
                tabindex="-1"
                title="Toggle password display"
                @click="${this.toggleViewPass}"
                class="visibility-icon"
              ></simple-icon-button-lite>
              <button ?disabled="${!this.hasPass}" @click=${this.checkPassword}>
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
