import { css, html, unsafeCSS } from "lit";
import { toJS, autorun } from "mobx";
import {
  localStorageSet,
  localStorageGet,
} from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { store } from "./lib/v1/AppHaxStore.js";
import { AppHaxAPI } from "./lib/v1/AppHaxBackendAPI.js";
import { SimpleTourManager } from "@lrnwebcomponents/simple-popover/lib/simple-tour.js";
import "@lrnwebcomponents/simple-colors-shared-styles/simple-colors-shared-styles.js";
import "./lib/v1/AppHaxRouter.js";
import "./lib/v1/app-hax-label.js";
import "./lib/v1/app-hax-top-bar.js";
import { SimpleTourFinder } from "@lrnwebcomponents/simple-popover/lib/SimpleTourFinder.js";

const haxLogo = new URL("./lib/assets/images/HAXLogo.svg", import.meta.url)
  .href;
const logoutBtn = new URL("./lib/assets/images/Logout.svg", import.meta.url)
  .href;
const helpBtn = new URL("./lib/assets/images/Help.svg", import.meta.url).href;
// toggle store darkmode
function darkToggle(e) {
  if (e.matches) {
    // dark mode
    store.darkMode = true;
  } else {
    // light mode
    store.darkMode = false;
  }
}

function soundToggle() {
  store.soundStatus = !toJS(store.soundStatus);
  localStorageSet("app-hax-soundStatus", toJS(store.soundStatus));
  store.appEl.playSound("click");
}

export class AppHax extends SimpleTourFinder(SimpleColors) {
  static get tag() {
    return "app-hax";
  }

  // eslint-disable-next-line class-methods-use-this
  playSound(sound) {
    if (store.soundStatus && store.appReady) {
      let playSound = [
        "click",
        "click2",
        "coin",
        "coin2",
        "hit",
        "success",
      ].includes(sound)
        ? sound
        : "hit";
      this.audio = new Audio(
        new URL(`./lib/assets/sounds/${playSound}.mp3`, import.meta.url).href
      );
      this.audio.volume = 0.5;
      this.audio.play();
    }
  }

