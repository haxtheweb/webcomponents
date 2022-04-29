import { html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { localStorageSet } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/rpg-character/rpg-character.js";
import { autorun } from "mobx";
import { store } from "./AppHaxStore.js";
import { AppHaxAPI } from "./AppHaxBackendAPI.js";
export class AppHaxSiteLogin extends SimpleColors {
  // a convention I enjoy so you can change the tag name in 1 place
  static get tag() {
    return "app-hax-site-login";
  }

  // HTMLElement life-cycle, built in; use this for setting defaults
  constructor() {
    super();
    this.username = "";
    this.password = "";
    this.errorMSG = "Enter User name";
    this.hidePassword = true;
  }

  // properties that you wish to use as data in HTML, CSS, and the updated life-cycle
  static get properties() {
    return {
      ...super.properties,
      username: { type: String },
      password: { type: String },
      errorMSG: { type: String },
      hidePassword: { type: Boolean },
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
      ...super.styles,
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
          margin: 10px;
        }
        .external {
          text-align: center;
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
    // attempt login and wait for response
    const resp = await AppHaxAPI.makeCall("login", {
      username: this.username,
      password: value,
    });

    if (resp.status !== 200) {
      this.hidePassword = true;
      this.errorMSG = "Invalid Username or Password";
      store.appEl.playSound("error");
    } else {
      localStorageSet("jwt", resp.jwt);
      autorun(() => {
        store.user = {
          name: this.username,
        };
      });
      store.appEl.playSound("success");
      store.jwt = resp.jwt;

      this.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          cancelable: true,
          detail: {},
        })
      );
      store.toast(`Welcome ${this.username}! Let's go!`, 5000, {
        hat: "construction",
      });
      // just to be safe
      store.appEl.reset();
      // force return to home page to avoid state issues as we JUST logged in
      //store.appEl.shadowRoot.querySelector("#home").click();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  reset() {
    this.errorMSG = "";
    this.username = "";
    this.hidePassword = true;
  }

  nameChange() {
    this.username = this.shadowRoot.querySelector("#username").value;
  }

  render() {
    return html`
      <rpg-character seed="${this.username}"></rpg-character>
      <div id="inputcontainer">
        ${this.hidePassword
          ? html`<input
                id="username"
                type="text"
                placeholder="abc123@hax.camp"
                @input="${this.nameChange}"
              />
              <button @click=${this.checkUsername}>next</button>`
          : html`<p>
                Hey ${this.username}! <a @click=${this.reset}>not you?</a>
              </p>
              <input
                id="password"
                type="password"
                placeholder="enter password"
              />
              <button @click=${this.checkPassword}>Login</button>`}
        <div class="external">
          <slot name="externalproviders"></slot>
        </div>
      </div>
      <p id="errorText">${this.errorMSG}</p>
    `;
  }
}
customElements.define(AppHaxSiteLogin.tag, AppHaxSiteLogin);
