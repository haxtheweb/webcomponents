import { css, html, unsafeCSS } from "lit";
import { toJS, autorun } from "mobx";
import { localStorageSet, localStorageGet } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { store } from "./lib/v1/AppHaxStore.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { AppHaxAPI } from "./lib/v1/AppHaxBackendAPI.js";
import { SimpleTourManager } from "@haxtheweb/simple-popover/lib/simple-tour.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";
import "@haxtheweb/simple-colors-shared-styles/simple-colors-shared-styles.js";
import "./lib/v1/AppHaxRouter.js";
import "./lib/v1/app-hax-label.js";
import "./lib/v1/app-hax-top-bar.js";
import { SimpleTourFinder } from "@haxtheweb/simple-popover/lib/SimpleTourFinder.js";

const logoutBtn = new URL("./lib/assets/images/Logout.svg", import.meta.url)
  .href;
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

export class AppHax extends I18NMixin(SimpleTourFinder(SimpleColors)) {
  static get tag() {
    return "app-hax";
  }

  _openExternalLink(link) {
    globalThis.open(link, "_blank");
  }

  async _haxStoreContribute(type, tags, daemonTerm = null) {
    let body = "";
    if (type == "merlin") {
      var title = `[${type}] New command request from HAX daemon`;
      body = `Location: ${globalThis.location.href}
Merlin command: ${daemonTerm}
What did you want merlin to do?
`;
    } else {
      var title = `[${type}] User report from HAX daemon`;
      body = `Location: ${globalThis.location.href}
Browser: ${navigator.userAgent}
OS: ${navigator.userAgentData.platform} - ${navigator.deviceMemory}GB RAM - ${navigator.hardwareConcurrency} cores
Screen: ${globalThis.screen.width}x${globalThis.screen.height}
Window size: ${globalThis.innerWidth}x${globalThis.innerHeight}
`;
      if (navigator.getBattery) {
        const stats = await globalThis.navigator.getBattery();
        body += `Battery: ${stats.level * 100}%
`;
      }
      // some things report the "type" of internet connection speed
      // for terrible connections lets save frustration
      if (
        navigator.connection &&
        globalThis.navigator.connection.effectiveType
      ) {
        body += `Connection: ${navigator.connection.effectiveType}
`;
      }
      body += `${type == "feature" ? `Your idea:` : `Bug you experienced:`}
`;
    }
    globalThis.open(
      `https://github.com/haxtheweb/issues/issues/new?assignees=&labels=${tags}&template=issue-report.md&title=${title}&body=${encodeURIComponent(
        body,
      )}`,
      "_blank",
    );
  }
  // eslint-disable-next-line class-methods-use-this
  playSound(sound = "coin2") {
    return new Promise((resolve) => {
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
          new URL(`./lib/assets/sounds/${playSound}.mp3`, import.meta.url).href,
        );
        this.audio.volume = 0.3;
        this.audio.onended = (event) => {
          resolve();
        };
        this.audio.play();
        // resolve after 1s if sound failed to load
        setTimeout(() => {
          resolve();
        }, 1000);
      } else {
        resolve();
      }
    });
  }

  /**
   * A token refresh just failed so force to login prompt / state
   */
  _tokenRefreshFailed(e) {
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: true,
      }),
    );
    setTimeout(() => {
      this.reset(true);
    }, 100);
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", darkToggle, {
        signal: this.windowControllers.signal,
      });
    globalThis.addEventListener("jwt-logged-in", this._jwtLoggedIn.bind(this), {
      signal: this.windowControllers.signal,
    });

    globalThis.addEventListener(
      "jwt-login-refresh-error",
      this._tokenRefreshFailed.bind(this),
      { signal: this.windowControllers.signal },
    );
  }

  goToLocation(location) {
    globalThis.location = location;
  }

  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }

  constructor() {
    super();
    this.unlockComingSoon = false;
    this.unlockTerrible = false;
    this.t = this.t || {};

    this.t = {
      ...this.t,
      selectPage: "Select page",
      backToSiteList: "Back to site list",
      listMySites: "List my sites",
      cancel: "Cancel",
      editDetails: "Page details",
      add: "Add",
      editSettings: "Edit settings",
      source: "Source",
      viewSource: "View source",
      findMedia: "Find media",
      undo: "Undo",
      redo: "Redo",
      media: "Media",
      outline: "Outline",
      blocks: "Blocks",
      addBlock: "Add block",
      addPage: "Add page",
      addChildPage: "Add child page",
      clonePage: "Clone page",
      delete: "Delete page",
      siteSettings: "Site settings",
      close: "Close",
      settings: "Settings",
      edit: "Edit",
      configureBlock: "Configure block",
      configure: "Configure",
      save: "Save",
      home: "Home",
      startNewJourney: "Start new journey",
      newJourney: "New Journey",
      accountInfo: "Account Info",
      outlineDesigner: "Outline designer",
      pageOutline: "Page outline",
      more: "More",
      siteActions: "Site actions",
      insights: "Insights dashboard",
      merlin: "Merlin",
      summonMerlin: "Summon Merlin",
      logOut: "Log out",
      menu: "Menu",
      showMore: "More",
    };
    if (
      typeof globalThis.speechSynthesis !== "undefined" &&
      (globalThis.SpeechRecognition ||
        globalThis.webkitSpeechRecognition ||
        globalThis.mozSpeechRecognition ||
        globalThis.msSpeechRecognition ||
        globalThis.oSpeechRecognition)
    ) {
      SuperDaemonInstance.voiceSearch = true;
    }
    SuperDaemonInstance.icon = "hax:wizard-hat";
    SuperDaemonInstance.appendContext("*");
    // ensure we are running HAX / ready and in edit mode before allowing commands to go through
    SuperDaemonInstance.allowedCallback = () => {
      if (toJS(store.appReady) && toJS(store.isLoggedIn)) {
        return true;
      }
      return false;
    };

    // contribution helpers
    SuperDaemonInstance.defineOption({
      title: "Tour of top menu buttons",
      icon: "help",
      tags: ["Help", "ui", "tour"],
      priority: -1000,
      value: {
        target: this,
        method: "helpClick",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/app/tour",
      context: ["*"],
    });

    // contribution helpers
    SuperDaemonInstance.defineOption({
      title: "Unlock hidden features",
      icon: "hax:hax2022",
      tags: ["Developer", "features", "hidden"],
      value: {
        target: this,
        method: "fireUnlocked",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: ">developer/hax/unlockAll",
      context: [">"],
    });
    // contribution helpers
    SuperDaemonInstance.defineOption({
      title: "Unlock terrible 2000s themes",
      icon: "hax:table-multiple",
      tags: ["Developer", "terrible", "2000", "tables"],
      value: {
        target: this,
        method: "fireTerrible",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: ">developer/hax/terrible2000s",
      context: [">"],
    });
    SuperDaemonInstance.defineOption({
      title: "Go to site",
      icon: "hax:hax2022",
      tags: ["Sites", "Administration", "change"],
      eventName: "super-daemon-run-program",
      path: "HAX/action/goToSite",
      value: {
        name: "Go to site",
        program: async (input, values) => {
          let results = [];
          const items = toJS(store.manifest.items);
          items.forEach(async (site) => {
            if (
              input == "" ||
              (site.metadata.site &&
                site.metadata.site.name &&
                site.metadata.site.name.includes(input))
            ) {
              results.push({
                title: site.title,
                icon:
                  site.metadata.theme &&
                  site.metadata.theme.variables &&
                  site.metadata.theme.variables.icon
                    ? site.metadata.theme.variables.icon
                    : "hax:hax2022",
                tags: ["site", site.description],
                value: {
                  target: this,
                  method: "goToLocation",
                  args: [site.slug],
                },
                eventName: "super-daemon-element-method",
                context: [
                  "*",
                  "HAX/action/goToSite/" + site.metadata.site.name,
                ],
                path: "HAX/action/goToSite/" + site.metadata.site.name,
              });
            }
          });
          return results;
        },
      },
      context: ["*"],
    });
    // contribution helpers
    SuperDaemonInstance.defineOption({
      title: "Join our Community",
      icon: "hax:discord",
      priority: -100,
      tags: ["community", "discord", "chat", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: ["https://bit.ly/hax-discord"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/join",
      context: ["logged-in", "CMS", "HAX", "*"],
    });
    SuperDaemonInstance.defineOption({
      title: "User Tutorials",
      icon: "hax:hax2022",
      priority: -1000,
      tags: ["Documentation", "community", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: ["https://oer.hax.psu.edu/bto108/sites/haxcellence/tutorials"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/tutorials",
      context: ["logged-in", "CMS", "HAX", "*"],
    });
    SuperDaemonInstance.defineOption({
      title: "User Documentation",
      icon: "hax:hax2022",
      tags: ["Documentation", "community", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: [
          "https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation",
        ],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/documentation",
      context: ["logged-in", "CMS", "HAX", "*"],
    });
    SuperDaemonInstance.defineOption({
      title: "HAX Teaching Excellence",
      icon: "hax:hax2022",
      tags: ["Ontology", "community", "pedagogy", "documentation", "help"],
      value: {
        target: this,
        method: "_openExternalLink",
        args: ["https://oer.hax.psu.edu/bto108/sites/haxcellence/ontology"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/pedagogy",
      context: ["logged-in", "CMS", "HAX", "*"],
    });
    SuperDaemonInstance.defineOption({
      title: "Bug / issue",
      icon: "mdi-social:github-circle",
      tags: ["Bug report", "github", "git", "community", "issue queue"],
      value: {
        target: this,
        method: "_haxStoreContribute",
        args: ["bug", "POP,bug"],
      },
      eventName: "super-daemon-element-method",
      path: "HAX/community/contribute",
      context: ["logged-in", "CMS", "HAX", "*"],
    });
    SuperDaemonInstance.defineOption({
      title: "Idea / Feature request",
      icon: "mdi-social:github-circle",
      tags: [
        "Feature request",
        "idea",
        "github",
        "git",
        "community",
        "issue queue",
      ],
      value: {
        target: this,
        method: "_haxStoreContribute",
        args: ["feature", "POP,enhancement"],
      },
      context: ["logged-in", "CMS", "HAX", "*"],
      eventName: "super-daemon-element-method",
      path: "HAX/community/contribute",
    });
    this.windowControllers = new AbortController();
    this.__tour = SimpleTourManager;
    this.__tour.registerNewTour({
      key: "hax",
      name: "HAX top menu",
      style: `
      simple-popover-manager::part(simple-popover) {
        max-width: 250px;
        font-family: sans-serif;
      }
      simple-popover-manager button {
        font-family: sans-serif;
        font-size: 12px;
        margin: 0px 2px;
        color: var(--simple-colors-default-theme-grey-12);
      }
      simple-popover-manager p {
        font-family: sans-serif;
        padding: 0;
        margin: 0;
        width: 250px;
        font-size: 10px;
        line-height: 20px;
      }
      simple-popover-manager h1 {
        font-family: sans-serif;
        margin: 0;
        font-size: 12px;
        width: 250px;
        padding: 0;
      }
      simple-popover-manager::part(simple-popover-body),
      simple-popover-manager::part(simple-popover-heading) {
        color: black;
        background-color: white;
        font-family: sans-serif;
      }
      body.dark-mode simple-popover-manager::part(simple-popover-body),
      body.dark-mode simple-popover-manager::part(simple-popover-heading) {
        color: white;
        background-color: black;
        font-family: sans-serif;
      }
      body.dark-mode simple-popover-manager simple-icon-button-lite {
        color: white;
        background-color: black;
        font-family: sans-serif;
      }
      `,
    });
    this.tourName = "hax";
    // manage title when activeItem changes
    autorun(() => {
      const item = toJS(store.activeItem);
      if (item && item.title) {
        store.setPageTitle(item.title);
      }
    });
    autorun(() => {
      this.siteReady = toJS(store.siteReady);
    });
    autorun(() => {
      const badDevice = toJS(store.badDevice);
      if (badDevice === false) {
        import("@haxtheweb/rpg-character/rpg-character.js");
        import("./lib/random-word/random-word.js");
      } else if (badDevice === true) {
        globalThis.document.body.classList.add("bad-device");
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
        "Everything is cool",
        "When you're part of the team",
        "When you're living our dream",
        "Welcome to the up-side-down",
      ],
      return: [
        "Welcome back, take 2?",
        "That wasn't very long",
        "Stranger thiings have happened",
        "Student driven platform",
        "Faculty centered platform",
        "Instructional designer influenced platform",
        "Free, Open, Community driven",
        "One brick at a time..",
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
              globalThis.location = location.route.slug;
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
      store.darkMode = globalThis.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
    }
    autorun(() => {
      localStorageSet("app-hax-darkMode", toJS(store.darkMode));
      requestAnimationFrame(() => {
        if (toJS(store.darkMode)) {
          globalThis.document.body.classList.add("dark-mode");
          store.toast("I'm ascared of the dark", 2000, { fire: true });
          this.dark = true;
          SuperDaemonInstance.dark = true;
          SuperDaemonInstance.toastInstance.darkMode = true;
        } else {
          globalThis.document.body.classList.remove("dark-mode");
          store.toast("Sunny day it is", 2000, { hat: "random" });
          this.dark = false;
          SuperDaemonInstance.dark = false;
          SuperDaemonInstance.toastInstance.darkMode = false;
        }
      });
    });
    autorun(() => {
      const mode = toJS(store.appMode);
      if (mode) {
        globalThis.document.body.classList.remove("app-hax-search");
        globalThis.document.body.classList.remove("app-hax-create");
        globalThis.document.body.classList.remove("app-hax-404");
        globalThis.document.body.classList.remove("app-hax-home");
        globalThis.document.body.classList.add(`app-hax-${mode}`);
      }
    });
  }

  static get properties() {
    return {
      ...super.properties,
      unlockComingSoon: { type: Boolean },
      unlockTerrible: { type: Boolean },
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
      globalThis.localStorage.removeItem("app-hax-step");
      globalThis.localStorage.removeItem("app-hax-site");
      if (reload) {
        // should always be a base tag for a SPA but just checking
        if (document.querySelector("base")) {
          globalThis.location = globalThis.document.querySelector("base").href;
        } else {
          globalThis.location.reload();
        }
      }
    } catch (e) {
      //console.warn(e);
    }
  }
  fireTerrible() {
    this.unlockTerrible = true;
    store.appEl.playSound("coin").then(() => {
      store.appEl.playSound("coin2").then(() => {
        store.appEl.playSound("success").then(() => {
          SuperDaemonInstance.merlinSpeak(
            "Enjoy these early 2000s table based layouts. May they remind you how never to web, again.",
          );
        });
      });
    });
  }
  fireUnlocked() {
    this.unlockComingSoon = true;
    store.appEl.playSound("coin").then(() => {
      store.appEl.playSound("coin2").then(() => {
        store.appEl.playSound("success").then(() => {
          SuperDaemonInstance.merlinSpeak(
            "Unbelievable! You, (Subject Name), must be the pride of (Subject Hometown). Enjoy all locked features as a boon!",
          );
        });
      });
    });
  }
  // eslint-disable-next-line class-methods-use-this
  logout() {
    globalThis.dispatchEvent(
      new CustomEvent("jwt-login-logout", {
        composed: true,
        bubbles: true,
        cancelable: false,
        detail: true,
      }),
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
      const p = globalThis.document.createElement("app-hax-site-login");
      if (this.querySelector('[slot="externalproviders"]')) {
        const cloneSlot = this.querySelector(
          '[slot="externalproviders"]',
        ).cloneNode(true);
        p.appendChild(cloneSlot);
      }
      import("@haxtheweb/simple-modal/simple-modal.js").then(() => {
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
            }),
          );
        }, 0);
      });
    });
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --app-hax-background-color-active: var(--app-hax-accent-color);
        }
        #home {
          display: inline-flex;
        }
        simple-toolbar-button {
          min-width: 48px;
          margin: 0;
          --simple-toolbar-border-color: #dddddddd;
          height: 48px;
          --simple-toolbar-button-disabled-border-color: transparent;
          --simple-toolbar-button-disabled-opacity: 0.3;
          --simple-toolbar-button-padding: 3px 6px;
          --simple-toolbar-border-radius: 0;
        }
        simple-toolbar-button:hover,
        simple-toolbar-button:active,
        simple-toolbar-button:focus {
          background-color: var(--hax-ui-background-color-accent);
          color: var(--hax-ui-color);
        }
        simple-toolbar-button:hover,
        simple-toolbar-button:active,
        simple-toolbar-button:focus {
          --simple-toolbar-border-color: var(--hax-ui-color-accent);
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
          color: var(--simple-colors-default-theme-grey-12);
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
          padding-top: 20px;
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
        @media (max-width: 640px) {
          simple-tooltip {
            --simple-tooltip-font-size: 10px;
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
        @media (max-width: 640px) {
          random-word {
            display: none;
          }
          .content {
            margin-top: 4px;
          }
          .start-journey {
            padding-top: 0;
          }
          app-hax-site-button {
            --app-hax-site-button-font-size: 12px;
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
      }),
    );
    store.appReady = true;
    autorun(() => {
      if (toJS(store.appReady)) {
        globalThis.document.body.classList.add("app-loaded");
      } else {
        globalThis.document.body.classList.remove("app-loaded");
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
    this.userMenuOpen = false;
  }

  openMerlin() {
    store.appEl.playSound("click");
    SuperDaemonInstance.open();
  }

  render() {
    return html`<app-hax-router></app-hax-router>
      <header>
        <app-hax-top-bar>
          <slot name="app-header-pre" slot="left"></slot>
          <a
            id="home"
            title="${this.t.home}"
            href="home"
            tabindex="-1"
            slot="left"
          >
            <simple-icon-lite
              id="hlogo"
              icon="hax:hax2022"
              tabindex="0"
              class="haxLogo"
              title="${this.t.home}"
              data-simple-tour-stop
              data-stop-title="data-label"
              data-label="${this.t.home}"
            >
              <div data-stop-content slot="tour" style="display:none;">
                You can come back to this home screen whenever you click this!
              </div>
            </simple-icon-lite>
          </a>
          <simple-tooltip for="hlogo" position="right" slot="left"
            >${this.t.home}</simple-tooltip
          >
          <simple-toolbar-button
            icon="hax:wizard-hat"
            label="${this.t.merlin}"
            voice-command="${this.t.merlin}"
            icon-position="left"
            id="merlin"
            @click="${this.openMerlin}"
            slot="center"
            data-event="super-daemon"
            show-text-label
          ></simple-toolbar-button>
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
            data-simple-tour-stop
            data-stop-title="data-label"
            data-label="Sound"
          >
            <span class="wired-button-label">Toggle sound effects</span>
            <simple-icon-lite
              src="${this.soundIcon}"
              loading="lazy"
              decoding="async"
            >
            </simple-icon-lite>
            <div slot="tour" data-stop-content>
              Not a fan of the (awesome) sound effects? You can mute them if you
              prefer.
            </div>
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
            ?is-open="${this.userMenuOpen}"
            data-simple-tour-stop
            data-stop-title="data-label"
            data-label="Menu"
          >
            <div slot="tour" data-stop-content>
              You want to log out and be someone else? Create a new site? Click
              your character. Your character is unique to you!
            </div>
            <button
              @click="${this.toggleMenu}"
              class="topbar-character"
              slot="menuButton"
              id="tbchar"
              title="System menu"
            >
              <rpg-character
                seed="${this.userName}"
                width="68"
                height="68"
                hat="${this.userMenuOpen ? "edit" : "none"}"
              ></rpg-character>
              <span class="characterbtn-name">${this.userName}</span>
            </button>
            <a
              slot="main-menu"
              href="createSite-step-1"
              @click="${this.startJourney}"
              tabindex="-1"
            >
              <app-hax-user-menu-button
                icon="add"
                label="${this.t.newJourney}"
                part="newjourneybtn"
              ></app-hax-user-menu-button>
            </a>
            <a
              slot="main-menu"
              title="${this.t.listMySites}"
              href="home"
              tabindex="-1"
            >
              <app-hax-user-menu-button
                icon="hax:hax2022"
                label="${this.t.listMySites}"
                part="listMySites"
              ></app-hax-user-menu-button>
            </a>
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
                            toJS(store.site.structure),
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
    return html`<div class="start-journey">
        <a
          href="createSite-step-1"
          @click="${this.startJourney}"
          tabindex="-1"
          title="${this.t.startNewJourney}"
        >
          <app-hax-site-button
            label="&gt; ${this.t.startNewJourney}"
          ></app-hax-site-button>
        </a>
      </div>
      <app-hax-search-results></app-hax-search-results>`;
  }

  // eslint-disable-next-line class-methods-use-this
  templateCreate() {
    return html`<app-hax-steps
      @promise-progress-finished="${this.siteReadyToGo}"
      ?unlock-coming-soon="${this.unlockComingSoon}"
      ?unlock-terrible="${this.unlockTerrible}"
    ></app-hax-steps>`;
  }

  siteReadyToGo(e) {
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        setTimeout(() => {
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      },
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
    this.userMenuOpen = false;
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

globalThis.AppHax = globalThis.AppHax || {};

globalThis.AppHax.requestAvailability = () => {
  if (!globalThis.AppHax.instance && globalThis.document) {
    globalThis.AppHax.instance = globalThis.document.querySelector(AppHax.tag);
  }
  return globalThis.AppHax.instance;
};