  /**
   * A token refresh just failed so force to login prompt / state
   */
  _tokenRefreshFailed(e) {
    window.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: {},
      })
    );
    setTimeout(() => {
      this.reset(true);
    }, 100);
  }

  connectedCallback() {
    super.connectedCallback();
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", darkToggle);
    window.addEventListener("jwt-logged-in", this._jwtLoggedIn.bind(this));
    window.addEventListener(
      "jwt-login-refresh-error",
      this._tokenRefreshFailed.bind(this)
    );
  }

  disconnectedCallback() {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .removeEventListener("change", darkToggle);
    window.removeEventListener("jwt-logged-in", this._jwtLoggedIn.bind(this));
    window.removeEventListener(
      "jwt-login-refresh-error",
      this._tokenRefreshFailed.bind(this)
    );
    super.disconnectedCallback();
  }

  constructor() {
    super();
    this.__tour = SimpleTourManager;
    this.__tour.registerNewTour({
      key: "hax",
      name: "Let's learn HAX",
      style: `
      simple-popover-manager::part(simple-popover) {
        max-width: 250px;
      }
      simple-popover-manager button {
        font-family: 'Press Start 2P', sans-serif;
        font-size: 12px;
        margin: 0px 2px;
        color: var(--simple-colors-default-theme-grey-12);
      }
      simple-popover-manager p {
        font-family: 'Press Start 2P', sans-serif;
        padding: 0;
        margin: 0;
        width: 250px;
        font-size: 12px;
        line-height: 20px;
      }
      simple-popover-manager h1 {
        font-family: 'Press Start 2P', sans-serif;
        margin: 0;
        font-size: 12px;
        width: 250px;
        padding: 0;
      }
      simple-popover-manager::part(simple-popover-body),
      simple-popover-manager::part(simple-popover-heading) {
        color: black;
        background-color: white;
      }
      body.dark-mode simple-popover-manager::part(simple-popover-body),
      body.dark-mode simple-popover-manager::part(simple-popover-heading) {
        color: white;
        background-color: black;
      }
      body.dark-mode simple-popover-manager simple-icon-button-lite {
        color: white;
        background-color: black;
      }
      `,
    });
    this.tourName = "hax";
    autorun(() => {
      this.siteReady = toJS(store.siteReady);
    });
    autorun(() => {
      const badDevice = toJS(store.badDevice);
      if (badDevice === false) {
        import("@lrnwebcomponents/rpg-character/rpg-character.js");
        import("./lib/random-word/random-word.js");
      } else if (badDevice === true) {
        document.body.classList.add("bad-device");
      }
    });
    this.userMenuOpen = false;
    this.courses = [];
    this.activeItem = {};
    this.phrases = {
      new: [
        "What's ya name?",
        "HAX to the moon",
        "Welcome to the Jungle",
        "We like to party",
        "Build something awesome",
        "Everything is awesome!",
        "Everything is cool when you're part of the team",
        "When you're living our dream",
      ],
      return: [
        "Welcome back, take 2?",
        "That wasn't very long",
        "Sup?",
        "You again? Awesome!",
        "Let's do this",
        "There can only be one ring...",
        "There is another",
        "Fancy that, I love HAX and you show up",
      ],
    };
    this.isNewUser = null;
    this.basePath = "/";
    this.searchTerm = "";
    this.appMode = "";
    this.soundIcon = "";
    // full on store that does the heavy lifting
    this.store = store;
    // centralized sound source to not flood sounds when playing
    this.sound = new Audio();
    // @todo need this from app deploy itself
    autorun(() => {
      this.isNewUser = toJS(store.isNewUser);
      if (
        this.isNewUser &&
        toJS(store.appMode) !== "create" &&
        toJS(store.appMode) !== "404"
      ) {
        store.appMode = "create";
        setTimeout(() => {
          store.createSiteSteps = true;
        }, 0);
      }
    });
    autorun(() => {
      this.userName = toJS(store.user.name);
    });
    autorun(() => {
      this.appMode = toJS(store.appMode);
    });
    autorun(() => {
      this.searchTerm = toJS(store.searchTerm);
    });

    /**
     * When location changes update activeItem / mode of app
     */
    autorun(async () => {
      const location = toJS(store.location);
      if (location && location.route) {
        // verify this is a step vs other operations
        if (!location.route.step) {
          // support external site links
          if (location.route.slug) {
            this.reset();
            setTimeout(() => {
              window.location = location.route.slug;
            }, 0);
          }
          // page miss is high check too
          else if (location.route.name === "404") {
            store.createSiteSteps = false;
            store.appMode = "404";
            setTimeout(() => {
              store.toast("the page miss.. it burns!!!", 3000, {
                fire: true,
                walking: true,
              });
            }, 500);
          }
          // then home / landing page which is default expectation
          else if (
            location.route.name === "home" ||
            location.route.name === "search"
          ) {
            store.appMode = "home";
            store.createSiteSteps = false;
          } else {
            //console.warn(location.route);
          }
        } else {
          // we have a "step" based operation
          store.appMode = "create";
          store.createSiteSteps = true;
        }
      }
    });

    autorun(() => {
      if (store.routes.length > 0 && store.location === null) {
        store.location = toJS(store.routes[0]);
      }
    });
    // manage dark mode
    // only set this initially if we don't have an app state of our own
    if (localStorageGet("app-hax-darkMode", null) === null) {
      store.darkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    }
    autorun(() => {
      localStorageSet("app-hax-darkMode", toJS(store.darkMode));
      if (toJS(store.darkMode)) {
        document.body.classList.add("dark-mode");
        store.toast("I'm ascared of the dark", 2000, { fire: true });
        this.dark = true;
      } else {
        document.body.classList.remove("dark-mode");
        store.toast("Sunny day it is", 2000, { hat: "random" });
        this.dark = false;
      }
    });
    autorun(() => {
      const mode = toJS(store.appMode);
      if (mode) {
        document.body.classList.remove("app-hax-search");
        document.body.classList.remove("app-hax-create");
        document.body.classList.remove("app-hax-404");
        document.body.classList.remove("app-hax-home");
        document.body.classList.add(`app-hax-${mode}`);
      }
    });
  }

  static get properties() {
    return {
      ...super.properties,
      courses: { type: Array },
      userName: { type: String },
      activeItem: { type: Object },
      soundIcon: { type: String },
      searchTerm: { type: String },
      appMode: { type: String }, // minor context of what we're doing in the app for rendering
      isNewUser: { type: Boolean },
      phrases: { type: Object },
      userMenuOpen: { type: Boolean }, // leave here to ensure hat change and sound effects happen
      siteReady: { type: Boolean },
      basePath: { type: String, attribute: "base-path" },
      token: { type: String },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  reset(reload = false) {
    // localStorage possible to be blocked by permission of system
    try {
      window.localStorage.removeItem("app-hax-step");
      window.localStorage.removeItem("app-hax-site");
      if (reload) {
        // should always be a base tag for a SPA but just checking
        if (document.querySelector("base")) {
          window.location = document.querySelector("base").href;
        } else {
          window.location.reload();
        }
      }
    } catch (e) {
      //console.warn(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  logout() {
    window.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: true,
      })
    );
    this.closeMenu();
    this.__logoutUserAction = true;
  }
  // only care about logouts
  _jwtLoggedIn(e) {
    if (e.detail === false && this.__logoutUserAction) {
      this.__logoutUserAction = false;
      setTimeout(() => {
        this.reset(true);
      }, 100);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  login() {
    import("./lib/v1/app-hax-site-login.js").then(() => {
      const p = document.createElement("app-hax-site-login");
      if (this.querySelector('[slot="externalproviders"]')) {
        const cloneSlot = this.querySelector(
          '[slot="externalproviders"]'
        ).cloneNode(true);
        p.appendChild(cloneSlot);
      }
      import("@lrnwebcomponents/simple-modal/simple-modal.js").then(() => {
        setTimeout(() => {
          this.dispatchEvent(
            new CustomEvent("simple-modal-show", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: {
                title: "< login >",
                elements: { content: p },
                modal: true,
                styles: {
                  "--simple-modal-titlebar-background": "transparent",
                  "--simple-modal-titlebar-color": "black",
                  "--simple-modal-width": "40vw",
                  "--simple-modal-min-width": "300px",
                  "--simple-modal-z-index": "100000000",
                  "--simple-modal-height": "62vh",
                  "--simple-modal-min-height": "400px",
                  "--simple-modal-titlebar-height": "64px",
                },
              },
            })
          );
        }, 0);
      });
    });
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          --app-hax-background-color-active: var(--app-hax-accent-color);
        }
        .wired-button-label {
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          height: 1px;
          overflow: hidden;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }
        .topbar-character {
          cursor: pointer;
          display: inline-block;
          border: none;
          border-radius: 0px;
          padding: 0 8px;
          margin: 0 0 0 16px;
          background-color: transparent;
          height: 48px;
          max-width: 160px;
        }
        .characterbtn-name {
          font-family: "Press Start 2P", sans-serif;
          margin-left: 8px;
          font-size: 12px;
          vertical-align: bottom;
          line-height: 48px;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 48px;
          word-break: break-all;
        }
        .topbar-character:hover,
        .topbar-character:focus {
          background-color: var(--simple-colors-default-theme-light-blue-4);
          outline: var(--haxcms-color) solid 3px;
          outline-offset: -3px;
          height: 48px;
        }
        .topbar-character rpg-character {
          margin: -4px -14px 0px -10px;
          height: 52px;
          width: 64px;
          display: inline-block;
        }
        .content {
          text-align: center;
          margin-top: 24px;
        }
        .four04-character {
          margin-top: 16px;
        }
        .start-journey {
          display: flex;
          padding-top: 40px;
          justify-content: center;
        }
        app-hax-site-button {
          max-width: 60vw;
          justify-content: center;
        }
        app-hax-top-bar {
          top: 0;
          z-index: 1000;
          right: 0;
          left: 0;
          position: fixed;
        }
        @media (max-width: 780px) {
          app-hax-top-bar::part(top-bar) {
            grid-template-columns: 20% 20% 60%;
          }
        }
        @media (max-width: 600px) {
          app-hax-top-bar::part(top-bar) {
            grid-template-columns: 10% 30% 60%;
          }
        }
        .label {
          text-align: center;
        }
        app-hax-label {
          animation: 0.8s ease-in-out 0s scrollin;
          -webkit-animation: 0.8s ease-in-out 0s scrollin;
          display: block;
          overflow: hidden;
        }
        app-hax-label h1 {
          font-weight: normal;
          font-size: 4vw;
          margin: 0;
          padding: 0;
        }
        @keyframes scrollin {
          from {
            margin-top: -240px;
            margin-bottom: 240px;
          }
          to {
            margin-top: 0;
            margin-bottom: 0;
          }
        }
        .haxLogo {
          --simple-icon-height: 40px;
          --simple-icon-width: 40px;
          margin: 4px;
          color: var(--simple-colors-default-theme-grey-12);
          cursor: pointer;
        }
        .soundToggle {
          margin-right: 16px;
          position: relative;
          display: inline-flex;
          vertical-align: top;
        }

        .soundToggle img {
          width: 24px;
          height: 24px;
        }

        app-hax-search-bar {
          vertical-align: middle;
          display: inline-flex;
        }
        main {
          padding-top: 80px;
        }
        @media (max-width: 900px) {
          .characterbtn-name {
            display: none;
          }
          main {
            padding-top: 64px;
          }
        }
        app-hax-user-menu {
          z-index: 1003;
        }
        .logout::part(menu-button) {
          background-image: url("${unsafeCSS(logoutBtn)}");
          background-repeat: no-repeat;
          background-position: center;
          text-align: center;
          background-size: cover;
          border-top: 0px;
          border-bottom: 0px;
          padding: 10px;
        }
        app-hax-user-menu app-hax-user-menu-button::part(menu-button) {
          font-family: "Press Start 2P", sans-serif;
          font-size: 12px;
        }

        random-word:not(:defined) {
          display: none;
        }
        random-word {
          transform: rotate(25deg);
          position: absolute;
          right: 10px;
          top: 120px;
          padding: 12px;
          font-size: 12px;
          border: 4px solid var(--simple-colors-default-theme-grey-12);
          background-color: var(--simple-colors-default-theme-yellow-5);
          color: var(--simple-colors-default-theme-grey-12);
          width: 100px;
          word-wrap: break-word;
          text-align: center;
          cursor: pointer;
          user-select: none;
          opacity: 1;
          visibility: visible;
          transition: all 0.3s ease-in-out;
        }
        #helpbtn {
          --simple-icon-height: 50px;
          --simple-icon-width: 50px;
          right: 200px;
          top: 100px;
          padding: 4px;
          background-color: var(--simple-colors-default-theme-grey-1);
          border-radius: 50%;
          position: absolute;
          color: var(--simple-colors-default-theme-grey-12);
          border: var(--simple-colors-default-theme-grey-12) 4px solid;
          cursor: pointer;
        }
        @media (max-width: 800px) {
          app-hax-site-button {
            width: 320px;
            max-width: 60vw;
            --app-hax-site-button-font-size: 16px;
          }
          #helpbtn {
            --simple-icon-height: 40px;
            --simple-icon-width: 40px;
            right: 8px;
            top: 64px;
            padding: 2px;
            border: var(--simple-colors-default-theme-grey-12) 2px solid;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          app-hax-label {
            animation: none;
            -webkit-animation: none;
          }
        }
        @media (max-width: 680px) {
          random-word {
            visibility: none;
            opacity: 0;
          }
        }
        @media (max-height: 700px) {
          .content {
            margin-top: 4px;
          }
          random-word {
            visibility: none;
            opacity: 0;
          }
          .start-journey {
            padding-top: 0;
          }
        }
        @media (max-height: 500px) {
          app-hax-label h1 {
            font-family: monospace;
            font-weight: normal;
            font-size: 4vw;
            margin: 0;
            padding: 0;
          }
        }
      `,
    ];
  }
  helpClick() {
    // start the tour
    store.appEl.playSound("coin2");
    this.__tour.startTour("hax");
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // update the store as these get set via entrypoint of the app
    // but used downstream in calls
    changedProperties.forEach((oldValue, propName) => {
      // API backend broker settings
      if (["basePath"].includes(propName) && this[propName]) {
        store.AppHaxAPI[propName] = this[propName];
      }
      // settings for the store itself
      if (["token"].includes(propName) && this[propName]) {
        store[propName] = this[propName];
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // required for our early siteList updating
    if (store.AppHaxAPI && this.basePath) {
      store.AppHaxAPI.basePath = this.basePath;
    }
    import("./lib/v1/app-hax-steps.js");
    import("./lib/v1/app-hax-site-button.js");
    import("wired-elements/lib/wired-button.js");
    import("./lib/v1/app-hax-toast.js");
    import("./lib/v1/app-hax-wired-toggle.js");
    import("./lib/v1/app-hax-search-bar.js");
    import("./lib/v1/app-hax-search-results.js");
    import("./lib/v1/app-hax-user-menu.js");
    import("./lib/v1/app-hax-user-menu-button.js");
    this.dispatchEvent(
      new CustomEvent("app-hax-loaded", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: true,
      })
    );
    store.appReady = true;
    autorun(() => {
      if (toJS(store.appReady)) {
        document.body.classList.add("app-loaded");
      } else {
        document.body.classList.remove("app-loaded");
      }
    });
    store.appEl = this;
    autorun(() => {
      if (store.activeItem) {
        this.activeItem = toJS(store.activeItem);
      }
    });
    autorun(() => {
      this.soundIcon = toJS(store.soundStatus)
        ? new URL("./lib/assets/images/FullVolume.svg", import.meta.url).href
        : new URL("./lib/assets/images/Silence.svg", import.meta.url).href;
      if (!toJS(store.soundStatus)) {
        store.toast("Sound off.. hey! HELLO!?!", 2000, { fire: true });
      } else {
        store.toast("You can hear me now? Good.", 2000, { hat: "random" });
      }
    });
    // App is ready and the user is Logged in
    autorun(async () => {
      if (
        toJS(store.appReady) &&
        store.AppHaxAPI &&
        toJS(store.isLoggedIn) &&
        toJS(store.appSettings) &&
        toJS(store.refreshSiteList)
      ) {
        // Need this for the auto run when testing new user
        // if we get new data source, trigger a rebuild of the site list
        const results = await AppHaxAPI.makeCall("getSitesList");
        store.manifest = results.data;
      } else if (toJS(store.appReady) && !toJS(store.isLoggedIn)) {
        this.login();
      }
    });
  }

  toggleMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    store.appEl.playSound("click");
  }

  closeMenu() {
    if (this.userMenuOpen) {
      this.userMenuOpen = !this.userMenuOpen;
      this.shadowRoot.querySelector("#user-menu").removeAttribute("isOpen");
    }
  }

  render() {
    return html`<app-hax-router></app-hax-router>
      <header>
        <app-hax-top-bar>
          <slot name="app-header-pre"></slot>
          <a id="home" href="home" tabindex="-1" slot="left">
            <simple-icon-lite
              id="hlogo"
              src="${haxLogo}"
              tabindex="0"
              class="haxLogo"
              title="Home"
              data-simple-tour-stop
              data-stop-title="data-label"
              data-label="Home"
            >
              <div data-stop-content slot="tour" style="display:none;">
                You can come back to this home screen whenever you click this..
              </div>
            </simple-icon-lite>
          </a>
          <simple-tooltip for="hlogo" position="right" slot="left"
            >Home</simple-tooltip
          >
          <app-hax-search-bar
            slot="center"
            ?disabled="${this.isNewUser}"
          ></app-hax-search-bar>
          <wired-button
            elevation="1"
            slot="right"
            class="soundToggle"
            id="soundtb"
            @click="${soundToggle}"
          >
            <span class="wired-button-label">Toggle sound effects</span>
            <simple-icon-lite
              src="${this.soundIcon}"
              loading="lazy"
              decoding="async"
              data-simple-tour-stop
              data-stop-title="data-label"
              data-label="Sound"
            >
              <div slot="tour" data-stop-content>
                Not a fan of the awesome sound effects, you can mute them but I
                highly suggest you dont.....or else.
              </div>
            </simple-icon-lite>
          </wired-button>
          <simple-tooltip for="soundtb" position="bottom" slot="right"
            >Toggle sound</simple-tooltip
          >
          <app-hax-wired-toggle id="wt" slot="right"></app-hax-wired-toggle>
          <simple-tooltip for="wt" position="bottom" slot="right"
            >Toggle dark mode</simple-tooltip
          >
          <app-hax-user-menu
            slot="right"
            id="user-menu"
            data-simple-tour-stop
            data-stop-title="data-label"
            data-label="Menu"
          >
            <div slot="tour" data-stop-content>
              You want to log out and be someone else? You want to check your
              sites option? Click your character. Fun Fact....your character is
              unique to you.
            </div>
            <button class="topbar-character" slot="menuButton" id="tbchar">
              <rpg-character
                seed="${this.userName}"
                width="68"
                height="68"
                aria-label="System menu"
                title="System menu"
                hat="${this.userMenuOpen ? "edit" : "none"}"
                @click="${this.toggleMenu}"
              ></rpg-character>
              <span class="characterbtn-name">${this.userName}</span>
            </button>
            <!-- <app-hax-user-menu-button
              slot="main-menu"
              icon="face"
              label="Account Info"
            ></app-hax-user-menu-button> -->
            <app-hax-user-menu-button
              slot="post-menu"
              class="logout"
              label="Logout"
              @click=${this.logout}
            ></app-hax-user-menu-button>
          </app-hax-user-menu>
          <simple-tooltip for="tbchar" position="bottom" slot="right"
            >System menu</simple-tooltip
          >
        </app-hax-top-bar>
      </header>
      <main @click="${this.closeMenu}">
        <confetti-container id="confetti">
          <div class="label">
            <app-hax-label>
              ${this.activeItem && !this.siteReady
                ? html`
                    <h1>${this.activeItem.label}</h1>
                    <div slot="subtitle">
                      ${this.activeItem && this.activeItem.statement
                        ? this.activeItem.statement.replace(
                            ":structure",
                            toJS(store.site.structure)
                          )
                        : ""}
                    </div>
                  `
                : ``}
              ${this.activeItem && this.siteReady
                ? html`
                    <h1>${toJS(store.site.name)}</h1>
                    <div slot="subtitle">
                      Is all ready, are you ready to build?
                    </div>
                  `
                : ``}
            </app-hax-label>
          </div>
          <random-word
            key="${this.isNewUser ? `new` : `return`}"
            .phrases="${this.phrases}"
            @click="${this.getNewWord}"
          ></random-word>
          <simple-icon-lite
            id="helpbtn"
            @click="${this.helpClick}"
            src="${helpBtn}"
          >
          </simple-icon-lite>
          <simple-tooltip for="helpbtn" position="bottom">Help</simple-tooltip>
          <section class="content">${this.appBody(this.appMode)}</section>
        </confetti-container>
      </main>`;
  }

  getNewWord() {
    this.shadowRoot.querySelector("random-word").getNewWord();
    store.appEl.playSound("click");
  }

  appBody(routine) {
    let template = html``;
    switch (routine) {
      case "home":
      case "search":
        template = this.templateHome();
        break;
      case "create":
        template = this.templateCreate();
        break;
      case "404":
      default:
        template = this.template404();
        break;
    }
    return template;
  }

  templateHome() {
    return html` ${!this.searchTerm
        ? html` <div class="start-journey">
            <a
              href="createSite-step-1"
              @click="${this.startJourney}"
              tabindex="-1"
            >
              <app-hax-site-button
                label="&gt; Start new journey"
              ></app-hax-site-button>
            </a>
          </div>`
        : ``}

      <app-hax-search-results></app-hax-search-results>`;
  }

  // eslint-disable-next-line class-methods-use-this
  templateCreate() {
    return html`<app-hax-steps
      @promise-progress-finished="${this.siteReadyToGo}"
    ></app-hax-steps>`;
  }

  siteReadyToGo(e) {
    import("@lrnwebcomponents/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        setTimeout(() => {
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
    if (e.detail) {
      store.siteReady = true;
    }
  }

  template404() {
    return html` <div class="four04">
      <a
        href="createSite-step-1"
        class="start-journey"
        @click="${this.startJourney}"
        tabindex="-1"
      >
        <app-hax-site-button
          label="&gt; Start a new journey"
        ></app-hax-site-button>
      </a>
      <rpg-character
        class="four04-character"
        fire
        walking
        width="200"
        id="char404"
        height="200"
        seed="${this.userName}"
      ></rpg-character>
      <simple-tooltip for="char404" position="left">This</simple-tooltip>
      <simple-tooltip for="char404" position="right">fine</simple-tooltip>
      <simple-tooltip for="char404" position="bottom">is</simple-tooltip>
    </div>`;
  }

  // ensure internal data is unset for store
  startJourney() {
    store.createSiteSteps = false;
    store.siteReady = false;
    store.site.structure = null;
    store.site.type = null;
    store.site.theme = null;
    store.site.name = null;
    store.appMode = "create";
    store.appEl.playSound("click2");
  }
}
customElements.define(AppHax.tag, AppHax);

window.AppHax = window.AppHax || {};

window.AppHax.requestAvailability = () => {
  if (!window.AppHax.instance) {
    window.AppHax.instance = document.querySelector(AppHax.tag);
  }
  return window.AppHax.instance;
};
